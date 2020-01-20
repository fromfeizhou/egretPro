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
    var TavernAwardView = /** @class */ (function (_super_1) {
        __extends(TavernAwardView, _super_1);
        function TavernAwardView(param) {
            var _this = _super_1.call(this) || this;
            _this._effectFinish = false;
            _this.name = TavernAwardView.NAME;
            _this.initApp("tavern/tavern_award.exml");
            _this._result = param.result;
            _this._tavernType = param.tavernType;
            return _this;
        }
        TavernAwardView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        TavernAwardView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.currentState = this._tavernType == 1 ? 'ten' : 'base';
            this.m_pBtnComfirm.setTitleLabel(GCode(CLEnum.SURE));
            this.refresh();
            this.onGuideCondition();
            this.addEvent();
        };
        /**监听事件 */
        TavernAwardView.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_BackGround, this, this.onTouchBackGround);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnComfirm, this, this.onTouchBackGround);
            com_main.EventMgr.addEvent(GeneralEvent.GENERAL_GET_WND_CLOSE, this.closeWndHandler, this);
        };
        /**移除事件 */
        TavernAwardView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(GeneralEvent.GENERAL_GET_WND_CLOSE, this);
        };
        TavernAwardView.prototype.onTouchBackGround = function () {
            if (!this._effectFinish)
                return;
            this._effectFinish = false;
            com_main.UpManager.history();
        };
        TavernAwardView.prototype.refresh = function () {
            this._effectFinish = false;
            this.onItemTick();
        };
        /**界面关闭回调 */
        TavernAwardView.prototype.closeWndHandler = function () {
            this.createItem();
        };
        TavernAwardView.prototype.onItemTick = function () {
            if (this._result.length == 0) {
                this._effectFinish = true;
                return;
            }
            var data = this._result.shift();
            this.m_cacheInfo = { itemId: data.code, count: data.value };
            var cfg = C.GeneralConfig[data.code];
            if (data.type == 8) {
                if (cfg.qualityLevel <= 2) {
                    Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEWII, { curState: "base", generalId: data.code });
                }
                else {
                    Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEW, { curState: "base", generalId: data.code });
                }
                this.m_cacheInfo.itemId = C.GeneralConfig[data.code].itemViewId;
                this.m_cacheInfo.count = 0;
                return;
            }
            else if (data.type == 10) {
                if (cfg.qualityLevel <= 2) {
                    Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEWII, { curState: "tavern", generalId: data.code, value: data.value });
                }
                else {
                    Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEW, { curState: "tavern", generalId: data.code, value: data.value });
                }
                this.m_cacheInfo.itemId = C.GeneralConfig[data.code].itemId;
                return;
            }
            this.createItem();
            // Sound.playID(231)
            this._tavernType == 1 ? Sound.playID(232) : Sound.playID(231);
        };
        TavernAwardView.prototype.createItem = function () {
            var _this = this;
            if (!this.m_cacheInfo || !this.m_ItemRoot)
                return;
            var item = new com_main.TavernItemRender(this.m_cacheInfo);
            this.m_cacheInfo = null;
            this.m_ItemRoot.addChild(item);
            NodeUtils.setScale(item, 2.5);
            item.alpha = 0.5;
            var tw = egret.Tween.get(item);
            tw.wait(50);
            // tw.to({ scaleX: 0.5, scaleY: 0.5 });
            tw.to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200, egret.Ease.backOut);
            tw.call(function () {
                _this.onItemTick();
            }, this);
        };
        /**检查新手引导面板条件 */
        TavernAwardView.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.TAV_AWARD_WND);
        };
        TavernAwardView.NAME = 'TavernAwardView';
        return TavernAwardView;
    }(com_main.CView));
    com_main.TavernAwardView = TavernAwardView;
})(com_main || (com_main = {}));
