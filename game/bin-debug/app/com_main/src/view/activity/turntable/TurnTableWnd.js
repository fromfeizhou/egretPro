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
     * 转盘
     */
    var TurnTableWnd = /** @class */ (function (_super_1) {
        __extends(TurnTableWnd, _super_1);
        function TurnTableWnd(pageType) {
            var _this = _super_1.call(this) || this;
            _this.m_pViews = [];
            _this.name = TurnTableWnd.NAME;
            _this.m_nCurType = pageType || AcViewType.PRIZE;
            _this.initApp("activity/turntable/TurnTableWndSkin.exml");
            return _this;
        }
        TurnTableWnd.prototype.onDestroy = function () {
            this.m_pViews = null;
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.TURNTABLE_UI]);
        };
        TurnTableWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.TURNTABLE]);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.TURNTABLE));
            this.validateNow();
            this.addturnTableView();
            //强制渲染一次 获取宽高
            // this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            for (var i = 0; i < this.m_pViews.length; i++) {
                this.m_pViews[i].setViewSize(width, height);
            }
            var index = 0;
            for (var i = 0; i < this.m_pViews.length; i++) {
                var view = this.m_pViews[i];
                if (view.activityType == this.m_nCurType) {
                    index = i;
                    break;
                }
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_comTabGroup.validateNow();
            this.m_comTabGroup.selectedIndex = -1;
            this.changeTag(index);
        };
        /**切换当前卡 */
        TurnTableWnd.prototype.changeTag = function (index) {
            this.m_nCurType = this.m_pViews[index].activityType;
            this.m_tabViewStack.selectedIndex = index;
            this.m_comTabGroup.selectedIndex = index;
            this.m_pViews[index].initView();
        };
        /**添加幸运转盘*/
        TurnTableWnd.prototype.addturnTableView = function () {
            var type = AcViewType.PRIZE;
            if (!ActivityModel.isOpen(type))
                return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.TURNTABLE) });
            var signUp = new com_main.TurnTableView(type);
            this.m_tabViewStack.addChild(signUp);
            this.m_pViews.push(signUp);
            // RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.TURNTABLE)),
            // { x: 132, y: -5 }, [RedEvtType.SIGN_MONTH_DAY], 2);
        };
        TurnTableWnd.NAME = 'TurnTableWnd';
        return TurnTableWnd;
    }(com_main.CView));
    com_main.TurnTableWnd = TurnTableWnd;
})(com_main || (com_main = {}));
