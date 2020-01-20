
module com_main {
    export class TestSettingView extends CView {

        public m_setting_panel:eui.Group;
        public m_checkBox_warn:eui.CheckBox;
        public m_checkBox_error:eui.CheckBox;
        public m_checkBox_debug:eui.CheckBox;
        public m_checkBox_debugSkill:eui.CheckBox;
        public m_checkBox_debugBatt:eui.CheckBox;
        public m_checkBox_debugGui:eui.CheckBox;
        public m_checkBox_debugPb:eui.CheckBox;
        public m_checkBox_soundBg:eui.CheckBox;
        public m_checkBox_soundEff:eui.CheckBox;
        public m_checkBoxMapGrid:eui.CheckBox;
        public m_checkBoxGameQuality:eui.CheckBox;
        public m_checkPay:eui.CheckBox;
        public closeBtn:eui.Button;
        public m_testWarBtn:eui.Button;
        public m_testMap:eui.Button;
        public m_checkBox:eui.CheckBox;
        public m_guide:eui.EditableText;
        public m_testOpenView:eui.Button;
        public m_viewEvent:eui.EditableText;
        public m_openCount:eui.EditableText;
        public m_openTime:eui.EditableText;

        public static debug;
        public static debugPb;
        public static debugBatt;
        public static debugSkill;
        public static debugGui;
        public static error;
        public static warn;

        public constructor() {
            super();
            this.initApp("test/TestSettingSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.m_guide.removeEventListener(egret.Event.CHANGE, this.onGuildeIdChanges, this);
            super.$onRemoveFromStage(isclear);
        }

        public static settingData() {
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
        }


        protected childrenCreated(): void {
            super.childrenCreated();


            //是否打印警告
            this.m_checkBox_warn.selected = LocalData.getData('warn', "1") == "1";
            this.m_checkBox_warn.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('warn', tempState);
                TestSettingView.setLogFun("warn", tempState);
            }, this);

