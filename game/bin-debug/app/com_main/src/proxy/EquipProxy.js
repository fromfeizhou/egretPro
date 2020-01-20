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
var EquipProxy = /** @class */ (function (_super_1) {
    __extends(EquipProxy, _super_1);
    function EquipProxy() {
        return _super_1.call(this) || this;
    }
    EquipProxy.prototype.listenerProtoNotificationsNew = function () {
        return [
            [ProtoDef.C2S_GET_EQUIPMENT_LIST, this, 'C2S_GET_EQUIPMENT_LIST', ProxyEnum.SEND],
            [ProtoDef.S2C_GET_EQUIPMENT_LIST, this, 'S2C_GET_EQUIPMENT_LIST', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_GENERAL_EQUIP, this, 'C2S_GENERAL_EQUIP', ProxyEnum.SEND],
            [ProtoDef.S2C_GENERAL_EQUIP, this, 'S2C_GENERAL_EQUIP', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_GENERAL_EQUIP_ALL, this, 'C2S_GENERAL_EQUIP_ALL', ProxyEnum.SEND],
            [ProtoDef.S2C_GENERAL_EQUIP_ALL, this, 'S2C_GENERAL_EQUIP_ALL', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_EQUIPMENT_CHANGE, this, 'S2C_EQUIPMENT_CHANGE', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_GENERAL_EQUIPMENT_CHANGE, this, 'S2C_GENERAL_EQUIPMENT_CHANGE', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_EQUIPMENT_ADD, this, 'S2C_EQUIPMENT_ADD', ProxyEnum.RECEIVE],
            [ProtoDef.S2C_EQUIPMENT_DEL, this, 'S2C_EQUIPMENT_DEL', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_EQUIPMENT_SLOT_UPGRADE, this, 'C2S_EQUIPMENT_SLOT_UPGRADE', ProxyEnum.SEND],
            [ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE, this, 'S2C_EQUIPMENT_SLOT_UPGRADE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_EQUIPMENT_COMPOSE, this, 'C2S_EQUIPMENT_COMPOSE', ProxyEnum.SEND],
            [ProtoDef.S2C_EQUIPMENT_COMPOSE, this, 'S2C_EQUIPMENT_COMPOSE', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_EQUIPMENT_DECOMPOSE, this, 'C2S_EQUIPMENT_DECOMPOSE', ProxyEnum.SEND],
            [ProtoDef.S2C_EQUIPMENT_DECOMPOSE, this, 'S2C_EQUIPMENT_DECOMPOSE', ProxyEnum.RECEIVE],
        ];
    };
    EquipProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        switch (protocol) {
            case ProtoDef.S2C_GET_EQUIPMENT_LIST: {
                var data = body;
                EquipModel.parseEquips(data.equipments);
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_ADD: {
                var data = body;
                EquipModel.parseEquips(data.equipments);
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_DEL: {
                var data = body;
                for (var i = 0; i < data.equipmentUuid.length; i++) {
                    EquipModel.delEquip(data.equipmentUuid[i]);
                }
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_CHANGE: { //装备变化列表
                var data = body;
                for (var i = 0; i < data.equipments.length; i++) {
                    var info = data.equipments[i];
                    EquipModel.updateEquip(info);
                }
                break;
            }
            case ProtoDef.S2C_GENERAL_EQUIPMENT_CHANGE: { //武将装备变化列表
                var data = body;
                for (var i = 0; i < data.generalEquipments.length; i++) {
                    var info = data.generalEquipments[i];
                    var vo = GeneralModel.getOwnGeneral(info.generalId);
                    if (vo)
                        vo.updateEquipSlot(info.slots);
                }
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE: { //强化
                var data = body;
                var vo = GeneralModel.getOwnGeneral(data.generalId);
                for (var i = 0; i < data.slotUpgraded.length; i++) {
                    vo.updateEquipStreng(data.slotUpgraded[i]);
                }
                com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQ_STRENG, { id: vo.generalId, type: data.upgradeType });
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_COMPOSE: {
                com_main.EventMgr.dispatchEvent(GeneralEvent.GENERAL_EQ_COMPOSE, null);
                break;
            }
            case ProtoDef.S2C_EQUIPMENT_DECOMPOSE: { //回收
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, EquipModel.m_tItems);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /**装备列表 */
    EquipProxy.C2S_GET_EQUIPMENT_LIST = function () {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_EQUIPMENT_LIST);
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 格子装备
     * @param uuid 0卸装
     * */
    EquipProxy.C2S_GENERAL_EQUIP = function (generalId, pos, uuid) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GENERAL_EQUIP);
        data.equipmentUuId = uuid;
        data.generalId = generalId;
        data.slotType = pos;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**一键装备 */
    EquipProxy.C2S_GENERAL_EQUIP_ALL = function (generalId, uuids) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GENERAL_EQUIP_ALL);
        data.generalId = generalId;
        data.equipmentUuid = uuids;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**
     * 一键装备
     * @param upgrade 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
     * @param slotType 对应孔位 -1 为一键升级
     * */
    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE = function (generalId, slotType, upgrade) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_EQUIPMENT_SLOT_UPGRADE);
        data.generalId = generalId;
        data.slotType = slotType;
        data.upgradeType = upgrade;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**合成
     * @param itemId 0 批量合成
    */
    EquipProxy.C2S_EQUIPMENT_COMPOSE = function (itemId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_EQUIPMENT_COMPOSE);
        data.equipmentId = itemId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /**分解装备 */
    EquipProxy.C2S_EQUIPMENT_DECOMPOSE = function (uuids) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_EQUIPMENT_DECOMPOSE);
        data.equipmentUuId = uuids;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return EquipProxy;
}(BaseProxy));
