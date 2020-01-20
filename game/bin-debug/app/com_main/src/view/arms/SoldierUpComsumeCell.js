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
    var SoldierUpComsumeCell = /** @class */ (function (_super_1) {
        __extends(SoldierUpComsumeCell, _super_1);
        function SoldierUpComsumeCell() {
            var _this = _super_1.call(this) || this;
            _this.touchChildren = true;
            return _this;
            // this.skinName = Utils.getSkinName("app/soldier/SoldierUpComsumeCellSkin.exml");
        }
        SoldierUpComsumeCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        SoldierUpComsumeCell.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        SoldierUpComsumeCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            if (this.data) {
                this.m_Icon.source = this.data.icon;
                this.m_CurParm.text = this.data.curParm;
                this.m_CurAtt.text = this.data.curAtt;
                this.m_PreAtt.text = this.data.preAtt;
            }
        };
        return SoldierUpComsumeCell;
    }(eui.ItemRenderer));
    com_main.SoldierUpComsumeCell = SoldierUpComsumeCell;
})(com_main || (com_main = {}));
