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
     * 襄阳战（帝位争夺）
     * 2.战况UI Details
     */
    var EmperorBattleDetailsWnd = /** @class */ (function (_super_1) {
        __extends(EmperorBattleDetailsWnd, _super_1);
        function EmperorBattleDetailsWnd() {
            var _this = _super_1.call(this) || this;
            _this.m_pViews = [];
            _this.name = EmperorBattleDetailsWnd.NAME;
            _this.initApp("activity/emperorBattle/EmperorBattleDetailsWndSkin.exml");
            return _this;
        }
        EmperorBattleDetailsWnd.prototype.listenerProtoNotifications = function () {
            return [];
        };
        EmperorBattleDetailsWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        EmperorBattleDetailsWnd.prototype.onDestroy = function () {
            this.m_pViews = null;
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.XIANGYANG_DETAILS_VIEW]);
        };
        EmperorBattleDetailsWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var self = this;
            self.m_MainTopNew.setTitleName("");
            self.validateNow();
            self.m_labTitle.text = GCode(CLEnum.XIANGYANG_DETAILS_TITLE); //读表
            self.addCurrentDetailsView();
            var width = self.m_tabViewStack.width;
            var height = self.m_tabViewStack.height;
            for (var i = 0; i < self.m_pViews.length; i++) {
                self.m_pViews[i].setViewSize(width, height);
            }
            var index = 0;
            self.m_comTabGroup.setChangeCallback(self.changeTag, self);
            this.m_comTabGroup.validateNow();
            this.m_comTabGroup.selectedIndex = -1;
            this.changeTag(index);
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        /**切换当前卡 */
        EmperorBattleDetailsWnd.prototype.changeTag = function (index) {
            this.m_tabViewStack.selectedIndex = index;
            this.m_comTabGroup.selectedIndex = index;
            this.m_pViews[index].initView();
        };
        /**添加当前战局 */
        EmperorBattleDetailsWnd.prototype.addCurrentDetailsView = function () {
            var type = 0;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.XIANGYANG_TAP_CUR) });
            var details = new com_main.CurrentDetailsView(type);
            this.m_tabViewStack.addChild(details);
            this.m_pViews.push(details);
        };
        EmperorBattleDetailsWnd.NAME = 'EmperorBattleDetailsWnd';
        return EmperorBattleDetailsWnd;
    }(com_main.CView));
    com_main.EmperorBattleDetailsWnd = EmperorBattleDetailsWnd;
})(com_main || (com_main = {}));
