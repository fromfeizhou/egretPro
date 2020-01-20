/**
 * bossmodel
 * @class BossModel/**
 *
 *
 *
**/
var _a;
var BossType;
(function (BossType) {
    BossType[BossType["NOTES"] = 1] = "NOTES";
    BossType[BossType["ACTTACT"] = 2] = "ACTTACT";
    BossType[BossType["SECURITY"] = 3] = "SECURITY";
})(BossType || (BossType = {}));
var BtnQuickState;
(function (BtnQuickState) {
    BtnQuickState[BtnQuickState["USEPROPS"] = 0] = "USEPROPS";
    BtnQuickState[BtnQuickState["BUYCOUNT"] = 1] = "BUYCOUNT";
})(BtnQuickState || (BtnQuickState = {}));
var BtnState;
(function (BtnState) {
    BtnState[BtnState["CHALLANGE"] = 1] = "CHALLANGE";
    BtnState[BtnState["SWEEPING"] = 2] = "SWEEPING";
})(BtnState || (BtnState = {}));
var BossEnum;
(function (BossEnum) {
    BossEnum[BossEnum["ALL"] = 0] = "ALL";
    /**单人 */
    BossEnum[BossEnum["Single"] = 1] = "Single";
    /**排名 */
    BossEnum[BossEnum["Rank"] = 2] = "Rank";
    /**世界 */
    BossEnum[BossEnum["World"] = 3] = "World";
})(BossEnum || (BossEnum = {}));
var BossModel = /** @class */ (function () {
    function BossModel() {
    }
    BossModel.parseBossData = function (info) {
        this.personalBossInfoDic = {};
        for (var i = 0; i < info.personalBossInfo.length; i++) {
            var data = info.personalBossInfo[i];
            this.personalBossInfoDic[data.bossId] = data;
        }
        this.rankBossInfoDic = {};
        for (var i = 0; i < info.rankBossInfo.length; i++) {
            var data = info.rankBossInfo[i];
            this.rankBossInfoDic[data.bossId] = data;
        }
        this.worldBossInfoDic = {};
        for (var i = 0; i < info.worldBossInfo.length; i++) {
            var data = info.worldBossInfo[i];
            this.worldBossInfoDic[data.bossId] = data;
        }
        this.rankBossPlayerStartReviveTime = info.rankBossPlayerStartReviveTime;
        this.rankBossPlayerEndReviveTime = info.rankBossPlayerEndReviveTime;
        this.boxIds = info.boxIds;
        this.worldSumHurt = info.worldSumHurt;
        // this.rankingBossFreeBuyCount = info.rankingBossFreeBuyCount;
        com_main.EventMgr.dispatchEvent(BossEvent.BOSS_INFO_UPDATE, BossEnum.ALL);
    };
    /**修改死亡boss数据 */
    BossModel.setDieBossData = function (bossid) {
        this.rankBossInfoDic = {};
    };
    /**扫荡返回数据 */
    // public static setSweepData(info: gameProto.IS2C_CLEAR_BOSS) {
    //     if (info) {
    //         let data = this.getSingleItemInfo(info.personalBossInfo.bossId);
    //         if (data) {
    //             data.freeCount = info.personalBossInfo.freeCount;
    //             data.buyCount = info.personalBossInfo.buyCount;
    //         }
    //         com_main.EventMgr.dispatchEvent(BossEvent.BOSS_INFO_UPDATE, BossEnum.Single);
    //     }
    // }
    /**购买挑战次数 */
    // public static setBuyCountData(info: gameProto.S2C_BUY_BOSS_CHALLENGE_COUNT) {
    //     if (info) {
    //         if (info.type == BossEnum.Rank) {
    //             this.rankingBossBuyCount = info.buyCount;
    //             this.rankBossChallengeCount = info.challengeCount;
    //             com_main.EventMgr.dispatchEvent(BossEvent.BOSS_INFO_UPDATE, BossEnum.Rank);
    //         } else if (info.type == BossEnum.World) {
    //             this.worldBossBuyCount = info.buyCount;
    //             this.worldBossChallengeCount = info.challengeCount;
    //             com_main.EventMgr.dispatchEvent(BossEvent.BOSS_INFO_UPDATE, BossEnum.World);
    //         } else {
    //             com_main.EventMgr.dispatchEvent(BossEvent.BOSS_INFO_UPDATE, BossEnum.Single);
    //         }
    //     }
    // }
    /**购买挑战次数倒计时处理 */
    BossModel.setReviveTime = function (info) {
        if (info && info.type == BossEnum.Rank) {
            this.rankBossPlayerStartReviveTime = info.rankBossPlayerStartReviveTime;
            this.rankBossPlayerEndReviveTime = info.rankBossPlayerEndReviveTime;
        }
    };
    /**设置领取的宝箱Id */
    BossModel.getBossHurtCfg = function (info) {
        if (info) {
            this.boxIds = info.boxIds;
        }
    };
    /**设置宝箱数据 */
    BossModel.getHurtOneCfg = function () {
        var hurtCfg = C.BossHurtConfig;
        for (var key in C.BossHurtConfig) {
            var cfg = C.BossHurtConfig[key];
            if (this.boxIds.indexOf(cfg.id) >= 0)
                continue;
            return cfg;
        }
    };
    /**单人副本*/
    BossModel.getSingleItemInfo = function (bossId) {
        return this.personalBossInfoDic[bossId];
    };
    /**排名副本*/
    BossModel.getRandItemInfo = function (bossId) {
        return this.rankBossInfoDic[bossId];
    };
    /**世界boss*/
    BossModel.getWorldItemInfo = function (bossId) {
        return this.worldBossInfoDic[bossId];
    };
    /**
     * boss挑战
     * 根据tag标签页取对应类型boss配置信息列表
     */
    BossModel.getBossCfgByType = function (type) {
        var res = [];
        var bossCfg = C.PersonalBossConfig;
        for (var i in bossCfg) {
            if (unNull(bossCfg[i]) && Number(bossCfg[i].bossType) == type) {
                res.push(bossCfg[i]);
            }
        }
        return res;
    };
    // /**返回单人挑战次数 */
    // public static GetSingeState() {
    //     let boo: boolean;
    //     let singleArr = this.getBossCfgByType(BossEnum.Single);
    //     for (let i = 0; i < singleArr.length; i++) {
    //         let res = this.GetSingeBtnState(singleArr[i].id)
    //         if (res) {
    //             boo = res;
    //         }
    //     }
    //     return boo;
    // }
    /**返回个人红点 */
    BossModel.GetSingeBtnState = function (bossId) {
        if (!FunctionModel.isFunctionOpen(FunctionType.BOSS))
            return false;
        // 没有指定bossId
        if (!bossId) {
            var useCount = NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS).reCount;
            return useCount;
        }
        var cfg = C.PersonalBossConfig[bossId];
        var count = NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS).reCount;
        if (cfg.openLevel <= RoleData.level && count > 0) {
            return true;
        }
        return false;
    };
    /**返回排名按钮红点 */
    BossModel.GetRankBtnState = function (bossId) {
        if (!FunctionModel.isFunctionOpen(FunctionType.BOSS))
            return false;
        var count = NormalModel.getFunCountById(IFunCountEnum.RANK_BOSS).reCount;
        if (count == 0)
            return false;
        //没有指定bossId
        if (!bossId) {
            return BossModel.GetRankNum();
        }
        var cfg = C.PersonalBossConfig[bossId];
        if (cfg.openLevel > RoleData.level) {
            return false;
        }
        var bossRank = BossModel.getRandItemInfo(bossId);
        if (bossRank) {
            return bossRank.bossHp > 0;
        }
        return false;
    };
    /**返回世界按钮红点 */
    BossModel.GetWorldBtnState = function (bossId) {
        if (!FunctionModel.isFunctionOpen(FunctionType.BOSS))
            return false;
        var count = NormalModel.getFunCountById(IFunCountEnum.WORLD_BOSS).reCount;
        if (count == 0)
            return false;
        //没有指定bossId
        if (!bossId) {
            return BossModel.GetBossNum();
        }
        var cfg = C.PersonalBossConfig[bossId];
        if (cfg.openLevel > RoleData.level) {
            return false;
        }
        var bossWorld = BossModel.getWorldItemInfo(bossId);
        if (bossWorld) {
            return (bossWorld.bossHp > 0);
        }
        return false;
    };
    /**返回排名挑战次数 */
    BossModel.GetRankNum = function () {
        var boo;
        var singleArr = this.getBossCfgByType(BossEnum.Rank);
        for (var i = 0; i < singleArr.length; i++) {
            var res = this.GetRankBtnState(singleArr[i].id);
            if (res) {
                boo = res;
            }
        }
        return boo;
        // return this.rankBossChallengeCount;
    };
    /**返回世界boss挑战次数 */
    BossModel.GetBossNum = function () {
        var curTime = TimerUtils.getServerTime();
        var curWeek = TimerUtils.getTimeWeek();
        var openTime = "";
        for (var key in C.PersonalBossConfig) {
            openTime = C.PersonalBossConfig[key].time;
            openTime = openTime.replace('[', '');
            openTime = openTime.replace(']', '');
            var times = openTime.split(',');
            var startTime = TimerUtils.getTimeByFormatA(times[0]);
            var endTime = TimerUtils.getTimeByFormatA(times[1]);
            var isOpen = (curTime >= startTime && curTime <= endTime);
            var weekOpeen = (curWeek == C.PersonalBossConfig[key].week);
            var openLv = RoleData.level >= C.PersonalBossConfig[key].openLevel ? true : false;
            if (isOpen && weekOpeen && openLv) {
                var bossWorld = BossModel.getWorldItemInfo(Number(key));
                if (bossWorld) {
                    return bossWorld.bossHp > 0;
                }
            }
        }
        return false;
    };
    /**排行boss 个人排名 */
    BossModel.getPlayerLvInRankBoss = function (bossId) {
        var rankInfo = this.rankBossInfoDic[bossId];
        if (rankInfo) {
            for (var i = 0; i < rankInfo.bossRankingListInfo.length; i++) {
                var rankData = rankInfo.bossRankingListInfo[i];
                if (rankData.playerId == RoleData.playerId) {
                    return rankData.ranking;
                }
            }
        }
        return -1;
    };
    /**世界boss 个人排名 */
    BossModel.getPlayerLvInWorldBoss = function (bossId) {
        var worldInfo = this.worldBossInfoDic[bossId];
        if (worldInfo) {
            for (var i = 0; i < worldInfo.bossRankingListInfo.length; i++) {
                var rankData = worldInfo.bossRankingListInfo[i];
                if (rankData.playerId == RoleData.playerId) {
                    return rankData.ranking;
                }
            }
        }
        return -1;
    };
    /**通过boss编号获取排名，世界boss奖励配置数据 */
    BossModel.getAwardBybossId = function (bossId, type) {
        var rawadList = [];
        var bossList = this.getCfgBybossType(type);
        if (!bossList)
            return;
        for (var key in bossList) {
            var rewad = bossList[key];
            if (rewad.bossId == bossId) {
                rawadList.push(rewad);
            }
        }
        return rawadList;
    };
    /**根据boss类型获取排名和世界boss配置 */
    BossModel.getCfgBybossType = function (type) {
        if (type == BossEnum.Rank) {
            return C.RankBossRankRewardConfig;
        }
        else {
            return C.WorldBossRankRewardConfig;
        }
    };
    BossModel.BossBuyCountCP = (_a = {},
        _a[BossEnum.Single] = [IFunCountEnum.PERSONAL_BOSS, VipPrivillType.BUY_PERSONAL_BOSS, IConstEnum.PERSONAL_BOSS_CONSUME_GOLD],
        _a[BossEnum.Rank] = [IFunCountEnum.RANK_BOSS, VipPrivillType.BUY_BOSS, IConstEnum.RANKING_BOSS_CONSUME_GOLD],
        _a[BossEnum.World] = [IFunCountEnum.WORLD_BOSS, VipPrivillType.BUY_WORLD_BOSS, IConstEnum.WORLD_BOSS_CONSUME_GOLD],
        _a);
    return BossModel;
}());
