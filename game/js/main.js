class Game extends Phaser.Game {
    constructor() {
        let width = document.documentElement.clientWidth > 400 ? 400 : document.documentElement.clientWidth
        let height = Math.round(0.6 * width);
        super(width, height, Phaser.CANVAS, 'gameArea', null, false, false)
        this.state.add('Boot', Boot, false);
        this.state.add('Preload', Preload, false);
        this.state.add('Game', GameState, false);
        this.state.add('GameOver', GameOver, false);
        this.state.start('Boot');
    }
}
window.game = new Game();