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
    var PatrolInfoView = /** @class */ (function (_super_1) {
        __extends(PatrolInfoView, _super_1);
        function PatrolInfoView(id) {
            var _this = _super_1.call(this) || this;
            _this.name = PatrolInfoView.NAME;
            _this.skinName = Utils.getAppSkin("top_new/item/PatrolInfoViewSkin.exml");
            return _this;
        }
        PatrolInfoView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        PatrolInfoView.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this.m_pTips);
            this.clearHangGen();
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        PatrolInfoView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            /**挂机武将 */
            PatrolProxy.send_C2S_PATROL_GET_RANDOM_PLAYERS();
            this.refreshHangGen();
            this.refreshAwardState();
            this.refreshHangPro();
            this.refreshAutoChallenge();
            this.initEvent();
        };
        /**刷新自动挂机按钮 */
        PatrolInfoView.prototype.refreshAutoChallenge = function () {
            if (PatrolModel.isAutoChallenge) {
                this.m_btnAuto.currentState = 'auto';
            }
            else {
                this.m_btnAuto.currentState = 'nor';
            }
            this.commitProperties();
        };
        /**刷新领奖状态 */
        PatrolInfoView.prototype.refreshAwardState = function () {
            if (PatrolModel.info.genInfo.rewardState == 2) {
                this.currentState = 'max';
            }
            else {
                if (PatrolModel.isHasGenAward()) {
                    this.currentState = 'award';
                }
                else {
                    this.currentState = 'nor';
                }
            }
            this.commitProperties();
        };
        /**武将形象 */
        PatrolInfoView.prototype.refreshHangGen = function () {
            var generaId = PatrolModel.info.genInfo.rewardGenId;
            if (this.m_nGeneralId == generaId)
                return;
            this.m_nGeneralId = generaId;
            this.clearHangGen();
            //没有可领武将 使用默认形象
            if (this.m_nGeneralId == 0) {
                this.createMc('HangGen5');
                return;
            }
            var cfg = C.GeneralConfig[this.m_nGeneralId];
            var effName = "HangGen" + cfg.role;
            this.createMc(effName);
        };
        PatrolInfoView.prototype.createMc = function (name) {
            if (RES.hasRes(name + "_ske_dbbin")) {
                this.m_hangGen = new MCDragonBones();
                this.m_hangGen.initAsync(name);
                this.m_hangGen.play(name);
                this.m_pEffRoot.addChild(this.m_hangGen);
            }
        };
        PatrolInfoView.prototype.clearHangGen = function () {
            if (this.m_hangGen) {
                this.m_hangGen.destroy();
                this.m_hangGen = null;
            }
        };
        /**刷新进度 */
        PatrolInfoView.prototype.refreshHangPro = function () {
            if (!PatrolModel.isHasGenAward()) {
                var cur = PatrolModel.info.patrolId - 1;
                var max = PatrolModel.info.genInfo.rewardLevelNum - 1;
                this.m_imgPro.width = (cur / max) * PatrolInfoView.PRO_MAX;
                this.m_labPro.text = cur + "/" + max;
                var cfg = C.GeneralConfig[PatrolModel.info.genInfo.rewardGenId];
                this.m_labAwardTips.text = GCodeFromat(CLEnum.HAN_PASS_TIPS, max, GLan(cfg.name));
            }
        };
        /**显示提示 */
        PatrolInfoView.prototype.showTips = function () {
            var _this = this;
            if (PatrolModel.isHasGenAward()) {
                this.m_labTips.text = GCode(CLEnum.HAN_GET_GEN);
            }
            else {
                if (RoleData.level < PatrolModel.info.levelLimit) {
                    this.m_labTips.text = GCodeFromat(CLEnum.HAN_FIGHT_LIMIT, PatrolModel.info.levelLimit);
                }
                else {
                    this.m_labTips.text = GCode(CLEnum.HAN_FIGHT_TIPS1);
                }
            }
            this.m_pTips.visible = true;
            var tw = egret.Tween.get(this.m_pTips);
            tw.to({ alpha: 1 }, 300);
            tw.wait(3000);
            tw.call(function () {
                _this.m_pTips.visible = false;
            }, this);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        PatrolInfoView.prototype.initEvent = function () {
            var _this = this;
            //自动挂机
            com_main.EventManager.addTouchScaleListener(this.m_btnAuto, this, function () {
                PatrolModel.isAutoChallenge = !PatrolModel.isAutoChallenge;
                _this.refreshAutoChallenge();
                if (PatrolModel.isAutoChallenge) {
                    EffectUtils.showTips(GCode(CLEnum.HAN_AUTO_ALR), 1, false);
                }
            });
            //关卡头像点击
            com_main.EventManager.addTouchScaleListener(this.m_btnMask, this, this.onBtnMask);
            com_main.EventMgr.addEvent(PatrolEvent.PATROL_INFO_UPDATE, this.onPatrolInfo, this);
            com_main.EventMgr.addEvent(PatrolEvent.PATROL_TICK_UPDATE, this.onPatrolTick, this);
        };
        PatrolInfoView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_INFO_UPDATE, this);
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_TICK_UPDATE, this);
            com_main.EventMgr.removeEventByObject(EventEnum.LOGIN_SUCCESS, this);
            com_main.EventManager.removeEventListeners(this);
        };
        /**信息刷新 */
        PatrolInfoView.prototype.onPatrolInfo = function () {
            this.refreshAwardState();
            this.refreshHangGen();
            this.refreshHangPro();
        };
        /**定时刷新改变 */
        PatrolInfoView.prototype.onPatrolTick = function () {
            this.showTips();
            if (TeamModel.isEmptyTeamPVE())
                return;
            if (PatrolModel.isHasGenAward())
                return;
            if (PatrolModel.isAutoChallenge) {
                if (PatrolModel.canFightBoss()) {
                    PatrolProxy.send_C2S_PATROL_CHALLENGE();
                }
            }
        };
        /**关卡头像点击 */
        PatrolInfoView.prototype.onBtnMask = function () {
            if (PatrolModel.isHasGenAward() > 0) {
                PatrolProxy.C2S_PATROL_REWARD_GENERAL(PatrolModel.info.genInfo.rewardLevelNum);
                return;
            }
            if (TeamModel.isEmptyTeamPVE()) {
                Utils.open_view(TASK_UI.POS_PARTRO_VIEW);
                return;
            }
            if (PatrolModel.canFightBoss(true)) {
                PatrolProxy.send_C2S_PATROL_CHALLENGE();
            }
        };
        PatrolInfoView.NAME = "PatrolInfoView";
        PatrolInfoView.PRO_MAX = 115;
        return PatrolInfoView;
    }(com_main.CComponent));
    com_main.PatrolInfoView = PatrolInfoView;
})(com_main || (com_main = {}));
