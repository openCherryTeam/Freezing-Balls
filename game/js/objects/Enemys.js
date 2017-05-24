class Enemys extends Phaser.Group {


    get SpanPos() {
        return this.spanPos;
    }

    set SpanPos(value) {
        this.spanPos = value;
    }

    get IsStund() {
        return this.isStund;
    }

    set IsStund(value) {
        this.isStund = value;
    }

    constructor(that) {
        super(that.game, null, "group", false, false, Phaser.Physics.ARCADE);
        this.enableBody = true;
        this.physicsBodyType = Phaser.Physics.ARCADE;
        this.SpanPos = that.findObjectsByType('enemy', that.map, 'objectsLayer');
        this.IsStund = false;

    }
    createEnemy(posNr) {
        var position = this.SpanPos[posNr];
        var enemy = this.getFirstExists(false);
        if (enemy) {
            enemy.reset(position.x, position.y, 'enemy');
        } else {
            enemy = this.create(position.x, position.y, 'enemy');
        }
        enemy.outOfBoundsKill = true;
        enemy.checkWorldBounds = true;
    }
    updateEnemys(gameUpdate) {
        var player = gameUpdate.player;
        if (this.IsStund)
            return;
        else {
            this.forEachAlive(function(enemy) {
                if (enemy.visible && enemy.inCamera) {
                    // this.game.physics.arcade.moveToObject(enemy, this.player, enemy.speed);
                    this.game.physics.arcade.moveToObject(enemy, player, 25);
                    // this.enemyMovementHandler(enemy);
                }
                if (enemy.visible && !enemy.inCamera) {

                    switch (Math.round(Math.random() * 3)) {
                        case 0:
                            enemy.body.velocity.y -= 2;
                            break;
                        case 1:
                            enemy.body.velocity.y += 1;
                            break;
                        case 2:
                            enemy.body.velocity.x -= 3;
                            break;
                        case 3:
                            enemy.body.velocity.x += 5;
                            break;
                    }

                }
            }, this);
        }
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
        this.Drop.create(enemy.x, enemy.y, "snowball");
        enemy.kill();
        bullet.kill();
    }

    enemyHitPlayer(player, enemy) {
        if (this.IsStund)
            return;
        player.removeLives(55);
        this.IsStund = true;
        this.camera.shake(0.01, 100, true, Phaser.Camera.SHAKE_BOTH, true);

        this.timer = this.game.time.create();
        this.timerEvent = this.timer.add(400, this.enemies.endStund, this);
        this.timer.start();
    }

    endStund() {
        this.IsStund = false;
    }

}