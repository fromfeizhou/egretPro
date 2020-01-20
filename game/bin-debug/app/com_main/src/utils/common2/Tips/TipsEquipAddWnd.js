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
/**
  * tips类
  * All Rights Reserved.
  * 提示相关信息
  */
var com_main;
(function (com_main) {
    var TipsEquipAddWnd = /** @class */ (function (_super_1) {
        __extends(TipsEquipAddWnd, _super_1);
        function TipsEquipAddWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = TipsEquipAddWnd.NAME;
            _this.m_nGeneralId = param.generalId;
            _this.m_tData = param;
            _this.initApp("common/tips/TipsEquipAddWndSkin.exml");
            return _this;
        }
        TipsEquipAddWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE,
            ];
        };
        /**处理协议号事件 */
        TipsEquipAddWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE: { //强化
                    // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
                    var data = body;
                    var type = data.upgradeType;
                    this.refresh(type);
                }
            }
        };
        TipsEquipAddWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.crateAttriComp();
            var title = GCode(CLEnum.EQUIP_QHJC);
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
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            this.m_tEquipArr = EquipModel.checkEquipNum(genVo, this.m_nGeneralId); //取武将当前穿戴装备]
            var vo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!vo)
                return;
            this.m_nCurGenVo = vo;
            this.refreshEquipItems(this.m_tData.type);
            this.m_PopUp.setTitleLabel(title);
            com_main.EventManager.addTouchScaleListener(this.m_btnUp, this, this.onBtnAllUp);
        };
        /**创建属性 */
        TipsEquipAddWnd.prototype.crateAttriComp = function () {
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = com_main.TipsEquipAttri;
            this.m_listAttri.dataProvider = this.m_tCollection;
            this.cacheAsBitmap = true;
            /**满级显示列表 */
            this.m_tfullCollection = new eui.ArrayCollection();
            this.m_listMax.itemRenderer = com_main.ComAttriRender;
            this.m_listMax.dataProvider = this.m_tfullCollection;
        };
        /**刷新界面 */
        TipsEquipAddWnd.prototype.refresh = function (type) {
            if (type == 1) {
                this.showGradeComp();
            }
            else if (type == 2) {
                this.showWroughComp();
            }
            else {
                this.showLevelComp();
            }
            this.refreshEquipItems(type);
        };
        /**点击一键（强化，升阶，精炼） */
        TipsEquipAddWnd.prototype.onBtnAllUp = function () {
            if (this.m_tData.type == 1) {
                this.onBtnAllGrade();
            }
            else if (this.m_tData.type == 2) {
                this.onBtnAllWrought();
            }
            else {
                this.onBtnAllUpLv();
            }
        };
        /**一键升级 */
        TipsEquipAddWnd.prototype.onBtnAllUpLv = function () {
            var genVo = this.m_nCurGenVo;
            if (!genVo)
                return;
            for (var i = 0; i < EquipModel.POS_LIST.length; i++) {
                var pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipLv(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Level);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    var equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Level)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_QH_TIPS), 1, true);
                        return;
                    }
                    var cfg = EquipModel.getLevelCfg(pos, equip.strengthen);
                    var costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        };
        /**一键升阶 */
        TipsEquipAddWnd.prototype.onBtnAllGrade = function () {
            var genVo = this.m_nCurGenVo;
            if (!genVo)
                return;
            for (var i = 0; i < EquipModel.POS_LIST.length; i++) {
                var pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipGrade(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Grade);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    var equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Grade)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_SJ_TIPS), 1, true);
                        return;
                    }
                    var cfg = EquipModel.getGradeCfg(pos, equip.wrought);
                    var costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        };
        /**一键精炼 */
        TipsEquipAddWnd.prototype.onBtnAllWrought = function () {
            var genVo = this.m_nCurGenVo;
            if (!genVo)
                return;
            for (var i = 0; i < EquipModel.POS_LIST.length; i++) {
                var pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipWrought(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Wrought);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    var equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Wrought)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_JL_TIPS), 1, true);
                        return;
                    }
                    var cfg = EquipModel.getWroughtCfg(pos, equip.wrought);
                    var costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        };
        /**刷新装备显示 */
        TipsEquipAddWnd.prototype.refreshEquipItems = function (dataType) {
            if (!this.m_nCurGenVo)
                return;
            var eqItemId = 0;
            for (var i = 0; i < 4; i++) {
                var item = this["m_addItem" + i];
                var data = this.m_nCurGenVo.getEquipByPos(i);
                if (data) {
                    var itemId = -1;
                    if (data.equipmentUuid > 0) {
                        var eqVo = EquipModel.getEquipVoByUId(data.equipmentUuid);
                        itemId = eqVo.equipmentId;
                        eqItemId = eqVo.equipmentId;
                    }
                    item.pos = i;
                    item.setItemInfo(itemId);
                    var currLevel = void 0; //当前等级（强化，升阶，精炼）
                    var maxLevel = void 0; //最大等级（强化，升阶，精炼）
                    if (dataType == 1) {
                        currLevel = data.grade;
                        maxLevel = this.m_nextlvevl;
                    }
                    else if (dataType == 2) {
                        currLevel = data.wrought;
                        maxLevel = this.m_nextlvevl;
                    }
                    else {
                        currLevel = data.strengthen;
                        maxLevel = this.m_nextlvevl;
                    }
                    item.reStreng(currLevel, maxLevel);
                }
            }
        };
        /**点击当前武将穿戴的单件装备在套装中的激活状态 */
        TipsEquipAddWnd.prototype.isGrayItem = function (genid) {
            for (var j = 0; j < this.m_tEquipArr.length; j++) {
                var equipVo = this.m_tEquipArr[j];
                if (equipVo) {
                    if (this.m_tEquipArr[j].equipmentId == genid) {
                        return false;
                    }
                }
            }
            return true;
        };
        /**强化加成 */
        TipsEquipAddWnd.prototype.showLevelComp = function () {
            var levels = EquipModel.getEqSumLevelsByType(0);
            var vo = GeneralModel.getOwnGeneral(this.m_tData.generalId);
            var curLv = levels[levels.length - 1];
            for (var i = 0; i < 4; i++) {
                var equip = vo.getEquipByPos(i);
                if (curLv > equip.strengthen)
                    curLv = equip.strengthen;
            }
            var index = -1;
            var nextIndex = -1;
            for (var i = 0; i < levels.length; i++) {
                if (curLv >= levels[i]) {
                    index = i;
                    nextIndex = i + 1;
                }
            }
            this.currindex = nextIndex == -1 ? 0 : nextIndex; //当前阶段
            this.m_labCurLv.text = GCodeFromat(CLEnum.EQUIP_CURR_QHJD, this.currindex);
            this.m_labNextLv.text = GCodeFromat(CLEnum.EQUIP_NEXT_QHJD, this.currindex + 1);
            this.m_labtitle1.text = GCodeFromat(CLEnum.EQUIP_QH_JIED, this.currindex);
            this.currentState = 'base';
            var attris;
            var currList;
            var nxetList;
            if (index == -1) {
                this.m_nextlvevl = levels[0];
                attris = EquipModel.getEqSumConfig(0, levels[0]).attribute;
                var attriList = StringUtils.keyValsToNumberArray(attris);
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
            }
            else {
                this.m_nextlvevl = levels[index];
                this.currentState = 'max';
                currList = StringUtils.keyValsToNumberArray(attris);
                this.setFullList(currList);
            }
        };
        /**进阶加成 */
        TipsEquipAddWnd.prototype.showGradeComp = function () {
            var levels = EquipModel.getEqSumLevelsByType(1);
            var vo = GeneralModel.getOwnGeneral(this.m_tData.generalId);
            var curLv = levels[levels.length - 1];
            var currList;
            var nxetList;
            for (var i = 0; i < 4; i++) {
                var equip = vo.getEquipByPos(i);
                if (curLv > equip.grade)
                    curLv = equip.grade;
            }
            var index = -1;
            var nextIndex = -1;
            for (var i = 0; i < levels.length; i++) {
                if (curLv >= levels[i]) {
                    index = i;
                    nextIndex = i + 1;
                }
            }
            this.currindex = nextIndex == -1 ? 0 : nextIndex; //当前阶段
            this.m_labCurLv.text = GCodeFromat(CLEnum.EQUIP_CURR_JJJD, this.currindex);
            this.m_labNextLv.text = GCodeFromat(CLEnum.EQUIP_NEXT_JJJD, this.currindex + 1);
            this.m_labtitle1.text = GCodeFromat(CLEnum.EQUIP_JJ_JIED, this.currindex);
            this.currentState = 'base';
            var attris;
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
            }
            else {
                this.m_nextlvevl = levels[index];
                this.currentState = 'max';
                currList = StringUtils.keyValsToNumberArray(attris);
                this.setFullList(currList);
            }
        };
        /**精炼加成 */
        TipsEquipAddWnd.prototype.showWroughComp = function () {
            var levels = EquipModel.getEqSumLevelsByType(2);
            var vo = GeneralModel.getOwnGeneral(this.m_tData.generalId);
            var curLv = levels[levels.length - 1];
            var currList;
            var nxetList;
            for (var i = 0; i < 4; i++) {
                var equip = vo.getEquipByPos(i);
                if (curLv > equip.wrought)
                    curLv = equip.wrought;
            }
            var index = -1;
            var nextIndex = -1;
            for (var i = 0; i < levels.length; i++) {
                if (curLv >= levels[i]) {
                    index = i;
                    nextIndex = i + 1;
                }
            }
            this.currindex = nextIndex == -1 ? 0 : nextIndex; //当前阶段
            this.m_labCurLv.text = GCodeFromat(CLEnum.EQUIP_CURR_JLJD, this.currindex);
            this.m_labNextLv.text = GCodeFromat(CLEnum.EQUIP_NEXT_JLJD, this.currindex + 1);
            this.m_labtitle1.text = GCodeFromat(CLEnum.EQUIP_JL_JIED, this.currindex);
            this.currentState = 'base';
            var attris;
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
            }
            else {
                this.m_nextlvevl = levels[index];
                this.currentState = 'max';
                currList = StringUtils.keyValsToNumberArray(attris);
                this.setFullList(currList);
            }
        };
        TipsEquipAddWnd.prototype.setList = function (currList, nxetList, index) {
            var resList = [];
            var data;
            for (var i = 0; i < currList.length; i++) {
                var currdata = currList[i];
                var name1 = Utils.getAttriNameByType(currdata.key) + '：';
                var value1 = Utils.getAttriFormatVal(currdata);
                var name2 = Utils.getAttriNameByType(nxetList[i].key) + '：';
                var value2 = Utils.getAttriFormatVal(nxetList[i]);
                if (index == -1) {
                    data = { currName: name1, currValue: '0', nextName: name2, nextValue: value2 };
                }
                else {
                    data = { currName: name1, currValue: value1, nextName: name2, nextValue: value2 };
                }
                resList.push(data);
            }
            this.m_tCollection.replaceAll(resList);
        };
        /**满级显示 */
        TipsEquipAddWnd.prototype.setFullList = function (currList) {
            var res = [];
            for (var i = 0; i < currList.length; i++) {
                var data = currList[i];
                var name_1 = Utils.getAttriNameByType(data.key) + '：';
                var value = Utils.getAttriFormatVal(data);
                res.push({ state: 'style20', name: name_1, value: value });
            }
            this.m_tfullCollection.replaceAll(res);
        };
        TipsEquipAddWnd.NAME = 'TipsEquipAddWnd';
        return TipsEquipAddWnd;
    }(com_main.CView));
    com_main.TipsEquipAddWnd = TipsEquipAddWnd;
})(com_main || (com_main = {}));
