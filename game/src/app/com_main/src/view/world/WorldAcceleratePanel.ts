module com_main {

    /**
     * 行军加速面板
     */
    export class WorldAcceleratePanel extends CView {

        public static readonly NAME = "WorldAcceleratePanel";
        public m_pBtnClose: eui.Group;
        public m_pLbName1: eui.Label;
        public m_pItem1: com_main.ComItemNew;
        public m_pBtnOk1: eui.Group;
        public m_btnOk1: com_main.ComButton;
        public m_btnGoldOK1: com_main.ComCostTextButton;
        public m_pLbName2: eui.Label;
        public m_pItem2: com_main.ComItemNew;
        public m_pBtnOk2: eui.Group;
        public m_btnOk2: com_main.ComButton;
        public m_btnGoldOK2: com_main.ComCostTextButton;
        public m_pLbTime: eui.Label;
        public m_pPrTime: com_main.CImage;



        private m_teamKey: string; //队伍id
        private m_bTouch: boolean = false;
        private m_nDt: number = 0;
        private m_nAllDt: number = 0;
        private m_gold_accel1: number = 0;//加速25需要的元宝
        private m_gold_accel2: number = 0;//加速50需要的元宝
        public constructor(data: any) {
            super();
            this.name = WorldAcceleratePanel.NAME;
            this.m_teamKey = data.teamKey;
            this.initApp("world/world_accelerate_panel.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_TEAMMOVE_QUICKEN,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_TEAMMOVE_QUICKEN: {
                    this.m_bTouch = false;
                    EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_SPEED), 1);
                    this.__reset();
                    break;
                }
            }
        }

        public onDestroy(): void {
            Utils.TimerManager.remove(this.update, this);
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            SoundData.setSound(this.m_pBtnClose, SoundData.SOUND_CANCEL);


            EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.freshItem, this);

            this.__resetTime();
            this.m_btnOk1.setTitleLabel(GCode(CLEnum.BAG_USE));
            this.m_btnOk2.setTitleLabel(GCode(CLEnum.BAG_USE));

            this.m_gold_accel1 = Number(ConstUtil.getStringArray(IConstEnum.TEAM_GOLD_COIN_ACCELERATION)[0].split("_")[1])
            this.m_gold_accel2 = Number(ConstUtil.getStringArray(IConstEnum.TEAM_GOLD_COIN_ACCELERATION)[1].split("_")[1])
            this.m_btnGoldOK1.setCostLabel(`${this.m_gold_accel1}`)
            this.m_btnGoldOK2.setCostLabel(`${this.m_gold_accel2}`)

            this.m_btnGoldOK1.setTitleLabel(GCode(CLEnum.BUY_AND_USE))
            this.m_btnGoldOK2.setTitleLabel(GCode(CLEnum.BUY_AND_USE))

            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            let scale = this.m_nAllDt == 0 ? 0 : this.m_nDt / this.m_nAllDt;
            this.m_pPrTime.scaleX = scale > 1 ? 1 : scale;
            Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, () => {
                Utils.TimerManager.remove(this.update, this);
                UpManager.history();
            });
            this.freshItem();
            this.initEvent();
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        private initEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnClose, this, () => {
                UpManager.history();
            })
            EventManager.addTouchScaleListener(this.m_btnOk1, this, this.__on_click);
            EventManager.addTouchScaleListener(this.m_btnOk2, this, this.__on_click_all);

            EventManager.addTouchScaleListener(this.m_btnGoldOK1, this, this.__on_click_gold);
            EventManager.addTouchScaleListener(this.m_btnGoldOK2, this, this.__on_click_gold_all);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            EventManager.removeEventListeners(this);
        }
        /**=====================================================================================
     * 事件监听 end
     * =====================================================================================
     */

        private freshItem() {
            this.m_pItem1.setItemInfo(PropEnum.MarchSpeedItem1, PropModel.getPropNum(PropEnum.MarchSpeedItem1));
            this.m_pItem2.setItemInfo(PropEnum.MarchSpeedItem2, PropModel.getPropNum(PropEnum.MarchSpeedItem2));
            if (PropModel.getPropNum(PropEnum.MarchSpeedItem1) == 0) this.m_pItem1.m_labCount.text = "0"
            if (PropModel.getPropNum(PropEnum.MarchSpeedItem2) == 0) this.m_pItem2.m_labCount.text = "0"

            this.m_pBtnOk1.visible = PropModel.getPropNum(PropEnum.MarchSpeedItem1) > 0;
            this.m_pBtnOk2.visible = PropModel.getPropNum(PropEnum.MarchSpeedItem2) > 0;

            this.m_btnGoldOK1.visible = PropModel.getPropNum(PropEnum.MarchSpeedItem1) == 0;
            this.m_btnGoldOK2.visible = PropModel.getPropNum(PropEnum.MarchSpeedItem2) == 0;
        }

        private __on_click(e: egret.Event) {
            if (this.m_bTouch) return

            let data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (data && this.__checkCanUseItem(PropEnum.MarchSpeedItem1)) {
                this.m_bTouch = true;
                WorldProxy.C2S_TEAMMOVE_QUICKEN(data.teamId, PropEnum.MarchSpeedItem1, 1);
            }
        }

        private __on_click_gold(e: egret.Event) {
            if (this.m_bTouch) return
            if (PropModel.isItemEnough(PropEnum.GOLD, this.m_gold_accel1, 2)) {
                let data = WorldModel.getTeamMoveData(this.m_teamKey);
                if (data) {
                    this.m_bTouch = true;
                    WorldProxy.C2S_TEAMMOVE_QUICKEN(data.teamId, PropEnum.MarchSpeedItem1, 2);
                }
            }
        }

        private __on_click_all(e: egret.Event) {
            if (this.m_bTouch) return

            let data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (data && this.__checkCanUseItem(PropEnum.MarchSpeedItem2)) {
                this.m_bTouch = true;
                WorldProxy.C2S_TEAMMOVE_QUICKEN(data.teamId, PropEnum.MarchSpeedItem2, 1);
            }
        }

        private __on_click_gold_all(e: egret.Event) {
            if (this.m_bTouch) return
            if (PropModel.isItemEnough(PropEnum.GOLD, this.m_gold_accel2, 2)) {
                let data = WorldModel.getTeamMoveData(this.m_teamKey);
                if (data) {
                    this.m_bTouch = true;
                    WorldProxy.C2S_TEAMMOVE_QUICKEN(data.teamId, PropEnum.MarchSpeedItem2, 2);
                }
            }
        }
        private update() {
            this.m_nDt--;
            if (this.m_nDt < 0) return;
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);

            let scale = this.m_nAllDt == 0 ? 0 : this.m_nDt / this.m_nAllDt;
            egret.Tween.get(this.m_pPrTime).to({ scaleX: scale > 1 ? 1 : scale }, 1000);

            if (this.m_nDt < 0) {
                Utils.TimerManager.remove(this.update, this);
                UpManager.history();
            }

        }

        private __reset() {
            Utils.TimerManager.remove(this.update, this);
            this.__resetTime();
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            let scale = this.m_nAllDt == 0 ? 0 : this.m_nDt / this.m_nAllDt;
            this.m_pPrTime.scaleX = scale > 1 ? 1 : scale;
            Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, () => {
                Utils.TimerManager.remove(this.update, this);
                UpManager.history();
            });
        }

        /**重置队伍时间 */
        private __resetTime() {
            let data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (data) {
                this.m_nAllDt = data.endTime - data.startTime;
                this.m_nDt = data.endTime - TimerUtils.getServerTime();
                this.m_nDt = this.m_nDt <= 0 ? 0 : this.m_nDt;
            }
        }

        /**判断能否使用加速道具 */
        private __checkCanUseItem(itemId: number) {
            let data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (this.m_nDt < 10) {
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_SP_FAL), 1, true);
                return false;
            }
            if (!PropModel.isItemEnough(itemId, 1, 1)) {
                return false;
            }
            return true;
        }


    }

}