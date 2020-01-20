module com_main {

    export class WorldLockTaskPanel extends CView {

        public static readonly NAME = "WorldLockTaskPanel";

        public m_pBtnGo: eui.Group;
        public m_bLbGo: eui.Label;
        public m_pComsume: eui.Group;
        public m_RewardRoot: eui.Group;
        public m_pLbContent: eui.Label;
        public m_pBtnClose: eui.Group;
        public m_genCard: com_main.ComGenCard;
        public m_pHeroName: eui.Label;
        public m_RecomPower: eui.BitmapLabel;

        public m_nTid: number = 0;
        public m_nCid: number = 0;
        public m_nDt: number = 0;
        protected m_tCfg: VisitConfig;
        public m_TaskCfg: WorldMapUnlockTaskConfig;
        public arwardList: IItemInfo[] = []
        public constructor(data: any) {
            super();
            this.name = WorldLockTaskPanel.NAME;
            this.m_nTid = data.id;
            this.m_nCid = data.cityId;
            this.arwardList = [];
            this.initApp("world/WorldLockTaskPanelSkin.exml");
        }


        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_TaskCfg = C.WorldMapUnlockTaskConfig[this.m_nTid];
            this.updateRefeshHero();
            this.updateUI();
            this.initEvent();
            this.onGuideCondition();
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private initEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnClose, this, this.closeView);
            EventManager.addTouchScaleListener(this.m_pBtnGo, this, this.unlock);

        }


        /**关闭界面 */
        public closeView() {
            UpManager.history();
        }
        /**解锁 */
        public unlock() {
            UpManager.history();
            if (this.m_TaskCfg.type == WorldLockTaskType.SOURCE) {
                for (let index = 0; index < this.arwardList.length; index++) {
                    if (!RoleData.isbeyond(this.arwardList[index].itemId, this.arwardList[index].count)) {
                        EffectUtils.showTips(RoleData.getTipsisbeyond(this.arwardList[index].itemId, this.arwardList[index].count), 1, true)
                        return;
                    }
                }
                WorldProxy.C2S_UNLOCK_CITY(this.m_nCid);
            } else {
                Utils.open_view(TASK_UI.POP_WORLD_HERO_EVT_PANEL, { evtPosId: -1, cityId: this.m_nCid });
            }

        }
        private removeEvent() {
            EventManager.removeEventListener(this.m_pBtnClose);
            EventManager.removeEventListener(this.m_pBtnGo);

        }
        /**
         * 计算元宝显示
         */
        public updateRefeshHero() {
            this.m_tCfg = C.VisitConfig[3106];
            if (this.m_TaskCfg) {
                this.m_pLbContent.textFlow = Utils.htmlParser(GLan(this.m_TaskCfg.UnlockText2));
            } else {
                this.m_pLbContent.textFlow = Utils.htmlParser(GLan(this.m_tCfg.starttext));
            }
            let config = C.GeneralConfig[this.m_tCfg.heroId];
            this.m_pHeroName.text = GLan(config.name);
            this.m_genCard.setInfo(this.m_tCfg.heroId,true);
        }
        /**更新UI */
        public updateUI() {
            if (isNull(this.m_TaskCfg)) return;
            this.m_pComsume.visible = this.m_TaskCfg.type != WorldLockTaskType.FIGHT;
            this.m_bLbGo.text = GCode(CLEnum.ATTACK);
            if (this.m_TaskCfg.type == WorldLockTaskType.SOURCE) {
                this.m_bLbGo.text = GCode(CLEnum.AC_HAND_OUT);
                let arwardList = Utils.parseCommonItemJson(this.m_TaskCfg.consume);
                this.arwardList = arwardList;
                let i = 0;
                for (i = 0; i < arwardList.length; i++) {
                    let itemView = ComItemNew.create("count");
                    itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                    this.m_RewardRoot.addChild(itemView);
                }
            }

        }


        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_LOCKED_WND);
        }


    }


}