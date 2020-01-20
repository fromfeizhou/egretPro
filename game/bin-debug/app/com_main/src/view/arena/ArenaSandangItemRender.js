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
    var ArenaSandangItemRender = /** @class */ (function (_super_1) {
        __extends(ArenaSandangItemRender, _super_1);
        function ArenaSandangItemRender(param) {
            var _this = _super_1.call(this) || this;
            // this.id = param;
            _this.skinName = Utils.getAppSkin("arena/arena_saodan_render.exml");
            return _this;
        }
        ArenaSandangItemRender.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this);
            _super_1.prototype.onDestroy.call(this);
        };
        ArenaSandangItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.refresh();
        };
        ArenaSandangItemRender.prototype.refresh = function (ArenaInfo) {
            this.lb_gaunka.text = GCodeFromat(CLEnum.CHALL_NUM, ArenaInfo.arenaId);
            for (var _i = 0, _a = ArenaInfo.values; _i < _a.length; _i++) {
                var itemInfo = _a[_i];
                // let item = new com_main.ArenaItemRender();
                // item.refresh(itemInfo);
                // this.group_itemList.addChild(item);
                var item = com_main.ComItemNew.create();
                item.setItemInfo(itemInfo.itemId, itemInfo.count);
                this.group_itemList.addChild(item);
            }
        };
        return ArenaSandangItemRender;
    }(com_main.CComponent));
    com_main.ArenaSandangItemRender = ArenaSandangItemRender;
})(com_main || (com_main = {}));
