class GameState extends Phaser.State {

    create() {
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
        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();
        var bulletGroup = new BounceBall(this.game);
        this.bullets = this.game.add.existing(bulletGroup);

        this.player = this.createPlayer();

        var enemyGroup = new Enemys(this.game);
        this.enemies = this.game.add.existing(enemyGroup);

        this.createEnemy();
        this.myHealthBar = new HealthBar(this.game, {
            width: 40,
            height: 10,
            x: 30,
            y: 20,
            bar: {
                color: '#54ff00'
            },
            bg: {
                color: '#cc2424'
            }
        });
        // the width will be set to 50% of the actual size so the new value will be 60
        this.myHealthBar.setPercent(10);
        this.myHealthBar.setFixedToCamera(true);
    }
    update() {
        //collision
        // this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        // this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

        //updates für movements/collisionen
        this.player.move(this);
        this.enemies.updateEnemys(this);
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.collide(this.enemies, this.blockedLayer);
        this.game.physics.arcade.collide(this.player.Bullets, this.blockedLayer, this.player.Bullets.bulletHitWall, null, this);
        this.game.physics.arcade.collide(this.enemies, this.bullets, this.enemies.enemyHitBullet, null, this);


    }

    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    findObjectsByType(type, map, layer) {
            var result = new Array();
            map.objects[layer].forEach(function(element) {
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
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    }
    createPlayer() {
        var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
        var game = this.game;
        var myPlayer = new Player(this.game, result[0].x, result[0].y, "Player", null, this.bullets);
        return this.game.add.existing(myPlayer);
    }
    createEnemy() {
        var result = this.findObjectsByType('enemy', this.map, 'objectsLayer');
        var game = this;
        result.forEach(function(position) {
            this.enemies.createEnemy(position);
        }, this);
    }


    // collect(player, collectable) {
    //     console.log('autsch!');
    //     //remove sprite
    //     collectable.destroy();
    // }

    // createItems() {
    //     //create items
    //     this.items = this.game.add.group();
    //     this.items.enableBody = true;
    //     var item;
    //     var result = this.findObjectsByType('item', this.map, 'objectsLayer');
    //     result.forEach(function(element) {
    //         this.createFromTiledObject(element, this.items);
    //     }, this);
    // }
    // createDoors() {
    //     //create doors
    //     this.doors = this.game.add.group();
    //     this.doors.enableBody = true;
    //     var result = this.findObjectsByType('door', this.map, 'objectsLayer');
    //     result.forEach(function(element) {
    //         this.createFromTiledObject(element, this.doors);
    //     }, this);
    // }

    // enterDoor(player, door) {
    //     console.log('entering door that will take you to ' + door.targetTilemap + ' on x:' + door.targetX + ' and y:' + door.targetY);
    // }

    // render() {
    // console.log('Active Bullets: ' + this.bullets.countLiving() + ' / ' + this.bullets.total, 32, 32);
    // console.log(this.player, 32, 450);
    // }
}