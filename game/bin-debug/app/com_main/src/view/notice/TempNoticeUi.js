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
    var TempNoticeUi = /** @class */ (function (_super_1) {
        __extends(TempNoticeUi, _super_1);
        function TempNoticeUi(w, h) {
            var _this = _super_1.call(this) || this;
            _this.row = 3; //显示3行
            _this.gap = 3; //行距
            _this.lineW = 0;
            _this.lineH = 0;
            _this.firstId = 0;
            _this.isMove = false;
            _this.showTime = 3000; //显示时间：3s
            _this.panelTempNotice = [];
            _this.name = TempNoticeUi.NAME;
            _this.x = GameConfig.curWidth() - w + 170;
            _this.y = GameConfig.curHeight() - h;
            _this.lineW = w;
            _this.lineH = h / _this.row - _this.gap;
            _this.touchEnabled = false;
            _this.touchChildren = false;
            _this.initGroup();
            return _this;
        }
        Object.defineProperty(TempNoticeUi, "GetInstance", {
            get: function () {
                TempNoticeUi.instance = TempNoticeUi.instance || new TempNoticeUi(350, 159);
                return TempNoticeUi.instance;
            },
            enumerable: true,
            configurable: true
        });
        TempNoticeUi.prototype.initGroup = function () {
            this.panelBgTexture = RES.getRes("fight_component_BattleBar_json.fight_component_window-sb-BJ");
            this.groupTempNotice = new eui.Group;
            this.groupTempNotice.width = this.lineW;
            this.groupTempNotice.height = this.lineH * this.row + this.gap * this.row;
            this.groupTempNotice.anchorOffsetX = this.groupTempNotice.width / 2;
            this.groupTempNotice.anchorOffsetY = this.groupTempNotice.height / 2;
            this.rectangle = new egret.Rectangle(0, 0, this.lineW, this.lineH * this.row + this.gap * (this.row - 1));
            this.groupTempNotice.mask = this.rectangle;
            this.addChild(this.groupTempNotice);
        };
        TempNoticeUi.prototype.setData = function (msg) {
            this.start(msg);
        };
        TempNoticeUi.prototype.getState = function () {
            return this.isMove;
        };
        TempNoticeUi.prototype.start = function (msg) {
            if (!this.isMove) {
                this.isMove = true;
                this.startInit(msg);
                this.startMove();
            }
        };
        TempNoticeUi.prototype.startInit = function (msg) {
            var panel = this.initComponent(msg);
            var id = egret.setTimeout(function (arg) {
                if (panel) { //防止销毁后为null
                    panel.x = panel.x + panel.width;
                    panel.y = this.groupTempNotice.height + this.gap;
                    this.panelTempNotice.splice(0, 1);
                    this.groupTempNotice.removeChild(arg);
                    arg = null;
                }
            }, this, this.showTime, panel);
            this.panelTempNotice.push({ panel: panel });
        };
        TempNoticeUi.prototype.initComponent = function (msg) {
            var label = new eui.Label;
            var img = new egret.Bitmap(this.panelBgTexture);
            var panel = new eui.Panel;
            panel.addChild(img);
            panel.addChild(label);
            this.groupTempNotice.addChild(panel);
            panel.width = this.lineW;
            panel.height = this.lineH;
            panel.x = 0;
            panel.y = this.groupTempNotice.height;
            img.width = this.lineW;
            img.height = this.lineH;
            label.text = msg;
            label.size = 28;
            label.anchorOffsetX = label.width / 2;
            label.anchorOffsetY = label.height / 2;
            label.x = this.lineW / 2;
            label.y = this.lineH / 2;
            return panel;
        };
        TempNoticeUi.prototype.startMove = function () {
            var _this = this;
            if (this.panelTempNotice.length != 0) {
                var moveTo_1 = this.lineH + this.gap;
                if (this.getFirstY() == 0) {
                    egret.Tween.get(this.panelTempNotice[this.firstId].panel).to({ x: this.panelTempNotice[this.firstId].panel.x + this.panelTempNotice[this.firstId].panel.width }, 350).call(function () {
                        _this.panelTempNotice[_this.firstId].panel.visible = false;
                        _this.panelTempNotice[_this.firstId].panel.y = _this.groupTempNotice.height + _this.gap;
                        _this.moveAll(moveTo_1);
                        return;
                    });
                }
                else {
                    this.moveAll(moveTo_1);
                }
            }
        };
        TempNoticeUi.prototype.moveAll = function (moveTo) {
            var _this = this;
            for (var i = 0; i < this.panelTempNotice.length; i++) {
                if (this.panelTempNotice[i].panel.x == 0) {
                    egret.Tween.get(this.panelTempNotice[i].panel).to({ y: this.panelTempNotice[i].panel.y - moveTo }, 350).call(function () {
                        _this.isMove = false;
                    });
                }
            }
        };
        TempNoticeUi.prototype.getFirstY = function () {
            var min = 99999;
            for (var i = 0; i < this.panelTempNotice.length; i++) {
                var tempY = this.panelTempNotice[i].panel.y;
                // debug("fgbn:"+tempY);
                if (tempY < min) {
                    min = tempY;
                    this.firstId = i;
                }
            }
            return min;
        };
        TempNoticeUi.prototype.onDestroy = function () {
            Utils.removeFromParent(this);
            TempNoticeUi.instance = null;
        };
        TempNoticeUi.NAME = 'TempNoticeUi';
        return TempNoticeUi;
    }(com_main.CView));
    com_main.TempNoticeUi = TempNoticeUi;
})(com_main || (com_main = {}));
