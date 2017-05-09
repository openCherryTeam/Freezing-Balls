class Bullets extends Phaser.Group {

    get FireRate() {
        return this.fireRate;
    }
    get NextFire() {
        return this.nextFire;
    }
    set NextFire(value) {
        this.nextFire = value;
    }


    constructor(game) {
        super(game, null, "group", false, false, Phaser.Physics.ARCADE);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
        this.createMultiple(5, 'bullet');
        this.setAll('checkWorldBounds', true);
        this.setAll('outOfBoundsKill', true);
        this.fireRate = 100;
        this.nextFire = 0;
    }
    fire(gameUpdate, playerX, playery) {
        if (gameUpdate.time.now > this.NextFire && this.countDead() > 0) {
            this.NextFire = gameUpdate.time.now + this.FireRate;
            var bullet = this.getFirstDead();
            bullet.reset(playerX, playery);
            gameUpdate.physics.arcade.moveToPointer(bullet, 60);
        }
    }


}