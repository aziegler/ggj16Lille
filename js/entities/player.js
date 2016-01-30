game.PlayerEntity = me.Entity.extend({


    init: function(x, y, playerIdx) {

        this.direction = "right";
        this.animation = 'stand';

        var settings = {};
        var imageName = "placeholderchara"+playerIdx
        settings.image = me.loader.getImage(imageName);
        settings.width = 64;
        settings.height = 64;
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        this.renderable = new me.AnimationSheet(0,0,settings);

      
        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("stand_side",  [0]);
        this.renderable.addAnimation("stand_up",  [0]);
        this.renderable.addAnimation("stand_down",  [0]);

        this.renderable.addAnimation("walk_side",  [0]);
        this.renderable.addAnimation("walk_up",  [0]);
        this.renderable.addAnimation("walk_down",  [0]);

        this.renderable.addAnimation("dance1_side",  [1]);
        this.renderable.addAnimation("dance1_up",  [1]);
        this.renderable.addAnimation("dance1_down",  [1]);


        this.renderable.addAnimation("carry",  [0]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand_side");
    },


    refresh: function(playerInfo) {
        this.pos.x = playerInfo.x;
        this.pos.y = playerInfo.y;

        var dir = playerInfo.direction;

        this.renderable.flipX(dir == "left");

        if(dir == "left" || dir == "right") {
            dir = "side";
        }

        var animName = playerInfo.animation + "_" + dir;
        this.trySetAnim(animName);
    },


    trySetAnim:function(animName) {

        if (!this.renderable.isCurrentAnimation(animName)) {
            this.renderable.setCurrentAnimation(animName);
        }
    },

})
