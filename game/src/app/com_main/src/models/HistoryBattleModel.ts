
/** 历史战役 */
class HistoryBattleModel {
    public static curCopyId: number;   //当前的关卡进度

    public static historyWarInfos: { [key: number]: gameProto.IHisChapterInfo };   //章节信息

    public static historyWarCfgs: { [key: number]: HistoryWarConfig[] };   //普通章節配置

    private static isHistoryMax: boolean;//普通关是否最大关卡

    public static curBoxAwardChapterId: number = 0;
    public static curMaxCahpter: number = 0;
    public static init(): void {
        this.historyWarInfos = {};
        this.parseCfg();
    }

    /**解析服务器数据 */
    public static parseInfo(data: gameProto.IHisChapterInfo[]) {
        this.updateChapterInfo(data);
    }

    /**更新章節信息 */
    public static updateChapterInfo(list: gameProto.IHisChapterInfo[]) {
        this.historyWarInfos = {};
        let value = ConstUtil.getValue(IConstEnum.COPY_HIS_END);
        list.sort((p1: gameProto.IHisChapterInfo, p2: gameProto.IHisChapterInfo) => {
            return p1.chapterId - p2.chapterId;
        })
        for (let i = 0; i < list.length; i++) {
            let data = list[i];
            this.historyWarInfos[data.chapterId] = data;
        }
        //初始
        if (list.length == 0) {
            this.curCopyId = ConstUtil.getValue(IConstEnum.COPY_HIS_START);
            this.isHistoryMax = value == this.curCopyId;
            return;
        }
        let lastHistoryWar: gameProto.IHisChapterInfo = list[list.length - 1];
        if (isNull(lastHistoryWar.LevelInfos)) {
            this.curCopyId = this.historyWarCfgs[lastHistoryWar.chapterId][0].id;
        } else {
            if (lastHistoryWar.LevelInfos.length == 0) {
                this.curCopyId = ConstUtil.getValue(IConstEnum.COPY_HIS_START);
                this.isHistoryMax = value == this.curCopyId;
                return;
            }
            let curPassId: number = lastHistoryWar.LevelInfos[lastHistoryWar.LevelInfos.length - 1].id;
            this.curCopyId = C.HistoryWarConfig[curPassId].nextPointId !== 0 ? C.HistoryWarConfig[curPassId].nextPointId : ConstUtil.getValue(IConstEnum.COPY_HIS_END);
        }
        this.curMaxCahpter = C.HistoryWarConfig[this.curCopyId].chapterId;
        //设置是否为最后一关


    }

