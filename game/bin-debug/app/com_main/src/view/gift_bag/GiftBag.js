// module com_main {
//     export class GiftBag extends eui.Component {
//         public m_pScroll: com_main.GiftBagScroll;
//         public m_pGroup: eui.Group;
//         public m_pR: com_main.CImage;
//         public m_pL: com_main.CImage;
//         public m_pGiftBagNum: eui.EditableText;
//         public m_pBtn: com_main.ComButton;
//         private giftBagArr: any[] = [];
//         private id = 0;
//         public constructor() {
//             super();
//             this.skinName = "GiftBagSkin";
//         }
//         public childrenCreated() {
//             this.initComponent();
//             this.initEvent();
//         }
//         private initComponent() {
//             this.m_pGiftBagNum.maxChars = 10;//限制输入10个字位/字母
//             this.m_pGiftBagNum.prompt = "请输入礼包码";
//         }
//         private addComponent(id: number) {
//             let giftImg = new egret.Bitmap(RES.getRes("tavern_wj_bg_3_png"));
//             giftImg.width = this.m_pGroup.width;
//             giftImg.height = this.m_pGroup.height;
//             giftImg.touchEnabled = true;
//             let tipImg = new egret.Bitmap(RES.getRes("tavern_wj_bg_2_png"));
//             tipImg.width = 80;
//             tipImg.height = 80;
//             tipImg.x = 270;
//             tipImg.y = 0;
//             tipImg.touchEnabled = true;
//             let group = new eui.Group();
//             group.width = this.m_pGroup.width;
//             group.height = this.m_pGroup.height;
//             this.giftBagArr.push({ id: 1, giftImg: giftImg, tipImg: tipImg, group: group });
//             Utils.addChild(this.m_pGroup, group);
//             Utils.addChild(group, giftImg);
//             Utils.addChild(group, tipImg);
//             this.setEvent(giftImg);
//         }
//         private initEvent() {
//             EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClickBtn);
//             EventManager.addTouchScaleListener(this.m_pL, this, this.onClickL);
//             EventManager.addTouchScaleListener(this.m_pR, this, this.onClickR);
//             this.m_pGiftBagNum.addEventListener(egret.Event.CHANGE, this.onGiftBagNumChange, this);
//         }
//         public onDestroy(): void {
//             EventManager.removeEventListeners(this);
//             this.m_pGiftBagNum.removeEventListener(egret.Event.CHANGE, this.onGiftBagNumChange, this);
//         }
//         private setEvent(obj) {
//             obj.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGiftImg, this);
//         }
//         public onClickBtn() {
//             if (this.m_pGiftBagNum.text) {//有输入值
//                 this.id++;
//                 console.log("点击了按钮,id为：" + this.id);
//                 this.addComponent(this.id);
//             }
//         }
//         private onClickL() {
//             this.m_pScroll.scrollToLast();
//         }
//         private onClickR() {
//             this.m_pScroll.scrollToNext();
//         }
//         /**
//          * 输入了礼包码
//          */
//         private onGiftBagNumChange(evt: egret.Event) {
//             Sound.playTap();
//             let input = evt.target;
//             input.text = Utils.trim(input.text);//过滤空格
//             input.text = Utils.filterStr(input.text);//过滤特殊字符
//             /**过滤敏感字 */
//             console.warn("输入礼包码为：" + input.text);
//             //请求服务端
//         }
//         public onClickGiftImg(event: egret.Event) {
//             console.log("点击了图片哦！" + event.target);
//             let obj = event.target;
//             let id = this.searchId(obj);       //使用奖励的id
//             console.log("点击了图片:" + id);
//             Utils.removeFromParent(obj.parent);
//             obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickGiftImg, this);
//         }
//         /**返回点击图片资源时对应的id */
//         private searchId(obj) {
//             for (let i = 0; i < this.giftBagArr.length; i++) {
//                 if (this.giftBagArr[i].giftImg == obj) {
//                     let id = this.giftBagArr[i].id;
//                     this.giftBagArr.splice(i, 1);
//                     return id;
//                 }
//             }
//         }
//         public onClickTipImg() {
//             console.log("点击了提示哦！");
//         }
//     }
// }
