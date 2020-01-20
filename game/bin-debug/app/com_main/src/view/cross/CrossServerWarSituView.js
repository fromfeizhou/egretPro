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
     * 跨服战战况
     * @export
     * @class
     * @extends CView
     */
    var CrossServerWarSituView = /** @class */ (function (_super_1) {
        __extends(CrossServerWarSituView, _super_1);
        function CrossServerWarSituView() {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.CrossServerCampView.NAME;
            _this.initApp("cross/CrossServerWarSituViewSkin.exml");
            return _this;
        }
        CrossServerWarSituView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        CrossServerWarSituView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.updateData();
            this.setCityId();
        };
        CrossServerWarSituView.prototype.updateData = function () {
            var curWarCity = CrossModel.getCurWarCity();
            this.m_lbCity.text = GLan(C.CrossServerAreaConfig[curWarCity].name);
            this.m_PopUp.setTitleLabel(GLan(C.CrossServerAreaConfig[curWarCity].name));
            var ownCrossServerWar = CrossModel.getCrossSituData(true);
            var enemyCrossServerWar = CrossModel.getCrossSituData(false);
            this.ownSituComp.updateUI(ownCrossServerWar);
            this.enemySituComp.updateUI(enemyCrossServerWar);
        };
        /**设置城市 */
        CrossServerWarSituView.prototype.setCityId = function () {
            for (var i = 1; i <= 7; i++) {
                this['m_build_' + i].bId = i;
            }
        };
        /**=====================================================================================
      * 事件监听 begin
      * =====================================================================================
      */
        CrossServerWarSituView.prototype.addEvent = function () {
        };
        CrossServerWarSituView.prototype.removeEvent = function () {
        };
        CrossServerWarSituView.NAME = "CrossServerWarSituView";
        return CrossServerWarSituView;
    }(com_main.CView));
    com_main.CrossServerWarSituView = CrossServerWarSituView;
})(com_main || (com_main = {}));
