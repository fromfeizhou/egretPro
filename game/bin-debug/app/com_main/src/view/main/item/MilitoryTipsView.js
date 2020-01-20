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
    var MilitoryTipsView = /** @class */ (function (_super_1) {
        __extends(MilitoryTipsView, _super_1);
        function MilitoryTipsView() {
            var _this = _super_1.call(this) || this;
            _this.name = MilitoryTipsView.NAME;
            _this.skinName = Utils.getAppSkin("top_new/item/MilitoryTipsViewSkin.exml");
            return _this;
        }
        MilitoryTipsView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        MilitoryTipsView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        MilitoryTipsView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.updateData();
        };
        MilitoryTipsView.prototype.updateData = function () {
            // let militoryLimit: number = ConstUtil.getValue(IConstEnum.MILITARYMERITS_DAY_LIMIT);
            var militoryLimit = C.MilitaryMeritsDayLimitConfig[RoleData.level] ? C.MilitaryMeritsDayLimitConfig[RoleData.level].dayLimit : C.MilitaryMeritsDayLimitConfig[200].dayLimit;
            this.m_imgPro.width = Math.min(Math.floor((RoleData.militaryDayExp / militoryLimit) * MilitoryTipsView.PRO_WITH), MilitoryTipsView.PRO_WITH);
            this.m_lbExp.text = RoleData.militaryDayExp + "/" + militoryLimit;
            var nextLimitLev = WorldModel.getNextMilitaryMeritsDayLimitLev(militoryLimit);
            this.m_labDes.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_TIPS_MILITORY, 0, nextLimitLev));
            this.m_labCoin.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_MILITORY_COIN, RoleData.militaryCoin));
        };
        MilitoryTipsView.prototype.doAction = function (isShow) {
            egret.Tween.removeTweens(this);
            var tw = egret.Tween.get(this);
            if (isShow) {
                this.scaleY = 0;
                this.alpha = 0.5;
                tw.to({ scaleY: 1, alpha: 1 }, 300, Ease.cubicOut);
            }
            else {
                var tw_1 = egret.Tween.get(this);
                tw_1.to({ alpha: 0 }, 300, Ease.cubicOut);
            }
        };
        MilitoryTipsView.NAME = "MilitoryTipsView";
        MilitoryTipsView.PRO_WITH = 220;
        return MilitoryTipsView;
    }(com_main.CComponent));
    com_main.MilitoryTipsView = MilitoryTipsView;
})(com_main || (com_main = {}));
