module com_main {
	export class WorldCityNewOpenPanel extends CView {
		public static NAME = 'WorldCityNewOpenPanel';
		public m_touchGroup: eui.Group;
		public m_pName: eui.Label;
		public m_RewardRoot: eui.Group;
		public m_pBtnShowNext: eui.Group;

		private readonly LINE_COUNT: number = 5;
		private readonly ITEM_INTERVAL: number = 20;
		private readonly ITEM_WIDTH = 100;
		private readonly ITEM_HEIGHT = 100;

		private m_cityId: number;
		private m_nTimeOutId: number;
		private m_nTimeCloseId: number;

		private m_tRewardList: IItemInfo[];
		private m_tItemList: ComItemNew[];      //出现列表
		private m_tFlyList: { item: ComItemNew, lerp: number }[];       //飞行
		public constructor(data: any) {
			super();
			this.m_cityId = data.cityId;
			this.initApp("world/WorldCityNewOpenPanelSkin.exml");
		}

		public onDestroy() {
			this.m_nTimeOutId = egret.setTimeout(() => {
				com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_RES_UPDATE, this.m_cityId);
				egret.clearTimeout(this.m_nTimeOutId);
				this.clearItemAct(this.m_tItemList);
				this.clearItemAct(this.m_tFlyList);
				super.onDestroy();
			}, this, 400);
			egret.Tween.removeTweens(this.m_touchGroup)

		}
		/**清理动画 */
		private clearItemAct(list: any[]) {
			if (!list) return;
			for (let i = 0; i < list.length; i++) {
				egret.Tween.removeTweens(list[i]);
			}
			list = null;
		}
		protected childrenCreated(): void {
			super.childrenCreated();
			this.initEvent();
			this.updateUI();
		}
		public updateUI() {
			let worldMapCfg: WorldMapConfig = C.WorldMapConfig[this.m_cityId];
			if (isNull(worldMapCfg))
				return;
			this.m_tFlyList = [];
			this.initData(worldMapCfg.unlockReward)
			this.m_touchGroup.alpha = 0;
			this.m_touchGroup.scaleX = 0.1;
			this.m_touchGroup.scaleY = 1;
			this.m_pName.text = GLan(worldMapCfg.name);
			egret.Tween.get(this.m_touchGroup).wait(100).to({ scaleX: 1, alpha: 1 }, 200).call(() => {
			}, this);

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
							let tmpInfo: IItemInfo = { itemId: tmpData.itemId, count: tmpData.count };
							this.m_tRewardList.push(tmpInfo);
						}
					}
				}
			}
			this.createItemList();
		}
		/**飞行结束 */
		private onflyEnd(item: ComItemNew) {
			for (let i = 0; i < this.m_tFlyList.length; i++) {
				if (this.m_tFlyList[i].item.itemId == item.itemId) {
					this.m_tFlyList.splice(i, 1);
					break;
				}
			}

			if (this.m_tFlyList.length > 0) return;
			if (this.m_tRewardList.length == 0 && this.m_tItemList.length == 0) {
				this.onHandler();
			}
		}
		public createItemList() {
			let itemCount = this.m_tRewardList.length;
			let list = this.m_tRewardList.splice(0, itemCount);
			let posList = this.getPosList(itemCount);
			this.m_tItemList = [];
			for (let i = 0; i < itemCount; i++) {
				let pos = posList[i];
				let item = ComItemNew.create("name_num");
				item.anchorOffsetX = this.ITEM_WIDTH * 0.5;
				item.anchorOffsetY = this.ITEM_HEIGHT * 0.5;
				item.setItemInfo(list[i].itemId, list[i].count);
				item.x = pos.x;
				item.y = pos.y;
				this.m_RewardRoot.addChildAt(item, 0);
				this.m_tItemList.push(item);
			}
		}

		/**获得位置列表 */
		private getPosList(itemCount: number) {
			let posList: IPos[] = [];
			let centreX = this.m_RewardRoot.width * 0.5;
			let centreY = this.ITEM_HEIGHT / 2;
			let startX = centreX - (itemCount * (this.ITEM_WIDTH + this.ITEM_INTERVAL) - this.ITEM_INTERVAL) * 0.5 + this.ITEM_WIDTH * 0.5;
			for (let i = 0; i < itemCount; i++) {
				posList.push({ x: startX + i * (this.ITEM_WIDTH + this.ITEM_INTERVAL), y: centreY });
			}
			return posList;
		}
		/**=====================================================================================
	   * 事件监听 begin
	   * =====================================================================================
	   */

		private initEvent() {
			EventManager.addTouchScaleListener(this.m_pBtnShowNext, this, this.onClickMask);
		}
		//显示
		private onClickMask(e: egret.Event) {
			this.doFlyAction();

		}
		/**飞行动画 */
		private doFlyAction() {
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

		}
		/**跳转前往 */
		public onHandler() {
			if (this.m_touchGroup) egret.Tween.get(this.m_touchGroup).to({ scaleX: 0.1, scaleY: 0.1, alpha: 0.1 }, 200).call(() => {
			}, this)
			this.m_nTimeCloseId = egret.setTimeout(() => {
				egret.clearTimeout(this.m_nTimeCloseId);
				UpManager.history();
			}, this, 200)
		}

	}
}