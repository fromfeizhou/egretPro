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
    var PatrolBossView = /** @class */ (function (_super_1) {
        __extends(PatrolBossView, _super_1);
        function PatrolBossView(id) {
            var _this = _super_1.call(this) || this;
            _this.m_bBossAct = false;
            _this.name = PatrolBossView.NAME;
            _this.skinName = Utils.getAppSkin("top_new/item/PatrolBossViewSkin.exml");
            return _this;
        }
        PatrolBossView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        PatrolBossView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            this.removeBossTipsAct();
            this.clearBtnBossAttackEff();
        };
        PatrolBossView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.m_imgIcon.mask = this.m_imgMask;
            this.initView();
            this.validateNow();
            this.refreshPro();
            this.initEvent();
        };
        /**初始化数据 */
        PatrolBossView.prototype.initView = function () {
            if (!PatrolModel.getBossInfo()) {
                this.visible = false;
                return;
            }
            this.visible = true;
            var time = PatrolModel.getBossTime();
            this.m_nBossTime = PatrolModel.getBossTimeMax();
            var genCfg = C.GeneralConfig[1020] || C.GeneralConfig[1001];
            this.m_imgIcon.source = GeneralModel.getSoldierLogo(genCfg.role);
            this.validateNow();
            this.refreshPro();
        };
        /**刷新进度 */
        PatrolBossView.prototype.refreshPro = function () {
            if (this.isBossIn()) {
                var time = PatrolModel.getBossTime();
                if (time >= this.m_nBossTime) {
                    this.addBossTipsAct();
                    this.createBtnBossAttackEffect();
                    this.noticeBossAttack();
                }
                else {
                    this.removeBossTipsAct();
                    this.clearBtnBossAttackEff();
                }
                this.m_proHB.progress = time / this.m_nBossTime;
            }
            else {
                this.m_proHB.progress = 0;
                // this.removeBossTipsAct();
                this.addBossTipsAct("lb_djzjcs_png");
            }
        };
        /**boss进度刷新 */
        PatrolBossView.prototype.isBossIn = function () {
            if (!PatrolModel.info.bossInfo)
                return false;
            if (PatrolModel.info.bossInfo.bossId > 0 && NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS).reCount > 0)
                return true;
            return false;
        };
        /**设置boss按钮特效 */
        PatrolBossView.prototype.createBtnBossAttackEffect = function () {
            if (this.m_btnBossAtackEff)
                return;
            this.m_btnBossAtackEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_btnBossAtackEff.x = 50;
            this.m_btnBossAtackEff.y = 49;
            this.m_pBoss.addChildAt(this.m_btnBossAtackEff, 4);
        };
        PatrolBossView.prototype.clearBtnBossAttackEff = function () {
            if (this.m_btnBossAtackEff) {
                NormalMcMgr.removeMc(this.m_btnBossAtackEff);
                this.m_btnBossAtackEff = null;
            }
        };
        /**设置文字特效 */
        PatrolBossView.prototype.addBossTipsAct = function (img) {
            if (img === void 0) { img = "lb_djrq_png"; }
            this.m_imgHBTips.visible = true;
            this.m_imgHBTips.source = img;
            if (this.m_bTipsAct)
                return;
            this.m_bTipsAct = true;
            egret.Tween.get(this.m_imgHBTips, { loop: true }).to({ alpha: 0 }, 1000).to({ alpha: 1 }, 1000);
        };
        /**清除文字特效 */
        PatrolBossView.prototype.removeBossTipsAct = function () {
            this.m_imgHBTips.visible = false;
            if (!this.m_bTipsAct)
                return;
            this.m_bTipsAct = false;
            egret.Tween.removeTweens(this.m_imgHBTips);
        };
        /**通知播放boss来袭特效 */
        PatrolBossView.prototype.noticeBossAttack = function () {
            if (this.m_bBossAct)
                return;
            this.m_bBossAct = true;
            com_main.EventMgr.dispatchEvent(PatrolEvent.PATRAL_BOSS_ATTACK_EFF, null);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        PatrolBossView.prototype.initEvent = function () {
            /**挂机boss */
            com_main.EventManager.addTouchScaleListener(this, this, function () {
                Utils.open_view(TASK_UI.POS_PATROL_BOSS_VIEW);
            });
            com_main.EventMgr.addEvent(PatrolEvent.PATROL_BOSS_RESET, this.onBossReset, this);
            com_main.EventMgr.addEvent(PatrolEvent.PATROL_TICK_UPDATE, this.onPatrolTick, this);
            com_main.EventMgr.addEvent(PatrolEvent.PATROL_INFO_UPDATE, this.onPatrolInfo, this);
            com_main.EventMgr.addEvent(NormalEvent.NORMAL_FUN_COUNT, this.onFunCount, this);
        };
        PatrolBossView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_BOSS_RESET, this);
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_TICK_UPDATE, this);
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_INFO_UPDATE, this);
            com_main.EventMgr.removeEventByObject(NormalEvent.NORMAL_FUN_COUNT, this);
            com_main.EventManager.removeEventListeners(this);
        };
        /**信息刷新 */
        PatrolBossView.prototype.onPatrolInfo = function () {
            this.initView();
        };
        /**信息刷新 */
        PatrolBossView.prototype.onBossReset = function () {
            this.refreshPro();
        };
        /**定时刷新改变 */
        PatrolBossView.prototype.onPatrolTick = function () {
            this.refreshPro();
        };
        /**功能次数变动 */
        PatrolBossView.prototype.onFunCount = function (id) {
            if (id != IFunCountEnum.PATROL_BOSS)
                return;
            if (NormalModel.getFunCountById(IFunCountEnum.PATROL_BOSS).reCount == 0) {
                this.m_bTipsAct = false;
                this.addBossTipsAct("lb_djzjcs_png");
            }
        };
        PatrolBossView.NAME = "PatrolBossView";
        return PatrolBossView;
    }(com_main.CComponent));
    com_main.PatrolBossView = PatrolBossView;
})(com_main || (com_main = {}));
