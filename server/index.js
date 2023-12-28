const crypto = require('crypto');
const webSocketServer = require('websocket').server
const http = require('http')

// no callbacks, because it will anyway be overwritten by the socket connection
const httpServer = http.createServer()
httpServer.listen(9090, () => {
    console.log("Server is listening")
})

let clients = {}
let games = {}

const wsServer = new webSocketServer({
    "httpServer": httpServer
})

// -Event listener for WebSocket connection requests
wsServer.on("request", request => {
    //-accepting connection
    const connection = request.accept(null, request.origin)

    //open and close event
    connection.on("open", () => console.log('Opened!'))
    connection.on("close", (event) => console.log('Closed! ', event))

    // incoming message events
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data)

        //method for creating a game
        if (result.method === "create") {
            const clientId = result.clientId
            const gameId = crypto.randomUUID()
            games[gameId] = {
                "gameId": gameId,
                "gridCells": 9,
                "clients": []
            }

            games[gameId].clients.push({
                "clientId": clientId,
                "mark": "X"
            })

            const payload = {
                "method": "create",
                "game": games[gameId]
            }
            console.log('game is created')
            const con = clients[clientId].connection
            con.send(JSON.stringify(payload))
        }

        //method for joining a game
        if (result.method === "join") {
            const { clientId, gameId } = result
            const game = games[gameId]

            const clientLength = game.clients.length
            if(clientLength > 2) {
                console.log("max player reached")
                return
            }
            // const mark = {"0": "X", "1": "O"}[clientLength]
            game.clients.push({
                "clientId": clientId,
                "mark": "O"
            })


            const payload = {
                "method": "join",
                game: game
            }

            //sending all the clients a payload
            game.clients.forEach(obj => {
                clients[obj.clientId].connection.send(JSON.stringify(payload))
            });
        }
    })

    const clientId = crypto.randomUUID()
    //-binding the clientId with the socket connection in the clients object
    clients[clientId] = {
        "connection": connection
    }
    const payload = {
        "method": "connect",
        "clientId": clientId
    }
    // -first payload to the client
    connection.send(JSON.stringify(payload))
})
