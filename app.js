var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// this is for REST documentation
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');

// this is for websocket
var http = require('http').Server(app);
var io = require('socket.io')(http);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())

// RESTful endpoint
app.post('/api/v1/data', (req, res) => {
    eventData = { data: req.body.message.data }
    io.emit('freshData',  eventData);
    res.json({
        messageId: req.body.message.messageId,
        subscription: req.body.subscription
    })
});

// use port 8080 unless there exists a preconfigured port
var port = process.env.port || 8080;
app.listen(port);

module.exports = app;
