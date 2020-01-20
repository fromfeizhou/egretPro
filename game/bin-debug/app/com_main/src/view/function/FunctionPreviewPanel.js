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
    var FunctionPreviewPanel = /** @class */ (function (_super_1) {
        __extends(FunctionPreviewPanel, _super_1);
        function FunctionPreviewPanel() {
            var _this = _super_1.call(this) || this;
            _this.initApp("function/FunctionPreviewPanelSkin.exml");
            return _this;
        }
        FunctionPreviewPanel.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        FunctionPreviewPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_pList.dataProvider = this.m_tCollections;
            this.m_pList.itemRenderer = com_main.FunctionPreviewCell;
            this.initEvent();
            this.refreshListView();
        };
        /**设置面板列表 */
        FunctionPreviewPanel.prototype.refreshListView = function () {
            var _this = this;
            var list = FunctionModel.getPreFuncList();
            if (!list)
                return;
            var res = [];
            for (var i = 0; i < list.length; i++) {
                res.push(list[i]);
            }
            res.sort(function (a, b) {
                var aOpen = FunctionModel.isFunctionOpen(a.id);
                var bOpen = FunctionModel.isFunctionOpen(b.id);
                if (aOpen != bOpen) {
                    if (aOpen)
                        return -1;
                    return 1;
                }
                return a.sortPreview - b.sortPreview;
            });
            this.m_tCollections.replaceAll(res);
            var preFuncList = FunctionModel.getPreFuncList();
            var index = FunctionModel.getPreViewIndex();
            var cfg = preFuncList[index];
            var scorllLen = res.indexOf(cfg) * 124 >= 0 ? res.indexOf(cfg) * 124 : 0;
            egret.setTimeout(function () {
                _this.m_pScroller.viewport.scrollV = scorllLen;
            }, this, 100);
        };
        FunctionPreviewPanel.prototype.initScroller = function () {
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        FunctionPreviewPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_pBtnClose, this, this.onClick);
        };
        /**点击关闭 */
        FunctionPreviewPanel.prototype.onClick = function () {
            com_main.UpManager.history();
        };
        FunctionPreviewPanel.prototype.removeEvent = function () {
        };
        FunctionPreviewPanel.NAME = 'FunctionPreviewPanel';
        return FunctionPreviewPanel;
    }(com_main.CView));
    com_main.FunctionPreviewPanel = FunctionPreviewPanel;
})(com_main || (com_main = {}));
