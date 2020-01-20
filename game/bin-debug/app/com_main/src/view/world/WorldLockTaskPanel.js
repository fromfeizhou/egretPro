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
    var WorldLockTaskPanel = /** @class */ (function (_super_1) {
        __extends(WorldLockTaskPanel, _super_1);
        function WorldLockTaskPanel(data) {
            var _this = _super_1.call(this) || this;
            _this.m_nTid = 0;
            _this.m_nCid = 0;
            _this.m_nDt = 0;
            _this.arwardList = [];
            _this.name = WorldLockTaskPanel.NAME;
            _this.m_nTid = data.id;
            _this.m_nCid = data.cityId;
            _this.arwardList = [];
            _this.initApp("world/WorldLockTaskPanelSkin.exml");
            return _this;
        }
        WorldLockTaskPanel.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        WorldLockTaskPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_TaskCfg = C.WorldMapUnlockTaskConfig[this.m_nTid];
            this.updateRefeshHero();
            this.updateUI();
            this.initEvent();
            this.onGuideCondition();
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        WorldLockTaskPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnClose, this, this.closeView);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGo, this, this.unlock);
        };
        /**关闭界面 */
        WorldLockTaskPanel.prototype.closeView = function () {
            com_main.UpManager.history();
        };
        /**解锁 */
        WorldLockTaskPanel.prototype.unlock = function () {
            com_main.UpManager.history();
            if (this.m_TaskCfg.type == WorldLockTaskType.SOURCE) {
                for (var index = 0; index < this.arwardList.length; index++) {
                    if (!RoleData.isbeyond(this.arwardList[index].itemId, this.arwardList[index].count)) {
                        EffectUtils.showTips(RoleData.getTipsisbeyond(this.arwardList[index].itemId, this.arwardList[index].count), 1, true);
                        return;
                    }
                }
                WorldProxy.C2S_UNLOCK_CITY(this.m_nCid);
            }
            else {
                Utils.open_view(TASK_UI.POP_WORLD_HERO_EVT_PANEL, { evtPosId: -1, cityId: this.m_nCid });
            }
        };
        WorldLockTaskPanel.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListener(this.m_pBtnClose);
            com_main.EventManager.removeEventListener(this.m_pBtnGo);
        };
        /**
         * 计算元宝显示
         */
        WorldLockTaskPanel.prototype.updateRefeshHero = function () {
            this.m_tCfg = C.VisitConfig[3106];
            if (this.m_TaskCfg) {
                this.m_pLbContent.textFlow = Utils.htmlParser(GLan(this.m_TaskCfg.UnlockText2));
            }
            else {
                this.m_pLbContent.textFlow = Utils.htmlParser(GLan(this.m_tCfg.starttext));
            }
            var config = C.GeneralConfig[this.m_tCfg.heroId];
            this.m_pHeroName.text = GLan(config.name);
            this.m_genCard.setInfo(this.m_tCfg.heroId, true);
        };
        /**更新UI */
        WorldLockTaskPanel.prototype.updateUI = function () {
            if (isNull(this.m_TaskCfg))
                return;
            this.m_pComsume.visible = this.m_TaskCfg.type != WorldLockTaskType.FIGHT;
            this.m_bLbGo.text = GCode(CLEnum.ATTACK);
            if (this.m_TaskCfg.type == WorldLockTaskType.SOURCE) {
                this.m_bLbGo.text = GCode(CLEnum.AC_HAND_OUT);
                var arwardList = Utils.parseCommonItemJson(this.m_TaskCfg.consume);
                this.arwardList = arwardList;
                var i = 0;
                for (i = 0; i < arwardList.length; i++) {
                    var itemView = com_main.ComItemNew.create("count");
                    itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                    this.m_RewardRoot.addChild(itemView);
                }
            }
        };
        /**检查新手引导面板条件 */
        WorldLockTaskPanel.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.WORLD_LOCKED_WND);
        };
        WorldLockTaskPanel.NAME = "WorldLockTaskPanel";
        return WorldLockTaskPanel;
    }(com_main.CView));
    com_main.WorldLockTaskPanel = WorldLockTaskPanel;
})(com_main || (com_main = {}));
