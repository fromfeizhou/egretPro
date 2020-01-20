module com_main {
    /** 道具 */
    export class TreaInfoComp extends TreaBaseComp {

        public m_pTempRoot: eui.Group;
        public m_pViewRoot: eui.Group;
        public m_listAttri: eui.List;
        public m_pSkillRoot: eui.Group;
        public m_listSkill: eui.List;
        public m_pGenRoot: eui.Group;
        public m_generalHead: com_main.GeneralHeadRender;
        public m_labGenName: eui.Label;
        public m_listAttriGen: eui.List;
        public m_stoneSuitCell0: com_main.ComStoneSuitCell;
        public m_stoneSuitCell1: com_main.ComStoneSuitCell;
        public m_stoneSuitCell2: com_main.ComStoneSuitCell;
        public m_stoneSuitCell3: com_main.ComStoneSuitCell;
        public m_groupSuit0: eui.Group;
        public m_labSuitAttri0: eui.Label;
        public m_groupSuit1: eui.Group;
        public m_labSuitAttri1: eui.Label;
        public m_groupSuit2: eui.Group;
        public m_labSuitAttri2: eui.Label;
        public m_pFromRoot: eui.Group;
        public m_btnFrom: com_main.ComButton;


        private m_tAttriColl: eui.ArrayCollection;   //属性
        private m_tSkillColl: eui.ArrayCollection;   //技能描述
        private m_tGenColl: eui.ArrayCollection;     //专属武将属性

        public constructor() {
            super();
            // this.skinName = Utils.getAppSkin("treasure/comp/TreaInfoCompSkin.exml");
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();

            this.m_tAttriColl = new eui.ArrayCollection();
            this.m_listAttri.dataProvider = this.m_tAttriColl;
            this.m_listAttri.itemRenderer = ComAttriRender;

            this.m_tSkillColl = new eui.ArrayCollection();
            this.m_listSkill.dataProvider = this.m_tSkillColl;
            this.m_listSkill.itemRenderer = ComAttriRender;

            this.m_tGenColl = new eui.ArrayCollection();
            this.m_listAttriGen.dataProvider = this.m_tGenColl;
            this.m_listAttriGen.itemRenderer = ComAttriRender;

            this.addEvent();
        }


        /**初始化界面 */
        protected initView() {
            if (!this.m_curVo) return;
            this.refreshAttri();
            this.refresStone();
            this.refreshSkill();
            this.refreshGeneral();
        }



        /**刷新属性 */
        private refreshAttri() {
            if (!this.m_curVo) return;
            let res: ComAttriRD[] = [];
            let list = this.m_curVo.getAllAttris();
            for (let i = 0; i < list.length; i++) {
                let data = list[i];
                res.push({ state: 'style20', name: Utils.getAttriNameByType(data.key) + '：', value: Utils.getAttriFormatVal(data) });
            }
            this.m_tAttriColl.replaceAll(res);
        }

        /**刷新特技 */
        private refreshSkill() {
            if (!this.m_curVo) return;

            let list = this.m_curVo.secondAttrId;
            if (list.length > 0) {
                let res: ComAttriRD[] = [];
                this.m_pViewRoot.addChildAt(this.m_pSkillRoot, 1);
                for (let i = 0; i < list.length; i++) {
                    let id = list[i];
                    let cfg = C.SecondAttributeConfig[id];
                    res.push({ state: 'style20b', name: cfg.name + '：', value: cfg.desc });
                }
                this.m_tSkillColl.replaceAll(res);
            } else {
                this.m_pTempRoot.addChild(this.m_pSkillRoot);
            }

        }

        /**
         * 刷新专属武将
         *  */
        private refreshGeneral() {
            if (!this.m_curVo) return;
            let generalId = this.m_curVo.getDedicatedGenId();
            if (generalId > 0) {
                let index = this.m_pViewRoot.numChildren - 2;
                this.m_pViewRoot.addChildAt(this.m_pGenRoot, index > 0 ? index : 1);
                this.m_generalHead.setGenViewInfo(generalId)
                GeneralModel.setLabGaneralName(generalId, this.m_labGenName);

                let isActivated = this.m_curVo.isInDedicatedGeneral();
                Utils.isGray(!isActivated, this.m_generalHead);

                let res: ComAttriRD[] = [];
                let list = this.m_curVo.getDedicatedAddList();
                for (let i = 0; i < list.length; i++) {
                    let data = list[i];
                    res.push({ state: 'style18', name: Utils.getAttriNameByType(data.key) + '：', value: Utils.getAttriFormatVal(data) });
                }
                this.m_tGenColl.replaceAll(res);
            } else {
                this.m_pTempRoot.addChild(this.m_pGenRoot);
            }
        }

        /**刷新宝石套装 */
        private refresStone() {
            if (!this.m_curVo) return;
            let infos = this.m_curVo.getSuitInfos();
            let matchNum = 0;
            for (let i = 0; i < infos.length; i++) {
                let data = infos[i];
                let cell = this[`m_stoneSuitCell${i}`] as ComStoneSuitCell;
                if (data) {
                    cell.setPropStoneType(data.type);
                    if (this.m_curVo.isInLayStone(data.type)) {
                        cell.setActivate(true);
                        matchNum++;
                    } else {
                        cell.setActivate(false);
                    }
                }
            }

            //套装列表
            let suitCfg = this.m_curVo.treaCfg;
            let props = ["oneEffect", "twoEffect", "threeEffect"];
            for (let i = 0; i < 3; i++) {
                let group = this[`m_groupSuit${i}`] as eui.Group;
                let labAttri = this[`m_labSuitAttri${i}`] as eui.Label;
                let attriList = StringUtils.keyValsToNumberArray(suitCfg[props[i]]);
                let data = attriList[0];
                //第一个属性命中两条
                let isActivated = matchNum >= (i + 2);
                Utils.isGray(!isActivated, group);
                if (isActivated) {
                    labAttri.textColor = GameConfig.TextColors.fontWhite;
                    labAttri.textFlow = (new egret.HtmlTextParser()).parser(Utils.getAttriFormat(data));
                } else {
                    labAttri.textColor = GameConfig.TextColors.grayWhite;
                    labAttri.textFlow = [];
                    labAttri.text = Utils.getAttriFormat(data, true, '%s%s');
                }
            }
        }

        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */
        private addEvent() {
            EventMgr.addEvent(TreaEvent.TREA_STONE_UPDATE, this.onStoneUpdate, this);
            EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onStarUpdate, this);
            EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onLevelUpdate, this);
            EventManager.addTouchScaleListener(this.m_btnFrom, this, this.onBtnFromHander);
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);

            EventMgr.removeEventByObject(TreaEvent.TREA_STONE_UPDATE, this);
            EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
            EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
        }
        /**宝物来源 */
        public onBtnFromHander() {
            Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_curVo.itemId);
        }
        /**宝物来源 */
        public baoWuFrom(isShow: boolean) {
            this.m_pFromRoot.visible = isShow;
            this.m_btnFrom.setTitleLabel(GCode(CLEnum.GO_GET));
        }

        /**宝石镶嵌 */
        private onStoneUpdate(itemId: number) {
            if (itemId != this.m_nItemId) return;
            this.refreshAttri();
            this.refresStone();
        }
        /**升星 */
        private onStarUpdate(itemId: number) {
            if (itemId != this.m_nItemId) return;
            this.refreshAttri();
        }

        /**强化成功回调 */
        private onLevelUpdate(data: { itemId: number, level: number }) {
            if (data.itemId != this.m_nItemId || data.level == 0) return;
            this.refreshAttri();
        }



        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

    }
}