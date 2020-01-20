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
    var CrossServerWarNameComp = /** @class */ (function (_super_1) {
        __extends(CrossServerWarNameComp, _super_1);
        function CrossServerWarNameComp() {
            var _this = _super_1.call(this) || this;
            _this.m_buildId = 0;
            _this.skinName = Utils.getAppSkin("cross/component/CrossServerWarNameCompSkin.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        CrossServerWarNameComp.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        Object.defineProperty(CrossServerWarNameComp.prototype, "bId", {
            set: function (id) {
                this.m_buildId = id;
                this.refreshCityName();
                this.refreshCityState();
            },
            enumerable: true,
            configurable: true
        });
        CrossServerWarNameComp.prototype.refreshCityName = function () {
            this.m_cityName.text = GLan(C.CrossServerAreaConfig[this.m_buildId].name);
        };
        CrossServerWarNameComp.prototype.refreshCityState = function () {
            var data = CrossModel.getCityInfoById(this.m_buildId);
            if (data) {
                var faction = data.getFaction();
                if (faction == CSBFaction.EMENY) {
                    this.m_flagImg.source = 'zyt_vs_red_png';
                    this.m_faction.strokeColor = 0x961717;
                    this.m_faction.text = '敌';
                    this.m_flagImg.visible = true;
                    this.m_faction.visible = true;
                }
                else if (faction == CSBFaction.OUR) {
                    this.m_flagImg.source = 'zyt_vs_blue_png';
                    this.m_faction.strokeColor = 0x173e96;
                    this.m_faction.text = '我';
                    this.m_flagImg.visible = true;
                    this.m_faction.visible = true;
                }
                else if (faction == CSBFaction.NONE) {
                    this.m_flagImg.visible = false;
                    this.m_faction.visible = false;
                }
            }
        };
        return CrossServerWarNameComp;
    }(com_main.CComponent));
    com_main.CrossServerWarNameComp = CrossServerWarNameComp;
})(com_main || (com_main = {}));
