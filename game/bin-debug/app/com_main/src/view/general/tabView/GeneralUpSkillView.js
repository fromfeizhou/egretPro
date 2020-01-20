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
    var GeneralUpSkillWnd = /** @class */ (function (_super_1) {
        __extends(GeneralUpSkillWnd, _super_1);
        function GeneralUpSkillWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.consumePos = [150, 110, 65, 30]; // [127, 100];
            _this.name = GeneralUpSkillWnd.NAME;
            /**初始化 */
            _this.m_nGeneralId = param.generalId;
            _this.m_data = param.data;
            _this.initApp("general/GeneralUpSkillWnd.exml");
            return _this;
        }
        GeneralUpSkillWnd.prototype.listenerProtoNotifications = function () {
            return [ProtoDef.OPEN_SKILL];
        };
        GeneralUpSkillWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.OPEN_SKILL: {
                    if (body.generalId == this.m_nGeneralId && body.sequence == this.m_data.sequence) {
                        this.m_data = body;
                        this.playUpLvEffect();
                    }
                    Loading.hide();
                    break;
                }
            }
        };
        GeneralUpSkillWnd.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            _super_1.prototype.onDestroy.call(this);
        };
        GeneralUpSkillWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopup.setTitleLabel(GCode(CLEnum.GEN_TITLE_SKILL));
            this.m_btnUpLv.setTitleLabel(GCode(CLEnum.LEVEL_UP));
            // let cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
            // if (!cfg) return;
            // let info = Utils.parseCommonItemJson(cfg.upConsume)[0];
            // this.m_comItem.itemId = info.itemId;
            // Utils.setPropLabName(info.itemId, this.m_costItemName);
            com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnUpLv, this, this.onClickBtnUpLv);
            this.m_curSkillIcon.setLvView(false);
            this.m_nextSkillIcon.setLvView(false);
            this.m_bAction = false;
            this.refresh();
            /**检查新手引导面板条件 */
            this.onGuideCondition();
        };
        /**升级特效 */
        GeneralUpSkillWnd.prototype.playUpLvEffect = function () {
            var _this = this;
            if (this.m_bAction)
                return;
            var preCfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level - 1];
            var curCfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
            TipsUtils.showTipsFightUp(GCodeFromat(CLEnum.FIGHT_ADD, curCfg.force - preCfg.force), new egret.Point(0, 0), this.m_pFightNumRoot);
            this.m_bAction = true;
            var effect = new MCDragonBones();
            effect.initAsync(IETypes.EUI_GenUpSkill2);
            effect.play(IETypes.EUI_GenUpSkill2, 1, true);
            this.m_conEffect.addChild(effect);
            //第二段特效
            effect.setCallback(function () {
                if (_this.m_conEffectNext) {
                    _this.refresh();
                    var effect_1 = new MCDragonBones();
                    effect_1.initAsync(IETypes.EUI_GenUpSkill);
                    effect_1.play(IETypes.EUI_GenUpSkill, 1, true);
                    _this.m_conEffectNext.addChild(effect_1);
                    _this.m_bAction = false;
                }
            }, this);
        };
        /**升级按钮点击回调 */
        GeneralUpSkillWnd.prototype.onClickBtnUpLv = function () {
            if (this.currentState == "full") {
                com_main.UpManager.history();
                return;
            }
            if (!this.m_data)
                return;
            var limit = GeneralModel.getUpSkillLimit(this.m_data.skillId, this.m_data.level);
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (genVo.level < limit.level) {
                EffectUtils.showTips(GCodeFromat(CLEnum.GEN_SKILL_LIMIT, limit.level), 1, true);
                return;
            }
            if (genVo.star < limit.star) {
                EffectUtils.showTips(GCodeFromat(CLEnum.GEN_SKILL_LIMIT1, limit.star), 1, true);
                return;
            }
            // let cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
            // if (!cfg) return;
            // let info = Utils.parseCommonItemJson(cfg.upConsume)[0];
            // let des = GCodeFromat(CLEnum.GEN_SKILL_FAL, Utils.getPropName(info.itemId));
            // if (PropModel.isItemEnough(info.itemId, info.count, 3, des)) {
            // 	GeneralProxy.send_OPEN_SKILL(this.m_nGeneralId, this.m_data.sequence, this.m_data.skillId);
            // 	Loading.show();
            // }
            // 材料检测1.0.2
            var cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
            if (!cfg)
                return;
            var itemCosts = Utils.parseCommonItemJson(cfg.upConsume);
            if (PropModel.isItemListEnough(itemCosts, 3)) {
                GeneralProxy.send_OPEN_SKILL(this.m_nGeneralId, this.m_data.sequence, this.m_data.skillId);
                Loading.show();
            }
        };
        /**物品数量变化 */
        GeneralUpSkillWnd.prototype.onPropItemChange = function (itemId) {
            // this.refreshCost();
            this.refreshCost102();
        };
        GeneralUpSkillWnd.prototype.refresh = function () {
            if (this.m_data && this.m_data.skillId > 0) {
                this.refreshLv();
                // this.refreshCost();
                this.refreshCost102();
            }
        };
        GeneralUpSkillWnd.prototype.refreshLv = function () {
            if (GeneralModel.isMaxSkill(this.m_data.skillId, this.m_data.level)) {
                this.currentState = "full";
                this.refreshCurView();
                // this.refreshCost();
                this.refreshCost102();
                this.m_btnUpLv.setTitleLabel(GCode(CLEnum.CLOSE));
            }
            else {
                this.currentState = "normal";
                this.refreshCurView();
                this.refreshNextView();
                // this.refreshCost();
                this.refreshCost102();
            }
        };
        /**刷新当前等级显示 */
        GeneralUpSkillWnd.prototype.refreshCurView = function () {
            this.m_curSkillIcon.skillInfo = this.m_data;
            this.m_labCurDes.textFlow = (new egret.HtmlTextParser()).parser(GeneralModel.getSkillDesByLv(this.m_data.skillId, this.m_data.level));
            var skillCfg = C.SkillConfig[this.m_data.skillId];
            this.m_labCurName.text = skillCfg.name;
            this.m_labCurLv.text = GCodeFromat(CLEnum.LEVEL1, this.m_data.level);
        };
        /**刷新下一等级显示 */
        GeneralUpSkillWnd.prototype.refreshNextView = function () {
            this.m_nextSkillIcon.skillInfo = { generalId: this.m_nGeneralId, skillId: this.m_data.skillId, sequence: this.m_data.sequence, level: this.m_data.level + 1 };
            this.m_labNextDes.textFlow = (new egret.HtmlTextParser()).parser(GeneralModel.getSkillDesByLv(this.m_data.skillId, this.m_data.level + 1));
            var skillCfg = C.SkillConfig[this.m_data.skillId];
            this.m_labNextName.text = skillCfg.name;
            this.m_labNextLv.text = GCodeFromat(CLEnum.LEVEL1, this.m_data.level + 1);
        };
        /**刷新碎片显示 */
        GeneralUpSkillWnd.prototype.refreshCost = function () {
            var cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
            if (!cfg)
                return;
            var info = Utils.parseCommonItemJson(cfg.upConsume)[0];
            var curNum = PropModel.getPropNum(info.itemId);
            Utils.setRedProcessText(this.m_labCost, curNum, info.count);
            var info0 = Utils.parseCommonItemJson(cfg.upConsume)[1];
        };
        /**刷新资源显示1.0.2 */
        GeneralUpSkillWnd.prototype.refreshCost102 = function () {
            // let cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
            // if (!cfg) return;
            // let items = Utils.parseCommonItemJson(cfg.upConsume);
            // let count = 0;
            // for (let i = 0; i < 4; i++) {
            // 	let data: IItemInfo = items[i];
            // 	let item: ComResCost = this[`m_costItem${i}`];
            // 	if (data) {
            // 		item.visible = true;
            // 		item.setInfo(data.itemId, data.count);
            // 		count++;
            // 	} else {
            // 		item.visible = false;
            // 	}
            // }
            // this.m_gConsume.bottom = count > 2 ? this.consumePos[0] : this.consumePos[1];
            var cfg = C.SkillLvConfigDic[this.m_data.skillId][this.m_data.level];
            if (!cfg)
                return;
            var items = Utils.parseCommonItemJson(cfg.upConsume);
            var count = 0;
            for (var i = 0; i < 4; i++) {
                var data = items[i];
                var gp = this["m_gpItem" + i];
                var item = this["m_comItem" + i];
                var label = this["m_labCost" + i];
                if (data) {
                    gp.visible = true;
                    item.setItemInfo(data.itemId, data.count);
                    var curNum = PropModel.getPropNum(data.itemId);
                    Utils.setRedProcessText(label, curNum, data.count);
                    count++;
                }
                else {
                    gp.visible = false;
                }
            }
            this.m_gItemConsume.horizontalCenter = this.consumePos[count - 1];
        };
        /**检查新手引导面板条件 */
        GeneralUpSkillWnd.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GEN_SKILL_WND);
        };
        GeneralUpSkillWnd.NAME = "GeneralUpSkillWnd";
        return GeneralUpSkillWnd;
    }(com_main.CView));
    com_main.GeneralUpSkillWnd = GeneralUpSkillWnd;
})(com_main || (com_main = {}));
