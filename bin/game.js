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
            this.preloaderBar.anchor.set(0.5, 0.5);
            this.preloaderBar.position.set(this.world.centerX, this.world.centerY);
            this.load.setPreloadSprite(this.preloaderBar);
            this.game.load.image('hamster-big', 'bin/assets/hamster-big.png');
            this.game.load.image('tiles', 'bin/assets/grid.png');
            this.game.load.image('predefined-tiles', 'bin/assets/predefined.png');
            this.game.load.spritesheet('tiles-sheet', 'bin/assets/grid.png', 32, 32);
            this.game.load.image('hamster', 'bin/assets/hamster.png');
            this.game.load.image('cursor', 'bin/assets/cursor.png');
            this.game.load.image('cursor-delete', 'bin/assets/cursor-delete.png');
            this.game.load.spritesheet('hamster-bumpster', 'bin/assets/hamster_bumpster.png', 47, 34, 12);
            this.game.load.image('background', 'bin/assets/landscape.png');
            this.game.load.image('frame', 'bin/assets/frame.png');
            this.game.load.image('blood-cell', 'bin/assets/blood-cell.png');
            this.game.load.image('ground-cell', 'bin/assets/ground-cell.png');
            this.game.load.image('magic-glow-particle', 'bin/assets/magic-glow-particle.png');
            this.game.load.image('next-level-window', 'bin/assets/next-level-window.png');
            this.game.load.image('mask', 'bin/assets/mask.png');
            this.game.load.tilemap('level-01', 'bin/assets/level01.csv');
            this.game.load.tilemap('level-02', 'bin/assets/level02.csv');
            this.game.load.tilemap('level-03', 'bin/assets/level03.csv');
            this.game.load.tilemap('level-04', 'bin/assets/level04.csv');
            this.game.load.tilemap('level-05', 'bin/assets/level05.csv');
            this.game.load.tilemap('level-06', 'bin/assets/level06.csv');
            this.game.load.audio('select-tile', 'bin/assets/select-tile.ogg');
            this.game.load.spritesheet('button', 'bin/assets/button.png', 179, 62);
            this.game.load.audio('music', 'bin/assets/music.ogg');
        };
        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloaderBar).to({
                alpha: 0
            }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startSplash, this);
            this.game.input.gamepad.start();
        };
        Preloader.prototype.startSplash = function () {
            this.game.state.start('Splash', true, false);
        };
        return Preloader;
    }(Phaser.State));
    exports.Preloader = Preloader;
});
define("entities/wobblingText", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WobblingText = /** @class */ (function (_super) {
        __extends(WobblingText, _super);
        function WobblingText(game, x, y, text, style, time) {
            var _this = _super.call(this, game, x, y, text, style) || this;
            _this.game.add.existing(_this);
            _this.rotation = -0.05;
            _this.game.add.tween(_this.scale).to({
                x: 1.05,
                y: 1.05
            }, time || 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
            _this.game.add.tween(_this).to({
                rotation: 0.05
            }, time || 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
            return _this;
        }
        return WobblingText;
    }(Phaser.Text));
    exports.WobblingText = WobblingText;
});
define("entities/cursor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CursorEntity = /** @class */ (function (_super) {
        __extends(CursorEntity, _super);
        function CursorEntity(game) {
            var _this = _super.call(this, game, game.world.centerX, game.world.centerY, 'cursor', 0) || this;
            _this.game.add.existing(_this);
            _this.z = 99999;
            return _this;
        }
        CursorEntity.prototype.update = function () {
            this.x = this.game.input.mousePointer.x - 8;
            this.y = this.game.input.mousePointer.y;
        };
        CursorEntity.prototype.enableDeleteMode = function () {
            this.loadTexture('cursor-delete');
        };
        CursorEntity.prototype.enableNormalMode = function () {
            this.loadTexture('cursor');
        };
        return CursorEntity;
    }(Phaser.Sprite));
    exports.CursorEntity = CursorEntity;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/splash", ["require", "exports", "entities/wobblingText", "entities/cursor"], function (require, exports, wobblingText_1, cursor_1) {
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
            this.game.input.onTap.add(this.onTap, this);
            this.background = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'background');
            this.background.anchor.set(0.5);
            this.background.scale.set(1.1);
            this.title = new wobblingText_1.WobblingText(this.game, this.game.world.centerX, this.game.world.centerY - 200, 'Rescue hamsters!', this.getFontStyles('120px'));
            this.title.anchor.set(0.5);
            this.bigHamster = this.game.add.image(this.world.centerX, this.world.centerY, 'hamster-big');
            this.bigHamster.anchor.set(0.5, 0.5);
            this.bigHamster.rotation = 0.05;
            this.game.add.tween(this.bigHamster.scale).to({
                x: 1.05,
                y: 1.05
            }, 3000, Phaser.Easing.Linear.None, true, 0, -1, true);
            this.game.add.tween(this.bigHamster).to({
                rotation: -0.05
            }, 2000, Phaser.Easing.Linear.None, true, 0, -1, true);
            this.clickToPlay = new wobblingText_1.WobblingText(this.game, this.game.world.centerX, this.game.world.centerY + 200, 'Click here to play!', this.getFontStyles('60px'), 1000);
            this.clickToPlay.anchor.set(0.5);
            this.cursor = new cursor_1.CursorEntity(this.game);
            var music = new Phaser.Sound(this.game, 'music', 1, true);
            music.play();
        };
        Splash.prototype.onTap = function () {
            this.game.state.start('Gameplay', true, false);
        };
        Splash.prototype.getFontStyles = function (fontSize) {
            return {
                stroke: '#000',
                strokeThickness: 12,
                fill: '#fff',
                font: fontSize + " Comic Sans MS, Impact"
            };
        };
        Splash.prototype.destroy = function () {
            this.cursor.destroy();
            this.clickToPlay.destroy();
            this.title.destroy();
            this.background.destroy();
            this.bigHamster.destroy();
        };
        return Splash;
    }(Phaser.State));
    exports.Splash = Splash;
});
define("helpers/tiles", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerTiles;
    (function (PlayerTiles) {
        PlayerTiles[PlayerTiles["NONE"] = -1] = "NONE";
        PlayerTiles[PlayerTiles["TOP_GROUND"] = 0] = "TOP_GROUND";
        PlayerTiles[PlayerTiles["MIDDLE_GROUND"] = 1] = "MIDDLE_GROUND";
        PlayerTiles[PlayerTiles["SPRING"] = 2] = "SPRING";
    })(PlayerTiles = exports.PlayerTiles || (exports.PlayerTiles = {}));
    var PredefinedTiles;
    (function (PredefinedTiles) {
        PredefinedTiles[PredefinedTiles["NONE"] = -1] = "NONE";
        PredefinedTiles[PredefinedTiles["START_POINT"] = 0] = "START_POINT";
        PredefinedTiles[PredefinedTiles["FINISH_POINT"] = 1] = "FINISH_POINT";
        PredefinedTiles[PredefinedTiles["IVY_MIDDLE"] = 2] = "IVY_MIDDLE";
        PredefinedTiles[PredefinedTiles["IVY_BOTTOM"] = 3] = "IVY_BOTTOM";
    })(PredefinedTiles = exports.PredefinedTiles || (exports.PredefinedTiles = {}));
});
define("entities/hamster", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HamsterEntity = /** @class */ (function (_super) {
        __extends(HamsterEntity, _super);
        function HamsterEntity(game) {
            var _this = _super.call(this, game, game.world.centerX, 32, 'hamster-bumpster') || this;
            _this.game.add.existing(_this);
            _this.game.physics.enable(_this, Phaser.Physics.ARCADE);
            var body = _this.body;
            body.collideWorldBounds = true;
            body.skipQuadTree = true;
            body.maxVelocity.y = 600;
            _this.anchor.setTo(.32, .5);
            body.setSize(30, 32, 0, 0);
            body.velocity.x = 100;
            body.bounce.x = 1;
            _this.walk = _this.animations.add('walk');
            _this.animations.play('walk', 30, true);
            return _this;
        }
        HamsterEntity.prototype.update = function () {
            if (!this.isFlipped && this.body.velocity.x < 0) {
                this.scale.x *= -1;
                this.isFlipped = true;
            }
            if (this.isFlipped && this.body.velocity.x > 0) {
                this.scale.x *= -1;
                this.isFlipped = false;
            }
        };
        HamsterEntity.prototype.jumpOnSpring = function () {
            this.body.velocity.y = -666;
            this.isSpringJumping = true;
        };
        return HamsterEntity;
    }(Phaser.Sprite));
    exports.HamsterEntity = HamsterEntity;
});
define("entities/bloodBurst", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BloodBurstEntity = /** @class */ (function (_super) {
        __extends(BloodBurstEntity, _super);
        function BloodBurstEntity(game, x, y) {
            var _this = _super.call(this, game) || this;
            _this.game.add.existing(_this);
            _this.makeParticles('blood-cell');
            _this.gravity = -10;
            _this.setAlpha(0.3, 0.8);
            _this.setScale(0.5, 1);
            _this.x = x;
            _this.y = y;
            _this.start(true, 500, null, 30);
            return _this;
        }
        return BloodBurstEntity;
    }(Phaser.Particles.Arcade.Emitter));
    exports.BloodBurstEntity = BloodBurstEntity;
});
define("entities/magicGlow", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MagicGlowEntity = /** @class */ (function (_super) {
        __extends(MagicGlowEntity, _super);
        function MagicGlowEntity(game, x, y) {
            var _this = _super.call(this, game) || this;
            _this.game.add.existing(_this);
            _this.makeParticles('magic-glow-particle');
            _this.setRotation(0, 0);
            _this.setAlpha(0.5, 1);
            _this.gravity = -666;
            _this.x = x;
            _this.y = y;
            _this.start(false, 300, 50);
            return _this;
        }
        return MagicGlowEntity;
    }(Phaser.Particles.Arcade.Emitter));
    exports.MagicGlowEntity = MagicGlowEntity;
});
define("entities/nextLevelWindows", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NextLevelWindow = /** @class */ (function (_super) {
        __extends(NextLevelWindow, _super);
        function NextLevelWindow(game, saved, deaths) {
            var _this = _super.call(this, game) || this;
            _this.game.add.group(_this);
            // this.screenMask = this.game.add.image(0, 0, 'mask');
            // this.screenMask.scale.set(this.game.canvas.width, this.game.canvas.height);
            // this.add(this.screenMask);
            _this.finishLevelWindow = _this.game.add.sprite(_this.game.canvas.width / 2, _this.game.canvas.height / 2, 'next-level-window');
            _this.finishLevelWindow.anchor.set(0.5, 0.5);
            _this.add(_this.finishLevelWindow);
            _this.savedText = _this.game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2 - 60, 'Saved:  ' + saved, _this.getFontStyles());
            _this.savedText.anchor.set(0.5, 0.5);
            _this.add(_this.savedText);
            _this.deathsText = _this.game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2, 'Deaths:  ' + deaths, _this.getFontStyles());
            _this.deathsText.anchor.set(0.5, 0.5);
            _this.add(_this.deathsText);
            _this.nextLevelButton = game.add.button(_this.game.canvas.width / 2, _this.game.canvas.height / 2 + 80, 'button', function () {
                _this.onNextLevelClick();
            }, _this, 2, 1, 0);
            _this.nextLevelButton.input.useHandCursor = false;
            _this.nextLevelButton.anchor.set(0.5, 0.5);
            _this.add(_this.nextLevelButton);
            _this.nextLevelButtonText = game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2 + 80, 'Start next level', _this.getButtonFontStyle(), _this);
            _this.nextLevelButtonText.anchor.set(0.5, 0.5);
            return _this;
        }
        NextLevelWindow.prototype.getFontStyles = function () {
            return {
                stroke: '#000',
                strokeThickness: 12,
                fill: '#fff',
                font: '32px Comic Sans MS, Impact'
            };
        };
        NextLevelWindow.prototype.getButtonFontStyle = function () {
            return {
                stroke: '#000',
                strokeThickness: 8,
                fill: '#fff',
                font: '18px Comic Sans MS, Impact'
            };
        };
        return NextLevelWindow;
    }(Phaser.Group));
    exports.NextLevelWindow = NextLevelWindow;
});
define("entities/nextLevelCounter", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NextLevelCounter = /** @class */ (function (_super) {
        __extends(NextLevelCounter, _super);
        function NextLevelCounter(game, initialTimeInSeconds) {
            var _this = _super.call(this, game) || this;
            _this.counter = initialTimeInSeconds;
            _this.game.add.existing(_this);
            _this.counterText = _this.game.add.text(_this.game.world.width / 2, _this.game.world.height / 2, initialTimeInSeconds.toString(), _this.getFontStyles());
            _this.counterText.anchor.set(0.5, 0.5);
            _this.add(_this.counterText);
            _this.game.add.tween(_this.counterText).to({
                y: '+25'
            }, 500, Phaser.Easing.Exponential.InOut, true, 0, -1, true);
            _this.game.add.tween(_this.counterText.scale).to({
                x: 1.2,
                y: 1.2
            }, 500, Phaser.Easing.Elastic.InOut, true, 0, -1, true);
            _this.counterTimer = _this.game.time.events.loop(Phaser.Timer.SECOND, function () {
                _this.counter--;
                _this.counterText.setText(_this.counter.toString());
                if (_this.counter === 0) {
                    _this.counterText.setText('Go!');
                }
                else if (_this.counter === -1) {
                    _this.onCounterFinish();
                }
            }, _this);
            return _this;
        }
        NextLevelCounter.prototype.getFontStyles = function () {
            return {
                stroke: '#000',
                strokeThickness: 12,
                fill: '#fff',
                font: '120px Comic Sans MS, Impact'
            };
        };
        return NextLevelCounter;
    }(Phaser.Group));
    exports.NextLevelCounter = NextLevelCounter;
});
define("entities/disapearingText", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DisapearingText = /** @class */ (function (_super) {
        __extends(DisapearingText, _super);
        function DisapearingText(game, x, y, text, style, time) {
            var _this = _super.call(this, game, x, y, text, style) || this;
            _this.game.add.existing(_this);
            _this.game.add.tween(_this).to({
                y: '-150',
            }, time || 3000, Phaser.Easing.Linear.None, true, 0, 1);
            _this.game.add.tween(_this).to({
                alpha: 0
            }, 500, Phaser.Easing.Linear.None, true, time ? time - 500 : 2500);
            _this.game.time.events.add(!!time ? time : 3000, function () {
                _this.destroy();
                if (_this.onDestroy) {
                    _this.onDestroy();
                }
            }, _this);
            return _this;
        }
        return DisapearingText;
    }(Phaser.Text));
    exports.DisapearingText = DisapearingText;
});
define("entities/youLooseWindow", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var YouLooseWindow = /** @class */ (function (_super) {
        __extends(YouLooseWindow, _super);
        function YouLooseWindow(game, hamstersCount) {
            var _this = _super.call(this, game) || this;
            _this.game.add.group(_this);
            _this.window = _this.game.add.sprite(_this.game.canvas.width / 2, _this.game.canvas.height / 2, 'next-level-window');
            _this.window.anchor.set(0.5, 0.5);
            _this.add(_this.window);
            _this.titleText = _this.game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2 - 60, 'You loose!', _this.getFontStyles());
            _this.titleText.anchor.set(0.5, 0.5);
            _this.add(_this.titleText);
            _this.failedToSaveText = _this.game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2, "You failed to save " + hamstersCount + " hamsters", _this.getButtonFontStyle());
            _this.failedToSaveText.anchor.set(0.5, 0.5);
            _this.add(_this.failedToSaveText);
            _this.retryButton = game.add.button(_this.game.canvas.width / 2, _this.game.canvas.height / 2 + 80, 'button', function () {
                _this.onRetryClick();
            }, _this, 2, 1, 0);
            _this.retryButton.input.useHandCursor = false;
            _this.retryButton.anchor.set(0.5, 0.5);
            _this.add(_this.retryButton);
            _this.retryButtonText = game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2 + 80, 'Retry', _this.getButtonFontStyle(), _this);
            _this.retryButtonText.anchor.set(0.5, 0.5);
            return _this;
        }
        YouLooseWindow.prototype.getFontStyles = function () {
            return {
                stroke: '#000',
                strokeThickness: 12,
                fill: '#fff',
                font: '32px Comic Sans MS, Impact'
            };
        };
        YouLooseWindow.prototype.getButtonFontStyle = function () {
            return {
                stroke: '#000',
                strokeThickness: 8,
                fill: '#fff',
                font: '18px Comic Sans MS, Impact'
            };
        };
        return YouLooseWindow;
    }(Phaser.Group));
    exports.YouLooseWindow = YouLooseWindow;
});
define("entities/deletionTutorialWindow", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DeletionTutorialWindow = /** @class */ (function (_super) {
        __extends(DeletionTutorialWindow, _super);
        function DeletionTutorialWindow(game) {
            var _this = _super.call(this, game) || this;
            _this.game.add.group(_this);
            _this.window = _this.game.add.sprite(_this.game.canvas.width / 2, _this.game.canvas.height / 2, 'next-level-window');
            _this.window.anchor.set(0.5, 0.5);
            _this.add(_this.window);
            _this.titleText = _this.game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2 - 90, 'You can delete tiles!', _this.getFontStyles());
            _this.titleText.anchor.set(0.5, 0.5);
            _this.add(_this.titleText);
            _this.descriptionText = _this.game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2 + 10, "To delete tiles simply\nhold SHIFT and CLICK\nDeleted tiles will be returned \nto your inventory on right\n        ", _this.getInstructionsFontStyle());
            _this.descriptionText.anchor.set(0.5, 0.5);
            _this.descriptionText.lineSpacing = -10;
            _this.add(_this.descriptionText);
            _this.okButton = game.add.button(_this.game.canvas.width / 2, _this.game.canvas.height / 2 + 100, 'button', function () {
                _this.onOkClick();
            }, _this, 2, 1, 0);
            _this.okButton.input.useHandCursor = false;
            _this.okButton.anchor.set(0.5, 0.5);
            _this.add(_this.okButton);
            _this.okButtonText = game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2 + 100, 'Oookeeey!', _this.getButtonFontStyle(), _this);
            _this.okButtonText.anchor.set(0.5, 0.5);
            return _this;
        }
        DeletionTutorialWindow.prototype.getFontStyles = function () {
            return {
                stroke: '#000',
                strokeThickness: 12,
                fill: '#fff',
                font: '32px Comic Sans MS, Impact'
            };
        };
        DeletionTutorialWindow.prototype.getButtonFontStyle = function () {
            return {
                stroke: '#000',
                strokeThickness: 8,
                fill: '#fff',
                font: '18px Comic Sans MS, Impact'
            };
        };
        DeletionTutorialWindow.prototype.getInstructionsFontStyle = function () {
            return {
                stroke: '#000',
                strokeThickness: 8,
                fill: '#fff',
                font: '18px Comic Sans MS, Impact'
            };
        };
        return DeletionTutorialWindow;
    }(Phaser.Group));
    exports.DeletionTutorialWindow = DeletionTutorialWindow;
});
define("entities/goalTutorialWindow", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GoalTutorialWindow = /** @class */ (function (_super) {
        __extends(GoalTutorialWindow, _super);
        function GoalTutorialWindow(game) {
            var _this = _super.call(this, game) || this;
            _this.game.add.group(_this);
            _this.window = _this.game.add.sprite(_this.game.canvas.width / 2, _this.game.canvas.height / 2, 'next-level-window');
            _this.window.anchor.set(0.5, 0.5);
            _this.add(_this.window);
            _this.titleText = _this.game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2 - 100, 'Rescue hamsters!', _this.getFontStyles());
            _this.titleText.anchor.set(0.5, 0.5);
            _this.add(_this.titleText);
            _this.descriptionText = _this.game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2 + 10, "Hamsters are too stupid to\nfind the way out,\nso you need to build the level for them\nso they can go forward.\nNumber of hamster to save is given above.\n        ", _this.getInstructionsFontStyle());
            _this.descriptionText.anchor.set(0.5, 0.5);
            _this.descriptionText.lineSpacing = -10;
            _this.add(_this.descriptionText);
            _this.okButton = game.add.button(_this.game.canvas.width / 2, _this.game.canvas.height / 2 + 100, 'button', function () {
                _this.onOkClick();
            }, _this, 2, 1, 0);
            _this.okButton.input.useHandCursor = false;
            _this.okButton.anchor.set(0.5, 0.5);
            _this.add(_this.okButton);
            _this.okButtonText = game.add.text(_this.game.canvas.width / 2, _this.game.canvas.height / 2 + 100, 'I get it!', _this.getButtonFontStyle(), _this);
            _this.okButtonText.anchor.set(0.5, 0.5);
            return _this;
        }
        GoalTutorialWindow.prototype.getFontStyles = function () {
            return {
                stroke: '#000',
                strokeThickness: 12,
                fill: '#fff',
                font: '32px Comic Sans MS, Impact'
            };
        };
        GoalTutorialWindow.prototype.getButtonFontStyle = function () {
            return {
                stroke: '#000',
                strokeThickness: 8,
                fill: '#fff',
                font: '18px Comic Sans MS, Impact'
            };
        };
        GoalTutorialWindow.prototype.getInstructionsFontStyle = function () {
            return {
                stroke: '#000',
                strokeThickness: 8,
                fill: '#fff',
                font: '18px Comic Sans MS, Impact',
                align: 'center',
                boundsAlignH: "center", boundsAlignV: "middle"
            };
        };
        return GoalTutorialWindow;
    }(Phaser.Group));
    exports.GoalTutorialWindow = GoalTutorialWindow;
});
define("entities/groundBurst", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GroundBurstEntity = /** @class */ (function (_super) {
        __extends(GroundBurstEntity, _super);
        function GroundBurstEntity(game, x, y) {
            var _this = _super.call(this, game) || this;
            _this.game.add.existing(_this);
            _this.makeParticles('ground-cell');
            _this.gravity = -600;
            _this.setAlpha(0.3, 0.8);
            _this.setScale(0.5, 1);
            _this.x = x;
            _this.y = y;
            _this.start(true, 500, null, 30);
            return _this;
        }
        return GroundBurstEntity;
    }(Phaser.Particles.Arcade.Emitter));
    exports.GroundBurstEntity = GroundBurstEntity;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/gameplay", ["require", "exports", "helpers/tiles", "entities/hamster", "entities/cursor", "entities/bloodBurst", "entities/magicGlow", "entities/nextLevelWindows", "entities/nextLevelCounter", "entities/wobblingText", "entities/disapearingText", "entities/youLooseWindow", "entities/deletionTutorialWindow", "entities/goalTutorialWindow", "entities/groundBurst"], function (require, exports, tiles_1, hamster_1, cursor_2, bloodBurst_1, magicGlow_1, nextLevelWindows_1, nextLevelCounter_1, wobblingText_2, disapearingText_1, youLooseWindow_1, deletionTutorialWindow_1, goalTutorialWindow_1, groundBurst_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerTileType;
    (function (PlayerTileType) {
        PlayerTileType[PlayerTileType["GROUND"] = 0] = "GROUND";
        PlayerTileType[PlayerTileType["SPRING"] = 1] = "SPRING";
        PlayerTileType[PlayerTileType["HAMMER"] = 2] = "HAMMER";
    })(PlayerTileType = exports.PlayerTileType || (exports.PlayerTileType = {}));
    var Gameplay = /** @class */ (function (_super) {
        __extends(Gameplay, _super);
        function Gameplay() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.MAP_WIDTH = 240;
            _this.MAP_HEIGHT = 240;
            _this.TILE_SIZE = 32;
            _this.deathCounter = 0;
            _this.savedCounter = 0;
            _this.levels = [
                'level-01',
            ];
            _this.requiredSavesForNextLevel = [
                1,
                2,
                3,
                3,
                3,
                5
            ];
            _this.availableHamster = [
                5,
                5,
                5,
                5,
                15,
                15
            ];
            _this.levelLimits = [{
                    ground: 20,
                    springs: 0
                }, {
                    ground: 25,
                    springs: 3
                }, {
                    ground: 25,
                    springs: 3
                }, {
                    ground: 40,
                    springs: 4
                }, {
                    ground: 60,
                    springs: 5
                }, {
                    ground: 60,
                    springs: 5
                }];
            _this.currentLevelIndex = 0;
            _this.groundTilesNumber = 0;
            _this.springTilesNumber = 0;
            return _this;
        }
        Gameplay.prototype.preload = function () { };
        Gameplay.prototype.generateCsvMapFromArray = function () {
            var data = '';
            for (var iy = 0; iy < this.MAP_WIDTH; iy++) {
                for (var jx = 0; jx < this.MAP_HEIGHT; jx++) {
                    if (iy > 15) {
                        data += tiles_1.PlayerTiles.NONE;
                    }
                    else {
                        data += tiles_1.PlayerTiles.NONE;
                    }
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
            var _this = this;
            this.game.cache.addTilemap('dynamicMap', null, this.generateCsvMapFromArray(), Phaser.Tilemap.CSV);
            var background = this.game.add.image(this.game.world.centerX - this.TILE_SIZE, this.game.world.centerY, 'background');
            background.anchor.set(0.5);
            background.scale.set(1);
            this.setupTilesFrame();
            this.setupPredefinedMap(this.levels[this.currentLevelIndex]);
            this.setupPlayerMap();
            this.setupPhysics();
            this.setupDeathSpace();
            var nextLevelHotKey = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
            nextLevelHotKey.onDown.add(function () {
                _this.setupNextLevel();
                _this.placeHamsterOnStart();
            }, this);
            this.selectTileSound = this.game.add.audio('select-tile');
            this.hamsterCounter = 0;
            this.deathCounter = 0;
            this.notifyAboutGoal(function () {
                _this.nextLevelCounter = new nextLevelCounter_1.NextLevelCounter(_this.game, 3);
                _this.nextLevelCounter.onCounterFinish = function () {
                    _this.nextLevelCounter.destroy();
                    _this.cursor = new cursor_2.CursorEntity(_this.game);
                    _this.placeHamsterOnStart();
                    _this.setupTexts();
                };
            });
            this.playerTileIndicator = this.game.add.sprite(-200, -200, 'magic-glow-particle');
            this.playerTileIndicator.scale.set(3);
            this.playerTileIndicator.anchor.set(0.5, 0.5);
        };
        Gameplay.prototype.destroy = function () {
            this.hamster.destroy();
            this.hamsterCounterText.destroy();
            this.deathCounterText.destroy();
            this.sound.destroy();
            this.groundButton.destroy();
            this.groundText.destroy();
            this.springButton.destroy();
            this.springText.destroy();
            this.startMagicGlow.destroy();
            this.finishMagicGlow.destroy();
        };
        Gameplay.prototype.setupTexts = function () {
            if (this.deathCounterText) {
                this.deathCounterText.destroy();
            }
            if (this.savedCounterText) {
                this.savedCounterText.destroy();
            }
            if (this.hamsterCounterText) {
                this.hamsterCounterText.destroy();
            }
            this.deathCounterText = new wobblingText_2.WobblingText(this.game, this.game.world.centerX + 200, this.TILE_SIZE, '', this.getFontStyles());
            this.deathCounterText.anchor.set(0.5, 0.5);
            this.savedCounterText = new wobblingText_2.WobblingText(this.game, this.game.world.centerX, this.TILE_SIZE, '', this.getFontStyles());
            this.savedCounterText.anchor.set(0.5, 0.5);
            this.hamsterCounterText = new wobblingText_2.WobblingText(this.game, this.game.world.centerX - 200, this.TILE_SIZE, '', this.getFontStyles());
            this.hamsterCounterText.anchor.set(0.5, 0.5);
        };
        Gameplay.prototype.placeHamsterOnStart = function () {
            var _this = this;
            if (!this.hamster) {
                this.hamster = new hamster_1.HamsterEntity(this.game);
                this.hamster.inputEnabled = true;
                this.hamster.events.onInputDown.add(function () {
                    if (_this.currentTile === PlayerTileType.HAMMER) {
                        _this.killHamster();
                    }
                });
            }
            this.hamster.physicsEnabled = true;
            this.hamster.body.velocity.y = 0;
            this.hamster.position.set(this.startPoint.x, this.startPoint.y);
            this.shouldRevive = true;
        };
        Gameplay.prototype.setupPhysics = function () {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 1000;
            this.game.physics.arcade.checkCollision.down = false;
            this.game.physics.arcade.checkCollision.up = false;
            this.game.world.setBounds(0, 0, this.TILE_SIZE * 30, this.TILE_SIZE * 20);
        };
        Gameplay.prototype.setupPlayerMap = function () {
            this.playerMap = this.game.add.tilemap('dynamicMap', this.TILE_SIZE, this.TILE_SIZE);
            this.playerMap.addTilesetImage('tiles', 'tiles', this.TILE_SIZE, this.TILE_SIZE);
            this.playerMapLayer = this.playerMap.createLayer(0);
            this.playerMap.setCollisionBetween(0, 2);
            this.playerMap.setTileIndexCallback(tiles_1.PlayerTiles.SPRING, function (sprite, tile) {
                if (sprite instanceof hamster_1.HamsterEntity) {
                    var hammsterBody = sprite.body;
                    hammsterBody.velocity.set(hammsterBody.velocity.x, -600);
                }
            }, this);
            this.activateTilesBasedOnAvalability();
        };
        Gameplay.prototype.setupNextLevel = function () {
            this.destroyMaps();
            if (!this.levels[this.currentLevelIndex + 1]) {
                this.game.state.start('Win');
                return;
            }
            this.setupPredefinedMap(this.levels[++this.currentLevelIndex]);
            this.setupLevelStart();
        };
        Gameplay.prototype.setupCurrentLevel = function () {
            this.destroyMaps();
            this.setupPredefinedMap(this.levels[this.currentLevelIndex]);
            this.setupLevelStart();
        };
        Gameplay.prototype.destroyMaps = function () {
            this.predefinedMapLayer.destroy();
            this.predefinedMap.destroy();
            this.playerMapLayer.destroy();
            this.playerMap.destroy();
        };
        Gameplay.prototype.setupLevelStart = function () {
            var _this = this;
            this.groundTilesNumber = 0;
            this.springTilesNumber = 0;
            this.setupPlayerMap();
            this.activateTilesBasedOnAvalability();
            this.setupTexts();
            this.nextLevelCounter = new nextLevelCounter_1.NextLevelCounter(this.game, 3);
            this.nextLevelCounter.onCounterFinish = function () {
                _this.setupTexts();
                _this.nextLevelCounter.destroy();
                _this.placeHamsterOnStart();
            };
            this.hamsterCounter = 0;
        };
        Gameplay.prototype.getFontStyles = function () {
            return {
                stroke: '#000',
                strokeThickness: 12,
                fill: '#fff',
                font: '24px Comic Sans MS, Impact'
            };
        };
        Gameplay.prototype.setupPredefinedMap = function (level) {
            var _this = this;
            this.predefinedMap = this.game.add.tilemap(level, 32, 32);
            this.predefinedMap.addTilesetImage('predefined-tiles');
            this.predefinedMapLayer = this.predefinedMap.createLayer(0);
            this.startPoint = this.findStartLocation();
            if (this.startMagicGlow && this.startMagicGlow.game) {
                this.startMagicGlow.destroy();
            }
            var glowShift = this.TILE_SIZE / 2;
            this.startMagicGlow = new magicGlow_1.MagicGlowEntity(this.game, this.startPoint.x + glowShift, this.startPoint.y + glowShift);
            var findFinishLocation = this.findFinishLocation();
            if (this.finishMagicGlow && this.finishMagicGlow.game) {
                this.finishMagicGlow.destroy();
            }
            this.finishMagicGlow = new magicGlow_1.MagicGlowEntity(this.game, findFinishLocation.x + glowShift, findFinishLocation.y + glowShift);
            this.predefinedMap.setTileIndexCallback(tiles_1.PredefinedTiles.FINISH_POINT, function () {
                _this.savedCounter++;
                if (_this.savedCounter === _this.requiredSavesForNextLevel[_this.currentLevelIndex]) {
                    _this.saveLastHamster();
                    _this.finishLevel();
                    // this.savedCounter = 0;
                    // this.setupNextLevel();
                    // this.hamster.position.set(-2000, -2000);
                    // this.killHamster();
                }
                else {
                    _this.saveHamster();
                }
            }, this);
            this.predefinedMap.setTileIndexCallback(tiles_1.PredefinedTiles.IVY_MIDDLE, function () {
                _this.killHamster();
            }, this);
        };
        Gameplay.prototype.findStartLocation = function () {
            var mapArray = this.predefinedMapLayer.getTiles(0, 0, this.world.width, this.world.height);
            for (var i = 0; i < mapArray.length; i++) {
                var myTile = mapArray[i];
                if (myTile.index == 0) {
                    return new Phaser.Point(myTile.worldX, myTile.worldY);
                }
            }
            throw new Error('Cannot find a start point for this map');
        };
        Gameplay.prototype.findFinishLocation = function () {
            var mapArray = this.predefinedMapLayer.getTiles(0, 0, this.world.width, this.world.height);
            for (var i = 0; i < mapArray.length; i++) {
                var myTile = mapArray[i];
                if (myTile.index == 1) {
                    return new Phaser.Point(myTile.worldX, myTile.worldY);
                }
            }
            this.currentTile = PlayerTileType.GROUND;
            throw new Error('Cannot find a finish point for this map');
        };
        Gameplay.prototype.setupTilesFrame = function () {
            var frame = this.game.add.image(this.game.canvas.width, 0, 'frame');
            frame.anchor.set(1, 0);
        };
        Gameplay.prototype.activateTilesBasedOnAvalability = function () {
            var currentLevel = this.levels[this.currentLevelIndex];
            if (currentLevel === 'level-01') {
                this.activateGroundTile();
                this.activateHammerTile();
            }
            if (currentLevel === 'level-02') {
                this.activateSpringTile();
            }
            this.setupCursor();
        };
        Gameplay.prototype.setupCursor = function () {
            if (this.cursor) {
                this.cursor.destroy();
            }
            this.cursor = new cursor_2.CursorEntity(this.game);
        };
        Gameplay.prototype.finishLevel = function () {
            var _this = this;
            this.nextLevelWindow = new nextLevelWindows_1.NextLevelWindow(this.game, this.savedCounter, this.deathCounter);
            this.nextLevelWindow.onNextLevelClick = function () {
                _this.nextLevelWindow.destroy();
                _this.savedCounter = 0;
                _this.setupNextLevel();
            };
            this.setupCursor();
        };
        Gameplay.prototype.setupDeathSpace = function () {
            this.deathSpace = this.game.add.sprite(-this.TILE_SIZE * 2, this.world.height + this.TILE_SIZE);
            this.deathSpace.width = this.world.width + this.TILE_SIZE * 4;
            this.deathSpace.height = this.TILE_SIZE;
            this.game.physics.arcade.enable([this.deathSpace]);
            var body = this.deathSpace.body;
            body.allowGravity = false;
            body.immovable = true;
        };
        Gameplay.prototype.activateGroundTile = function () {
            var _this = this;
            this.groundKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
            this.groundKey.onDown.add(function () {
                _this.currentTile = PlayerTileType.GROUND;
            }, this);
            this.groundButton = this.game.add.sprite(this.game.canvas.width - this.TILE_SIZE / 2, this.TILE_SIZE / 2, 'tiles-sheet');
            this.groundButton.inputEnabled = true;
            this.groundButton.anchor.set(1, 0);
            this.groundButton.events.onInputDown.add(function () {
                _this.currentTile = PlayerTileType.GROUND;
                _this.selectTileSound.play();
            }, this);
            this.groundText = new wobblingText_2.WobblingText(this.game, this.groundButton.x, this.groundButton.y + this.TILE_SIZE, '0', this.getTileCounterFontStyle());
            this.groundText.anchor.set(0.5, 0.5);
        };
        Gameplay.prototype.activateHammerTile = function () {
            var _this = this;
            this.hammerKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
            this.hammerKey.onDown.add(function () {
                _this.currentTile = PlayerTileType.HAMMER;
            }, this);
            this.hammerButton = this.game.add.sprite(this.game.canvas.width - this.TILE_SIZE / 2, this.TILE_SIZE * 4.5, 'tiles-sheet');
            this.hammerButton.frame = 3;
            this.hammerButton.inputEnabled = true;
            this.hammerButton.anchor.set(1, 0);
            this.hammerButton.events.onInputDown.add(function () {
                _this.currentTile = PlayerTileType.HAMMER;
                _this.selectTileSound.play();
            }, this);
            this.hammerText = new wobblingText_2.WobblingText(this.game, this.hammerButton.x, this.hammerButton.y + this.TILE_SIZE, '∞', this.getTileCounterFontStyle());
            this.hammerText.anchor.set(0.5, 0.5);
        };
        Gameplay.prototype.activateSpringTile = function () {
            var _this = this;
            this.springKey = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
            this.springKey.onDown.add(function () {
                _this.currentTile = PlayerTileType.SPRING;
            }, this);
            this.springButton = this.game.add.sprite(this.game.canvas.width - this.TILE_SIZE * 1.5, this.TILE_SIZE / 2 + 64, 'tiles-sheet');
            this.springButton.inputEnabled = true;
            this.springButton.frame = 2;
            this.springButton.events.onInputDown.add(function () {
                _this.currentTile = PlayerTileType.SPRING;
                _this.selectTileSound.play();
            }, this);
            this.springText = new wobblingText_2.WobblingText(this.game, this.springButton.x + this.TILE_SIZE, this.springButton.y + this.TILE_SIZE, '0', this.getTileCounterFontStyle());
            this.springText.anchor.set(0.5, 0.5);
        };
        Gameplay.prototype.getTileCounterFontStyle = function () {
            return {
                stroke: '#000',
                strokeThickness: 6,
                fill: '#fff',
                font: '18px Comic Sans MS, Impact'
            };
        };
        Gameplay.prototype.killHamster = function (noBlood) {
            var _this = this;
            if (this.hamsterCounter === this.availableHamster[this.currentLevelIndex] + 1) {
                return;
            }
            var blood;
            if (!noBlood) {
                blood = new bloodBurst_1.BloodBurstEntity(this.game, this.hamster.position.x + this.hamster.body.velocity.x * 0.15, this.hamster.position.y);
            }
            var deathInfo = new disapearingText_1.DisapearingText(this.game, this.hamster.x, this.hamster.y, '-1 Hamster', this.getFontStyles(), 3000);
            this.game.time.events.add(Phaser.Timer.SECOND * 4, function () {
                deathInfo.destroy();
            });
            this.hamster.position.set(-200, -200);
            this.hamster.physicsEnabled = false;
            this.hamster.kill();
            if (this.hamsterCounter === this.availableHamster[this.currentLevelIndex]) {
                this.youLooseWindow = new youLooseWindow_1.YouLooseWindow(this.game, this.requiredSavesForNextLevel[this.currentLevelIndex]);
                this.setupCursor();
                this.hamsterCounter = this.availableHamster[this.currentLevelIndex] + 1;
                this.youLooseWindow.onRetryClick = function () {
                    _this.setupCurrentLevel();
                    _this.youLooseWindow.destroy();
                    _this.youLooseWindow = undefined;
                };
                return;
            }
            this.game.time.events.add(Phaser.Timer.SECOND * 3, function () {
                _this.placeHamsterOnStart();
            });
            this.game.time.events.add(Phaser.Timer.SECOND * 3, function () {
                if (blood) {
                    blood.destroy();
                    blood = undefined;
                }
            }, this);
            this.deathCounter++;
        };
        Gameplay.prototype.saveLastHamster = function () {
            this.hamster.position.set(-200, -200);
            this.hamster.physicsEnabled = false;
            this.hamster.kill();
        };
        Gameplay.prototype.saveHamster = function () {
            var _this = this;
            var deathInfo = new disapearingText_1.DisapearingText(this.game, this.hamster.x, this.hamster.y, '+1 Rescued', this.getFontStyles(), 3000);
            this.game.time.events.add(Phaser.Timer.SECOND * 4, function () {
                deathInfo.destroy();
            });
            this.hamster.position.set(-200, -200);
            this.hamster.physicsEnabled = false;
            this.hamster.kill();
            this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {
                _this.placeHamsterOnStart();
            });
        };
        Gameplay.prototype.update = function () {
            var _this = this;
            this.game.physics.arcade.collide(this.hamster, this.playerMapLayer);
            this.game.physics.arcade.collide(this.hamster, this.predefinedMapLayer);
            this.game.physics.arcade.collide(this.hamster, this.deathSpace, function (sprite1, sprite2) {
                if (sprite1.alive) {
                    _this.killHamster();
                }
            });
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
                this.cursor.enableDeleteMode();
            }
            else {
                this.cursor.enableNormalMode();
            }
            var currentLimits = this.levelLimits[this.currentLevelIndex];
            if (this.game.input.mousePointer.isDown) {
                if (this.game.input.mousePointer.x > this.TILE_SIZE * 30) {
                    return;
                }
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
                    this.deletePlayerTile();
                    return;
                }
                if (!this.checkIfPlayerCanPlaceTile()) {
                    return;
                }
                if (this.currentTile === PlayerTileType.HAMMER) {
                    return;
                }
                if (this.currentTile === PlayerTileType.GROUND) {
                    this.updatePlayerTileGround();
                }
                if (this.currentTile === PlayerTileType.SPRING) {
                    this.updatePlayerTileSpring();
                }
            }
            if (this.shouldRevive) {
                this.hamster.revive();
                this.hamsterCounter++;
                this.shouldRevive = false;
            }
            if (this.currentTile === PlayerTileType.HAMMER) {
                this.playerTileIndicator.position.set(this.game.canvas.width - 48, 32 * 4.5);
                this.playerTileIndicator.bringToTop();
            }
            if (this.currentTile === PlayerTileType.GROUND) {
                this.playerTileIndicator.position.set(this.game.canvas.width - 48, 32 * 0.5);
                this.playerTileIndicator.bringToTop();
            }
            if (this.currentTile === PlayerTileType.SPRING) {
                this.playerTileIndicator.position.set(this.game.canvas.width - 48, 32 * 2.5);
                this.playerTileIndicator.bringToTop();
            }
        };
        Gameplay.prototype.deletePlayerTile = function () {
            var thisTile = this.playerMap.getTileWorldXY(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
            if (thisTile) {
                var groundBurst_2 = new groundBurst_1.GroundBurstEntity(this.game, this.game.input.mousePointer.x, this.game.input.mousePointer.y);
                this.game.time.events.add(3000, function () {
                    groundBurst_2.destroy();
                });
            }
            this.returnTileInType(thisTile);
            this.playerMap.putTileWorldXY(tiles_1.PlayerTiles.NONE, this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.TILE_SIZE, this.TILE_SIZE, this.playerMapLayer);
        };
        Gameplay.prototype.updatePlayerTileGround = function () {
            var thisTile = this.playerMap.getTileWorldXY(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
            if (!!thisTile && (thisTile.index === tiles_1.PlayerTiles.TOP_GROUND || thisTile.index === tiles_1.PlayerTiles.MIDDLE_GROUND)) {
                return;
            }
            if (this.groundTilesNumber === this.levelLimits[this.currentLevelIndex].ground) {
                this.notifyAboutLimit();
                return;
            }
            this.returnTileInType(thisTile);
            var tileTypeToPlace = tiles_1.PlayerTiles.NONE;
            var tileAbove = this.playerMap.getTileWorldXY(this.game.input.mousePointer.x, this.game.input.mousePointer.y - this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
            if (!!tileAbove &&
                (tileAbove.index === tiles_1.PlayerTiles.TOP_GROUND ||
                    tileAbove.index === tiles_1.PlayerTiles.MIDDLE_GROUND)) {
                tileTypeToPlace = tiles_1.PlayerTiles.MIDDLE_GROUND;
            }
            else {
                tileTypeToPlace = tiles_1.PlayerTiles.TOP_GROUND;
            }
            var tileBelow = this.playerMap.getTileWorldXY(this.game.input.mousePointer.x, this.game.input.mousePointer.y + this.TILE_SIZE);
            if (!!tileBelow && tileBelow.index === tiles_1.PlayerTiles.TOP_GROUND) {
                this.playerMap.putTileWorldXY(tiles_1.PlayerTiles.MIDDLE_GROUND, tileBelow.worldX, tileBelow.worldY, this.TILE_SIZE, this.TILE_SIZE);
            }
            this.playerMap.putTileWorldXY(tileTypeToPlace, this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.TILE_SIZE, this.TILE_SIZE, this.playerMapLayer);
            this.groundTilesNumber++;
        };
        Gameplay.prototype.checkIfPlayerCanPlaceTile = function () {
            var tile = this.predefinedMap.getTileWorldXY(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
            return !tile;
        };
        Gameplay.prototype.updatePlayerTileSpring = function () {
            var tileTypeToPlace = tiles_1.PlayerTiles.SPRING;
            var thisTile = this.playerMap.getTileWorldXY(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
            if (!!thisTile && thisTile.index === tiles_1.PlayerTiles.SPRING) {
                return;
            }
            if (this.springTilesNumber === this.levelLimits[this.currentLevelIndex].springs) {
                this.notifyAboutLimit();
                return;
            }
            this.returnTileInType(thisTile);
            this.playerMap.putTileWorldXY(tileTypeToPlace, this.game.input.mousePointer.x, this.game.input.mousePointer.y, this.TILE_SIZE, this.TILE_SIZE, this.playerMapLayer);
            this.springTilesNumber++;
        };
        Gameplay.prototype.returnTileInType = function (thisTile) {
            if (thisTile == null) {
                return;
            }
            if (thisTile.index === tiles_1.PlayerTiles.SPRING) {
                this.springTilesNumber--;
            }
            else if (thisTile.index === tiles_1.PlayerTiles.TOP_GROUND || thisTile.index === tiles_1.PlayerTiles.MIDDLE_GROUND) {
                this.groundTilesNumber--;
            }
        };
        Gameplay.prototype.notifyAboutLimit = function () {
            var _this = this;
            if (!this.limitReachedText) {
                var deletionTutorial = JSON.parse(window.localStorage.getItem('deletion-tutorial'));
                if (!deletionTutorial) {
                    this.notifyAboutDeletionPossibility();
                }
                this.limitReachedText = new disapearingText_1.DisapearingText(this.game, this.input.mousePointer.x, this.input.mousePointer.y, 'Limit reached', this.getFontStyles(), 2000);
                this.limitReachedText.onDestroy = function () {
                    _this.limitReachedText = undefined;
                };
            }
        };
        Gameplay.prototype.notifyAboutDeletionPossibility = function () {
            var _this = this;
            var deletionTutorialWindow = new deletionTutorialWindow_1.DeletionTutorialWindow(this.game);
            window.localStorage.setItem('deletion-tutorial', JSON.stringify(true));
            this.game.physics.arcade.isPaused = true;
            this.setupCursor();
            deletionTutorialWindow.onOkClick = function () {
                _this.game.physics.arcade.isPaused = false;
                deletionTutorialWindow.destroy();
            };
        };
        Gameplay.prototype.notifyAboutGoal = function (callback) {
            var _this = this;
            var goalTutorial = JSON.parse(window.localStorage.getItem('goal-tutorial'));
            if (goalTutorial) {
                callback();
                return;
            }
            var goalTutorialWindow = new goalTutorialWindow_1.GoalTutorialWindow(this.game);
            window.localStorage.setItem('goal-tutorial', JSON.stringify(true));
            this.game.physics.arcade.isPaused = true;
            this.setupCursor();
            goalTutorialWindow.onOkClick = function () {
                _this.game.physics.arcade.isPaused = false;
                goalTutorialWindow.destroy();
                callback();
            };
        };
        Gameplay.prototype.render = function () {
            // this.game.debug.bodyInfo(this.hamster, 0, 0);
            // this.game.debug.body(this.hamster);
            if (this.deathCounterText) {
                this.deathCounterText.text = 'Dead  ' + this.deathCounter.toString();
            }
            if (this.savedCounterText) {
                this.savedCounterText.text = 'Rescued  ' + this.savedCounter.toString() + '/' + this.requiredSavesForNextLevel[this.currentLevelIndex];
            }
            if (this.hamsterCounterText) {
                this.hamsterCounterText.text = 'Hamster  ' + (Math.min(this.availableHamster[this.currentLevelIndex] - this.hamsterCounter + 1, this.availableHamster[this.currentLevelIndex])).toString() + '/' + this.availableHamster[this.currentLevelIndex];
            }
            if (this.groundText) {
                this.groundText.text = (this.levelLimits[this.currentLevelIndex].ground - this.groundTilesNumber).toString();
            }
            if (this.springText) {
                this.springText.text = (this.levelLimits[this.currentLevelIndex].springs - this.springTilesNumber).toString();
            }
            this.game.deathCounter = this.deathCounter;
        };
        return Gameplay;
    }(Phaser.State));
    exports.Gameplay = Gameplay;
});
define("entities/hamsterRain", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HamsterRain = /** @class */ (function (_super) {
        __extends(HamsterRain, _super);
        function HamsterRain(game) {
            var _this = _super.call(this, game, -32, game.world.centerY) || this;
            _this.game = game;
            _this.height = game.world.height;
            _this.width = 1;
            _this.makeParticles('hamster');
            _this.minParticleScale = 1;
            _this.maxParticleScale = 2;
            _this.alpha = 1;
            _this.gravity = 0;
            _this.game.physics.arcade.gravity.y = 0;
            _this.setYSpeed(-5, 5);
            _this.setXSpeed(100, 200);
            _this.start(false, 15000, 500, 200);
            return _this;
        }
        return HamsterRain;
    }(Phaser.Particles.Arcade.Emitter));
    exports.HamsterRain = HamsterRain;
});
/// <reference path="../../node_modules/phaser/typescript/phaser.d.ts" />
define("states/win", ["require", "exports", "entities/wobblingText", "entities/cursor", "entities/hamsterRain"], function (require, exports, wobblingText_3, cursor_3, hamsterRain_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Win = /** @class */ (function (_super) {
        __extends(Win, _super);
        function Win() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Win.prototype.preload = function () {
            this.game.stage.backgroundColor = 0xB20059;
        };
        Win.prototype.create = function () {
            this.game.world.setBounds(0, 0, 32 * 32, 32 * 20);
            this.game.input.onTap.add(this.onTap, this);
            this.background = this.game.add.image(this.game.world.centerX, this.game.world.centerY, 'background');
            this.background.anchor.set(0.5);
            this.background.scale.set(1.2);
            this.hamsterRain = new hamsterRain_1.HamsterRain(this.game);
            this.title = new wobblingText_3.WobblingText(this.game, this.game.world.centerX, this.game.world.centerY - 150, 'You win!', this.getFontStyles('120px'));
            this.title.anchor.set(0.5);
            this.score = new wobblingText_3.WobblingText(this.game, this.game.world.centerX, this.game.world.centerY, "Only " + this.game.deathCounter + " hamsters\ndied in the process!", this.getFontStyles('40px'));
            this.score.anchor.set(0.5);
            this.clickToPlay = new wobblingText_3.WobblingText(this.game, this.game.world.centerX, this.game.world.centerY + 150, 'Click here to play again!', this.getFontStyles('20px'), 1000);
            this.clickToPlay.anchor.set(0.5);
            this.cursor = new cursor_3.CursorEntity(this.game);
        };
        Win.prototype.onTap = function () {
            this.game.state.start('Splash', true, false);
            window.location.reload();
        };
        Win.prototype.getFontStyles = function (fontSize) {
            return {
                stroke: '#000',
                strokeThickness: 12,
                fill: '#fff',
                font: fontSize + " Comic Sans MS, Impact",
                align: 'center'
            };
        };
        Win.prototype.destroy = function () {
            this.game.deathCounter = 0;
            this.cursor.destroy();
            this.clickToPlay.destroy();
            this.title.destroy();
            this.background.destroy();
            this.bigHamster.destroy();
        };
        return Win;
    }(Phaser.State));
    exports.Win = Win;
});
/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
define("game", ["require", "exports", "states/boot", "states/preloader", "states/splash", "states/gameplay", "states/win"], function (require, exports, boot_1, preloader_1, splash_1, gameplay_1, win_1) {
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
            _this.state.add('Win', win_1.Win, false);
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
