// TypeScript file

module com_main {
	export class NewGenVisPanel extends DynamicComponent {

		public m_allGroup: eui.Group;
		public m_btnChange: com_main.ComButton;
		public m_itemList: eui.Group;
		public m_btnVis: com_main.ComButton;
		public m_btnVisTen: com_main.ComButton;
		public m_pCostIcon0: com_main.CImage;
		public m_pLbCostName0: com_main.CLabel;
		public m_pLbCost0: com_main.CLabel;
		public m_pCostIcon1: com_main.CImage;
		public m_pLbCostName1: com_main.CLabel;
		public m_pLbCost1: com_main.CLabel;
		public m_lbUseDes: eui.Label;
		public m_lbUseNum: eui.Label;
		public m_lbResetDes: eui.Label;
		public m_boxPro: com_main.BoxPro;


		private m_effect: MCDragonBones;	//按钮特效

		private m_vo: AcNewGenVisVo;           //活动数据
		private m_onceCostNum: number; //拜访1次消耗的信物数量
		private m_tenCostNum: number; //拜访10次消耗的信物数量
		public constructor() {
			super();
			this.dynamicSkinName = Utils.getAppSkin("activity/newGeneral/NewGenVisSkin.exml");
		}

		public onDestroy(): void {
			super.onDestroy();
			this.removeEvent();
			this.clearBtnEff();
		}

		protected onShow() {
			this.m_vo = ActivityModel.getActivityVo<AcNewGenVisVo>(AcViewType.NEW_GEN_VIS);

			this.initEvent();
			// this.m_btnVis.setTitleLabel(GCode(CLEnum.NEW_GEN_BF));
			this.m_btnChange.setTitleLabel(GCode(CLEnum.NEW_GEN_GHJL))

			this.m_onceCostNum = this.m_vo.getVisCost().count;
			this.m_btnVis.setTitleLabel('拜访1次');
			// this.m_btnVis.setCostImg('common_prop_1001_png');
			// this.m_btnVis.setCostLabel('X' + this.m_onceCostNum);

			this.m_tenCostNum = this.m_vo.getVisCost10().count;
			this.m_btnVisTen.setTitleLabel('拜访10次');
			// this.m_btnVisTen.setCostImg('common_prop_1001_png');
			// this.m_btnVisTen.setCostLabel('X' + this.m_tenCostNum);


			// this.m_lbDes.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.NEW_GEN_CZXW, this.m_vo.getNewGenRewordCfg().perPay)); //Utils.htmlParser('每充值<font color=#feee3b>100个元宝</font><font color=#ffffff>可获得一个信物</font>');
			this.setEff();

			this.refreshMyReward();
			this.refreshCostNum();
		}

		/**按钮特效 */
		private setEff() {
			this.m_effect = new MCDragonBones();
			this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
			this.m_effect.play(IETypes.EUI_BtnEffect02);
			this.m_effect.x = 133;
			this.m_effect.y = 45;
			this.m_btnVisTen.addChild(this.m_effect);
		}

		private clearBtnEff() {
			if (this.m_effect) {
				this.m_effect.destroy();
				this.m_effect = null;
			}
		}

		private addItem(info: IItemInfo) {
			let itemView = ComItemNew.create('count', true, true);
			itemView.setItemInfo(info.itemId, info.count);
			itemView.scaleX = itemView.scaleY = 1.1;
			this.m_itemList.addChild(itemView);
		}

		//设置自选奖励
		private refreshMyReward() {
			this.m_itemList.removeChildren();
			let list = this.m_vo.getChooseList();
			let staticInfo = this.m_vo.getNewGenRewordCfg().requiredRward[0];
			this.addItem(staticInfo);
			for (let i of list) {
				this.addItem(i);
			}
		}

		//累计消耗信物数量
		private refreshCostNum() {
			let count = this.m_vo.getCostKeepsake();
			let cfg = this.m_vo.getKeepsakeRewardCfg();
			let cCount = cfg[cfg.length - 1].keepsakeCount;
			this.m_lbUseNum.textFlow = Utils.htmlParser(`<font>${count}</font>`); //count.toString();
			this.m_boxPro.setPro(cCount/*200*/, count);

			this.refreshNeedCost();
		}

