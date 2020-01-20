//达达兔微信小游戏
class DdtWxPlatform implements Platform {
    //lbgame.sdk.js
    private m_httpServerUrl: string = "https://h5.373yx.com/sdk/SdkSendData";
    public m_token: string = "";

    public d_openid: string = "";
    public d_pf_UqGatv: boolean;
    public d_pf_appid: Number;
    public d_pf_ver: string = "";
    public d_time: Number;

    async getUserInfo() {
        return { nickName: "username" }
    }

    initPlatform(){

    }

    async login() {
        var info = JSON.parse(JSON.stringify($loginInfo));
        PlatConst.platformUid = info["pf_uid"];
        this.d_openid  = info["openid"];
        this.d_pf_appid  = info["pf_appid"];
        this.d_pf_UqGatv  = info["pf_UqGatv"];
        this.d_pf_ver  = info["pf_ver"];
        this.d_time  = info["time"];
        this.m_token  = info["token"];
        console.log('ts达达兔微信小游戏login数据:', PlatConst.platformUid);

        let actionType={
            "channel_id": "505",
            "openid": this.d_openid.toString(),
            "pf_appid": this.d_pf_appid.toString(),
            "pf_UqGatv": this.d_pf_UqGatv.toString(),
            "pf_ver": this.d_pf_ver.toString(),
            "time": this.d_time.toString(),
            "token": this.m_token.toString(),
            "pf_uid":PlatConst.platformUid.toString(),
            "type": "login_sign",
        }
          Mini.HttpClient.get((data)=>{
            if (data == '0') {
                PlatConst.platformUsername = "";
                PlatConst.token = JSON.stringify({
                    username:"",
                    uid:"",
                    qyChannelId:"505",
                    type:"login",
                    token:PlatConst.platformUid.toString()
                });
                PlatConst.channelId = 505;
                LoginManager.runGame();
            } else {
                LoginManager.showTips("登录失败："+ data.msg);
            }
        },this,"code=12&jstr="+JSON.stringify(actionType),this.m_httpServerUrl);
    }

    loginCallback(isp: number,param: string){
        let obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    }

    async showShareMenu() {
      return new Promise((resolve, reject) => {
      var id = 'uhX7C6jGThOpS/wwMN3gBA=='
      var url = 'https://mmocgame.qpic.cn/wechatgame/Z8iaqQZ8v1fKNDu6Qv1rdVic7ick3lWBWghSg1tGhicmgSvgCdq0wWADLhgvyjFDibDJ0/0'
      wx.showShareMenu({
        withShareTicket: true,
        success: function(res) {
            console.log(res, "转发成功")
        },
        fail: function(res) {
            console.log(res, "转发失败")
        },
        complete: function(res) {
            console.log(res, "转发完成")
        }
      })
      wx.onShareAppMessage(function () {
        return {
          title: '别惹三国ol',
          imageUrlId: id,
          imageUrl: url
        }
      })
    })
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
        let dp_time = Math.floor(((new Date()).getTime())/1000);

        let actionSignType={
            "cp_orderid": orderNo.toString(),
            "amount": amount,
            "uid":PlatConst.platformUid,
            "appid": this.d_pf_appid,
            "cp_extinfo": callbackinfo,
            "extinfo": "null",
            "item_id": shopId,
            "item_name": shopName,
            "role_name": PlatConst.nickName,
            "sid": PlatConst.zoneId,
            "time": dp_time
        }
         Mini.HttpClient.get((data)=>{
            signJson = JSON.parse(data);
            window['LBGame'].SylxTK({
                cp_orderid: orderNo.toString(),
                amount : amount,
                uid :PlatConst.platformUid,
                appid :signJson.gameId,
                role_name :PlatConst.nickName,
                item_name :shopName.toString(),
                sid : PlatConst.zoneId.toString(),
                cp_extinfo: signJson.cpextinfo64,
                extinfo: "null",
                item_id : shopId,
                time : dp_time,
                sign :signJson.sign,                      
            });

        },this,"code=10&jstr="+JSON.stringify(actionSignType),this.m_httpServerUrl);
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
            window['LBGame'].onRoleInfo({
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
                "create_time": PlatConst.createTimestamp.toString(),
                sign :signJson.sign,
            });
        },this,"code=11&jstr="+JSON.stringify(actionSignType),this.m_httpServerUrl);
    }

    WXattention(){
       
    }

    isHidePayFunc(){
        if($PlatformSrc.indexOf("sh") != -1){
            return true;
        }
        else{
            return !this.d_pf_UqGatv;
        }
    }

    isMsgCheckFunc(msg: string ,callback: Function,target: any){
     //   callback.call(target,true);
        var actionType = { //传输的数据
             content: msg
        };
        Mini.HttpClient.get((data) => {
            if(data == "0" || data == "42001" || data == "FAILURE"){
                callback.call(target,true);
            }
            else{
                callback.call(target,false);
            }
        }, this, "code=16&jstr="+JSON.stringify(actionType), this.m_httpServerUrl);
    }
}