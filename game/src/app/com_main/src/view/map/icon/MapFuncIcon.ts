
module com_main {

	/**
	 * 世界地图图标(过关斩将，竞技场，物质征战)
	 */
    export class MapFuncIcon extends CComponent {

        public m_imgIcon: com_main.CImage;
        public m_labName: eui.Label;
        public m_pTitleRoot: eui.Group;

        private m_nFuncId: FunctionType;

        public constructor(id: FunctionType) {
            super();
            this.m_nFuncId = id;
            this.skinName = Utils.getAppSkin("map/MapFuncIconSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        /**
       * 销毁方法
       */
        public onDestroy() {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_imgIcon.source = this.getBuildIcon();
            this.m_labName.text = this.getBuildName();
            this.m_pTitleRoot.visible = this.getBuildName() != '';

            if (this.m_nFuncId == FunctionType.WATER_MONSTER) {
                this.m_pTitleRoot.horizontalCenter = 15;
            } else {
                this.m_pTitleRoot.horizontalCenter = 0;
            }

            this.addRedPointEvt();
            this.initEvent();
        }

        /**检测是否点中图标 */
        public check_is_touch(x: number, y: number): boolean {
            let res = this.m_imgIcon.hitTestPoint(x, y);
            if (res) this.doFuncAction();
            return res;
        }

        /**根据功能号获得图标 */
        private getBuildIcon() {
            switch (this.m_nFuncId) {
                case FunctionType.ARENA:
                    return 'map_main_build40_png';
                case FunctionType.APK:
                    return 'map_main_build41_png';
                case FunctionType.MATERIAL:
                    return 'map_main_build42_png';
                case FunctionType.WATER_MONSTER:
                    return 'map_main_build51_png';
                case FunctionType.HITWALLSOLDIER:
                    return 'map_main_build52_png';
                case FunctionType.BALLISTA:
                    return 'map_main_build53_png';
                case FunctionType.TENT:
                    return 'map_main_build54_png';
                case FunctionType.BOOT:
                    return 'map_main_build157_png';
                case FunctionType.HISTORY_WAR:
                    return 'map_main_build43_png'
            }
            return 'map_main_build40_png';
        }

        /**根据功能号获得名字 */
        private getBuildName() {
            switch (this.m_nFuncId) {
                case FunctionType.ARENA:
                    return GCode(CLEnum.CHALL);
                case FunctionType.APK:
                    return GCode(CLEnum.ARENA);
                case FunctionType.MATERIAL:
                    return GCode(CLEnum.MAT);
                case FunctionType.WATER_MONSTER:
                    return platform.isHidePayFunc() ? '' : GCode(CLEnum.CITY_SG);
                case FunctionType.HITWALLSOLDIER:
                    return platform.isHidePayFunc() ? '' : GCode(CLEnum.CITY_TSC);
                case FunctionType.BALLISTA:
                    return platform.isHidePayFunc() ? '' : GCode(CLEnum.CITY_NC);
                case FunctionType.TENT:
                    return platform.isHidePayFunc() ? '' : GCode(CLEnum.CITY_ZP);
                case FunctionType.BOOT:
                    return platform.isHidePayFunc() ? '' : GCode(CLEnum.CITY_HF);
                case FunctionType.HISTORY_WAR:
                    return '历史战役';

            }
            return GCode(CLEnum.CHALL);
        }

        public addLabelToObj(obj: egret.DisplayObjectContainer) {
            this.m_pTitleRoot.width = this.m_labName.width;
            this.validateNow();
            let pos = this.m_labName.parent.localToGlobal(this.m_labName.x, this.m_labName.y);
            let m_labelPos = obj.globalToLocal(pos.x, pos.y);
            obj.addChild(this.m_labName);
            this.m_labName.x = m_labelPos.x;
            this.m_labName.y = m_labelPos.y;
        }

        /**功能跳转 */
        private doFuncAction() {
            if (!FunctionModel.isFunctionOpenWithWarn(this.m_nFuncId)) return;
            switch (this.m_nFuncId) {
                case FunctionType.ARENA: {
                    Utils.open_view(TASK_UI.POP_ARENA_PANEL);
                    break;
                }
                case FunctionType.APK: {
                    Utils.open_view(TASK_UI.POP_PVPARENA_PANEL);
                    break;
                }
                case FunctionType.MATERIAL: {
                    MaterialProxy.C2S_MATERIAL_INFO_OPEN();
                    break;
                }
                case FunctionType.HISTORY_WAR: {
                    Utils.open_view(TASK_UI.HISTORYWAR_MAIN_PANEL);
                    break;
                }
            }
        }

        /**添加红点事件 */
        private addRedPointEvt() {
            if (!FunctionModel.isFunctionOpen(this.m_nFuncId)) return;
            switch (this.m_nFuncId) {
                case FunctionType.ARENA: {
                    RedPointModel.AddInfoListener(this.m_pTitleRoot, { x: this.m_pTitleRoot.width + 5, y: 3 }, [RedEvtType.PASS_WAR], 3);
                    break;
                }
                case FunctionType.APK: {
                    RedPointModel.AddInfoListener(this.m_pTitleRoot, { x: this.m_pTitleRoot.width + 5, y: 3 }, [RedEvtType.PVP_ARENA], 3);
                    break;
                }
                case FunctionType.MATERIAL: {
                    let cfg = C.MaterialTypeConfig;
                    let arr = [];
                    let type: number;
                    for (let key in cfg) {
                        arr.push(cfg[key]);
                    }
                    for (let i = 0; i < arr.length; i++) {
                        RedPointModel.AddInfoListener(this.m_pTitleRoot, { x: this.m_pTitleRoot.width + 5, y: 3 }, [RedEvtType.MATER_WAR], 3, { materialEnum: arr[i].id });
                    }
                    break;
                }
                case FunctionType.HISTORY_WAR: {
                    RedPointModel.AddInfoListener(this.m_pTitleRoot, { x: this.m_pTitleRoot.width + 5, y: 5 }, [RedEvtType.HISTORY_WAR], 3);
                    break;
                }
            }
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private initEvent() {
            EventMgr.addEvent(FunctionEvent.NEW_FUNC_OPEN, this.onNewFunc, this);
        }
        private removeEvent() {
            EventMgr.removeEventByObject(FunctionEvent.NEW_FUNC_OPEN, this);
        }

        /**新功能开启 */
        public onNewFunc(data: { funcId: number, show: boolean }) {
            if (this.m_nFuncId == data.funcId) {
                this.addRedPointEvt();
            }
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }
}