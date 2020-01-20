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
    var HistoryBattleChapter = /** @class */ (function (_super_1) {
        __extends(HistoryBattleChapter, _super_1);
        function HistoryBattleChapter() {
            var _this = _super_1.call(this) || this;
            _this.name = HistoryBattleChapter.NAME;
            return _this;
        }
        HistoryBattleChapter.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        HistoryBattleChapter.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        HistoryBattleChapter.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.InitItem();
            this.mask = this.m_bgMask;
            this.initEvent();
        };
        /** 初始化关卡组件 */
        HistoryBattleChapter.prototype.InitItem = function () {
            this._Items = [];
            for (var i = 0; i < 5; i++) {
                var Item = this["Item" + i];
                this._Items.push(Item);
            }
        };
        /**設置章節id */
        HistoryBattleChapter.prototype.setChapterInfo = function (val, copyId) {
            if (this.m_nChapterId == val)
                return;
            this.m_nChapterId = val;
            this.m_nCopyId = copyId;
            this.setChapterCfg();
        };
        Object.defineProperty(HistoryBattleChapter.prototype, "chapterId", {
            get: function () {
                return this.m_nChapterId;
            },
            enumerable: true,
            configurable: true
        });
        /** 设置章节信息 */
        HistoryBattleChapter.prototype.setChapterCfg = function () {
            if (!this.m_nChapterId)
                return;
            this._historyWarCfgs = HistoryBattleModel.getHistoryWarCfgs(this.m_nChapterId);
            this.Refresh();
        };
        /** 刷新界面 */
        HistoryBattleChapter.prototype.Refresh = function () {
            if (this._historyWarCfgs) {
                this.Refresh_BackGround();
                this.Refresh_CheckPoints();
            }
        };
        /** 刷新 - 背景图 */
        HistoryBattleChapter.prototype.Refresh_BackGround = function () {
            this.m_BackGround.source = this._historyWarCfgs[0].resMapName + "_jpg";
        };
        /** 刷新 - 关卡 */
        HistoryBattleChapter.prototype.Refresh_CheckPoints = function () {
            var cfgCnt = this._historyWarCfgs.length;
            for (var i = 0; i < cfgCnt; i++) {
                this._Items[i].SetCheckPoint(this._historyWarCfgs[i]);
            }
        };
        HistoryBattleChapter.prototype.ShowChapterInfoView = function (item) {
            var tempCfg = C.HistoryWarConfig[item.CheckPointId];
            Utils.open_view(TASK_UI.HISTORYWAR_INFO_PANEL, item.CheckPointId);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        HistoryBattleChapter.prototype.initEvent = function () {
            var _this = this;
            var _loop_1 = function (i) {
                var Item = this_1._Items[i];
                com_main.EventManager.addTouchTapListener(Item, this_1, function () { return _this.OnClickItem(Item); });
            };
            var this_1 = this;
            for (var i = 0; i < this._Items.length; i++) {
                _loop_1(i);
            }
        };
        HistoryBattleChapter.prototype.removeEvent = function () {
            for (var i = 0; i < 5; i++) {
                com_main.EventManager.removeEventListener(this._Items[i]);
            }
            com_main.EventManager.removeEventListeners(this);
        };
        /**章節信息刷新 */
        HistoryBattleChapter.prototype.onInfoUpdate = function (chapterId) {
            if (this.m_nChapterId == chapterId) {
                this.Refresh();
            }
        };
        /** 按钮事件 - 点击关卡 */
        HistoryBattleChapter.prototype.OnClickItem = function (item) {
            if (this.m_nCopyId < item.CheckPointId) {
                EffectUtils.showTips(GCode(CLEnum.MAIN_HIS_TIPS), 1, true);
                return;
            }
            this.ShowChapterInfoView(item);
        };
        HistoryBattleChapter.NAME = 'HistoryBattleChapter';
        return HistoryBattleChapter;
    }(com_main.CComponent));
    com_main.HistoryBattleChapter = HistoryBattleChapter;
})(com_main || (com_main = {}));
