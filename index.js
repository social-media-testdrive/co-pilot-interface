/*
 * Module dependencies
 */

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var Filter = require('bad-words'); // TBD, about whether or not to use.

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

/*
 * Controllers (route handlers).
 */
const scriptController = require('./controllers/script');
const openaiController = require('./controllers/openai-gpt3')

/**
 * Connect to MongoDB.
 */
//  mongoose.set('useFindAndModify', false);
//  mongoose.set('useCreateIndex', true);
//  mongoose.set('useNewUrlParser', true);
//  mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

function isProfane(text) {
    const filter = new Filter();
    return (filter.isProfane(text));
}

/*
 * Primary app routes.
 * (In alphabetical order)
 */
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/:sessionID', scriptController.getScript);

app.post('/feed', scriptController.postComment);
app.post('/gpt3', openaiController.getResponses);


io.on('connection', (socket) => {
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });

    socket.on('post comment', msg => {
        // console.log(msg);
        msg["isProfane"] = isProfane(msg["text"]);
        // io.emit('post comment', msg); // emit to all listening sockets
        socket.broadcast.emit('post comment', msg); // emit to all listening socketes but the one sending
    });

    socket.on('error', function(err) {
        console.log(err);
    });
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});