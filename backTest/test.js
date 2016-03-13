var tape = require('tape');
var shot = require('shot');
var server = require('../back/server.js');

tape('checking tape', function(t){
    t.equal(1+1, 2, 'tape works');
    t.end();
});

tape('checking file linking', function(t){
    t.equal(server.x(4), 5, 'file linking works');
    t.end();
});

tape('Does server respond successfully?', function(t) {
    shot.inject(server.handler, {method: 'GET', url: '/'}, function(res) {
        t.equal(res.statusCode, 200, 'Server responds!');
        t.end();
    });
});

tape('Does the server return the index.html page', function(t){
    shot.inject(server.handler, {method: 'GET', url: '/'}, function(res){
        t.equal();
        t.end();
    });
});

tape('teardown', function(t){
    server.server.close();
    t.end();
});
