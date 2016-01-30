var global = {
    network: {
        socket: undefined,
        host: "localhost",
        port: 3000
    }
};

/* Game namespace */
var game = {

    data: {
        lobbyPlayers: {},

        lobbyPlayersDirty: true,

        players: {},

        localPlayer : null,

        // score
        score: 0,

        time: 100,

        localSpy: false,

        rituel: {
            gaugeStartValue: 50,
            gaugeCurrentValue: 50,
            gaugeMaxValue: 100,
            goodRitualInc: +1,
            badRitualInc: -2
        }
    },
    functions: {
        playerById: function (id) {
            return game.data.lobbyPlayers[id];
        }
    },

    // Run on page load.
    "onload": function () {

        // Initialize the video.
        if (!me.video.init(640, 480, {wrapper: "screen", scale: "auto"})) {
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
        me.audio.disable();

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },

    // Run on game resources loaded.

    "loaded": function () {
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
        me.input.bindKey(me.input.KEY.X, "dance");
        me.input.bindKey(me.input.KEY.SPACE, "carry", true);

        // start the game
        me.state.change(me.state.READY);
    }
};
