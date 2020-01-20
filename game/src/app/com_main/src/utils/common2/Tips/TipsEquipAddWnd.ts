/**
  * tips类
  * All Rights Reserved. 
  * 提示相关信息
  */
module com_main {
    export interface ITipsEquipAdd {
        generalId: number;
        /**0强化 1进阶 2精炼 */
        type: number;
    }

    export class TipsEquipAddWnd extends CView {
        public static NAME = 'TipsEquipAddWnd';

        public m_PopUp: com_main.APopUp;
        public m_addItem0: com_main.TipsEquipItem;
        public m_addItem1: com_main.TipsEquipItem;
        public m_addItem2: com_main.TipsEquipItem;
        public m_addItem3: com_main.TipsEquipItem;
        public m_labtitle0: com_main.CLabel;
        public m_labtitle1: com_main.CLabel;
        public m_listAttri: eui.List;
        public m_listMax: eui.List;
        public m_labCurLv: com_main.CLabel;
        public m_labNextLv: com_main.CLabel;
        public m_btnUp: com_main.ComButton;

        private m_tData: ITipsEquipAdd;
        private m_nGeneralId: number;        //当前武将id
        private m_tEquipArr: any[];   //当前穿戴装备列表
        private m_nCurGenVo: GeneralVo;  //武将信息
        private m_nextlvevl: number;    //四个装备全身（强化，升阶，精炼）下一等级


        private currNum: number;   //当前属性
        private nextNum: number;   //下一属性
        private currindex: number   //当前阶段

        private m_tCollection: eui.ArrayCollection;
        private m_tfullCollection: eui.ArrayCollection;

        public constructor(param: ITipsEquipAdd) {
            super();

            this.name = TipsEquipAddWnd.NAME;
            this.m_nGeneralId = param.generalId;
            this.m_tData = param;
            this.initApp("common/tips/TipsEquipAddWndSkin.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [

                ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE,

            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {

                case ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE: {  //强化
                    // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
                    let data = body as gameProto.IS2C_EQUIPMENT_SLOT_UPGRADE;
                    let type = data.upgradeType;
                    this.refresh(type);
                }
            }
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            this.crateAttriComp();
            let title = GCode(CLEnum.EQUIP_QHJC);
            this.m_labtitle0.text = GCode(CLEnum.EQUIP_QHJD);

            this.m_btnUp.setTitleLabel(GCode(CLEnum.EQUIP_ZB_YJQH));
            switch (this.m_tData.type) {
                case 1: {
                    title = GCode(CLEnum.EQUIP_SJJC);
                    this.m_labtitle0.text = GCode(CLEnum.EQUIP_SJJD);

                    this.m_btnUp.setTitleLabel(GCode(CLEnum.EQUIP_ZB_YJSJ));
                    this.showGradeComp();
                    break;
                }
                case 2: {
                    title = GCode(CLEnum.EQUIP_JLJC);
                    this.m_labtitle0.text = GCode(CLEnum.EQUIP_JLJD);

                    this.m_btnUp.setTitleLabel(GCode(CLEnum.EQUIP_ZB_YJJL));
                    this.showWroughComp();
                    break;
                }
                default: {
                    this.showLevelComp();
                    break;
                }
            }
            let genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            this.m_tEquipArr = EquipModel.checkEquipNum(genVo, this.m_nGeneralId);  //取武将当前穿戴装备]
            let vo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!vo) return;
            this.m_nCurGenVo = vo;
            this.refreshEquipItems(this.m_tData.type);
            this.m_PopUp.setTitleLabel(title);
            EventManager.addTouchScaleListener(this.m_btnUp, this, this.onBtnAllUp);
        }
        /**创建属性 */
        private crateAttriComp() {
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = TipsEquipAttri;
            this.m_listAttri.dataProvider = this.m_tCollection;
            this.cacheAsBitmap = true;

            /**满级显示列表 */
            this.m_tfullCollection = new eui.ArrayCollection();
            this.m_listMax.itemRenderer = ComAttriRender;
            this.m_listMax.dataProvider = this.m_tfullCollection;

        }
        /**刷新界面 */
        private refresh(type: number) {
            if (type == 1) {
                this.showGradeComp();
            } else if (type == 2) {
                this.showWroughComp();
            } else {
                this.showLevelComp();
            }
            this.refreshEquipItems(type);
        }
        /**点击一键（强化，升阶，精炼） */
        private onBtnAllUp() {
            if (this.m_tData.type == 1) {
                this.onBtnAllGrade();
            } else if (this.m_tData.type == 2) {
                this.onBtnAllWrought();
            } else {
                this.onBtnAllUpLv();
            }
        }

