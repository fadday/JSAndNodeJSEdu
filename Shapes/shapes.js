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

Shape.prototype.draw(){
    return undefined;
}