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
    /**装备碎片格子 */
    var EquipSoulItem = /** @class */ (function (_super_1) {
        __extends(EquipSoulItem, _super_1);
        function EquipSoulItem() {
            var _this = _super_1.call(this) || this;
            _this.name = EquipSoulItem.NAME;
            _this.skinName = Utils.getAppSkin("equip/EquipSoulItemSkin.exml");
            return _this;
        }
        EquipSoulItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.touchChildren = false;
            // this.cacheAsBitmap = true;
            this.m_nItemId = 0;
        };
        /**设置装备信息 */
        EquipSoulItem.prototype.setItemInfo = function (itemId, count, max) {
            this.refreshItemView(itemId);
            this.refreshCount(count, max);
        };
        /**刷新图标 */
        EquipSoulItem.prototype.refreshItemView = function (itemId) {
            if (this.m_nItemId == itemId)
                return;
            this.m_nItemId = itemId;
            if (this.m_nItemId > 0) {
                var itemCfg = C.ItemConfig[itemId];
                this.m_imgIcon.source = PropModel.getPropIcon(itemId);
                this.m_imgQIcon.source = PropModel.getQualitySoulIcon(itemId);
                Utils.initPropkuang(this.m_imgBg, itemId);
            }
            else {
                this.m_imgIcon.source = '';
                this.m_imgQIcon.source = '';
                this.m_imgBg.source = 'Qualitykuang0_png';
            }
            this.refreshEquipName();
            this.refreshEquipLv();
            this.refreshRedEffect();
        };
        /**刷装备名字 */
        EquipSoulItem.prototype.refreshEquipName = function () {
            if (!this.m_labEquipName)
                return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabName(this.m_nItemId, this.m_labEquipName);
            }
            else {
                this.m_labEquipName.text = '';
            }
        };
        /**刷装备等级 */
        EquipSoulItem.prototype.refreshEquipLv = function () {
            if (!this.m_labEquipLv)
                return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabLv(this.m_nItemId, this.m_labEquipLv);
            }
            else {
                this.m_labEquipLv.text = '';
            }
        };
        /**刷装备数量 */
        EquipSoulItem.prototype.refreshCount = function (count, max) {
            if (!this.m_labCount)
                return;
            Utils.setRedProcessText(this.m_labCount, count, max);
        };
        /**设置流光特效*/
        EquipSoulItem.prototype.refreshRedEffect = function () {
            var itemInfo = C.ItemConfig[this.m_nItemId];
            if (itemInfo && itemInfo.quality >= 5) {
                this.createLvEffect();
            }
            else {
                this.clearLvEffect();
            }
        };
        EquipSoulItem.prototype.createLvEffect = function () {
            if (this.m_eqLvEff)
                return;
            this.m_eqLvEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_eqLvEff.x = 51;
            this.m_eqLvEff.y = 49;
            this.m_pEffRoot.addChild(this.m_eqLvEff);
        };
        EquipSoulItem.prototype.clearLvEffect = function () {
            if (this.m_eqLvEff) {
                NormalMcMgr.removeMc(this.m_eqLvEff);
                this.m_eqLvEff = null;
            }
        };
        EquipSoulItem.NAME = 'EquipSoulItem';
        return EquipSoulItem;
    }(com_main.CComponent));
    com_main.EquipSoulItem = EquipSoulItem;
})(com_main || (com_main = {}));
