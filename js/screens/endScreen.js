game.EndScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        me.audio.stopTrack();

        this.endUI = new game.EndUI();
        me.game.world.addChild(this.endUI);

        setTimeout(function(){
            me.state.change(me.state.MENU);
        }, 2000);
    },

    onDestroyEvent: function() {
        me.game.world.removeChild(this.endUI);
        me.audio.stopTrack();
    }
});