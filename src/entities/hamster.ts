export class HamsterEntity extends Phaser.Sprite {
    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, game.world.centerY, 'hamster', 0);

        this.game.add.existing(this);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);

        const body = this.body as Phaser.Physics.Arcade.Body;

        body.collideWorldBounds = true;
        body.maxVelocity.y = 10000;
        body.setSize(48, 48, 0, 0);
        body.velocity.x = 100;
    }

    render() {
        this.game.debug.bodyInfo(this, 32, 32);
        this.game.debug.body(this);
    }
}