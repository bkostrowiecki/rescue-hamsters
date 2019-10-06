export class YouLooseWindow extends Phaser.Group {
    private window: Phaser.Sprite;

    private titleText: Phaser.Text;
    private failedToSaveText: Phaser.Text;

    private retryButton: Phaser.Button;
    private retryButtonText: Phaser.Text;

    onRetryClick: () => void;

    constructor(game: Phaser.Game, hamstersCount: number) {
        super(game);

        this.game.add.group(this);

        this.window = this.game.add.sprite(this.game.canvas.width / 2 , this.game.canvas.height / 2, 'next-level-window');
        this.window.anchor.set(0.5, 0.5);
        this.add(this.window);

        this.titleText = this.game.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2 - 60, 'You loose!', this.getFontStyles());
        this.titleText.anchor.set(0.5, 0.5);
        this.add(this.titleText);

        this.failedToSaveText = this.game.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, `You failed to save ${hamstersCount} hamsters`, this.getButtonFontStyle());
        this.failedToSaveText.anchor.set(0.5, 0.5);
        this.add(this.failedToSaveText);

        this.retryButton = game.add.button(this.game.canvas.width / 2, this.game.canvas.height / 2 + 80, 'button', () => {
            this.onRetryClick();
        }, this, 2, 1, 0);
        this.retryButton.input.useHandCursor = false;
        this.retryButton.anchor.set(0.5, 0.5);
        this.add(this.retryButton);

        this.retryButtonText = game.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2 + 80, 'Retry', this.getButtonFontStyle(), this);
        this.retryButtonText.anchor.set(0.5, 0.5);
    }

    private getFontStyles() {
        return {
            stroke: '#000',
            strokeThickness: 12,
            fill: '#fff',
            font: '32px Comic Sans MS, Impact'
        }
    }

    private getButtonFontStyle() {
        return {
            stroke: '#000',
            strokeThickness: 8,
            fill: '#fff',
            font: '18px Comic Sans MS, Impact'
        }
    }
}