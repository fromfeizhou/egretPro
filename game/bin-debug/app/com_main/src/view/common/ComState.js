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
    var ComState = /** @class */ (function (_super_1) {
        __extends(ComState, _super_1);
        function ComState() {
            var _this = _super_1.call(this) || this;
            _this.name = ComState.NAME;
            return _this;
            // this.skinName = Utils.getAppSkin("common/ComStateSkin.exml")
        }
        ComState.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        ComState.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.cacheAsBitmap = true;
            this.commitProperties();
        };
        Object.defineProperty(ComState.prototype, "stateId", {
            /**设置国家id */
            get: function () {
                return this.m_nStateId;
            },
            set: function (id) {
                if (this.m_nStateId == id)
                    return;
                this.m_nStateId = id;
                this.refreshView();
            },
            enumerable: true,
            configurable: true
        });
        /**设置中立 群雄等默认字段 */
        ComState.prototype.setDefautName = function (val, size) {
            if (size === void 0) { size = 22; }
            this.m_nDefName = val;
            this.m_labName.size = size;
        };
        /**显示刷新 */
        ComState.prototype.refreshView = function () {
            switch (this.currentState) {
                case 'nor5': {
                    this.m_imgFlag.source = Utils.getCountyBigiFlagById(this.m_nStateId);
                    break;
                }
                default: {
                    var defName = this.m_nDefName ? this.m_nDefName : GCode(CLEnum.STATE_YE);
                    this.m_imgFlag.source = Utils.getCountyMiniFlagById(this.m_nStateId);
                    this.m_labName.text = Utils.getCountryName(this.m_nStateId, defName);
                    this.m_labName.textColor = Utils.getCountryColor(this.m_nStateId);
                    break;
                }
            }
        };
        ComState.NAME = 'ComState';
        return ComState;
    }(com_main.CComponent));
    com_main.ComState = ComState;
})(com_main || (com_main = {}));
