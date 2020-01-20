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
    var FunctionOpenNewPanel = /** @class */ (function (_super_1) {
        __extends(FunctionOpenNewPanel, _super_1);
        function FunctionOpenNewPanel(id) {
            var _this = _super_1.call(this) || this;
            _this.m_nFuncId = id;
            _this.initApp("function/FunctionOpenNewPanelcSkin.exml");
            return _this;
        }
        FunctionOpenNewPanel.prototype.onDestroy = function () {
            if (this.m_pNewFlyWidget) {
                egret.Tween.removeTweens(this.m_pNewFlyWidget);
                var btnId = this.getBtnCfgId();
                if (btnId > 0) {
                    var widget = com_main.MainTopOther.getWidgetByBtnId(btnId);
                    if (widget)
                        widget.visible = true;
                }
                this.m_pNewFlyWidget = null;
            }
            egret.Tween.removeTweens(this.m_pRoot);
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        FunctionOpenNewPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initEvent();
            this.updateUI();
        };
        FunctionOpenNewPanel.prototype.updateUI = function () {
            var funcCfg = FunctionModel.getFunctionCfgById(this.m_nFuncId);
            if (!funcCfg)
                return;
            this.m_pName.text = funcCfg.name;
            this.m_pDesc.textFlow = Utils.htmlParser(GLan(funcCfg.text));
            this.m_pIco.source = FunctionModel.getBtnSource(this.m_nFuncId);
        };
        /**获得有ui固定位置 的功能 按钮id */
        FunctionOpenNewPanel.prototype.getBtnCfgId = function () {
            var funcCfg = C.FunctionConfig[this.m_nFuncId];
            if (!funcCfg)
                return 0;
            var btnCfg = C.FunctionBtnConfig[funcCfg.btnType];
            if (btnCfg == null || btnCfg.pos == FunctionPosType.FPT_NONE)
                return 0;
            return btnCfg.id;
        };
        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */
        FunctionOpenNewPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchTapListener(this, this, this.onMaskHandler);
        };
        FunctionOpenNewPanel.prototype.removeEvent = function () {
        };
        /**点击回调 */
        FunctionOpenNewPanel.prototype.onMaskHandler = function () {
            var _this = this;
            //只执行一次
            if (this.m_bInClick)
                return;
            this.m_bInClick = true;
            //没有对应布局 不需要动画
            var btnId = this.getBtnCfgId();
            if (btnId == 0) {
                com_main.UpManager.history();
                return;
            }
            //已经存在的按钮 不需要动画
            var widget = com_main.MainTopOther.getWidgetByBtnId(btnId);
            if (widget) {
                com_main.UpManager.history();
                return;
            }
            var tw = egret.Tween.get(this.m_pRoot);
            tw.to({ alpha: 0 }, 300, Ease.sineOut);
            //创建对象(不可见)
            com_main.EventMgr.dispatchEvent(FunctionEvent.NEW_FUNC_OPEN, { funcId: this.m_nFuncId, show: false });
            // FunctionModel.addNewFunc(this.m_nFuncId);
            widget = com_main.MainTopOther.getWidgetByBtnId(btnId);
            this.m_pIconRoot.visible = false;
            this.m_pNewFlyWidget = FunctionModel.createFuncIconWidget(btnId, false);
            var pos = this.m_pIconRoot.localToGlobal(this.m_pIco.x + this.m_pIco.width * 0.5, this.m_pIco.y + this.m_pIco.height * 0.5);
            this.globalToLocal(pos.x, pos.y, pos);
            NodeUtils.setPosition(this.m_pNewFlyWidget, pos.x, pos.y);
            this.addChild(this.m_pNewFlyWidget);
            var target = new egret.Point(widget.x, widget.y);
            widget.parent.localToGlobal(target.x, target.y, target);
            this.globalToLocal(target.x, target.y, target);
            var flyTw = egret.Tween.get(this.m_pNewFlyWidget);
            flyTw.wait(300);
            flyTw.to({ x: target.x, y: target.y }, 800, Ease.sineOut);
            flyTw.call(function () {
                Utils.removeFromParent(_this.m_pNewFlyWidget);
                widget.visible = true;
                _this.m_pNewFlyWidget = null;
                com_main.UpManager.history();
            });
        };
        FunctionOpenNewPanel.NAME = 'FunctionOpenNewPanel';
        return FunctionOpenNewPanel;
    }(com_main.CView));
    com_main.FunctionOpenNewPanel = FunctionOpenNewPanel;
})(com_main || (com_main = {}));
