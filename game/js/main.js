class Game extends Phaser.Game {
    constructor() {
        let width = document.documentElement.clientWidth > 400 ? 400 : document.documentElement.clientWidth
        let height = Math.round(0.6 * width);
        super(width, height, Phaser.CANVAS, 'gameArea', null, false, false)
        this.state.add('Boot', Boot, false);
        this.state.add('Preload', Preload, false);
        this.state.add('Game', GameState, false);
        this.state.start('Boot');
    }
}

<<<<<<< HEAD
window.game = new Game();
=======
TopDownGame.game = new Phaser.Game(160, 160, Phaser.AUTO, 'gameArea', null, false, false);

TopDownGame.game.state.add('Boot', TopDownGame.Boot);
// TopDownGame.game.state.add('Menue', TopDownGame.Menue);
TopDownGame.game.state.add('Preload', TopDownGame.Preload);
TopDownGame.game.state.add('Game', TopDownGame.Game);

TopDownGame.game.state.start('Boot');
>>>>>>> origin/master
