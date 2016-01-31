/**
 * Player Entity
 */
game.NetworkPlayer = me.Entity.extend({

    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y, {width: 40, height: 190}]);


        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        this.dancing = false;
        this.stand = true;

        this.dirX = 0;
        this.dirY = 0;

        this.body.collisionType = me.collision.types.NO_OBJECT;

    },


    getMovement: function(keyMinus, keyPlus) {
        //if (me.game.HASH.debug === true) {
        //    console.log(
        //        "[" + keyMinus + ":" + me.input.isKeyPressed(keyMinus) +"]["
        //        + keyPlus + ":" + me.input.isKeyPressed(keyPlus) + "]"
        //    );
        //}
        var d = 0;
        if (me.input.isKeyPressed(keyMinus))
            d -= 1;
        if (me.input.isKeyPressed(keyPlus))
            d += 1;
        return d;
    },

    /**
     * update the entity
     */
    update: function (dt) {
        var emit = function (m, p) {
            if (global.network.socket) {
                global.network.socket.emit(m, p);
            }
        };


        var dx = this.getMovement("left", "right");
        var dy = this.getMovement("up", "down");

        if (dx != this.dirX || dy != this.dirY) {
            this.dirX = dx;
            this.dirY = dy;

            emit("move", {dx: this.dirX, dy: this.dirY});
        }


        var isStanding = this.dirX == 0 && this.dirY == 0;

        if (me.input.isKeyPressed("dance")) {
            if (!this.dancing) {
                this.dancing = true;
                emit("dance", true);
            }
            isStanding = false;
        } else {
            if (this.dancing) {
                this.dancing = false;
                emit("dance", false);
            }
        }

        if (me.input.isKeyPressed("mark")) {
            if(!game.data.localPlayer)
                return;
            game.data.localPlayer.refreshCollision();
            game.data.localPlayer.playMark();
            /*//var player = findPlayerInCollision
             var player = null;
             global.network.socket.emit("mark",player);*/
        }

        if (this.stand != isStanding) {
            this.stand = isStanding;
            emit("stand", isStanding);
        }
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision: function (response, other) {
        // Make all other objects solid
        return true;
    }
});
