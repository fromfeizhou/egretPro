class GeneralProxy extends BaseProxy {



	//FIX ME
	/**
	 * 返回消息是否打开界面标识
	 */
	public static tag_resp_open_info_view = false;
	/**
	 * 返回消息是否打开详细界面标识
	 */
	public static tag_resp_open_detail_view = false;
	// FIX


	/**
	 * 保存请求强化的武将ID
	 */
	public static request_strengthen_generalId = null;

	/**
	 * 保存请求升级宝物的武将ID
	 */
	public static request_treasure_generalId = null;
	/**
	 * 保存请求升级的宝物ID
	 */
	public static request_treasureId = null;

	/**
	 * 宝石ID保存
	 */
	public static request_gem_generalId = null;
	public static request_gem_gemId = null;


	/**
	 * 临时保存喊话修改内容
	 */
	public static general_talk_content = null;
	public static general_talk_id = null;


	/**
	 * 印绶处理武将ID
	 */
	public static request_seal_generalId = null;


	public constructor() {
		super();
	}

	protected listenerProtoNotifications(): any[] {
		return [
			[ProtoDef.GENERAL_ALL, this, 'GeneralAllReq', 'GeneralAllResp'],//获取招募的武将列表
			[ProtoDef.GENERAL_USE_EXP_BOOK, this, 'GeneralUseExpBookReq', 'GeneralUseExpBookResp'],//武将使用经验书		
			[ProtoDef.GENERAL_UP_STAR, this, 'GeneralUpStarReq', 'GeneralUpStarResp'],//武将升星	
			[ProtoDef.RECRUITED_GENERAL, this, 'RecruitedGeneralReq', 'RecruitedGeneralResp'],// 招募武将
			[ProtoDef.OPEN_SKILL, this, 'OpenSkillReq', 'OpenSkillResp'],// 开启技能			
			[ProtoDef.GENERAL_TREASURE_WEAR, this, 'GeneralTreasureWearReq', 'GeneralTreasureWearResp'],// 宝物穿上
			[ProtoDef.GENERAL_UPGRADE, this, 'GeneralUpgradeReq', 'GeneralUpgradeResp'],// 突破
			[ProtoDef.GENERAL_DETAIL, this, 'GeneralDetailReq', 'GeneralDetailResp'],// 根据武将id，获取武将信息
		];
	}
	protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
		return [
			[ProtoDef.S2C_SYS_GENERAL_ATTRIBUTES_NOTICE, this, 'S2C_SYS_GENERAL_ATTRIBUTES_NOTICE', ProxyEnum.RECEIVE],		//武将属性更新
			[ProtoDef.C2S_GENERAL_REBIRTH, this, 'C2S_GENERAL_REBIRTH', ProxyEnum.SEND],		//武将重生请求
			[ProtoDef.S2C_GENERAL_REBIRTH, this, 'S2C_GENERAL_REBIRTH', ProxyEnum.RECEIVE],		//武将重生请求

		]
	}

	public execute(notification: AGame.INotification) {
		let protocol: number = Number(notification.getName());
		let body = notification.getBody();
		switch (protocol) {

			case ProtoDef.GENERAL_ALL: {
				GeneralModel.setOwnGenerals(body.generalInfo);
				FateModel.updateGeneralFate(body)

				if (GeneralProxy.tag_resp_open_info_view) {
					Utils.open_view(TASK_UI.POP_GENERAL_OPEN_INFO_VIEW);
				}
				GeneralProxy.tag_resp_open_info_view = false;

				com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_INIT, null);
				break;
			}
			case ProtoDef.S2C_SYS_GENERAL_ATTRIBUTES_NOTICE: {	//武将属性更新
				GeneralModel.updateGeneralAttri(body);
				break;
			}
			case ProtoDef.GENERAL_DETAIL: {
				Utils.open_view(TASK_UI.GENERAL_INFO_CHECK_VIEW, body.generalInfo);
				// com_main.GuideUI.hide();
				// GeneralModel.updateOwnGeneral(body.generalInfo);
				// if (GeneralProxy.tag_resp_open_detail_view)
				// 	AGame.R.notifyView(TASK_UI.POP_GENERAL_OPEN_DETAIL_VIEW, body.generalInfo.generalId);
				// GeneralProxy.tag_resp_open_detail_view = false;
				break;
			}
			case ProtoDef.GENERAL_USE_EXP_BOOK: {
				GeneralModel.updateOwnGenerals([body.generalInfo]);
				Sound.playID(114);
				if (GiftBagModel.isPopItem) {//武将升级弹限时礼包
					Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 1, giftId: GiftBagModel.jumpId });
				}
				if (GiftBagModel.isPopShop) {//武将升级弹限时商城
					Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 2, giftId: 0 });
				}
				break;
			}
			case ProtoDef.GENERAL_UP_STAR: {  //升星
				GeneralModel.updateOwnGeneral(body.generalInfo);
				FateModel.updateSingleGeneralFateStatus(body.generalInfo.generalId);
				FateModel.updateRelationGeneralStatus(body.generalInfo.generalId);
				/**更新关联武将状态 */
				Sound.playID(233);
				break;
			}
			case ProtoDef.RECRUITED_GENERAL: {  //武将合成
				GeneralModel.setOwnGenerals([body.generalInfo]);
				FateModel.updateSingleGeneralFateStatus(body.generalInfo.generalId);
				FateModel.updateRelationGeneralStatus(body.generalInfo.generalId);
				// if (body.generalInfo.quality >= 5) {
				// 	Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP);
				// }
				break;
			}

			case ProtoDef.OPEN_SKILL: {
				/**技能获得 或者更新协议 */
				let generalVo = GeneralModel.getOwnGeneral(body.generalId) as GeneralVo;
				if (generalVo) {
					let info = generalVo.getOwnerSkillInfoBySeque(body.sequence);
					info.level = body.level;
					info.skillId = body.skillId;
					ScenePopQueWnd.addFightWnd();
					/**红点 */
					com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_SKILL, generalVo.generalId);
				}
				break;
			}
			//宝物装备
			case ProtoDef.GENERAL_TREASURE_WEAR: {
				GeneralModel.updateOwnGenerals(body.generalInfo);
				/**红点 */
				com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQUIP_TREA, null);
				break;
			}
			//突破
			case ProtoDef.GENERAL_UPGRADE: {
				GeneralModel.updateOwnGeneral(body.generalInfo);
				Sound.playID(233);
				break;
			}
			//重生
			case ProtoDef.S2C_GENERAL_REBIRTH: {
				GeneralModel.updateOwnGeneral(body.generalInfo);
				Sound.playID(233);
				com_main.EventMgr.dispatchEvent(RebirthEvent.REBIRTH_UPDATE, null);
				break;
			}

			default:
				break;
		}

		AGame.ServiceBuilder.notifyView(notification);
	}

	/**
	 * 获取招募的武将列表
	 */
	public static send_GENERAL_ALL_OPEN_VIEW() {
		debug("GeneralProxy:send_GENERAL_ALL--->>");
		GeneralProxy.tag_resp_open_info_view = true;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_ALL);
		AGame.ServiceBuilder.sendMessage(data, null, null, true);
	}

	public static send_GENERAL_ALL() {
		debug("GeneralProxy:send_GENERAL_ALL--->>");
		GeneralProxy.tag_resp_open_info_view = false;
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_ALL);
		AGame.ServiceBuilder.sendMessage(data, null, null, false);
	}

	/**
	 * 根据武将id，获取武将信息
	 */
	public static send_GENERAL_DETAIL(palyId: number, genId: number, open: boolean = false) {
		debug("GeneralProxy:send_GENERAL_DETAIL--->>" + genId);
		if (genId) {
			GeneralProxy.tag_resp_open_detail_view = open;
			let data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_DETAIL);
			data.targetId = palyId;
			data.generalId = genId;
			AGame.ServiceBuilder.sendMessage(data);
		}
	}

	/**
	 * 使用经验书
	 * isAll(是否单独使用经验书)
	 */
	public static send_GENERAL_USE_EXP_BOOK(generalId, items, isAll: boolean = false) {
		let vo = GeneralModel.getOwnGeneral(generalId);
		if (vo) GeneralModel.keepCurrSkillId(generalId);//获取升级前已解锁技能

		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_USE_EXP_BOOK);
		data.generalId = generalId;
		data.items = items;
		data.isAll = isAll;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**
	 * 武将升星
	 */
	public static send_GENERAL_UP_STAR(generalId) {
		let vo = GeneralModel.getOwnGeneral(generalId);
		if (vo) {
			vo.recordAttribute();
			GeneralModel.keepCurrSkillId(generalId);//获取升级前已解锁技能
		}
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_UP_STAR);
		data.generalId = generalId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**
	 * 碎片合成
	 */
	public static send_RECRUITED_GENERAL(generalId) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.RECRUITED_GENERAL);
		data.generalId = generalId;
		AGame.ServiceBuilder.sendMessage(data);
	}


	/**
	 * 开启技能
	 */
	public static send_OPEN_SKILL(generalId, sequence, skillId = 0) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.OPEN_SKILL);
		data.generalId = generalId;
		data.sequence = sequence;
		data.skillId = skillId;
		AGame.ServiceBuilder.sendMessage(data);
	}

	/**
	 * 武将宝物佩戴
	 */
	public static send_GENERAL_TREASURE_WEAR(generalId, treasureId) {
		let vo = GeneralModel.getOwnGeneral(generalId);
		if (vo) {
			vo.recordAttribute();
		}
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_TREASURE_WEAR);
		data.generalId = generalId;
		data.treasureId = treasureId;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/** 武将突破 */
	public static send_GENERAL_UPGRADE(generalId) {
		let vo = GeneralModel.getOwnGeneral(generalId);
		if (vo) {
			vo.recordAttribute();
			GeneralModel.keepCurrSkillId(generalId);//获取升级前已解锁技能
		}
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_UPGRADE);
		data.generalId = generalId;
		AGame.ServiceBuilder.sendMessage(data);
	}
	/** 武将重生 */
	public static send_C2S_GENERAL_REBIRTH(generalId) {
		let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GENERAL_REBIRTH);
		data.generalId = generalId;
		AGame.ServiceBuilder.sendMessage(data);
	}


}