//魔乐
class MoLePlatform implements Platform {

    private m_httpServerUrl2: string = "https://h5.373yx.com/sdk/SdkSendData";
    public m_token: string = "";

    async getUserInfo() {
        return { nickName: "username" }
    }

    initPlatform(){

    }

    async login() {
        window['Hyh5sdk'].login(function(data) {
                if (data.data && data.data.token) {
                    this.m_token = data.data.token;
                    var token = data.data.token;

                    // PlatConst.platformUid = 0;
                    PlatConst.platformUsername = "";
                    PlatConst.token = JSON.stringify({
                        username:"",
                        uid:"",
                        qyChannelId:"501",
                        type:"login",
                        token:data.data.token
                    });
                    PlatConst.channelId = 501;
                     LoginManager.runGame();
                } else {
                    // 未知错误
                    console.log("错误码："+ data.code);
                }

            });
    }

    loginCallback(isp: number,param: string){
        let obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    }

    async showShareMenu() {
        
    }

    /**分享 */
    share(data:any){
        window['Hyh5sdk'].share(function(data) {
            if (data.code === 0) {
                console.log("分享成功");
            } else {
                console.log("分享失败："+ data.data.msg);
            }

        });
    }

    loginGame(uid?: string, token?: string, channelId?: string, username?: string) {

    }

    async pay(orderNo: number, shopId: number,shopName:string,price:number) {
        let callbackinfo = "rolename="+PlatConst.nickName+"~"+"sid="+PlatConst.zoneId.toString()+"~"+"productid="+shopId.toString();
        let amount = price;   //金额 单位元
        let md5Obj = new md5();

        let actionType={
            "channel_id": "501",
            "amount":amount,
            "callbackinfo": callbackinfo,
            "cp_order_id":orderNo.toString(),                        //
            "role_id": PlatConst.playerId.toString(),    //角色id
            "role_name": PlatConst.nickName,             //角色名字
            "user_id":PlatConst.platformUid.toString(),
            "type": "getpay",                         
        }
        Mini.HttpClient.get((data)=>{
            // Utils.open_view(TASK_UI.COM_HELP_DOC, {content:data,title:GCode(CLEnum.WOR_HELP_TITLE)});
            window['Hyh5sdk'].pay(JSON.parse(data), function(data) {
                if (data.code !== 0) {
                    console.log("充值失败 :"+ data.code);
                } else {
                    console.log("充值成功");
                }
            });
        },this,"code=2&jstr="+JSON.stringify(actionType),this.m_httpServerUrl2);
    }

    reportRegister() {
        let actionType={
            "channel_id": "501",                        //
            "server_id": PlatConst.zoneId.toString(),   //服务器id
            "role_id": PlatConst.playerId.toString(),    //角色id
            "role_level": PlatConst.level.toString(),    //角色等级
            "role_name": PlatConst.nickName,             //角色名字
            "token": PlatConst.token,                   //服务器id
            "user_id":PlatConst.platformUid.toString(),
            "type": "sendrole",                         
        }
        Mini.HttpClient.get(()=>{

        },this,"code=1&jstr="+JSON.stringify(actionType),this.m_httpServerUrl2);
    }

    reportLogin() {
        // this.reportRegister();
    }

    reportData(dateType: string) {

    }

    WXattention(){
        window["Hyh5sdk"].subscribe(function(data) {

        if (data.code === 0) {
            // 关注成功，处理逻辑...
            // TODO
            console.log("关注成功");
        } else {
            // 未知错误
            // 错误消息: data.data.msg
            console.log("关注失败："+ data.data.msg);
        }

    });
    }

    isHidePayFunc(){
        return false;
    }

    isMsgCheckFunc(msg: string ,callback: Function,target: any){
        callback.call(target,true);
    }
}