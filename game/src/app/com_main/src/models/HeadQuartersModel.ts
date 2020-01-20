//**章节难度枚举 */
enum IQuarLevel {
    /**普通 */
    NORMAL = 10001,
    /**困难 */
    HARD = 10003,
}

/** 章节模块 */
class HeadQuartersModel {
    // public static initState: boolean;       //view打開狀態
    public static norCopyId: number;   //普通难度挑战关卡进度
    public static hdCopyId: number;    //困难难度挑战关卡进度
    public static norLastTime: number;   //普通时间
    public static hdLastTime: number;    //困难时间
    //本地记录
    public static fightRecordId: number; //挑战记录id

    public static levelRecord: IQuarLevel; //难度记录
    public static chapterInfos: { [key: number]: gameProto.IChapterInfo };   //章节信息

    public static norChapterCfgs: { [key: number]: ChapterConfig[] };   //普通章節配置
    public static hdChapterCfgs: { [key: number]: ChapterConfig[] };    //困難章節配置
    public static LastLevel: IQuarLevel; // 保存上次挑戰的难度等級
    private static isNorMax: boolean;//普通关是否最大关卡
    private static isHdMax: boolean;// 困难关是否最大关卡
    public static init(): void {
        this.levelRecord = IQuarLevel.NORMAL;
        this.chapterInfos = {};
        this.parseCfg();
    }

    /**解析服务器数据 */
    public static parseInfo(data: gameProto.IHQInfo) {
        this.norCopyId = data.norCopyId;
        this.hdCopyId = data.hdCopyId;
        this.norLastTime = data.norLastTime;
        this.hdLastTime = data.hdLastTime;
        this.updateChapterInfo(data.chapterInfos);
    }

    /**更新章節信息 */
    public static updateChapterInfo(list: gameProto.IChapterInfo[]) {
        for (let i = 0; i < list.length; i++) {
            let data = list[i];
            this.chapterInfos[data.chapterId] = data;
            com_main.EventMgr.dispatchEvent(QuarterEvent.QUARTER_INFO_UPDATE, data.chapterId);
            if (data.moduleId == IQuarLevel.NORMAL) {
                let value = ConstUtil.getValue(IConstEnum.COPY_NOR_END);
                this.isNorMax = this.setCurCheckPointId(data, value);
            } else {
                let value = ConstUtil.getValue(IConstEnum.COPY_HD_END);
                this.isHdMax = this.setCurCheckPointId(data, value);
            }
        }

    }
    /**根據難度類型取總進度關卡ID */
    public static getCheckpointId(level: IQuarLevel = IQuarLevel.NORMAL) {
        if (this.fightRecordId > 0) return this.fightRecordId;
        return level == IQuarLevel.NORMAL ? this.norCopyId : this.hdCopyId;
    }
    /**根據難度類型取總進度關卡ID */
    public static getLastTime(level: IQuarLevel = IQuarLevel.NORMAL) {
        return level == IQuarLevel.NORMAL ? this.norLastTime : this.hdLastTime;
    }
    /**獲得章節信息 */
    public static getChapterInfo(chapterId: number) {
        return this.chapterInfos[chapterId];
    }


    /**重置挑战记录id 打开界面 初始化结束后 */
    public static resetFightRecord() {
        this.fightRecordId = 0;
    }

    /**设置副本记录 */
    public static setFightRecord(id: number) {
        this.fightRecordId = id;
    }

    //**获得默认挑战副本id */
    public static getDefCopyId(chapterId: number) {
        if (this.isNorChapter(chapterId)) {
            return this.norCopyId
        } else {
            return this.hdCopyId;
        }
    }

    /**判斷副本id是否通關 */
    public static isPassWar(copyId: number) {
        let cfg = C.ChapterConfig[copyId];
        if (cfg && this.isNorChapter(cfg.chapterId)) {
            if (this.isNorMax) {
                return true;
            } else {
                return this.norCopyId > copyId;
            }

        }
        if (this.isHdMax) {
            return true;
        } else {
            return this.hdCopyId > copyId;
        }

    }

