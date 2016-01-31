game.IntroUI = me.Container.extend({

    init: function () {
        this._super(me.Container, 'init',
            [0, 0, me.game.viewport.width, me.game.viewport.height]);

        this.font = new me.BitmapFont("32x32_font", 32);

        this.font.resize(0.5);

        this.addChild(new me.ColorLayer("bg", "#000000", -Infinity));

        if (!game.data.localSpy) {


            this.textLines = [
                "YOU ARE A WIZARD-PRIEST",
                "IN THE BROTHERHOOD OF KHARH'LOS",
                "DANCE (X) TO ACCOMPLISH",
                "THE RITUAL OF SUMMONING",
                "INVOKE THE WRATH (W) OF KHARH'LOS",
                "ON THE HERETIC WHO WOULD",
                "THWART THE RITUAL"
            ];

        } else {

            this.textLines = [
                "YOU ARE A HERETIC INFILTRATED",
                "AMONG THE BROTHERHOOD OF KHARH'LOS",
                "THE WIZARD-PRIESTS ARE ATTEMPTING",
                "THE RITUAL OF SUMMONING",
                "DANCE WITH THEM, BUT DANCE WRONG (X)",
                "AND THE RITUAL WILL FAIL",
                "INVOKE THE WRATH (W) OF YOUR GOD",
                "ON THE WIZARD-PRIESTS",
                "TO THWART THE RITUAL"
            ]

        }


        var self = this;
        var y = 16;
        this.textLines.forEach(function (t) {
            var x = self.width / 2 - 8 * t.length;

            if (me.game.HASH.debug === true) {
                console.log("textLine @ " + x + "," + y);
            }

            var textRun = new game.TitleUI.TextRun(
                x,
                y,
                self.font,
                t,
                "textLine" + y
            );

            self.addChild(textRun);

            y += 32;
        })
    },


});