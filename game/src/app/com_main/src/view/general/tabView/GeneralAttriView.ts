module com_main {
    export class GeneralAttriView extends GeneralBaseView {
        public static NAME = "GeneralAttriView";

        public group_att: eui.Group;
        public group_xiangxishuxing: eui.Group;
        public m_labPower: eui.Label;
        public m_labIntell: eui.Label;
        public m_labLeader: eui.Label;
        public m_labAtk: eui.Label;
        public m_labDef: eui.Label;
        public m_labHp: eui.Label;
        public m_skillIcon1: com_main.GeneralSkillIconView;
        public m_skillIcon2: com_main.GeneralSkillIconView;
        public m_skillIcon3: com_main.GeneralSkillIconView;
        public m_skillIcon4: com_main.GeneralSkillIconView;
        public m_itemSource: com_main.ComItemNew;
        public m_labItemCount: eui.Label;
        public m_labItemName: eui.Label;
        public m_btnItemAward: com_main.ComButton;
        public m_btnItemRecruited: com_main.ComButton;
        public m_pGenrealAttri: eui.Group;

        private m_mainPropComp: GeneralAttriComp;    //主属性
        private m_basisPropComp: GeneralAttriComp;    //基础属性
        private m_armPropComp: GeneralAttriComp;    //兵种属性
        // private m_generalCheckBox: GeneralCheckBox;    //隐藏按钮

        public armPropList: { [key: number]: string };

        public constructor(width: number, height: number) {
            super(width, height);
            this.skinName = Utils.getAppSkin("general/tabView/GeneralAttriViewSkin.exml");
            this.name = GeneralAttriView.NAME;
        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();

            this.armPropList = {};
            this.armPropList[1] = GCode(CLEnum.GEN_ATT_DB);
            this.armPropList[2] = GCode(CLEnum.GEN_ATT_QB);
            this.armPropList[3] = GCode(CLEnum.GEN_ATT_GB);
            this.armPropList[4] = GCode(CLEnum.GEN_ATT_QBI);
            this.m_btnItemAward.setTitleLabel(GCode(CLEnum.GEN_GET_HDTJ));
            this.m_btnItemRecruited.setTitleLabel(GCode(CLEnum.GEN_GET_HC));
        }
        /**清理显示 */
        public clearView() {
            Utils.removeAllChild(this.m_pGenrealAttri);
            this.m_mainPropComp = null;
            this.m_basisPropComp = null;
            this.m_armPropComp = null;
            // this.m_generalCheckBox = null;
        }

        /**子类重写 */
        public refreshView() {
            super.refreshView();

            if (!this.generalVo) {
                return;
            }
            if (this.generalVo.own) {
                this.m_mainPropComp = new GeneralAttriComp(GCode(CLEnum.GEN_ATT_ZSX));
                this.m_pGenrealAttri.addChildAt(this.m_mainPropComp, 0);

                this.m_basisPropComp = new GeneralAttriComp(GCode(CLEnum.GEN_ATT_JCSX), 'other');
                this.m_pGenrealAttri.addChild(this.m_basisPropComp);

                this.m_armPropComp = new GeneralAttriComp(this.armPropList[this.generalVo.generalOccupation], 'other');
                this.m_pGenrealAttri.addChild(this.m_armPropComp);


                // this.m_generalCheckBox = new GeneralCheckBox();
                // this.m_pGenrealAttri.addChild(this.m_generalCheckBox);

                this.refreshOwner();
            } else {
                this.refreshCollect();
            }
            if (this.generalVo.own) {
                // this.m_labPower.text = this.generalVo.getGenAttriValByType(AttriType.POWER) + "";
                // this.m_labIntell.text = this.generalVo.getGenAttriValByType(AttriType.INTELLIGENCE) + "";
                // this.m_labLeader.text = this.generalVo.getGenAttriValByType(AttriType.LEADERSHIP) + "";

                // this.m_labAtk.text = this.generalVo.getGenAttriValByType(AttriType.ATK) + "";
                // this.m_labDef.text = this.generalVo.getGenAttriValByType(AttriType.DEF) + "";
                // this.m_labHp.text = this.generalVo.getGenAttriValByType(AttriType.HP) + "";

            } else {
                let config = this.generalVo.config as GeneralConfig;
                let attriList = StringUtils.keyValsToNumber(config.attribute);
                this.m_labPower.text = attriList[AttriType.POWER] + "";
                this.m_labIntell.text = attriList[AttriType.INTELLIGENCE] + "";
                this.m_labLeader.text = attriList[AttriType.LEADERSHIP] + "";

                this.m_labAtk.text = attriList[AttriType.ATK] + "";
                this.m_labDef.text = attriList[AttriType.DEF] + "";
                this.m_labHp.text = attriList[AttriType.HP] + "";

                this.refreshSkill();
            }
        }
        //刷新拥有显示
        public refreshOwner() {
            if (this.currentState != "owner") {
                this.currentState = "owner";
                this.commitProperties();
            }
            /**刷新主属性 */
            let mainProp: IKeyVal[] = [];
            /**刷新基础属性 */
            let basisProp: IKeyVal[] = [];
            /**兵种属性 */
            let armProp: IKeyVal[] = [];
            let soldierAttriList = this.generalVo.soldAttriList;//兵种属性
            let attriList1 = this.generalVo.attriList;          //主属性，基础属性
            for (let j in attriList1) {
                if (Number(j) == AttriType.POWER || Number(j) == AttriType.INTELLIGENCE || Number(j) == AttriType.LEADERSHIP) {
                    mainProp.push({ key: Number(j), value: Number(attriList1[j]) });
                } else if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.CRITICAL || Number(j) == AttriType.DODGE || Number(j) == AttriType.DAMAGE_RED || Number(j) == AttriType.DAMAGE_AFFIX || Number(j) == AttriType.CRIT || Number(j) == AttriType.SOLDIER) {
                    basisProp.push({ key: Number(j), value: Number(attriList1[j]) });
                }
            }

            for (let k in soldierAttriList) {
                armProp.push({ key: Number(k), value: Number(soldierAttriList[k]) });
            }
            mainProp.sort(GeneralModel.sortBystate);
            basisProp.sort(GeneralModel.sortBystate);
            armProp.sort(GeneralModel.sortBystate);
            this.m_mainPropComp.refreshItem(this.getGeneralAttriRD(mainProp));
            this.m_basisPropComp.refreshItem(this.getGeneralAttriRD(basisProp));
            this.m_armPropComp.refreshItem(this.getGeneralAttriRD(armProp));
            // this.m_generalCheckBox.refreshItem(this.generalId, this.generalVo);

        }
        /**获得渲染结构 */
        private getGeneralAttriRD(list: IKeyVal[]) {
            let res: GeneralAttriRD[] = [];
            for (let i = 0; i < list.length; i++) {
                let data = list[i];
                let name = Utils.getAttriNameByType(data.key) + '：';
                let value = Utils.getAttriFormatVal(data);
                if (data.key == AttriType.POWER || data.key == AttriType.INTELLIGENCE || data.key == AttriType.LEADERSHIP) {
                    res.push({ state: 'Icon22', name: name, value: value, icon: data.key });
                } else {
                    res.push({ state: 'style22', name: name, value: value, icon: data.key });
                }

            }
            return res;
        }

        //刷新收集显示
        private refreshCollect() {
            if (this.currentState != "collect") {
                this.currentState = "collect";
                this.commitProperties();
            }

            let config = this.generalVo.config;
            let soulId = config.itemId;
            let itemCfg = PropModel.getCfg(soulId);
            let suipianNum = PropModel.getPropNum(soulId);
            let needSuipian = this.generalVo.config.soul;
            if (suipianNum >= needSuipian) {
                this.m_btnItemAward.visible = false;
                this.m_btnItemRecruited.visible = true;
            } else {
                this.m_btnItemAward.visible = true;
                this.m_btnItemRecruited.visible = false;
            }

            this.m_labItemName.text = Utils.getItemName(soulId);
            this.m_labItemName.textColor = PropModel.getColorOfItemId(soulId);
            Utils.setRedProcessText(this.m_labItemCount, suipianNum, needSuipian);
            this.m_itemSource.itemId = soulId;
        }

        //刷新技能显示
        public refreshSkill() {
            let curLv = this.generalVo.level;
            let config = this.generalVo.config;

            for (let i = 1; i < 5; i++) {
                let iconView: GeneralSkillIconView = this[`m_skillIcon${i}`];
                let info = this.generalVo.getOwnerSkillInfoBySeque(i);
                iconView.skillInfo = { generalId: this.generalId, skillId: info.skillId, sequence: info.sequence, level: info.level, isShow: true };
            }
        }

        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */

        protected addEvent() {
            EventManager.addTouchScaleListener(this.m_btnItemAward, this, this.onClickItemAward);
            EventManager.addTouchScaleListener(this.m_btnItemRecruited, this, this.onClickItemRecruited);
            for (let i = 1; i < 5; i++) {
                this[`m_skillIcon${i}`].openTips();
            }
            EventMgr.addEvent(GeneralEvent.GENERAL_ATTRI_CHANGE, this.onAttriChange, this);
        }

        protected removeEvent() {
            EventMgr.removeEventByObject(GeneralEvent.GENERAL_ATTRI_CHANGE, this);
        }

        //获得途径
        private onClickItemAward() {
            Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.generalVo.config.itemId);
        }

        //合成
        private onClickItemRecruited() {
            GeneralProxy.send_RECRUITED_GENERAL(this.generalId)
        }

        /**武将属性变动 */
        private onAttriChange(id: number) {
            if (this.generalId == id) {
                if (this.currentState != "owner") {
                    this.refreshView();
                } else {
                    this.refreshOwner();
                }
            }
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

    }
    /**
* 基础属性
*/
    export class GeneralAttriComp extends CComponent {
        public m_labTitle: eui.Label;
        public m_listAttri: eui.List;

        private m_sTitle: string;
        private m_tCollection: eui.ArrayCollection;
        public constructor(name: string, type: string = 'main') {
            super();
            this.m_sTitle = name;
            this.currentState = type;
            this.skinName = Utils.getAppSkin("general/tabView/GeneralAttriCompSkin.exml");
            this.touchEnabled = false;
            this.touchChildren = false;
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_labTitle.text = this.m_sTitle;
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = GeneralAttriRender;
            this.m_listAttri.dataProvider = this.m_tCollection;
        }

        public refreshItem(datas: ComAttriRD[]) {
            this.m_tCollection.replaceAll(datas);
        }

    }

    export class GeneralCheckBox extends CComponent {
        public m_checkBox: eui.CheckBox;
        public generalId: number;
        private generalVo: GeneralVo;
        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("general/tabView/GeneralCheckBoxSkin.exml");

        }
        protected childrenCreated(): void {
            super.childrenCreated();
        }
        public refreshItem(generalId: number, generalVo: GeneralVo) {
            this.generalId = generalId;
            this.generalVo = generalVo;
            this.refreshRedBtn();
            this.m_checkBox.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                if (!this.generalVo) return;
                let tempState = evt.target.selected;
                if (!tempState) {
                    //添加红点数据
                    RedPointModel.addGeneralInfo(this.generalId);
                    //移除红点忽略记录
                    LocalModel.removeGeneralOffRed(this.generalId);
                } else {
                    //移除红点数据
                    RedPointModel.removeGeneralInfo(this.generalId);
                    //添加红点忽略记录
                    LocalModel.addGeneralOffRed(this.generalId);
                }
            }, this);

        }
        /**红点屏蔽按钮 */
        public refreshRedBtn() {
            this.m_checkBox.selected = !RedPointModel.hasGeneralInfo(this.generalId);
        }
    }
}
