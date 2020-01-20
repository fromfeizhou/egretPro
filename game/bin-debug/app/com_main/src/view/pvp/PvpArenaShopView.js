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
     * pvp战报面板相关
     */
    var PvpArenaShopView = /** @class */ (function (_super_1) {
        __extends(PvpArenaShopView, _super_1);
        function PvpArenaShopView() {
            var _this = _super_1.call(this) || this;
            _this.SHOPITEMMAXCOUNT = 10;
            _this.name = PvpArenaShopView.NAME;
            _this.initApp("pvp_arena/PvpArenaShopViewSkin.exml");
            _this.shopItemList = [];
            return _this;
        }
        PvpArenaShopView.prototype.listenerProtoNotifications = function () {
            return [
            //ProtoDef.MISSION_ACTIVE_REWAED,
            // ProtoDef.MISSION_ACTIVE_INFO,
            ];
        };
        /**处理协议号事件 */
        PvpArenaShopView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        PvpArenaShopView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        PvpArenaShopView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initView();
        };
        PvpArenaShopView.prototype.initView = function () {
            this.updateView();
        };
        PvpArenaShopView.prototype.updateView = function () {
            var _this = this;
            var tempData = [1, 2, 3, 4, 5, 7, 8, 9, 13, 14];
            var i = 0;
            for (; i < tempData.length; i++) {
                if (this.shopItemList.length <= i) {
                    var tempItem = new com_main.PvpArenaShopCell(tempData[i]);
                    tempItem.onClickCell = function (id) {
                        _this.onBuy(id);
                    };
                    this.m_pShopItemRoot.addChild(tempItem);
                    this.shopItemList.push(tempItem);
                }
                else {
                    this.shopItemList[i].updateView(tempData[i]);
                }
            }
            for (; i < this.shopItemList.length; i++) {
                this.shopItemList[i].visible = false;
            }
        };
        PvpArenaShopView.prototype.onBuy = function (id) {
            error(id + "==========================");
        };
        PvpArenaShopView.NAME = 'PvpArenaShopView';
        return PvpArenaShopView;
    }(com_main.CView));
    com_main.PvpArenaShopView = PvpArenaShopView;
})(com_main || (com_main = {}));
