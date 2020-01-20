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
var com_main;
(function (com_main) {
    var TestAnimUI = /** @class */ (function (_super_1) {
        __extends(TestAnimUI, _super_1);
        function TestAnimUI() {
            var _this = _super_1.call(this) || this;
            _this.typeTag = 1;
            _this.initApp("test/TestAnimUI.exml");
            _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddStage, _this);
            com_main.EventMgr.addEvent(TestNav.TEST_ANIM_SCALE, function (scale) {
                _this.lbScale.text = "缩放： " + Math.floor(scale * 100) + "%";
            }, _this);
            return _this;
        }
        TestAnimUI.prototype.onAddStage = function () {
        };
        TestAnimUI.prototype.onTouchBegan = function (e) {
            var x = e.stageX;
            var y = e.stageY;
            var x2 = this.test_shape.x;
            var y2 = this.test_shape.y;
            var angle = Utils.MathUtils.getRadian2(x, y, x2, y2) * 180 / Math.PI;
            this.test_label.text = "角度 ： " + angle;
        };
        TestAnimUI.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            // var shp:egret.Shape = new egret.Shape();
            // shp.graphics.lineStyle( 2, 0x00ff00 );
            // shp.graphics.beginFill( 0xff0000, 1);
            // shp.graphics.drawCircle( 0, 0, 2 );
            // shp.graphics.endFill();
            // shp.x = this.test_group.height / 2;
            // shp.y = this.test_group.width / 2;
            // this.test_shape = shp;
            // this.test_group.addChild(shp);
            // this.test_group.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);
            // var square = new ManualSquare(1001);
            // square.x = 300;
            // square.y = 300;
            // this.addChild(square);
            this.initHslider();
            // com_main.EventManager.addTouchScaleListener(this.btnLancer, this, () => {
            // 	EventMgr.dispatchEvent(TestNav.TEST_CREATE_LANCER, "");
            // });
            // com_main.EventManager.addTouchScaleListener(this.btnCatapult, this, () => {
            // 	EventMgr.dispatchEvent(TestNav.TEST_CREATE_CATAPULT, "");
            // });
            // com_main.EventManager.addTouchScaleListener(this.btnArcher, this, () => {
            // 	EventMgr.dispatchEvent(TestNav.TEST_CREATE_ARCHER, "");
            // });
            com_main.EventManager.addTouchScaleListener(this.btnStand, this, function () {
                com_main.EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, 1);
            });
            com_main.EventManager.addTouchScaleListener(this.btnWalk, this, function () {
                com_main.EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, 2);
            });
            com_main.EventManager.addTouchScaleListener(this.btnAttack, this, function () {
                com_main.EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, 3);
            });
            com_main.EventManager.addTouchScaleListener(this.btnDead, this, function () {
                com_main.EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, 4);
            });
            com_main.EventManager.addTouchScaleListener(this.btnFly, this, function () {
                com_main.EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, 5);
            });
            com_main.EventManager.addTouchScaleListener(this.btnClean, this, function () {
                com_main.EventMgr.dispatchEvent(TestNav.TEST_CLEAN, 4);
            });
            com_main.EventManager.addTouchScaleListener(this.btnCreate, this, function () {
                // EventMgr.dispatchEvent(TestNav.TEST_IS_CREATER_SOLDIER, 4);
                com_main.EventMgr.dispatchEvent(TestNav.TEST_START_SKILL, 4);
            });
            var sourceArr = [];
            for (var i in C.ArmyModelConfig) {
                var config = C.ArmyModelConfig[i];
                sourceArr.push({ type: config.description, code: config.id });
            }
            this.dropListView.setArrayCollection(sourceArr);
            this.dropListView.setItemTapCallback(function (index) {
                debug("select : " + index);
                if (_this.typeTag == 1) {
                    var data = sourceArr[index];
                    com_main.EventMgr.dispatchEvent(TestNav.TEST_CREATE_SQUARE, data);
                    // switch (index) {
                    // 	case 0:
                    // 		EventMgr.dispatchEvent(TestNav.TEST_CREATE_LANCER, "");
                    // 		break;
                    // 	case 1:
                    // 		EventMgr.dispatchEvent(TestNav.TEST_CREATE_CATAPULT, "");
                    // 		break;
                    // 	case 2:
                    // 		EventMgr.dispatchEvent(TestNav.TEST_CREATE_ARCHER, "");
                    // 		break;
                    // 	case 3:
                    // 		EventMgr.dispatchEvent(TestNav.TEST_CREATE_KNIGHT, "");
                    // 		break;
                    // 	case 4:
                    // 		EventMgr.dispatchEvent(TestNav.TEST_CREATE_HOPLITE, "");
                    // 		break;
                    // }
                }
                else if (_this.typeTag == 2) {
                    var eid = index + 1;
                    com_main.EventMgr.dispatchEvent(TestNav.TEST_CREATE_EFFECT, eid);
                }
            }, this);
            var sourceArr2 = [];
            sourceArr2.push({ type: "待机" });
            sourceArr2.push({ type: "行走" });
            sourceArr2.push({ type: "攻击" });
            sourceArr2.push({ type: "死亡" });
            this.dropListView2.setArrayCollection(sourceArr2);
            this.dropListView2.setItemTapCallback(function (index) {
                var status = index + 1;
                com_main.EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, status);
            }, this);
            var sourceArr3 = [];
            sourceArr3.push({ type: "右下" });
            sourceArr3.push({ type: "下" });
            sourceArr3.push({ type: "左下" });
            sourceArr3.push({ type: "左" });
            sourceArr3.push({ type: "左上" });
            sourceArr3.push({ type: "上" });
            sourceArr3.push({ type: "右上" });
            sourceArr3.push({ type: "右" });
            this.dropListView3.setArrayCollection(sourceArr3);
            this.dropListView3.setItemTapCallback(function (index) {
                var dir = index + 1;
                com_main.EventMgr.dispatchEvent(TestNav.TEST_CHANGE_DIR, dir);
            }, this);
            // 特效列表
            var sourceArr4 = [];
            for (var i in C.EffectConfig) {
                var config = C.EffectConfig[i];
                if (config.testUIShow == 1) {
                    sourceArr4.push({ type: config.description, code: config.id });
                }
            }
            this.dropListView4.setArrayCollection(sourceArr4);
            this.dropListView4.setItemTapCallback(function (index) {
                // let eid = index + 1;
                var data = sourceArr4[index];
                com_main.EventMgr.dispatchEvent(TestNav.TEST_CREATE_EFFECT, data);
            }, this);
            var sourceArr5 = [];
            sourceArr5.push({ type: "方阵" });
            sourceArr5.push({ type: "特效" });
            this.dropListView5.setArrayCollection(sourceArr5);
            this.dropListView5.setItemTapCallback(function (index) {
                var data = index + 1;
                _this.typeTag = data;
                if (_this.typeTag == 1) {
                    _this.dropListView.setArrayCollection(sourceArr);
                    _this.dropListView2.visible = true;
                    _this.dropListView3.visible = true;
                }
                else if (_this.typeTag == 2) {
                    _this.dropListView.setArrayCollection(sourceArr4);
                    _this.dropListView2.visible = false;
                    _this.dropListView3.visible = false;
                }
                com_main.EventMgr.dispatchEvent(TestNav.TEST_CREATE_TYPE, data);
            }, this);
        };
        TestAnimUI.prototype.frame_event = function (evt) {
            // console.log( " 播放到了一个关键帧！ 帧标签为：",evt.frameLabel);
        };
        TestAnimUI.prototype.initHslider = function () {
            this.m_fliter_r.minimum = 0;
            this.m_fliter_r.maximum = 255;
            this.m_fliter_r.value = 0;
            this.m_fliter_g.minimum = 0;
            this.m_fliter_g.maximum = 255;
            this.m_fliter_g.value = 0;
            this.m_fliter_b.minimum = 0;
            this.m_fliter_b.maximum = 255;
            this.m_fliter_b.value = 0;
            this.m_fliter_r.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            this.m_fliter_g.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            this.m_fliter_b.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            // // 测试亮度
            // this.m_fliter_r.minimum = 0;
            // this.m_fliter_r.maximum = 200;
            // this.m_fliter_r.value = 100;
            // this.m_fliter_r.addEventListener(eui.UIEvent.CHANGE, this.changeLight, this);
        };
        TestAnimUI.prototype.onchangSlider = function () {
            this.m_lab_r.text = this.m_fliter_r.value + "";
            this.m_lab_g.text = this.m_fliter_g.value + "";
            this.m_lab_b.text = this.m_fliter_b.value + "";
            var data = { r: this.m_fliter_r.value, g: this.m_fliter_g.value, b: this.m_fliter_b.value };
            com_main.EventMgr.dispatchEvent(TestNav.TEST_RGB, data);
        };
        TestAnimUI.prototype.changeLight = function () {
            this.m_lab_r.text = this.m_fliter_r.value + "";
            var light = this.m_fliter_r.value;
            light = light / 100;
            var colorMatrix = [
                1 * light, 0, 0, 0, 0,
                0, 1 * light, 0, 0, 0,
                0, 0, 1 * light, 0, 0,
                0, 0, 0, 1, 0
            ];
            var fliter = new egret.ColorMatrixFilter(colorMatrix);
            this.m_test_image.filters = [fliter];
        };
        return TestAnimUI;
    }(com_main.CView));
    com_main.TestAnimUI = TestAnimUI;
})(com_main || (com_main = {}));
