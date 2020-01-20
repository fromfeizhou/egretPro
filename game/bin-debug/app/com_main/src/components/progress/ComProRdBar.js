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
     *
     * @author
     *
     */
    var ComProRdBar = /** @class */ (function (_super_1) {
        __extends(ComProRdBar, _super_1);
        function ComProRdBar() {
            return _super_1.call(this) || this;
        }
        ComProRdBar.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        ComProRdBar.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            this.m_imgPro.mask = this.m_imgMask;
            this.commitProperties();
        };
        ComProRdBar.prototype.refresh = function () {
            this.m_imgMask.width = this.m_nProgress * this.m_imgPro.width;
        };
        Object.defineProperty(ComProRdBar.prototype, "progress", {
            get: function () {
                return this.m_nProgress;
            },
            set: function (val) {
                if (this.m_nProgress == val)
                    return;
                val = Utils.MathUtils.val2Range(val, 0, 1);
                this.m_nProgress = val;
                this.refresh();
            },
            enumerable: true,
            configurable: true
        });
        return ComProRdBar;
    }(com_main.CComponent));
    com_main.ComProRdBar = ComProRdBar;
})(com_main || (com_main = {}));
