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
    var ComButton = /** @class */ (function (_super_1) {
        __extends(ComButton, _super_1);
        function ComButton() {
            var _this = _super_1.call(this) || this;
            _this.m_bIsGary = false;
            return _this;
        }
        ComButton.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            // this.commitProperties();
        };
        ComButton.prototype.setLabelFontSize = function (fontSize) {
            this.m_pTitleLabel.size = fontSize;
        };
        ComButton.prototype.setwidth = function (width) {
            if (this.m_pTitleLabel)
                this.m_pTitleLabel.parent.width = width;
        };
        ComButton.prototype.setTitleImg = function (source) {
            if (!this.m_pBtnTitle)
                return;
            var imgTitle = this.m_pBtnTitle;
            var res = RES.getRes(source);
            if (res) {
                imgTitle.texture = res;
                imgTitle.width = res.textureWidth;
                imgTitle.height = res.textureHeight;
            }
            else {
                imgTitle.source = null;
            }
        };
        ComButton.prototype.setImage = function (val) {
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
        ComButton.prototype.setIsSelect = function (select) {
            if (this.m_selectTitleImg && this.m_unselectTitleImg) {
                if (select)
                    this.setTitleImg(this.m_selectTitleImg);
                else
                    this.setTitleImg(this.m_unselectTitleImg);
            }
            if (this.m_selectImg && this.m_unselectImg) {
                if (select)
                    this.setImage(this.m_selectImg);
                else
                    this.setImage(this.m_unselectImg);
            }
        };
        //FIX ME
        ComButton.prototype.setSelectTitleImg = function (source, source2) {
            this.m_selectTitleImg = source;
            this.m_unselectTitleImg = source2;
        };
        //FIX ME
        ComButton.prototype.setSelectImage = function (val, val2) {
            this.m_selectImg = val;
            this.m_unselectImg = val2;
        };
        ComButton.prototype.setTitleLabel = function (str) {
            if (this.m_pTitleLabel) {
                this.m_pTitleLabel.text = str;
                this.validateNow();
            }
        };
        ComButton.prototype.setStroke = function (num) {
            if (this.m_pTitleLabel)
                this.m_pTitleLabel.stroke = num;
        };
        ComButton.prototype.setTitleLabelByStyle = function (str) {
            if (this.m_pTitleLabel)
                this.m_pTitleLabel.textFlow = str;
        };
        Object.defineProperty(ComButton.prototype, "disabled", {
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
        Object.defineProperty(ComButton.prototype, "gray", {
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
        Object.defineProperty(ComButton.prototype, "imgMark", {
            get: function () {
                return this.m_imgMark;
            },
            set: function (v) {
                this.m_imgMark = v;
            },
            enumerable: true,
            configurable: true
        });
        ComButton.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        return ComButton;
    }(com_main.CComponent));
    com_main.ComButton = ComButton;
})(com_main || (com_main = {}));
