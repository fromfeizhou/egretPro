
// / 单个物品变更结果
// message ValuesMessage {
// 	required int32 operate = 1; 	//物品操作 0修改，1删除 ，2新建
// 	required int32 baseType = 2; 	//物品类型:1数值类型例如，银两，金币，经验 2道具
// 	required int32 itemId = 3; 		//编码，例如:道具id,装备id,资源id link ItemConfig.id
// 	required int64 count = 4; 		//数量
// 	optional int32 position = 5; 	// 位置，例如：背包格子id,装备位置,根据物品类型决定
// 	optional int64 uuid = 6; // 物品的唯一id，不一定有值
// }


module com_main {
    /**奖励飞行动画化全局管理器 */
    class GetAwardFlyUtil {
        private static state: boolean;
        public static addItem(item: ComItemNew) {
            this.state = !this.state;
            item.unAutoRemove = true;
            let pos = item.parent.localToGlobal(item.x, item.y);
            let layer = SceneManager.getLayer(LayerEnums.TOP);
            layer.globalToLocal(pos.x, pos.y, pos);
            layer.addChild(item);
            item.x = pos.x;
            item.y = pos.y;
            item.unAutoRemove = null;

            let tmpScrPos = egret.Point.create(item.x, item.y);
            let tmpCtrlPos = egret.Point.create(item.x - 100, item.y + (250 * (this.state ? -1 : 1)));
            let tmpDstPos = egret.Point.create(GameConfig.curWidth(), GameConfig.curHeight());

            let itemObj = { item: item, lerp: 0 }
            var funcChange = function (): void {
                let curPos = Utils.BezierCurve(tmpScrPos, tmpDstPos, tmpCtrlPos, itemObj.lerp);
                itemObj.item.x = curPos.x;
                itemObj.item.y = curPos.y;
                egret.Point.release(curPos);
            }

            let tw = egret.Tween.get(itemObj, { onChange: funcChange });
            tw.to({ lerp: 1 }, 500);
            //对象回收
            tw.call(() => {
                egret.Point.release(tmpScrPos);
                egret.Point.release(tmpCtrlPos);
                egret.Point.release(tmpDstPos);
                Utils.removeFromParent(item);
            }, this);
        }
    }
	/**
	 * 奖励获取面板相关
	 */
    export class GetRewardView extends CView {
        public static NAME = 'GetRewardView';
        private readonly LINE_COUNT: number = 5;
        private readonly ITEM_INTERVAL: number = 50;
        private readonly ITEM_WIDTH = 100;
        private readonly ITEM_HEIGHT = 100;
        private readonly ITEM_OFFSET = 50;

        private m_pBtnShowNext: eui.Group;
        private m_itemTargetPos: eui.Group;
        private m_itemRoot: eui.Group;
        private m_bg: eui.Group;
        private m_pBgMask: CImage;
        private m_pBg: CImage;
        private m_pItemRootMask: CImage;

        private m_pShowAni: egret.tween.TweenGroup;
        private m_bShowAction: boolean;  //进场动画
        private m_tRewardList: IItemInfo[];
        private m_tItemList: ComItemNew[];      //出现列表
        private m_tWaitList: ComItemNew[];      //等待点击

        private static instance: GetRewardView;
        public static getInstance(): GetRewardView {
            if (!this.instance) {
                this.instance = new GetRewardView();
            }
            return this.instance;
        }

        /**数据初始化 */
        public show(data?: gameProto.IValuesMessage[] | IItemInfo[] | string) {
            if (!data) return;
            if (typeof (data) == "string" && data == '') return;
            if (data.length == 0) return;

            if (this.m_tRewardList) return;
            this.m_bg.alpha = 1;

            this.m_tItemList = [];
            this.m_tWaitList = [];
            this.m_tRewardList = [];
            this.m_bShowAction = true;
            this.m_pShowAni.addEventListener("complete", this.onBgAniFinish, this);
            this.m_pShowAni.play(0);
            EventManager.addTouchScaleListener(this.m_pBtnShowNext, this, this.onClickMask);

            if (data) {
                if (typeof (data) == "string") {
                    data = Utils.parseCommonItemJson(data);
                }
                let resId = [];
                for (let key in data) {
                    let info = data[key];
                    let index = resId.indexOf(info.itemId);
                    if (index >= 0) {
                        this.m_tRewardList[index].count += info.count;
                    } else {
                        resId.push(data[key].itemId);
                        if (info as IItemInfo) {
                            this.m_tRewardList.push(info as IItemInfo);
                        } else {
                            let tmpData = info as gameProto.IValuesMessage;
                            let tmpInfo: IItemInfo = { itemId: tmpData.itemId, count: tmpData.count };
                            this.m_tRewardList.push(tmpInfo);
                        }
                    }
                }
            }

            UpManager.popView(this, UpManager.STYLE_FULL);

        }

        public constructor() {
            super();
            this.name = GetRewardView.NAME;

            this.initApp("reward/GetRewardViewSkin.exml");
        }



        $onRemoveFromStage(): void {
            super.$onRemoveFromStage(false);
        }

        public onDestroy(): void {
            this.m_pShowAni.removeEventListener("complete", this.onBgAniFinish, this);
            EventManager.removeEventListeners(this);
            this.clearItemAct(this.m_tItemList);
            if (this.m_tWaitList) {
                for (let i = 0; i < this.m_tWaitList.length; i++)
                    Utils.removeFromParent(this.m_tWaitList[i]);
                this.m_tWaitList = null;
            }
            this.m_tRewardList = null;
            egret.Tween.removeTweens(this.m_bg);

            super.onDestroy();
        }

