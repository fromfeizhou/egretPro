//带标题动画
module com_main {
    export class GenTitleMc extends eui.Component {
        private m_hero: CSoldiers;
        private m_headInfo: GeneralHeadTitle;
        private m_soldier: CSoldiers;

        public constructor() {
            super();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.width = 10;
            this.height = 10;
            this.touchEnabled = false;
            this.touchChildren = false;
        }
        /**设置动画标题 */
        public setMcInfo(id: number, scale?: number, isSoldier?: boolean, title?: IGenHeadTitle) {
            scale = scale || 1;

            let config: GeneralConfig = C.GeneralConfig[id];
            let gCid = config.ourModelCode as number;

            this.m_hero = CSoldiers.createId(gCid);
            this.m_hero.changeStatus(CSquare_Status.STATUS_STAND);
            this.m_hero.changeDirection(CSquare_Direction.RIGHT_UP);
            NodeUtils.setScale(this.m_hero, scale);
            this.addChild(this.m_hero); //起点为脚下站立点

            if (title) {
                this.m_headInfo = new GeneralHeadTitle();
                this.m_headInfo.setData(title);
                this.m_headInfo.anchorOffsetX = this.m_headInfo.width / 2;
                this.m_headInfo.anchorOffsetY = this.m_headInfo.height;
                this.m_headInfo.y = -110;
                this.addChild(this.m_headInfo);
            }

            if (isSoldier) {
                let gconfig = GeneralModel.getGeneralArmyConfig(id);
                let cid = gconfig.ourModelCode as number;

                this.m_soldier = CSoldiers.createId(cid);
                this.m_soldier.x = -80;
                this.m_soldier.y = 60;
                this.m_soldier.changeDirection(CSquare_Direction.RIGHT_UP);
                this.m_soldier.changeStatus(CSquare_Status.STATUS_STAND);
                this.addChild(this.m_soldier);
            }
        }

        public onDestroy(): void {
            if (this.m_headInfo) {
                this.m_headInfo.onDestroy();
                this.m_headInfo = null;
            }
            if (this.m_hero) {
                this.m_hero.onDestroy();
                this.m_hero = null;
            }
            if (this.m_soldier) {
                this.m_soldier.onDestroy();
                this.m_soldier = null;
            }
        }
    }
}