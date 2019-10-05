export class CursorEntity extends Phaser.Sprite {
    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, game.world.centerY, 'cursor', 0);

        this.game.add.existing(this);
    }

    update() {
        this.x = this.game.input.mousePointer.x - 8;
        this.y = this.game.input.mousePointer.y;
    }
}