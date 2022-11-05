import http from "http";
import express from "express";
import logger from "morgan";
import cors from "cors";
import socketio from "socket.io";
require('dotenv').config();
// mongo connection
import "./config/mongo.js";
// socket configuration
import WebSockets from "./shared/utils/WebSockets.js";
// routes
import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import conversationRouter from "./routes/conversations.js";
import messageRouter from "./routes/messages.js";
// import chatRoomRouter from "./routes/chatRoom.js";
// import deleteRouter from "./routes/delete.js";
// // middlewares
import { decode } from './middleware/jwt'

const app = express();

app.use(cors())
    /** Get port from environment and store in Express. */
const port = process.env.PORT || "8080";
app.set("port", port);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api",
    indexRouter,
    userRouter,
    conversationRouter,
    messageRouter
);
// app.use("/users", userRouter);
// app.use("/room", decode, chatRoomRouter);
// app.use("/delete", deleteRouter);

/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
    return res.status(404).json({
        success: false,
        message: 'API endpoint doesnt exist'
    })
});

/** catch 500 */
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

var server = require('http').createServer(app);
var io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});
io.on('connection', WebSockets.connection)
server.listen(process.env.PORT || 3000);

/** Create HTTP server. */
// const server = http.createServer(app);
// /** Create socket connection */
// global.io = socketio.listen(server);
// global.io.on('connection', WebSockets.connection)
/** Listen on provided port, on all network interfaces. */
//server.listen(port);
/** Event listener for HTTP server "listening" event. */
server.on("listening", () => {
    console.log(`Listening on port:: http://localhost:${port}/`)
});