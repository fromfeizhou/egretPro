//拇指游玩
class MzywPlatform implements Platform {
    //<script src="http://cdn.91muzhi.com/pic/h5sdk/jquery-1.10.2.min.js"></script>
	//<script src="http://91muzhicom-1251304591.file.myqcloud.com/pic/h5sdk/gameh5sdk.js"></script>
    private m_httpServerUrl: string = "https://h5.373yx.com/sdk/SdkSendData";
    public m_token: string = "";
    public m_sign: string = "";

    async getUserInfo() {
        return { nickName: "username" }
    }

    initPlatform(){
        let info = PlatConst.getUrlGet();
        PlatConst.platformUid = info["userId"];
        this.m_sign = info["sign"];
    }

    async login() {
        let actionType={
            "channel_id": "503",
            "sign": this.m_sign,
            "userId":PlatConst.platformUid.toString(),
            "type": "login_sign",                         
        }
         Mini.HttpClient.get((data)=>{
            if (data == '0') {
                // PlatConst.platformUid = 0;
                PlatConst.platformUsername = "";
                PlatConst.token = JSON.stringify({
                    username:"",
                    uid:"",
                    qyChannelId:"503",
                    type:"login",
                    token:PlatConst.platformUid.toString()
                });
                PlatConst.channelId = 503;
                LoginManager.runGame();
            } else {
                console.log("登录失败："+ data.msg);
            }
        },this,"code=5&jstr="+JSON.stringify(actionType),this.m_httpServerUrl);
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
        let callbackinfo = "rolename="+PlatConst.nickName;
        let amount = price * 100;   //金额 单位分
      //  let amount = 10;   //金额 单位分
        let signJson;

        let actionSignType={
            "cp_order_id": orderNo.toString(),
            "amount": amount,
            "userId":PlatConst.platformUid.toString(),
            "level": PlatConst.level,
            "server_id": PlatConst.zoneId.toString(),                         
        }
         Mini.HttpClient.get((data)=>{
            signJson = JSON.parse(data);
            window['mzh5sdk'].placeOrder({
                userId :PlatConst.platformUid.toString(),
                packetId :signJson.packetId,
                coin_name :'钻石',
                game_id :signJson.gameId,
                pay_type :'iospay', //仅h5Type为’h5_ios_on_line’时
                cp_order_id :orderNo.toString(),
                amount : amount,
                server_id : PlatConst.zoneId.toString(),
                level : PlatConst.level,
                transData :callbackinfo,
                role_id:PlatConst.playerId.toString(),
                roduct_id : shopId.toString,
                sign :signJson.sign,                      
            });

        },this,"code=6&jstr="+JSON.stringify(actionSignType),this.m_httpServerUrl);
    }

    reportRegister() {
        console.log("---mzh5sdk uploadRole");
        window['mzh5sdk'].uploadRole({ 
          "u": PlatConst.platformUid.toString(),
          "g": '1189',
          "s": PlatConst.zoneId.toString(),
          "sn": PlatConst.zoneName.toString(),
          "r": PlatConst.playerId.toString(),
          "rn": PlatConst.nickName.toString(),
          "rl": PlatConst.level.toString(),
          "cn": '0',
          "rvl": PlatConst.vipLevel.toString()});
    }

    reportLogin() {
        // this.reportRegister();
    }

    reportData(dateType: string) {

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