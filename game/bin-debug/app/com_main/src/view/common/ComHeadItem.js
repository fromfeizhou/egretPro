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
    var ComHeadItem = /** @class */ (function (_super_1) {
        __extends(ComHeadItem, _super_1);
        function ComHeadItem() {
            var _this = _super_1.call(this) || this;
            _this.name = ComHeadItem.NAME;
            return _this;
        }
        ComHeadItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        ComHeadItem.prototype.onDestroy = function () {
            this.m_headItem.onDestroy();
            _super_1.prototype.onDestroy.call(this);
        };
        ComHeadItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_headItem = ComHeadItemView.create();
            this.addChild(this.m_headItem);
            if (this.m_tInfo) {
                this.m_headItem = ComHeadItemView.create();
                this.addChild(this.m_headItem);
                this.m_headItem.info = this.m_tInfo;
            }
        };
        Object.defineProperty(ComHeadItem.prototype, "info", {
            get: function () {
                return this.m_tInfo;
            },
            set: function (val) {
                this.m_tInfo = val;
                if (this.m_headItem)
                    this.m_headItem.info = val;
            },
            enumerable: true,
            configurable: true
        });
        /**重置(纹理清理后 重新刷新ui) */
        ComHeadItem.prototype.refreshIconView = function () {
            if (this.m_headItem)
                this.m_headItem.refreshIconView();
        };
        ComHeadItem.NAME = 'ComHeadItem';
        return ComHeadItem;
    }(com_main.CComponent));
    com_main.ComHeadItem = ComHeadItem;
    var ComHeadItemView = /** @class */ (function (_super_1) {
        __extends(ComHeadItemView, _super_1);
        function ComHeadItemView() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("common/ComHeadItemSkin.exml");
            return _this;
        }
        ComHeadItemView.create = function () {
            var obj = ObjectPool.pop(com_main.ComItemNew, "com_main.ComHeadItemView");
            return obj;
        };
        /**对象池回收 */
        ComHeadItemView.prototype.onPoolClear = function () {
            this.setSkin(null);
        };
        ComHeadItemView.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        ComHeadItemView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            Utils.removeFromParent(this);
            ObjectPool.push(this);
        };
        ComHeadItemView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_imgHead.mask = this.m_imgMask;
            this.cacheAsBitmap = true;
        };
        Object.defineProperty(ComHeadItemView.prototype, "info", {
            get: function () {
                return this.m_tInfo;
            },
            set: function (val) {
                val = val ? val : { type: 1, url: '0', official: 0, vip: 0 };
                this.m_tInfo = val;
                this.refreshView();
            },
            enumerable: true,
            configurable: true
        });
        /**重置(纹理清理后 重新刷新ui) */
        ComHeadItemView.prototype.refreshIconView = function () {
            if (this.m_tInfo.url == '0')
                return;
            this.m_imgHead.source = '';
            this.m_imgHead.source = Utils.getPlayerHeadSource(this.m_tInfo.type, this.m_tInfo.url);
        };
        /**显示刷新头像 */
        ComHeadItemView.prototype.onRefreshImg = function () {
            if (this.m_tInfo.url == '0') {
                this.m_imgHead.source = 'common_smr_png';
                return;
            }
            this.m_imgHead.source = Utils.getPlayerHeadSource(this.m_tInfo.type, this.m_tInfo.url);
        };
        /**显示刷新 */
        ComHeadItemView.prototype.refreshView = function () {
            if (!this.m_tInfo)
                return;
            if (platform.isHidePayFunc())
                this.m_tInfo.vip = 0;
            this.m_imgBg.source = VipModel.getVipSrc(this.m_tInfo.vip);
            this.m_imgVip.source = VipModel.getVipLabSrc(this.m_tInfo.vip);
            var isOffic = this.m_tInfo.official && this.m_tInfo.official > 0;
            this.m_pOfficial.visible = isOffic;
            if (isOffic) {
                var name_1 = C.JobConfig[this.m_tInfo.official].name;
                this.m_labOfficial.text = GLan(name_1);
            }
            this.onRefreshImg();
        };
        return ComHeadItemView;
    }(com_main.CComponent));
    com_main.ComHeadItemView = ComHeadItemView;
})(com_main || (com_main = {}));
