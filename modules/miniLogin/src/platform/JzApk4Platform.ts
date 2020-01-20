//九紫Apk(挂机三国志BT版)
class JzApk4Platform implements Platform {
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
                PlatConst.channelId = 513;
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
            PlatConst.platformUsername = "";
            PlatConst.token = JSON.stringify({
                username:"",
                uid:PlatConst.token,
                qyChannelId:"513",
                type:"login",
                token:PlatConst.platformUid.toString()
            });
            PlatConst.channelId = 513;
            LoginManager.runGame();
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
        let callbackinfo = "rolename="+PlatConst.nickName+"~"+"roleid="+PlatConst.playerId+"~"+"productId="+shopId.toString()+"~uid="+PlatConst.platformUid.toString()+"~"+"sid="+PlatConst.zoneId.toString()+"~"+"cp_orderid="+orderNo.toString();
        let count = 0;
        let describe = shopName;
        let name = shopName;
        
        let actionType={
            "role_id": PlatConst.playerId.toString(),    //角色id
            "palyerName": PlatConst.nickName,             //角色名
            "serverName": PlatConst.zoneName, 
            "roleLevel": PlatConst.level,    //角色等级
            "serverId": PlatConst.zoneId.toString(),     //服务器id
            "cpOderId": orderNo.toString(),            //服务器名
            "ratio":10,       
            "callbackinfo": callbackinfo,                        
            "goods": name,                         
            "money": amount,
            "shopId": shopId.toString(),
            "vipLevel": PlatConst.vipLevel.toString(),                       
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
        let actionType={
            "id": dateType,                            //当前情景，支持enterServer，levelUp，createRole
            "roleId": PlatConst.playerId.toString(),    //角色id
            "roleName": PlatConst.nickName,             //角色名
            "roleLevel": PlatConst.level.toString(),    //角色等级
            "ServerId": PlatConst.zoneId.toString(),   //服务器id
            "ServerName": PlatConst.zoneName,           //服务器名
            "RoleVipLv": PlatConst.vipLevel.toString(),  //vip等级
            "user_id": PlatConst.platformUid.toString(),
            "game_id": "1207",                              
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