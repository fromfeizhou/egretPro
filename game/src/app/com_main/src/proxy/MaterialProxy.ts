/**
 * boss挑战
 */
class MaterialProxy extends BaseProxy {
    private static isOpenView: boolean = false;

    protected listenerProtoNotificationsNew(): any[] {
        return [
            [ProtoDef.C2S_MATERIAL_INFO, this, 'C2S_MATERIAL_INFO', ProxyEnum.SEND], //发送材料副本信息
            [ProtoDef.S2C_MATERIAL_INFO, this, 'S2C_MATERIAL_INFO', ProxyEnum.RECEIVE], //材料副本信息返回
            [ProtoDef.C2S_MATERIAL_CHALLENGE, this, 'C2S_MATERIAL_CHALLENGE', ProxyEnum.SEND], //挑战材料副本请求
            [ProtoDef.C2S_MATERIAL_BUY, this, 'C2S_MATERIAL_BUY', ProxyEnum.SEND], //请求购买挑战次数
            [ProtoDef.S2C_MATERIAL_BUY, this, 'S2C_MATERIAL_BUY', ProxyEnum.RECEIVE], //返回购买挑战次数
       
        ];
    }
    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_MATERIAL_INFO: {//获得信息
                MaterialModel.MaterialData(body);
                if (MaterialProxy.isOpenView) {
                    MaterialProxy.isOpenView = false;
                    Utils.open_view(TASK_UI.MATERIAL_INFO_PANEL, { tag: MaterialModel.copyType });
                }
                break;
            }
              case ProtoDef.S2C_MATERIAL_BUY: {//购买次数返回
                 MaterialModel.reBuyCountData(body);
                 EffectUtils.showTips(GCode(CLEnum.MAT_BUY_SUC), 1, true);
                break;
            }
            default:

                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    }

    /**发送获得材料副本信息*/
    public static C2S_MATERIAL_INFO_OPEN() {
        this.isOpenView = true;
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MATERIAL_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    }

    /**发送获得材料副本信息*/
    public static C2S_MATERIAL_INFO() {
        this.isOpenView = false;
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MATERIAL_INFO);
        AGame.ServiceBuilder.sendMessage(data);
    }

    /** 挑战 扫荡材料副本请求*/
    public static C2S_MATERIAL_CHALLENGE(id: number,bool: boolean) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MATERIAL_CHALLENGE);
        data.id = id;
        data.sweep =bool;
        AGame.ServiceBuilder.sendMessage(data,null,null,true);
    }
    
    /**请求购买次数*/
    public static C2S_MATERIAL_BUY(type: number,count:number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_MATERIAL_BUY);
        data.type = type;
        data.count = count;
        AGame.ServiceBuilder.sendMessage(data);
    }
}