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
            bc.postMessage(['newCurrencyList', currentIdCurrency.get(connect)])
            currentIdCurrency.get(connect).forEach(i => {
                    subscriberCurrecyesWC(i)
                }
            )
        }
        if (statusSubscribe === 'unsubscribe') {
            currentIdCurrency.get(connect).filter(i => i !== currency)
            unSubscriberCurrecyesWC(currency)
            // Object.entries(currentIdCurrency).forEach((i) => {
            //     console.log(i)
            // })
        }


    }
}

socket.onmessage = function (event) {
    const {TYPE: type, PRICE: newPrice, FROMSYMBOL: newCurrency} = JSON.parse(event.data)
    console.log(newCurrency, newPrice, type)
    bc.postMessage([newCurrency, newPrice, type])
}


const subscriberCurrecyesWC = (currebcyValue) => {
    helperSubcriberWebSocket(JSON.stringify({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${currebcyValue}~USD`]
    }))
}

const unSubscriberCurrecyesWC = (currebcyValue) => {
    helperSubcriberWebSocket(JSON.stringify({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${currebcyValue}~USD`]
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

