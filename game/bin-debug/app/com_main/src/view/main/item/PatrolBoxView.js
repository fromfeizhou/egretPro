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
    var PatrolBoxView = /** @class */ (function (_super_1) {
        __extends(PatrolBoxView, _super_1);
        function PatrolBoxView(id) {
            var _this = _super_1.call(this) || this;
            _this.patrolAwardTime = [];
            _this.isTweenPlay = false;
            _this.isTweenStop = false;
            _this.name = PatrolBoxView.NAME;
            _this.skinName = Utils.getAppSkin("top_new/item/PatrolBoxViewSkin.exml");
            _this.touchEnabled = false;
            return _this;
        }
        PatrolBoxView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        PatrolBoxView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            this.clearBoxEffect();
            this.clearBoxStarEffect();
            this.clearBoxGetAwardEffect();
            egret.Tween.removeTweens(this);
            com_main.EventManager.removeEventListeners(this);
            if (this.m_pEffectRoot) {
                egret.Tween.removeTweens(this.m_pEffectRoot);
                this.m_pBoxEffect.removeEventListener("complete", this.actionComplete, this);
                this.m_pBoxEffect = null;
            }
        };
        PatrolBoxView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.patrolAwardTime = ConstUtil.getNumArray(IConstEnum.PATROL_AWARD_STATE_TIME);
            this.createBoxEffect();
            this.createBoxStarEffect();
            this.refrehBoxView();
            this.initEvent();
            this.m_pBoxEffect.addEventListener("complete", this.actionComplete, this);
        };
        /**刷新宝箱奖励 */
        PatrolBoxView.prototype.refrehBoxView = function () {
            var time = TimerUtils.getServerTime() - PatrolModel.info.boxGetTime;
            var state = 0;
            if (time > this.patrolAwardTime[2]) {
                state = 3;
            }
            else if (time > this.patrolAwardTime[1]) {
                state = 2;
            }
            else if (time > this.patrolAwardTime[0]) {
                state = 1;
            }
            this.setBoxAward(time > this.patrolAwardTime[0]);
            if (this.m_nBoxState == state)
                return;
            this.m_nBoxState = state;
            if (state == 3) {
                this.m_imgAwardDes.source = 'lb_gj_zlpym_png';
            }
            else {
                this.m_imgAwardDes.source = 'lb_gj_zlp_png';
            }
            if (state == 2 || state == 3) {
                this.m_imgAwardFull.visible = true;
                if (!this.isTweenPlay) {
                    this.isTweenPlay = true;
                    this.m_pBoxEffect.play(0);
                }
                this.isTweenStop = false;
            }
            else {
                this.isTweenPlay = false;
                this.m_imgAwardFull.visible = false;
                egret.Tween.removeTweens(this);
                // this.m_pBoxEffect.stop();
                this.isTweenStop = true;
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        PatrolBoxView.prototype.initEvent = function () {
            /**挂机奖励 */
            com_main.EventManager.addTouchScaleListener(this.m_pRoot, this, this.onBoxHandler);
            com_main.EventMgr.addEvent(PatrolEvent.PATROL_INFO_UPDATE, this.onPatrolInfo, this);
            com_main.EventMgr.addEvent(PatrolEvent.PATROL_TICK_UPDATE, this.onPatrolTick, this);
            com_main.EventMgr.addEvent(PatrolEvent.PATROL_AWARD_UPDATE, this.onPatrolAwardUpdate, this);
            // EventMgr.addEvent(PatrolEvent.PATROL_FLY_END, this.onPatrolFlyEnd, this);
        };
        PatrolBoxView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_INFO_UPDATE, this);
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_TICK_UPDATE, this);
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_AWARD_UPDATE, this);
            // EventMgr.removeEventByObject(PatrolEvent.PATROL_FLY_END, this);
            com_main.EventManager.removeEventListeners(this);
        };
        /**宝箱点击回调 */
        PatrolBoxView.prototype.onBoxHandler = function () {
            var time = TimerUtils.getServerTime() - PatrolModel.info.boxGetTime;
            if (time > this.patrolAwardTime[0]) {
                PatrolProxy.C2S_RECEIVE_PATROL_REWARD();
                this.setBoxAward(false);
            }
            else {
                EffectUtils.showTips(GCodeFromat(CLEnum.HAN_AWARD_TIPS, this.patrolAwardTime[0]), 1, true);
            }
            // PatrolProxy.C2S_GET_PATROL_REWARD();
        };
        /**信息刷新 */
        PatrolBoxView.prototype.onPatrolInfo = function () {
            this.refrehBoxView();
        };
        /**创建宝箱特效 */
        PatrolBoxView.prototype.createBoxEffect = function () {
            if (this.m_boxEff)
                return;
            this.m_boxEff = NormalMcMgr.createMc(IETypes.EUI_HANG_BOX, true);
            this.m_boxEff.x = 112 / 2;
            this.m_boxEff.y = 105 / 2;
            this.m_pEffectRoot.addChildAt(this.m_boxEff, 0);
        };
        /**设置星光特效 */
        PatrolBoxView.prototype.createBoxStarEffect = function () {
            if (this.m_boxStarEff)
                return;
            this.m_boxStarEff = NormalMcMgr.createMc(IETypes.EUI_BoxEffect02, true);
            this.m_boxStarEff.scaleX = 1.3;
            this.m_boxStarEff.scaleY = 1.3;
            this.m_boxStarEff.x = 114 / 2;
            this.m_boxStarEff.y = 114 / 2;
            this.m_boxStarEff.visible = false;
            this.m_pEffectRoot.addChildAt(this.m_boxStarEff, 1);
        };
        /**设置获取特效 */
        PatrolBoxView.prototype.playBoxGetAwardEffect = function () {
            var _this = this;
            if (!this.m_getAwardEff) {
                this.m_getAwardEff = NormalMcMgr.createMc(IETypes.EUI_HangLight, false);
                this.m_getAwardEff.x = 250 / 4 + 5;
                this.m_getAwardEff.y = 250 / 4 - 20;
                this.m_pEffectRoot.addChildAt(this.m_getAwardEff, 2);
            }
            this.m_getAwardEff.visible = true;
            this.m_getAwardEff.playNorOnce(IETypes.EUI_HangLight, function () {
                _this.m_getAwardEff.visible = false;
                _this.m_getAwardEff.stop();
            }, this);
        };
        //tween完成
        PatrolBoxView.prototype.actionComplete = function () {
            if (this.m_pBoxEffect && !this.isTweenStop)
                this.m_pBoxEffect.play(0);
            else {
                error("动画回调没用清除--------------------------");
            }
        };
        PatrolBoxView.prototype.clearBoxEffect = function () {
            if (this.m_boxEff) {
                NormalMcMgr.removeMc(this.m_boxEff);
                this.m_boxEff = null;
            }
        };
        PatrolBoxView.prototype.clearBoxStarEffect = function () {
            if (this.m_boxStarEff) {
                NormalMcMgr.removeMc(this.m_boxStarEff);
                this.m_boxStarEff = null;
            }
        };
        PatrolBoxView.prototype.clearBoxGetAwardEffect = function () {
            if (this.m_getAwardEff) {
                NormalMcMgr.removeMc(this.m_getAwardEff);
                this.m_getAwardEff = null;
            }
        };
        /**领奖时间刷新 */
        PatrolBoxView.prototype.onPatrolAwardUpdate = function () {
            this.refrehBoxView();
        };
        /**定时刷新改变 */
        PatrolBoxView.prototype.onPatrolTick = function () {
            this.refrehBoxView();
        };
        /**第一次奖励飞行结束 */
        PatrolBoxView.prototype.onPatrolFlyEnd = function () {
            this.setBoxAward(true);
        };
        /**重置特效和元宝图片 */
        PatrolBoxView.prototype.setBoxAward = function (visible) {
            this.m_imgAward.visible = visible;
            this.m_boxStarEff.visible = visible;
            PatrolModel.isInitFlyEnd = !visible;
        };
        PatrolBoxView.NAME = "PatrolBoxView";
        return PatrolBoxView;
    }(com_main.CComponent));
    com_main.PatrolBoxView = PatrolBoxView;
})(com_main || (com_main = {}));
