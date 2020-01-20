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
var UIOrganizeHelperType;
(function (UIOrganizeHelperType) {
    UIOrganizeHelperType[UIOrganizeHelperType["ORDER"] = 0] = "ORDER";
    UIOrganizeHelperType[UIOrganizeHelperType["FILTER"] = 1] = "FILTER";
})(UIOrganizeHelperType || (UIOrganizeHelperType = {}));
var com_main;
(function (com_main) {
    var UIOrganizeHelper = /** @class */ (function (_super_1) {
        __extends(UIOrganizeHelper, _super_1);
        function UIOrganizeHelper() {
            var _this = _super_1.call(this) || this;
            _this.m_pGroupY = 0;
            _this.m_pSort = {};
            _this.m_pFilter = {};
            _this.m_pListener = null;
            _this.m_pIsOpen = false;
            _this.m_pIsShowTag = false;
            _this.m_pIsStageClick = false;
            _this.parentNode = null;
            _this.m_iColorIndex = 0;
            _this.m_pMask = null;
            _this.UIOrganizeColor = [
                0XF7B557,
                0XFFEB49,
                0X0FFDE3,
                0X45FD79,
                0XFFBB49,
                0X15FFF3,
                0XE1FF49,
                0XFE8954,
                0X57D5FF,
            ];
            //this.skinName = "resource/eui_skins/UIOrganizeSkin.exml";
            _this.initCom("UIOrganizeSkin.exml");
            return _this;
        }
        UIOrganizeHelper.prototype.onDestroy = function () {
            var num = this.grpSortList.numChildren - 1;
            var tag;
            for (var i = num; i > -1; i--) {
                tag = this.grpSortList.getChildAt(i);
                tag.$onRemoveFromStage();
                tag = null;
            }
            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                tag = this.grpSearchList.getChildAt(i);
                tag.$onRemoveFromStage();
                tag = null;
            }
            this.m_pSort = null;
            this.m_pFilter = null;
            this.m_pObj = null;
            this.m_pListener = null;
            // this.btnReset.removeFromParent();
            // this.btnSearch.removeFromParent();//button 未改 lung17 mark 
            //lung17
            if (this.btnReset) {
                this.btnReset.removeChild(this);
            }
            if (this.btnSearch) {
                this.btnSearch.removeChild(this);
            }
            if (this.m_pMask && this.m_pMask.parent) {
                this.m_pMask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickListener, this);
                this.m_pMask.parent.removeChild(this.m_pMask);
            }
            this.m_pMask = null;
            _super_1.prototype.onDestroy.call(this);
            if (this.parent)
                this.parent.removeChild(this);
            this.removeChildren();
            this.parentNode = null;
            this.m_pSort = null;
            this.m_pFilter = null;
            this.m_pListener = null;
            this.m_pObj = null;
            if (this.parent) {
                this.parent.removeChild(this);
            }
            else {
                this.$onRemoveFromStage();
            }
        };
        UIOrganizeHelper.prototype.onCreate = function () {
            // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onThisClick, this);
            // this.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickReset, this);
            // this.btnSearch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickRearch, this);
            _super_1.prototype.onCreate.call(this);
            com_main.EventManager.addTouchTapListener(this, this, this.onThisClick);
            // this.btnReset.setText(this.lan[202001]);
            // this.btnSearch.setText(this.lan[202002]);
            com_main.EventManager.addTouchTapListener(this.btnReset, this, this.clickReset);
            com_main.EventManager.addTouchTapListener(this.btnSearch, this, this.clickRearch);
        };
        //lung17  todo
        // protected mediator(): puremvc.IMediator {
        //     return new BaseMediator(this, "UIOrganizeHelper" + this.hashCode);
        // }
        // public regNotification(): Array<any> {
        //     return [GameCommand.STAGE_CLICK];
        // }
        UIOrganizeHelper.prototype.refreshPanel = function (body) {
            var event = body;
            var width = this.width;
            var height = this.height;
            // debug("UIOrganizeHelper refreshPanel", event);
            // if (this.parentNode) {
            //     debug("this.parentNode");
            //     if (this.parentNode == UpManager.CurrentPanel) {
            //         debug("UpManager.CurrentPanel")
            //     } else {
            //         debug("this.parentNode is", this.parentNode);
            //     }
            // } else {
            //     debug("not this.parentNode");
            // }
            var point = (this.parentNode ? this.parentNode : com_main.UpManager.CurrentPanel).localToGlobal(this.x, this.y);
            // var point: egret.Point = (this.parentNode ).localToGlobal(this.x, this.y);
            var rect = new egret.Rectangle(point.x, point.y, this.width, this.height);
            if (!rect.contains(event.stageX, event.stageY) && this.visible) {
                if (this.m_pIsShowTag) {
                    this.onThisClick();
                }
                else {
                    this.hidden();
                }
            }
            egret.Rectangle.release(rect);
        };
        UIOrganizeHelper.prototype.clickReset = function (e) {
            this.reset();
        };
        UIOrganizeHelper.prototype.reset = function () {
            var selectTag;
            var key;
            for (var i = 0; i < this.grpSortList.numChildren; i++) {
                selectTag = this.grpSortList.getChildAt(i);
                selectTag.selectIndex = 0;
                key = selectTag.name.replace("order_", "");
                this.m_pSort[key] = selectTag.selectData.value;
            }
            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                selectTag = this.grpSearchList.getChildAt(i);
                selectTag.selectIndex = 0;
                key = selectTag.name.replace("filter_", "");
                this.m_pFilter[key] = selectTag.selectData.value;
            }
        };
        UIOrganizeHelper.prototype.clickRearch = function (e) {
            this.hidden();
        };
        Object.defineProperty(UIOrganizeHelper.prototype, "Sort", {
            get: function () {
                return this.m_pSort;
            },
            enumerable: true,
            configurable: true
        });
        UIOrganizeHelper.prototype.setSort = function (sort) {
            this.m_pSort = sort;
        };
        Object.defineProperty(UIOrganizeHelper.prototype, "Filter", {
            get: function () {
                return this.m_pFilter;
            },
            enumerable: true,
            configurable: true
        });
        UIOrganizeHelper.prototype.setFilter = function (filter) {
            this.m_pFilter = filter;
        };
        UIOrganizeHelper.prototype.getCurrentFilter = function () {
            var order = [];
            var filter = [];
            for (var key in this.m_pSort) {
                order.push(this.m_pSort[key]);
            }
            for (var key in this.m_pFilter) {
                filter.push(this.m_pFilter[key]);
            }
            return { order: order, filter: filter };
        };
        UIOrganizeHelper.prototype.getCurrentFilterIndex = function () {
            var order = {};
            var filter = {};
            var key;
            var selectTag;
            for (var i = 0; i < this.grpSortList.numChildren; i++) {
                selectTag = this.grpSortList.getChildAt(i);
                key = selectTag.name.replace("order_", "");
                order[key] = selectTag.selectIndex;
            }
            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                selectTag = this.grpSearchList.getChildAt(i);
                key = selectTag.name.replace("filter_", "");
                filter[key] = selectTag.selectIndex;
            }
            return { order: order, filter: filter };
        };
        UIOrganizeHelper.prototype.setDateIndex = function (data) {
            var order_list = data.order;
            var filter_list = data.filter;
            for (var key in filter_list) {
                var index = filter_list[key];
                this.setSelectIndex(UIOrganizeHelperType.FILTER, key, index);
            }
            for (var key in order_list) {
                var index = order_list[key];
                this.setSelectIndex(UIOrganizeHelperType.ORDER, key, index);
            }
        };
        UIOrganizeHelper.prototype.getCurrentFilterData = function () {
            var order = {};
            var filter = {};
            var key;
            var selectTag;
            for (var i = 0; i < this.grpSortList.numChildren; i++) {
                selectTag = this.grpSortList.getChildAt(i);
                key = selectTag.name.replace("order_", "");
                order[key] = this.copyDict(selectTag.selectData); //Utils.copyDict(selectTag.selectData);
            }
            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                selectTag = this.grpSearchList.getChildAt(i);
                key = selectTag.name.replace("filter_", "");
                filter[key] = this.copyDict(selectTag.selectData); //tils.copyDict(selectTag.selectData);
            }
            return { order: order, filter: filter };
        };
        UIOrganizeHelper.prototype.setSelectIndex = function (type, key, index) {
            var group;
            var name;
            if (type == UIOrganizeHelperType.ORDER) {
                group = this.grpSortList;
                name = "order_" + key;
            }
            else {
                group = this.grpSearchList;
                name = "filter_" + key;
            }
            debug("group", group, key, index);
            var selectTag = group.getChildByName(name);
            selectTag.selectIndex = index;
        };
        UIOrganizeHelper.prototype.getSelectTagColor = function () {
            var color = this.UIOrganizeColor[this.m_iColorIndex];
            this.m_iColorIndex++;
            if (this.m_iColorIndex == this.UIOrganizeColor.length) {
                this.m_iColorIndex = 0;
            }
            return color;
        };
        UIOrganizeHelper.prototype.setOrderData = function (orderDatas) {
            var key;
            var orderData;
            var default_index = 0;
            var orderNumLine = Math.ceil(orderDatas.length / 3);
            for (var i = 0; i < orderDatas.length; i++) {
                orderData = orderDatas[i];
                //创建combobox 和设置数据
                var orderChild = new com_main.CComboBox(true);
                orderChild.name = 'order_' + orderData.key;
                orderChild.dataSource = orderData.data;
                orderChild.selectIndex = orderData.index;
                orderChild.addClickListener(this, this.onTagClick);
                orderChild.addSelectListener(this, this.onTagSelect);
                orderChild.topTextColor = this.getSelectTagColor();
                this.grpSortList.addChild(orderChild);
                //根据数量排列位置
                var row = Math.floor(i / UIOrganizeHelper.NUM_LINE_SHOW);
                var col = i - row * UIOrganizeHelper.NUM_LINE_SHOW;
                orderChild.x = col * (UIOrganizeHelper.GAP + UIOrganizeHelper.SELECTTAG_WIDTH);
                orderChild.y = row * (UIOrganizeHelper.GAP + UIOrganizeHelper.SELECTTAG_HEIGHT);
                if (orderData.key)
                    this.m_pSort[orderData.key] = orderChild.selectData.value;
            }
            this.grpSearchList.height = UIOrganizeHelper.CONTENT_GROUP_LINE_SIZE * orderNumLine;
        };
        UIOrganizeHelper.prototype.setFilterData = function (filterDatas) {
            var key;
            var filterData;
            var default_index = 0;
            var filterNumLine = Math.ceil(filterDatas.length / UIOrganizeHelper.NUM_LINE_SHOW);
            for (var i = 0; i < filterDatas.length; i++) {
                filterData = filterDatas[i];
                var filterChild = new com_main.CComboBox(true);
                filterChild.name = 'filter_' + filterData.key;
                filterChild.dataSource = filterData.data;
                filterChild.selectIndex = filterData.index;
                filterChild.addClickListener(this, this.onTagClick);
                filterChild.addSelectListener(this, this.onTagSelect);
                filterChild.topTextColor = this.getSelectTagColor();
                this.grpSearchList.addChild(filterChild);
                var row = Math.floor(i / UIOrganizeHelper.NUM_LINE_SHOW);
                var col = i - row * UIOrganizeHelper.NUM_LINE_SHOW;
                filterChild.x = col * (UIOrganizeHelper.GAP + UIOrganizeHelper.SELECTTAG_WIDTH);
                filterChild.y = row * (UIOrganizeHelper.GAP + UIOrganizeHelper.SELECTTAG_HEIGHT);
                if (filterData.key)
                    this.m_pFilter[filterData.key] = filterChild.selectData.value;
            }
            this.grpSearchList.height = UIOrganizeHelper.CONTENT_GROUP_LINE_SIZE * filterNumLine;
        };
        UIOrganizeHelper.prototype.onTagClick = function (tag) {
            var parent = tag.parent;
            if (parent.numChildren > UIOrganizeHelper.NUM_LINE_SHOW)
                parent.setChildIndex(tag, 9999);
            this.hideAllSelectTags(tag.name);
            this.m_pIsShowTag = true;
            // tag.setSelectByIndex(tag.selectIndex);//lung17 add
            // this.showGuideWithType(GuideUI.UIOrganizeHelper);
        };
        UIOrganizeHelper.prototype.onTagSelect = function (tag) {
            if (tag.name.indexOf("filter_") > -1) {
                var key = tag.name.replace("filter_", "");
                this.m_pFilter[key] = tag.selectData.value;
            }
            else {
                var key = tag.name.replace("order_", "");
                this.m_pSort[key] = tag.selectData.value;
            }
            this.m_pIsShowTag = false;
            // this.showGuideWithType(GuideUI.UIOrganizeHelper);
        };
        UIOrganizeHelper.prototype.hideAllSelectTags = function (name) {
            if (name === void 0) { name = ""; }
            for (var i = 0; i < this.grpSortList.numChildren; i++) {
                var selectTag = this.grpSortList.getChildAt(i);
                if (selectTag.name != name)
                    selectTag.isShowContent = false;
            }
            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                var selectTag = this.grpSearchList.getChildAt(i);
                if (selectTag.name != name)
                    selectTag.isShowContent = false;
            }
        };
        UIOrganizeHelper.prototype.NoOrderChildPos = function () {
            this.grpSearchText.y = this.grpSortText.y;
            this.grpSortText.visible = false;
            this.grpSortList.visible = false;
            this.grpSearchList.y = this.grpSortList.y;
        };
        UIOrganizeHelper.prototype.NoFilterChildPos = function () {
            this.grpSearchText.visible = false;
            this.grpSearchList.visible = false;
            this.imgSplit.visible = false;
            this.grpButtons.visible = false;
        };
        UIOrganizeHelper.prototype.layout = function () {
            var layout = new eui.HorizontalLayout();
            layout.horizontalAlign = "center";
            layout.verticalAlign = "middle";
            layout.gap = 30;
            return layout;
        };
        UIOrganizeHelper.prototype.onChange = function () {
            var height = UIOrganizeHelper.PER_GROUP_HEIGHT;
            if (this.grpSortText.visible) {
                height += this.grpSortText.height + this.grpSortList.height;
                if (this.grpSortList.numChildren < 3)
                    this.grpSortList.layout = this.layout();
            }
            if (this.grpSearchText.visible) {
                height += this.grpSearchText.height + this.grpSearchList.height;
                if (this.grpSearchList.numChildren < 3)
                    this.grpSearchList.layout = this.layout();
            }
            if (this.grpButtons.visible) {
                height += this.grpButtons.height + UIOrganizeHelper.PER_GROUP_HEIGHT;
            }
            else {
                height += UIOrganizeHelper.PER_GROUP_HEIGHT;
            }
            this.height = height + 10;
            if (this.grpSortList.visible) {
                this.setChildIndex(this.grpSortList, this.numChildren);
            }
        };
        UIOrganizeHelper.prototype.addSureFilterListener = function (obj, func) {
            this.m_pObj = obj;
            this.m_pListener = func;
        };
        UIOrganizeHelper.prototype.setDatas = function (datas) {
            var orderDatas = datas.order;
            var filterDatas = datas.filter;
            if (orderDatas && orderDatas.length > 0) {
                this.setOrderData(orderDatas);
            }
            else {
                this.NoOrderChildPos();
            }
            if (filterDatas && filterDatas.length > 0) {
                this.setFilterData(filterDatas);
            }
            else {
                this.NoFilterChildPos();
            }
            this.onChange();
        };
        UIOrganizeHelper.prototype.refreshDatas = function (datas) {
            var orderDatas = datas.order;
            var filterDatas = datas.filter;
            var key;
            var filterChild;
            for (var i = 0; i < this.grpSortList.numChildren; i++) {
                filterChild = this.grpSortList.getChildAt(i);
                var filterData = orderDatas[i];
                filterChild.dataSource = filterData.data;
                filterChild.selectIndex = filterData.index;
            }
            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                filterChild = this.grpSearchList.getChildAt(i);
                var orderData = filterDatas[i];
                filterChild.dataSource = orderData.data;
                filterChild.selectIndex = orderData.index;
            }
        };
        UIOrganizeHelper.prototype.onThisClick = function () {
            if (this.m_pIsShowTag) {
                this.hideAllSelectTags();
                this.m_pIsShowTag = false;
            }
        };
        UIOrganizeHelper.prototype.hidden = function () {
            this.onThisClick();
            if (this.m_pListener) {
                this.m_pListener.call(this.m_pObj);
            }
            this.visible = false;
            if (this.m_pMask != null)
                this.m_pMask.visible = false;
        };
        //在点击的地方创建一个面板
        UIOrganizeHelper.prototype.OpenView = function (com, gap, up) {
            if (gap === void 0) { gap = 0; }
            if (up === void 0) { up = true; }
            if (!this.m_pIsOpen) {
                var point = com.localToGlobal(0, 0);
                if (up) {
                    this.x = point.x;
                    this.y = point.y - this.height - 20 - gap;
                }
                else {
                    this.x = point.x - (this.width - com.width);
                    this.y = point.y + com.height + gap;
                }
                //lung17
                // this.m_pMask = new eui.Rect(ApplicationMediator.app().stageWidth, ApplicationMediator.app().stageHeight, 0x000000);
                // this.m_pMask.alpha = 0.5;
                // this.m_pMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickListener, this);
                // ApplicationMediator.app().topLevel.addChild(this.m_pMask);
                // ApplicationMediator.app().topLevel.addChild(this);
            }
            else {
                this.m_pMask.visible = true;
                // UpManager.showMaskByName("UIOrganizeHelper",true);
            }
            this.m_pIsOpen = true;
            this.visible = true;
            // this.showGuideWithType(GuideUI.UIOrganizeHelper);
        };
        UIOrganizeHelper.prototype.clickListener = function (e) {
            this.hidden();
        };
        UIOrganizeHelper.prototype.addPopUpLayer = function () {
            //lung17 todo
            // var layer = ApplicationMediator.app().popUpLevel;
            // layer.addChild(this);
            //this.parentNode = layer;
        };
        UIOrganizeHelper.prototype.getGuideNode = function (guideConfig) {
            var key = null;
            var isSort = false;
            var targetIndex = 0;
            // if ( TaskGuidanceUtil.IsInTask(TaskId.StaffUpgrade1) || 
            //         TaskGuidanceUtil.IsInTask(TaskId.StaffUpgrade2)) {
            //     key = "position";
            //     targetIndex = 4;
            // } else if (TaskGuidanceUtil.IsInTask(TaskId.ShopManagerUpgrade)) {
            //     key = "position";
            //     targetIndex = 2;
            // }
            if (!key) {
                return null;
            }
            var arr = isSort ? this.Sort : this.Filter;
            if (arr[key] == targetIndex) {
                return this.btnSearch;
            }
            var group = isSort ? this.grpSortList : this.grpSearchList;
            var name = "filter_" + key;
            var selectTag = group.getChildByName(name);
            if (selectTag.isShowContent) {
                return selectTag.getElementAt(targetIndex);
            }
            else {
                return selectTag;
            }
        };
        //lung17------------
        UIOrganizeHelper.prototype.copyDict = function (dict, isDeepCopy) {
            if (!dict) {
                return dict;
            }
            var newDict = (dict instanceof Array) ? [] : {};
            for (var i in dict) {
                if (typeof dict[i] == "function") {
                    continue;
                }
                // newDict[i] = dict[i];
                if (isDeepCopy) {
                    newDict[i] = (typeof dict[i] == "object") ? this.copyDict(dict[i]) : dict[i]; //Utils.copyDict(dict[i]) : dict[i];
                }
                else {
                    newDict[i] = dict[i];
                }
            }
            return newDict;
        };
        UIOrganizeHelper.BUTTON_GROUP_SIZE = 117;
        UIOrganizeHelper.TEXT_GROUP_SIZE = 49;
        UIOrganizeHelper.CONTENT_GROUP_LINE_SIZE = 75;
        UIOrganizeHelper.PER_GROUP_HEIGHT = 11;
        UIOrganizeHelper.GAP = 18;
        UIOrganizeHelper.NUM_LINE_SHOW = 3;
        UIOrganizeHelper.SELECTTAG_HEIGHT = 62;
        UIOrganizeHelper.SELECTTAG_WIDTH = 163;
        return UIOrganizeHelper;
    }(com_main.CView));
    com_main.UIOrganizeHelper = UIOrganizeHelper;
})(com_main || (com_main = {}));
