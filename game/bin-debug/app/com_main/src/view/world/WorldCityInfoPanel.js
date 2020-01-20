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
     * 城池详细信息
     */
    var WorldCityInfoPanel = /** @class */ (function (_super_1) {
        __extends(WorldCityInfoPanel, _super_1);
        function WorldCityInfoPanel(conf) {
            var _this = _super_1.call(this) || this;
            _this.m_nCityId = 0;
            _this.name = WorldCityInfoPanel.NAME;
            _this.m_pConfig = conf;
            _this.m_nCityId = conf.id;
            _this.initApp("world/world_city_info_panel.exml");
            return _this;
        }
        Object.defineProperty(WorldCityInfoPanel.prototype, "config", {
            get: function () {
                return WorldModel.getCityConfig(this.m_nCityId);
            },
            enumerable: true,
            configurable: true
        });
        WorldCityInfoPanel.prototype.listenerProtoNotifications = function () {
            return [];
        };
        WorldCityInfoPanel.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        WorldCityInfoPanel.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this.m_pBtnClose);
            com_main.EventManager.removeEventListener(this.m_pBtnInfo);
        };
        WorldCityInfoPanel.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            var conf = this.config, config = WorldModel.getCityBuildInfo(this.m_nCityId);
            this.m_pLbName.text = GLan(conf.name);
            // let emeny = JSON.parse(conf.combat)
            this.m_pLbNum.text = "" + config.playerGarrisonCount;
            var playInfo = CountryModel.getCityPlayerInfoByCityId(this.m_nCityId);
            var playerHead = playInfo ? playInfo.roleHead : null;
            // this.m_pLbPlayerName.visible = playInfo != null
            var name = playInfo ? playInfo.name : GCode(CLEnum.NONE);
            this.m_pLbPlayerName.text = GCode(CLEnum.WOR_BD_TS) + name;
            // { type: info.type, url: info.url, vip: info.vip, official: info.official };
            var headInfo = playerHead ? { type: 0, url: playerHead.toString(), official: 0, vip: 0 } : null;
            this.comHead.info = headInfo;
            this.m_pLbLevel.text = "" + (this.m_pConfig.initCityLv = this.m_pConfig ? this.m_pConfig.initCityLv : 0);
            this.m_pLbContent.text = GLan(conf.description);
            this.m_comState.stateId = config.country;
            com_main.EventManager.addTouchScaleListener(this.m_pBtnClose, this, function () {
                com_main.UpManager.history();
            });
            com_main.EventManager.addTouchScaleListener(this.m_pBtnInfo, this, function () {
                // UpManager.history();
                // Utils.open_view(TASK_UI.POP_WORLD_RULE_PANEL);
                // WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
                var conf = C.WorldMapConfig[_this.m_nCityId];
                var cityId = conf.type == CityType.XIANG_BIRTH ? conf.mapCity : _this.m_nCityId;
                WorldProxy.C2S_CITY_ITEM_INFO(cityId);
            });
            this.__init_list();
        };
        WorldCityInfoPanel.prototype.__init_list = function () {
            if (this.config.reward) {
                var award = Utils.parseCommonItemJson(this.config.reward);
                for (var _i = 0, award_1 = award; _i < award_1.length; _i++) {
                    var itemInfo = award_1[_i];
                    var item = com_main.ComItemNew.create('count');
                    item.scaleX = 0.8;
                    item.scaleY = 0.8;
                    this.m_pGScroller.addChild(item);
                    item.setItemInfo(itemInfo.itemId, itemInfo.count);
                }
            }
        };
        WorldCityInfoPanel.NAME = "WorldCityInfoPanel";
        return WorldCityInfoPanel;
    }(com_main.CView));
    com_main.WorldCityInfoPanel = WorldCityInfoPanel;
    var WorldCityInfoItem = /** @class */ (function (_super_1) {
        __extends(WorldCityInfoItem, _super_1);
        function WorldCityInfoItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/world/world_city_info_item.exml");
            return _this;
        }
        WorldCityInfoItem.prototype.onDestroy = function () {
        };
        WorldCityInfoItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        WorldCityInfoItem.prototype.dataChanged = function () {
            if (!this.data)
                return;
            var _a = this.data, _ = _a[0], id = _a[1], num = _a[2];
            var conf = C.ItemConfig[id];
            if (!conf)
                return;
            this.m_pLbName.text = GLan(conf.name);
            this.m_pLbNum.text = "X " + num;
            this.m_pItem.setItemInfo(id);
        };
        return WorldCityInfoItem;
    }(eui.ItemRenderer));
    com_main.WorldCityInfoItem = WorldCityInfoItem;
})(com_main || (com_main = {}));