    //取对应数据领取宝箱
    public static updateRaward(info: gameProto.IS2C_HISTORY_WAR_GET_BOX) {
        let data = this.getHisoryWarInfo(this.curBoxAwardChapterId);
        if (data) {
            data.receivedBoxs = info.receivedBoxs;

        }
    }
    /**战斗回来更新数据 */
    public static updateBattleRes(data: gameProto.IS2C_HISTROY_WAR_BATTLE_INFO) {
        if (!data.result) return;
        if (data && data.levelInfo) {
            let historyWarCfg: HistoryWarConfig = C.HistoryWarConfig[data.levelInfo.id];
            let chapterInfo: gameProto.IHisChapterInfo = this.historyWarInfos[historyWarCfg.chapterId];
            //新打的章节
            if (isNull(chapterInfo)) {
                chapterInfo = { chapterId: historyWarCfg.chapterId, LevelInfos: [], receivedBoxs: [] };
                this.curMaxCahpter = historyWarCfg.chapterId;
            }
            if (chapterInfo.LevelInfos.length > 0) {
                let isHas: boolean = false;
                for (let index = 0; index < chapterInfo.LevelInfos.length; index++) {
                    if (data.levelInfo.id == chapterInfo.LevelInfos[index].id) {
                        chapterInfo.LevelInfos[index] = data.levelInfo;
                        isHas = true;
                    }
                }
                if (!isHas) chapterInfo.LevelInfos.push(data.levelInfo);
            } else {
                chapterInfo.LevelInfos.push(data.levelInfo);
            }

            this.historyWarInfos[historyWarCfg.chapterId] = chapterInfo;
        }

        if (data && data.chapterInfo) {
            this.historyWarInfos[data.chapterInfo.chapterId] = data.chapterInfo;
        }
        //跳到最大关
        let lastHistoryWar: gameProto.IHisChapterInfo = this.historyWarInfos[this.curMaxCahpter];
        if (isNull(lastHistoryWar)) {
            //没有就构建一个
            lastHistoryWar = { chapterId: this.curMaxCahpter, LevelInfos: [], receivedBoxs: [] }
            this.historyWarInfos[this.curMaxCahpter] = lastHistoryWar;
        }
        if (lastHistoryWar.LevelInfos.length == 0) {
            this.curCopyId = this.historyWarCfgs[lastHistoryWar.chapterId][0].id;
        } else {
            let curPassId: number = lastHistoryWar.LevelInfos[lastHistoryWar.LevelInfos.length - 1].id;
            this.curCopyId = C.HistoryWarConfig[curPassId].nextPointId !== 0 ? C.HistoryWarConfig[curPassId].nextPointId : ConstUtil.getValue(IConstEnum.COPY_HIS_END);
            this.curMaxCahpter = C.HistoryWarConfig[this.curCopyId].chapterId;
        }
    }
    // /**獲得章節信息 */
    public static getHisoryWarInfo(chapterId: number): gameProto.IHisChapterInfo {
        return this.historyWarInfos[chapterId];
    }
    /**获得字节信息 */
    public static getLevelInfo(chapterId: number, id: number): gameProto.HisLevelInfo {
        let hisInfo: gameProto.IHisChapterInfo = this.historyWarInfos[chapterId];
        if (isNull(hisInfo)) return null;
        if (isNull(hisInfo.LevelInfos)) return null;
        for (let index = 0; index < hisInfo.LevelInfos.length; index++) {
            if (id == hisInfo.LevelInfos[index].id) return hisInfo.LevelInfos[index]
        }
        return null;
    }

    /**章节挑战 */
    /**获得章节红点 */
    public static getRedState() {
        if (!FunctionModel.isFunctionOpen(FunctionType.HISTORY_WAR)) return 0;
        return NormalModel.getFunCountById(IFunCountEnum.HISTORY_WAR_COUNT).reCount;
    }
    /**重置次数 */
    public static resetHistoryFightNum() {
        if (isNull(this.historyWarInfos)) return;
        for (let key in this.historyWarInfos) {
            let historyInfo: gameProto.IHisChapterInfo = this.historyWarInfos[key];
            if (isNull(historyInfo)) continue;
            let hisLevlInfos: gameProto.IHisLevelInfo[] = historyInfo.LevelInfos;
            if (isNull(hisLevlInfos) || hisLevlInfos.length == 0) continue;

            for (let index: number = 0, len: number = hisLevlInfos.length; index < len; index++) {
                let historyWarCfg: HistoryWarConfig = C.HistoryWarConfig[hisLevlInfos[index].id];
                hisLevlInfos[index].fightNum = historyWarCfg.maxChallengeCount;
            }
        }
    }
    //是否显示扫荡按钮
    public static isCleanHistoryLevel(id: number): boolean {
        let historyWarCfg: HistoryWarConfig = C.HistoryWarConfig[id];
        if (isNull(historyWarCfg)) return false;
        let historyInfo: gameProto.IHisChapterInfo = this.historyWarInfos[historyWarCfg.chapterId];
        if (isNull(historyInfo)) return false;
        let levelInfos: gameProto.IHisLevelInfo[] = historyInfo.LevelInfos;
        if (isNull(levelInfos) || levelInfos.length == 0) return false;
        for (let levelInfo of levelInfos) {
            if (levelInfo.id == id && levelInfo.star == 3) return true;
        }
        return false;
    }
    /**扫荡之后更新次数 */
    public static updateHistoryLevel(data: gameProto.IS2C_HISTORY_WAR_CLEAN_UP) {
        let historyWarCfg: HistoryWarConfig = C.HistoryWarConfig[data.levelId];
        if (isNull(historyWarCfg)) return;
        let historyInfo: gameProto.IHisChapterInfo = this.historyWarInfos[historyWarCfg.chapterId];
        if (isNull(historyInfo)) return;
        let levelInfos: gameProto.IHisLevelInfo[] = historyInfo.LevelInfos;
        if (isNull(levelInfos) || levelInfos.length == 0) return;
        for (let levelInfo of levelInfos) {
            if (levelInfo.id == data.levelId) {
                levelInfo.fightNum = data.fightNum;
                break
            }
        }
    }

