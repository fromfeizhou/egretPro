/**
 * 内城战地图
 */
module com_main {
    export class CrossWallWarMap extends CView {
        public static NAME = 'CrossWallWarMap';

        public m_imgBg: eui.Image;
        public m_pRoot: eui.Group;
        public m_labTitle: eui.Label;
        public m_labEnemyHp: eui.Label;
        public m_btnFight: com_main.ComButton;
        public m_imgPro: eui.Image;
        public m_labPro: eui.Label;
        public m_btnFightView: eui.Image;
        public m_pAttTime: eui.Group;
        public m_labAttTime: eui.Label;
        public m_pGen0: eui.Group;
        public m_pGen1: eui.Group;
        public m_pGen2: eui.Group;
        public m_pGen3: eui.Group;
        public m_pGen4: eui.Group;
        public m_pGenLeader: eui.Group;

        private m_tMcList: GenTitleMc[];
        private m_bTick:boolean;
        private m_nCountDown:number;//倒计时
        public constructor() {
            super();
            this.name = CrossWallWarMap.NAME;
            this.initApp("cross/CrossWallWarMapSkin.exml");
        }

        public onDestroy() {
            //退出战斗
            CrossProxy.C2S_CROSS_SERVER_WAR_ENTER(4);
            this.clearTimeHandler();
            this.removeEvent();
            if (this.m_tMcList) {
                for (let mc of this.m_tMcList) {
                    if (mc) mc.onDestroy();
                }
                this.m_tMcList = null;
            }
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.width = egret.MainContext.instance.stage.stageWidth;
            this.height = egret.MainContext.instance.stage.stageHeight;
            Utils.toStageMaxScale(this.m_imgBg);
            Utils.toStageBestScaleHeigt(this.m_pRoot);

            this.m_btnFight.setTitleLabel('部队进攻');
            this.addEvent();

            this.initSceneMc();
            this.onWallUpdate();
            this.onWallStatus();
            this.initTimeTick();
            //场景创建完毕
            SceneManager.sceneCreateComplete();
        }

        /**创建动画 */
        private initSceneMc() {
            this.m_tMcList = [];
            //皇帝
            let data = CrossModel.wallInfo;
            let mc = new GenTitleMc()
            mc.setMcInfo(1002, 1.5, false, { countryId: data.countryId, name: data.nickName, factName: data.guildName, isSelf: false, titleId: 2 });
            this.m_pGenLeader.addChild(mc);
            this.m_tMcList.push(mc);
            //猛将
            let tmpList = [1017, 1010, 1005, 1021, 1036]
            for (let i = 0; i < 5; i++) {
                let tmp = new GenTitleMc()
                tmp.setMcInfo(tmpList[i], 1.2, true);
                this[`m_pGen${i}`].addChild(tmp);
                this.m_tMcList.push(tmp);
            }

            this.m_labTitle.text = data.group == 1 ? '皇城南门' : '皇城北门'
        }


        /**开战倒计时 */
        private initTimeTick(){
            this.m_nCountDown = CrossModel.openTime - TimerUtils.getServerTime();
            if(this.m_nCountDown > 0){
                this.m_bTick = true;
                this.m_nCountDown++;
                this.onTimeHandler();
                Utils.TimerManager.doTimer(1000,0,this.onTimeHandler,this);
            }
        }

        private onTimeHandler(){
            this.m_nCountDown--;
            if(this.m_nCountDown > 0){
                this.m_labAttTime.text = `${TimerUtils.diffTimeFormat('hh:mm:ss',this.m_nCountDown)}后开始进攻`;
            }else{
                this.clearTimeHandler();
            }
        }
        /**清理时间回调 */
        private clearTimeHandler(){
            if(!this.m_bTick) return;
            this.m_bTick = false;
            Utils.TimerManager.remove(this.onTimeHandler,this);
        }
        //=================================================================================================================
        //事件监听 begin
        //=================================================================================================================
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnFight, this, this.onBtnFight);
            EventManager.addTouchScaleListener(this.m_btnFightView, this, this.onBtnFightView);
            EventMgr.addEvent(CrossWarEvent.CROSS_WALL_UPDATE, this.onWallUpdate, this);
            EventMgr.addEvent(CrossWarEvent.CROSS_WALL_STATUS, this.onWallStatus, this);
            EventMgr.addEvent(CrossWarEvent.CROSS_SERVER_STATUS, this.onServerStatus, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(CrossWarEvent.CROSS_WALL_UPDATE, this);
            EventMgr.removeEventByObject(CrossWarEvent.CROSS_WALL_STATUS, this);
            EventMgr.removeEventByObject(CrossWarEvent.CROSS_SERVER_STATUS, this);
        }

        /**挑战按钮 */
        private onBtnFight() {
            Utils.open_view(TASK_UI.CROSS_HERO_PANEL);
        }

        /**hp变动 */
        private onWallUpdate() {
            if (!CrossModel.wallHp) return;
            let myHp = CrossModel.wallHp.myHpRate / 10000;
            this.m_imgPro.width = 236 * myHp;
            this.m_labPro.text = (myHp * 100).toFixed(2) + '%'

            let enemyHp = (CrossModel.wallHp.enemyHpRate / 100).toFixed(2);
            this.m_labEnemyHp.text = `敌方剩余：${enemyHp}%`;

        }
        //攻城状态刷新
        private onWallStatus() {
            this.m_btnFightView.visible = CrossModel.wallStatus == 1;
            this.m_btnFight.visible = CrossModel.crossStatus == CrossServerState.WALL_WAR;
            this.m_pAttTime.visible = !CrossModel.isWar();
        }

        /**观战 */
        private onBtnFightView() {
            if(CrossModel.wallInfo && CrossModel.wallInfo.cityId){
                WorldProxy.send_C2S_CITY_WAR_GO(CrossModel.wallInfo.cityId);
            }
        }

        /**跨服战状态切换 */
        private onServerStatus(){
            this.onWallStatus();
            if(CrossModel.crossStatus == CrossServerState.WALL_WAR){
                return;
            }
            if(CrossModel.crossStatus == CrossServerState.CITY_WAR){
                SceneManager.enterScene(SceneEnums.CROSS_WAR_MAP);
                return;
            }
            SceneManager.runSceneBefore();
        }
        //=================================================================================================================
        //事件监听 end
        //=================================================================================================================

    }
}