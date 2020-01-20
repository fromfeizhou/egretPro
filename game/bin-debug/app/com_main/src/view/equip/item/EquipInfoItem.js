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
    /**装备格子 */
    var EquipInfoItem = /** @class */ (function (_super_1) {
        __extends(EquipInfoItem, _super_1);
        function EquipInfoItem(state) {
            var _this = _super_1.call(this) || this;
            _this.name = EquipInfoItem.NAME;
            _this.skinName = Utils.getAppSkin("equip/EquipInfoItemSkin.exml");
            return _this;
        }
        EquipInfoItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.touchChildren = false;
            // this.cacheAsBitmap = true;
            this.m_nItemId = 0;
            this.visible = false;
        };
        Object.defineProperty(EquipInfoItem.prototype, "itemId", {
            get: function () {
                return this.m_nItemId;
            },
            /**设置装备信息 */
            set: function (itemId) {
                if (this.m_nItemId == itemId)
                    return;
                this.m_nItemId = itemId;
                this.refreshEquipInfo(itemId);
            },
            enumerable: true,
            configurable: true
        });
        /**刷新装备信息 */
        EquipInfoItem.prototype.refreshEquipInfo = function (equipId) {
            var _a;
            var eqCfg = C.EquipmentConfig[equipId];
            if (!eqCfg) {
                this.visible = false;
                return;
            }
            this.visible = true;
            var attri = StringUtils.keyValsToNumberArray(eqCfg.attribute)[0];
            var fight = Utils.calculateNorFight((_a = {}, _a[attri.key] = attri.value, _a));
            this.m_imgAttriIcon.source = Utils.getAttriIcon(attri.key);
            this.m_labAttri.text = Utils.getAttriFormat(attri, false, '%s：%s');
            this.m_labFight.text = GCode(CLEnum.FIGHT1) + fight;
            Utils.setPropLabName(equipId, this.m_labEquipName);
            var cfg = PropModel.getCfg(equipId);
            if (cfg) {
                var color = Utils.getColorOfQuality(cfg.quality);
                this.m_labLevel.textFlow = Utils.htmlParser(GCode(CLEnum.LEVEL2) + "<font color=" + color + ">" + cfg.level + "</font>");
            }
            this.m_euipItem.setItemInfo(equipId);
            this.refreshSuitItem(eqCfg, equipId);
        };
        /**刷新套装 */
        EquipInfoItem.prototype.refreshSuitItem = function (eqCfg, equipId) {
            var suitCfg = C.EquipmentSetConfig[eqCfg.setId];
            if (!suitCfg)
                return;
            this.m_labSuitName.text = suitCfg.name;
            this.m_labSuitName.textColor = Utils.getColorOfQuality(suitCfg.quality);
            var suits = suitCfg.suit.split(',');
            for (var i = 0; i < 4; i++) {
                var item = this["m_suitItem" + i];
                item.setItemInfo(Number(suits[i]));
                item.currentState = "equip";
                Utils.isGray(equipId != Number(suits[i]), item);
            }
            Utils.removeAllChild(this.m_pAttriCon);
            var des = [GCode(CLEnum.EQUIP_TITLE_TZ2), GCode(CLEnum.EQUIP_TITLE_TZ3), GCode(CLEnum.EQUIP_TITLE_TZ4)];
            for (var i = 0; i < 3; i++) {
                var labTile = new eui.Label();
                labTile.text = des[i] + EquipModel.getSuitAttriDes(eqCfg.setId, i);
                labTile.size = 20;
                labTile.width = 420;
                labTile.height = 30;
                labTile.textColor = EquipModel.getSuitColor(-1);
                labTile.x = 50;
                labTile.y = 16;
                this.m_pAttriCon.addChild(labTile);
            }
        };
        EquipInfoItem.NAME = 'EquipInfoItem';
        return EquipInfoItem;
    }(com_main.CComponent));
    com_main.EquipInfoItem = EquipInfoItem;
})(com_main || (com_main = {}));
