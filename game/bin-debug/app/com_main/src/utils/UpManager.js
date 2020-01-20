var com_main;
(function (com_main) {
    var UpManager = /** @class */ (function () {
        function UpManager() {
        }
        Object.defineProperty(UpManager, "CurrentPanel", {
            get: function () {
                return UpManager.m_pCurrentPanal;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpManager, "panelSize", {
            get: function () {
                return UpManager.m_pPanels.length;
            },
            enumerable: true,
            configurable: true
        });
        /**调整当前显示界面 */
        UpManager.updateView = function (node, preVisible, isShowMask) {
            if (preVisible === void 0) { preVisible = true; }
            if (isShowMask === void 0) { isShowMask = true; }
            UpManager.addPanel(false, preVisible);
            UpManager.m_pCurrentPanal = node;
            for (var i = 0; i < UpManager.m_pPanels.length; i++) {
                var tmpView = UpManager.m_pPanels[i];
                if (node.name == tmpView.name) {
                    UpManager.m_pPanels.splice(i, 1);
                    break;
                }
            }
            node.visible = true;
            AGame.R.app.popUpLevel.addChild(node);
            UpManager.mask(isShowMask);
        };
        UpManager.popView = function (node, style, preVisible, isEnterHistory, showType, isShowMask) {
            if (style === void 0) { style = UpManager.STYLE_UP; }
            if (preVisible === void 0) { preVisible = true; }
            if (isEnterHistory === void 0) { isEnterHistory = true; }
            if (showType === void 0) { showType = 0; }
            if (isShowMask === void 0) { isShowMask = true; }
            // Sound.playID(134);
            if (style == UpManager.STYLE_UP) {
                this.setScale(node);
            }
            else if (style == UpManager.STYLE_FULL) {
                this.setScale(node, true);
            }
            else if (style == UpManager.STYLE_MAIN_FULL) {
                this.setScale(node, true);
                UpManager.closeMapLevel();
            }
            UpManager.setPanelPosition(node, style);
            UpManager.addPanel(false, preVisible);
            UpManager.m_pCurrentPanal = node;
            AGame.R.app.popUpLevel.addChild(node);
            UpManager.m_pCurrentPanal.popType = style;
            //UpManager.resize();
            UpManager.mask(isShowMask);
            UpManager.popUpShow(UpManager.m_pCurrentPanal);
            // UpManager.m_pCurrentPanal.validateNow();
            // UpManager.mask(true, alpha);
        };
        UpManager.popChatView = function (node, title, historyshow, style, preVisible) {
            if (historyshow === void 0) { historyshow = true; }
            if (style === void 0) { style = UpManager.STYLE_UP; }
            if (preVisible === void 0) { preVisible = false; }
            // Sound.playID(134);
            this.setScale(node);
            if (UpManager.m_pCurrentPanal) {
                UpManager.m_pCurrentPanal.touchEnabled = false;
                UpManager.m_pPanels.push(UpManager.m_pCurrentPanal);
            }
            UpManager.m_pCurrentPanal = node;
            AGame.R.app.popUpLevel.addChild(node);
            if (title) {
                com_main.APopUp.setTitleLabel(node, title, this.isShowBack());
            }
            UpManager.m_pCurrentPanal.popType = style;
            UpManager.resize();
            node.scaleX = node.scaleX * 1.15;
            node.scaleY = node.scaleY * 1.15;
            UpManager.mask();
            if (UpManager.panelSize == 0)
                UpManager.popUpShow(UpManager.m_pCurrentPanal);
        };
        UpManager.popSmallView = function (node, title, isClear, alpha, fullView, preVisible) {
            if (alpha === void 0) { alpha = 0; }
            if (fullView === void 0) { fullView = false; }
            if (preVisible === void 0) { preVisible = true; }
            // Sound.playID(134);
            this.setScale(node, fullView);
            UpManager.addPanel(isClear, preVisible);
            UpManager.m_pCurrentPanal = node;
            UpManager.m_pCurrentPanal.popType = UpManager.STYLE_UP;
            AGame.R.app.popUpLevel.addChild(node);
            if (title) {
                com_main.APopUp.setTitle(node, title, this.isShowBack());
            }
            else {
                var popUpComponent = com_main.APopUp.getPopUp(node);
                if (popUpComponent)
                    popUpComponent.titleShow = false;
            }
            UpManager.setPanelPosition(node);
            UpManager.popUpShow(UpManager.m_pCurrentPanal);
            UpManager.m_pCurrentPanal.validateNow();
            UpManager.mask(true, alpha);
        };
        UpManager.popNew = function (node, title, icon, isClear) {
            // Sound.playID(134);
            // this.setScale(node);
            UpManager.addPanel(isClear, true);
            UpManager.m_pCurrentPanal = node;
            AGame.R.app.popUpLevel.addChild(node);
            if (title) {
                com_main.APopUp.setTitle(node, title, this.isShowBack());
            }
            else {
                var popUpComponent = com_main.APopUp.getPopUp(node);
                if (popUpComponent)
                    popUpComponent.titleShow = false;
            }
            if (icon && icon != "") {
                com_main.APopUp.setIcon(node, icon, this.isShowBack());
            }
            else {
                var popUpComponent = com_main.APopUp.getPopUp(node);
                if (popUpComponent)
                    popUpComponent.iconShow = false;
            }
            UpManager.setNewPanelPosition(node);
            UpManager.m_pCurrentPanal.validateNow();
            UpManager.mask(true, 0);
        };
        UpManager.setScale = function (node, fullView) {
            if (fullView === void 0) { fullView = false; }
            var scaleY = GameConfig.curHeight() / 750;
            var scaleX = GameConfig.curWidth() / 1334;
            var scale = Math.min(scaleY, scaleX);
            var name = node.name;
            if (fullView) {
                scale = 1;
                node.width = AGame.R.app.stageWidth;
            }
            if (scale < 0.9)
                scale += 0.05;
            node.scaleX = scale;
            node.scaleY = scale;
        };
        UpManager.isShowBack = function () {
            return this.m_pPanels.length > 0;
        };
        UpManager.addPanel = function (isClear, isVisible) {
            if (isVisible === void 0) { isVisible = true; }
            if (isClear) {
                UpManager.close();
            }
            else if (UpManager.m_pCurrentPanal) {
                // if (UpManager.m_pCurrentPanal.popType != this.STYLE_MAIN_FULL) {
                UpManager.m_pCurrentPanal.visible = isVisible;
                // }
                UpManager.m_pCurrentPanal.touchEnabled = false;
                UpManager.m_pPanels.push(UpManager.m_pCurrentPanal);
            }
        };
        /**添加面板 */
        UpManager.addPanelInPopLayer = function (node) {
            UpManager.m_pPanels.push(node);
            AGame.R.app.popUpLevel.addChild(node);
        };
        UpManager.close = function (bAnima, isSuper) {
            if (bAnima === void 0) { bAnima = false; }
            if (isSuper === void 0) { isSuper = true; }
            var callback = function () {
                UpManager.removePanel(UpManager.m_pCurrentPanal, isSuper);
                UpManager.m_pCurrentPanal = null;
                for (var i = 0; i < UpManager.m_pPanels.length; i++) {
                    var panel = UpManager.m_pPanels[i];
                    if (!isSuper && panel.popType == UpManager.STYLE_MAIN_FULL) {
                        UpManager.m_pCurrentPanal = panel;
                        UpManager.m_pCurrentPanal.touchEnabled = true;
                        UpManager.m_pCurrentPanal.onRefresh();
                    }
                    UpManager.removePanel(panel, true);
                }
                UpManager.m_pPanels = [];
                UpManager.mask(false);
                UpManager.showMapLevel();
                //检测新手引导条件 弹窗全部关闭 检测场景
                SceneManager.onSceneWndEnter();
            };
            if (bAnima) {
                UpManager.popUpClose(UpManager.CurrentPanel, callback);
            }
            else {
                callback();
            }
        };
        UpManager.history = function (bAnima) {
            if (bAnima === void 0) { bAnima = false; }
            com_main.MainMap.hideGlow();
            var panel = UpManager.m_pCurrentPanal;
            UpManager.m_pCurrentPanal = null;
            var callback = function () {
                UpManager.removePanel(panel, true);
                //面板注释函数 添加新的当前面板 不在队列拿面板
                if (UpManager.m_pCurrentPanal)
                    return;
                if (UpManager.m_pPanels.length > 0) {
                    UpManager.m_pCurrentPanal = UpManager.m_pPanels.pop();
                }
                if (UpManager.m_pCurrentPanal) {
                    // debug("UpManager.history onrefresh");
                    UpManager.m_pCurrentPanal.visible = true;
                    UpManager.m_pCurrentPanal.touchEnabled = true;
                    UpManager.m_pCurrentPanal.onRefresh();
                    // UpManager.mask();
                    UpManager.mask(true);
                    /**面板条件 */
                    SceneManager.sendPanelGuide();
                }
                else {
                    UpManager.mask(false);
                }
                // 开地图
                UpManager.showMapLevel();
                //空场景判断
                if (UpManager.m_pCurrentPanal == null)
                    SceneManager.onSceneWndEnter();
            };
            if (UpManager.panelSize == 0 && bAnima) {
                callback();
                // UpManager.popUpClose(UpManager.m_pCurrentPanal, callback);
            }
            else {
                callback();
            }
        };
        //删除所有面板
        UpManager.removeAllPanel = function () {
            this.close();
        };
        UpManager.removePanel = function (panel, isSuper) {
            if (panel === void 0) { panel = null; }
            if (isSuper === void 0) { isSuper = false; }
            if (!panel)
                panel = UpManager.m_pCurrentPanal;
            if (!panel)
                return;
            panel.onDestroy();
            if (panel.parent) {
                panel.parent.removeChild(panel);
                panel = null;
            }
        };
        UpManager.popUpClose = function (panel, callback) {
            if (panel) {
                var tw = com_main.TweenAnim.get(panel);
                var scale = panel.scaleX;
                tw.to({ scaleX: 1.05 * scale, scaleY: 1.05 * scale }, 50)
                    .to({ scaleX: scale, scaleY: scale }, 150)
                    .to({ alpha: 0.01 }, 180)
                    .call(function () {
                    if (callback)
                        callback();
                    com_main.TweenAnim.removeTweens(panel);
                });
            }
            else {
                if (callback)
                    callback();
            }
        };
        UpManager.popUpShow = function (panel, callback) {
            var style = panel.popType;
            var tw = egret.Tween.get(panel);
            if (style == UpManager.STYLE_UP) {
                var scale = panel.scaleX;
                panel.scaleX = 0.5;
                panel.scaleY = 0.5;
                panel.alpha = 0.01;
                panel['$popShowAction'] = true;
                tw.to({ scaleX: scale, scaleY: scale, scale: scale, alpha: 1 }, 300, Ease.backOut);
            }
            else {
                panel.alpha = 0.01;
                tw.to({ alpha: 1 }, 75);
            }
            tw.call(function () {
                panel['$popShowAction'] = false;
                if (callback)
                    callback();
            });
        };
        UpManager.resize = function (panel) {
            if (panel === void 0) { panel = UpManager.m_pCurrentPanal; }
            if (panel) {
                panel.resize();
                var app = AGame.R.app;
                var scale = app.screenScale(CONTENT_WIDTH, CONTENT_HEIGHT);
                if (panel.popType == UpManager.STYLE_UP) {
                    panel.scaleX = scale;
                    panel.scaleY = scale;
                }
                UpManager.setPanelPosition(panel);
            }
        };
        UpManager.setPanelPosition = function (panel, style) {
            if (panel === void 0) { panel = UpManager.m_pCurrentPanal; }
            if (GameConfig.getIsNotchScreen() && style == UpManager.STYLE_MAIN_FULL) {
                var img = panel['m_ImgNotch'];
                if (img) {
                    img.width = GameConfig.notchPixel;
                    img.x = -GameConfig.notchPixel;
                }
                panel.width = GameConfig.curWidth() - GameConfig.notchPixel;
                panel.x = GameConfig.notchPixel;
            }
            else {
                panel.anchorOffsetX = panel.width / 2;
                panel.anchorOffsetY = panel.height / 2;
                panel.x = (AGame.R.app.stageWidth) / 2;
                panel.y = (AGame.R.app.stageHeight) / 2;
            }
        };
        UpManager.setNewPanelPosition = function (panel) {
            if (panel === void 0) { panel = UpManager.m_pCurrentPanal; }
            panel.anchorOffsetX = panel.width / 2;
            // panel.anchorOffsetY = panel.height / 2;
            panel.x = (AGame.R.app.stageWidth) / 2;
            panel.y = AGame.R.app.stageHeight;
            var y = AGame.R.app.stageHeight - panel.height;
            egret.Tween.get(panel).to({ y: y + 90 }, 200).to({ y: y - 40 }, 60).to({ y: y }, 30);
        };
        UpManager.mask = function (visible, alpha) {
            if (visible === void 0) { visible = true; }
            if (alpha === void 0) { alpha = 0.8; }
            var layer = AGame.R.app.popUpLevel;
            if (!UpManager.m_pMask) {
                UpManager.m_pMask = new eui.Rect(AGame.R.app.stageWidth, AGame.R.app.stageHeight, 0x000000);
                UpManager.m_pMask.alpha = alpha;
                layer.addChild(UpManager.m_pMask);
                UpManager.m_pMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaskClickListener, this);
            }
            if (UpManager.m_pMask) {
                UpManager.m_pMask.alpha = alpha;
                var index = layer.numChildren - 2 > 0 ? layer.numChildren - 2 : 0;
                layer.setChildIndex(UpManager.m_pMask, index);
                UpManager.m_pMask.visible = visible;
            }
        };
        UpManager.onMaskClickListener = function () {
            if (UpManager.CurrentPanel && UpManager.CurrentPanel['$popShowAction'])
                return;
            // if(UpManager.CurrentPanel._popType == UpManager.STYLE_FULL || UpManager.CurrentPanel._popType == UpManager.STYLE_MAIN_FULL)return;
            if (UpManager.IsClickBackClose) {
                if (UpManager.CurrentPanel.onMaskClick && typeof (UpManager.CurrentPanel.onMaskClick) == 'function') {
                    UpManager.CurrentPanel.onMaskClick();
                }
                // Guide.touchCall(GuideTargetType.Mask);
                UpManager.history(true);
            }
        };
        /**当前界面的名称 */
        UpManager.getCurrentOpenView = function () {
            if (UpManager.m_pCurrentPanal)
                return UpManager.m_pCurrentPanal.name;
            return '';
        };
        /**是否当前界面 */
        UpManager.isCurrentOpenView = function (name) {
            if (UpManager.m_pCurrentPanal)
                return UpManager.m_pCurrentPanal.name == name;
            return false;
        };
        //是否有弹窗
        UpManager.hasPopView = function () {
            return this.m_pCurrentPanal != null;
        };
        UpManager.closeMapLevel = function () {
            AGame.R.app.mapLevel.visible = false;
            AGame.R.app.menuLevel.visible = false;
            com_main.EventMgr.dispatchEvent(NormalEvent.POP_PANEL_UPDATE, false);
        };
        UpManager.showMapLevel = function () {
            var isOpen = true;
            if (UpManager.m_pCurrentPanal && UpManager.m_pCurrentPanal.popType == UpManager.STYLE_MAIN_FULL)
                isOpen = false;
            if (!isOpen) {
                for (var i = 0; i < UpManager.m_pPanels.length; i++) {
                    var panel = UpManager.m_pPanels[i];
                    if (panel.popType == UpManager.STYLE_MAIN_FULL && panel.visible == true) {
                        isOpen = false;
                        break;
                    }
                }
            }
            if (isOpen) {
                AGame.R.app.mapLevel.visible = true;
                AGame.R.app.menuLevel.visible = true;
                com_main.EventMgr.dispatchEvent(NormalEvent.POP_PANEL_UPDATE, true);
            }
            else {
                this.closeMapLevel();
            }
        };
        UpManager.m_pPanels = [];
        UpManager.m_pCurrentPanal = null;
        UpManager.STYLE_UP = 1; //普通弹窗
        UpManager.STYLE_FULL = 2; //全屏弹窗
        UpManager.STYLE_MAIN_FULL = 3; //顶置全屏普通关闭事件关不了 关闭地图
        UpManager.IsClickBackClose = true; //不能使用这个变量控制面板 能否点击空白区域关闭
        UpManager.IsShowMenu = true;
        return UpManager;
    }());
    com_main.UpManager = UpManager;
})(com_main || (com_main = {}));
