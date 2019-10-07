export class HamsterRain extends Phaser.Particles.Arcade.Emitter {
    constructor(game: Phaser.Game) {
        super(game, -32, game.world.centerY);

        this.game = game;

        this.height = game.world.height;
        this.width = 1;

	    this.makeParticles('hamster');

	    this.minParticleScale = 1;
	    this.maxParticleScale = 2;
        this.alpha = 1;
        this.gravity = 0;
        this.game.physics.arcade.gravity.y = 0;

	    this.setYSpeed(-5, 5);
	    this.setXSpeed(100, 200);

	    this.start(false, 15000, 500, 200);
    }
}
