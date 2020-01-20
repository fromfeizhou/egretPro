/**
 * 活动拓展
 */

/**战力冲榜 */
class FightRankVo extends ActivityVo implements IFObject {
    public configs: { [key: number]: ActivityPowerRankRewardConfig };
    public constructor() {
        super();
    }
    //获取战力榜单奖励对应配置表
    public getPowerRankCfg(rank: number) {
        return this.configs[rank];
    }


    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return true;
    }

}
/**等级冲榜 */
class LevelRankVo extends ActivityVo implements IFObject {
    public configs: { [key: number]: ActivityLevelRankRewardConfig };
    public constructor() {
        super();
    }
    //获取战力榜单奖励对应配置表
    public getLevelRankCfg(rank: number) {
        return this.configs[rank];
    }

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return true;
    }
}
/**国家城池冲榜 */
class CountryRankVo extends ActivityVo implements IFObject {
    public configs: { [key: number]: ActivityCountryCitysRankRewardConfig };
    public constructor() {
        super();
    }
    //获取国家城池榜单奖励对应配置表
    public getCountryRankCfg(rank: number) {
        return this.configs[rank];
    }

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return true;
    }

    /**请求活动内容(子类重写)  */
	public requestActivityInfo() {
        // ScenePopQueWnd.addNewActNotice(AcViewType.COUNTRY_CITYS_RANKING);
	}
}

/**联盟战力冲榜 */
class LegionRankVo extends ActivityVo implements IFObject {
    public configs: { [key: number]: ActivityGuildForceRankRewardConfig };
    public constructor() {
        super();
    }
    //获取联盟战力榜单奖励对应配置表
    public getLegionRankCfg(rank: number) {
        return this.configs[rank];
    }

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return true;
    }

    /**请求活动内容(子类重写)  */
	public requestActivityInfo() {
        // ScenePopQueWnd.addNewActNotice(AcViewType.GUILD_FORCE_RANKING);
	}
}

/**竞技场战力冲榜 */
class ArenaRankVo extends ActivityVo implements IFObject {
    public configs: { [key: number]: ActivityApkRankRewardConfig };
    public constructor() {
        super();
    }
    //获取联盟战力榜单奖励对应配置表
    public getArenaRankCfg(rank: number) {
        return this.configs[rank];
    }

    /**是否需要读取服务器配置(子类重写) */
    public isNeedServerCfg() {
        return true;
    }

    /**请求活动内容(子类重写)  */
	public requestActivityInfo() {
        // ScenePopQueWnd.addNewActNotice(AcViewType.APK_RANKING);
	}
}




