var TopDownGame = TopDownGame || {};

//loading the game assets
TopDownGame.Preload = function() {};

TopDownGame.Preload.prototype = {
    preload: function() {

        //load game assets
        this.load.tilemap('level1', './assets/tilemaps/mymap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('gameTiles', './assets/images/tilemap.png');
        this.load.image('player', './assets/images/player.png');
        this.load.image('browndoor', './assets/images/browndoor.png');
        this.load.image('bullet', './assets/images/snowball.png');
        this.load.image('snowball', './assets/images/snowball.png');
        this.load.image('piabaum', './assets/images/piabaum.png');
        this.load.image('enemy', './assets/images/player.png');
        this.load.spritesheet('Player', './assets/Player/Move_Right.png', 32, 32);
        //enemy

    },
    create: function() {
        this.state.start('Game');
    }
};