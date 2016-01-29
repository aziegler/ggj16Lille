/**
 * Player Entity
 */
game.NetworkPlayer = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, "init", [x, y, { width: 40, height: 190 }]);
       
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 15);
     
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
     
        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
     
     
    },

    /**
     * update the entity
     */
    update : function (dt) {    
        if (me.input.isKeyPressed("left")) {
          global.network.socket.emit("move","left");
        }
     
        if (me.input.isKeyPressed("right")) {
          global.network.socket.emit("move","right");
        }

         if (me.input.isKeyPressed("up")) {
          global.network.socket.emit("move","up");
        }
     
        if (me.input.isKeyPressed("down")) {
          global.network.socket.emit("move","down");
        }
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});
