module com_main {
    export class TeamPanel extends CComponent {
        public static NAME = "TeamPanel";

        public m_pLbName: eui.Label;
        public m_comFightItem: com_main.ComFightItem;
        public m_RTraint: eui.Group;
        public m_pLuck: eui.Group;
        public m_pLuckImg: eui.Image;
        public m_teamImg: eui.Image;
        public m_pTeam: eui.Group;
        public m_pItem0: com_main.TeamGirdView;
        public m_pItem1: com_main.TeamGirdView;
        public m_pItem2: com_main.TeamGirdView;
        public m_pItem3: com_main.TeamGirdView;
        public m_pItem4: com_main.TeamGirdView;
        public m_pUnlock0: eui.Group;
        public m_pUnlockLb0: eui.Label;
        public m_pUnlock1: eui.Group;
        public m_pUnlockLb1: eui.Label;
        public m_pUnlock2: eui.Group;
        public m_pUnlockLb2: eui.Label;
        public m_pUnlock3: eui.Group;
        public m_pUnlockLb3: eui.Label;
        public m_pUnlock4: eui.Group;
        public m_pUnlockLb4: eui.Label;
        public m_pHeroScroll: eui.Scroller;
        public m_pHeroList: eui.List;
        public m_btnLeft: eui.Image;
        public m_btnRight: eui.Image;
        public m_pGroupBtn: eui.Group;
        public m_pGFightBtn: eui.Group;
        public m_pBtnOneKey: com_main.ComButton;
        public m_pBtnFight: com_main.ComButton;
        public m_pGChangBtn: eui.Group;
        public m_pBtnSave: com_main.ComButton;
        public m_pBtnReset: com_main.ComButton;


        protected m_pCollection: eui.ArrayCollection;   //英雄头像列表
        protected m_nTeamType: TeamType;     //队伍类型
        protected m_nOrder: number;      //队伍下标
        protected m_pTeamVo: TeamVo;     //队伍信息
        protected m_pTmpTeamList: gameProto.ITeamGeneralData[];   //队伍布阵临时信息
        protected m_nTouchedGenId: number;       //按下状态
        protected m_nTouchPos: number;       //按下位置
        protected m_pTeamSquare: TeamManualSquare;  //拖动英雄
        protected m_isWorld: boolean = false;
        private m_bScrollBtn: boolean;   //滚动按钮
        private m_isInTeam: boolean = false;
        private hisWarId: number = 0;
        private isInTeam: boolean = false;
        private nationLimit: number[] = []
        private typeLimit: number[] = []
        public constructor() {
            super();
            this.name = TeamPanel.NAME;
            this.skinName = Utils.getSkinName("app/team/TeamPanelSkin.exml");
        }

