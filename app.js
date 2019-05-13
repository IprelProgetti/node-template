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


// https://www.robinwieruch.de/node-express-server-rest-api/
// https://blog.cloudboost.io/adding-swagger-to-existing-node-js-project-92a6624b855b
// https://raw.githubusercontent.com/GenFirst/swagger-to-existing-nodejs-project/master/backend/swagger.json
// https://stackoverflow.com/questions/11625519/how-to-access-the-request-body-when-posting-using-node-js-and-express
// https://yeoman.io/generators/
