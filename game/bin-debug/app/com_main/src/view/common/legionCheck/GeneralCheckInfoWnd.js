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
    var GeneralCheckInfoWnd = /** @class */ (function (_super_1) {
        __extends(GeneralCheckInfoWnd, _super_1);
        function GeneralCheckInfoWnd(data) {
            var _this = _super_1.call(this) || this;
            _this.name = GeneralCheckInfoWnd.NAME;
            _this.initApp("common/general/GeneralCheckWndSkin.exml");
            _this.m_tData = data;
            return _this;
        }
        GeneralCheckInfoWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        GeneralCheckInfoWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.GENERAL_CHECK_INFO));
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = com_main.GeneralAttriRender;
            this.m_listAttri.dataProvider = this.m_tCollection;
            this.m_genCard.closeMc();
            this.initview();
        };
        GeneralCheckInfoWnd.prototype.initview = function () {
            if (!this.m_tData)
                return;
            this.setGeneralInfo();
            this.reShowAttri(); //属性
            this.refreshSkill(); //技能
            this.refreshTrea(); //宝物
        };
        /**设置查看的武将信息 */
        GeneralCheckInfoWnd.prototype.setGeneralInfo = function () {
            var genInfo = GeneralModel.currGenInfo;
            //刷新英雄图片
            this.m_imgGeneralCardBg.source = GeneralModel.getSoldierQualityBigLogoBg(genInfo.heroQuality);
            this.m_genCard.generalId = genInfo.heroId;
            this.m_genCard.setFight(this.m_tData.fight); //单独设置战力
            this.m_genCard.setStarNum(this.m_tData.star); //单独设置星级
            this.m_genCard.setGenlv(this.m_tData.level); //单独设置等级
            this.m_genCard.image_fate.visible = false; //屏蔽缘分按钮
        };
        //刷新拥有显示
        GeneralCheckInfoWnd.prototype.reShowAttri = function () {
            /**刷新基础属性 */
            var basisProp = [];
            /**武将属性队列 */
            var attriList = {}; //基础属性
            var list = this.m_tData.attributeList;
            //属性转换
            for (var i = 0; i < list.length; i++) {
                var data = list[i];
                attriList[data.key] = data.value;
            }
            for (var j in attriList) {
                if (Number(j) == AttriType.POWER || Number(j) == AttriType.INTELLIGENCE || Number(j) == AttriType.LEADERSHIP || Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.SOLDIER || Number(j) == AttriType.DODGE || Number(j) == AttriType.CRIT) {
                    basisProp.push({ key: Number(j), value: Number(attriList[j]) });
                }
            }
            basisProp.sort(GeneralModel.sortBystate);
            this.refreshItem(this.getGeneralAttriRD(basisProp));
        };
        /**获得渲染结构 */
        GeneralCheckInfoWnd.prototype.getGeneralAttriRD = function (list) {
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
        GeneralCheckInfoWnd.prototype.refreshItem = function (datas) {
            this.m_tCollection.replaceAll(datas);
        };
        //刷新技能显示
        GeneralCheckInfoWnd.prototype.refreshSkill = function () {
            var curLv = this.m_tData.level;
            var skillLsit = this.m_tData.skills;
            for (var i = 0; i < skillLsit.length; i++) {
                var iconView = this["m_skillIcon" + i];
                var info = skillLsit[i];
                iconView.skillInfo = { generalId: this.m_tData.generalId, skillId: info.skillId, sequence: info.sequence, level: info.level };
            }
        };
        //刷新宝物显示
        GeneralCheckInfoWnd.prototype.refreshTrea = function () {
            if (this.m_tData.treasureId <= 0) {
                this.comTreaItem.visible = false;
                this.m_labTreaTip.visible = true;
                return;
            }
            this.comTreaItem.setItemInfo(this.m_tData.treasureId, 0, this.m_tData.treasureStar, '');
        };
        GeneralCheckInfoWnd.NAME = 'GeneralCheckInfoWnd';
        return GeneralCheckInfoWnd;
    }(com_main.CView));
    com_main.GeneralCheckInfoWnd = GeneralCheckInfoWnd;
})(com_main || (com_main = {}));
