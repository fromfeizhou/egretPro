
/**
 * bossmodel
 * @class BossModel/**
 * 
 *
 * 
**/

enum BossType {
    NOTES = 1, //切磋
    ACTTACT = 2, //攻城
    SECURITY = 3,//治安

}
enum BtnQuickState {
    USEPROPS = 0, //使用道具
    BUYCOUNT = 1, //购买次数
}
enum BtnState {
    CHALLANGE = 1, //挑战
    SWEEPING = 2, //扫荡
}
enum BossEnum {
    ALL = 0,
    /**单人 */
    Single = 1,
    /**排名 */
    Rank = 2,
    /**世界 */
    World = 3,
}

class BossModel {
    public static personalBossInfoDic: { [key: number]: gameProto.IPersonalBossInfo }; // 个人boss信息	
    public static rankBossInfoDic: { [key: number]: gameProto.IRankBossInfo };   //排名boss信息
    public static worldBossInfoDic: { [key: number]: gameProto.IWorldBossInfo }; // 世界boss信息	
    public static rankBossPlayerStartReviveTime: number; // 玩家排名boss挑战次数恢复倒计时开始时间	
    public static rankBossPlayerEndReviveTime: number; // 玩家排名boss挑战次数恢复倒计时结束时间	
    public static boxIds: number[]; // 已经领取的boxId	
    public static worldSumHurt: number; // 今日对所有世界boss的总伤害	
    // public static rankingBossFreeBuyCount: number; // 排名boss剩余免费购买次数	

    public static challType: number; // 挑战结束的boss类型

    public static BossBuyCountCP = {
        [BossEnum.Single]: [IFunCountEnum.PERSONAL_BOSS, VipPrivillType.BUY_PERSONAL_BOSS, IConstEnum.PERSONAL_BOSS_CONSUME_GOLD],
        [BossEnum.Rank]: [IFunCountEnum.RANK_BOSS, VipPrivillType.BUY_BOSS, IConstEnum.RANKING_BOSS_CONSUME_GOLD],
        [BossEnum.World]: [IFunCountEnum.WORLD_BOSS, VipPrivillType.BUY_WORLD_BOSS, IConstEnum.WORLD_BOSS_CONSUME_GOLD]
    };

    public static parseBossData(info: gameProto.IS2C_GET_BOSS) {
        this.personalBossInfoDic = {};
        for (let i = 0; i < info.personalBossInfo.length; i++) {
            let data = info.personalBossInfo[i];
            this.personalBossInfoDic[data.bossId] = data;
        }

        this.rankBossInfoDic = {};
        for (let i = 0; i < info.rankBossInfo.length; i++) {
            let data = info.rankBossInfo[i];
            this.rankBossInfoDic[data.bossId] = data;
        }

        this.worldBossInfoDic = {};
        for (let i = 0; i < info.worldBossInfo.length; i++) {
            let data = info.worldBossInfo[i];
            this.worldBossInfoDic[data.bossId] = data;
        }

        this.rankBossPlayerStartReviveTime = info.rankBossPlayerStartReviveTime;
        this.rankBossPlayerEndReviveTime = info.rankBossPlayerEndReviveTime;
        this.boxIds = info.boxIds;
        this.worldSumHurt = info.worldSumHurt;
        // this.rankingBossFreeBuyCount = info.rankingBossFreeBuyCount;

        com_main.EventMgr.dispatchEvent(BossEvent.BOSS_INFO_UPDATE, BossEnum.ALL);
    }

    /**修改死亡boss数据 */
    public static setDieBossData(bossid: number) {
        this.rankBossInfoDic = {};
    }

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
    public static setReviveTime(info: gameProto.S2C_BUY_BOSS_CHALLENGE_COUNT) {
        if (info && info.type == BossEnum.Rank) {
            this.rankBossPlayerStartReviveTime = info.rankBossPlayerStartReviveTime;
            this.rankBossPlayerEndReviveTime = info.rankBossPlayerEndReviveTime;
        }
    }
    /**设置领取的宝箱Id */
    public static getBossHurtCfg(info: gameProto.S2C_RECEIVE_BOSS_BOX) {
        if (info) {
            this.boxIds = info.boxIds;
        }
    }
    /**设置宝箱数据 */
    public static getHurtOneCfg() {
        let hurtCfg = C.BossHurtConfig;
        for (let key in C.BossHurtConfig) {
            let cfg = C.BossHurtConfig[key];
            if (this.boxIds.indexOf(cfg.id) >= 0)
                continue;
            return cfg;
        }
    }
    /**单人副本*/
    public static getSingleItemInfo(bossId: number) {
        return this.personalBossInfoDic[bossId];
    }

    /**排名副本*/
    public static getRandItemInfo(bossId: number) {
        return this.rankBossInfoDic[bossId];
    }

