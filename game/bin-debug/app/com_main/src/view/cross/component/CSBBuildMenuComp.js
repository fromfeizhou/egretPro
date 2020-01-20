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
/**
 * 跨服战内城墙点击出现的按钮菜单
 */
var com_main;
(function (com_main) {
    var CSBBuildMenuComp = /** @class */ (function (_super_1) {
        __extends(CSBBuildMenuComp, _super_1);
        function CSBBuildMenuComp() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("cross/component/CSBBuildMenuSkin.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        CSBBuildMenuComp.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        CSBBuildMenuComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.touchEnabled = false;
            this.addEvent();
        };
        CSBBuildMenuComp.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        CSBBuildMenuComp.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_pBtnAtk, this, this.onclickAtk);
            com_main.EventManager.addTouchTapListener(this.m_pBtnGo, this, this.onclickGo);
            com_main.EventManager.addTouchTapListener(this.m_pBtnSquare, this, this.onclickSquare);
            com_main.EventManager.addTouchTapListener(this.m_buildBtn, this, this.onclickBuild);
            com_main.EventManager.addTouchTapListener(this.m_pBtnInfo, this, this.onclickInfo);
        };
        CSBBuildMenuComp.prototype.setBuildId = function (id) {
            this.m_id = id;
            var cityInfo = CrossModel.getCityInfoById(this.m_id);
            this.currentState = cityInfo.getMenuStatus();
            // this.
        };
        CSBBuildMenuComp.prototype.onclickAtk = function () {
            // console.log('攻击 id', this.m_id)
            var info = CrossModel.getCityInfoById(this.m_id);
            if (info) {
                Utils.open_view(TASK_UI.CROSS_HERO_PANEL, info.warAreaId);
            }
            this.visible = false;
        };
        CSBBuildMenuComp.prototype.onclickGo = function () {
            // console.log('派遣 id', this.m_id)
            var info = CrossModel.getCityInfoById(this.m_id);
            if (info) {
                Utils.open_view(TASK_UI.CROSS_HERO_PANEL, info.warAreaId);
            }
            this.visible = false;
        };
        CSBBuildMenuComp.prototype.onclickSquare = function () {
            // console.log('部队派遣 id', this.m_id)
            var info = CrossModel.getCityInfoById(this.m_id);
            if (info) {
                CrossProxy.send_C2S_CROSS_SERVER_TEAM_MOVE(2, 0, info.warAreaId);
            }
            this.visible = false;
        };
        CSBBuildMenuComp.prototype.onclickBuild = function () {
            // console.log('建造箭塔 id', this.m_id)
            // Utils.open_view(TASK_UI.CROSS_BUY_TOWER_PANEL, this.m_id);
            EffectUtils.showTips('功能未开放，敬请期待');
        };
        CSBBuildMenuComp.prototype.onclickInfo = function () {
            // console.log('详情 id', this.m_id)
            com_main.EventMgr.dispatchEvent(CrossWarEvent.CROSS_BUILD_INFO, this.m_id);
        };
        return CSBBuildMenuComp;
    }(com_main.CComponent));
    com_main.CSBBuildMenuComp = CSBBuildMenuComp;
})(com_main || (com_main = {}));
