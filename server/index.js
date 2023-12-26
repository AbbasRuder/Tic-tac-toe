const http = require('http')

const server = http.createServer((req,res) => {
    if(req.url === '/') {
        res.end('Hello there!!')
    }
})


server.listen(4000, () => {
    console.log("Server is listening")
})