    /**是否是普通章節 */
    private static isNorChapter(chapterId: number) {
        return this.norChapterCfgs[chapterId] != null;
    }


    public static BuyChallengedTimes(level?: number): void {
        let nextBuyId = NormalModel.getFunCountById(level).buyAmountCount;

        let vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_HAEDQUARTER_CLEAN];
        let buyMax = Number(vipCfg['vip' + RoleData.vipLevel]);//最大购买数量
        if (nextBuyId >= buyMax) {
            Utils.showVipUpConfim();
            return;
        }
        if (C.CheckPointCostConfig[nextBuyId + 1]) {
            let itemInfo = Utils.parseCommonItemJson(C.CheckPointCostConfig[nextBuyId + 1].cost);
            let tip = GCodeFromat(CLEnum.HAN_BOS_BUY_TIME, itemInfo[0].count) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - nextBuyId));;
            Utils.showConfirmPop(tip, () => {
                if (PropModel.isItemEnough(PropEnum.GOLD, itemInfo[0].count, 2)) HeadQuartersProxy.send_HQ_BUY_RESET_COUNT(level);
            }, this);
            // view.setVipCanBuyNum('（当前vip可购买次数：' + (buyMax - nextBuyId)+'）');
            // view.setVipCanBuyNum(GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - nextBuyId)))
            // com_main.UpManager.popSmallView(view, null, false, 0.8);
        }
    }
    /**前往充值界面 */
    public static onConFirmCharge() {
        Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
    }
    //取对应数据领取宝箱
    public static updateRaward(info: gameProto.IChapterInfo) {
        let data = this.getChapterInfo(info.chapterId);
        if (data) data.receivedBoxs = info.receivedBoxs;
    }
    //取显示的第一件物品
    public static getFirstItem(chapterId: number) {
        let reward: any[];
        let chapterCfg = C.ChapterConfig[chapterId];
        if (this.isPassWar(chapterId)) {
            reward = Utils.parseCommonItemJsonInDrop(chapterCfg.winReward);
        } else {
            reward = Utils.parseCommonItemJsonInDrop(chapterCfg.firstReward);
        }
        return reward[0];

    }
    //获取星星信息
    public static getStarInfo(chapterId: number, checkPointId: number): gameProto.ICheckPointInfo {
        let data = this.getChapterInfo(chapterId);
        if (!data) return null;
        for (let i = 0; i < data.checkPointInfos.length; i++) {
            let checkPoint: gameProto.ICheckPointInfo = data.checkPointInfos[i];
            if (checkPoint && checkPoint.id == checkPointId) {
                return checkPoint;
            }
        }
        return null;
    }

    /**获得章节红点 */
    public static getRedState() {
        if (!FunctionModel.isFunctionOpen(FunctionType.HEAD_QUARTERS)) return 0;
        if (NormalModel.getFunCountById(IFunCountEnum.COPY_FREE_COUNT).reCount > 0) return NormalModel.getFunCountById(IFunCountEnum.COPY_FREE_COUNT).reCount;
        if (NormalModel.getFunCountById(IFunCountEnum.HQ_HARD_FREE_COUNT).reCount > 0) return NormalModel.getFunCountById(IFunCountEnum.HQ_HARD_FREE_COUNT).reCount;
        return 0;
    }
    // /**当前挑战的关卡id */
    // public static get CurCheckPointId() {
    //     return this.m_nCurCheckPointId;
    // }

    // public static setCurCheckPointId(value: number, level: IQuarLevel = IQuarLevel.NORMAL) {
    //     /**最后一章 */
    //     if (value == 0) {
    //         if (level == IQuarLevel.NORMAL) {
    //             value = ConstUtil.getValue(IConstEnum.COPY_NOR_END);
    //         } else {
    //             value = ConstUtil.getValue(IConstEnum.COPY_HD_END);
    //         }
    //     }
    //     this.m_nCurCheckPointId = value;
    // }
    /**判断最后一关已通关 */
    public static setCurCheckPointId(info: gameProto.IChapterInfo, maxVale: number) {
        let boo = false;
        for (let i = 0; i < info.checkPointInfos.length; i++) {
            let norInfo = info.checkPointInfos[i];
            if (norInfo.id == maxVale) {
                boo = true;
            }
        }
        return boo;
    }

    /**是否可以挑战关卡 */
    public static canChallenges(id: number) {
        let cfg = C.ChapterConfig[id];
        if (!cfg) {
            EffectUtils.showTips('关卡不存在', 1, true);
            return;
        }

        if (MainMapModel.getHallLevel() < cfg.lockLv) {
            EffectUtils.showTips(GCodeFromat(CLEnum.CITY_BD_OPEN_DES1, cfg.lockLv), 1, true);
            return;
        }
        if (TeamModel.isEmptyTeamPVE()) {
            Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.CHECKPOINT, battleId: id });
            return;
        }

        let prevPointId = JSON.parse(cfg.prevPointId);
        if (prevPointId) {
            let norId = prevPointId[0];
            let difId = prevPointId[1];

            if ((!norId || this.norCopyId - 1 >= norId) && (!difId || this.hdCopyId - 1 >= difId)) {
                return true;
            } else if (this.isHdMax) {
                return true;
            }else{
                return;
            }
        }
        return true;
    }

    /**获取下个关卡id */
    public static getNextId(curId: number) {
        let cfg = C.ChapterConfig[curId];
        if (!cfg) {
            EffectUtils.showTips('关卡不存在', 1, true);
            return;
        }

        let str = cfg.nextPointId;
        let nextId = JSON.parse(str)[0];
        return nextId;
    }
    /**是否重复挑战的关卡 */
    public static isRepeatChallenges(curId: number) {
        curId = this.getNextId(curId);
        if (curId < 90000) {
            if (curId < this.norCopyId) return true;
        }

        if (curId > 90000) {
            if (curId < this.hdCopyId) return true;
        }

        return false;
    }

    /**=====================================================================================
     * 配置表获取 begin
     * =====================================================================================
     */
    /**获得章节配置表 */
    public static getChapterCfg(chapterId: number, level: number = 1) {
        return C.ChapterConfigDic[chapterId][level];
    }

    /**解析配置表 */
    private static parseCfg() {
        this.norChapterCfgs = {};
        this.hdChapterCfgs = {};
        for (let key in C.ChapterConfigDic) {
            let list = C.ChapterConfigDic[key];
            let res: ChapterConfig[] = [];
            let chapterId = 0;
            let state = false;
            for (let id in list) {
                let data = list[id];
                chapterId = data.chapterId;
                state = data.difficultyType == IQuarLevel.HARD;
                if (unNull(list[id])) {
                    res.push(list[id]);

                }
            }
            res.sort((a, b) => {
                return a.level - b.level;
            })
            if (state) {
                this.hdChapterCfgs[chapterId] = res;
            } else {
                this.norChapterCfgs[chapterId] = res;
            }
        }
    }

    /**获得章节配置表数组 */
    public static getChapterCfgs(chapterId: number) {
        if (this.norChapterCfgs[chapterId]) return this.norChapterCfgs[chapterId];
        return this.hdChapterCfgs[chapterId]
    }

    /**获得章节星级奖励配置表 */
    public static getChapterStarCfg(chapterId: number) {
        let res: StarRewardConfig[] = [];
        let list = C.StarRewardConfigDic[chapterId];
        for (let key in list) {
            if (unNull(list[key])) {
                res.push(list[key]);
            }
        }
        res.sort((a, b) => {
            return a.star - b.star;
        })
        return res;

    }

    /**=====================================================================================
     * 配置表获取 end
     * =====================================================================================
     */

}