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
     * 一元礼包
     */
    var OneGiftBagView = /** @class */ (function (_super_1) {
        __extends(OneGiftBagView, _super_1);
        function OneGiftBagView() {
            var _this = _super_1.call(this) || this;
            _this.name = OneGiftBagView.NAME;
            _this.initApp("activity/one/OneGiftBagViewSkin.exml");
            return _this;
        }
        OneGiftBagView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = false; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        OneGiftBagView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        OneGiftBagView.prototype.hidePanel = function () {
            if (this.activiVo.checkOneEnd()) {
                com_main.UpManager.history();
            }
        };
        OneGiftBagView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.updateView();
            this.setEff();
            this.initEvent();
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        OneGiftBagView.prototype.initEvent = function () {
            this.m_closeBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onCloseClick, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnGoto, this, this.onGotoClick);
            com_main.EventManager.addTouchScaleListener(this.m_btnAward, this, this.onGotoClick);
            com_main.EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.hidePanel, this);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_ONE_GIFT_BAG, this.updateState, this);
            // EventMgr.addEvent(ActivityEvent.ACTIVITY_YU_BUY_SUCC, this.refreshGoYuView, this);
        };
        OneGiftBagView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this);
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_ONE_GIFT_BAG, this);
            // EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_YU_BUY_SUCC, this);
        };
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
        OneGiftBagView.prototype.updateView = function () {
            this.activiVo = ActivityModel.getActivityVo(AcViewType.ONE_GIFT_BAG);
            if (!this.activiVo)
                return;
            this.updateState();
        };
        /**勾玉购买刷新 */
        // private refreshGoYuView(shopType: number) {
        // for (let i = 0; i < this.m_pViews.length; i++) {
        //     let view = this.m_pViews[i];
        //     if (view.activityType == shopType) {
        //         view.refreshView();
        //     }
        // }
        // this.updateView();
        // }
        OneGiftBagView.prototype.updateState = function () {
            var id = this.activiVo.awardRecordSet.length;
            if (id >= this.activiVo.rechargeCfgs.length)
                return;
            var cfg = this.activiVo.rechargeCfgs[id];
            this.m_num = cfg.price;
            this.m_btnGoto.cost = cfg.price;
            this.m_btnAward.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            this.m_btnGoto.visible = !this.activiVo.getBtnState();
            this.m_btnAward.visible = this.activiVo.getBtnState();
            //
            // this.m_btnGoto.setTitleLabel(str);
            this.m_curShopId = cfg.shopId;
            this.m_groupAward.removeChildren();
            var arwardList = Utils.parseCommonItemServ(this.activiVo.rechargeCfgs[id].reward);
            for (var i = 0; i < arwardList.length; i++) {
                var itemView = com_main.ComItemNew.create("name_num");
                itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                this.m_groupAward.addChild(itemView);
            }
        };
        /**按钮特效 */
        OneGiftBagView.prototype.setEff = function () {
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
            this.m_effect.play(IETypes.EUI_BtnEffect02);
            this.m_effect.x = 135;
            this.m_effect.y = 47.5;
            this.m_btnGoto.addChild(this.m_effect);
        };
        OneGiftBagView.prototype.onCloseClick = function (e) {
            com_main.UpManager.history();
        };
        OneGiftBagView.prototype.onGotoClick = function (e) {
            if (!this.activiVo.getBtnState()) {
                var id = this.activiVo.awardRecordSet.length;
                if (id >= this.activiVo.rechargeCfgs.length)
                    return;
                var cfg = this.activiVo.rechargeCfgs[id];
                PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
            }
            else {
                ActivityProxy.C2S_ACTIVITY_GET_ONE_RMB_BUY_REWARD(this.activiVo.id, this.m_curShopId);
            }
            // UpManager.history();
        };
        OneGiftBagView.NAME = "OneGiftBagView";
        return OneGiftBagView;
    }(com_main.CView));
    com_main.OneGiftBagView = OneGiftBagView;
})(com_main || (com_main = {}));
