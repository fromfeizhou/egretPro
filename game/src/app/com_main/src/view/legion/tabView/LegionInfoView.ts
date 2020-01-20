module com_main {
	/**
	 * 联盟信息
	 */
    export class LegionInfoView extends CView {
        public static NAME = 'LegionInfoView';
        public m_pViewRoot: eui.Group;
        public m_Scroller: com_main.CScroller;
        public m_pMemberList: eui.List;
        public m_comTabTopGroup: com_main.ComTabTopGroup;
        public m_bottomGroup: eui.Group;
        public m_BtnApply: com_main.ComButton;
        public m_BtnMessage: com_main.ComButton;
        public m_infoGroup: eui.Group;
        public m_pImgIcon: com_main.CImage;
        public m_labLegionName: eui.Label;
        public m_labMzName: eui.Label;
        public m_labPeopleNum: eui.Label;
        public m_labGuildFight: eui.BitmapLabel;
        public m_settingBtn: com_main.ComButton;
        public m_declarationtext: eui.Label;
        public m_changeDes: eui.Image;
        public m_pOperaRoot: eui.Group;
        public m_pOperaList: eui.List;

        private m_tMemberColles: eui.ArrayCollection;
        private m_tBtnColles: eui.ArrayCollection;
        private m_nOperaPos: LegionPositon;      //操作目标
        private m_tTarget: ILegionCellData;  //选中数据
        private m_tOwner: ILegionCellData;

        /**操作栏预定义 */
        private m_operaDatas: { [type: number]: IOperaRdData } = {
            [OperaType.LEAVE]: { name: GCode(CLEnum.GUILD_OPERA_TC), type: OperaType.LEAVE },
            [OperaType.RM]: { name: GCode(CLEnum.GUILD_OPERA_RM), type: OperaType.RM },
            [OperaType.ZR]: { name: GCode(CLEnum.GUILD_OPERA_ZR), type: OperaType.ZR },
            [OperaType.CKWJ]: { name: GCode(CLEnum.GUILD_OPERA_CKWJ), type: OperaType.CKWJ },
            [OperaType.SL]: { name: GCode(CLEnum.CHAT_MSG_PRI), type: OperaType.SL },
            [OperaType.TC]: { name: GCode(CLEnum.GUILD_OPERA_TCWJ), type: OperaType.TC },
            [OperaType.TK]: { name: GCode(CLEnum.STATE_DH), type: OperaType.TK },
        };

        public constructor(size: ISize) {
            super();
            NodeUtils.setSize(this, size);
            this.name = LegionInfoView.NAME;
            this.initApp("legion/tabView/LegionInfoViewSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_comTabTopGroup.initNorTabBtns([GCode(CLEnum.GUILD_POS), GCode(CLEnum.GUILD_MEMBER_NAME), GCode(CLEnum.FIGHT),
            GCode(CLEnum.GUILD_CONTRIBUTE), GCode(CLEnum.GUILD_LINE_STATE)]);

            this.m_pImgIcon.source = LegionModel.getLegionCountryImage(RoleData.countryId);

            this.m_BtnApply.setTitleLabel(GCode(CLEnum.GUILD_APPLY_LIST));
            this.m_BtnMessage.setTitleLabel(GCode(CLEnum.GUILD_MSG));
            this.m_settingBtn.setTitleLabel(GCode(CLEnum.GUILD_SHEZHI));

            this.m_tBtnColles = new eui.ArrayCollection();
            this.m_pOperaList.dataProvider = this.m_tBtnColles;

            this.m_tMemberColles = new eui.ArrayCollection();
            this.m_pMemberList.dataProvider = this.m_tMemberColles;
            this.m_pMemberList.itemRenderer = LegionInfoCell;

            this.initMemberList();
            this.addEvent();
            Utils.toStageBestScale(this.m_pViewRoot);
        }

        /**初始化成员列表 */
        private initMemberList() {
            let guildInfo = LegionModel.getGuildInfo();
            // console.log("logInfo=",info);
            if (guildInfo && guildInfo.guildMemberInfo.length) {
                let res: ILegionCellData[] = [];
                for (let i = 0; i < guildInfo.guildMemberInfo.length; i++) {
                    let info = guildInfo.guildMemberInfo[i];
                    let data: ILegionCellData = {
                        playerId: info.playerId, name: info.name, position: info.position, level: info.level,
                        joinTime: info.joinTime, onlineTime: info.onlineTime, power: info.power,
                        offline: info.offline, offlineTime: info.offlineTime, contribute: info.donate, head: info.head,
                        selected: false, online: info.offline ? 0 : 1
                    }
                    res.push(data);
                    //记录玩家对象
                    if (info.playerId == RoleData.playerId) {
                        //玩家职位变动  操作队列修改
                        if (this.m_tOwner && this.m_tOwner.position != data.position) {
                            this.m_nOperaPos = -1;
                        }
                        this.m_tOwner = data;
                    }
                }
                this.m_tMemberColles.replaceAll(res);
                this.sortMember();
            }
            this.showGuild(guildInfo.name, guildInfo.memberCount, guildInfo.guildPower, guildInfo.guildLeader);
            this.showGuildNotice(guildInfo.declaration);
        }
        /**显示联盟基本信息 */
        private showGuild(name: string, num: number, power: number, mzName: string) {
            this.m_labMzName.text = GCode(CLEnum.GUILD_POS_MZ1) + mzName;
            this.m_labPeopleNum.text = GCode(CLEnum.GUILD_POS_CY1) + num;
            this.m_labLegionName.text = name;
            this.m_labGuildFight.text = power + '';

        }
        /**显示联盟宣言 */
        private showGuildNotice(Notice: string) {
            this.m_declarationtext.text = Notice;
        }

        //排序
        private sortMember() {
            let list: ILegionCellData[] = this.m_tMemberColles.source;
            switch (this.m_comTabTopGroup.selectedIndex) {
                case 0: {
                    list.sort(this.sortPosition);
                    break;
                }
                case 1: {
                    list.sort(this.sortName);
                    break;
                }
                case 2: {
                    list.sort(this.sortFight);
                    break;
                }
                case 3: {
                    list.sort(this.sortContribution);
                    break;
                }
                case 4: {
                    list.sort(this.sortOnline);
                    break;
                }
            }
            this.m_tMemberColles.refresh();
        }
        //小到大
        private sortPosition(a: any, b: any): number {
            return Utils.SortByProps(a, b, { "position": "up", "online": "down", "joinTime": "up" });
        }
        private sortName(a: any, b: any): number {
            return Utils.SortByProps(a, b, { "own": "down", "online": "down" });
        }
        private sortContribution(a: any, b: any): number {
            return Utils.SortByProps(a, b, { "contribute": "down" });

        }
        private sortFight(a: any, b: any): number {
            return Utils.SortByProps(a, b, { "power": "down" });
        }
        private sortOnline(a, b) {
            return Utils.SortByProps(a, b, { "own": "down", "online": "down" });
        }

        /**刷新操作栏 */
        private refreshOperaView() {
            if (!this.m_tOwner || this.m_nOperaPos == this.m_tTarget.position) {
                return;
            }
            this.m_nOperaPos = this.m_tTarget.position;
            this.m_tBtnColles.removeAll();
            //个人操作
            let list = this.m_operaDatas;
            if (this.m_tOwner.playerId == this.m_tTarget.playerId) {
                this.m_tBtnColles.replaceAll([list[OperaType.LEAVE]]);
                return;
            }
            let res: IOperaRdData[] = this.getOperasByPos(this.m_tOwner.position, this.m_tTarget.position);
            this.m_tBtnColles.replaceAll(res);
        }

        /**获得职位操作 */
        private getOperasByPos(ownerPos, targetPos): IOperaRdData[] {
            let list = this.m_operaDatas;
            if (ownerPos == LegionPositon.TUANZHANG) { //我是盟主
                return [list[OperaType.RM], list[OperaType.ZR], list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TC]];
            } else if (ownerPos == LegionPositon.FUTUANZHANG) {//我是副盟主
                switch (targetPos) {
                    case LegionPositon.TUANZHANG:
                        return [list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TK]];
                    case LegionPositon.FUTUANZHANG:
                        return [list[OperaType.CKWJ], list[OperaType.SL]];

                    case LegionPositon.CHENGGUANG:
                    case LegionPositon.LINSHIGONG:
                    case LegionPositon.CHENGYUAN:
                        return [list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TC]];
                }
            } else if (ownerPos == LegionPositon.CHENGGUANG) {//我是核心
                switch (targetPos) {
                    case LegionPositon.TUANZHANG:
                        return [list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TK]];
                    case LegionPositon.FUTUANZHANG:
                    case LegionPositon.CHENGGUANG:
                        return [list[OperaType.CKWJ], list[OperaType.SL]];
                    case LegionPositon.LINSHIGONG:
                    case LegionPositon.CHENGYUAN:
                        return [list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TC]];
                }
            }
            switch (targetPos) {
                case LegionPositon.TUANZHANG:
                    return [list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TK]];
            }
            return [list[OperaType.CKWJ], list[OperaType.SL]];
        }


        /**=====================================================================================
        * 协议处理 being
        * =====================================================================================
        */
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.CHANGE_GUILD_LEADER,
                ProtoDef.GET_GUILD_INFO,
                ProtoDef.KICK_OUT_GUILD,
                ProtoDef.LEAVE_GUILD,
                ProtoDef.CHANGE_DECLARATION,
                ProtoDef.S2C_ACCUSE_GUILD,
            ];
        }
        /**处理协议号事件 */
        public executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_GUILD_INFO: {
                    if (body) {
                        this.initMemberList();
                    }
                    break;
                }

                case ProtoDef.CHANGE_GUILD_LEADER: {// 装让盟主
                    if (body) {
                        EffectUtils.showTips(GCode(CLEnum.GUILD_TIPS_RWCG));
                    }
                    break;
                }
                case ProtoDef.KICK_OUT_GUILD: {
                    EffectUtils.showTips(GCode(CLEnum.GUILD_TIPS_TCCG));
                    break;
                }
                case ProtoDef.LEAVE_GUILD: {// 退出联盟成功，不成功直接返回错误码
                    com_main.UpManager.close();
                    EffectUtils.showTips(GCode(CLEnum.GUILD_TIPS_TCLM), 1, true);
                    break;
                }
                case ProtoDef.CHANGE_DECLARATION: {
                    this.showGuildNotice(body.newDeclaration);
                    break;
                }
                case ProtoDef.S2C_ACCUSE_GUILD: {
                    if (body) {

                    }
                    break;
                }
            }
        }
        /**=====================================================================================
        * 协议处理 end
        * =====================================================================================
        */

        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */
        private addEvent() {

            EventManager.addTouchScaleListener(this.m_settingBtn, this, this.onClickSetting);
            EventManager.addTouchScaleListener(this.m_BtnApply, this, this.onClickApply);
            EventManager.addTouchScaleListener(this.m_BtnMessage, this, this.onClickMessage);
            EventManager.addTouchScaleListener(this.m_changeDes, this, this.onClickChangeDes);

            EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPanelClick, this);
            this.m_pOperaList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onOperaSelected, this);
            this.m_pMemberList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onMemberSelected, this);
            this.m_comTabTopGroup.setChangeCallback(this.changeTab, this);

        }

        private removeEvent() {
            this.m_pOperaList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onOperaSelected, this);
            this.m_pMemberList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onMemberSelected, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPanelClick, this);
        }

        /**设置 */
        private onClickSetting() {
            Utils.open_view(TASK_UI.LEGION_SET_WND);
        }
        /**
         * 申请列表
         */
        private onClickApply() {
            Utils.open_view(TASK_UI.LEGION_APPLY_WND);
        }
        /**
         * 联盟记录
         */
        private onClickMessage() {
            Utils.open_view(TASK_UI.LEGION_RECORD_WND);
        }
        /**
         * 更改联盟信息
         */
        private onClickChangeDes() {
            Utils.open_view(TASK_UI.LEGION_SET_NOTICE_WND, LegionModel.getGuildDescription());
        }

        //成员排序
        public changeTab(index: number) {
            this.sortMember();
        }

        /**成员选中 */
        private onMemberSelected(e: eui.ItemTapEvent): void {
            Sound.playTap();
            let index = this.m_pMemberList.selectedIndex;
            this.refreshMemberSelected(e.itemIndex);
            let item = e.itemRenderer as LegionInfoCell;
            let itemData = e.item as ILegionCellData;
            if (item) {
                //如果目标 和记录选中的对象其中一个是玩家自己  强制重置操作
                if ((this.m_tTarget && this.m_tTarget.playerId == (this.m_tOwner.playerId)) ||
                    itemData.playerId == (this.m_tOwner.playerId)) {
                    this.m_nOperaPos = -1;
                }
                this.m_tTarget = itemData;
                this.m_pOperaRoot.visible = true;
                this.refreshOperaView();
                let pos = item.localToGlobal(0, 0);
                this.m_pViewRoot.globalToLocal(pos.x, pos.y, pos);
                this.m_pOperaRoot.y = pos.y + 38;
                let screnH: number = AGame.R.app.stageHeight - 50;
                if ((this.m_pOperaRoot.y + this.calcuOperaHeigth()) > screnH) this.m_pOperaRoot.y = screnH - this.calcuOperaHeigth()
            }
        }
        /**计算操作界面高度 */
        public calcuOperaHeigth(): number {
            let cout: number = this.m_tBtnColles.length;
            let len: number = cout > 1 ? cout * 63 + (cout - 1) * 6 : cout * 63;
            return len + 35;
        }
        /**刷新成员列表选中 */
        private refreshMemberSelected(index: number) {
            for (let i = 0; i < this.m_tMemberColles.source.length; i++) {
                let data = this.m_tMemberColles.getItemAt(i) as ILegionCellData;
                let selected = i == index;
                if (data.selected != selected) {
                    data.selected = selected;
                    this.m_tMemberColles.replaceItemAt(data, i);
                }
            }
        }
        /**刷新列表数据 */
        private reFlashitem() {
            for (let i = 0; i < this.m_tMemberColles.source.length; i++) {
                let data: ILegionCellData = this.m_tMemberColles.source[i];
                if (data.name == RoleData.nickName) {
                    data.contribute = RoleData.GetMaterialNumById(PropEnum.GUILD_POINT);
                }
                this.m_tMemberColles.replaceItemAt(data, i);
            }
        }
        /**资源刷新 */
        private onRoleResource(sourceId: PropEnum = PropEnum.GUILD_POINT) {
            if (sourceId != PropEnum.GUILD_POINT) return;
            this.reFlashitem();
        }

        /**面板点击 */
        private onPanelClick(e: egret.TouchEvent) {
            if (!this.m_pOperaRoot.visible) return;

            var point: egret.Point = this.m_pOperaRoot.parent.globalToLocal(e.stageX, e.stageY);
            var rect: egret.Rectangle;
            rect = new egret.Rectangle(this.m_pOperaRoot.x, this.m_pOperaRoot.y, this.m_pOperaRoot.width, this.m_pOperaRoot.height);
            if (!rect.containsPoint(point)) {
                this.m_pOperaRoot.visible = false;
                this.refreshMemberSelected(-1);
                this.m_pMemberList.selectedIndex = -1;
            }

            egret.Rectangle.release(rect);
            e.stopImmediatePropagation();
        }
        /**是否已经达到盟主的离线弹劾时间 */
        public isOffLine(): boolean {
            let leaderInfo: gameProto.IGuildMemberInfo = LegionModel.getLeaderInfo();
            if (isNull(leaderInfo)) return false;
            if (!leaderInfo.offline) return false;
            var offlineCfg = Math.floor(ConstUtil.getValue(IConstEnum.GUILD_ACCUSE_LOGINOUT_TIME));
            let subTime = Math.floor((TimerUtils.getServerTime() - leaderInfo.offlineTime) / 3600);
            return subTime >= offlineCfg;
        }
        /**操作选中 */
        private onOperaSelected() {
            let index = this.m_pOperaList.selectedIndex;
            let data = this.m_tBtnColles.getItemAt(index) as IOperaRdData;
            if (!data) return;
            switch (data.type) {
                case OperaType.RM: {
                    Utils.open_view(TASK_UI.LEGION_APPOINT_WND, this.m_tTarget);
                    break;
                }
                case OperaType.ZR: {
                    Utils.showConfirmPop(GCode(CLEnum.GUILD_TIPS_ZRMZ), () => {
                        LegionProxy.send_CHANGE_GUILD_LEADER(this.m_tTarget.playerId);
                    }, this);
                    break;
                }
                case OperaType.SL: {
                    let param: IChatWndParm = { type: ChatType.PRIVATE, id: this.m_tTarget.playerId, name: this.m_tTarget.name }
                    Utils.open_view(TASK_UI.POP_CHAT_MAIN, param);
                    break;
                }
                case OperaType.CKWJ: {
                    NormalProxy.C2S_PLAYER_INTEGRATED_INFORMATION(this.m_tTarget.playerId);
                    break;
                }
                case OperaType.TC: {
                    Utils.showConfirmPop(GCode(CLEnum.GUILD_TIPS_TCWJ), () => {
                        LegionProxy.send_KICK_OUT_GUILD(this.m_tTarget.playerId);
                    }, this);
                    break;
                }
                case OperaType.TK: {
                    if (!this.isOffLine()) {
                        let day = Math.floor(ConstUtil.getValue(IConstEnum.GUILD_ACCUSE_LOGINOUT_TIME) / 24);
                        EffectUtils.showTips(GCodeFromat(CLEnum.GUILD_TIPS_TK_TIME, day));
                        break;
                    }
                    var itemInfo = ConstUtil.getItems(IConstEnum.GUILD_ACCUSE_COSTS)[0];
                    Utils.showConfirmPop(GCodeFromat(CLEnum.GUILD_TIPS_TK, itemInfo.count), () => {
                        if (PropModel.isItemEnough(PropEnum.GOLD, itemInfo.count, 1)) {
                            LegionProxy.C2S_ACCUSE_GUILD();
                        }
                    }, this);
                    break;
                }
                case OperaType.LEAVE: {
                    if (this.m_tMemberColles.length == 1) {
                        Utils.showConfirmPop(GCode(CLEnum.GUILD_TIPS_JSLM), () => {
                            LegionProxy.send_DISSOLVE_GUILD(LegionModel.getGuildId());
                        }, this);
                        return;
                    }
                    let position = this.m_tOwner.position;
                    if (position == LegionPositon.TUANZHANG) {
                        EffectUtils.showTips(GCode(CLEnum.GUILD_TIPS_TCLM_FAL), 1, true);
                        return;
                    }
                    Utils.showConfirmPop(GCode(CLEnum.GUILD_TIPS_TCLM1), () => {
                        LegionProxy.send_LEAVE_GUILD();
                    }, this);
                    break;
                }
            }
            this.m_pMemberList.selectedIndex = -1;
            this.m_pOperaList.selectedIndex = -1;
            this.m_pOperaRoot.visible = false;
        }
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

    }
    //操作按钮枚举
    enum OperaType {
        /**任命 */
        RM = 0,
        /**转让 */
        ZR = 1,
        /**查看玩家 */
        CKWJ = 2,
        /**私聊 */
        SL = 3,
        /**退出 */
        LEAVE = 4,
        /**踢出 */
        TC = 5,
        /**弹劾 */
        TK = 6

    }
    interface IOperaRdData {
        name: string,
        type: OperaType;
    }
    export interface ILegionCellData extends gameProto.IGuildMemberInfo {
        selected: boolean,
        /**贡献 */
        contribute: number,
        /**数据排序使用 */
        online: number,
    }

    class LegionInfoCell extends eui.ItemRenderer {
        public m_pSelectedRoot: eui.Group;
        public m_labPos: eui.Label;
        public m_labName: eui.Label;
        public m_labFight: eui.Label;
        public m_labContriNum: eui.Label;
        public m_labState: eui.Label;

        private m_tData: ILegionCellData;
        public constructor() {
            super();
            this.touchChildren = false;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.cacheAsBitmap = true;
        }


        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected dataChanged(): void {
            super.dataChanged();
            this.m_tData = this.data;
            this.m_pSelectedRoot.visible = this.m_tData.selected;
            if (this.m_tData.offline) {
                this.currentState = 'offline';
            } else {
                this.currentState = 'base';
            }
            this.commitProperties();

            this.m_labPos.text = `【${LegionModel.getPosTitle(this.m_tData.position)}】`;
            this.m_labName.text = this.m_tData.name;
            this.m_labFight.text = this.m_tData.power + '';
            this.m_labContriNum.text = this.m_tData.contribute + '';
            this.m_labState.text = this.m_tData.offline ? GCode(CLEnum.GUILD_LINE_OFF) : GCode(CLEnum.GUILD_LINE_ON);

        }
    }
}