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
/**
 * 功能图标基类
 */
var com_main;
(function (com_main) {
    var FuncIconType;
    (function (FuncIconType) {
        FuncIconType[FuncIconType["FUNCTION"] = 1] = "FUNCTION";
        FuncIconType[FuncIconType["ACTIVITY"] = 2] = "ACTIVITY";
    })(FuncIconType = com_main.FuncIconType || (com_main.FuncIconType = {}));
    var FunctionWidgetBase = /** @class */ (function (_super_1) {
        __extends(FunctionWidgetBase, _super_1);
        function FunctionWidgetBase() {
            var _this = _super_1.call(this) || this;
            /**图标类型 */
            _this.m_pIconType = FuncIconType.FUNCTION;
            /**按钮图标id */
            _this.m_nBtnId = -1;
            /*相对位置排序 */
            _this.m_pPosPriority = 99;
            /**添加位置 */
            _this.m_nPos = 0;
            /**添加场景 */
            _this.m_nScene = 0;
            _this.m_nIds = [];
            _this.m_nEffIds = [];
            return _this;
        }
        FunctionWidgetBase.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.initEvent();
        };
        FunctionWidgetBase.prototype.onDestroy = function () {
            com_main.EventMgr.removeEventByObject(TASK_EVT.POP_NEW_FUNCTION_OPEN, this);
            com_main.EventManager.removeEventListeners(this);
            egret.Tween.removeTweens(this.m_pConIcon);
            this.clearLevelUI();
            _super_1.prototype.onDestroy.call(this);
        };
        // }
        /**
         * 初始化
         * @param btnId
         *  */
        FunctionWidgetBase.prototype.initWidget = function (btnId, isOpenEvt) {
            if (isOpenEvt === void 0) { isOpenEvt = false; }
            this.m_nBtnId = btnId;
            var cfg = C.FunctionBtnConfig[btnId];
            if (cfg == null)
                return;
            this.m_tCfg = cfg;
            this.m_pPosPriority = cfg.priority;
            this.m_nPos = cfg.pos;
            this.m_nScene = cfg.scene;
            if (this.m_nPos == FunctionPosType.FPT_BOTTOM) {
                this.width = 109;
                this.height = 99;
            }
            else {
                this.width = 76;
                this.height = 75;
            }
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            this.m_pConIcon = new egret.DisplayObjectContainer();
            this.addChild(this.m_pConIcon);
            this.m_pImgIcon = new com_main.CImage();
            this.m_pImgIcon.width = this.width;
            this.m_pImgIcon.height = this.height;
            this.m_pConIcon.addChild(this.m_pImgIcon);
            this.m_pImgIcon.source = this.getIconSrc();
            this.m_bIsOpenEvt = isOpenEvt;
            if (cfg.id == 10002 || cfg.id == 4004) {
                this.doScaleAction();
                if (isOpenEvt)
                    com_main.EventManager.addTouchTapListener(this.m_pConIcon, this, this.onClickHandle);
            }
            else {
                if (isOpenEvt)
                    com_main.EventManager.addTouchScaleListener(this.m_pConIcon, this, this.onClickHandle);
            }
        };
        /**获得icon */
        FunctionWidgetBase.prototype.getIconSrc = function () {
            var name = this.m_tCfg.iconName;
            if (this.m_tCfg.id == 10002) {
                var vo = ActivityModel.getActivityVo(AcViewType.FIRST_RECHARGE);
                if (vo.awardRecordSet.length > 0) {
                    name = "city_icon_cz4";
                }
            }
            if (this.m_tCfg.id == 4004) {
                var vo = ActivityModel.getActivityVo(AcViewType.NEW_GEN_VIS);
                name = vo.getNewGenRewordCfg().icon;
                return LoginConst.getResUrl(name, 'icon');
            }
            return name + "_png";
        };
        FunctionWidgetBase.prototype.updateIncon = function () {
            this.m_pImgIcon.source = this.getIconSrc();
        };
        /**缩放动画 */
        FunctionWidgetBase.prototype.doScaleAction = function () {
            this.m_pImgIcon.width = this.m_pImgIcon.width * 1.1;
            this.m_pImgIcon.height = this.m_pImgIcon.height * 1.1;
            var tw = egret.Tween.get(this.m_pConIcon, { loop: true });
            tw.to({ scaleX: 1.1, scaleY: 1.1 }, 800);
            tw.to({ scaleX: 1, scaleY: 1 }, 800);
        };
        /**添加活动 或功能id*/
        FunctionWidgetBase.prototype.addItemId = function (ids) {
            while (ids.length > 0) {
                var id = ids.pop();
                if (this.m_nIds.indexOf(id) == -1) {
                    this.m_nIds.push(id);
                }
            }
            if (this.m_nIds.length > 0) {
                this.initRedPointEvt();
                this.initIdAction(this.m_nIds);
            }
        };
        /**移除活动 */
        FunctionWidgetBase.prototype.removeItemId = function (id) {
            var index = this.m_nIds.indexOf(id);
            if (index >= 0) {
                this.m_nIds.splice(index, 1);
                this.initRedPointEvt();
                this.clearTimeOut();
            }
        };
        /**功能为空 */
        FunctionWidgetBase.prototype.isEmpty = function () {
            if (!this.m_nIds || this.m_nIds.length == 0)
                return true;
            return false;
        };
        /**是否存在活动 与功能 */
        FunctionWidgetBase.prototype.isInId = function (id) {
            return this.m_nIds.indexOf(id) >= 0;
        };
        /**添加功能限制显示文本 */
        FunctionWidgetBase.prototype.initLevelUI = function (color) {
            if (color === void 0) { color = 0xe9e9e6; }
            if (this.m_pLevelLab) {
                this.m_pLevelLab.textColor = color;
                return;
            }
            this.m_pLevelBg = new com_main.CImage();
            this.m_pLevelBg.source = "border_1030_png";
            this.m_pLevelBg.height = 18;
            this.m_pLevelBg.width = this.width + 20;
            this.m_pConIcon.addChild(this.m_pLevelBg);
            this.m_pLevelBg.alpha = 0.8;
            this.m_pLevelBg.y = this.height - 1;
            this.m_pLevelBg.x = this.width / 2 - this.m_pLevelBg.width / 2;
            this.m_pLevelLab = new com_main.CLabel();
            this.m_pLevelLab.size = 17;
            this.m_pLevelLab.textColor = color;
            this.m_pLevelLab.stroke = 1;
            this.m_pLevelLab.strokeColor = 0x000000;
            this.m_pLevelLab.width = this.width + 24;
            this.m_pConIcon.addChild(this.m_pLevelLab);
            this.m_pLevelLab.y = this.height + 2;
            this.m_pLevelLab.textAlign = egret.HorizontalAlign.CENTER;
            this.m_pLevelLab.x = this.width / 2 - this.m_pLevelLab.width / 2;
        };
        FunctionWidgetBase.prototype.clearLevelUI = function () {
            Utils.removeFromParent(this.m_pLevelBg);
            Utils.removeFromParent(this.m_pLevelLab);
        };
        /**控制限制功能文本显示 */
        FunctionWidgetBase.prototype.updateLevelShow = function () {
            this.m_pLevelBg.visible = !FunctionModel.isFunctionOpen(this.m_nBtnId);
            this.m_pLevelLab.visible = !FunctionModel.isFunctionOpen(this.m_nBtnId);
            this.m_pLevelLab.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, FunctionModel.getFunctionOpenLevel(this.m_nBtnId));
        };
        Object.defineProperty(FunctionWidgetBase.prototype, "posPriority", {
            get: function () {
                return this.m_pPosPriority;
            },
            set: function (posPriority) {
                this.m_pPosPriority = posPriority;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FunctionWidgetBase.prototype, "pos", {
            /**位置 */
            get: function () {
                return this.m_nPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FunctionWidgetBase.prototype, "scene", {
            /**场景 */
            get: function () {
                return this.m_nScene;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FunctionWidgetBase.prototype, "iconType", {
            /**图标类型 1 功能图标 2 活动图标*/
            get: function () {
                return this.m_pIconType;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FunctionWidgetBase.prototype, "icon", {
            get: function () {
                return this.m_pImgIcon;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FunctionWidgetBase.prototype, "btnId", {
            /**按钮配置id */
            get: function () {
                return this.m_nBtnId;
            },
            enumerable: true,
            configurable: true
        });
        /**==================================================================================================================
         * 通用功能
         * ==================================================================================================================
         */
        /**红点监听(子类重写) */
        FunctionWidgetBase.prototype.initRedPointEvt = function () {
        };
        /**点击回调 则此实现 丢给子类（FunctonSimpleWidget	FunctionActiWidget）重写回调) */
        FunctionWidgetBase.prototype.onClickHandle = function () {
        };
        /**按钮id初始化 */
        FunctionWidgetBase.prototype.initIdAction = function (ids) {
        };
        /**
         * @param time 毫秒
         */
        FunctionWidgetBase.prototype.createTimeOutLab = function (time, type) {
            if (type === void 0) { type = 1; }
            this.initLevelUI();
            this.m_nTimeOut = time;
            this.m_nType = type;
            this.m_pLevelLab.text = Utils.DateUtils.getFormatTime(this.m_nTimeOut, this.m_nType);
            if (!this.m_bOnTick) {
                this.m_bOnTick = true;
                Utils.TimerManager.doTimer(1000, 0, this.onTickHandler, this);
            }
        };
        FunctionWidgetBase.prototype.onTickHandler = function () {
            this.m_nTimeOut -= 1000;
            if (this.m_nTimeOut < 0) {
                this.clearTimeOut();
                return;
            }
            this.m_pLevelLab.text = Utils.DateUtils.getFormatTime(this.m_nTimeOut, this.m_nType);
        };
        FunctionWidgetBase.prototype.clearTimeOut = function () {
            this.m_bOnTick = false;
            this.clearLevelUI();
            Utils.TimerManager.remove(this.onTickHandler, this);
        };
        return FunctionWidgetBase;
    }(com_main.CComponent));
    com_main.FunctionWidgetBase = FunctionWidgetBase;
})(com_main || (com_main = {}));
