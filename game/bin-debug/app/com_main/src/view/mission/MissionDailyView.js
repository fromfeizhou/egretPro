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
    var MissionDailyView = /** @class */ (function (_super_1) {
        __extends(MissionDailyView, _super_1);
        function MissionDailyView(type, width, height) {
            return _super_1.call(this, type, width, height, Utils.getAppSkin("mission/MissionDailyViewSkin.exml")) || this;
        }
        MissionDailyView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        MissionDailyView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var list = MissionModel.getActiveInfoList();
            for (var i = 1; i <= 5; i++) {
                var item = this["m_itemcell" + i];
                var info = list[i];
                if (info) {
                    var cfg = C.LivesRewardConfig[info.id];
                    item.x = 112 + cfg.liveness / MissionModel.LIVENESS_MAX * MissionDailyView.PRO_MAX - 30;
                    item.init(info.id);
                }
            }
            this.refreshView();
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        //活跃度刷新
        MissionDailyView.prototype.refreshView = function () {
            for (var i = 1; i <= 5; i++) {
                var item = this["m_itemcell" + i];
                item.updateCell();
            }
            var curVal = MissionModel.getCurActiveNum();
            var rate = curVal / MissionModel.LIVENESS_MAX;
            rate = Math.min(rate, 1);
            this.m_imgProcess.width = rate * MissionDailyView.PRO_MAX;
            this.m_labActivite.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TASK_ACTIVITY_NUM, curVal));
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        MissionDailyView.prototype.addEvent = function () {
            _super_1.prototype.addEvent.call(this);
            com_main.EventMgr.addEvent(MissionEvent.MISSION_UPDATE_LIVENESS, this.onUpdateLiveness, this);
        };
        MissionDailyView.prototype.removeEvent = function () {
            _super_1.prototype.removeEvent.call(this);
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_LIVENESS, this);
        };
        /**活跃度刷新 */
        MissionDailyView.prototype.onUpdateLiveness = function () {
            this.refreshView();
        };
        MissionDailyView.NAME = 'MissionDailyView';
        MissionDailyView.PRO_MAX = 940;
        return MissionDailyView;
    }(com_main.MissionNorView));
    com_main.MissionDailyView = MissionDailyView;
})(com_main || (com_main = {}));
