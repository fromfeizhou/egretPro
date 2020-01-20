module com_main {
    /**英雄寻宝 */
    export class TurnTableView extends CView implements ITurnTableWnd {
        /**面板类型 */
        public m_labTip: eui.Label;
        public m_pCheckBox: eui.Group;
        public m_labSkip: eui.Label;
        public m_checkBox: eui.CheckBox;
        public m_labCount: eui.Label;
        public m_btnOne: com_main.ComButton;
        public m_comCost0: com_main.ComResCost;
        public m_comCost1: com_main.ComResCost;
        public m_btnTen: com_main.ComButton;
        public m_lablunckNum: eui.BitmapLabel;
        public m_turnTime: eui.Label;
        public m_turnItem0: com_main.TurnTableItem;
        public m_pRoot: eui.Group;

        public m_TurnBoxList: eui.List;
        private m_points: IPos[];
        private m_turnTableVo: AcTurnTableVo;
        private m_boxItem: TurntableBoxRD;//当前点击宝箱
        private m_scrollV: number;//当前点击宝箱位置
        private m_tCollects: eui.ArrayCollection;
        private m_currBtnType: number;//当前点击寻宝类型
        private m_runIndex: number;
        private m_prizeCfgDic: { [key: number]: IPos };//根据id保存坐标

        private message: gameProto.IValuesMessage[];
        private isTurn: boolean;//是否转动中
        private prizeNum: number;//转盘道具数量
        private prizeInfo: IItemInfo;
        public activityType: AcViewType;
        public bInit: boolean;

        public constructor(activiType: number) {
            super();
            this.activityType = activiType;
            this.initApp("activity/turntable/TurnTableViewSkin.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
            }
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
            Utils.TimerManager.remove(this.updateDownTime, this);
            Utils.TimerManager.remove(this.timerFunc, this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.TURNTABLE_UI]);
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_points = [];
            for (let i = 0; i < 14; i++) {
                let item = this[`m_turnItem${i}`];
                this.m_points.push({ x: item.x, y: item.y });
            }
            this.m_tCollects = new eui.ArrayCollection();
            this.m_TurnBoxList.dataProvider = this.m_tCollects;
            this.m_TurnBoxList.itemRenderer = TurnTableBoxRender;
            this.m_TurnBoxList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);

            this.m_btnTen.setTitleLabel('寻宝十次');
            this.m_labTip.textFlow = Utils.htmlParser(GCode(CLEnum.TURNTABLE_TIP));
        }
        private onTouchTab(e: eui.ItemTapEvent): void {
            this.m_scrollV = e.currentTarget.scrollV;
            this.m_boxItem = e.item as TurntableBoxRD;
            if (this.m_turnTableVo.accumulates.indexOf(this.m_boxItem.boxId) == -1) {
                if (this.m_boxItem.boxState <= 0) {
                    Utils.open_view(TASK_UI.NOR_BOX_INFO_PANEL, { awards: this.m_boxItem.award });
                } else {
                    TurnTableProxy.C2S_ACTIVITY_DRAW_PRIZE_REWARD(this.m_turnTableVo.id, this.m_boxItem.boxId);
                }
            } else {
                EffectUtils.showTips(GCode(CLEnum.QUA_BOX_TIPS), 1, false);
            }
        }
        /**初始化界面 */
        public initView() {
            if (this.bInit) return;
            this.bInit = true;
            this.isTurn = false;
            this.m_turnTableVo = ActivityModel.getActivityVo<AcTurnTableVo>(this.activityType);
            this.m_checkBox.selected = this.m_turnTableVo.isSkip;
            // this[`m_turnItem${this.m_turnTableVo.playNum}`].select(true);
            this.m_prizeCfgDic = {};
            this.message = [];
            if (this.m_turnTableVo) {
                this.creatItem();
                this.initm_boxItem();
                this.refreshView();
                this.refreshCost();
                this.refreshBtn();
                this.updateDownTime();
                Utils.TimerManager.doTimer(1000, 0, this.updateDownTime, this);
            }
            this.addEvent();
        }
        public updateDownTime() {
            let str = Utils.DateUtils.getCountdownStrByCfg(this.m_turnTableVo.closeDate - TimerUtils.getServerTimeMill(), 1);
            let timeStr = GCode(CLEnum.AC_COUNT_TIME);
            this.m_turnTime.textFlow = Utils.htmlParser(`${timeStr}<font color=#E9E9E6>${str}</font>`);
        }
        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_pRoot);
        }
        /**初始化宝箱列表 */
        private initm_boxItem() {
            let boxArr = [];
            let prizeCfg: PrizeAccumulateConfig[] = [];
            let boxState = 0;
            for (let key in this.m_turnTableVo.configsII) {
                prizeCfg.push(this.m_turnTableVo.configsII[key]);
            }
            for (let i = 0; i < prizeCfg.length; i++) {
                let vo = prizeCfg[i];
                if (this.m_turnTableVo.accumulates.indexOf(vo.id) == -1) {
                    boxState = vo.accumulate <= this.m_turnTableVo.account ? 1 : 0;
                } else {
                    boxState = 2;
                }
                let data: TurntableBoxRD = { boxId: vo.id, lotteryNum: vo.accumulate, boxState: boxState, award: vo.award };
                boxArr.push(data);
            }
            this.m_tCollects.replaceAll(boxArr);
        }
        /**刷新宝箱列表数据 */
        private refreshBox() {
            let boxState = 0;
            for (let i = 0; i < this.m_tCollects.source.length; i++) {
                let data: TurntableBoxRD = this.m_tCollects.source[i];
                if (this.m_turnTableVo.accumulates.indexOf(data.boxId) == -1) {
                    boxState = data.lotteryNum <= this.m_turnTableVo.account ? 1 : 0;
                } else {
                    boxState = 2;
                }
                data.boxState = boxState;
                this.m_tCollects.replaceItemAt(data, i);
            }
            this.m_tCollects.refresh();
            this.m_TurnBoxList.useVirtualLayout = true;
            this.m_TurnBoxList.validateNow();
            this.m_TurnBoxList.scrollV = this.m_scrollV;

        }
        /**奖励物品显示 */
        public creatItem() {
            if (!this.bInit) return;
            let turnTableCfg: PrizeConfig[] = [];
            for (let key in this.m_turnTableVo.configs) {
                turnTableCfg.push(this.m_turnTableVo.configs[key]);
            }
            for (let i = 0; i < turnTableCfg.length; i++) {
                let item = this[`m_turnItem${i}`] as TurnTableItem;
                item.refreshItem(turnTableCfg[i].award.itemId, turnTableCfg[i].award.count, turnTableCfg[i].reset);
                this.m_prizeCfgDic[turnTableCfg[i].id] = this.m_points[i];
            }
        }
        /**刷新显示 */
        public refreshView() {
            if (!this.bInit) return;
            this.m_lablunckNum.text = this.m_turnTableVo.luncky.toString();
            this.m_labCount.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TURNTABLE_OTHER_PIRCE, this.m_turnTableVo.account));
        }
        /**刷新消耗显示 */
        public refreshCost() {
            if (!this.bInit) return;
            this.prizeNum = PropModel.getPropNum(PropEnum.TURNTABLE);//幸运转盘数量
            this.prizeInfo = ConstUtil.getItems(IConstEnum.PRIZE_RECRUIT_RECRUIT_CONSUME)[0];
            this.m_comCost0.setInfo(this.prizeInfo.itemId, this.prizeInfo.count);
            this.m_comCost1.setInfo(this.prizeInfo.itemId, this.prizeInfo.count * 10);

        }
        /**刷新按钮显示 */
        private refreshBtn() {
            let btnStr = this.m_turnTableVo.freeCount > 0 ? '免费一次' : '寻宝一次';
            this.m_btnOne.setTitleLabel(btnStr);
        }
        /**=====================================================================================
    * 事件监听 begin
    * =====================================================================================
    */
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnOne, this, this.onOneStart);
            EventManager.addTouchScaleListener(this.m_btnTen, this, this.onTenStart);
            EventManager.addTouchTapListener(this.m_pCheckBox, this, this.onCheckBox);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_TURNTABLE_UPDATE, this.onDrawCard, this);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_TURNTABLE_BOX_UPDATE, this.refreshBox, this);
            EventMgr.addEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this.openRedGenTip, this);
        }
        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_TURNTABLE_UPDATE, this);
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_TURNTABLE_BOX_UPDATE, this);
            EventMgr.removeEventByObject(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, this);
        }
        /**跳过动画 */
        private onCheckBox(): void {
            let state = !this.m_turnTableVo.isSkip;
            this.m_checkBox.selected = state;
            this.m_turnTableVo.isSkip = state;
        }
        /**点击一次寻宝 */
        private onOneStart(): void {
            if (this.isTurn) {
                EffectUtils.showTips('正在抽奖中', 1, false);
                return;
            }
            this.m_currBtnType = 0;
            this.prizeNum = PropModel.getPropNum(PropEnum.TURNTABLE);//幸运转盘数量
            if (this.prizeNum <= 0 && this.m_turnTableVo.freeCount <= 0) {
                Utils.open_view(TASK_UI.COM_BUY_ITEM_WND, { turnTableVoId: this.m_turnTableVo.id, itemId: this.prizeInfo.itemId, count: this.prizeInfo.count, buyType: this.m_currBtnType });
            } else {
                this.getReward();
            }

        }
        /**点击十次寻宝 */
        public onTenStart() {

            if (this.isTurn) {
                EffectUtils.showTips('正在抽奖中', 1, false);
                return;
            }
            this.m_currBtnType = 1;
            this.prizeNum = PropModel.getPropNum(PropEnum.TURNTABLE);//幸运转盘数量
            let allItemNum = this.m_turnTableVo.freeCount + this.prizeNum;//免费次数加道具数量
            if (allItemNum < 10) {
                Utils.open_view(TASK_UI.COM_BUY_ITEM_WND, { turnTableVoId: this.m_turnTableVo.id, itemId: this.prizeInfo.itemId, count: this.prizeInfo.count * (10 - this.m_turnTableVo.freeCount - this.prizeNum), buyType: this.m_currBtnType });
            } else {
                this.getReward();
            }
        }
        /**寻宝请求获得物品 */
        private getReward() {
            TurnTableProxy.C2S_ACTIVITY_PRIZE_PLAY(this.m_turnTableVo.id, this.m_currBtnType);
        }
        /**点击寻宝返回 */
        private onDrawCard(message: gameProto.IValuesMessage[]): void {
            this.message = message;
            this.isTurn = true;
            if (this.m_turnTableVo.isSkip) {//跳过动画直接弹奖励
                this.showSkipAni();
            } else {
                this.Continue();
            }
            this.refreshView();//刷新幸运值
            this.refreshBox();
            this.refreshBtn();//刷新按钮显示
        }
        /**转两圈 */
        private Continue() {
            this.closeLastItemLight();
            const ITEM_NUM = 14;
            this.m_runIndex = 0;
            Utils.TimerManager.doTimer(100, ITEM_NUM * 1, this.timerFunc, this, this.turnTwoEnd, this);
        }

        /**减速转一圈 在走到奖励位置 */
        private turnTwoEnd() {
            let playNum = 0;
            if(this.m_turnTableVo.playNum % 14 == 0){
                playNum = 14;
            }else{
                playNum = this.m_turnTableVo.playNum % 14;
            }
            Utils.TimerManager.doTimer(200, playNum , this.timerFunc, this, this.ShowMessage, this)
        }

        private closeLastItemLight() {
            if (this.m_runIndex == undefined || this.m_runIndex == null) return;
            let lastPoint = this.m_runIndex - 1 > -1 ? this.m_runIndex - 1 : 13;
            let lastSelectItem = this['m_turnItem' + lastPoint];
            lastSelectItem.select(false);
        }

        private timerFunc(event: egret.TimerEvent) {
            this.closeLastItemLight();
            let curSelectItem = this['m_turnItem' + this.m_runIndex];
            curSelectItem.select(true);

            this.m_runIndex += 1;
            if (this.m_runIndex >= 14) this.m_runIndex = 0;
        }

        public ShowMessage() {
            Utils.TimerManager.doTimer(500, 1, () => {
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, this.message);
                this.isTurn = false;
            }, this)
        }
        /**跳过动画直接弹奖励 */
        public showSkipAni() {
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, this.message);
            this.isTurn = false;
        }
        /**全部奖励播放完再弹 */
        private openRedGenTip() {
            if (GiftBagModel.isPopItem) {
                Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 1, giftId: GiftBagModel.jumpId });
            }
        }
    }
    export interface TurntableBoxRD {
        boxId: number;         //宝箱id
        lotteryNum: number;   //抽奖次数
        boxState: number;    //(0不可领,1可领,2已领)领取状态
        award: IItemInfo[];    //宝箱对应奖励
    }
    /**
    * 宝箱
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    class TurnTableBoxRender extends eui.ItemRenderer {
        public m_imgBox: eui.Image;
        public m_labName: eui.Label;
        public m_pEffectRoot: eui.Group;
        private m_tData: com_main.TurntableBoxRD;
        private m_boxStarEff: MCDragonBones;
        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/activity/turntable/TurnTableBoxSkin.exml");
            this.width = 106;
            this.height = 109;
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            this.onDestroy()
        }
        public onDestroy(): void {
            this.clearBoxStarEffect();
        }
        protected childrenCreated(): void {
            super.childrenCreated();
        }
        protected dataChanged() {
            this.m_tData = this.data;
            if (!this.m_tData) return;
            this.commitProperties();
            this.m_labName.text = this.m_tData.lotteryNum + '次';
            if (this.m_tData.boxState == 2) {
                this.m_imgBox.source = 'hang_bx_1_png';
                Utils.isGray(false, this.m_imgBox);
                this.clearBoxStarEffect();
            } else {
                this.m_imgBox.source = 'hang_bx_png';
                Utils.isGray(this.m_tData.boxState <= 0, this.m_imgBox);
                if (this.m_tData.boxState <= 0) {
                    this.clearBoxStarEffect();
                } else {
                    this.createBoxStarEffect();
                }
            }
        }
        /**设置星光特效 */
        private createBoxStarEffect() {
            if (this.m_boxStarEff) return;
            this.m_boxStarEff = NormalMcMgr.createMc(IETypes.EUI_BoxEffect02, true);
            // this.m_boxStarEff.scaleX = 1;
            // this.m_boxStarEff.scaleY = 1;
            this.m_boxStarEff.x = 53;
            this.m_boxStarEff.y = 40;
            // this.m_boxStarEff.visible = false;
            this.m_pEffectRoot.addChildAt(this.m_boxStarEff, 1);
        }
        /**清除星光特效 */
        private clearBoxStarEffect() {
            if (this.m_boxStarEff) {
                NormalMcMgr.removeMc(this.m_boxStarEff);
                this.m_boxStarEff = null;
            }
        }
    }
}