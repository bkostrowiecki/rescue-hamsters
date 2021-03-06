/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { PlayerTiles as TileTypes, PredefinedTiles, PlayerTiles } from '../helpers/tiles';
import { HamsterEntity } from '../entities/hamster';
import { CursorEntity } from '../entities/cursor';
import { BloodBurstEntity } from '../entities/bloodBurst';
import { MagicGlowEntity } from '../entities/magicGlow';
import { NextLevelWindow } from '../entities/nextLevelWindows';
import { NextLevelCounter } from '../entities/nextLevelCounter';
import { WobblingText } from '../entities/wobblingText';
import { DisapearingText } from '../entities/disapearingText';
import { YouLooseWindow } from '../entities/youLooseWindow';
import { DeletionTutorialWindow } from '../entities/deletionTutorialWindow';
import { GoalTutorialWindow } from '../entities/goalTutorialWindow';
import { GroundBurstEntity } from '../entities/groundBurst';

export enum PlayerTileType {
    GROUND,
    SPRING,
    HAMMER
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
    private hammerKey: Phaser.Key;

    private groundButton: Phaser.Sprite;
    private springButton: Phaser.Sprite;
    private hammerButton: Phaser.Sprite;

    private startPoint: Phaser.Point;
    private startMagicGlow: MagicGlowEntity;
    private finishMagicGlow: MagicGlowEntity;

    private deathSpace: Phaser.Sprite;

    private deathCounter = 0;
    private savedCounter = 0;

    private deathCounterText: Phaser.Text;
    private savedCounterText: WobblingText;

    private hamsterCounter: number;
    private hamsterCounterText: Phaser.Text;

    private selectTileSound: Phaser.Sound;

    private shouldRevive: boolean;

    private playerTileIndicator: Phaser.Sprite;

    private levels = [
        'level-01',
        'level-02',
        'level-03',
        'level-04',
        'level-05',
        'level-06',
        'level-07',
        'level-08',
        'level-09',
        'level-10'
    ];

    private requiredSavesForNextLevel = [
        1,
        2,
        3,
        3,
        3,
        5,
        5,
        5,
        3,
        5
    ];

    private availableHamster = [
        5,
        5,
        5,
        5,
        15,
        15,
        20,
        20,
        30,
        30
    ];

    private levelLimits = [{
        ground: 20,
        springs: 0
    }, {
        ground: 25,
        springs: 3
    }, {
        ground: 25,
        springs: 3
    }, {
        ground: 40,
        springs: 4
    }, {
        ground: 40,
        springs: 5
    }, {
        ground: 50,
        springs: 5
    }, {
        ground: 60,
        springs: 5
    }, {
        ground: 25,
        springs: 3
    } , {
        ground: 25,
        springs: 0
    }, {
        ground: 100,
        springs: 8
    }];

    private currentLevelIndex = 0;

    private nextLevelWindow: NextLevelWindow;
    private nextLevelCounter: NextLevelCounter;

    private youLooseWindow: YouLooseWindow;

    private groundTilesNumber: number = 0;
    private springTilesNumber: number = 0;

    private groundText: WobblingText;
    private springText: WobblingText;
    private hammerText: WobblingText;

    private limitReachedText: DisapearingText;

    private clickButtonSound: Phaser.Sound;
    blockLimitSound: Phaser.Sound;
    crashHamsterSound: Phaser.Sound;
    appearHammsterSound: Phaser.Sound;
    deleteBlockSound: Phaser.Sound;
    winSound: Phaser.Sound;
    buildingSound: Phaser.Sound;
    jumpSound: Phaser.Sound;
    rescuedSound: Phaser.Sound;

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

        this.setupTilesFrame();

        this.setupPredefinedMap(this.levels[this.currentLevelIndex]);
        this.setupPlayerMap();

        this.setupPhysics();

        this.setupDeathSpace();

        const nextLevelHotKey = this.game.input.keyboard.addKey(
            Phaser.Keyboard.P
        );
        nextLevelHotKey.onDown.add(() => {
            this.setupNextLevel();
            this.placeHamsterOnStart();
        }, this);

