module com_main {
	/**
	 * 自定义滑动条
	 */

    export class ComIndexBar extends CComponent {
        /**ui显示位置 */
        public static UI_INFOS: { x: number, alpha: number, scale: number }[] = [
            { x: 30, alpha: 0, scale: 0 },
            { x: 55, alpha: 0.5, scale: 0.5 },
            { x: 77, alpha: 0.75, scale: 0.75 },
            { x: 100, alpha: 1, scale: 1 },
            { x: 123, alpha: 0.75, scale: 0.75 },
            { x: 145, alpha: 0.5, scale: 0.5 },
            { x: 170, alpha: 0, scale: 0 },
        ];

        public m_pPoints: eui.Group;
        public m_pRightBtn: eui.Group;
        public m_pLeftBtn: eui.Group;

        private m_nIndex: number;
        private m_nMax: number;
        private m_tImgs: eui.Image[];
        private m_changeFunc: () => void;
        private m_changeObj: any;

        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("common/ComIndexBarSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            this.clearImgAction();
            this.m_changeFunc = null;
            this.m_changeObj = null;
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_nIndex = 0;
            EventManager.addTouchScaleListener(this.m_pLeftBtn, this, () => {
                let val = this.m_nIndex - 1;
                val = Math.max(val, 0);
                this.changeIndex(val);
            })

            EventManager.addTouchScaleListener(this.m_pRightBtn, this, () => {
                let val = this.m_nIndex + 1;
                val = Math.min(val, this.m_nMax - 1);
                this.changeIndex(val);
            })
        }
        /**初始化 */
        public initBar(cur: number, max: number, changeFunc: () => void, changeObj: any) {
            this.m_nIndex = cur;
            this.m_nMax = max;
            this.m_changeFunc = changeFunc;
            this.m_changeObj = changeObj;
            this.createPoint();
        }
        /**获得当前下标 */
        public get index() {
            return this.m_nIndex;
        }
        /**设置当前下标 */
        public set index(curIndex: number) {
            this.m_nIndex = curIndex;
        }
        /**切换按钮回调 */
        private changeIndex(val: number) {
            if (this.m_nIndex == val) return;
            if (this.m_nIndex > val) {
                //右
                this.m_tImgs.unshift(this.m_tImgs.pop());
            } else {
                //左
                this.m_tImgs.push(this.m_tImgs.shift());
            }
            this.m_nIndex = val;
            this.refreshPos(true);
            if (this.m_changeFunc && this.m_changeObj) {
                this.m_changeFunc.call(this.m_changeObj);
            }
        }

        /**创建节点 */
        private createPoint() {
            Utils.removeAllChild(this.m_pPoints);
            this.m_tImgs = [];
            for (let i = 0; i < ComIndexBar.UI_INFOS.length; i++) {
                let img = new eui.Image('border_1017_png');
                AnchorUtil.setAnchorCenter(img);
                img.y = 15;
                this.m_pPoints.addChild(img);
                this.m_tImgs.push(img);
            }
            this.refreshPos();
        }

        /**刷新位置 */
        private refreshPos(isAction: boolean = false) {
            this.clearImgAction();
            let [begin, end] = [this.m_nIndex - 3, this.m_nIndex + 4];  //取值范围为7
            let imgIndex = 0;
            for (let i = begin; i < end; i++) {
                let img = this.m_tImgs[imgIndex];
                if (i < 0 || i >= this.m_nMax) {
                    img.visible = false;
                } else {
                    img.visible = true;
                    let info = ComIndexBar.UI_INFOS[imgIndex];
                    if (isAction) {
                        let tw = egret.Tween.get(img);
                        tw.to({ x: info.x, alpha: info.alpha, scaleX: info.scale, scaleY: info.scale }, 200, Ease.cubicOut);
                    } else {
                        img.x = info.x;
                        img.alpha = info.alpha;
                        NodeUtils.setScale(img, info.scale);
                    }
                }

                imgIndex++;
            }
        }

        /**清理动画 */
        private clearImgAction() {
            for (let i = 0; i < this.m_tImgs.length; i++) {
                egret.Tween.removeTweens(this.m_tImgs[i]);
            }
        }

    }
}