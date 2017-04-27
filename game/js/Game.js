var TopDownGame = TopDownGame || {};

//title screen
TopDownGame.Game = function() {};

TopDownGame.Game.prototype = {
    fireRate: 100,
    nextFire: 0,
    fire: function() {
        if (this.time.now > this.nextFire && this.bullets.countDead() > 0) {
            this.nextFire = this.time.now + this.fireRate;
            var bullet = this.bullets.getFirstDead();
            bullet.reset(this.player.x - 8, this.player.y - 8);
            this.physics.arcade.moveToPointer(bullet, 30);
        }
    },
    render: function() {
        // console.log('Active Bullets: ' + this.bullets.countLiving() + ' / ' + this.bullets.total, 32, 32);
        // console.log(this.player, 32, 450);

    },

    create: function() {
        this.map = this.game.add.tilemap('level1');

        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('tilemap', 'gameTiles');

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
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'player');
        this.game.physics.arcade.enable(this.player);

        //the camera will follow the player in the world
        this.game.camera.follow(this.player);

        //move player with cursor keys
        this.cursors = this.game.input.keyboard.createCursorKeys();




        // game.physics.startSystem(Phaser.Physics.ARCADE);

        // game.stage.backgroundColor = '#313131';

        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(50, 'bullet');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);

        // sprite = game.add.sprite(400, 300, 'arrow');
        // sprite.anchor.set(0.5);

        // game.physics.enable(sprite, Phaser.Physics.ARCADE);

        // sprite.body.allowRotation = false;

    },
    createItems: function() {
        //create items
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var item;
        result = this.findObjectsByType('item', this.map, 'objectsLayer');
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.items);
        }, this);
    },
    createDoors: function() {
        //create doors
        this.doors = this.game.add.group();
        this.doors.enableBody = true;
        result = this.findObjectsByType('door', this.map, 'objectsLayer');

        result.forEach(function(element) {
            this.createFromTiledObject(element, this.doors);
        }, this);
    },

    //find objects in a Tiled layer that containt a property called "type" equal to a certain value
    findObjectsByType: function(type, map, layer) {
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
    },
    //create a sprite from an object
    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },
    update: function() {
        //collision
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

        //player movement

        this.player.body.velocity.x = 0;

        if (this.cursors.up.isDown) {
            if (this.player.body.velocity.y == 0)
                this.player.body.velocity.y -= 50;
        } else if (this.cursors.down.isDown) {
            if (this.player.body.velocity.y == 0)
                this.player.body.velocity.y += 50;
        } else {
            this.player.body.velocity.y = 0;
        }
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x -= 50;
        } else if (this.cursors.right.isDown) {
            this.player.body.velocity.x += 50;
        }



        // sprite.rotation = game.physics.arcade.angleToPointer(sprite);

        if (this.game.input.activePointer.isDown) {
            this.fire();
        }
    },
    collect: function(player, collectable) {
        console.log('autsch!');
        //remove sprite
        collectable.destroy();
    },
    enterDoor: function(player, door) {
        console.log('entering door that will take you to ' + door.targetTilemap + ' on x:' + door.targetX + ' and y:' + door.targetY);
    },

};