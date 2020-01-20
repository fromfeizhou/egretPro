/**红点数据刷新类型 */
var RedEvtType;
(function (RedEvtType) {
    /**武将收集 */
    RedEvtType[RedEvtType["GEN_COLLECT"] = 1001] = "GEN_COLLECT";
    /**武将升星 */
    RedEvtType[RedEvtType["GEN_STAR"] = 1002] = "GEN_STAR";
    /**武将技能升级 */
    RedEvtType[RedEvtType["GEN_SKILL"] = 1003] = "GEN_SKILL";
    /** 武将可装备*/
    RedEvtType[RedEvtType["GEN_EQUIP"] = 1004] = "GEN_EQUIP";
    /** 武将装备升级*/
    RedEvtType[RedEvtType["GEN_EQ_LV"] = 1005] = "GEN_EQ_LV";
    /** 武将装备升阶*/
    RedEvtType[RedEvtType["GEN_EQ_GRADE"] = 1006] = "GEN_EQ_GRADE";
    /** 武将装备精炼*/
    RedEvtType[RedEvtType["GEN_EQ_WROUGHT"] = 1007] = "GEN_EQ_WROUGHT";
    /**武将升级 */
    RedEvtType[RedEvtType["GEN_LEVEL"] = 1008] = "GEN_LEVEL";
    /**武将突破 */
    RedEvtType[RedEvtType["GEN_TUPODAN"] = 1009] = "GEN_TUPODAN";
    /**武将宝物装配 */
    RedEvtType[RedEvtType["GEN_TREA_EQ"] = 1010] = "GEN_TREA_EQ";
    /**武将缘分 */
    RedEvtType[RedEvtType["GEN_FATE"] = 1011] = "GEN_FATE";
    /**活跃度宝箱 */
    RedEvtType[RedEvtType["TASK_ACTIVITY"] = 2001] = "TASK_ACTIVITY";
    /**任务 */
    RedEvtType[RedEvtType["TASK"] = 2002] = "TASK";
    /**背包 */
    RedEvtType[RedEvtType["BAG_NEW"] = 3001] = "BAG_NEW";
    /**国家任务 */
    RedEvtType[RedEvtType["TASK_COUNTRY"] = 4001] = "TASK_COUNTRY";
    /**国家税收 */
    RedEvtType[RedEvtType["TAX_COUNTRY"] = 4002] = "TAX_COUNTRY";
    /**国家官职 俸禄红点*/
    RedEvtType[RedEvtType["JOB_COUNTRY"] = 4003] = "JOB_COUNTRY";
    /**城池更换红点 */
    RedEvtType[RedEvtType["CITY_CHANGE_COUNTRY"] = 4004] = "CITY_CHANGE_COUNTRY";
    /**聊天 */
    RedEvtType[RedEvtType["CHAT"] = 5001] = "CHAT";
    /**宝物装备 */
    RedEvtType[RedEvtType["TREA_EQUIP"] = 6001] = "TREA_EQUIP";
    /**宝物升级 */
    RedEvtType[RedEvtType["TREA_STRENG"] = 6002] = "TREA_STRENG";
    /**宝物升星 */
    RedEvtType[RedEvtType["TREA_STAR"] = 6003] = "TREA_STAR";
    /**宝物镶嵌 */
    RedEvtType[RedEvtType["TREA_INLAY"] = 6004] = "TREA_INLAY";
    /**血战群雄个人boss挑战 */
    RedEvtType[RedEvtType["BOSS_SINGLE"] = 8001] = "BOSS_SINGLE";
    /**血战群雄排名boss挑战 */
    RedEvtType[RedEvtType["BOSS_RANK"] = 8002] = "BOSS_RANK";
    /**血战群雄世界boss挑战 */
    RedEvtType[RedEvtType["BOSS_WORLD"] = 8003] = "BOSS_WORLD";
    /**装备合成 */
    RedEvtType[RedEvtType["EQUIP_COMPOSE"] = 9001] = "EQUIP_COMPOSE";
    /**材料副本 */
    RedEvtType[RedEvtType["MATER_WAR"] = 10001] = "MATER_WAR";
    /**科技升级 */
    RedEvtType[RedEvtType["TECHNO"] = 11001] = "TECHNO";
    /**酒馆招募*/
    RedEvtType[RedEvtType["TANVERN"] = 12001] = "TANVERN";
    /**建造红点 */
    RedEvtType[RedEvtType["QUE_BUILD"] = 13001] = "QUE_BUILD";
    /**竞技场红点 */
    RedEvtType[RedEvtType["PVP_ARENA"] = 13002] = "PVP_ARENA";
    /**过关斩将 */
    RedEvtType[RedEvtType["PASS_WAR"] = 13003] = "PASS_WAR";
    /**章节副本 */
    RedEvtType[RedEvtType["HEAD_QUATER"] = 13004] = "HEAD_QUATER";
    /**历史战役红点 */
    RedEvtType[RedEvtType["HISTORY_WAR"] = 13005] = "HISTORY_WAR";
    /**警报红点 */
    RedEvtType[RedEvtType["WARN"] = 14001] = "WARN";
    /**挂机红点 */
    RedEvtType[RedEvtType["PATROL"] = 15001] = "PATROL";
    /**部队训练红点 */
    RedEvtType[RedEvtType["ARMS_TRAIN"] = 16001] = "ARMS_TRAIN";
    /**部队进阶红点 */
    RedEvtType[RedEvtType["ARMS_GRADE"] = 16002] = "ARMS_GRADE";
    /**聚宝盆免费次数 */
    RedEvtType[RedEvtType["CORN"] = 17001] = "CORN";
    /**聚宝盆领元宝 */
    RedEvtType[RedEvtType["CORN_AWARD"] = 17002] = "CORN_AWARD";
    /**vip红点 */
    RedEvtType[RedEvtType["VIP"] = 18001] = "VIP";
    /**邮件 */
    RedEvtType[RedEvtType["MAIL"] = 19001] = "MAIL";
    /**军功红点 */
    RedEvtType[RedEvtType["EXPLOIT"] = 20001] = "EXPLOIT";
    /**在线红点 */
    RedEvtType[RedEvtType["ONLINE"] = 30001] = "ONLINE";
    /**开服7天活动红点 */
    RedEvtType[RedEvtType["OPEN_SEVEN"] = 31001] = "OPEN_SEVEN";
    /**循环7天活动红点 */
    RedEvtType[RedEvtType["NOR_OPEN_SEVEN"] = 31002] = "NOR_OPEN_SEVEN";
    /**周卡月卡 */
    RedEvtType[RedEvtType["CARD_MONTH"] = 31003] = "CARD_MONTH";
    /**累计充值 */
    RedEvtType[RedEvtType["RECHARD_ADD"] = 31004] = "RECHARD_ADD";
    /**单笔充值 */
    RedEvtType[RedEvtType["RECHARD_SINGLE"] = 31005] = "RECHARD_SINGLE";
    /**消费豪礼 */
    RedEvtType[RedEvtType["CONSUME_GIFT"] = 31006] = "CONSUME_GIFT";
    /**7天登录活动 */
    RedEvtType[RedEvtType["LOGIN_DAY"] = 31007] = "LOGIN_DAY";
    /**成长基金 */
    RedEvtType[RedEvtType["GROWTH_FUN"] = 31008] = "GROWTH_FUN";
    /**月签到 */
    RedEvtType[RedEvtType["SIGN_MONTH_DAY"] = 31009] = "SIGN_MONTH_DAY";
    /**封王战 */
    RedEvtType[RedEvtType["THRONE"] = 31010] = "THRONE";
    /**首充 */
    RedEvtType[RedEvtType["FIRST_RECHARGE"] = 31011] = "FIRST_RECHARGE";
    /**一元购 */
    RedEvtType[RedEvtType["ONE_GIFT_BAG"] = 31012] = "ONE_GIFT_BAG";
    /**限时活动 */
    RedEvtType[RedEvtType["GIFT_BAG"] = 31013] = "GIFT_BAG";
    /**襄阳战 */
    RedEvtType[RedEvtType["XIANGYANG"] = 31014] = "XIANGYANG";
    /**转盘红点 */
    RedEvtType[RedEvtType["TURNTABLE"] = 31015] = "TURNTABLE";
    /**跨服战 */
    RedEvtType[RedEvtType["CROSS_SERVER"] = 31016] = "CROSS_SERVER";
    /**布阵红点 */
    RedEvtType[RedEvtType["TEAM_CAMP"] = 32001] = "TEAM_CAMP";
    /**战争之王红点 */
    RedEvtType[RedEvtType["BATTLE_KING_WORSHIP"] = 33001] = "BATTLE_KING_WORSHIP";
    /**战力排行红点 */
    RedEvtType[RedEvtType["FIGHT_RANK_WORSHIP"] = 33002] = "FIGHT_RANK_WORSHIP";
    /**单笔充值2 */
    RedEvtType[RedEvtType["RECHARD_SINGLE_2"] = 33003] = "RECHARD_SINGLE_2";
    /**累计充值3 */
    RedEvtType[RedEvtType["RECHARD_ADD_3"] = 33004] = "RECHARD_ADD_3";
    /**新武将拜访 */
    RedEvtType[RedEvtType["NEW_GEN_VIS"] = 33005] = "NEW_GEN_VIS";
    /**新武将限购 */
    RedEvtType[RedEvtType["NEW_GEN_LIMIT_BUY"] = 33006] = "NEW_GEN_LIMIT_BUY";
    /**新7天登录 */
    RedEvtType[RedEvtType["LOGIN_DAY_2"] = 33007] = "LOGIN_DAY_2";
    /**新7天聚宝盆 */
    RedEvtType[RedEvtType["TREASEURE_BOWL"] = 33008] = "TREASEURE_BOWL";
    /**城池建设完成 */
    RedEvtType[RedEvtType["WORLD_CITY_BUILD"] = 33009] = "WORLD_CITY_BUILD";
    /**个人挑战奖 */
    RedEvtType[RedEvtType["PLAYER_BATTLE_REWARD"] = 33010] = "PLAYER_BATTLE_REWARD";
    /**荣誉累计奖励 */
    RedEvtType[RedEvtType["CROSS_RANK_RY"] = 33011] = "CROSS_RANK_RY";
    /**新春活动：新7天登录 */
    RedEvtType[RedEvtType["LOGIN_DAY_3"] = 33012] = "LOGIN_DAY_3";
    /**新春活动：单笔充值2 */
    RedEvtType[RedEvtType["RECHARD_SINGLE_3"] = 33013] = "RECHARD_SINGLE_3";
    /**新春活动：累计充值4 */
    RedEvtType[RedEvtType["RECHARD_ADD_4"] = 33014] = "RECHARD_ADD_4";
    /**新春活动：聚宝盆 */
    RedEvtType[RedEvtType["TREASEURE_BOWL_2"] = 33015] = "TREASEURE_BOWL_2";
})(RedEvtType || (RedEvtType = {}));
/**红点系统
 * 说明：武将红点 关联数据多 为减少逻辑判断次数 创建数据结构 记录保存对应的红点状态
 */
