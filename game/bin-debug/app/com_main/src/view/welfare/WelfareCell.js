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
    var WelfareCell = /** @class */ (function (_super_1) {
        __extends(WelfareCell, _super_1);
        // private m_eqLvEff: MCDragonBones;
        function WelfareCell(cfg) {
            var _this = _super_1.call(this) || this;
            _this.m_state = -1; //0已领取 ，1可补签 2可领奖，-1其他不可点击
            _this.skinName = Utils.getSkinName("app/welfare/WelfareCellSkin.exml");
            _this.m_cfg = cfg;
            return _this;
        }
        ; //选中动画
        WelfareCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        WelfareCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
            this.actionGroup.removeEventListener("complete", this.replay, this);
        };
        WelfareCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.cacheAsBitmap = true;
            this.m_imgSelect.visible = false;
            this.actionGroup.play(0);
            this.actionGroup.addEventListener('complete', this.replay, this);
            this.init();
        };
        WelfareCell.prototype.replay = function () {
            this.actionGroup.play(0);
        };
        WelfareCell.prototype.init = function () {
            if (!this.m_cfg)
                return;
            var rewardCfg = Utils.parseCommonItemJson(this.m_cfg.reward);
            this.m_pIconItem.setItemInfo(rewardCfg[0].itemId, rewardCfg[0].count);
            if (this.m_cfg.doubling) {
                this.m_dobuleGroup.visible = true;
            }
            else {
                this.m_dobuleGroup.visible = false;
            }
            this.m_pLbDoubleStr.text = GCodeFromat(CLEnum.AC_SIGN_VIP, this.m_cfg.vip);
            com_main.EventManager.addTouchTapListener(this, this, this.onClickHandler);
        };
        WelfareCell.prototype.updateState = function (state) {
            if (this.m_state == state)
                return;
            this.m_state = state;
            if (state == 0) {
                this.m_groupGetFlag.visible = true;
                this.m_phaveLevel.text = GCode(CLEnum.TAKE_OUT_END);
                this.m_phaveLevel.textColor = 0x70f145;
                this.m_imgSelect.visible = false;
            }
            else if (state == 1) {
                this.m_imgSelect.visible = true;
                this.m_groupGetFlag.visible = true;
                this.m_phaveLevel.text = GCode(CLEnum.AC_SUP_SIGN);
                this.m_phaveLevel.textColor = 0xf3a549;
            }
            else if (state == 2) {
                this.m_imgSelect.visible = true;
                this.m_groupGetFlag.visible = false;
            }
            else if (state == 3) {
                this.m_imgSelect.visible = true;
                this.m_groupGetFlag.visible = true;
                this.m_phaveLevel.text = "可补领" /*GCode(CLEnum.AC_SUP_SIGN)*/;
                this.m_phaveLevel.textColor = 0xf3a549;
            }
            else {
                this.m_groupGetFlag.visible = false;
            }
        };
        WelfareCell.prototype.onClickHandler = function (e) {
            if (this.m_state == 1) {
                this.onBuyNum();
            }
            else if (this.m_state == 2) { //可签到
                WelfareProxy.send_SIGN_UP();
            }
            else if (this.m_state == 3) { //可补领
                WelfareProxy.send_PATCH_COLLA();
            }
        };
        /**目前补签次数 */
        WelfareCell.prototype.updateBuQian = function (num) {
            this.m_currbuqNum = num;
        };
        /**消耗元宝补签 */
        WelfareCell.prototype.onBuyNum = function () {
            var costList = ConstUtil.getNumArray(IConstEnum.SIGN_UP_PRICE);
            var num = this.m_currbuqNum > 0 ? this.m_currbuqNum : 0;
            this.m_currPrice = costList[num];
            if (PropModel.isItemEnough(PropEnum.GOLD, this.m_currPrice, 2)) {
                var content = GCodeFromat(CLEnum.ARENA_NUM_TIPS, costList[num]);
                Utils.showConfirmPop(content, function () {
                    WelfareProxy.send_SUPPLEMENT_SIGN_UP();
                }, this);
            }
        };
        return WelfareCell;
    }(com_main.CComponent));
    com_main.WelfareCell = WelfareCell;
})(com_main || (com_main = {}));
