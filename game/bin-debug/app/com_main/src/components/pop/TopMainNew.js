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
    var TopMainNew = /** @class */ (function (_super_1) {
        __extends(TopMainNew, _super_1);
        function TopMainNew() {
            var _this = _super_1.call(this) || this;
            // private m_pBackBtn: com_main.CImage;
            // private m_pTitleLbl: eui.Label;
            _this.isSuper = false;
            _this.m_pOnlyClose = false;
            _this.name = TopMainNew.NAME;
            return _this;
        }
        TopMainNew.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.validateNow();
            // debug("childrenCreated");
            com_main.EventManager.removeEventListeners(this);
            if (this.m_pCloseBtn)
                com_main.EventManager.addTouchScaleListener(this.m_pCloseBtn, this, this.onCloseClick);
            if (this.m_pBackBtn) {
                com_main.EventManager.addTouchScaleListener(this.m_pBackBtn, this, this.onBackClick);
                this.historyShow = false;
            }
        };
        Object.defineProperty(TopMainNew.prototype, "historyShow", {
            set: function (show) {
                if (this.m_pBackBtn)
                    this.m_pBackBtn.visible = show;
                this.m_pOnlyClose = !show;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TopMainNew.prototype, "titleShow", {
            set: function (show) {
                if (this.m_pTitle) {
                    this.m_pTitle.visible = show;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TopMainNew.prototype, "Desc", {
            set: function (desc) {
                if (this.m_pDesc) {
                    this.m_pDesc.text = desc;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TopMainNew.prototype, "iconShow", {
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
        TopMainNew.prototype.onCloseClick = function (e) {
            // debug("onCloseClick");
            //Guide.touchCall(GuideTargetType.Close);
            if (this.m_pOnlyClose) {
                if (this.closeCallback && this.closeObj)
                    this.closeCallback.call(this.closeObj);
                else
                    com_main.UpManager.close(true, this.isSuper);
            }
            else {
                this.onBackClick(e);
            }
            e.stopImmediatePropagation();
        };
        TopMainNew.prototype.onBackClick = function (e) {
            //Guide.touchCall(GuideTargetType.Back);
            if (this.funcSelect) {
                this.funcSelect.call(this.funcObj);
            }
            else {
                com_main.UpManager.history();
            }
            e.stopImmediatePropagation();
        };
        TopMainNew.prototype.addBackListener = function (obj, func) {
            this.funcObj = obj;
            this.funcSelect = func;
        };
        TopMainNew.prototype.removeBackListener = function () {
            this.funcObj = null;
            this.funcSelect = null;
        };
        TopMainNew.prototype.addCloseListener = function (obj, func) {
            this.closeObj = obj;
            this.closeCallback = func;
        };
        TopMainNew.prototype.removeCloseListener = function () {
            this.closeObj = null;
            this.closeCallback = null;
        };
        TopMainNew.getPopUp = function (panel) {
            if (panel) {
                return (panel.getChildByName(TopMainNew.NAME));
            }
            return null;
        };
        TopMainNew.setTitle = function (panel, title, historyShow) {
            if (historyShow === void 0) { historyShow = true; }
            var popUpComponent = TopMainNew.getPopUp(panel);
            if (popUpComponent) {
                popUpComponent.setTitleImg(title);
                popUpComponent.historyShow = historyShow;
            }
        };
        TopMainNew.setTitleLabel = function (panel, title, historyShow) {
            if (historyShow === void 0) { historyShow = true; }
            var popUpComponent = TopMainNew.getPopUp(panel);
            if (popUpComponent) {
                popUpComponent.setTitleLabel(title);
                popUpComponent.historyShow = historyShow;
            }
        };
        TopMainNew.setIcon = function (panel, iconSource, historyShow) {
            if (historyShow === void 0) { historyShow = true; }
            var popUpComponent = TopMainNew.getPopUp(panel);
            if (popUpComponent) {
                popUpComponent.setIcon(iconSource);
                popUpComponent.historyShow = historyShow;
            }
        };
        TopMainNew.prototype.setTitleLabel = function (title) {
            if (!this.m_pTitleLabel)
                return;
            if (title != "") {
                this.m_pTitleLabel.text = title;
                this.m_pTitleLabel.width = this.m_pTitleLabel.width;
            }
        };
        // public setTitle(title: string) {
        // 	if (title != "") {
        // 		// this.m_pTitleLbl.text = title;
        // 	}
        // }
        TopMainNew.prototype.setTitleImg = function (source) {
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
        TopMainNew.prototype.setIcon = function (source) {
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
        TopMainNew.prototype.getCloseBtn = function () {
            return this.m_pCloseBtn;
        };
        TopMainNew.prototype.getBackBtn = function () {
            return this.m_pBackBtn;
        };
        TopMainNew.NAME = "TopMainNew";
        return TopMainNew;
    }(com_main.CComponent));
    com_main.TopMainNew = TopMainNew;
})(com_main || (com_main = {}));
