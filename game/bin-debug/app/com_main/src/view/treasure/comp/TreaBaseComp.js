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
    /** 道具 */
    var TreaBaseComp = /** @class */ (function (_super_1) {
        __extends(TreaBaseComp, _super_1);
        function TreaBaseComp() {
            return _super_1.call(this) || this;
        }
        TreaBaseComp.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        Object.defineProperty(TreaBaseComp.prototype, "itemId", {
            get: function () {
                return this.m_nItemId;
            },
            /**设置id */
            set: function (val) {
                if (this.m_nItemId == val || isNull(val))
                    return;
                this.m_nItemId = val;
                this.m_curVo = TreasureModel.getData(this.m_nItemId);
                if (!this.m_curVo)
                    this.m_curVo = TreasureModel.getPreViewVo(this.m_nItemId);
                this.initView();
            },
            enumerable: true,
            configurable: true
        });
        /**初始化界面 */
        TreaBaseComp.prototype.initView = function () {
        };
        return TreaBaseComp;
    }(com_main.CComponent));
    com_main.TreaBaseComp = TreaBaseComp;
})(com_main || (com_main = {}));
