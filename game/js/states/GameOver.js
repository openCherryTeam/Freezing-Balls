class GameOver extends Phaser.State {
    preload() {
        //assets we'll use in the loading screen
    }
    create() {
        //loading screen will have a white background
        this.game.stage.backgroundColor = '#578';

        //scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.text = game.add.text (100, 100, 'Game Over', {font: "32px Arial", fill: "#ee0000"});

    }
}