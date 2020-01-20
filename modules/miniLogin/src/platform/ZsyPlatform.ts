//中手游
class ZsyPlatform implements Platform {
    //<script src="https://h5game.cmge.com/js/cmge_h5game_v1.js"></script>
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

    public s_gameUID: string = "";
    public s_channelUID: string = "";

    async getUserInfo() {
        return { nickName: "username" }
    }

    initPlatform() {
        let info = PlatConst.getUrlGet();
        console.log('initPlatform info: ', info); //测试数据
        this.s_gameUID = info["gameUID"]; //游戏标识,初始化时通过url传过给游戏
            this.s_channelUID = info["channelUID"]; //渠道标识,初始化时通过url传过给游戏
             PlatConst.platformUid = info["cmgePlayerId"];
            //必需要在最前面进行加载，不能放在其它其它方法中，不要包装该方法，且不可以在每次页面加载时多次重复初始化
            window['cmgeH5GameSDK'] = new window['CmgeH5GameSDK']({
                //游戏标识,初始化时通过url传过来,这值是必须的（如果渠道不能引用中手游的js文件，则研发这里自己写死，中手游不传参数过来）
                gameUID: info["gameUID"],

                //渠道标识,初始化时通过url传过来,这值是必须的（如果渠道不能引用中手游的js文件，则研发这里自己写死，中手游不传参数过来）
                channelUID: info["channelUID"],

                loginTime: info["loginTime"],   //登录时间戳，初始化时通过url传过来,部分渠道没有传该值，则让该值初始为空
                cmgePlayerId: info["cmgePlayerId"], //玩家标识，通过url获取,中手游传给研发游戏的,部分渠道没有传该值，则让该值初始为空

                //渠道的用户id，游戏内要保存这个值，不参与签名，通过url获取,中手游传给游戏的,部分渠道没有传该值，则让该值初始为空
                channelUserId: info["channelUserId"],

                //渠道的平台(可以认为是渠道自己的渠道)id，游戏内要保存这个值，不参与签名，通过url获取,中手游传给游戏的,部分渠道没有传该值，则让该值初始为空
                platformID: info["platformID"],

                cps: info["cps"], //投放推广的标记，不参与签名，如果值大于0表示有投放，部分渠道没有传该值，则让该值初始为空
                mixChannelUID: info["mixChannelUID"], //混服或专服标识，游戏保要存该值，不参与签名，部分渠道没有传该值，则让该值初始为空

                //扩展字段，通过url获取,中手游传给游戏的,值为json字符串，例如：{'errorCode':0,'errorMessage':'登录成功'},如果不是，则要进行 decodeURIComponent 转换下,部分渠道没有传该值，则让该值初始为空
                extend: decodeURIComponent(info["extend"]),
                sign: info["sign"], //签名,初始化时通过url传过来,部分渠道没有传该值，则让该值初始为空
                share: { //微信内：所有渠道要做分享的初始化，
                    timeline: {
                        title: "分享朋友圈标题",  //分享朋友圈标题，研发根据自己实际进行初始化该值

                        //分享朋友圈jpg或png正方形图片(建议尺寸为50*50，不大于3KB)链接，研发根据自己实际进行初始化该值
                        imgUrl: "分享朋友圈图片链接",
                        success: function () { alert('测试游戏：' + info["gameUID"] + ' 渠道：' + info["channelUID"] + ' 分享朋友圈成功'); },  //分享朋友圈成功回调函数，研发根据自己实际进行初始化该值
                        cancel: function () { alert('测试游戏：' + info["gameUID"] + ' 渠道：' + info["channelUID"] + ' 取消朋友圈分享'); }  //分享朋友圈取消回调函数，研发根据自己实际进行初始化该值
                    },
                    friend: {
                        title: "分享给好友的标题",   //分享给好友的标题，研发根据自己实际进行初始化该值
                        desc: "分享给好友的描述",   //分享给好友的描述，研发根据自己实际进行初始化该值
                        imgUrl: "https://download.cmge.com/web/cmge-117-vertical.png",  //分享给好友的图片链接，研发根据自己实际进行初始化该值
                        success: function () { alert('测试游戏：' + info["gameUID"] + ' 渠道：' + info["channelUID"] + ' 分享朋友成功'); }, //分享好友成功回调函数，研发根据自己实际进行初始化该值
                        cancel: function () { alert('测试游戏：' + info["gameUID"] + ' 渠道：' + info["channelUID"] + ' 取消朋友分享'); }  //分享好友取消回调函数，研发根据自己实际进行初始化该值
                    },
                    shareCustomParam: {
                        cp_param1: "参数值1",  //自定义参数key必须以cp_开始，没有值就默认为1
                        cp_param2: "参数值2",  //自定义参数key必须以cp_开始，没有值就默认为1
                        cp_title: "cp分享标题", //玩吧渠道必需
                        cp_desc: "cp分享描述",  //玩吧渠道必需
                        cp_icon: "",            //玩吧渠道非必需,分享图片,创建快捷方式的图片，没有就是用后台上传的。
                        callback: function (result) { alert('分享成功'); console.info(result); }, //分享好友成功或失败回调函数，研发根据自己实际进行初始化该值 {retCode: 0成功，1失败}
                    }
                },
                subscribe: {
                    success: function () { alert('关注成功'); /*关注 成功回调 成功回调 成功回调 */ },
                    cancel: function () { alert('取消关注');/*关注失败 回调 回调 */ },
                },
                shortcut: { //发送桌面快捷方式
                    name: "游戏名称",//发送桌面快捷方式名称
                    icon: "",        //发送桌面的图标，默认后台图标
                    callback: function (result) {
                        alert('快捷方式发送完成'); console.info(result);
                    },//发送回调方法
                }
            });


        window['cmgeH5GameSDK']['cpUserLogin'] = (objectLogin) => { //该方法是全局方法,不能被嵌入其他任何内容中
            console.log('cpUserLogin: ', objectLogin); //测试数据
            var actionType = { //传输的数据
                gameUID: this.s_gameUID, //游戏标识,初始化时通过url传过给游戏
                channelUID: this.s_channelUID, //渠道标识,初始化时通过url传过给游戏
                cmgePlayerId: objectLogin.cmgePlayerId, //玩家标识
                loginTime: objectLogin.loginTime,  //登录的时间戳
                sign: objectLogin.sign,  //研发需要对这个签名进行验证
                channelUserId: objectLogin.channelUserId,  //联运渠道的用户id，不参与签名，但是需要研发保存起来
                platformID: objectLogin.platformID,  //渠道的平台(可以认为是渠道自己的渠道)id，不参与签名，但是需要研发保存起来
                mixChannelUID: objectLogin.mixChannelUID,  //混服或专服标识，参数一定有，且值不会空，不参与签名，研发必须存储该字段
                cps: objectLogin.cps,
                channel_id: "507",
                type: "login_sign",
            };
            console.log('cpUserLogin json--: ', JSON.stringify(actionType)); //测试数据
            Mini.HttpClient.get((data)=>{
            if (data == '0') {
                // PlatConst.platformUid = 0;
                PlatConst.platformUsername = "";
                PlatConst.token = JSON.stringify({
                    username:"",
                    uid:"",
                    qyChannelId:"507",
                    type:"login",
                    token:PlatConst.platformUid.toString()
                });
                PlatConst.channelId = 507;
            } else {
                console.log("登录失败："+ data.msg);
            }
        },this,"code=14&jstr="+JSON.stringify(actionType),'https://h5.373yx.com/sdk/SdkSendData');
        }

    }

