function Point(x, y)
{
    this.x = x;
    this.y = y;
}

//******************************************************

function Shape(){
    this.clickPoint = new Point(-1, -1);
    this.type = this.constructor.name;
    this.userId = undefined;
}

Shape.prototype.getType = function(){ 
    return 'shape';
}

Shape.prototype.initFields = function(coord, userId, clickPoint){
    this.coord = coord;
    this.userId = userId;
}

Shape.prototype.getCoord = function(){
    return undefined;
}

Shape.prototype.setCoord = function(coord){
    this.coord = coord;
}

Shape.prototype.getId = function(){
    return this.id;
}

Shape.prototype.setId = function(id){
    this.id = id;
}

Shape.prototype.draw = function(){
    return undefined;
}

Shape.prototype.hit = function(point){
    return undefined;
}

Shape.prototype.moveTo = function(point, clickPoint){
    for (var i = 0; i < this.coord.length; i++) {
        this.coord[i].x += point.x - clickPoint.x;
        this.coord[i].y += point.y - clickPoint.y;
    }

    clickPoint.x = point.x;
    clickPoint.y = point.y;
};
//*****************************************************

function Triangle(id){
    
    this.id = id;
    this.type = 'Triangle';
    this.coord = new Array(3);
    
    this.setCoord(new Point(0,0), new Point(0,100), new Point(100,0));
}

Triangle.prototype = new Shape();

Triangle.prototype.setCoord = function (a, b, c) {
    this.coord[0] = a;
    this.coord[1] = b;
    this.coord[2] = c;
}

Triangle.prototype.getCoord = function(){
    return this.coord;
}

Triangle.prototype.draw = function(context){
    
    context.beginPath();
    
    context.moveTo(this.coord[0].x, this.coord[0].y);
    context.lineTo(this.coord[1].x, this.coord[1].y);
    context.lineTo(this.coord[2].x, this.coord[2].y);
    
    context.fill();
}

Triangle.prototype.getType = function(){
    return 'Triangle';
}

Triangle.prototype.hit = function(point){
    
    var a = this.coord[0];
    var b = this.coord[1];
    var c = this.coord[2];
    
    var testA = (a.x - point.x) * (b.y - a.y) - (b.x - a.x) * (a.y - point.y);
    var testB = (b.x - point.x) * (c.y - b.y) - (c.x - b.x) * (b.y - point.y);
    var testC = (c.x - point.x) * (a.y - c.y) - (a.x - c.x) * (c.y - point.y);
    
    return ((testA >= 0 && testB >= 0 && testC >= 0) || (testA <= 0 && testB <= 0 && testC <= 0))
}

//*******************************************************

function Rectangle(id){
    
    this.id = id;
    this.type = 'Rectangle';
    this.coord = new Array(2);
    
    this.setCoord(new Point(100, 100), new Point(200, 200));
    
}

Rectangle.prototype = new Shape();

Rectangle.prototype.getCoord = function(){
    return this.coord;
}

Rectangle.prototype.setCoord = function(a, b){
    this.coord[0] = a;
    this.coord[1] = b;
}

Rectangle.prototype.draw = function(context){
    var width = Math.abs(this.coord[1].x - this.coord[0].x);
    var height = Math.abs(this.coord[1].y - this.coord[0].y);
    
    context.fillRect(this.coord[0].x, this.coord[0].y, width, height);
}

Rectangle.prototype.getType = function(){
    return 'Rectangle';
}

Rectangle.prototype.hit = function(point){
    var a = this.coord[0];
    var b = this.coord[1];
    
    return ((point.x >= a.x && point.x <= b.x) && (point.y >= a.y && point.y <= b.y))
}

//*********************************************************

function Circle(id){
    
    this.id = id;
    this.type = 'Circle';
    this.coord = new Array(2);
    
    this.setCoord(new Point(100, 100), new Point(150, 100));
}

Circle.prototype = new Shape();

Circle.prototype.getCoord = function(){
    return this.coord;
}

Circle.prototype.setCoord = function(a, b){
    this.coord[0] = a;
    this.coord[1] = b;
}

Circle.prototype.draw = function(context){
    var a = this.coord[0];
    var b = this.coord[1];
    
    var radius = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    
    context.beginPath();
    
    context.arc(a.x, a.y, radius, 0, 2*Math.PI, false);
    
    context.closePath();
    
    context.fill();
}

Circle.prototype.getType = function(){
    return 'Circle';
}

Circle.prototype.hit = function(point){
    var center = this.coord[0];
    var radius = Math.abs(center.x - this.coord[1].x);
    
    return (Math.pow((point.x - center.x), 2) + Math.pow((point.y - center.y), 2) <= Math.pow(radius, 2));
}

//*******************************************************

function fromClientPointToInside(canvas, clientX, clientY){
        
    var clientRectangle = canvas.getBoundingClientRect();
    
    var mouseX = (clientX - clientRectangle.left) * (canvas.width / clientRectangle.width);
    var mouseY = (clientY - clientRectangle.top) * (canvas.height / clientRectangle.height);
        
    return new Point(mouseX, mouseY);
}

