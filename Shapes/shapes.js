function Point(x, y)
{
    this.x = x;
    this.y = y;
}

//******************************************************

function Shape(){
    this.id = 0;
};

Shape.prototype.getType = function(){ 
    return 'shape'; 
};

Shape.prototype.getCoord = function(){
    return undefined;
}

Shape.prototype.setCoord = function(param){
    return undefined;
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

Shape.prototype.moveTo = function(point){
    return undefined;
}
//*****************************************************

function Triangle(){
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

Triangle.prototype.hit = function(point){
    
    var a = this.coord[0];
    var b = this.coord[1];
    var c = this.coord[2];
    
    var testA = (a.x - point.x) * (b.y - a.y) - (b.x - a.x) * (a.y - point.y);
    var testB = (b.x - point.x) * (c.y - b.y) - (c.x - b.x) * (b.y - point.y);
    var testC = (c.x - point.x) * (a.y - c.y) - (a.x - c.x) * (c.y - point.y);
    
    return ((testA >= 0 && testB >= 0 && testC >= 0) || (testA <= 0 && testB <= 0 && testC <= 0))
}

Triangle.prototype.moveTo = function(point){
    
}
//*******************************************************

function Rectangle(){
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

Rectangle.prototype.hit = function(point){
    var a = this.coord[0];
    var b = this.coord[1];
    
    return ((point.x >= a.x && point.x <= b.x) && (point.y >= a.y && point.y <= b.y))
}
//*********************************************************

function Circle(id){
    
    this.id = id;
    
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

Circle.prototype.hit = function(point){
    var center = this.coord[0];
    var radius = Math.abs(center.x - this.coord[1].x);
    
    return (Math.pow((point.x - center.x), 2) + Math.pow((point.y - center.y), 2) <= Math.pow(radius, 2));
}

Circle.prototype.moveTo = function(point){
    var center = this.coord[0];
    var radius = Math.abs(this.coord[1].x - center.x);
    
    var sub = new Point(center.x - point.x, center.y - point.y);
    var newCenter = new Point(point.x - sub.x, point.y - sub.y);
    
    var newLinePoint = new Point(newCenter.x + radius, newCenter.y);
    
    this.coord[0] = newCenter;
    this.coord[1] = newLinePoint;
    
    console.log(newCenter.x + ':' + newCenter.y + ':' + radius);
    console.log(point.x + ':' + point.y);
}
//*******************************************************

function fromClientPointToInside(canvas, clientX, clientY){
        
    var clientRectangle = canvas.getBoundingClientRect();
    
    var mouseX = (clientX - clientRectangle.left) * (canvas.width / clientRectangle.width);
    var mouseY = (clientY - clientRectangle.top) * (canvas.height / clientRectangle.height);
        
    return new Point(mouseX, mouseY);
}

//*******************************************************
function CanvasService(canvasName){
    this.canvas = document.getElementById(canvasName);
    this.context = this.canvas.getContext('2d');
    
    this.shapes = new Array();
    
    this.selectedShapeId = -1;
}

/* forEach anonymous function в области видимости Window, this.context == undefined
CanvasService.prototype.drawShapes = function(){
    this.shapes.forEach(function(shape, index, array){
        shape.draw(this.context);
    })
}
*/

CanvasService.prototype.drawShapes = function(){
    for(var i = 0; i < this.shapes.length; i++){
        this.shapes[i].draw(this.context);
    }
}

CanvasService.prototype.reciveHit = function(clientX, clientY){

    var hitPoint = fromClientPointToInside(this.canvas, clientX, clientY);
    
    for (var i = 0; i < this.shapes.length; i++){
        if (this.shapes[i].hit(hitPoint)){
            this.selectedShapeId = this.shapes[i].id;
        }
    }
}

CanvasService.prototype.moveShape = function(clientX, clientY){
    if (this.selectedShapeId == -1)
        return;
    
    var movePoint = fromClientPointToInside(this.canvas, clientX, clientY);
    
    for (var i = 0; i < this.shapes.length; i++){
        if (this.shapes[i].id == this.selectedShapeId){
            this.shapes[i].moveTo(movePoint);
            
            this.context.fillStyle = "#ffffff";

            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.restore();
            this.context.fillStyle = "#000000";
            
            this.drawShapes();
        }
    }
}

CanvasService.prototype.clearSelection = function(){
    this.selectedShapeId = -1;
}