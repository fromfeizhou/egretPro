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
    var GeneralStrengView = /** @class */ (function (_super_1) {
        __extends(GeneralStrengView, _super_1);
        function GeneralStrengView(width, height) {
            var _this = _super_1.call(this, width, height) || this;
            _this.itemIdList = [PropEnum.expBook1, PropEnum.expBook2, PropEnum.expBook3, PropEnum.expBook4, PropEnum.expBook5];
            _this.skinName = Utils.getAppSkin("general/tabView/GeneralStrengViewSkin.exml");
            _this.name = GeneralStrengView.NAME;
            return _this;
        }
        GeneralStrengView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListener(this.m_btnUpStart);
            com_main.EventManager.removeEventListener(this.m_btnUpLevel);
            com_main.EventMgr.removeEventByObject(GeneralEvent.GENERAL_EXP, this);
        };
        GeneralStrengView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnUpStart.setTitleLabel(GCode(CLEnum.STAR_UP));
            this.m_btnUpStart.visible = FunctionModel.isFunctionOpen(FunctionType.GENERAL_STAR);
            for (var i = 0; i < this.itemIdList.length; i++) {
                var item = this["m_expItem" + i];
                item.itemId = this.itemIdList[i];
            }
            com_main.EventMgr.addEvent(GeneralEvent.GENERAL_EXP, this.refreshExpView, this);
        };
        GeneralStrengView.prototype.refreshView = function () {
            _super_1.prototype.refreshView.call(this);
            if (!this.generalVo) {
                return;
            }
            this.refreshLevelView();
            this.m_comItem.setItemInfo(this.generalVo.config.itemId);
            if (this.generalVo.star >= GeneralModel.MAX_STAR) {
                this.m_labStarFull.visible = true;
                this.m_groupSoul.visible = false;
            }
            else {
                this.m_groupSoul.visible = true;
                this.m_labStarFull.visible = false;
            }
            this.refreshSoulNum();
            for (var i = 0; i < this.itemIdList.length; i++) {
                var item = this["m_expItem" + i];
                item.generalId = this.generalId;
            }
        };
        /**刷新将魂 */
        GeneralStrengView.prototype.refreshSoulNum = function () {
            if (!this.generalVo) {
                return;
            }
            var soulId = this.generalVo.config.itemId;
            var soulNum = PropModel.getPropNum(soulId);
            var needNum = this.generalVo.getUpStarNeedNum();
            Utils.setRedProcessText(this.m_labSoulNum, soulNum, needNum);
            if (needNum <= soulNum) {
                this.m_btnUpStart.currentState = 'style1';
            }
            else {
                this.m_btnUpStart.currentState = 'style6';
            }
        };
        /**刷新等级 */
        GeneralStrengView.prototype.refreshLevelView = function () {
            if (!this.generalVo) {
                return;
            }
            if (GeneralModel.canUpLevel(this.generalId) || GeneralModel.canTupodan(this.generalId)) {
                this.m_btnUpLevel.currentState = 'style1';
            }
            else {
                this.m_btnUpLevel.currentState = 'style6';
            }
            this.m_labLevel.text = this.generalVo.level + "";
            this.cfg = this.generalVo.GetGeneralCfg();
            if (this.generalVo.GetGeneralIsTuPo() == 0) {
                this.refreshExpView();
                this.m_pProRoot.visible = true;
                this.m_pTupoRoot.visible = false;
                this.m_labGenLevel.text = '';
                this.m_labTitle.text = GCode(CLEnum.LEVEL_UP);
                var str = this.generalVo.level >= 60 ? GCode(CLEnum.LEVEL_UP) : GCode(CLEnum.LEVEL_UP1);
                this.m_btnUpLevel.setTitleLabel(str);
                RedPointModel.AddInfoListener(this.m_btnUpLevel, { x: 115, y: -3, scale: 0.78 }, [RedEvtType.GEN_LEVEL], 2, { generalId: this.generalId });
            }
            else {
                this.m_pProRoot.visible = false;
                this.m_pTupoRoot.visible = true;
                this.m_labTitle.text = GCode(CLEnum.GEN_TUPO);
                this.m_btnUpLevel.setTitleLabel(GCode(CLEnum.GEN_TUPO));
                var tuPoNum = PropModel.getPropNum(this.generalVo.upgrageItem.itemId);
                this.m_comTuPoItem.setItemInfo(this.generalVo.upgrageItem.itemId);
                Utils.setPropLabName(this.generalVo.upgrageItem.itemId, this.m_labtuPName);
                this.m_labtuPNum.text = tuPoNum + '/' + this.generalVo.upgrageItem.count;
                this.m_labtuPNum.x = this.m_labtuPName.x + this.m_labtuPName.width + 5;
                this.m_labGenLevel.text = GCode(CLEnum.LEVEL3) + this.generalVo.level;
                Utils.setRedProcessText(this.m_labtuPNum, tuPoNum, this.generalVo.upgrageItem.count);
                RedPointModel.AddInfoListener(this.m_btnUpLevel, { x: 115, y: -3, scale: 0.78 }, [RedEvtType.GEN_TUPODAN], 2, { generalId: this.generalId });
            }
            RedPointModel.AddInfoListener(this.m_btnUpStart, { x: 115, y: -3, scale: 0.78 }, [RedEvtType.GEN_STAR], 2, { generalId: this.generalId });
        };
        /**刷新经验 */
        GeneralStrengView.prototype.refreshExpView = function () {
            this.m_labExpPro.text = this.generalVo.curExp + "/" + this.generalVo.GetMaxExp();
            var pro = (this.generalVo.curExp / this.generalVo.GetMaxExp()) > 1 ? 1 : (this.generalVo.curExp / this.generalVo.GetMaxExp());
            this.m_imgExpPro.width = pro * GeneralStrengView.EXP_PRO_MAX;
        };
        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */
        GeneralStrengView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnUpStart, this, this.onclickButtonBule);
            com_main.EventManager.addTouchScaleListener(this.m_btnUpLevel, this, this.onclickButtonYellew);
            com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
        };
        GeneralStrengView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
        };
        /**物品数量变化 */
        GeneralStrengView.prototype.onPropItemChange = function (itemId) {
            if (this.generalVo && itemId == this.generalVo.config.itemId) {
                this.refreshSoulNum();
            }
        };
        GeneralStrengView.prototype.onclickButtonBule = function () {
            if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GENERAL_STAR)) {
                var soulId = this.generalVo.config.itemId;
                var soulNum = PropModel.getPropNum(soulId);
                if (soulNum < this.generalVo.getUpStarNeedNum()) {
                    EffectUtils.showTips(GCodeFromat(CLEnum.GEN_STAR_FAL, Utils.getPropName(soulId)), 1, true);
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, soulId);
                }
                else {
                    GeneralModel.getUpStarInfo(this.generalId, UpAttriType.upStar); //获取升星前的属性
                    GeneralProxy.send_GENERAL_UP_STAR(this.generalId);
                }
            }
            ;
        };
        GeneralStrengView.prototype.onclickButtonYellew = function () {
            if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GENERAL_LEVELUP)) {
                if (!this.generalVo) {
                    return;
                }
                if (this.generalVo.level == GeneralModel.getMaxLevel(this.generalVo.upgradeLevel)) { //武将突破
                    if (RoleData.level < this.cfg.playerLevel) {
                        EffectUtils.showTips(GCodeFromat(CLEnum.GEN_TUPO_LEVEL, this.cfg.playerLevel), 1, true);
                        return;
                    }
                    GeneralModel.getUpStarInfo(this.generalId, UpAttriType.TuPo); //获取突破前的属性
                    // GeneralProxy.send_GENERAL_UPGRADE(this.generalId);
                    Utils.open_view(TASK_UI.POP_GENERAL_UPGRADE_VIEW, this.generalId);
                    return;
                }
                else { //武将升级
                    if (!PropModel.isHasExpBook()) {
                        EffectUtils.showTips(GCode(CLEnum.GEN_LEVEL_FAL), 1, true);
                        Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.itemIdList[0]);
                        return;
                    }
                    var bookList = [];
                    for (var i = 0; i < 5; i++) {
                        var bookNum = PropModel.getPropNum(this.itemIdList[i]);
                        if (bookNum > 0) {
                            var ExpBookDto = { id: this.itemIdList[i], count: bookNum };
                            bookList.push(ExpBookDto);
                        }
                    }
                    if (bookList.length > 0) {
                        GeneralProxy.send_GENERAL_USE_EXP_BOOK(this.generalId, bookList);
                    }
                }
            }
            ;
        };
        GeneralStrengView.NAME = "GeneralStrengView";
        GeneralStrengView.EXP_PRO_MAX = 290;
        return GeneralStrengView;
    }(com_main.GeneralBaseView));
    com_main.GeneralStrengView = GeneralStrengView;
})(com_main || (com_main = {}));
