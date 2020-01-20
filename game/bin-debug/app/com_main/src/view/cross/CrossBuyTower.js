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
/**
 * 建造箭塔
 */
var com_main;
(function (com_main) {
    var CrossBuyTowerView = /** @class */ (function (_super_1) {
        __extends(CrossBuyTowerView, _super_1);
        function CrossBuyTowerView(bId) {
            var _this = _super_1.call(this) || this;
            _this.name = CrossBuyTowerView.NAME;
            _this.m_bId = bId;
            _this.initApp("cross/CrossBuyTowerSkin.exml");
            return _this;
        }
        CrossBuyTowerView.prototype.onDestroy = function () {
        };
        CrossBuyTowerView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
            this.m_apopUp.setTitleLabel('建筑箭塔');
            var cityInfo = CrossModel.getCityInfoById(this.m_bId);
            if (cityInfo) {
                this.initInfo(0, cityInfo.towerNum[0]);
                this.initInfo(1, cityInfo.towerNum[1]);
            }
            this.addTowerAni();
        };
        CrossBuyTowerView.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_btnbuy0, this, this.onclickBuy0);
            com_main.EventManager.addTouchTapListener(this.m_btnbuy1, this, this.onclickBuy1);
        };
        CrossBuyTowerView.prototype.addTowerAni = function () {
            for (var i = 0; i <= 1; i++) {
                var square = com_main.CSquare.createId(3008, false, true);
                square.test = true;
                this['m_modelGroup' + i].addChild(square);
                square.changeStatus(CSquare_Status.STATUS_STAND);
                square.x = 75;
                square.y = 145;
            }
        };
        CrossBuyTowerView.prototype.initInfo = function (index, boo) {
            this['m_btnbuy' + index].visible = !boo;
            this['m_lbBuilded' + index].visible = boo;
        };
        CrossBuyTowerView.prototype.onclickBuy0 = function (e) {
            CrossProxy.send_C2S_CROSS_SERVER_BUY_TOWER(this.m_bId, 0);
        };
        CrossBuyTowerView.prototype.onclickBuy1 = function (e) {
            CrossProxy.send_C2S_CROSS_SERVER_BUY_TOWER(this.m_bId, 1);
        };
        CrossBuyTowerView.NAME = 'CrossBuyTowerView';
        return CrossBuyTowerView;
    }(com_main.CView));
    com_main.CrossBuyTowerView = CrossBuyTowerView;
})(com_main || (com_main = {}));
