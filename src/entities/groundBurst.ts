export class BloodBurstEntity extends Phaser.Particles.Arcade.Emitter {
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game);

        this.game.add.existing(this);

        this.makeParticles('ground-cell');
        this.gravity = -600;
        this.setAlpha(0.3, 0.8);
        this.setScale(0.5, 1);

        this.x = x;
        this.y = y;

        this.start(true, 500, null, 30);
    }
}
