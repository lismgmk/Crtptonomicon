const API_KEY = 'd52aa675ecbb2b0e1541ef3f89f1efbe2ab21a3bd943ef86e6041794d25b9841'

const objCurrencyes = new Map()

const bc = new BroadcastChannel('gator_channel')
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);
const myWorker = new SharedWorker("worker.js");

const obj = {
    prices: 0,
    cur: 0
}

bc.onmessage = (messageEvent) => {
    if (messageEvent.data === 'update_title') {
        // setTitle(localStorage.getItem('title'));
        // socket.close()
        const handlerCurrencyFunc = objCurrencyes.get(obj.cur) ?? []
        handlerCurrencyFunc.forEach(fn => fn(obj.prices))

    }
}

myWorker.port.addEventListener("message", function(e) {
    alert(e.data);
}, false);

myWorker.port.start();

const RESPONSE_PARAM = '5'
const RESPONSE_ERROR_PARAM = '429'

socket.addEventListener('message', function (event) {
    const {TYPE: type, PRICE: newPrice, FROMSYMBOL: newCurrency} = JSON.parse(event.data)
    if(type === RESPONSE_ERROR_PARAM){
        bc.postMessage({ type: "WSState", state: socket.readyState });
       obj.prices = newPrice
        obj.cur = newCurrency
        console.log(obj)

    }
    if (type !== RESPONSE_PARAM || newPrice === undefined) {
        return
    }
    const handlerCurrencyFunc = objCurrencyes.get(newCurrency) ?? []
    handlerCurrencyFunc.forEach(fn => fn(newPrice))
bc.postMessage(obj)
});


// export const loadCurrency = () => {
//     if (objCurrencyes.size === 0) {
//         return
//     }
//
//     fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...objCurrencyes.keys()]}&tsyms=USD&api_key=${API_KEY}`)
//         .then((r) => {
//             return (r.json())
//         })
//         .then((currencyData) => {
//             const currencyNewData =
//                 Object.fromEntries(
//                     Object.entries(currencyData).map(([key, value]) => {
//                         return [key, value.USD]
//                     }))
//
//             Object.entries(currencyNewData).forEach(([keys, value]) => {
//                 const handlerCurrencyFunc = objCurrencyes.get(keys) ?? []
//                 handlerCurrencyFunc.forEach(fn => fn(value))
//             })
//
//         })
//
// }

const helperSubcriberWebSocket = (message) => {
    if (WebSocket.OPEN === socket.readyState) {
        socket.send(message);
        return
    }
    socket.addEventListener('open', () => {
        socket.send(message)
    }, {once: true})

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


export const subscriberCurrecyes = (currency, cb) => {
    const currencyesSubscriber = objCurrencyes.get(currency) || []
    objCurrencyes.set(currency, [...currencyesSubscriber, cb])
    subscriberCurrecyesWC(currency)

}


export const unSubscriberCurrecyes = (currency) => {
    objCurrencyes.delete(currency)
    unSubscriberCurrecyesWC(currency)
}

