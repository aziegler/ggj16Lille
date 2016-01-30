game.MainScreen = me.ScreenObject.extend({
    
       init : function () {
         this.font = new me.Font("Verdana", 12, "#fff", "center");
    },

    onResetEvent : function () {
         // Connect to server and set global reference to the socket that's connected
        global.network.socket  = io('http://localhost:3000');  
        global.network.socket.emit("start");
        global.network.socket.on("playerCreated",function(playerInfo){
            var player = me.pool.pull("mainPlayer",playerInfo.x, playerInfo.y, playerInfo.id);
            console.log(player.id);
             me.game.world.addChild(player);
             game.data.players[playerInfo.id] = player;
             console.log(game.data.players);
            

        });
        global.network.socket.on("playerPosition",function(playerInfo){
            var player = game.functions.playerById(playerInfo.id);
            player.pos.x = playerInfo.x;
            player.pos.y = playerInfo.y;
        })

        global.network.socket.on("scoreUpdate",function(score){
            game.data.score = score.gauge;
            game.data.time = score.time;
        })

         global.network.socket.on("spy",function(){
            game.data.localSpy = true;
        })

         me.levelDirector.loadLevel("area01");


        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.X, "dance");

        var player = me.pool.pull("networkPlayer");
        
        this.HUD = new game.HUD.Container();
        
        me.game.world.addChild(this.HUD);

        me.game.world.addChild(player, 4);
    }

});
