var Player = function(id, name) {
    var x = 0,
        y = 0,
        id = id,
        name = name, 
        dancing = false,
        animation = "stand",
        direction = "right",
        isSpy = false;

  

  
    return {
       
        id: id,
        name: name,
        x: x, 
        y: y, 
        dancing: dancing,
        animation: animation,
        direction: direction
    }
};

exports.Player = Player;
