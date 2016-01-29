game.OpponentEntity = me.Entity.extend({
    init: function(x, y, settings) {


    },

    // manage the enemy movement
    update: function(dt) {
        return false;
    },


    onCollision : function (response, other) {

        // Make all other objects solid
        return false;
    }
});