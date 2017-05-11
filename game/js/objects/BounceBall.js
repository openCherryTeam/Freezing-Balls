class BounceBall extends Bullets {


    constructor(game) {
        super(game);
        console.log("ads");
    }

    modifyBullet(bullet) {
        bullet.body.collideWorldBounds = true;
        bullet.body.bounce.setTo(1, 1);
        bullet.wallHitCounter = 5;
        return bullet;
    }

    bulletHitWall(bullet, wall) {
        bullet.wallHitCounter--;
        if (bullet.wallHitCounter <= 0) {
            bullet.kill();
        }

    }
}