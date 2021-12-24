const bc = new BroadcastChannel('shared_worker')
const API_KEY = 'd52aa675ecbb2b0e1541ef3f89f1efbe2ab21a3bd943ef86e6041794d25b9841'
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

let currentIdCurrency = new Map()
let connect = 0

self.onconnect = e => {

    const port = e.ports[0]
    connect++
    currentIdCurrency.set(connect, [])
    port.start()

    port.onmessage = (e) => {
        const [statusSubscribe, currency] = e.data

        if (statusSubscribe === 'subscribe') {
            currentIdCurrency.get(connect).push(currency)
            // bc.postMessage(['newCurrencyList', currentIdCurrency.get(connect)])
            currentIdCurrency.get(connect).forEach(i => {
                    subscriberCurrecyesWC(i, 'USD')
                }
            )
        }
        if (statusSubscribe === 'unsubscribe') {
            currentIdCurrency.get(connect).filter(i => i !== currency)
            unSubscriberCurrecyesWC(currency, 'USD')
        }


    }
}
let newType = ''

socket.onmessage = function (event) {
    const response = JSON.parse(event.data)
    const {TYPE: type, PRICE: newPrice, FROMSYMBOL: newCurrency, TOSYMBOL: symbol} = response

    console.log(newCurrency, newPrice)



    if (response.TYPE === '5') {
        if (symbol === 'USD') {
            newType = 'correct'
            bc.postMessage([newCurrency, newPrice, type, newType])

            if(newCurrency === 'BTC'){
                newType = 'convertCurBTC'
                bc.postMessage([newCurrency, newPrice, type, newType])
            }
        }
        if (symbol === 'BTC') {
            if (newCurrency !== 'BTC') {
                newType = 'convertCur'
                bc.postMessage([newCurrency, newPrice, type, newType])
            }
        }
    }

    if (response.MESSAGE === 'INVALID_SUB') {
        const {TYPE: type, PARAMETER: param} = response

        const curFromInvalidResp = param.split('~')[2]
        const responseCurChang = param.split('~')[3]

        if (responseCurChang === 'BTC') {
            bc.postMessage([curFromInvalidResp, 'invalid', type])
        }
        if (responseCurChang === 'USD') {
            subscriberCurrecyesWC('BTC', 'USD')
            subscriberCurrecyesWC(curFromInvalidResp, 'BTC')
        }
    }
}


const subscriberCurrecyesWC = (currebcyValue, curChange) => {
    helperSubcriberWebSocket(JSON.stringify({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${currebcyValue}~${curChange}`]
    }))
}

const unSubscriberCurrecyesWC = (currebcyValue, curChange) => {
    helperSubcriberWebSocket(JSON.stringify({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${currebcyValue}~${curChange}`]
    }))
}

const helperSubcriberWebSocket = (message) => {
    if (WebSocket.OPEN === socket.readyState) {
        socket.send(message);
        return
    }
    socket.addEventListener('open', () => {
        socket.send(message)
    }, {once: true})

}

