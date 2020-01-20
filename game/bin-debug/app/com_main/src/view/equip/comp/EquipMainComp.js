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
     * 基础组件
     */
    var EquipMainComp = /** @class */ (function (_super_1) {
        __extends(EquipMainComp, _super_1);
        function EquipMainComp() {
            var _this = _super_1.call(this) || this;
            _this.name = EquipMainComp.NAME;
            _this.skinName = Utils.getAppSkin("equip/comp/EquipMainCompSkin.exml");
            return _this;
        }
        EquipMainComp.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        EquipMainComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**清理显示 */
        EquipMainComp.prototype.clearView = function () {
            Utils.removeAllChild(this.m_pEquipAttri);
            this.m_mainPropComp = null;
            this.m_bonusView = null;
            this.m_levelComp = null;
            this.m_gradeComp = null;
            this.m_wroughtComp = null;
            this.m_levelMasterComp = null;
            this.m_gradeMasterComp = null;
            this.m_wroughtMasterComp = null;
        };
        /**初始化显示 */
        EquipMainComp.prototype.initView = function () {
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo)
                return;
            this.m_mainPropComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_TITLE_ZBSX));
            this.m_pEquipAttri.addChildAt(this.m_mainPropComp, 0);
            //等级属性
            this.m_levelComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_TITLE_QHSX));
            this.m_pEquipAttri.addChild(this.m_levelComp);
            //升阶属性
            this.m_gradeComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_TITLE_SJSX));
            this.m_pEquipAttri.addChild(this.m_gradeComp);
            //精炼属性
            this.m_wroughtComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_TITLE_JLSX));
            this.m_pEquipAttri.addChild(this.m_wroughtComp);
            //强化大师
            this.m_levelMasterComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_QHJC));
            this.m_pEquipAttri.addChild(this.m_levelMasterComp);
            //进阶大师
            this.m_gradeMasterComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_SJJC));
            this.m_pEquipAttri.addChild(this.m_gradeMasterComp);
            //精炼大师
            this.m_wroughtMasterComp = new EquipNorPropComp(GCode(CLEnum.EQUIP_JLJC));
            this.m_pEquipAttri.addChild(this.m_wroughtMasterComp);
            this.refreshView();
            //套装属性
            this.refreshSuitComp();
        };
        EquipMainComp.prototype.setAllAttri = function (arrriList) {
            var list = [];
            var keyList = [];
            var keyList1 = [];
            for (var i = 0; i < arrriList.length; i++) {
                keyList.push(arrriList[i].key);
            }
            for (var i = 0; i < arrriList.length; i++) {
                if (keyList1.indexOf(keyList[i]) == -1) {
                    keyList1.push(keyList[i]);
                    list.push(arrriList[i]);
                }
            }
            return list;
        };
        /**刷新显示 */
        EquipMainComp.prototype.refreshView = function () {
            var genVo = GeneralModel.getOwnGeneral(this.m_nGeneralId);
            if (!genVo)
                return;
            /**刷新主属性 */
            var attris = EquipModel.getGenEquipAttris(this.m_nGeneralId);
            this.m_mainPropComp.refreshItem(this.getAttriRD(attris));
            //刷新等级显示
            attris = EquipModel.getGenEquipLvAttris(this.m_nGeneralId);
            this.m_levelComp.refreshItem(this.getAttriRD(attris));
            //刷新进阶显示
            attris = EquipModel.getGenEquipGradeAttris(this.m_nGeneralId);
            this.m_gradeComp.refreshItem(this.getAttriRD(attris));
            //刷新精炼显示
            attris = EquipModel.getGenEquipWroughtAttris(this.m_nGeneralId);
            this.m_wroughtComp.refreshItem(this.getAttriRD(attris));
            //刷新强化大师显示
            attris = EquipModel.getLevelMaterAttris(0, this.m_nGeneralId);
            this.m_levelMasterComp.refreshItem(this.getAttriRD(attris));
            //刷新进阶大师显示
            attris = EquipModel.getLevelMaterAttris(1, this.m_nGeneralId);
            this.m_gradeMasterComp.refreshItem(this.getAttriRD(attris));
            //刷新精炼大师显示
            attris = EquipModel.getLevelMaterAttris(2, this.m_nGeneralId);
            this.m_wroughtMasterComp.refreshItem(this.getAttriRD(attris));
            /**刷新套装属性 */
            this.refreshSuitComp();
        };
        /**获得渲染结构 */
        EquipMainComp.prototype.getAttriRD = function (list) {
            var res = [];
            for (var i = 0; i < list.length; i++) {
                var data = list[i];
                var name_1 = Utils.getAttriNameByType(data.key) + '：';
                var value = Utils.getAttriFormatVal(data);
                res.push({ state: 'style20', name: name_1, value: value });
            }
            return res;
        };
        /**刷新套装显示 */
        EquipMainComp.prototype.refreshSuitComp = function () {
            var suitDatas = EquipModel.getGenSuits(this.m_nGeneralId);
            var listData;
            if (suitDatas.length == 0) {
                if (this.m_bonusView)
                    Utils.removeFromParent(this.m_bonusView);
                this.m_bonusView = null;
            }
            else {
                if (!this.m_bonusView) {
                    this.m_bonusView = new EquipBonusPropComp(this.m_nGeneralId);
                    this.m_pEquipAttri.addChildAt(this.m_bonusView, 1);
                }
                listData = [];
                for (var i = 0; i < suitDatas.length; i++) {
                    var vals = suitDatas[i];
                    listData.push({
                        suitId: Number(vals.key),
                        value: Number(vals.value)
                    });
                }
                this.m_bonusView.replaceData(listData);
            }
        };
        EquipMainComp.NAME = 'EquipMainComp';
        return EquipMainComp;
    }(com_main.EquipBaseComp));
    com_main.EquipMainComp = EquipMainComp;
    /**
    * 套装列表界面
    */
    var EquipBonusPropComp = /** @class */ (function (_super_1) {
        __extends(EquipBonusPropComp, _super_1);
        function EquipBonusPropComp(genId) {
            var _this = _super_1.call(this) || this;
            _this.m_generalId = genId;
            _this.skinName = Utils.getAppSkin("equip/prop/EquipBonusPropCompSkin.exml");
            return _this;
        }
        EquipBonusPropComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollection = new eui.ArrayCollection([]);
            this.m_listSuit.dataProvider = this.m_tCollection;
            this.m_listSuit.itemRenderer = BonusRender;
            this.m_listSuit.useVirtualLayout = true;
        };
        EquipBonusPropComp.prototype.replaceData = function (list) {
            var slist = [];
            for (var i = 0; i < list.length; i++) {
                var suit = list[i];
                var suitCfg = C.EquipmentSetConfig[suit.suitId];
                var suits = suitCfg.suit.split(',');
                var rdata = { suitId: suit.suitId, name: suitCfg.name, value: suit.value, genId: this.m_generalId };
                slist.push(rdata);
            }
            this.m_tCollection.replaceAll(slist);
        };
        return EquipBonusPropComp;
    }(com_main.CComponent));
    var BonusRender = /** @class */ (function (_super_1) {
        __extends(BonusRender, _super_1);
        function BonusRender() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("equip/prop/EquipSuitDesSkin.exml");
            return _this;
        }
        BonusRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        BonusRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.dataProvider = this.m_tCollection;
            this.m_listAttri.itemRenderer = com_main.ComAttriRender;
            this.cacheAsBitmap = true;
        };
        BonusRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            var suitCfg = C.EquipmentSetConfig[this.m_tData.suitId];
            var suits = suitCfg.suit.split(',');
            var num = this.isGraylabTitle(this.m_tData.genId, suits); //套装集齐数量
            var suitlv = GCodeFromat(CLEnum.LEVEL1, suitCfg.level); //套装等级
            this.m_labTitle.text = suitlv + suitCfg.name + '(' + num + '/4)';
            this.m_labTitle.textColor = Utils.getColorOfQuality(suitCfg.quality);
            var des = [GCode(CLEnum.EQUIP_TITLE_TZ2), GCode(CLEnum.EQUIP_TITLE_TZ3), GCode(CLEnum.EQUIP_TITLE_TZ4)];
            var res = [];
            for (var level = 0; level < 3; level++) {
                var name_2 = des[level];
                var val = EquipModel.getSuitAttriDes(this.m_tData.suitId, level);
                var isGay = this.m_tData.value <= level;
                res.push({ state: 'style20b', name: name_2, value: val, isGay: isGay });
            }
            this.m_tCollection.replaceAll(res);
        };
        /** 套装就激活件数 */
        BonusRender.prototype.isGraylabTitle = function (genId, suits) {
            var genVo = GeneralModel.getOwnGeneral(genId);
            var tEquipArr = EquipModel.checkEquipNum(genVo, genId); //取武将当前穿戴装备
            var num = 0;
            for (var i = 0; i < suits.length; i++) {
                var infoId = Number(suits[i]);
                for (var j = 0; j < tEquipArr.length; j++) {
                    if (tEquipArr[j]) {
                        if (infoId == tEquipArr[j].equipmentId) {
                            num += 1;
                        }
                    }
                }
            }
            return num;
        };
        return BonusRender;
    }(eui.ItemRenderer));
    /**
    * 基础属性
    */
    var EquipNorPropComp = /** @class */ (function (_super_1) {
        __extends(EquipNorPropComp, _super_1);
        function EquipNorPropComp(name) {
            var _this = _super_1.call(this) || this;
            _this.m_sTitle = name;
            _this.skinName = Utils.getAppSkin("equip/prop/EquipNorPropCompSkin.exml");
            return _this;
        }
        EquipNorPropComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labTitle.text = this.m_sTitle;
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = com_main.ComAttriRender;
            this.m_listAttri.dataProvider = this.m_tCollection;
        };
        EquipNorPropComp.prototype.refreshItem = function (datas) {
            this.m_tCollection.replaceAll(datas);
        };
        return EquipNorPropComp;
    }(com_main.CComponent));
    com_main.EquipNorPropComp = EquipNorPropComp;
})(com_main || (com_main = {}));
