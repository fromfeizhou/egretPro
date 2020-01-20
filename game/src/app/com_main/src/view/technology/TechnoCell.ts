module com_main {
    export class TechnoCell extends CComponent {

        public m_imgIcon: com_main.CImage;
        public m_labName: eui.Label;
        public m_labLv: eui.Label;
        public m_pTimeRoot: eui.Group;
        public m_labTime: com_main.CLabel;
        public m_pEffectImage: com_main.CImage;
        private m_grayGroup: eui.Group;

        private m_tTechnoVo: TechnoVo;
        private m_nId: number;
        private m_pEffect: com_main.SpriteAnimation;
        private m_tTimeData: gameProto.ITechnologyUpgradeState;

        public constructor(id: number) {
            super();
            this.m_nId = id;
            this.skinName = Utils.getSkinName("app/technology/TechnoCellSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            this.removeUpLvEff();
            this.delTimeHandler();
            EventMgr.removeEventByObject(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this);
            EventMgr.removeEventByObject(TechnologyEvent.TECHNOLOGY_TIME_UP, this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            AnchorUtil.setAnchorCenter(this);
            this.m_tTechnoVo = TechnoModel.getTechVoById(this.m_nId);
            this.refreshView();
            EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_INFO_UPDATE, this.onTechnoInfoUpdate, this);
            EventMgr.addEvent(TechnologyEvent.TECHNOLOGY_TIME_UP, this.onTechnoTimeUp, this);

            if (this.m_tTechnoVo && this.isShowRed) RedPointModel.AddInfoListener(this, { x: 131, y: 33 }, [RedEvtType.TECHNO], 3, { teachType: this.m_tTechnoVo.type, teachId: this.m_tTechnoVo.id });
        }

        /**升级 */
        private onTechnoTimeUp(id: number) {
            if (this.m_nId == id) {
                this.refreshLevel();
                this.refreshUpLvEffect();
            }
        }

        /**开启事件 */
        public openEvent() {
            EventManager.addTouchScaleListener(this, this, this.onCellClick);
        }

        /**刷新显示 */
        private onTechnoInfoUpdate(id: number) {
            if (this.m_nId == id) {
                this.refreshView();
            }
        }

        /**设置id */
        public set technoId(id: number) {
            if (this.m_nId == id) return;
            this.m_nId = id;
            this.m_tTechnoVo = TechnoModel.getTechVoById(id);
            this.refreshView();
        }

        /**点击回调 */
        private onCellClick() {
            Utils.open_view(TASK_UI.POP_TECHNOLOGY_PANEL, this.m_nId);
        }

        /**刷新显示 */
        private refreshView() {
            if (!this.m_tTechnoVo) return;
            let cfg = this.m_tTechnoVo.techCfg;
            this.m_labName.text = GLan(cfg.name);
            this.m_imgIcon.source = TechnoModel.getIcon(this.m_nId);
            this.refreshLevel();
            this.refreshUpLvEffect();
        }

        /**刷新升级特效 */
        private refreshUpLvEffect() {
            if (TechnoModel.isInUpLv(this.m_nId)) {
                this.createUpLvEff();
                this.addTimeHandler();
            } else {
                this.removeUpLvEff();
                this.delTimeHandler();
            }
        }

        /**刷新等级 */
        private refreshLevel() {
            if (this.m_tTechnoVo.level > 0 || TechnoModel.isInUpLv(this.m_nId)) {
                Utils.isGray(false, this.m_grayGroup);
                let levelStr = GCodeFromat(CLEnum.TEC_LEVEL_NUM,this.m_tTechnoVo.level,this.m_tTechnoVo.maxLevel);
                this.m_labLv.textFlow =Utils.htmlParser(levelStr);
            } else {
                this.m_labLv.text = `${this.m_tTechnoVo.level}/${this.m_tTechnoVo.maxLevel}`;
                Utils.isGray(true, this.m_grayGroup);
            }
        }


        /**显示升级特效 */
        private createUpLvEff() {
            if (!this.m_pEffect) {
                this.m_pEffect = ImageEffect.load_2(IETypes.ETechnology_UpGrade);
                this.m_pEffect.addBitmap(this.m_pEffectImage);
            }
            this.m_pEffectImage.visible = true;
        }

        /**移除特效 */
        private removeUpLvEff() {
            if (this.m_pEffect) {
                this.m_pEffect.removeAction();
                this.m_pEffect = null;
                this.m_pEffectImage.visible = false;
            }
        }

        /**添加倒计时 */
        private addTimeHandler() {
            Utils.TimerManager.remove(this.timeCall, this);
            this.m_pTimeRoot.visible = true;
            this.m_tTimeData = TechnoModel.getTimeData();
            Utils.TimerManager.doTimer(1000, 0, this.timeCall, this);
            this.timeCall();
        }

        /**移除倒计时 */
        private delTimeHandler() {
            this.m_pTimeRoot.visible = false;
            Utils.TimerManager.remove(this.timeCall, this);
            this.m_tTimeData = null;
        }

        /**倒计时回调 */
        private timeCall() {
            let time = this.m_tTimeData.end - this.m_tTimeData.speed - TimerUtils.getServerTime();
            this.m_labTime.text = Utils.DateUtils.getFormatBySecond(time, 1);
        }


        private isShowRed: boolean = true;
        /**红点移除 */
        public removeRed(): void {
            this.isShowRed = false;
            RedPointModel.RemoveInfoListenerByCode(this.hashCode);
        }

    }
}