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
    var ListItemRenderer = /** @class */ (function (_super_1) {
        __extends(ListItemRenderer, _super_1);
        function ListItemRenderer() {
            return _super_1.call(this) || this;
        }
        ListItemRenderer.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            if (this.ContentGroup) {
                com_main.EventManager.addItemRenderAnim(this.ContentGroup);
            }
        };
        ListItemRenderer.prototype.$onRemoveFromStage = function () {
            if (this.ContentGroup) {
                com_main.EventManager.removeEventListener(this.ContentGroup);
                this.ContentGroup.removeChildren();
            }
            com_main.EventManager.removeEventListeners(this);
            this.setSkin(null);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        Object.defineProperty(ListItemRenderer.prototype, "skinName", {
            get: function () {
                return this.$Component[1 /* skinName */];
            },
            set: function (value) {
                AGame.ThemeUtils.setSkinFunc(this, value);
            },
            enumerable: true,
            configurable: true
        });
        return ListItemRenderer;
    }(eui.ItemRenderer));
    com_main.ListItemRenderer = ListItemRenderer;
})(com_main || (com_main = {}));
