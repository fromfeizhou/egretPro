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
    var APopUp = /** @class */ (function (_super_1) {
        __extends(APopUp, _super_1);
        function APopUp() {
            var _this = _super_1.call(this) || this;
            // private m_pBackBtn: com_main.CImage;
            // private m_pTitleLbl: eui.Label;
            _this.isSuper = false;
            _this.m_pOnlyClose = false;
            _this.name = APopUp.NAME;
            return _this;
        }
        APopUp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.validateNow();
            // debug("childrenCreated");
            this.initEvent();
        };
        APopUp.prototype.initEvent = function () {
            if (this.bInitEvent)
                return;
            this.bInitEvent = true;
            if (this.m_pCloseBtn)
                this.m_pCloseBtn["sound_cancel"] = SoundData.getCancelSound();
            com_main.EventManager.addTouchScaleListener(this.m_pCloseBtn, this, this.onCloseClick);
            if (this.m_pBackBtn) {
                this.m_pBackBtn["sound_cancel"] = SoundData.getCancelSound();
                com_main.EventManager.addTouchScaleListener(this.m_pBackBtn, this, this.onBackClick);
                this.historyShow = false;
            }
        };
        APopUp.prototype.$onRemoveFromStage = function () {
            this.bInitEvent = false;
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        Object.defineProperty(APopUp.prototype, "historyShow", {
            /**设置是否在队里中 （不在upmanger 队列中的面板 this.m_pOnlyClose = true）*/
            set: function (show) {
                if (this.m_pBackBtn)
                    this.m_pBackBtn.visible = show;
                this.m_pOnlyClose = !show;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopUp.prototype, "titleShow", {
            set: function (show) {
                if (this.m_pTitle) {
                    this.m_pTitle.visible = show;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopUp.prototype, "Desc", {
            set: function (desc) {
                if (this.m_pDesc) {
                    this.m_pDesc.text = desc;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APopUp.prototype, "iconShow", {
            set: function (show) {
                if (this.m_pIcon) {
                    this.m_pIcon.visible = show;
                }
                if (show == false) {
                    this.m_pTitle.right = 28;
                }
            },
            enumerable: true,
            configurable: true
        });
        APopUp.prototype.onCloseClick = function (e) {
            // debug("onCloseClick");
            if (this.m_pOnlyClose) {
                if (this.closeCallback && this.closeObj)
                    this.closeCallback.call(this.closeObj);
                else
                    com_main.UpManager.close(false, this.isSuper);
            }
            else {
                this.onBackClick(e);
            }
            e.stopImmediatePropagation();
        };
        APopUp.prototype.onBackClick = function (e) {
            if (this.funcSelect) {
                this.funcSelect.call(this.funcObj);
            }
            else {
                com_main.UpManager.history();
            }
            e.stopImmediatePropagation();
        };
        APopUp.prototype.addBackListener = function (obj, func) {
            this.funcObj = obj;
            this.funcSelect = func;
        };
        APopUp.prototype.removeBackListener = function () {
            this.funcObj = null;
            this.funcSelect = null;
        };
        APopUp.prototype.addCloseListener = function (obj, func) {
            this.closeObj = obj;
            this.closeCallback = func;
        };
        APopUp.prototype.removeCloseListener = function () {
            this.closeObj = null;
            this.closeCallback = null;
        };
        APopUp.getPopUp = function (panel) {
            if (panel) {
                return (panel.getChildByName(APopUp.NAME));
            }
            return null;
        };
        APopUp.setTitle = function (panel, title, historyShow) {
            if (historyShow === void 0) { historyShow = true; }
            var popUpComponent = APopUp.getPopUp(panel);
            if (popUpComponent) {
                popUpComponent.setTitleImg(title);
                popUpComponent.historyShow = historyShow;
            }
        };
        APopUp.setTitleLabel = function (panel, title, historyShow) {
            if (historyShow === void 0) { historyShow = true; }
            var popUpComponent = APopUp.getPopUp(panel);
            if (popUpComponent) {
                popUpComponent.setTitleLabel(title);
                popUpComponent.historyShow = historyShow;
            }
        };
        APopUp.setIcon = function (panel, iconSource, historyShow) {
            if (historyShow === void 0) { historyShow = true; }
            var popUpComponent = APopUp.getPopUp(panel);
            if (popUpComponent) {
                popUpComponent.setIcon(iconSource);
                popUpComponent.historyShow = historyShow;
            }
        };
        APopUp.prototype.setTitleLabel = function (title) {
            if (!this.m_pTitleLabel)
                return;
            if (title != "") {
                this.m_pTitleLabel.text = title;
                this.m_pTitleLabel.width = this.m_pTitleLabel.width;
            }
        };
        APopUp.prototype.setTitleLabelVisible = function (iVisible) {
            if (!this.m_pTitleLabel)
                return;
            this.m_pTitleLabel.visible = iVisible;
        };
        // public setTitle(title: string) {
        // 	if (title != "") {
        // 		// this.m_pTitleLbl.text = title;
        // 	}
        // }
        APopUp.prototype.setBottomBorder = function (val) {
            if (val === void 0) { val = false; }
            if (this.m_BottomBorder) {
                this.m_BottomBorder.touchEnabled = val;
                this.m_BottomBorder.visible = val;
            }
        };
        APopUp.prototype.setTitleImg = function (source) {
            if (!this.m_pTitle)
                return;
            if (source != "") {
                var res = RES.getRes(source);
                if (res) {
                    this.m_pTitle.texture = res;
                    this.m_pTitle.width = res.textureWidth;
                    this.m_pTitle.height = res.textureHeight;
                }
            }
        };
        APopUp.prototype.setIcon = function (source) {
            if (!this.m_pIcon)
                return;
            if (source != "") {
                var res = RES.getRes(source);
                if (res) {
                    this.m_pIcon.texture = res;
                    this.m_pIcon.width = res.textureWidth;
                    this.m_pIcon.height = res.textureHeight;
                }
            }
        };
        APopUp.prototype.getCloseBtn = function () {
            return this.m_pCloseBtn;
        };
        APopUp.prototype.getBackBtn = function () {
            return this.m_pBackBtn;
        };
        APopUp.prototype.setPvpBgEnabel = function (isShow) {
            this.m_pPvpBg.visible = isShow;
        };
        APopUp.NAME = "APopCom";
        return APopUp;
    }(eui.Component));
    com_main.APopUp = APopUp;
})(com_main || (com_main = {}));
