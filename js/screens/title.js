game.TitleScreen = me.ScreenObject.extend({

    onResetEvent : function() {
        me.audio.stopTrack();

        game.data.lobby.preGame = false;
        game.data.lobby.gameRunning = false;

        if (!global.network.socket)
            global.network.socket = io('http://www.chwthewke.net:3000');

        var socket = global.network.socket;
        socket.on('disconnect', function() {
            socket.removeAllListeners('disconnect');
            global.network.socket = null;
            me.state.change(me.state.GAME_END);
        });

        game.data.defeat = false;
        game.data.victory = false;
        game.data.ended = false;



        // title screen
        me.game.world.addChild(
            new me.Sprite(
                0, 0, {
                    image: me.loader.getImage('title_screen')
                }
            ),
            1
        );

        // add our HUD to the game world
        this.TitleUI = new game.TitleUI.Container();
        me.game.world.addChild(this.TitleUI);


        //// add a new renderable component with the scrolling text
        //me.game.world.addChild(new (me.Renderable.extend ({
        //    // constructor
        //    init : function() {
        //        this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
        //        // font for the scrolling text
        //        this.font = new me.BitmapFont("32x32_font", 32);
        //
        //        // a tween to animate the arrow
        //       // this.scrollertween = new me.Tween(this).to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
        //
        //       // this.scroller = "A SMALL STEP BY STEP TUTORIAL FOR GAME CREATION WITH MELONJS       ";
        //       // this.scrollerpos = 600;
        //    },
        //
        //    // some callback for the tween objects
        //  /*  scrollover : function() {
        //        // reset to default value
        //        this.scrollerpos = 640;
        //        this.scrollertween.to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
        //    },*/
        //
        //    update : function (dt) {
        //        return true;
        //    },
        //
        //    draw : function (renderer) {
        //        this.font.draw(renderer, "PRESS ENTER TO PLAY", 20, 240);
        //       // this.font.draw(renderer, this.scroller, this.scrollerpos, 440);
        //    },
        //    onDestroyEvent : function() {
        //      //  this.scrollertween.stop();
        //    }
        //})), 2);

        // change to play state on press Enter or click/tap
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        //me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.ENTER);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter") {
                // play something on tap / enter
                // this will unlock audio on mobile devices
                //me.state.change(me.state.READY);
                socket.emit("lobbyReady")
            }
        });

        // Register network event handlers (once all receivers are init'ed)
        var self = this;
        socket.on("initLobby", function(p) { self.initPlayers(self, p); });
        socket.on("initLobbyWaiting", function() { self.initWaiting(self); });
        socket.on("lobbyAddPlayer", function(p) { self.addPlayer(self, p); });
        socket.on("removePlayer", function(p) { self.removePlayer(self, p); });
        socket.on("gameStart", function() {
            if (me.game.HASH.debug === true) {
                console.log("gameStart received.")
            }
            game.data.clientId = this.id;
            me.state.change(me.state.READY);
        });

        game.data.localSpy = false;

        socket.on("spy", function () {
            console.log("isSpy");
            game.data.localSpy = true;
   //         game.data.localPlayer.isSpy = true;
        });


        me.audio.playTrack("ritual_title");
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent : function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        //me.input.unbindPointer(me.input.mouse.LEFT);
        me.event.unsubscribe(this.handler);
        me.game.world.removeChild(this.TitleUI);

        var socket = global.network.socket;
        if (!socket) return;
            socket.removeAllListeners("initLobby");
        socket.removeAllListeners("initLobbyWaiting");
        socket.removeAllListeners("lobbyAddPlayer");
        socket.removeAllListeners("removePlayer");

        me.audio.stopTrack();
    },

    initWaiting : function(self) {
        game.data.lobby.gameRunning = true;
    },

    initPlayers : function(self, players) {
        for(var i = 0; i < players.length; i++)
            self.addPlayer(self, players[i]);
        game.data.lobby.preGame = true;
    },

    addPlayer : function(self, player) {
        if (me.game.HASH.debug === true)
            console.log("socket addPlayer " + player.id);
        game.data.lobbyPlayers[player.id] = player;
        game.data.lobbyPlayersDirty = true;
        me.audio.play('new_player', false);
    },

    removePlayer : function(self, playerId) {
        if (me.game.HASH.debug === true)
            console.log("socket removePlayer " + playerId);
        delete game.data.lobbyPlayers[playerId];
        game.data.lobbyPlayersDirty = true;
    }
});
