//乾游Apk
class HyApkPlatform implements Platform {
    private m_httpServerUrl: string = "https://h5.373yx.com/sdk/SdkSendData";

    async getUserInfo() {
        return { nickName: "username" }
    }

    initPlatform(){
        egret.ExternalInterface.addCallback("sendToJS", function (message: string) {
            console.log("message form native : " + message);//message form native : message from native

            let data = JSON.parse(message);
            if(data.type == "login"){
                PlatConst.platformUid = data.userId;
                PlatConst.platformUsername = data.username;
                PlatConst.token = data.sign;
                PlatConst.timestamp = data.timestamp;
                PlatConst.platformId = data.platformId;
                PlatConst.channelId = 515;
                if(this.isClickLogin){
                    this.login();
                }
            }
        });
        let actionType={
            "type":"init"
        }
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
    }

    public isClickLogin = false;
    async login() {
        if(PlatConst.platformUid == ""){
            let actionType={
                "type":"init"
            }
            egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
            this.isClickLogin = true;
            return ;
        }
        else{
            this.isClickLogin = false;
            let actionType={
                "channel_id": "515",
                "timestamp": PlatConst.timestamp,
                "platformId": PlatConst.platformId,
                "sign": PlatConst.token,
                "userId":PlatConst.platformUid.toString(),
                "type": "login_sign",                         
            }
     //       Mini.HttpClient.get((data)=>{
                let data = '1';
                if(PlatConst.platformUid.length > 2 && PlatConst.token.length > 2){
                    data = '0';
                }
                    
                if (data == '0') {
                    // PlatConst.platformUid = 0;
                    // PlatConst.platformUsername = "";
                    PlatConst.token = JSON.stringify({
                        username:"",
                        uid:PlatConst.token,
                        qyChannelId:"515",
                        type:"login",
                        token:PlatConst.platformUid
                    });
                    PlatConst.channelId = 515;
                    LoginManager.runGame();
                } else {
                    console.log("登录失败："+ data);
                }
    //        },this,"code=19&jstr="+JSON.stringify(actionType),this.m_httpServerUrl);
        }
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
            "productId": shopId.toString(),
            "cp_orderid": orderNo.toString(),                         
        }
        let count = 0;
        let describe = shopName;
        let name = shopName;
        
        let actionType={
            "roleId": PlatConst.playerId.toString(),    //角色id
            "roleName": PlatConst.nickName,             //角色名
            "gameGold": "元宝", 
            "cpOrderId": orderNo.toString(),            //服务器名
            "rate":100,       
            "callBackStr": JSON.stringify(callbackjson),                        
            "productName": name,                         
            "money": amount,
            "exStr": "exStr",          
            "noticeUrl":"http://h5.373yx.com:2688/HyApkSdkCallback",             
            "type":"pay"
        }
            
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
        console.log('---测试onClickbuy:'+JSON.stringify(actionType));
    }

    reportRegister(){
        platform.reportData(ReportType.createRole);
    }

    reportLogin(){
        platform.reportData(ReportType.enterServer);
    }

    reportData(dateType: string){
        let infoType = 0;
        if(dateType == "createRole"){
            infoType = 0;
        }
        else if(dateType == "enterServer"){
            infoType = 1;
        }
        else if(dateType == "levelUp"){
            infoType = 2;
        }

        let actionType={
            "id": dateType,                            //当前情景，支持enterServer，levelUp，createRole
            "infoType": infoType,    //角色id
            "roleId": PlatConst.playerId.toString(),    //角色id
            "roleName": PlatConst.nickName,             //角色名
            "roleLevel": PlatConst.level.toString(),    //角色等级
            "serverId": PlatConst.zoneId,   //服务器id
            "serverName": PlatConst.zoneName,           //服务器名
            "vip": PlatConst.vipLevel.toString(),  //vip等级
            "balance": "0",
            "partyName": "无帮派",
            "createRoleTime": new Date().toString(),
            "roleUpLevelTime": new Date().toString(),                          
            "type":dateType
        }
            
        egret.ExternalInterface.call("sendToNative", JSON.stringify(actionType));
        console.log(dateType,'  ---测试onClickbuy:'+JSON.stringify(actionType));
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