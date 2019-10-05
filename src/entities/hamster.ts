export class HamsterEntity extends Phaser.Sprite {
    private restartButton;

    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, 32, 'hamster', 0);

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        const body = this.body as Phaser.Physics.Arcade.Body;

        body.collideWorldBounds = true;
        body.maxVelocity.y = 10000;
        body.setSize(48, 48, 0, 0);
        body.velocity.x = 100;
        body.bounce.x = 1;

        this.restartButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.restartButton.onDown.add(() => {
            this.position.set(this.game.world.centerX, 32);
        }, this);
    }

    render() {
        this.game.debug.bodyInfo(this.body, 32, 32);
        this.game.debug.body(this.body);
    }

    turnAround() {
        this.body.velocity.x = -this.body.velocity.x;
    }
}