class RoleData {
    /**
     * 玩家id
     * 与服务器约定 不能超过52位 客户端本地转成number类型 不会失真
     */
    public static playerId: number = 0;
    /**玩家昵称 */
    public static nickName: string = 'me';
    /**国家id */
    public static _countryId: CountryType;
    /**性别 0=男 1=女，默认0 */
    public static gender: number = 0;
    /**创建时间 */
    public static createTimestamp: number;
    /**离线时间 */
    public static offlineStamp: number;
    /**是否有税收 */
    public static _hasCityRevenue: boolean;
    /**默认国家id */
    public static defaultCountryId: CountryType;
    /**默认充值角色 */
    public static recharge: boolean = false;
    /**上一等级 */
    public static lastLevel: number = 0;
    /**上一经验 */
    public static lastExp: number = 0;

    /**玩家等级 */
    public static _level: number = 0;
    /**经验 */
    public static _exp: number = 0;
    /**累计军功 */
    public static _military: number = 0;
    /**军功货币 */
    public static _militaryCoin: number = 0;
    /**总军功 */
    public static _militayWeekExp: number = 0;
    /**日军功 */
    public static _militaryDayExp: number = 0;
    /**官职id */
    public static _governmentPost: number = 0;
    /**当前占领封地的等级 */
    public static fiefLevel: number = 3;
    /**勾玉 */
    public static _yu: number = 0;
    /**金币 */
    public static _gold: number = 0;
    /**银币 */
    public static _silver: number = 0;
    /**木材 */
    public static _wood: number = 0;
    /**进入游戏后返回战斗 */
    public static battleId: number = 0;
    /**vip等级 */
    public static _vipLevel: number = 0;
    /**vip积分 */
    public static _vipIntegral: number = 0;
    /**粮草 */
    public static _food: number = 0;

    /**玩家拥有铁数量 */
    public static _ironCount: number = 0;
    /**玩家每小时产铁数量 */
    public static ironPerHour: number = 0;

    /**是否自动出兵 压力测试用 */
    public static isAuto: boolean = false;
    /**是否允许登陆 */
    public static isCanLogin: boolean = false;

    /**是否新创建的号 */
    public static isCreateAccount: boolean = false;
    // /**玩家怒气 */
    // public static rage: number = 0;
    // /**战场玩家最大怒气值 */
    // public static maxRage: number = 0;

    /** 玩家头像id */
    public static headId: number = 1;
    /**头像类型 */
    public static headType: number = 1;

    /**联盟国家id */
    public static _alliance: number = 0;//（-1：大国崛起，0没有国家结盟    > 0 则为结盟国家id）

    public static _arena: number = 0;//擂台等级（-1为满级）
    /**擂台经验加成 */
    public static _arenaExp: number = 0;

    /**疲劳值列表 */
    public static fatigueInfo: any[] = [];

    /**粮食祭祀 */
    public static grain_sac: number = 0;
    /**银币祭祀 */
    public static silver_sac: number = 0;
    /**兵书祭祀 */
    public static war_sac: number = 0;
    /**宝石祭祀 */
    public static gem_sac: number = 0;
    /**联盟贡献 */
    public static _guildContribute: number = 0;

    /**竞技勋章 */
    public static _pvpMedal: number = 0;
    /**招募令 */
    public static _recruit: number = 0;
    /**过关斩将积分 */
    public static _conquer: number = 0;
    /**百战精华 */
    public static _bossScore: number = 0;

    /**荣誉 */
    public static _honor: number = 0;


    public static open_id: string = '';
    public static token: string = '';
    public static server_id: number = 0;
    public static chatSender: gameProto.IPlayerBriefInfo;

