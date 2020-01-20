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
     * 新7天活动
     */
    var SevenIIWnd = /** @class */ (function (_super_1) {
        __extends(SevenIIWnd, _super_1);
        function SevenIIWnd() {
            var _this = _super_1.call(this) || this;
            _this.name = SevenIIWnd.NAME;
            _this.initApp("activity/sevenII/SevenIIWndSkin.exml");
            return _this;
        }
        SevenIIWnd.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = false; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        SevenIIWnd.prototype.onDestroy = function () {
            this.panel0.onDestroy();
            this.panel1.onDestroy();
            this.panel2.onDestroy();
            this.panel3.onDestroy();
            this.panel4.onDestroy();
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            this.m_tabLogic.onDestory();
            SceneResGroupCfg.clearModelRes([ModuleEnums.SEVENII_UI]);
        };
        SevenIIWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_imgBg.source = 'zyt_7t_dbj_png';
            this.m_vo = ActivityModel.getActivityVo(AcViewType.SIGN_CONTIN_DAY_2);
            this.panel0 = new com_main.SevenIILoginPanel(AcViewType.SIGN_CONTIN_DAY_2);
            this.panel1 = new com_main.SevenIIChargePanel();
            this.panel2 = new com_main.SevenIIChargePanel();
            this.panel3 = new com_main.SevenIIShopPanel(AcViewType.AC_SHOP);
            this.panel4 = new com_main.SevenIICornucopiaPanel(AcViewType.TREASEURE_BOWL);
            for (var i = 0; i <= 4; i++) {
                this.m_panelGroup.addChild(this['panel' + i]);
                this['panel' + i].x = 136;
                this['panel' + i].y = 108;
            }
            this.m_btn0.setTitleLabel('登录有礼');
            this.m_btn1.setTitleLabel('单充返利');
            this.m_btn2.setTitleLabel('累充好礼');
            this.m_btn3.setTitleLabel('特惠商城');
            this.m_btn4.setTitleLabel('开服抽奖');
            this.panel1.setType(AcViewType.RECHARGE_SINGLE_2);
            this.panel2.setType(AcViewType.RECHARGE_ADD_UP_3);
            this.m_tabLogic = new com_main.ComTabLogic();
            this.m_tabLogic.init([this.m_btn0, this.m_btn1, this.m_btn2, this.m_btn3, this.m_btn4], [this.panel0, this.panel1, this.panel2, this.panel3, this.panel4]);
            RedPointModel.AddInfoListener(this.m_btn0, { x: 70, y: -15 }, [RedEvtType.LOGIN_DAY_2], 2);
            RedPointModel.AddInfoListener(this.m_btn1, { x: 70, y: -15 }, [RedEvtType.RECHARD_SINGLE_2], 2);
            RedPointModel.AddInfoListener(this.m_btn2, { x: 70, y: -15 }, [RedEvtType.RECHARD_ADD_3], 2);
            RedPointModel.AddInfoListener(this.m_btn4, { x: 70, y: -15 }, [RedEvtType.TREASEURE_BOWL], 2);
            this.updateDownTime();
            Utils.TimerManager.doTimer(60000, 0, this.updateDownTime, this);
            this.initEvent();
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        SevenIIWnd.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnClose, this, this.onCloseClick);
        };
        SevenIIWnd.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.updateDownTime, this);
        };
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
        SevenIIWnd.prototype.onCloseClick = function (e) {
            com_main.UpManager.history();
        };
        SevenIIWnd.prototype.updateDownTime = function () {
            var activiVo = this.m_vo;
            if (!activiVo)
                return;
            var curtime = TimerUtils.getServerTimeMill();
            if (curtime > activiVo.closeDate)
                return;
            var str = Utils.DateUtils.getActiveDownStr(activiVo.closeDate - curtime);
            var timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_labTimeStr.textFlow = Utils.htmlParser(timeStr + " " + str);
        };
        SevenIIWnd.NAME = "SevenIIWnd";
        return SevenIIWnd;
    }(com_main.CView));
    com_main.SevenIIWnd = SevenIIWnd;
})(com_main || (com_main = {}));
