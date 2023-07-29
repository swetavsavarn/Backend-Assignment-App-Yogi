const express = require('express')
const http = require('http');
const socketIO = require('socket.io');
const mongoConnectionInitializer = require('./util/dbConnection.js')
const logger = require('./util/logger')
const routes = require('./Router/routes.js')
const handleSocketConnection = require('./util/socketHandler.js')
const Sys = require('./util/cacheInitializer')

const app = express()
const server = http.createServer(app);
const io = socketIO(server);
app.use(express.json())
app.use(routes)


const port = process.env.PORT || 6060;

mongoConnectionInitializer().then(() => {
    server.listen(port, () => {
        logger.info(`Server started on port ${port}`);
    });
    handleSocketConnection(io);
    Sys.Socket = io
}).catch((err) => {
    logger.error(`Error from db connection and server start ${err}`);
});