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
    var CSBBuildInfoTips = /** @class */ (function (_super_1) {
        __extends(CSBBuildInfoTips, _super_1);
        function CSBBuildInfoTips() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("cross/component/CSBBuildInfoTipsSkin.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        CSBBuildInfoTips.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        CSBBuildInfoTips.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.touchEnabled = false;
            this.addEvent();
        };
        CSBBuildInfoTips.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        CSBBuildInfoTips.prototype.addEvent = function () {
            // EventManager.addTouchTapListener(this.m_pBtnAtk, this, this.onclickAtk);
            // EventManager.addTouchTapListener(this.m_pBtnGo, this, this.onclickGo);
            // EventManager.addTouchTapListener(this.m_pBtnSquare, this, this.onclickSquare);
            // EventManager.addTouchTapListener(this.m_buildBtn, this, this.onclickBuild);
            // EventManager.addTouchTapListener(this.m_pBtnInfo, this, this.onclickInfo);
        };
        CSBBuildInfoTips.prototype.setBuildId = function (id) {
            this.m_id = id;
            var cityInfo = CrossModel.getCityInfoById(this.m_id);
            var faction = cityInfo.getFaction();
            switch (faction) {
                case CSBFaction.NONE: {
                    this.currentState = 'none';
                    break;
                }
                case CSBFaction.EMENY: {
                    this.currentState = 'emeny';
                    break;
                }
                case CSBFaction.OUR: {
                    this.currentState = 'OUR';
                    break;
                }
            }
            this.commitProperties();
            this.m_lbDefTower.text = cityInfo.getTowerNum().toString();
            this.m_lbDef.text = cityInfo.defTeamNum.toString();
            this.m_lbaAtk.text = cityInfo.attTeamNum.toString();
        };
        return CSBBuildInfoTips;
    }(com_main.CComponent));
    com_main.CSBBuildInfoTips = CSBBuildInfoTips;
})(com_main || (com_main = {}));
