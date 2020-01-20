module com_main {
    /**
    * 上阵格子
    * @export
    * @class BaseCampPosition
    * @extends CComponent
    */
    export class TeamGirdView extends CComponent {
        public m_pHero: TeamManualSquare;
        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/team/TeamGirdViewSkin.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        $onRemoveFromStage(isclear = true): void {
            this.clearGeneral();
            super.$onRemoveFromStage(isclear);
        }


        public checkTouched(point: egret.Point) {
            const pos = this.localToGlobal()
                , dis = egret.Point.distance(pos, point);
            return dis;
        }


        public set generalId(id: number) {
            if (this.m_pHero && this.m_pHero.generalId == id) {
                return;
            }
            this.clearGeneral();
            if (id > 0) {
                this.m_pHero = new TeamManualSquare(id);
                this.m_pHero.x = 100;
                this.m_pHero.y = 80;
                this.addChild(this.m_pHero);
            }
        }
        public updateHp(hp: number, isClient: boolean = false) {
            if (this.m_pHero) {
                this.m_pHero.updateHP(hp,isClient);
            }

        }
        public get generalId(): number {
            if (this.m_pHero) {
                return this.m_pHero.generalId;
            }
            return 0;
        }

        private clearGeneral() {
            if (this.m_pHero) {
                Utils.removeFromParent(this.m_pHero);
                this.m_pHero = null;
            }
        }
    }

    /**
     * 上阵英雄方阵
     * @export
     * @class BaseManualSquare
     * @extends ManualSquare
     */
    export class TeamManualSquare extends ManualSquare {
        public static NAME: string = "TeamManualSquare";
        protected m_pLbName: eui.Label;

        private m_pHeadInfo: WorldGeneralHeadInfo = null;
        // private m_pTips: egret.DisplayObjectContainer;

        public hp: number = 0;



        public constructor(id: number) {
            super(id);
            this.name = "TeamManualSquare";
            this.width = 150;
            this.height = 150;
            this.touchChildren = true;
            this.touchEnabled = true;

            this.m_pHero.x += 60;
            this.m_pHero.y -= 10;
            this.m_pSoldier.x += 60;
            this.m_pSoldier.y -= 10;



            this.m_pHeadInfo = new WorldGeneralHeadInfo();
            const group = new eui.Group();
            group.x = 135;
            group.y = -35;
            this.addChild(group)
            group.addChild(this.m_pHeadInfo);
            this.m_pHeadInfo.setData(this.generalId);

            // }, this);

        }
        public isShowHead(visible: boolean) {
            this.m_pHeadInfo.visible = visible;
        }
        public updateHP(hp: number, isClient: boolean = false) {
            this.m_pHeadInfo.updateHP(hp)
            this.hp = hp;

            if (this.m_pLbName) {
                this.m_pLbName.visible = hp <= 0;
            }
            this.isShowSorlider(hp > 0)
            this.isShowTip(hp <= 0&&!isClient)
        }
        public onDestroy() {
            if (this.m_pHeadInfo) {
                this.m_pHeadInfo.onDestroy();
                this.m_pHeadInfo = null;
            }

            super.onDestroy();
        }
    }
}