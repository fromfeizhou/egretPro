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
     * 道具
     */
    var ComItemCost = /** @class */ (function (_super_1) {
        __extends(ComItemCost, _super_1);
        function ComItemCost() {
            var _this = _super_1.call(this) || this;
            _this.m_bOpenTips = true; //tips开启状态
            _this.skinName = Utils.getAppSkin("common/com_item_cost.exml");
            return _this;
        }
        ComItemCost.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ComItemCost.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        ComItemCost.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        Object.defineProperty(ComItemCost.prototype, "openTips", {
            get: function () {
                return this.m_bOpenTips;
            },
            /**启用通用tips */
            set: function (val) {
                if (this.m_bOpenTips == val)
                    return;
                this.m_bOpenTips = val;
                if (val) {
                    this.setTipsInfo();
                }
                else {
                    com_main.CTipsManager.clearTips(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        /*修改tips */
        ComItemCost.prototype.setTipsInfo = function () {
            if (this.m_bOpenTips && this.m_pItemId > 0)
                com_main.CTipsManager.addTips(this, { type: com_main.TipsEnum.Item, param: this.m_pItemId });
        };
        /**设置物品id 和 数量*/
        ComItemCost.prototype.setItemInfo = function (id, maxNum) {
            this.itemId = id;
            this.maxNum = maxNum;
            this.setTipsInfo();
        };
        Object.defineProperty(ComItemCost.prototype, "itemId", {
            /**获得物品id */
            get: function () {
                return this.m_pItemId;
            },
            /**
             * 注意：该方式自动获取背包数量，自定义数量显示 使用接口setItemInfo
             * 设置物品id */
            set: function (id) {
                if (this.m_pItemId == id)
                    return;
                this.m_pItemId = id;
                this.setTipsInfo();
                this.refreshView();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComItemCost.prototype, "maxNum", {
            set: function (maxNum) {
                this.m_nMaxNum = maxNum;
                this.refreshCount();
            },
            enumerable: true,
            configurable: true
        });
        /**刷新显示 */
        ComItemCost.prototype.refreshView = function () {
            if (this.m_pItemId && this.m_pItemId > 0) {
                var info = PropModel.getCfg(this.m_pItemId);
                if (info) {
                    if (info.mainType == PropMainType.SOUL || info.mainType == PropMainType.SKILL_SOUL) {
                        this.setChildIndex(this.m_imgIcon, 0);
                    }
                    else {
                        this.setChildIndex(this.m_imgBg, 0);
                    }
                    this.refreshIcon();
                    this.refreshQualityBg();
                }
            }
            else {
                this.resetViewState();
            }
        };
        /**重置显示 */
        ComItemCost.prototype.resetViewState = function () {
            this.m_imgIcon.source = "";
            this.m_imgBg.source = "";
            if (this.m_labCount) {
                this.m_labCount.text = "";
            }
            this.refreshQualityBg();
        };
        /**刷新图标 */
        ComItemCost.prototype.refreshIcon = function () {
            var image = PropModel.getPropIcon(this.m_pItemId);
            this.m_imgIcon.source = image;
        };
        /**刷新品质框 */
        ComItemCost.prototype.refreshQualityBg = function () {
            Utils.initPropkuang(this.m_imgBg, this.m_pItemId);
        };
        /**刷新数量 */
        ComItemCost.prototype.refreshCount = function (count) {
            if (this.m_labCount) {
                var itemCfg = C.ItemConfig[this.m_pItemId];
                var num = 0;
                var isResource = itemCfg.type == PropType.RESOURCE; //是否是资源
                if (isResource) {
                    num = RoleData.GetMaterialNumById(this.m_pItemId);
                }
                else {
                    num = PropModel.getPropNum(this.m_pItemId);
                }
                Utils.setRedProcessText(this.m_labCount, num, this.m_nMaxNum);
            }
        };
        return ComItemCost;
    }(com_main.CComponent));
    com_main.ComItemCost = ComItemCost;
})(com_main || (com_main = {}));
