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
     * 科技主面板相关
     */
    var TechnoWnd = /** @class */ (function (_super_1) {
        __extends(TechnoWnd, _super_1);
        function TechnoWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.m_tViews = [];
            _this.m_curIndex = 0;
            _this.m_nType = {};
            _this.m_tabInfo = [
                { name: GCode(CLEnum.ARMY_BB), endTime: "" },
                { name: GCode(CLEnum.ARMY_GB), endTime: "" },
                { name: GCode(CLEnum.ARMY_QIB), endTime: "" },
                { name: GCode(CLEnum.ARMY_QB), endTime: "" },
                { name: GCode(CLEnum.TEC_FZ), endTime: "" },
            ];
            _this.name = TechnoWnd.NAME;
            _this.m_curIndex = param || 0;
            _this.initApp("technology/TechnoWndSkin.exml");
            return _this;
        }
        TechnoWnd.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        TechnoWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
        };
        TechnoWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventMgr.removeEventByObject(TechnologyEvent.TECHNOLOGY_TIME_UP, this);
            this.delTimeHandler();
            com_main.EventManager.removeEventListeners(this);
            this.m_tViews = null;
            SceneResGroupCfg.clearModelRes([ModuleEnums.TECHNOLOGY]);
        };
        TechnoWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.TEC));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            for (var i = 0; i < this.m_tabInfo.length; i++) {
                this.m_comTabGroup.addTabBtnData(this.m_tabInfo[i]);
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            var list = [TechnoType.SOLDIER_BB, TechnoType.SOLDIER_GB, TechnoType.SOLDIER_QIB, TechnoType.SOLDIER_QB, TechnoType.PRODUCE];
            for (var i = 0; i < list.length; i++) {
                var view = new com_main.TechnoTabView(list[i], width, height);
                this.m_tabViewStack.addChild(view);
                this.m_tViews.push(view);
                this.m_nType[list[i]] = i;
                //红点处理
                RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(this.m_tabInfo[i].name), { x: 132, y: -5 }, [RedEvtType.TECHNO], 2, { teachType: list[i] });
            }
            // this.validateNow();
            this.initView(this.m_curIndex);
            com_main.EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_TIME_UP, this.onTechnoTimeUp, this);
        };
        TechnoWnd.prototype.changeTag = function (selIndex) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        };
        TechnoWnd.prototype.initView = function (tag) {
            this.m_comTabGroup.selectedIndex = tag;
            this.m_tabViewStack.selectedIndex = tag;
            this.m_tViews[tag].onShow();
            if (TechnoModel.isInLevelCd()) {
                this.addTimeHandler();
            }
            else {
                this.delTimeHandler();
            }
        };
        /**刷新倒计时 */
        TechnoWnd.prototype.refreshTime = function (index, str) {
            var info = this.m_tabInfo[index];
            var newInfo = { name: '', endTime: '' };
            newInfo.name = info.name;
            // newInfo.source = info.source;
            newInfo.endTime = str;
            this.m_comTabGroup.resetTabBtnData(newInfo, index);
        };
        /**添加倒计时 */
        TechnoWnd.prototype.addTimeHandler = function () {
            Utils.TimerManager.remove(this.timeCall, this);
            this.m_tTimeData = TechnoModel.getTimeData();
            var id = this.m_tTimeData.id;
            var cfg = C.TechnologyConfig[id];
            this.m_nTimeIndex = this.m_nType[cfg.type];
            Utils.TimerManager.doTimer(1000, 0, this.timeCall, this);
            this.timeCall();
        };
        /**移除倒计时 */
        TechnoWnd.prototype.delTimeHandler = function () {
            if (this.m_nTimeIndex >= 0)
                this.refreshTime(this.m_nTimeIndex, '');
            Utils.TimerManager.remove(this.timeCall, this);
            this.m_tTimeData = null;
        };
        /**倒计时回调 */
        TechnoWnd.prototype.timeCall = function () {
            var time = this.m_tTimeData.end - this.m_tTimeData.speed - TimerUtils.getServerTime();
            if (time < 0) {
                this.delTimeHandler();
                return;
            }
            var timeStr = Utils.DateUtils.getFormatBySecond(time, 1);
            this.refreshTime(this.m_nTimeIndex, timeStr);
        };
        /**升级 */
        TechnoWnd.prototype.onTechnoTimeUp = function () {
            if (TechnoModel.isInLevelCd()) {
                this.addTimeHandler();
            }
            else {
                this.delTimeHandler();
            }
        };
        TechnoWnd.NAME = 'TechnoWnd';
        return TechnoWnd;
    }(com_main.CView));
    com_main.TechnoWnd = TechnoWnd;
})(com_main || (com_main = {}));
