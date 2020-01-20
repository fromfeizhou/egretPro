module com_main {


	/**
	 * 联盟面板相关
	 */
    export class LegionListWnd extends CView {
        public static NAME = 'LegionListWnd';

        public InputLabel: eui.EditableText;
        public m_btnFind: com_main.CImage;
        public m_pViewRoot: eui.Group;
        public m_legionScroller: com_main.CScroller;
        public m_legionList: eui.List;
        public m_comTabTopGroup: com_main.ComTabTopGroup;
        public m_btnCreate: com_main.ComButton;
        public m_MainTopNew: com_main.MainTopNew;

        // private m_btnSure:eui.Group;
        // private m_btnRecommend:eui.Group;
        private m_data = [];
        private m_curTitleTag = 0;
        private m_DataArray: eui.ArrayCollection = new eui.ArrayCollection();

        private m_guildDatas: gameProto.IGuildData[];
        public constructor(param?: any) {
            super();
            this.m_guildDatas = param || [];
            this.name = LegionListWnd.NAME;
            this.initApp("legion/LegionListWndSkin.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.GET_GUILD_LIST_BY_NAME,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_GUILD_LIST_BY_NAME: {
                    let data = body as gameProto.IGetGuildListByNameResp;
                    if (body && body.guildData.length > 0) {
                        this.refreshItemsView(data.guildData);
                    } else {
                        EffectUtils.showTips(GCode(CLEnum.GUI_SEARCH_FAL));
                    }

                    break;
                }
            }
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            this.height = this.stage.stageHeight;
            EventManager.addTouchScaleListener(this.m_btnFind, this, this.onClickFind);
            EventManager.addTouchScaleListener(this.m_btnCreate, this, this.onClickCreate);
            // EventManager.addTouchScaleListener(this.m_btnRecommend, this, this.onClickRecommend);
            // EventManager.addTouchScaleListener(this.m_btnSure, this, this.onClickJoin);

            this.m_MainTopNew.setTitleName(GCode(CLEnum.GUILD));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);

            this.m_btnCreate.setTitleLabel(GCode(CLEnum.GUILD_CREATE));
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.GUILD_NAME) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.GUILD_POS_MZ) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.GUILD_FIGHT) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.GUILD_NUM) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.GUILD_OPERA) }, false);
            this.m_comTabTopGroup.setChangeCallback(this.changeTab, this);
            // 现在固定为普通酒馆状态
            this.initList();
        }
        public changeTab(selIndex: number) {
            this.m_curTitleTag = selIndex;
            this.initList();

        }

        /**刷新列表显示 */
        public refreshItemsView(param?: gameProto.IGuildData[]) {
            this.m_guildDatas = param || [];
        }

        private initList() {
            this.m_data = [];
            let list = this.m_guildDatas;
            if (list && list.length > 0) {

                for (let i = 0; i < list.length; i++) {
                    let info = list[i];
                    // let select = i==0?1:0;
                    this.m_data.push({ id: info.id, select: 0, guildName: info.name, playerName: info.guildMemberInfo.name, fight: info.guildPower, memberCount: info.memberCount, capacity: info.capacity });
                }
                this.sortby();
                if (this.m_DataArray.length == 0) {
                    this.m_DataArray = new eui.ArrayCollection(this.m_data);
                } else {
                    this.m_DataArray.replaceAll(this.m_data);

                }
                this.m_legionList.dataProvider = this.m_DataArray;
                this.m_legionList.itemRenderer = LegionListWndCell;
                // this.m_legionList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            }


        }
        private sortby() {
            if (this.m_curTitleTag == 0) {
                this.m_data.sort(this.sortFight);
            } else if (this.m_curTitleTag == 1) {

            } else if (this.m_curTitleTag == 2) {
                this.m_data.sort(this.sortFight);
            } else if (this.m_curTitleTag == 3) {
                this.m_data.sort(this.sortPeople);
            } else if (this.m_curTitleTag == 4) {
            }
        }
        private sortFight(a: any, b: any): number {
            return Utils.SortByProps(a, b, { "fight": "down" });
        }
        private sortPeople(a: any, b: any): number {
            return Utils.SortByProps(a, b, { "memberCount": "down" });
        }
        private m_lastCellData = null;
        private m_lastIndex = 0;
        private curtarget = null;
        private onTouchTab(e): void {
            // var item = e.item;
            // LegionProxy.send_APPLY_JOIN_GUILD(item.id);
            var item = e.item;
            this.m_lastCellData = e.item;
            let isShowSetGroup = false;
            let index = e.itemIndex;
            this.setSelect(this.curtarget, false);
            this.m_data[this.m_lastIndex].select = 0;
            if (this.curtarget) {
                this.setSelect(this.curtarget, false);
                this.m_data[index].select = 0;
                if (this.curtarget == e.itemRenderer) {
                    this.setSelect(e.itemRenderer, true);
                    this.m_data[index].select = 1;
                }
                else {
                    this.setSelect(e.itemRenderer, true);
                    this.curtarget = e.itemRenderer;
                    this.m_data[index].select = 1;
                }
            }
            else {
                this.curtarget = e.itemRenderer;
                this.setSelect(e.itemRenderer, true);

                this.m_data[index].select = 1;
            }
            this.m_lastIndex = index;
        }
        private setSelect(currentTarget, bshowSelect) {
            if (currentTarget == null) { return; }
            let targetChildrens = currentTarget.$children;
            for (let i = 0; i < targetChildrens.length; i++) {
                if (targetChildrens[i].name == "kuang") {
                    targetChildrens[i].visible = bshowSelect;
                    break;
                }
            }
        }

        //查找
        private onClickJoin() {
            if (this.m_lastCellData) {
                if (LegionModel.getGuildInfo()) {
                    LegionProxy.send_GET_GUILD_INFO(true, 0);
                } else
                    LegionProxy.send_APPLY_JOIN_GUILD(this.m_lastCellData.id);
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.GUILD_APPLY_FAL1), 1, true);


                // for(let i=0;i<this.m_DataArray.length;i++){
                //     let data = this.m_DataArray.source[i];
                //     if(i==0){
                //         this.m_lastCellData = data;
                //     }
                // }

            }
        }
        //查找
        private onClickFind() {
            if (this.InputLabel.text.length <= 0) {
                EffectUtils.showTips(GCode(CLEnum.GUI_SEARCH_FAL1), 1, true);
            }
            LegionProxy.send_GET_GUILD_LIST_BY_NAME(this.InputLabel.text);
        }
        //创建
        private onClickCreate() {
            // LegionProxy.send_CREATE_GUILD();
            Utils.open_view(TASK_UI.LEGION_CREATE_WND);
        }
        //推荐
        private onClickRecommend() {

        }

        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
        }


        private addEvent() {

            // EventManager.addTouchScaleListener(this.m_pBtnOk, this, this.onBtnOk);
            // EventManager.addTouchScaleListener(this.m_pBtnCancel, this, this.onBtnCancel);
            // EventManager.addTouchScaleListener(this.m_pBtnRecruit, this, this.onBtnRecruit);
        }



    }
    class LegionListWndCell extends eui.ItemRenderer {

        private legionName: eui.Label;
        private playerName: eui.Label;
        private fightText: eui.Label;
        private LegionPeopleText: eui.Label;
        private m_pImgIcon1: com_main.CImage;  //选中框
        private m_pImgIcon: com_main.CImage;
        private m_BtnReject: com_main.ComButton;
        public constructor() {
            super();
            this.touchChildren = true;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_BtnReject["sound_queren"] = SoundData.getSureSound();
            EventManager.addTouchScaleListener(this.m_BtnReject, this, this.onBtnApply);
        }


        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            EventManager.removeEventListeners(this);
        }
        private onBtnApply() {
            if (LegionModel.getGuildInfo()) {
                LegionProxy.send_GET_GUILD_INFO(true, 0);
            } else
                LegionProxy.send_APPLY_JOIN_GUILD(this.data.id);
        }

        protected dataChanged(): void {
            super.dataChanged();
            if (this.data) {
                // this.m_pImgIcon.source = Utils.getLegionCountryImage(RoleData.countryId); 
                this.legionName.text = this.data.guildName;
                this.fightText.text = '' + this.data.fight;
                this.LegionPeopleText.text = "" + this.data.memberCount + "/" + this.data.capacity;
                // this.m_pImgIcon1.visible = this.data.select!=0;
                this.playerName.text = this.data.playerName;
                this.m_BtnReject.setTitleLabel(GCode(CLEnum.GUILD_APPLY));

            }

        }


    }
}