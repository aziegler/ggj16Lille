/**
 * a HUD container and child items
 */

game.TitleUI = game.TitleUI || {};

game.TitleUI.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init',
            [0, 0, me.game.viewport.width, me.game.viewport.height]);

        // persistent across level change
        this.isPersistent = false;

        // make sure we use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "TitleUI";

        this.font = new me.BitmapFont("32x32_font", 32);

        this.numChildren = 0;

    },

    addPlayer: function(self, player, index) {
        self.numChildren++;

        if (me.game.HASH.debug === true)
            console.log("TitleUI.addPlayer numChildren = " + this.numChildren);

        var playerItem =
            new game.TitleUI.PlayerItem(
                self.width / 2,
                32 + index * 64,
                self.font,
                player.name,
                player.id);

        if (me.game.HASH.debug === true)
            console.log("addChild " + playerItem);
        self.addChild(playerItem);
    },

    update: function() {
        this._super(me.Container, 'update');

        if (!game.data.playersDirty) return false;

        game.data.playersDirty = false;

        if (me.game.HASH.debug === true)
            console.log("TitleUI.update numChildren = " + this.numChildren);

        while(this.numChildren > 0) {
            this.numChildren--;
            this.removeChildNow(this.getChildAt(0));
        }

        var self = this;
        var index = 0;
        Object.keys(game.data.players).forEach(function(id) {
            self.addPlayer(self, game.data.players[id], index++);
        });

        return true;
    }
});


/**
 * a basic HUD item to display score
 */
game.TitleUI.PlayerItem = me.Renderable.extend({


    /**
     * constructor
     */
    init: function(x, y, font, playerName, id) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 256, 256]);

        this.playerName = playerName;

        this.font = font;

        this.x = x;

        this.y = y;

        this.name = id;

        this.anchorPoint = new me.Vector2d(0.5, 0.5);
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