    async login() {
        LoginManager.runGame();
    }

    loginCallback(isp: number, param: string) {
        let obj = JSON.parse(param);
        PlatConst.platformUid = obj.uid;
    }

    async showShareMenu() {

    }

    share(data: any) {

    }

    loginGame(uid?: string, token?: string, channelId?: string, username?: string) {

    }

    public count = 1;
    async pay(orderNo: number, shopId: number, shopName: string, price: number) {
        let signJson;
        let dp_time = (new Date()).getTime();

        let serverID   = PlatConst.zoneId.toString();  //合服后的区服（玩家当前所在区服）ID(长度不超过20个字符)
        let oldServerID = PlatConst.zoneId.toString();  //合服前的区服（旧区服）ID，如果未合过服，则这里的值跟字段serverID的值一样，都为当前区服ID
        let serverName = PlatConst.zoneName;   //合服后的区服（玩家当前所在区服）名称（长度不超过30个字符）	
        let oldServerName = PlatConst.zoneName;  //合服前的区服（旧区服）名称，如果未合过服，则这里的值跟字段serverName的值一样，都为当前区服名称
        let roleName   = PlatConst.nickName;  //改名后（当前）角色名称，长度不超过30个字符
        let oldRoleName = PlatConst.nickName;  //改名前角色名称，如果未改过名，都为当前角色名称（长度不超过30个字符）
        let roleId     = PlatConst.playerId.toString();   //角色id，没有则传符串"1" (长度不超过30个字符)
        let subject    = shopName;  //充值主题,字数不超过50个字符,例如:购买哪个等级或购买什么道具等
        let coinNumber = 0;   //玩家当前游戏币（如金币或元宝或钻石等）数量 
        let cpExtend   = "roleid=" + PlatConst.playerId + "~" + "productId=" + shopId.toString();    //扩展字段,可为空值,长度不超过250个字符，该参数会在支付回调时原样返回
        let money      = price * 100; //充值金额(单位：分)
        let itemID     = shopId; //商品id
        let version    = 3; //支付接口版本号
        let productID  = shopId; //游戏内 的商品 id 
        let productName= shopName; //游戏内的商品名称，如元宝、钻石、金币、VIP月卡 等等
        let	roleLevel  = PlatConst.level;  //角色等级，如果没有则默认为0 
        let roleVipLevel =  PlatConst.vipLevel;  //角色VIP等级，如果没有则默认为0 

        let actionSignType = {
            gameUID      : window['cmgeH5GameSDK'].gameUID, //游戏标识
            channelUID   : window['cmgeH5GameSDK'].channelUID, //渠道标识
            cmgePlayerId : window['cmgeH5GameSDK'].cmgePlayerId, //玩家标识
            serverID     : serverID.toString(),  //合服后的区服（玩家当前所在区服）ID(长度不超过20个字符)
            oldServerID  : oldServerID.toString(),  //合服前的区服（旧区服）ID，如果未合过服，则这里的值跟字段serverID的值一样，都为当前区服ID 
            serverName   : serverName,   //合服后的区服（玩家当前所在区服）名称（长度不超过30个字符）
            oldServerName: oldServerName,  //合服前的区服（旧区服）名称，如果未合过服，则这里的值跟字段serverName的值一样，都为当前区服名称 
            roleId       : roleId.toString(),        //角色id 
            roleName     : roleName,    //改名后（当前）角色名称 
            oldRoleName  : oldRoleName, //改名前角色名称，如果未改过名，则这里的值跟字段roleName的值一样，都为当前角色名称
            subject      : subject,  //充值主题,字数不超过50个字符,例如:购买哪个等级或购买什么道具等
            coinNumber   : coinNumber.toString(),   //玩家当前游戏币（如金币或元宝或钻石等）数量
            money        : money.toString(), //充值金额(单位：分)
            itemID       : itemID.toString(), //商品挡位ID号，（由于部分渠道有充值挡位，每个商品有个id号，该id号在研发对接相应渠道时由中手游运营给到研发），如果对应渠道没有挡位，则该值默认为0
            version      : version.toString(), //支付接口版本号
            productID    : productID.toString(), //游戏内 的商品 id 
            productName  : productName, //游戏内的商品名称，如：100元宝、10钻石、5金币、VIP月卡 等等 
            roleLevel    : roleLevel.toString(),  //角色等级 ，如果没有则默认为0 
            roleVipLevel : roleVipLevel.toString(),   //角色VIP等级，如果没有则默认为0 
            cpExtend     : cpExtend //扩展字段,可为空值,长度不超过250个字符，该参数会在支付回调时原样返回
        }
        Mini.HttpClient.get((data) => {
            signJson = JSON.parse(data);
            window['cmgeH5GameSDK'].Pay({
                money        : money,     //充值金额(单位：分)
				cmgePlayerId : window['cmgeH5GameSDK'].cmgePlayerId,  //中手游给研发的玩家编号
				serverID     : serverID,     //区服(长度不超过20个字符)
				oldServerID  : oldServerID,  //合服前的区服（旧区服）ID
				serverName   : serverName,    //区服名称（不超过30个字符）
				oldServerName: oldServerName,  //合服前的区服（旧区服）名称
				roleName     : roleName,    //改名后（当前）角色名称 
				oldRoleName  : oldRoleName, //改名前角色名称，如果未改过名，则这里的值跟字段roleName的值一样，都为当前角色名称
                orderNo      : orderNo.toString(),   //研发自己生成的订单号，长度不超过50个字符
				subject      : subject,   //充值主题,长度不超过50个字符,例如:购买哪个等级或购买什么道具等
				coinNumber   : coinNumber,   //玩家当前游戏币（如金币或元宝或钻石等）数量 
				itemID       : itemID,    //商品挡位ID号
				cpExtend     : cpExtend,   //扩展字段
				version      : version,      //支付接口版本号
				sign         : signJson.sign,      //研发服务器端生成的签名						
				productID    : productID, //游戏内的商品id
				productName  : productName, //游戏内的商品名称，如元宝、钻石、金币、VIP月卡 等等 
				roleId      :  roleId,        //角色id 
				roleLevel    : roleLevel //roleLevel    //角色等级 
            });
        }, this, "code=15&jstr=" + JSON.stringify(actionSignType), 'https://h5.373yx.com/sdk/SdkSendData');
    }

