
module com_main {

	/**
	 * 世界地图事件图标
	 */
    export class MapBoss extends CComponent {
        public static NAME = 'MapBoss';

        public m_imgBossEff: eui.Image;
        public m_imgAttEff: eui.Image;
        public m_titleName: com_main.BuildTitle;
        public m_imgAttFlag: eui.Image;

        public bossType: BossType;
        private m_bossEff: com_main.SpriteAnimation;
        private m_attEff: com_main.SpriteAnimation;
        private m_nDialogIndex: number;

        public constructor(type: BossType) {
            super();
            this.name = MapBoss.NAME;
            this.bossType = type;
            this.skinName = Utils.getAppSkin("map/MapBossSkin.exml");
        }

        /**
        * 销毁方法
        */
        public onDestroy() {
            if (this.m_bossEff) {
                this.m_bossEff.removeAction();
                this.m_bossEff = null;
            }

            if (this.m_attEff) {
                this.m_attEff.removeAction();
                this.m_attEff = null;
            }

            // Utils.TimerManager.remove(this.talkFunc, this);
            super.onDestroy();

        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_bossEff = ImageEffect.load_2('EBuild_Boss_' + this.bossType);
            this.m_bossEff.addBitmap(this.m_imgBossEff);
            // this.m_titleName.setTitleName(this.getBossName());
            this.updateBossView();
            this.m_nDialogIndex = 0;
            egret.setTimeout(() => {
                if(this.m_bossEff){
                    // this.talkFunc();
                    // Utils.TimerManager.doTimer(60000, 0, this.talkFunc, this);
                }
            }, this, this.bossType * 10000);
        }

        /**刷新boss显示 */
        public updateBossView() {
            // if (BossModel.JudgeIsFight(this.bossType).res) {
            //     if (!this.m_attEff) {
            //         this.m_attEff = ImageEffect.load_2('EBuild_BossRage');
            //         this.m_attEff.addBitmap(this.m_imgAttEff);
            //     }
            //     this.m_imgAttEff.visible = true;
            //     this.m_imgAttFlag.visible = true;
            // } else {
            //     this.m_imgAttEff.visible = false;
            //     this.m_imgAttFlag.visible = false;
            // }
        }

        /**检测是否点中图标 */
        public check_is_touch(x: number, y: number): boolean {
            return this.m_imgBossEff.hitTestPoint(x, y, true);
        }

        // private getBossName() {
        //     let info = BossModel.getInfobyType(this.bossType);
        //     if (info) {
        //         let bossCfg = C.BossConfig[info.id];
        //         if (bossCfg == null) return "";
        //         let cfg = GeneralData.getGeneralConfig(Number(bossCfg.model));
        //         return GLan(cfg.name);
        //     }
        //     return "武将";
        // }

        /**获得boss对白 */
        // private getDialogStr() {
        //     let info = BossModel.getInfobyType(this.bossType);
        //     if (info) {
        //         let list = C.BossDialogConfigDic[info.id] as BossDialogConfig[]
        //         if (!list) return '';
        //         if(this.m_nDialogIndex >= list.length){
        //             this.m_nDialogIndex = 0;
        //         }
        //         return list[this.m_nDialogIndex++].dialog;
        //     }
        //     return '';
        // }

        /**聊天 */
        // private talkFunc() {
        //     let talkFrame = new TalkFrame(this.getDialogStr(), 4000, 'mapboss');
        //     Utils.addChild(this, talkFrame);
        //     egret.callLater(() => {
        //         let x = -157;
        //         let y = 95 - talkFrame.height;
        //         talkFrame.x = x;
        //         talkFrame.y = y;
        //     }, this);
        // }

    }
}