            //是否打印错误
            this.m_checkBox_error.selected = LocalData.getData('error', "1") == "1";
            this.m_checkBox_error.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('error', tempState);
                TestSettingView.setLogFun("error", tempState);
            }, this);

            //是否打印debug
            this.m_checkBox_debug.selected = LocalData.getData('debug', "0") == "1";
            this.m_checkBox_debug.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('debug', tempState);
                TestSettingView.setLogFun("debug", tempState);
            }, this);

            //是否打印debugSkill
            this.m_checkBox_debugSkill.selected = LocalData.getData('debugSkill', "0") == "1";
            this.m_checkBox_debugSkill.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('debugSkill', tempState);
                TestSettingView.setLogFun("debugSkill", tempState);
            }, this);

            //是否打印debugBatt
            this.m_checkBox_debugBatt.selected = LocalData.getData('debugBatt', "0") == "1";
            this.m_checkBox_debugBatt.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('debugBatt', tempState);
                TestSettingView.setLogFun("debugBatt", tempState);
            }, this);

            //是否打印debugGui
            this.m_checkBox_debugGui.selected = LocalData.getData('debugGui', "0") == "1";
            this.m_checkBox_debugGui.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('debugGui', tempState);
                TestSettingView.setLogFun("debugGui", tempState);
            }, this);

            //是否打印debugPb
            this.m_checkBox_debugPb.selected = LocalData.getData('debugPb', "0") == "1";
            this.m_checkBox_debugPb.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('debugPb', tempState);
                TestSettingView.setLogFun("debugPb", tempState);
            }, this);

            //背景音乐
            this.m_checkBox_soundBg.selected = LocalData.getData('soundBg', "1") == "1";
            GameConfig.MusicIsPlay = this.m_checkBox_soundBg.selected;
            this.m_checkBox_soundBg.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('soundBg', tempState);
                GameConfig.MusicIsPlay = this.m_checkBox_soundBg.selected;
            }, this);

            //音效
            this.m_checkBox_soundEff.selected = LocalData.getData('soundEff', "1") == "1";
            GameConfig.EffectIsPlay = this.m_checkBox_soundEff.selected;
            this.m_checkBox_soundEff.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('soundEff', tempState);
                GameConfig.EffectIsPlay = this.m_checkBox_soundEff.selected;
            }, this);

            this.m_checkBox.selected = LocalData.getData('Guide_State', "1") == "1";

            this.m_checkBox.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                egret.log(evt.target.selected);
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('Guide_State', tempState);
                GameConfig.bGuideIsOpen = evt.target.selected;
            }, this);

            this.m_checkBoxMapGrid.selected = LocalData.getData('open_map_grid', "0") == "1";
            this.m_checkBoxMapGrid.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('open_map_grid', tempState);
            }, this);


            this.m_checkBoxGameQuality.selected = LocalData.getData('GameQuality', "0") == "1";
            this.m_checkBoxGameQuality.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('GameQuality', tempState);
                TestSettingView.setGameQuality();
            }, this);

            this.m_checkPay.selected = LocalData.getData('pay', "0") == "1";
            this.m_checkPay.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                let tempState = evt.target.selected ? "1" : "0";
                LocalData.setData('pay', tempState);
            }, this);


            com_main.EventManager.addTouchScaleListener(this.closeBtn, this, () => {
                com_main.UpManager.history();
            });

            com_main.EventManager.addTouchScaleListener(this.m_testWarBtn, this, () => {
                Utils.open_view(TestNav.TEST_WAR);
            });

            com_main.EventManager.addTouchScaleListener(this.m_testMap, this, () => {
                SceneManager.enterScene(SceneEnums.TEST_MAP);
            });
            

            com_main.EventManager.addTouchScaleListener(this.m_testOpenView, this, () => {

                let time = Number(this.m_openTime.text);
                let count = Number(this.m_openCount.text);
                TestSettingView.event = Number(this.m_viewEvent.text);
                Utils.TimerManager.doTimer(time, count, TestSettingView.testOpenView, this);


            });

            GameConfig.testGuideIds = LocalData.getData('Guide_StateId', "");
            this.m_guide.text = GameConfig.testGuideIds;
            this.m_guide.addEventListener(egret.Event.CHANGE, this.onGuildeIdChanges, this);
        }

        private onGuildeIdChanges() {
            GameConfig.testGuideIds = this.m_guide.text;
            LocalData.setData('Guide_StateId', GameConfig.testGuideIds);
        }

        public static event = 0;
        public static testOpenView() {
            UpManager.history();
            Utils.open_view(TestSettingView.event);

            // com_main.EventMgr.dispatchEvent(TASK_EVT.GLOBAL_TOUCH_END, null);
        }

        /** 设置空函数*/
        public static setLogFun(funcName: string, isOpen: string) {
            if (isOpen == "0") {
                if (funcName == "debug") {
                    debug = (message?: any, ...optionalParams: any[]) => { };
                } else if (funcName == "debugPb") {
                    debugPb = (message?: any, ...optionalParams: any[]) => { };
                } else if (funcName == "debugBatt") {
                    debugBatt = (message?: any, ...optionalParams: any[]) => { };
                } else if (funcName == "debugSkill") {
                    debugSkill = (message?: any, ...optionalParams: any[]) => { };
                } else if (funcName == "debugGui") {
                    debugGui = (message?: any, ...optionalParams: any[]) => { };
                } else if (funcName == "error") {
                    error = (message?: any, ...optionalParams: any[]) => { };
                } else if (funcName == "warn") {
                    warn = (message?: any, ...optionalParams: any[]) => { };
                }
            } else {
                if (funcName == "debug") {
                    debug = TestSettingView.debug;
                } else if (funcName == "debugPb") {
                    debugPb = TestSettingView.debugPb;
                } else if (funcName == "debugBatt") {
                    debugBatt = TestSettingView.debugBatt;
                } else if (funcName == "debugSkill") {
                    debugSkill = TestSettingView.debugSkill;
                } else if (funcName == "debugGui") {
                    debugGui = TestSettingView.debugGui;
                } else if (funcName == "error") {
                    error = TestSettingView.error;
                } else if (funcName == "warn") {
                    warn = TestSettingView.warn;
                }
            }
        }

        public static setGameQuality() {
            if (LocalData.getData('GameQuality', "0") == "1") {
                GameConfig.BTEELE_QUALITY = BattleQualityEnum.LOW;
            } else {
                GameConfig.BTEELE_QUALITY = BattleQualityEnum.HIGHT;
            }
        }

    }
}