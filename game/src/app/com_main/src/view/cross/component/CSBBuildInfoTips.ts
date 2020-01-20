/**
 * 跨服战内城墙点击出现的按钮菜单
 */
module com_main {

    export class CSBBuildInfoTips extends CComponent {

        public m_lbName:eui.Label;
        public m_flagImg:eui.Image;
        public m_faction:eui.Label;
        public m_lbDef:eui.Label;
        public m_lbDefTower:eui.Label;
        public m_lbaAtk:eui.Label;


        private m_id: number;
        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("cross/component/CSBBuildInfoTipsSkin.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        $onRemoveFromStage(isclear = true): void {
            super.$onRemoveFromStage(false);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.touchEnabled = false;
            this.addEvent();
        }

        public onDestroy() {
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        protected addEvent() {
            // EventManager.addTouchTapListener(this.m_pBtnAtk, this, this.onclickAtk);
            // EventManager.addTouchTapListener(this.m_pBtnGo, this, this.onclickGo);
            // EventManager.addTouchTapListener(this.m_pBtnSquare, this, this.onclickSquare);
            // EventManager.addTouchTapListener(this.m_buildBtn, this, this.onclickBuild);
            // EventManager.addTouchTapListener(this.m_pBtnInfo, this, this.onclickInfo);
        }

        public setBuildId(id: number) {
            this.m_id = id;
            let cityInfo = CrossModel.getCityInfoById(this.m_id);
            let faction = cityInfo.getFaction();
            switch(faction){
                case CSBFaction.NONE:{
                    this.currentState = 'none';
                    break;
                }
                case CSBFaction.EMENY:{
                    this.currentState = 'emeny';
                    break;
                }
                case CSBFaction.OUR:{
                    this.currentState = 'OUR';
                    break;
                }
            }
            this.commitProperties();

            this.m_lbDefTower.text = cityInfo.getTowerNum().toString();
            this.m_lbDef.text = cityInfo.defTeamNum.toString();
            this.m_lbaAtk.text = cityInfo.attTeamNum.toString();

        }
    }
}