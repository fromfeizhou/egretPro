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
    var TestSettingView = /** @class */ (function (_super_1) {
        __extends(TestSettingView, _super_1);
        function TestSettingView() {
            var _this = _super_1.call(this) || this;
            _this.initApp("test/TestSettingSkin.exml");
            return _this;
        }
        TestSettingView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.m_guide.removeEventListener(egret.Event.CHANGE, this.onGuildeIdChanges, this);
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        TestSettingView.settingData = function () {
            this.debug = debug;
            this.debugPb = debugPb;
            this.debugBatt = debugBatt;
            this.debugSkill = debugSkill;
            this.debugGui = debugGui;
            this.error = error;
            this.warn = warn;
            TestSettingView.setLogFun("warn", LocalData.getData('warn', "1"));
            TestSettingView.setLogFun("error", LocalData.getData('error', "1"));
            TestSettingView.setLogFun("debug", LocalData.getData('debug', "0"));
            TestSettingView.setLogFun("debugSkill", LocalData.getData('debugSkill', "0"));
            TestSettingView.setLogFun("debugBatt", LocalData.getData('debugBatt', "0"));
            TestSettingView.setLogFun("debugGui", LocalData.getData('debugGui', "0"));
            TestSettingView.setLogFun("debugPb", LocalData.getData('debugPb', "0"));
            TestSettingView.setGameQuality();
            GameConfig.bGuideIsOpen = LocalData.getData('Guide_State', "1") == "1";
            GameConfig.testGuideIds = LocalData.getData('Guide_StateId', "");
            //音效
            GameConfig.MusicIsPlay = LocalData.getData('soundBg', "1") == "1";
            GameConfig.EffectIsPlay = LocalData.getData('soundEff', "1") == "1";
        };
        TestSettingView.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            //是否打印警告
            this.m_checkBox_warn.selected = LocalData.getData('warn', "1") == "1";
            this.m_checkBox_warn.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('warn', tempState);
                TestSettingView.setLogFun("warn", tempState);
            }, this);
            //是否打印错误
            this.m_checkBox_error.selected = LocalData.getData('error', "1") == "1";
            this.m_checkBox_error.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('error', tempState);
                TestSettingView.setLogFun("error", tempState);
            }, this);
            //是否打印debug
            this.m_checkBox_debug.selected = LocalData.getData('debug', "0") == "1";
            this.m_checkBox_debug.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('debug', tempState);
                TestSettingView.setLogFun("debug", tempState);
            }, this);
            //是否打印debugSkill
            this.m_checkBox_debugSkill.selected = LocalData.getData('debugSkill', "0") == "1";
            this.m_checkBox_debugSkill.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('debugSkill', tempState);
                TestSettingView.setLogFun("debugSkill", tempState);
            }, this);
            //是否打印debugBatt
            this.m_checkBox_debugBatt.selected = LocalData.getData('debugBatt', "0") == "1";
            this.m_checkBox_debugBatt.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('debugBatt', tempState);
                TestSettingView.setLogFun("debugBatt", tempState);
            }, this);
            //是否打印debugGui
            this.m_checkBox_debugGui.selected = LocalData.getData('debugGui', "0") == "1";
            this.m_checkBox_debugGui.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('debugGui', tempState);
                TestSettingView.setLogFun("debugGui", tempState);
            }, this);
            //是否打印debugPb
            this.m_checkBox_debugPb.selected = LocalData.getData('debugPb', "0") == "1";
            this.m_checkBox_debugPb.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('debugPb', tempState);
                TestSettingView.setLogFun("debugPb", tempState);
            }, this);
            //背景音乐
            this.m_checkBox_soundBg.selected = LocalData.getData('soundBg', "1") == "1";
            GameConfig.MusicIsPlay = this.m_checkBox_soundBg.selected;
            this.m_checkBox_soundBg.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('soundBg', tempState);
                GameConfig.MusicIsPlay = _this.m_checkBox_soundBg.selected;
            }, this);
            //音效
            this.m_checkBox_soundEff.selected = LocalData.getData('soundEff', "1") == "1";
            GameConfig.EffectIsPlay = this.m_checkBox_soundEff.selected;
            this.m_checkBox_soundEff.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('soundEff', tempState);
                GameConfig.EffectIsPlay = _this.m_checkBox_soundEff.selected;
            }, this);
            this.m_checkBox.selected = LocalData.getData('Guide_State', "1") == "1";
            this.m_checkBox.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                egret.log(evt.target.selected);
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('Guide_State', tempState);
                GameConfig.bGuideIsOpen = evt.target.selected;
            }, this);
            this.m_checkBoxMapGrid.selected = LocalData.getData('open_map_grid', "0") == "1";
            this.m_checkBoxMapGrid.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('open_map_grid', tempState);
            }, this);
            this.m_checkBoxGameQuality.selected = LocalData.getData('GameQuality', "0") == "1";
            this.m_checkBoxGameQuality.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('GameQuality', tempState);
                TestSettingView.setGameQuality();
            }, this);
            this.m_checkPay.selected = LocalData.getData('pay', "0") == "1";
            this.m_checkPay.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                var tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('pay', tempState);
            }, this);
            com_main.EventManager.addTouchScaleListener(this.closeBtn, this, function () {
                com_main.UpManager.history();
            });
            com_main.EventManager.addTouchScaleListener(this.m_testWarBtn, this, function () {
                Utils.open_view(TestNav.TEST_WAR);
            });
            com_main.EventManager.addTouchScaleListener(this.m_testMap, this, function () {
                SceneManager.enterScene(SceneEnums.TEST_MAP);
            });
            com_main.EventManager.addTouchScaleListener(this.m_testOpenView, this, function () {
                var time = Number(_this.m_openTime.text);
                var count = Number(_this.m_openCount.text);
                TestSettingView.event = Number(_this.m_viewEvent.text);
                Utils.TimerManager.doTimer(time, count, TestSettingView.testOpenView, _this);
            });
            GameConfig.testGuideIds = LocalData.getData('Guide_StateId', "");
            this.m_guide.text = GameConfig.testGuideIds;
            this.m_guide.addEventListener(egret.Event.CHANGE, this.onGuildeIdChanges, this);
        };
        TestSettingView.prototype.onGuildeIdChanges = function () {
            GameConfig.testGuideIds = this.m_guide.text;
            LocalData.setData('Guide_StateId', GameConfig.testGuideIds);
        };
        TestSettingView.testOpenView = function () {
            com_main.UpManager.history();
            Utils.open_view(TestSettingView.event);
            // com_main.EventMgr.dispatchEvent(TASK_EVT.GLOBAL_TOUCH_END, null);
        };
        /** 设置空函数*/
        TestSettingView.setLogFun = function (funcName, isOpen) {
            if (isOpen == "0") {
                if (funcName == "debug") {
                    debug = function (message) {
                        var optionalParams = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            optionalParams[_i - 1] = arguments[_i];
                        }
                    };
                }
                else if (funcName == "debugPb") {
                    debugPb = function (message) {
                        var optionalParams = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            optionalParams[_i - 1] = arguments[_i];
                        }
                    };
                }
                else if (funcName == "debugBatt") {
                    debugBatt = function (message) {
                        var optionalParams = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            optionalParams[_i - 1] = arguments[_i];
                        }
                    };
                }
                else if (funcName == "debugSkill") {
                    debugSkill = function (message) {
                        var optionalParams = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            optionalParams[_i - 1] = arguments[_i];
                        }
                    };
                }
                else if (funcName == "debugGui") {
                    debugGui = function (message) {
                        var optionalParams = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            optionalParams[_i - 1] = arguments[_i];
                        }
                    };
                }
                else if (funcName == "error") {
                    error = function (message) {
                        var optionalParams = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            optionalParams[_i - 1] = arguments[_i];
                        }
                    };
                }
                else if (funcName == "warn") {
                    warn = function (message) {
                        var optionalParams = [];
                        for (var _i = 1; _i < arguments.length; _i++) {
                            optionalParams[_i - 1] = arguments[_i];
                        }
                    };
                }
            }
            else {
                if (funcName == "debug") {
                    debug = TestSettingView.debug;
                }
                else if (funcName == "debugPb") {
                    debugPb = TestSettingView.debugPb;
                }
                else if (funcName == "debugBatt") {
                    debugBatt = TestSettingView.debugBatt;
                }
                else if (funcName == "debugSkill") {
                    debugSkill = TestSettingView.debugSkill;
                }
                else if (funcName == "debugGui") {
                    debugGui = TestSettingView.debugGui;
                }
                else if (funcName == "error") {
                    error = TestSettingView.error;
                }
                else if (funcName == "warn") {
                    warn = TestSettingView.warn;
                }
            }
        };
        TestSettingView.setGameQuality = function () {
            if (LocalData.getData('GameQuality', "0") == "1") {
                GameConfig.BTEELE_QUALITY = BattleQualityEnum.LOW;
            }
            else {
                GameConfig.BTEELE_QUALITY = BattleQualityEnum.HIGHT;
            }
        };
        TestSettingView.event = 0;
        return TestSettingView;
    }(com_main.CView));
    com_main.TestSettingView = TestSettingView;
})(com_main || (com_main = {}));
