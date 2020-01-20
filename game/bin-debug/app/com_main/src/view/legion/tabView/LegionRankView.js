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
     * 联盟成员
     */
    var LegionRankView = /** @class */ (function (_super_1) {
        __extends(LegionRankView, _super_1);
        function LegionRankView(size) {
            var _this = _super_1.call(this) || this;
            NodeUtils.setSize(_this, size);
            _this.name = LegionRankView.NAME;
            _this.initApp('legion/tabView/LegionRankViewSkin.exml');
            return _this;
        }
        LegionRankView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        LegionRankView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        LegionRankView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_comTabTopGroup.initNorTabBtns([GCode(CLEnum.GUILD_TAB_ZX), GCode(CLEnum.GUILD_TAB_SJ), GCode(CLEnum.GUILD_TAB_GX),
                GCode(CLEnum.GUILD_TAB_ZL)]);
            this.m_comTabTopGroup.setChangeCallback(this.changeTag, this);
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        /**刷新成员列表 */
        LegionRankView.prototype.initMemberList = function () {
        };
        /**切换项目卡 */
        LegionRankView.prototype.changeTag = function (index) {
        };
        /**=====================================================================================
        * 协议处理 begin
        * =====================================================================================
        */
        LegionRankView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.GET_GUILD_INFO
            ];
        };
        /**处理协议号事件 */
        LegionRankView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_GUILD_INFO: {
                    break;
                }
            }
        };
        LegionRankView.NAME = 'LegionRankView';
        return LegionRankView;
    }(com_main.CView));
    com_main.LegionRankView = LegionRankView;
    var LegionRankCell = /** @class */ (function (_super_1) {
        __extends(LegionRankCell, _super_1);
        function LegionRankCell() {
            var _this = _super_1.call(this) || this;
            _this.touchChildren = false;
            return _this;
        }
        LegionRankCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.cacheAsBitmap = true;
        };
        LegionRankCell.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        LegionRankCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
        };
        return LegionRankCell;
    }(eui.ItemRenderer));
    com_main.LegionRankCell = LegionRankCell;
})(com_main || (com_main = {}));
