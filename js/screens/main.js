game.MainScreen = me.ScreenObject.extend({

    init: function () {
        this.font = new me.Font("Verdana", 12, "#fff", "center");
    },

    onDestroyEvent: function () {
        if(this.HUD)
            me.game.world.removeChild(this.HUD);
        me.game.world.removeChild(this.player);
        me.game.world.removeChild(this.chaudron);
        if(this.demon)
            me.game.world.removeChild(this.demon);

        var socket = global.network.socket;
        if (!socket) return;

        socket.removeAllListeners("returnToLobby");
        socket.removeAllListeners("refreshPlayer");
        socket.removeAllListeners("scoreUpdate");
        socket.removeAllListeners("scoreUpdate");
        socket.removeAllListeners("removePlayer");
        socket.removeAllListeners("victory");
        socket.removeAllListeners("defeat");
        socket.removeAllListeners("killed");

        me.audio.stopTrack();
    },
    stopAllPlayers: function() {

    },

    onResetEvent: function () {
        var self = this;
        me.audio.stopTrack();
        
        me.game.sortOn = "y";

        // Connect to server and set global reference to the socket that's connected
        if (me.game.HASH.debug === true) {
            console.log("gameStarted")
        }

      //s  me.levelDirector.loadLevel("area01");

        setTimeout(function () {

            if (me.game.HASH.debug === true) {
                console.log("player init.");
            }

            Object.keys(game.data.lobbyPlayers).forEach(function (id) {

                var playerInfo = game.data.lobbyPlayers[id];
                if (me.game.HASH.debug === true) {
                    console.log("player added " + playerInfo.id)
                }
                var player = me.pool.pull("mainPlayer", playerInfo.x, playerInfo.y, playerInfo.id, playerInfo.spriteIndex);
                me.game.world.addChild(player);
                game.data.players[playerInfo.id] = player;
                if (game.data.clientId === playerInfo.id.substring(2)) {
                    if (me.game.HASH.debug === true) {
                        console.log("localPlayer added for " + game.data.clientId);
                    }
                    game.data.localPlayer = player;
                }


            });

            game.data.lobbyPlayers = {};
        }, 500);

        //global.network.socket.on("returnToLobby", function () {
        //    me.state.change(me.state.MENU);
        //});

        global.network.socket.on("killed", function (p) {
            me.game.viewport.shake(15, 300, me.game.viewport.AXIS.BOTH);
            me.audio.play('death', false);

            var player = game.functions.playerById(p.id);
            if (me.game.HASH.debug === true) {
                console.log("player killed : " + p.id)
            }
            if (player) {
                if (me.game.HASH.debug === true) {
                    console.log("player killed found : " + player)
                }
                player.playLightning();
            }
        });

        global.network.socket.on("refreshPlayer", function (infos) {
            var player = game.functions.playerById(infos.id);

            if (player && me.game.HASH.debug === true) {
                console.log("refreshPlayer " + player.playerId + "@" + infos.x + "," + infos.y);
            }

            if (player) {
                player.refresh(infos);
            }
        });

        global.network.socket.on("scoreUpdate", function (score) {
            game.data.score = score.gauge;
        });


        global.network.socket.on("removePlayer", function (playerId) {
            var player = game.functions.playerById(playerId);
            me.game.world.removeChild(player);
            game.data.players[playerId] = null;
        });

        global.network.socket.on("victory", function (playerId) {
            game.data.victory = true;
            game.data.ended = true;
            if(self.HUD){
                me.game.world.removeChild(self.HUD);
                self.HUD = null;
            }

            if (!game.data.localSpy) {
                me.audio.play('victory', false);
            } else {
                me.audio.play('defeat', false);
            }
            setTimeout(function(){
                me.state.change(me.state.GAME_END);
            },3000);

            self.demon = new game.Devil(133,350);
            me.game.world.addChild(self.demon);
        });

        global.network.socket.on("defeat", function (playerId) {
            game.data.defeat = true;
            game.data.ended = true;
            if(self.HUD){
                me.game.world.removeChild(self.HUD);
                self.HUD = null;
            }
            var player = game.functions.playerById(playerId);

            if (!game.data.localSpy) {
                me.audio.play('victory', false);
            } else {
                me.audio.play('defeat', false);
            }

            setTimeout(function(){
                me.state.change(me.state.GAME_END);
            },3000);

            self.chaudron.turnOff();
        });

        me.levelDirector.loadLevel("area01");


        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.X, "dance");
        me.input.bindKey(me.input.KEY.W, "mark");


        this.player = me.pool.pull("networkPlayer");
        me.game.world.addChild(this.player);

        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);

        this.chaudron = new game.Chaudron(320, 300);
        me.game.world.addChild(this.chaudron);

        me.audio.playTrack('play');

    }

});
