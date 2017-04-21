var express = require('express');
const app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 1337;
server.listen(port, function() { //NOTE we start only with the database
    console.log('Server listening at port %d', port);
});
app.use(express.static(__dirname + '/game'));