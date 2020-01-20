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
    /**顶导航栏 */
    var ComTabTopGroup = /** @class */ (function (_super_1) {
        __extends(ComTabTopGroup, _super_1);
        function ComTabTopGroup() {
            return _super_1.call(this) || this;
            // this.skinName = Utils.getAppSkin("common/com_tab_top_group.exml");
        }
        ComTabTopGroup.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**设置排版格式 和 按钮皮肤
        * @param skinName (tab_btntop_render tab_btntop_renderII)
        */
        ComTabTopGroup.prototype.setTabBtnSkin = function (skinName) {
            if (skinName === void 0) { skinName = "tab_btntop_render"; }
            this.m_tabBtn.itemRendererSkinName = skinName;
        };
        /**
        *  添加按钮
        * @param data 通用 {name:xxx}
        */
        ComTabTopGroup.prototype.addTabBtnData = function (data, isShowLine) {
            if (isShowLine === void 0) { isShowLine = true; }
            _super_1.prototype.addTabBtnData.call(this, data);
            if (this.m_tCollection.length > 0 && isShowLine) {
                var imgLine = new com_main.CImage("line_1004_png");
                this.m_groupLine.addChild(imgLine);
            }
        };
        /**清理 */
        ComTabTopGroup.prototype.clearTabBtn = function () {
            this.m_groupLine.removeChildren();
            _super_1.prototype.clearTabBtn.call(this);
        };
        return ComTabTopGroup;
    }(com_main.ComTabGroup));
    com_main.ComTabTopGroup = ComTabTopGroup;
})(com_main || (com_main = {}));
