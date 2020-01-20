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
     * 基础组件
     */
    var EquipBaseComp = /** @class */ (function (_super_1) {
        __extends(EquipBaseComp, _super_1);
        function EquipBaseComp() {
            return _super_1.call(this) || this;
        }
        EquipBaseComp.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        EquipBaseComp.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        Object.defineProperty(EquipBaseComp.prototype, "generalId", {
            get: function () {
                return this.m_nGeneralId;
            },
            /**设置武将id */
            set: function (val) {
                if (this.m_nGeneralId == val)
                    return;
                this.m_nGeneralId = val;
                this.clearView();
                this.initView();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EquipBaseComp.prototype, "equipPos", {
            get: function () {
                return this.m_nEquipPos;
            },
            /**设置装备格子 */
            set: function (val) {
                if (this.m_nEquipPos == val)
                    return;
                this.m_nEquipPos = val;
                this.refreshView();
            },
            enumerable: true,
            configurable: true
        });
        /**清理显示 */
        EquipBaseComp.prototype.clearView = function () {
        };
        /**初始化显示 */
        EquipBaseComp.prototype.initView = function () {
        };
        /**刷新显示 */
        EquipBaseComp.prototype.refreshView = function () {
        };
        return EquipBaseComp;
    }(com_main.CComponent));
    com_main.EquipBaseComp = EquipBaseComp;
})(com_main || (com_main = {}));
