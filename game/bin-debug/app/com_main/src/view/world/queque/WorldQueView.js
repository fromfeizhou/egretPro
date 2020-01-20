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
    /**
     * 行军列队
     */
    var WorldQueView = /** @class */ (function (_super_1) {
        __extends(WorldQueView, _super_1);
        function WorldQueView() {
            var _this = _super_1.call(this) || this;
            _this.name = WorldQueView.NAME;
            return _this;
            // this.skinName = Utils.getAppSkin("world/queque/WorldQueViewSkin.exml");
        }
        WorldQueView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        WorldQueView.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this.m_pItemRoot);
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        WorldQueView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_bIsShow = false;
        };
        WorldQueView.prototype.initData = function (type) {
            this.m_nTeamType = type;
            this.m_nCurIndex = -1;
            var max = TeamModel.getTeamMax(type);
            for (var i = 0; i < 5; i++) {
                var item = this["queItem" + i];
                item.setInfo(type, i);
                item.setSelectFunc(this.onChangeSel, this);
                item.open = (i < max);
            }
            this.setViewState();
            this.addEvent();
        };
        /**改变选中 */
        WorldQueView.prototype.onChangeSel = function (index) {
            if (this.m_nCurIndex == index) {
                this.m_nCurIndex = -1;
                this.setQueItemSel(index, false);
                return;
            }
            if (this.m_nCurIndex >= 0) {
                this.setQueItemSel(this.m_nCurIndex, false);
            }
            this.m_nCurIndex = index;
            this.setQueItemSel(this.m_nCurIndex, true);
        };
        /**队列选中刷新 */
        WorldQueView.prototype.setQueItemSel = function (index, val) {
            var item = this["queItem" + index];
            if (item)
                item.selected = val;
        };
        //=============================================================================================================================================
        //事件监听 begin
        //============================================================================================================================================= 
        WorldQueView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnShow, this, this.setViewState);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnHide, this, this.setViewState);
            com_main.EventMgr.addEvent(TeamUIEvent.TEAM_UPDATE_MAX_NUM, this.onTeamUpdateMaxNum, this);
            // EventMgr.addEvent(TaskWorldEvent.QUEUE_HIDE_OPERATE, this.onQueHideHander, this);
        };
        WorldQueView.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(TeamUIEvent.TEAM_UPDATE_MAX_NUM, this);
            // EventMgr.removeEventByObject(TaskWorldEvent.QUEUE_HIDE_OPERATE, this);
        };
        // private onQueHideHander() {
        //     if (this.m_bIsShow) {
        //         this.setViewState();
        //         this.onChangeSel(this.m_nCurIndex);
        //     }
        // }
        /**显示隐藏切换 */
        WorldQueView.prototype.setViewState = function () {
            var _this = this;
            this.m_bIsShow = !this.m_bIsShow;
            egret.Tween.removeTweens(this.m_pItemRoot);
            var tw = egret.Tween.get(this.m_pItemRoot);
            if (this.m_bIsShow) {
                this.m_pBtnShow.visible = this.m_bIsShow;
                this.m_pBtnHide.visible = !this.m_bIsShow;
                this.m_pItemRoot.visible = true;
                this.m_pItemRoot.alpha = 0.3;
                this.m_pItemRoot.scaleY = 0;
                tw.to({ scaleY: 1, alpha: 1 }, 300, Ease.quadOut);
            }
            else {
                this.onChangeSel(this.m_nCurIndex);
                this.m_pBtnShow.visible = !this.m_bIsShow;
                this.m_pBtnHide.visible = this.m_bIsShow;
                tw.to({ scaleY: 0, alpha: 0.3 }, 300, Ease.quadOut);
                tw.call(function () {
                    _this.m_pItemRoot.visible = false;
                }, this);
            }
        };
        /**队伍列表刷新 */
        WorldQueView.prototype.onTeamUpdateMaxNum = function () {
            for (var i = 0; i < 5; i++) {
                var item = this["queItem" + i];
                item.open = (i < TeamModel.getTeamMax(this.m_nTeamType));
            }
        };
        /**队伍列表刷新 */
        WorldQueView.prototype.onTeamUpdateDate = function () {
            for (var i = 0; i < 5; i++) {
                var item = this["queItem" + i];
                item.refreshState();
            }
        };
        WorldQueView.NAME = "WorldQueView";
        return WorldQueView;
    }(com_main.CComponent));
    com_main.WorldQueView = WorldQueView;
})(com_main || (com_main = {}));
