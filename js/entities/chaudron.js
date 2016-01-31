game.Chaudron = me.Entity.extend({


    init: function (x, y) {

        var settings = {};
        var imageName = "Chaudron" ;
        settings.image = me.loader.getImage(imageName);
        settings.width = 250;
        settings.height = 185;
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        this.renderable = new me.Container(-125, -125, 250, 185);

        var animSheet = new me.AnimationSheet(0, 0, settings);
        this.renderable.addChild(animSheet);

        this.sheet = animSheet;

        animSheet.animationspeed = 250;
        animSheet.addAnimation("on", [0,2,1,3]);
        animSheet.addAnimation("off", [4,5,6,7]);

        animSheet.setCurrentAnimation("on");

      //  this.body.bounds.addShape(new me.Ellipse(0, 0, 160, 80));

        z = 1000 + y;
    },


    turnOn: function() {
        this.sheet.setCurrentAnimation("on");
        this.sheet.animationpause = false;
    },
    /*
    turnOff: function() {
        this.sheet.setCurrentAnimation("off");
        setTimeout(function () {
            this.sheet.animationpause = true;
        }, this.animSheet.animationspeed * 4);
    },*/

});