        this.selectTileSound = this.game.add.audio('select-tile');

        this.hamsterCounter = 0;
        this.deathCounter = 0;

        this.notifyAboutGoal(() => {
            this.nextLevelCounter = new NextLevelCounter(this.game, 3);
            this.nextLevelCounter.onCounterFinish = () => {
            this.nextLevelCounter.destroy();

            this.cursor = new CursorEntity(this.game);

            this.placeHamsterOnStart();

            this.setupTexts();
            };
        });

        this.playerTileIndicator = this.game.add.sprite(-200, -200, 'magic-glow-particle');
        this.playerTileIndicator.scale.set(3);
        this.playerTileIndicator.anchor.set(0.5, 0.5);

        this.clickButtonSound = this.game.add.sound('click-button');
        this.blockLimitSound = this.game.add.sound('block-limit');
        this.crashHamsterSound = this.game.add.sound('crash-hamster');
        this.appearHammsterSound = this.game.add.sound('appear-hamster');
        this.deleteBlockSound = this.game.add.sound('delete-block');
        this.winSound = this.game.add.sound('click-button');
        this.buildingSound = this.game.add.sound('building');
        this.jumpSound = this.game.add.sound('jump');
        this.rescuedSound = this.game.add.sound('rescued');
    }

    destroy() {
        this.hamster.destroy();
        this.hamsterCounterText.destroy();
        this.deathCounterText.destroy();
        this.sound.destroy();
        this.groundButton.destroy();
        this.groundText.destroy();
        this.springButton.destroy();
        this.springText.destroy();

        this.startMagicGlow.destroy();
        this.finishMagicGlow.destroy();
    }

    private setupTexts() {
        if (this.deathCounterText) {
            this.deathCounterText.destroy();
        }
        if (this.savedCounterText) {
            this.savedCounterText.destroy();
        }
        if (this.hamsterCounterText) {
            this.hamsterCounterText.destroy();
        }

        this.deathCounterText =  new WobblingText(this.game, this.game.world.centerX + 200, this.TILE_SIZE, '', this.getFontStyles());
        this.deathCounterText.anchor.set(0.5, 0.5);

        this.savedCounterText = new WobblingText(this.game, this.game.world.centerX, this.TILE_SIZE, '', this.getFontStyles());
        this.savedCounterText.anchor.set(0.5, 0.5);

        this.hamsterCounterText = new WobblingText(this.game, this.game.world.centerX - 200, this.TILE_SIZE, '', this.getFontStyles());
        this.hamsterCounterText.anchor.set(0.5, 0.5);
    }

    private placeHamsterOnStart() {
        if (!this.hamster) {
            this.hamster = new HamsterEntity(this.game);
            this.hamster.inputEnabled = true;
            this.hamster.events.onInputDown.add(() => {
                if (this.currentTile === PlayerTileType.HAMMER) {
                    this.killHamster();
                }
            });
        }
        this.hamster.physicsEnabled = true;
        this.hamster.body.velocity.y = 0;
        this.hamster.position.set(this.startPoint.x, this.startPoint.y);
        this.shouldRevive = true;
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
            PlayerTiles.SPRING,
            (sprite: any, tile: any) => {
                if (sprite instanceof HamsterEntity) {
                    const hammsterBody = sprite.body as Phaser.Physics.Arcade.Body;
                    hammsterBody.velocity.set(hammsterBody.velocity.x, -600);
                    this.jumpSound.play()
                }
            },
            this
        );

        this.activateTilesBasedOnAvalability();
    }

    private setupNextLevel() {
        this.destroyMaps();

        if (!this.levels[this.currentLevelIndex + 1]) {
            this.game.state.start('Win');
            return;
        }

        this.setupPredefinedMap(this.levels[++this.currentLevelIndex]);
        
        this.setupLevelStart();
    }

    private setupCurrentLevel() {
        this.destroyMaps();

        this.setupPredefinedMap(this.levels[this.currentLevelIndex]);
        
        this.setupLevelStart();
    }

    private destroyMaps() {
        this.predefinedMapLayer.destroy();
        this.predefinedMap.destroy();

        this.playerMapLayer.destroy();
        this.playerMap.destroy();
    }

    private setupLevelStart() {
        this.groundTilesNumber = 0;
        this.springTilesNumber = 0;

        this.setupPlayerMap();

        this.activateTilesBasedOnAvalability();

        this.setupTexts();

        this.nextLevelCounter = new NextLevelCounter(this.game, 3);
        this.nextLevelCounter.onCounterFinish = () => {
            this.setupTexts();

            this.nextLevelCounter.destroy();

            this.placeHamsterOnStart();
        };

        this.hamsterCounter = 0;
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
        
        if (this.startMagicGlow && this.startMagicGlow.game) {
            this.startMagicGlow.destroy();
        }

        const glowShift = this.TILE_SIZE/2;

        this.startMagicGlow = new MagicGlowEntity(this.game, this.startPoint.x + glowShift, this.startPoint.y + glowShift);

        const findFinishLocation = this.findFinishLocation();

        if (this.finishMagicGlow && this.finishMagicGlow.game) {
            this.finishMagicGlow.destroy();
        }

        this.finishMagicGlow = new MagicGlowEntity(this.game, findFinishLocation.x + glowShift, findFinishLocation.y + glowShift);

        this.predefinedMap.setTileIndexCallback(
            PredefinedTiles.FINISH_POINT,
            () => {
                this.savedCounter++;

                if (this.savedCounter === this.requiredSavesForNextLevel[this.currentLevelIndex]) {
                    this.saveLastHamster();
                    this.finishLevel();
                    // this.savedCounter = 0;
                    // this.setupNextLevel();

                    // this.hamster.position.set(-2000, -2000);

                    // this.killHamster();
                } else {
                    this.saveHamster();
                    this.rescuedSound.play();
                }
            },
            this
        );

        this.predefinedMap.setTileIndexCallback(PredefinedTiles.IVY_MIDDLE, () => {
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

        this.currentTile = PlayerTileType.GROUND;

        throw new Error('Cannot find a finish point for this map');
    }

    private setupTilesFrame() {
        const frame = this.game.add.image(this.game.canvas.width, 0, 'frame');
        frame.anchor.set(1, 0);
    }

    private activateTilesBasedOnAvalability() {
        const currentLevel = this.levels[this.currentLevelIndex];
        if (currentLevel === 'level-01') {
            this.activateGroundTile();
            this.activateHammerTile();
        }

        if (currentLevel === 'level-02') {
            this.activateSpringTile();
        }

        this.setupCursor();
    }

    private setupCursor() {
        if (this.cursor) {
            this.cursor.destroy();
        }

        this.cursor = new CursorEntity(this.game);
    }

    private finishLevel() {
        this.nextLevelWindow = new NextLevelWindow(
            this.game,
            this.savedCounter,
            this.deathCounter
        );

        (this.game.physics.arcade as any).isPaused = true;
        this.winSound.play(undefined, undefined, 0.4);

        this.nextLevelWindow.onNextLevelClick = () => {
            this.clickButtonSound.play();
            this.nextLevelWindow.destroy();
            (this.game.physics.arcade as any).isPaused = false;

            this.savedCounter = 0;
            this.setupNextLevel();
        };

        this.setupCursor();
    }

    private setupDeathSpace() {
        this.deathSpace = this.game.add.sprite(-this.TILE_SIZE * 2, this.world.height + this.TILE_SIZE)
        this.deathSpace.width = this.world.width + this.TILE_SIZE * 4;
        this.deathSpace.height = this.TILE_SIZE;

        this.game.physics.arcade.enable([this.deathSpace]);

        const body = this.deathSpace.body as Phaser.Physics.Arcade.Body;
        body.allowGravity = false;
        body.immovable = true;
    }

    private activateGroundTile() {
        this.groundKey = this.game.input.keyboard.addKey(
            Phaser.Keyboard.Z
        );
        this.groundKey.onDown.add(() => {
            this.currentTile = PlayerTileType.GROUND;
        }, this);

        this.groundButton = this.game.add.sprite(
            this.game.canvas.width - this.TILE_SIZE / 2,
            this.TILE_SIZE / 2,
            'tiles-sheet'
        );
        this.groundButton.inputEnabled = true;
        this.groundButton.anchor.set(1, 0);
        this.groundButton.events.onInputDown.add(() => {
            this.currentTile = PlayerTileType.GROUND;
            this.selectTileSound.play();
        }, this);

        this.groundText = new WobblingText(this.game, this.groundButton.x, this.groundButton.y + this.TILE_SIZE, '0', this.getTileCounterFontStyle());
        this.groundText.anchor.set(0.5, 0.5);
    }

    private activateHammerTile() {
        this.hammerKey = this.game.input.keyboard.addKey(
            Phaser.Keyboard.C
        );
        this.hammerKey.onDown.add(() => {
            this.currentTile = PlayerTileType.HAMMER;
        }, this);

        this.hammerButton = this.game.add.sprite(
            this.game.canvas.width - this.TILE_SIZE / 2,
            this.TILE_SIZE * 4.5,
            'tiles-sheet'
        );
        this.hammerButton.frame = 3;
        this.hammerButton.inputEnabled = true;
        this.hammerButton.anchor.set(1, 0);
        this.hammerButton.events.onInputDown.add(() => {
            this.currentTile = PlayerTileType.HAMMER;
            this.selectTileSound.play();
        }, this);

        this.hammerText = new WobblingText(this.game, this.hammerButton.x, this.hammerButton.y + this.TILE_SIZE, '∞', this.getTileCounterFontStyle());
        this.hammerText.anchor.set(0.5, 0.5);
    }

    private activateSpringTile() {
        this.springKey = this.game.input.keyboard.addKey(
            Phaser.Keyboard.X
        );
        this.springKey.onDown.add(() => {
            this.currentTile = PlayerTileType.SPRING;
        }, this);

        this.springButton = this.game.add.sprite(
            this.game.canvas.width - this.TILE_SIZE * 1.5,
            this.TILE_SIZE / 2 + 64,
            'tiles-sheet'
        );
        this.springButton.inputEnabled = true;
        this.springButton.frame = 2;

        this.springButton.events.onInputDown.add(() => {
            this.currentTile = PlayerTileType.SPRING;
            this.selectTileSound.play();
        }, this);

        this.springText = new WobblingText(this.game, this.springButton.x + this.TILE_SIZE, this.springButton.y + this.TILE_SIZE, '0', this.getTileCounterFontStyle());
        this.springText.anchor.set(0.5, 0.5);
    }

    private getTileCounterFontStyle() {
        return {
            stroke: '#000',
            strokeThickness: 6,
            fill: '#fff',
            font: '18px Comic Sans MS, Impact'
        };
    }

    private killHamster(noBlood?: boolean) {
        if (this.hamsterCounter === this.availableHamster[this.currentLevelIndex] + 1) {
            return;
        }

        let blood;
        if (!noBlood) {
            blood = new BloodBurstEntity(this.game, this.hamster.position.x + this.hamster.body.velocity.x*0.15, this.hamster.position.y);
        }
        
        const deathInfo = new DisapearingText(this.game, this.hamster.x, this.hamster.y, '-1 Hamster', this.getFontStyles(), 3000);
        this.game.time.events.add(Phaser.Timer.SECOND * 4, () => {
            deathInfo.destroy();
        });

        this.hamster.position.set(-200, -200);
        this.hamster.physicsEnabled = false;
        this.hamster.kill();

        this.crashHamsterSound.play();

        if (this.hamsterCounter === this.availableHamster[this.currentLevelIndex]) {
            this.youLooseWindow = new YouLooseWindow(this.game, this.requiredSavesForNextLevel[this.currentLevelIndex]);

            this.setupCursor();

            this.hamsterCounter = this.availableHamster[this.currentLevelIndex] + 1;

            this.youLooseWindow.onRetryClick = () => {
                this.clickButtonSound.play();

                this.setupCurrentLevel();

                this.youLooseWindow.destroy();
                this.youLooseWindow = undefined;
            };

            return;
        }

        this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {
            this.placeHamsterOnStart();
        });

        this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {
            if (blood) {
                blood.destroy();
                blood = undefined;
            }
        }, this);

        this.deathCounter++;
    }

    private saveLastHamster() {
        this.rescuedSound.play(undefined, undefined, 1.3);
        this.hamster.position.set(-200, -200);
        this.hamster.physicsEnabled = false;
        this.hamster.kill();
    }

    private saveHamster() {
        const deathInfo = new DisapearingText(this.game, this.hamster.x, this.hamster.y, '+1 Rescued', this.getFontStyles(), 3000);
        this.game.time.events.add(Phaser.Timer.SECOND * 4, () => {
            deathInfo.destroy();
        });

        this.hamster.position.set(-200, -200);
        this.hamster.physicsEnabled = false;
        this.hamster.kill();

        this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {
            this.placeHamsterOnStart();
        });
    }

    update() {
        this.game.physics.arcade.collide(this.hamster, this.playerMapLayer);

        this.game.physics.arcade.collide(this.hamster, this.predefinedMapLayer);

        this.game.physics.arcade.collide(this.hamster, this.deathSpace, (sprite1, sprite2) => {
            if (sprite1.alive) {
                this.killHamster();
            }
        });

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
            this.cursor.enableDeleteMode();
        } else {
            this.cursor.enableNormalMode();
        }

        const currentLimits = this.levelLimits[this.currentLevelIndex];

        if (this.game.input.mousePointer.isDown) {
            if (this.game.input.mousePointer.x > this.TILE_SIZE * 30) {
                return;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
                this.deletePlayerTile();
                return;
            }

            if (!this.checkIfPlayerCanPlaceTile()) {
                return;
            }

            if (this.currentTile === PlayerTileType.HAMMER) {
                return;
            }

            if (this.currentTile === PlayerTileType.GROUND) {
                this.updatePlayerTileGround();
            }

            if (this.currentTile === PlayerTileType.SPRING) {
                this.updatePlayerTileSpring();
            }
        }

        if (this.shouldRevive) {
            this.hamster.revive();
            this.appearHammsterSound.play();
            this.hamsterCounter++;
            this.shouldRevive = false;
        }

        if (this.currentTile === PlayerTileType.HAMMER) {
            this.playerTileIndicator.position.set(this.game.canvas.width - 48, 32 * 4.5);
            this.playerTileIndicator.bringToTop();
        }

        if (this.currentTile === PlayerTileType.GROUND) {
            this.playerTileIndicator.position.set(this.game.canvas.width - 48, 32 * 0.5);
            this.playerTileIndicator.bringToTop();
        }

        if (this.currentTile === PlayerTileType.SPRING) {
            this.playerTileIndicator.position.set(this.game.canvas.width - 48, 32 * 2.5);
            this.playerTileIndicator.bringToTop();
        }
    }

    private deletePlayerTile() {
        const thisTile = this.playerMap.getTileWorldXY(
            this.game.input.mousePointer.x,
            this.game.input.mousePointer.y
        );

        if (thisTile) {
            const groundBurst = new GroundBurstEntity(this.game, this.game.input.mousePointer.x, this.game.input.mousePointer.y);
            this.deleteBlockSound.play(undefined, undefined, 0.4);
            this.game.time.events.add(3000, () => {
                groundBurst.destroy();
            });
        }

        this.returnTileInType(thisTile);

        this.playerMap.putTileWorldXY(
            TileTypes.NONE,
            this.game.input.mousePointer.x,
            this.game.input.mousePointer.y,
            this.TILE_SIZE,
            this.TILE_SIZE,
            this.playerMapLayer
        );
    }

    private updatePlayerTileGround() {
        const thisTile = this.playerMap.getTileWorldXY(
            this.game.input.mousePointer.x,
            this.game.input.mousePointer.y
        );

        if (!!thisTile && (thisTile.index === TileTypes.TOP_GROUND || thisTile.index === TileTypes.MIDDLE_GROUND)) {
            return;
        }

        if (this.groundTilesNumber === this.levelLimits[this.currentLevelIndex].ground) {
            this.notifyAboutLimit();
            return;
        }

        this.returnTileInType(thisTile);

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

        this.buildingSound.play();

        this.groundTilesNumber++;
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

        const thisTile = this.playerMap.getTileWorldXY(
            this.game.input.mousePointer.x,
            this.game.input.mousePointer.y
        );

        if (!!thisTile && thisTile.index === TileTypes.SPRING) {
            return;
        }

        if (this.springTilesNumber === this.levelLimits[this.currentLevelIndex].springs) {
            this.notifyAboutLimit();
            return;
        }

        this.returnTileInType(thisTile);

        this.playerMap.putTileWorldXY(
            tileTypeToPlace,
            this.game.input.mousePointer.x,
            this.game.input.mousePointer.y,
            this.TILE_SIZE,
            this.TILE_SIZE,
            this.playerMapLayer
        );

        this.springTilesNumber++;

        this.buildingSound.play(undefined, undefined, 0.4);
    }

    private returnTileInType(thisTile) {
        if (thisTile == null) {
            return;
        }

        if (thisTile.index === TileTypes.SPRING) {
            this.springTilesNumber--;
        } else if (thisTile.index === TileTypes.TOP_GROUND || thisTile.index === TileTypes.MIDDLE_GROUND) {
            this.groundTilesNumber--;
        }
    }

    private notifyAboutLimit() {
        if (!this.limitReachedText) {
            const deletionTutorial = JSON.parse(window.localStorage.getItem('deletion-tutorial'));

            if (!deletionTutorial) {
                this.notifyAboutDeletionPossibility();
            }

            this.limitReachedText = new DisapearingText(this.game, this.input.mousePointer.x, this.input.mousePointer.y, 'Limit reached', this.getFontStyles(), 2000);
            this.limitReachedText.onDestroy = () => {
                this.limitReachedText = undefined;
            }

            this.blockLimitSound.play();
        }
    }

    private notifyAboutDeletionPossibility() {
        const deletionTutorialWindow = new DeletionTutorialWindow(this.game);
        
        window.localStorage.setItem('deletion-tutorial', JSON.stringify(true));

        (this.game.physics.arcade as any).isPaused = true;

        this.setupCursor();

        deletionTutorialWindow.onOkClick = () => {
            this.clickButtonSound.play();
            (this.game.physics.arcade as any).isPaused = false;
            deletionTutorialWindow.destroy();
        };
    }

    private notifyAboutGoal(callback: () => void) {
        const goalTutorial = JSON.parse(window.localStorage.getItem('goal-tutorial'));

        if (goalTutorial) {
            callback();
            return;
        }

        const goalTutorialWindow = new GoalTutorialWindow(this.game);
        
        window.localStorage.setItem('goal-tutorial', JSON.stringify(true));

        (this.game.physics.arcade as any).isPaused = true;

        this.setupCursor();

        goalTutorialWindow.onOkClick = () => {
            (this.game.physics.arcade as any).isPaused = false;
            goalTutorialWindow.destroy();
            this.clickButtonSound.play();
            callback();
        };
    }

    render() {
        // this.game.debug.bodyInfo(this.hamster, 0, 0);
        // this.game.debug.body(this.hamster);

        if (this.deathCounterText) {
            this.deathCounterText.text = 'Dead  ' + this.deathCounter.toString();
        }

        if (this.savedCounterText) {
            this.savedCounterText.text = 'Rescued  ' + this.savedCounter.toString() + '/' + this.requiredSavesForNextLevel[this.currentLevelIndex];
        }

        if (this.hamsterCounterText) {
            this.hamsterCounterText.text = 'Hamster  ' + (Math.min(this.availableHamster[this.currentLevelIndex] - this.hamsterCounter + 1, this.availableHamster[this.currentLevelIndex])).toString() + '/' + this.availableHamster[this.currentLevelIndex];
        }

        if (this.groundText) {
            this.groundText.text = (this.levelLimits[this.currentLevelIndex].ground - this.groundTilesNumber).toString();
        }

        if (this.springText) {
            this.springText.text = (this.levelLimits[this.currentLevelIndex].springs - this.springTilesNumber).toString();
        }

        (this.game as any).deathCounter = this.deathCounter;
    }
}
