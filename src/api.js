const objCurrencyes = new Map()

const myWorker = new SharedWorker("worker.js")

const bc = new BroadcastChannel('shared_worker')

myWorker.port.start()

bc.onmessage = (msg) => {
    const [newCurrency, newPrice, type] = msg.data
    if (type === '5' && newPrice !== undefined) {
        const handlers = objCurrencyes.get(newCurrency) ?? [];
        handlers.forEach((fn) => fn(newPrice));

    }

}

export const subscriberCurrecyes = (currency, cb) => {
    console.log(currency)
    const currencyesSubscriber = objCurrencyes.get(currency) || []
    objCurrencyes.set(currency, [...currencyesSubscriber, cb])
    myWorker.port.postMessage(['subscribe', currency])
}

export const unSubscriberCurrecyes = (currency) => {
    objCurrencyes.delete(currency)
    myWorker.port.postMessage(['unsubscribe', currency])
}

