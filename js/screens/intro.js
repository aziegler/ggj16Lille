game.IntroScreen = me.ScreenObject.extend({

    onResetEvent: function () {
        if (me.game.HASH.debug === true) {
            console.log("Intro screen start")
        }

        this.introUI = new game.IntroUI();
        me.game.world.addChild(this.introUI);

        var socket = global.network.socket;

        setTimeout(function() {
            global.network.socket.emit("introSkip");
        }, 5000);

        socket.on("introDone", function() {
            me.state.change(me.state.PLAY);
        })

    },

    onDestroyEvent: function () {
        me.game.world.removeChild(this.introUI);
        if (global.network.socket)
            global.network.socket.removeAllListeners("introDone");
    },
});
