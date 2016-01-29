var Player = function(id, name, room) {
    var x = 0,
        y = 0,
        id = id,
        name = name,
        room = room;

    var getX = function() {
        return x;
    };

    var getY = function() {
        return y;
    };

    var setX = function(newX) {
        x = newX;
    };

    var setY = function(newY) {
        y = newY;
    };

  
    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,        
        id: id,
        name: name
    }
};

exports.Player = Player;
