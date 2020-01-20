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
     * 国战信息排行
     */
    var WorldSiegeRankView = /** @class */ (function (_super_1) {
        __extends(WorldSiegeRankView, _super_1);
        function WorldSiegeRankView(data) {
            var _this = _super_1.call(this) || this;
            _this.m_nCityId = 0;
            _this.name = WorldSiegeRankView.NAME;
            _this.m_nCityId = data.cid;
            _this.initApp("world/world_siege_rank_view.exml");
            WorldProxy.send_C2S_CITY_WAR_DMG_RANK(_this.m_nCityId);
            SoundData.setSound(_this.m_pBtnClose, SoundData.SOUND_CANCEL);
            com_main.EventManager.addTouchScaleListener(_this.m_pBtnClose, _this, function () {
                com_main.UpManager.history();
            });
            return _this;
        }
        WorldSiegeRankView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_CITY_WAR_DMG_RANK,
            ];
        };
        WorldSiegeRankView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CITY_WAR_DMG_RANK: {
                    this.m_pPlayer.initList();
                    this.m_pAlly.initList();
                    break;
                }
            }
        };
        WorldSiegeRankView.NAME = "WorldSiegeRankView";
        return WorldSiegeRankView;
    }(com_main.CView));
    com_main.WorldSiegeRankView = WorldSiegeRankView;
    var WorldSiegeRankBox = /** @class */ (function (_super_1) {
        __extends(WorldSiegeRankBox, _super_1);
        function WorldSiegeRankBox() {
            var _this = _super_1.call(this) || this;
            _this.m_pType = 0;
            _this.skinName = Utils.getSkinName("app/world/world_siege_rank_box.exml");
            return _this;
        }
        Object.defineProperty(WorldSiegeRankBox.prototype, "siegeType", {
            set: function (type) {
                this.m_pType = type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorldSiegeRankBox.prototype, "title", {
            set: function (txt) {
                var t = txt.split(","), i = 1;
                for (var _i = 0, t_1 = t; _i < t_1.length; _i++) {
                    var o = t_1[_i];
                    this["m_pLbTxt" + i].text = o;
                    i++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorldSiegeRankBox.prototype, "titleSource", {
            set: function (source) {
                this.m_pTitle.source = source;
            },
            enumerable: true,
            configurable: true
        });
        WorldSiegeRankBox.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = WorldSiegeRankItem;
            this.m_pList.useVirtualLayout = true;
        };
        WorldSiegeRankBox.prototype.initList = function () {
            var data = WorldModel.sortSiegeKill(this.m_pType), arr = [], type = this.m_pType, index = 1;
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var id = data_1[_i];
                arr.push({ id: id, type: type, index: index });
                index++;
            }
            this.m_pCollection.replaceAll(arr);
        };
        return WorldSiegeRankBox;
    }(com_main.CComponent));
    com_main.WorldSiegeRankBox = WorldSiegeRankBox;
    var WorldSiegeRankItem = /** @class */ (function (_super_1) {
        __extends(WorldSiegeRankItem, _super_1);
        function WorldSiegeRankItem() {
            var _this = _super_1.call(this) || this;
            _this.m_nIid = 0;
            _this.skinName = Utils.getSkinName("app/world/world_siege_rank_item.exml");
            return _this;
        }
        WorldSiegeRankItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        WorldSiegeRankItem.prototype.dataChanged = function () {
            if (this.m_nIid == this.data.id && !this.data.update)
                return;
            this.m_nIid = this.data.id;
            var data = WorldModel.getSiegeKill(this.data.type, this.m_nIid);
            if (!data)
                return;
            var index = this.data.index;
            RankModel.refreshRankIcon(this.m_pNum, this.m_pLbNum, index);
            this.m_pLbName.text = data.playerName;
            this.m_pLbAttack.text = CommonUtils.numOutLenght(data.num); //'' + data.num;
            this.m_comState.stateId = data.countryId;
        };
        return WorldSiegeRankItem;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
