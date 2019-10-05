/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { Tiles as TileTypes } from "../helpers/tiles";

export class Gameplay extends Phaser.State {
    private MAP_WIDTH = 240;
    private MAP_HEIGHT = 240;

    private TILE_SIZE = 32;

    private map: Phaser.Tilemap;
    private layer: Phaser.TilemapLayer;

    preload() {
    }

    private generateCsvMapFromArray() {
        let data = '';

        for (let iy = 0; iy < this.MAP_WIDTH; iy++) {
            for (let jx = 0; jx < this.MAP_HEIGHT; jx++) {
                data += TileTypes.NONE;
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

        this.layer.resizeWorld();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        let currentTile = this.map.getTile(2, 3);
        console.log(currentTile);
    }

    update() {
        if (this.game.input.mousePointer.isDown) {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
                this.map.putTileWorldXY(TileTypes.NONE, this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.TILE_SIZE, this.TILE_SIZE, this.layer);
            } else {
                this.map.putTileWorldXY(TileTypes.GROUND, this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.TILE_SIZE, this.TILE_SIZE, this.layer);
            }
        }
    }

    render() {
    }
}