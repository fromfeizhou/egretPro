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
     * 方阵对话框
     */
    var TalkFrame = /** @class */ (function (_super_1) {
        __extends(TalkFrame, _super_1);
        function TalkFrame(content, timeout, state) {
            if (state === void 0) { state = 'normal'; }
            var _this = _super_1.call(this) || this;
            _this.m_content = "";
            _this.m_timeout = 2000;
            _this.skinName = Utils.getAppSkin("battle_new/components/BattleTalkSkin.exml");
            _this.currentState = state;
            _this.m_content = content;
            _this.m_timeout = timeout || _this.m_timeout;
            return _this;
        }
        TalkFrame.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        TalkFrame.prototype.$onRemoveFromStage = function () {
            egret.Tween.removeTweens(this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        TalkFrame.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initFrame();
        };
        TalkFrame.prototype.initFrame = function () {
            var _this = this;
            this.m_lbContent.text = this.m_content;
            // this.m_pRichLabel = new CCRichText(this.m_lbContent);
            // Utils.addChild(this, this.m_pRichLabel);
            // this.m_pRichLabel.imageScale = 0.6;
            // let chatContent: string = ChatUtils.ConvertFaceStr(this.m_content); //解析表情字符
            // this.m_pRichLabel.text = chatContent;
            if (this.m_timeout > 0) {
                var tw = egret.Tween.get(this);
                tw.wait(this.m_timeout);
                tw.to({ alpha: 0 }, 1000, Ease.cubicOut).call(function () {
                    if (_this) {
                        Utils.removeFromParent(_this);
                    }
                }, this);
            }
        };
        return TalkFrame;
    }(com_main.CComponent));
    com_main.TalkFrame = TalkFrame;
})(com_main || (com_main = {}));
