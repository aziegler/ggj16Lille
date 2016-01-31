game.EndUI = me.Container.extend({

    init: function () {
        // call the constructor
        this._super(me.Container, 'init',
            [0, 0, me.game.viewport.width, me.game.viewport.height]);

        this.font = new me.BitmapFont("32x32_font", 32);

        this.font.resize(1.5);

        this.addChild(new me.ColorLayer("bg", "#000000", -Infinity));

        var win = "YOU WON!";
        var loss = "YOU FAILED!";

        if (me.game.HASH.debug === true) {
            console.log("Game end");
            console.log("victory: " + game.data.victory);
            console.log("defeat: " + game.data.defeat);
        }

        var text;
        if (game.data.victory) {
            if (game.data.localSpy) {
                text = loss;
            } else {
                text = win;
            }
        } else if (game.data.defeat) {
            if (game.data.localSpy) {
                text = win;
            } else {
                text = loss;
            }
        } else {
            text = "YOU FLED, LEL!";
        }


        var textRun = new game.TitleUI.TextRun(
            this.width / 2 - 24 * text.length,
            this.height / 2 - 24,
            this.font,
            text,
            "outcomeText"
        );

        this.addChild(textRun);
    }
});