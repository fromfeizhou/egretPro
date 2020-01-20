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
    var WorldSearchAwardWnd = /** @class */ (function (_super_1) {
        __extends(WorldSearchAwardWnd, _super_1);
        function WorldSearchAwardWnd(id) {
            var _this = _super_1.call(this) || this;
            _this.m_nEvtId = 0;
            _this.m_nEvtId = id;
            _this.name = WorldSearchAwardWnd.NAME;
            _this.initApp("world/world_search_award.exml");
            return _this;
        }
        WorldSearchAwardWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var vo = WorldModel.getEventVoByPosId(this.m_nEvtId);
            var award = Utils.parseCommonItemJson(vo.getReward());
            for (var i = 0; i < award.length; i++) {
                var item = com_main.ComItemNew.create("name");
                NodeUtils.setScale(item, 0.8);
                item.setItemInfo(award[i].itemId, award[i].count);
                this.m_pAwardRoot.addChild(item);
            }
        };
        WorldSearchAwardWnd.NAME = 'TipsNorWnd';
        return WorldSearchAwardWnd;
    }(com_main.CView));
    com_main.WorldSearchAwardWnd = WorldSearchAwardWnd;
})(com_main || (com_main = {}));
