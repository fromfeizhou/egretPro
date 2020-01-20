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
    /**回收筛选 */
    var EquipRecycle = /** @class */ (function (_super_1) {
        __extends(EquipRecycle, _super_1);
        function EquipRecycle() {
            var _this = _super_1.call(this) || this;
            _this.RecycleList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
            _this.name = EquipRecycle.NAME;
            _this.initApp("equip/EquipRecycleSkin.exml");
            _this.isSur = false;
            return _this;
        }
        EquipRecycle.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventMgr.dispatchEvent(EquipEvent.EQUIP_DECOMPOSE_ALL_TICK, { isSur: this.isSur, allState: this.allState });
        };
        EquipRecycle.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_APopUp.setTitleLabel(GCode(CLEnum.RECOVER));
            this.m_btnConfirm.setTitleLabel(GCode(CLEnum.SURE));
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_ItemList.dataProvider = this.m_pCollection;
            this.m_ItemList.itemRenderer = EquipRecycleRender;
            this.m_ItemList.useVirtualLayout = true;
            this.m_ItemList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickEquip, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnConfirm, this, this.onConfirmClick);
            com_main.EventManager.addTouchTapListener(this.m_TickRooot, this, this.onTickClick);
            this.setRecycle();
        };
        /**设置回收档次 */
        EquipRecycle.prototype.setRecycle = function () {
            var res = [];
            for (var i = 0; i < this.RecycleList.length; i++) {
                var lv = this.RecycleList[i];
                var vo = { level: lv, mulstate: lv <= 50 };
                res.push(vo);
                if (vo.mulstate) {
                    EquipModel.lvList.push(lv);
                }
            }
            this.m_pCollection.replaceAll(res);
        };
        EquipRecycle.prototype.onTickClick = function () {
            var state = !this.allState;
            this.m_imgTick.visible = state;
            this.allState = state;
            this.allTick(state);
        };
        /**设置全选按钮状态*/
        EquipRecycle.prototype.setalltickState = function (state) {
            this.m_imgTick.visible = state;
        };
        /**全选 */
        EquipRecycle.prototype.allTick = function (state) {
            EquipModel.lvList = [];
            var res = [];
            for (var i = 0; i < this.m_pCollection.source.length; i++) {
                var data = this.m_pCollection.getItemAt(i);
                if (data) {
                    res.push({ level: data.level, mulstate: state });
                }
                if (state) {
                    EquipModel.lvList.push(data.level);
                }
            }
            this.m_pCollection.replaceAll(res);
            com_main.EventMgr.dispatchEvent(EquipEvent.EQUIP_DECOMPOSE_ALL_TICK, { isSur: true, allState: this.allState });
        };
        //确定
        EquipRecycle.prototype.onConfirmClick = function () {
            this.isSur = true;
            com_main.UpManager.history();
        };
        EquipRecycle.prototype.onClickEquip = function (e) {
            this.setMultiIndex(e.itemIndex);
        };
        /**
    * 设置当前选中
    * @param isConst 强制刷新
    *  */
        EquipRecycle.prototype.setMultiIndex = function (index) {
            var data = this.m_pCollection.getItemAt(index);
            data.mulstate = !data.mulstate;
            this.m_pCollection.replaceItemAt(data, index);
            if (data.mulstate) {
                if (EquipModel.lvList.indexOf(data.level) == -1) {
                    EquipModel.lvList.push(data.level);
                }
            }
            else {
                var index_1 = EquipModel.lvList.indexOf(data.level);
                EquipModel.lvList.splice(index_1, 1);
            }
            var res = [];
            for (var i = 0; i < this.m_pCollection.source.length; i++) {
                if (this.m_pCollection.source.length == EquipModel.lvList.length) {
                    this.allState = true;
                }
                else {
                    this.allState = false;
                }
            }
            this.setalltickState(this.allState);
            com_main.EventMgr.dispatchEvent(EquipEvent.EQUIP_DECOMPOSE_ONE_TICK, this);
        };
        EquipRecycle.NAME = "EquipRecycle";
        return EquipRecycle;
    }(com_main.CView));
    com_main.EquipRecycle = EquipRecycle;
    var EquipRecycleRender = /** @class */ (function (_super_1) {
        __extends(EquipRecycleRender, _super_1);
        function EquipRecycleRender() {
            return _super_1.call(this) || this;
        }
        EquipRecycleRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        EquipRecycleRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_RecycleCell = new com_main.EquipRecycleCell();
            this.addChild(this.m_RecycleCell);
        };
        EquipRecycleRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_RecycleCell.setRecycleInfo(this.m_tData.level, this.m_tData.mulstate);
        };
        return EquipRecycleRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
