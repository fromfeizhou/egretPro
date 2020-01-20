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
     * 武将属性tip
     */
    var GeneralAttriTip = /** @class */ (function (_super_1) {
        __extends(GeneralAttriTip, _super_1);
        function GeneralAttriTip(param) {
            var _this = _super_1.call(this) || this;
            _this.attriType = param;
            _this.skinName = Utils.getAppSkin("general/tabView/General_Attri_tip.exml");
            return _this;
        }
        GeneralAttriTip.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.refresh();
        };
        GeneralAttriTip.prototype.refresh = function () {
            var strTitle;
            var strDoc;
            if (this.attriType == AttriType.POWER) {
                strTitle = GCode(CLEnum.GEN_ATT_WL);
                strDoc = GCode(CLEnum.GEN_ATT_WL_TIPS);
            }
            else if (this.attriType == AttriType.INTELLIGENCE) {
                strTitle = GCode(CLEnum.GEN_ATT_ZL);
                strDoc = GCode(CLEnum.GEN_ATT_ZL_TIPS);
            }
            else {
                strTitle = GCode(CLEnum.GEN_ATT_TY);
                strDoc = GCode(CLEnum.GEN_ATT_TY_TIPS);
            }
            this.m_labTitle.text = strTitle;
            this.m_labDoc.text = strDoc;
        };
        GeneralAttriTip.prototype.doAction = function (isShow) {
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
        GeneralAttriTip.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this);
            _super_1.prototype.onDestroy.call(this);
        };
        GeneralAttriTip.NAME = "GeneralAttriTip";
        return GeneralAttriTip;
    }(com_main.CComponent));
    com_main.GeneralAttriTip = GeneralAttriTip;
})(com_main || (com_main = {}));
