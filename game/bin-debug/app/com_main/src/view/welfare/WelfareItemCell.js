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
    var WelfareItemCell = /** @class */ (function (_super_1) {
        __extends(WelfareItemCell, _super_1);
        function WelfareItemCell() {
            var _this = _super_1.call(this) || this;
            _this.m_state = -1; //0已领取 ，1可领奖，-1其他不可点击
            _this.skinName = Utils.getSkinName("app/welfare/WelfareItemCellSkin.exml");
            return _this;
        }
        WelfareItemCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        WelfareItemCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
            this.clearEffect();
        };
        WelfareItemCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.cacheAsBitmap = true;
            this.m_comItem.mask = this.m_mask;
        };
        WelfareItemCell.prototype.init = function (cfg) {
            this.m_signUpCfg = cfg;
            if (cfg) {
                var items = Utils.parseCommonItemJson(cfg.extraReward);
                this.m_comItem.setItemInfo(items[0].itemId, items[0].count);
                com_main.EventManager.addTouchTapListener(this, this, this.onClickItem);
            }
        };
        WelfareItemCell.prototype.updateState = function (state) {
            if (this.m_state == state)
                return;
            this.m_state = state;
            this.m_black.visible = false;
            if (state == 0) {
                this.m_groupGetFlag.visible = true;
                this.m_labGetFlag.text = GCode(CLEnum.TAKE_OUT_END);
                this.clearEffect();
            }
            else if (state == 1) {
                this.m_groupGetFlag.visible = true;
                this.m_labGetFlag.text = GCode(CLEnum.TAKE_OUT_IN);
                this.createEffect();
            }
            else {
                this.m_groupGetFlag.visible = false;
                Utils.isGray(false, this.m_comItem);
                this.m_black.visible = true;
                this.clearEffect();
            }
        };
        Object.defineProperty(WelfareItemCell.prototype, "signCfg", {
            /**获取配置表 */
            get: function () {
                return this.m_signUpCfg;
            },
            enumerable: true,
            configurable: true
        });
        /**额外奖励领取 */
        WelfareItemCell.prototype.onClickItem = function (e) {
            if (this.m_state == 1) {
                WelfareProxy.send_RECEIVE_SIGN_UP_EXTRA_REWARD(this.m_signUpCfg.id);
            }
        };
        //=============================================================================================================================================
        //特效 begin
        //============================================================================================================================================= 
        /**设置特效 */
        WelfareItemCell.prototype.createEffect = function () {
            if (this.m_ItemEff)
                return;
            this.m_ItemEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_ItemEff.x = this.width / 2;
            this.m_ItemEff.y = 48.5;
            // this.m_generalEff.play(IETypes.EUI_EqLevelEff, 0);
            this.addChild(this.m_ItemEff);
        };
        WelfareItemCell.prototype.clearEffect = function () {
            if (this.m_ItemEff) {
                NormalMcMgr.removeMc(this.m_ItemEff);
                this.m_ItemEff = null;
            }
        };
        return WelfareItemCell;
    }(com_main.CComponent));
    com_main.WelfareItemCell = WelfareItemCell;
})(com_main || (com_main = {}));
