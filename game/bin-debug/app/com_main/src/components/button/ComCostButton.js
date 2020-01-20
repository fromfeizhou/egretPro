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
     *
     * @author
     *
     */
    var ComCostButton = /** @class */ (function (_super_1) {
        __extends(ComCostButton, _super_1);
        function ComCostButton() {
            var _this = _super_1.call(this) || this;
            _this.m_bIsGary = false;
            return _this;
        }
        ComCostButton.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            // this.commitProperties();
        };
        ComCostButton.prototype.setLabelFontSize = function (fontSize) {
            this.m_pLbCost.size = fontSize;
        };
        //设置购买金币或者银币
        ComCostButton.prototype.setCostImg = function (source) {
            if (!this.m_pCostIcon)
                return;
            var CostIcon = this.m_pCostIcon;
            CostIcon.width = source == '' ? 0 : 50;
            CostIcon.source = source;
        };
        //设置购买金币pos位置
        ComCostButton.prototype.setCostImgPos = function (point) {
            if (!this.m_pCostIcon)
                return;
            this.m_pCostIcon.width = point.x;
            this.m_pCostIcon.height = point.y;
        };
        ComCostButton.prototype.setImage = function (val) {
            var imgBG = this.m_pBtnBg;
            var res = RES.getRes(val);
            if (res) {
                imgBG.source = res;
                imgBG.width = res.textureWidth;
                imgBG.height = res.textureHeight;
            }
            else {
                imgBG.source = val;
            }
        };
        ComCostButton.prototype.setImagePropId = function (id) {
            this.commitProperties();
            this.setCostImg(PropModel.getPropIcon(id));
        };
        ComCostButton.prototype.setCostLabel = function (str) {
            if (this.m_pLbCost)
                this.m_pLbCost.text = str;
        };
        ComCostButton.prototype.setCostLabelByStyle = function (str) {
            if (this.m_pLbCost)
                this.m_pLbCost.textFlow = str;
        };
        Object.defineProperty(ComCostButton.prototype, "disabled", {
            get: function () {
                return !this.enabled;
            },
            /**是否禁用 */
            set: function (disabled) {
                this.enabled = !disabled;
                this.gray = disabled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComCostButton.prototype, "gray", {
            get: function () {
                return this.m_bIsGary;
            },
            /**是否灰化 */
            set: function (isGray) {
                if (this.m_bIsGary == isGray)
                    return;
                this.m_bIsGary = isGray;
                Utils.isGray(isGray, this);
                // if (this.m_pBtnTitle)
                // 	Utils.isGray(isGray, this.m_pBtnTitle);
                // if (this.m_pBtnBg)
                // 	Utils.isGray(isGray, this.m_pBtnBg);
                // this.commitProperties();
                // this.validateNow();
            },
            enumerable: true,
            configurable: true
        });
        ComCostButton.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        return ComCostButton;
    }(com_main.CComponent));
    com_main.ComCostButton = ComCostButton;
})(com_main || (com_main = {}));
