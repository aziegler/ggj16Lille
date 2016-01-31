game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at the right-bottom position
        this.addChild(new game.HUD.Gauge(0, 0));
        this.addChild(new game.HUD.Spy(430, 440));
        this.addChild(new game.HUD.Result(200,200));
    }
});



game.HUD.Result = me.Renderable.extend( {
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 300, 10]);

        // create a font
        this.font = new me.Font("Arial", 18, "#ffffff");
        

        // local copy of the global score
        this.score = -1;
    },

    /**
     * update function
     */
    update : function (dt) {
        // we don't draw anything fancy here, so just
        // return true if the score has been updated
        return true;
    },

    /**
     * draw the score
     */
    draw : function (renderer) {
        if(!game.data.ended)
            return;
       if((game.data.defeat && game.data.localSpy) || (game.data.victory && !game.data.localSpy)){
                    this.font.draw (renderer, "Victory !", this.pos.x, this.pos.y);         
            }else{
                    this.font.draw (renderer, "You lose !", this.pos.x, this.pos.y);               
     
       }     
    }
});

game.HUD.Spy = me.Renderable.extend( {
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("right");

        // local copy of the global score
        this.score = -1;
    },

    /**
     * update function
     */
    update : function (dt) {
        // we don't draw anything fancy here, so just
        // return true if the score has been updated
        return true;
    },

    /**
     * draw the score
     */
    draw : function (renderer) {
        if(game.data.localSpy){
            this.font.draw (renderer, "SPY", this.pos.x, this.pos.y);
        }
    }
});

game.HUD.ScoreItem = me.Renderable.extend( {
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("right");

        // local copy of the global score
        this.score = -1;
    },

    /**
     * update function
     */
    update : function (dt) {
        // we don't draw anything fancy here, so just
        // return true if the score has been updated
        return true;
    },

    /**
     * draw the score
     */
    draw : function (renderer) {
        if(!game.data.ended)
            this.font.draw (renderer, game.data.score, this.pos.x, this.pos.y);
        else        
            this.font.draw (renderer,"", this.pos.x, this.pos.y);

    }
});

game.HUD.Gauge = me.Container.extend({
    init: function(x, y) {
        this._super(me.Container, 'init', [x, y, 10, 10]);

        this.borderSprite = new me.Sprite(0, 0, {
            image: "gauge_empty"
        });

        this.addChild(this.borderSprite);

        this.fillSprite = new me.Sprite(28, 24, {
            image: "gauge_fill"
        });

        this.addChild(this.fillSprite);
    },

    update: function(dt) {
        this.fillSprite.width = 573.0 * game.data.score / 400;
    }


});

game.HUD.TimeItem = me.Renderable.extend( {
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // create a font
        this.font = new me.BitmapFont("32x32_font", 32);
        this.font.set("right");

        // local copy of the global score
        this.score = -1;
    },

    /**
     * update function
     */
    update : function (dt) {
        // we don't draw anything fancy here, so just
        // return true if the score has been updated
        return true;
    },

    /** 
     * draw the score
     */
    draw : function (renderer) {
        if(!game.data.ended)
            this.font.draw (renderer, game.data.time, this.pos.x, this.pos.y);
        else{
             this.font.draw (renderer, " ", this.pos.x, this.pos.y);      
        }        

        this.font.draw (renderer, game.data.time, this.pos.x, this.pos.y);
    }
});