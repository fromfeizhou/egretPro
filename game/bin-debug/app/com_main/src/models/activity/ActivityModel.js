var ActivityStatus;
(function (ActivityStatus) {
    /** 完成*/
    ActivityStatus[ActivityStatus["FINISH"] = 0] = "FINISH";
    /** 进行中*/
    ActivityStatus[ActivityStatus["PROCESSING"] = 1] = "PROCESSING";
    /** 已领取奖励*/
    ActivityStatus[ActivityStatus["REWARD"] = 2] = "REWARD";
    /** 已失效*/ //(用于每日登录)
    ActivityStatus[ActivityStatus["FAILURE"] = 3] = "FAILURE";
})(ActivityStatus || (ActivityStatus = {}));
var IAcProEnum;
(function (IAcProEnum) {
    /**预告**/
    IAcProEnum[IAcProEnum["NOTICE"] = 0] = "NOTICE";
    /**进行**/
    IAcProEnum[IAcProEnum["PROCESS"] = 1] = "PROCESS";
    /**结束**/
    IAcProEnum[IAcProEnum["FINISH"] = 2] = "FINISH";
    /**关闭**/
    IAcProEnum[IAcProEnum["CLOSE"] = 3] = "CLOSE";
})(IAcProEnum || (IAcProEnum = {}));
var AcNoticeEnum;
(function (AcNoticeEnum) {
    /**纯图片 */
    AcNoticeEnum[AcNoticeEnum["IMG"] = 1] = "IMG";
    /**图片加文本 */
    AcNoticeEnum[AcNoticeEnum["IMG_TEXT"] = 2] = "IMG_TEXT";
})(AcNoticeEnum || (AcNoticeEnum = {}));
/**
 * 处理活动开放开关
 */
