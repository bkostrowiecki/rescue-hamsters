/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { Tiles as TileTypes } from '../helpers/tiles';
import { HamsterEntity } from '../entities/hamster';
import { CursorEntity } from '../entities/cursor';
import { BloodBurstEntity } from '../entities/bloodBurst';
import { MagicGlowEntity } from '../entities/magicGlow';

export enum PlayerTileType {
    GROUND,
    SPRING
}

export class Gameplay extends Phaser.State {
    private MAP_WIDTH = 240;
    private MAP_HEIGHT = 240;

    private TILE_SIZE = 32;

    private playerMap: Phaser.Tilemap;
    private playerMapLayer: Phaser.TilemapLayer;

    private predefinedMap: Phaser.Tilemap;
    private predefinedMapLayer: Phaser.TilemapLayer;

    private hamster: HamsterEntity;
    private cursor: CursorEntity;
    private currentTile: PlayerTileType;

    private groundKey: Phaser.Key;
    private springKey: Phaser.Key;

    private groundButton: Phaser.Sprite;
    private springButton: Phaser.Sprite;

    private startPoint: Phaser.Point;
    private startMagicGlow: MagicGlowEntity;
    private finishMagicGlow: MagicGlowEntity;

    private deathSpace: Phaser.Sprite;

    private deathCounter = 0;
    private savedCounter = 0;

    private deathCounterText: Phaser.Text;
    private savedCounterText: Phaser.Text;

    private levels = [
        'level-01',
        'level-02',
        'level-03'
    ];

    private currentLevelIndex = 0;

    preload() {}

    private generateCsvMapFromArray() {
        let data = '';

        for (let iy = 0; iy < this.MAP_WIDTH; iy++) {
            for (let jx = 0; jx < this.MAP_HEIGHT; jx++) {
                if (iy > 15) {
                    data += TileTypes.NONE;
                } else {
                    data += TileTypes.NONE;
                }

                if (jx < this.MAP_WIDTH) {
                    data += ',';
                }
            }

            if (iy < this.MAP_HEIGHT) {
                data += '\n';
            }
        }

        return data;
    }

    create() {
        this.game.cache.addTilemap(
            'dynamicMap',
            null,
            this.generateCsvMapFromArray(),
            Phaser.Tilemap.CSV
        );

        const background = this.game.add.image(
            this.game.world.centerX - this.TILE_SIZE,
            this.game.world.centerY,
            'background'
        );
        background.anchor.set(0.5);
        background.scale.set(1);

        this.setupUi();

        this.setupPredefinedMap(this.levels[this.currentLevelIndex]);
        this.setupPlayerMap();

        this.setupPhysics();

        this.setupDeathSpace();

        this.hamster = new HamsterEntity(this.game);
        this.cursor = new CursorEntity(this.game);

        this.placeHamsterOnStart();

        this.setupTexts();

        const nextLevelHotKey = this.game.input.keyboard.addKey(
            Phaser.Keyboard.P
        );
        nextLevelHotKey.onDown.add(() => {
            this.setupNextLevel();
            this.placeHamsterOnStart();
        }, this);
    }

    private setupTexts() {
        this.deathCounterText = this.game.add.text(0, 0, '', this.getFontStyles());
    }

    private placeHamsterOnStart() {
        this.hamster.body.velocity.y = 0;
        this.hamster.position.set(this.startPoint.x, this.startPoint.y);
    }

    private setupPhysics() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1000;

        this.game.physics.arcade.checkCollision.down = false;
        this.game.physics.arcade.checkCollision.up = false;

