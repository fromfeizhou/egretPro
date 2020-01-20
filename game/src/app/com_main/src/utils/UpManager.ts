module com_main {
    export class UpManager {
        public constructor() {
        }

        private static m_pPanels: CView[] = [];
        private static m_pCurrentPanal: CView = null;
        public static m_pMask: eui.Rect;

        public static STYLE_UP: number = 1;			//普通弹窗
        public static STYLE_FULL: number = 2;		//全屏弹窗
        public static STYLE_MAIN_FULL: number = 3;  //顶置全屏普通关闭事件关不了 关闭地图

        private static IsClickBackClose = true;      //不能使用这个变量控制面板 能否点击空白区域关闭
        public static IsShowMenu = true;

        public static get CurrentPanel(): CView {
            return UpManager.m_pCurrentPanal;
        }

        public static get panelSize(): number {
            return UpManager.m_pPanels.length;
        }

        /**调整当前显示界面 */
        public static updateView(node: CView, preVisible = true, isShowMask = true) {
            UpManager.addPanel(false, preVisible);
            UpManager.m_pCurrentPanal = node;
            for (let i = 0; i < UpManager.m_pPanels.length; i++) {
                let tmpView = UpManager.m_pPanels[i];
                if (node.name == tmpView.name) {
                    UpManager.m_pPanels.splice(i, 1);
                    break;
                }
            }
            node.visible = true;
            AGame.R.app.popUpLevel.addChild(node);
            UpManager.mask(isShowMask);
        }

        public static popView(node: CView, style: number = UpManager.STYLE_UP, preVisible = true, isEnterHistory = true, showType = 0, isShowMask = true) {
            // Sound.playID(134);
            if (style == UpManager.STYLE_UP) {
                this.setScale(node);
            } else if (style == UpManager.STYLE_FULL) {
                this.setScale(node, true);
            } else if (style == UpManager.STYLE_MAIN_FULL) {
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
        }

        public static popChatView(node: any, title?: string, historyshow: boolean = true,
            style: number = UpManager.STYLE_UP, preVisible = false) {
            // Sound.playID(134);
            this.setScale(node);
            if (UpManager.m_pCurrentPanal) {
                UpManager.m_pCurrentPanal.touchEnabled = false;
                UpManager.m_pPanels.push(UpManager.m_pCurrentPanal);
            }
            UpManager.m_pCurrentPanal = node;
            AGame.R.app.popUpLevel.addChild(node);
            if (title) {
                APopUp.setTitleLabel(node, title, this.isShowBack());
            }
            UpManager.m_pCurrentPanal.popType = style;
            UpManager.resize();
            node.scaleX = node.scaleX * 1.15;
            node.scaleY = node.scaleY * 1.15;
            UpManager.mask();
            if (UpManager.panelSize == 0) UpManager.popUpShow(UpManager.m_pCurrentPanal);
        }

        public static popSmallView(node: any, title?: string, isClear?: boolean, alpha: number = 0, fullView = false, preVisible = true): void {
            // Sound.playID(134);
            this.setScale(node, fullView);
            UpManager.addPanel(isClear, preVisible);
            UpManager.m_pCurrentPanal = node;
            UpManager.m_pCurrentPanal.popType = UpManager.STYLE_UP;
            AGame.R.app.popUpLevel.addChild(node);

            if (title) {
                APopUp.setTitle(node, title, this.isShowBack());
            } else {
                let popUpComponent: APopUp = APopUp.getPopUp(node);
                if (popUpComponent) popUpComponent.titleShow = false;
            }

            UpManager.setPanelPosition(node);
            UpManager.popUpShow(UpManager.m_pCurrentPanal);
            UpManager.m_pCurrentPanal.validateNow();
            UpManager.mask(true, alpha);
        }

        public static popNew(node: any, title?: string, icon?: string, isClear?: boolean) {
            // Sound.playID(134);
            // this.setScale(node);
            UpManager.addPanel(isClear, true);
            UpManager.m_pCurrentPanal = node;
            AGame.R.app.popUpLevel.addChild(node);

            if (title) {
                APopUp.setTitle(node, title, this.isShowBack());
            } else {
                let popUpComponent: APopUp = APopUp.getPopUp(node);
                if (popUpComponent) popUpComponent.titleShow = false;
            }

            if (icon && icon != "") {
                APopUp.setIcon(node, icon, this.isShowBack());
            } else {
                let popUpComponent: APopUp = APopUp.getPopUp(node);
                if (popUpComponent) popUpComponent.iconShow = false;
            }

            UpManager.setNewPanelPosition(node);
            UpManager.m_pCurrentPanal.validateNow();
            UpManager.mask(true, 0);
        }

        public static setScale(node: any, fullView: boolean = false) {
            let scaleY = GameConfig.curHeight() / 750;
            let scaleX = GameConfig.curWidth() / 1334;
            let scale = Math.min(scaleY, scaleX);

            let name = node.name;

            if (fullView) {
                scale = 1;
                node.width = AGame.R.app.stageWidth;
            }

            if (scale < 0.9)
                scale += 0.05;

            node.scaleX = scale;
            node.scaleY = scale;
        }

        public static isShowBack() {
            return this.m_pPanels.length > 0;
        }


        private static addPanel(isClear?: boolean, isVisible: boolean = true): void {
            if (isClear) {
                UpManager.close();
            } else if (UpManager.m_pCurrentPanal) {
                // if (UpManager.m_pCurrentPanal.popType != this.STYLE_MAIN_FULL) {
                UpManager.m_pCurrentPanal.visible = isVisible;
                // }

                UpManager.m_pCurrentPanal.touchEnabled = false;
                UpManager.m_pPanels.push(UpManager.m_pCurrentPanal);
            }
        }
        /**添加面板 */
        public static addPanelInPopLayer(node: any) {
            UpManager.m_pPanels.push(node);
            AGame.R.app.popUpLevel.addChild(node);
        }

        public static close(bAnima: boolean = false, isSuper: boolean = true): void {
            var callback: Function = function () {
                UpManager.removePanel(UpManager.m_pCurrentPanal, isSuper);
                UpManager.m_pCurrentPanal = null;

                for (var i: number = 0; i < UpManager.m_pPanels.length; i++) {
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
            } else {
                callback();
            }
        }

        public static history(bAnima: boolean = false): void {

            MainMap.hideGlow();
            let panel = UpManager.m_pCurrentPanal;
            UpManager.m_pCurrentPanal = null;
            var callback: Function = function () {
                UpManager.removePanel(panel, true);
                //面板注释函数 添加新的当前面板 不在队列拿面板
                if (UpManager.m_pCurrentPanal) return;
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
                } else {
                    UpManager.mask(false);
                }

                // 开地图
                UpManager.showMapLevel();
                //空场景判断
                if (UpManager.m_pCurrentPanal == null) SceneManager.onSceneWndEnter();

            };
            if (UpManager.panelSize == 0 && bAnima) {
                callback();
                // UpManager.popUpClose(UpManager.m_pCurrentPanal, callback);
            } else {
                callback();
            }
        }
        //删除所有面板
        public static removeAllPanel() {
            this.close();
        }
        private static removePanel(panel: CView = null, isSuper: boolean = false): void {
            if (!panel) panel = UpManager.m_pCurrentPanal;
            if (!panel) return;
            panel.onDestroy();
            if (panel.parent) {
                panel.parent.removeChild(panel);
                panel = null;
            }
        }

        private static popUpClose(panel: CView, callback?: Function): void {
            if (panel) {
                var tw: TweenAnim = TweenAnim.get(panel);
                var scale: number = panel.scaleX;
                tw.to({ scaleX: 1.05 * scale, scaleY: 1.05 * scale }, 50)
                    .to({ scaleX: scale, scaleY: scale }, 150)
                    .to({ alpha: 0.01 }, 180)
                    .call(function () {
                        if (callback) callback();
                        TweenAnim.removeTweens(panel);
                    });
            } else {
                if (callback) callback();
            }
        }

        private static popUpShow(panel: CView, callback?: Function): void {
            let style = panel.popType;
            var tw: egret.Tween = egret.Tween.get(panel);

            if (style == UpManager.STYLE_UP) {
                var scale: number = panel.scaleX;
                panel.scaleX = 0.5;
                panel.scaleY = 0.5;
                panel.alpha = 0.01;
                panel['$popShowAction'] = true;
                tw.to({ scaleX: scale, scaleY: scale, scale, alpha: 1 }, 300, Ease.backOut);
            } else {
                panel.alpha = 0.01;
                tw.to({ alpha: 1 }, 75);
            }

            tw.call(function () {
                panel['$popShowAction'] = false;
                if (callback) callback();
            });
        }

        public static resize(panel: CView = UpManager.m_pCurrentPanal): void {
            if (panel) {
                panel.resize();
                var app = AGame.R.app;
                var scale: number = app.screenScale(CONTENT_WIDTH, CONTENT_HEIGHT);
                if (panel.popType == UpManager.STYLE_UP) {
                    panel.scaleX = scale;
                    panel.scaleY = scale;
                }
                UpManager.setPanelPosition(panel);
            }
        }

        public static setPanelPosition(panel: CView = UpManager.m_pCurrentPanal, style?: number) {
            if (GameConfig.getIsNotchScreen() && style == UpManager.STYLE_MAIN_FULL) {
                let img = panel['m_ImgNotch'];
                if (img) {
                    img.width = GameConfig.notchPixel;
                    img.x = -GameConfig.notchPixel;
                }
                panel.width = GameConfig.curWidth() - GameConfig.notchPixel;
                panel.x = GameConfig.notchPixel;
            } else {
                panel.anchorOffsetX = panel.width / 2;
                panel.anchorOffsetY = panel.height / 2;
                panel.x = (AGame.R.app.stageWidth) / 2;
                panel.y = (AGame.R.app.stageHeight) / 2;
            }
        }

        public static setNewPanelPosition(panel: CView = UpManager.m_pCurrentPanal) {
            panel.anchorOffsetX = panel.width / 2;
            // panel.anchorOffsetY = panel.height / 2;
            panel.x = (AGame.R.app.stageWidth) / 2;
            panel.y = AGame.R.app.stageHeight;

            let y = AGame.R.app.stageHeight - panel.height;

            egret.Tween.get(panel).to({ y: y + 90 }, 200).to({ y: y - 40 }, 60).to({ y: y }, 30);
        }

        public static mask(visible: boolean = true, alpha: number = 0.8): void {
            var layer: egret.DisplayObjectContainer = AGame.R.app.popUpLevel;
            if (!UpManager.m_pMask) {
                UpManager.m_pMask = new eui.Rect(AGame.R.app.stageWidth, AGame.R.app.stageHeight, 0x000000);
                UpManager.m_pMask.alpha = alpha;
                layer.addChild(UpManager.m_pMask);
                UpManager.m_pMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onMaskClickListener, this);
            }

            if (UpManager.m_pMask) {
                UpManager.m_pMask.alpha = alpha;
                var index: number = layer.numChildren - 2 > 0 ? layer.numChildren - 2 : 0;
                layer.setChildIndex(UpManager.m_pMask, index);
                UpManager.m_pMask.visible = visible;
            }

        }


        private static onMaskClickListener() {
            if (UpManager.CurrentPanel && UpManager.CurrentPanel['$popShowAction']) return

            // if(UpManager.CurrentPanel._popType == UpManager.STYLE_FULL || UpManager.CurrentPanel._popType == UpManager.STYLE_MAIN_FULL)return;
            if (UpManager.IsClickBackClose) {
                if (UpManager.CurrentPanel.onMaskClick && typeof (UpManager.CurrentPanel.onMaskClick) == 'function') {
                    UpManager.CurrentPanel.onMaskClick();
                }
                // Guide.touchCall(GuideTargetType.Mask);
                UpManager.history(true);

            }
        }


        /**当前界面的名称 */
        public static getCurrentOpenView() {
            if (UpManager.m_pCurrentPanal)
                return UpManager.m_pCurrentPanal.name;
            return '';
        }

        /**是否当前界面 */
        public static isCurrentOpenView(name): boolean {
            if (UpManager.m_pCurrentPanal)
                return UpManager.m_pCurrentPanal.name == name;
            return false;
        }


        //是否有弹窗
        public static hasPopView(): boolean {
            return this.m_pCurrentPanal != null;
        }

        public static closeMapLevel() {
            AGame.R.app.mapLevel.visible = false;
            AGame.R.app.menuLevel.visible = false;
            EventMgr.dispatchEvent(NormalEvent.POP_PANEL_UPDATE, false);
        }
        public static showMapLevel() {
            let isOpen = true;
            if (UpManager.m_pCurrentPanal && UpManager.m_pCurrentPanal.popType == UpManager.STYLE_MAIN_FULL) isOpen = false;
            if (!isOpen) {
                for (var i: number = 0; i < UpManager.m_pPanels.length; i++) {
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
                EventMgr.dispatchEvent(NormalEvent.POP_PANEL_UPDATE, true);
            } else {
                this.closeMapLevel();
            }



        }
    }
}