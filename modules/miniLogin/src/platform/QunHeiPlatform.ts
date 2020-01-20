/**群黑 */
class QunHeiPlatform implements Platform {
    private m_httpServerUrl2: string = "https://h5.373yx.com/sdk/SdkSendData";
    private time: number = 0; //登录时间(UNIX时间戳)
    private isadult: number = 0; //防沉迷标识(1是成年，0是未成年)
    private qhzoneId: number = 0;
    private uimg: string; //玩家头像
    private nname: string; //玩家昵称
    private unid: string; //玩家来源
    private qhchannel: string; //玩家标识
    private qhchannelid: string; //玩家标识id
    private showbtn: string; //该参数用来判断是否显示分享，关注，邀请按钮(1=不显示，其他则显示)
    private flag: string; //验证签名，md5(username+serverid+isadult+time+key) 

    async getUserInfo() {
        return { nickName: "username" }
    }
    initPlatform() {
        let info = PlatConst.getUrlGet();
        PlatConst.platformUsername = info["username"];
        this.qhzoneId = info["serverid"];
        this.time = info["time"];
        this.isadult = info["isadult"];
        this.uimg = info["uimg"];
        this.nname = info["nname"];
        this.unid = info["unid"];
        this.qhchannel = info["qhchannel"];
        this.qhchannelid = info["qhchannelid"];
        this.showbtn = info["showbtn"];
        this.flag = info["flag"];

        var initdata = {
            "username": PlatConst.platformUsername,//用户id，群黑登录接口里面username参数
            "gid": '4537',//群黑游戏id，可以在后台游戏列表查询
            "qhchannel": this.qhchannel,//用户标识，群黑登录接口里面qhchannel参数
            "qhchannelid": this.qhchannelid,//用户标识id，群黑登录接口里面qhchannelid参数
            "time": this.time//用户登录时间戳，群黑登录接口里面time参数
        };
        window['qhsdk'].init(initdata);
        console.log(JSON.stringify(initdata))
    }

    async login() {
        PlatConst.token = JSON.stringify({
            username: PlatConst.platformUsername,
            uid: PlatConst.platformUsername,
            qyChannelId: "502",
            type: "login",
            token: PlatConst.platformUsername
        });
        PlatConst.channelId = 502;
         LoginManager.runGame();
        // 未知错误
        // console.log(("错误码：" + initdata);
    }

    loginCallback(isp: number, param: string) {
        let obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    }
    async showShareMenu() {
        window['qhsdk'].share(function (e) {
            if (e.data == 'shareok') {
                // 分享成功
            }

        });
    }
    /**分享 */
    share(data: any) {

    }

    async pay(orderNo: number, shopId: number,shopName:string,price:number) {
        let amount = price;   //金额 单位元
        let goodsId = shopId;   //商品id
        let goodsName = shopName;   //商品名字
        //后台参数
        let ext =`serverid=${PlatConst.zoneId}|productid=${goodsId}|cp_order_id=${orderNo}`
      
       // let ext = JSON.stringify(extJson);
        // let actionType = {
        //     "money": amount,
        //     "userId": PlatConst.platformUsername,
        //     "ext": ext,
        // }
        let md = new md5();
        let sign = md.hex_md5(`${amount}${PlatConst.platformUsername}${ext}17c3385d0b97b1ac553a90e851a09384`);
        var paydata = {
            "userId": PlatConst.platformUsername,
            "gid": '4537',
            "roleName": this.nname,
            "goodsId": goodsId.toString(),
            "goodsName": goodsName.toString(),
            "money": amount,
            "ext": ext,
            "serverId": this.qhzoneId,
            "roleId": PlatConst.playerId.toString(),
            "sign": sign
        };

        // Utils.open_view(TASK_UI.COM_HELP_DOC, {content:JSON.stringify(paydata),title:GCode(CLEnum.WOR_HELP_TITLE)});
        window['qhsdk'].pay(paydata, function (code, msg) {
            //充值结果通知，code为编号，msg为信息。该结果不能作为发货依据。该回调已经取消！！请使用后端回调判断发货
            console.log(code + ',' + msg);
        });
        // HttpClient.get((data) => {
            // var jsData = JSON.parse(data);
        // }, this, "code=3&jstr=" + JSON.stringify(actionType), this.m_httpServerUrl2);
    }

    reportRegister() {
        var PlatConst = { "act": "1", "serverid": PlatConst.zoneId, "rolename": this.nname, "roleid": PlatConst.playerId, "level": PlatConst.level, "power": PlatConst.power };
        window['qhsdk'].role(PlatConst);
    }
    reportLogin() {

    }
    reportData(dateType: string) {

    }

    WXattention() {

    }

    isHidePayFunc(){
        return false;
    }

    isMsgCheckFunc(msg: string ,callback: Function,target: any){
        callback.call(target,true);
    }
}