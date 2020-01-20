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
    var BagViewEventType = /** @class */ (function () {
        function BagViewEventType() {
            this.HIDE_DETAILS = 1;
            this.SHOW_DETAILS = 2;
        }
        return BagViewEventType;
    }());
    var BagView = /** @class */ (function (_super_1) {
        __extends(BagView, _super_1);
        function BagView(id) {
            if (id === void 0) { id = null; }
            var _this = _super_1.call(this) || this;
            _this.mSelectedIndex = 0;
            _this.name = BagView.NAME;
            if (id) {
                _this.mSelectedIndex = id;
            }
            _this.initApp("bag/bag_view.exml");
            return _this;
        }
        BagView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventMgr.removeEventByObject(BagEvent.BAG_SELECTED_CHANGE, this);
            com_main.EventMgr.removeEventByObject(BagEvent.BAG_ITEM_UPDATE, this);
            PropModel.ClearNewPorpState();
        };
        BagView.prototype.ShowDetails = function (data) {
            if (this.m_nCurType.indexOf(data.tagId) == -1)
                return;
            this.m_nCurUId = data.uuid;
            if (unNull(data.uuid)) {
                this.m_Detaile.visible = true;
                var vo = PropModel.getPropByUId(data.uuid);
                Utils.setPropLabName(vo.itemId, this.m_ItemName);
                this.m_Description.text = vo.config.description;
                this.m_nCurItemMax = vo.count;
                this.m_ItemNum.text = this.m_nCurItemMax + '';
                this.m_ComItem.setItemInfo(vo.itemId);
                this.m_BtnUse.visible = vo.config.usable != 0;
                this.m_ItemUsable = vo.config.usable;
                if (vo.type == PropMainType.SOUL) {
                    this.m_BtnSource.visible = true;
                }
                else {
                    this.m_BtnSource.visible = false;
                }
                this.refreshSlider();
            }
            else {
                this.m_Detaile.visible = false;
            }
        };
        BagView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.height = this.stage.stageHeight;
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.FOOD, PropEnum.WOOD, PropEnum.IRON]);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.BAG));
            this.m_BtnUse.setTitleLabel(GCode(CLEnum.BAG_USE));
            this.m_BtnSource.setTitleLabel(GCode(CLEnum.BAG_SOURCE));
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_ALL) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_BS) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_WJSP) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_JNSP) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_BWSP) });
            // this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.BAG_TAB_JS) });
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            this.m_itemsView.resetListSize();
            this.m_tTypes = [
                [PropMainType.All],
                [PropMainType.STONE],
                [PropMainType.SOUL],
                [PropMainType.SKILL_SOUL],
                [PropMainType.TREA_SOUL]
            ];
            this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnSub, this, this.onClickSub);
            com_main.EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onClickAdd);
            com_main.EventManager.addTouchScaleListener(this.m_BtnUse, this, this.onBtnUseHandler);
            com_main.EventManager.addTouchScaleListener(this.m_BtnSource, this, this.onBtnSourceHandler);
            com_main.EventMgr.addEvent(BagEvent.BAG_SELECTED_CHANGE, this.ShowDetails, this);
            com_main.EventMgr.addEvent(BagEvent.BAG_ITEM_UPDATE, this.onBagItemUpdate, this);
            this.changeTag(0);
            // this.validateNow();
        };
        BagView.prototype.changeTag = function (selIndex) {
            this.m_nCurType = this.m_tTypes[selIndex];
            this.m_itemsView.setItemType(this.m_nCurType);
        };
        /**物品数量更新 */
        BagView.prototype.onBagItemUpdate = function (uuid) {
            if (this.m_nCurUId == (uuid)) {
                var vo = PropModel.getPropByUId(this.m_nCurUId);
                if (vo) {
                    var num = vo.count;
                    this.m_ItemNum.text = num + "";
                    this.m_nCurItemMax = num;
                    this.refreshSlider(this.m_slider.value);
                }
            }
        };
        /**刷新使用显示 */
        BagView.prototype.refreshSlider = function (val) {
            //可以使用 而且数量大于1时候显示
            this.m_groupMultiUse.visible = (this.m_ItemUsable != 0 && this.m_nCurItemMax > 1);
            this.m_slider.maximum = this.m_nCurItemMax;
            this.m_slider.minimum = 1;
            if (val) {
                this.m_slider.value = Math.min(val, this.m_nCurItemMax);
            }
            else {
                this.m_slider.value = this.m_nCurItemMax;
            }
            this.updateValue();
        };
        //滑动滑块
        BagView.prototype.onchangSlider = function (event) {
            this.updateValue();
        };
        /**文本刷新 */
        BagView.prototype.updateValue = function () {
            this.m_sliderNum.text = this.m_slider.value + '/' + this.m_nCurItemMax;
        };
        /**
        * --
        */
        BagView.prototype.onClickSub = function () {
            if (this.m_slider.value <= this.m_slider.minimum)
                return;
            this.m_slider.value--;
            this.updateValue();
        };
        /**
         * ++
         */
        BagView.prototype.onClickAdd = function () {
            if (this.m_slider.value >= this.m_slider.maximum)
                return;
            this.m_slider.value++;
            this.updateValue();
        };
        /**道具使用 */
        BagView.prototype.onBtnUseHandler = function () {
            if (this.m_ComItem.itemId > 0) {
                var num = PropModel.getPropNum(this.m_ComItem.itemId);
                var useValue = this.m_slider.value;
                if (num > 0 && useValue > 0) {
                    useValue = useValue <= num ? useValue : num;
                    PropProxy.send_BACKPACK_USE_ITEM(this.m_ComItem.itemId, useValue);
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.BAG_USE_FAL), 1, true);
                }
            }
        };
        /**物品来源 */
        BagView.prototype.onBtnSourceHandler = function () {
            if (this.m_ComItem.itemId > 0) {
                Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_ComItem.itemId);
            }
        };
        BagView.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.POPUP, BagView.NAME);
            return obj;
        };
        BagView.NAME = 'BagView';
        return BagView;
    }(com_main.CView));
    com_main.BagView = BagView;
})(com_main || (com_main = {}));
