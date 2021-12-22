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
            unSubscriberCurrecyesWC(currency, 'XRP')
            // Object.entries(currentIdCurrency).forEach((i) => {
            //     console.log(i)
            // })
        }


    }
}

socket.onmessage = function (event) {
    const response = JSON.parse(event.data)
    const {TYPE: type, PRICE: newPrice, FROMSYMBOL: newCurrency, TOSYMBOL: symbol} = response
//fix there
    let currentValueCurrensy
    let currentValuePriceCurrensy
    console.log(currentValueCurrensy, currentValuePriceCurrensy)
    let flag = false
    console.log(flag, 'first')
    if(flag === true){
        console.log(currentValueCurrensy,'second')

        bc.postMessage([currentValueCurrensy, currentValuePriceCurrensy * newPrice, type])
        flag = false
        currentValueCurrensy = ''
    }
if(flag === false){
    if(response.TYPE === '5'){

        if(symbol === 'USD'){
            bc.postMessage([newCurrency, newPrice, type])
        }
        if(symbol === 'BTC'){
            subscriberCurrecyesWC('BTC', 'USD')
            flag = true
            currentValuePriceCurrensy = newPrice
            currentValueCurrensy = newCurrency
            console.log(currentValueCurrensy, 'first')
            console.log(flag,'second')
        }

    }
}


    if(response.MESSAGE === 'INVALID_SUB'){
        const {TYPE: type, MESSAGE: message, PARAMETER: param} = response
        console.log(type, message, param)
        const newCurrency = param.split('~')[2]
        const responseCurChang = param.split('~')[3]
        if(responseCurChang === 'BTC'){
            bc.postMessage([newCurrency, 'invalid', type])
        }
        if(responseCurChang === 'USD'){
            subscriberCurrecyesWC(newCurrency, 'BTC')
        }
    }
    // const {TYPE: type, PRICE: newPrice, FROMSYMBOL: newCurrency, MESSAGE: message} = JSON.parse(event.data)
    // if(message === 'INVALID-SUB'){
    //     bc.postMessage([newCurrency, 'invalid', type])
    // }
    // SUBSCRIPTION_UNRECOGNIZED

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

