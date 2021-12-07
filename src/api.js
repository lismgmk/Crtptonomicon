const _APIKEY = 'd52aa675ecbb2b0e1541ef3f89f1efbe2ab21a3bd943ef86e6041794d25b9841'

export const loadCurrency = (name) => {

    fetch(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${name.join()}&api_key=${_APIKEY}`)
        .then((r) => {
           return  r.json()
        })
        .then((currencyData) => {
            console.log(currencyData)
            currencyData.map(cur => {
                if (cur.name === name) {
                    return cur.price = currencyData.USD < 1 ? currencyData.USD.toPrecision(2) : currencyData.USD.toFixed(2)
                } else {
                    return cur
                }
            })

            if (this.sel?.name === name) {
                this.graph.push(currencyData.USD)
            }
        })


}