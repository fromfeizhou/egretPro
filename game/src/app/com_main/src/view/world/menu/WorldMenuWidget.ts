module com_main {

    /**
     * 世界地图菜单基类
     * @export
     * @class WorldMenuComponent
     * @extends CComponent
     */
    export class WorldMenuComponent extends CView {

        protected m_pGInfo: eui.Group;
        protected m_pBg: CImage;
        protected m_nOrginY: number = 0;

        public constructor() {
            super();
        }
        public hitPoint(x: number, y: number) { return false; }


        protected childrenCreated(): void {
            super.childrenCreated();
            this.setBgTween(true);
            AnchorUtil.setAnchorCenter(this);
        }

        private setBgTween(isShow: boolean) {
            if (!this.m_pBg) return
            egret.Tween.removeTweens(this.m_pBg);
            if (isShow) {
                this.m_pBg.alpha = 0;
                this.m_pGInfo.visible = false;
                egret.Tween.get(this.m_pBg).to({ alpha: 1 }, 300).call(() => {
                    if (this.m_pGInfo) this.m_pGInfo.visible = true;
                });
            } else {
                egret.Tween.get(this.m_pBg).to({ alpha: 0 }, 500);
                this.m_pGInfo.visible = false;
            }
        }

        public removeFromParent(btn?: egret.DisplayObject[]) {
            this.name = '';
            this.setBgTween(false);
            this.hideBtnTween(btn)
            Utils.TimerManager.doTimer(300, 1, super.removeFromParent, this);
        }

        protected showBtnTween(btn: egret.DisplayObject[], point: number[][]) {
            for (let i in btn) {
                let o = btn[i];
                if (o) {
                    NodeUtils.setPosAndScale(o, 202, this.m_nOrginY, 0);
                    let [x, y] = point[i];
                    let scaleX = 1, scaleY = 1;
                    egret.Tween.get(o).to({ x, y, scaleX, scaleY }, 300);
                }

            }
        }

        protected hideBtnTween(btn: egret.DisplayObject[] = []) {
            for (let i in btn) {
                let o = btn[i];
                let x = 202, y = this.m_nOrginY, scaleX = 0, scaleY = 0;
                egret.Tween.get(o).to({ x, y, scaleX, scaleY }, 300);
            }
        }

        protected initBtn(btn: egret.DisplayObject[]) {
            for (let i in btn) {
                let o = btn[i];
                NodeUtils.setPosAndScale(o, 202, 0, 0);
            }
        }


    }

    /**
     * 城市菜单
     * @export
     * @class WorldMenuWidget
     * @extends WorldMenuComponent
     */
    export class WorldMenuWidget extends WorldMenuComponent {

        public m_pGInfo: eui.Group;
        public m_imgBg: com_main.CImage;
        public m_labName: eui.Label;
        public m_labType: eui.Label;
        public m_comState: com_main.ComState;
        public m_labLeader: eui.Label;
        public m_pTitle: eui.Label;
        public m_scCityBuff: eui.Scroller;
        public m_pCityBuff: eui.Group;
        public m_btnLeft: eui.Group;
        public m_btnRight: eui.Group;
        public m_pGScroller: eui.Group;
        public m_labNpcNum: eui.Label;
        public m_labNpcLv: eui.Label;
        public m_labPlayreNum: eui.Label;
        public m_desc: eui.Label;
        public m_pMenu: eui.Group;
        public m_pBg: com_main.CImage;
        public m_pBtnAttack: eui.Group;
        public m_pBtnTruce: eui.Group;
        public m_pBtnInfo: eui.Group;
        public m_pBtnVisit: eui.Group;
        public m_pBtnGo: eui.Group;
        public m_pBtnTroop: eui.Group;
        public m_pBtnBuild: eui.Group;



        private m_pConfig: WorldMapConfig;
        private teamVoList: TeamVo[] = [];
        private reduceTimePercent: number;//NPC驻军恢复时间减少值万分比
        private defaultTime: number;//默认NPC驻军时间秒

        public get config(): WorldMapConfig {
            return this.m_pConfig;
        }

        public constructor(conf: WorldMapConfig) {
            super();
            this.name = "WorldMenu";
            this.m_pConfig = conf;
            this.reduceTimePercent = 0;
            this.defaultTime = 0;
            this.initApp("world/world_menu_widget.exml");
            this.cacheAsBitmap = true;
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_CITY_MADE_INFO,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CITY_MADE_INFO: {
                    this.addCityBuff();
                    break;
                }
            }
        }

        public $onRemoveFromStage() {
            this.onDestroy();
            WorldView.callFunc(WORLD_FUNC.SET_CITYNAME_STATUS, this.m_pConfig.id);
            EventManager.removeEventListener(this.m_pBtnGo);
            EventManager.removeEventListener(this.m_pBtnVisit);
            EventManager.removeEventListener(this.m_pBtnInfo);
            EventManager.removeEventListener(this.m_pBtnAttack);
            EventManager.removeEventListener(this.m_pBtnTruce);
            EventManager.removeEventListener(this.m_pBtnBuild);
            this.m_pConfig = null;
            this.reduceTimePercent = 0;
            this.defaultTime = 0;
            super.$onRemoveFromStage();
            // SceneResGroupCfg.clearModelRes([ModuleEnums.CITY_BUILD_BUFF]);
        }

        protected childrenCreated(): void {
            // this.m_pBtnTroop.x = 255;
            this.setStatus();
            super.childrenCreated();
            this.m_comState.setDefautName(GCode(CLEnum.STATE_ZL), 18);
            // this.updateVisitBtnShow();


            // EventManager.addTouchScaleListener(this.m_pBtnInfo, this, this.onInfoClick);
            // EventManager.addTouchScaleListener(this.m_pBtnVisit, this, this.onVisitClick);
            // EventManager.addTouchScaleListener(this.m_pBtnGo, this, this.onGoClick);
            // EventManager.addTouchScaleListener(this.m_pBtnAttack, this, this.onAttackClick);
            // EventManager.addTouchScaleListener(this.m_pBtnTruce, this, this.onTruceClick);

            this.m_labName.text = GLan(this.m_pConfig.name);
            this.m_labType.text = `${GCodeFromat(CLEnum.LEVEL1, this.m_pConfig.initCityLv)} ${WorldModel.getCityTypeName(this.m_pConfig.level)}`;
            this.m_pTitle.text = this.m_pConfig.mapId == SceneEnums.WORLD_XIANGYANG_CITY && this.m_pConfig.type !== CityType.XIANG_BIRTH ? "怪物部队" : "税收奖励"
            if (this.m_pConfig.reward || this.m_pConfig.type == CityType.XIANG_BIRTH) {
                let awardStr = this.m_pConfig.reward;
                if (this.m_pConfig.reward == "") {
                    awardStr = C.WorldMapConfig[this.m_pConfig.mapCity].reward;
                }
                let award = Utils.parseCommonItemJson(awardStr);
                for (let info of award) {
                    let item = ComItemNew.create('count');
                    this.m_pGScroller.addChild(item);
                    item.scaleX = 0.75;
                    item.scaleY = 0.75;
                    item.setItemInfo(info.itemId, info.count);
                }
            }
            if (this.m_pConfig.type !== CityType.XIANG_BIRTH && SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
                this.m_pGScroller.removeChildren();
                let awardStr: string = ConstUtil.getString(IConstEnum.XIANGYANG_MONSTER)
                let heroInfos = JSON.parse(awardStr);
                for (let i = 0; i < heroInfos.length; i++) {
                    let item: GeneralHeadRender = GeneralHeadRender.create("arena");
                    let info = heroInfos[i];
                    let id: number = parseInt(info[0]);
                    let starNum: number = info[1];
                    let level: number = info[2];
                    item.scaleX = 0.6;
                    item.scaleY = 0.6;
                    item.setGenViewInfo(id, level, starNum);
                    this.m_pGScroller.addChild(item);
                }
            }
            let config = WorldModel.getCityBuildInfo(this.m_pConfig.id);
            if (config.prefect != '') {
                this.m_labLeader.text = GCodeFromat(CLEnum.WOR_PRE_NAME, config.prefect)
            } else {
                this.m_labLeader.text = GCode(CLEnum.WOR_PRE_NONE);
            }
            this.m_comState.stateId = config.country;

            this.m_labNpcLv.text = `${this.m_pConfig.initCityLv}`
            this.m_labNpcNum.text = `${config.npcGarrisonCount}`
            this.m_labPlayreNum.text = `${config.playerGarrisonCount}`

            // this.teamVoList = TeamModel.getTeamVoListByCityId(config.id);
            // let len: number = this.teamVoList.length;
            // this.m_pBtnTroop.visible = len > 0;
            // this.m_pBtnVisit.x = this.m_pBtnTroop.visible ? 155 : 202;
            // 每分钟恢复时间 180,60,100
            let nValue = ConstUtil.getNumArray(IConstEnum.CITY_RECOVERY_FORCE);
            this.defaultTime = nValue[0] ? nValue[0] : 180;
            let nMinute2 = (this.defaultTime / 60).toFixed(1);//分
            this.m_desc.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_TROOP_TIPS, nMinute2, 1));
            egret.callLater(() => {
                if (this.m_pConfig) {
                    this.validateNow();
                    let arrPoint = []
                        , arr = [this.m_pBtnInfo, this.m_pBtnVisit, this.m_pBtnGo, this.m_pBtnAttack, this.m_pBtnTruce, this.m_pBtnTroop, this.m_pBtnBuild]

                    for (let o of arr) {
                        if (o) {
                            arrPoint.push([o.x, o.y])
                        }
                    }
                    this.showBtnTween(arr, arrPoint);
                }
            }, this)
            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_pBtnBuild, { x: 50, y: -5 }, [RedEvtType.WORLD_CITY_BUILD], 2, { cityId: this.m_pConfig.id });
            // this.addCityBuff();
            CityBuildProxy.C2S_CITY_MADE_INFO(this.m_pConfig.id);
        }
        /**是否显示拜访图标 */
        public updateVisitBtnShow(): boolean {
            let pInfo = WorldModel.getCityBuildInfo(this.config.id);
            return !WorldModel.checkIsHasLock(this.config.id) && !WorldModel.checkIsHasFirstAward(this.config.id) && pInfo.status != 1;
        }
        public setStatus() {
            let conf = WorldModel.getCityBuildInfo(this.m_pConfig.id)
                , event = WorldModel.getVisitEventById(this.m_pConfig.id)
                , bEmptyEvt = !event
                , bEnemy = !conf || conf.country != RoleData.countryId
            this.teamVoList = TeamModel.getTeamVoListByCityId(conf.id);
            let len: number = this.teamVoList.length;

            let ids = [101, 102, 103, 104, 105, 106, 107, 108];
            let notXY = ids.indexOf(this.m_pConfig.id) == -1;
            // 建设按钮显示
            this.m_pBtnBuild.visible = WorldModel.isOwnerCity(conf.id) && notXY;
            let isVisit = this.updateVisitBtnShow();
            this.m_pBtnVisit.visible = !bEmptyEvt && isVisit;
            this.m_pBtnTroop.visible = len > 0;

            if (bEnemy && bEmptyEvt) {
                let s = 'info'
                // if (this.m_pConfig.forbidattack) {
                //     let [d1, d2] = JSON.parse(this.m_pConfig.forbidattack);
                //     let [s1, e1]:[string, string] = d1.split('~'), [s2, e2]:[string, string] = d2.split('~')

                //     let now = TimerUtils.dateFormat("hh:mm:ss", TimerUtils.getServerTime());
                //     let b = ( now >= s1 && now <= e1 ) ||  ( now >= s2 && now <= e2 );
                //     if (b)
                //         s = 'truce'
                // }


                this.currentState = s;
            } else if (bEnemy && !bEmptyEvt) {
                this.currentState = 'info-visit';
            } else if (!bEnemy && bEmptyEvt && len > 0) {
                this.currentState = 'info-go';
                this.m_pBtnTroop.x = this.m_pBtnBuild.visible ? 255 : 202;
            } else {
                if (this.m_pBtnTroop.visible && this.m_pBtnVisit.visible) {
                    this.currentState = 'base';
                } else if (this.m_pBtnTroop.visible && !this.m_pBtnVisit.visible) {
                    this.currentState = 'info-go';
                    this.m_pBtnTroop.x = this.m_pBtnBuild.visible ? 255 : 202;
                } else if (!this.m_pBtnTroop.visible && this.m_pBtnVisit.visible) {
                    this.currentState = 'city-visit';
                } else {
                    this.currentState = 'info-city';
                }
            }
        }

        private onInfoClick() {
            // Utils.open_view(TASK_UI.POP_WORLD_CITY_INFO_PANEL, { conf: this.m_pConfig });
            let conf: WorldMapConfig = C.WorldMapConfig[this.m_pConfig.id];
            let cityId: number = conf.type == CityType.XIANG_BIRTH ? conf.mapCity : this.m_pConfig.id
            WorldProxy.C2S_CITY_ITEM_INFO(cityId);
            WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
        }

        private onVisitClick() {
            Utils.open_view(TASK_UI.POP_WORLD_VISIT_ATTACK, { id: this.m_pConfig.id });
            WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
        }

        private onGoClick() {
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
                let vo: AcEmperorBattleVO = <AcEmperorBattleVO>ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                let curTime: number = TimerUtils.getServerTimeMill();
                if (curTime <= vo.openDate) {
                    EffectUtils.showTips(GCode(CLEnum.XIANGYANG_FIGHT_TIPS), 1, true)
                    return;
                }

                let stopTime: number = ConstUtil.getValue(IConstEnum.XIANGYANG_STOP_TIME);
                let subTime: number = Math.floor((vo.closeDate - TimerUtils.getServerTimeMill()) / 1000);
                if (subTime <= stopTime) {
                    EffectUtils.showTips("战斗即将结束不能派军", 1, true)
                    return;
                }
            }
            Utils.open_view(TASK_UI.POP_WORLD_HERO_PANEL, this.m_pConfig.id);
            WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
        }

        private onAttackClick() {
            if(this.m_pConfig.type == CityType.BIRTH){
                EffectUtils.showTips(GCode(CLEnum.WOR_TMOVE_FAL5));
                return;
            }
            
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
                let vo: AcEmperorBattleVO = <AcEmperorBattleVO>ActivityModel.getActivityVo(AcViewType.XIANGYANG);
                let curTime: number = TimerUtils.getServerTimeMill();
                if (curTime <= vo.openDate) {
                    EffectUtils.showTips(GCode(CLEnum.XIANGYANG_FIGHT_TIPS), 1, true)
                    return;
                }
            }
            if (RoleData.level < this.config.AtackCityLv) {
                EffectUtils.showTips('您当前攻打的为高级城池，守军强大！')
            }
            if (this.config.citySkill != '') {
                let citySkillArr: string[] = this.m_pConfig.citySkill.split("_");
                let countryId = Number(citySkillArr[0]);
                let name = Utils.getCountryName(countryId);
                EffectUtils.showTips(`${name}国核心城池，${name}国玩家对抗有大幅加成！`)
            }
            Utils.open_view(TASK_UI.POP_WORLD_HERO_PANEL, this.m_pConfig.id);
            WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
        }
        private onTroopClick() {
            if (this.teamVoList.length == 0)
                return;
            Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: this.teamVoList[0].order });
            WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
        }

        private onBuildClick() {
            // CityBuildProxy.C2S_CITY_MADE_INFO(this.m_pConfig.id);
            Utils.open_view(TASK_UI.POP_WORLD_CITY_BUILDING, this.m_pConfig.id);
            WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
        }

        private onLeftClick() {
            let gpWidth = this.m_pCityBuff.contentWidth;
            let scWidth = this.m_scCityBuff.width;
            let scH = this.m_pCityBuff.scrollH;
            if (scH >= scWidth) {
                this.m_pCityBuff.scrollH = scH - scWidth;
                this.resetArrowState();
            }
        }

        private onRightClick() {
            let gpWidth = this.m_pCityBuff.contentWidth;
            let scWidth = this.m_scCityBuff.width;
            let scH = this.m_pCityBuff.scrollH;
            if (gpWidth > scH + scWidth) {
                this.m_pCityBuff.scrollH = scH + scWidth;
                this.resetArrowState();
            }
        }

        private resetArrowState() {
            this.m_scCityBuff.validateNow();
            let gpWidth = this.m_pCityBuff.contentWidth;
            let scWidth = this.m_scCityBuff.width;
            let scH = this.m_pCityBuff.scrollH;
            this.m_btnLeft.visible = scH <= 0 ? false : true;
            this.m_btnRight.visible = scH + scWidth > gpWidth ? false : true;
        }

        private onTruceClick() {
            EffectUtils.showTips(GCode(CLEnum.WOR_BD_BHTS));
        }

        public hitPoint(x: number, y: number) {
            if (this.m_pBtnInfo.hitTestPoint(x, y)) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onInfoClick();
            }
            if (this.m_pBtnVisit.hitTestPoint(x, y) && this.m_pBtnVisit.visible) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onVisitClick();
            }
            if (this.m_pBtnGo.hitTestPoint(x, y)) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onGoClick();
            }
            if (this.m_pBtnAttack.hitTestPoint(x, y)) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onAttackClick();
            }
            if (this.m_pBtnTruce.hitTestPoint(x, y)) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onTruceClick();
            }
            if (this.m_pBtnTroop.hitTestPoint(x, y)) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onTroopClick();
            }
            if (this.m_pBtnBuild.hitTestPoint(x, y) && this.m_pBtnBuild.visible) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onBuildClick();
            }
            if (this.m_btnLeft.hitTestPoint(x, y) && this.m_btnLeft.visible) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onLeftClick();
            }
            if (this.m_btnRight.hitTestPoint(x, y) && this.m_btnRight.visible) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onRightClick();
            }
            return this.m_pBtnGo.hitTestPoint(x, y) || this.m_pMenu.hitTestPoint(x, y) || this.m_pBtnAttack.hitTestPoint(x, y)
                || this.m_pBtnInfo.hitTestPoint(x, y)
                || this.m_pBtnVisit.hitTestPoint(x, y) || this.m_imgBg.hitTestPoint(x, y) /*|| this.m_pGInfo.hitTestPoint(x, y)*/
                || this.m_pBtnTruce.hitTestPoint(x, y) || this.m_pBtnTroop.hitTestPoint(x, y)
                || this.m_pBtnBuild.hitTestPoint(x, y) || this.m_btnLeft.hitTestPoint(x, y) || this.m_btnRight.hitTestPoint(x, y);
        }

        public removeFromParent() {
            super.removeFromParent([this.m_pBtnInfo, this.m_pBtnVisit, this.m_pBtnGo, this.m_pBtnAttack, this.m_pBtnTruce, this.m_pBtnTroop, this.m_pBtnBuild])
        }

        public addCityBuff() {
            this.m_pCityBuff.removeChildren();
            let strList = CityBuildModel.getCityPrivilege(this.m_pConfig.id);
            let cvo = CityBuildModel.getCityInfo(this.m_pConfig.id);
            if (strList.length == 0) error("CityMadeConfig cityId not exist!");
            for (let i in strList) {
                let str = strList[i];
                let strC = str.tc;
                let comp = new com_main.CityBuffCell();
                comp.setIcon(strC.icon + "_png", !str.isActive);
                comp.setName(strC.nameBuff);
                comp.scaleX = comp.scaleY = 0.7;
                this.m_pCityBuff.addChild(comp);
            }
            // NPC驻军恢复时间
            this.reduceTimePercent = CityBuildModel.getCityPrivilegeValues(this.m_pConfig.id, CityRewardType.NPC_REGAIN);
            this.defaultTime = this.defaultTime * (1 - this.reduceTimePercent / 10000);
            let nMinute2 = (this.defaultTime / 60).toFixed(1);
            this.m_desc.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_TROOP_TIPS, nMinute2, 1));
            // 驻军等级
            this.m_labNpcLv.text = CityBuildModel.npcLevel + "";
            this.resetArrowState();
            //城池buff
            if (isNull(this.m_pConfig.citySkill) || this.m_pConfig.citySkill == "") return;
            let citySkillArr: string[] = this.m_pConfig.citySkill.split("_");
            if (citySkillArr.length == 0) return;
            // let countryId = Number(citySkillArr[0]);
            // if(countryId != WorldModel.getCityBuildInfo(this.m_pConfig.id).country) return;

            let comp = new com_main.CityBuffCell();
            comp.setIcon(GeneralModel.getSkillIcon(Number(citySkillArr[1])), false);
            let skill = C.SkillConfig[Number(citySkillArr[1])];
            comp.setName(skill.name);
            comp.scaleX = comp.scaleY = 0.7;
            this.m_pCityBuff.addChildAt(comp, 0);
        }

    }


}