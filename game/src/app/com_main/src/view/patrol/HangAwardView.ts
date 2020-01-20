module com_main {
    export class HangAwardView extends CView {
        public static NAME = "HangAwardView";

        private readonly ITEM_COUNT: number = 10;
        private readonly ITEM_INTERVAL: number = 50;
        private readonly ITEM_WIDTH = 100;
        private readonly ITEM_HEIGHT = 100;

        public m_pRoot: eui.Group;
        public group: eui.Group;
        public m_apopUp: com_main.APopUp;
        public m_pTtime: eui.Label;
        public m_itemRoot: eui.Group;
        public m_bg: eui.Group;
        public m_pBtnShowNext: eui.Group;



        private m_tRewardList: IItemInfo[];
        private m_tItemList: ComItemNew[];      //出现列表
        private m_tFlyList: { item: ComItemNew, lerp: number }[];       //飞行中
        // private m_tWaitList: ComItemNew[];      //等待点击
        private m_flyCout: number = 0;
        private timeKey: number = 0;
        private dt: number = 0;

        public constructor(data?: gameProto.IValuesMessage[] | IItemInfo[] | string) {
            super();
            this.name = HangAwardView.NAME;
            this.initApp("patrol/HangAwardViewSkin.exml");
            this.initData(data);
        }

        public onDestroy(): void {
            Utils.TimerManager.remove(this.timeCallback, this);
            this.clearItemAct(this.m_tItemList);
            this.clearItemAct(this.m_tFlyList);
            egret.clearTimeout(this.timeKey);
            if (this.m_pRoot)
                egret.Tween.removeTweens(this.m_pRoot)
            if (this.m_bg)
                egret.Tween.removeTweens(this.m_bg)
            super.onDestroy();
        }
        /**清理动画 */
        private clearItemAct(list: any[]) {
            if (!list) return;
            for (let i = 0; i < list.length; i++) {
                egret.Tween.removeTweens(list[i]);
            }
            list = null;
        }
        protected childrenCreated() {
            super.childrenCreated();
            
            this.m_tFlyList = [];
            this.refresh();
            this.initEvent();
            this.dt = 0;
            this.m_pTtime.text = Utils.DateUtils.getFormatBySecond(this.dt, 1)
            Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
        }

        private initEvent() {
            EventManager.addTouchScaleListener(this.m_pBtnShowNext, this, this.onClickMask);
        }
        //显示
        private onClickMask(e: egret.Event) {
            // UpManager.history();
            // if (this.m_bShowAction) return;

            this.doFlyAction();

        }
        /**飞行动画 */
        private doFlyAction() {
            // if (this.m_bFlyAction) return;
            // this.m_bFlyAction = true;
            for (let i = 0; i < this.m_tItemList.length; i++) {
                let item = this.m_tItemList[i];

                let tmpScrPos = egret.Point.create(item.x, item.y);
                let tmpCtrlPos = egret.Point.create(item.x - 100, item.y + (250 * (i % 2 == 1 ? -1 : 1)));
                let tmpDstPos = egret.Point.create(1334, 520);

                let itemObj = { item: item, lerp: 0 }
                var funcChange = function (): void {
                    let curPos = Utils.BezierCurve(tmpScrPos, tmpDstPos, tmpCtrlPos, itemObj.lerp);
                    itemObj.item.x = curPos.x;
                    itemObj.item.y = curPos.y;
                    egret.Point.release(curPos);
                }

                let tw = egret.Tween.get(itemObj, { onChange: funcChange });
                tw.wait(i * 100);
                tw.to({ lerp: 1 }, 500);
                 //对象回收
				tw.call(()=>{
					egret.Point.release(tmpScrPos);
					egret.Point.release(tmpCtrlPos);
                    egret.Point.release(tmpDstPos)
				}, this);
                tw.call(this.onflyEnd, this, [itemObj.item]);
                this.m_tFlyList.push(itemObj);
            }
            this.m_tItemList = [];
            if (this.m_tRewardList.length <= 0) {
                egret.Tween.get(this.m_pRoot).to({ alpha: 0 }, 800).call(() => {
                    egret.Tween.removeTweens(this.m_pRoot)
                });
                egret.Tween.get(this.m_bg).to({ alpha: 0 }, 800).call(() => {
                    egret.Tween.removeTweens(this.m_bg)
                });
            }

        }
        /**飞行结束 */
        private onflyEnd(item: ComItemNew) {
            this.m_flyCout++;
            for (let i = 0; i < this.m_tFlyList.length; i++) {
                if (this.m_tFlyList[i].item.itemId == item.itemId) {
                    this.m_tFlyList.splice(i, 1);
                    break;
                }
            }

            if (this.m_tFlyList.length > 0) return;
            if (this.m_flyCout == this.ITEM_COUNT && this.m_tRewardList.length > 0) {
                this.createItemList();
                this.timeKey = egret.setTimeout(() => {
                    this.doFlyAction();
                }, this, 500);
                return;
            }
            // this.m_bFlyAction = false;
            /**动画结束 */
            if (this.m_tRewardList.length == 0 && this.m_tItemList.length == 0) {
                //关闭界面
                UpManager.history();
            }
        }
        private timeCallback() {
            this.dt++
            this.m_pTtime.text = Utils.DateUtils.getFormatBySecond(this.dt, 1)
        }

        /**数据初始化 */
        private initData(data?: gameProto.IValuesMessage[] | IItemInfo[] | string) {
            this.m_tRewardList = [];
            if (data) {
                if (typeof (data) == "string") {
                    data = Utils.parseCommonItemJson(data);
                }
                let resId = [];
                for (let key in data) {
                    let info = data[key];
                    let index = resId.indexOf(info.itemId);
                    if (index >= 0) {
                        if (this.m_tRewardList[index].count) {
                            this.m_tRewardList[index].count = (<gameProto.IValuesMessage>info).count;
                        } else {
                            this.m_tRewardList[index].count += (<IItemInfo>info).count;
                        }
                    } else {
                        resId.push(data[key].itemId);
                        if (info as IItemInfo) {
                            this.m_tRewardList.push(info as IItemInfo);
                        } else {
                            let tmpData = info as gameProto.IValuesMessage;
                            let tmpInfo: IItemInfo = {itemId: tmpData.itemId, count: tmpData.count };
                            this.m_tRewardList.push(tmpInfo);
                        }
                    }
                }
            }
            this.createItemList();
        }
        public createItemList() {
            let itemCount = this.m_tRewardList.length;
            itemCount = itemCount > this.ITEM_COUNT ? this.ITEM_COUNT : itemCount;

            let list = this.m_tRewardList.splice(0, itemCount);
            let posList = this.getPosList(itemCount);
            this.m_tItemList = [];
            for (let i = 0; i < itemCount; i++) {
                let pos = posList[i];
                let item = ComItemNew.create("name_num");
                item.anchorOffsetX = this.ITEM_WIDTH * 0.5;
                item.anchorOffsetY = this.ITEM_HEIGHT * 0.5;
                item.setItemInfo(list[i].itemId, list[i].count);
                item.x = pos.x + this.ITEM_WIDTH;
                item.y = pos.y;
                item.alpha = 0;
                let tw: Tween = egret.Tween.get(item);
                tw.wait(100 * i)
                tw.to({ x: pos.x, alpha: 1 }, 200, egret.Ease.cubicIn);
                tw.call(this.onActionEnd, this, [item]);
                this.m_itemRoot.addChildAt(item, 0);
                this.m_tItemList.push(item);
            }
        }
        /**道具动画结束 */
        private onActionEnd(item: ComItemNew) {
            egret.Tween.removeTweens(item);
        }
        /**获得位置列表 */
        private getPosList(itemCount: number) {
            // itemCount > this.LINE_COUNT ? this.LINE_COUNT : itemCount;
            let posList: IPos[] = [];
            let centreX = this.m_itemRoot.width * 0.5;
            let centreY = this.ITEM_HEIGHT / 2;
            let startX = 0;
            let count = 0;
            for (let i = 0; i < itemCount; i++) {
                if (itemCount < 5) {
                    startX = centreX - (itemCount * (this.ITEM_WIDTH + this.ITEM_INTERVAL) - this.ITEM_INTERVAL) * 0.5 + this.ITEM_WIDTH * 0.5;
                    posList.push({ x: startX + i * (this.ITEM_WIDTH + this.ITEM_INTERVAL), y: centreY });
                    continue;
                }
                centreY = i >= 5 ? this.ITEM_HEIGHT * 1.5 + 50 : 50;
                count = i >= 5 ? (itemCount - 5) : 5;
                startX = centreX - (count * (this.ITEM_WIDTH + this.ITEM_INTERVAL) - this.ITEM_INTERVAL) * 0.5 + this.ITEM_WIDTH * 0.5;
                posList.push({ x: startX + i % 5 * (this.ITEM_WIDTH + this.ITEM_INTERVAL), y: centreY });
            }
            return posList;
        }
        /**刷新面板 */
        private refresh() {
            this.m_apopUp.titleShow = false;
            this.m_apopUp.getCloseBtn().visible = false;
            this.m_apopUp.setTitleLabelVisible(false);
        }

    }
}