var RedPointModel = /** @class */ (function () {
    function RedPointModel() {
    }
    RedPointModel.init = function () {
        this.infoList = {};
        this.infoTypeToList = {};
        this.generalData = new RPGenData();
        this.normalData = new RPNorData();
        this.activityData = new RPAcData();
        // Utils.TimerManager.doTimer(60000, 0, this.doEvtTypeCachesCall, this)
    };
    RedPointModel.clear = function () {
        this.laterCalls = null;
        Utils.TimerManager.remove(this.laterCallAction, this);
        // Utils.TimerManager.remove(this.doEvtTypeCachesCall, this)
        this.infoList = null;
        this.infoTypeToList = null;
        if (this.generalData) {
            this.generalData.clear();
            this.generalData = null;
        }
        if (this.normalData) {
            this.normalData.clear();
            this.normalData = null;
        }
        if (this.activityData) {
            this.activityData.clear();
            this.activityData = null;
        }
    };
    /**延迟执行刷新 */
    // private static doEvtTypeCachesCall() {
    //     if (this.generalData) this.generalData.doEvtTypeCachesCall();
    //     if (this.normalData) this.normalData.doEvtTypeCachesCall();
    //     if (this.activityData) this.activityData.doEvtTypeCachesCall();
    // }
    /**创建红点监听(销毁对象必须移除监听)
     * @param thisObj 监听节点(事件移除 绑定对象)
     * @param container 红点容器
     * @param offset 红点偏移
     * @param type 数据刷新类型
     * @param evtType 红点类型数组
     * @param viewType 红点显示类型（箭头 - 箭头 + 数字 -  圆点等）
     * @param param 附加参数
     */
    RedPointModel.AddInfoListener = function (container, offset, evtType, viewType, param, isAutoRemove) {
        if (viewType === void 0) { viewType = 1; }
        if (param === void 0) { param = {}; }
        if (isAutoRemove === void 0) { isAutoRemove = true; }
        if (isNull(container))
            return;
        var key = container.hashCode;
        if (isNull(this.infoList[key])) {
            var info = new RedPointView(container, offset, evtType, viewType, param);
            this.infoList[key] = info;
            for (var i = 0; i < evtType.length; i++) {
                var type = evtType[i];
                this.addRedInfoInList(type, info);
                this.updateRedPoint(info, type);
            }
            if (isAutoRemove && !container['$redPointClear']) {
                //移除函数 挂钩新内容
                container['$redPointClear'] = true;
                var removeFunc_1 = container.$onRemoveFromStage.bind(container);
                container.$onRemoveFromStage = function () {
                    if (!container)
                        return;
                    RedPointModel.RemoveInfoListenerByCode(container.hashCode);
                    removeFunc_1();
                };
            }
        }
        else {
            var info = this.infoList[key];
            /**过滤新旧事件 */
            if (JSON.stringify(info.evtType) != JSON.stringify(evtType)) {
                for (var i = 0; i < info.evtType.length; i++) {
                    var type = info.evtType[i];
                    if (evtType.indexOf(type) == -1) {
                        this.removeRedInfoInList(key, type);
                    }
                }
                for (var i = 0; i < evtType.length; i++) {
                    var type = evtType[i];
                    if (info.evtType.indexOf(type) == -1) {
                        this.addRedInfoInList(type, info);
                    }
                }
            }
            info.resetData(evtType, param);
            for (var i = 0; i < evtType.length; i++) {
                var type = evtType[i];
                this.updateRedPoint(info, type);
            }
        }
    };
    /**
     * 节点移除会自动调用(默认创建方式自动移除 不需要手动移除)
     * 根据code 移除红点监听 【code码 为AddInfoListener传入的节点的code吗】
     * */
    RedPointModel.RemoveInfoListenerByCode = function (code) {
        if (this.infoList && this.infoList[code]) {
            var info = this.infoList[code];
            for (var i = 0; i < info.evtType.length; i++) {
                this.removeRedInfoInList(code, info.evtType[i]);
            }
            info.destroy();
            delete this.infoList[code];
        }
    };
    /**在列表中移除对象 */
    RedPointModel.removeRedInfoInList = function (code, evtType) {
        var list = this.infoTypeToList[evtType];
        if (!list)
            return;
        for (var k = list.length - 1; k >= 0; k--) {
            if (list[k] && list[k].code == code) {
                list.splice(k, 1);
                break;
            }
        }
    };
    /**在列表中添加对象 */
    RedPointModel.addRedInfoInList = function (evtType, info) {
        if (isNull(this.infoTypeToList[evtType]))
            this.infoTypeToList[evtType] = [];
        this.infoTypeToList[evtType].push(info);
    };
    /**
     * 注意：RPBase等 继承者 调用
     * */
    RedPointModel.onRedPointEvtUpdate = function (evtType) {
        if (!this.laterCalls) {
            this.laterCalls = [];
            this.laterCalls.push(evtType);
            Utils.TimerManager.doTimer(500, 1, this.laterCallAction, this);
            return;
        }
        if (this.laterCalls.indexOf(evtType) >= 0)
            return;
        this.laterCalls.push(evtType);
    };
    /**延迟刷新红点ui */
    RedPointModel.laterCallAction = function () {
        for (var i = 0; i < this.laterCalls.length; i++) {
            var evtType = this.laterCalls[i];
            var list = this.infoTypeToList[evtType];
            if (!list || list.length == 0) {
                continue;
            }
            for (var i_1 = 0; i_1 < list.length; i_1++) {
                var info = list[i_1];
                this.updateRedPoint(info, evtType);
            }
        }
        this.laterCalls = null;
    };
    /**刷新红点 */
    RedPointModel.updateRedPoint = function (info, evtType) {
        if (this.generalData.isInEvt(evtType)) {
            this.generalData.refreshView(info, evtType);
            return;
        }
        this.activityData.refreshView(info, evtType);
        this.normalData.refreshView(info, evtType);
    };
    /**================================================================================================================
    * 武将红点隐藏/开启 begin
    * ================================================================================================================
    */
    /**拥有 */
    RedPointModel.hasGeneralInfo = function (id) {
        return this.generalData.hasGeneralInfo(id);
    };
    /**隐藏提示 */
    RedPointModel.removeGeneralInfo = function (id) {
        this.generalData.removeGeneralInfo(id);
    };
    /**添加提示 */
    RedPointModel.addGeneralInfo = function (id) {
        this.generalData.addGeneralInfo(id);
    };
    /**获得武将红点列表 */
    RedPointModel.getGenStateList = function () {
        return this.generalData.getGenStateList();
    };
    /**获得需要记录的武将红点列表id */
    RedPointModel.getRedGenIds = function () {
        var list = this.getGenStateList();
        var res = [];
        for (var id in list) {
            res.push(Number(id));
        }
        return res;
    };
    RedPointModel.CACHE_NORMAL_TYPE = -1; //与红点类型区分 作为通用延迟调用类型
    return RedPointModel;
}());
