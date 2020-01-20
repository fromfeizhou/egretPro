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
    var TopSourceItem = /** @class */ (function (_super_1) {
        __extends(TopSourceItem, _super_1);
        function TopSourceItem(id) {
            var _this = _super_1.call(this) || this;
            _this.name = TopSourceItem.NAME;
            _this.m_nItemId = id || PropEnum.GOLD;
            _this.skinName = Utils.getSkinName("app/top_new/TopSourceItemSkin.exml");
            return _this;
        }
        TopSourceItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        TopSourceItem.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            Tween.removeTweens(this.m_labNum);
            com_main.EventManager.removeEventListeners(this);
        };
        TopSourceItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchTapListener(this, this, this.onSourceHandler);
            this.refreshView();
        };
        Object.defineProperty(TopSourceItem.prototype, "itemId", {
            /**获取资源id */
            get: function () {
                return this.m_nItemId;
            },
            enumerable: true,
            configurable: true
        });
        /**刷新显示 */
        TopSourceItem.prototype.refreshView = function () {
            this.refreshIcon();
            this.refreshNum(false);
        };
        /**刷新数量 */
        TopSourceItem.prototype.refreshNum = function (isAction) {
            if (isAction === void 0) { isAction = true; }
            if (isAction) {
                CommonUtils.NumberActionTo(this.m_labNum, CommonUtils.OutlenToNum(this.m_labNum.text), PropModel.getPropNum(this.m_nItemId), 1000, true);
                if (this.m_nLastNumber) {
                    this.showResChange(PropModel.getPropNum(this.m_nItemId) - this.m_nLastNumber);
                }
            }
            else {
                CommonUtils.labelIsOverLenght(this.m_labNum, PropModel.getPropNum(this.m_nItemId));
            }
            this.m_nLastNumber = PropModel.getPropNum(this.m_nItemId);
        };
        Object.defineProperty(TopSourceItem.prototype, "sourceIcon", {
            /**获得资源图标 (采集使用) */
            get: function () {
                return this.m_imgIcon;
            },
            enumerable: true,
            configurable: true
        });
        /**播放资源动画 （采集使用） */
        TopSourceItem.prototype.showIconAction = function () {
            var anim = IETypes.EUI_SilverAdd;
            var x = -105;
            var y = -40;
            if (this.m_nItemId == PropEnum.FOOD) {
                anim = IETypes.EUI_FoodAdd;
                x = -105;
            }
            var effect = ImageEffect.load(anim);
            effect.x = x;
            effect.y = y;
            Utils.addChild(this, effect);
            ImageEffect.runAction(effect, function () {
                ImageEffect.stopAction(effect);
                ImageEffect.removeAction(effect);
                effect = null;
            }, this);
        };
        /**资源点击回调 */
        TopSourceItem.prototype.onSourceHandler = function () {
            // this.showIconAction();
            switch (this.m_nItemId) {
                case PropEnum.GOLD:
                    Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
                    break;
                case PropEnum.YU: //勾玉
                    Utils.open_view(TASK_UI.POP_PAY_SHOP_YU_VIEW);
                    break;
                case PropEnum.GUILD_POINT: //联盟
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.PVP_MEDAL: //竞技
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.CONQUER: //过关斩将
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.BOSSSCORE:
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.MILITARY_EXPLOIT:
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.ZML: //招募令
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.MILITARY_MERITS_CONSUMED: //军功
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.HONOR: //荣誉
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                default:
                    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(this.m_nItemId);
                    break;
            }
        };
        /**刷新图标 */
        TopSourceItem.prototype.refreshIcon = function () {
            var iconName = RoleData.GetMaterialIconPathById(this.m_nItemId);
            if (iconName == '')
                iconName = PropModel.getPropIcon(this.m_nItemId);
            this.m_imgIcon.source = iconName;
        };
        /**资源变化，添加显示 */
        TopSourceItem.prototype.showResChange = function (change) {
            var str = "";
            if (change < 0) {
                str = "" + change;
            }
            else if (change > 0) {
                return;
            }
            else {
                return;
            }
            var label = new eui.Label(str);
            this.addChild(label);
            label.size = 24;
            label.textColor = 0xFF0000;
            label.strokeColor = 0xFF0000;
            label.stroke = 1;
            label.x = 44.82;
            label.y = 31.52;
            egret.Tween.get(label).wait(500).to({ alpha: 0, y: label.y - 30 }, 800);
        };
        TopSourceItem.NAME = "TopSourceItem";
        return TopSourceItem;
    }(com_main.CComponent));
    com_main.TopSourceItem = TopSourceItem;
})(com_main || (com_main = {}));
