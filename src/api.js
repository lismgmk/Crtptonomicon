const API_KEY = 'd52aa675ecbb2b0e1541ef3f89f1efbe2ab21a3bd943ef86e6041794d25b9841'

export const loadCurrency = (name) => {

   return (
       fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${name.join(',')}&tsyms=USD&api_key=${API_KEY}`)
           .then((r) => {
               return (r.json())
           })
           .then((currencyData) => {
             return   Object.fromEntries(
                   Object.entries(currencyData).map(([key, value]) => [key, 1/value.USD]))
           })
   )

}
 const objCurrencyes = new Map()

export const subscriberCurrecyes = (currency, cb) => {
    const currencyesSubscriber = objCurrencyes.get(currency) || []
    objCurrencyes.set(currency, [...currencyesSubscriber, cb])
    console.log(objCurrencyes)
}
export const unSubscriberCurrecyes = (currency, cb) => {
    const currencyesSubscriber = objCurrencyes.get(currency) || []

    objCurrencyes.set(
        currency,
        currencyesSubscriber.filter(c=> c !== cb)
        )
}