//*******************************************************
function CanvasService(canvasName, shapeService){
    var self = this;
    
    this.canvas = document.getElementById(canvasName);
    this.context = this.canvas.getContext('2d');
    
    this.shapeService = shapeService;
    
    shapeService.loadFromServer(function(shapesArray){
        self.shapes = shapesArray;
    });
    
    if (this.shapes == undefined) {
        this.shapes = new Array();
        this.nextShapeId = 0;
    }
    else {
        if (this.shapes.length > 0)
            this.nextShapeId = this.shapes[this.shapes.length - 1].id + 1;
        else{
            this.nextShapeId = 0;
        }
    }
    
    this.selectedShapeId = -1;
    this.lastSelectedShapeId = -1;
}

/* forEach anonymous function в области видимости Window, this.context == undefined
CanvasService.prototype.drawShapes = function(){
    this.shapes.forEach(function(shape, index, array){
        shape.draw(this.context);
    })
}
*/

CanvasService.prototype.drawShapes = function(refreshServerState){
    for(var i = 0; i < this.shapes.length; i++){
        this.shapes[i].draw(this.context);
    }
    
    if (refreshServerState) 
        this.shapeService.sendOnServer(this.shapes);
    /*
    var self = this;
    
    window.setInterval( function() {
        self.shapeService.sendOnServer(self.shapes);
    },1);*/
}

CanvasService.prototype.reciveHit = function(clientX, clientY){

    var hitPoint = fromClientPointToInside(this.canvas, clientX, clientY);
    
    for (var i = 0; i < this.shapes.length; i++){
        if (this.shapes[i].hit(hitPoint)){
            this.clickPoint = hitPoint;
            
            if (this.shapes[i].userId == document.cookie){
                this.selectedShapeId = this.shapes[i].id;
                this.lastSelectedShapeId = this.shapes[i].id;
            }
            else{
                console.log('This is not your shape!');
            }
        }
    }
}

CanvasService.prototype.moveShape = function(clientX, clientY){
    if (this.selectedShapeId == -1)
        return;
    
    var movePoint = fromClientPointToInside(this.canvas, clientX, clientY);
    
    for (var i = 0; i < this.shapes.length; i++){
        if (this.shapes[i].id == this.selectedShapeId){
            this.shapes[i].moveTo(movePoint, this.clickPoint);
            
            this.clearContext();
            
            this.drawShapes(true);
        }
    }
}

CanvasService.prototype.clearSelection = function(){
    this.selectedShapeId = -1;
}

CanvasService.prototype.addRandomShape = function(){
    var type = Math.floor(Math.random() * (3 - 0) + 0);
    var tempShape = undefined;
    
    switch (type)
    {
            case 0:{
                tempShape = new Triangle(this.nextShapeId);
                break;
            }
            case 1:{
                tempShape = new Rectangle(this.nextShapeId);
                break;
            }
            case 2:{
                tempShape = new Circle(this.nextShapeId);
                break;
            }
            default:{
                console.log('Wrong variant: ' + type);
            }
    }
   
    tempShape.userId = document.cookie;

    this.shapes.push(tempShape);
    
    this.drawShapes(true);
    
    this.nextShapeId++;
}

CanvasService.prototype.clearContext = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

CanvasService.prototype.deleteSelectedShape = function(){
    for (var i = 0; i < this.shapes.length; i++){
        if (this.shapes[i].id == this.lastSelectedShapeId){
            this.shapes.remove(i);
            
            this.clearContext();
            
            this.drawShapes(true);
        }
    }
}

//*********************************************************************

function ShapeService(){
    this.xhr = new XMLHttpRequest();    
}

ShapeService.prototype.openConnection = function(requestMethod, isAsync){
    this.xhr.open(requestMethod, '/ajax', isAsync);
    this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
}

ShapeService.prototype.sendOnServer = function(shapeArray){
    this.openConnection('POST', true);
    this.xhr.send(JSON.stringify(shapeArray));
}

ShapeService.prototype.loadFromServer = function(afterRecive){
    this.openConnection('GET', false);
    
    var recivedJSON = '';
    
    this.xhr.onreadystatechange = function(){
        if (this.readyState != 4) 
            return 1;
        
        var shapes = new Array();
        
        if (this.responseText == '') 
            return shapes;
        
        shapes = JSONToShapeArray(this.responseText);
        
        afterRecive(shapes);
    }
    
    this.xhr.send('');
}

/** @param {String} jsonString */
function JSONToShapeArray(jsonString) {
    var tempArray = JSON.parse(jsonString);
    var shapes = new Array();
    
    for (var i = 0; i < tempArray.length; i++){
        var temp;

        switch (tempArray[i].type){
            case 'Triangle':{
                temp = new Triangle(tempArray[i].id);
                break;
            }
            case 'Rectangle':{
                temp = new Rectangle(tempArray[i].id);
                break;
            }
            case 'Circle':{
                temp = new Circle(tempArray[i].id);
                break;
            }
            default:{
                console.log('Wrong type!!!');
            }
        }
        // нужна функция которая перебирает распарсенный массив и приравнивает взе значения свойств
        temp.initFields(tempArray[i].coord, tempArray[i].userId, tempArray[i].clickPoint);

        shapes.push(temp);
    }
    
    return shapes;
}

//*********************************************************************

// Array Remove - By John Resig (MIT Licensed)

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

/*
var classname=window[classname_str]; //вариант-2
var obj=new classname(); 
*/