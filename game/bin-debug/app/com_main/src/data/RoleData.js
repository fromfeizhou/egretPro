var RoleData = /** @class */ (function () {
    function RoleData() {
    }
    Object.defineProperty(RoleData, "level", {
        get: function () {
            return this._level;
        },
        /**等级 */
        set: function (val) {
            if (this._level != val) {
                var isInit = this._level == 0;
                this.lastLevel = this.level == 0 ? val : this.level;
                this._level = val;
                PlatConst.level = this._level;
                if (!isInit) {
                    com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_LEVLE, null);
                    ScenePopQueWnd.addLevelWnd();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "exp", {
        get: function () {
            return this._exp;
        },
        /**经验 */
        set: function (val) {
            if (this._exp != val) {
                this.lastExp = this.exp;
                this._exp = val;
                this.checkLevel();
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_EXP, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**经验变动 检查等级 */
    RoleData.checkLevel = function () {
        var maxExp = this.getPlayerLevelUpExp(RoleData.level);
        var curExp = this._exp;
        var newLv = this._level;
        while (curExp >= maxExp) {
            //等级上限判断
            var cfg = C.PlayerExpConfig[newLv + 1];
            this._exp = maxExp;
            if (!cfg)
                break;
            newLv += 1;
            curExp -= maxExp;
            maxExp = this.getPlayerLevelUpExp(newLv);
        }
        if (newLv != this._level) {
            this.level = newLv;
            this._exp = maxExp <= 0 ? 0 : curExp;
        }
    };
    Object.defineProperty(RoleData, "vipLevel", {
        get: function () {
            return this._vipLevel;
        },
        /**vip等级 */
        set: function (val) {
            if (this._vipLevel != val) {
                this._vipLevel = val;
                PlatConst.vipLevel = this._level;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_VIP_LEVLE, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "vipIntegral", {
        get: function () {
            return this._vipIntegral;
        },
        /**vip积分 */
        set: function (val) {
            if (this._vipIntegral != val) {
                this._vipIntegral = val;
                this.checkVipLevel();
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_VIP_EXP, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "hasCityRevenue", {
        /**是否有税收 */
        get: function () {
            return this._hasCityRevenue;
        },
        set: function (val) {
            this._hasCityRevenue = val;
            com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_TAX, null);
        },
        enumerable: true,
        configurable: true
    });
    /**vip经验变动 检查Vip等级 */
    RoleData.checkVipLevel = function () {
        if (RoleData.vipLevel == VipModel.MAX_VIP)
            return;
        var maxExp = this.getPlayerVipLevelUpExp(RoleData.vipLevel);
        var lastCfg = VipModel.getVipCfgByLv(RoleData.vipLevel - 1); //上一等级
        var lastExp = lastCfg == null ? 0 : lastCfg.exp;
        var curExp = this._vipIntegral - lastExp;
        var newLv = this._vipLevel;
        while (curExp >= maxExp) {
            //等级上限判断
            var cfg = VipModel.getVipCfgByLv(newLv + 1);
            // this._exp = maxExp;
            if (!cfg)
                return;
            newLv += 1;
            curExp -= maxExp;
            maxExp = this.getPlayerVipLevelUpExp(newLv);
            if (newLv == VipModel.MAX_VIP)
                break;
        }
        if (newLv != this._vipLevel) {
            this.vipLevel = newLv;
        }
    };
    Object.defineProperty(RoleData, "yu", {
        get: function () {
            return this._yu;
        },
        /**勾玉 */
        set: function (val) {
            if (this._yu != val) {
                this._yu = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.YU);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "gold", {
        get: function () {
            return this._gold;
        },
        /**元宝 */
        set: function (val) {
            if (this._gold != val) {
                this._gold = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.GOLD);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "silver", {
        get: function () {
            return this._silver;
        },
        /**银子 */
        set: function (val) {
            if (this._silver != val) {
                this._silver = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.SILVER);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "food", {
        get: function () {
            return this._food;
        },
        /**粮草 */
        set: function (val) {
            if (this._food != val) {
                this._food = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.FOOD);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "ironCount", {
        get: function () {
            return this._ironCount;
        },
        /**铁 */
        set: function (val) {
            if (this._ironCount != val) {
                this._ironCount = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.IRON);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "wood", {
        get: function () {
            return this._wood;
        },
        /**木头 */
        set: function (val) {
            if (this._wood != val) {
                this._wood = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.WOOD);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "pvpMedal", {
        get: function () {
            return this._pvpMedal;
        },
        /**竞技勋章 */
        set: function (val) {
            if (this._pvpMedal != val) {
                this._pvpMedal = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.PVP_MEDAL);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "recruit", {
        get: function () {
            return this._recruit;
        },
        /**招募令 */
        set: function (val) {
            if (this._recruit != val) {
                this._recruit = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.ZML);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "conquer", {
        get: function () {
            return this._conquer;
        },
        /** 过关斩将积分*/
        set: function (val) {
            if (this._conquer != val) {
                this._conquer = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.CONQUER);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "bossScore", {
        get: function () {
            return this._bossScore;
        },
        /** 百战精华*/
        set: function (val) {
            if (this._bossScore != val) {
                this._bossScore = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.BOSSSCORE);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "honor", {
        get: function () {
            return this._honor;
        },
        /**荣誉值 */
        set: function (val) {
            if (this._honor != val) {
                this._honor = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.HONOR);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "guildContribute", {
        get: function () {
            return this._guildContribute;
        },
        /**联盟贡献 */
        set: function (val) {
            if (this._guildContribute != val) {
                this._guildContribute = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.GUILD_POINT);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "countryId", {
        get: function () {
            return this._countryId;
        },
        /**国家 */
        set: function (val) {
            if (this._countryId != val) {
                this._countryId = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_COUNTRY, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "alliance", {
        get: function () {
            return this._alliance;
        },
        /**联盟国家id */
        set: function (val) {
            if (this._alliance != val) {
                this._alliance = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_ALLIANCE, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "governmentPost", {
        get: function () {
            return this._governmentPost;
        },
        /**官职 */
        set: function (val) {
            if (this._governmentPost != val) {
                this._governmentPost = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_GOVERMENT, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "militaryCoin", {
        get: function () {
            return this._militaryCoin;
        },
        /**军功货币 */
        set: function (val) {
            if (this._militaryCoin != val) {
                this._militaryCoin = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.MILITARY_MERITS_CONSUMED);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "military", {
        get: function () {
            return this._military;
        },
        /**累计军功 */
        set: function (val) {
            if (this._military != val) {
                this._military = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_RESOURCE, PropEnum.MILITARY_EXPLOIT);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "militaryWeekExp", {
        get: function () {
            return this._militayWeekExp;
        },
        /**总军功 */
        set: function (val) {
            if (this._militayWeekExp != val) {
                this._militayWeekExp = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_MILITARY_WEEK_EXP, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "militaryDayExp", {
        get: function () {
            return this._militaryDayExp;
        },
        /**总军功 */
        set: function (val) {
            if (this._militaryDayExp != val) {
                this._militaryDayExp = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "arena", {
        get: function () {
            return this._arena;
        },
        /**擂台等级 -1为满级*/
        set: function (val) {
            if (this._arena != val) {
                this._arena = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_ARENA_LEVEL, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleData, "arenaExp", {
        get: function () {
            return this._arenaExp;
        },
        /**擂台经验*/
        set: function (val) {
            if (this._arenaExp != val) {
                this._arenaExp = val;
                com_main.EventMgr.dispatchEvent(RoleEvent.ROLE_ARENA_EXP, null);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**追加疲劳值列表 */
    RoleData.addFatigue = function (arr) {
        this.fatigueInfo.concat(arr);
    };
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
    RoleData.isbeyond = function (type, num) {
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
    };
    /**资源是否足够 ,返回提示语*/
    RoleData.getTipsisbeyond = function (type, num) {
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
    };
    //获取材料数量
    RoleData.GetMaterialNumById = function (id) {
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
    };
    //获取材料icon
    RoleData.GetMaterialIconPathById = function (id) {
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
    };
    /**
     * 获取玩家某个等级升级需要的经验
     */
    RoleData.getPlayerLevelUpExp = function (level) {
        if (level == null) {
            level = RoleData.level;
        }
        var lastExp = -1;
        var lastCfg = C.PlayerExpConfig[level - 1]; //上一等级
        lastExp = lastCfg == null ? 0 : lastCfg.playerExp;
        var exp = -1;
        var cfg = C.PlayerExpConfig[level];
        if (cfg) {
            exp = cfg.playerExp - lastExp;
            return exp;
        }
        return -1;
    };
    /**
     * 获取玩家某个vip等级升级需要的经验
     */
    RoleData.getPlayerVipLevelUpExp = function (vipLevel) {
        if (vipLevel == null) {
            vipLevel = RoleData.vipLevel;
        }
        var lastExp = -1;
        var lastCfg = VipModel.getVipCfgByLv(vipLevel - 1); //上一等级
        lastExp = lastCfg == null ? 0 : lastCfg.exp;
        var exp = -1;
        var cfg = VipModel.getVipCfgByLv(vipLevel);
        if (cfg) {
            exp = cfg.exp - lastExp;
            return exp;
        }
        return -1;
    };
    /**
     * 玩家id
     * 与服务器约定 不能超过52位 客户端本地转成number类型 不会失真
     */
    RoleData.playerId = 0;
    /**玩家昵称 */
    RoleData.nickName = 'me';
    /**性别 0=男 1=女，默认0 */
    RoleData.gender = 0;
    /**默认充值角色 */
    RoleData.recharge = false;
    /**上一等级 */
    RoleData.lastLevel = 0;
    /**上一经验 */
    RoleData.lastExp = 0;
    /**玩家等级 */
    RoleData._level = 0;
    /**经验 */
    RoleData._exp = 0;
    /**累计军功 */
    RoleData._military = 0;
    /**军功货币 */
    RoleData._militaryCoin = 0;
    /**总军功 */
    RoleData._militayWeekExp = 0;
    /**日军功 */
    RoleData._militaryDayExp = 0;
    /**官职id */
    RoleData._governmentPost = 0;
    /**当前占领封地的等级 */
    RoleData.fiefLevel = 3;
    /**勾玉 */
    RoleData._yu = 0;
    /**金币 */
    RoleData._gold = 0;
    /**银币 */
    RoleData._silver = 0;
    /**木材 */
    RoleData._wood = 0;
    /**进入游戏后返回战斗 */
    RoleData.battleId = 0;
    /**vip等级 */
    RoleData._vipLevel = 0;
    /**vip积分 */
    RoleData._vipIntegral = 0;
    /**粮草 */
    RoleData._food = 0;
    /**玩家拥有铁数量 */
    RoleData._ironCount = 0;
    /**玩家每小时产铁数量 */
    RoleData.ironPerHour = 0;
    /**是否自动出兵 压力测试用 */
    RoleData.isAuto = false;
    /**是否允许登陆 */
    RoleData.isCanLogin = false;
    /**是否新创建的号 */
    RoleData.isCreateAccount = false;
    // /**玩家怒气 */
    // public static rage: number = 0;
    // /**战场玩家最大怒气值 */
    // public static maxRage: number = 0;
    /** 玩家头像id */
    RoleData.headId = 1;
    /**头像类型 */
    RoleData.headType = 1;
    /**联盟国家id */
    RoleData._alliance = 0; //（-1：大国崛起，0没有国家结盟    > 0 则为结盟国家id）
    RoleData._arena = 0; //擂台等级（-1为满级）
    /**擂台经验加成 */
    RoleData._arenaExp = 0;
    /**疲劳值列表 */
    RoleData.fatigueInfo = [];
    /**粮食祭祀 */
    RoleData.grain_sac = 0;
    /**银币祭祀 */
    RoleData.silver_sac = 0;
    /**兵书祭祀 */
    RoleData.war_sac = 0;
    /**宝石祭祀 */
    RoleData.gem_sac = 0;
    /**联盟贡献 */
    RoleData._guildContribute = 0;
    /**竞技勋章 */
    RoleData._pvpMedal = 0;
    /**招募令 */
    RoleData._recruit = 0;
    /**过关斩将积分 */
    RoleData._conquer = 0;
    /**百战精华 */
    RoleData._bossScore = 0;
    /**荣誉 */
    RoleData._honor = 0;
    RoleData.open_id = '';
    RoleData.token = '';
    RoleData.server_id = 0;
    return RoleData;
}());
