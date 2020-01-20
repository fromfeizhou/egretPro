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
    var GeneralAttriView = /** @class */ (function (_super_1) {
        __extends(GeneralAttriView, _super_1);
        function GeneralAttriView(width, height) {
            var _this = _super_1.call(this, width, height) || this;
            _this.skinName = Utils.getAppSkin("general/tabView/GeneralAttriViewSkin.exml");
            _this.name = GeneralAttriView.NAME;
            return _this;
        }
        GeneralAttriView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        GeneralAttriView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.armPropList = {};
            this.armPropList[1] = GCode(CLEnum.GEN_ATT_DB);
            this.armPropList[2] = GCode(CLEnum.GEN_ATT_QB);
            this.armPropList[3] = GCode(CLEnum.GEN_ATT_GB);
            this.armPropList[4] = GCode(CLEnum.GEN_ATT_QBI);
            this.m_btnItemAward.setTitleLabel(GCode(CLEnum.GEN_GET_HDTJ));
            this.m_btnItemRecruited.setTitleLabel(GCode(CLEnum.GEN_GET_HC));
        };
        /**清理显示 */
        GeneralAttriView.prototype.clearView = function () {
            Utils.removeAllChild(this.m_pGenrealAttri);
            this.m_mainPropComp = null;
            this.m_basisPropComp = null;
            this.m_armPropComp = null;
            // this.m_generalCheckBox = null;
        };
        /**子类重写 */
        GeneralAttriView.prototype.refreshView = function () {
            _super_1.prototype.refreshView.call(this);
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
            }
            else {
                this.refreshCollect();
            }
            if (this.generalVo.own) {
                // this.m_labPower.text = this.generalVo.getGenAttriValByType(AttriType.POWER) + "";
                // this.m_labIntell.text = this.generalVo.getGenAttriValByType(AttriType.INTELLIGENCE) + "";
                // this.m_labLeader.text = this.generalVo.getGenAttriValByType(AttriType.LEADERSHIP) + "";
                // this.m_labAtk.text = this.generalVo.getGenAttriValByType(AttriType.ATK) + "";
                // this.m_labDef.text = this.generalVo.getGenAttriValByType(AttriType.DEF) + "";
                // this.m_labHp.text = this.generalVo.getGenAttriValByType(AttriType.HP) + "";
            }
            else {
                var config = this.generalVo.config;
                var attriList = StringUtils.keyValsToNumber(config.attribute);
                this.m_labPower.text = attriList[AttriType.POWER] + "";
                this.m_labIntell.text = attriList[AttriType.INTELLIGENCE] + "";
                this.m_labLeader.text = attriList[AttriType.LEADERSHIP] + "";
                this.m_labAtk.text = attriList[AttriType.ATK] + "";
                this.m_labDef.text = attriList[AttriType.DEF] + "";
                this.m_labHp.text = attriList[AttriType.HP] + "";
                this.refreshSkill();
            }
        };
        //刷新拥有显示
        GeneralAttriView.prototype.refreshOwner = function () {
            if (this.currentState != "owner") {
                this.currentState = "owner";
                this.commitProperties();
            }
            /**刷新主属性 */
            var mainProp = [];
            /**刷新基础属性 */
            var basisProp = [];
            /**兵种属性 */
            var armProp = [];
            var soldierAttriList = this.generalVo.soldAttriList; //兵种属性
            var attriList1 = this.generalVo.attriList; //主属性，基础属性
            for (var j in attriList1) {
                if (Number(j) == AttriType.POWER || Number(j) == AttriType.INTELLIGENCE || Number(j) == AttriType.LEADERSHIP) {
                    mainProp.push({ key: Number(j), value: Number(attriList1[j]) });
                }
                else if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.CRITICAL || Number(j) == AttriType.DODGE || Number(j) == AttriType.DAMAGE_RED || Number(j) == AttriType.DAMAGE_AFFIX || Number(j) == AttriType.CRIT || Number(j) == AttriType.SOLDIER) {
                    basisProp.push({ key: Number(j), value: Number(attriList1[j]) });
                }
            }
            for (var k in soldierAttriList) {
                armProp.push({ key: Number(k), value: Number(soldierAttriList[k]) });
            }
            mainProp.sort(GeneralModel.sortBystate);
            basisProp.sort(GeneralModel.sortBystate);
            armProp.sort(GeneralModel.sortBystate);
            this.m_mainPropComp.refreshItem(this.getGeneralAttriRD(mainProp));
            this.m_basisPropComp.refreshItem(this.getGeneralAttriRD(basisProp));
            this.m_armPropComp.refreshItem(this.getGeneralAttriRD(armProp));
            // this.m_generalCheckBox.refreshItem(this.generalId, this.generalVo);
        };
        /**获得渲染结构 */
        GeneralAttriView.prototype.getGeneralAttriRD = function (list) {
            var res = [];
            for (var i = 0; i < list.length; i++) {
                var data = list[i];
                var name_1 = Utils.getAttriNameByType(data.key) + '：';
                var value = Utils.getAttriFormatVal(data);
                if (data.key == AttriType.POWER || data.key == AttriType.INTELLIGENCE || data.key == AttriType.LEADERSHIP) {
                    res.push({ state: 'Icon22', name: name_1, value: value, icon: data.key });
                }
                else {
                    res.push({ state: 'style22', name: name_1, value: value, icon: data.key });
                }
            }
            return res;
        };
        //刷新收集显示
        GeneralAttriView.prototype.refreshCollect = function () {
            if (this.currentState != "collect") {
                this.currentState = "collect";
                this.commitProperties();
            }
            var config = this.generalVo.config;
            var soulId = config.itemId;
            var itemCfg = PropModel.getCfg(soulId);
            var suipianNum = PropModel.getPropNum(soulId);
            var needSuipian = this.generalVo.config.soul;
            if (suipianNum >= needSuipian) {
                this.m_btnItemAward.visible = false;
                this.m_btnItemRecruited.visible = true;
            }
            else {
                this.m_btnItemAward.visible = true;
                this.m_btnItemRecruited.visible = false;
            }
            this.m_labItemName.text = Utils.getItemName(soulId);
            this.m_labItemName.textColor = PropModel.getColorOfItemId(soulId);
            Utils.setRedProcessText(this.m_labItemCount, suipianNum, needSuipian);
            this.m_itemSource.itemId = soulId;
        };
        //刷新技能显示
        GeneralAttriView.prototype.refreshSkill = function () {
            var curLv = this.generalVo.level;
            var config = this.generalVo.config;
            for (var i = 1; i < 5; i++) {
                var iconView = this["m_skillIcon" + i];
                var info = this.generalVo.getOwnerSkillInfoBySeque(i);
                iconView.skillInfo = { generalId: this.generalId, skillId: info.skillId, sequence: info.sequence, level: info.level, isShow: true };
            }
        };
        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */
        GeneralAttriView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnItemAward, this, this.onClickItemAward);
            com_main.EventManager.addTouchScaleListener(this.m_btnItemRecruited, this, this.onClickItemRecruited);
            for (var i = 1; i < 5; i++) {
                this["m_skillIcon" + i].openTips();
            }
            com_main.EventMgr.addEvent(GeneralEvent.GENERAL_ATTRI_CHANGE, this.onAttriChange, this);
        };
        GeneralAttriView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(GeneralEvent.GENERAL_ATTRI_CHANGE, this);
        };
        //获得途径
        GeneralAttriView.prototype.onClickItemAward = function () {
            Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.generalVo.config.itemId);
        };
        //合成
        GeneralAttriView.prototype.onClickItemRecruited = function () {
            GeneralProxy.send_RECRUITED_GENERAL(this.generalId);
        };
        /**武将属性变动 */
        GeneralAttriView.prototype.onAttriChange = function (id) {
            if (this.generalId == id) {
                if (this.currentState != "owner") {
                    this.refreshView();
                }
                else {
                    this.refreshOwner();
                }
            }
        };
        GeneralAttriView.NAME = "GeneralAttriView";
        return GeneralAttriView;
    }(com_main.GeneralBaseView));
    com_main.GeneralAttriView = GeneralAttriView;
    /**
* 基础属性
*/
    var GeneralAttriComp = /** @class */ (function (_super_1) {
        __extends(GeneralAttriComp, _super_1);
        function GeneralAttriComp(name, type) {
            if (type === void 0) { type = 'main'; }
            var _this = _super_1.call(this) || this;
            _this.m_sTitle = name;
            _this.currentState = type;
            _this.skinName = Utils.getAppSkin("general/tabView/GeneralAttriCompSkin.exml");
            _this.touchEnabled = false;
            _this.touchChildren = false;
            return _this;
        }
        GeneralAttriComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labTitle.text = this.m_sTitle;
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = com_main.GeneralAttriRender;
            this.m_listAttri.dataProvider = this.m_tCollection;
        };
        GeneralAttriComp.prototype.refreshItem = function (datas) {
            this.m_tCollection.replaceAll(datas);
        };
        return GeneralAttriComp;
    }(com_main.CComponent));
    com_main.GeneralAttriComp = GeneralAttriComp;
    var GeneralCheckBox = /** @class */ (function (_super_1) {
        __extends(GeneralCheckBox, _super_1);
        function GeneralCheckBox() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("general/tabView/GeneralCheckBoxSkin.exml");
            return _this;
        }
        GeneralCheckBox.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        GeneralCheckBox.prototype.refreshItem = function (generalId, generalVo) {
            var _this = this;
            this.generalId = generalId;
            this.generalVo = generalVo;
            this.refreshRedBtn();
            this.m_checkBox.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                if (!_this.generalVo)
                    return;
                var tempState = evt.target.selected;
                if (!tempState) {
                    //添加红点数据
                    RedPointModel.addGeneralInfo(_this.generalId);
                    //移除红点忽略记录
                    LocalModel.removeGeneralOffRed(_this.generalId);
                }
                else {
                    //移除红点数据
                    RedPointModel.removeGeneralInfo(_this.generalId);
                    //添加红点忽略记录
                    LocalModel.addGeneralOffRed(_this.generalId);
                }
            }, this);
        };
        /**红点屏蔽按钮 */
        GeneralCheckBox.prototype.refreshRedBtn = function () {
            this.m_checkBox.selected = !RedPointModel.hasGeneralInfo(this.generalId);
        };
        return GeneralCheckBox;
    }(com_main.CComponent));
    com_main.GeneralCheckBox = GeneralCheckBox;
})(com_main || (com_main = {}));
