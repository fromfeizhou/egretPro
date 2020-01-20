//九紫H5
class JzH5Platform implements Platform {
    private m_httpServerUrl: string = "https://h5.373yx.com/sdk/SdkSendData";
    public m_token: string = "";
    public m_ggid: string = "";
    public m_ggkey: string = "";
    public m_jzdata: string = "";
    public m_ver: string = "";

    async getUserInfo() {
        return { nickName: "username" }
    }

    initPlatform(){
        //ggid=游戏id&ggkey=游戏key&ctype=渠道&devidfa=设备idfa&guid=玩家id&username=玩家昵称&token=玩家登录标识
        let info = PlatConst.getUrlGet();
        PlatConst.platformUid = info["uid"];
        PlatConst.platformUsername = info["username"];
        this.m_ggid = info["ggid"];
        this.m_token = info["token"];
        this.m_ggkey = info["ggkey"];
        this.m_jzdata = info["jzdata"];
        this.m_ver = info["ver"];

        var options = {
            'gid': this.m_ggid,
            'Key':this.m_ggkey,  //私有的key
            'ver':this.m_ver,              //游戏版本，若请求的url中有devidfv则优先使用
        };
        window['h5sdk'] = new window['H5SDK'](options);
    }

    public isClickLogin = false;
    async login() {
         let actionType={
            "channel_id": "514",
            "access_token": this.m_token,
            "uid":PlatConst.platformUid.toString(),
            "type": "login_sign",                         
        }
         Mini.HttpClient.get((data)=>{
            if (data == '0') {
                // PlatConst.platformUid = 0;
               // PlatConst.platformUsername = "";
                PlatConst.token = JSON.stringify({
                    username:"",
                    uid:"",
                    qyChannelId:"514",
                    type:"login",
                    token:PlatConst.platformUid.toString()
                });
                PlatConst.channelId = 514;
                LoginManager.runGame();
            } else {
                console.log("登录失败："+ data.msg);
            }
        },this,"code=18&jstr="+JSON.stringify(actionType),this.m_httpServerUrl);
    }

    loginCallback(isp: number,param: string){
        let obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    }

    async showShareMenu() {

    }

    /**分享 */
    share(data:any){
        
    }

    async pay(orderNo: number, shopId: number,shopName:string,price:number) {
        let amount = price;   //金额 单位元
        let callbackjson={
            "rolename": PlatConst.nickName,
            "roleid": PlatConst.playerId.toString(),
            "productId": shopId.toString(),
            "cp_orderid": orderNo.toString(),                         
        }
        let count = 0;
        let describe = shopName;
        let name = shopName;
            
        window['h5sdk'].pay(this.m_ggid, this.m_ggkey, this.m_token, amount.toString(), 
            PlatConst.platformUid.toString(), PlatConst.platformUsername, PlatConst.level.toString(), PlatConst.playerId.toString(),
            PlatConst.nickName, PlatConst.zoneId, JSON.stringify(callbackjson), this.m_jzdata, function() {
                console.log("充值完成");
            });
    }

    reportRegister(){
        platform.reportData(ReportType.createRole);
    }

    reportLogin(){
        platform.reportData(ReportType.enterServer);
    }

    reportData(dateType: string){
        window['h5sdk'].reportRoleInfo(this.m_ggid, this.m_ggkey, this.m_token, PlatConst.platformUsername,
        PlatConst.platformUid.toString(), PlatConst.zoneId.toString(), PlatConst.level.toString(), PlatConst.playerId.toString(), PlatConst.nickName, this.m_jzdata,
            //上传成功后的回调
            function(successData){
                console.log(successData);
            },
            //上传失败后的回调
            function (errorData) {
                alert(JSON.stringify(errorData));
            });
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