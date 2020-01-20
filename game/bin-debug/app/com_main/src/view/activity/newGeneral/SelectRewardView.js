// TypeScript file
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
    var SelectRewardView = /** @class */ (function (_super_1) {
        __extends(SelectRewardView, _super_1);
        function SelectRewardView() {
            var _this = _super_1.call(this) || this;
            _this.name = SelectRewardView.NAME;
            _this.initApp("activity/newGeneral/SelectRewardSkin.exml");
            return _this;
        }
        SelectRewardView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_vo = ActivityModel.getActivityVo(AcViewType.NEW_GEN_VIS);
            this.m_selectList = [];
            this.refreshView();
            this.initEvent();
        };
        SelectRewardView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        SelectRewardView.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnSure, this, this.onClickSure);
            com_main.EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this.closeView, this);
            for (var _i = 0, _a = this.m_showList.$children; _i < _a.length; _i++) {
                var item = _a[_i];
                com_main.EventManager.addTouchTapListener(item, this, this.oncliclItem);
            }
        };
        SelectRewardView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this);
            com_main.EventManager.removeEventListeners(this);
        };
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
        SelectRewardView.prototype.isSelect = function (id) {
            var list = this.m_vo.getChooseList();
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var info = list_1[_i];
                if (info.itemId == id) {
                    return true;
                }
            }
            return false;
        };
        SelectRewardView.prototype.refreshView = function () {
            this.m_apopUp.setTitleLabel('选择奖励');
            this.m_btnSure.setTitleLabel('确定');
            this.m_showList.removeChildren();
            var cfg = this.m_vo.getNewGenRewordCfg();
            for (var _i = 0, _a = cfg.optionalReward; _i < _a.length; _i++) {
                var item = _a[_i];
                var itemView = new com_main.SelectRewardItem(item, this.isSelect(item.itemId));
                this.m_showList.addChild(itemView);
            }
            //固定物品
            for (var _b = 0, _c = cfg.requiredRward; _b < _c.length; _b++) {
                var itemInfo = _c[_b];
                this.m_staticItem.setItemInfo(itemInfo.itemId, itemInfo.count);
            }
            this.m_selectItemList.removeChildren();
            //之前选择
            var list = this.m_vo.getChooseList();
            for (var _d = 0, list_2 = list; _d < list_2.length; _d++) {
                var itemInfo = list_2[_d];
                this.addItem(itemInfo);
            }
        };
        SelectRewardView.prototype.oncliclItem = function (e) {
            var target = e.target;
            var i = 0;
            while (isNull(target.getRewardItemInfo) && i < 10) {
                target = target.parent;
                i++;
            }
            var itemInfo = target.getRewardItemInfo();
            var itemId = itemInfo.itemId;
            if (this.m_selectList.indexOf(itemId) != -1) {
                target.setSel(false);
                this.removeItemById(itemId);
            }
            else {
                if (this.m_selectList.length >= 4)
                    return;
                target.setSel(true);
                this.addItem(itemInfo);
            }
        };
        SelectRewardView.prototype.removeShowItem = function (itemId) {
            for (var _i = 0, _a = this.m_selectItemList.$children; _i < _a.length; _i++) {
                var i = _a[_i];
                var item = i;
                if (itemId == item.itemId) {
                    Utils.removeFromParent(item);
                }
            }
        };
        SelectRewardView.prototype.addItem = function (item) {
            var itemId = item.itemId;
            this.m_selectList.push(itemId);
            var cell = com_main.ComItemNew.create('count', true);
            cell.setItemInfo(item.itemId, item.count);
            this.m_selectItemList.addChild(cell);
            this.refreshNumLb();
        };
        SelectRewardView.prototype.removeItemById = function (itemId) {
            var i = this.m_selectList.indexOf(itemId);
            this.m_selectList.splice(i, 1);
            this.removeShowItem(itemId);
            this.refreshNumLb();
        };
        SelectRewardView.prototype.refreshNumLb = function () {
            this.m_lbSelectNum.text = '已选择奖励' + this.m_selectList.length + '/4';
        };
        SelectRewardView.prototype.onClickSure = function () {
            if (this.m_selectList.length != 4) {
                EffectUtils.showTips('请选择4个物品', 1, true);
            }
            else {
                ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD(this.m_vo.id, this.m_selectList);
            }
        };
        SelectRewardView.prototype.closeView = function () {
            com_main.UpManager.history();
        };
        SelectRewardView.NAME = "SelectRewardView";
        return SelectRewardView;
    }(com_main.CView));
    com_main.SelectRewardView = SelectRewardView;
})(com_main || (com_main = {}));
