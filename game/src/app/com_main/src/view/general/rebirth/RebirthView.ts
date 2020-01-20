module com_main {
    export class RebirthView extends CView implements IRebirthTabView {
        public static NAME = 'RebirthView';
        public m_btnAllSure: com_main.ComButton;
        public m_comResCost: com_main.ComResCost;
        public m_genInfo: com_main.GeneralHeadRender;
        public m_listGen: eui.List;
        public m_listItem: eui.Group;
        public m_pScroller: eui.Scroller;
        public m_pViewRoot:eui.Group;

        private m_currIndex: number;//当前选择武将下标
        private m_currGenId: number;//当前选择武将id
        private m_tCollects: eui.ArrayCollection;
        private m_items: ComItemNew[];
        private m_nItemIds: number[];
        private m_tItemList: IItemInfo[];//返还的资源列表
        public m_bInit: boolean;

        public constructor(width: number, height: number) {
            super();
            this.name = EquipDeComposeView.NAME;
            this.initApp("general/rebirth/RebirthViewSkin.exml");
            this.width = width;
            this.height = height;

        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
            this.m_listGen.removeChildren();
            this.m_listItem.removeChildren();

        }
        protected childrenCreated(): void {
            this.m_nItemIds = [];
            this.m_tItemList = [];
            Utils.toStageBestScale(this.m_pViewRoot);
            this.m_btnAllSure.setTitleLabel(GCode(CLEnum.REBIRTH));
            this.m_currIndex = -1;
            this.m_genInfo.visible = false;
        }
        /**初始化 */
        public initView() {
            if (this.m_bInit) return;
            this.m_bInit = true;

            this.m_tCollects = new eui.ArrayCollection();
            this.m_listGen.dataProvider = this.m_tCollects;
            this.m_listGen.itemRenderer = RebirthRender;


            egret.callLater(() => {
                if (this.m_listGen) {
                    Utils.tileGroupToCenter(this.m_listGen, 134);
                }
            }, this);
            this.validateNow();
            this.initGeneralHeadItems();
            this.setCurrCostInfo();
            Utils.isGray(true, this.m_btnAllSure);
            this.m_btnAllSure.enabled = false;
            this.addEvent();
        }
        public changeTag(index: number) {

        }
        /**初始化列表 */
        private initGeneralHeadItems() {
            let list = GeneralModel.getOwnGeneralWithOnBattle();
            let curIndex = 0;
            let heroArr = [];
            for (let i = 0; i < list.length; i++) {
                let vo = list[i];
                let data: IReBirthCellRD = { id: vo.generalId, sel: false, redState: false, upState: false };
                heroArr.push(data);
                // if (vo.generalId == this.m_nGeneralId) curIndex = i;
            }
            this.m_tCollects.replaceAll(heroArr);
            // this.setCurSelected(curIndex);
        }

        /**设置当前选中武将下标 */
        private setCurSelected(index: number) {
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

        }
        /**刷新选中武将 */
        private refrestSelItem(index: number, val: boolean) {
            let data = this.m_tCollects.getItemAt(index) as IReBirthCellRD;
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
        }
        /**选中武将信息设置*/
        private setCurrGenInfo() {
            this.m_genInfo.visible = this.m_currIndex == -1 ? false : true;
            if (this.m_currIndex == -1) return;
            this.m_genInfo.setGenId(this.m_currGenId);

        }
        /**选中武将消耗设置*/
        private setCurrCostInfo() {
            this.m_comResCost.visible = this.m_currIndex == -1 ? false : true;
            if (this.m_currIndex == -1) return;
            let items: IItemInfo;
            let cfg = C.GeneralConfig[Number(this.m_currGenId)];
            if (cfg) {
                items = Utils.parseCommonItemJson(cfg.rebirthCosts)[0];
                this.m_comResCost.setInfo(items.itemId, items.count);
            }
        }
        /**重生后刷新信息 */
        private refrestSelGen() {
            let data = this.m_tCollects.getItemAt(this.m_currIndex) as IReBirthCellRD;
            if (data) {
                this.m_tCollects.replaceItemAt(data, this.m_currIndex);
            }
        }
        /**重生后返还的资源数据设置*/
        private setCurrResources() {
            this.m_listItem.visible = this.m_currIndex == -1 ? false : true;
            let generalVo = GeneralModel.getOwnGeneral(this.m_currGenId);
            if (generalVo) {
                this.toBackExp(generalVo);//重生后返还经验书
                this.toBackSkill(generalVo);//重生后返还武将技能书
                // this.toBackGenDebris(generalVo);//重生后返还武将碎片
                this.toBackStreng(generalVo);//返还的强化石,升阶石,精炼石和银两
            }
            Utils.isGray(this.m_tItemList.length <= 0 || TeamModel.isOnBattle(this.m_currGenId), this.m_btnAllSure);
            this.m_btnAllSure.enabled = this.m_tItemList.length <= 0 || TeamModel.isOnBattle(this.m_currGenId) ? false : true;
        }
        /*=========================================================================================================================/
        /**重生后返还经验书*/
        private toBackExp(vo: GeneralVo) {
            let cfgLvExp = 0;//返还的经验
            for (let key in C.GeneralLevelConfig) {
                let levelcfg = C.GeneralLevelConfig[key];
                if (vo.level > levelcfg.level) {
                    cfgLvExp += levelcfg.exp;
                }
                if (levelcfg.isUpgrade && vo.upgradeLevel >= levelcfg.level) {
                    let data = Utils.parseCommonItemJson(levelcfg.consume);
                    this.addItemInList(data);
                }
            }
            let allExp = cfgLvExp + vo.curExp;//等级总经验加剩余经验
            this.changeBookByExp(allExp);
        }

        /**经验转为经验书 */
        private changeBookByExp(totalExp: number) {
            let list: IItemInfo[] = [];
            let expItems = [PropEnum.expBook5, PropEnum.expBook4, PropEnum.expBook3, PropEnum.expBook2, PropEnum.expBook1];
            for (let i = 0; i < expItems.length; i++) {
                let expId = expItems[i];
                let itemExp = C.ExpBookConfig[expId].exp;
                let count = 0;
                while (totalExp >= itemExp) {
                    totalExp -= itemExp;
                    count++;
                }
                if (count > 0) list.push(IItemInfoPool.create(expId, count));
            }
            this.addItemInList(list);
        }
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
        private toBackSkill(vo: GeneralVo) {
            let skill = vo.skills[0];
            let skillList = GeneralModel.getSkillLvListbySkill(skill.skillId);
            for (let i = 0; i < skillList.length; i++) {
                let levelcfg = skillList[i]
                if (skill.level > levelcfg.skillLv && levelcfg.skillLv > 0) {
                    let data = Utils.parseCommonItemJson(levelcfg.upConsume);
                    this.addItemInList(data);
                }
            }
        }
        /*返还的强化石,升阶石,精炼石和银两*/
        private toBackStreng(vo: GeneralVo) {
            for (let i = 0; i < 4; i++) {
                let equip = vo.getEquipByPos(i);
                let strengList = EquipModel.getLevelPosCfg(i, PropEnum.EQUIP_QH);
                for (let k = 0; k < strengList.length; k++) {
                    if (equip.strengthen > strengList[k].level) {
                        let data = Utils.parseCommonItemJson(strengList[k].consume);
                        this.addItemInList(data);
                    }
                }
                let gradeList = EquipModel.getLevelPosCfg(i, PropEnum.EQUIP_SJ);
                for (let k = 0; k < gradeList.length; k++) {
                    if (equip.grade > gradeList[k].level) {
                        let data = Utils.parseCommonItemJson(gradeList[k].consume);
                        this.addItemInList(data);
                    }
                }
                let wrougthList = EquipModel.getLevelPosCfg(i, PropEnum.EQUIP_JL);
                for (let k = 0; k < wrougthList.length; k++) {
                    if (equip.wrought > wrougthList[k].level) {
                        let data = Utils.parseCommonItemJson(wrougthList[k].consume);
                        this.addItemInList(data);
                    }
                }
            }
        }
        /**添加材料 */
        private addItemInList(list: IItemInfo[]) {
            for (let i = 0; i < list.length; i++) {
                let index = this.m_nItemIds.indexOf(list[i].itemId);
                if (index == -1) {
                    this.m_nItemIds.push(list[i].itemId);
                    this.m_tItemList.push(list[i]);
                } else {
                    this.m_tItemList[index].count += list[i].count;
                    IItemInfoPool.release(list[i]);
                }
            }
        }
        /*========================================================================================================================================*/
        /**显示返还的物品信息 */
        private creatItem() {
            this.m_listItem.removeChildren();
            this.m_pScroller.viewport.scrollH = 0;
            for (let i = 0; i < this.m_tItemList.length; i++) {
                let item = ComItemNew.create("count");
                item.setItemInfo(this.m_tItemList[i].itemId, this.m_tItemList[i].count);
                this.m_listItem.addChild(item);
            }
        }

        /**不显示，按钮致灰 */
        private allNoshow() {
            Utils.isGray(true, this.m_btnAllSure);
            this.m_btnAllSure.enabled = false;
            this.m_listItem.removeChildren();
        }


		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnAllSure, this, this.onConfirmClick);
            EventMgr.addEvent(RebirthEvent.REBIRTH_UPDATE, this.updataRebirth, this);
            this.m_listGen.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.changeItemSelected, this)
        }
        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(RebirthEvent.REBIRTH_UPDATE, this);
            this.m_listGen.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.changeItemSelected, this)
        }
        /**重生刷新信息 */
        private updataRebirth() {
            this.refrestSelGen();
            this.allNoshow();
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, this.m_tItemList);
        }

        /**点击重生 */
        private onConfirmClick() {
            let cfg = C.GeneralConfig[Number(this.m_currGenId)];
            if (cfg) {
                let costs = Utils.parseCommonItemJson(cfg.rebirthCosts);
                if (cfg.qualityLevel >= 5) {
                    Utils.showConfirmPop(GCodeFromat(CLEnum.REBIRTH_SUR_REDGEM), () => {
                        if (PropModel.isItemListEnough(costs, 3)) {
                            GeneralProxy.send_C2S_GENERAL_REBIRTH(this.m_currGenId);
                        }
                    }, this);
                } else {
                    if (PropModel.isItemListEnough(costs, 3)) {
                        GeneralProxy.send_C2S_GENERAL_REBIRTH(this.m_currGenId);
                    }
                }
            }
        }
        /**选中武将提示 */
        private RebirthShowTip() {
            if (TeamModel.getTeamBattleByType(this.m_currGenId, TeamType.PVE)) {
                EffectUtils.showTips(GCode(CLEnum.REBIRTH_PVE_BATTLE), 1, true);
                return;
            }
            if (TeamModel.getTeamBattleByType(this.m_currGenId, TeamType.WORLD)) {
                EffectUtils.showTips(GCode(CLEnum.REBIRTH_WORLD_BATTLE), 1, true);
                return;
            }
            // if (TeamModel.getTeamBattleByType(this.m_currGenId, TeamType.DEF_APK)) {
            //     EffectUtils.showTips(GCode(CLEnum.REBIRTH_APK_BATTLE), 1, true);
            //     return;
            // }
        }

        /**当前选中 */
        private changeItemSelected(e: any) {
            this.setCurSelected(e.itemIndex);
        }

		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }
    interface IReBirthCellRD {
        id: number,
        sel: boolean,
        redState: boolean,
        upState: boolean,
    }
    /**
    * 英雄
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    class RebirthRender extends eui.ItemRenderer {
        protected m_headRender: GeneralHeadRender;
        protected m_imgSelected: eui.Image;
        protected m_isOnBattle: eui.Image;
        protected m_tData: IReBirthCellRD;
        public constructor() {
            super();
            this.width = 130;
            this.height = 137;
        }

        $onRemoveFromStage(): void {
            this.m_headRender.onDestroy();
            super.$onRemoveFromStage();

        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_headRender = GeneralHeadRender.create("arena_name");
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
        }
        protected dataChanged() {
            this.m_tData = this.data;
            this.m_headRender.setGenId(this.m_tData.id);
            this.m_imgSelected.visible = this.m_tData.sel == true;
            this.m_isOnBattle.visible = TeamModel.isOnBattle(this.m_tData.id) ? true : false;
        }
    }
}