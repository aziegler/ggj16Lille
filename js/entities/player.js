var Marks = me.Renderable.extend({
    /**
     * constructor
     */
    init: function () {
        this.markCount = 0;
        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [0, 0, 10, 10]);

        // create a font
        this.font = new me.Font("Arial", 18, "#ffffff");

    },

    /**
     * update function
     */
    update: function (dt) {
        return true;
    },

    /**
     * draw the score
     */
    draw: function (renderer) {
        this.font.draw(renderer, this.markCount, 26, 8);
    }
});


game.PlayerEntity = me.Entity.extend({


    init: function (x, y, id, playerIdx) {

        this.direction = "right";
        this.animation = 'stand';

        this.playerId = id;

        this.marks = [];

        var settings = {};
        var imageName = "placeholderchara" + playerIdx;
        settings.image = me.loader.getImage(imageName);
        settings.width = 64;
        settings.height = 64;
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        this.renderable = new me.Container(0, 0, 64, 64);

        var animSheet = new me.AnimationSheet(0, 0, settings);
        this.renderable.addChild(animSheet);

        this.mark = new Marks();
        this.renderable.addChild(this.mark);


        this.sheet = animSheet;

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        animSheet.addAnimation("stand_side", [0]);
        animSheet.addAnimation("stand_up", [0]);
        animSheet.addAnimation("stand_down", [0]);

        animSheet.addAnimation("dead_side", [2]);
        animSheet.addAnimation("dead_up", [2]);
        animSheet.addAnimation("dead_down", [2]);


        animSheet.addAnimation("walk_side", [0]);
        animSheet.addAnimation("walk_up", [0]);
        animSheet.addAnimation("walk_down", [0]);

        animSheet.addAnimation("dance1_side", [1]);
        animSheet.addAnimation("dance1_up", [1]);
        animSheet.addAnimation("dance1_down", [1]);


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

    refresh: function (playerInfo) {
        this.pos.x = playerInfo.x;
        this.pos.y = playerInfo.y;

        this.mark.markCount = playerInfo.marks.length;

        var dir = playerInfo.direction;

        this.sheet.flipX(dir == "left");

        if (dir == "left" || dir == "right") {
            dir = "side";
        }

        var animName = playerInfo.animation + "_" + dir;
        this.trySetAnim(animName);
    },


    trySetAnim: function (animName) {

        if (!this.sheet.isCurrentAnimation(animName)) {
            this.sheet.setCurrentAnimation(animName);
        }
    }

});
