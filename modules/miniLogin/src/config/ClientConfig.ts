class ClientConfig {
    /**配置列表成功回调 */
    private static m_pCall: any;
    private static m_pCallObj: any;
    private static m_loader: egret.URLLoader;

    /**配置初始化 */
    public static setup(call: any, thisObj: any) {
        this.m_pCall = call;
        this.m_pCallObj = thisObj;

        this.m_loader = new egret.URLLoader();
        this.m_loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        this.m_loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        //加载地址配置
        this.load(GameConfig.getClientConfigUrl());
    }

    private static load(resUrl: string) {
        var request: egret.URLRequest = new egret.URLRequest(resUrl);
        this.m_loader.load(request);
    }

    private static onLoadComplete(event: egret.Event): void {
        var loader: egret.URLLoader = <egret.URLLoader>event.target;
        var jsonStr = loader.data as string;
        // jsonStr = jsonStr.replace(/(\/\/).*/g, '');
        let config = JSON.parse(jsonStr);
        GameConfig.version = config['version'];
        this.m_loader.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        //配置加载完毕
        if (this.m_pCall) {
            this.m_pCall.call(this.m_pCallObj);
            this.m_pCall = null;
            this.m_pCallObj = null;
        }
    }

}
window["Mini"] = Mini;
window["LoginConst"] = LoginConst;
window["md5"] = md5;
window["ClientConfig"] = ClientConfig;
window["GameConfig"] = GameConfig;
window["BattleQualityEnum"] = BattleQualityEnum;
window["LocalData"] = LocalData;
window["PlatConst"] = PlatConst;
window["IPSeEnum"] = IPSeEnum;
window["LoginManager"] = LoginManager;
window["ReportType"] = ReportType;