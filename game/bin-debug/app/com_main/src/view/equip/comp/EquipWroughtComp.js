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
    var EquipWroughtComp = /** @class */ (function (_super_1) {
        __extends(EquipWroughtComp, _super_1);
        function EquipWroughtComp() {
            var _this = _super_1.call(this) || this;
            _this.name = EquipWroughtComp.NAME;
            _this.m_nEquipPos = 0;
            _this.skinName = Utils.getAppSkin("equip/comp/EquipWroughtCompSkin.exml");
            return _this;
        }
        EquipWroughtComp.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        EquipWroughtComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnWrought.setTitleLabel(GCode(CLEnum.WROUGH));
            com_main.EventManager.addTouchScaleListener(this.m_btnWrought, this, this.onBtnWrought);
        };
        EquipWroughtComp.prototype.onBtnWrought = function () {
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo)
                return;
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            if (genVo.isMaxByStrengByType(equip, 2)) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_JL_TIPS), 1, true);
                return;
            }
            var level = equip.wrought;
            var wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, level + 1);
            if (!wroughtCfg) {
                EffectUtils.showTips(GCode(CLEnum.LEVEL_MAX1), 1, true);
                return;
            }
            wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, level);
            var costs = Utils.parseCommonItemJson(wroughtCfg.consume);
            if (PropModel.isItemListEnough(costs, 3)) {
                EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nGeneralId, this.m_nEquipPos, IEqStrengEnum.Wrought);
            }
        };
        /**初始化显示 */
        EquipWroughtComp.prototype.initView = function () {
            this.refreshView();
        };
        /**刷新显示 */
        EquipWroughtComp.prototype.refreshView = function () {
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo)
                return;
            Utils.removeAllChild(this.m_pAttriCon);
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            var level = equip.wrought;
            var wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, level);
            var wroughtCfgNew = EquipModel.getWroughtCfg(this.m_nEquipPos, level + 1);
            //标题
            this.m_labEquipName.text = EquipModel.getEquipNameByPos(this.m_nEquipPos);
            // this.m_labPro.text = `(${level}/${genVo.getMaxStrengByType(2)})`;
            this.refreshCost();
            this.setCurAttriGroup(wroughtCfg, wroughtCfgNew);
            var tips = this.getOpenDes(level);
            for (var i = 0; i < tips.length; i++) {
                var label = this.getLabel(GameConfig.TextColors.gray);
                label.text = tips[i];
                this.m_pAttriCon.addChild(label);
            }
            this.refreshStateView(genVo);
        };
        /**刷新状态显示 */
        EquipWroughtComp.prototype.refreshStateView = function (genVo) {
            if (!genVo)
                return;
            // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            var nextcfg = EquipModel.getWroughtCfg(this.m_nEquipPos, equip.wrought + 1);
            if (genVo.isMaxByStrengByType(equip, 2)) {
                if (nextcfg) {
                    this.m_nextLvTips.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.EQUIP_JL_TIPS1, genVo.level + 1));
                }
                else {
                    this.m_nextLvTips.text = GCode(CLEnum.EQUIP_WROUGH_FULL);
                }
                this.currentState = 'max';
            }
            else {
                this.currentState = 'base';
            }
        };
        EquipWroughtComp.prototype.getLabel = function (color) {
            if (color === void 0) { color = GameConfig.TextColors.grayWhite; }
            var label = new eui.Label();
            label.size = 20;
            label.textColor = color;
            label.x = 0;
            label.y = 16;
            return label;
        };
        /**精炼解锁描述 */
        EquipWroughtComp.prototype.getOpenDes = function (level) {
            var res = [];
            if (level < 100) {
                var wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, 100);
                var att = StringUtils.keyValsToNumberArray(wroughtCfg.addAttribute);
                var str = GCodeFromat(CLEnum.EQUIP_JL_OPEN, 100) + " " + Utils.getAttriFormat(att[1], false, '%s：%s');
                res.push(str);
            }
            if (level < 300) {
                var wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, 300);
                var att = StringUtils.keyValsToNumberArray(wroughtCfg.addAttribute);
                var str = GCodeFromat(CLEnum.EQUIP_JL_OPEN, 300) + " " + Utils.getAttriFormat(att[2], false, '%s：%s');
                res.push(str);
            }
            if (level < 600) {
                var wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, 600);
                var att = StringUtils.keyValsToNumberArray(wroughtCfg.addAttribute);
                var str = GCodeFromat(CLEnum.EQUIP_JL_OPEN, 600) + " " + Utils.getAttriFormat(att[3], false, '%s：%s');
                res.push(str);
            }
            return res;
        };
        /**获得当前属性 */
        EquipWroughtComp.prototype.setCurAttriGroup = function (cfg, newCfg) {
            var attris = StringUtils.keyValsToNumberArray(cfg.addAttribute);
            var attrisNew;
            if (newCfg) {
                attrisNew = StringUtils.keyValsToNumberArray(newCfg.addAttribute);
            }
            else {
                attrisNew = {};
            }
            for (var i = 0; i < attris.length; i++) {
                var group = new eui.Group();
                var layout = new eui.HorizontalLayout();
                layout.verticalAlign = egret.VerticalAlign.MIDDLE;
                layout.gap = 20;
                group.layout = layout;
                var info = attris[i];
                var nextInfo = attrisNew[i];
                var label = this.getLabel();
                var str = Utils.getAttriFormat(info, true, '%s：<font color=#e9e9e6>%s</font>');
                label.textFlow = Utils.htmlParser(str);
                group.addChild(label);
                if (unNull(nextInfo)) {
                    var flag = new eui.Image('common_jt_png');
                    Utils.setScaleXY(flag, 0.8);
                    group.addChild(flag);
                    var addLabel = this.getLabel(GameConfig.TextColors.green);
                    addLabel.text = Utils.getAttriFormatVal({ key: info.key, value: nextInfo.value }) + '';
                    group.addChild(addLabel);
                }
                this.m_pAttriCon.addChild(group);
            }
        };
        /**刷新消耗 */
        EquipWroughtComp.prototype.refreshCost = function () {
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo)
                return;
            var equip = genVo.getEquipByPos(this.m_nEquipPos);
            var level = equip.wrought;
            var wroughtCfg = EquipModel.getWroughtCfg(this.m_nEquipPos, level);
            //消耗
            var costItem = Utils.parseCommonItemJson(wroughtCfg.consume)[0];
            this.m_comResCost.setInfo(costItem.itemId, costItem.count);
        };
        EquipWroughtComp.NAME = 'EquipWroughtComp';
        return EquipWroughtComp;
    }(com_main.EquipBaseComp));
    com_main.EquipWroughtComp = EquipWroughtComp;
})(com_main || (com_main = {}));
