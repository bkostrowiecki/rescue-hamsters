/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />

import { WobblingText } from "../entities/wobblingText";
import { CursorEntity } from "../entities/cursor";
import { HamsterRain } from "../entities/hamsterRain";

export class Win extends Phaser.State {
    private title: WobblingText;
    private clickToPlay: WobblingText;
    private cursor: CursorEntity;
    private background: Phaser.Image;
    private bigHamster: Phaser.Image;
    private score: Phaser.Text;

    private hamsterRain: HamsterRain;

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

        this.hamsterRain = new HamsterRain(this.game);

        this.title = new WobblingText(this.game, this.game.world.centerX, this.game.world.centerY - 80, 'You win!', this.getFontStyles('120px'));
        this.title.anchor.set(0.5);

        this.score = new WobblingText(this.game, this.game.world.centerX, this.game.world.centerY, `Only ${} died in the process`, this.getFontStyles('80px'));
        this.score.anchor.set(0.5);

        this.clickToPlay = new WobblingText(this.game, this.game.world.centerX, this.game.world.centerY + 80, 'Click here to play again!', this.getFontStyles('60px'), 1000);
        this.clickToPlay.anchor.set(0.5);

        this.cursor = new CursorEntity(this.game);
    }

    onTap() {
        this.game.state.start('Splash', true, false);
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
        this.hamsterRain.destroy();
    }
}
