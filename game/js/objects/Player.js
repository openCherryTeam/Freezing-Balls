class Player extends Phaser.Sprite {

    get Bullets() {
        return this.bullets;
    }
    set Bullets(value) {
        this.bullets = value;
    }


    constructor(game, x, y, key, frame, bullets) {
        super(game, x, y, key, frame);
        this.frame = 5;
        this.animations.add('right', [5, 6, 7, 0, 1, 2, 3, 4], 16, true, true);
        this.animations.add('left', [13, 14, 15, 8, 9, 10, 11, 12], 16, true, true);
        this.game.physics.arcade.enable(this);
        //the camera will follow the player in the world
        game.camera.follow(this);
        this.Bullets = bullets;
    }

    move(gameUpdate) {
        this.body.velocity.x = 0;
        if (gameUpdate.cursors.up.isDown || gameUpdate.input.keyboard.isDown(Phaser.Keyboard.W)) {
            if (this.body.velocity.y == 0) this.body.velocity.y -= 50;
        } else if (gameUpdate.cursors.down.isDown || gameUpdate.input.keyboard.isDown(Phaser.Keyboard.S)) {
            if (this.body.velocity.y == 0) this.body.velocity.y += 50;
        } else {
            this.body.velocity.y = 0;
        }
        if (gameUpdate.cursors.left.isDown || gameUpdate.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.body.velocity.x -= 50;
            this.animations.play('left');
        } else if (gameUpdate.cursors.right.isDown || gameUpdate.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.body.velocity.x += 50;
            this.animations.play('right');
        } else {
            this.animations.stop();
        }
        if (this.game.input.activePointer.isDown) {
            this.bullets.fire(gameUpdate, this.x, this.y);
        }
    }

}