    //**获得默认挑战副本id */
    public static getDefCopyId() {
        return this.curCopyId;
    }


    /**=====================================================================================
     * 配置表获取 begin
     * =====================================================================================
     */
    /**获得章节配置表 */
    public static getHistoryWarCfg(chapterId: number, level: number = 1) {
        return C.HistoryWarConfigDic[chapterId][level];
    }
    /**获得章节配置表数组 */
    public static getHistoryWarCfgs(chapterId: number) {
        return this.historyWarCfgs[chapterId];
    }
    /**得到限制文本 */
    public static getLimitTips(id: number): string {
        let hiswarCfg: HistoryWarConfig = C.HistoryWarConfig[id];
        if (isNull(hiswarCfg)) return;
        let nationLimit = StringUtils.stringToNumberArray2(hiswarCfg.nationTypeLimit);
        let typeLimit = StringUtils.stringToNumberArray2(hiswarCfg.generalOccupationLimit);
        let nationTips: string = "禁止势力：<font color=0xff0000>"
        let typeTips: string = "禁止兵种：<font color=0xff0000>"
        for (let nation of nationLimit) {
            nationTips += Utils.getCountryName(nation);
        }
        nationTips += "</font>"
        if (nationLimit.length == 0) nationTips = "";
        for (let typeStr of typeLimit) {
            typeTips += Utils.getSoilderTypeName(typeStr);
        }
        typeTips += "</font>"
        if (typeLimit.length == 0) typeTips = "";
        return nationTips + " " + typeTips + "";
    }
    /**解析配置表 */
    public static parseCfg() {
        this.historyWarCfgs = {};
        for (let key in C.HistoryWarConfigDic) {
            let list = C.HistoryWarConfigDic[key];
            let res: HistoryWarConfig[] = [];
            let chapterId = 0;
            for (let id in list) {
                let data = list[id];
                chapterId = data.chapterId;
                if (unNull(list[id])) {
                    res.push(list[id]);

                }
            }
            res.sort((a, b) => {
                return a.level - b.level;
            })
            this.historyWarCfgs[chapterId] = res;
        }
    }


    /**获得章节星级奖励配置表 */
    public static getHistoryWarStarCfg(chapterId: number): HistoryWarStarRewardConfig[] {
        let res: HistoryWarStarRewardConfig[] = [];
        let list = C.HistoryWarStarRewardConfigDic[chapterId];
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

    public static BuyChallengedTimes(): void {
        let nextBuyId = NormalModel.getFunCountById(IFunCountEnum.HISTORY_WAR_COUNT).buyAmountCount;

        let vipCfg = C.VipPrivillegesConfig[VipPrivillType.HISTORY_WAR_BUY];
        let buyMax = Number(vipCfg['vip' + RoleData.vipLevel]);//最大购买数量
        if (nextBuyId >= buyMax) {
            Utils.showVipUpConfim();
            return;
        }
        let data = NormalModel.getFunCountById(IFunCountEnum.HISTORY_WAR_COUNT);
        let needGold: number = NormalModel.getFunCostByData(data)
        if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
            let tip = GCodeFromat(CLEnum.HAN_BOS_BUY_TIME, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - nextBuyId));;
            Utils.showConfirmPop(tip, () => {
                HistoryBattleProxy.C2S_HISTORY_WAR_CLEAN_UP_COUNT();
            }, this);

        }
    }
    /**判斷副本id是否通關 */
    public static isPassWar(copyId: number) {
        let cfg = C.HistoryWarConfig[copyId];
        if (cfg) {
            if (this.isHistoryMax) {
                return true;
            } else {
                return this.curCopyId > copyId;
            }

        }
        return true;
    }

    /**=====================================================================================
     * 配置表获取 end
     * =====================================================================================
     */

}