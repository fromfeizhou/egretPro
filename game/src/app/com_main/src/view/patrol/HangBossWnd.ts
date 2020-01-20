module com_main {
	/**
	 * 离线收益
	 */
    export class HangBossWnd extends CView {
        public static NAME = 'HangBossWnd';
        public static PRO_MAX: number = 520;

        public m_apopUp: com_main.APopUp;
        public m_labDes: eui.Label;
        public m_labAwardNum: eui.Label;
        public m_listAward: eui.List;
        public m_genCard: com_main.ComGenCard;
        public m_pFight: eui.Group;
        public m_labFightDes: eui.Label;
        public m_btnBuy: com_main.ComCostTextButton;
        public m_btnFight: com_main.ComButton;
        public m_pProcess: eui.Group;
        public m_labProDes: eui.Label;
        public m_imgPro: eui.Image;
        public m_labPro: eui.Label;


        private m_nBossTime: number;

        public constructor(data?) {
            super();
            this.name = HangBossWnd.NAME;
            this.initApp("patrol/HangBossWndSkin.exml");

        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.initView();
            this.initEvent();
        }
        private initView() {
            this.m_apopUp.setTitleLabel(GCode(CLEnum.HAN_BOS_TILE));
            this.m_btnBuy.setCostImg('icon_source_gold_png');
            this.m_labDes.textFlow = Utils.htmlParser(GCode(CLEnum.HAN_BOS_DES))
            this.initData();
            this.refreshView();

            if (!PatrolModel.getBossInfo()) return;
            this.refreshGeneral();

            this.m_listAward.itemRenderer = PropRender;

            let res = [];
            let itemIdStr: string = ""

            let awardStr = PatrolModel.getBossInfo().bossReward;
            let awardArr = awardStr.split('#');
            let len = awardArr.length;
            for (let i = 0; i < len; i++) {
                let tmpStr = awardArr[i].split('*')[1];
                itemIdStr = i == len - 1 ? itemIdStr + tmpStr : itemIdStr + tmpStr + ',';
            }
            res = Utils.parseCommonItemJson(itemIdStr)
            while (res.length > 5) {
                res.pop();
            }
            let collection = new eui.ArrayCollection(res);
            this.m_listAward.dataProvider = collection;

        }
        /**boss形象 */
        public refreshGeneral() {
            this.m_genCard.setInfo(PatrolModel.getBossInfo().generalId, true);
        }

        /**初始化数据 */
        private initData() {
            this.m_nBossTime = PatrolModel.getBossTimeMax()
        }

        /**刷新显示 */
        private refreshView() {
            let data = NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS);
            if (data.reCount > 0) {
                if (PatrolModel.getBossTime() >= this.m_nBossTime) {
                    this.m_labFightDes.visible = true;
                    this.m_pFight.visible = true;
                    this.m_btnBuy.visible = false;
                    this.m_pProcess.visible = false;
                    this.m_btnFight.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
                } else {
                    this.m_pFight.visible = false;
                    this.m_btnBuy.visible = false;
                    this.m_pProcess.visible = true;
                    this.refreshPro();
                }
            } else {
                this.m_pFight.visible = false;
                this.m_btnBuy.visible = true;
                this.m_pProcess.visible = false;
                this.m_labFightDes.visible = false;
                this.m_btnFight.setTitleLabel(GCode(CLEnum.HAN_BOS_BUY));
                this.m_btnBuy.setTitleLabel(GCode(CLEnum.HAN_BOS_BUY));
                let needGold: number = NormalModel.getFunCostByData(data);
                this.m_btnBuy.setCostLabel(`${needGold}`);
            }

            this.m_labAwardNum.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HAN_BOS_TIPS, data.useCount, data.maxCount));
        }

        /**boss进度刷新 */
        private isBossIn() {
            if (NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS).reCount > 0) return true;
            return false;
        }

        /**刷新进度 */
        private refreshPro() {
            if (!this.isBossIn()) return;
            if (PatrolModel.getBossTime() >= this.m_nBossTime) {
                this.refreshView();
                return;
            }
            let rate = PatrolModel.getBossTime() / this.m_nBossTime;
            this.m_imgPro.width = rate * HangBossWnd.PRO_MAX;

            let score = PatrolModel.info.score | 100;
            this.m_labPro.text = `${Math.floor(PatrolModel.getBossTime() * score)}/${Math.floor(this.m_nBossTime * score)}`;
            this.m_labProDes.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HAN_BOS_POR, this.m_nBossTime * score));
        }

		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private initEvent() {
            /**挂机boss */
            EventManager.addTouchScaleListener(this.m_btnFight, this, this.onBtnFight);
            EventManager.addTouchScaleListener(this.m_btnBuy, this, this.onBtnFight);

            EventMgr.addEvent(PatrolEvent.PATROL_TICK_UPDATE, this.onPatrolTick, this);
            EventMgr.addEvent(PatrolEvent.PATROL_BOSS_RESET, this.onBossReset, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(PatrolEvent.PATROL_TICK_UPDATE, this);
            EventMgr.removeEventByObject(PatrolEvent.PATROL_BOSS_RESET, this);
        }

        /**boss重置 */
        private onBossReset(id: IFunCountEnum) {
            this.refreshView();
        }

        /**定时刷新改变 */
        private onPatrolTick() {
            this.refreshPro();
        }

        /**按钮回调 */
        private onBtnFight() {
            let data = NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS);
            if (data.reCount > 0) {
                PatrolProxy.C2S_PATROL_CHALLENGE_BOSS();
                return;
            }
            let vipCfg = C.VipPrivillegesConfig[VipPrivillType.PATROL_BOSS_BUY];
            let buyMax = Number(vipCfg['vip' + RoleData.vipLevel]);//最大购买数量
            if (data.buyAmountCount >= buyMax) {
                if (platform.isHidePayFunc()) {
                    EffectUtils.showTips("次数不足");
                    return;
                }
                Utils.showVipUpConfim();
                return;
            }
            let needGold: number = NormalModel.getFunCostByData(data);
            if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
                let content = GCodeFromat(CLEnum.HAN_BOS_BUY_TIME, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
                if (platform.isHidePayFunc()) content = GCodeFromat(CLEnum.HAN_BOS_BUY_TIME, needGold);
                Utils.showConfirmPop(content, () => {
                    PatrolProxy.C2S_PATROL_BUY_BOSS_COUNT();
                }, this);
            } else {
                EffectUtils.showTips(GCode(CLEnum.GOLD_LESS));
            }
            // if (data.reBuyAmountCount > 0) {
            // let content = GCodeFromat(CLEnum.HAN_BOS_BUY_TIME, PatrolModel.bossGoldConsume);
            //     Utils.showConfirmPop(content, () => {
            //         if (PropModel.isItemEnough(PropEnum.GOLD, PatrolModel.bossGoldConsume, 1)) {

            //         }
            //     }, this);
            //     return;
            // }
            // EffectUtils.showTips(GCode(CLEnum.QUA_FI_BUY_MAX), 1, true);
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */
    }

    class PropRender extends eui.ItemRenderer {
        protected m_item: ComItemNew;
        private m_tData: IItemInfo;

        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_item = ComItemNew.create('count');
            this.addChild(this.m_item);
        }

        protected dataChanged(): void {
            super.dataChanged();
            this.m_tData = this.data;

            if (this.m_tData) {
                this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
            }
        }
    }
}

