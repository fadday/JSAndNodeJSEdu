var http = require('http');

function onRequest(request, response)
{
    if (request.url == '/ajax'){
        response.writeHead(200, {'Content-Type' : 'text/plain'});
        response.write('Hello ajax');
        response.end();
    }
    else {
        response.writeHead(200, {'Content-Type' : 'text/plain'});
        response.write('Hello World');
        response.end();
    }
}

http.createServer(onRequest).listen(8888);