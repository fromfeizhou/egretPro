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
    /** 道具 */
    var TreaInfoComp = /** @class */ (function (_super_1) {
        __extends(TreaInfoComp, _super_1);
        function TreaInfoComp() {
            return _super_1.call(this) || this;
            // this.skinName = Utils.getAppSkin("treasure/comp/TreaInfoCompSkin.exml");
        }
        TreaInfoComp.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        TreaInfoComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tAttriColl = new eui.ArrayCollection();
            this.m_listAttri.dataProvider = this.m_tAttriColl;
            this.m_listAttri.itemRenderer = com_main.ComAttriRender;
            this.m_tSkillColl = new eui.ArrayCollection();
            this.m_listSkill.dataProvider = this.m_tSkillColl;
            this.m_listSkill.itemRenderer = com_main.ComAttriRender;
            this.m_tGenColl = new eui.ArrayCollection();
            this.m_listAttriGen.dataProvider = this.m_tGenColl;
            this.m_listAttriGen.itemRenderer = com_main.ComAttriRender;
            this.addEvent();
        };
        /**初始化界面 */
        TreaInfoComp.prototype.initView = function () {
            if (!this.m_curVo)
                return;
            this.refreshAttri();
            this.refresStone();
            this.refreshSkill();
            this.refreshGeneral();
        };
        /**刷新属性 */
        TreaInfoComp.prototype.refreshAttri = function () {
            if (!this.m_curVo)
                return;
            var res = [];
            var list = this.m_curVo.getAllAttris();
            for (var i = 0; i < list.length; i++) {
                var data = list[i];
                res.push({ state: 'style20', name: Utils.getAttriNameByType(data.key) + '：', value: Utils.getAttriFormatVal(data) });
            }
            this.m_tAttriColl.replaceAll(res);
        };
        /**刷新特技 */
        TreaInfoComp.prototype.refreshSkill = function () {
            if (!this.m_curVo)
                return;
            var list = this.m_curVo.secondAttrId;
            if (list.length > 0) {
                var res = [];
                this.m_pViewRoot.addChildAt(this.m_pSkillRoot, 1);
                for (var i = 0; i < list.length; i++) {
                    var id = list[i];
                    var cfg = C.SecondAttributeConfig[id];
                    res.push({ state: 'style20b', name: cfg.name + '：', value: cfg.desc });
                }
                this.m_tSkillColl.replaceAll(res);
            }
            else {
                this.m_pTempRoot.addChild(this.m_pSkillRoot);
            }
        };
        /**
         * 刷新专属武将
         *  */
        TreaInfoComp.prototype.refreshGeneral = function () {
            if (!this.m_curVo)
                return;
            var generalId = this.m_curVo.getDedicatedGenId();
            if (generalId > 0) {
                var index = this.m_pViewRoot.numChildren - 2;
                this.m_pViewRoot.addChildAt(this.m_pGenRoot, index > 0 ? index : 1);
                this.m_generalHead.setGenViewInfo(generalId);
                GeneralModel.setLabGaneralName(generalId, this.m_labGenName);
                var isActivated = this.m_curVo.isInDedicatedGeneral();
                Utils.isGray(!isActivated, this.m_generalHead);
                var res = [];
                var list = this.m_curVo.getDedicatedAddList();
                for (var i = 0; i < list.length; i++) {
                    var data = list[i];
                    res.push({ state: 'style18', name: Utils.getAttriNameByType(data.key) + '：', value: Utils.getAttriFormatVal(data) });
                }
                this.m_tGenColl.replaceAll(res);
            }
            else {
                this.m_pTempRoot.addChild(this.m_pGenRoot);
            }
        };
        /**刷新宝石套装 */
        TreaInfoComp.prototype.refresStone = function () {
            if (!this.m_curVo)
                return;
            var infos = this.m_curVo.getSuitInfos();
            var matchNum = 0;
            for (var i = 0; i < infos.length; i++) {
                var data = infos[i];
                var cell = this["m_stoneSuitCell" + i];
                if (data) {
                    cell.setPropStoneType(data.type);
                    if (this.m_curVo.isInLayStone(data.type)) {
                        cell.setActivate(true);
                        matchNum++;
                    }
                    else {
                        cell.setActivate(false);
                    }
                }
            }
            //套装列表
            var suitCfg = this.m_curVo.treaCfg;
            var props = ["oneEffect", "twoEffect", "threeEffect"];
            for (var i = 0; i < 3; i++) {
                var group = this["m_groupSuit" + i];
                var labAttri = this["m_labSuitAttri" + i];
                var attriList = StringUtils.keyValsToNumberArray(suitCfg[props[i]]);
                var data = attriList[0];
                //第一个属性命中两条
                var isActivated = matchNum >= (i + 2);
                Utils.isGray(!isActivated, group);
                if (isActivated) {
                    labAttri.textColor = GameConfig.TextColors.fontWhite;
                    labAttri.textFlow = (new egret.HtmlTextParser()).parser(Utils.getAttriFormat(data));
                }
                else {
                    labAttri.textColor = GameConfig.TextColors.grayWhite;
                    labAttri.textFlow = [];
                    labAttri.text = Utils.getAttriFormat(data, true, '%s%s');
                }
            }
        };
        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */
        TreaInfoComp.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(TreaEvent.TREA_STONE_UPDATE, this.onStoneUpdate, this);
            com_main.EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onStarUpdate, this);
            com_main.EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onLevelUpdate, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnFrom, this, this.onBtnFromHander);
        };
        TreaInfoComp.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_STONE_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
        };
        /**宝物来源 */
        TreaInfoComp.prototype.onBtnFromHander = function () {
            Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_curVo.itemId);
        };
        /**宝物来源 */
        TreaInfoComp.prototype.baoWuFrom = function (isShow) {
            this.m_pFromRoot.visible = isShow;
            this.m_btnFrom.setTitleLabel(GCode(CLEnum.GO_GET));
        };
        /**宝石镶嵌 */
        TreaInfoComp.prototype.onStoneUpdate = function (itemId) {
            if (itemId != this.m_nItemId)
                return;
            this.refreshAttri();
            this.refresStone();
        };
        /**升星 */
        TreaInfoComp.prototype.onStarUpdate = function (itemId) {
            if (itemId != this.m_nItemId)
                return;
            this.refreshAttri();
        };
        /**强化成功回调 */
        TreaInfoComp.prototype.onLevelUpdate = function (data) {
            if (data.itemId != this.m_nItemId || data.level == 0)
                return;
            this.refreshAttri();
        };
        return TreaInfoComp;
    }(com_main.TreaBaseComp));
    com_main.TreaInfoComp = TreaInfoComp;
})(com_main || (com_main = {}));
