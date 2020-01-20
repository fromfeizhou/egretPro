//拓世平台
class TSWeiduanPlatform implements Platform {
    async getUserInfo() {
        return { nickName: "username" }
    }

    initPlatform(){
        egret.ExternalInterface.addCallback("sendToJS", function (message: string) {
            console.log("message form native : " + message);//message form native : message from native

            let data = JSON.parse(message);
            if(data.type == "login"){
                PlatConst.platformUid = data.uid;
                PlatConst.platformUsername = data.name;
                PlatConst.token = message;
                PlatConst.channelId = Number(data.channelId);
            }
        });
    }

    async login() {
         LoginManager.runGame();
    }

    loginCallback(isp: number,param: string){

    }

    async showShareMenu() {

    }

    /**分享 */
    share(data:any){
        
    }

    async pay(orderNo: number, shopId: number,shopName:string,price:number) {
      
        let amount = price;   //金额 单位元
        // let arwardList = Utils.parseCommonItemJson(cfg.reward);
        let count = 0;
        let describe = shopName;
        let name = shopName;
        
        let actionType={
            "ext": "1234567",                          //服务器透传参数
            "roleId": PlatConst.playerId.toString(),    //角色id
            "roleName": PlatConst.nickName,             //角色名
            "roleLevel": PlatConst.level.toString(),    //角色等级
            "zoneId": PlatConst.zoneId.toString(),     //服务器id
            "zoneName": PlatConst.zoneName,            //服务器名
            "balance": PlatConst.gold.toString(),       //当前金币
            "callbackinfo": "",                        //支付结果回调信息
            "callbackurl": "",                         //支付回调地址
            "amount": amount + '',                     //金额 单位元
            "count": count + '',                       //购买虚拟货币
            "cp_order_id": orderNo,                    //订单号
            "describe": describe,                      //商品描述
            "pname": name,                             //商品名字
            "viplevel": PlatConst.vipLevel.toString(),  //vip等级
            "partyname": PlatConst.guildName,   //帮派名字
            "product_id": shopId,           //商品id
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
        let gameRoleGender = PlatConst.gender? "女":"男";
        let actionType={
            "id": dateType,                            //当前情景，支持enterServer，levelUp，createRole
            "roleId": PlatConst.playerId.toString(),    //角色id
            "roleName": PlatConst.nickName,             //角色名
            "roleLevel": PlatConst.level.toString(),    //角色等级
            "zoneiId": PlatConst.zoneId.toString(),   //服务器id
            "zoneName": PlatConst.zoneName,           //服务器名
            "balance": PlatConst.gold.toString(),       //当前金币
            "viplevel": PlatConst.vipLevel.toString(),  //vip等级
            "partyName": PlatConst.guildName,   //帮派名字
            "extra" : "",                              //扩展信息，某些特殊渠道用户信息入口，默认请随便传值，不能为null
            "roleCreateTime": PlatConst.createTimestamp.toString(),  //角色创建时间
            "gameRoleGender": gameRoleGender,                      //角色性别
            "rolePower": PlatConst.power.toString(), //战力
            "partyRoleId": "123456",                   //360渠道参数，设置角色在帮派中的id
            "partyId": PlatConst.guildId.toString(),    //360渠道参数，设置帮派id，必须为整型字符串
            "partyRoleName": "",                               //角色在帮派中的名称
            "professionId": PlatConst.countryId.toString(),     //角色职业id (国家id)
            "profession": PlatConst.countryName,                         //角色职业名称 (国家名字)
            "chapter": PlatConst.norCopyId,                              //关卡章节
            "friendList": "无",                                //好友列表
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