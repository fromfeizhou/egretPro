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
     * 排行榜主界面
     */
    var RankListPage = /** @class */ (function (_super_1) {
        __extends(RankListPage, _super_1);
        function RankListPage(type) {
            var _this = _super_1.call(this) || this;
            _this.name = RankListPage.NAME;
            _this.initType(type);
            _this.skinName = Utils.getSkinName("app/rank/rank_list_page.exml");
            return _this;
        }
        RankListPage.prototype.initType = function (type) {
            this.m_nType = type;
            switch (this.m_nType) {
                case RankType.PLAYER: {
                    this.currentState = 'power';
                    break;
                }
                case RankType.GENREAL:
                case RankType.ONEHERO: {
                    this.currentState = 'general';
                    break;
                }
                case RankType.LEGION: {
                    this.currentState = 'legion';
                    break;
                }
                case RankType.MILLTORY: {
                    this.currentState = 'militory';
                    break;
                }
                case RankType.COUNTRY: {
                    this.currentState = 'country';
                    break;
                }
            }
            this.validateNow();
        };
        RankListPage.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        RankListPage.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        RankListPage.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            Utils.toStageBestScaleHeigt(this);
            this.m_tCollection = new eui.ArrayCollection();
            this.m_ItemList.itemRenderer = com_main.RankItemRender;
            this.m_ItemList.dataProvider = this.m_tCollection;
        };
        RankListPage.prototype.Refresh = function () {
            switch (this.m_nType) {
                case RankType.PLAYER: {
                    this.refreshPower();
                    break;
                }
                case RankType.GENREAL: {
                    this.refreshGeneral();
                    break;
                }
                case RankType.ONEHERO: {
                    this.refreshGeneralSingle();
                    break;
                }
                case RankType.LEGION: {
                    this.refreshLegion();
                    break;
                }
                case RankType.COUNTRY: {
                    this.refreshCountry();
                    break;
                }
            }
        };
        /**刷新战力 */
        RankListPage.prototype.refreshPower = function () {
            var _a = RankModel.getNormalData(RankType.PLAYER), list = _a[0], owner = _a[1];
            if (list) {
                var res = [];
                for (var i = 0; i < list.length; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: 0 });
                }
                this.m_tCollection.replaceAll(res);
                if (owner) {
                    this.m_ownerItem.visible = true;
                    this.m_ownerItem.data = { type: this.m_nType, param: owner };
                    this.m_ownerItem.refreshMobi(false);
                    return;
                }
            }
            this.m_ownerItem.visible = true;
            var fight = GeneralModel.getGeneralTotalFight();
            this.m_ownerItem.data = { type: this.m_nType, param: { rank: -1, value: fight, playerHead: { type: RoleData.headType, url: RoleData.headId.toString(), playerName: RoleData.nickName, countryId: RoleData.countryId, vip: RoleData.vipLevel } } };
            this.m_ownerItem.refreshMobi(false);
        };
        /**刷新武将 */
        RankListPage.prototype.refreshGeneral = function () {
            var list = RankModel.getGenRankData();
            if (list) {
                var res = [];
                for (var i = 0; i < list.length; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: 0 });
                }
                this.m_tCollection.replaceAll(res);
            }
        };
        /**刷新武将单个 */
        RankListPage.prototype.refreshGeneralSingle = function () {
            var list = RankModel.getGenSingleRankData();
            if (list) {
                var res = [];
                for (var i = 0; i < list.length; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: 0 });
                }
                this.m_tCollection.replaceAll(res);
            }
        };
        /**刷新联盟 */
        RankListPage.prototype.refreshLegion = function () {
            var _a = RankModel.getLegionRankData(), list = _a[0], owner = _a[1];
            if (list) {
                var res = [];
                for (var i = 0; i < list.length; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: 0 });
                }
                this.m_tCollection.replaceAll(res);
                if (owner) {
                    this.m_ownerItem.visible = true;
                    this.validateNow();
                    this.m_ownerItem.data = { type: this.m_nType, param: owner };
                    return;
                }
            }
            this.m_ownerItem.visible = false;
        };
        /**刷新国家 */
        RankListPage.prototype.refreshCountry = function () {
            var list = RankModel.getCountryRankData();
            if (list) {
                var res = [];
                for (var i = 0; i < list.length; i++) {
                    res.push({ type: this.m_nType, param: list[i], rank: i + 1 });
                }
                this.m_tCollection.replaceAll(res);
            }
            this.m_ownerItem.visible = false;
        };
        RankListPage.NAME = "RankListPage";
        return RankListPage;
    }(com_main.CComponent));
    com_main.RankListPage = RankListPage;
})(com_main || (com_main = {}));
