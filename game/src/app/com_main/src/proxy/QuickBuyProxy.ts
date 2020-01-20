/**
 * 便捷购买
 */
class QuickBuyProxy extends BaseProxy {

    private static isOpenView: boolean = false;
    protected listenerProtoNotificationsNew(): any[] {
        return [
            [ProtoDef.C2S_GET_QUCKLY_SHOP_BUY_GOODS, this, 'C2S_GET_QUCKLY_SHOP_BUY_GOODS', ProxyEnum.SEND],//获取快速商店商品可购买数量，价格区间
            [ProtoDef.S2C_GET_QUCKLY_SHOP_BUY_GOODS, this, 'S2C_GET_QUCKLY_SHOP_BUY_GOODS', ProxyEnum.RECEIVE],
            [ProtoDef.C2S_QUCKLY_SHOP_BUY_GOODS, this, 'C2S_QUCKLY_SHOP_BUY_GOODS', ProxyEnum.SEND],//购买请求
            [ProtoDef.S2C_QUCKLY_SHOP_BUY_GOODS, this, 'S2C_QUCKLY_SHOP_BUY_GOODS', ProxyEnum.RECEIVE],//购买返回
            
        ];
    }
    public execute(notification: AGame.INotification) {
        let protocol: number = Number(notification.getName());
        let body = notification.getBody();
        switch (protocol) {
            case ProtoDef.S2C_GET_QUCKLY_SHOP_BUY_GOODS: {
                let data = body as gameProto.IS2C_GET_QUCKLY_SHOP_BUY_GOODS;
                if (QuickBuyProxy.isOpenView) {
                    QuickBuyProxy.isOpenView = false;
                   Utils.open_view(TASK_UI.PLAYER_SPEEDY_BUY_PANEL,data);
                }
                break;
            }
             case ProtoDef.S2C_QUCKLY_SHOP_BUY_GOODS: {
               if (body) {
                     EffectUtils.showTips(GCode(CLEnum.BAG_BUY_SUC), 1, false);
				}
                break;
            }
            default:

                break;
        }
        AGame.ServiceBuilder.notifyView(notification);
    }
   /**请求快速商店商品可购买数量，价格区间 */
    public static C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(id: number) {
        QuickBuyProxy.isOpenView=true;
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_QUCKLY_SHOP_BUY_GOODS);
        data.goodsId = id;
        AGame.ServiceBuilder.sendMessage(data);
    }
    /**请求快速商店商品可购买数量，价格区间 */
    public static C2S_GET_QUCKLY_SHOP_BUY_GOODS(id: number) {
        QuickBuyProxy.isOpenView=false;
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_GET_QUCKLY_SHOP_BUY_GOODS);
        data.goodsId = id;
        AGame.ServiceBuilder.sendMessage(data);
    }
      /**请求快速商店商品可购买数量，价格区间 */
    public static C2S_QUCKLY_SHOP_BUY_GOODS(id: number,num:number) {
        let data = AGame.ServiceBuilder.newClazz(ProtoDef.C2S_QUCKLY_SHOP_BUY_GOODS);
        data.goodsId = id;
         data.num = num;
        AGame.ServiceBuilder.sendMessage(data);
    }
}