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
    var DropItem = /** @class */ (function (_super_1) {
        __extends(DropItem, _super_1);
        function DropItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = "resource/skins/components/DropItem.exml";
            return _this;
        }
        DropItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            debug("BattleItemRender:childrenCreated------>>");
        };
        DropItem.prototype.dataChanged = function () {
            this.lbContent.text = this.data.type;
        };
        DropItem.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        return DropItem;
    }(com_main.ListItemRenderer));
    com_main.DropItem = DropItem;
})(com_main || (com_main = {}));
