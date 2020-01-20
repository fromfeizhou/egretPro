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
    var SandTableWnd = /** @class */ (function (_super_1) {
        __extends(SandTableWnd, _super_1);
        // public m_btnWelfare: eui.Group;
        function SandTableWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = SandTableWnd.NAME;
            _this.initApp("cross/sandTable/SandTableWndSkin.exml");
            return _this;
        }
        // protected listenerProtoNotifications(): any[] {
        //     return [
        //         ProtoDef.S2C_CROSS_SERVER_GET_DAY_REWARD
        //     ];
        // }
        // protected executes(notification: AGame.INotification) {
        //     let body = notification.getBody();
        //     let protocol: number = Number(notification.getName());
        //     switch (protocol) {
        //         case ProtoDef.S2C_CROSS_SERVER_GET_DAY_REWARD: {
        //             this.updateWelfare();
        //             break;
        //         }
        //     }
        // }
        SandTableWnd.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.SAND_TABLE_VIEW]);
        };
        SandTableWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
            this.initView();
        };
        /**添加监听事件 */
        SandTableWnd.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_imgRule, this, this.onclickRule);
            com_main.EventManager.addTouchScaleListener(this.m_imgRecord, this, this.onclickRecord);
        };
        /**移除监听事件 */
        SandTableWnd.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        SandTableWnd.prototype.onclickRule = function () {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.CROSS_SAND_TABLE_RULE), title: GCode(CLEnum.CROSS_SAND_TABLE) });
        };
        SandTableWnd.prototype.onclickRecord = function () {
            debug("点击交战记录 onclickRecord");
        };
        /**初始化界面 */
        SandTableWnd.prototype.initView = function () {
            this.m_MainTopNew.setTitleName(GCode(CLEnum.CROSS_SAND_TABLE));
            // 城市列表
            var cityList = CrossModel.getCrossCityList();
            for (var i = 0; i < cityList.length; i++) {
                var iData = cityList[i];
                if (isNull(iData))
                    continue;
                var cCity = C.CrossServerCityConfig[iData.id];
                var isWar = CrossModel.crossStatus == 3 /* MATCH_SUC */ ||
                    CrossModel.crossStatus == 4 /* WALL_WAR */ ||
                    CrossModel.crossStatus == 5 /* CITY_WAR */;
                iData.atWar = isWar && iData.id == CrossModel.warCityId;
                var item = this.m_pCell.getElementAt(i);
                if (item) {
                    item.currentState = "city_" + cCity.cityType;
                    item.initData(iData);
                }
            }
            this.m_pCell.validateNow();
        };
        SandTableWnd.NAME = 'SandTableWnd';
        return SandTableWnd;
    }(com_main.CView));
    com_main.SandTableWnd = SandTableWnd;
})(com_main || (com_main = {}));
