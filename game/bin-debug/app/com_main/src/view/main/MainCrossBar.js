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
    var MainCrossBar = /** @class */ (function (_super_1) {
        __extends(MainCrossBar, _super_1);
        function MainCrossBar() {
            var _this = _super_1.call(this) || this;
            _this.name = MainCrossBar.NAME;
            _this.initApp("top_new/MainCrossBarSkin.exml");
            return _this;
        }
        MainCrossBar.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        MainCrossBar.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.currentState = CrossModel.crossStatus == 4 /* WALL_WAR */ || CrossModel.crossStatus == 3 /* MATCH_SUC */ ? 'wall' : 'base';
            Utils.toStageBestScaleHeigt(this);
            this.touchEnabled = false;
            if (GameConfig.getIsNotchScreen()) {
                this.m_teamView.left += GameConfig.notchPixel;
            }
            this.m_teamView.initData(5 /* CROSS_SERVER */);
            this.initEvent();
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        MainCrossBar.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnBack, this, this.onBtnBack);
            com_main.EventManager.addTouchScaleListener(this.m_btnTeam, this, this.onBtnTeam);
            com_main.EventManager.addTouchScaleListener(this.m_btnFigthRecord, this, this.onBtnFightRecord);
            com_main.EventManager.addTouchScaleListener(this.m_btnRank, this, this.onBtnRank);
            com_main.EventManager.addTouchScaleListener(this.m_btnBuff, this, this.onBtnBuff);
            RedPointModel.AddInfoListener(this.m_btnRank, { x: 50, y: -5 }, [RedEvtType.CROSS_RANK_RY], 2);
        };
        MainCrossBar.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(SceneEvent.CHANGE_COMPLETE, this);
        };
        /**返回按钮 */
        MainCrossBar.prototype.onBtnBack = function () {
            SceneManager.runSceneBefore();
        };
        /**军团按钮 */
        MainCrossBar.prototype.onBtnTeam = function () {
            CrossModel.openArmyWnd();
        };
        /**战况按钮 */
        MainCrossBar.prototype.onBtnFightRecord = function () {
            debug('战况按钮点击');
            Utils.open_view(TASK_UI.CRSOS_SERVER_WAR_SITUTION);
        };
        /**排名按钮 */
        MainCrossBar.prototype.onBtnRank = function () {
            Utils.open_view(TASK_UI.CROSS_SERVER_RANK);
        };
        /**buff按钮 */
        MainCrossBar.prototype.onBtnBuff = function () {
            Utils.open_view(TASK_UI.CROSS_SERVER_BUFF);
        };
        MainCrossBar.NAME = 'MainCrossBar';
        return MainCrossBar;
    }(com_main.CView));
    com_main.MainCrossBar = MainCrossBar;
})(com_main || (com_main = {}));
