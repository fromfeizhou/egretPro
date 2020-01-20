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
    /**宝物配置 */
    var ComTreaItem = /** @class */ (function (_super_1) {
        __extends(ComTreaItem, _super_1);
        function ComTreaItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("common/ComTreaItemSkin.exml");
            return _this;
        }
        ComTreaItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.touchChildren = false;
            this.cacheAsBitmap = true;
        };
        /**设置唯一id */
        ComTreaItem.prototype.setInfo = function (itemId) {
            if (this.m_nItemId == itemId)
                return;
            this.m_nItemId = itemId;
            this.m_tCurVo = TreasureModel.getData(itemId);
            this.refreshView();
        };
        /**设置宝物物品id 星级 等级 */
        ComTreaItem.prototype.setItemInfo = function (itemId, level, star, ownerName) {
            if (level === void 0) { level = 1; }
            if (star === void 0) { star = 0; }
            if (ownerName === void 0) { ownerName = ''; }
            this.refreshItemView(itemId);
            this.refreshStar(star);
            this.setOwnerName(ownerName);
        };
        /**选中 */
        ComTreaItem.prototype.setSecected = function (val) {
            this.m_imgSelect.visible = val;
        };
        /**刷新显示 */
        ComTreaItem.prototype.refreshView = function () {
            if (this.m_tCurVo) {
                this.refreshItemView(this.m_tCurVo.itemId);
                if (this.m_tCurVo.generalId > 0) {
                    this.setOwnerName(GeneralModel.getGeneralName(this.m_tCurVo.generalId));
                }
                else {
                    this.setOwnerName("");
                }
                // this.refreshLevel(this.m_tCurVo.level);
                this.refreshStar(this.m_tCurVo.star);
            }
            else {
                this.m_imgIcon.source = "";
                this.m_imgBg.source = TreasureModel.getTreaQualityBg(1);
                this.m_labName.text = "";
                this.setOwnerName("");
                // this.refreshLevel(0);
                this.refreshStar(0);
            }
        };
        /**刷新图标 */
        ComTreaItem.prototype.refreshItemView = function (itemId) {
            var itemCfg = C.ItemConfig[itemId];
            this.m_imgIcon.source = TreasureModel.getTreaIcon(itemId);
            this.m_imgBg.source = TreasureModel.getTreaQualityBg(itemCfg.quality);
            Utils.setPropLabName(itemId, this.m_labName);
        };
        /**刷新星级 */
        ComTreaItem.prototype.refreshStar = function (starNum) {
            while (this.m_groupStart.numChildren > starNum) {
                this.m_groupStart.removeChildAt(0);
            }
            for (var i = this.m_groupStart.numChildren; i < starNum; i++) {
                var star = new eui.Image();
                star.source = "common_star_png";
                star.width = 30;
                star.height = 30;
                this.m_groupStart.addChild(star);
            }
        };
        /**设置拥有者名字 */
        ComTreaItem.prototype.setOwnerName = function (ownerName) {
            if (ownerName == "") {
                this.m_groupOwner.visible = false;
            }
            else {
                this.m_groupOwner.visible = true;
                this.m_labOwnerName.text = ownerName;
            }
        };
        return ComTreaItem;
    }(com_main.CComponent));
    com_main.ComTreaItem = ComTreaItem;
})(com_main || (com_main = {}));
