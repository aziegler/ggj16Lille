

game.PlayerEntity = me.Entity.extend({


    init: function (x, y, id, playerIdx) {

        this.direction = "right";
        this.animation = 'stand';
        this.dirX = 0;
        this.dirY = 0;
        this.playerId = id;

        this.marks = [];

        var settings = {};
        var imageName = "spritesheet" + playerIdx;
        settings.image = me.loader.getImage(imageName);
        settings.width = 64;
        settings.height = 64;
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        this.renderable = new me.Container(0, 0, 64, 100);

        var animSheet = new me.AnimationSheet(0, 24, settings);
        this.renderable.addChild(animSheet);

      
        var markSettings = {};
        markSettings.image = me.loader.getImage("TETE_MORT");
        markSettings.width = 32;
        markSettings.height = 32;
        markSettings.framewidth = 32;
        markSettings.frameheight = 32;


        this.mark =  new me.AnimationSheet(16,0,markSettings);
        this.renderable.addChild(this.mark);
        this.mark.addAnimation("base",[0,1,2]);
        this.mark.addAnimation("hidden",[3]);;
        this.mark.setCurrentAnimation("hidden")

        this.sheet = animSheet;

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        animSheet.addAnimation("stand_side", [0,3,8,13]);
        animSheet.addAnimation("stand_up", [7,12,15,16]);
        animSheet.addAnimation("stand_down", [0,3,8,13]);

        animSheet.addAnimation("dead_side", [14]);
        animSheet.addAnimation("dead_up", [14]);
        animSheet.addAnimation("dead_down", [14]);


        animSheet.addAnimation("walk_side", [0,3,8,13]);
        animSheet.addAnimation("walk_up", [7,12,15,16]);
        animSheet.addAnimation("walk_down", [0,3,8,13]);

        animSheet.addAnimation("dance1_side", [6, 1, 10], 100);
        animSheet.addAnimation("dance1_up", [17, 5], 275);
        animSheet.addAnimation("dance1_down", [2, 11], 60);


        animSheet.addAnimation("carry", [0]);
        // set the standing animation as default
        animSheet.setCurrentAnimation("stand_side");
    },

    refreshCollision: function () {
        me.collision.check(this);
    },

    onCollision: function (response) {
        if (response.b.body.collisionType === me.collision.types.ENEMY_OBJECT) {
            console.log("Collision");
            if (response.b.marks.indexOf(response.a.playerId) === -1) {
                global.network.socket.emit("marked", response.b.playerId);
            }
        }
        return false;
    },

    update: function (dt) {
        this._super(me.Entity, 'update', [dt]);
        //this.body.update(dt);
        this.pos.x  = this.pos.x + this.dirX * dt * 0.001;
        this.pos.y  = this.pos.y + this.dirY * dt * 0.001;

    },

    refresh: function (playerInfo) {
        this.pos.x = playerInfo.x;
        this.pos.y = playerInfo.y;
        this.dirX = playerInfo.dx;
        this.dirY = playerInfo.dy;
       

        if(playerInfo.marks.length > 0){
            this.trySetMark("base");
        }else{
            this.trySetMark("hidden");
        }

        var dir = playerInfo.direction;

        this.sheet.flipX(dir == "left");

        if (dir == "left" || dir == "right") {
            dir = "side";
        }

        var animName = playerInfo.animation + "_" + dir;
        this.trySetAnim(animName);
    },

    trySetMark: function (animName) {
          if (!this.mark.isCurrentAnimation(animName)) {
            this.mark.setCurrentAnimation(animName);
        }
    },

    trySetAnim: function (animName) {

        if (!this.sheet.isCurrentAnimation(animName)) {
            this.sheet.setCurrentAnimation(animName);
        }
    }

});
