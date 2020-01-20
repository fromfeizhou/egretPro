var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GeneralProxy = /** @class */ (function (_super_1) {
    __extends(GeneralProxy, _super_1);
    function GeneralProxy() {
        return _super_1.call(this) || this;
    }
    GeneralProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.GENERAL_ALL, this, 'GeneralAllReq', 'GeneralAllResp'],
            [ProtoDef.GENERAL_USE_EXP_BOOK, this, 'GeneralUseExpBookReq', 'GeneralUseExpBookResp'],
            [ProtoDef.GENERAL_UP_STAR, this, 'GeneralUpStarReq', 'GeneralUpStarResp'],
            [ProtoDef.RECRUITED_GENERAL, this, 'RecruitedGeneralReq', 'RecruitedGeneralResp'],
            [ProtoDef.OPEN_SKILL, this, 'OpenSkillReq', 'OpenSkillResp'],
            [ProtoDef.GENERAL_TREASURE_WEAR, this, 'GeneralTreasureWearReq', 'GeneralTreasureWearResp'],
            [ProtoDef.GENERAL_UPGRADE, this, 'GeneralUpgradeReq', 'GeneralUpgradeResp'],
            [ProtoDef.GENERAL_DETAIL, this, 'GeneralDetailReq', 'GeneralDetailResp'],
        ];
    };
    GeneralProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.S2C_SYS_GENERAL_ATTRIBUTES_NOTICE, this, 'S2C_SYS_GENERAL_ATTRIBUTES_NOTICE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_GENERAL_REBIRTH, this, 'C2S_GENERAL_REBIRTH', ProxyEnum.SEND],
            [ProtoDef.S2C_GENERAL_REBIRTH, this, 'S2C_GENERAL_REBIRTH', ProxyEnum.RECEIVE],
        ];
    };
    GeneralProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        switch (protocol) {
            case ProtoDef.GENERAL_ALL: {
                GeneralModel.setOwnGenerals(body.generalInfo);
                FateModel.updateGeneralFate(body);
                if (GeneralProxy.tag_resp_open_info_view) {
                    Utils.open_view(TASK_UI.POP_GENERAL_OPEN_INFO_VIEW);
                }
                GeneralProxy.tag_resp_open_info_view = false;
                com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_INIT, null);
                break;
            }
            case ProtoDef.S2C_SYS_GENERAL_ATTRIBUTES_NOTICE: { //武将属性更新
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
                if (GiftBagModel.isPopItem) { //武将升级弹限时礼包
                    Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 1, giftId: GiftBagModel.jumpId });
                }
                if (GiftBagModel.isPopShop) { //武将升级弹限时商城
                    Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 2, giftId: 0 });
                }
                break;
            }
            case ProtoDef.GENERAL_UP_STAR: { //升星
                GeneralModel.updateOwnGeneral(body.generalInfo);
                FateModel.updateSingleGeneralFateStatus(body.generalInfo.generalId);
                FateModel.updateRelationGeneralStatus(body.generalInfo.generalId);
                /**更新关联武将状态 */
                Sound.playID(233);
                break;
            }
            case ProtoDef.RECRUITED_GENERAL: { //武将合成
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
                var generalVo = GeneralModel.getOwnGeneral(body.generalId);
                if (generalVo) {
                    var info = generalVo.getOwnerSkillInfoBySeque(body.sequence);
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
    };
    /**
     * 获取招募的武将列表
     */
    GeneralProxy.send_GENERAL_ALL_OPEN_VIEW = function () {
        debug("GeneralProxy:send_GENERAL_ALL--->>");
        GeneralProxy.tag_resp_open_info_view = true;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_ALL);
        AGame.ServiceBuilder.sendMessage(data, null, null, true);
    };
    GeneralProxy.send_GENERAL_ALL = function () {
        debug("GeneralProxy:send_GENERAL_ALL--->>");
        GeneralProxy.tag_resp_open_info_view = false;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_ALL);
        AGame.ServiceBuilder.sendMessage(data, null, null, false);
    };
    /**
     * 根据武将id，获取武将信息
     */
    GeneralProxy.send_GENERAL_DETAIL = function (palyId, genId, open) {
        if (open === void 0) { open = false; }
        debug("GeneralProxy:send_GENERAL_DETAIL--->>" + genId);
        if (genId) {
            GeneralProxy.tag_resp_open_detail_view = open;
            var data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_DETAIL);
            data.targetId = palyId;
            data.generalId = genId;
            AGame.ServiceBuilder.sendMessage(data);
        }
    };
    /**
     * 使用经验书
     * isAll(是否单独使用经验书)
     */
    GeneralProxy.send_GENERAL_USE_EXP_BOOK = function (generalId, items, isAll) {
        if (isAll === void 0) { isAll = false; }
        var vo = GeneralModel.getOwnGeneral(generalId);
        if (vo)
            GeneralModel.keepCurrSkillId(generalId); //获取升级前已解锁技能
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_USE_EXP_BOOK);
        data.generalId = generalId;
        data.items = items;
        data.isAll = isAll;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 武将升星
     */
    GeneralProxy.send_GENERAL_UP_STAR = function (generalId) {
        var vo = GeneralModel.getOwnGeneral(generalId);
        if (vo) {
            vo.recordAttribute();
            GeneralModel.keepCurrSkillId(generalId); //获取升级前已解锁技能
        }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_UP_STAR);
        data.generalId = generalId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 碎片合成
     */
    GeneralProxy.send_RECRUITED_GENERAL = function (generalId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.RECRUITED_GENERAL);
        data.generalId = generalId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 开启技能
     */
    GeneralProxy.send_OPEN_SKILL = function (generalId, sequence, skillId) {
        if (skillId === void 0) { skillId = 0; }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.OPEN_SKILL);
        data.generalId = generalId;
        data.sequence = sequence;
        data.skillId = skillId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 武将宝物佩戴
     */
    GeneralProxy.send_GENERAL_TREASURE_WEAR = function (generalId, treasureId) {
        var vo = GeneralModel.getOwnGeneral(generalId);
        if (vo) {
            vo.recordAttribute();
        }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_TREASURE_WEAR);
        data.generalId = generalId;
        data.treasureId = treasureId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 武将突破 */
    GeneralProxy.send_GENERAL_UPGRADE = function (generalId) {
        var vo = GeneralModel.getOwnGeneral(generalId);
        if (vo) {
            vo.recordAttribute();
            GeneralModel.keepCurrSkillId(generalId); //获取升级前已解锁技能
        }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.GENERAL_UPGRADE);
        data.generalId = generalId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 武将重生 */
    GeneralProxy.send_C2S_GENERAL_REBIRTH = function (generalId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GENERAL_REBIRTH);
        data.generalId = generalId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    //FIX ME
    /**
     * 返回消息是否打开界面标识
     */
    GeneralProxy.tag_resp_open_info_view = false;
    /**
     * 返回消息是否打开详细界面标识
     */
    GeneralProxy.tag_resp_open_detail_view = false;
    // FIX
    /**
     * 保存请求强化的武将ID
     */
    GeneralProxy.request_strengthen_generalId = null;
    /**
     * 保存请求升级宝物的武将ID
     */
    GeneralProxy.request_treasure_generalId = null;
    /**
     * 保存请求升级的宝物ID
     */
    GeneralProxy.request_treasureId = null;
    /**
     * 宝石ID保存
     */
    GeneralProxy.request_gem_generalId = null;
    GeneralProxy.request_gem_gemId = null;
    /**
     * 临时保存喊话修改内容
     */
    GeneralProxy.general_talk_content = null;
    GeneralProxy.general_talk_id = null;
    /**
     * 印绶处理武将ID
     */
    GeneralProxy.request_seal_generalId = null;
    return GeneralProxy;
}(BaseProxy));
