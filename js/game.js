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

    data : {
        players : [
            "player1",
            "player2",
            "player3"
        ],

        playersDirty: true,

        // score
        score : 0
    },

    // Run on page load.
    "onload" : function () {

        // Initialize the video.
        if (!me.video.init(global.WIDTH, global.HEIGHT, {wrapper : "screen", scale : "auto"})) {
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
        me.state.set(me.state.READY, new game.MainScreen());

         // set the "Play/Ingame" Screen Object
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // set a global fading transition for the screen
        me.state.transition("fade", "#FFFFFF", 250);

        // register our player entity in the object pool
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("networkPlayer", game.NetworkPlayer);

        // me.pool.register("ingredientEntity", game.IngredientEntity);
        //me.pool.register("opponentEntity", game.OpponentEntity); // TODO use a playerEntity

        // enable the keyboard
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.X, "dance", true);
        me.input.bindKey(me.input.KEY.SPACE, "carry", true);

        // start the game
        me.state.change(me.state.MENU);
    }
};
