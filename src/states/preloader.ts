/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

export class Preloader extends Phaser.State {
    preloaderBar: Phaser.Sprite;

    preload() {
        this.preloaderBar = this.add.sprite(200, 550, 'preload-bar');
        
        this.preloaderBar.anchor.set(0.5, 0.5);
        this.preloaderBar.position.set(this.world.centerX, this.world.centerY);

        this.load.setPreloadSprite(this.preloaderBar);

        this.game.load.image('hamster-big' ,'bin/assets/hamster-big.png');

        this.game.load.image('tiles', 'bin/assets/grid.png');
        this.game.load.image('predefined-tiles', 'bin/assets/predefined.png');

        this.game.load.spritesheet('tiles-sheet', 'bin/assets/grid.png', 32, 32);

        this.game.load.image('hamster', 'bin/assets/hamster.png');
        this.game.load.image('cursor', 'bin/assets/cursor.png');
        this.game.load.image('cursor-delete', 'bin/assets/cursor-delete.png');

        this.game.load.spritesheet('hamster-bumpster', 'bin/assets/hamster_bumpster.png', 47, 34, 12);

        this.game.load.image('background', 'bin/assets/landscape.png');
        this.game.load.image('frame', 'bin/assets/frame.png');

        this.game.load.image('blood-cell', 'bin/assets/blood-cell.png');
        this.game.load.image('ground-cell', 'bin/assets/ground-cell.png');
        this.game.load.image('magic-glow-particle', 'bin/assets/magic-glow-particle.png');

        this.game.load.image('next-level-window', 'bin/assets/next-level-window.png');
        this.game.load.image('mask', 'bin/assets/mask.png');

        this.game.load.tilemap('level-01', 'bin/assets/level01.csv');
        this.game.load.tilemap('level-02', 'bin/assets/level02.csv');
        this.game.load.tilemap('level-03', 'bin/assets/level03.csv');
        this.game.load.tilemap('level-04', 'bin/assets/level04.csv');
        this.game.load.tilemap('level-05', 'bin/assets/level05.csv');
        this.game.load.tilemap('level-06', 'bin/assets/level06.csv');
        this.game.load.tilemap('level-07', 'bin/assets/level07.csv');
        this.game.load.tilemap('level-08', 'bin/assets/level08.csv');
        this.game.load.tilemap('level-09', 'bin/assets/level09.csv');
        this.game.load.tilemap('level-10', 'bin/assets/level10.csv');

        this.game.load.audio('select-tile', 'bin/assets/select-tile.ogg');

        this.game.load.spritesheet('button', 'bin/assets/button.png', 179, 62);

        this.game.load.audio('music', 'bin/assets/music.ogg');
    }

    create() {
        var tween = this.add.tween(this.preloaderBar).to({
            alpha: 0
        }, 1000, Phaser.Easing.Linear.None, true);

        tween.onComplete.add(this.startSplash, this);

        this.game.input.gamepad.start();
    }

    startSplash() {
        this.game.state.start('Splash', true, false);
    }
}