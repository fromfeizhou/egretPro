enum ActivityStatus {
    /** 完成*/
    FINISH = 0,
    /** 进行中*/
    PROCESSING = 1,
    /** 已领取奖励*/
    REWARD = 2,
    /** 已失效*///(用于每日登录)
    FAILURE = 3,
}

enum IAcProEnum {
    /**预告**/
    NOTICE = 0,
    /**进行**/
    PROCESS = 1,
    /**结束**/
    FINISH = 2,
    /**关闭**/
    CLOSE = 3,
}
enum AcNoticeEnum {
    /**纯图片 */
    IMG = 1,
    /**图片加文本 */
    IMG_TEXT = 2
}

/**
 * 处理活动开放开关
 */
class ActivityModel {
    private static infoList: { [id: number]: any };       //活动数据
    private static infoActedList: { [id: number]: any };       //正在进行中的活动（预告 - 图标结束 唯一） 按类型覆盖
    private static waitList: ActivityVo[];   /**等待激活列表 */
    private static bOnTick: boolean;   //开启活动计时
    private static curDay: number;   //当前天数记录
    /**模块初始化 */
    public static init() {
        this.infoList = {};
        this.infoActedList = {};
        this.waitList = [];

    }
    /**清理 */
    public static clear() {
        this.infoList = null;
        this.waitList = null;
        this.infoActedList = null;
        this.bOnTick = false;
        Utils.TimerManager.remove(this.onFunction, this)
    }

    /**解析活动列表数据 */
    public static parseActivitInfos(data: gameProto.S2C_ACTIVITY_LIST) {
        if (!data.activityList || data.activityList.length == 0)
            return;
        if (platform.isHidePayFunc()) return;
        this.fixBarAtkAc(data.activityList);
        let len: number = data.activityList.length;

        for (let i = 0; i < len; i++) {
            this.addActivityInfo(data.activityList[i])
        }

        //活动定时器 活动预告 与结束
        this.openTick();
    }

    /**重置活动 */
    public static resetActivitInfos(data: gameProto.S2C_ACTIVITY_LIST) {
        // if (!data.activityList || data.activityList.length == 0)
        //     return;
        if (platform.isHidePayFunc()) return;
        this.fixBarAtkAc(data.activityList);
        let len: number = data.activityList.length;

        for (let i = 0; i < len; i++) {
            let info = data.activityList[i];
            this.addActivityInfo(data.activityList[i])
        }

        for (let key in this.infoActedList) {
            let vo = this.infoActedList[key] as ActivityVo;
            if (vo && vo.activited) {
                vo.crossDayRequest();
            }
        }
    }

    /**添加活动数据 */
    public static addActivityInfo(info: gameProto.IActivityInfo) {
        let time = TimerUtils.getServerTimeMill();
        let vo = this.infoList[info.id] as ActivityVo;
        if (!vo) {
            //襄阳战不过滤
            if(info.id != 61000){
                let offIcon = info.preViewDate > 0 ? time < info.preViewDate : time < info.openDate;
                if (offIcon) return;
                if (time > info.closeIconDate) return;
            }
            vo = this.create(info.viewType);
            this.infoList[info.id] = vo;
            vo.init(info);
        } else {
            vo.update(info);
        }

        if (!vo.activited) {
            this.addWaitAcVo(vo);
        }
    }



    /**添加等待活动图标(活动结束 图标进入下一个循环) */
    public static addWaitAcVo(vo: ActivityVo) {
        for (let i = 0; i < this.waitList.length; i++) {
            if (this.waitList[i].id == vo.id) return;
        }

        this.waitList.push(vo);
    }

    /**删除活动数据 */
    public static removeActivityInfo(id: number) {
        let vo = this.infoList[id] as ActivityVo;
        if (vo) {
            vo.close();
            if (this.infoActedList[vo.viewType] && this.infoActedList[vo.viewType].id == id) delete this.infoActedList[vo.viewType];
            delete this.infoList[id];
        }
    }

    /**活动时间开始定时器 */
    private static openTick() {
        if (this.bOnTick) return;
        this.bOnTick = true;
        //每分钟检查一遍
        this.curDay = new Date(TimerUtils.getServerTimeMill()).getDay();
        Utils.TimerManager.doTimer(6000, 0, this.onFunction, this);
    }

    /**活动定时器 */
    private static onFunction() {
        for (let i = this.waitList.length - 1; i >= 0; i--) {
            let vo = this.waitList[i];
            vo.checkPreIcon();
            vo.checkIsOpen();
            if (vo.activited) this.waitList.splice(i, 1);
        }
        let time = TimerUtils.getServerTimeMill() - 10000;
        let day = new Date(time).getDay();
        let isChange: boolean = false;
        if (day != this.curDay) {
            isChange = true;
            this.curDay = day;
        }
        for (let key in this.infoActedList) {
            let data = this.infoActedList[key] as ActivityVo;
            // if (isChange) data.changeDay();
            if (!data.isOpenIcon()) {
                this.removeActivityInfo(data.id);
            }
        }
    }


