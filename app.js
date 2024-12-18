/*
 * Module dependencies
 */
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require("socket.io");

/*
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });

/*
 * Create Express server.
 */
const app = express();

/*
 * Express configuration.
 */
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/img'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

/*
 * Controllers (route handlers).
 */
const scriptController = require('./controllers/script');
// const openaiController = require('./controllers/openai-gpt3')

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
});

/*
 * Primary app routes.
 * (In alphabetical order)
 */
app.get('/', scriptController.getScenarios);
app.get('/chat', scriptController.getChat);
app.get('/:scenario', (req, res) => {
    res.render('home', {
        isCoPilot: req.query.copilot,
        hasFooter: req.query.footer
    });
});
app.get('/:scenario/:sessionID', scriptController.getScript);

app.post('/feed', scriptController.postfeedAction);
app.post('/chat', scriptController.postchatAction);
// app.post('/gpt3', openaiController.getResponses);

io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        console.log(msg);
        // io.emit('chat message', msg); // emit to all listening sockets
        socket.broadcast.emit('chat message', msg); // emit to all listening socketes but the one sending
    });

    socket.on('chat typing', msg => {
        console.log(msg);
        socket.broadcast.emit('chat typing', msg); // emit to all listening socketes but the one sending
    });

    socket.on('post activity', msg => {
        console.log(msg);
        io.emit('post activity', msg); // emit to all listening socketes
    });

    // Not used
    // socket.on('post comment', msg => {
    // console.log(msg);
    // io.emit('post comment', msg); // emit to all listening sockets
    //     socket.broadcast.emit('post comment', msg); // emit to all listening socketes but the one sending
    // });

    socket.on('error', function(err) {
        console.log(err);
    });
});

/*
 * Start Express server.
 */
server.listen(port, () => {
    console.log(`App is running on http://localhost:${port}.`);
    console.log('  Press CTRL-C to stop\n');
});

module.exports = server;