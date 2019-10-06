export class NextLevelWindow extends Phaser.Group {
    private screenMask: Phaser.Image;
    private finishLevelWindow: Phaser.Sprite;

    private savedText: Phaser.Text;
    private deathsText: Phaser.Text;

    private nextLevelButton: Phaser.Button;

    onNextLevelClick: () => void;

    constructor(game: Phaser.Game, saved: number, deaths: number) {
        super(game);

        this.game.add.group(this);

        this.screenMask = this.game.add.image(0, 0, 'mask');
        this.screenMask.scale.set(this.game.canvas.width, this.game.canvas.height);
        this.add(this.screenMask);

        this.finishLevelWindow = this.game.add.sprite(this.game.canvas.width / 2 , this.game.canvas.height / 2, 'next-level-window');
        this.finishLevelWindow.anchor.set(0.5, 0.5);
        this.add(this.finishLevelWindow);

        this.savedText = this.game.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2 - 60, 'Saved:  ' + saved, this.getFontStyles());
        this.savedText.anchor.set(0.5, 0.5);
        this.add(this.savedText);

        this.deathsText = this.game.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, 'Deaths:  ' + deaths, this.getFontStyles());
        this.deathsText.anchor.set(0.5, 0.5);
        this.add(this.deathsText);

        this.nextLevelButton = game.add.button(this.game.canvas.width / 2, this.game.canvas.height / 2 + 60, 'button', () => {
            this.onNextLevelClick();
        }, this, 2, 1, 0);
        this.nextLevelButton.input.useHandCursor = false;
        this.nextLevelButton.anchor.set(0.5, 0.5);
        this.add(this.nextLevelButton);
    }

    private getFontStyles() {
        return {
            stroke: '#000',
            strokeThickness: 12,
            fill: '#fff',
            font: '32px Comic Sans MS, Impact'
        }
    }
}