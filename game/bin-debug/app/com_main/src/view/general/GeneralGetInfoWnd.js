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
    var GeneralGetInfoWnd = /** @class */ (function (_super_1) {
        __extends(GeneralGetInfoWnd, _super_1);
        function GeneralGetInfoWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.m_generalId = 0;
            _this.name = GeneralGetInfoWnd.NAME;
            _this.initApp("general/GeneralGetInfoWndSkin.exml");
            _this.currentState = param.curState ? param.curState : "base";
            _this.m_generalId = param.generalId;
            _this.m_nExValue = param.value || 0;
            return _this;
        }
        GeneralGetInfoWnd.prototype.onDestroy = function () {
            if (this.m_effect) {
                NormalMcMgr.removeMc(this.m_effect);
                this.m_effect = null;
            }
            if (this.m_generalGetEffect) {
                this.m_generalGetEffect.destroy();
                this.m_generalGetEffect = null;
            }
            com_main.EventManager.removeEventListener(this.m_btnSure);
            com_main.EventManager.removeEventListener(this.m_conEffEnter);
            for (var i = 1; i < 5; i++) {
                if (this["m_skillIcon" + i]) {
                    egret.Tween.removeTweens(this["m_skillIcon" + i]);
                }
            }
            for (var i = 0; i < 3; i++) {
                if (this["group" + i]) {
                    egret.Tween.removeTweens(this["group" + i]);
                }
            }
            com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_GET_WND_CLOSE, null);
            _super_1.prototype.onDestroy.call(this);
            if (GiftBagModel.isPopItem) {
                Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 1, giftId: GiftBagModel.jumpId });
            }
        };
        GeneralGetInfoWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnSure.setTitleLabel(GCode(CLEnum.SURE));
            this.m_imgCard.mask = this.m_imgCardMask;
            com_main.EventManager.addTouchScaleListener(this.m_btnSure, this, this.onclickButtonSure);
            com_main.EventManager.addTouchScaleListener(this.m_conEffEnter, this, this.onclickConEffEnter);
            var info = GeneralModel.getOwnGeneral(this.m_generalId);
            if (!info) {
                return;
            }
            this.m_rightInfo.mask = this.m_rightInfoMask;
            this.m_leftInfo.mask = this.m_leftInfoMask;
            var starBgSrc = GeneralModel.getStarBgRes(info.qualityLevel);
            var starSrc = GeneralModel.getStarRes(info.qualityLevel);
            for (var i = 1; i <= info.getStarNum(); i++) {
                this['m_star' + i].getChildAt(1).visible = true;
            }
            var warPos = info.config.warPosition;
            var array = warPos.split(",");
            var str = '';
            for (var i in array) {
                if (i == '0') {
                    str += GeneralModel.getWarPositionStr(array[i]);
                }
                else {
                    str += '/';
                    str += GeneralModel.getWarPositionStr(array[i]);
                }
            }
            this.m_labType.text = str;
            this.m_labType.textColor = GeneralModel.getGeneralQualityColor(info.qualityLevel);
            this.m_labTypeDis.text = GLan(info.config.warPositionDes);
            this.m_imgSoldierType.source = info.getGeneralOccupationIcon(2);
            this.m_labSoldierType.text = info.getGeneralArmyTypeName();
            this.m_labRightDis.text = GLan(info.config.generalOccupationDes);
            this.m_labName.text = GeneralModel.getGeneralName(this.m_generalId);
            this.m_labName.textColor = GeneralModel.getGeneralQualityColor(info.qualityLevel);
            this.m_imgCardBg.source = GeneralModel.getSoldierQualityBigLogoBg(info.qualityLevel);
            this.m_imgCard.source = GeneralModel.getSoldierBigLogo(info.config.role);
            this.m_imgCardMk.source = GeneralModel.getSoldierQualityBigLogo(info.qualityLevel);
            // this.m_imgGeneraTypeIcon.source = info.getGeneralOccupationIcon(2);
            this.m_labGroupNum.text = info.config.fight + "";
            var attriList = StringUtils.keyValsToNumber(info.config.attribute);
            var effectType = IETypes.EUI_GeneralGet1;
            switch (info.qualityLevel) {
                case 2: {
                    effectType = IETypes.EUI_GeneralGet2;
                    break;
                }
                case 3: {
                    effectType = IETypes.EUI_GeneralGet3;
                    break;
                }
                case 4: {
                    effectType = IETypes.EUI_GeneralGet4;
                    break;
                }
                case 5: {
                    effectType = IETypes.EUI_GeneralGet5;
                    break;
                }
            }
            this.m_effect = NormalMcMgr.createMc(effectType);
            this.m_conEffect.addChild(this.m_effect);
            this.playCardAction();
            if (this.currentState == 'tavern') {
                this.refreshExtendView();
            }
            /**检查新手引导面板条件 */
            this.onGuideCondition();
        };
        GeneralGetInfoWnd.prototype.onclickConEffEnter = function () {
            this.showUIAction(0);
            if (this.m_generalGetEffect) {
                this.m_generalGetEffect.destroy();
                this.m_generalGetEffect = null;
            }
        };
        /**播放卡牌动画 */
        GeneralGetInfoWnd.prototype.playCardAction = function () {
            var _this = this;
            this.m_conEffEnter.visible = true;
            this.m_groupInfo.alpha = 0;
            Utils.TimerManager.doTimer(1000, 1, function () {
                Sound.playID(236);
            }, this);
            // this.validateNow();
            var effect = new MCDragonBones();
            this.m_generalGetEffect = effect;
            effect.initAsync(IETypes.EUI_GeneralGetCard);
            effect.playOnceDone(IETypes.EUI_GeneralGetCard, function () {
                _this.showUIAction(0);
            }, this);
            this.m_getCardEffect.addChild(effect);
        };
        GeneralGetInfoWnd.prototype.refreshExtendView = function () {
            var cfg = C.GeneralConfig[this.m_generalId];
            var itemCfg = C.ItemConfig[cfg.itemId];
            var ext = GCodeFromat(CLEnum.GEN_GET_EWHD, GLan(itemCfg.name), this.m_nExValue);
            Utils.setRichLabel(this.m_labExtend, ext);
            this.m_labOwner.text = GCodeFromat(CLEnum.GEN_GET_YYSL, PropModel.getPropNum(itemCfg.id));
        };
        /**显示ui */
        GeneralGetInfoWnd.prototype.showUIAction = function (type) {
            if (!this.m_conEffEnter)
                return;
            this.m_conEffEnter.visible = false;
            var action;
            if (type == 0) {
                action = this.infoAction;
                this.group.alpha = 1;
                this.image.alpha = 1;
            }
            else {
                action = this.infoAction1;
            }
            if (this.m_groupInfo) {
                var twg = egret.Tween.get(this.m_groupInfo, null, null, true);
                twg.to({ alpha: 1 }, 300);
                twg.call(function () {
                    if (action) {
                        action.play(0);
                        Sound.playGeneralSoundByID(GeneralModel.getGeneralSoundByGeneralID(this.m_generalId));
                    }
                }, this);
            }
        };
        GeneralGetInfoWnd.prototype.onclickButtonSure = function () {
            com_main.UpManager.history();
        };
        /**检查新手引导面板条件 */
        GeneralGetInfoWnd.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GEN_GET_WND);
        };
        GeneralGetInfoWnd.NAME = "GeneralGetInfoWnd";
        return GeneralGetInfoWnd;
    }(com_main.CView));
    com_main.GeneralGetInfoWnd = GeneralGetInfoWnd;
})(com_main || (com_main = {}));
