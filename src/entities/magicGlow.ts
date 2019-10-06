export class MagicGlowEntity extends Phaser.Particles.Arcade.Emitter {
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game);

        this.game.add.existing(this);

        this.makeParticles('magic-glow-particle');
        
        this.setRotation(0, 0);
        this.setAlpha(0.5, 1);
        this.gravity = -666;

        this.x = x;
        this.y = y;

        this.start(false, 300, 50);
    }
}