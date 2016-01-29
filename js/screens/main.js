game.MainScreen = me.ScreenObject.extend({
    
       init : function () {
         this.font = new me.Font("Verdana", 12, "#fff", "center");
    },

    onResetEvent : function () {
         // Connect to server and set global reference to the socket that's connected
        global.network.socket  = io('http://localhost:3000');  
        global.network.socket.emit("start");
        global.network.socket.on("playerCreated",function(player){
            console.log(player);
        })
        global.network.socket.on("playerPosition",function(player){
            console.log(player.x);
        })

        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");

        global.state.localPlayer = me.pool.pull("mainPlayer");
        

        me.game.world.addChild(global.state.localPlayer, 4);
    }

});