        /**清理动画 */
        private clearItemAct(list: any[]) {
            if (!list) return;
            for (let i = 0; i < list.length; i++) {
                egret.Tween.removeTweens(list[i]);
                Utils.removeFromParent(list[i]);
            }
            list = null;
        }


        protected childrenCreated(): void {
            super.childrenCreated();
            if (this.m_tRewardList.length == 0) {
                UpManager.history();
                return;
            }
            this.m_pBg.mask = this.m_pBgMask;
            this.m_itemRoot.mask = this.m_pItemRootMask;


        }
        //显示
        private onClickMask(e: egret.Event) {
            if (this.m_bShowAction) return;
            if (this.m_tWaitList.length > 0) {
                this.doFlyAction();
            }
        }

        //入场动画后开始缓动
        private onBgAniFinish(event: egret.Event): void {
            const item = event.data as egret.tween.TweenItem;
            this.doEnterActoin();
        }


        /**进场动画 */
        private doEnterActoin() {
            let itemCount = this.m_tRewardList.length;
            itemCount = itemCount > this.LINE_COUNT ? this.LINE_COUNT : itemCount;
            let list = this.m_tRewardList.splice(0, itemCount);
            let posList = this.getPosList(itemCount);
            for (let i = 0; i < itemCount; i++) {
                let pos = posList[i];
                let item = ComItemNew.create("name_num");
                item.anchorOffsetX = this.ITEM_WIDTH * 0.5;
                item.anchorOffsetY = this.ITEM_HEIGHT * 0.5;
                item.setItemInfo(list[i].itemId, list[i].count);
                item.x = pos.x;
                item.y = pos.y - this.ITEM_HEIGHT;
                item.alpha = 0;
                this.m_itemRoot.addChildAt(item, 0);

                let tw: Tween = egret.Tween.get(item);
                tw.wait(80 * i)
                tw.to({ y: pos.y, alpha: 1 }, 100, egret.Ease.cubicIn);
                tw.call(this.onActionEnd, this, [item]);
                this.m_tItemList.push(item);
            }
        }

        /**进场动画2 */
        private doNextEngerAction() {
            let itemCount = this.m_tRewardList.length;
            itemCount = itemCount > this.LINE_COUNT ? this.LINE_COUNT : itemCount;
            let list = this.m_tRewardList.splice(0, itemCount);
            let posList = this.getPosList(itemCount);
            for (let i = 0; i < itemCount; i++) {
                let pos = posList[i];
                let item = ComItemNew.create("name_num");
                item.anchorOffsetX = this.ITEM_WIDTH * 0.5;
                item.anchorOffsetY = this.ITEM_HEIGHT * 0.5;
                item.setItemInfo(list[i].itemId, list[i].count);
                item.x = pos.x + this.ITEM_WIDTH;
                item.y = pos.y;
                item.alpha = 0;
                this.m_itemRoot.addChildAt(item, 0);

                let tw: Tween = egret.Tween.get(item);
                tw.to({ x: pos.x, alpha: 1 }, 200, egret.Ease.cubicIn);
                tw.call(this.onActionEnd, this, [item]);
                this.m_tItemList.push(item);
            }

            if (this.m_tItemList.length == 0) {
                egret.Tween.get(this.m_bg).to({ alpha: 0 }, 500);
            }
        }

        /**道具动画结束 */
        private onActionEnd(item: ComItemNew) {
            for (let i = 0; i < this.m_tItemList.length; i++) {
                if (this.m_tItemList[i].itemId == item.itemId) {
                    this.m_tItemList.splice(i, 1);
                    this.m_tWaitList.push(item);
                    break;
                }
            }
            if (this.m_bShowAction && this.m_tItemList.length == 0) {
                this.m_bShowAction = false;
                this.m_pItemRootMask.visible = false;
                this.m_itemRoot.mask = null;
            }
        }

        /**获得位置列表 */
        private getPosList(itemCount: number) {
            let posList: IPos[] = [];
            let centreX = this.m_itemRoot.width * 0.5;
            let centreY = this.m_itemRoot.height * 0.5;
            let startX = centreX - (itemCount * (this.ITEM_WIDTH + this.ITEM_INTERVAL) - this.ITEM_INTERVAL) * 0.5 + this.ITEM_WIDTH * 0.5;
            for (let i = 0; i < itemCount; i++) {
                posList.push({ x: startX + i * (this.ITEM_WIDTH + this.ITEM_INTERVAL), y: centreY });
            }
            return posList;
        }

        /**飞行动画 */
        private doFlyAction() {
            for (let i = 0; i < this.m_tWaitList.length; i++) {
                let item = this.m_tWaitList[i];
                GetAwardFlyUtil.addItem(item);
            }
            this.m_tWaitList = [];
            if (this.m_tRewardList.length == 0 && this.m_tItemList.length == 0) {
                //关闭界面
                UpManager.history();
                EventMgr.dispatchEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, null);
                return;
            }
            this.doNextEngerAction();
        }

        /**飞行结束 */
        // private onflyEnd(item: ComItemNew) {
        //     for (let i = 0; i < this.m_tFlyList.length; i++) {
        //         if (this.m_tFlyList[i].item.itemId == item.itemId) {
        //             this.m_tFlyList.splice(i, 1);
        //             break;
        //         }
        //     }

        //     if (this.m_tFlyList.length > 0) return;
        //     // this.m_bFlyAction = false;
        //     /**动画结束 */
        //     if (this.m_tRewardList.length == 0 && this.m_tItemList.length == 0 && this.m_tWaitList.length == 0) {
        //         //关闭界面
        //         UpManager.history();
        //         EventMgr.dispatchEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, null);
        //     }
        // }

    }
}