        public onDestroy() {
            this.clearDragGuide();
            this.removeEvent();
            this.removeTeamSquare();
            this.m_pHeroScroll.stopAnimation();
            // SceneResGroupCfg.clearModelRes([ModuleEnums.CAMP_VIEW]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_pHeroList.dataProvider = this.m_pCollection;
            this.m_pHeroList.itemRenderer = TeamHeroItem;
            this.m_pHeroList.useVirtualLayout = true;

            this.m_pBtnOneKey.setTitleLabel(GCode(CLEnum.CAMP_ON_KEY));
            this.m_pBtnFight.setTitleLabel(GCode(CLEnum.CAMP_FIGHT));
            this.m_pBtnSave.setTitleLabel(GCode(CLEnum.CAMP_SAVE));
            this.m_pBtnReset.setTitleLabel(GCode(CLEnum.CAMP_RESET));

            this.addEvent();
            // this.setBg();
            this.updateUnlock();
            // this.playeffect();

            egret.callLater(() => {
                if (this.m_pHeroList) {
                    this.m_pHeroList.width = this.m_pHeroScroll.width - 30;
                    this.m_pHeroList.validateNow();
                    if (this.m_pHeroScroll.viewport.contentWidth > this.m_pHeroScroll.width) {
                        this.m_bScrollBtn = true;
                        this.m_btnLeft.visible = false;
                        this.m_btnRight.visible = true;
                        this.m_pHeroScroll.addEventListener(egret.Event.CHANGE, this.onScrollChange, this)
                    } else {
                        this.m_btnLeft.visible = false;
                        this.m_btnRight.visible = false;
                    }
                }
            }, this);

        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        // public setBg() {
        //     this.m_pBg.removeChildren();
        //     for (let index = 0; index <= 14; index++) {
        //         let res: eui.Image = new eui.Image()
        //         if (index <= 9) {
        //             res.source = `map_battle_3_000_jpg`;
        //         } else {
        //             res.source = `map_battle_3_0${index}_jpg`;
        //         }
        //         res.width = 482;
        //         res.height = 370;
        //         res.x = 482 * (index % 5);
        //         res.y = 370 * Math.floor(index / 5)
        //         this.m_pBg.addChild(res);
        //     }
        // }

        public updateUnlock() {
            if (isNull(TeamModel.seatOpenLimit))
                return;
            let len: number = TeamModel.seatOpenLimit.length;
            for (let index = 0; index < len; index++) {
                let unLockGroup: eui.Group = this[`m_pUnlock${index}`] as eui.Group;
                let unLockLab: eui.Label = this[`m_pUnlockLb${index}`] as eui.Label;
                unLockGroup.visible = RoleData.level < TeamModel.seatOpenLimit[index];
                unLockLab.text = GCodeFromat(CLEnum.WOR_SOR_OPEN, TeamModel.seatOpenLimit[index]);
            }
        }
        /**滚动 */
        private onScrollChange() {
            if (isNull(this.skin)) return;
            this.m_btnLeft.visible = true;
            this.m_btnRight.visible = true;
            if ((this.m_pHeroScroll.viewport.scrollH + this.m_pHeroScroll.width) >= this.m_pHeroScroll.viewport.contentWidth) {
                this.m_btnRight.visible = false;
            }
            if (this.m_pHeroScroll.viewport.scrollH <= 0) this.m_btnLeft.visible = false;
        }
        public onLeftHandler(pvt: egret.TouchEvent) {
            let next = this.m_pHeroScroll.viewport.scrollH - this.m_pHeroScroll.width;
            next = Math.max(0, next);
            this.m_pHeroScroll.viewport.scrollH = next;
            this.onScrollChange();
        }
        public onRightHandler(pvt: egret.TouchEvent) {
            let next = this.m_pHeroScroll.viewport.scrollH + this.m_pHeroScroll.width;
            next = Math.min(this.m_pHeroScroll.viewport.contentWidth - this.m_pHeroScroll.width, next);
            this.m_pHeroScroll.viewport.scrollH = next;
            this.onScrollChange();
        }
        /**设置布阵信息 */
        public setTeamData(teamType: TeamType, order: number = 0, isWorld: boolean = false, hisWarId: number = 0) {
            this.m_nTeamType = teamType;
            this.m_nOrder = order;
            this.m_isWorld = isWorld;
            this.hisWarId = hisWarId;
            this.m_pTeamVo = TeamModel.getTeamVoByType(this.m_nTeamType, order);
            this.refrehAllByTmpData();

        }


        /**设置标题 */
        public setTeamTileName(name: string) {
            this.m_pLbName.text = name;
        }

        /**获得挑战按钮 */
        public setfightBtnName(name: string) {
            this.m_pBtnFight.setTitleLabel(name);
        }

        /**刷新全部显示 */
        private refrehAllByTmpData() {
            //拷贝新数据
            this.m_pTmpTeamList = this.m_pTeamVo.cloneTeamGeneralData();
            this.filterTeamList();
            this.refreshGeneralItems();

            this.refreshTeamGirdView();
            this.refreshFight();
            this.refreshBtnView();
            /**更新阵型播放 */
            this.playTeamGridViewEffect();

        }
        public filterTeamList() {
            if (this.m_nTeamType == TeamType.HISTORY_WAR) {
                //根据条件对部队进行过滤
                let hisWarCfg: HistoryWarConfig = C.HistoryWarConfig[this.hisWarId];
                if (isNull(hisWarCfg)) return;
                this.nationLimit = StringUtils.stringToNumberArray2(hisWarCfg.nationTypeLimit);
                this.typeLimit = StringUtils.stringToNumberArray2(hisWarCfg.generalOccupationLimit);
                // let teamList: gameProto.ITeamGeneralData[] = []
                // let len: number = this.m_pTmpTeamList.length;
                // for (let index = 0; index < len; index++) {
                //     let genData: gameProto.ITeamGeneralData = this.m_pTmpTeamList[index];
                //     let genCfg: GeneralConfig = C.GeneralConfig[genData.generalId];
                //     if (isNull(genCfg)) continue;
                //     if (this.nationLimit.indexOf(genCfg.nationType) == -1 && this.typeLimit.indexOf(genCfg.armyType) == -1)
                //         teamList.push(genData);
                // }
                // this.m_pTmpTeamList = teamList;
            }
        }
        public playTeamGridViewEffect() {
            if (!TeamModel.isUpdateTeam)
                return;
            TeamModel.isUpdateTeam = false;
            for (let index = 0; index < 5; index++) {
                let grid = this[`m_pItem${index}`] as TeamGirdView;
                if (grid.generalId > 0) {
                    this.playeffect(index);
                    this.playGenAttrTips(grid.generalId, index);
                }
            }
        }
        private addEvent() {
            this.m_nTouchedGenId = 0;
            this.m_nTouchPos = -1;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);

            EventManager.addTouchScaleListener(this.m_pBtnOneKey, this, this.onBtnOneKey);
            EventManager.addTouchScaleListener(this.m_pBtnSave, this, this.onBtnSave);
            EventManager.addTouchScaleListener(this.m_pBtnFight, this, this.onBtnFight);
            EventManager.addTouchScaleListener(this.m_pBtnReset, this, this.onBtnReset);
            EventManager.addTouchScaleListener(this.m_btnLeft, this, this.onLeftHandler);
            EventManager.addTouchScaleListener(this.m_btnRight, this, this.onRightHandler);

            EventManager.addTouchTapListener(this.m_RTraint, this, this.onHelpDesc);
            EventManager.addTouchTapListener(this.m_pLuck, this, this.onLuckClick);
            EventManager.addTouchTapListener(this.m_teamImg, this, this.onTeamClick);


            EventMgr.addEvent(TeamUIEvent.TEAM_UPDATE_GIRD_INFO, this.onTeamUpdateGirdInfo, this);
            EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.onWorldUpdateList, this);
            EventMgr.addEvent(RoleEvent.ROLE_LEVLE, this.updateUnlock, this);
        }

