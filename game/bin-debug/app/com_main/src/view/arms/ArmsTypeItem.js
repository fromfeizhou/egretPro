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
    var ArmsTypeItem = /** @class */ (function (_super_1) {
        __extends(ArmsTypeItem, _super_1);
        function ArmsTypeItem() {
            var _this = _super_1.call(this) || this;
            _this.m_bSelected = true;
            _this.skinName = Utils.getAppSkin("arms/ArmsTypeItem.exml");
            return _this;
        }
        Object.defineProperty(ArmsTypeItem.prototype, "type", {
            get: function () {
                return this.m_nType;
            },
            set: function (type) {
                switch (type) {
                    case SoldierMainType.FOOTSOLDIER: {
                        this.m_imgArms.source = "junbei_daobing_png";
                        this.m_imgName.source = "lb_daobing_png";
                        break;
                    }
                    case SoldierMainType.ARROWSOLDIER: {
                        this.m_imgArms.source = "junbei_gongbing_png";
                        this.m_imgName.source = "lb_gongbing_png";
                        break;
                    }
                    case SoldierMainType.RIDESOLDIER: {
                        this.m_imgArms.source = "junbei_qibing_png";
                        this.m_imgName.source = "lb_qibing_png";
                        break;
                    }
                    case SoldierMainType.PIKEMAN: {
                        this.m_imgArms.source = "junbei_qiangbing_png";
                        this.m_imgName.source = "lb_qiangbing_png";
                        break;
                    }
                }
                this.m_nType = type;
            },
            enumerable: true,
            configurable: true
        });
        ArmsTypeItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ArmsTypeItem.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this);
            egret.Tween.removeTweens(this.m_imgArms);
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        ArmsTypeItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        };
        ArmsTypeItem.prototype.setSelect = function (selected) {
            if (this.m_bSelected == selected)
                return;
            this.m_imgSelect.visible = selected;
            this.m_bSelected = selected;
        };
        /**位移缓动 */
        ArmsTypeItem.prototype.doAction = function (tx, tScale, alpha, isAction) {
            var _this = this;
            egret.Tween.removeTweens(this);
            egret.Tween.removeTweens(this.m_imgArms);
            this.m_imgSelect.visible = false;
            if (isAction) {
                var tw = egret.Tween.get(this);
                tw.wait(30);
                tw.to({ x: tx, scaleX: tScale, scaleY: tScale, alpha: alpha }, 300, egret.Ease.cubicOut);
                tw.call(function () {
                    _this.setEndState(tx, tScale, alpha);
                }, this);
            }
            else {
                this.setEndState(tx, tScale, alpha);
            }
        };
        /**结束状态 */
        ArmsTypeItem.prototype.setEndState = function (tx, tScale, alpha) {
            var _a;
            this.x = tx;
            this.alpha = alpha;
            NodeUtils.setScale(this, tScale);
            this.m_imgSelect.visible = tScale == 1;
            this.visible = tScale != 0.5;
            //新手引导条件触发
            var typeIds = (_a = {},
                _a[SoldierMainType.ARROWSOLDIER] = IGUIDECD.ARMY_TAB_BB,
                _a[SoldierMainType.FOOTSOLDIER] = IGUIDECD.ARMY_TAB_GB,
                _a[SoldierMainType.RIDESOLDIER] = IGUIDECD.ARMY_TAB_QB,
                _a[SoldierMainType.PIKEMAN] = IGUIDECD.ARMY_TAB_QIANB,
                _a);
            this.onGuideConditionTab(typeIds[this.m_nType]);
        };
        /**红点添加 */
        ArmsTypeItem.prototype.addRedEvent = function (type) {
            // RedPointModel.RemoveInfoListenerByCode(this.hashCode);
            RedPointModel.AddInfoListener(this, { x: 105, y: 24 }, [type], 3, { armsType: this.type });
        };
        /**检查新手引导面板条件 */
        ArmsTypeItem.prototype.onGuideConditionTab = function (id) {
            if (id <= 0)
                return;
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, id);
        };
        return ArmsTypeItem;
    }(com_main.CComponent));
    com_main.ArmsTypeItem = ArmsTypeItem;
})(com_main || (com_main = {}));
