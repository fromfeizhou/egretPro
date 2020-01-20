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
    var ComItemNew = /** @class */ (function (_super_1) {
        __extends(ComItemNew, _super_1);
        function ComItemNew(state, openTips, openEff) {
            if (state === void 0) { state = ''; }
            if (openTips === void 0) { openTips = true; }
            if (openEff === void 0) { openEff = true; }
            var _this = _super_1.call(this) || this;
            _this.m_bOpenTips = null; //tips开启状态
            _this.m_bOpenEff = true; //物品特效
            _this.skinName = Utils.getAppSkin("common/com_item_new.exml");
            _this.m_tParam = { state: state, openTips: openTips, openEff: openEff };
            return _this;
        }
        ComItemNew.create = function (state, openTips, openEff) {
            if (state === void 0) { state = 'count'; }
            if (openTips === void 0) { openTips = true; }
            if (openEff === void 0) { openEff = true; }
            var obj = ObjectPool.pop(com_main.ComItemNew, "com_main.ComItemNew", state, openTips, openEff);
            obj.init(state, openTips, openEff);
            NodeUtils.reset(obj);
            return obj;
        };
        ComItemNew.prototype.init = function (state, openTips, openEff) {
            if (state === void 0) { state = ''; }
            if (openTips === void 0) { openTips = true; }
            if (openEff === void 0) { openEff = true; }
            if (state != '')
                this.currentState = state;
            this.commitProperties();
            this.openTips = openTips;
            this.openEffect = openEff;
        };
        /**对象池回收 */
        ComItemNew.prototype.onPoolClear = function () {
            this.setSkin(null);
        };
        ComItemNew.prototype.$onRemoveFromStage = function () {
            if (this.unAutoRemove)
                return;
            this.$setParent(null);
            this.m_pItemId = null;
            this.m_imgIcon.source = '';
            this.openTips = false;
            this.openEffect = false;
            ObjectPool.push(this);
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        ComItemNew.prototype.onDestroy = function () {
            if (this.$parent == null)
                return;
            Utils.removeFromParent(this);
            _super_1.prototype.onDestroy.call(this);
        };
        ComItemNew.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.m_pIconRoot.cacheAsBitmap = true;
        };
        Object.defineProperty(ComItemNew.prototype, "openTips", {
            get: function () {
                return this.m_bOpenTips;
            },
            /**监听事件 */
            /**启用通用tips */
            set: function (val) {
                if (this.m_bOpenTips == val)
                    return;
                this.m_bOpenTips = val;
                if (val) {
                    com_main.EventManager.addTouchTapListener(this, this, this.onShowTip);
                }
                else {
                    com_main.EventManager.removeEventListeners(this);
                }
                // if (val) {
                //     this.setTipsInfo();
                // } else {
                //     CTipsManager.clearTips(this);
                // }
            },
            enumerable: true,
            configurable: true
        });
        /**弹出物品信息 */
        ComItemNew.prototype.onShowTip = function () {
            if (this.m_bOpenTips && this.m_pItemId > 0 && this.itemInfo.mainType != 18) {
                Utils.open_view(TASK_UI.TIP_CHECK_ITEM_INFO, { type: this.itemInfo.mainType, itemId: this.m_pItemId });
            }
        };
        Object.defineProperty(ComItemNew.prototype, "openEffect", {
            get: function () {
                return this.m_bOpenEff;
            },
            /**启动红品质特效 */
            set: function (val) {
                if (this.m_bOpenEff == val)
                    return;
                this.m_bOpenEff = val;
                this.refreshEffect();
            },
            enumerable: true,
            configurable: true
        });
        /*修改tips */
        // private setTipsInfo() {
        //     // if (this.m_bOpenTips && this.m_pItemId > 0)
        //     // CTipsManager.addTips(this, { type: TipsEnum.Item, param: this.m_pItemId })
        //     Utils.open_view(TASK_UI.TIP_CHECK_ITEM_INFO, { type: this.itemInfo.mainType, param: this.m_pItemId });
        // }
        /**设置物品id 和 数量*/
        ComItemNew.prototype.setItemInfo = function (id, count) {
            if (count === void 0) { count = 0; }
            //由皮肤创建 没有执行初始化(初始化当前节点会塞入事件队里，避免主题初始化事件引用皮肤)
            if (this.m_tParam) {
                this.init(this.m_tParam.state, this.m_tParam.openTips, this.m_tParam.openTips);
                this.m_tParam = null;
            }
            if (this.m_pItemId == id) {
                this.refreshCount(count);
                this.refreshEffect();
                return;
            }
            this.m_pItemId = id;
            this.itemInfo = C.ItemConfig[this.m_pItemId];
            // this.setTipsInfo();
            this.refreshView(count);
            this.refreshEffect();
        };
        ComItemNew.prototype.refreshEffect = function () {
            if (this.m_bOpenEff && this.itemInfo && this.itemInfo.quality >= 5) {
                this.createGeneralEffect();
            }
            else {
                this.clearGeneralEffect();
            }
        };
        Object.defineProperty(ComItemNew.prototype, "itemId", {
            /**获得物品id */
            get: function () {
                return this.m_pItemId;
            },
            /**
             * 注意：该方式自动获取背包数量，自定义数量显示 使用接口setItemInfo
             * 设置物品id */
            set: function (id) {
                if (this.m_pItemId == id)
                    return;
                this.m_pItemId = id;
                // this.setTipsInfo();
                this.refreshView();
                this.refreshEffect();
            },
            enumerable: true,
            configurable: true
        });
        /**刷新显示 */
        ComItemNew.prototype.refreshView = function (count) {
            if (this.m_pItemId && this.m_pItemId > 0) {
                var info = PropModel.getCfg(this.m_pItemId);
                if (info) {
                    if (info.mainType == PropMainType.SOUL || info.mainType == PropMainType.SKILL_SOUL) {
                        this.m_pIconRoot.setChildIndex(this.m_imgIcon, 0);
                        this.m_imgIcon.mask = this.m_imgSoulMask;
                    }
                    else {
                        this.m_pIconRoot.setChildIndex(this.m_imgBg, 0);
                        this.m_imgIcon.mask = null;
                    }
                    this.refreshIcon();
                    this.refreshName(info);
                    this.refreshQualityBg();
                    this.refreshCount(count);
                    this.refreshQuaIcon(info);
                }
            }
            else {
                this.resetViewState();
            }
        };
        /**重置显示 */
        ComItemNew.prototype.resetViewState = function () {
            this.m_imgIcon.source = "";
            this.m_imgBg.source = "";
            if (this.m_labName) {
                this.m_labName.text = "";
            }
            if (this.m_labCount) {
                this.m_labCount.text = "";
            }
            this.refreshQualityBg();
        };
        /**刷新图标 */
        ComItemNew.prototype.refreshIcon = function () {
            var image = PropModel.getPropIcon(this.m_pItemId);
            this.m_imgIcon.source = image;
        };
        /**刷新品质框 */
        ComItemNew.prototype.refreshQualityBg = function () {
            Utils.initPropkuang(this.m_imgBg, this.m_pItemId);
        };
        /**刷新名字 */
        ComItemNew.prototype.refreshName = function (config) {
            if (this.m_labName) {
                Utils.setPropLabName(this.m_pItemId, this.m_labName);
            }
        };
        /**刷新碎片样式 */
        ComItemNew.prototype.refreshQuaIcon = function (info) {
            if (info.mainType == PropMainType.EQUIP_SOUL || info.mainType == PropMainType.TREA_SOUL) {
                this.m_imgQIcon.visible = true;
                this.m_imgQIcon.source = PropModel.getQualitySoulIcon(this.m_pItemId);
            }
            else {
                this.m_imgQIcon.visible = false;
            }
        };
        /**刷新数量 */
        ComItemNew.prototype.refreshCount = function (count) {
            if (this.m_labCount) {
                if (count) {
                    if (count > 1) {
                        this.m_labCount.text = CommonUtils.numOutLenght(count);
                    }
                    else {
                        this.m_labCount.text = "";
                    }
                }
                else {
                    // let num = PropModel.getPropNum(this.m_pItemId);
                    // if (num > 0) {
                    //     this.m_labCount.text = CommonUtils.numOutLenght(num);
                    // } else {
                    this.m_labCount.text = "";
                    // }
                }
            }
        };
        /**刷新数量 50/1 */
        ComItemNew.prototype.refresVal2Max = function (val, max) {
            if (this.m_labCount) {
                Utils.setRedProcessText(this.m_labCount, val, max);
            }
        };
        /**刷新数量 */
        // public setCostColor(color) {
        //     if (this.m_labCount)
        //         return this.m_labCount.textColor = color;
        // }
        //=============================================================================================================================================
        //特效 begin
        //============================================================================================================================================= 
        /**设置红品质特效 */
        ComItemNew.prototype.createGeneralEffect = function () {
            if (this.m_generalEff)
                return;
            this.m_generalEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_pEffRoot.addChild(this.m_generalEff);
        };
        ComItemNew.prototype.clearGeneralEffect = function () {
            if (this.m_generalEff) {
                NormalMcMgr.removeMc(this.m_generalEff);
                this.m_generalEff = null;
            }
        };
        return ComItemNew;
    }(com_main.CComponent));
    com_main.ComItemNew = ComItemNew;
})(com_main || (com_main = {}));
