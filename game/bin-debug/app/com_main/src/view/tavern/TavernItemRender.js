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
//招募 itemRender
var com_main;
(function (com_main) {
    var TavernItemRender = /** @class */ (function (_super_1) {
        __extends(TavernItemRender, _super_1);
        function TavernItemRender(param) {
            var _this = _super_1.call(this) || this;
            _this.m_tItemInfo = param;
            _this.skinName = Utils.getAppSkin("tavern/tavern_item_render.exml");
            return _this;
        }
        TavernItemRender.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this);
            com_main.EventManager.removeEventListener(this);
            _super_1.prototype.onDestroy.call(this);
        };
        TavernItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labPercent.visible = false;
            this.refresh();
        };
        // private ActiveEffect() {
        // 	if (TavernView.m_Anim_OutFrame)
        // 		TavernView.m_Anim_OutFrame.addBitmap(this.m_E_OutFrame);
        // 	if (TavernView.m_Anim_Top)
        // 		TavernView.m_Anim_Top.addBitmap(this.m_E_Top);
        // }
        TavernItemRender.prototype.refresh = function () {
            var cfg = C.ItemConfig[this.m_tItemInfo.itemId];
            if (cfg.mainType == PropMainType.SOUL || cfg.mainType == PropMainType.GENERAL) //道具
             {
                this.m_ComItemNew.setItemInfo(this.m_tItemInfo.itemId, this.m_tItemInfo.count);
                // if (cfg.quality >= QuaEnum.QUA_4) {
                // 	this.ActiveEffect();
                // }
            }
        };
        return TavernItemRender;
    }(com_main.CComponent));
    com_main.TavernItemRender = TavernItemRender;
})(com_main || (com_main = {}));
