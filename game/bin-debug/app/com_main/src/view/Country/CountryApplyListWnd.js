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
    /**城池 封地任命 */
    var CountryApplyListWnd = /** @class */ (function (_super_1) {
        __extends(CountryApplyListWnd, _super_1);
        function CountryApplyListWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = CountryApplyListWnd.NAME;
            _this.skinName = Utils.getSkinName("app/Country/CountryApplyListWndSkin.exml");
            _this._viewParam = param;
            return _this;
        }
        CountryApplyListWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.currentState = this._viewParam.curState;
            this.m_MainTopNew.setTitleName(this._viewParam.titleName);
            Utils.toStageBestScaleHeigt(this.m_pRoot);
            this.InitDataArray();
        };
        CountryApplyListWnd.prototype.InitDataArray = function () {
            var _this = this;
            this._dataArray = new eui.ArrayCollection;
            this._viewParam.ApplyList.forEach(function (element) {
                // if(!CountryModel.IsKing(element.playerId) && !CountryModel.IsSelf(element.playerId)){
                _this._dataArray.addItem({ playerInfo: element, btnName: _this._viewParam.btnName, state: _this.currentState });
                // }
            });
            this.m_ItemList.dataProvider = this._dataArray;
            this.m_ItemList.itemRenderer = com_main.CountryApplyItem;
        };
        CountryApplyListWnd.NAME = 'CountryApplyListWnd';
        return CountryApplyListWnd;
    }(com_main.CView));
    com_main.CountryApplyListWnd = CountryApplyListWnd;
})(com_main || (com_main = {}));