    /**世界boss*/
    public static getWorldItemInfo(bossId: number) {
        return this.worldBossInfoDic[bossId];
    }
    /**
     * boss挑战
     * 根据tag标签页取对应类型boss配置信息列表
     */
    public static getBossCfgByType(type: BossEnum) {
        let res: PersonalBossConfig[] = [];
        let bossCfg = C.PersonalBossConfig;
        for (let i in bossCfg) {
            if (unNull(bossCfg[i]) && Number(bossCfg[i].bossType) == type) {
                res.push(bossCfg[i]);
            }
        }

        return res;
    }

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
    public static GetSingeBtnState(bossId?: number) {
        if (!FunctionModel.isFunctionOpen(FunctionType.BOSS)) return false;
        // 没有指定bossId
        if (!bossId) {
            let useCount = NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS).reCount;
            return useCount;
        }
        let cfg = C.PersonalBossConfig[bossId];
        let count = NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS).reCount;
        if (cfg.openLevel <= RoleData.level && count > 0) {
            return true;
        }
        return false;
    }
    /**返回排名按钮红点 */
    public static GetRankBtnState(bossId?: number) {
        if (!FunctionModel.isFunctionOpen(FunctionType.BOSS)) return false;
        let count = NormalModel.getFunCountById(IFunCountEnum.RANK_BOSS).reCount;
        if (count == 0) return false;
        //没有指定bossId
        if (!bossId) {
            return BossModel.GetRankNum();
        }

        let cfg = C.PersonalBossConfig[bossId];
        if (cfg.openLevel > RoleData.level) {
            return false;
        }
        let bossRank = BossModel.getRandItemInfo(bossId);
        if (bossRank) {
            return bossRank.bossHp > 0;
        }
        return false;
    }
    /**返回世界按钮红点 */
    public static GetWorldBtnState(bossId?: number) {
        if (!FunctionModel.isFunctionOpen(FunctionType.BOSS)) return false;
        let count = NormalModel.getFunCountById(IFunCountEnum.WORLD_BOSS).reCount;
        if (count == 0) return false;
        //没有指定bossId
        if (!bossId) {
            return BossModel.GetBossNum();
        }

        let cfg = C.PersonalBossConfig[bossId];
        if (cfg.openLevel > RoleData.level) {
            return false;
        }
        let bossWorld = BossModel.getWorldItemInfo(bossId);
        if (bossWorld) {
            return (bossWorld.bossHp > 0);
        }
        return false;
    }
    /**返回排名挑战次数 */
    public static GetRankNum() {

        let boo: boolean;
        let singleArr = this.getBossCfgByType(BossEnum.Rank);
        for (let i = 0; i < singleArr.length; i++) {
            let res = this.GetRankBtnState(singleArr[i].id)
            if (res) {
                boo = res;
            }
        }
        return boo;
        // return this.rankBossChallengeCount;
    }
    /**返回世界boss挑战次数 */
    public static GetBossNum() {
        let curTime = TimerUtils.getServerTime();
        let curWeek = TimerUtils.getTimeWeek();
        let openTime: string = "";
        for (let key in C.PersonalBossConfig) {
            openTime = C.PersonalBossConfig[key].time;
            openTime = openTime.replace('[', '');
            openTime = openTime.replace(']', '');
            let times = openTime.split(',');
            let startTime = TimerUtils.getTimeByFormatA(times[0]);
            let endTime = TimerUtils.getTimeByFormatA(times[1]);
            let isOpen = (curTime >= startTime && curTime <= endTime);
            let weekOpeen = (curWeek == C.PersonalBossConfig[key].week)
            let openLv = RoleData.level >= C.PersonalBossConfig[key].openLevel ? true : false;
            if (isOpen && weekOpeen && openLv) {
                let bossWorld = BossModel.getWorldItemInfo(Number(key));
                if (bossWorld) {
                    return bossWorld.bossHp > 0;
                }
            }
        }

        return false;
    }

    /**排行boss 个人排名 */
    public static getPlayerLvInRankBoss(bossId: number) {
        let rankInfo = this.rankBossInfoDic[bossId];
        if (rankInfo) {
            for (let i = 0; i < rankInfo.bossRankingListInfo.length; i++) {
                let rankData = rankInfo.bossRankingListInfo[i];
                if (rankData.playerId == RoleData.playerId) {
                    return rankData.ranking;
                }
            }
        }
        return -1;
    }
    /**世界boss 个人排名 */
    public static getPlayerLvInWorldBoss(bossId: number) {
        let worldInfo = this.worldBossInfoDic[bossId];
        if (worldInfo) {
            for (let i = 0; i < worldInfo.bossRankingListInfo.length; i++) {
                let rankData = worldInfo.bossRankingListInfo[i];
                if (rankData.playerId == RoleData.playerId) {
                    return rankData.ranking;
                }
            }
        }
        return -1;
    }
    /**通过boss编号获取排名，世界boss奖励配置数据 */
    public static getAwardBybossId(bossId: number, type: number) {
        let rawadList = [];
        let bossList = this.getCfgBybossType(type);
        if (!bossList) return;
        for (let key in bossList) {
            let rewad = bossList[key];
            if (rewad.bossId == bossId) {
                rawadList.push(rewad);
            }
        }
        return rawadList;
    }
    /**根据boss类型获取排名和世界boss配置 */
    public static getCfgBybossType(type: number) {
        if (type == BossEnum.Rank) {
            return C.RankBossRankRewardConfig;
        } else {
            return C.WorldBossRankRewardConfig;
        }
    }


}