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
    var ArenaSaodanResultView = /** @class */ (function (_super_1) {
        __extends(ArenaSaodanResultView, _super_1);
        function ArenaSaodanResultView(param) {
            var _this = _super_1.call(this) || this;
            _this.name = ArenaSaodanResultView.NAME;
            _this.initApp("arena/arena_sandan_result.exml");
            _this.data = param;
            _this.m_PopUpBoard.setTitleLabel(GCode(CLEnum.CAMP_SWEEP));
            return _this;
        }
        ArenaSaodanResultView.prototype.onDestroy = function () {
            Utils.TimerManager.remove(this.onTickHandler, this);
            _super_1.prototype.onDestroy.call(this);
            //EventManager.removeEventListener(this.button_close);
        };
        ArenaSaodanResultView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            //EventManager.addTouchScaleListener(this.button_close, this, this.onclickButtonClose);
            this.m_PopUpBoard.setBottomBorder();
            this.m_nIndex = 0;
            Utils.TimerManager.doTimer(100, 0, this.onTickHandler, this);
        };
        ArenaSaodanResultView.prototype.onTickHandler = function () {
            if (this.m_nIndex >= this.data.values.length) {
                Utils.TimerManager.remove(this.onTickHandler, this);
                return;
            }
            var content = new com_main.ArenaSandangItemRender();
            content.refresh(this.data.values[this.m_nIndex]);
            this.group_rewardList.addChild(content);
            // this.group_rewardList.validateNow();
            // egret.callLater(() => {
            // if (!this.group_rewardList) return;
            // let scrollV = this.group_rewardList.contentHeight - this.m_pScroll.height;
            // scrollV = Math.max(0, scrollV);
            this.m_pScroll.scrollTo(this.group_rewardList, this.m_nIndex, true, 100);
            // this.group_rewardList.scrollV = scrollV
            // }, this);
            this.m_nIndex++;
        };
        ArenaSaodanResultView.prototype.onclickButtonClose = function () {
            com_main.UpManager.history();
        };
        ArenaSaodanResultView.prototype.refresh = function () {
            for (var _i = 0, _a = this.data.values; _i < _a.length; _i++) {
                var ArenaInfo = _a[_i];
                var content = new com_main.ArenaSandangItemRender();
                content.refresh(ArenaInfo);
                this.group_rewardList.addChild(content);
            }
        };
        ArenaSaodanResultView.NAME = 'ArenaSaodanResultView';
        return ArenaSaodanResultView;
    }(com_main.CView));
    com_main.ArenaSaodanResultView = ArenaSaodanResultView;
})(com_main || (com_main = {}));
