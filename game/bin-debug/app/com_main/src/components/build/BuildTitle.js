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
    var BuildTitle = /** @class */ (function (_super_1) {
        __extends(BuildTitle, _super_1);
        function BuildTitle() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/build/buildTitleSkin.exml");
            return _this;
        }
        BuildTitle.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.setAnchorCenter();
            // this.x -= this.anchorOffsetX;
            //this.y -= this.anchorOffsetY;
            this.scaleX = 1.5;
            this.scaleY = 1.5;
        };
        BuildTitle.prototype.onRefreshView = function () {
        };
        BuildTitle.prototype.setTitleName = function (name) {
            this.m_pLbName.text = name;
            this.m_lbGroup.width = this.m_pLbName.width;
            this.setAnchorCenter();
        };
        BuildTitle.prototype.setTipsIcon = function (isShow) {
            if (isShow) {
                this.m_pTips.width = 21;
                this.m_pTipsRoot.width = 14;
                this.m_lbGroup.width = this.m_pLbName.width + 14;
                this.m_pLbName.x = this.m_labelPos.x - this.width * 0.5 * 1.5 + 21 * 1.5;
            }
            else {
                this.m_pTips.width = 0;
                this.m_pTipsRoot.width = 0;
                this.m_lbGroup.width = this.m_pLbName.width;
                this.m_pLbName.x = this.m_labelPos.x - this.width * 0.5 * 1.5;
            }
        };
        BuildTitle.prototype.getTitleWidth = function () {
            return this.m_pLbName.width;
        };
        BuildTitle.prototype.setAnchorCenter = function () {
            this.anchorOffsetX = this.width * 0.5;
            this.anchorOffsetY = this.height * 0.5;
            if (this.m_labelPos && this.width) {
                this.m_pLbName.x = this.m_labelPos.x - this.width * 0.5 * 1.5;
                this.m_pLbName.y = this.m_labelPos.y - 2;
            }
        };
        Object.defineProperty(BuildTitle.prototype, "visible", {
            set: function (bool) {
                _super_1.prototype.$setVisible.call(this, bool);
                this.m_pLbName.visible = bool;
            },
            enumerable: true,
            configurable: true
        });
        BuildTitle.prototype.addLabelToObj = function (obj) {
            this.validateNow();
            var pos = this.m_lbGroup.parent.localToGlobal(this.m_pLbName.x, this.m_pLbName.y);
            this.m_labelPos = obj.parent.globalToLocal(pos.x, pos.y);
            // this.m_labelPos.x += 15
            obj.addChild(this.m_pLbName);
            this.m_pLbName.anchorOffsetX = this.m_pLbName.width / 2;
            this.m_pLbName.anchorOffsetY = this.m_pLbName.height / 2;
            this.m_pLbName.scaleX = 1.5;
            this.m_pLbName.scaleY = 1.5;
            this.m_labelPos.x += this.m_pLbName.width * 1.5 / 2;
            // this.m_labelPos.y += 6;
            this.m_labelPos.y += this.m_pLbName.height * 1.5 / 2;
            this.m_pLbName.x = this.m_labelPos.x;
            this.m_pLbName.y = this.m_labelPos.y;
        };
        return BuildTitle;
    }(com_main.CComponent));
    com_main.BuildTitle = BuildTitle;
})(com_main || (com_main = {}));
