module com_main {
    export class GeneralStrengView extends GeneralBaseView {
        public static NAME = "GeneralStrengView";
        public static EXP_PRO_MAX: number = 290;

        public m_labStarFull: eui.Label;
        public m_groupSoul: eui.Group;
        public m_labSoulNum: eui.Label;
        public m_btnUpStart: com_main.ComButton;
        public m_comItem: com_main.ComItemNew;
        public m_labLevel: eui.Label;
        public m_imgExpPro: eui.Image;
        public m_labExpPro: eui.Label;
        public m_btnUpLevel: com_main.ComButton;
        public m_expItem0: com_main.GeneralExpItemRender;
        public m_expItem1: com_main.GeneralExpItemRender;
        public m_expItem2: com_main.GeneralExpItemRender;
        public m_expItem3: com_main.GeneralExpItemRender;
        public m_expItem4: com_main.GeneralExpItemRender;
        public m_labUp: eui.Label;
        public m_pProRoot: eui.Group;
        public m_pTupoRoot: eui.Group;
        public m_comTuPoItem: com_main.ComItemNew;
        public m_labtuPName: eui.Label;
        public m_labtuPNum: eui.Label;
        public m_labTitle: eui.Label;
        public m_labGenLevel: eui.Label;

        private cfg: GeneralLevelConfig
        private itemIdList = [PropEnum.expBook1, PropEnum.expBook2, PropEnum.expBook3, PropEnum.expBook4, PropEnum.expBook5];

        public constructor(width: number, height: number) {
            super(width, height);
            this.skinName = Utils.getAppSkin("general/tabView/GeneralStrengViewSkin.exml");
            this.name = GeneralStrengView.NAME;
        }

        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListener(this.m_btnUpStart);
            EventManager.removeEventListener(this.m_btnUpLevel);
            EventMgr.removeEventByObject(GeneralEvent.GENERAL_EXP, this);
        }


        protected childrenCreated() {
            super.childrenCreated();
            this.m_btnUpStart.setTitleLabel(GCode(CLEnum.STAR_UP));
            this.m_btnUpStart.visible = FunctionModel.isFunctionOpen(FunctionType.GENERAL_STAR);
            for (let i = 0; i < this.itemIdList.length; i++) {
                let item = this[`m_expItem${i}`] as GeneralExpItemRender;
                item.itemId = this.itemIdList[i];
            }
            EventMgr.addEvent(GeneralEvent.GENERAL_EXP, this.refreshExpView, this);
        }


        public refreshView() {
            super.refreshView();

            if (!this.generalVo) {
                return;
            }
            this.refreshLevelView();

            this.m_comItem.setItemInfo(this.generalVo.config.itemId);

            if (this.generalVo.star >= GeneralModel.MAX_STAR) {
                this.m_labStarFull.visible = true;
                this.m_groupSoul.visible = false;
            } else {
                this.m_groupSoul.visible = true;
                this.m_labStarFull.visible = false;
            }
            this.refreshSoulNum();

            for (let i = 0; i < this.itemIdList.length; i++) {
                let item = this[`m_expItem${i}`] as GeneralExpItemRender;
                item.generalId = this.generalId;
            }

        }
        /**刷新将魂 */
        public refreshSoulNum() {
            if (!this.generalVo) {
                return;
            }
            let soulId = this.generalVo.config.itemId;
            let soulNum = PropModel.getPropNum(soulId);
            let needNum = this.generalVo.getUpStarNeedNum();

            Utils.setRedProcessText(this.m_labSoulNum, soulNum, needNum);
            if (needNum <= soulNum) {
                this.m_btnUpStart.currentState = 'style1';
            } else {
                this.m_btnUpStart.currentState = 'style6';
            }
        }

