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
     * 襄阳战（帝位争夺）
     * 1.预告UI Advance
     * 2.战况UI Details
     * 3.城池信息UI CityInfo
     * 4.皇帝登基弹出公告UI Coronation
     * 5.说明文本
     * 6.排行榜 Rank
     */
    var EmperorBattleView = /** @class */ (function (_super_1) {
        __extends(EmperorBattleView, _super_1);
        function EmperorBattleView() {
            return _super_1 !== null && _super_1.apply(this, arguments) || this;
        }
        return EmperorBattleView;
    }(com_main.CView));
    com_main.EmperorBattleView = EmperorBattleView;
})(com_main || (com_main = {}));