        this.game.world.setBounds(
            0,
            0,
            this.TILE_SIZE * 30,
            this.TILE_SIZE * 20
        );
    }

    private setupPlayerMap() {
        this.playerMap = this.game.add.tilemap(
            'dynamicMap',
            this.TILE_SIZE,
            this.TILE_SIZE
        );
        this.playerMap.addTilesetImage(
            'tiles',
            'tiles',
            this.TILE_SIZE,
            this.TILE_SIZE
        );

        this.playerMapLayer = this.playerMap.createLayer(0);

        this.playerMap.setCollisionBetween(0, 2);

        this.playerMap.setTileIndexCallback(
            2,
            (sprite: any, tile: any) => {
                if (sprite instanceof HamsterEntity) {
                    const hammsterBody = sprite.body as Phaser.Physics.Arcade.Body;
                    hammsterBody.velocity.set(hammsterBody.velocity.x, -600);
                }
            },
            this
        );
    }

    private setupNextLevel() {
        this.predefinedMapLayer.destroy();
        this.predefinedMap.destroy();

        this.playerMapLayer.destroy();
        this.playerMap.destroy();

        this.setupPredefinedMap(this.levels[++this.currentLevelIndex]);
        this.setupPlayerMap();
            
        this.activateTilesBasedOnAvalability();

        this.hamster.destroy();
        this.hamster = new HamsterEntity(this.game);
    }

    private getFontStyles() {
        return {
            stroke: '#000',
            strokeThickness: 12,
            fill: '#fff',
            font: '24px Comic Sans MS, Impact'
        }
    }

    private setupPredefinedMap(level: string) {
        this.predefinedMap = this.game.add.tilemap(level, 32, 32);

        this.predefinedMap.addTilesetImage('predefined-tiles');

        this.predefinedMapLayer = this.predefinedMap.createLayer(0);

        this.startPoint = this.findStartLocation();
        
        if (this.startMagicGlow) {
            this.startMagicGlow.destroy();
        }

        const glowShift = this.TILE_SIZE/2;

        this.startMagicGlow = new MagicGlowEntity(this.game, this.startPoint.x + glowShift, this.startPoint.y + glowShift);

        const findFinishLocation = this.findFinishLocation();

        if (this.finishMagicGlow) {
            this.finishMagicGlow.destroy();
        }

        this.finishMagicGlow = new MagicGlowEntity(this.game, findFinishLocation.x + glowShift, findFinishLocation.y + glowShift);

        this.predefinedMap.setTileIndexCallback(
            1,
            () => {
                this.setupNextLevel();
                this.placeHamsterOnStart();
            },
            this
        );

        this.predefinedMap.setTileIndexCallback(2, () => {
            this.killHamster();
        }, this);
    }

    private findStartLocation() {
        var mapArray = (this.predefinedMapLayer as any).getTiles(
            0,
            0,
            this.world.width,
            this.world.height
        );

        for (var i = 0; i < mapArray.length; i++) {
            var myTile = mapArray[i];

            if (myTile.index == 0) {
                return new Phaser.Point(myTile.worldX, myTile.worldY);
            }
        }

        throw new Error('Cannot find a start point for this map');
    }

    private findFinishLocation() {
        var mapArray = (this.predefinedMapLayer as any).getTiles(
            0,
            0,
            this.world.width,
            this.world.height
        );

        for (var i = 0; i < mapArray.length; i++) {
            var myTile = mapArray[i];

            if (myTile.index == 1) {
                return new Phaser.Point(myTile.worldX, myTile.worldY);
            }
        }

        throw new Error('Cannot find a finish point for this map');
    }

    private setupUi() {
        const frame = this.game.add.image(this.game.world.width, 0, 'frame');
        frame.anchor.set(1, 0);

        this.currentTile = PlayerTileType.GROUND;

        this.activateTilesBasedOnAvalability();
    }

    private activateTilesBasedOnAvalability() {
        const currentLevel = this.levels[this.currentLevelIndex];
        if (currentLevel === 'level-01') {
            this.activateGroundTile();
        }

        if (currentLevel === 'level-02') {
            this.activateSpringTile();
        }

        if (this.cursor) {
            this.cursor.destroy();
        }

        this.cursor = new CursorEntity(this.game);
    }

    private setupDeathSpace() {
        this.deathSpace = this.game.add.sprite(0, this.world.height + this.TILE_SIZE)
        this.deathSpace.width = this.world.width - this.TILE_SIZE*2;
        this.deathSpace.height = this.TILE_SIZE;

        this.game.physics.arcade.enable([this.deathSpace]);

        const body = this.deathSpace.body as Phaser.Physics.Arcade.Body;
        body.allowGravity = false;
        body.immovable = true;
    }

    private activateGroundTile() {
        this.groundKey = this.game.input.keyboard.addKey(
            Phaser.Keyboard.ONE
        );
        this.groundKey.onDown.add(() => {
            this.currentTile = PlayerTileType.GROUND;
        }, this);

        this.groundButton = this.game.add.sprite(
            this.game.world.width - this.TILE_SIZE / 2,
            this.TILE_SIZE / 2,
            'tiles-sheet'
        );
        this.groundButton.inputEnabled = true;
        this.groundButton.anchor.set(1, 0);
        this.groundButton.events.onInputDown.add(() => {
            this.currentTile = PlayerTileType.GROUND;
        }, this);
    }

    private activateSpringTile() {
        this.springKey = this.game.input.keyboard.addKey(
            Phaser.Keyboard.TWO
        );
        this.springKey.onDown.add(() => {
            this.currentTile = PlayerTileType.SPRING;
        }, this);

        this.springButton = this.game.add.sprite(
            this.game.world.width + this.TILE_SIZE / 2,
            this.TILE_SIZE / 2 + 64,
            'tiles-sheet'
        );
        this.springButton.inputEnabled = true;
        this.springButton.frame = 2;

        this.springButton.events.onInputDown.add(() => {
            this.currentTile = PlayerTileType.SPRING;
        }, this);

        this.springButton.z = -1;
    }

    private killHamster() {
        const blood = new BloodBurstEntity(this.game, this.hamster.position.x + this.hamster.body.velocity.x*0.15, this.hamster.position.y);

        this.hamster.kill();

        this.placeHamsterOnStart();

        this.hamster.revive(100);

        this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {
            blood.destroy();
        }, this);

        this.deathCounter++;
    }

    private placeMagicGlows() {
        
    }

    update() {
        this.game.physics.arcade.collide(this.hamster, this.playerMapLayer);

        this.game.physics.arcade.collide(this.hamster, this.predefinedMapLayer);

        this.game.physics.arcade.overlap(this.hamster, this.deathSpace, () => {
            this.killHamster();
        });

        if (this.game.input.mousePointer.isDown) {
            if (this.game.input.mousePointer.x > this.TILE_SIZE * 30) {
                return;
            }

            if (!this.checkIfPlayerCanPlaceTile()) {
                return;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
                this.playerMap.putTileWorldXY(
                    TileTypes.NONE,
                    this.game.input.mousePointer.x,
                    this.game.input.mousePointer.y,
                    this.TILE_SIZE,
                    this.TILE_SIZE,
                    this.playerMapLayer
                );
                return;
            }

            if (this.currentTile === PlayerTileType.GROUND) {
                this.updatePlayerTileGround();
            }

            if (this.currentTile === PlayerTileType.SPRING) {
                this.updatePlayerTileSpring();
            }
        }
    }

    private updatePlayerTileGround() {
        let tileTypeToPlace = TileTypes.NONE;

        const tileAbove = this.playerMap.getTileWorldXY(
            this.game.input.mousePointer.x,
            this.game.input.mousePointer.y - this.TILE_SIZE,
            this.TILE_SIZE,
            this.TILE_SIZE
        );
        if (
            !!tileAbove &&
            (tileAbove.index === TileTypes.TOP_GROUND ||
                tileAbove.index === TileTypes.MIDDLE_GROUND)
        ) {
            tileTypeToPlace = TileTypes.MIDDLE_GROUND;
        } else {
            tileTypeToPlace = TileTypes.TOP_GROUND;
        }

        const tileBelow = this.playerMap.getTileWorldXY(
            this.game.input.mousePointer.x,
            this.game.input.mousePointer.y + this.TILE_SIZE
        );
        if (!!tileBelow && tileBelow.index === TileTypes.TOP_GROUND) {
            this.playerMap.putTileWorldXY(
                TileTypes.MIDDLE_GROUND,
                tileBelow.worldX,
                tileBelow.worldY,
                this.TILE_SIZE,
                this.TILE_SIZE
            );
        }

        this.playerMap.putTileWorldXY(
            tileTypeToPlace,
            this.game.input.mousePointer.x,
            this.game.input.mousePointer.y,
            this.TILE_SIZE,
            this.TILE_SIZE,
            this.playerMapLayer
        );
    }

    private checkIfPlayerCanPlaceTile() {
        const tile = this.predefinedMap.getTileWorldXY(
            this.game.input.mousePointer.x,
            this.game.input.mousePointer.y
        );

        return !tile;
    }

    private updatePlayerTileSpring() {
        let tileTypeToPlace = TileTypes.SPRING;

        this.playerMap.putTileWorldXY(
            tileTypeToPlace,
            this.game.input.mousePointer.x,
            this.game.input.mousePointer.y,
            this.TILE_SIZE,
            this.TILE_SIZE,
            this.playerMapLayer
        );
    }

    render() {
        // this.game.debug.bodyInfo(this.hamster, 0, 0);
        // this.game.debug.body(this.hamster);

        this.deathCounterText.text = 'Dead hamsters: ' + this.deathCounter.toString();
    }
}
