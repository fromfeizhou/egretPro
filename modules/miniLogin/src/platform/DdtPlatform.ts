//达达兔
class DdtPlatform implements Platform {
    //<script type="text/javascript" src="https://m.ddt.lynaqi.com/static/JS-SDK/ddt.sdk.js"></script>
    private m_httpServerUrl: string = "https://h5.373yx.com/sdk/SdkSendData";
    public m_token: string = "";
    public m_sign: string = "";

    public d_platform: string = "";
    public d_openid: string = "";
    public d_sid: Number;
    public d_appid: Number;
    public d_time: string = "";
    public d_extinfo: string = "";
    public d_invited_role_id: string = "";
    public d_callback_url: string = "";

    async getUserInfo() {
        return { nickName: "username" }
    }

    initPlatform(){
        let info = PlatConst.getUrlGet();
        PlatConst.platformUid = info["uid"];
        this.m_sign = info["sign"];

        this.d_platform = info["platform"];
        this.d_openid = info["openid"];
        this.d_appid = info["appid"];
        this.d_sid = info["sid"];
        this.d_time = info["time"];
        this.d_extinfo = info["extinfo"];
        this.d_invited_role_id = info["invited_role_id"];
        this.d_callback_url = info["callback_url"];
        window['DDTGame'].inIt({
            platform: this.d_platform,
            uid :PlatConst.platformUid,
            appid :this.d_appid,
            openid :this.d_openid,
            extInfo :this.d_extinfo,
            debug : false,                     
        });
    }

    async login() {
        let actionType={
            "channel_id": "504",
            "sign": this.m_sign,
            "appid": this.d_appid,
            "callback_url": this.d_callback_url,
            "extinfo": this.d_extinfo,
            "invited_role_id": this.d_invited_role_id,
            "openid": this.d_openid,
            "platform": this.d_platform,
            "sid": this.d_sid,
            "time": this.d_time,
            "uid":PlatConst.platformUid.toString(),
            "type": "login_sign",
        }
         Mini.HttpClient.get((data)=>{
            if (data == '0') {
                // PlatConst.platformUid = 0;
                PlatConst.platformUsername = "";
                PlatConst.token = JSON.stringify({
                    username:"",
                    uid:"",
                    qyChannelId:"504",
                    type:"login",
                    token:PlatConst.platformUid.toString()
                });
                PlatConst.channelId = 504;
                LoginManager.runGame();
            } else {
                console.log("登录失败："+ data.msg);
            }
        },this,"code=8&jstr="+JSON.stringify(actionType),this.m_httpServerUrl);
    }

    loginCallback(isp: number,param: string){
        let obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    }

    async showShareMenu() {
        
    }

    share(data:any){
       
    }

    loginGame(uid?: string, token?: string, channelId?: string, username?: string) {

    }

    public count = 1;
    async pay(orderNo: number, shopId: number,shopName:string,price:number) {
        let callbackinfo = "rolename="+PlatConst.nickName+"~"+"roleid="+PlatConst.playerId+"~"+"productId="+shopId.toString();
        let amount = price;
        let signJson;
        let dp_time = (new Date()).getTime();

        let actionSignType={
            "cp_orderid": orderNo.toString(),
            "amount": amount,
            "uid":PlatConst.platformUid,
            "cp_extinfo": callbackinfo,
            "extinfo": this.d_extinfo,
            "item_id": shopId,
            "item_name": shopName,
            "role_name": PlatConst.nickName,
            "sid": PlatConst.zoneId,
            "time": dp_time,
        }
         Mini.HttpClient.get((data)=>{
            signJson = JSON.parse(data);
            window['DDTGame'].Pay({
                cp_orderid: orderNo.toString(),
                amount : amount,
                uid :PlatConst.platformUid,
                appid :signJson.gameId,
                role_name :PlatConst.nickName,
                item_name :shopName,
                sid : PlatConst.zoneId,
                "cp_extinfo": callbackinfo,
                "extinfo": this.d_extinfo,
                item_id : shopId,
                time : dp_time,
                sign :signJson.sign,                      
            });

        },this,"code=7&jstr="+JSON.stringify(actionSignType),this.m_httpServerUrl);
    }

    reportRegister() {
       this.ddtReportData("1");
    }

    reportLogin() {
       this.ddtReportData("2");
    }

    reportData(dateType: string) {
        if(dateType == 'levelUp'){
            this.ddtReportData("3");
        }
    }

    ddtReportData(dateType: string) {
        let dp_time = (new Date()).getTime();
        let actionSignType={
            "type":dateType,
            "uid": PlatConst.platformUid.toString(),
            "roleid": PlatConst.playerId.toString(),
            "role_name": PlatConst.nickName.toString(),
            "sid": PlatConst.zoneId.toString(),
            "server_name": PlatConst.zoneName.toString(),
            "level": PlatConst.level.toString(),
            "power": "0",
            "vip": PlatConst.vipLevel.toString(),
            "time": dp_time.toString(),
            "create_time": PlatConst.createTimestamp.toString(),
        }
        Mini.HttpClient.get((data)=>{
            let signJson = JSON.parse(data);
            window['DDTGame'].onUserInfo({
                "type":dateType,
                "appid":signJson.gameId,
                "uid": PlatConst.platformUid,
                "roleid": PlatConst.playerId.toString(),
                "role_name": PlatConst.nickName,
                "sid": PlatConst.zoneId,
                "server_name": PlatConst.zoneName,
                "level": PlatConst.level,
                "power": 0,
                "vip": PlatConst.vipLevel.toString(),
                "time": dp_time,
                "create_time": PlatConst.createTimestamp,
                sign :signJson.sign,
            });
        },this,"code=9&jstr="+JSON.stringify(actionSignType),this.m_httpServerUrl);
    }

    WXattention(){
       
    }

    isHidePayFunc(){
        return false;
    }

    isMsgCheckFunc(msg: string ,callback: Function,target: any){
        callback.call(target,true);
    }
}