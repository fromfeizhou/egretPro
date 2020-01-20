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
    var ArenaView = /** @class */ (function (_super_1) {
        __extends(ArenaView, _super_1);
        function ArenaView() {
            var _this = _super_1.call(this) || this;
            _this.name = ArenaView.NAME;
            _this.initApp("arena/arena_team_setting_view.exml");
            return _this;
        }
        ArenaView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            // MainMap.moveToArenaUI();
        };
        ArenaView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.CHALL));
            this.m_BtnEmbattle.setTitleLabel(GCode(CLEnum.CAMP));
            this.m_BtnBattle.setTitleLabel(GCode(CLEnum.CHALL_FIGHT));
            this.m_BtnMoppingUp.setTitleLabel(GCode(CLEnum.CAMP_SWEEP));
            // this.m_BtnReset.setTitleLabel(GCode(CLEnum.CAMP_RESET));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.CONQUER]);
            com_main.EventManager.addTouchScaleListener(this.m_BtnBattle, this, this.onBtnBattle);
            com_main.EventManager.addTouchScaleListener(this.m_BtnEmbattle, this, this.onBtnEmbattle);
            com_main.EventManager.addTouchScaleListener(this.m_BtnMoppingUp, this, this.onBtnMoppingUp);
            // EventManager.addTouchScaleListener(this.m_BtnReset, this, this.onBtnReset);
            com_main.EventManager.addTouchScaleListener(this.m_imgShop, this, this.onImgShop);
            this.RefreshFreeResetTimes();
            this.InitScroller();
            ArenaProxy.send_ArenaId();
            ArenaProxy.send_ARENA_REWARD_LIST();
        };
        ArenaView.prototype.InitScroller = function () {
            this.m_DataArray = new eui.ArrayCollection;
            for (var key in C.ArenaConfig) {
                var cfg = C.ArenaConfig[key];
                this.m_DataArray.addItem({ cfg: cfg });
            }
            this.m_ItemList.dataProvider = this.m_DataArray;
            this.m_ItemList.itemRenderer = com_main.ArenaContentRender;
            this.validateNow();
            this.updateScrollItemPos();
        };
        /**刷新位置 */
        ArenaView.prototype.updateScrollItemPos = function () {
            var itemMax = this.m_ItemList.contentWidth - this.m_ItemList.scrollRect.width;
            var itemIndex = ArenaModel.arenaId - 1;
            //item长度 320  间隙 30
            var scrollH = itemIndex * (320 + 30);
            scrollH = scrollH - this.m_ItemList.scrollRect.width / 2 + 160;
            scrollH = scrollH > 0 ? scrollH : 0;
            scrollH = scrollH < itemMax ? scrollH : itemMax;
            this.m_ItemList.scrollH = scrollH;
        };
        /** 按钮 -跳转商城 */
        ArenaView.prototype.onImgShop = function () {
            com_main.UpManager.history();
            ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.CONQUER);
        };
        /** 按钮 - 布阵 */
        ArenaView.prototype.onBtnEmbattle = function () {
            Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.ARENA });
        };
        /** 按钮 - 闯关 */
        ArenaView.prototype.onBtnBattle = function () {
            if (TeamModel.isEmptyTeamPVE()) {
                Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.ARENA });
                return;
            }
            ArenaProxy.send_ENTER_ARENA_BATTLE(1);
        };
        // /** 按钮 - 重置 */
        // private onBtnReset() {
        // 	if (ArenaModel.arenaId == 1) {
        // 		let tip: string = GCode(CLEnum.CHALL_RESET_FAL);
        // 		PromtTipsView.getInstance().showTip(tip, PromtTipsView.getInstance().clearPrompt, this);
        // 		return;
        // 	}
        // 	if (ArenaModel.freeResetTimes > 0) {
        // 		ArenaProxy.send_ARENA_RESET();
        // 	}
        // 	else {
        // 		let coinNum: number = ConstUtil.getValue(IConstEnum.RESET_CONSUME);
        // 		if (RoleData.gold >= coinNum) {
        // 			let tip: string = GCodeFromat(CLEnum.CHALL_RESET_SURE, coinNum);
        // 			PromtTipsView.getInstance().showPrompt(tip, () => ArenaProxy.send_ARENA_RESET(), this, () => PromtTipsView.getInstance().clearPrompt(), true, GCode(CLEnum.CHALL_RESET));
        // 		}
        // 		else {
        // 			let tip: string = GCodeFromat(CLEnum.CHALL_RESET_FAL1, coinNum, coinNum);
        // 			PromtTipsView.getInstance().showTip(tip, null, this);
        // 		}
        // 		/** 扣金币 */
        // 	}
        // }
        /** 按钮 - 扫荡 */
        ArenaView.prototype.onBtnMoppingUp = function () {
            if (ArenaModel.canMoppingUp) {
                if (ArenaModel.getMaxId() >= 6) {
                    ArenaProxy.send_CLEAN_UP_ARENA_BATTLE();
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.CHALL_FIGHT_FAL3));
                }
            }
            else {
                var tip = GCode(CLEnum.CHALL_RESET_FAL2);
                com_main.PromtTipsView.getInstance().showTip(tip, com_main.PromtTipsView.getInstance().clearPrompt, this);
            }
        };
        ArenaView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.ENTER_ARENA_BATTLE,
                ProtoDef.ARENA_ID,
                ProtoDef.CLEAN_UP_ARENA_BATTLE,
                ProtoDef.ARENA_RESET,
                ProtoDef.ARENA_REWARD_LIST,
                ProtoDef.ARENA_GET_REWARD,
            ];
        };
        ArenaView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.ARENA_ID: {
                    this.RefreshView();
                    break;
                }
                case ProtoDef.CLEAN_UP_ARENA_BATTLE:
                case ProtoDef.ARENA_RESET: {
                    this.RefreshView();
                    break;
                }
                //奖励领取
                case ProtoDef.ARENA_REWARD_LIST:
                case ProtoDef.ARENA_GET_REWARD: {
                    this.RefreshView();
                    break;
                }
            }
        };
        ArenaView.prototype.RefreshView = function () {
            this.RefreshScroller();
            this.RefreshFreeResetTimes();
        };
        ArenaView.prototype.RefreshScroller = function () {
            for (var _i = 0, _a = this.m_ItemList.$children; _i < _a.length; _i++) {
                var item = _a[_i];
                var itemEx = item;
                itemEx.Refresh();
            }
            this.updateScrollItemPos();
        };
        ArenaView.prototype.RefreshFreeResetTimes = function () {
            this.m_BtnBattle.gray = !ArenaModel.arenaId ? true : false;
            this.m_BtnBattle.touchEnabled = !ArenaModel.arenaId ? false : true;
            // this.m_TxtFreeTimes.text = ArenaModel.freeResetTimes.toString();
            // // debug(ArenaModel.freeResetTimes + " " + ArenaModel.freeResetTimes.toString() + " " + this.m_TxtFreeTimes.text)
        };
        ArenaView.NAME = 'ArenaView';
        return ArenaView;
    }(com_main.CView));
    com_main.ArenaView = ArenaView;
})(com_main || (com_main = {}));
