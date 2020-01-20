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
    var RebirthView = /** @class */ (function (_super_1) {
        __extends(RebirthView, _super_1);
        function RebirthView(width, height) {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.EquipDeComposeView.NAME;
            _this.initApp("general/rebirth/RebirthViewSkin.exml");
            _this.width = width;
            _this.height = height;
            return _this;
        }
        RebirthView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        RebirthView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
            this.m_listGen.removeChildren();
            this.m_listItem.removeChildren();
        };
        RebirthView.prototype.childrenCreated = function () {
            this.m_nItemIds = [];
            this.m_tItemList = [];
            Utils.toStageBestScale(this.m_pViewRoot);
            this.m_btnAllSure.setTitleLabel(GCode(CLEnum.REBIRTH));
            this.m_currIndex = -1;
            this.m_genInfo.visible = false;
        };
        /**初始化 */
        RebirthView.prototype.initView = function () {
            var _this = this;
            if (this.m_bInit)
                return;
            this.m_bInit = true;
            this.m_tCollects = new eui.ArrayCollection();
            this.m_listGen.dataProvider = this.m_tCollects;
            this.m_listGen.itemRenderer = RebirthRender;
            egret.callLater(function () {
                if (_this.m_listGen) {
                    Utils.tileGroupToCenter(_this.m_listGen, 134);
                }
            }, this);
            this.validateNow();
            this.initGeneralHeadItems();
            this.setCurrCostInfo();
            Utils.isGray(true, this.m_btnAllSure);
            this.m_btnAllSure.enabled = false;
            this.addEvent();
        };
        RebirthView.prototype.changeTag = function (index) {
        };
        /**初始化列表 */
        RebirthView.prototype.initGeneralHeadItems = function () {
            var list = GeneralModel.getOwnGeneralWithOnBattle();
            var curIndex = 0;
            var heroArr = [];
            for (var i = 0; i < list.length; i++) {
                var vo = list[i];
                var data = { id: vo.generalId, sel: false, redState: false, upState: false };
                heroArr.push(data);
                // if (vo.generalId == this.m_nGeneralId) curIndex = i;
            }
            this.m_tCollects.replaceAll(heroArr);
            // this.setCurSelected(curIndex);
        };
        /**设置当前选中武将下标 */
        RebirthView.prototype.setCurSelected = function (index) {
            if (this.m_currIndex == index) {
                this.refrestSelItem(this.m_currIndex, false);
                this.m_currIndex = -1;
                this.setCurrGenInfo();
                this.setCurrCostInfo();
                this.m_tItemList = [];
                this.m_nItemIds = [];
                this.allNoshow();
                return;
            }
            this.refrestSelItem(this.m_currIndex, false);
            this.m_currIndex = index;
            this.refrestSelItem(this.m_currIndex, true);
            this.RebirthShowTip();
        };
        /**刷新选中武将 */
        RebirthView.prototype.refrestSelItem = function (index, val) {
            var data = this.m_tCollects.getItemAt(index);
            if (data) {
                data.sel = val;
                this.m_tCollects.replaceItemAt(data, index);
                this.m_currGenId = data.id;
                this.setCurrGenInfo();
                this.setCurrCostInfo();
                this.m_tItemList = [];
                this.m_nItemIds = [];
                if (data.sel) {
                    this.setCurrResources();
                }
                this.creatItem();
            }
        };
        /**选中武将信息设置*/
        RebirthView.prototype.setCurrGenInfo = function () {
            this.m_genInfo.visible = this.m_currIndex == -1 ? false : true;
            if (this.m_currIndex == -1)
                return;
            this.m_genInfo.setGenId(this.m_currGenId);
        };
        /**选中武将消耗设置*/
        RebirthView.prototype.setCurrCostInfo = function () {
            this.m_comResCost.visible = this.m_currIndex == -1 ? false : true;
            if (this.m_currIndex == -1)
                return;
            var items;
            var cfg = C.GeneralConfig[Number(this.m_currGenId)];
            if (cfg) {
                items = Utils.parseCommonItemJson(cfg.rebirthCosts)[0];
                this.m_comResCost.setInfo(items.itemId, items.count);
            }
        };
        /**重生后刷新信息 */
        RebirthView.prototype.refrestSelGen = function () {
            var data = this.m_tCollects.getItemAt(this.m_currIndex);
            if (data) {
                this.m_tCollects.replaceItemAt(data, this.m_currIndex);
            }
        };
        /**重生后返还的资源数据设置*/
        RebirthView.prototype.setCurrResources = function () {
            this.m_listItem.visible = this.m_currIndex == -1 ? false : true;
            var generalVo = GeneralModel.getOwnGeneral(this.m_currGenId);
            if (generalVo) {
                this.toBackExp(generalVo); //重生后返还经验书
                this.toBackSkill(generalVo); //重生后返还武将技能书
                // this.toBackGenDebris(generalVo);//重生后返还武将碎片
                this.toBackStreng(generalVo); //返还的强化石,升阶石,精炼石和银两
            }
            Utils.isGray(this.m_tItemList.length <= 0 || TeamModel.isOnBattle(this.m_currGenId), this.m_btnAllSure);
            this.m_btnAllSure.enabled = this.m_tItemList.length <= 0 || TeamModel.isOnBattle(this.m_currGenId) ? false : true;
        };
        /*=========================================================================================================================/
        /**重生后返还经验书*/
        RebirthView.prototype.toBackExp = function (vo) {
            var cfgLvExp = 0; //返还的经验
            for (var key in C.GeneralLevelConfig) {
                var levelcfg = C.GeneralLevelConfig[key];
                if (vo.level > levelcfg.level) {
                    cfgLvExp += levelcfg.exp;
                }
                if (levelcfg.isUpgrade && vo.upgradeLevel >= levelcfg.level) {
                    var data = Utils.parseCommonItemJson(levelcfg.consume);
                    this.addItemInList(data);
                }
            }
            var allExp = cfgLvExp + vo.curExp; //等级总经验加剩余经验
            this.changeBookByExp(allExp);
        };
        /**经验转为经验书 */
        RebirthView.prototype.changeBookByExp = function (totalExp) {
            var list = [];
            var expItems = [PropEnum.expBook5, PropEnum.expBook4, PropEnum.expBook3, PropEnum.expBook2, PropEnum.expBook1];
            for (var i = 0; i < expItems.length; i++) {
                var expId = expItems[i];
                var itemExp = C.ExpBookConfig[expId].exp;
                var count = 0;
                while (totalExp >= itemExp) {
                    totalExp -= itemExp;
                    count++;
                }
                if (count > 0)
                    list.push(IItemInfoPool.create(expId, count));
            }
            this.addItemInList(list);
        };
        // /*返还武将碎片转为百战精华*/
        // private toBackGenDebris(vo: GeneralVo) {
        //     let debrisItem: IItemInfo;
        //     let count = 0;
        //     let debrisList = C.GeneralStarConfig;
        //     let bzList = C.GeneralRebirthConfig[vo.qualityLevel];//武将碎片转换百战精华表配置
        //     let data = Utils.parseCommonItemJson(bzList.transform);
        //     for (let key in debrisList) {
        //         let debriscfg = debrisList[key]
        //         if (vo.star > debriscfg.id && debriscfg.id >= vo.config.starLevel) {
        //             count += debriscfg.soulNum
        //         }
        //     }
        //     let bzNum = count * data[0].count;
        //     let itemId = data[0].itemId;
        //     if (itemId && bzNum > 0) {
        //         this.addItemInList([IItemInfoPool.create(itemId, bzNum)]);
        //     }
        // }
        /*返还的武将技能书*/
        RebirthView.prototype.toBackSkill = function (vo) {
            var skill = vo.skills[0];
            var skillList = GeneralModel.getSkillLvListbySkill(skill.skillId);
            for (var i = 0; i < skillList.length; i++) {
                var levelcfg = skillList[i];
                if (skill.level > levelcfg.skillLv && levelcfg.skillLv > 0) {
                    var data = Utils.parseCommonItemJson(levelcfg.upConsume);
                    this.addItemInList(data);
                }
            }
        };
        /*返还的强化石,升阶石,精炼石和银两*/
        RebirthView.prototype.toBackStreng = function (vo) {
            for (var i = 0; i < 4; i++) {
                var equip = vo.getEquipByPos(i);
                var strengList = EquipModel.getLevelPosCfg(i, PropEnum.EQUIP_QH);
                for (var k = 0; k < strengList.length; k++) {
                    if (equip.strengthen > strengList[k].level) {
                        var data = Utils.parseCommonItemJson(strengList[k].consume);
                        this.addItemInList(data);
                    }
                }
                var gradeList = EquipModel.getLevelPosCfg(i, PropEnum.EQUIP_SJ);
                for (var k = 0; k < gradeList.length; k++) {
                    if (equip.grade > gradeList[k].level) {
                        var data = Utils.parseCommonItemJson(gradeList[k].consume);
                        this.addItemInList(data);
                    }
                }
                var wrougthList = EquipModel.getLevelPosCfg(i, PropEnum.EQUIP_JL);
                for (var k = 0; k < wrougthList.length; k++) {
                    if (equip.wrought > wrougthList[k].level) {
                        var data = Utils.parseCommonItemJson(wrougthList[k].consume);
                        this.addItemInList(data);
                    }
                }
            }
        };
        /**添加材料 */
        RebirthView.prototype.addItemInList = function (list) {
            for (var i = 0; i < list.length; i++) {
                var index = this.m_nItemIds.indexOf(list[i].itemId);
                if (index == -1) {
                    this.m_nItemIds.push(list[i].itemId);
                    this.m_tItemList.push(list[i]);
                }
                else {
                    this.m_tItemList[index].count += list[i].count;
                    IItemInfoPool.release(list[i]);
                }
            }
        };
        /*========================================================================================================================================*/
        /**显示返还的物品信息 */
        RebirthView.prototype.creatItem = function () {
            this.m_listItem.removeChildren();
            this.m_pScroller.viewport.scrollH = 0;
            for (var i = 0; i < this.m_tItemList.length; i++) {
                var item = com_main.ComItemNew.create("count");
                item.setItemInfo(this.m_tItemList[i].itemId, this.m_tItemList[i].count);
                this.m_listItem.addChild(item);
            }
        };
        /**不显示，按钮致灰 */
        RebirthView.prototype.allNoshow = function () {
            Utils.isGray(true, this.m_btnAllSure);
            this.m_btnAllSure.enabled = false;
            this.m_listItem.removeChildren();
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        /**监听事件 */
        RebirthView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnAllSure, this, this.onConfirmClick);
            com_main.EventMgr.addEvent(RebirthEvent.REBIRTH_UPDATE, this.updataRebirth, this);
            this.m_listGen.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.changeItemSelected, this);
        };
        /**移除事件 */
        RebirthView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(RebirthEvent.REBIRTH_UPDATE, this);
            this.m_listGen.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.changeItemSelected, this);
        };
        /**重生刷新信息 */
        RebirthView.prototype.updataRebirth = function () {
            this.refrestSelGen();
            this.allNoshow();
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, this.m_tItemList);
        };
        /**点击重生 */
        RebirthView.prototype.onConfirmClick = function () {
            var _this = this;
            var cfg = C.GeneralConfig[Number(this.m_currGenId)];
            if (cfg) {
                var costs_1 = Utils.parseCommonItemJson(cfg.rebirthCosts);
                if (cfg.qualityLevel >= 5) {
                    Utils.showConfirmPop(GCodeFromat(CLEnum.REBIRTH_SUR_REDGEM), function () {
                        if (PropModel.isItemListEnough(costs_1, 3)) {
                            GeneralProxy.send_C2S_GENERAL_REBIRTH(_this.m_currGenId);
                        }
                    }, this);
                }
                else {
                    if (PropModel.isItemListEnough(costs_1, 3)) {
                        GeneralProxy.send_C2S_GENERAL_REBIRTH(this.m_currGenId);
                    }
                }
            }
        };
        /**选中武将提示 */
        RebirthView.prototype.RebirthShowTip = function () {
            if (TeamModel.getTeamBattleByType(this.m_currGenId, 2 /* PVE */)) {
                EffectUtils.showTips(GCode(CLEnum.REBIRTH_PVE_BATTLE), 1, true);
                return;
            }
            if (TeamModel.getTeamBattleByType(this.m_currGenId, 1 /* WORLD */)) {
                EffectUtils.showTips(GCode(CLEnum.REBIRTH_WORLD_BATTLE), 1, true);
                return;
            }
            // if (TeamModel.getTeamBattleByType(this.m_currGenId, TeamType.DEF_APK)) {
            //     EffectUtils.showTips(GCode(CLEnum.REBIRTH_APK_BATTLE), 1, true);
            //     return;
            // }
        };
        /**当前选中 */
        RebirthView.prototype.changeItemSelected = function (e) {
            this.setCurSelected(e.itemIndex);
        };
        RebirthView.NAME = 'RebirthView';
        return RebirthView;
    }(com_main.CView));
    com_main.RebirthView = RebirthView;
    /**
    * 英雄
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    var RebirthRender = /** @class */ (function (_super_1) {
        __extends(RebirthRender, _super_1);
        function RebirthRender() {
            var _this = _super_1.call(this) || this;
            _this.width = 130;
            _this.height = 137;
            return _this;
        }
        RebirthRender.prototype.$onRemoveFromStage = function () {
            this.m_headRender.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        RebirthRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_headRender = com_main.GeneralHeadRender.create("arena_name");
            this.addChild(this.m_headRender);
            NodeUtils.setScale(this.m_headRender, 1);
            this.m_imgSelected = new eui.Image('small_general_head_light_png');
            this.m_imgSelected.x = 5;
            this.m_imgSelected.y = 5;
            NodeUtils.setScale(this.m_imgSelected, 0.76);
            this.m_imgSelected.visible = false;
            this.addChild(this.m_imgSelected);
            this.m_isOnBattle = new eui.Image('lb_ysz_png');
            this.m_isOnBattle.x = 20;
            this.m_isOnBattle.y = 50;
            NodeUtils.setScale(this.m_isOnBattle, 1);
            this.m_isOnBattle.visible = false;
            this.addChild(this.m_isOnBattle);
        };
        RebirthRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_headRender.setGenId(this.m_tData.id);
            this.m_imgSelected.visible = this.m_tData.sel == true;
            this.m_isOnBattle.visible = TeamModel.isOnBattle(this.m_tData.id) ? true : false;
        };
        return RebirthRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
