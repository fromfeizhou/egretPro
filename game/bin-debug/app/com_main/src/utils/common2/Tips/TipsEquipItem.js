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
    /**装备加成格子 */
    var TipsEquipItem = /** @class */ (function (_super_1) {
        __extends(TipsEquipItem, _super_1);
        function TipsEquipItem(state) {
            var _this = _super_1.call(this) || this;
            _this.m_width = 97; //进度条宽度
            _this.name = TipsEquipItem.NAME;
            _this.skinName = Utils.getAppSkin("common/tips/TipsEquipAddItemSkin.exml");
            return _this;
        }
        TipsEquipItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        TipsEquipItem.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        TipsEquipItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.touchChildren = false;
            this.m_nItemId = 0;
        };
        Object.defineProperty(TipsEquipItem.prototype, "pos", {
            /**位置 */
            get: function () {
                return this.m_nPos;
            },
            set: function (val) {
                this.m_nPos = val;
            },
            enumerable: true,
            configurable: true
        });
        /**设置装备信息 */
        TipsEquipItem.prototype.setItemInfo = function (itemId, level, title, tagIndex, color) {
            if (level === void 0) { level = 0; }
            if (title === void 0) { title = ''; }
            if (tagIndex === void 0) { tagIndex = 0; }
            if (color === void 0) { color = GameConfig.TextColors.white; }
            this.refreshItemView(itemId);
        };
        /**刷新图标 */
        TipsEquipItem.prototype.refreshItemView = function (itemId) {
            if (this.m_nItemId == itemId)
                return;
            this.m_nItemId = itemId;
            if (this.m_nItemId > 0) {
                var itemCfg = C.ItemConfig[itemId];
                this.m_imgIcon.source = PropModel.getPropIcon(itemId);
                Utils.initPropkuang(this.m_imgBg, itemId);
            }
            else {
                this.m_imgIcon.source = EquipModel.getEquipIconByPos(this.m_nPos);
                this.m_imgBg.source = 'Qualitykuang0_png';
            }
            this.refreshEquipName();
        };
        /**刷装备名字 */
        TipsEquipItem.prototype.refreshEquipName = function () {
            if (!this.m_labName)
                return;
            if (this.m_nItemId > 0) {
                Utils.setPropLabName(this.m_nItemId, this.m_labName);
            }
            else {
                this.m_labName.text = '';
            }
        };
        /**显示进度 */
        TipsEquipItem.prototype.reStreng = function (level, maxlevel) {
            this.m_labProNum.text = level + '/' + maxlevel;
            var curpro = (level / maxlevel) > 1 ? 1 : (level / maxlevel);
            this.m_imgPro.width = curpro * this.m_width;
        };
        TipsEquipItem.NAME = 'TipsEquipItem';
        return TipsEquipItem;
    }(com_main.CComponent));
    com_main.TipsEquipItem = TipsEquipItem;
})(com_main || (com_main = {}));
