const crypto = require('crypto');
const webSocketServer = require('websocket').server
const http = require('http')

// no callbacks, because it will anyway be overwritten by the socket connection
const httpServer = http.createServer()
httpServer.listen(9090, () => {
    console.log("Server is listening")
})

let clients = {}
const wsServer = new webSocketServer({
    "httpServer": httpServer
})

// -Event listener for WebSocket connection requests
wsServer.on("request", request => {
    //accepting connection
    const connection = request.accept(null, request.origin)

    //open and close event
    connection.on("open", () => console.log('Opened!'))
    connection.on("close", (event) => console.log('Closed! ', event))

    // incoming message event
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)
        console.log(result)
    })

    const clientId = crypto.randomUUID()
    clients[clientId] = {
        "connection": connection
    }

    const payload = {
        "method": "connect",
        "clientId": clientId
    }

    // sending back to the client
    connection.send(JSON.stringify(payload))
})
