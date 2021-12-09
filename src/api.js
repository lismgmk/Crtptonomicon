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