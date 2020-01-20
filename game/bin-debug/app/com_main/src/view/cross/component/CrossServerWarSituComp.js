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
    var CrossServerWarSituComp = /** @class */ (function (_super_1) {
        __extends(CrossServerWarSituComp, _super_1);
        function CrossServerWarSituComp() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("cross/component/CrossServerWarSituCompSkin.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        CrossServerWarSituComp.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        /**更新资源显示 */
        CrossServerWarSituComp.prototype.updateUI = function (crossSituData) {
            var cityNum = crossSituData.isOwn ? CrossModel.getOwnCityNum() : CrossModel.getEnenyCityNum();
            this.m_areaCout.text = GCodeFromat(CLEnum.CROSS_SITU_OCCU, cityNum + 1);
            var towerNum = crossSituData.isOwn ? CrossModel.getOwnTowerNum() : CrossModel.getEnenyTowerNum();
            this.m_arrowCout.text = GCodeFromat(CLEnum.CROSS_SITU_TOWER, towerNum);
            this.m_curTeamCout.text = GCodeFromat(CLEnum.CROSS_SITU_TEAM, crossSituData.teamNum);
            this.m_surTeamCout.visible = crossSituData.isOwn;
            if (crossSituData.isOwn) {
                this.m_surTeamCout.text = GCodeFromat(CLEnum.CROSS_SITU_SUR, CrossModel.curTroop);
                this.m_flag.source = 'zyt_vs_blue_png';
                this.m_lbFlag.strokeColor = 0x173e96;
                this.m_lbFlag.text = '我';
            }
            else {
                this.m_flag.source = 'zyt_vs_red_png';
                this.m_lbFlag.strokeColor = 0x961717;
                this.m_lbFlag.text = '敌';
            }
        };
        return CrossServerWarSituComp;
    }(com_main.CComponent));
    com_main.CrossServerWarSituComp = CrossServerWarSituComp;
})(com_main || (com_main = {}));
