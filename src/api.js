const API_KEY = 'd52aa675ecbb2b0e1541ef3f89f1efbe2ab21a3bd943ef86e6041794d25b9841'

const objCurrencyes = new Map()


export const loadCurrency = () => {
    if(objCurrencyes.size === 0){return }

        fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...objCurrencyes.keys()]}&tsyms=USD&api_key=${API_KEY}`)
            .then((r) => {
                return (r.json())
            })
            .then((currencyData) => {
                const currencyNewData =
                    Object.fromEntries(
                    Object.entries(currencyData).map(([key, value]) =>{
                      return [key, value.USD]
                    } ))

                Object.entries(currencyNewData).forEach(([keys, value]) => {
                    const handlerCurrencyFunc = objCurrencyes.get(keys) ?? []
                    handlerCurrencyFunc.forEach(fn => fn(value))
                })

            })

}

export const subscriberCurrecyes = (currency, cb) => {
    const currencyesSubscriber = objCurrencyes.get(currency) || []
    objCurrencyes.set(currency, [...currencyesSubscriber, cb])
}
export const unSubscriberCurrecyes = (currency) => {
    objCurrencyes.delete(currency)
}

setInterval(loadCurrency , 50000)