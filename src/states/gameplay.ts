/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { Tiles as TileTypes } from "../helpers/tiles";
import { HamsterEntity } from "../entities/hamster";
import { CursorEntity } from "../entities/cursor";

export enum PlayerTileType {
    GROUND,
    SPRING
}

export class Gameplay extends Phaser.State {
    private MAP_WIDTH = 240;
    private MAP_HEIGHT = 240;

    private TILE_SIZE = 32;

    private map: Phaser.Tilemap;
    private layer: Phaser.TilemapLayer;

    private hamster: HamsterEntity;
    private cursor: CursorEntity;
    private currentTile: PlayerTileType;

    private groundButton: Phaser.Key;
    private springButton: Phaser.Key;

    preload() {
    }

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
        this.game.cache.addTilemap('dynamicMap', null, this.generateCsvMapFromArray(), Phaser.Tilemap.CSV);

        const background = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'background');
        background.anchor.set(0.5);
        background.scale.set(1.2);

        const frame = this.game.add.image(this.game.world.width, 0, 'frame');
        frame.anchor.set(1, 0);

        this.map = this.game.add.tilemap('dynamicMap', this.TILE_SIZE, this.TILE_SIZE);
        this.map.addTilesetImage('tiles', 'tiles', this.TILE_SIZE, this.TILE_SIZE);

        this.layer = this.map.createLayer(0);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1000;

        this.game.world.setBounds(0, 0, this.TILE_SIZE * 30, this.TILE_SIZE * 20);

        this.hamster = new HamsterEntity(this.game);
        this.cursor = new CursorEntity(this.game);

        this.map.setCollisionBetween(0, 22);

        this.currentTile = PlayerTileType.GROUND;

        this.groundButton = this.game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_1);
        this.groundButton.onDown.add(() => {
            this.currentTile = PlayerTileType.GROUND;
        }, this);

        this.springButton = this.game.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_2);
        this.springButton.onDown.add(() => {
            this.currentTile = PlayerTileType.SPRING;
        }, this);

        this.map.setTileIndexCallback(2, (sprite: any, tile: any) => {
            if (sprite instanceof HamsterEntity) {
                const hammsterBody = sprite.body as Phaser.Physics.Arcade.Body;
                hammsterBody.velocity.set(hammsterBody.velocity.x, -666 - hammsterBody.velocity.y);
            }
        }, this);
    }

    update() {
        this.game.physics.arcade.collide(this.hamster, this.layer, (a, b) => {
            console.log(a, b);
        });

        if (this.game.input.mousePointer.isDown) {
            if (this.game.input.mousePointer.x > this.TILE_SIZE * 30) {
                return;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
                this.map.putTileWorldXY(TileTypes.NONE, this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.TILE_SIZE, this.TILE_SIZE, this.layer);
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

            const tileAbove = this.map.getTileWorldXY(this.game.input.mousePointer.x, this.game.input.mousePointer.y - this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
            if (!!tileAbove && (tileAbove.index === TileTypes.TOP_GROUND || tileAbove.index === TileTypes.MIDDLE_GROUND)) {
                tileTypeToPlace = TileTypes.MIDDLE_GROUND;
            } else {
                tileTypeToPlace = TileTypes.TOP_GROUND;
            }

            const tileBelow = this.map.getTileWorldXY(this.game.input.mousePointer.x, this.game.input.mousePointer.y + this.TILE_SIZE);
            if (!!tileBelow && (tileBelow.index === TileTypes.TOP_GROUND)) {
                this.map.putTileWorldXY(TileTypes.MIDDLE_GROUND, tileBelow.worldX, tileBelow.worldY, this.TILE_SIZE, this.TILE_SIZE);
            }

        this.map.putTileWorldXY(tileTypeToPlace, this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.TILE_SIZE, this.TILE_SIZE, this.layer);
    }

    private updatePlayerTileSpring() {
        let tileTypeToPlace = TileTypes.SPRING;

        this.map.putTileWorldXY(tileTypeToPlace, this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.TILE_SIZE, this.TILE_SIZE, this.layer);
    }

    render() {
        this.game.debug.bodyInfo(this.hamster, 0, 0);
        // this.game.debug.body(this.hamster);
    }
}