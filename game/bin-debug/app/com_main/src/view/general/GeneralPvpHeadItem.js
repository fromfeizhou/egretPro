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
    var GeneralPvpHeadItem = /** @class */ (function (_super_1) {
        __extends(GeneralPvpHeadItem, _super_1);
        function GeneralPvpHeadItem(state) {
            if (state === void 0) { state = "arena_base"; }
            var _this = _super_1.call(this) || this;
            _this.width = 121;
            _this.height = 117;
            _this.m_state = state;
            return _this;
        }
        GeneralPvpHeadItem.prototype.$onRemoveFromStage = function () {
            if (this.m_tItem) {
                this.m_tItem.onDestroy();
                this.m_tItem = null;
            }
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        GeneralPvpHeadItem.prototype.createChildren = function () {
            _super_1.prototype.createChildren.call(this);
            this.m_tItem = com_main.GeneralHeadRender.create(this.m_state);
            this.addChild(this.m_tItem);
        };
        GeneralPvpHeadItem.prototype.setGenId = function (id) {
            this.m_tItem.setGenId(id);
        };
        /**设置武将信息 */
        GeneralPvpHeadItem.prototype.setGeneralArena = function (vo, simpleData) {
            if (vo) {
                this.m_tItem.setViewState("arena");
                this.m_tItem.m_pLbLv.text = vo.level + "";
                this.m_tItem.setGenViewInfo(vo.generalId, vo.level, vo.star, vo.quality);
            }
            else {
                if (simpleData) {
                    this.m_tItem.setViewState("arena");
                    this.m_tItem.m_pLbLv.text = simpleData.level + "";
                    this.m_tItem.setGenViewInfo(simpleData.generalId, simpleData.level, simpleData.star, simpleData.quality);
                }
                else {
                    this.m_tItem.setViewState("arena_base");
                    this.m_tItem.Image_head.source = "icon_wj_0_png";
                }
            }
        };
        return GeneralPvpHeadItem;
    }(com_main.CComponent));
    com_main.GeneralPvpHeadItem = GeneralPvpHeadItem;
})(com_main || (com_main = {}));