    reportRegister() {
        this.zsyReportData("1");
    }

    reportLogin() {
        this.zsyReportData("2");
    }

    reportData(dateType: string) {
        if (dateType == 'levelUp') {
            this.zsyReportData("3");
        }
    }

    zsyReportData(dateType: string) {
        let dp_time = (new Date()).getTime();
        var object= {
            gameType : '武侠', //游戏类型（比如：武侠、休闲、竞技、枪战等等）
            serverId : PlatConst.zoneId.toString(), //合服后的区服（玩家当前所在区服）ID，没有就设为'1'
            oldServerID: '1', //合服前的区服（旧区服）ID，没有则默认为'1'，如果未合过服，则这里的值跟字段serverId 的值一样，都为当前区服ID
            serverName : PlatConst.zoneName.toString(), //合服后区服（玩家当前所在区服）名称，没有就设为'1'
            oldServerName:'1', //合服前区服（旧区服）名称，没有就设为'1'，如果未合过服，则这里的值跟字段serverName 的值一样，都为当前区服名称
            roleId : PlatConst.playerId.toString(), //角色id，没有就设为'1'
            roleName : PlatConst.nickName.toString(), //角色名称，没有就设为'1'
            level : PlatConst.level, //角色等级，没有就设为1
            viplevel : PlatConst.vipLevel, //vip 等级，没有就设为1
            power : 1, //玩家综合能力(如：战斗力)，没有就设为1
            coinNumber : 0, //玩家当前游戏币（如金币或元宝或钻石等）数量，没有就设为0
            isNew : 1, // 1 为创建角色，2 为登录完成后进入游戏后第一个界面，3 为角色升级，5 为到达选服界面，6 为点击登陆按钮那一刻，7 为玩家改名
            createTime : PlatConst.createTimestamp, //角色创建时间戳（精确到秒），类型int，没有就设为0
            lastUpgradeTime : dp_time //角色最后升级时间戳（精确到秒），类型int，没有就设为0
        };
        window['cmgeH5GameSDK'].transPlayerInfo(object); //向渠道传玩家的信息
    }

    WXattention() {

    }

    isHidePayFunc() {
        return false;
    }

    isMsgCheckFunc(msg: string ,callback: Function,target: any){
        callback.call(target,true);
    }
}