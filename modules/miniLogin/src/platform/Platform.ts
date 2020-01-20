/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {

    getUserInfo(): Promise<any>;

    /**初始化平台 */
    initPlatform();

    login(): Promise<any>;

    //服务器登陆穿透参数
    loginCallback(isp: number,param: string);

    /**监听分享 */
    showShareMenu(): Promise<any>;

    /**分享 */
    share(data:any);

    /**微信关注公众号 */
    WXattention();

    //充值 orderNo 订单号  itemId 商品id
    pay(orderNo: number, shopId: number,shopName:string,price:number): Promise<any>;

    //创角上报
    reportRegister();

    //登录上报
    reportLogin();

    //上报游戏数据
    reportData(dateType: string);
    //是否显示充值类功能
    isHidePayFunc():boolean;
    //渠道屏蔽字检查
    isMsgCheckFunc(msg: string ,callback: Function,target: any);
}

PlatConst.platform = Number($Platform);
if (!window.platform) {
    if (PlatConst.platform == PlatEnum.TS_WEIDUAN) {
        window.platform = new TSWeiduanPlatform();
    } else if (PlatConst.platform == PlatEnum.MOLE_WEB) {
        window.platform = new MoLePlatform();
    } else if (PlatConst.platform == PlatEnum.QUNHEI_WEB) {
        window.platform = new QunHeiPlatform();
    } else if (PlatConst.platform == PlatEnum.MZYW_WEB) {
        window.platform = new MzywPlatform();
    } else if (PlatConst.platform == PlatEnum.DDT_WEB) {
        window.platform = new DdtPlatform();
    } else if (PlatConst.platform == PlatEnum.DDT_WE_CHAT) {
        window.platform = new DdtWxPlatform();
    }else if (PlatConst.platform == PlatEnum.MZYW_ALL_APK) {
        window.platform = new MzywAllApkPlatform();
    }else if (PlatConst.platform == PlatEnum.ZSY_WEB) {
        window.platform = new ZsyPlatform();
    }else if (PlatConst.platform == PlatEnum.ZSY_WE_CHAT) {
        window.platform = new ZsyWxPlatform();
    }else if (PlatConst.platform == PlatEnum.MZYW_IOS) {
        window.platform = new MzywIosPlatform();
    }else if (PlatConst.platform == PlatEnum.JZ_APK) {
        window.platform = new JzApkPlatform();
    }else if (PlatConst.platform == PlatEnum.JZ_APK2) {
        window.platform = new JzApk2Platform();
    }else if (PlatConst.platform == PlatEnum.JZ_APK3) {
        window.platform = new JzApk3Platform();
    }else if (PlatConst.platform == PlatEnum.JZ_APK4) {
        window.platform = new JzApk4Platform();
    }else if (PlatConst.platform == PlatEnum.JZ_H5) {
        window.platform = new JzH5Platform();
    }else if (PlatConst.platform == PlatEnum.HY_APK) {
        window.platform = new HyApkPlatform();
    }
    else {
        window.platform = new DebugPlatform();
    }
    window.platform.initPlatform();

}
// platform.initPlatform();

declare let platform: Platform;

declare interface Window {

    platform: Platform
}







