class EquipProxy extends BaseProxy {

    public constructor() {
        super();
    }

    protected listenerProtoNotificationsNew(): [number, any, string, ProxyEnum][] {
        return [
            [ProtoDef.C2S_GET_EQUIPMENT_LIST, this, 'C2S_GET_EQUIPMENT_LIST', ProxyEnum.SEND],// 装备列表
            [ProtoDef.S2C_GET_EQUIPMENT_LIST, this, 'S2C_GET_EQUIPMENT_LIST', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_GENERAL_EQUIP, this, 'C2S_GENERAL_EQUIP', ProxyEnum.SEND],// 武将格子装备
            [ProtoDef.S2C_GENERAL_EQUIP, this, 'S2C_GENERAL_EQUIP', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_GENERAL_EQUIP_ALL, this, 'C2S_GENERAL_EQUIP_ALL', ProxyEnum.SEND],// 一键装备
            [ProtoDef.S2C_GENERAL_EQUIP_ALL, this, 'S2C_GENERAL_EQUIP_ALL', ProxyEnum.RECEIVE],

            [ProtoDef.S2C_EQUIPMENT_CHANGE, this, 'S2C_EQUIPMENT_CHANGE', ProxyEnum.RECEIVE], //装备变化列表
            [ProtoDef.S2C_GENERAL_EQUIPMENT_CHANGE, this, 'S2C_GENERAL_EQUIPMENT_CHANGE', ProxyEnum.RECEIVE], //武将装备变化列表
            [ProtoDef.S2C_EQUIPMENT_ADD, this, 'S2C_EQUIPMENT_ADD', ProxyEnum.RECEIVE], //添加装备
            [ProtoDef.S2C_EQUIPMENT_DEL, this, 'S2C_EQUIPMENT_DEL', ProxyEnum.RECEIVE], //移除装备

            [ProtoDef.C2S_EQUIPMENT_SLOT_UPGRADE, this, 'C2S_EQUIPMENT_SLOT_UPGRADE', ProxyEnum.SEND],     //强化
            [ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE, this, 'S2C_EQUIPMENT_SLOT_UPGRADE', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_EQUIPMENT_COMPOSE, this, 'C2S_EQUIPMENT_COMPOSE', ProxyEnum.SEND],     //合成
            [ProtoDef.S2C_EQUIPMENT_COMPOSE, this, 'S2C_EQUIPMENT_COMPOSE', ProxyEnum.RECEIVE],

            [ProtoDef.C2S_EQUIPMENT_DECOMPOSE, this, 'C2S_EQUIPMENT_DECOMPOSE', ProxyEnum.SEND],     //分解
            [ProtoDef.S2C_EQUIPMENT_DECOMPOSE, this, 'S2C_EQUIPMENT_DECOMPOSE', ProxyEnum.RECEIVE],
        ]
    }

    public execute(notification: AGame.INotification) {
        let body = notification.getBody();
        let protocol: number = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_GET_EQUIPMENT_LIST: {
                let data = body as gameProto.IS2C_GET_EQUIPMENT_LIST;
                EquipModel.parseEquips(data.equipments);
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_ADD: {
                let data = body as gameProto.IS2C_EQUIPMENT_ADD;
                EquipModel.parseEquips(data.equipments);
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_DEL: {
                let data = body as gameProto.IS2C_EQUIPMENT_DEL;
                for (let i = 0; i < data.equipmentUuid.length; i++) {
                    EquipModel.delEquip(data.equipmentUuid[i]);
                }
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_CHANGE: {    //装备变化列表
                let data = body as gameProto.IS2C_EQUIPMENT_CHANGE;
                for (let i = 0; i < data.equipments.length; i++) {
                    let info = data.equipments[i];
                    EquipModel.updateEquip(info);
                }
                break;
            }
            case ProtoDef.S2C_GENERAL_EQUIPMENT_CHANGE: {    //武将装备变化列表
                let data = body as gameProto.IS2C_GENERAL_EQUIPMENT_CHANGE;
                for (let i = 0; i < data.generalEquipments.length; i++) {
                    let info = data.generalEquipments[i];
                    let vo = GeneralModel.getOwnGeneral(info.generalId);
                    if (vo) vo.updateEquipSlot(info.slots);
                }
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE: {  //强化
                let data = body as gameProto.IS2C_EQUIPMENT_SLOT_UPGRADE;
                let vo = GeneralModel.getOwnGeneral(data.generalId);
                for (let i = 0; i < data.slotUpgraded.length; i++) {
                    vo.updateEquipStreng(data.slotUpgraded[i]);
                }
                com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQ_STRENG, { id: vo.generalId, type: data.upgradeType });
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_COMPOSE:{
                com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQ_COMPOSE, null);
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_DECOMPOSE: {  //回收
                 Utils.open_view(TASK_UI.GET_REWARD_VIEW, EquipModel.m_tItems);
                 break;
            }

        }

        AGame.ServiceBuilder.notifyView(notification);
    }

    /**装备列表 */
    public static C2S_GET_EQUIPMENT_LIST() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_EQUIPMENT_LIST) as gameProto.C2S_GET_EQUIPMENT_LIST;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**
     * 格子装备 
     * @param uuid 0卸装
     * */
    public static C2S_GENERAL_EQUIP(generalId: number, pos: IEquipPos, uuid: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GENERAL_EQUIP) as gameProto.IC2S_GENERAL_EQUIP;
        data.equipmentUuId = uuid;
        data.generalId = generalId;
        data.slotType = pos;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**一键装备 */
    public static C2S_GENERAL_EQUIP_ALL(generalId: number, uuids: number[]) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GENERAL_EQUIP_ALL) as gameProto.IC2S_GENERAL_EQUIP_ALL;
        data.generalId = generalId;
        data.equipmentUuid = uuids;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**
     * 一键装备 
     * @param upgrade 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
     * @param slotType 对应孔位 -1 为一键升级 
     * */
    public static C2S_EQUIPMENT_SLOT_UPGRADE(generalId: number, slotType: number, upgrade: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_EQUIPMENT_SLOT_UPGRADE) as gameProto.IC2S_EQUIPMENT_SLOT_UPGRADE;
        data.generalId = generalId;
        data.slotType = slotType;
        data.upgradeType = upgrade;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**合成 
     * @param itemId 0 批量合成
    */
    public static C2S_EQUIPMENT_COMPOSE(itemId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_EQUIPMENT_COMPOSE) as gameProto.IC2S_EQUIPMENT_COMPOSE;
        data.equipmentId = itemId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**分解装备 */
    public static C2S_EQUIPMENT_DECOMPOSE(uuids: number[]) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_EQUIPMENT_DECOMPOSE) as gameProto.IC2S_EQUIPMENT_DECOMPOSE;
        data.equipmentUuId = uuids;
        AGame.ServiceBuilder.sendMessage(data);
    }

}