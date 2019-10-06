export class WobblingText extends Phaser.Text {
    constructor(game: Phaser.Game, x: number, y: number, text: string, style: any, time?: number) {
        super(game, x, y, text, style);

        this.game.add.existing(this);
        this.rotation = -0.05;

        this.game.add.tween(this.scale).to({
            x: 1.05,
            y: 1.05
        }, time || 2000, Phaser.Easing.Linear.None, true, 0, -1, true);

        this.game.add.tween(this).to({
            rotation: 0.05
        }, time || 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
    }
}