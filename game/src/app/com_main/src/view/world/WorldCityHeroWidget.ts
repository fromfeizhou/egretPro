module com_main {

    class WorldHeroBoxWidget extends CComponent {


        public constructor() {
            super();

            this.skinName = Utils.getAppSkin("world/world_box_widget.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        public onDestroy() {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }
    }

    /**
     * 城池部队头像列表
     * @export
     * @class WorldCityHeroWidget
     * @extends egret.DisplayObjectContainer
     */
    export class WorldCityHeroWidget extends egret.DisplayObjectContainer {

        protected m_pMain: WorldHeroBoxWidget;
        protected m_bShow: boolean = false;
        protected m_aPos: number[][] = [];
        protected m_pPanel: WorldHeroBoxWidget;
        protected m_nCityId: number = 0;
        protected m_genItem: GeneralHeadRender;

        public constructor(cid: number) {
            super();
            this.m_nCityId = cid;


            this.once(egret.Event.ADDED_TO_STAGE, this.onEnter, this);
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        protected onEnter() {
            this.update();
        }

        protected $createItem(gid: number, i: number, num: number) {
            this.m_genItem = GeneralHeadRender.create("none");
            Utils.addChild(this, this.m_genItem)
            this.m_genItem.setGenId(gid)
            this.m_genItem.scaleX = 0.7;
            this.m_genItem.scaleY = 0.7;
            let x = (this.width - this.m_genItem.width * 0.7) / 2 + 3.5 * i
                , y = (this.height - this.m_genItem.height * 0.7 - 3.5 * (num - 1)) / 2 - 2 + 3.5 * i + 12;
            this.m_genItem.x = x;
            this.m_genItem.y = y;
            this.m_aPos.push([x, y])
            return this.m_genItem;
        }

        protected onDestroy() {
            if (this.m_genItem) {
                this.m_genItem.onDestroy();
                this.m_genItem = null;
            }
        }


        public checkTouchEvent(x: number, y: number) {
            if (this.m_pMain.hitTestPoint(x, y)) {
                this.show();
                return true;
            }

            this.hide();
            return false;
        }

        public show() {
            const len = this.m_aPos.length;
            if (this.m_bShow || len == 1) return;
            this.m_bShow = true;
            egret.Tween.get(this.m_pMain).to({ width: 388 }, 50, egret.Ease.elasticOut)
            if (len > 2) {
                this.m_pPanel.visible = true;
                egret.Tween.get(this.m_pPanel).to({ x: 0 }, 50, egret.Ease.elasticOut)
            }

            let pos = WorldData.getCityHeroPos(len);
            if (pos == undefined) return;
            let i = this.numChildren - 1;
            for (let p of pos) {
                let spr = this.getChildAt(i)
                    , [x, y, dt] = p;
                egret.Tween.get(spr).to({ x, y }, dt, egret.Ease.elasticOut)
                i--;
            }
        }

        public hide() {
            if (!this.m_bShow) return;
            this.m_bShow = false;
            egret.Tween.get(this.m_pMain).to({ width: 132 }, 50, egret.Ease.elasticOut)
            if (this.m_aPos.length > 2) {
                this.m_pPanel.visible = false;
                this.m_pPanel.x = 500;
            }

            let i = 2;
            for (let p of this.m_aPos) {
                let spr = this.getChildAt(i)
                    , [x, y] = p;
                egret.Tween.get(spr).to({ x, y }, i * 50, egret.Ease.bounceOut);
                i++;
            }
        }



        public update() {
            this.removeChildren();
            this.m_pMain = new WorldHeroBoxWidget();
            Utils.addChild(this, this.m_pMain);
            this.width = 132;
            this.height = 114;

            this.m_pPanel = new WorldHeroBoxWidget();
            Utils.addChild(this, this.m_pPanel);
            this.m_pPanel.width = 388;
            this.m_pPanel.x = 500;
            this.m_pPanel.y = -105;
            this.m_pPanel.visible = false;

            this.m_aPos = [];


            let heroList = [];
            // for (let i = 1; i <= FormunitModel.armyNum; i ++) {
            //     let gid = FormunitModel.getFormunitMainHero(i);
            //     if (gid == 0) continue;
            //     const hero = WorldModel.getHeroConfig(gid);
            //     if (hero.pos != this.m_nCityId || hero.status != EumWorldHeroStatus.NORMAL) continue;
            //     arr.push(gid);
            // }
            let teamVoList: TeamVo[] = TeamModel.getTeamVoListByCityId(this.m_nCityId);
            let len: number = teamVoList.length;
            for (let index = 0; index < len; index++) {
                if (teamVoList[index].teamGeneralData.length == 0)
                    continue
                // let gid: number = teamVoList[index].teamGeneralData[0].generalId;
                let gid: number = TeamModel.getTeamMainHero(teamVoList[index]);
                if (gid == 0)
                    continue;
                heroList.push(gid);
            }
            let num = heroList.length;
            if (num == 0) {
                Utils.removeFromParent(this);
                return false;
            }
            let i = 0;
            for (let gid of heroList) {
                this.$createItem(gid, i, num);
                i++;
            }
            return true;
        }

    }

}