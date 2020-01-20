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
    var EquipLevelComp = /** @class */ (function (_super_1) {
        __extends(EquipLevelComp, _super_1);
        function EquipLevelComp() {
            var _this = _super_1.call(this) || this;
            _this.name = EquipLevelComp.NAME;
            _this.m_nEquipPos = 0;
            _this.skinName = Utils.getAppSkin("equip/comp/EquipLevelCompSkin.exml");
            return _this;
        }
        EquipLevelComp.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        EquipLevelComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnUp.setTitleLabel(GCode(CLEnum.STRENG));
            com_main.EventManager.addTouchScaleListener(this.m_btnUp, this, this.onBtnUp);
        };
        EquipLevelComp.prototype.onBtnUp = function () {
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo)
                return;
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            if (genVo.isMaxByStrengByType(equip, 0)) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_QH_TIPS), 1, true);
                return;
            }
            var level = equip.strengthen;
            var lvCfg = EquipModel.getLevelCfg(this.m_nEquipPos, level + 1);
            if (!lvCfg) {
                EffectUtils.showTips(GCode(CLEnum.LEVEL_MAX1), 1, true);
                return;
            }
            lvCfg = EquipModel.getLevelCfg(this.m_nEquipPos, level);
            var costs = Utils.parseCommonItemJson(lvCfg.consume);
            if (PropModel.isItemListEnough(costs, 3)) {
                EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nGeneralId, this.m_nEquipPos, IEqStrengEnum.Level);
            }
        };
        /**初始化显示 */
        EquipLevelComp.prototype.initView = function () {
            this.refreshView();
        };
        /**刷新显示 */
        EquipLevelComp.prototype.refreshView = function () {
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo)
                return;
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            var level = equip.strengthen;
            var lvCfg = EquipModel.getLevelCfg(this.m_nEquipPos, level);
            //标题            
            this.m_labEquipName.text = EquipModel.getEquipNameByPos(this.m_nEquipPos);
            // this.m_labPro.text = `(${level}/${genVo.getMaxStrengByType(0)})`;
            this.refreshCost();
            //当前属性
            this.m_labCurNum.text = level + '';
            var attri = StringUtils.keyValsToNumberArray(lvCfg.addAttribute)[0];
            this.m_labCurAttri.textFlow = Utils.htmlParser(Utils.getAttriFormat(attri, true, '%s：<font color=#e9e9e6>%s</font>'));
            //下一级属性
            lvCfg = EquipModel.getLevelCfg(this.m_nEquipPos, level + 1);
            if (lvCfg) {
                this.m_labNextNum.text = (level + 1) + '';
                attri = StringUtils.keyValsToNumberArray(lvCfg.addAttribute)[0];
                this.m_labNextAttri.textFlow = Utils.htmlParser(Utils.getAttriFormat(attri, true, '%s：<font color=#00ff00>%s</font>'));
            }
            else {
                this.m_labNextNum.text = GCode(CLEnum.LEVEL_MAX2);
                this.m_labNextAttri.textFlow = [];
            }
            this.refreshStateView(genVo);
        };
        /**刷新状态显示 */
        EquipLevelComp.prototype.refreshStateView = function (genVo) {
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            if (!genVo)
                return;
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            var nextcfg = EquipModel.getLevelCfg(this.m_nEquipPos, equip.strengthen + 1);
            if (genVo.isMaxByStrengByType(equip, 0)) {
                if (nextcfg) {
                    this.m_nextLvTips.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.EQUIP_QH_TIPS1, genVo.level + 1));
                }
                else {
                    this.m_nextLvTips.text = GCode(CLEnum.EQUIP_LEVEL_FULL);
                }
                this.currentState = 'max';
                this.commitProperties();
            }
            else {
                this.currentState = 'base';
                this.commitProperties();
            }
        };
        /**刷新消耗 */
        EquipLevelComp.prototype.refreshCost = function () {
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo)
                return;
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            var level = equip.strengthen;
            var lvCfg = EquipModel.getLevelCfg(this.m_nEquipPos, level);
            //消耗
            var costs = Utils.parseCommonItemJson(lvCfg.consume);
            for (var i = 0; i < 2; i++) {
                var data = costs[i];
                this["m_comResCost" + i].setInfo(data.itemId, data.count);
            }
        };
        EquipLevelComp.NAME = 'EquipLevelComp';
        return EquipLevelComp;
    }(com_main.EquipBaseComp));
    com_main.EquipLevelComp = EquipLevelComp;
})(com_main || (com_main = {}));