        /**一键升级 */
        private onBtnAllUpLv() {
            let genVo = this.m_nCurGenVo;
            if (!genVo) return;

            for (let i = 0; i < EquipModel.POS_LIST.length; i++) {
                let pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipLv(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Level);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    let equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Level)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_QH_TIPS), 1, true);
                        return;
                    }
                    let cfg = EquipModel.getLevelCfg(pos, equip.strengthen);
                    let costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        }

        /**一键升阶 */
        private onBtnAllGrade() {
            let genVo = this.m_nCurGenVo;
            if (!genVo) return;

            for (let i = 0; i < EquipModel.POS_LIST.length; i++) {
                let pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipGrade(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Grade);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    let equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Grade)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_SJ_TIPS), 1, true);
                        return;
                    }

                    let cfg = EquipModel.getGradeCfg(pos, equip.wrought);
                    let costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        }

        /**一键精炼 */
        private onBtnAllWrought() {
            let genVo = this.m_nCurGenVo;
            if (!genVo) return;

            for (let i = 0; i < EquipModel.POS_LIST.length; i++) {
                let pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipWrought(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Wrought);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    let equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Wrought)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_JL_TIPS), 1, true);
                        return;
                    }

                    let cfg = EquipModel.getWroughtCfg(pos, equip.wrought);
                    let costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        }
        /**刷新装备显示 */
        private refreshEquipItems(dataType: number) {
            if (!this.m_nCurGenVo) return;
            let eqItemId = 0;
            for (let i = 0; i < 4; i++) {
                let item = this[`m_addItem${i}`] as TipsEquipItem;
                let data = this.m_nCurGenVo.getEquipByPos(i);
                if (data) {
                    let itemId = -1;
                    if (data.equipmentUuid > 0) {
                        let eqVo = EquipModel.getEquipVoByUId(data.equipmentUuid);
                        itemId = eqVo.equipmentId;
                        eqItemId = eqVo.equipmentId;
                    }
                    item.pos = i;
                    item.setItemInfo(itemId);
                    let currLevel: number;//当前等级（强化，升阶，精炼）
                    let maxLevel: number;//最大等级（强化，升阶，精炼）
                    if (dataType == 1) {
                        currLevel = data.grade;
                        maxLevel = this.m_nextlvevl;
                    } else if (dataType == 2) {
                        currLevel = data.wrought;
                        maxLevel = this.m_nextlvevl;
                    } else {
                        currLevel = data.strengthen;
                        maxLevel = this.m_nextlvevl;
                    }
                    item.reStreng(currLevel, maxLevel);

                }
            }
        }
        /**点击当前武将穿戴的单件装备在套装中的激活状态 */
        private isGrayItem(genid: number) {
            for (let j = 0; j < this.m_tEquipArr.length; j++) {
                let equipVo = this.m_tEquipArr[j];
                if (equipVo) {
                    if (this.m_tEquipArr[j].equipmentId == genid) {
                        return false;
                    }
                }
            }
            return true;
        }
        /**强化加成 */
        private showLevelComp() {
            let levels = EquipModel.getEqSumLevelsByType(0);
            let vo = GeneralModel.getOwnGeneral(this.m_tData.generalId);
            let curLv = levels[levels.length - 1];
            for (let i = 0; i < 4; i++) {
                let equip = vo.getEquipByPos(i);
                if (curLv > equip.strengthen) curLv = equip.strengthen;
            }

            let index = -1;
            let nextIndex = -1;
            for (let i = 0; i < levels.length; i++) {
                if (curLv >= levels[i]) {
                    index = i;
                    nextIndex = i + 1;
                }
            }
            this.currindex = nextIndex == -1 ? 0 : nextIndex;//当前阶段

            this.m_labCurLv.text = GCodeFromat(CLEnum.EQUIP_CURR_QHJD, this.currindex);
            this.m_labNextLv.text = GCodeFromat(CLEnum.EQUIP_NEXT_QHJD, this.currindex + 1);
            this.m_labtitle1.text = GCodeFromat(CLEnum.EQUIP_QH_JIED, this.currindex);

            this.currentState = 'base';
            let attris: string;
            let currList: IKeyVal[];
            let nxetList: IKeyVal[];
            if (index == -1) {
                this.m_nextlvevl = levels[0];
                attris = EquipModel.getEqSumConfig(0, levels[0]).attribute;
                let attriList = StringUtils.keyValsToNumberArray(attris);
                currList = StringUtils.keyValsToNumberArray(attris);
                nxetList = StringUtils.keyValsToNumberArray(attris);
                this.setList(currList, nxetList, -1);
                return;
            }
            attris = EquipModel.getEqSumConfig(0, levels[index]).attribute;
            currList = StringUtils.keyValsToNumberArray(attris);

            if (nextIndex < levels.length) {
                this.m_nextlvevl = levels[nextIndex];
                attris = EquipModel.getEqSumConfig(0, levels[nextIndex]).attribute;
                nxetList = StringUtils.keyValsToNumberArray(attris);
                this.setList(currList, nxetList, 0);
                return;
            } else {

                this.m_nextlvevl = levels[index];
                this.currentState = 'max';
                currList = StringUtils.keyValsToNumberArray(attris);
                this.setFullList(currList);
            }
        }

        /**进阶加成 */
        private showGradeComp() {
            let levels = EquipModel.getEqSumLevelsByType(1);
            let vo = GeneralModel.getOwnGeneral(this.m_tData.generalId);
            let curLv = levels[levels.length - 1];
            let currList: IKeyVal[];
            let nxetList: IKeyVal[];
            for (let i = 0; i < 4; i++) {
                let equip = vo.getEquipByPos(i);
                if (curLv > equip.grade) curLv = equip.grade;
            }

            let index = -1;
            let nextIndex = -1;
            for (let i = 0; i < levels.length; i++) {
                if (curLv >= levels[i]) {
                    index = i;
                    nextIndex = i + 1;
                }
            }
            this.currindex = nextIndex == -1 ? 0 : nextIndex;//当前阶段
            this.m_labCurLv.text = GCodeFromat(CLEnum.EQUIP_CURR_JJJD, this.currindex);
            this.m_labNextLv.text = GCodeFromat(CLEnum.EQUIP_NEXT_JJJD, this.currindex + 1);
            this.m_labtitle1.text = GCodeFromat(CLEnum.EQUIP_JJ_JIED, this.currindex);
            this.currentState = 'base';
            let attris: string;
            if (index == -1) {
                this.m_nextlvevl = levels[0];
                attris = EquipModel.getEqSumConfig(1, levels[0]).attribute;
                currList = StringUtils.keyValsToNumberArray(attris);
                nxetList = StringUtils.keyValsToNumberArray(attris);
                this.setList(currList, nxetList, -1);
                return;
            }
            attris = EquipModel.getEqSumConfig(1, levels[index]).attribute;
            currList = StringUtils.keyValsToNumberArray(attris);

            if (nextIndex < levels.length) {
                this.m_nextlvevl = levels[nextIndex];
                attris = EquipModel.getEqSumConfig(1, levels[nextIndex]).attribute;
                nxetList = StringUtils.keyValsToNumberArray(attris);
                this.setList(currList, nxetList, 0);
                return;
            } else {
                this.m_nextlvevl = levels[index];
                this.currentState = 'max';
                currList = StringUtils.keyValsToNumberArray(attris);
                this.setFullList(currList);
            }
        }


        /**精炼加成 */
        private showWroughComp() {
            let levels = EquipModel.getEqSumLevelsByType(2);
            let vo = GeneralModel.getOwnGeneral(this.m_tData.generalId);
            let curLv = levels[levels.length - 1];
            let currList: IKeyVal[];
            let nxetList: IKeyVal[];
            for (let i = 0; i < 4; i++) {
                let equip = vo.getEquipByPos(i);
                if (curLv > equip.wrought) curLv = equip.wrought;
            }

            let index = -1;
            let nextIndex = -1;
            for (let i = 0; i < levels.length; i++) {
                if (curLv >= levels[i]) {
                    index = i;
                    nextIndex = i + 1;
                }
            }
            this.currindex = nextIndex == -1 ? 0 : nextIndex;//当前阶段
             this.m_labCurLv.text = GCodeFromat(CLEnum.EQUIP_CURR_JLJD, this.currindex);
            this.m_labNextLv.text = GCodeFromat(CLEnum.EQUIP_NEXT_JLJD, this.currindex + 1);
            this.m_labtitle1.text = GCodeFromat(CLEnum.EQUIP_JL_JIED, this.currindex);

            this.currentState = 'base';
            let attris: string;
            if (index == -1) {
                this.m_nextlvevl = levels[0];
                attris = EquipModel.getEqSumConfig(2, levels[0]).attribute;
                currList = StringUtils.keyValsToNumberArray(attris);
                nxetList = StringUtils.keyValsToNumberArray(attris);
                this.setList(currList, nxetList, -1);
                return;
            }
            attris = EquipModel.getEqSumConfig(2, levels[index]).attribute;
            currList = StringUtils.keyValsToNumberArray(attris);

            if (nextIndex < levels.length) {
                this.m_nextlvevl = levels[nextIndex];
                attris = EquipModel.getEqSumConfig(2, levels[nextIndex]).attribute;

                nxetList = StringUtils.keyValsToNumberArray(attris);
                this.setList(currList, nxetList, 0);
                return;
            } else {
                this.m_nextlvevl = levels[index];
                this.currentState = 'max';
                currList = StringUtils.keyValsToNumberArray(attris);
                this.setFullList(currList);
            }

        }
        private setList(currList: IKeyVal[], nxetList: IKeyVal[], index: number) {
            let resList = [];
            let data: ItipsEquipAttriRender;
            for (let i = 0; i < currList.length; i++) {
                let currdata = currList[i];
                let name1 = Utils.getAttriNameByType(currdata.key) + '：';
                let value1 = Utils.getAttriFormatVal(currdata);
                let name2 = Utils.getAttriNameByType(nxetList[i].key) + '：';
                let value2 = Utils.getAttriFormatVal(nxetList[i]);
                if (index == -1) {
                    data = { currName: name1, currValue: '0', nextName: name2, nextValue: value2 };
                } else {
                    data = { currName: name1, currValue: value1, nextName: name2, nextValue: value2 };
                }
                resList.push(data);
            }
            this.m_tCollection.replaceAll(resList);
        }
        /**满级显示 */
        private setFullList(currList: IKeyVal[]) {
            let res: ComAttriRD[] = [];
            for (let i = 0; i < currList.length; i++) {
                let data = currList[i];
                let name = Utils.getAttriNameByType(data.key) + '：';
                let value = Utils.getAttriFormatVal(data);
                res.push({ state: 'style20', name: name, value: value });
            }
            this.m_tfullCollection.replaceAll(res);
        }
    }
    export interface ItipsEquipAttriRender {
        currName: string;
        currValue: string;
        nextName: string;
        nextValue: string;
        isGay?: number;
    }
}