    /**获得活动数据(根据显示类型获取，按钮或界面) */
    public static getActivityVo<T>(type: number): T {
        return <T>this.infoActedList[type];
    }

    /**获得活动数据(根据id获取，协议返回处理) */
    public static getActivityVoById<T>(id: number): T {
        return <T>this.infoList[id];
    }

    /**添加正在进行的活动数据 */
    public static addActivityVo(vo: ActivityVo) {
        this.infoActedList[vo.viewType] = vo;
    }


    /**活动是否开启（type） */
    public static isOpen(type: number): boolean {
        let vo = this.getActivityVo<ActivityVo>(type);
        if (vo) return vo.activited;
    }

    /**获取当前活动列表 */
    public static getCurActivityList(): ActivityVo[] {
        let res: ActivityVo[] = [];
        for (let key in this.infoActedList) {
            if (this.infoActedList[key]) res.push(this.infoActedList[key]);
        }
        return res;
    }


    //=============================================================================================================================================
    //特殊活动接口 begin
    //============================================================================================================================================= 

    /**修正南蛮入侵活动结束时间（数据请求使用） */
    private static fixBarAtkAc(list: gameProto.IActivityInfo[]) {
        let res: gameProto.IActivityInfo[] = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].viewType == AcViewType.BARBARIANATTACK) {
                res.push(list[i]);
            }
        }
        if (res.length <= 1) return;

        res.sort((a, b) => { return a.closeDate - b.closeDate });
        //修正最后一个活动关闭时间
        res[res.length - 1].closeDate = res[0].preViewDate + 24 * 60 * 60 * 1000;
    }

    //=============================================================================================================================================
    //特殊活动接口 begin
    //============================================================================================================================================= 

    //=============================================================================================================================================
    //配置表 begin
    //============================================================================================================================================= 
    //服务器配置返回
    public static parseConfig(data: gameProto.IS2C_ACTIVITY_COMM_CONFIG) {
        let vo = this.infoList[data.activityId] as ActivityVo;
        if (vo) vo.parseAcitvityCfg(data.tableData);
    }
    //解析服务器配置表
    public static parseTable(jsonStr: string) {
        let jdata = JSON.parse(jsonStr);
        let name = jdata.clazzName;
        let datas = jdata.data;
        let tables = {};
        for (let i = 0; i < datas.length; i++) {
            try {
                let clazz = egret.getDefinitionByName(name);
                if (!clazz) return {};
                let ca = new clazz();
                let data = datas[i];
                let attrs = ca.attrs();
                let types = ca.types();
                for (let j = 0; j < data.length; j++) {
                    let key = attrs[j];
                    let type = types[j];
                    ca[key] = this.parseKey(type, data[j])
                }
                tables[ca[ConfigBuilder.KEY]] = ca;
            } catch (e) {
                error("ConfigBuilder:parseTable------>>", name, e);
            }
        }
        return tables;
    }
    /**解析活动公告 */
    public static parseActivtyNotice(data: gameProto.IS2C_ACTIVITY_NOTICE_CONFIGS) {
        if (isNull(data) || data.activityNotiseConfigs.length == 0) return;
        let len: number = data.activityNotiseConfigs.length;
        let noticeArr: gameProto.IActivityNotiseConfig[] = data.activityNotiseConfigs.slice(0);
        for (let index = 0; index < len; index++) {
            ScenePopQueWnd.addNewActNotice(noticeArr[index]);
        }
    }
    /**解析对应类型的key */
    private static parseKey(type: string, data: any) {
        switch (type) {
            case "IItemInfo[]":
                return this.getItemInfo(data);
            case "IItemInfo":
                return this.getItemInfo(data, true);
        }

        return data;
    }
    /**获得物品配置 */
    private static getItemInfo(list: { key: number, value: number }[], isSingle: boolean = false) {
        if (isSingle) {
            return list.length > 0 ? IItemInfoPool.create(list[0].key, list[0].value) : null;
        }
        let res = [];
        for (let i = 0; i < list.length; i++) {
            res.push(IItemInfoPool.create(list[i].key, list[i].value));
        }
        return res;
    }
    //=============================================================================================================================================
    //配置表 end
    //============================================================================================================================================= 
    public static create(type: AcViewType) {
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
    }

    /**重连请求(已开放活动重新请求一次信息) */
    public static reconnected() {
        let list = this.getCurActivityList();
        for (let i = 0; i < list.length; i++) {
            let vo = list[i];
            //7天不请求
            if (vo.viewType == AcViewType.OPEN_SEVEN) continue

            if (vo.activited) {
                vo.requestActivityData();
            }
        }
    }
}
