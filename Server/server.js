var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var shapeArrayJSON = '';
var allClientShapes = [];
var nextShapeId = 1;

var debug = false;

app.set('view engine', 'ejs');
app.set('views', 'C:\\Users\\Администратор\\Documents\\JavaScript\\NodeJS\\Education\\JSAndNodeJSEdu\\Shapes\\');
app.engine('html', require('ejs').renderFile);

app.get('/', function(request, response){
    response.render('index.html', {layout: true});
});

app.get('/ajax', function(request, response){
    response.send(shapeArrayJSON);

    if (debug)
        console.log(request.query);
});

function replaceIfContainedElseAdd(shapesArray, testedShape){
    var shape = testedShape;
    var contained = false;
    var shapeIndex;

    shapesArray.forEach(function(item, index, array){
        if (item.id == shape.id){
            contained = true;
            shapeIndex = index;
        }
    });

    if (contained) {
        allClientShapes[shapeIndex] = shape;
    }else{
        allClientShapes.push(shape);
    }
}

function fromJSONToArray(jsonString){
    var arr = JSON.parse(jsonString);

    arr.forEach(function(item, index, array){
        replaceIfContainedElseAdd(allClientShapes, item);
    });

}

app.post('/ajax', function(request, response){
    
    var recivedData = '';
    
    request.on('data', function(data){
        recivedData += data;
    });
    
    request.on('end', function(){
        shapeArrayJSON = recivedData;

        if (debug)
            console.log(recivedData);

        fromJSONToArray(shapeArrayJSON);

        if (debug) {
            console.log("begin");
            console.log(JSON.stringify(allClientShapes));
            console.log("end");
        }

        io.emit('canvasChange', JSON.stringify(allClientShapes));
    });
    
    response.send('OK');
});

app.get('/shapes.js', function(request, response){
    response.sendfile('Shapes/shapes.js');
});

io.on('connection', function(socket){
    console.log('Users connected: ' + io.sockets.sockets.length);

    socket.on('getNextShapeId', function(){
        console.log('Shape id: ' + nextShapeId);
        socket.emit('getNextShapeId', nextShapeId);
        nextShapeId++;
    });
});

http.listen(8888);