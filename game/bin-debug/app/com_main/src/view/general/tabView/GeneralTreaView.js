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
    var GeneralTreaView = /** @class */ (function (_super_1) {
        __extends(GeneralTreaView, _super_1);
        function GeneralTreaView(width, height) {
            var _this = _super_1.call(this, width, height) || this;
            _this.skinName = Utils.getAppSkin("general/tabView/GeneralTreaViewSkin.exml");
            _this.name = GeneralTreaView.NAME;
            return _this;
        }
        GeneralTreaView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        GeneralTreaView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnUnEquip.setTitleLabel(GCode(CLEnum.TREA_UNEQUIP));
            this.m_btnStreng.setTitleLabel(GCode(CLEnum.TREA_STRENG));
            this.m_tAttriColl = new eui.ArrayCollection();
            this.m_listAttri.dataProvider = this.m_tAttriColl;
            this.m_listAttri.itemRenderer = com_main.ComAttriRender;
        };
        GeneralTreaView.prototype.refreshView = function () {
            _super_1.prototype.refreshView.call(this);
            if (!this.generalVo)
                return;
            /**初始化宝物数据 */
            if (this.generalVo) {
                this.m_nItemId = this.generalVo.treasureId;
                this.m_curVo = TreasureModel.getData(this.m_nItemId);
            }
            else {
                this.m_nItemId = 0;
                this.m_curVo = null;
            }
            if (this.m_nItemId > 0) {
                this.currentState = "equip";
                this.commitProperties();
                this.refreshIcon();
                this.refresAttri();
                this.refreshStar();
            }
            else {
                this.currentState = "unequip";
                this.commitProperties();
            }
        };
        //刷新宝物界面
        GeneralTreaView.prototype.refreshIcon = function () {
            if (!this.m_curVo)
                return;
            this.m_labName.text = this.m_curVo.treaCfg.name;
            Utils.setLabColorByQuality(this.m_labName, this.m_curVo.quality);
            this.m_treaIcon.setItemId(this.m_nItemId, true);
            this.m_treaIcon.createEffect();
            this.m_genTreaOwner.setInfo(this.m_nItemId);
        };
        /**刷新属性 */
        GeneralTreaView.prototype.refresAttri = function () {
            var res = [];
            var list = this.m_curVo.getAllAttris();
            for (var i = 0; i < list.length; i++) {
                var data = list[i];
                res.push({ state: 'style20', name: Utils.getAttriNameByType(data.key) + '：', value: Utils.getAttriFormatVal(data) });
            }
            this.m_tAttriColl.replaceAll(res);
            this.m_pCSroller.updateBtn();
        };
        /**刷新星星显示 */
        GeneralTreaView.prototype.refreshStar = function () {
            var starNum = this.m_curVo.star;
            while (this.m_groupStar.numChildren > starNum) {
                this.m_groupStar.removeChildAt(0);
            }
            for (var i = this.m_groupStar.numChildren; i < starNum; i++) {
                var star = new eui.Image();
                star.source = "common_star_png";
                star.width = 36;
                star.height = 36;
                this.m_groupStar.addChild(star);
            }
        };
        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */
        GeneralTreaView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnEquip, this, this.onBtnEquipHandler);
            com_main.EventManager.addTouchScaleListener(this.m_btnUnEquip, this, this.onBtnUnEquipHandler);
            com_main.EventManager.addTouchScaleListener(this.m_btnStreng, this, this.onBtnStreng);
            com_main.EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onTreaLevel, this);
            com_main.EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onTreaStar, this);
            com_main.EventMgr.addEvent(TreaEvent.TREA_STONE_UPDATE, this.onTreaStone, this);
        };
        GeneralTreaView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_STONE_UPDATE, this);
        };
        /**宝物等级刷新 */
        GeneralTreaView.prototype.onTreaLevel = function (data) {
            if (this.m_nItemId != data.itemId)
                return;
            this.refresAttri();
        };
        /**宝物星级刷新 */
        GeneralTreaView.prototype.onTreaStar = function (itemId) {
            if (this.m_nItemId != itemId)
                return;
            this.refreshStar();
            this.refresAttri();
        };
        /**宝物宝石刷新 */
        GeneralTreaView.prototype.onTreaStone = function (itemId) {
            if (this.m_nItemId != itemId)
                return;
            this.refresAttri();
        };
        /**强化 */
        GeneralTreaView.prototype.onBtnStreng = function () {
            if (FunctionModel.isFunctionOpenWithWarn(FunctionType.TREASURE)) {
                if (this.m_nItemId > 0) {
                    com_main.UpManager.close();
                    Utils.open_view(TASK_UI.TREASURE_INFO, this.m_nItemId);
                }
            }
        };
        /**宝物装备卸载 */
        GeneralTreaView.prototype.onBtnUnEquipHandler = function () {
            if (this.generalVo && this.generalVo.isOwn && this.m_nItemId > 0) {
                GeneralProxy.send_GENERAL_TREASURE_WEAR(this.generalId, 0);
            }
        };
        /**宝物装备按钮回调 */
        GeneralTreaView.prototype.onBtnEquipHandler = function () {
            if (this.generalVo && this.generalVo.isOwn) {
                var generalType = this.generalVo.getGeneralOccupation();
                var list = TreasureModel.getTreasByGeneralType(generalType);
                if (list.length == 0) {
                    EffectUtils.showTips(GCode(CLEnum.GEN_TREA_NO2), 1, true);
                    var turnPanel = C.FunctionConfig[FunctionType.TREASURE].turnPanel;
                    if (isNull(turnPanel))
                        return;
                    FunctionModel.funcToPanel(turnPanel);
                    // Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, ConstUtil.getValue(IConstEnum.TREA_SOURCE_ID));
                    return;
                }
                var param = {};
                param.generalId = this.generalVo.generalId;
                param.generalType = generalType;
                Utils.open_view(TASK_UI.POP_GENERAL_TREA_LIST, param);
            }
        };
        GeneralTreaView.NAME = 'GeneralTreaView';
        return GeneralTreaView;
    }(com_main.GeneralBaseView));
    com_main.GeneralTreaView = GeneralTreaView;
})(com_main || (com_main = {}));
