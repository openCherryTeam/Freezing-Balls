class Preload extends Phaser.State {
    preload() {
        //load game assets
        // this.load.tilemap('level1', './assets/tilemaps/mymap.json', null, Phaser.Tilemap.TILED_JSON);
        // this.load.image('gameTiles', './assets/images/tilemap.png');
        this.load.tilemap('level1', './assets/tilemaps/tilemap32x32.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('gameTiles', './assets/images/tilemap32.png');
        this.load.image('player', './assets/images/player.png');
        this.load.image('browndoor', './assets/images/browndoor.png');
        this.load.image('bullet', './assets/images/snowball.png');
        this.load.image('snowball', './assets/images/snowball.png');
        this.load.image('piabaum', './assets/images/piabaum.png');
        this.load.image('enemy', './assets/images/player.png');
        this.load.spritesheet('Player', './assets/animations/Player/Movement.png', 32, 32);
        //enemy
    }
    create() {
        // this.game.smoothed = false;
        // this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.setMinMax(400, 240, 400 * 3, 240 * 3);
        // this.game.load.onLoadComplete.add(this.loadComplete, this);
        this.loadComplete();
    }
    loadComplete() {
        this.state.start('Game');
    }
}