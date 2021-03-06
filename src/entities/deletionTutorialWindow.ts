export class DeletionTutorialWindow extends Phaser.Group {
    private window: Phaser.Sprite;

    private titleText: Phaser.Text;
    private descriptionText: Phaser.Text;

    private okButton: Phaser.Button;
    private okButtonText: Phaser.Text;

    onOkClick: () => void;

    constructor(game: Phaser.Game) {
        super(game);

        this.game.add.group(this);

        this.window = this.game.add.sprite(this.game.canvas.width / 2 , this.game.canvas.height / 2, 'next-level-window');
        this.window.anchor.set(0.5, 0.5);
        this.add(this.window);

        this.titleText = this.game.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2 - 90, 'You can delete tiles!', this.getFontStyles());
        this.titleText.anchor.set(0.5, 0.5);
        this.add(this.titleText);

        this.descriptionText = this.game.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2 + 10, `To delete tiles simply
hold SHIFT and CLICK
Deleted tiles will be returned 
to your inventory on right
        `, this.getInstructionsFontStyle());
        this.descriptionText.anchor.set(0.5, 0.5);
        this.descriptionText.lineSpacing = -10;
        this.add(this.descriptionText);

        this.okButton = game.add.button(this.game.canvas.width / 2, this.game.canvas.height / 2 + 100, 'button', () => {
            this.onOkClick();
        }, this, 2, 1, 0);
        this.okButton.input.useHandCursor = false;
        this.okButton.anchor.set(0.5, 0.5);
        this.add(this.okButton);

        this.okButtonText = game.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2 + 100, 'Oookeeey!', this.getButtonFontStyle(), this);
        this.okButtonText.anchor.set(0.5, 0.5);
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

    private getInstructionsFontStyle() {
        return {
            stroke: '#000',
            strokeThickness: 8,
            fill: '#fff',
            font: '18px Comic Sans MS, Impact'
        }
    }
}