		private refreshNeedCost() {
			// 信物
			let itemId = this.m_vo.getVisCost().itemId;
			let haveCount = PropModel.getPropNum(itemId);
			this.m_pCostIcon0.source = PropModel.getPropIcon(itemId);
			Utils.setPropLabName(itemId, this.m_pLbCostName0);
			this.m_pLbCostName0.text = "信物";
			let color0 = PropModel.isItemEnough(itemId, this.m_onceCostNum) ? 0xe9e9e6 : 0xff0000;
			this.m_pLbCost0.textFlow = Utils.htmlParser(`<font color=${color0}>${haveCount}</font><font color=0xe9e9e6>/${this.m_onceCostNum}</font>`);

			this.m_pCostIcon1.source = PropModel.getPropIcon(itemId);
			Utils.setPropLabName(itemId, this.m_pLbCostName1);
			this.m_pLbCostName1.text = "信物";
			let color1 = PropModel.isItemEnough(itemId, this.m_tenCostNum) ? 0xe9e9e6 : 0xff0000;
			this.m_pLbCost1.textFlow = Utils.htmlParser(`<font color=${color1}>${haveCount}</font><font color=0xe9e9e6>/${this.m_tenCostNum}</font>`);
		}

        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

		private initEvent() {
			EventManager.addTouchScaleListener(this.m_btnChange, this, this.onClickChange);
			EventManager.addTouchScaleListener(this.m_btnVis, this, this.onClickVis);
			EventManager.addTouchScaleListener(this.m_btnVisTen, this, this.onClickVis10);
			// EventManager.addTouchScaleListener(this.m_btnRecharge, this, this.onClickRecharge);

			EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_VISIT_REWARD, this.refreshCostNum, this);
			EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this.refreshMyReward, this);
			EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_BOX_REWARD, this.refreshCostNum, this);
			// EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.refreshXinwu, this);
		}

		private removeEvent() {
			EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_GENERAL_VISIT_REWARD, this);
			EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this);
			EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_GENERAL_BOX_REWARD, this);
			EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
			EventManager.removeEventListeners(this);
		}
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
		//选择奖励
		private onClickChange(e: egret.TouchEvent) {
			Utils.open_view(TASK_UI.POP_ACTIVITY_SELECT_REWARD);
		}

		//拜访
		private onClickVis(e: egret.TouchEvent) {
			// let itemNum = PropModel.getPropNum(this.m_vo.getXwItemId());
			// if(itemNum >= this.m_vo.getPerOnceNum()){
			// 	if(this.m_vo.getChooseList().length != 4){
			// 		EffectUtils.showTips(GCode(CLEnum.NEW_GEN_SEL_TIP), 1, true);
			// 		return;
			// 	}
			// 	ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD(this.m_vo.id);
			// }else{
			// 	EffectUtils.showTips(GCode(CLEnum.NEW_GEN_XWBZ), 1, true);
			// }

			this.vis(1);
		}

		private onClickVis10(e: egret.TouchEvent) {
			this.vis(2);
		}

		//拜访武将 type1 抽1次 type2 10次
		private vis(type: number) {
			if (this.m_vo.getChooseList().length != 4) {
				EffectUtils.showTips(GCode(CLEnum.NEW_GEN_SEL_TIP), 1, true);
				return;
			}
			let costNum: number;
			let num = PropModel.getPropNum(PropEnum.XW);//幸运转盘数量
			if (type == 1) {
				costNum = this.m_onceCostNum;
			} else {
				costNum = this.m_tenCostNum;
			}

			if (num < costNum) {
				if (PlatConst.isRmbPay()) {
					let cfg = this.m_vo.rechargeCfgs[type];
					Utils.showConfirmPop(`拜访信物不足，是否花费<font color =0xffff00>￥${cfg.price}</font>直接拜访?`, () => {
						PayProxy.C2S_RECHARGE(cfg.id, cfg.price);
					}, this);
				} else {
					Utils.open_view(TASK_UI.COM_BUY_ITEM_WND, { itemId: PropEnum.XW, count: costNum - num, buyType: 0 });
				}
			} else {
				ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_VISIT_REWARD(this.m_vo.id, type);
			}
		}

	}
}