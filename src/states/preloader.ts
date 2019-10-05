/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

export class Preloader extends Phaser.State {
    preloaderBar: Phaser.Sprite;

    preload() {
        this.preloaderBar = this.add.sprite(200, 550, 'preload-bar');
        this.load.setPreloadSprite(this.preloaderBar);

        this.game.load.image('tiles', 'bin/assets/grid.png');
    }

    create() {
        var tween = this.add.tween(this.preloaderBar).to({
            alpha: 0
        }, 1000, Phaser.Easing.Linear.None, true);

        tween.onComplete.add(this.startSplash, this);

        this.game.input.gamepad.start();
    }

    startSplash() {
        this.game.state.start('Gameplay', true, false);
    }
}