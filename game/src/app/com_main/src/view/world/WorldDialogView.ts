// TypeScript file			this.m_imgCard.source = GeneralModel.getSoldierBigLogo(info.config.role)
module com_main {
	/**
	 * 世界解锁对话框
	 */
    export class WorldDialogView extends GuideDialogView {
        public static NAME = 'WorldDialogView';

        public m_nCid: number = 0;
        public m_step: WorldLockTaskStep = 1;
        public m_taskCfg: WorldMapUnlockTaskConfig;
        public constructor(data: any) {
            super(data.id);
            this.name = WorldDialogView.NAME;
            this.m_nId = data.id;
            this.m_nCid = data.cityId;
            this.m_step = data.step;
        }

        protected initCfgIcon() {
            let cfg = C.GuideDialogConfig[201];
            if (!cfg) {
                this.closeDialog();
                return;
            }
            this.m_taskCfg = C.WorldMapUnlockTaskConfig[this.m_nId];

            this.m_tDesList = JSON.parse(GLan(cfg.dialog));

            this.m_mcList = [];
            let icons: number[] = JSON.parse(cfg.generalId);
            let names = JSON.parse(GLan(cfg.name));
            for (let i = 0; i < icons.length; i++) {
                this.createIcon(cfg.type, icons[i], names[i], i);
            }
            this.m_pSkipRoot.visible = false;
            this.initView()
            this.updateDialog();
        }
        public updateDialog() {
            if (isNull(this.m_taskCfg))
                return;
            if (this.m_step == WorldLockTaskStep.STATR) {
                this.m_pLbDec.textFlow = Utils.htmlParser(GLan(this.m_taskCfg.UnlockText1));
            } else {
                this.m_pLbDec.textFlow = Utils.htmlParser(GLan(this.m_taskCfg.UnlockText3));
            }
        }

        protected closeDialog() {
            UpManager.history();
            if (this.m_step == WorldLockTaskStep.STATR) {
                Utils.open_view(TASK_UI.POP_WORLD_LOCK_TASK_PANEL, { id: this.m_nId, cityId: this.m_nCid })
            } else {
                Utils.open_view(TASK_UI.POP_WORLD_NEW_OPEN_PANEL, { id: this.m_nId, cityId: this.m_nCid })
            }

        }
    }
}