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
    /**
     * 世界地图图标(过关斩将，竞技场，物质征战)
     */
    var MapFuncIcon = /** @class */ (function (_super_1) {
        __extends(MapFuncIcon, _super_1);
        function MapFuncIcon(id) {
            var _this = _super_1.call(this) || this;
            _this.m_nFuncId = id;
            _this.skinName = Utils.getAppSkin("map/MapFuncIconSkin.exml");
            return _this;
        }
        MapFuncIcon.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        /**
       * 销毁方法
       */
        MapFuncIcon.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        MapFuncIcon.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_imgIcon.source = this.getBuildIcon();
            this.m_labName.text = this.getBuildName();
            this.m_pTitleRoot.visible = this.getBuildName() != '';
            if (this.m_nFuncId == FunctionType.WATER_MONSTER) {
                this.m_pTitleRoot.horizontalCenter = 15;
            }
            else {
                this.m_pTitleRoot.horizontalCenter = 0;
            }
            this.addRedPointEvt();
            this.initEvent();
        };
        /**检测是否点中图标 */
        MapFuncIcon.prototype.check_is_touch = function (x, y) {
            var res = this.m_imgIcon.hitTestPoint(x, y);
            if (res)
                this.doFuncAction();
            return res;
        };
        /**根据功能号获得图标 */
        MapFuncIcon.prototype.getBuildIcon = function () {
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
                    return 'map_main_build43_png';
            }
            return 'map_main_build40_png';
        };
        /**根据功能号获得名字 */
        MapFuncIcon.prototype.getBuildName = function () {
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
        };
        MapFuncIcon.prototype.addLabelToObj = function (obj) {
            this.m_pTitleRoot.width = this.m_labName.width;
            this.validateNow();
            var pos = this.m_labName.parent.localToGlobal(this.m_labName.x, this.m_labName.y);
            var m_labelPos = obj.globalToLocal(pos.x, pos.y);
            obj.addChild(this.m_labName);
            this.m_labName.x = m_labelPos.x;
            this.m_labName.y = m_labelPos.y;
        };
        /**功能跳转 */
        MapFuncIcon.prototype.doFuncAction = function () {
            if (!FunctionModel.isFunctionOpenWithWarn(this.m_nFuncId))
                return;
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
        };
        /**添加红点事件 */
        MapFuncIcon.prototype.addRedPointEvt = function () {
            if (!FunctionModel.isFunctionOpen(this.m_nFuncId))
                return;
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
                    var cfg = C.MaterialTypeConfig;
                    var arr = [];
                    var type = void 0;
                    for (var key in cfg) {
                        arr.push(cfg[key]);
                    }
                    for (var i = 0; i < arr.length; i++) {
                        RedPointModel.AddInfoListener(this.m_pTitleRoot, { x: this.m_pTitleRoot.width + 5, y: 3 }, [RedEvtType.MATER_WAR], 3, { materialEnum: arr[i].id });
                    }
                    break;
                }
                case FunctionType.HISTORY_WAR: {
                    RedPointModel.AddInfoListener(this.m_pTitleRoot, { x: this.m_pTitleRoot.width + 5, y: 5 }, [RedEvtType.HISTORY_WAR], 3);
                    break;
                }
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        MapFuncIcon.prototype.initEvent = function () {
            com_main.EventMgr.addEvent(FunctionEvent.NEW_FUNC_OPEN, this.onNewFunc, this);
        };
        MapFuncIcon.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(FunctionEvent.NEW_FUNC_OPEN, this);
        };
        /**新功能开启 */
        MapFuncIcon.prototype.onNewFunc = function (data) {
            if (this.m_nFuncId == data.funcId) {
                this.addRedPointEvt();
            }
        };
        return MapFuncIcon;
    }(com_main.CComponent));
    com_main.MapFuncIcon = MapFuncIcon;
})(com_main || (com_main = {}));
