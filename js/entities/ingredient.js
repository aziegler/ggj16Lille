game.IngredientEntity = me.Entity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        // call the parent constructor
        this._super(me.Entity, 'init', [x, y , settings]);

    },

    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision : function (response, other) {
        // do something when collected

        // make sure it cannot be collected "again"
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);

        // remove it
        me.game.world.removeChild(this);

        return false
    }
});