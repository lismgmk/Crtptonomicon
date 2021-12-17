
const objCurrencyes = new Map()

const myWorker = new SharedWorker("worker.js")

const bc = new BroadcastChannel('shared_worker')

console.log('api')
bc.postMessage(`888888`)
myWorker.port.start()

bc.onmessage = (msg) => {
    console.log(`Get finish data from port ${msg.data}`)
}


// myWorker.port.postMessage('00000')

myWorker.port.addEventListener('message', (msg) => {
        console.log(msg.data)
        // bc.postMessage(`to Vue from port with bc  ${msg.data}`)
    }
)

// bc.onmessage = (msg) => {
//     console.log(msg)
//     // const [newCurrency, newPrice] = msg.data
//     // if (objCurrencyes.has(newCurrency)) {
//     //     const handlers = objCurrencyes.get(newCurrency) ?? [];
//     //     handlers.forEach((fn) => fn(newPrice));
//     // }
// }

// socket.addEventListener('message', function (event) {
//     const {TYPE: type, PRICE: newPrice, FROMSYMBOL: newCurrency} = JSON.parse(event.data)
//     if(type === RESPONSE_ERROR_PARAM){
//         bc.postMessage({ type: "WSState", state: socket.readyState });
//        obj.prices = newPrice
//         obj.cur = newCurrency
//         console.log(obj)
//
//     }
//     if (type !== RESPONSE_PARAM || newPrice === undefined) {
//         return
//     }
//     const handlerCurrencyFunc = objCurrencyes.get(newCurrency) ?? []
//     handlerCurrencyFunc.forEach(fn => fn(newPrice))
// bc.postMessage(obj)
// });



export const subscriberCurrecyes = (currency, cb) => {
    const currencyesSubscriber = objCurrencyes.get(currency) || []
    objCurrencyes.set(currency, [...currencyesSubscriber, cb])

    // myWorker.port.postMessage(['subscribe', currency])
    // myWorker.port.postMessage('12345')


}

export const unSubscriberCurrecyes = (currency) => {
    objCurrencyes.delete(currency)
    // myWorker.port.postMessage(['unsubscribe', currency])
}

