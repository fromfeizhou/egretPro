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
    var GeneralExpItemRender = /** @class */ (function (_super_1) {
        __extends(GeneralExpItemRender, _super_1);
        function GeneralExpItemRender(param) {
            var _this = _super_1.call(this) || this;
            _this.m_generalId = 0;
            _this.m_nbookExp = 0;
            _this.m_nItemLeft = 0;
            _this.m_nItemId = param;
            // if (this.m_nItemId) this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
            _this.skinName = Utils.getAppSkin("general/tabView/General_jingyan_item_render.exml");
            return _this;
        }
        GeneralExpItemRender.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        GeneralExpItemRender.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListener(this.image_add);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickBegin, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClickEnd, this);
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            if (this.m_bookList) {
                Utils.TimerManager.remove(this.delayFunc, this);
                this.m_bookList = null;
            }
        };
        GeneralExpItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.refresh();
            com_main.EventManager.addTouchScaleListener(this.image_add, this, this.onclickAddReturn);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onClickBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClickEnd, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onClickEnd, this);
            com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
        };
        /**物品数量变化 */
        GeneralExpItemRender.prototype.onPropItemChange = function (itemId) {
            if (itemId == this.m_nItemId) {
                // debug(Utils.getGeneralName(this.m_generalId),this.m_generalVo.config.itemId,itemId)
                this.refresh();
            }
        };
        GeneralExpItemRender.prototype.onclickAddReturn = function () {
            Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
        };
        Object.defineProperty(GeneralExpItemRender.prototype, "generalId", {
            get: function () {
                return this.m_generalId;
            },
            set: function (id) {
                if (this.m_generalId == id)
                    return;
                this.m_generalId = id;
                this.m_generalVo = GeneralModel.getOwnGeneral(this.m_generalId);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GeneralExpItemRender.prototype, "itemId", {
            set: function (id) {
                this.m_nItemId = id;
                this.refresh();
            },
            enumerable: true,
            configurable: true
        });
        GeneralExpItemRender.prototype.refresh = function () {
            if (!this.m_nItemId)
                return;
            var num = PropModel.getPropNum(this.m_nItemId);
            this.m_comItem.setItemInfo(this.m_nItemId, num);
            this.m_comItem.openTips = false;
            this.m_comItem.openEffect = false;
            if (num == 0) {
                this.setItemViewState(true);
            }
            else {
                this.setItemViewState(false);
            }
            //底下名字
            if (this.m_nItemId > 0) {
                var propCfg = PropModel.getCfg(this.m_nItemId);
                var expCfg = C.ExpBookConfig[this.m_nItemId];
                if (propCfg && expCfg) {
                    this.lb_name.text = GCodeFromat(CLEnum.GEN_EXP_AD, expCfg.exp);
                    this.m_nbookExp = expCfg.exp;
                }
            }
        };
        /**额外获取按钮显示 */
        GeneralExpItemRender.prototype.setItemViewState = function (isAddShow) {
            if (isAddShow) {
                this.image_add.visible = true;
                this.m_rect.visible = true;
            }
            else {
                this.image_add.visible = false;
                this.m_rect.visible = false;
            }
        };
        GeneralExpItemRender.prototype.onClickBegin = function (e) {
            if (!this.m_generalVo)
                return;
            this.m_nItemLeft = PropModel.getPropNum(this.m_nItemId);
            if (this.m_nItemLeft == 0) {
                return;
            }
            if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GENERAL_LEVELUP)) {
                if (this.m_generalVo.level >= GeneralModel.getMaxLevel(this.m_generalVo.upgradeLevel)) {
                    EffectUtils.showTips(GeneralModel.getMaxLvTips(), 1, true);
                    return;
                }
                this.m_bookList = [];
                Utils.TimerManager.doTimer(300, 0, this.delayFunc, this);
                this.delayFunc();
            }
            ;
        };
        GeneralExpItemRender.prototype.onClickEnd = function (e) {
            this.sendExpList();
        };
        GeneralExpItemRender.prototype.delayFunc = function () {
            if (this.m_nItemLeft > 0) {
                switch (this.m_bookList.length) {
                    case 0: {
                        Utils.TimerManager.changeTimerDelay(200, this.delayFunc, this);
                        break;
                    }
                    case 10: {
                        Utils.TimerManager.changeTimerDelay(100, this.delayFunc, this);
                        break;
                    }
                    case 30: {
                        Utils.TimerManager.changeTimerDelay(50, this.delayFunc, this);
                        break;
                    }
                    case 60: {
                        Utils.TimerManager.changeTimerDelay(20, this.delayFunc, this);
                        break;
                    }
                }
                // let bookList = [];
                var result = this.m_generalVo.addExpInClient(this.m_nbookExp);
                if (result) {
                    this.m_nItemLeft--;
                    this.m_comItem.refreshCount(this.m_nItemLeft);
                    var ExpBookDto = { id: this.m_nItemId, count: 1 };
                    this.m_bookList.push(ExpBookDto);
                }
                else {
                    this.sendExpList();
                }
            }
            else {
                this.setItemViewState(true);
                this.sendExpList();
            }
        };
        GeneralExpItemRender.prototype.sendExpList = function () {
            if (!this.m_bookList) {
                return;
            }
            if (this.m_bookList.length > 0) {
                var ExpBookDto = { id: this.m_nItemId, count: this.m_bookList.length };
                GeneralProxy.send_GENERAL_USE_EXP_BOOK(this.generalId, [ExpBookDto], true);
            }
            Utils.TimerManager.remove(this.delayFunc, this);
            this.m_bookList = null;
        };
        return GeneralExpItemRender;
    }(com_main.CComponent));
    com_main.GeneralExpItemRender = GeneralExpItemRender;
})(com_main || (com_main = {}));
