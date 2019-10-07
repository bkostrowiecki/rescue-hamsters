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
        this.game.world.setBounds(
            0,
            0,
            32 * 32,
            32 * 20
        );
    
        this.game.input.onTap.add(this.onTap, this);

        this.background = this.game.add.image(
            this.game.world.centerX,
            this.game.world.centerY,
            'background'
        );
        this.background.anchor.set(0.5);
        this.background.scale.set(1.2);

        this.hamsterRain = new HamsterRain(this.game);

        this.title = new WobblingText(this.game, this.game.world.centerX, this.game.world.centerY - 150, 'You win!', this.getFontStyles('120px'));
        this.title.anchor.set(0.5);

        this.score = new WobblingText(this.game, this.game.world.centerX, this.game.world.centerY, `Only ${(this.game as any).deathCounter} hamsters
died in the process!`, this.getFontStyles('40px'));
        this.score.anchor.set(0.5);

        this.clickToPlay = new WobblingText(this.game, this.game.world.centerX, this.game.world.centerY + 150, 'Click here to play again!', this.getFontStyles('20px'), 1000);
        this.clickToPlay.anchor.set(0.5);

        this.cursor = new CursorEntity(this.game);
    }

    onTap() {
        this.game.state.start('Splash', true, false);
        window.location.reload();
    }
    
    private getFontStyles(fontSize: string) {
        return {
            stroke: '#000',
            strokeThickness: 12,
            fill: '#fff',
            font: `${fontSize} Comic Sans MS, Impact`,
            align: 'center'
        }
    }
    
    destroy() {
        (this.game as any).deathCounter = 0;
        this.cursor.destroy();
        this.clickToPlay.destroy();
        this.title.destroy();
        this.background.destroy();
        this.bigHamster.destroy();
    }
}
