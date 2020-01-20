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
    var SystemNotice = /** @class */ (function (_super_1) {
        __extends(SystemNotice, _super_1);
        function SystemNotice() {
            var _this = _super_1.call(this) || this;
            _this.name = SystemNotice.NAME;
            _this.m_msgList = [];
            _this.skinName = Utils.getAppSkin("notice/SystemNoticeSkin.exml");
            _this.touchEnabled = false;
            return _this;
        }
        SystemNotice.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        SystemNotice.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this.m_pRoot);
            egret.Tween.removeTweens(this.m_labMsg);
            _super_1.prototype.onDestroy.call(this);
        };
        SystemNotice.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pRoot.mask = this.m_imgMask;
            this.popMsg();
        };
        /**添加跑马灯消息 */
        SystemNotice.prototype.pushMsg = function (msg) {
            if (this.m_msgList)
                this.m_msgList = this.m_msgList.concat(msg);
        };
        /**弹出消息 */
        SystemNotice.prototype.popMsg = function () {
            if (this.m_msgList.length > 0) {
                this.m_labMsg.x = this.m_pRoot.width;
                var msg = this.m_msgList.shift();
                this.m_labMsg.textFlow = Utils.htmlParser(msg);
                this.m_pRoot.alpha = 0;
                this.doBgAction();
            }
            else {
                SystemNotice.hide();
            }
        };
        /**背景淡出 */
        SystemNotice.prototype.doBgAction = function () {
            var _this = this;
            egret.Tween.get(this.m_pRoot)
                .to({ alpha: 1 }, 400, egret.Ease.backOut)
                .call(function () {
                _this.doLabAction();
            }, this);
        };
        //**文本动画 */
        SystemNotice.prototype.doLabAction = function () {
            var _this = this;
            if (!this.m_labMsg)
                return;
            var dis = this.m_pRoot.width + this.m_labMsg.width;
            egret.Tween.get(this.m_labMsg)
                .to({ x: -this.m_labMsg.width }, dis * 10)
                .call(function () {
                _this.popMsg();
            }, this);
        };
        /**=====================================================================================
        * 对外接口 begin
        * =====================================================================================
        */
        SystemNotice.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.NET, SystemNotice.NAME);
            return obj;
        };
        SystemNotice.show = function (msg) {
            var view = SystemNotice.getClass();
            if (!view) {
                view = new SystemNotice();
                view.pushMsg(msg);
                // AnchorUtil.setAnchorCenter(view);
                view.anchorOffsetX = 534 / 2;
                view.anchorOffsetY = 40 / 2;
                view.x = (AGame.R.app.stageWidth) / 2;
                view.y = 200;
                SceneManager.addChild(LayerEnums.NET, view, 99);
                return;
            }
            view.pushMsg(msg);
        };
        SystemNotice.hide = function () {
            var view = SystemNotice.getClass();
            if (view)
                Utils.removeFromParent(view);
        };
        SystemNotice.NAME = 'SystemNotice';
        return SystemNotice;
    }(com_main.CComponent));
    com_main.SystemNotice = SystemNotice;
})(com_main || (com_main = {}));
