class GameState extends Phaser.State {
    get FireRate() {
        return this.fireRate;
    }
    get NextFire() {
        return this.nextFire;
    }
    set NextFire(value) {
        this.nextFire = value;
    }
    create() {
        this.fireRate = 100;
        this.nextFire = 0;
        this.map = this.game.add.tilemap('level1');
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('tilemap32', 'gameTiles');
        //create layer
        this.backgroundlayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');
        //collision on blockedLayer
        this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
        //resizes the game world to match the layer dimensions
        this.backgroundlayer.resizeWorld();
        this.createItems();
        this.createDoors();
        //create player
        var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer')
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'Player');
        this.player.frame = 5;
        this.player.animations.add('right', [5, 6, 7, 0, 1, 2, 3, 4], 16, true, true);
        this.player.animations.add('left', [13, 14, 15, 8, 9, 10, 11, 12], 16, true, true);
        this.player.animations.add('right', [5, 6, 7, 0, 1, 2, 3, 4], 16, true, true);
        this.player.animations.add('left', [13, 14, 15, 8, 9, 10, 11, 12], 16, true, true);
        //this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
        this.game.physics.arcade.enable(this.player);
        //the camera will follow the player in the world
        this.game.camera.follow(this.player);
        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(5, 'bullet');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.createEnemy();
        this.myHealthBar = new HealthBar(this.game, {
            width: 40
            , height: 10
            , x: 30
            , y: 20
            , bar: {
                color: '#54ff00'
            }
            , bg: {
                color: '#cc2424'
            }
        });
        // the width will be set to 50% of the actual size so the new value will be 60
        this.myHealthBar.setPercent(50);
        this.myHealthBar.setFixedToCamera(true);
    }
    update() {
        //collision
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
        this.game.physics.arcade.collide(this.enemies, this.bullets, this.enemyHitBullet, null, this);
        this.game.physics.arcade.collide(this.bullets, this.blockedLayer, this.bulletHitWall, null, this);
        this.game.physics.arcade.collide(this.enemies, this.blockedLayer);
        //player movement
        this.player.body.velocity.x = 0;
        if (this.cursors.up.isDown || this.input.keyboard.isDown(Phaser.Keyboard.W)) {
            if (this.player.body.velocity.y == 0) this.player.body.velocity.y -= 50;
        }
        else if (this.cursors.down.isDown || this.input.keyboard.isDown(Phaser.Keyboard.S)) {
            if (this.player.body.velocity.y == 0) this.player.body.velocity.y += 50;
        }
        else {
            this.player.body.velocity.y = 0;
        }
        if (this.cursors.left.isDown || this.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x -= 50;
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown || this.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x += 50;
            this.player.animations.play('right');
        }
        else {
            this.player.animations.stop();
        }
        if (this.game.input.activePointer.isDown) {
            this.fire();
        }
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
        this.enemies.forEachAlive(function (enemy) {
            if (enemy.visible && enemy.inCamera) {
                // this.game.physics.arcade.moveToObject(enemy, this.player, enemy.speed);
                this.game.physics.arcade.moveToObject(enemy, this.player, 25);
                this.enemyMovementHandler(enemy);
            }
        }, this);
    }
    enemyMovementHandler(enemy) {
        // Left
        if (enemy.body.velocity.x < 0 && enemy.body.velocity.x <= -Math.abs(enemy.body.velocity.y)) {
            enemy.animations.play('left');
            // Right
        }
        else if (enemy.body.velocity.x > 0 && enemy.body.velocity.x >= Math.abs(enemy.body.velocity.y)) {
            enemy.animations.play('right');
            // Up
        }
        else if (enemy.body.velocity.y < 0 && enemy.body.velocity.y <= -Math.abs(enemy.body.velocity.x)) {
            enemy.animations.play('up');
            // Down
        }
        else {
            enemy.animations.play('down');
        }
    }
    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    findObjectsByType(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function (element) {
            if (element.properties.type === type) {
                //Phaser uses top left, Tiled bottom left so we have to adjust
                //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
                //so they might not be placed in the exact position as in Tiled
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    }
    //create a sprite from an object
    createFromTiledObject(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);
        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function (key) {
            sprite[key] = element.properties[key];
        });
    }
    createItems() {
        //create items
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var item;
        var result = this.findObjectsByType('item', this.map, 'objectsLayer');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.items);
        }, this);
    }
    createDoors() {
        //create doors
        this.doors = this.game.add.group();
        this.doors.enableBody = true;
        var result = this.findObjectsByType('door', this.map, 'objectsLayer');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.doors);
        }, this);
    }
    createEnemy() {
        var result = this.findObjectsByType('enemy', this.map, 'objectsLayer');
        var game = this;
        result.forEach(function (element) {
            var enemy = this.enemies.getFirstExists(false);
            if (enemy) {
                enemy.reset(element.x, element.y, 'enemy');
            }
            else {
                enemy = this.enemies.create(element.x, element.y, 'enemy');
            }
            enemy.outOfBoundsKill = true;
            enemy.checkWorldBounds = true;
        }, this);
    }
    collect(player, collectable) {
        console.log('autsch!');
        //remove sprite
        collectable.destroy();
    }
    enterDoor(player, door) {
        console.log('entering door that will take you to ' + door.targetTilemap + ' on x:' + door.targetX + ' and y:' + door.targetY);
    }
    fire() {
        if (this.time.now > this.NextFire && this.bullets.countDead() > 0) {
            this.NextFire = this.time.now + this.FireRate;
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.player.x, this.player.y);
            this.physics.arcade.moveToPointer(bullet, 60);
        }
    }
    enemyHitBullet(bullet, enemy) {
        if (this.enemies.getIndex(enemy) > -1) this.enemies.remove(enemy);
        enemy.kill();
        bullet.kill();
    }
    bulletHitWall(bullet, wall) {
        bullet.kill();
    }
    render() {
        // console.log('Active Bullets: ' + this.bullets.countLiving() + ' / ' + this.bullets.total, 32, 32);
        // console.log(this.player, 32, 450);
    }
}