        /**刷新等级 */
        public refreshLevelView() {
            if (!this.generalVo) {
                return;
            }
            if (GeneralModel.canUpLevel(this.generalId) || GeneralModel.canTupodan(this.generalId)) {
                this.m_btnUpLevel.currentState = 'style1';
            } else {
                this.m_btnUpLevel.currentState = 'style6';
            }
            this.m_labLevel.text = this.generalVo.level + "";
            this.cfg = this.generalVo.GetGeneralCfg();
            if (this.generalVo.GetGeneralIsTuPo() == 0) {
                this.refreshExpView();
                this.m_pProRoot.visible = true;
                this.m_pTupoRoot.visible = false;
                this.m_labGenLevel.text = '';
                this.m_labTitle.text = GCode(CLEnum.LEVEL_UP);
                let str = this.generalVo.level >= 60 ? GCode(CLEnum.LEVEL_UP) : GCode(CLEnum.LEVEL_UP1);
                this.m_btnUpLevel.setTitleLabel(str);
                RedPointModel.AddInfoListener(this.m_btnUpLevel, { x: 115, y: -3, scale: 0.78 }, [RedEvtType.GEN_LEVEL], 2, { generalId: this.generalId });
            } else {
                this.m_pProRoot.visible = false;
                this.m_pTupoRoot.visible = true;
                this.m_labTitle.text = GCode(CLEnum.GEN_TUPO);
                this.m_btnUpLevel.setTitleLabel(GCode(CLEnum.GEN_TUPO));

                let tuPoNum = PropModel.getPropNum(this.generalVo.upgrageItem.itemId);
                this.m_comTuPoItem.setItemInfo(this.generalVo.upgrageItem.itemId);
                Utils.setPropLabName(this.generalVo.upgrageItem.itemId, this.m_labtuPName);
                this.m_labtuPNum.text = tuPoNum + '/' + this.generalVo.upgrageItem.count;
                this.m_labtuPNum.x = this.m_labtuPName.x + this.m_labtuPName.width + 5;
                this.m_labGenLevel.text = GCode(CLEnum.LEVEL3) + this.generalVo.level;
                Utils.setRedProcessText(this.m_labtuPNum, tuPoNum, this.generalVo.upgrageItem.count);
                RedPointModel.AddInfoListener(this.m_btnUpLevel, { x: 115, y: -3, scale: 0.78 }, [RedEvtType.GEN_TUPODAN], 2, { generalId: this.generalId });
            }

            RedPointModel.AddInfoListener(this.m_btnUpStart, { x: 115, y: -3, scale: 0.78 }, [RedEvtType.GEN_STAR], 2, { generalId: this.generalId });
        }

        /**刷新经验 */
        public refreshExpView() {
            this.m_labExpPro.text = this.generalVo.curExp + "/" + this.generalVo.GetMaxExp();
            let pro = (this.generalVo.curExp / this.generalVo.GetMaxExp()) > 1 ? 1 : (this.generalVo.curExp / this.generalVo.GetMaxExp());
            this.m_imgExpPro.width = pro * GeneralStrengView.EXP_PRO_MAX;
        }



        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */

        protected addEvent() {
            EventManager.addTouchScaleListener(this.m_btnUpStart, this, this.onclickButtonBule);
            EventManager.addTouchScaleListener(this.m_btnUpLevel, this, this.onclickButtonYellew);
            EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
        }

        protected removeEvent() {
            EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
        }

        /**物品数量变化 */
        private onPropItemChange(itemId: number) {
            if (this.generalVo && itemId == this.generalVo.config.itemId) {
                this.refreshSoulNum();
            }
        }


        public onclickButtonBule() {
            if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GENERAL_STAR)) {
                let soulId = this.generalVo.config.itemId;
                let soulNum = PropModel.getPropNum(soulId);
                if (soulNum < this.generalVo.getUpStarNeedNum()) {
                    EffectUtils.showTips(GCodeFromat(CLEnum.GEN_STAR_FAL, Utils.getPropName(soulId)), 1, true);
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, soulId);
                } else {
                    GeneralModel.getUpStarInfo(this.generalId, UpAttriType.upStar);//获取升星前的属性
                    GeneralProxy.send_GENERAL_UP_STAR(this.generalId);
                }
            };

        }

        public onclickButtonYellew() {
            if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GENERAL_LEVELUP)) {
                if (!this.generalVo) {
                    return;
                }
                if (this.generalVo.level == GeneralModel.getMaxLevel(this.generalVo.upgradeLevel)) {//武将突破

                    if (RoleData.level < this.cfg.playerLevel) {
                        EffectUtils.showTips(GCodeFromat(CLEnum.GEN_TUPO_LEVEL, this.cfg.playerLevel), 1, true);
                        return;
                    }

                    GeneralModel.getUpStarInfo(this.generalId, UpAttriType.TuPo);//获取突破前的属性
                    // GeneralProxy.send_GENERAL_UPGRADE(this.generalId);
                    Utils.open_view(TASK_UI.POP_GENERAL_UPGRADE_VIEW, this.generalId);
                    return;
                } else {//武将升级
                    if (!PropModel.isHasExpBook()) {
                        EffectUtils.showTips(GCode(CLEnum.GEN_LEVEL_FAL), 1, true);
                        Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.itemIdList[0]);
                        return;
                    }
                    let bookList = [];
                    for (let i = 0; i < 5; i++) {
                        let bookNum = PropModel.getPropNum(this.itemIdList[i]);
                        if (bookNum > 0) {
                            let ExpBookDto = { id: this.itemIdList[i], count: bookNum };
                            bookList.push(ExpBookDto);
                        }
                    }
                    if (bookList.length > 0) {
                        GeneralProxy.send_GENERAL_USE_EXP_BOOK(this.generalId, bookList);
                    }
                }


            };

        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */


    }
}