var ActivityModel = /** @class */ (function () {
    function ActivityModel() {
    }
    /**模块初始化 */
    ActivityModel.init = function () {
        this.infoList = {};
        this.infoActedList = {};
        this.waitList = [];
    };
    /**清理 */
    ActivityModel.clear = function () {
        this.infoList = null;
        this.waitList = null;
        this.infoActedList = null;
        this.bOnTick = false;
        Utils.TimerManager.remove(this.onFunction, this);
    };
    /**解析活动列表数据 */
    ActivityModel.parseActivitInfos = function (data) {
        if (!data.activityList || data.activityList.length == 0)
            return;
        if (platform.isHidePayFunc())
            return;
        this.fixBarAtkAc(data.activityList);
        var len = data.activityList.length;
        for (var i = 0; i < len; i++) {
            this.addActivityInfo(data.activityList[i]);
        }
        //活动定时器 活动预告 与结束
        this.openTick();
    };
    /**重置活动 */
    ActivityModel.resetActivitInfos = function (data) {
        // if (!data.activityList || data.activityList.length == 0)
        //     return;
        if (platform.isHidePayFunc())
            return;
        this.fixBarAtkAc(data.activityList);
        var len = data.activityList.length;
        for (var i = 0; i < len; i++) {
            var info = data.activityList[i];
            this.addActivityInfo(data.activityList[i]);
        }
        for (var key in this.infoActedList) {
            var vo = this.infoActedList[key];
            if (vo && vo.activited) {
                vo.crossDayRequest();
            }
        }
    };
    /**添加活动数据 */
    ActivityModel.addActivityInfo = function (info) {
        var time = TimerUtils.getServerTimeMill();
        var vo = this.infoList[info.id];
        if (!vo) {
            //襄阳战不过滤
            if (info.id != 61000) {
                if (time < info.preViewDate || time < info.openDate)
                    return;
                if (time > info.closeIconDate)
                    return;
            }
            vo = this.create(info.viewType);
            this.infoList[info.id] = vo;
            vo.init(info);
        }
        else {
            vo.update(info);
        }
        if (!vo.activited) {
            this.addWaitAcVo(vo);
        }
    };
    /**添加等待活动图标(活动结束 图标进入下一个循环) */
    ActivityModel.addWaitAcVo = function (vo) {
        for (var i = 0; i < this.waitList.length; i++) {
            if (this.waitList[i].id == vo.id)
                return;
        }
        this.waitList.push(vo);
    };
    /**删除活动数据 */
    ActivityModel.removeActivityInfo = function (id) {
        var vo = this.infoList[id];
        if (vo) {
            vo.close();
            if (this.infoActedList[vo.viewType] && this.infoActedList[vo.viewType].id == id)
                delete this.infoActedList[vo.viewType];
            delete this.infoList[id];
        }
    };
    /**活动时间开始定时器 */
    ActivityModel.openTick = function () {
        if (this.bOnTick)
            return;
        this.bOnTick = true;
        //每分钟检查一遍
        this.curDay = new Date(TimerUtils.getServerTimeMill()).getDay();
        Utils.TimerManager.doTimer(6000, 0, this.onFunction, this);
    };
    /**活动定时器 */
    ActivityModel.onFunction = function () {
        for (var i = this.waitList.length - 1; i >= 0; i--) {
            var vo = this.waitList[i];
            vo.checkPreIcon();
            vo.checkIsOpen();
            if (vo.activited)
                this.waitList.splice(i, 1);
        }
        var time = TimerUtils.getServerTimeMill() - 10000;
        var day = new Date(time).getDay();
        var isChange = false;
        if (day != this.curDay) {
            isChange = true;
            this.curDay = day;
        }
        for (var key in this.infoActedList) {
            var data = this.infoActedList[key];
            // if (isChange) data.changeDay();
            if (!data.isOpenIcon()) {
                this.removeActivityInfo(data.id);
            }
        }
    };
    /**获得活动数据(根据显示类型获取，按钮或界面) */
    ActivityModel.getActivityVo = function (type) {
        return this.infoActedList[type];
    };
    /**获得活动数据(根据id获取，协议返回处理) */
    ActivityModel.getActivityVoById = function (id) {
        return this.infoList[id];
    };
    /**添加正在进行的活动数据 */
    ActivityModel.addActivityVo = function (vo) {
        this.infoActedList[vo.viewType] = vo;
    };
    /**活动是否开启（type） */
    ActivityModel.isOpen = function (type) {
        var vo = this.getActivityVo(type);
        if (vo)
            return vo.activited;
    };
    /**获取当前活动列表 */
    ActivityModel.getCurActivityList = function () {
        var res = [];
        for (var key in this.infoActedList) {
            if (this.infoActedList[key])
                res.push(this.infoActedList[key]);
        }
        return res;
    };
    //=============================================================================================================================================
    //特殊活动接口 begin
    //============================================================================================================================================= 
    /**修正南蛮入侵活动结束时间（数据请求使用） */
    ActivityModel.fixBarAtkAc = function (list) {
        var res = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].viewType == AcViewType.BARBARIANATTACK) {
                res.push(list[i]);
            }
        }
        if (res.length <= 1)
            return;
        res.sort(function (a, b) { return a.closeDate - b.closeDate; });
        //修正最后一个活动关闭时间
        res[res.length - 1].closeDate = res[0].preViewDate + 24 * 60 * 60 * 1000;
    };
    //=============================================================================================================================================
    //特殊活动接口 begin
    //============================================================================================================================================= 
    //=============================================================================================================================================
    //配置表 begin
    //============================================================================================================================================= 
    //服务器配置返回
    ActivityModel.parseConfig = function (data) {
        var vo = this.infoList[data.activityId];
        if (vo)
            vo.parseAcitvityCfg(data.tableData);
    };
    //解析服务器配置表
    ActivityModel.parseTable = function (jsonStr) {
        var jdata = JSON.parse(jsonStr);
        var name = jdata.clazzName;
        var datas = jdata.data;
        var tables = {};
        for (var i = 0; i < datas.length; i++) {
            try {
                var clazz = egret.getDefinitionByName(name);
                if (!clazz)
                    return {};
                var ca = new clazz();
                var data = datas[i];
                var attrs = ca.attrs();
                var types = ca.types();
                for (var j = 0; j < data.length; j++) {
                    var key = attrs[j];
                    var type = types[j];
                    ca[key] = this.parseKey(type, data[j]);
                }
                tables[ca[ConfigBuilder.KEY]] = ca;
            }
            catch (e) {
                error("ConfigBuilder:parseTable------>>", name, e);
            }
        }
        return tables;
    };
    /**解析活动公告 */
    ActivityModel.parseActivtyNotice = function (data) {
        if (isNull(data) || data.activityNotiseConfigs.length == 0)
            return;
        var len = data.activityNotiseConfigs.length;
        var noticeArr = data.activityNotiseConfigs.slice(0);
        for (var index = 0; index < len; index++) {
            ScenePopQueWnd.addNewActNotice(noticeArr[index]);
        }
    };
    /**解析对应类型的key */
    ActivityModel.parseKey = function (type, data) {
        switch (type) {
            case "IItemInfo[]":
                return this.getItemInfo(data);
            case "IItemInfo":
                return this.getItemInfo(data, true);
        }
        return data;
    };
    /**获得物品配置 */
    ActivityModel.getItemInfo = function (list, isSingle) {
        if (isSingle === void 0) { isSingle = false; }
        if (isSingle) {
            return list.length > 0 ? IItemInfoPool.create(list[0].key, list[0].value) : null;
        }
        var res = [];
        for (var i = 0; i < list.length; i++) {
            res.push(IItemInfoPool.create(list[i].key, list[i].value));
        }
        return res;
    };
    //=============================================================================================================================================
    //配置表 end
    //============================================================================================================================================= 
    ActivityModel.create = function (type) {
        switch (type) {
            case AcViewType.OPEN_SEVEN:
            case AcViewType.NOR_SEVEN:
                return new AcTaskVo();
            case AcViewType.FIRST_RECHARGE:
                return new AcPayFirstVo();
            case AcViewType.RECHARGE_SINGLE:
            case AcViewType.RECHARGE_SINGLE_2:
            case AcViewType.RECHARGE_SINGLE_3:
                return new AcPaySetOneVo();
            case AcViewType.CONSUME_GIFT:
                return new AcConsumeVo();
            case AcViewType.RECHARGE_ADD_UP:
            // case AcViewType.RECHARGE_ADD_UP_2:
            case AcViewType.RECHARGE_ADD_UP_3:
            case AcViewType.RECHARGE_ADD_UP_4:
            case AcViewType.RECHARGE_ADD_UP_5:
            case AcViewType.RECHARGE_ADD_UP_6:
                return new AcPaySumVo();
            case AcViewType.SIGN_CONTIN_DAY:
            case AcViewType.SIGN_CONTIN_DAY_2:
            case AcViewType.SIGN_CONTIN_DAY_3:
                return new AcLoginDayVo();
            case AcViewType.FUND_GROWTH:
                return new GrowthFundVo();
            case AcViewType.CARD_MONTH_WEEK:
                return new PayCardVo();
            case AcViewType.PURCHAGE_BAG:
                return new AcPuGigtBagVo();
            case AcViewType.SIGN_MONTH_DAY:
                return new AcSignUpVo();
            case AcViewType.FIGHT_RANKING_AWARD:
                return new FightRankVo();
            case AcViewType.LEVEL_RANKING_AWARD:
                return new LevelRankVo();
            case AcViewType.COUNTRY_CITYS_RANKING:
                return new CountryRankVo();
            case AcViewType.GUILD_FORCE_RANKING:
                return new LegionRankVo();
            case AcViewType.APK_RANKING:
                return new ArenaRankVo();
            case AcViewType.BARBARIANATTACK:
                return new AcBarAttackVo();
            case AcViewType.ONE_GIFT_BAG:
                return new AcOneGiftBagVo();
            case AcViewType.XIANGYANG:
                return new AcEmperorBattleVO();
            case AcViewType.PRIZE:
                return new AcTurnTableVo();
            case AcViewType.NEW_GEN_VIS:
                return new AcNewGenVisVo();
            // case AcViewType.AC_SHOP:
            //     return new AcSevenIIShopVo();
            case AcViewType.TREASEURE_BOWL:
            case AcViewType.TREASEURE_BOWL_2:
                return new AcCornucopiaVo();
        }
        return new ActivityVo();
    };
    /**重连请求(已开放活动重新请求一次信息) */
    ActivityModel.reconnected = function () {
        var list = this.getCurActivityList();
        for (var i = 0; i < list.length; i++) {
            var vo = list[i];
            //7天不请求
            if (vo.viewType == AcViewType.OPEN_SEVEN)
                continue;
            if (vo.activited) {
                vo.requestActivityData();
            }
        }
    };
    return ActivityModel;
}());
