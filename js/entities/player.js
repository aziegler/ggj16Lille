game.PlayerEntity = me.Entity.extend({

    init: function(x, y) {
        var settings = {};
        settings.image = me.loader.getImage('walk_side');
        settings.width = 64;
        settings.height = 64;
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        this.renderable = new me.AnimationSheet(x,y,settings);
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 15);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk_side",  [0, 1, 2, 3, 4, 5, 6, 7]);
        this.renderable.addAnimation("walk_up",  [0, 1, 2, 3, 4, 5, 6, 7]);
        this.renderable.addAnimation("walk_down",  [0, 1, 2, 3, 4, 5, 6, 7]);

        this.renderable.addAnimation("dance1_side",  [0, 1, 2, 3, 4, 5, 6, 7]);
        this.renderable.addAnimation("dance1_up",  [0, 1, 2, 3, 4, 5, 6, 7]);
        this.renderable.addAnimation("dance1_down",  [0, 1, 2, 3, 4, 5, 6, 7]);

        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand",  [0]);

        this.renderable.addAnimation("carry",  [0, 1, 2]);
        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand");
    },


    "trySetAnim":function(anim) {
        console.log("anim: " + anim);
        if (!this.renderable.isCurrentAnimation(anim)) {
            this.renderable.setCurrentAnimation(anim);
        }
    },

    update: function(dt) {
        if (me.input.isKeyPressed('left')) {
            x = -1;
            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            // change to the walking animation

            this.trySetAnim("walk_side");
        }  else if (me.input.isKeyPressed('right')) {
            x = 1;
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            // change to the walking animation

            this.trySetAnim("walk_side");
        } else if (me.input.isKeyPressed('up')) {
            y = 1;
            // update the entity velocity
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            // change to the walking animation

            this.trySetAnim("walk_up");
        } else if (me.input.isKeyPressed('down')) {
            y = -1;
            // update the entity velocity
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            // change to the walking animation

            this.trySetAnim("walk_down");
        } else {
            this.body.vel.x = 0;
            // change to the standing animation
            this.renderable.setCurrentAnimation("stand");
        }

        if(Math.abs(this.body.vel.y) < this.body.accel.y ) {
        /*    if(this.direction.x > 0)
                this.renderable.flipX(false);

            if(this.direction.x < 0)
                this.renderable.flipX(true);
*/
        }

        if(me.input.isKeyPressed('dance')) {
            if(y > 0)
                this.trySetAnim("dance1_up");
            if(y < 0)
                this.trySetAnim("dance1_down");

            if(x != 0)
                this.trySetAnim("dance1_side");
        }


        if (me.input.isKeyPressed('jump')) {
            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
            }
        }

        // apply physics to the body (this moves the entity)
      //  this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);
        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        switch (response.b.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                // Simulate a platform object
                if (other.type === "platform") {
                    if (this.body.falling &&
                        !me.input.isKeyPressed('down') &&
                            // Shortest overlap would move the player upward
                        (response.overlapV.y > 0) &&
                            // The velocity is reasonably fast enough to have penetrated to the overlap depth
                        (~~this.body.vel.y >= ~~response.overlapV.y)
                    ) {
                        // Disable collision on the x axis
                        response.overlapV.x = 0;
                        // Repond to the platform (it is solid)
                        return true;
                    }
                    // Do not respond to the platform (pass through)
                    return false;
                }
                break;

            case me.collision.types.ENEMY_OBJECT:
                if ((response.overlapV.y>0) && !this.body.jumping) {
                    // bounce (force jump)
                    this.body.falling = false;
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    // set the jumping flag
                    this.body.jumping = true;
                }
                else {
                    // let's flicker in case we touched an enemy
                    this.renderable.flicker(750);
                }
                return false;
                break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    }



}) || { direction: {
    x: 0,
        y: 0,
}}
