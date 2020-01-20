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
    /**武将展示卡 */
    var GeneralSliderRende = /** @class */ (function (_super_1) {
        __extends(GeneralSliderRende, _super_1);
        function GeneralSliderRende() {
            var _this = _super_1.call(this) || this;
            _this.m_bIsMc = true;
            _this.skinName = Utils.getAppSkin("general/tabView/General_slider_render.exml");
            return _this;
        }
        GeneralSliderRende.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        GeneralSliderRende.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            if (this.upLevelMc) {
                this.upLevelMc.destroy();
                this.upLevelMc = null;
            }
            this.removeEvent();
        };
        GeneralSliderRende.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initEvent();
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        GeneralSliderRende.prototype.initEvent = function () {
            this.upAction.addEventListener("complete", this.onPlayComplete, this);
            com_main.EventManager.addTouchTapListener(this.image_fate, this, this.onClickFate);
        };
        GeneralSliderRende.prototype.removeEvent = function () {
            this.upAction.removeEventListener("complete", this.onPlayComplete, this);
            com_main.EventManager.removeEventListeners(this);
        };
        GeneralSliderRende.prototype.onPlayComplete = function () {
            this.m_upAc.visible = false;
        };
        /**点击缘分按钮 */
        GeneralSliderRende.prototype.onClickFate = function () {
            if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GENERAL_FATE)) {
                Utils.open_view(TASK_UI.FATE_GENERAL_VIEW, this.m_generalId);
            }
        };
        /**=====================================================================================
       * 事件监听 end
       * =====================================================================================
       */
        /**宝物动画 */
        GeneralSliderRende.prototype.refreshTreasureAction = function () {
            var list = this.m_generalVo.getAttributeChangeValues();
            var fight = list.pop();
            this.showFightUpEffect(list);
            this.m_nChangeFight = Number(fight);
        };
        /**升星动画 */
        GeneralSliderRende.prototype.refreshUpStarAction = function () {
            var list = this.m_generalVo.getAttributeChangeValues();
            this.m_nOldStar = this.m_generalVo.star;
            var fight = list.pop();
            this.showFightUpEffect(list);
            this.refreshStarView();
            this.m_nChangeFight = Number(fight);
            this.playUpLvEffect();
        };
        /**升级动画 */
        GeneralSliderRende.prototype.refreshUpLevelAction = function () {
            if (this.m_generalVo.level - this.m_nOldLv > 0) {
                var list = this.m_generalVo.getLevelGrowViewValues(this.m_generalVo.level - this.m_nOldLv);
                this.m_nOldLv = this.m_generalVo.level;
                var fight = list.pop();
                this.showFightUpEffect(list);
                this.m_nChangeFight = Number(fight);
                // this.playUpLvEffect();
                this.playStarAni();
                this.m_upAc.visible = true;
                this.upAction.play(0);
            }
        };
        GeneralSliderRende.prototype.playStarAni = function () {
            this.upLevelMc = new MCDragonBones();
            this.upLevelMc.initAsync(IETypes.EUI_UNLOCK);
            this.upLevelMc.play(IETypes.EUI_UNLOCK, 1, true);
            this.upLevelMc.scaleX = 4;
            this.upLevelMc.scaleY = 4;
            this.upLevelMc.x = 10;
            this.upLevelMc.y = -100;
            this.m_pStar.addChild(this.upLevelMc);
        };
        /**突破动画 */
        GeneralSliderRende.prototype.refreshTuPoAction = function () {
            this.playUpLvEffect();
        };
        GeneralSliderRende.prototype.refreshInfo = function (isAction) {
            if (isAction === void 0) { isAction = false; }
            this.clearFightAddEffect();
            this.refreshFightView(isAction);
            this.refreshStarView();
        };
        /**刷新星星 */
        GeneralSliderRende.prototype.refreshStarView = function (isEffect) {
            if (isEffect === void 0) { isEffect = false; }
            if (this.m_generalVo) {
                var startCfg = GeneralModel.getStarCfg(this.m_generalVo.star);
                var starNum = startCfg.starlevel;
                var res = GeneralModel.getStarRes(startCfg.starType);
                this.refreshStarBg(startCfg.starType);
                this.group_star.removeChildren();
                for (var i = 0; i < starNum; i++) {
                    var contain = new eui.Group();
                    contain.width = 55;
                    contain.height = 55;
                    var star = new eui.Image(res);
                    star.width = 55;
                    star.height = 55;
                    contain.addChild(star);
                    this.group_star.addChild(contain);
                    if (i == (starNum - 1) && isEffect) {
                        this.playStarEffect(contain);
                    }
                }
            }
        };
        /**刷新星星背景 */
        GeneralSliderRende.prototype.refreshStarBg = function (type) {
            if (this.m_nStarType == type) {
                return;
            }
            this.m_nStarType = type;
            Utils.removeAllChild(this.group_starBg);
            var res = GeneralModel.getStarBgRes(this.m_nStarType);
            for (var i = 0; i < 5; i++) {
                var star = new eui.Image(res);
                star.width = 55;
                star.height = 55;
                this.group_starBg.addChild(star);
            }
        };
        GeneralSliderRende.prototype.refreshFate = function () {
            this.image_fate.visible = FateModel.getGeneralFateViewDataByGenId(this.m_generalId).length > 0;
        };
        /**星星特效 */
        GeneralSliderRende.prototype.playStarEffect = function (contain) {
            var effect = NormalMcMgr.createMc(IETypes.EUI_GenUpStar, false);
            effect.x = 27.5;
            effect.y = 27.5;
            contain.addChild(effect);
            effect.playNorOnce(IETypes.EUI_GenUpStar, function () {
                NormalMcMgr.removeMc(effect);
            }, this);
        };
        /**刷新战力 */
        GeneralSliderRende.prototype.refreshFightView = function (isAction) {
            var _this = this;
            var fight = 0;
            if (this.m_generalVo.own) {
                fight = this.m_generalVo.fight;
            }
            else {
                fight = this.m_generalVo.config.fight;
            }
            if (this.m_nChangeFight && this.m_nChangeFight != 0) {
                if (this.m_nChangeFight > 0) {
                    this.m_labAddFight.textColor = GameConfig.TextColors.green;
                    this.m_labAddFight.text = "+" + this.m_nChangeFight;
                }
                else {
                    this.m_labAddFight.textColor = GameConfig.TextColors.red;
                    this.m_labAddFight.text = this.m_nChangeFight + "";
                }
                egret.Tween.removeTweens(this.m_labAddFight);
                this.m_labAddFight.alpha = 1;
                // this.m_labAddFight.scaleY = 0.5;
                var tw = egret.Tween.get(this.m_labAddFight);
                for (var i = 0; i < 5; i++) {
                    tw.to({ alpha: 0 }, 100);
                    tw.to({ alpha: 1 }, 100);
                }
                tw.to({ alpha: 0 }, 500, egret.Ease.sineIn);
                tw.call(function () {
                    if (_this.m_comFightItem) {
                        _this.playFightEffect();
                        _this.m_comFightItem.setFight(fight, true);
                    }
                }, this);
                this.m_nChangeFight = 0;
            }
            else {
                this.m_comFightItem.setFight(fight, isAction);
                this.m_labAddFight.alpha = 0;
            }
        };
        /**清理战力动画 */
        GeneralSliderRende.prototype.clearFightAddEffect = function () {
            this.m_nChangeFight = 0;
            this.m_labAddFight.alpha = 0;
            egret.Tween.removeTweens(this.m_labAddFight);
        };
        /**战斗力特效 */
        GeneralSliderRende.prototype.playFightEffect = function () {
            var effect = NormalMcMgr.createMc(IETypes.EUI_GenUpFightNum, false);
            effect.playNorOnce(IETypes.EUI_GenUpFightNum, function () {
                NormalMcMgr.removeMc(effect);
            }, this);
            this.m_conEffNum.addChild(effect);
        };
        /**升级特效 */
        GeneralSliderRende.prototype.playUpLvEffect = function () {
            var effect = NormalMcMgr.createMc(IETypes.EUI_GenUpFightCard, false);
            effect.playNorOnce(IETypes.EUI_GenUpFightCard, function () {
                NormalMcMgr.removeMc(effect);
            }, this);
            this.m_conEffCard.addChild(effect);
        };
        Object.defineProperty(GeneralSliderRende.prototype, "generalId", {
            get: function () {
                return this.m_generalId;
            },
            set: function (id) {
                if (this.m_generalId == id)
                    return;
                this.m_generalId = id;
                if (this.m_generalId)
                    this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
                if (!this.m_generalVo)
                    return;
                this.refreshFate();
                var warPos = this.m_generalVo.config.warPosition;
                var array = warPos.split(",");
                this.refreshInfo();
                this.m_imgIcon0.source = '';
                this.m_imgIcon1.source = '';
                this.m_imgXian.source = '';
                for (var k = 0; k < array.length; k++) {
                    this['m_imgIcon' + k].source = 'lb_pos_' + array[k] + '_png';
                }
                this.m_imgXian.source = array.length >= 2 ? 'lb_xiegang_png' : '';
                this.m_labName.text = GeneralModel.getGeneralName(this.m_generalId);
                this.m_labName.textColor = Utils.getColorOfQuality(this.m_generalVo.qualityLevel);
                this.m_pIcon.y = this.m_labName.height + this.m_labName.y + 20;
                this.image_general_type.source = this.m_generalVo.getGeneralOccupationIcon(2);
                this.image_country.source = GeneralModel.getSoldierNationLogo(this.m_generalVo.config.nationType);
                this.m_nOldStar = this.m_generalVo.star;
                this.m_nOldLv = this.m_generalVo.level;
                this.m_nOldupLevel = this.m_generalVo.upgradeLevel;
                // this.m_generalVo.recordAttribute();
                this.refreshCardView();
            },
            enumerable: true,
            configurable: true
        });
        /**关闭动画 */
        GeneralSliderRende.prototype.closeMc = function () {
            this.m_bIsMc = false;
        };
        /**刷新卡牌 */
        GeneralSliderRende.prototype.refreshCardView = function () {
            this.m_genCard.setInfo(this.m_generalId, this.m_bIsMc);
        };
        /**战力提升动画 */
        GeneralSliderRende.prototype.showFightUpEffect = function (effectList) {
            TipsUtils.showTipsFightUpList(effectList, new egret.Point(0, 0), this.m_conEffLab);
        };
        /**查看武将详情专用==================================================================================================== */
        /**单独设置战力*/
        GeneralSliderRende.prototype.setFight = function (fight) {
            this.m_comFightItem.setFight(fight);
        };
        /**单独设置星级*/
        GeneralSliderRende.prototype.setStarNum = function (star) {
            if (this.m_generalVo) {
                var startCfg = GeneralModel.getStarCfg(star);
                var starNum = startCfg.starlevel;
                var res = GeneralModel.getStarRes(startCfg.starType);
                this.refreshStarBg(startCfg.starType);
                this.group_star.removeChildren();
                for (var i = 0; i < starNum; i++) {
                    var contain = new eui.Group();
                    contain.width = 55;
                    contain.height = 55;
                    var star_1 = new eui.Image(res);
                    star_1.width = 55;
                    star_1.height = 55;
                    contain.addChild(star_1);
                    this.group_star.addChild(contain);
                }
            }
        };
        /**设置武将等级 */
        GeneralSliderRende.prototype.setGenlv = function (level) {
            this.m_pLvRoot.visible = true;
            this.m_labPlayerVip.text = level + '';
            this.m_imgLvPic.x = this.m_labPlayerVip.x + this.m_labPlayerVip.width;
        };
        return GeneralSliderRende;
    }(com_main.CComponent));
    com_main.GeneralSliderRende = GeneralSliderRende;
})(com_main || (com_main = {}));
