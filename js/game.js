
var global = {
    WIDTH: 1136,
    HEIGHT: 640,
    DEBUG: true,
    network: {
        socket: undefined,
        host: "localhost",
        port: 3000
    },
    state: {
        playername: "",
        localPlayer: undefined,
        remotePlayers: [],
        rooms: [],
        status: "No"
    },
    functions: {
        playerById: function(id) {
            var i;

            for (i = 0; i < global.state.remotePlayers.length; i++) {
                if (global.state.remotePlayers[i].id === id)
                    return global.state.remotePlayers[i];
            };

            return false;
        }
    }
}

/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(960, 640, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            window.onReady(function () {
                me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
            });
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },

    // Run on game resources loaded.
    "loaded" : function () {
     //   me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.MainScreen());

        // add our player entity in the entity pool
        me.pool.register("mainPlayer", game.Player);

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};
