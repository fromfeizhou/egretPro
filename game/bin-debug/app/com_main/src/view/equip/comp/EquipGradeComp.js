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
    /**
     * 升阶
     */
    var EquipGradeComp = /** @class */ (function (_super_1) {
        __extends(EquipGradeComp, _super_1);
        function EquipGradeComp() {
            var _this = _super_1.call(this) || this;
            _this.name = EquipGradeComp.NAME;
            _this.m_nEquipPos = 0;
            _this.skinName = Utils.getAppSkin("equip/comp/EquipLevelCompSkin.exml");
            return _this;
        }
        EquipGradeComp.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        EquipGradeComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnUp.setTitleLabel(GCode(CLEnum.GRADE_UP));
            com_main.EventManager.addTouchScaleListener(this.m_btnUp, this, this.onBtnUp);
        };
        EquipGradeComp.prototype.onBtnUp = function () {
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo)
                return;
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            if (genVo.isMaxByStrengByType(equip, 1)) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_SJ_TIPS), 1, true);
                return;
            }
            var level = equip.grade;
            var gradeCfg = EquipModel.getGradeCfg(this.m_nEquipPos, level + 1);
            if (!gradeCfg) {
                EffectUtils.showTips(GCode(CLEnum.GRADE_UP_MAX), 1, true);
                return;
            }
            gradeCfg = EquipModel.getGradeCfg(this.m_nEquipPos, level);
            var costs = Utils.parseCommonItemJson(gradeCfg.consume);
            if (PropModel.isItemListEnough(costs, 3)) {
                EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nGeneralId, this.m_nEquipPos, IEqStrengEnum.Grade);
            }
        };
        /**初始化显示 */
        EquipGradeComp.prototype.initView = function () {
            this.refreshView();
        };
        /**刷新显示 */
        EquipGradeComp.prototype.refreshView = function () {
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo)
                return;
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            var gradeLv = equip.grade;
            var gradeCfg = EquipModel.getGradeCfg(this.m_nEquipPos, gradeLv);
            //标题
            this.m_labEquipName.text = EquipModel.getEquipNameByPos(this.m_nEquipPos);
            // this.m_labPro.text = `(${gradeLv}/${genVo.getMaxStrengByType(1)})`;
            this.refreshCost();
            this.refreshGradAddLab(equip.equipmentUuid, this.m_labCurNum, this.m_labCurAttri, gradeLv, '#e9e9e6');
            this.refreshGradAddLab(equip.equipmentUuid, this.m_labNextNum, this.m_labNextAttri, gradeLv + 1, '#00ff00');
            this.refreshStateView(genVo);
        };
        /**刷新状态显示 */
        EquipGradeComp.prototype.refreshStateView = function (genVo) {
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            if (!genVo)
                return;
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            var nextcfg = EquipModel.getGradeCfg(this.m_nEquipPos, equip.grade + 1);
            if (nextcfg) {
                if (genVo.isMaxByStrengByType(equip, 1)) {
                    this.m_nextLvTips.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.EQUIP_SJ_TIPS1, genVo.level + 1));
                    this.currentState = 'max';
                }
                else {
                    this.currentState = 'base';
                }
            }
            else {
                this.currentState = 'max';
                this.m_nextLvTips.text = GCode(CLEnum.EQUIP_GRADE_FULL);
            }
        };
        /**设置进阶加成文本显示 */
        EquipGradeComp.prototype.refreshGradAddLab = function (uuid, lvLabel, label, gradeLv, colors) {
            var gradeCfg = EquipModel.getGradeCfg(this.m_nEquipPos, gradeLv);
            var gradeAdd = EquipModel.getGradeAddRate(gradeLv);
            gradeAdd = Math.ceil(gradeAdd * 10000 * 0.01);
            if (gradeCfg) {
                lvLabel.text = gradeLv.toString();
                if (uuid == 0) {
                    var str = gradeLv == 0 ? GCodeFromat(CLEnum.EQUIP_SX_AD, colors) : GCodeFromat(CLEnum.EQUIP_SX_AD1, colors, gradeAdd);
                    label.textFlow = Utils.htmlParser(str);
                }
                else {
                    var equipVo = EquipModel.getEquipVoByUId(uuid);
                    var attri = equipVo.getGradeAdd(gradeLv);
                    var str = gradeLv == 0 ? GCodeFromat(CLEnum.EQUIP_SX_AD2, Utils.getAttriNameByType(attri.key), colors) : GCodeFromat(CLEnum.EQUIP_SX_AD3, Utils.getAttriNameByType(attri.key), colors, attri.value, gradeAdd);
                    label.textFlow = Utils.htmlParser(str);
                }
            }
            else {
                lvLabel.text = GCode(CLEnum.GRADE_UP_MAX1);
                label.textFlow = [];
            }
        };
        /**刷新消耗 */
        EquipGradeComp.prototype.refreshCost = function () {
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo)
                return;
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            var gradeLv = equip.grade;
            var gradeCfg = EquipModel.getGradeCfg(this.m_nEquipPos, gradeLv);
            //消耗
            var costs = Utils.parseCommonItemJson(gradeCfg.consume);
            for (var i = 0; i < 2; i++) {
                var data = costs[i];
                this["m_comResCost" + i].setInfo(data.itemId, data.count);
            }
        };
        EquipGradeComp.NAME = 'EquipGradeComp';
        return EquipGradeComp;
    }(com_main.EquipBaseComp));
    com_main.EquipGradeComp = EquipGradeComp;
})(com_main || (com_main = {}));
