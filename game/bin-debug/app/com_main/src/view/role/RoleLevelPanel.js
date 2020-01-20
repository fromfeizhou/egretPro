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
    var RoleLevelPanel = /** @class */ (function (_super_1) {
        __extends(RoleLevelPanel, _super_1);
        function RoleLevelPanel() {
            var _this = _super_1.call(this) || this;
            _this.m_level = 0;
            _this.initApp("role/RoleLevelPanelSkin.exml");
            return _this;
        }
        RoleLevelPanel.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.handlerTween, this);
            egret.clearTimeout(this.timeKey);
            if (this.unlockMc) {
                this.unlockMc.destroy();
            }
            if (this.m_Bar)
                egret.Tween.removeTweens(this.m_Bar);
            if (this.m_LightBar)
                egret.Tween.removeTweens(this.m_LightBar);
            this.unlockMc = null;
            if (this.m_pGobal)
                egret.Tween.removeTweens(this.m_pGobal);
            if (this.m_pFunc)
                egret.Tween.removeTweens(this.m_pFunc);
            if (this.m_genCard)
                egret.Tween.removeTweens(this.m_genCard);
            _super_1.prototype.onDestroy.call(this);
            if (GiftBagModel.isPopItem) {
                Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 1, giftId: GiftBagModel.jumpId });
            }
            SceneResGroupCfg.clearModelRes([ModuleEnums.LEVELUP_VIEW]);
        };
        RoleLevelPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_level = RoleData.lastLevel;
            this.initEvent();
            this.updateUI();
            platform.reportData(ReportType.levelup);
        };
        RoleLevelPanel.prototype.updateUI = function () {
            this.m_pFunc.visible = false;
            this.createAni();
            this.updateLevel();
            Utils.TimerManager.doTimer(50, 1, this.handlerTween, this);
            // egret.callLater(() => {
            // }, this);
        };
        RoleLevelPanel.prototype.handlerTween = function () {
            this.playTween();
            this.actionGroup.play();
            this.playLastExpTween();
        };
        RoleLevelPanel.prototype.playStarAni = function () {
            this.unlockMc = new MCDragonBones();
            this.unlockMc.initAsync(IETypes.EUI_UNLOCK);
            this.unlockMc.play(IETypes.EUI_UNLOCK, 1, true);
            this.unlockMc.scaleX = 4;
            this.unlockMc.scaleY = 4;
            this.unlockMc.x = 1550 / 2;
            this.unlockMc.y = 300;
            this.addChild(this.unlockMc);
        };
        RoleLevelPanel.prototype.playLastExpTween = function () {
            var _this = this;
            if (isNull(this.m_Bar))
                return;
            this.timeKey = egret.setTimeout(function () {
                var curW = Math.min(Math.floor((RoleData.lastExp / RoleData.getPlayerLevelUpExp(RoleData.lastLevel)) * 400), 400);
                curW = curW ? curW : 0;
                Tween.get(_this.m_Bar).to({ width: curW }, 10).to({ width: 400 }, 350).call(function () {
                    _this.m_level = RoleData.level;
                    _this.refreshLevel();
                    _this.playStarAni();
                    egret.clearTimeout(_this.timeKey);
                    _this.playCurExpTween();
                    _this.playLightExpTween();
                    _this.playFuncOpenTween();
                    egret.Tween.removeTweens(_this.m_Bar);
                });
            }, this, 167);
        };
        RoleLevelPanel.prototype.playLightExpTween = function () {
            var _this = this;
            if (isNull(this.m_LightBar))
                return;
            this.m_LightBar.visible = true;
            Tween.get(this.m_LightBar).wait(167).call(function () {
                egret.Tween.removeTweens(_this.m_LightBar);
                _this.m_LightBar.visible = false;
            });
        };
        RoleLevelPanel.prototype.playCurExpTween = function () {
            var _this = this;
            if (isNull(this.m_Bar))
                return;
            this.m_Bar.width = 0;
            var curW = Math.min(Math.floor((RoleData.exp / RoleData.getPlayerLevelUpExp(RoleData.level)) * 400), 400);
            curW = curW ? curW : 0;
            Tween.get(this.m_Bar).to({ width: curW }, 200).call(function () {
                egret.Tween.removeTweens(_this.m_Bar);
            });
        };
        /**功能开放展开动画 */
        RoleLevelPanel.prototype.playFuncOpenTween = function () {
            var _this = this;
            var lastFuncCfg = FunctionModel.getLastFuncCfg();
            if (isNull(lastFuncCfg))
                return;
            this.m_pFunc.visible = true;
            Tween.get(this.m_pFunc).to({ alpha: 1, y: 243 }, 400).call(function () {
                egret.Tween.removeTweens(_this.m_pFunc);
            });
        };
        RoleLevelPanel.prototype.onAllComplete = function () {
            // EventMgr.dispatchEvent(GuideEvent.GUIDE_BATTLE_WIN_COMPOUND_ANI, null);
        };
        RoleLevelPanel.prototype.updateLevel = function () {
            this.m_pGobal.mask = this.border_1001;
            // this.m_pFunc.mask = this.border_func;
            this.refreshLevel();
            var lastFuncCfg = FunctionModel.getLastFuncCfg();
            this.m_Bar.width = Math.min((RoleData.lastExp / RoleData.getPlayerLevelUpExp(RoleData.lastLevel)) * 400, 400);
            this.m_pFunc.visible = lastFuncCfg != null;
            if (isNull(lastFuncCfg))
                return;
            this.m_pFuncIcon.source = FunctionModel.getBtnSource(lastFuncCfg.id);
            this.m_pFuncName.text = lastFuncCfg.name;
            this.m_pFuncDesc.textFlow = Utils.htmlParser(GLan(lastFuncCfg.text));
            this.m_pFuncLev.text = GCodeFromat(CLEnum.FUNC_LEVEL, lastFuncCfg.openLevel);
        };
        RoleLevelPanel.prototype.refreshLevel = function () {
            this.m_rLev.text = "" + this.m_level;
            this.m_genLevel.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.GEN_LEVEL, this.m_level));
        };
        RoleLevelPanel.prototype.createAni = function () {
            this.m_genCard.setInfo(1021, true);
        };
        RoleLevelPanel.prototype.playTween = function () {
            var _this = this;
            this.m_genCard.alpha = 0.3;
            this.m_genCard.y = 460;
            Tween.get(this.m_genCard).to({ y: 441, scaleY: 1.1, alpha: 1 }, 167).to({ scaleY: 0.85 }, 125).call(function () {
                egret.Tween.removeTweens(_this.m_genCard);
            });
            // this.m_pHeroRoot.alpha = 0.3;
            // this.m_pHeroRoot.y = 600;
            // Tween.get(this.m_pHeroRoot).to({ y: 446, scaleY: 1.1, alpha: 1 }, 167).to({ scaleY: 1 }, 125).call(() => {
            // 	egret.Tween.removeTweens(this.m_pHeroRoot);
            // });
            // Tween.get(this.m_pGobal).to({ scaleY: 0.1 }, 10).to({ scaleY: 1 }, 500).call(() => {
            // 	egret.Tween.removeTweens(this.m_pGobal);
            // });
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        RoleLevelPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchTapListener(this, this, this.onClickTurn);
        };
        /**跳转前往 */
        RoleLevelPanel.prototype.onClickTurn = function () {
            com_main.UpManager.history();
        };
        RoleLevelPanel.NAME = 'RoleLevelPanel';
        return RoleLevelPanel;
    }(com_main.CView));
    com_main.RoleLevelPanel = RoleLevelPanel;
})(com_main || (com_main = {}));
