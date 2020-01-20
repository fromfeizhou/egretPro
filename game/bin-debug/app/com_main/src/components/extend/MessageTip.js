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
     *
     * @author
     *
     */
    var UIMsg = /** @class */ (function (_super_1) {
        __extends(UIMsg, _super_1);
        function UIMsg() {
            var _this = _super_1.call(this) || this;
            _this.isActive = true;
            _this.skinName = _this.getSkinStr();
            return _this;
        }
        UIMsg.prototype.setData = function (msg, color) {
            this.lblMessage.textColor = color;
            Utils.setRichLabel(this.lblMessage, msg);
        };
        UIMsg.prototype.startTween = function (yPos) {
            this.x = AGame.R.app.stageWidth / 2;
            this.y = yPos + this.height / 2;
            this.alpha = 0;
            this.verticalCenter = 0;
            this.horizontalCenter = 0;
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            this.m_pAction = egret.Tween.get(this);
            this.m_pAction.to({ alpha: 1 }, 300, egret.Ease.backInOut)
                .wait(100)
                .to({ y: this.y - UIMsg.tweenDist }, UIMsg.tweenDuration)
                .wait(100)
                .to({ scaleY: 0.5, alpha: 0 }, 400, egret.Ease.backOut).call(this.tweenComplete, this);
        };
        UIMsg.prototype.tweenComplete = function () {
            if (this.parent)
                this.parent.removeChild(this);
            this.isActive = false;
            this.m_pAction = null;
            MessageTip.clearQueue();
        };
        UIMsg.prototype.resetTween = function (y, prop) {
            if (prop === void 0) { prop = 1; }
            egret.Tween.removeTweens(this);
            this.m_pAction = egret.Tween.get(this);
            this.y = y;
            this.alpha = 1;
            this.scaleX = 1;
            this.scaleY = 1;
            var dist = UIMsg.tweenDist * prop;
            var duration = UIMsg.tweenDuration * prop;
            this.m_pAction = egret.Tween.get(this);
            this.m_pAction.to({ y: this.y - dist }, duration)
                .wait(100)
                .to({ scaleY: 0.4, alpha: 0 }, 400).call(this.tweenComplete, this);
        };
        UIMsg.prototype.stopTween = function () {
            egret.Tween.removeTweens(this);
        };
        UIMsg.prototype.getSkinStr = function () {
            return "<?xml version='1.0' encoding='utf-8'?>\n<e:Skin class=\"messageTipSkin\" width=\"688\" height=\"62\" xmlns:e=\"http://ns.egret.com/eui\" xmlns:w=\"http://ns.egret.com/wing\">\n\t<e:Image source=\"FCommon_BoardcastBg_png\" verticalCenter=\"0\" horizontalCenter=\"0\" width=\"100%\"/>\n\t<e:Label id=\"lblMessage\" text=\"\u6807\u7B7E\" horizontalCenter=\"0\" verticalCenter=\"0\" size=\"32\"  stroke=\"1\" strokeColor=\"0x000000\"/>\n</e:Skin>";
        };
        UIMsg.tweenDist = 40;
        UIMsg.tweenDuration = 1200;
        return UIMsg;
    }(com_main.CComponent));
    com_main.UIMsg = UIMsg;
    var MessageTip = /** @class */ (function () {
        function MessageTip() {
        }
        MessageTip.clearQueue = function () {
            var label;
            var list = MessageTip.m_pQueue;
            for (var i = list.length - 1; i >= 0; i--) {
                label = list[i];
                if (!label.isActive)
                    list.splice(i, 1);
            }
        };
        MessageTip.needsLayout = function () {
            this.clearQueue();
            var label;
            var list = MessageTip.m_pQueue;
            if (list.length > MessageTip.MAX_COUNT) {
                for (var i = 0; i < list.length - MessageTip.MAX_COUNT; i++) {
                    label = list[i];
                    label.stopTween();
                    label.parent.removeChild(label);
                    list.splice(0, 1);
                }
            }
            if (list.length > 0) {
                var yPos;
                for (var i = 0; i < list.length - 1; i++) {
                    var prop = (i + 1) / list.length;
                    label = list[i];
                    yPos = MessageTip.MSG_START_Y - (list.length - 1 - i) * label.height + label.height - 10;
                    label.resetTween(yPos, prop);
                }
            }
        };
        MessageTip.message = function (message, error) {
            var label = new UIMsg();
            label.touchEnabled = false;
            var color = error ? MessageTip.ERR_COLOR : MessageTip.INFO_COLOR;
            label.setData(message, color);
            MessageTip.m_pQueue.push(label);
            AGame.R.app.topLevel.addChild(label);
            MessageTip.needsLayout();
            label.startTween(MessageTip.MSG_START_Y);
        };
        MessageTip.AddMessageInfo = function (message) {
            MessageTip.message(message, false);
        };
        MessageTip.AddMessageError = function (message) {
            MessageTip.message(message, true);
        };
        MessageTip.AddMessageError2Tag = function (key) {
            var message = GLan(key);
            MessageTip.AddMessageError(message);
        };
        MessageTip.AddMessageInfo2Tag = function (key) {
            var message = GLan(key);
            MessageTip.AddMessageInfo(message);
        };
        MessageTip.INFO_COLOR = '0xEBFFFF';
        MessageTip.ERR_COLOR = '0xFF9B9B';
        MessageTip.MAX_COUNT = 4;
        MessageTip.MSG_START_Y = 320;
        MessageTip.m_pQueue = [];
        return MessageTip;
    }());
    com_main.MessageTip = MessageTip;
})(com_main || (com_main = {}));
