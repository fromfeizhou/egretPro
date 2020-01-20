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
    var GuideSelectItem = /** @class */ (function (_super_1) {
        __extends(GuideSelectItem, _super_1);
        function GuideSelectItem() {
            var _this = _super_1.call(this) || this;
            _this.m_bSelected = true;
            _this.skinName = Utils.getAppSkin("world/world_select_Item.exml");
            return _this;
        }
        Object.defineProperty(GuideSelectItem.prototype, "type", {
            get: function () {
                return this.m_nType;
            },
            set: function (type) {
                switch (type) {
                    case 1: {
                        this.m_imgCountry.source = "common_country5_1_png";
                        this.m_TuijianBg.source = 'zyt_xj_wg_png';
                        break;
                    }
                    case 2: {
                        this.m_imgCountry.source = "common_country5_2_png";
                        this.m_TuijianBg.source = 'zyt_xj_sg_png';
                        break;
                    }
                    case 3: {
                        this.m_imgCountry.source = "common_country5_3_png";
                        this.m_TuijianBg.source = 'zyt_xj_wug_png';
                        break;
                    }
                }
                this.m_nType = type;
            },
            enumerable: true,
            configurable: true
        });
        GuideSelectItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        GuideSelectItem.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this);
            egret.Tween.removeTweens(this.m_imgCountry);
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        GuideSelectItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        };
        GuideSelectItem.prototype.setSelect = function (selected, price) {
            if (this.m_bSelected == selected)
                return;
            // this.m_imgSelect.visible = selected;
            this.m_bSelected = selected;
            this.m_pTjBox.visible = selected;
            this.m_LbGold.text = price + '';
        };
        GuideSelectItem.prototype.setSelectEff = function (currState) {
            if (currState) {
                this.createEffect();
            }
            else {
                this.clearEffect();
            }
        };
        /**位移缓动 */
        GuideSelectItem.prototype.doAction = function (ty, tScale, alpha, isAction) {
            var _this = this;
            egret.Tween.removeTweens(this);
            egret.Tween.removeTweens(this.m_imgCountry);
            // this.m_imgSelect.visible = false;
            if (isAction) {
                var tw = egret.Tween.get(this);
                tw.wait(30);
                tw.to({ y: ty, scaleX: tScale, scaleY: tScale, alpha: alpha }, 300, egret.Ease.cubicOut);
                tw.call(function () {
                    _this.setEndState(ty, tScale, alpha);
                }, this);
            }
            else {
                this.setEndState(ty, tScale, alpha);
            }
        };
        /**结束状态 */
        GuideSelectItem.prototype.setEndState = function (ty, tScale, alpha) {
            this.y = ty;
            this.alpha = alpha;
            NodeUtils.setScale(this, tScale);
            // this.m_imgSelect.visible = tScale == 1;
            this.visible = tScale != 0.5;
        };
        /**添加背景特效 */
        GuideSelectItem.prototype.createEffect = function () {
            if (!this.m_effBg) {
                this.m_effBg = new MCDragonBones();
                this.m_effBg.initAsync(IETypes.EUI_TreaBg);
                this.m_effBg.play(IETypes.EUI_TreaBg);
                this.m_effBg.scaleX = 0.7;
                this.m_effBg.scaleY = 0.7;
                this.m_pEffRoot.addChild(this.m_effBg);
            }
        };
        /**移除背景特效 */
        GuideSelectItem.prototype.clearEffect = function () {
            if (this.m_effBg) {
                this.m_effBg.destroy();
                this.m_effBg = null;
            }
        };
        return GuideSelectItem;
    }(com_main.CComponent));
    com_main.GuideSelectItem = GuideSelectItem;
})(com_main || (com_main = {}));
