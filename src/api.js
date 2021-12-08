const API_KEY = 'd52aa675ecbb2b0e1541ef3f89f1efbe2ab21a3bd943ef86e6041794d25b9841'

export const loadCurrency = (name) => {

   return (
       fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${name.join(',')}&api_key=${API_KEY}`)
           .then((r) => {
               return (r.json())
           })
           .then((currencyData) => {
               let currensyArr = []
               for (let key in currencyData) {
                   let price = 1 / currencyData[key]
                   currensyArr.push({name: key, price: price})
               }
               return currensyArr
           })
   )


}