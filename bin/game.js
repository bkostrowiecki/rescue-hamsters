var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/boot", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Boot = /** @class */ (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Boot.prototype.preload = function () {
            this.load.image('preload-bar', 'bin/assets/preload-bar.png');
        };
        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
                // desktop game settings
            }
            else {
                // mobile game settings
            }
            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    }(Phaser.State));
    exports.Boot = Boot;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/preloader", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Preloader = /** @class */ (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Preloader.prototype.preload = function () {
            this.preloaderBar = this.add.sprite(200, 550, 'preload-bar');
            this.load.setPreloadSprite(this.preloaderBar);
            this.game.load.image('tiles', 'bin/assets/grid.png');
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloaderBar).to({
                alpha: 0
            }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startSplash, this);
            this.game.input.gamepad.start();
        };
        Preloader.prototype.startSplash = function () {
            this.game.state.start('Gameplay', true, false);
        };
        return Preloader;
    }(Phaser.State));
    exports.Preloader = Preloader;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/splash", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Splash = /** @class */ (function (_super) {
        __extends(Splash, _super);
        function Splash() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Splash.prototype.preload = function () {
            this.game.stage.backgroundColor = 0xB20059;
        };
        Splash.prototype.create = function () {
            var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            logo.anchor.setTo(0.5, 0.5);
            this.game.input.onTap.add(this.onTap, this);
        };
        Splash.prototype.onTap = function () {
            this.game.state.start('Gameplay', true, false);
        };
        return Splash;
    }(Phaser.State));
    exports.Splash = Splash;
});
define("helpers/tiles", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tiles;
    (function (Tiles) {
        Tiles[Tiles["NONE"] = -1] = "NONE";
        Tiles[Tiles["TOP_GROUND"] = 0] = "TOP_GROUND";
        Tiles[Tiles["MIDDLE_GROUND"] = 1] = "MIDDLE_GROUND";
    })(Tiles = exports.Tiles || (exports.Tiles = {}));
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/gameplay", ["require", "exports", "helpers/tiles"], function (require, exports, tiles_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Gameplay = /** @class */ (function (_super) {
        __extends(Gameplay, _super);
        function Gameplay() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.MAP_WIDTH = 240;
            _this.MAP_HEIGHT = 240;
            _this.TILE_SIZE = 32;
            return _this;
        }
        Gameplay.prototype.preload = function () {
        };
        Gameplay.prototype.generateCsvMapFromArray = function () {
            var data = '';
            for (var iy = 0; iy < this.MAP_WIDTH; iy++) {
                for (var jx = 0; jx < this.MAP_HEIGHT; jx++) {
                    data += tiles_1.Tiles.NONE;
                    if (jx < this.MAP_WIDTH) {
                        data += ',';
                    }
                }
                if (iy < this.MAP_HEIGHT) {
                    data += '\n';
                }
            }
            return data;
        };
        Gameplay.prototype.create = function () {
            this.game.cache.addTilemap('dynamicMap', null, this.generateCsvMapFromArray(), Phaser.Tilemap.CSV);
            this.map = this.game.add.tilemap('dynamicMap', this.TILE_SIZE, this.TILE_SIZE);
            this.map.addTilesetImage('tiles', 'tiles', this.TILE_SIZE, this.TILE_SIZE);
            this.layer = this.map.createLayer(0);
            this.layer.resizeWorld();
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
        };
        Gameplay.prototype.update = function () {
            if (this.game.input.mousePointer.isDown) {
                if (this.game.input.mousePointer.x > this.TILE_SIZE * 30) {
                    return;
                }
                var tileTypeToPlace = tiles_1.Tiles.NONE;
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
                    tileTypeToPlace = tiles_1.Tiles.NONE;
                }
                else {
                    var tileAbove = this.map.getTileWorldXY(this.game.input.mousePointer.x, this.game.input.mousePointer.y - this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
                    if (!!tileAbove && (tileAbove.index === tiles_1.Tiles.TOP_GROUND || tileAbove.index === tiles_1.Tiles.MIDDLE_GROUND)) {
                        tileTypeToPlace = tiles_1.Tiles.MIDDLE_GROUND;
                    }
                    else {
                        tileTypeToPlace = tiles_1.Tiles.TOP_GROUND;
                    }
                    var tileBelow = this.map.getTileWorldXY(this.game.input.mousePointer.x, this.game.input.mousePointer.y + this.TILE_SIZE);
                    if (!!tileBelow && (tileBelow.index === tiles_1.Tiles.TOP_GROUND)) {
                        this.map.putTileWorldXY(tiles_1.Tiles.MIDDLE_GROUND, tileBelow.worldX, tileBelow.worldY, this.TILE_SIZE, this.TILE_SIZE);
                    }
                }
                this.map.putTileWorldXY(tileTypeToPlace, this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.TILE_SIZE, this.TILE_SIZE, this.layer);
            }
        };
        Gameplay.prototype.render = function () {
        };
        return Gameplay;
    }(Phaser.State));
    exports.Gameplay = Gameplay;
});
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
define("game", ["require", "exports", "states/boot", "states/preloader", "states/splash", "states/gameplay"], function (require, exports, boot_1, preloader_1, splash_1, gameplay_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            // create our phaser game
            // 800 - width
            // 600 - height
            // Phaser.AUTO - determine the renderer automatically (canvas, webgl)
            // 'content' - the name of the container to add our game to
            // { preload:this.preload, create:this.create} - functions to call for our states
            var _this = _super.call(this, 32 * 32, 32 * 20, Phaser.AUTO, 'content', null) || this;
            _this.state.add('Boot', boot_1.Boot, false);
            _this.state.add('Preloader', preloader_1.Preloader, false);
            _this.state.add('Splash', splash_1.Splash, false);
            _this.state.add('Gameplay', gameplay_1.Gameplay, false);
            _this.state.start('Boot');
            return _this;
        }
        return Game;
    }(Phaser.Game));
    function bootGame() {
        // when the page has finished loading, create our game
        var game = new Game();
    }
    exports.default = bootGame;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("entities/virusBase", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var VirusBase = /** @class */ (function (_super) {
        __extends(VirusBase, _super);
        function VirusBase(game, x, y, key, frame) {
            var _this = _super.call(this, game, x, y, key, frame) || this;
            _this.attackCallback = function () { };
            _this.deathCallback = function () { };
            return _this;
        }
        VirusBase.prototype.attachDeathCallback = function (deathCallback) {
            this.deathCallback = deathCallback;
        };
        VirusBase.prototype.attachAttackCallback = function (attackCallback) {
            this.attackCallback = attackCallback;
        };
        VirusBase.prototype.heartIsDead = function () {
        };
        return VirusBase;
    }(Phaser.Sprite));
    exports.VirusBase = VirusBase;
});
