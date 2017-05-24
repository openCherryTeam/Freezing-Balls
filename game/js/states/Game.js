class GameState extends Phaser.State {

    get Drop() {
        return this.drop;
    }

    set Drop(value) {
        this.drop = value;
    }

    get AnzahlEnemys() {
        return this.anzahlEnemys;
    }

    set AnzahlEnemys(value) {
        console.log(value);
        this.anzahlEnemys = value;
    }

    addAnzahlEnemys(addValue) {
        this.AnzahlEnemys = this.AnzahlEnemys + addValue;
    }

    get Points() {
        return this.points;
    }

    set Points(value) {
        this.points = value;
    }

    updatePoints(addValue) {

        this.Points += addValue;

        this.points_text.setText('Punkte: ' + this.Points);

    }

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
        this.myHealthBar.setPercent(100);
        this.myHealthBar.setFixedToCamera(true);


        this.player = this.createPlayer();

        var enemyGroup = new Enemys(this);
        this.enemies = this.game.add.existing(enemyGroup);

        this.AnzahlEnemys = 1;
        this.createEnemy(this.AnzahlEnemys);

        var money = game.add.group();
        money.enableBody = true;
        this.Drop = money;

        // Points
        this.Points = 0;
        this.points_text = game.add.text (10, 30, 'Punkte: 0', {font: "10px Arial", fill: "#000000"});
        this.points_text.fixedToCamera = true;

        this.music = this.game.add.audio('musik');
        this.music.play();
    }

    update() {
        //collision
        // this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);

        //updates für movements/collisionen
        this.player.move(this);
        this.player.regenerateLives(1);
        this.enemies.updateEnemys(this);
        this.game.physics.arcade.collide(this.player, this.blockedLayer);
        this.game.physics.arcade.collide(this.enemies, this.blockedLayer);
        this.game.physics.arcade.collide(this.player.Bullets, this.blockedLayer, this.player.Bullets.bulletHitWall, null, this);
        var rueckgabe = this.game.physics.arcade.collide(this.enemies, this.bullets, this.enemies.enemyHitBullet, null, this);
        if (rueckgabe) {
            this.addAnzahlEnemys(1);
            this.createEnemy(this.AnzahlEnemys);
            this.updatePoints(1);
        }
        this.game.physics.arcade.collide(this.enemies, this.player, this.enemies.enemyHitPlayer, null, this);

        this.game.physics.arcade.overlap(this.player, this.Drop, this.collect, null, this);


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
        var myPlayer = new Player(this.game, result[0].x, result[0].y, "Player", null, this.bullets, this.myHealthBar);
        return this.game.add.existing(myPlayer);
    }

    createEnemy(anzahl) {
        if (!anzahl)
            anzahl = 1;
        for (var index = 0; index < anzahl; index++) {
            var position = Math.abs(Math.round(Math.random() * this.enemies.spanPos.length - 1));
            this.enemies.createEnemy(position);
        }
    }

    createAllEnemy() {
        var result = this.findObjectsByType('enemy', this.map, 'objectsLayer');
        result.forEach(function(position) {
            this.enemies.createEnemy(position);
        }, this);
    }


    collect(player, collectable) {
        console.log('autsch!');
        //remove sprite
        collectable.destroy();
        this.updatePoints(2);
    }

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