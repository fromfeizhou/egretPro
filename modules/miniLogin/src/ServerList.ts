interface IServerData {
    /**服务器id */
    id?: number;
    /**服务器名称 */
    name?: string;
    /**服务器id */
    ip?: string;
    /**服务器端口 */
    port?: number;
    /**状态 1爆 2通畅 3维护*/
    status?: number;
    /**ssl */
    ssl?: number;
    /**维护公告 */
    notice?: string;
    /**是否推荐服 1 推荐 */
    rec?: number;

}
class ServerList {
    /**服务器下载列表成功标记 */
    public static SERVER_INIT_SUCCESS: boolean = false;
    /**服务器队列 */
    public static m_pDatas: Array<IServerData>;
    /**获取服务器列表成功回调 */
    private static m_pCall: any;
    private static m_pCallObj: any;
    /**服务器列表初始化 */
    public static initServerList(call: any, thisObj: any) {
        this.m_pCall = call;
        this.m_pCallObj = thisObj;
        this.load();
    }

    private static load() {
        var loader: egret.URLLoader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
        loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadError, this);
        var request: egret.URLRequest = new egret.URLRequest(GameConfig.getServerListUrl());
        request.requestHeaders = [new egret.URLRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")];
        loader.load(request);
    }

    private static onLoadError(event: egret.Event) {
        LoginManager.showConfirmPop("服务器列表下载失败，请检查网络情况！", this.load, this);
    }

    private static onLoadComplete(event: egret.Event): void {
        this.SERVER_INIT_SUCCESS = true;
        var loader: egret.URLLoader = <egret.URLLoader>event.target;
        var serverRequest = loader.data as string;
        let list = JSON.parse(serverRequest);
        this.m_pDatas = [];
        for (let i = 0; i < list.length; i++) {
            this.m_pDatas.push(list[i]);
        }
        console.log('获取服务器列表:', this.m_pDatas);
        if (this.m_pCall) {
            this.m_pCall.call(this.m_pCallObj);
        }

        this.m_pCall = null;
        this.m_pCallObj = null;

    }

    public static getDataByIndex(id: number): IServerData {
        // if(index >= this.m_pDatas.length) index = 0;
        for (let data of this.m_pDatas) {
            if (data.id == id) {
                return data;
            }
        }
        return this.m_pDatas[this.m_pDatas.length - 1];
    }

    public static getDatas(): Array<IServerData> {
        return this.m_pDatas;
    }

    public static getRecommendServerIndex(): number {
        for (let data of this.m_pDatas) {
            if (data.rec == 1) {
                return data.id;
            }
        }
        return 0;
    }
}
