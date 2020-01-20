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
    var CComponent = /** @class */ (function (_super_1) {
        __extends(CComponent, _super_1);
        function CComponent() {
            var _this = _super_1.call(this) || this;
            _this.lan = L.getInstance().getObject();
            return _this;
        }
        CComponent.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        CComponent.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.lan = null;
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        /**检查新手引导面板条件 */
        CComponent.prototype.onGuideCondition = function () {
            // EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION,IGUIDECD.SCENE);
        };
        return CComponent;
    }(AGame.AComponent));
    com_main.CComponent = CComponent;
    /**显示时才加载的组件 */
    var DynamicComponent = /** @class */ (function (_super_1) {
        __extends(DynamicComponent, _super_1);
        function DynamicComponent() {
            return _super_1.call(this) || this;
        }
        Object.defineProperty(DynamicComponent.prototype, "dynamicSkinName", {
            set: function (value) {
                this.skinSrc = value;
                // AGame.ThemeUtils.setSkinFunc(this, value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DynamicComponent.prototype, "visible", {
            set: function (boo) {
                if (boo && (this.skinName == '' || isNull(this.skinName)) && this.skinSrc) {
                    this.skinName = this.skinSrc;
                    this.onShow();
                }
                if (boo != this.visible) {
                    this.$setVisible(boo);
                }
            },
            enumerable: true,
            configurable: true
        });
        DynamicComponent.prototype.onShow = function () {
        };
        return DynamicComponent;
    }(CComponent));
    com_main.DynamicComponent = DynamicComponent;
    var CCButton = /** @class */ (function (_super_1) {
        __extends(CCButton, _super_1);
        function CCButton() {
            return _super_1 !== null && _super_1.apply(this, arguments) || this;
        }
        return CCButton;
    }(AGame.AButton));
    com_main.CCButton = CCButton;
    var CCRadioButton = /** @class */ (function (_super_1) {
        __extends(CCRadioButton, _super_1);
        function CCRadioButton() {
            return _super_1.call(this) || this;
        }
        return CCRadioButton;
    }(AGame.ARadioButton));
    com_main.CCRadioButton = CCRadioButton;
    var CCHSlider = /** @class */ (function (_super_1) {
        __extends(CCHSlider, _super_1);
        function CCHSlider() {
            return _super_1.call(this) || this;
        }
        return CCHSlider;
    }(AGame.AHSlider));
    com_main.CCHSlider = CCHSlider;
    var CImage = /** @class */ (function (_super_1) {
        __extends(CImage, _super_1);
        function CImage() {
            return _super_1 !== null && _super_1.apply(this, arguments) || this;
        }
        return CImage;
    }(AGame.AImage));
    com_main.CImage = CImage;
    var CList = /** @class */ (function (_super_1) {
        __extends(CList, _super_1);
        function CList() {
            return _super_1 !== null && _super_1.apply(this, arguments) || this;
        }
        CList.prototype.$onRemoveFromStage = function () {
            var dataProvider = this.dataProvider;
            if (dataProvider) {
                dataProvider.replaceAll([]);
                this.dataProvider = null;
                this.itemRenderer = null;
            }
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        return CList;
    }(eui.List));
    com_main.CList = CList;
})(com_main || (com_main = {}));
