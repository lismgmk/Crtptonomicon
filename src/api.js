const objCurrencyes = new Map()
const myWorker = new SharedWorker("worker.js")

const bc = new BroadcastChannel('shared_worker')

myWorker.port.start()

let convertCurBTCPrice = 0
let convertCur = ''
let convertCurPrice = 0


bc.onmessage = (msg) => {

    let [newCurrency, newPrice, type, newType] = msg.data




    if (type === '5' && newPrice !== undefined) {

        if (newType === 'convertCurBTC') {
            convertCurBTCPrice = newPrice
        }
        if (newType === 'convertCur') {
            convertCur = newCurrency
            convertCurPrice = newPrice
        }

        if (newType === 'correct' || convertCurBTCPrice !== 0 && convertCur !== '' && convertCurPrice !== 0) {
            if(convertCurBTCPrice !== 0 && convertCur !== '' && convertCurPrice !== 0){
                newCurrency = convertCur
                newPrice = convertCurBTCPrice * convertCurPrice
                runFulfil(newCurrency, newPrice)
                convertCurBTCPrice = 0
                // convertCur = ''
                // convertCurPrice = 0
            }

            runFulfil(newCurrency, newPrice)
        }
    }
    if (type === '500') {
        const handlers = objCurrencyes.get(newCurrency) ?? [];
        handlers.forEach((fn) => fn(newPrice));
    }
}

const runFulfil = (newCurrency, newPrice) => {
    const handlers = objCurrencyes.get(newCurrency) ?? [];
    handlers.forEach((fn) => fn(newPrice));
}

export const subscriberCurrecyes = (currency, cb) => {
    const currencyesSubscriber = objCurrencyes.get(currency) || []
    objCurrencyes.set(currency, [...currencyesSubscriber, cb])
    myWorker.port.postMessage(['subscribe', currency])
}

export const unSubscriberCurrecyes = (currency) => {
    objCurrencyes.delete(currency)
    myWorker.port.postMessage(['unsubscribe', currency])
}