        private removeEvent() {
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);


            EventManager.removeEventListeners(this);
            EventMgr.removeEventByObject(TeamUIEvent.TEAM_UPDATE_GIRD_INFO, this);
            EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_LEVLE, this);
        }

        public playeffect(index: number) {
            let finshEffect: MCDragonBones = new MCDragonBones();
            finshEffect.initAsync(IETypes.EBuild_UpGrade);
            finshEffect.play(IETypes.EBuild_UpGrade, 1, true);
            Utils.addChild(this.m_pTeam, finshEffect);
            NodeUtils.setPosition(finshEffect, this[`m_pItem${index}`].x + this[`m_pItem${index}`].width / 2 + 10, this[`m_pItem${index}`].y + 20);
        }
        /**
         * 上阵信息刷新
         * @param changeIds 客户端模拟刷新
         *  */
        private onTeamUpdateGirdInfo(changeIds: number[]) {
            if (changeIds) {
                this.refreshTeamGirdView(true);
                this.refreshGeneralItems(changeIds);
                this.refreshFight();
                this.refreshBtnView();
            } else {
                this.refrehAllByTmpData();
            }
        }

        /**上阵队伍更新 */
        private onWorldUpdateList(vo: TeamVo) {
            if (vo.teamType == this.m_nTeamType && this.m_nOrder == vo.order) this.refrehAllByTmpData();
        }

        /**
         * 帮助描述
         */
        private onHelpDesc() {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.WOR_SUPP_HELP_DESC), title: GCode(CLEnum.WOR_HELP_TITLE) });
        }
        /**
         * 点击缘分区域
         */
        private onLuckClick(pvt: egret.TouchEvent) {
            pvt.stopImmediatePropagation();
            if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GENERAL_FATE)) {
                Utils.open_view(TASK_UI.FATE_TEAM_VIEW, { order: this.m_nOrder, type: this.m_nTeamType });
            }

        }

        /**
       * 点击上阵按钮
       */
        private onTeamClick(pvt: egret.TouchEvent) {
            pvt.stopImmediatePropagation();
            EffectUtils.showTips(GCode(CLEnum.WOR_XRZJS), 1, true)
        }
        /**一键上阵 */
        private onBtnOneKey() {
            if (this.m_pTeamVo.state != TeamState.IDLE) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_FAL), 1, true);
                return;
            }
            if (this.m_pTeamVo.cityId !== WorldModel.birthCity && this.m_isWorld) {
                // this.birthCityTips();
                return;
            }
            let heroBackList = TeamModel.getCanUpGeneralBackList(this.m_nTeamType, this.m_nOrder, this.nationLimit, this.typeLimit);
            let heroFrontList = TeamModel.getCanUpGeneralFrontList(this.m_nTeamType, this.m_nOrder, this.nationLimit, this.typeLimit);
            if (heroBackList.length == 0 && heroFrontList.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_FAL1), 1, true);
                return;
            }
            //布阵结果
            let res = [0, 0, 0, 0, 0];
            let frontLen = Math.min(3, heroFrontList.length);
            //前排
            for (let index = 0; index < frontLen; index++) {
                if (RoleData.level >= TeamModel.seatOpenLimit[index]) {
                    let vo = heroFrontList[index];
                    res[index] = vo.generalId;
                }
            }
            //如果第二个解锁 0 1位置互换
            if (RoleData.level >= TeamModel.seatOpenLimit[1]) {
                let id = res[0];
                res[0] = res[1];
                res[1] = id;
            }

            //后排
            let backLen = Math.min(2, heroBackList.length);
            for (let i = 0; i < backLen; i++) {
                let index = 3 + i;
                if (RoleData.level >= TeamModel.seatOpenLimit[index]) {
                    let vo = heroBackList[i];
                    res[index] = vo.generalId;
                }
            }

            let oldIds = this.getOldIds();
            if (res.toString() == oldIds.toString()) {
                for (let i = 0; i <= 2; i++) {
                    if (oldIds[i] == 0) {
                        EffectUtils.showTips(GCode(CLEnum.WOR_FRONT_TIPS), 1, true);
                        return;
                    }
                }
                for (let i = 3; i < 5; i++) {
                    if (oldIds[i] == 0) {
                        EffectUtils.showTips(GCode(CLEnum.WOR_BACK_TIPS), 1, true);
                        return;
                    }
                }
                EffectUtils.showTips(GCode(CLEnum.CAMP_FAL2), 1, true);
            } else {
                com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, null);
                if (this.m_nTeamType != TeamType.CROSS_SERVER) {
                    TeamProxy.C2S_TEAM_UP(this.m_nTeamType, this.m_nOrder, res);
                } else {
                    CrossProxy.C2S_CROSS_SERVER_WAR_TEAM_UPDATE(this.m_nOrder, res);
                }
                TeamModel.isUpdateTeam = true;

            }
        }

        /**挑战 */
        private onBtnFight() {
            EventMgr.dispatchEvent(TeamUIEvent.TEAM_BTN_FIGHT, null);
        }

        /**保存 */
        private onBtnSave() {
            if (this.m_pTeamVo.state != TeamState.IDLE) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_FAL), 1, true);
                return;
            }
            if (this.isNoChangeTeamGird()) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_FAL2), 1, true);
                return;
            }
            let res = [];
            for (let i = 0; i < this.m_pTmpTeamList.length; i++) {
                //拷贝数据 number变成string
                res.push(this.m_pTmpTeamList[i].generalId);
            }
            if (this.m_nTeamType != TeamType.CROSS_SERVER) {
                TeamProxy.C2S_TEAM_UP(this.m_nTeamType, this.m_nOrder, res);
            } else {
                CrossProxy.C2S_CROSS_SERVER_WAR_TEAM_UPDATE(this.m_nOrder, res);
            }
            TeamModel.isUpdateTeam = true;
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, null);
        }

        /**重置 */
        private onBtnReset() {
            this.m_nTouchedGenId = 0;
            this.m_nTouchPos = -1;
            this.removeTeamSquare();
            this.refrehAllByTmpData();
        }

        protected onTouchBegin(e: egret.TouchEvent) {
            //武将列表碰撞检测
            if (this.m_pTeamVo.cityId !== WorldModel.birthCity && this.m_isWorld && e.target != this.m_pLuckImg&&e.target != this.m_teamImg && e.target != this.m_RTraint) {
                this.birthCityTips();
                return;
            }
            let generalId = this.checkGeneralItemHit(e.stageX, e.stageY);
            if (generalId > 0) {
                let teamId = this.getGeneralTeamId(generalId);
                if (teamId >= 0) {
                    EffectUtils.showTips(GCode(CLEnum.CAMP_FAL3), 1, true);
                } else {
                    this.m_nTouchedGenId = generalId;
                }
                return;
            }

            //布阵格子碰撞检测
            let hitPos = new egret.Point(e.stageX, e.stageY);
            let girdPos = this.checkGirdHit(hitPos);
            if (girdPos >= 0) {
                let girdItem = this[`m_pItem${girdPos}`] as TeamGirdView;
                if (girdItem.generalId > 0) {
                    this.m_nTouchedGenId = girdItem.generalId;
                    this.m_nTouchPos = girdPos;
                    this.isInTeam = true;
                }
            }

        }

        protected onTouchMoved(e: egret.TouchEvent) {
            if (this.m_pTeamVo.cityId !== WorldModel.birthCity && this.m_isWorld)
                return;
            if (this.m_nTouchedGenId > 0) {
                if (!this.m_pTeamSquare) {
                    this.createTeamSquare(this.m_nTouchedGenId);
                    //隐藏格子相同的武将对象
                    this.hideTeamGirdView(this.m_nTouchedGenId);
                }
                this.m_pTeamSquare.x = e.stageX - 50;
                this.m_pTeamSquare.y = e.stageY + 10;
            }
        }

        protected onTouchEnd(e: egret.TouchEvent) {
            if (this.m_pTeamVo.cityId !== WorldModel.birthCity && this.m_isWorld)
                return;

            if (this.m_nTouchedGenId > 0) {
                //武将列表碰撞检测
                let generalId = this.checkGeneralItemHit(e.stageX, e.stageY);
                if (generalId == this.m_nTouchedGenId) {
                    //点击同一个武将
                    let isOnBatt = this.isOnBattle(generalId);
                    if (isOnBatt) {
                        //下阵
                        TeamModel.setTmpTeamGeneralData(this.m_pTmpTeamList, generalId, -1);
                    } else {
                        //     //便捷上阵
                        //     let emptyPos = this.getEmptyGirdPos();
                        //     if (emptyPos >= 0) {
                        //         TeamModel.setTmpTeamGeneralData(this.m_pTmpTeamList, generalId, emptyPos);
                        //     } else {
                        //         EffectUtils.showTips(GCode(CLEnum.CAMP_FAL4), 1, true);
                        //     }
                    }
                    this.m_nTouchedGenId = 0;
                    this.m_nTouchPos = -1;
                    this.removeTeamSquare();
                    return;
                }

                //布阵格子碰撞检测
                let hitPos = new egret.Point(e.stageX, e.stageY);
                let girdPos = this.checkGirdHit(hitPos);
                if (girdPos >= 0) {
                    if (!this.checkLock(girdPos)) {
                        let desc: string = GCodeFromat(CLEnum.WOR_SOR_OPEN, TeamModel.seatOpenLimit[girdPos])
                        EffectUtils.showTips(desc, 1, true);
                        this.resetGirdPos();
                        this.m_nTouchedGenId = 0;
                        this.m_nTouchPos = -1;
                        this.removeTeamSquare();
                        return;
                    }
                    if (!this.checkGen(this.m_nTouchedGenId, girdPos)) {
                        this.resetGirdPos();
                        this.m_nTouchedGenId = 0;
                        this.m_nTouchPos = -1;
                        this.removeTeamSquare();
                        return;
                    }
                    let girdItem = this[`m_pItem${girdPos}`] as TeamGirdView;
                    if (girdItem.generalId != this.m_nTouchedGenId) {
                        //位置替换
                        TeamModel.setTmpTeamGeneralData(this.m_pTmpTeamList, this.m_nTouchedGenId, girdPos);

                        //位置替换新手判断
                        if (girdPos != this.m_nTouchPos) {
                            this.clearDragGuide();
                        }

                    }
                } else {
                    //下阵
                    TeamModel.setTmpTeamGeneralData(this.m_pTmpTeamList, this.m_nTouchedGenId, -1);
                }
                this.m_nTouchedGenId = 0;
                this.m_nTouchPos = -1;
                this.removeTeamSquare();
            }
        }
        public resetGirdPos() {
            let temp: number = this.m_nTouchedGenId;
            if (this.isInTeam) {
                this.isInTeam = false;
                com_main.EventMgr.dispatchEvent(TeamUIEvent.TEAM_UPDATE_GIRD_INFO, [temp]);
            }
        }
        /**武将属性飘字 */
        public playGenAttrTips(genId: number, girdPos: number) {
            let genVo = GeneralModel.getOwnGeneral(genId) as GeneralVo;
            let atkAdd = genVo.getGenAttriValByType(AttriType.ATK)
            let defAdd = genVo.getGenAttriValByType(AttriType.DEF)
            let leaderAdd = genVo.getGenAttriValByType(AttriType.HP)
            let girdItem = this[`m_pItem${girdPos}`] as TeamGirdView;
            let pos = girdItem.localToGlobal(girdItem.width * 0.5, -girdItem.height * 0.1);
            let key1 = egret.setTimeout(function () {
                TipsUtils.showTipsNormalUp(`<font color = #00ff00>${GCodeFromat(CLEnum.ATTACK_ADD, atkAdd)}</font>`, pos, this);
                egret.clearTimeout(key1)
            }, this, 300);
            let key2 = egret.setTimeout(function () {
                TipsUtils.showTipsNormalUp(`<font color = #00ff00>${GCodeFromat(CLEnum.DEFENSE_ADD, defAdd)}</font>`, pos, this);
                egret.clearTimeout(key2)
            }, this, 800);

            let key3 = egret.setTimeout(function () {
                TipsUtils.showTipsNormalUp(`<font color = #00ff00>${GCodeFromat(CLEnum.HP_ADD, leaderAdd)}</font>`, pos, this);
                egret.clearTimeout(key3)
            }, this, 1300);

        }
        /**检查武将上阵 */
        public checkGen(genId: number, girdPos: number): boolean {
            let genVo = GeneralModel.getOwnGeneral(genId) as GeneralVo;
            if (genVo.getGeneralArmyType() == SoldierMainType.FOOTSOLDIER || genVo.getGeneralArmyType() == SoldierMainType.RIDESOLDIER || genVo.getGeneralArmyType() == SoldierMainType.PIKEMAN) {
                if (girdPos >= 3)  //后排只能上阵远程武将
                    EffectUtils.showTips(GCode(CLEnum.WOR_BACK))
                return girdPos < 3;
            } else if (genVo.getGeneralArmyType() == SoldierMainType.ARROWSOLDIER) {
                if (girdPos < 3)//前排只能上阵远程武将
                    EffectUtils.showTips(GCode(CLEnum.WOR_FRONT))
                return girdPos >= 3;
            }
        }
        private checkLock(girdPos: number) {
            let unLevel: number = TeamModel.seatOpenLimit[girdPos];
            if (isNull(unLevel))
                return false;
            return RoleData.level >= unLevel;
        }
        protected onTouchCancel(e: egret.TouchEvent) {
            this.m_nTouchedGenId = 0;
            this.removeTeamSquare();
        }

        /**武将列表碰撞检测*/
        private checkGeneralItemHit(tx: number, ty: number) {
            let pList = this.m_pHeroList;
            let listPos = pList.localToGlobal();
            let lDx = tx - listPos.x;
            let lDy = ty - listPos.y;
            // if (lDx > 0 && lDx <= pList.width && lDy >= 0 && lDy <= pList.height) {
            if (this.m_pHeroList.hitTestPoint(tx, ty, false)) {
                for (let i = 0; i < pList.numChildren; i++) {
                    let item = pList.getChildAt(i) as TeamHeroItem;
                    let pos = item.localToGlobal();
                    let dx = tx - pos.x;
                    let dy = ty - pos.y;
                    if (dx >= 0 && dx <= 134 && dy >= 0 && dy <= 151) {
                        return item.data.generalId;
                    }
                }
            }

            return 0;
        }

        /**检查格子碰撞 */
        private checkGirdHit(hitPos: egret.Point) {
            let mindis = 9999;
            let index = -1;
            for (let i = 0; i < this.m_pTmpTeamList.length; i++) {
                let item = this[`m_pItem${i}`] as TeamGirdView;
                let pos = item.localToGlobal(168.5, 85);
                let dis = egret.Point.distance(pos, hitPos);
                if (dis < mindis && dis < 140) {
                    mindis = dis;
                    index = i;
                }
            }
            return index;
        }

        /**创建拖动对象 */
        private createTeamSquare(id: number) {
            this.m_pTeamSquare = new TeamManualSquare(id);
            this.m_pTeamSquare.touchEnabled = false;
            this.m_pTeamSquare.isShowSorlider(false);
            this.m_pTeamSquare.isShowTip(false);
            this.m_pTeamSquare.isShowHead(false);
            this.addChild(this.m_pTeamSquare);
        }

        /**移除拖动对象 */
        private removeTeamSquare() {
            if (this.m_pTeamSquare) {
                Utils.removeFromParent(this.m_pTeamSquare);
                this.m_pTeamSquare = null;
            }
        }

        /**更新按钮组显示 */
        private refreshBtnView() {
            if (this.isNoChangeTeamGird()) {
                this.m_pGChangBtn.visible = false;
                this.m_pGFightBtn.visible = true;
            } else {
                this.m_pGChangBtn.visible = true;
                this.m_pGFightBtn.visible = false;
            }
            this.updateAddBtnShow(this.isNoChangeTeamGird())
        }
        public updateAddBtnShow(visible: boolean) {
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_TROOP_BTN_UPDATE, visible);
        }
        /**刷新战斗力 */
        private refreshFight() {
            let fight = 0;
            for (let i = 0; i < this.m_pTmpTeamList.length; i++) {
                let generalId = this.m_pTmpTeamList[i].generalId;
                if (generalId > 0) {
                    let genVo = GeneralModel.getOwnGeneral(generalId) as GeneralVo;
                    fight += genVo.fight;
                }
            }
            this.m_comFightItem.setFight(fight);
        }
        public playEffectByGenId(generId: number) {
            for (let index = 0; index < 5; index++) {
                let grid = this[`m_pItem${index}`] as TeamGirdView;
                if (grid.generalId == generId) {
                    this.playeffect(index);
                    break;
                }
            }
        }
        /**
       * 更新英雄可上阵列表
       * @param  changeIds （上阵下阵）改变的英雄id
       */
        protected refreshGeneralItems(changeIds?: number[]) {
            //初始化未完成 跳出
            if (!this.m_pTmpTeamList) return;

            if (!changeIds) {
                //第一次创建 头像列表
                let heroArr = [];
                const list = TeamModel.getCanUpGeneralList(this.m_nTeamType, this.m_nOrder, this.nationLimit, this.typeLimit);
                for (let i = 0; i < list.length; i++) {
                    let genVo = list[i];
                    let generalId = genVo.generalId;
                    heroArr.push({ generalId: generalId, num: this.getArmyNumById(generalId), maxNum: genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER), isOnBatt: this.isOnBattle(generalId), teamId: this.getGeneralTeamId(generalId) })
                }
                this.m_pCollection.source = heroArr;
                this.m_pCollection.refresh();
            } else {
                //刷新变动头像
                for (let i = 0; i < this.m_pCollection.source.length; i++) {
                    let data = this.m_pCollection.source[i];
                    for (let k = 0; k < changeIds.length; k++) {
                        if (data.generalId == changeIds[k]) {
                            data.isOnBatt = this.isOnBattle(data.generalId);
                            data.teamId = this.getGeneralTeamId(data.generalId);
                            data.num = this.getArmyNumById(data.generalId);

                            //最大数量 不需要动态刷新
                            this.m_pCollection.itemUpdated(data);
                        }
                    }

                }
            }
        }

        /**对比新旧数据获取改变的武将ids */
        private getChangeGeneralIds(list: gameProto.ITeamGeneralData[]): number[] {
            let changeIds = null;
            //存在旧数据
            if (list && list.length > 0) {
                changeIds = [];
                for (let i = 0; i < list.length; i++) {
                    let generalId = list[i].generalId;
                    if (generalId > 0) {
                        changeIds.push(generalId);
                    }
                }
            }
            return changeIds;
        }

        /**
       * 更新方阵显示
       */
        protected refreshTeamGirdView(isClient: boolean = false) {
            for (let i = 0; i < this.m_pTmpTeamList.length; i++) {
                let data = this.m_pTmpTeamList[i];
                let item = this[`m_pItem${i}`] as TeamGirdView;
                item.generalId = data.generalId;

                item.updateHp(this.getArmyNumById(data.generalId), isClient);
            }

            // this.refreshFateItem();
        }

        /**
       * 隐藏方阵格子显示
       */
        protected hideTeamGirdView(id: number) {
            for (let i = 0; i < this.m_pTmpTeamList.length; i++) {
                let data = this.m_pTmpTeamList[i];
                let item = this[`m_pItem${i}`] as TeamGirdView;
                if (item.generalId == id) {
                    item.generalId = 0;
                }
            }

        }

        // /**刷新缘分列表 */
        // private refreshFateItem() {
        //     Utils.removeAllChild(this.m_pFateItemRoot);
        //     for (let i = 0; i < 5; i++) {
        //         this.createFateItem();
        //     }
        // }
        // private createFateItem() {
        //     let item = new TeamFateItem();
        //     item.fateId = 1;
        //     this.m_pFateItemRoot.addChild(item);
        // }

        /**是否在当前阵上 */
        private isOnBattle(id: number) {
            for (let i = 0; i < this.m_pTmpTeamList.length; i++) {
                let data = this.m_pTmpTeamList[i];
                if (data.generalId == id) return true;
            }
            return false;
        }

        /**获得队伍id */
        private getGeneralTeamId(generalId: number) {
            let id = TeamModel.getGeneralTeamId(this.m_nTeamType, generalId, this.m_nOrder);
            if (id == -1 && this.isOnBattle(generalId)) {
                id = this.m_nOrder;
            }
            return id;
        }
        /**出生城提示 */
        public birthCityTips() {
            let city: WorldMapConfig = WorldModel.getCityConfig(WorldModel.birthCity);
            EffectUtils.showTips(GCodeFromat(CLEnum.CAMP_TIPS1, GLan(city.name)), 1, true)
        }
        /**是否有改变阵型 */
        private isNoChangeTeamGird() {
            let oldIds = this.getOldIds();

            let newIds = [];
            for (let i = 0; i < this.m_pTmpTeamList.length; i++) {
                newIds.push(this.m_pTmpTeamList[i].generalId);
            }
            return oldIds.toString() == newIds.toString();
        }

        /**获得旧的布阵数组 */
        private getOldIds(): number[] {
            let oldIds = [0, 0, 0, 0, 0];
            for (let i = 0; i < this.m_pTeamVo.teamGeneralData.length; i++) {
                let data = this.m_pTeamVo.teamGeneralData[i];
                let generalId = data.generalId;
                if (generalId > 0) {
                    oldIds[data.position - 1] = generalId;
                }
            }
            return oldIds;
        }

        /**获得空的上阵格子 */
        private getEmptyGirdPos() {
            for (let i = 0; i < this.m_pTmpTeamList.length; i++) {
                let data = this.m_pTmpTeamList[i];
                if (data.generalId == 0) {
                    return i;
                }
            }
            return -1;
        }

        /**获得武将身上士兵 */
        private getArmyNumById(id: number) {
            //非世界地图上阵武将 兵力显示满
            if (this.m_nTeamType != TeamType.WORLD && this.m_nTeamType != TeamType.CROSS_SERVER) {
                let genVo = GeneralModel.getOwnGeneral(id) as GeneralVo;
                if (genVo) {
                    return genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER);
                }
                return 0;
            }
            let teamList = this.m_pTeamVo.teamGeneralData;
            for (let i = 0; i < teamList.length; i++) {
                let data = teamList[i];
                if (data.generalId == id) return data.minSoldierTotalCount;
            }
            return 0;
        }

        /**拖动新手指引 */
        private m_guideIcon: eui.Image;
        private m_imgFlag: eui.Image;
        private m_pMask: eui.Group;
        public m_bInDragGuide: boolean;
        public doDragGuide() {
            this.m_bInDragGuide = true;

            this.m_imgFlag = new eui.Image('xzzt_jt_png');
            this.m_imgFlag.anchorOffsetX = 73;
            this.m_imgFlag.anchorOffsetY = 40;
            this.m_imgFlag.touchEnabled = false;
            this.m_pTeam.addChild(this.m_imgFlag);

            this.m_guideIcon = new eui.Image('guide_icon_png');
            this.m_guideIcon.anchorOffsetX = 18;
            this.m_guideIcon.anchorOffsetY = 145;
            this.m_guideIcon.touchEnabled = false;
            this.m_pTeam.addChild(this.m_guideIcon);
            let [item0, item1] = [this.m_pItem0, this.m_pItem1];
            let startPos = { x: item0.x + item0.width * 0.5, y: item0.y + item0.height * 0.5 };
            let endPos = { x: item1.x + item1.width * 0.5, y: item1.y + item1.height * 0.5 };

            NodeUtils.setPosition(this.m_guideIcon, startPos.x + 100, startPos.y - 100);
            NodeUtils.setPosition(this.m_imgFlag, (startPos.x + endPos.x) * 0.5, (startPos.y + endPos.y) * 0.5);

            let tw = egret.Tween.get(this.m_guideIcon, { loop: true });
            tw.to({ x: startPos.x, y: startPos.y }, 500, Ease.cubicOut);
            tw.to({ x: endPos.x, y: endPos.y }, 800, Ease.cubicOut);
            tw.wait(300);
            tw.call(() => {
                NodeUtils.setPosition(this.m_guideIcon, startPos.x + 100, startPos.y - 100);
            }, this)

            this.m_pMask = new eui.Group();
            this.m_pMask.width = AGame.R.app.stageWidth;
            this.m_pMask.height = AGame.R.app.stageHeight;
            this.addChild(this.m_pMask);

            this.m_pMask.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMaskTouchBegin, this);
            this.m_pMask.addEventListener(egret.TouchEvent.TOUCH_END, this.onMaskTouchEnd, this);
        }

        /**遮罩 */
        private onMaskTouchBegin(e: egret.TouchEvent) {
            //布阵格子碰撞检测
            let hitPos = new egret.Point(e.stageX, e.stageY);
            let girdPos = this.checkGirdHit(hitPos);
            if (girdPos == 0) {
                return;
            }
            e.stopPropagation();
        }

        /**遮罩 */
        private onMaskTouchEnd(e: egret.TouchEvent) {
            //布阵格子碰撞检测
            let hitPos = new egret.Point(e.stageX, e.stageY);
            let girdPos = this.checkGirdHit(hitPos);
            if (girdPos == 1) {
                return;
            }
            e.stopPropagation();
        }

        private clearDragGuide() {
            if (!this.m_bInDragGuide) return;
            this.m_bInDragGuide = false;
            egret.Tween.removeTweens(this.m_guideIcon);
            Utils.removeFromParent(this.m_guideIcon);
            Utils.removeFromParent(this.m_pMask);
            Utils.removeFromParent(this.m_imgFlag);
            this.m_pMask.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMaskTouchBegin, this);
            this.m_pMask.removeEventListener(egret.TouchEvent.TOUCH_END, this.onMaskTouchEnd, this);
            SceneManager.sendPanelGuide();
        }

    }


    /**
    * 英雄上阵头像Item
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    export class TeamHeroItem extends eui.ItemRenderer {
        public m_pHero: com_main.GeneralHeadRender;
        public m_pTeamRoot: eui.Group;
        public m_labTeamId: eui.Label;
        public constructor() {
            super();
            this.skinName = Utils.getAppSkin('team/TeamHeroItemSkin.exml');
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        /**
         * data generalId num maxNum isOnBatts
         */
        protected dataChanged() {
            this.m_pHero.setGenId(this.data.generalId);
            this.m_pHero.refreshArmyPro(this.data.num, this.data.maxNum, this.data.isOnBatt);
            if (this.data.teamId >= 0) {
                this.m_pTeamRoot.visible = true;
                this.m_labTeamId.text = GCode(CLEnum.CAMP_ARMY) + Global.getNumber(this.data.teamId + 1);
            } else {
                this.m_pTeamRoot.visible = false;
            }
        }
    }

}