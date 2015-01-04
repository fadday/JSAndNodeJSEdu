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

function Circle(){
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
    context.arc(a.x, a.y, radius, 0, 2*Math.PI, false);
    
    context.fill();
}

//*******************************************************

function CanvasService(canvasName){
    this.canvas = document.getElementById(canvasName);
    this.context = this.canvas.getContext('2d');
    
    this.shapes = new Array();
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
    var clientRectangle = this.canvas.getBoundingClientRect();
    
    var mouseX = (clientX - clientRectangle.left) * (this.canvas.width / clientRectangle.width);
    var mouseY = (clientY - clientRectangle.top) * (this.canvas.height / clientRectangle.height);
    
    var hitPoint = new Point(mouseX, mouseY);
    
    for (var i = 0; i < this.shapes.length; i++){
        if (this.shapes[i].hit(hitPoint)){
            console.log(this.shapes[i].id);
        }
    }
}