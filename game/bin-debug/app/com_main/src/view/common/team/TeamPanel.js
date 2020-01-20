var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    var TeamPanel = /** @class */ (function (_super_1) {
        __extends(TeamPanel, _super_1);
        function TeamPanel() {
            var _this = _super_1.call(this) || this;
            _this.m_isWorld = false;
            _this.m_isInTeam = false;
            _this.hisWarId = 0;
            _this.isInTeam = false;
            _this.nationLimit = [];
            _this.typeLimit = [];
            _this.name = TeamPanel.NAME;
            _this.skinName = Utils.getSkinName("app/team/TeamPanelSkin.exml");
            return _this;
        }
        TeamPanel.prototype.onDestroy = function () {
            this.clearDragGuide();
            this.removeEvent();
            this.removeTeamSquare();
            this.m_pHeroScroll.stopAnimation();
            // SceneResGroupCfg.clearModelRes([ModuleEnums.CAMP_VIEW]);
        };
        TeamPanel.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
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
            egret.callLater(function () {
                if (_this.m_pHeroList) {
                    _this.m_pHeroList.width = _this.m_pHeroScroll.width - 30;
                    _this.m_pHeroList.validateNow();
                    if (_this.m_pHeroScroll.viewport.contentWidth > _this.m_pHeroScroll.width) {
                        _this.m_bScrollBtn = true;
                        _this.m_btnLeft.visible = false;
                        _this.m_btnRight.visible = true;
                        _this.m_pHeroScroll.addEventListener(egret.Event.CHANGE, _this.onScrollChange, _this);
                    }
                    else {
                        _this.m_btnLeft.visible = false;
                        _this.m_btnRight.visible = false;
                    }
                }
            }, this);
        };
        TeamPanel.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
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
        TeamPanel.prototype.updateUnlock = function () {
            if (isNull(TeamModel.seatOpenLimit))
                return;
            var len = TeamModel.seatOpenLimit.length;
            for (var index = 0; index < len; index++) {
                var unLockGroup = this["m_pUnlock" + index];
                var unLockLab = this["m_pUnlockLb" + index];
                unLockGroup.visible = RoleData.level < TeamModel.seatOpenLimit[index];
                unLockLab.text = GCodeFromat(CLEnum.WOR_SOR_OPEN, TeamModel.seatOpenLimit[index]);
            }
        };
        /**滚动 */
        TeamPanel.prototype.onScrollChange = function () {
            if (isNull(this.skin))
                return;
            this.m_btnLeft.visible = true;
            this.m_btnRight.visible = true;
            if ((this.m_pHeroScroll.viewport.scrollH + this.m_pHeroScroll.width) >= this.m_pHeroScroll.viewport.contentWidth) {
                this.m_btnRight.visible = false;
            }
            if (this.m_pHeroScroll.viewport.scrollH <= 0)
                this.m_btnLeft.visible = false;
        };
        TeamPanel.prototype.onLeftHandler = function (pvt) {
            var next = this.m_pHeroScroll.viewport.scrollH - this.m_pHeroScroll.width;
            next = Math.max(0, next);
            this.m_pHeroScroll.viewport.scrollH = next;
            this.onScrollChange();
        };
        TeamPanel.prototype.onRightHandler = function (pvt) {
            var next = this.m_pHeroScroll.viewport.scrollH + this.m_pHeroScroll.width;
            next = Math.min(this.m_pHeroScroll.viewport.contentWidth - this.m_pHeroScroll.width, next);
            this.m_pHeroScroll.viewport.scrollH = next;
            this.onScrollChange();
        };
        /**设置布阵信息 */
        TeamPanel.prototype.setTeamData = function (teamType, order, isWorld, hisWarId) {
            if (order === void 0) { order = 0; }
            if (isWorld === void 0) { isWorld = false; }
            if (hisWarId === void 0) { hisWarId = 0; }
            this.m_nTeamType = teamType;
            this.m_nOrder = order;
            this.m_isWorld = isWorld;
            this.hisWarId = hisWarId;
            this.m_pTeamVo = TeamModel.getTeamVoByType(this.m_nTeamType, order);
            this.refrehAllByTmpData();
        };
        /**设置标题 */
        TeamPanel.prototype.setTeamTileName = function (name) {
            this.m_pLbName.text = name;
        };
        /**获得挑战按钮 */
        TeamPanel.prototype.setfightBtnName = function (name) {
            this.m_pBtnFight.setTitleLabel(name);
        };
        /**刷新全部显示 */
        TeamPanel.prototype.refrehAllByTmpData = function () {
            //拷贝新数据
            this.m_pTmpTeamList = this.m_pTeamVo.cloneTeamGeneralData();
            this.filterTeamList();
            this.refreshGeneralItems();
            this.refreshTeamGirdView();
            this.refreshFight();
            this.refreshBtnView();
            /**更新阵型播放 */
            this.playTeamGridViewEffect();
        };
        TeamPanel.prototype.filterTeamList = function () {
            if (this.m_nTeamType == 4 /* HISTORY_WAR */) {
                //根据条件对部队进行过滤
                var hisWarCfg = C.HistoryWarConfig[this.hisWarId];
                if (isNull(hisWarCfg))
                    return;
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
        };
        TeamPanel.prototype.playTeamGridViewEffect = function () {
            if (!TeamModel.isUpdateTeam)
                return;
            TeamModel.isUpdateTeam = false;
            for (var index = 0; index < 5; index++) {
                var grid = this["m_pItem" + index];
                if (grid.generalId > 0) {
                    this.playeffect(index);
                    this.playGenAttrTips(grid.generalId, index);
                }
            }
        };
        TeamPanel.prototype.addEvent = function () {
            this.m_nTouchedGenId = 0;
            this.m_nTouchPos = -1;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnOneKey, this, this.onBtnOneKey);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnSave, this, this.onBtnSave);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnFight, this, this.onBtnFight);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnReset, this, this.onBtnReset);
            com_main.EventManager.addTouchScaleListener(this.m_btnLeft, this, this.onLeftHandler);
            com_main.EventManager.addTouchScaleListener(this.m_btnRight, this, this.onRightHandler);
            com_main.EventManager.addTouchTapListener(this.m_RTraint, this, this.onHelpDesc);
            com_main.EventManager.addTouchTapListener(this.m_pLuck, this, this.onLuckClick);
            com_main.EventManager.addTouchTapListener(this.m_teamImg, this, this.onTeamClick);
            com_main.EventMgr.addEvent(TeamUIEvent.TEAM_UPDATE_GIRD_INFO, this.onTeamUpdateGirdInfo, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.onWorldUpdateList, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_LEVLE, this.updateUnlock, this);
        };
        TeamPanel.prototype.removeEvent = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(TeamUIEvent.TEAM_UPDATE_GIRD_INFO, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_LEVLE, this);
        };
        TeamPanel.prototype.playeffect = function (index) {
            var finshEffect = new MCDragonBones();
            finshEffect.initAsync(IETypes.EBuild_UpGrade);
            finshEffect.play(IETypes.EBuild_UpGrade, 1, true);
            Utils.addChild(this.m_pTeam, finshEffect);
            NodeUtils.setPosition(finshEffect, this["m_pItem" + index].x + this["m_pItem" + index].width / 2 + 10, this["m_pItem" + index].y + 20);
        };
        /**
         * 上阵信息刷新
         * @param changeIds 客户端模拟刷新
         *  */
        TeamPanel.prototype.onTeamUpdateGirdInfo = function (changeIds) {
            if (changeIds) {
                this.refreshTeamGirdView(true);
                this.refreshGeneralItems(changeIds);
                this.refreshFight();
                this.refreshBtnView();
            }
            else {
                this.refrehAllByTmpData();
            }
        };
        /**上阵队伍更新 */
        TeamPanel.prototype.onWorldUpdateList = function (vo) {
            if (vo.teamType == this.m_nTeamType && this.m_nOrder == vo.order)
                this.refrehAllByTmpData();
        };
        /**
         * 帮助描述
         */
        TeamPanel.prototype.onHelpDesc = function () {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.WOR_SUPP_HELP_DESC), title: GCode(CLEnum.WOR_HELP_TITLE) });
        };
        /**
         * 点击缘分区域
         */
        TeamPanel.prototype.onLuckClick = function (pvt) {
            pvt.stopImmediatePropagation();
            if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GENERAL_FATE)) {
                Utils.open_view(TASK_UI.FATE_TEAM_VIEW, { order: this.m_nOrder, type: this.m_nTeamType });
            }
        };
        /**
       * 点击上阵按钮
       */
        TeamPanel.prototype.onTeamClick = function (pvt) {
            pvt.stopImmediatePropagation();
            EffectUtils.showTips(GCode(CLEnum.WOR_XRZJS), 1, true);
        };
        /**一键上阵 */
        TeamPanel.prototype.onBtnOneKey = function () {
            if (this.m_pTeamVo.state != 0 /* IDLE */) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_FAL), 1, true);
                return;
            }
            if (this.m_pTeamVo.cityId !== WorldModel.birthCity && this.m_isWorld) {
                // this.birthCityTips();
                return;
            }
            var heroBackList = TeamModel.getCanUpGeneralBackList(this.m_nTeamType, this.m_nOrder, this.nationLimit, this.typeLimit);
            var heroFrontList = TeamModel.getCanUpGeneralFrontList(this.m_nTeamType, this.m_nOrder, this.nationLimit, this.typeLimit);
            if (heroBackList.length == 0 && heroFrontList.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_FAL1), 1, true);
                return;
            }
            //布阵结果
            var res = [0, 0, 0, 0, 0];
            var frontLen = Math.min(3, heroFrontList.length);
            //前排
            for (var index = 0; index < frontLen; index++) {
                if (RoleData.level >= TeamModel.seatOpenLimit[index]) {
                    var vo = heroFrontList[index];
                    res[index] = vo.generalId;
                }
            }
            //如果第二个解锁 0 1位置互换
            if (RoleData.level >= TeamModel.seatOpenLimit[1]) {
                var id = res[0];
                res[0] = res[1];
                res[1] = id;
            }
            //后排
            var backLen = Math.min(2, heroBackList.length);
            for (var i = 0; i < backLen; i++) {
                var index = 3 + i;
                if (RoleData.level >= TeamModel.seatOpenLimit[index]) {
                    var vo = heroBackList[i];
                    res[index] = vo.generalId;
                }
            }
            var oldIds = this.getOldIds();
            if (res.toString() == oldIds.toString()) {
                for (var i = 0; i <= 2; i++) {
                    if (oldIds[i] == 0) {
                        EffectUtils.showTips(GCode(CLEnum.WOR_FRONT_TIPS), 1, true);
                        return;
                    }
                }
                for (var i = 3; i < 5; i++) {
                    if (oldIds[i] == 0) {
                        EffectUtils.showTips(GCode(CLEnum.WOR_BACK_TIPS), 1, true);
                        return;
                    }
                }
                EffectUtils.showTips(GCode(CLEnum.CAMP_FAL2), 1, true);
            }
            else {
                com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, null);
                if (this.m_nTeamType != 5 /* CROSS_SERVER */) {
                    TeamProxy.C2S_TEAM_UP(this.m_nTeamType, this.m_nOrder, res);
                }
                else {
                    CrossProxy.C2S_CROSS_SERVER_WAR_TEAM_UPDATE(this.m_nOrder, res);
                }
                TeamModel.isUpdateTeam = true;
            }
        };
        /**挑战 */
        TeamPanel.prototype.onBtnFight = function () {
            com_main.EventMgr.dispatchEvent(TeamUIEvent.TEAM_BTN_FIGHT, null);
        };
        /**保存 */
        TeamPanel.prototype.onBtnSave = function () {
            if (this.m_pTeamVo.state != 0 /* IDLE */) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_FAL), 1, true);
                return;
            }
            if (this.isNoChangeTeamGird()) {
                EffectUtils.showTips(GCode(CLEnum.CAMP_FAL2), 1, true);
                return;
            }
            var res = [];
            for (var i = 0; i < this.m_pTmpTeamList.length; i++) {
                //拷贝数据 number变成string
                res.push(this.m_pTmpTeamList[i].generalId);
            }
            if (this.m_nTeamType != 5 /* CROSS_SERVER */) {
                TeamProxy.C2S_TEAM_UP(this.m_nTeamType, this.m_nOrder, res);
            }
            else {
                CrossProxy.C2S_CROSS_SERVER_WAR_TEAM_UPDATE(this.m_nOrder, res);
            }
            TeamModel.isUpdateTeam = true;
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_SAVE_AUTO_TROOP, null);
        };
        /**重置 */
        TeamPanel.prototype.onBtnReset = function () {
            this.m_nTouchedGenId = 0;
            this.m_nTouchPos = -1;
            this.removeTeamSquare();
            this.refrehAllByTmpData();
        };
        TeamPanel.prototype.onTouchBegin = function (e) {
            //武将列表碰撞检测
            if (this.m_pTeamVo.cityId !== WorldModel.birthCity && this.m_isWorld && e.target != this.m_pLuckImg && e.target != this.m_teamImg && e.target != this.m_RTraint) {
                this.birthCityTips();
                return;
            }
            var generalId = this.checkGeneralItemHit(e.stageX, e.stageY);
            if (generalId > 0) {
                var teamId = this.getGeneralTeamId(generalId);
                if (teamId >= 0) {
                    EffectUtils.showTips(GCode(CLEnum.CAMP_FAL3), 1, true);
                }
                else {
                    this.m_nTouchedGenId = generalId;
                }
                return;
            }
            //布阵格子碰撞检测
            var hitPos = new egret.Point(e.stageX, e.stageY);
            var girdPos = this.checkGirdHit(hitPos);
            if (girdPos >= 0) {
                var girdItem = this["m_pItem" + girdPos];
                if (girdItem.generalId > 0) {
                    this.m_nTouchedGenId = girdItem.generalId;
                    this.m_nTouchPos = girdPos;
                    this.isInTeam = true;
                }
            }
        };
        TeamPanel.prototype.onTouchMoved = function (e) {
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
        };
        TeamPanel.prototype.onTouchEnd = function (e) {
            if (this.m_pTeamVo.cityId !== WorldModel.birthCity && this.m_isWorld)
                return;
            if (this.m_nTouchedGenId > 0) {
                //武将列表碰撞检测
                var generalId = this.checkGeneralItemHit(e.stageX, e.stageY);
                if (generalId == this.m_nTouchedGenId) {
                    //点击同一个武将
                    var isOnBatt = this.isOnBattle(generalId);
                    if (isOnBatt) {
                        //下阵
                        TeamModel.setTmpTeamGeneralData(this.m_pTmpTeamList, generalId, -1);
                    }
                    else {
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
                var hitPos = new egret.Point(e.stageX, e.stageY);
                var girdPos = this.checkGirdHit(hitPos);
                if (girdPos >= 0) {
                    if (!this.checkLock(girdPos)) {
                        var desc = GCodeFromat(CLEnum.WOR_SOR_OPEN, TeamModel.seatOpenLimit[girdPos]);
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
                    var girdItem = this["m_pItem" + girdPos];
                    if (girdItem.generalId != this.m_nTouchedGenId) {
                        //位置替换
                        TeamModel.setTmpTeamGeneralData(this.m_pTmpTeamList, this.m_nTouchedGenId, girdPos);
                        //位置替换新手判断
                        if (girdPos != this.m_nTouchPos) {
                            this.clearDragGuide();
                        }
                    }
                }
                else {
                    //下阵
                    TeamModel.setTmpTeamGeneralData(this.m_pTmpTeamList, this.m_nTouchedGenId, -1);
                }
                this.m_nTouchedGenId = 0;
                this.m_nTouchPos = -1;
                this.removeTeamSquare();
            }
        };
        TeamPanel.prototype.resetGirdPos = function () {
            var temp = this.m_nTouchedGenId;
            if (this.isInTeam) {
                this.isInTeam = false;
                com_main.EventMgr.dispatchEvent(TeamUIEvent.TEAM_UPDATE_GIRD_INFO, [temp]);
            }
        };
        /**武将属性飘字 */
        TeamPanel.prototype.playGenAttrTips = function (genId, girdPos) {
            var genVo = GeneralModel.getOwnGeneral(genId);
            var atkAdd = genVo.getGenAttriValByType(AttriType.ATK);
            var defAdd = genVo.getGenAttriValByType(AttriType.DEF);
            var leaderAdd = genVo.getGenAttriValByType(AttriType.HP);
            var girdItem = this["m_pItem" + girdPos];
            var pos = girdItem.localToGlobal(girdItem.width * 0.5, -girdItem.height * 0.1);
            var key1 = egret.setTimeout(function () {
                TipsUtils.showTipsNormalUp("<font color = #00ff00>" + GCodeFromat(CLEnum.ATTACK_ADD, atkAdd) + "</font>", pos, this);
                egret.clearTimeout(key1);
            }, this, 300);
            var key2 = egret.setTimeout(function () {
                TipsUtils.showTipsNormalUp("<font color = #00ff00>" + GCodeFromat(CLEnum.DEFENSE_ADD, defAdd) + "</font>", pos, this);
                egret.clearTimeout(key2);
            }, this, 800);
            var key3 = egret.setTimeout(function () {
                TipsUtils.showTipsNormalUp("<font color = #00ff00>" + GCodeFromat(CLEnum.HP_ADD, leaderAdd) + "</font>", pos, this);
                egret.clearTimeout(key3);
            }, this, 1300);
        };
        /**检查武将上阵 */
        TeamPanel.prototype.checkGen = function (genId, girdPos) {
            var genVo = GeneralModel.getOwnGeneral(genId);
            if (genVo.getGeneralArmyType() == SoldierMainType.FOOTSOLDIER || genVo.getGeneralArmyType() == SoldierMainType.RIDESOLDIER || genVo.getGeneralArmyType() == SoldierMainType.PIKEMAN) {
                if (girdPos >= 3) //后排只能上阵远程武将
                    EffectUtils.showTips(GCode(CLEnum.WOR_BACK));
                return girdPos < 3;
            }
            else if (genVo.getGeneralArmyType() == SoldierMainType.ARROWSOLDIER) {
                if (girdPos < 3) //前排只能上阵远程武将
                    EffectUtils.showTips(GCode(CLEnum.WOR_FRONT));
                return girdPos >= 3;
            }
        };
        TeamPanel.prototype.checkLock = function (girdPos) {
            var unLevel = TeamModel.seatOpenLimit[girdPos];
            if (isNull(unLevel))
                return false;
            return RoleData.level >= unLevel;
        };
        TeamPanel.prototype.onTouchCancel = function (e) {
            this.m_nTouchedGenId = 0;
            this.removeTeamSquare();
        };
        /**武将列表碰撞检测*/
        TeamPanel.prototype.checkGeneralItemHit = function (tx, ty) {
            var pList = this.m_pHeroList;
            var listPos = pList.localToGlobal();
            var lDx = tx - listPos.x;
            var lDy = ty - listPos.y;
            // if (lDx > 0 && lDx <= pList.width && lDy >= 0 && lDy <= pList.height) {
            if (this.m_pHeroList.hitTestPoint(tx, ty, false)) {
                for (var i = 0; i < pList.numChildren; i++) {
                    var item = pList.getChildAt(i);
                    var pos = item.localToGlobal();
                    var dx = tx - pos.x;
                    var dy = ty - pos.y;
                    if (dx >= 0 && dx <= 134 && dy >= 0 && dy <= 151) {
                        return item.data.generalId;
                    }
                }
            }
            return 0;
        };
        /**检查格子碰撞 */
        TeamPanel.prototype.checkGirdHit = function (hitPos) {
            var mindis = 9999;
            var index = -1;
            for (var i = 0; i < this.m_pTmpTeamList.length; i++) {
                var item = this["m_pItem" + i];
                var pos = item.localToGlobal(168.5, 85);
                var dis = egret.Point.distance(pos, hitPos);
                if (dis < mindis && dis < 140) {
                    mindis = dis;
                    index = i;
                }
            }
            return index;
        };
        /**创建拖动对象 */
        TeamPanel.prototype.createTeamSquare = function (id) {
            this.m_pTeamSquare = new com_main.TeamManualSquare(id);
            this.m_pTeamSquare.touchEnabled = false;
            this.m_pTeamSquare.isShowSorlider(false);
            this.m_pTeamSquare.isShowTip(false);
            this.m_pTeamSquare.isShowHead(false);
            this.addChild(this.m_pTeamSquare);
        };
        /**移除拖动对象 */
        TeamPanel.prototype.removeTeamSquare = function () {
            if (this.m_pTeamSquare) {
                Utils.removeFromParent(this.m_pTeamSquare);
                this.m_pTeamSquare = null;
            }
        };
        /**更新按钮组显示 */
        TeamPanel.prototype.refreshBtnView = function () {
            if (this.isNoChangeTeamGird()) {
                this.m_pGChangBtn.visible = false;
                this.m_pGFightBtn.visible = true;
            }
            else {
                this.m_pGChangBtn.visible = true;
                this.m_pGFightBtn.visible = false;
            }
            this.updateAddBtnShow(this.isNoChangeTeamGird());
        };
        TeamPanel.prototype.updateAddBtnShow = function (visible) {
            com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_TROOP_BTN_UPDATE, visible);
        };
        /**刷新战斗力 */
        TeamPanel.prototype.refreshFight = function () {
            var fight = 0;
            for (var i = 0; i < this.m_pTmpTeamList.length; i++) {
                var generalId = this.m_pTmpTeamList[i].generalId;
                if (generalId > 0) {
                    var genVo = GeneralModel.getOwnGeneral(generalId);
                    fight += genVo.fight;
                }
            }
            this.m_comFightItem.setFight(fight);
        };
        TeamPanel.prototype.playEffectByGenId = function (generId) {
            for (var index = 0; index < 5; index++) {
                var grid = this["m_pItem" + index];
                if (grid.generalId == generId) {
                    this.playeffect(index);
                    break;
                }
            }
        };
        /**
       * 更新英雄可上阵列表
       * @param  changeIds （上阵下阵）改变的英雄id
       */
        TeamPanel.prototype.refreshGeneralItems = function (changeIds) {
            //初始化未完成 跳出
            if (!this.m_pTmpTeamList)
                return;
            if (!changeIds) {
                //第一次创建 头像列表
                var heroArr = [];
                var list = TeamModel.getCanUpGeneralList(this.m_nTeamType, this.m_nOrder, this.nationLimit, this.typeLimit);
                for (var i = 0; i < list.length; i++) {
                    var genVo = list[i];
                    var generalId = genVo.generalId;
                    heroArr.push({ generalId: generalId, num: this.getArmyNumById(generalId), maxNum: genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER), isOnBatt: this.isOnBattle(generalId), teamId: this.getGeneralTeamId(generalId) });
                }
                this.m_pCollection.source = heroArr;
                this.m_pCollection.refresh();
            }
            else {
                //刷新变动头像
                for (var i = 0; i < this.m_pCollection.source.length; i++) {
                    var data = this.m_pCollection.source[i];
                    for (var k = 0; k < changeIds.length; k++) {
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
        };
        /**对比新旧数据获取改变的武将ids */
        TeamPanel.prototype.getChangeGeneralIds = function (list) {
            var changeIds = null;
            //存在旧数据
            if (list && list.length > 0) {
                changeIds = [];
                for (var i = 0; i < list.length; i++) {
                    var generalId = list[i].generalId;
                    if (generalId > 0) {
                        changeIds.push(generalId);
                    }
                }
            }
            return changeIds;
        };
        /**
       * 更新方阵显示
       */
        TeamPanel.prototype.refreshTeamGirdView = function (isClient) {
            if (isClient === void 0) { isClient = false; }
            for (var i = 0; i < this.m_pTmpTeamList.length; i++) {
                var data = this.m_pTmpTeamList[i];
                var item = this["m_pItem" + i];
                item.generalId = data.generalId;
                item.updateHp(this.getArmyNumById(data.generalId), isClient);
            }
            // this.refreshFateItem();
        };
        /**
       * 隐藏方阵格子显示
       */
        TeamPanel.prototype.hideTeamGirdView = function (id) {
            for (var i = 0; i < this.m_pTmpTeamList.length; i++) {
                var data = this.m_pTmpTeamList[i];
                var item = this["m_pItem" + i];
                if (item.generalId == id) {
                    item.generalId = 0;
                }
            }
        };
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
        TeamPanel.prototype.isOnBattle = function (id) {
            for (var i = 0; i < this.m_pTmpTeamList.length; i++) {
                var data = this.m_pTmpTeamList[i];
                if (data.generalId == id)
                    return true;
            }
            return false;
        };
        /**获得队伍id */
        TeamPanel.prototype.getGeneralTeamId = function (generalId) {
            var id = TeamModel.getGeneralTeamId(this.m_nTeamType, generalId, this.m_nOrder);
            if (id == -1 && this.isOnBattle(generalId)) {
                id = this.m_nOrder;
            }
            return id;
        };
        /**出生城提示 */
        TeamPanel.prototype.birthCityTips = function () {
            var city = WorldModel.getCityConfig(WorldModel.birthCity);
            EffectUtils.showTips(GCodeFromat(CLEnum.CAMP_TIPS1, GLan(city.name)), 1, true);
        };
        /**是否有改变阵型 */
        TeamPanel.prototype.isNoChangeTeamGird = function () {
            var oldIds = this.getOldIds();
            var newIds = [];
            for (var i = 0; i < this.m_pTmpTeamList.length; i++) {
                newIds.push(this.m_pTmpTeamList[i].generalId);
            }
            return oldIds.toString() == newIds.toString();
        };
        /**获得旧的布阵数组 */
        TeamPanel.prototype.getOldIds = function () {
            var oldIds = [0, 0, 0, 0, 0];
            for (var i = 0; i < this.m_pTeamVo.teamGeneralData.length; i++) {
                var data = this.m_pTeamVo.teamGeneralData[i];
                var generalId = data.generalId;
                if (generalId > 0) {
                    oldIds[data.position - 1] = generalId;
                }
            }
            return oldIds;
        };
        /**获得空的上阵格子 */
        TeamPanel.prototype.getEmptyGirdPos = function () {
            for (var i = 0; i < this.m_pTmpTeamList.length; i++) {
                var data = this.m_pTmpTeamList[i];
                if (data.generalId == 0) {
                    return i;
                }
            }
            return -1;
        };
        /**获得武将身上士兵 */
        TeamPanel.prototype.getArmyNumById = function (id) {
            //非世界地图上阵武将 兵力显示满
            if (this.m_nTeamType != 1 /* WORLD */ && this.m_nTeamType != 5 /* CROSS_SERVER */) {
                var genVo = GeneralModel.getOwnGeneral(id);
                if (genVo) {
                    return genVo.getGenAttriValByType(AttriType.MAX_LEAD_SOLDIER);
                }
                return 0;
            }
            var teamList = this.m_pTeamVo.teamGeneralData;
            for (var i = 0; i < teamList.length; i++) {
                var data = teamList[i];
                if (data.generalId == id)
                    return data.minSoldierTotalCount;
            }
            return 0;
        };
        TeamPanel.prototype.doDragGuide = function () {
            var _this = this;
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
            var _a = [this.m_pItem0, this.m_pItem1], item0 = _a[0], item1 = _a[1];
            var startPos = { x: item0.x + item0.width * 0.5, y: item0.y + item0.height * 0.5 };
            var endPos = { x: item1.x + item1.width * 0.5, y: item1.y + item1.height * 0.5 };
            NodeUtils.setPosition(this.m_guideIcon, startPos.x + 100, startPos.y - 100);
            NodeUtils.setPosition(this.m_imgFlag, (startPos.x + endPos.x) * 0.5, (startPos.y + endPos.y) * 0.5);
            var tw = egret.Tween.get(this.m_guideIcon, { loop: true });
            tw.to({ x: startPos.x, y: startPos.y }, 500, Ease.cubicOut);
            tw.to({ x: endPos.x, y: endPos.y }, 800, Ease.cubicOut);
            tw.wait(300);
            tw.call(function () {
                NodeUtils.setPosition(_this.m_guideIcon, startPos.x + 100, startPos.y - 100);
            }, this);
            this.m_pMask = new eui.Group();
            this.m_pMask.width = AGame.R.app.stageWidth;
            this.m_pMask.height = AGame.R.app.stageHeight;
            this.addChild(this.m_pMask);
            this.m_pMask.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMaskTouchBegin, this);
            this.m_pMask.addEventListener(egret.TouchEvent.TOUCH_END, this.onMaskTouchEnd, this);
        };
        /**遮罩 */
        TeamPanel.prototype.onMaskTouchBegin = function (e) {
            //布阵格子碰撞检测
            var hitPos = new egret.Point(e.stageX, e.stageY);
            var girdPos = this.checkGirdHit(hitPos);
            if (girdPos == 0) {
                return;
            }
            e.stopPropagation();
        };
        /**遮罩 */
        TeamPanel.prototype.onMaskTouchEnd = function (e) {
            //布阵格子碰撞检测
            var hitPos = new egret.Point(e.stageX, e.stageY);
            var girdPos = this.checkGirdHit(hitPos);
            if (girdPos == 1) {
                return;
            }
            e.stopPropagation();
        };
        TeamPanel.prototype.clearDragGuide = function () {
            if (!this.m_bInDragGuide)
                return;
            this.m_bInDragGuide = false;
            egret.Tween.removeTweens(this.m_guideIcon);
            Utils.removeFromParent(this.m_guideIcon);
            Utils.removeFromParent(this.m_pMask);
            Utils.removeFromParent(this.m_imgFlag);
            this.m_pMask.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMaskTouchBegin, this);
            this.m_pMask.removeEventListener(egret.TouchEvent.TOUCH_END, this.onMaskTouchEnd, this);
            SceneManager.sendPanelGuide();
        };
        TeamPanel.NAME = "TeamPanel";
        return TeamPanel;
    }(com_main.CComponent));
    com_main.TeamPanel = TeamPanel;
    /**
    * 英雄上阵头像Item
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    var TeamHeroItem = /** @class */ (function (_super_1) {
        __extends(TeamHeroItem, _super_1);
        function TeamHeroItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin('team/TeamHeroItemSkin.exml');
            return _this;
        }
        TeamHeroItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**
         * data generalId num maxNum isOnBatts
         */
        TeamHeroItem.prototype.dataChanged = function () {
            this.m_pHero.setGenId(this.data.generalId);
            this.m_pHero.refreshArmyPro(this.data.num, this.data.maxNum, this.data.isOnBatt);
            if (this.data.teamId >= 0) {
                this.m_pTeamRoot.visible = true;
                this.m_labTeamId.text = GCode(CLEnum.CAMP_ARMY) + Global.getNumber(this.data.teamId + 1);
            }
            else {
                this.m_pTeamRoot.visible = false;
            }
        };
        return TeamHeroItem;
    }(eui.ItemRenderer));
    com_main.TeamHeroItem = TeamHeroItem;
})(com_main || (com_main = {}));
