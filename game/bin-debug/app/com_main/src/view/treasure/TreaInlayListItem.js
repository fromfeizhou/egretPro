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
     * 宝石列表cell
     */
    var TreaInLayListItem = /** @class */ (function (_super_1) {
        __extends(TreaInLayListItem, _super_1);
        function TreaInLayListItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("treasure/TreaInLayListItemSkin.exml");
            return _this;
        }
        TreaInLayListItem.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        TreaInLayListItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**设置宝石数据 */
        TreaInLayListItem.prototype.setItemInfo = function (itemId, pos) {
            this.itemId = itemId;
            this.m_nPos = pos;
            this.refresView();
        };
        TreaInLayListItem.prototype.refresView = function () {
            var stoneCfg = C.GemstoneConfig[this.itemId];
            if (stoneCfg) {
                var attri = StringUtils.keyValsToNumberArray(stoneCfg.attri);
                Utils.setPropLabName(this.itemId, this.m_labName);
                this.m_labAttri.textFlow = Utils.htmlParser(Utils.getAttriFormat(attri[0], true, '%s%s'));
                this.m_comItem.setItemInfo(this.itemId);
            }
        };
        TreaInLayListItem.prototype.setEquipState = function (val) {
            this.m_pSelTips.visible = val;
        };
        return TreaInLayListItem;
    }(com_main.CComponent));
    com_main.TreaInLayListItem = TreaInLayListItem;
})(com_main || (com_main = {}));
