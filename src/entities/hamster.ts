import { Pointer } from "phaser";
import { PointerEntity } from "./pointer";

export class HamsterEntity extends Phaser.Sprite {
    private restartButton;
    private isFlipped;
    private isSpringJumping;
    private walk;

    private pointer;

    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, 32, 'hamster-bumpster');

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        const body = this.body as Phaser.Physics.Arcade.Body;

        body.collideWorldBounds = true;
        body.maxVelocity.y = 666;
        this.anchor.setTo(.32,.5);
        body.setSize(30, 32, 0, 0);
        body.velocity.x = 100;
        body.bounce.x = 1;

        this.walk = this.animations.add('walk');
        this.animations.play('walk', 30, true);

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