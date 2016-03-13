var http = require('http');

var port = process.env.PORT || 8080;

function x(k){
    return 5;
}

function handler(req, res){
    var url = req.url;
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end();
}

var server = http.createServer(handler);

module.exports = {
    x: x,
    handler: handler,
    server: server
};

server.listen(port);
