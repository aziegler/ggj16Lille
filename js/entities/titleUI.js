/**
 * a HUD container and child items
 */

game.TitleUI = game.TitleUI || {};


game.TitleUI.Container = me.Container.extend({

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
        this.name = "TitleUI";

        this.font = new me.Font("Arial", 18, "#ffffff");

        // TODO update from game.data
        // add our child score object at the top left corner
        this.addChild(new game.TitleUI.PlayerItem(100, 20, this.font, "player1"));
        this.addChild(new game.TitleUI.PlayerItem(100, 60, this.font, "player2"));
        this.addChild(new game.TitleUI.PlayerItem(100, 100, this.font, "player3"));
    },

    update: function() {
    }
});


/**
 * a basic HUD item to display score
 */
game.TitleUI.PlayerItem = me.Renderable.extend({


    /**
     * constructor
     */
    init: function(x, y, font, playerName) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        this.playerName = playerName;

        this.font = font;

        this.x = x;

        this.y = y;
    },

    /**
     * update function
     */
    update : function () {
        return false;
    },

    /**
     * draw the name box
     */
    draw : function (context) {
        this.font.draw(context, this.playerName, this.x, this.y);
    }

});
