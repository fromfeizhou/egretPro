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
     * 新武将拜访
     */
    var NewGeneralView = /** @class */ (function (_super_1) {
        __extends(NewGeneralView, _super_1);
        function NewGeneralView() {
            var _this = _super_1.call(this) || this;
            _this.m_isLoadVied = false;
            _this.name = NewGeneralView.NAME;
            _this.initApp("activity/newGeneral/NewGeneralSkin.exml");
            return _this;
        }
        NewGeneralView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = false; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        NewGeneralView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            this.panel0.onDestroy();
            this.panel1.onDestroy();
            this.panel2.onDestroy();
            this.m_tabLogic.onDestory();
            Utils.TimerManager.remove(this.updateDownTime, this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.NEW_GEN_UI]);
            // if(this.video){
            //     this.video.
            // }
        };
        NewGeneralView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_vo = ActivityModel.getActivityVo(AcViewType.NEW_GEN_VIS);
            this.m_btn0.setTitleLabel(GCode(CLEnum.NEW_GEN_BF));
            this.m_btn1.setTitleLabel(GCode(CLEnum.NEW_GEN_XG));
            this.m_btn2.setTitleLabel(GCode(CLEnum.NEW_GEN_XQ));
            this.panel0 = new com_main.NewGenVisPanel();
            this.panel1 = new com_main.NewGenLimitBuyPanel();
            this.panel2 = new com_main.NewGenDetailPanel();
            this.m_panelGroup.addChild(this.panel0);
            this.m_panelGroup.addChild(this.panel1);
            this.m_panelGroup.addChild(this.panel2);
            this.m_tabLogic = new com_main.ComTabLogic();
            this.m_tabLogic.init([this.m_btn0, this.m_btn1, this.m_btn2], [this.panel0, this.panel1, this.panel2]);
            this.m_genImg.setInfo(this.m_vo.getNewGenRewordCfg().generalId, true, true);
            this.m_titleImg.source = this.m_vo.getNewGenRewordCfg().titleStr + '_png';
            this.initEvent();
            this.updateDownTime();
            Utils.TimerManager.doTimer(60000, 0, this.updateDownTime, this);
            this.m_vo.setClick();
            if (isNull(this.m_vo.getNewGenRewordCfg().videoUrl) || this.m_vo.getNewGenRewordCfg().videoUrl == '') {
                this.m_video.visible = false;
                this.m_playBtn.visible = false;
            }
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        NewGeneralView.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnClose, this, this.onCloseClick);
            com_main.EventManager.addTouchScaleListener(this.m_playBtn, this, this.onClickPlay);
            RedPointModel.AddInfoListener(this.m_btn0, { x: this.m_btn0.width - 10, y: 3 }, [RedEvtType.NEW_GEN_VIS], 3);
            RedPointModel.AddInfoListener(this.m_btn1, { x: this.m_btn1.width - 10, y: 3 }, [RedEvtType.NEW_GEN_LIMIT_BUY], 3);
        };
        NewGeneralView.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
        NewGeneralView.prototype.updateDownTime = function () {
            var activiVo = this.m_vo;
            var curtime = TimerUtils.getServerTimeMill();
            if (curtime > activiVo.closeDate)
                return;
            var str = Utils.DateUtils.getActiveDownStr(activiVo.closeDate - curtime);
            var timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_lbDowntime.textFlow = Utils.htmlParser(timeStr + " " + str);
        };
        NewGeneralView.prototype.onCloseClick = function (e) {
            com_main.UpManager.history();
        };
        NewGeneralView.prototype.onClickPlay = function () {
            if (this.m_isLoadVied)
                return;
            this.m_isLoadVied = true;
            this.video = new egret.Video();
            var url = this.m_vo.getNewGenRewordCfg().videoUrl;
            this.video.load(LoginConst.getResUrl(url, 'video'));
            this.video.width = 300; //设置视频宽
            this.video.height = 200; //设置视频高
            this.video.x = 151;
            this.video.y = 472;
            this.video.fullscreen = false;
            //监听视频加载完成
            this.video.once(egret.Event.COMPLETE, this.onLoad, this);
            //监听视频加载失败
            this.video.once(egret.IOErrorEvent.IO_ERROR, this.onLoadErr, this);
            this.addChild(this.video);
        };
        NewGeneralView.prototype.onLoad = function (e) {
            if (this.video) {
                this.video.play(0, true);
                this.m_isLoadVied = false;
            }
        };
        NewGeneralView.prototype.onLoadErr = function (e) {
            console.log("video load error happened");
        };
        NewGeneralView.NAME = "NewGeneralView";
        return NewGeneralView;
    }(com_main.CView));
    com_main.NewGeneralView = NewGeneralView;
})(com_main || (com_main = {}));
