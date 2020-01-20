


enum UIOrganizeHelperType {
    ORDER = 0, //排序
    FILTER = 1,//过滤
}

module com_main {

    export class UIOrganizeHelper extends CView{//BasePanel {BasePanel {
        private static BUTTON_GROUP_SIZE: number = 117;
        private static TEXT_GROUP_SIZE: number = 49;
        private static CONTENT_GROUP_LINE_SIZE: number = 75;
        private static PER_GROUP_HEIGHT: number = 11;
        private static GAP: number = 18;
        private static NUM_LINE_SHOW: number = 3;
        private static SELECTTAG_HEIGHT: number = 62;
        private static SELECTTAG_WIDTH: number = 163;

        private grpSortText: eui.Group;
        private grpSortList: eui.Group;
        private grpSearchText: eui.Group;
        private grpSearchList: eui.Group;
        private imgSplit: eui.Image;
        private grpButtons: eui.Group;
        private btnReset: eui.Button;//ComButton;  //lung17  button控件未加入
        private btnSearch: eui.Button;//ComButton;

        private m_pGroupY: number = 0;
        private m_pSort: any = {};
        private m_pFilter: any = {};
        private m_pListener: Function = null;
        private m_pObj: any;
        private m_pIsOpen: boolean = false;
        private m_pIsShowTag: boolean = false;
        private m_pIsStageClick: boolean = false;
        private parentNode: any = null;

        private m_iColorIndex: number = 0;

        private m_pMask: eui.Rect = null;

        private UIOrganizeColor = [
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

        public constructor() {
            super();
            //this.skinName = "resource/eui_skins/UIOrganizeSkin.exml";
            this.initCom("UIOrganizeSkin.exml");
        }

        public onDestroy(): void {
            var num = this.grpSortList.numChildren - 1;
            var tag: com_main.CComboBox;
            for (var i = num; i > -1; i--) {
                tag = <com_main.CComboBox>this.grpSortList.getChildAt(i);
                tag.$onRemoveFromStage();
                tag = null;
            }

            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                tag = <com_main.CComboBox>this.grpSearchList.getChildAt(i);
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
            super.onDestroy();
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
            } else {
                this.$onRemoveFromStage();
            }
        }


        public onCreate(): void {

            
            // this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onThisClick, this);
            // this.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickReset, this);
            // this.btnSearch.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickRearch, this);
            super.onCreate();
            EventManager.addTouchTapListener(this, this, this.onThisClick);

            // this.btnReset.setText(this.lan[202001]);
            // this.btnSearch.setText(this.lan[202002]);

            EventManager.addTouchTapListener(this.btnReset, this, this.clickReset);
            EventManager.addTouchTapListener(this.btnSearch, this, this.clickRearch);

        }
        //lung17  todo
        // protected mediator(): puremvc.IMediator {
        //     return new BaseMediator(this, "UIOrganizeHelper" + this.hashCode);
        // }

        // public regNotification(): Array<any> {
        //     return [GameCommand.STAGE_CLICK];
        // }

        public refreshPanel(body) {
            var event: egret.TouchEvent = body;
            var width: number = this.width;
            var height: number = this.height;
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


            var point: egret.Point = (this.parentNode ? this.parentNode : UpManager.CurrentPanel).localToGlobal(this.x, this.y);
            // var point: egret.Point = (this.parentNode ).localToGlobal(this.x, this.y);
            var rect: egret.Rectangle = new egret.Rectangle(point.x, point.y, this.width, this.height);

            if (!rect.contains(event.stageX, event.stageY) && this.visible) {
                if (this.m_pIsShowTag) {
                    this.onThisClick();
                } else {
                    this.hidden();
                }
            }
            egret.Rectangle.release(rect);
        }

        public clickReset(e: egret.Event): void {
            this.reset();
        }

        private reset() {
            var selectTag: com_main.CComboBox;
            var key: string;

            for (var i = 0; i < this.grpSortList.numChildren; i++) {
                selectTag = <com_main.CComboBox>this.grpSortList.getChildAt(i);
                selectTag.selectIndex = 0;
                key = selectTag.name.replace("order_", "");
                this.m_pSort[key] = selectTag.selectData.value;
            }

            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                selectTag = <com_main.CComboBox>this.grpSearchList.getChildAt(i);
                selectTag.selectIndex = 0;
                key = selectTag.name.replace("filter_", "");
                this.m_pFilter[key] = selectTag.selectData.value;
            }
        }

