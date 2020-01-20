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
     * 道具
     */
    var TurnplateMaterialCell = /** @class */ (function (_super_1) {
        __extends(TurnplateMaterialCell, _super_1);
        function TurnplateMaterialCell(id) {
            var _this = _super_1.call(this) || this;
            _this.CLICKMAXCOUNT = 3;
            _this.m_pClickCount = 0;
            if (id)
                _this.m_pItemId = id;
            _this.skinName = Utils.getAppSkin("turnplate/TurnplateMaterialCellSkin.exml");
            return _this;
        }
        TurnplateMaterialCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this);
            _super_1.prototype.onDestroy.call(this);
        };
        TurnplateMaterialCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pItem.openTips = false;
            if (this.m_pItemId)
                this.setCellId(this.m_pItemId);
            com_main.EventManager.addTouchTapListener(this, this, this.onClick);
        };
        TurnplateMaterialCell.prototype.setCellId = function (id) {
            this.m_pItemId = id;
            this.m_pItem.setItemInfo(id);
            this.setSelectState();
            this.m_pCfg = C.TurnTableConfig[id];
            if (this.m_pCfg)
                this.updateCell();
            else
                error("data is not Find");
        };
        TurnplateMaterialCell.prototype.updateCell = function () {
            this.setAddtionStr();
            this.setCost();
            this.setFreeOrCancelState();
            this.setSelectState();
        };
        TurnplateMaterialCell.prototype.setAddtionStr = function () {
            if (this.m_pCfg) {
                var addtion = "0";
                var costCfg = TurnplateModel.getTurnCostType(this.m_pCfg.type, this.m_pClickCount);
                if (costCfg) {
                    addtion = costCfg.percent;
                }
                else {
                    addtion = "0";
                }
                this.m_pLbAddtion.text = "+" + addtion + "%";
            }
        };
        TurnplateMaterialCell.prototype.setFreeOrCancelState = function () {
            var showCost = true;
            var tempStr = "";
            if (this.m_pClickCount == this.CLICKMAXCOUNT) {
                showCost = false;
                tempStr = GCode(CLEnum.CANCEL);
            }
            else {
                showCost = this.m_pCfg.type != 1;
                tempStr = showCost ? "" : GCode(CLEnum.AC_FREE);
            }
            this.m_pCostRoot.visible = showCost;
            this.m_pCostStr.text = tempStr;
        };
        TurnplateMaterialCell.prototype.setSelectState = function () {
            this.m_pSelectState.visible = this.m_pClickCount > 0;
        };
        TurnplateMaterialCell.prototype.onClick = function (e) {
            if (this.onClickHandler) {
                this.onClickHandler(this);
            }
        };
        //点击有效
        TurnplateMaterialCell.prototype.onClickSuccess = function () {
            this.m_pClickCount = ++this.m_pClickCount % (this.CLICKMAXCOUNT + 1);
            this.updateCell();
        };
        //金币总量
        TurnplateMaterialCell.prototype.setCost = function () {
            var costCfg = TurnplateModel.getTurnCostType(this.m_pCfg.type, this.m_pClickCount + 1);
            if (costCfg) {
                var pArr = JSON.parse(costCfg.cost);
                this.m_pLbCost.text = pArr[2];
            }
        };
        TurnplateMaterialCell.prototype.getCurCostNum = function () {
            var tempNum = 0;
            for (var i = 0; i <= this.m_pClickCount; i++) {
                var costCfg = TurnplateModel.getTurnCostType(this.m_pCfg.type, i);
                if (costCfg) {
                    var pArr = JSON.parse(costCfg.cost);
                    tempNum += Number(pArr[2]);
                }
            }
            return tempNum;
        };
        TurnplateMaterialCell.prototype.getItemId = function () {
            return this.m_pItemId;
        };
        TurnplateMaterialCell.prototype.getClickNum = function () {
            return this.m_pClickCount;
        };
        return TurnplateMaterialCell;
    }(com_main.CComponent));
    com_main.TurnplateMaterialCell = TurnplateMaterialCell;
})(com_main || (com_main = {}));
