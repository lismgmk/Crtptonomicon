const bc = new BroadcastChannel('shared_worker')
const RESPONSE_PARAM = '5'
// const connects = Map()
const API_KEY = 'd52aa675ecbb2b0e1541ef3f89f1efbe2ab21a3bd943ef86e6041794d25b9841'
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);
// let maxId = 0

self.onconnect = e => {

    const port = e.ports[0];
    // const id = maxId++;
    // connects.set(id, []);
    port.start();

    port.onmessage = (e)=> {
        console.log(e)
    }
    //     port.onmessage = ({data: [type, ticker]}) => {
    //     switch (type) {
    //         case 'subscribe':
    //             connects.get(id).push(ticker);
    //             subscriberCurrecyesWC(ticker);
    //             break;
    //         case 'unsubscribe':
    //
    //             connects.set(
    //                 id,
    //                 connects.get(id).filter((t) => t !== ticker),
    //             );
    //             // eslint-disable-next-line no-case-declarations
    //             let isLast = true;
    //             connects.forEach((item) => {
    //                 if (item.includes(ticker)) {
    //                     isLast = false;
    //                 }
    //             });
    //             if (isLast) {
    //                 unSubscriberCurrecyesWC(ticker)
    //             }
    //             break;
    //     }
    // }
}

bc.onmessage = (msg) => {
    console.log(msg)
    // const [newCurrency, newPrice] = msg.data
    // if (objCurrencyes.has(newCurrency)) {
    //     const handlers = objCurrencyes.get(newCurrency) ?? [];
    //     handlers.forEach((fn) => fn(newPrice));
    // }
}



socket.addEventListener('message', function (event) {
    console.log(event)
    const {TYPE: type, PRICE: newPrice, FROMSYMBOL: newCurrency} = JSON.parse(event.data)
    if (type !== RESPONSE_PARAM || newPrice === undefined) {
        return
    }
    bc.postMessage([newCurrency, newPrice])
});

//
// const subscriberCurrecyesWC = (currebcyValue) => {
//     helperSubcriberWebSocket(JSON.stringify({
//         "action": "SubAdd",
//         "subs": [`5~CCCAGG~${currebcyValue}~USD`]
//     }))
// }

// const unSubscriberCurrecyesWC = (currebcyValue) => {
//     helperSubcriberWebSocket(JSON.stringify({
//         "action": "SubRemove",
//         "subs": [`5~CCCAGG~${currebcyValue}~USD`]
//     }))
// }

// const helperSubcriberWebSocket = (message) => {
//     if (WebSocket.OPEN === socket.readyState) {
//         socket.send(message);
//         return
//     }
//     socket.addEventListener('open', () => {
//         socket.send(message)
//     }, {once: true})
//
// }
//
