game.PlayScreen = me.ScreenObject.extend({

    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
       me.levelDirector.loadLevel("area01");


        game.data.score = 0;
        game.data.rituel.gaugeCurrentValue = game.data.rituel.gaugeStartValue;
     
        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);

    },


    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
