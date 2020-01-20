module com_main {

    export class WorldVisitAttack extends CView {
        public static readonly NAME = "WorldVisitAttack";

        public m_pBtnGo: eui.Group;
        public m_bLbGo: eui.Label;
        public m_pGTime: eui.Group;
        public m_downTime: eui.Label;
        public m_accBtn: eui.Group;
        public m_pLbNum: eui.Label;
        public m_pItem: com_main.GeneralHeadRender;
        public m_pLbContent: eui.Label;
        public m_pBtnClose: eui.Group;
        public m_genCard: com_main.ComGenCard;
        public m_pHeroName: eui.Label;
        public m_RecomPower: eui.BitmapLabel;
        public m_pRef: eui.Group;
        public m_reCout: eui.Label;
        public m_refreshBtn: com_main.CImage;

        public m_RefGoldList: number[] = [];
        protected m_nCid: number = 0;
        public m_nDt: number = 0;

        protected m_tData: gameProto.IVisitEventData;
        protected m_tCfg: VisitConfig;
        public constructor(cid: number) {
            super();
            this.name = WorldVisitAttack.NAME;
            this.m_nCid = cid;
            this.m_RefGoldList = [];
            this.initApp("world/world_visit_attack.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_VISIT_DATA_REFRESH,
                ProtoDef.S2C_VISIT_CD_SPEED,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_VISIT_DATA_REFRESH: {
                    let data = body as gameProto.S2C_VISIT_DATA_REFRESH;
                    if (this.m_nCid != data.visitEventData.cityId)
                        return;
                    this.updateRefeshHero();
                    break;
                }
                case ProtoDef.S2C_VISIT_CD_SPEED: {
                    let data = body as gameProto.S2C_VISIT_CD_SPEED;
                    if (this.m_nCid != data.visitEventData.cityId)
                        return;
                    this.updateDownTime();
                    break;
                }
            }
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
            Utils.TimerManager.remove(this.update, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();


            this.m_RefGoldList = ConstUtil.getNumArray(IConstEnum.VISIT_REFRESH_PRICE);


            this.updateRefeshHero();
            this.updateDownTime();
            this.update();
            Utils.TimerManager.remove(this.update, this);
            Utils.TimerManager.doTimer(1000, 0, this.update, this, );

            this.m_pLbNum.text = `${PropModel.getPropNum(PropEnum.WORLD_VISIT_ITEM)}/1`

            this.initEvent();
            this.onGuideCondition();
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private initEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnClose, this, this.closeView);
            EventManager.addTouchScaleListener(this.m_pBtnGo, this, this.go);
            EventManager.addTouchScaleListener(this.m_refreshBtn, this, this.refreshHero);
            // EventManager.addTouchScaleListener(this.m_pRef, this, this.refreshHero);
            EventManager.addTouchScaleListener(this.m_accBtn, this, this.accTime);
        }
        /**
         * 加速时间
         */
        public accTime() {
            let curEndTime = this.m_tData.refreshStamp + this.m_tCfg.cooling
            Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                propSpeedType: PropSpeedType.WorldVisit, targetId: this.m_nCid,
                startTime: this.m_tData.refreshStamp,
                endTime: curEndTime,
                speedUpTime: this.m_tData.speed
            });
        }
        /**刷新武将 */
        public refreshHero() {
            let count: number = this.m_tData.refreshCount > (this.m_RefGoldList.length - 1) ? this.m_RefGoldList.length - 1 : this.m_tData.refreshCount
            if (PropModel.isItemEnough(PropEnum.GOLD, this.m_RefGoldList[count], 1)) {
                WorldProxy.C2S_VISIT_DATA_REFRESH(this.m_nCid);
            }

        }
        /**关闭界面 */
        public closeView() {
            UpManager.history();
        }
        /**前往 */
        public go() {
            let event = WorldModel.getVisitEventById(this.m_nCid);
            if (!event) {
                EffectUtils.showTips(GCode(CLEnum.WOR_BF_FAL), 1, true);
                return;
            } else if (event.generalId > 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_BF_FAL1), 1, true);
                return;
            }
            if (!WorldModel.isOwnerCity(event.cityId)) {
                EffectUtils.showTips(GCode(CLEnum.WOR_BF_FAL2), 1, true);
                return
            }
            if (PropModel.getPropNum(PropEnum.WORLD_VISIT_ITEM) == 0) {
                EffectUtils.showTips(GCode(CLEnum.WOR_BF_FAL3), 1, true);
                return;
            }
            UpManager.history();
            Utils.open_view(TASK_UI.POP_WORLD_VIEW_PANEL, { id: this.m_nCid });

        }
        private removeEvent() {
            EventManager.removeEventListener(this.m_pBtnClose);
            EventManager.removeEventListener(this.m_pBtnGo);
            EventManager.removeEventListener(this.m_accBtn);
            EventManager.removeEventListener(this.m_refreshBtn);
        }
        /**
         * 计算元宝显示
         */
        public updateRefeshHero() {
            this.m_tData = WorldModel.getVisitEventById(this.m_nCid);
            this.m_tCfg = C.VisitConfig[this.m_tData.visitId];
            this.m_pLbContent.text = GLan(this.m_tCfg.starttext);
            let count: number = this.m_tData.refreshCount > (this.m_RefGoldList.length - 1) ? this.m_RefGoldList.length - 1 : this.m_tData.refreshCount
            this.m_reCout.text = `${this.m_RefGoldList[count]}`
            this.m_pItem.setGenId(this.m_tCfg.icon);
            this.m_pItem.scaleX = 0.7;
            this.m_pItem.scaleY = 0.7;
            let config = C.GeneralConfig[this.m_tCfg.heroId];
            this.m_pHeroName.text = GLan(config.name);
            this.m_genCard.setInfo(this.m_tCfg.heroId, true);
        }
        /**
         * 更新倒计时
         */
        public updateDownTime() {
            this.m_tData = WorldModel.getVisitEventById(this.m_nCid);
            let endTime = this.m_tData.refreshStamp == 0 ? this.m_tData.refreshStamp : (this.m_tData.refreshStamp + this.m_tCfg.cooling)
            let curtime = Math.floor(TimerUtils.getServerTime());
            this.m_nDt = endTime - curtime - this.m_tData.speed;
            if (this.m_nDt <= 0) {
                this.m_pBtnGo.visible = true;
                this.m_pGTime.visible = false;
            } else {
                this.m_pBtnGo.visible = false;
                this.m_pGTime.visible = true;
                Utils.TimerManager.remove(this.update, this);
                Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, () => {
                    this.m_pBtnGo.visible = true;
                    this.m_pGTime.visible = false;
                });
            }

        }
        public update() {
            this.m_nDt--
            if (this.m_nDt <= 0) {
                Utils.TimerManager.remove(this.update, this);
                this.m_pBtnGo.visible = true;
                this.m_pGTime.visible = false;
                return;
            }
            this.m_downTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);

        }
        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_VISIT_WND);
        }


    }



    /**
     * 出征拜访选择
     */
    export class WorldVisitPanel extends CView {

        public static readonly NAME = "WorldVisitPanel";

        public m_aPopUp: com_main.APopUp;
        public m_pGSatus: eui.Group;
        public m_pLbTime: eui.Label;
        public m_pIcoFood: com_main.CImage;
        public m_pLbFood: eui.Label;
        public m_pSroller: eui.Scroller;
        public m_pList: eui.List;
        public m_pBtnGo: eui.Group;

        protected m_pCollection: eui.ArrayCollection;
        protected m_nCid: number = 0;

        public constructor(cid: number) {
            super();
            this.name = WorldVisitPanel.NAME;
            this.currentState = "visit";
            this.initApp("world/world_hero_panel.exml");
            this.m_nCid = cid;
        }


        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.__init_hero();
            this.m_aPopUp.setTitleLabel('选择挑战武将')
            this.onGuideCondition();
        }

        private __init_hero() {
            let data: GeneralVo[] = GeneralModel.getOwnGeneralWithSort();

            let fn: (e: number) => void = ((e: number) => {
                WorldProxy.C2S_GENERAL_VISIT(e, this.m_nCid);
                UpManager.history();
            }).bind(this);

            let genVos = GeneralModel.getOwnGeneralWithSortFight();
            let event = WorldModel.getVisitEventById(this.m_nCid);
            let a = []
            for (let v of data) {
                a.push({ gid: v.generalId, fight: v.fight, cb: fn, visit: WorldModel.isInVisitbyGenId(v.generalId) });
            }

            this.m_pCollection = new eui.ArrayCollection(a);
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = WorldViewItem;
            this.m_pList.useVirtualLayout = true;
        }

        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_FIGHT_SEL_WND);
        }
    }


    export class WorldViewItem extends eui.ItemRenderer {
        public m_pGay: eui.Group;
        public m_pPanel: com_main.CImage;
        public m_pImgLight: com_main.CImage;
        public m_pPow: eui.Image;
        public m_comFightItem: com_main.ComFightItem;
        public m_pHeroHead: com_main.GeneralHeadRender;
        public m_pLbName: eui.Label;
        public m_pNameG: eui.Group;
        public m_pLbCity: eui.Label;


        protected m_nHeroId: number = 0;
        protected m_pCallBack: Function;
        protected m_bVisit: boolean = false;


        public constructor(data?: GeneralVo, cb?: (e: number) => void) {
            super();
            this.currentState = "visit";

            this.skinName = Utils.getSkinName("app/world/world_hero_item.exml");
            // this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            // this.cacheAsBitmap = true;
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            EventManager.addTouchTapListener(this, this, () => {
                if (this.m_pCallBack) {
                    if (this.m_bVisit) {
                        EffectUtils.showTips(GCode(CLEnum.WOR_BF_FAL4), 1, true);
                        return;
                    }
                    this.m_pCallBack(this.m_nHeroId);
                }
            })
        }

        protected dataChanged() {
            this.m_nHeroId = this.data.gid;
            this.m_pCallBack = this.data.cb;
            this.m_bVisit = this.data.visit;
            this.m_pLbName.text = GeneralModel.getGeneralName(this.m_nHeroId);
            // this.m_labelFight.text = `${this.data.fight}`;
            this.m_comFightItem.setFight(this.data.fight)
            this.m_pHeroHead.setGenId(this.m_nHeroId);

            Utils.isGray(this.m_bVisit, this);
        }
    }

}