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
     * 武将缘分弹出框
     */
    var GeneralFateView = /** @class */ (function (_super_1) {
        __extends(GeneralFateView, _super_1);
        function GeneralFateView(generalId) {
            var _this = _super_1.call(this) || this;
            _this.m_generalId = generalId;
            _this.name = GeneralFateView.NAME;
            _this.initApp("fate/GeneralFateViewSkin.exml");
            return _this;
        }
        GeneralFateView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
            this.removeEvent();
            SceneResGroupCfg.clearModelRes([ModuleEnums.FATE_UI]);
        };
        GeneralFateView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.setTitleLabel(GCode(CLEnum.FATE_GEN_TITLE));
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_List.dataProvider = this.m_tCollections;
            this.m_List.itemRenderer = com_main.GeneralFateCell;
            this.refreshList();
            this.initEvent();
        };
        /**更新数据 */
        GeneralFateView.prototype.refreshList = function () {
            var fateList = FateModel.getGeneralFateViewDataByGenId(this.m_generalId);
            fateList.sort(this.sortByStatus);
            this.m_tCollections.replaceAll(fateList);
        };
        GeneralFateView.prototype.sortByStatus = function (p1, p2) {
            return p2.status - p1.status;
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        GeneralFateView.prototype.initEvent = function () {
            com_main.EventMgr.addEvent(FateEvent.FATE_DATA_CHANGE, this.updateData, this);
        };
        /**update data */
        GeneralFateView.prototype.updateData = function (id) {
            this.refreshList();
            /**弹出激活页面 */
            Utils.open_view(TASK_UI.FATE_GENERAL_ACTIVE_VIEW, id);
        };
        GeneralFateView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(FateEvent.FATE_DATA_CHANGE, this);
        };
        GeneralFateView.NAME = 'GeneralFateView';
        return GeneralFateView;
    }(com_main.CView));
    com_main.GeneralFateView = GeneralFateView;
})(com_main || (com_main = {}));
