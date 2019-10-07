export class NextLevelCounter extends Phaser.Group {
    onCounterFinish: () => void;

    private counterText: Phaser.Text;
    private counter: number;

    private counterTimer: Phaser.TimerEvent;

    private heartbeat: Phaser.Sound;

    constructor(game: Phaser.Game, initialTimeInSeconds: number) {
        super(game);

        this.counter = initialTimeInSeconds;

        this.game.add.existing(this);

        this.heartbeat = this.game.add.sound('heartbeat');

        this.counterText = this.game.add.text(this.game.world.width / 2, this.game.world.height / 2, initialTimeInSeconds.toString(), this.getFontStyles());
        this.counterText.anchor.set(0.5, 0.5);
        this.add(this.counterText);

        this.game.add.tween(this.counterText).to({
            y: '+25'
        }, 500, Phaser.Easing.Exponential.InOut, true, 0, -1, true);

        this.game.add.tween(this.counterText.scale).to({
            x: 1.2,
            y: 1.2
        }, 500, Phaser.Easing.Elastic.InOut, true, 0, -1, true);

        this.counterTimer = this.game.time.events.loop(Phaser.Timer.SECOND, () => {
            this.counter--;

            this.counterText.setText(this.counter.toString());

            if (this.counter >= 0) {
                this.heartbeat.play();
            }

            if (this.counter === 0) {
                this.counterText.setText('Go!');
            } else if (this.counter === -1) {
                this.heartbeat.stop();
                this.onCounterFinish();
            }
        }, this);
    }

    private getFontStyles() {
        return {
            stroke: '#000',
            strokeThickness: 12,
            fill: '#fff',
            font: '120px Comic Sans MS, Impact'
        }
    }
}