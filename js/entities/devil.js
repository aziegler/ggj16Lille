game.Devil = me.Entity.extend({


    init: function (x, y) {

        var settings = {};
        var imageName = "Demon" ;
        settings.image = me.loader.getImage(imageName);
        settings.width = 360;
        settings.height = 294;
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);

        this.renderable = new me.Container(0, -380, 360, 294);

        var animSheet = new me.AnimationSheet(0, 0, settings);
        this.renderable.addChild(animSheet);

        this.sheet = animSheet;

        animSheet.animationspeed = 150;
        animSheet.addAnimation("base", [0,1,2,3,4,5]);
 
        animSheet.setCurrentAnimation("base");

      //  this.body.bounds.addShape(new me.Ellipse(0, 0, 160, 80));

        z = 1000 + y;
    }
    /*
    turnOff: function() {
        this.sheet.setCurrentAnimation("off");
        setTimeout(function () {
            this.sheet.animationpause = true;
        }, this.animSheet.animationspeed * 4);
    },*/

});

