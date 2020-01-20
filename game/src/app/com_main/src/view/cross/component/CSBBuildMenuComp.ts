/**
 * 跨服战内城墙点击出现的按钮菜单
 */
module com_main {

    export class CSBBuildMenuComp extends CComponent {

        public m_pMenu: eui.Group;
        public m_pBg: com_main.CImage;
        public m_pBtnGo: eui.Group;
        public m_buildBtn: eui.Group;
        public m_pBtnSquare: eui.Group;
        public m_pBtnAtk: eui.Group;
        public m_pBtnInfo: eui.Group;


        private m_id: number;
        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("cross/component/CSBBuildMenuSkin.exml");
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
            EventManager.addTouchTapListener(this.m_pBtnAtk, this, this.onclickAtk);
            EventManager.addTouchTapListener(this.m_pBtnGo, this, this.onclickGo);
            EventManager.addTouchTapListener(this.m_pBtnSquare, this, this.onclickSquare);
            EventManager.addTouchTapListener(this.m_buildBtn, this, this.onclickBuild);
            EventManager.addTouchTapListener(this.m_pBtnInfo, this, this.onclickInfo);
        }

        public setBuildId(id: number) {
            this.m_id = id;

            let cityInfo = CrossModel.getCityInfoById(this.m_id);
            this.currentState = cityInfo.getMenuStatus();
            // this.
        }

        private onclickAtk() {
            // console.log('攻击 id', this.m_id)
            let info = CrossModel.getCityInfoById(this.m_id)
            if(info){
                Utils.open_view(TASK_UI.CROSS_HERO_PANEL, info.warAreaId);
            }
            this.visible = false;
        }

        private onclickGo() {
            // console.log('派遣 id', this.m_id)
            let info = CrossModel.getCityInfoById(this.m_id)
            if(info){
                Utils.open_view(TASK_UI.CROSS_HERO_PANEL, info.warAreaId);
            }
            this.visible = false;
        }

        private onclickSquare() {
            // console.log('部队派遣 id', this.m_id)
            let info = CrossModel.getCityInfoById(this.m_id)
            if(info){
                CrossProxy.send_C2S_CROSS_SERVER_TEAM_MOVE(2,0,info.warAreaId);
            }
            this.visible = false;
        }

        private onclickBuild(){
            // console.log('建造箭塔 id', this.m_id)
            // Utils.open_view(TASK_UI.CROSS_BUY_TOWER_PANEL, this.m_id);
            EffectUtils.showTips('功能未开放，敬请期待');
        }

        private onclickInfo(){
            // console.log('详情 id', this.m_id)
            com_main.EventMgr.dispatchEvent(CrossWarEvent.CROSS_BUILD_INFO, this.m_id);
        }

    }

}