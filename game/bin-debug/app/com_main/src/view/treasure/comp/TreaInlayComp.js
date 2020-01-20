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
    var TreaInlayComp = /** @class */ (function (_super_1) {
        __extends(TreaInlayComp, _super_1);
        function TreaInlayComp() {
            return _super_1.call(this) || this;
            // this.skinName = Utils.getAppSkin("treasure/comp/TreaInlayCompSkin.exml");
        }
        TreaInlayComp.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        TreaInlayComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
        };
        /**初始化界面 */
        TreaInlayComp.prototype.initView = function () {
            if (!this.m_curVo)
                return;
            this.initExStone();
            this.refreshStone();
            this.refreshSuit();
        };
        /**刷新界面 */
        TreaInlayComp.prototype.refreshView = function () {
            this.refresExStone();
            this.refreshStone();
            this.refreshSuit();
        };
        /**刷新宝石显示 */
        TreaInlayComp.prototype.refreshStone = function () {
            if (!this.m_curVo)
                return;
            for (var i = 0; i < this.m_curVo.holes.length; i++) {
                var data = this.m_curVo.holes[i];
                var item = this["m_stone" + i];
                item.setInfo(this.m_curVo, data);
            }
        };
        /**刷新套装显示 */
        TreaInlayComp.prototype.refreshSuit = function () {
            if (!this.m_curVo)
                return;
            var infos = this.m_curVo.getSuitInfos();
            var matchNum = this.m_curVo.getSuitLevel();
            //套装列表
            var suitCfg = this.m_curVo.treaCfg;
            var props = ["oneEffect", "twoEffect", "threeEffect"];
            for (var i = 0; i < 3; i++) {
                var group = this["m_groupSuit" + i];
                var labAttri = this["m_labSuitAttri" + i];
                var attriList = StringUtils.keyValsToNumberArray(suitCfg[props[i]]);
                var data = attriList[0];
                //第一个属性命中两条
                var isActivated = matchNum >= (i + 2);
                Utils.isGray(!isActivated, group);
                if (isActivated) {
                    labAttri.textColor = GameConfig.TextColors.fontWhite;
                    labAttri.textFlow = (new egret.HtmlTextParser()).parser(Utils.getAttriFormat(data));
                }
                else {
                    labAttri.textColor = GameConfig.TextColors.grayWhite;
                    labAttri.textFlow = [];
                    labAttri.text = Utils.getAttriFormat(data, true, '%s%s');
                }
            }
        };
        /**额外属性初始化 */
        TreaInlayComp.prototype.initExStone = function () {
            if (!this.m_curVo)
                return;
            for (var i = 0; i < this.m_curVo.suitInfos.length; i++) {
                var data = this.m_curVo.suitInfos[i];
                var item = this["m_stoneEx" + i];
                item.setInfo(data);
            }
            this.refresExStone();
        };
        /**刷新额外属性 */
        TreaInlayComp.prototype.refresExStone = function () {
            if (!this.m_curVo)
                return;
            var holes = this.m_curVo.holes;
            for (var i = 0; i < this.m_curVo.suitInfos.length; i++) {
                var data = this.m_curVo.suitInfos[i];
                var item = this["m_stoneEx" + i];
                var itemId = holes[i].gemstoneId;
                if (itemId > 0) {
                    var cfg = C.GemstoneConfig[itemId];
                    item.activited = cfg.type == data.type;
                }
                else {
                    item.activited = false;
                }
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        TreaInlayComp.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(TreaEvent.TREA_STONE_UPDATE, this.onStoneUpdate, this);
            com_main.EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onStarUpdate, this);
        };
        TreaInlayComp.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_STONE_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
        };
        /**升星 */
        TreaInlayComp.prototype.onStarUpdate = function (itemId) {
            if (itemId != this.m_nItemId)
                return;
            this.refreshStone();
        };
        /**宝石镶嵌 */
        TreaInlayComp.prototype.onStoneUpdate = function (itemId) {
            if (itemId != this.m_nItemId)
                return;
            this.refreshView();
        };
        return TreaInlayComp;
    }(com_main.TreaBaseComp));
    com_main.TreaInlayComp = TreaInlayComp;
})(com_main || (com_main = {}));
