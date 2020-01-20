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
     * 重生主界面
     */
    var RebirthWnd = /** @class */ (function (_super_1) {
        __extends(RebirthWnd, _super_1);
        function RebirthWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.m_tViews = [];
            _this.m_curIndex = 0;
            _this.name = RebirthWnd.NAME;
            _this.m_curIndex = (param && param.tag) ? param.tag : 0;
            _this.initApp("general/rebirth/RebirthWndSkin.exml");
            return _this;
        }
        RebirthWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        RebirthWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.REBIRTH));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            this.m_comTabGroup.initNorTabBtns([
                GCode(CLEnum.REBIRTH)
            ]);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            var rebirthView = new com_main.RebirthView(this.m_tabViewStack.width, this.m_tabViewStack.height);
            this.m_tabViewStack.addChild(rebirthView);
            this.m_tViews.push(rebirthView);
            this.changeTag(0);
        };
        RebirthWnd.prototype.changeTag = function (selIndex) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        };
        RebirthWnd.prototype.initView = function (tag) {
            this.m_comTabGroup.selectedIndex = tag;
            this.m_tViews[tag].initView();
            this.m_tViews[tag].changeTag(tag);
        };
        RebirthWnd.NAME = 'RebirthWnd';
        return RebirthWnd;
    }(com_main.CView));
    com_main.RebirthWnd = RebirthWnd;
})(com_main || (com_main = {}));
