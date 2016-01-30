game.TitleScreen = me.ScreenObject.extend({

    onResetEvent : function() {

        // title screen
        me.game.world.addChild(
            new me.Sprite(
                0,0, {
                    image: me.loader.getImage('title_screen')
                }
            ),
            1
        );

        // add our HUD to the game world
        this.TitleUI = new game.TitleUI.Container();
        me.game.world.addChild(this.TitleUI);


        // add a new renderable component with the scrolling text
        me.game.world.addChild(new (me.Renderable.extend ({
            // constructor
            init : function() {
                this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
                // font for the scrolling text
                this.font = new me.BitmapFont("32x32_font", 32);

                // a tween to animate the arrow
               // this.scrollertween = new me.Tween(this).to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();

               // this.scroller = "A SMALL STEP BY STEP TUTORIAL FOR GAME CREATION WITH MELONJS       ";
               // this.scrollerpos = 600;
            },

            // some callback for the tween objects
          /*  scrollover : function() {
                // reset to default value
                this.scrollerpos = 640;
                this.scrollertween.to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
            },*/

            update : function (dt) {
                return true;
            },

            draw : function (renderer) {
                this.font.draw(renderer, "PRESS ENTER TO PLAY", 20, 240);
               // this.font.draw(renderer, this.scroller, this.scrollerpos, 440);
            },
            onDestroyEvent : function() {
              //  this.scrollertween.stop();
            }
        })), 2);

        // change to play state on press Enter or click/tap
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        //me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.ENTER);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if (action === "enter") {
                // play something on tap / enter
                // this will unlock audio on mobile devices
                me.state.change(me.state.PLAY);
            }
        });
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent : function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        //me.input.unbindPointer(me.input.mouse.LEFT);
        me.event.unsubscribe(this.handler);
        me.game.world.removeChild(this.TitleUI);
    }
});
