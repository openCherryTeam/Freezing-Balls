class Bullets extends Phaser.Group {

    get FireRate() {
        return this.fireRate;
    }

    set FireRate(value) {
        this.fireRate = value;
    }

    get NextFire() {
        return this.nextFire;
    }

    set NextFire(value) {
        this.nextFire = value;
    }

    set MultipleBulletCount(value) {
        this.createMultiple(value, 'bullet');
    }

    constructor(game) {
        super(game, null, "group", false, false, Phaser.Physics.ARCADE);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
        this.MultipleBulletCount = 15;
        this.setAll('checkWorldBounds', true);
        this.setAll('outOfBoundsKill', true);
        this.FireRate = 1000;
        this.NextFire = 0;
    }

    fire(gameUpdate, playerX, playery) {
        if (gameUpdate.time.now > this.NextFire && this.countDead() > 0) {
            this.NextFire = gameUpdate.time.now + this.FireRate;
            var bullet = this.getFirstDead();
            bullet.reset(playerX, playery);
            bullet = this.modifyBullet(bullet);
            gameUpdate.physics.arcade.moveToPointer(bullet, 60);
        }
    }

    modifyBullet(bullet) {
        return bullet;
    }

    bulletHitWall(bullet, wall) {
        bullet.kill();
    }

}