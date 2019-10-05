/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { Tiles as TileTypes } from "../helpers/tiles";
import { HamsterEntity } from "../entities/hamster";
import { CursorEntity } from "../entities/cursor";

export class Gameplay extends Phaser.State {
    private MAP_WIDTH = 240;
    private MAP_HEIGHT = 240;

    private TILE_SIZE = 32;

    private map: Phaser.Tilemap;
    private layer: Phaser.TilemapLayer;

    private hamster: HamsterEntity;
    private cursor: CursorEntity;

    preload() {
    }

    private generateCsvMapFromArray() {
        let data = '';

        for (let iy = 0; iy < this.MAP_WIDTH; iy++) {
            for (let jx = 0; jx < this.MAP_HEIGHT; jx++) {
                if (iy > 15) {
                    data += TileTypes.MIDDLE_GROUND;
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

        this.map = this.game.add.tilemap('dynamicMap', this.TILE_SIZE, this.TILE_SIZE);
        this.map.addTilesetImage('tiles', 'tiles', this.TILE_SIZE, this.TILE_SIZE);

        this.layer = this.map.createLayer(0);

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 1000;

        this.game.world.setBounds(0, 0, this.TILE_SIZE * 30, this.TILE_SIZE * 20);

        this.hamster = new HamsterEntity(this.game);
        this.cursor = new CursorEntity(this.game);

        this.map.setCollisionBetween(0, 1);
    }

    update() {
        this.game.physics.arcade.collide(this.hamster, this.layer, () => {
            const hamsterBody = this.hamster.body as Phaser.Physics.Arcade.Body;
        });

        if (this.game.input.mousePointer.isDown) {
            if (this.game.input.mousePointer.x > this.TILE_SIZE * 30) {
                return;
            }

            let tileTypeToPlace = TileTypes.NONE;

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
                tileTypeToPlace = TileTypes.NONE;
            } else {
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
            }

            this.map.putTileWorldXY(tileTypeToPlace, this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.TILE_SIZE, this.TILE_SIZE, this.layer);
            this.map.setCollision(0);
        }
    }

    render() {
        this.game.debug.bodyInfo(this.hamster, 0, 0);
    }
}