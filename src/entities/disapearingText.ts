export class DisapearingText extends Phaser.Text {
    onDestroy: () => void;
    constructor(game: Phaser.Game, x: number, y: number, text: string, style: any, time?: number) {
        super(game, x, y, text, style);

        this.game.add.existing(this);

        this.game.add.tween(this).to({
            y: '-150',
        }, time || 3000, Phaser.Easing.Linear.None, true, 0, 1);

        this.game.add.tween(this).to({
            alpha: 0
        }, 500, Phaser.Easing.Linear.None, true, time ? time - 500 : 2500);

        this.game.time.events.add(!!time ? time : 3000 , () => {
            this.destroy();
            if (this.onDestroy) {
                this.onDestroy();
            }
        }, this);
    }
}