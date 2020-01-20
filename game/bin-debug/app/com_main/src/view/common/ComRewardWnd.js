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
    var ComRewardWnd = /** @class */ (function (_super_1) {
        __extends(ComRewardWnd, _super_1);
        /**奖励通用界面 */
        function ComRewardWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = ComRewardWnd.NAME;
            _this.m_sAwards = param.awards;
            _this.m_titleStr = param.titleStr;
            _this.initApp("common/ComRewardWndSkin.exml");
            return _this;
        }
        ComRewardWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        ComRewardWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_LabTitle.text = this.m_titleStr ? this.m_titleStr : GCode(CLEnum.BOSS_BOX_AWARD);
            this.reFreshItems();
        };
        /**刷新奖励 */
        ComRewardWnd.prototype.reFreshItems = function () {
            var awardInfos;
            if (typeof (this.m_sAwards) == "string") {
                awardInfos = Utils.parseCommonItemJson(this.m_sAwards);
            }
            else {
                awardInfos = this.m_sAwards;
            }
            for (var i = 0; i < awardInfos.length; i++) {
                var info = awardInfos[i];
                var itemView = com_main.ComItemNew.create('name_num');
                itemView.setItemInfo(info.itemId, info.count);
                this.m_pItemsRoot.addChild(itemView);
            }
        };
        ComRewardWnd.NAME = "ComRewardWnd";
        return ComRewardWnd;
    }(com_main.CView));
    com_main.ComRewardWnd = ComRewardWnd;
})(com_main || (com_main = {}));
