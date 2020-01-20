// /**
// * 1. 从自定义组件中找到ItemScroller，并拖动到exml上
// * 2. 将需要显示对象(图片等)拖动到ItemScroller的Group下
// * 3. 设置Group的布局为垂直or水平
// */
// module com_main {
//     export class GiftBagScroll extends eui.Scroller {
//         /**滚动完成*/
//         public static EVENT_SCROLL_COMPLETE: string = "EVENT_SCROLL_COMPLETE";
//         /**滚动项数量*/
//         public itemNum: number;
//         /**单个滚动项长度*/
//         public itemSize: number;
//         /**当前滚动到第几项  0表示第1项*/
//         public curItemCount: number = 0;
//         /**滚动时间*/
//         public delayScroll: number = 250;
//         /**是否是水平滚动*/
//         public isHScroller: Boolean;
//         /**触摸起始位置*/
//         private touchStartPos: number;
//         /**当前触摸位置和起始触摸位置距离*/
//         private touchDist: number;
//         /**滚动中*/
//         private bScrolling: Boolean = false;
//         public constructor() {
//             super();
//         }
//         public childrenCreated(): void {
//             //立即验证，获取width、height
//             this.validateNow();
//             this.setState();
//             //滚动容器设置
//             this.throwSpeed = 0;
//             this.bounces = true;
//             this.addEventListener(eui.UIEvent.CHANGE_START, this.onChangeStartHandler, this);
//             this.addEventListener(eui.UIEvent.CHANGE_END, this.onChangeEndHandler, this);
//         }
//         public setState() {
//             //判断是垂直还是水平滚动
//             var widthDist: number = this.viewport.contentWidth - this.viewport.width;
//             if (widthDist > 0) {
//                 this.isHScroller = true;
//                 this.itemSize = this.viewport.width;
//                 this.itemNum = this.viewport.contentWidth / this.viewport.width;
//             } else {
//                 this.isHScroller = false;
//                 this.itemSize = this.viewport.height;
//                 this.itemNum = this.viewport.contentHeight / this.viewport.height;
//             }
//         }
//         /**可以滚动*/
//         public start() {
//             this.touchEnabled = true;
//             this.touchChildren = true;
//         }
//         /**禁用滚动*/
//         public stop() {
//             this.touchEnabled = false;
//             this.touchChildren = false;
//         }
//         /**拖动开始*/
//         private onChangeStartHandler() {
//             // this.setState();
//             console.log("ItemScroller >> " + "change start");
//             if (this.isHScroller) {
//                 this.touchStartPos = this.viewport.scrollH;
//             } else {
//                 this.touchStartPos = this.viewport.scrollV;
//             }
//         }
//         /**拖动结束*/
//         private onChangeEndHandler(): void {
//             console.log("ItemScroller >> " + "change end");
//             if (this.touchStartPos == -1) { //防点击触发changeend
//                 return;
//             }
//             var dict: number;
//             if (this.isHScroller) {
//                 dict = this.viewport.scrollH - this.touchStartPos;
//             } else {
//                 dict = this.viewport.scrollV - this.touchStartPos;
//             }
//             if (dict > 0) {
//                 this.scrollToNext();
//             } else if (dict < 0) {
//                 this.scrollToLast();
//             }
//             this.touchStartPos = -1;
//         }
//         /**滑动到下一项*/
//         public scrollToNext(): void {
//             this.setState();
//             if (this.bScrolling) {
//                 return;
//             }
//             var item: number = this.curItemCount;
//             if (item < this.itemNum - 1) {
//                 item++;
//             }
//             this.scrollToItem(item);
//         }
//         /**滑动到上一项*/
//         public scrollToLast(): void {
//             this.setState();
//             if (this.bScrolling) {
//                 return;
//             }
//             var item: number = this.curItemCount;
//             if (item > 0) {
//                 item--;
//             }
//             this.scrollToItem(item);
//         }
//         /**
//          * 滚动到指定项 (0是第一项)
//          * @item 指定项
//          */
//         public scrollToItem(item: number): void {
//             if (this.bScrolling) {
//                 return;
//             }
//             if (item >= 0 && item < this.itemNum) {
//                 this.bScrolling = true;
//                 this.disableTouch();
//                 this.curItemCount = item;
//                 egret.Tween.removeTweens(this.viewport);
//                 if (this.isHScroller) {
//                     egret.Tween.get(this.viewport).to({ scrollH: item * this.itemSize, ease: egret.Ease.quadOut }, this.delayScroll);
//                 } else {
//                     egret.Tween.get(this.viewport).to({ scrollV: item * this.itemSize, ease: egret.Ease.quadOut }, this.delayScroll);
//                 }
//                 egret.Tween.get(this.viewport).wait(this.delayScroll).call(() => {
//                     this.bScrolling = false;
//                     this.enableTouch();
//                     this.dispatchEventWith(GiftBagScroll.EVENT_SCROLL_COMPLETE, false, this.curItemCount);
//                 }, this);
//             }
//         }
//         public enableTouch() {
//             this.touchEnabled = true;
//             this.touchChildren = true;
//         }
//         public disableTouch() {
//             this.touchChildren = false;
//             this.touchEnabled = false;
//         }
//         /**销毁*/
//         public destroy() {
//             this.removeEventListener(eui.UIEvent.CHANGE_START, this.onChangeStartHandler, this);
//             this.removeEventListener(eui.UIEvent.CHANGE_END, this.onChangeEndHandler, this);
//         }
//     }
// }
