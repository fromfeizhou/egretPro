/**
 * 跨服战内城墙建筑
 */
module com_main {

    export class CSBBuildingComp extends CComponent {

        public m_buildImg: eui.Image;
        public m_effNode: eui.Group;
        public m_title: eui.Group;
        public m_flagImg: eui.Image;
        public m_faction: eui.Label;
        public m_cityName: eui.Label;
        public m_topBtn: eui.Group;
        public m_bili: eui.Label;
        public m_warBtn: eui.Group;

        private m_pBattleEffect: MCDragonBones;
        private m_buildId: number = 0;
        private m_isSelect: boolean = false;
        private m_pos: Point;



        private static buildInfo = {
            "1": { posOffX: 0, posOffY: 50, fireOffX: 20, fireOffY: 0, fireName: 'zhanhuo4' },
            "2": { posOffX: 0, posOffY: 0, fireOffX: 60, fireOffY: 20, fireName: 'zhanhuo7' },
            "3": { posOffX: 0, posOffY: 0, fireOffX: 0, fireOffY: 0, fireName: 'zhanhuo6' },
            "4": { posOffX: 0, posOffY: 0, fireOffX: 0, fireOffY: 0, fireName: 'zhanhuo5' },
            "5": { posOffX: 0, posOffY: 0, fireOffX: 0, fireOffY: 0, fireName: 'zhanhuo6' },
            "6": { posOffX: 0, posOffY: 40, fireOffX: 0, fireOffY: 0, fireName: '' },
            "7": { posOffX: 0, posOffY: 30, fireOffX: 0, fireOffY: 0, fireName: '' },
        }
        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("cross/component/CSBBuildingSkin.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_buildImg.pixelHitTest = true;
            this.touchEnabled = false;

            EventManager.addTouchTapListener(this.m_topBtn, this, this.onClickTopBtn);
            EventManager.addTouchScaleListener(this.m_warBtn, this, this.onClickWatchBattle);
        }

        public set select(boo: boolean) {
            if (boo == this.m_isSelect) return;
            this.m_isSelect = boo;
            Utils.isGlow(boo, this.m_buildImg);
        }

        public get select() {
            return this.m_isSelect;
        }

        public set bId(id: number) {
            this.m_buildId = id;
            this.m_pos = new Point(this.x + this.width / 2, this.y + this.height / 2 + CSBBuildingComp.buildInfo[this.m_buildId].posOffY);
            // this.refreshCityName();
            // this.refreshCityState();
        }

        public get bId() {
            return this.m_buildId;
        }

        public onDestroy() {
            this.removeFire();
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        public getPoint(): Point {
            if (this.m_pos) return this.m_pos;
            return Point.create({ x: 0, y: 0 });
        }

        public refreshCityName() {
            let data = CrossModel.getCityInfoById(this.m_buildId);
            if(data){
                this.m_cityName.text = data.getCityName();                
            }
        }

        public refreshCityState() {
            this.refreshCityName();
            let data = CrossModel.getCityInfoById(this.m_buildId);
            if (data) {
                let faction = data.getFaction();
                if (faction == CSBFaction.OUR) {
                    this.m_flagImg.source = 'zyt_vs_blue_png'
                    this.m_faction.strokeColor = 0x173e96;
                    this.m_faction.text = '我'
                    this.m_flagImg.visible = true;
                    this.m_faction.visible = true;
                } else if(faction == CSBFaction.NONE){
                    this.m_flagImg.visible = false;
                    this.m_faction.visible = false;
                }else if(faction == CSBFaction.EMENY){
                    this.m_flagImg.source = 'zyt_vs_red_png'
                    this.m_faction.strokeColor = 0x961717;
                    this.m_faction.text = '敌'
                    this.m_flagImg.visible = true;
                    this.m_faction.visible = true;
                } 

                if(data.status == 0){
                    this.m_warBtn.visible = false;
                    this.removeFire();
                }else if(data.status == 1){
                    this.m_warBtn.visible = true;
                    this.showFire();
                }

                if(data.isMyCamp()){
                    this.m_topBtn.visible = true;
                    this.refreshCampHp();
                }
            }
        }

        public refreshCampHp(){
            let crossServerConst: CrossServerConstConfig = C.CrossServerConstConfig[CrossServerConstType.MAX_TROOPS];
		    let maxTroop = unNull(crossServerConst) ? Number(crossServerConst.value) : 0;
            this.m_bili.text = Math.floor(CrossModel.curTroop / maxTroop * 100) + '%';
        }

        public showFire() {
            if (this.m_buildId > 5) return;
            if (this.m_pBattleEffect) return ;
            let effectMC = new MCDragonBones();
            this.m_pBattleEffect = effectMC;
            effectMC.initAsync(IETypes.EWORLD_City_Fire);
            effectMC.x = this.width / 2;
            effectMC.y = this.height / 2;
            this.m_effNode.addChild(this.m_pBattleEffect);

            this.m_pBattleEffect.play(CSBBuildingComp.buildInfo[this.m_buildId].fireName);
            NodeUtils.setPosition(this.m_pBattleEffect, this.width / 2 + CSBBuildingComp.buildInfo[this.m_buildId].fireOffX, this.height / 2 + CSBBuildingComp.buildInfo[this.m_buildId].fireOffY);
        }

        public removeFire() {
            if (this.m_pBattleEffect) {
                this.m_pBattleEffect.destroy();
                this.m_pBattleEffect = null;
            }
        }

        private onClickTopBtn() {
            console.log('点击兵库');
            Utils.open_view(TASK_UI.CROSS_BARRACKS, this.m_buildId);
            // Utils.open_view(TASK_UI.CROSS_BUY_TOWER_PANEL, this.m_buildId);
        }

        private onClickWatchBattle(){
            console.log('观看战斗');
            let cityInfo = CrossModel.getCityInfoById(this.m_buildId)
            WorldProxy.send_C2S_CITY_WAR_GO(cityInfo.warAreaId);
        }

    }

}