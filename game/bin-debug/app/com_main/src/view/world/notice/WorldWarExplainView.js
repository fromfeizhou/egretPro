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
    var WorldWarExplainView = /** @class */ (function (_super_1) {
        __extends(WorldWarExplainView, _super_1);
        function WorldWarExplainView(width, height) {
            var _this = _super_1.call(this) || this;
            _this.m_curIndex = 0;
            _this.width = width;
            _this.height = height;
            _this.skinName = Utils.getSkinName("app/world/notice/WorldWarExplainViewSkin.exml");
            return _this;
        }
        WorldWarExplainView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        WorldWarExplainView.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            this.removeEvent();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        WorldWarExplainView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initView();
        };
        /**初始化界面 */
        WorldWarExplainView.prototype.initView = function () {
            this.m_labOpen.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_OPEN_LEV, FunctionModel.getFunctionOpenLevel(FunctionType.WORLD_MAP)));
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_BRIEF) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_OCC) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_TROOP) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_AGG) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_YELLOW) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.WOR_EXPLAIN_OFFICE) });
            this.m_comTabTopGroup.setChangeCallback(this.changeTab, this);
            this.addEvent();
            this.updateUI();
        };
        WorldWarExplainView.prototype.changeTab = function (selIndex) {
            if (this.m_curIndex == selIndex)
                return;
            this.m_curIndex = selIndex;
            this.updateUI();
        };
        WorldWarExplainView.prototype.updateUI = function () {
            this.m_descImg.visible = true;
            this.m_labdesc.visible = true;
            switch (this.m_curIndex) {
                case 0: {
                    this.m_labdesc.visible = false;
                    this.m_descImg.source = "gz_sm_01_png";
                    break;
                }
                case 1: {
                    this.m_labdesc.visible = false;
                    this.m_descImg.source = "gz_sm_02_png";
                    break;
                }
                case 2: {
                    this.m_descImg.visible = false;
                    this.m_labdesc.textFlow = Utils.htmlParser(GCode(CLEnum.WOR_DESC1));
                    break;
                }
                case 3: {
                    this.m_labdesc.visible = false;
                    this.m_descImg.source = "gz_sm_03_png";
                    break;
                }
                case 4: {
                    this.m_labdesc.visible = false;
                    this.m_descImg.source = "gz_sm_04_png";
                    break;
                }
                case 5: {
                    this.m_descImg.visible = false;
                    this.m_labdesc.textFlow = Utils.htmlParser(GCode(CLEnum.WOR_DESC2));
                    break;
                }
            }
        };
        /**=====================================================================================
      * 事件监听 begin
      * =====================================================================================
      */
        /**监听事件 */
        WorldWarExplainView.prototype.addEvent = function () {
        };
        /**移除事件 */
        WorldWarExplainView.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        return WorldWarExplainView;
    }(com_main.CComponent));
    com_main.WorldWarExplainView = WorldWarExplainView;
})(com_main || (com_main = {}));
