// class PlatformApi {

//     /**平台接口 */
//     // public static platform_url = 'http://tqzh-test-platform.allrace.com';
//     //客户端登录平台
//     public static platform_login = '/api/user/login';
//     //客户端获取服务器列表
//     public static platform_lists = '/api/server/lists';
//     //登录成功客户端推送角色基本信息到平台
//     public static platform_info = '/api/user/role_info';
//     //客户端错误日志上传
//     public static platform_log = '/api/api/client_error_log';
//     //客户端向平台创建订单
//     public static platform_charge = '/api/pay/charge';


//     /**
//      * 客户端登录平台
//      * 参数：
//      * callback     请求回调函数
//      * target       回调对象
//      * 
//      * 
//      * platform     渠道标识
//      * device_type  设备类型 1 android、2 ios、0其他
//      * version      客户端版本号
//      * imei         安卓唯一id
//      * idfa         ios广告标识
//      * idfv         ios Vindor标示符
//      * 
//      * ..           其他sdk参数一起带入进来
//      */
//     public static login(callback: Function, target: any, platform: string, device_type: number, version: string,open_id:string, imei: string = '', idfa: string = '', idfv: string = '') {
//         let url = this.platform_login
//             + "?platform=" + platform
//             + "&device_type=" + device_type
//             + "&version=" + version
//             + "&open_id=" + open_id
//             + "&imei=" + imei
//             + "&idfa=" + idfa
//             + "&idfv=" + idfv;
//         AGame.HttpClient.get(callback, target, url);
//     }


//     /**
//      * 客户端获取服务器列表
//      * 参数：
//      * callback     请求回调函数
//      * target       回调对象
//      * 
//      * 
//      * open_id      登陆账号
//      * area         地区
//      * platform     渠道
//      * version      客户端版本号
//      * device_type  设备类型 1 android、2 ios、0其他
//      */
//     public static lists(callback: Function, target: any, open_id: string, platform: string, version: string, device_type: number = 0, area: string = '') {
//         let url = this.platform_lists
//             + "?open_id=" + open_id
//             + "&area=" + area
//             + "&platform=" + platform
//             + "&version=" + version
//             + "&device_type=" + device_type;
//         AGame.HttpClient.get(callback, target, url);
//     }


//     /**
//      * 登录成功客户端推送角色基本信息到平台
//      * 参数：
//      * callback     请求回调函数
//      * target       回调对象
//      * 
//      * 
//      * rid          角色id
//      * open_id      渠道账号
//      * nickname     角色昵称
//      * server_id    游戏服id
//      * platform     渠道
//      * create_time  注册时间
//      * device_type  设备类型 1 android、2 ios、0其他
//      * token        登陆临时票据
//      */
//     public static role_info(create_time:number) {
//         let url = this.platform_info
//             + "?rid=" + RoleData.playerId
//             + "&open_id=" + RoleData.open_id
//             + "&nickname=" + RoleData.nickName
//             + "&server_id=" + RoleData.server_id
//             + "&platform=" + GameConfig.platform
//             + "&create_time=" + create_time
//             + "&device_type=" + 0
//             + "&token=" + RoleData.token
//             + "&country_id=" + RoleData.countryId
//             + "&level=" + RoleData.level
//             + "&head_id=" + RoleData.headId;
//         AGame.HttpClient.get(null, null, url);
//     }

//     /**
//      * 客户端错误日志上传
//      * 参数：
//      * callback     请求回调函数
//      * target       回调对象
//      * 
//      * 
//      * server_id    服务器id
//      * platform     渠道标识
//      * msg          错误信息
//      * open_id      渠道账号
//      * rid          角色id
//      */
//     public static error_log(callback: Function, target: any, server_id: number, platform: string, msg: string, open_id: string, rid: string) {
//         let url = this.platform_log
//             + "?server_id=" + server_id
//             + "&platform=" + platform
//             + "&msg=" + msg
//             + "&open_id=" + open_id
//             + "&rid=" + rid;
//         AGame.HttpClient.get(callback, target, url);
//     }

//     /**
//      * 客户端向平台创建订单
//      * 参数：
//      * callback     请求回调函数
//      * target       回调对象
//      * 
//      * 
//      * platform     渠道标识
//      * open_id      渠道账号
//      * money        充值金额(人民币 元)
//      * server_id    服务器id
//      * rid          角色id
//      * goods_id     购买道具id
//      * goods_name   购买道具名称
//      * device_type  设备类型 1 android、2 ios、0其他
//      * sign         签名
//      * 
//      * ext_data     扩展参数
//      */
//     public static charge(callback: Function, target: any, platform: number, open_id: string, money: string, server_id: string, rid: string, goods_id: string, goods_name: string, device_type: string, sign: string, ext_data: string = '') {
//         let url = this.platform_charge
//             + "?platform=" + platform
//             + "&open_id=" + open_id
//             + "&money=" + money
//             + "&server_id=" + server_id
//             + "&rid=" + rid
//             + "&goods_id=" + goods_id
//             + "&goods_name=" + goods_name
//             + "&device_type=" + device_type
//             + "&sign=" + sign
//             + "&ext_data=" + ext_data;
//         AGame.HttpClient.get(callback, target, url);
//     }

    
// }