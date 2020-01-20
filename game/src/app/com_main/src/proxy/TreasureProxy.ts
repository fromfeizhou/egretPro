/**宝物协议 */
class TreasureProxy extends BaseProxy {

    protected listenerProtoNotifications(): any[] {
        return [
            [ProtoDef.TREASURE_ALL_INFO, this, 'GetTreasureMessageInfoReq', 'GetTreasureMessageInfoResp'],//请求宝物信息
            [ProtoDef.TREASURE_UPGRADE, this, 'TreasureUpgradeReq', 'TreasureUpgradeResp'],    //宝物升级
            [ProtoDef.TREASURE_UPGRADE_STAR, this, 'TreasureUpgradeStarReq', 'TreasureUpgradeStarResp'],    //宝物升星
            [ProtoDef.TREASURE_ASSEMBLING_GEMSTONE, this, 'TreasureAssemblingGemstoneReq', 'TreasureAssemblingGemstoneResp'],    //宝物装配宝石
            [ProtoDef.GAIN_TREASURE, this, '', 'GainTreasureResp'],    //获得宝物
            [ProtoDef.TREASURE_ASSEMBLING_GENERAL, this, '', 'TreasureAssemblingGeneralResp'], //宝物装配
            [ProtoDef.GEMSTONE_UP, this, 'GemstoneUpReq', 'GemstoneUpResp'],// 宝石合成

        ];
    }

    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {
            //请求宝物信息
            case ProtoDef.TREASURE_ALL_INFO: {
                TreasureModel.initDataList(body.infos);
                break;
            }
            //宝物升级
            case ProtoDef.TREASURE_UPGRADE: {
                let data = body as gameProto.ITreasureUpgradeResp;
                if (data.info) {
                    TreasureModel.updateData(data.info);
                    com_main.EventMgr.dispatchEvent(TreaEvent.TREA_LEVEL_UPDATE, { itemId: data.info.itemId, level: data.level });
                }
                break;
            }
            //宝物升星
            case ProtoDef.TREASURE_UPGRADE_STAR: {
                let data = body.info as gameProto.ITreasureMessageInfo;
                if (data) {
                    TreasureModel.updateData(data);
                    com_main.EventMgr.dispatchEvent(TreaEvent.TREA_STAR_UPDATE, data.itemId);
                }
                break;
            }
            //宝物装配宝石
            case ProtoDef.TREASURE_ASSEMBLING_GEMSTONE: {
                let data = body as gameProto.ITreasureAssemblingGemstoneResp;
                if (data) {
                    TreasureModel.updateData(data.info);
                    com_main.EventMgr.dispatchEvent(TreaEvent.TREA_STONE_UPDATE, data.info.itemId);
                }
                break;
            }
            //获得宝物
            case ProtoDef.GAIN_TREASURE: {
                if (body.infos) {
                    for (let i = 0; i < body.infos.length; i++) {
                        TreasureModel.addData(body.infos[i]);
                    }
                }
                break;
            }
            //宝物装配
            case ProtoDef.TREASURE_ASSEMBLING_GENERAL: {
                let data = body as gameProto.ITreasureAssemblingGemstoneResp;
                if (data.info) {
                    TreasureModel.updateData(data.info);
                }
                break;
            }
            case ProtoDef.GEMSTONE_UP: {
                EffectUtils.showTips(GCode(CLEnum.TREA_BS_HCCG), 1);
                break;
            }
            default:
                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    }


    /**获得宝物信息 */
    public static send_TREASURE_ALL_INFO() {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.TREASURE_ALL_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**宝物升级 */
    public static send_TREASURE_UP_GRADE(itemId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.TREASURE_UPGRADE) as gameProto.ITreasureUpgradeReq;
        data.itemId = itemId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**宝物升星 */
    public static send_TREASURE_UPGRADE_STAR(itemId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.TREASURE_UPGRADE_STAR) as gameProto.ITreasureUpgradeStarReq;
        data.itemId = itemId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**宝物装配宝石
     * 
     */
    public static send_TREASURE_ASSEMBLING_GEMSTONE(itemId: number, pos: number, gemstoneId: number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.TREASURE_ASSEMBLING_GEMSTONE) as gameProto.ITreasureAssemblingGemstoneReq;
        data.itemId = itemId;
        data.pos = pos;
        data.gemstoneId = gemstoneId;
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**宝石合成 */
    public static send_GEMSTONE_UP(gemstoneId, count) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.GEMSTONE_UP);
        data.gemstoneId = gemstoneId;
        data.count = count;
        AGame.ServiceBuilder.sendMessage(data);
    }

}