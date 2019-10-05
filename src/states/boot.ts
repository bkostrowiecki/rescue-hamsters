/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

export class Boot extends Phaser.State {
    preload() {
        this.load.image('preload-bar', 'bin/assets/preload-bar.png');
    }

    create() {
        this.input.maxPointers = 1;

        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
            // desktop game settings
        } else {
            // mobile game settings
        }

        this.game.state.start('Preloader', true, false);
    }
}