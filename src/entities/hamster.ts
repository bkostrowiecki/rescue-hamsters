export class HamsterEntity extends Phaser.Sprite {
    private restartButton;
    private isFlipped;
    private isSpringJumping;
    private walk;

    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, 32, 'hamster-bumpster');

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        const body = this.body as Phaser.Physics.Arcade.Body;

        body.collideWorldBounds = true;
        body.maxVelocity.y = 10000;
        body.setSize(47, 34, 0, 0);
        body.velocity.x = 100;
        body.bounce.x = 1;

        this.walk = this.animations.add('walk');
        this.animations.play('walk', 30, true);

        this.anchor.setTo(.5,.8);

        this.restartButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
        this.restartButton.onDown.add(() => {
            this.position.set(this.game.world.centerX, 32);
        }, this);
    }

    update() {
        if (!this.isFlipped && this.body.velocity.x < 0) {
            this.scale.x *= -1;
            this.isFlipped = true;
        }

        if (this.isFlipped && this.body.velocity.x > 0) {
            this.scale.x *= -1;
            this.isFlipped = false;
        }
    }

    jumpOnSpring() {
        this.body.velocity.y = -666;

        this.isSpringJumping = true;
    }
}