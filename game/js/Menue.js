var TopDownGame = TopDownGame || {};

TopDownGame.Menue = function() {};

//setting game configuration and loading the assets for the loading screen
TopDownGame.Menue.prototype = {
    preload: function() {
        this.game.load.image('bgSpace', './assets/images/snowball.png')
    },

    create: function() {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.speed = 10;

        // this.bg = this.game.add.tileSprite(0, 0, 1782, 600, 'bgSpace');
        // this.bg.autoScroll(-this.speed, 0);

        var style = { font: "48px Arial", fill: "#DE5F3D", align: "center" };
        this.title = this.game.add.text(250, 170, "Space Shooter", style);

        var style2 = { font: "28px Arial", fill: "#DE5F3D", align: "center" };
        this.help = this.game.add.text(250, 230, "Press `Enter` Key to start", style2);
    },

    update: function() {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
            this.game.state.start('Preload');
    }
};