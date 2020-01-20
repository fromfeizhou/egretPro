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
    var TipsItemEnum;
    (function (TipsItemEnum) {
        /**通用tips */
        TipsItemEnum[TipsItemEnum["Normal"] = 0] = "Normal";
        /**宝物 */
        TipsItemEnum[TipsItemEnum["trea"] = 5] = "trea";
        /**装备套装tips */
        TipsItemEnum[TipsItemEnum["Equip"] = 15] = "Equip";
    })(TipsItemEnum = com_main.TipsItemEnum || (com_main.TipsItemEnum = {}));
    var TipsItemInfoWnd = /** @class */ (function (_super_1) {
        __extends(TipsItemInfoWnd, _super_1);
        function TipsItemInfoWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = TipsItemInfoWnd.NAME;
            _this.mainType = param.type ? param.type : 0;
            _this.itemId = param.itemId;
            _this.setCurrStage(_this.mainType);
            _this.initApp("common/tips/TipItemInfoWndSkin.exml");
            return _this;
        }
        TipsItemInfoWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var title = GCode(CLEnum.EQUIP_QHJC);
            this.setItemInfo();
            this.getCfgInfoAttri();
        };
        /**设置物品信息*/
        TipsItemInfoWnd.prototype.setItemInfo = function () {
            var itemCfg = C.ItemConfig[this.itemId];
            Utils.setPropLabName(itemCfg.id, this.m_labEquipName);
            this.m_euipItem.setItemInfo(this.itemId);
            var color = Utils.getColorOfQuality(itemCfg.quality);
            this.m_labLevel.textFlow = Utils.htmlParser(GCode(CLEnum.LEVEL2) + "<font color=" + color + ">" + itemCfg.level + "</font>");
            this.m_labLevel.visible = this.isShowLv;
        };
        /**设置战力，属性 */
        TipsItemInfoWnd.prototype.getCfgInfoAttri = function () {
            var _a, _b, _c;
            if (this.mainType == TipsItemEnum.Equip) { //装备
                var cfgAttri = C.EquipmentConfig[this.itemId];
                if (!cfgAttri)
                    return;
                var attri1 = StringUtils.keyValsToNumberArray(cfgAttri.attribute)[0];
                var fight1 = Utils.calculateNorFight((_a = {}, _a[attri1.key] = attri1.value, _a));
                this.m_imgAttriIcon.source = Utils.getAttriIcon(attri1.key);
                this.m_labAttri.text = Utils.getAttriFormat(attri1, false, '%s：%s');
                this.m_labFight.text = GCode(CLEnum.FIGHT1) + fight1;
                this.refreshSuitItem(cfgAttri.setId);
            }
            else if (this.mainType == TipsItemEnum.trea) { //宝物
                var cfgAttri1 = C.TreasureConfig[this.itemId];
                if (!cfgAttri1)
                    return;
                var attri1 = StringUtils.keyValsToNumberArray(cfgAttri1.mainAttribute)[0];
                var attri2 = StringUtils.keyValsToNumberArray(cfgAttri1.mainAttribute)[1];
                var fight1 = Utils.calculateNorFight((_b = {}, _b[attri1.key] = attri1.value, _b));
                var fight2 = Utils.calculateNorFight((_c = {}, _c[attri2.key] = attri2.value, _c));
                var allFight = fight1 + fight2;
                this.m_imgAttriIcon.source = Utils.getAttriIcon(attri1.key);
                this.m_imgAttriIcon0.source = Utils.getAttriIcon(attri2.key);
                this.m_labAttri.text = Utils.getAttriFormat(attri1, false, '%s：%s');
                this.m_labAttri0.text = Utils.getAttriFormat(attri2, false, '%s：%s');
                this.m_labFight.text = GCode(CLEnum.FIGHT1) + allFight;
                this.setTreaSkill(cfgAttri1.quality, cfgAttri1.secondaryAttributeGroup);
                this.setGeneral(cfgAttri1.exclusiveId, cfgAttri1.exclusiveAdd);
            }
            else { //普通
                this.m_labNum.text = PropModel.getPropNum(this.itemId).toString();
                var Itemcfg = C.ItemConfig[this.itemId];
                if (!Itemcfg)
                    return;
                this.m_labDes.textFlow = Utils.htmlParser(Itemcfg.description);
                var width = this.m_labDes.width;
                if (width > 400) {
                    this.m_labDes.width = 400;
                }
            }
        };
        /**刷新套装 */
        TipsItemInfoWnd.prototype.refreshSuitItem = function (setId) {
            var suitCfg = C.EquipmentSetConfig[setId];
            if (!suitCfg)
                return;
            this.m_labSuitName.text = suitCfg.name;
            this.m_labSuitName.textColor = Utils.getColorOfQuality(suitCfg.quality);
            var suits = suitCfg.suit.split(',');
            for (var i = 0; i < 4; i++) {
                var item = this["m_suitItem" + i];
                item.setItemInfo(Number(suits[i]));
                item.currentState = "equip";
            }
            Utils.removeAllChild(this.m_pAttriCon);
            for (var i = 0; i < 3; i++) {
                var labTile = new eui.Label();
                labTile.size = 20;
                labTile.width = 420;
                labTile.height = 30;
                // let level = this.isGraylabTitle(i) ? i : -1;
                var color = GameConfig.TextColors.quality2;
                var des = [GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ2, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ3, color), GCodeFromat(CLEnum.EQUIP_TITLE_COLOR_TZ4, color)];
                labTile.textFlow = Utils.htmlParser(des[i] + EquipModel.getSuitAttriDes(setId, i));
                labTile.textColor = EquipModel.getSuitColor(0);
                labTile.x = 50;
                labTile.y = 16;
                this.m_pAttriCon.addChild(labTile);
            }
        };
        /**宝物技能 */
        TipsItemInfoWnd.prototype.setTreaSkill = function (quality, secondAttris) {
            this.m_tSkillColl = new eui.ArrayCollection();
            this.m_listSkill.dataProvider = this.m_tSkillColl;
            this.m_listSkill.itemRenderer = com_main.ComAttriRender;
            var skills = secondAttris.split(',');
            var cfgs = [];
            for (var j = 0; j < skills.length; j++) {
                var cfg = TreasureModel.getSecondAttr(Number(skills[j]), quality);
                cfgs.push(cfg);
            }
            if (cfgs.length > 0) {
                var res = [];
                for (var i = 0; i < cfgs.length; i++) {
                    res.push({ state: 'style20b', name: cfgs[i].name + '：', value: cfgs[i].desc });
                }
                this.m_tSkillColl.replaceAll(res);
            }
        };
        /**专属武将 */
        TipsItemInfoWnd.prototype.setGeneral = function (exclusiveId, exclusiveAdds) {
            this.m_tGenColl = new eui.ArrayCollection();
            this.m_listAttriGen.dataProvider = this.m_tGenColl;
            this.m_listAttriGen.itemRenderer = com_main.ComAttriRender;
            var genskills = StringUtils.keyValsToNumberArray(exclusiveAdds);
            var genAttrs = [];
            for (var j = 0; j < genskills.length; j++) {
                genAttrs.push({ key: genskills[j].key, value: genskills[j].value });
            }
            if (exclusiveId > 0) {
                this.m_pGenRoot.visible = true;
                this.m_generalHead.setGenViewInfo(exclusiveId);
                GeneralModel.setLabGaneralName(exclusiveId, this.m_labGenName);
                var res = [];
                for (var i = 0; i < genAttrs.length; i++) {
                    var data = genAttrs[i];
                    res.push({ state: 'style20c', name: Utils.getAttriNameByType(data.key) + '：', value: Utils.getAttriFormatVal(data) });
                }
                this.m_tGenColl.replaceAll(res);
            }
            else {
                this.m_pGenRoot.visible = false;
                this.height = 365;
            }
        };
        TipsItemInfoWnd.prototype.setCurrStage = function (type) {
            switch (type) {
                case TipsItemEnum.Equip: {
                    this.currentState = 'equip';
                    this.isShowLv = true;
                    this.height = 525;
                    break;
                }
                case TipsItemEnum.trea: {
                    this.currentState = 'trea';
                    this.isShowLv = true;
                    this.height = 525;
                    break;
                }
                default: {
                    this.currentState = 'public';
                    this.isShowLv = false;
                    this.height = 282;
                    break;
                }
            }
        };
        TipsItemInfoWnd.NAME = 'TipsItemInfoWnd';
        return TipsItemInfoWnd;
    }(com_main.CView));
    com_main.TipsItemInfoWnd = TipsItemInfoWnd;
})(com_main || (com_main = {}));