        public clickRearch(e: egret.Event): void {
            this.hidden();
        }

        public get Sort(): any {
            return this.m_pSort;
        }

        public setSort(sort): any {
            this.m_pSort = sort;
        }

        public get Filter(): any {
            return this.m_pFilter;
        }

        public setFilter(filter): any {
            this.m_pFilter = filter;
        }

        public getCurrentFilter(): any {
            var order: any[] = [];
            var filter: any[] = [];

            for (var key in this.m_pSort) {
                order.push(this.m_pSort[key]);
            }

            for (var key in this.m_pFilter) {
                filter.push(this.m_pFilter[key]);
            }

            return { order: order, filter: filter };
        }

        public getCurrentFilterIndex(): any {
            var order = {};
            var filter = {};
            var key: string;
            var selectTag: com_main.CComboBox;
            for (var i = 0; i < this.grpSortList.numChildren; i++) {
                selectTag = <com_main.CComboBox>this.grpSortList.getChildAt(i);
                key = selectTag.name.replace("order_", "");
                order[key] = selectTag.selectIndex;
            }

            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                selectTag = <com_main.CComboBox>this.grpSearchList.getChildAt(i);
                key = selectTag.name.replace("filter_", "");
                filter[key] = selectTag.selectIndex;
            }
            return { order: order, filter: filter };
        }

        public setDateIndex(data){
            var  order_list = data.order;
            var  filter_list = data.filter;
            for (var key in filter_list){
                var index = filter_list[key];
                this.setSelectIndex(UIOrganizeHelperType.FILTER ,key,index);
            }

            for (var key in order_list){
                var index = order_list[key];
                this.setSelectIndex(UIOrganizeHelperType.ORDER ,key,index);
            }
        }

        public getCurrentFilterData(): any {
            var order = {};
            var filter = {};
            var key: string;
            var selectTag: com_main.CComboBox;
            for (var i = 0; i < this.grpSortList.numChildren; i++) {
                selectTag = <com_main.CComboBox>this.grpSortList.getChildAt(i);
                key = selectTag.name.replace("order_", "");
                order[key] = this.copyDict(selectTag.selectData);//Utils.copyDict(selectTag.selectData);
            }

            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                selectTag = <com_main.CComboBox>this.grpSearchList.getChildAt(i);
                key = selectTag.name.replace("filter_", "");
                filter[key] = this.copyDict(selectTag.selectData);//tils.copyDict(selectTag.selectData);
            }
            return { order: order, filter: filter };
        }

        public setSelectIndex(type: UIOrganizeHelperType, key, index) {
            var group: eui.Group;
            var name: string;
            if (type == UIOrganizeHelperType.ORDER) {
                group = this.grpSortList;
                name = "order_" + key;
            } else {
                group = this.grpSearchList;
                name = "filter_" + key;
            }

            debug("group", group, key, index);
            var selectTag = <com_main.CComboBox>group.getChildByName(name);
            selectTag.selectIndex = index;
        }

        private getSelectTagColor() {
            var color = this.UIOrganizeColor[this.m_iColorIndex];
            this.m_iColorIndex++;
            if (this.m_iColorIndex == this.UIOrganizeColor.length) {
                this.m_iColorIndex = 0;
            }
            return color;
        }

        private setOrderData(orderDatas: any[]): void {
            var key: string;
            var orderData: any;
            var default_index: number = 0;
            var orderNumLine: number = Math.ceil(orderDatas.length / 3);

            for (var i = 0; i < orderDatas.length; i++) {
                orderData = orderDatas[i];
                //创建combobox 和设置数据
                var orderChild: com_main.CComboBox = new com_main.CComboBox(true);
                orderChild.name = 'order_' + orderData.key;
                orderChild.dataSource = orderData.data;
                orderChild.selectIndex = orderData.index;
                orderChild.addClickListener(this, this.onTagClick);
                orderChild.addSelectListener(this, this.onTagSelect);
                orderChild.topTextColor = this.getSelectTagColor();

                this.grpSortList.addChild(orderChild);

                //根据数量排列位置
                var row: number = Math.floor(i / UIOrganizeHelper.NUM_LINE_SHOW);
                var col: number = i - row * UIOrganizeHelper.NUM_LINE_SHOW;

                orderChild.x = col * (UIOrganizeHelper.GAP + UIOrganizeHelper.SELECTTAG_WIDTH);
                orderChild.y = row * (UIOrganizeHelper.GAP + UIOrganizeHelper.SELECTTAG_HEIGHT);
                if (orderData.key) this.m_pSort[orderData.key] = orderChild.selectData.value;
            }

            this.grpSearchList.height = UIOrganizeHelper.CONTENT_GROUP_LINE_SIZE * orderNumLine;
        }

        private setFilterData(filterDatas: any[]): void {
            var key: string;
            var filterData: any;
            var default_index: number = 0;
            var filterNumLine: number = Math.ceil(filterDatas.length / UIOrganizeHelper.NUM_LINE_SHOW);

            for (var i = 0; i < filterDatas.length; i++) {
                filterData = filterDatas[i];
                var filterChild: com_main.CComboBox = new com_main.CComboBox(true);
                filterChild.name = 'filter_' + filterData.key;
                filterChild.dataSource = filterData.data;
                filterChild.selectIndex = filterData.index;
                filterChild.addClickListener(this, this.onTagClick);
                filterChild.addSelectListener(this, this.onTagSelect);
                filterChild.topTextColor = this.getSelectTagColor();
                this.grpSearchList.addChild(filterChild);
                var row: number = Math.floor(i / UIOrganizeHelper.NUM_LINE_SHOW);
                var col: number = i - row * UIOrganizeHelper.NUM_LINE_SHOW;

                filterChild.x = col * (UIOrganizeHelper.GAP + UIOrganizeHelper.SELECTTAG_WIDTH);
                filterChild.y = row * (UIOrganizeHelper.GAP + UIOrganizeHelper.SELECTTAG_HEIGHT);

                if (filterData.key) this.m_pFilter[filterData.key] = filterChild.selectData.value;
            }
            
            this.grpSearchList.height = UIOrganizeHelper.CONTENT_GROUP_LINE_SIZE * filterNumLine;
        }

        private onTagClick(tag: com_main.CComboBox) {
            var parent = tag.parent;
            if (parent.numChildren > UIOrganizeHelper.NUM_LINE_SHOW) parent.setChildIndex(tag, 9999);
            this.hideAllSelectTags(tag.name);
            this.m_pIsShowTag = true;
            // tag.setSelectByIndex(tag.selectIndex);//lung17 add
            // this.showGuideWithType(GuideUI.UIOrganizeHelper);
        }
        private onTagSelect(tag: com_main.CComboBox) {
            if (tag.name.indexOf("filter_") > -1) {
                var key: string = tag.name.replace("filter_", "");
                this.m_pFilter[key] = tag.selectData.value;
            } else {
                var key: string = tag.name.replace("order_", "");
                this.m_pSort[key] = tag.selectData.value;
            }
            this.m_pIsShowTag = false;
            // this.showGuideWithType(GuideUI.UIOrganizeHelper);
        }

        private hideAllSelectTags(name: string = "") {
            for (var i = 0; i < this.grpSortList.numChildren; i++) {
                var selectTag = <com_main.CComboBox>this.grpSortList.getChildAt(i);
                if (selectTag.name != name)
                    selectTag.isShowContent = false;
            }

            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                var selectTag = <com_main.CComboBox>this.grpSearchList.getChildAt(i);
                if (selectTag.name != name)
                    selectTag.isShowContent = false;
            }
        }

        private NoOrderChildPos(): void {
            this.grpSearchText.y = this.grpSortText.y;
            this.grpSortText.visible = false;
            this.grpSortList.visible = false;
            this.grpSearchList.y = this.grpSortList.y;

        }
        private NoFilterChildPos(): void {
            this.grpSearchText.visible = false;
            this.grpSearchList.visible = false;
            this.imgSplit.visible = false;
            this.grpButtons.visible = false;
        }

        private layout(): eui.HorizontalLayout {
            var layout: eui.HorizontalLayout = new eui.HorizontalLayout();
            layout.horizontalAlign = "center";
            layout.verticalAlign = "middle";
            layout.gap = 30;

            return layout;
        }

        private onChange(): void {
            var height: number = UIOrganizeHelper.PER_GROUP_HEIGHT;
            if (this.grpSortText.visible) {
                height += this.grpSortText.height + this.grpSortList.height;
                if (this.grpSortList.numChildren < 3) this.grpSortList.layout = this.layout();
            }
            if (this.grpSearchText.visible) {
                height += this.grpSearchText.height + this.grpSearchList.height;
                if (this.grpSearchList.numChildren < 3) this.grpSearchList.layout = this.layout();
            }

            if (this.grpButtons.visible) {
                height += this.grpButtons.height + UIOrganizeHelper.PER_GROUP_HEIGHT;
            } else {
                height += UIOrganizeHelper.PER_GROUP_HEIGHT;
            }

            this.height = height + 10;

            if (this.grpSortList.visible) {
                this.setChildIndex(this.grpSortList, this.numChildren);
            }
        }

        public addSureFilterListener(obj: any, func: Function) {
            this.m_pObj = obj;
            this.m_pListener = func;
        }

        public setDatas(datas: any) {
            var orderDatas: any[] = datas.order;
            var filterDatas: any[] = datas.filter;

            if (orderDatas && orderDatas.length > 0) {
                this.setOrderData(orderDatas);
            } else {
                this.NoOrderChildPos();
            }

            if (filterDatas && filterDatas.length > 0) {
                this.setFilterData(filterDatas);
            } else {
                this.NoFilterChildPos();
            }
            this.onChange();
        }

        public refreshDatas(datas: any) {
            var orderDatas: any[] = datas.order;
            var filterDatas: any[] = datas.filter;
            var key: string;
            var filterChild: com_main.CComboBox;
            for (var i = 0; i < this.grpSortList.numChildren; i++) {
                filterChild = <com_main.CComboBox>this.grpSortList.getChildAt(i);
                var filterData = orderDatas[i];
                filterChild.dataSource = filterData.data;
                filterChild.selectIndex = filterData.index;
            }

            for (var i = 0; i < this.grpSearchList.numChildren; i++) {
                filterChild = <com_main.CComboBox>this.grpSearchList.getChildAt(i);
                var orderData = filterDatas[i];
                filterChild.dataSource = orderData.data;
                filterChild.selectIndex = orderData.index;
            }
        }

        private onThisClick() {
            if (this.m_pIsShowTag) {
                this.hideAllSelectTags();
                this.m_pIsShowTag = false;
            }
        }

        public hidden(): void {
            this.onThisClick();
            if (this.m_pListener) {
                this.m_pListener.call(this.m_pObj);
            }
            this.visible = false;
            if (this.m_pMask!=null)
                this.m_pMask.visible = false;
        }

        //在点击的地方创建一个面板
        public OpenView(com: egret.DisplayObject, gap: number = 0, up = true): void {
            if (!this.m_pIsOpen) {
                var point = com.localToGlobal(0, 0);
                if (up) {
                    this.x = point.x;
                    this.y = point.y - this.height - 20 - gap;
                } else {
                    this.x = point.x - (this.width - com.width);
                    this.y = point.y + com.height + gap;
                }

                //lung17
                // this.m_pMask = new eui.Rect(ApplicationMediator.app().stageWidth, ApplicationMediator.app().stageHeight, 0x000000);
                // this.m_pMask.alpha = 0.5;
                // this.m_pMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickListener, this);

                // ApplicationMediator.app().topLevel.addChild(this.m_pMask);
                // ApplicationMediator.app().topLevel.addChild(this);

            } else {
                this.m_pMask.visible = true;
                // UpManager.showMaskByName("UIOrganizeHelper",true);
            }

            this.m_pIsOpen = true;
            this.visible = true;

            // this.showGuideWithType(GuideUI.UIOrganizeHelper);
        }

        private clickListener(e: egret.Event) {
            this.hidden();
        }

        private addPopUpLayer() {
            //lung17 todo
            // var layer = ApplicationMediator.app().popUpLevel;
            // layer.addChild(this);
            //this.parentNode = layer;
        }

        protected getGuideNode(guideConfig) {
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
            var group: eui.Group = isSort ? this.grpSortList : this.grpSearchList;
            var name: string = "filter_" + key;
            var selectTag = <com_main.CComboBox>group.getChildByName(name);
            if (selectTag.isShowContent) {
                return selectTag.getElementAt(targetIndex);
            } else {
                return selectTag;
            }
        }


		//lung17------------
        public  copyDict(dict, isDeepCopy?) {
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
                    newDict[i] = (typeof dict[i] == "object") ? this.copyDict(dict[i]) : dict[i];//Utils.copyDict(dict[i]) : dict[i];
                } else {
                    newDict[i] = dict[i];
                }
            }
            return newDict;
        }
		//lung17------------


    }

}
