/** 历史战役 */
var HistoryBattleModel = /** @class */ (function () {
    function HistoryBattleModel() {
    }
    HistoryBattleModel.init = function () {
        this.historyWarInfos = {};
        this.parseCfg();
    };
    /**解析服务器数据 */
    HistoryBattleModel.parseInfo = function (data) {
        this.updateChapterInfo(data);
    };
    /**更新章節信息 */
    HistoryBattleModel.updateChapterInfo = function (list) {
        this.historyWarInfos = {};
        var value = ConstUtil.getValue(IConstEnum.COPY_HIS_END);
        list.sort(function (p1, p2) {
            return p1.chapterId - p2.chapterId;
        });
        for (var i = 0; i < list.length; i++) {
            var data = list[i];
            this.historyWarInfos[data.chapterId] = data;
        }
        //初始
        if (list.length == 0) {
            this.curCopyId = ConstUtil.getValue(IConstEnum.COPY_HIS_START);
            this.isHistoryMax = value == this.curCopyId;
            return;
        }
        var lastHistoryWar = list[list.length - 1];
        if (isNull(lastHistoryWar.LevelInfos)) {
            this.curCopyId = this.historyWarCfgs[lastHistoryWar.chapterId][0].id;
        }
        else {
            if (lastHistoryWar.LevelInfos.length == 0) {
                this.curCopyId = ConstUtil.getValue(IConstEnum.COPY_HIS_START);
                this.isHistoryMax = value == this.curCopyId;
                return;
            }
            var curPassId = lastHistoryWar.LevelInfos[lastHistoryWar.LevelInfos.length - 1].id;
            this.curCopyId = C.HistoryWarConfig[curPassId].nextPointId !== 0 ? C.HistoryWarConfig[curPassId].nextPointId : ConstUtil.getValue(IConstEnum.COPY_HIS_END);
        }
        this.curMaxCahpter = C.HistoryWarConfig[this.curCopyId].chapterId;
        //设置是否为最后一关
    };
    //取对应数据领取宝箱
    HistoryBattleModel.updateRaward = function (info) {
        var data = this.getHisoryWarInfo(this.curBoxAwardChapterId);
        if (data) {
            data.receivedBoxs = info.receivedBoxs;
        }
    };
    /**战斗回来更新数据 */
    HistoryBattleModel.updateBattleRes = function (data) {
        if (!data.result)
            return;
        if (data && data.levelInfo) {
            var historyWarCfg = C.HistoryWarConfig[data.levelInfo.id];
            var chapterInfo = this.historyWarInfos[historyWarCfg.chapterId];
            //新打的章节
            if (isNull(chapterInfo)) {
                chapterInfo = { chapterId: historyWarCfg.chapterId, LevelInfos: [], receivedBoxs: [] };
                this.curMaxCahpter = historyWarCfg.chapterId;
            }
            if (chapterInfo.LevelInfos.length > 0) {
                var isHas = false;
                for (var index = 0; index < chapterInfo.LevelInfos.length; index++) {
                    if (data.levelInfo.id == chapterInfo.LevelInfos[index].id) {
                        chapterInfo.LevelInfos[index] = data.levelInfo;
                        isHas = true;
                    }
                }
                if (!isHas)
                    chapterInfo.LevelInfos.push(data.levelInfo);
            }
            else {
                chapterInfo.LevelInfos.push(data.levelInfo);
            }
            this.historyWarInfos[historyWarCfg.chapterId] = chapterInfo;
        }
        if (data && data.chapterInfo) {
            this.historyWarInfos[data.chapterInfo.chapterId] = data.chapterInfo;
        }
        //跳到最大关
        var lastHistoryWar = this.historyWarInfos[this.curMaxCahpter];
        if (isNull(lastHistoryWar)) {
            //没有就构建一个
            lastHistoryWar = { chapterId: this.curMaxCahpter, LevelInfos: [], receivedBoxs: [] };
            this.historyWarInfos[this.curMaxCahpter] = lastHistoryWar;
        }
        if (lastHistoryWar.LevelInfos.length == 0) {
            this.curCopyId = this.historyWarCfgs[lastHistoryWar.chapterId][0].id;
        }
        else {
            var curPassId = lastHistoryWar.LevelInfos[lastHistoryWar.LevelInfos.length - 1].id;
            this.curCopyId = C.HistoryWarConfig[curPassId].nextPointId !== 0 ? C.HistoryWarConfig[curPassId].nextPointId : ConstUtil.getValue(IConstEnum.COPY_HIS_END);
            this.curMaxCahpter = C.HistoryWarConfig[this.curCopyId].chapterId;
        }
    };
    // /**獲得章節信息 */
    HistoryBattleModel.getHisoryWarInfo = function (chapterId) {
        return this.historyWarInfos[chapterId];
    };
    /**获得字节信息 */
    HistoryBattleModel.getLevelInfo = function (chapterId, id) {
        var hisInfo = this.historyWarInfos[chapterId];
        if (isNull(hisInfo))
            return null;
        if (isNull(hisInfo.LevelInfos))
            return null;
        for (var index = 0; index < hisInfo.LevelInfos.length; index++) {
            if (id == hisInfo.LevelInfos[index].id)
                return hisInfo.LevelInfos[index];
        }
        return null;
    };
    /**章节挑战 */
    /**获得章节红点 */
    HistoryBattleModel.getRedState = function () {
        if (!FunctionModel.isFunctionOpen(FunctionType.HISTORY_WAR))
            return 0;
        return NormalModel.getFunCountById(IFunCountEnum.HISTORY_WAR_COUNT).reCount;
    };
    /**重置次数 */
    HistoryBattleModel.resetHistoryFightNum = function () {
        if (isNull(this.historyWarInfos))
            return;
        for (var key in this.historyWarInfos) {
            var historyInfo = this.historyWarInfos[key];
            if (isNull(historyInfo))
                continue;
            var hisLevlInfos = historyInfo.LevelInfos;
            if (isNull(hisLevlInfos) || hisLevlInfos.length == 0)
                continue;
            for (var index = 0, len = hisLevlInfos.length; index < len; index++) {
                var historyWarCfg = C.HistoryWarConfig[hisLevlInfos[index].id];
                hisLevlInfos[index].fightNum = historyWarCfg.maxChallengeCount;
            }
        }
    };
    //是否显示扫荡按钮
    HistoryBattleModel.isCleanHistoryLevel = function (id) {
        var historyWarCfg = C.HistoryWarConfig[id];
        if (isNull(historyWarCfg))
            return false;
        var historyInfo = this.historyWarInfos[historyWarCfg.chapterId];
        if (isNull(historyInfo))
            return false;
        var levelInfos = historyInfo.LevelInfos;
        if (isNull(levelInfos) || levelInfos.length == 0)
            return false;
        for (var _i = 0, levelInfos_1 = levelInfos; _i < levelInfos_1.length; _i++) {
            var levelInfo = levelInfos_1[_i];
            if (levelInfo.id == id && levelInfo.star == 3)
                return true;
        }
        return false;
    };
    /**扫荡之后更新次数 */
    HistoryBattleModel.updateHistoryLevel = function (data) {
        var historyWarCfg = C.HistoryWarConfig[data.levelId];
        if (isNull(historyWarCfg))
            return;
        var historyInfo = this.historyWarInfos[historyWarCfg.chapterId];
        if (isNull(historyInfo))
            return;
        var levelInfos = historyInfo.LevelInfos;
        if (isNull(levelInfos) || levelInfos.length == 0)
            return;
        for (var _i = 0, levelInfos_2 = levelInfos; _i < levelInfos_2.length; _i++) {
            var levelInfo = levelInfos_2[_i];
            if (levelInfo.id == data.levelId) {
                levelInfo.fightNum = data.fightNum;
                break;
            }
        }
    };
    //**获得默认挑战副本id */
    HistoryBattleModel.getDefCopyId = function () {
        return this.curCopyId;
    };
    /**=====================================================================================
     * 配置表获取 begin
     * =====================================================================================
     */
    /**获得章节配置表 */
    HistoryBattleModel.getHistoryWarCfg = function (chapterId, level) {
        if (level === void 0) { level = 1; }
        return C.HistoryWarConfigDic[chapterId][level];
    };
    /**获得章节配置表数组 */
    HistoryBattleModel.getHistoryWarCfgs = function (chapterId) {
        return this.historyWarCfgs[chapterId];
    };
    /**得到限制文本 */
    HistoryBattleModel.getLimitTips = function (id) {
        var hiswarCfg = C.HistoryWarConfig[id];
        if (isNull(hiswarCfg))
            return;
        var nationLimit = StringUtils.stringToNumberArray2(hiswarCfg.nationTypeLimit);
        var typeLimit = StringUtils.stringToNumberArray2(hiswarCfg.generalOccupationLimit);
        var nationTips = "禁止势力：<font color=0xff0000>";
        var typeTips = "禁止兵种：<font color=0xff0000>";
        for (var _i = 0, nationLimit_1 = nationLimit; _i < nationLimit_1.length; _i++) {
            var nation = nationLimit_1[_i];
            nationTips += Utils.getCountryName(nation);
        }
        nationTips += "</font>";
        if (nationLimit.length == 0)
            nationTips = "";
        for (var _a = 0, typeLimit_1 = typeLimit; _a < typeLimit_1.length; _a++) {
            var typeStr = typeLimit_1[_a];
            typeTips += Utils.getSoilderTypeName(typeStr);
        }
        typeTips += "</font>";
        if (typeLimit.length == 0)
            typeTips = "";
        return nationTips + " " + typeTips + "";
    };
    /**解析配置表 */
    HistoryBattleModel.parseCfg = function () {
        this.historyWarCfgs = {};
        for (var key in C.HistoryWarConfigDic) {
            var list = C.HistoryWarConfigDic[key];
            var res = [];
            var chapterId = 0;
            for (var id in list) {
                var data = list[id];
                chapterId = data.chapterId;
                if (unNull(list[id])) {
                    res.push(list[id]);
                }
            }
            res.sort(function (a, b) {
                return a.level - b.level;
            });
            this.historyWarCfgs[chapterId] = res;
        }
    };
    /**获得章节星级奖励配置表 */
    HistoryBattleModel.getHistoryWarStarCfg = function (chapterId) {
        var res = [];
        var list = C.HistoryWarStarRewardConfigDic[chapterId];
        for (var key in list) {
            if (unNull(list[key])) {
                res.push(list[key]);
            }
        }
        res.sort(function (a, b) {
            return a.star - b.star;
        });
        return res;
    };
    HistoryBattleModel.BuyChallengedTimes = function () {
        var nextBuyId = NormalModel.getFunCountById(IFunCountEnum.HISTORY_WAR_COUNT).buyAmountCount;
        var vipCfg = C.VipPrivillegesConfig[VipPrivillType.HISTORY_WAR_BUY];
        var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数量
        if (nextBuyId >= buyMax) {
            Utils.showVipUpConfim();
            return;
        }
        var data = NormalModel.getFunCountById(IFunCountEnum.HISTORY_WAR_COUNT);
        var needGold = NormalModel.getFunCostByData(data);
        if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
            var tip = GCodeFromat(CLEnum.HAN_BOS_BUY_TIME, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - nextBuyId));
            ;
            Utils.showConfirmPop(tip, function () {
                HistoryBattleProxy.C2S_HISTORY_WAR_CLEAN_UP_COUNT();
            }, this);
        }
    };
    /**判斷副本id是否通關 */
    HistoryBattleModel.isPassWar = function (copyId) {
        var cfg = C.HistoryWarConfig[copyId];
        if (cfg) {
            if (this.isHistoryMax) {
                return true;
            }
            else {
                return this.curCopyId > copyId;
            }
        }
        return true;
    };
    HistoryBattleModel.curBoxAwardChapterId = 0;
    HistoryBattleModel.curMaxCahpter = 0;
    return HistoryBattleModel;
}());
