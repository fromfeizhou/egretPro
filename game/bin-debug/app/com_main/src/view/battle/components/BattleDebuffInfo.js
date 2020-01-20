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
    var BattleDebuffInfo = /** @class */ (function (_super_1) {
        __extends(BattleDebuffInfo, _super_1);
        function BattleDebuffInfo() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("battle_new/top_new/battle_debuff_info.exml");
            return _this;
        }
        BattleDebuffInfo.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
            this.removeEvent();
        };
        BattleDebuffInfo.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var rates = ConstUtil.getNumArray(IConstEnum.ARROGANCE_PARAM);
            var val = (rates[0] / 100).toFixed(1);
            this.m_lbContent.text = "\u6BCF\u6B21\u653B\u57CE\u6218\u5BF9\u6218\u80DC\u5229\u540E\u83B7\u5F971\u5C42\u50B2\u6C14\uFF0C\u6BCF\u53E0\u52A0\u4E00\u5C42\u5BFC\u81F4\u90E8\u961F\u4F24\u5BB3\u4E0B\u964D" + val + "%\uFF0C\u53D7\u5230\u4F24\u5BB3\u4E0A\u5347" + val + "%\uFF0C\u6700\u591A\u53E0\u52A0100\u5C42";
        };
        BattleDebuffInfo.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this, this, this.onClick);
        };
        BattleDebuffInfo.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        BattleDebuffInfo.prototype.refreshView = function (buffLv) {
            this.addEvent();
            this.m_lbNum.text = buffLv.toString();
            var rates = ConstUtil.getNumArray(IConstEnum.ARROGANCE_PARAM);
            var rate = (rates[0] / 100 * buffLv).toFixed(1);
            this.m_lbEff.text = "\u4F24\u5BB3\u4E0B\u964D\uFF1A" + rate + "% \u53D7\u4F24\u4E0A\u5347:" + rate + "%";
        };
        BattleDebuffInfo.prototype.onClick = function () {
            this.visible = false;
        };
        BattleDebuffInfo.prototype.onDestroy = function () {
        };
        return BattleDebuffInfo;
    }(com_main.CComponent));
    com_main.BattleDebuffInfo = BattleDebuffInfo;
})(com_main || (com_main = {}));
