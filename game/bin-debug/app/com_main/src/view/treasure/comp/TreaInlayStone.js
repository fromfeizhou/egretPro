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
     * 道具
     */
    var TreaInlayStone = /** @class */ (function (_super_1) {
        __extends(TreaInlayStone, _super_1);
        function TreaInlayStone() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("treasure/comp/TreaInlayStoneSkin.exml");
            _this.m_bIsLocked = false;
            return _this;
        }
        TreaInlayStone.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        TreaInlayStone.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**设置镶嵌孔信息uuId */
        TreaInlayStone.prototype.setStoneInfo = function (itemId, holeId) {
            this.itemId = itemId;
            this.holeId = holeId;
            this.m_labPos.text = (holeId + 1).toString();
        };
        Object.defineProperty(TreaInlayStone.prototype, "itemId", {
            get: function () {
                return this.m_pItemId;
            },
            /**设置宝物id */
            set: function (val) {
                if (this.m_pItemId == val)
                    return;
                this.m_pItemId = val;
                if (!this.m_bIsLocked)
                    this.refreshView();
            },
            enumerable: true,
            configurable: true
        });
        /**设置孔位状态 */
        TreaInlayStone.prototype.setLockedState = function (locked) {
            if (this.m_bIsLocked == locked)
                return;
            this.m_bIsLocked = locked;
            if (locked) {
                this.currentState = "lock";
                this.m_imgBg.source = "Qualitykuang2_png";
                this.commitProperties();
            }
            else {
                this.refreshView();
            }
        };
        /**是否上锁 */
        TreaInlayStone.prototype.isInLocked = function () {
            return this.m_bIsLocked;
        };
        /**刷新显示 */
        TreaInlayStone.prototype.refreshView = function () {
            if (this.m_pItemId && this.m_pItemId > 0) {
                this.currentState = "common";
                this.commitProperties();
                this.refreshIcon();
                this.refreshQualityBg();
            }
            else {
                this.currentState = "empty";
                this.commitProperties();
                this.m_imgBg.source = "Qualitykuang2_png";
            }
        };
        /**刷新图标 */
        TreaInlayStone.prototype.refreshIcon = function () {
            var image = PropModel.getPropIcon(this.m_pItemId);
            this.m_imgIcon.source = image;
        };
        /**刷新品质框 */
        TreaInlayStone.prototype.refreshQualityBg = function () {
            Utils.initPropkuang(this.m_imgBg, this.m_pItemId);
        };
        return TreaInlayStone;
    }(com_main.CComponent));
    com_main.TreaInlayStone = TreaInlayStone;
})(com_main || (com_main = {}));
