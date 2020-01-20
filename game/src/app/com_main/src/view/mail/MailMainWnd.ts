module com_main {
	/**
	 * 邮件主面板
	 */

	/**子面板接口 */
	export interface IMailTabView {
		m_nType: MailType;
		refresh(info: gameProto.S2C_MAILBOX_INFO): void;
	}


	export class MailMainWnd extends CView {
		public static NAME = 'MailMainWnd';

		public m_imgLine: eui.Image;
		public m_comTabGroup: com_main.ComTabGroup;
		public m_MainTopNew: com_main.MainTopNew;
		public m_pViewRoot: eui.Group;
		public m_tabViewStack: eui.ViewStack;
		public m_Scroller: eui.Scroller;
		public m_listMail: eui.List;
		public m_emptyRoot: eui.Group;
		public m_btnAllDel: com_main.ComButton;
		public m_btnAllRead: com_main.ComButton;
		public m_btnDel: com_main.ComButton;

		private m_nTagId: number;   //切卡
		private m_nMailTypes: MailType[];
		private m_sMailTitle: string[];
		private m_tCollection: eui.ArrayCollection;
		private m_tViews: { [type: number]: IMailTabView };
		private m_nIndex: number;	//邮件列表选中下标

		public constructor(param?) {
			super();
			this.name = MailMainWnd.NAME;
			this.initApp("mail/MailMainWndSkin.exml");
		}


		public onDestroy(): void {
			super.onDestroy();
			this.removeEvent();
		}


		protected childrenCreated(): void {
			super.childrenCreated();

			MailModel.resetMailRecord();

			this.m_MainTopNew.setTitleName(GCode(CLEnum.MAIL));
			this.m_btnAllDel.setTitleLabel(GCode(CLEnum.MAIL_DEL_ALL));
			this.m_btnAllRead.setTitleLabel(GCode(CLEnum.MAIL_READ_ALL));
			this.m_btnDel.setTitleLabel(GCode(CLEnum.MAIL_DEL));


			//邮件类型 1系统 2战报 3野怪  4采集 5城市战
			this.m_nMailTypes = [MailType.System, MailType.Personal, MailType.CatchBandits, MailType.Collection, MailType.Country];
			this.m_sMailTitle = [GCode(CLEnum.MAIL_TAB_ST), GCode(CLEnum.MAIL_TAB_GR), GCode(CLEnum.MAIL_TAB_ZF),
			GCode(CLEnum.MAIL_TAB_CJ), GCode(CLEnum.MAIL_TAB_GZ)];
			this.m_comTabGroup.initNorTabBtns(this.m_sMailTitle);
			this.m_comTabGroup.setChangeCallback(this.changeTag, this);

			//界面初始化
			this.m_tViews = {};
			let views = [new SystemReport(MailType.System), new PersonalReport(MailType.Personal), new CatchBanditsReport(MailType.CatchBandits),
			new CollectionReport(MailType.Collection), new CountryReport(MailType.Country)];
			for (let i = 0; i < views.length; i++) {
				this.m_tabViewStack.addChild(views[i]);
				this.m_tViews[views[i].m_nType] = views[i];
			}

			this.m_tCollection = new eui.ArrayCollection();
			this.m_listMail.itemRenderer = MailItem;
			this.m_listMail.dataProvider = this.m_tCollection;

			this.validateNow();

			//红点处理
			for (let i = 0; i < this.m_nMailTypes.length; i++) {
				let container = <egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(this.m_sMailTitle[i]);
				let mailType = this.m_nMailTypes[i];
				RedPointModel.AddInfoListener(container, { x: 132, y: -5 }, [RedEvtType.MAIL], 2, { mailType: mailType });
			}

			this.changeTag(0);
			//添加事件
			this.addEvent();

			Utils.toStageBestScale(this.m_pViewRoot);
		}


		/**切卡 */
		private changeTag(index: number) {
			if (this.m_nTagId == index) return;
			this.m_nTagId = index;
			this.m_nIndex = -1;
			this.m_listMail.selectedIndex = -1;
			this.m_comTabGroup.selectedIndex = index;
			this.m_tabViewStack.selectedIndex = index;
			this.refreshMailList();

			this.changeItemSelected(0);
		}

		private refreshMailList(curId: number = null): void {
			this.m_Scroller.stopAnimation();
			let type = this.m_nMailTypes[this.m_nTagId];
			let list = MailModel.getMailTitlesByType(type);
			if (!list || list.length == 0) {
				this.setEmptyView(true);
				this.m_tCollection.removeAll();
				return;
			}
			this.setEmptyView(false);

			let res: IMailItemRD[] = [];
			for (let i = 0; i < list.length; i++) {
				let data = list[i];
				let selected = (curId && curId == data.id) ? true : false
				let title = data.titleInfo.replace(/(\\)/g, '');
				let titleInfo: IMailTitleInfo = title == '' ? {} : JSON.parse(title);
				res.push({ mailInfo: data, selected: selected, titleInfo: titleInfo });
			}
			this.m_tCollection.replaceAll(res);
			this.sortMailTitle();

			//有默认选中邮件id
			if (!curId) return;
			for (let i = 0; i < this.m_tCollection.source.length; i++) {
				let data = this.m_tCollection.getItemAt(i) as IMailItemRD;
				if (data.mailInfo.id == curId) {
					this.changeItemSelected(i);
					break;
				}
			}
		}

		/**邮件列表排序 */
		private sortMailTitle() {
			this.m_tCollection.source.sort((a: IMailItemRD, b: IMailItemRD) => {
				// if (a.mailInfo.isRead != b.mailInfo.isRead) {
				// 	if (a.mailInfo.isRead) return 1;
				// 	return -1;
				// }
				// //未读邮件按时间排序
				// if (!a.mailInfo.isRead) {
				// 	return b.mailInfo.sendTime - a.mailInfo.sendTime;
				// }
				// //已读邮件 有附件优先未领取
				// if (a.mailInfo.attachmentType == 1 && !a.mailInfo.isAttachmentState) return -1;
				// if (b.mailInfo.attachmentType == 1 && !b.mailInfo.isAttachmentState) return 1;
				return b.mailInfo.sendTime - a.mailInfo.sendTime;
			});
			this.m_tCollection.refresh();
		}

		/**设置空邮件显示 */
		private setEmptyView(val: boolean) {
			if (val) {
				this.m_emptyRoot.visible = true;
				this.m_tabViewStack.visible = false;
				this.m_imgLine.visible = false;
			} else {
				this.m_emptyRoot.visible = false;
				this.m_tabViewStack.visible = true;
				this.m_imgLine.visible = true;
			}
		}

		//更换列表选中状态
		private changeItemSelected(index: number): void {
			if (this.m_nIndex == index) return;
			this.setItemState(this.m_nIndex, false);
			this.m_nIndex = index;
			this.setItemState(this.m_nIndex, true);
			let itemRD: IMailItemRD = this.m_tCollection.getItemAt(this.m_nIndex);
			if (itemRD) {
				MailProxy.C2S_MAILBOX_INFO(itemRD.mailInfo.id);
			}
		}


		/**邮件状态切换 */
		private setItemState(index: number, val: boolean) {
			let data = this.m_tCollection.getItemAt(index) as IMailItemRD;
			if (!data) return;
			data.selected = val;
			this.m_tCollection.replaceItemAt(data, index);
		}

		/**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
		private addEvent() {
			EventManager.addTouchScaleListener(this.m_btnDel, this, this.onBtnDel);
			EventManager.addTouchScaleListener(this.m_btnAllDel, this, this.onBtnAllDel);
			EventManager.addTouchScaleListener(this.m_btnAllRead, this, this.onBtnAllRead);
			EventMgr.addEvent(MailEvent.READ_MAIL, this.onReadMail, this);
			EventMgr.addEvent(MailEvent.REFRESH_MAIL, this.onRreshMail, this);
			EventMgr.addEvent(MailEvent.GET_ATTACHMENT, this.onGetAttachment, this);
			this.m_listMail.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
		}

		private removeEvent() {
			EventManager.removeEventListeners(this);
			EventMgr.removeEventByObject(MailEvent.READ_MAIL, this);
			EventMgr.removeEventByObject(MailEvent.REFRESH_MAIL, this);
			EventMgr.removeEventByObject(MailEvent.GET_ATTACHMENT, this);
			this.m_listMail.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);

		}

		private onBtnDel(e): void {
			let itemRD: IMailItemRD = this.m_tCollection.getItemAt(this.m_nIndex);
			if (isNull(itemRD)) {
				EffectUtils.showTips(GCode(CLEnum.MAIL_SEL_NONE), 1, true);
				return;
			}
			let info = itemRD.mailInfo;
			if (info.attachmentType == 1 && !info.isAttachmentState) {
				MailProxy.C2S_MAILBOX_ATTACHMENT(itemRD.mailInfo.id);
			} else {
				MailProxy.C2S_MAILBOX_DEL(itemRD.mailInfo.id);
			}
		}

		private onBtnAllDel(e): void {
			let mailType = this.m_nMailTypes[this.m_nTagId];
			let list = MailModel.getMailTitlesByType(mailType);
			if (!list || list.length == 0) {
				EffectUtils.showTips(GCode(CLEnum.MAIL_NONE), 1, true);
				return;
			}

			let tagName = this.m_comTabGroup.selName;
			let content = GCodeFromat(CLEnum.MAIL_TIPS_DEL, tagName);
			Utils.showConfirmPop(content, () => {
				MailProxy.C2S_MAILBOX_ALLDEL(mailType);
			}, this);
		}

		private onBtnAllRead(e): void {
			let mailType = this.m_nMailTypes[this.m_nTagId];
			let list = MailModel.getMailTitlesByType(mailType);
			if (!list) {
				EffectUtils.showTips(GCode(CLEnum.MAIL_READ_NONE), 1, true);
				return;
			}
			let sendRead = false;
			for (let i = 0; i < list.length; i++) {
				if (!list[i].isRead || (list[i].attachmentType == 1 && !list[i].isAttachmentState)) {
					sendRead = true;
					break;
				}
			}
			if (sendRead) {
				MailProxy.C2S_MAILBOX_ALLREAD(mailType);
			} else {
				EffectUtils.showTips(GCode(CLEnum.MAIL_READ_NONE), 1, true);
			}
		}

		private onItemSelected(e: eui.ItemTapEvent): void {
			this.changeItemSelected(e.itemIndex);
		}

		private onReadMail = (data: gameProto.S2C_MAILBOX_INFO) => {
			let mailTitle: gameProto.IMailTitle = MailModel.getMailTitleById(data.id);
			this.m_tabViewStack.visible = true;
			this.m_tViews[data.textType].refresh(data);

			if (mailTitle.attachmentType == 1 && !mailTitle.isAttachmentState) {
				this.m_btnDel.setTitleLabel(GCode(CLEnum.MAIL_ATT_GET));
			} else {
				this.m_btnDel.setTitleLabel(GCode(CLEnum.MAIL_DEL));
			}
		}

		private onRreshMail(isDel: boolean): void {
			let itemRD: IMailItemRD = this.m_tCollection.getItemAt(this.m_nIndex);
			let curId = itemRD ? itemRD.mailInfo.id : null;
			this.m_nIndex = -1;
			this.m_listMail.selectedIndex = -1;

			this.refreshMailList(curId);
			//删除当前 邮件 或新增第一封邮件 自动选中第一封
			if (isDel || this.m_tCollection.source.length == 1) {
				this.changeItemSelected(0);
			}
		}

		private onGetAttachment(data: gameProto.S2C_MAILBOX_ATTACHMENT): void {
			this.m_btnDel.setTitleLabel(GCode(CLEnum.MAIL_DEL));
		}

		/**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

	}

	interface IMailItemRD {
		mailInfo: gameProto.IMailTitle,
		selected: boolean,
		titleInfo: IMailTitleInfo;
	}

	/**邮件列表item */
	class MailItem extends eui.ItemRenderer {
		public m_pRoot: eui.Group;
		public m_lbName: eui.Label;
		public m_lbTime: eui.Label;
		public m_imgResult: eui.Image;
		public m_imgMail: eui.Image;
		public m_imgBuild: eui.Image;
		public m_lbLv: eui.Label;
		public m_pSelected: eui.Group;
		public m_pNewRoot: eui.Group;

		private m_tData: IMailItemRD;
		private m_curState: string;
		private m_states = ['', 'base', 'fight', 'fight', 'fight', 'source'];
		public constructor() {
			super();
			this.touchChildren = true;
		}

		$onRemoveFromStage(isclear = true): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}


		public onDestroy(): void {
			egret.Tween.removeTweens(this);
			EventManager.removeEventListeners(this);
			SceneResGroupCfg.clearModelRes([ModuleEnums.MAIL,ModuleEnums.COUNTRY_UI]);
		}



		protected childrenCreated() {
			super.childrenCreated();
			this.anchorOffsetX = this.width / 2;
			this.anchorOffsetY = this.height / 2;
		}

		protected dataChanged(): void {
			super.dataChanged();
			this.m_tData = this.data;
			if (this.m_tData) {
				let info = this.m_tData.mailInfo;
				let state = this.m_states[info.type];
				if (state != this.m_curState) {
					this.m_curState = state;
					this.currentState = state;
					this.commitProperties();
				}
				let gay = info.isRead;
				if (info.attachmentType == 1 && !info.isAttachmentState) gay = false;
				Utils.isGray(gay, this.m_pRoot);

				this.m_lbName.text = this.m_tData.mailInfo.title;
				let timeStr = TimerUtils.dateFormat("yyyy-MM-dd   hh:mm", this.m_tData.mailInfo.sendTime);
				this.m_lbTime.text = timeStr;

				switch (state) {
					case 'base': {
						this.m_imgMail.source = gay ? "yj_zbxq_icon_02_png" : "yj_zbxq_icon_01_png";
						break;
					}
					case 'fight': {
						let isWin = this.m_tData.titleInfo.victory == 1;
						if(this.m_tData.titleInfo.countryId){	
							if(this.m_tData.titleInfo.countryId != RoleData.countryId) isWin = !isWin;
						}
						this.m_imgResult.source = isWin ? "lb_ty1_s_png" : "lb_ty4_b_png";
						break;
					}
					case 'source': {
						let evtId = this.m_tData.titleInfo.eventDataId;
						let cfg = C.EventDataConfig[evtId];
						if (cfg) {
							this.m_imgBuild.source = `map_build_icon${cfg.image}_png`;
							this.m_lbLv.text = cfg.lv.toString();
						}
					}
				}
				this.m_pNewRoot.visible = !this.m_tData.mailInfo.isRead;
				this.m_pSelected.visible = this.m_tData.selected;
			}
		}
	}


}