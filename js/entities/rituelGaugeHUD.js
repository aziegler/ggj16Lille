game.rituelHUD = game.rituelHUD || {};


game.rituelHUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = false;

        // make sure we use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "rituelHUD";

        // add our child score object at the right-bottom position
        this.addChild(new game.rituelHUD.gauge(global.WIDTH/2, global.HEIGHT-30));
    }
});

game.rituelHUD.gauge = me.Renderable.extend( {
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("right");

        // local copy of the global score
        this.value = -1;
    },

    /**
     * update function
     */
    update : function (dt) {
        // we don't draw anything fancy here, so just
        // return true if the score has been updated
        if (this.value !== game.data.rituel.gaugeCurrentValue) {
            this.value = Math.max(0, Math.min(game.data.rituel.gaugeCurrentValue, game.data.rituel.gaugeMaxValue));
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (renderer) {
        this.font.draw (renderer, game.data.score, this.pos.x, this.pos.y);
    }
});