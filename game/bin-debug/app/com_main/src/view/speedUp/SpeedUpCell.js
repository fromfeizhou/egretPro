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
    var SpeedUpCell = /** @class */ (function (_super_1) {
        __extends(SpeedUpCell, _super_1);
        function SpeedUpCell(data, selectState) {
            var _this = _super_1.call(this) || this;
            _this.propId = 0;
            _this.propId = data;
            _this.selectState = selectState;
            _this.skinName = Utils.getSkinName("app/speed_up/SpeedUpCellSkin.exml");
            return _this;
        }
        Object.defineProperty(SpeedUpCell.prototype, "PropId", {
            get: function () {
                return this.propId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SpeedUpCell.prototype, "SelectState", {
            set: function (isShow) {
                if (this.m_pSelectState)
                    this.m_pSelectState.visible = isShow;
            },
            enumerable: true,
            configurable: true
        });
        SpeedUpCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.SelectState = this.selectState;
            this.setPropInfo(this.propId);
            this.initEvent();
        };
        SpeedUpCell.prototype.initEvent = function () {
            com_main.EventManager.addTouchTapListener(this, this, this.onClickCell);
        };
        SpeedUpCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        SpeedUpCell.prototype.onClickCell = function () {
            if (this.onClick) {
                this.onClick(this);
            }
        };
        SpeedUpCell.prototype.setPropInfo = function (infoId) {
            this.propId = infoId;
            this.updateCell();
        };
        SpeedUpCell.prototype.updateCell = function () {
            var baseCfg = C.ItemConfig[this.propId];
            var propCfg = C.QuickenConfig[this.propId];
            this.m_pLbName.text = GLan(baseCfg.name);
            this.m_pLbNum.text = PropModel.getPropNum(this.propId) + ""; // this.propInfo.count + "";
            this.m_pLbTime.text = Utils.DateUtils.timeToText(propCfg.reduceTime);
            this.m_pItem.setItemInfo(this.propId);
        };
        return SpeedUpCell;
    }(com_main.CComponent));
    com_main.SpeedUpCell = SpeedUpCell;
})(com_main || (com_main = {}));
