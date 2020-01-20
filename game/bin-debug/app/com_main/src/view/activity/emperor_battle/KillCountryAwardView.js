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
     * 国家排行奖励
     */
    var KillCountryAwardView = /** @class */ (function (_super_1) {
        __extends(KillCountryAwardView, _super_1);
        function KillCountryAwardView(width, height) {
            var _this = _super_1.call(this) || this;
            _this.name = KillCountryAwardView.NAME;
            // this.width = width;
            // this.height = height;
            _this.initApp("activity/emperorBattle/rankReward/CountryAwardRankViewSkin.exml");
            return _this;
        }
        KillCountryAwardView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        KillCountryAwardView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        KillCountryAwardView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            Utils.toStageBestScaleHeigt(this);
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_pRankList.itemRenderer = com_main.CountryAwardRankCell;
            this.m_pRankList.dataProvider = this.m_tCollections;
            this.Refresh();
        };
        /**刷新页面 */
        KillCountryAwardView.prototype.Refresh = function () {
            this.Refresh_ItemDatas();
        };
        /**刷新排行榜列表数据 */
        KillCountryAwardView.prototype.Refresh_ItemDatas = function () {
            var vo = ActivityModel.getActivityVo(AcViewType.XIANGYANG);
            if (isNull(vo))
                return;
            var list = vo.getCountryAwardList();
            if (isNull(list))
                return;
            list.sort(function (a, b) {
                return b.value - a.value;
            });
            var awardRankList = [];
            for (var i = 0; i < list.length; i++) {
                list[i]["rank"] = i + 1;
                awardRankList.push(list[i]);
            }
            this.m_tCollections.replaceAll(awardRankList);
        };
        KillCountryAwardView.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        KillCountryAwardView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        KillCountryAwardView.NAME = 'KillCountryAwardView';
        return KillCountryAwardView;
    }(com_main.CView));
    com_main.KillCountryAwardView = KillCountryAwardView;
})(com_main || (com_main = {}));
