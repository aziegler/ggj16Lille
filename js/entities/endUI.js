game.EndUI = me.Container.extend({

    init: function () {
        // call the constructor
        this._super(me.Container, 'init',
            [0, 0, me.game.viewport.width, me.game.viewport.height]);

        this.font = new me.BitmapFont("32x32_font", 32);

        this.font.resize(1.5);

        this.addChild(new me.ColorLayer("bg", "#000000", -Infinity));

       
        if (me.game.HASH.debug === true) {
            console.log("Game end");
            console.log("victory: " + game.data.victory);
            console.log("defeat: " + game.data.defeat);
        }
        var imageSettings = {};
        imageSettings.image = me.loader.getImage("victory_text");
      
        var text;
        if (game.data.victory) {
            if (game.data.localSpy) {
                imageSettings.image = me.loader.getImage("defeat_text");
            } else {
                imageSettings.image = me.loader.getImage("victory_text");
            }
        } else if (game.data.defeat) {
            if (game.data.localSpy) {
                imageSettings.image = me.loader.getImage("victory_text");
            } else {
                imageSettings.image = me.loader.getImage("defeat_text");
            }
        } else {
            imageSettings.image = me.loader.getImage("defeat_text");
        }
        imageSettings.width = 1000;
        imageSettings.height = 1000;


        this.text = new me.ImageLayer(0,200,imageSettings);

        this.text.repeat = "no-repeat";
        

        this.addChild(this.text);
    }
});