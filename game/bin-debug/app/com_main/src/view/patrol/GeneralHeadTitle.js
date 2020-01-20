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
    var GeneralHeadTitle = /** @class */ (function (_super_1) {
        __extends(GeneralHeadTitle, _super_1);
        function GeneralHeadTitle() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("patrol/generalHeadTitleSkin.exml");
            return _this;
        }
        GeneralHeadTitle.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeFromParent();
            this.m_tData = null;
        };
        GeneralHeadTitle.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.refreshView();
        };
        GeneralHeadTitle.prototype.setData = function (data) {
            this.m_tData = data;
        };
        GeneralHeadTitle.prototype.refreshView = function () {
            this.m_headInfo.showPlayerName(this.m_tData);
            this.m_factionName.text = this.m_tData.factName;
            if (this.m_tData.factName == "") {
                this.m_playerTitle.y = 30;
            }
            else {
                this.m_playerTitle.y = 10;
            }
            if (this.m_tData.titleId) {
                this.m_playerTitle.source = "playerTitle_" + this.m_tData.titleId + "_png";
            }
        };
        return GeneralHeadTitle;
    }(com_main.CComponent));
    com_main.GeneralHeadTitle = GeneralHeadTitle;
})(com_main || (com_main = {}));
