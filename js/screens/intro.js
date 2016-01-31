
game.IntroScreen = me.ScreenObject.extend({

    onResetEvent: function () {
        me.audio.stopTrack();
        
        if (me.game.HASH.debug === true) {
            console.log("Intro screen start")
        }

       /* this.introUI = new game.IntroUI();
        me.game.world.addChild(this.introUI);*/
        me.levelDirector.loadLevel("area01");

        var settings = {};
        var imageName = "Tuto";
        settings.image = me.loader.getImage(imageName);
        settings.width = 640;
        settings.height = 200;
        settings.framewidth = 640;
        settings.frameheight = 200;

        var animSheet = new me.AnimationSheet(0, 150, settings);
        me.game.world.addChild(animSheet);
        this.sheet = animSheet;

        if (!game.data.localSpy) {
            animSheet.addAnimation("tuto_display", [3,0,0], 4000);
            animSheet.setCurrentAnimation('tuto_display');
        } else {
            animSheet.addAnimation("tuto_display", [1,2,2], 4000);
            animSheet.setCurrentAnimation('tuto_display');
        }
        


        var socket = global.network.socket;

        setTimeout(function() {
            global.network.socket.emit("introSkip");
        }, 8000);

        socket.on("introDone", function() {
            me.state.change(me.state.PLAY);
        })

        me.audio.play("game_start", false);

    },

    onDestroyEvent: function () {
        if (global.network.socket)
            global.network.socket.removeAllListeners("introDone");
        me.audio.stopTrack();
    },
});
