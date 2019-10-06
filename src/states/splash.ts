/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { WobblingText } from "../entities/wobblingText";
import { CursorEntity } from "../entities/cursor";

export class Splash extends Phaser.State {
    private title: WobblingText;
    private clickToPlay: WobblingText;
    private cursor: CursorEntity;
    private background: Phaser.Image;
    private bigHamster: Phaser.Image;

    preload() {
        this.game.stage.backgroundColor = 0xB20059;
    }

    create() {
        this.game.input.onTap.add(this.onTap, this);

        this.background = this.game.add.image(
            this.game.world.centerX,
            this.game.world.centerY,
            'background'
        );
        this.background.anchor.set(0.5);
        this.background.scale.set(1.1);

        this.title = new WobblingText(this.game, this.game.world.centerX, this.game.world.centerY - 200, 'Rescue hamsters!', this.getFontStyles('120px'));
        this.title.anchor.set(0.5);

        this.bigHamster = this.game.add.image(this.world.centerX, this.world.centerY, 'hamster-big');
        this.bigHamster.anchor.set(0.5, 0.5);

        this.bigHamster.rotation = 0.05;

        this.game.add.tween(this.bigHamster.scale).to({
            x: 1.05,
            y: 1.05
        }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);

        this.game.add.tween(this.bigHamster).to({
            rotation: -0.05
        }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

        this.clickToPlay = new WobblingText(this.game, this.game.world.centerX, this.game.world.centerY + 200, 'Click here to play!', this.getFontStyles('60px'), 1000);
        this.clickToPlay.anchor.set(0.5);

        this.cursor = new CursorEntity(this.game);

        const music = new Phaser.Sound(this.game, 'music', 1, true);
        music.play();
    }

    onTap() {
        this.game.state.start('Gameplay', true, false);
    }

    private getFontStyles(fontSize: string) {
        return {
            stroke: '#000',
            strokeThickness: 12,
            fill: '#fff',
            font: `${fontSize} Comic Sans MS, Impact`
        }
    }

    destroy() {
        this.cursor.destroy();
        this.clickToPlay.destroy();
        this.title.destroy();
        this.background.destroy();
        this.bigHamster.destroy();
    }
}
