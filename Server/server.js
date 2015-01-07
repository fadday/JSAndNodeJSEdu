var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var shapeArrayJSON = '';

app.set('view engine', 'ejs');
app.set('views', 'C:\\Users\\Администратор\\Documents\\JavaScript\\NodeJS\\Education\\JSAndNodeJSEdu\\Shapes\\');
app.engine('html', require('ejs').renderFile);

app.get('/', function(request, response){
    response.render('index.html', {layout: true});
});

app.get('/ajax', function(request, response){
    response.send(shapeArrayJSON);
    
    console.log(request.query);
})

app.post('/ajax', function(request, response){
    
    var recivedData = '';
    
    request.on('data', function(data){
        recivedData += data;
    });
    
    request.on('end', function(){
        shapeArrayJSON = recivedData;
        console.log(recivedData);
        
        io.emit('canvasChange', recivedData);
    });
    
    response.send('OK');
});

app.get('/shapes.js', function(request, response){
    response.sendfile('Shapes/shapes.js');
});

io.on('connection', function(socket){
    console.log('User connected: ' + io.sockets.sockets.length);
});

http.listen(8888);