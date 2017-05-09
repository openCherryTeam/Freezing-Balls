class Enemys extends Phaser.Group {


    constructor(game) {
        super(game, null, "group", false, false, Phaser.Physics.ARCADE);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
    }
    createEnemy(position) {
        var enemy = this.getFirstExists(false);
        if (enemy) {
            enemy.reset(position.x, position.y, 'enemy');
        } else {
            enemy = this.create(position.x, position.y, 'enemy');
        }
        enemy.outOfBoundsKill = true;
        enemy.checkWorldBounds = true;
    }
    updateEnemys(player) {
        // this.enemies.children.forEach(function(element) {
        //     let velx = 0,
        //         vely = 0;
        //     switch (Math.round(Math.random() * 3)) {
        //         case 0:
        //             element.body.velocity.y -= 2;
        //             break;
        //         case 1:
        //             element.body.velocity.y += 1;
        //             break;
        //         case 2:
        //             element.body.velocity.x -= 3;
        //             break;
        //         case 3:
        //             element.body.velocity.x += 5;
        //             break;
        //     }
        //  }, this);
        this.forEachAlive(function(enemy) {
            if (enemy.visible && enemy.inCamera) {
                // this.game.physics.arcade.moveToObject(enemy, this.player, enemy.speed);
                this.game.physics.arcade.moveToObject(enemy, player, 25);
                // this.enemyMovementHandler(enemy);
            }
        }, this);
    }
    enemyMovementHandler(enemy) {
        // Left
        if (enemy.body.velocity.x < 0 && enemy.body.velocity.x <= -Math.abs(enemy.body.velocity.y)) {
            enemy.animations.play('left');
            // Right
        } else if (enemy.body.velocity.x > 0 && enemy.body.velocity.x >= Math.abs(enemy.body.velocity.y)) {
            enemy.animations.play('right');
            // Up
        } else if (enemy.body.velocity.y < 0 && enemy.body.velocity.y <= -Math.abs(enemy.body.velocity.x)) {
            enemy.animations.play('up');
            // Down
        } else {
            enemy.animations.play('down');
        }
    }

    enemyHitBullet(bullet, enemy) {
        enemy.kill();
        bullet.kill();
    }

    bulletHitWall(bullet, wall) {
        bullet.kill();
    }
}