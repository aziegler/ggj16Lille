var Player = function (id, name, spriteIdx) {
    var x = 0,
        y = 0,
        id = id,
        name = name,
        dancing = false,
        animation = "stand",
        direction = "right",
        isSpy = false,
        isDead = false,
        spriteIndex = spriteIdx,
        marks = [],
        markedPlayer = "";

    var setAnim = function (name) {
        if (isDead)
            return;
        this.animation = name;
    }

    var addMark = function (name) {
        console.log("Marking " + name);
        marks.push(name);
        if (marks.length >= 2) {
            console.log("Killing " + name);
            this.isDead = true;
            this.animation = "dead"
        }
    }


    return {

        id: id,
        name: name,
        x: x,
        y: y,
        dancing: dancing,
        animation: animation,
        direction: direction,
        spriteIndex: spriteIndex,
        marks: marks,
        isDead: isDead,
        addMark: addMark,
        setAnim: setAnim
    }
};

exports.Player = Player;
