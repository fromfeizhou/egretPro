// TypeScript file
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
     * 离线收益
     */
    var GeneraUpgradeView = /** @class */ (function (_super_1) {
        __extends(GeneraUpgradeView, _super_1);
        function GeneraUpgradeView(generalId) {
            var _this = _super_1.call(this) || this;
            _this.name = GeneraUpgradeView.NAME;
            _this.m_generalId = generalId;
            if (_this.m_generalId) {
                _this.m_generalVo = GeneralModel.getOwnGeneral(_this.m_generalId);
            }
            _this.m_Lev = _this.m_generalVo.level;
            _this.initApp("general/GeneraUpgradeViewSkin.exml");
            return _this;
        }
        GeneraUpgradeView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.titleShow = false;
            this.m_apopUp.setTitleLabelVisible(false);
            com_main.EventManager.addTouchScaleListener(this.m_upgreBtn, this, this.onClickBtn);
            this.initView();
        };
        GeneraUpgradeView.prototype.initView = function () {
            this.m_upgreBtn.setTitleLabel(GCode(CLEnum.GEN_TUPO));
            // let itemNum = PropModel.getPropNum(PropEnum.TUPODAN);
            this.m_comResCost.setInfo(PropEnum.TUPODAN, this.m_generalVo.upgrageItem.count);
            this.m_curLev.text = "" + this.m_Lev;
            this.m_nextLev.text = "" + (GeneralModel.getMaxLevel(this.m_Lev) != undefined ? GeneralModel.getMaxLevel(this.m_Lev) : 200);
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = GeneralUpgradeItemRender;
            this.m_listAttri.dataProvider = this.m_tCollection;
            /**基础属性 */
            var basisProp = [];
            var cfg = this.m_generalVo.GetGeneralCfg();
            var attriList1 = StringUtils.keyValsToNumber(cfg.attribute);
            for (var j in attriList1) {
                if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.SOLDIER) {
                    basisProp.push({ key: Number(j), value: Number(attriList1[j]) });
                }
            }
            this.refreshItem(this.getGeneralAttriRD(GeneralModel.currProp, basisProp));
            this.commitProperties();
        };
        /**获得渲染结构 */
        GeneraUpgradeView.prototype.getGeneralAttriRD = function (currList, nxetList) {
            var res = [];
            for (var i = 0; i < nxetList.length; i++) {
                var data = nxetList[i];
                var currdata = currList[i];
                var name_1 = Utils.getAttriNameByType(data.key) + '：';
                var nextValue = Utils.getAttriFormatVal(data);
                var currValue = Utils.getAttriFormatVal(currdata);
                var nextAll = Number(nextValue) + Number(currValue);
                res.push({ name: name_1, currAttri: currValue, nextAttri: nextAll.toString() });
            }
            return res;
        };
        GeneraUpgradeView.prototype.refreshItem = function (datas) {
            this.m_tCollection.replaceAll(datas);
        };
        GeneraUpgradeView.prototype.onClickBtn = function (e) {
            if (!PropModel.isItemEnough(this.m_generalVo.upgrageItem.itemId, this.m_generalVo.upgrageItem.count)) {
                EffectUtils.showTips(GCode(CLEnum.GEN_TUPO_NOENOUGH), 1, true);
                Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_generalVo.upgrageItem.itemId);
                return;
            }
            GeneralProxy.send_GENERAL_UPGRADE(this.m_generalId);
            com_main.UpManager.history();
        };
        GeneraUpgradeView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        GeneraUpgradeView.NAME = 'GeneraUpgradeView';
        return GeneraUpgradeView;
    }(com_main.CView));
    com_main.GeneraUpgradeView = GeneraUpgradeView;
    /**属性 */
    var GeneralUpgradeItemRender = /** @class */ (function (_super_1) {
        __extends(GeneralUpgradeItemRender, _super_1);
        function GeneralUpgradeItemRender() {
            return _super_1.call(this) || this;
        }
        GeneralUpgradeItemRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        GeneralUpgradeItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        GeneralUpgradeItemRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.refresh();
            this.commitProperties();
        };
        GeneralUpgradeItemRender.prototype.refresh = function () {
            this.m_AttName.text = this.m_tData.name;
            this.m_curVal.text = this.m_tData.currAttri;
            this.m_nextVal.text = this.m_tData.nextAttri;
        };
        return GeneralUpgradeItemRender;
    }(eui.ItemRenderer));
    com_main.GeneralUpgradeItemRender = GeneralUpgradeItemRender;
})(com_main || (com_main = {}));