    /**等级 */
    public static set level(val: number) {
        if (this._level != val) {
            let isInit = this._level == 0;
            this.lastLevel = this.level == 0 ? val : this.level;
            this._level = val;
            PlatConst.level = this._level;
            if (!isInit) {
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_LEVLE, null);
                ScenePopQueWnd.addLevelWnd();
            }
        }
    }
    public static get level(): number {
        return this._level;
    }

    /**经验 */
    public static set exp(val: number) {
        if (this._exp != val) {
            this.lastExp = this.exp;
            this._exp = val;
            this.checkLevel();
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_EXP, null);
        }
    }

    public static get exp(): number {
        return this._exp;
    }

    /**经验变动 检查等级 */
    private static checkLevel() {
        let maxExp = this.getPlayerLevelUpExp(RoleData.level);
        let curExp = this._exp;
        let newLv = this._level;
        while (curExp >= maxExp) {
            //等级上限判断
            let cfg = C.PlayerExpConfig[newLv + 1];
            this._exp = maxExp;
            if (!cfg) break;
            newLv += 1;
            curExp -= maxExp;
            maxExp = this.getPlayerLevelUpExp(newLv);
        }

        if (newLv != this._level) {
            this.level = newLv;
            this._exp = maxExp <= 0 ? 0 : curExp;

        }
    }

    /**vip等级 */
    public static set vipLevel(val: number) {
        if (this._vipLevel != val) {
            this._vipLevel = val;
            PlatConst.vipLevel = this._level;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_VIP_LEVLE, null);
        }
    }
    public static get vipLevel(): number {
        return this._vipLevel;
    }

    /**vip积分 */
    public static set vipIntegral(val: number) {
        if (this._vipIntegral != val) {
            this._vipIntegral = val;
            this.checkVipLevel();
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_VIP_EXP, null);
        }
    }
    public static get vipIntegral(): number {
        return this._vipIntegral;
    }
    /**是否有税收 */
    public static get hasCityRevenue(): boolean {
        return this._hasCityRevenue;
    }
    public static set hasCityRevenue(val: boolean) {
        this._hasCityRevenue = val
        com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_TAX, null);
    }
    /**vip经验变动 检查Vip等级 */
    private static checkVipLevel() {
        if (RoleData.vipLevel == VipModel.MAX_VIP)
            return;
        let maxExp = this.getPlayerVipLevelUpExp(RoleData.vipLevel);
        let lastCfg: VipConfig = VipModel.getVipCfgByLv(RoleData.vipLevel - 1)//上一等级
        let lastExp = lastCfg == null ? 0 : lastCfg.exp;
        let curExp = this._vipIntegral - lastExp;
        let newLv = this._vipLevel;
        while (curExp >= maxExp) {
            //等级上限判断
            let cfg = VipModel.getVipCfgByLv(newLv + 1);
            // this._exp = maxExp;
            if (!cfg) return;
            newLv += 1;
            curExp -= maxExp;
            maxExp = this.getPlayerVipLevelUpExp(newLv);
            if (newLv == VipModel.MAX_VIP)
                break;
        }

        if (newLv != this._vipLevel) {
            this.vipLevel = newLv;
        }
    }

    /**勾玉 */
    public static set yu(val: number) {
        if (this._yu != val) {
            this._yu = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.YU);
        }
    }
    public static get yu(): number {
        return this._yu;
    }

    /**元宝 */
    public static set gold(val: number) {
        if (this._gold != val) {
            this._gold = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.GOLD);
        }
    }
    public static get gold(): number {
        return this._gold;
    }

    /**银子 */
    public static set silver(val: number) {
        if (this._silver != val) {
            this._silver = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.SILVER);
        }
    }
    public static get silver(): number {
        return this._silver;
    }

    /**粮草 */
    public static set food(val: number) {
        if (this._food != val) {
            this._food = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.FOOD);
        }
    }
    public static get food(): number {
        return this._food;
    }

    /**铁 */
    public static set ironCount(val: number) {
        if (this._ironCount != val) {
            this._ironCount = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.IRON);
        }
    }
    public static get ironCount(): number {
        return this._ironCount;
    }

    /**木头 */
    public static set wood(val: number) {
        if (this._wood != val) {
            this._wood = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.WOOD);
        }
    }
    public static get wood(): number {
        return this._wood;
    }

    /**竞技勋章 */
    public static set pvpMedal(val: number) {
        if (this._pvpMedal != val) {
            this._pvpMedal = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.PVP_MEDAL);
        }
    }
    public static get pvpMedal(): number {
        return this._pvpMedal;
    }
    /**招募令 */
    public static set recruit(val: number) {
        if (this._recruit != val) {
            this._recruit = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.ZML);
        }
    }
    public static get recruit(): number {
        return this._recruit;
    }
    /** 过关斩将积分*/
    public static set conquer(val: number) {
        if (this._conquer != val) {
            this._conquer = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.CONQUER);
        }
    }
    public static get conquer(): number {
        return this._conquer;
    }
    /** 百战精华*/
    public static set bossScore(val: number) {
        if (this._bossScore != val) {
            this._bossScore = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.BOSSSCORE);
        }
    }
    public static get bossScore(): number {
        return this._bossScore;
    }
    /**荣誉值 */
    public static set honor(val: number) {
        if (this._honor != val) {
            this._honor = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.HONOR);
        }
    }
    public static get honor(): number {
        return this._honor;
    }


    /**联盟贡献 */
    public static set guildContribute(val: number) {
        if (this._guildContribute != val) {
            this._guildContribute = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.GUILD_POINT);
        }
    }
    public static get guildContribute(): number {
        return this._guildContribute;
    }

    /**国家 */
    public static set countryId(val: CountryType) {
        if (this._countryId != val) {
            this._countryId = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_COUNTRY, null);

        }
    }
    public static get countryId(): CountryType {
        return this._countryId;
    }

    /**联盟国家id */
    public static set alliance(val: number) {
        if (this._alliance != val) {
            this._alliance = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_ALLIANCE, null);
        }
    }
    public static get alliance(): number {
        return this._alliance;
    }


    /**官职 */
    public static set governmentPost(val: number) {
        if (this._governmentPost != val) {
            this._governmentPost = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_GOVERMENT, null);
        }
    }
    public static get governmentPost(): number {
        return this._governmentPost;
    }

    /**军功货币 */
    public static set militaryCoin(val: number) {
        if (this._militaryCoin != val) {
            this._militaryCoin = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.MILITARY_MERITS_CONSUMED);
        }
    }
    public static get militaryCoin(): number {
        return this._militaryCoin;
    }
    public static get military(): number {
        return this._military;
    }
    /**累计军功 */
    public static set military(val: number) {
        if (this._military != val) {
            this._military = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.MILITARY_EXPLOIT);
        }
    }

    /**总军功 */
    public static set militaryWeekExp(val: number) {
        if (this._militayWeekExp != val) {
            this._militayWeekExp = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_MILITARY_WEEK_EXP, null);
        }
    }
    public static get militaryWeekExp(): number {
        return this._militayWeekExp;
    }


    /**总军功 */
    public static set militaryDayExp(val: number) {
        if (this._militaryDayExp != val) {
            this._militaryDayExp = val;
        }
    }
    public static get militaryDayExp(): number {
        return this._militaryDayExp;
    }

    /**擂台等级 -1为满级*/
    public static set arena(val: number) {
        if (this._arena != val) {
            this._arena = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_ARENA_LEVEL, null);
        }
    }
    public static get arena(): number {
        return this._arena;
    }

    /**擂台经验*/
    public static set arenaExp(val: number) {
        if (this._arenaExp != val) {
            this._arenaExp = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_ARENA_EXP, null);
        }
    }
    public static get arenaExp(): number {
        return this._arenaExp;
    }

    /**追加疲劳值列表 */
    public static addFatigue(arr: any[]) {
        this.fatigueInfo.concat(arr);
    }

    // /**获取粮食上限 */
    // public static getFoodMaxLimit(): number {
    //     return MainMapModel.getFoodMaxLimit();
    // }

    // /**获取银币上限 */
    // public static getSilverMaxLimit(): number {
    //     return MainMapModel.getSilverMaxLimit();
    // }


    // public static isMax(type: PropEnum, num: number) {
    //     switch (type) {
    //         case PropEnum.FOOD: {
    //             return RoleData.food + num > this.getFoodMaxLimit();
    //         }
    //         case PropEnum.SILVER: {
    //             return RoleData.silver + num > this.getSilverMaxLimit();
    //         }
    //     }
    // }
    /**资源是否足够 */
    public static isbeyond(type: PropEnum, num: number) {
        switch (type) {
            case PropEnum.YU: {
                return RoleData.yu >= num;
            }
            case PropEnum.FOOD: {
                return RoleData.food >= num;
            }
            case PropEnum.SILVER: {
                return RoleData.silver >= num;
            }
            case PropEnum.IRON: {
                return RoleData.ironCount >= num;
            }
            case PropEnum.GOLD: {
                return RoleData.gold >= num;
            }
            case PropEnum.WOOD: {
                return RoleData.wood >= num;
            }
            case PropEnum.GUILD_POINT: {
                return RoleData.guildContribute >= num;
            }
            case PropEnum.PVP_MEDAL: {
                return RoleData.pvpMedal >= num;
            }
            case PropEnum.ZML: {
                return RoleData.recruit >= num;
            }
            case PropEnum.CONQUER: {
                return RoleData.conquer >= num;
            }
            case PropEnum.BOSSSCORE: {
                return RoleData.bossScore >= num;
            }
            case PropEnum.MILITARY_EXPLOIT: {
                return RoleData.military >= num;
            }
            case PropEnum.MILITARY_MERITS_CONSUMED: {
                return RoleData.militaryCoin >= num;
            }
            case PropEnum.MILITARY_MERITS_WEEK: {
                return RoleData.militaryWeekExp >= num;
            }
            case PropEnum.HONOR: {
                return RoleData.honor >= num;
            }
        }
    }
    /**资源是否足够 ,返回提示语*/
    public static getTipsisbeyond(type: PropEnum, num: number) {
        switch (type) {
            case PropEnum.YU: {
                return RoleData.yu >= num ? "" : '玉石不足';
            }
            case PropEnum.FOOD: {
                return RoleData.food >= num ? "" : GCode(CLEnum.FOOD_LESS);
            }
            case PropEnum.SILVER: {
                return RoleData.silver >= num ? "" : GCode(CLEnum.SILVER_LESS);
            }
            case PropEnum.IRON: {
                return RoleData.ironCount >= num ? "" : GCode(CLEnum.IRON_LESS);
            }
            case PropEnum.GOLD: {
                return RoleData.gold >= num ? "" : GCode(CLEnum.GOLD_LESS);
            }
            case PropEnum.WOOD: {
                return RoleData.wood >= num ? "" : GCode(CLEnum.WOOD_LESS);
            }
            case PropEnum.GUILD_POINT: {
                return RoleData.guildContribute >= num ? "" : GCode(CLEnum.GUI_POINT_LESS);
            }
            case PropEnum.PVP_MEDAL: {
                return RoleData._pvpMedal >= num ? "" : GCode(CLEnum.PVP_MEDAL_LESS);
            }
            case PropEnum.ZML: {
                return RoleData._recruit >= num ? "" : GCode(CLEnum.ZML_LESS);
            }
            case PropEnum.MILITARY_EXPLOIT: {
                return RoleData.military >= num ? "" : GCode(CLEnum.EXPLOIT_BUY_FAL);
            }
            case PropEnum.MILITARY_MERITS_CONSUMED: {
                return RoleData.militaryCoin >= num ? "" : GCode(CLEnum.EXPLOIT_LESS);
            }
            case PropEnum.MILITARY_MERITS_WEEK: {
                return RoleData.militaryWeekExp >= num ? "" : GCode(CLEnum.EXPLOIT_LESS);
            }
            case PropEnum.CONQUER: {
                return RoleData._conquer >= num ? "" : GCode(CLEnum.CONQUER_LESS);
            }
            case PropEnum.BOSSSCORE: {
                return RoleData._bossScore >= num ? "" : GCode(CLEnum.BOSS_SCORE);
            }
            case PropEnum.HONOR: {
                return RoleData._honor >= num ? "" : GCode(CLEnum.HONOR_LESS);
            }

        }
    }
    //获取材料数量
    public static GetMaterialNumById(id: number): number {
        switch (id) {
            case PropEnum.YU: {
                return RoleData.yu;
            }
            case PropEnum.GOLD: {
                return RoleData.gold;
            }
            case PropEnum.FOOD: {
                return RoleData.food;
            }
            case PropEnum.SILVER: {
                return RoleData.silver;
            }
            case PropEnum.MILITARY_EXPLOIT: {
                return RoleData.military;
            }
            case PropEnum.MILITARY_MERITS_CONSUMED: {
                return RoleData.militaryCoin;
            }
            case PropEnum.MILITARY_MERITS_WEEK: {
                return RoleData.militaryWeekExp;
            }
            case PropEnum.WOOD: {
                return RoleData.wood;
            }
            case PropEnum.IRON: {
                return RoleData.ironCount;
            }
            case PropEnum.GUILD_POINT: {
                return RoleData.guildContribute;
            }
            case PropEnum.PVP_MEDAL: {
                return RoleData.pvpMedal;
            }
            case PropEnum.ZML: {
                return RoleData.recruit;
            }
            case PropEnum.CONQUER: {
                return RoleData.conquer;
            }
            case PropEnum.BOSSSCORE: {
                return RoleData.bossScore;
            }
            case PropEnum.EXP: {
                return RoleData.exp;
            }
            case PropEnum.HONOR: {
                return RoleData.honor;
            }
        }

        return 0;
    }

    //获取材料icon
    public static GetMaterialIconPathById(id: number): string {

        switch (id) {
            case PropEnum.GOLD: {
                return "icon_source_gold_png";
            }
            case PropEnum.FOOD: {
                return "icon_source_food_png";
            }
            case PropEnum.SILVER: {
                return "icon_source_sliver_png";
            }
            case PropEnum.WOOD: {
                return "icon_source_wood_png";
            }
            case PropEnum.IRON: {
                return "icon_source_iron_png";
            }
            case PropEnum.GUILD_POINT: {
                return "icon_decorationLan_png";
            }
            case PropEnum.PVP_MEDAL: {
                return "icon_source_medal_png";
            }
            case PropEnum.ZML: {
                return "icon_source_recruit_png";
            }
            case PropEnum.MILITARY_EXPLOIT: {
                return "icon_lb_png";
            }
            case PropEnum.MILITARY_MERITS_CONSUMED: {
                return "icon_lb_png";
            }
            case PropEnum.MILITARY_MERITS_WEEK: {
                return "icon_lb_png";
            }
            case PropEnum.CONQUER: {
                return "icon_source_conquer_png";
            }
            case PropEnum.BOSSSCORE: {
                return "icon_source_bossJh_png";
            }
            case PropEnum.YU: {
                return "icon_source_jade_png";
            }
            case PropEnum.HONOR: {
                return "icon_ry_small_png";
            }
        }
        return '';
    }

    /**
     * 获取玩家某个等级升级需要的经验
     */
    public static getPlayerLevelUpExp(level?: number): number {
        if (level == null) {
            level = RoleData.level;
        }
        let lastExp: number = -1;
        let lastCfg: PlayerExpConfig = C.PlayerExpConfig[level - 1];//上一等级
        lastExp = lastCfg == null ? 0 : lastCfg.playerExp;

        let exp: number = -1;
        let cfg: PlayerExpConfig = C.PlayerExpConfig[level];
        if (cfg) {
            exp = cfg.playerExp - lastExp;
            return exp;
        }
        return -1;
    }
    /**
     * 获取玩家某个vip等级升级需要的经验
     */
    public static getPlayerVipLevelUpExp(vipLevel?: number): number {
        if (vipLevel == null) {
            vipLevel = RoleData.vipLevel;
        }
        let lastExp: number = -1;
        let lastCfg: VipConfig = VipModel.getVipCfgByLv(vipLevel - 1)//上一等级
        lastExp = lastCfg == null ? 0 : lastCfg.exp;

        let exp: number = -1;
        let cfg: VipConfig = VipModel.getVipCfgByLv(vipLevel);
        if (cfg) {
            exp = cfg.exp - lastExp;
            return exp;
        }
        return -1;
    }

}