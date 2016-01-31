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

      
        this.numChildren = 0;

        var settings = {};
        settings.image = me.loader.getImage("PressEnter");
        settings.width = 640;
        settings.height = 480;
        settings.framewidth = 640;
        settings.frameheight = 480;
      
        this.preGameText = new me.AnimationSheet(0,0,settings);
        this.preGameText.addAnimation("enter",[0]);
        this.preGameText.addAnimation("wait",[1]);
        this.preGameText.setCurrentAnimation("wait");
        this.addChild(this.preGameText);

    },

  
    addPlayer: function(self, player, index) {
                

        self.numChildren++;

        if (me.game.HASH.debug === true)
            console.log("TitleUI.addPlayer numChildren = " + this.numChildren);

        var text;
        var imageSettings = {};
        imageSettings.image = me.loader.getImage(player.name);
        imageSettings.width = 1000;
        imageSettings.height = 1000;


        text = new me.ImageLayer(self.width / 2 - 300,32 + index * 20,imageSettings);

        text.repeat = "no-repeat";

       

         self.addChild(text);
    },

    update: function() {
        //this.updateMainText();

        this._super(me.Container, 'update');

        if (!game.data.lobbyPlayersDirty) return false;

        game.data.lobbyPlayersDirty = false;

        if (me.game.HASH.debug === true)
            console.log("TitleUI.update numChildren = " + this.numChildren);

        while(this.numChildren > 0) {
            this.numChildren--;
            this.removeChildNow(this.getChildAt(0));
        }
        
        this.addChild(this.preGameText);
        if(Object.keys(game.data.lobbyPlayers).length > 3)
            this.preGameText.setCurrentAnimation("enter");
        else
            this.preGameText.setCurrentAnimation("wait");

        var self = this;
        var index = 0;
        Object.keys(game.data.lobbyPlayers).forEach(function(id) {
            self.addPlayer(self, game.data.lobbyPlayers[id], index++);
        });

        return true;
    },

    updateMainText: function() {
        if (game.data.lobby.gameRunning) {
            if (!this.gameRunningText) {
                this.gameRunningText =
                    new game.TitleUI.TextRun(
                        64, 400,
                        this.font,
                        "GAME IN PROGRESS",
                        "gameRunning");
                this.addChild(this.gameRunningText);
            }
        } else {
            if (this.gameRunningText) {
                this.removeChild(this.gameRunningText);
                this.gameRunningText = null;
            }
        }

        if (game.data.lobby.preGame) {
            if (!this.preGameText) {
                this.preGameText =
                    new game.TitleUI.TextRun(
                        16, 376,
                        this.font,
                        "WAIT FOR PLAYERS OR",
                        "preGame1"
                    );
                this.preGameText2 =
                    new game.TitleUI.TextRun(
                        0, 424,
                        this.font,
                        "PRESS ENTER TO START",
                        "preGame2"
                    );

                this.addChild(this.preGameText);
                this.addChild(this.preGameText2);
            }
        } else {
            if (this.preGameText) {
                this.removeChild(this.preGameText);
                this.preGameText = null;
            }
            if (this.preGameText2) {
                this.removeChild(this.preGameText2);
                this.preGameText2 = null;
            }
        }
    }
});

/**
 * a basic HUD item to display score
 */
game.TitleUI.TextRun = me.Renderable.extend({


    /**
     * constructor
     */
    init: function(x, y, font, text, id) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 256, 256]);

        this.text = text;

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
        this.font.draw(context, this.text, this.x, this.y);
    }

});
