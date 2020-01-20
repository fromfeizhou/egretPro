/**预加载资源组 */
class SceneResGroupCfg {
    private static laterClears: ModuleEnums[];
    private static bInit: boolean;
    /**预定义 */
    private static resGroup: { [key: number]: string[] } = {
        [SceneEnums.NONE_MAP]: [],
        [SceneEnums.MAIN_CITY]: ['font', 'b_guide', 'a_common', 'b_cityicon', 'b_mainBuilding', 'map', 'b_emoji'],

        [SceneEnums.WORLD_CITY]: ['font', 'b_guide', 'a_common', 'b_cityicon', 'config', 'b_worldBuildding', 'map', 'worldPreLoad', 'b_emoji'],

        [SceneEnums.WORLD_XIANGYANG_CITY]: ['font', 'b_guide', 'a_common', 'b_cityicon', 'config', 'b_xiangyang', 'map', 'worldPreLoad', 'b_emoji'],

        [SceneEnums.BATTLE_MAP]: ['battleFont', 'commonFont', 'b_guide', 'b_battle', 'Bullet', 'map'],

        [SceneEnums.NOVICE_MAP]: ['build', 'map', 'a_background', 'otherbuild'],

        [SceneEnums.AUTO_BATTLE_MAP]: ['font', 'commonFont', 'b_guide', 'mapThum', 'a_common', 'b_cityicon', 'a_background', 'hang', 'EUI_MissionTips', 'b_emoji'],

        [SceneEnums.TEST_MAP]: ['a_background', 'a_button', 'a_label', 'a_process', 'font', 'b_battle', 'Bullet', 'map', 'battleFont'],

        [SceneEnums.WAIT_BATTLE_MAP]: ['b_guide', 'b_battle', 'map'],

        [ModuleEnums.FIRST_ENTER_GAME_RES]: ['b_guide', 'b_notice', 'b_selectCountry', 'img', 'map_battle_6'],
        /**模块 */
        [ModuleEnums.FLAGMENT_RES]: ['prop', 'b_role', 'b_icon_skill', 'b_icon_trea', 'b_icon_trea_b', 'b_icon_wj', 'b_icon_wj_b'],

        [ModuleEnums.LOGIN]: ['b_login', 'loading'],

        [ModuleEnums.LOGIN_NOTICE]: [],

        [ModuleEnums.GENERAL]: ['b_general', 'generalHeadFrame', 'generalPos'],

        [ModuleEnums.GENERAL_GET]: ['EUI_GeneralGetCard'],

        [ModuleEnums.TEMPLE]: [],

        [ModuleEnums.FIEF]: [],

        [ModuleEnums.CHAT]: ['b_chat'],

        [ModuleEnums.DECISIVE]: [],

        [ModuleEnums.VIP]: ['b_vip'],

        [ModuleEnums.GEM]: [],

        [ModuleEnums.TAVERN]: ['b_tavern'],

        [ModuleEnums.MAIL]: ['b_mail'],

        [ModuleEnums.MILITARY_TASK]: [],

        [ModuleEnums.WORLD_MINI_MAP]: ['world_mini'],

        [ModuleEnums.BATTLE]: ['soldier', 'test', 'b_destroyWall', 'b_battle', "b_battle1", 'b_smallSkiillName', 'buff', 'img', 'battleFont', 'map_battle',
            'aoQiChongTian', 'aoQiChongTian_s', 'baoguEffect', 'baoguEffect_s', 'bingyuSkill', 'bingyuSkill_s', 'bingzhuchuanci_s', 'bingzhuSkill',
            'chuangmaoSkill', 'chuangmaoSkill_s', 'EBattle', 'EBattle_kaizhan', 'EUI_meihuo', 'EUI_shandian', 'EUI_shandian_s', 'EUI_tuxishi',
            'EUI_tuxishi_s', 'houJiaoZhenDong', 'houJiaoZhenDong_s', 'huifu', 'huifu_s', 'huoyunSkill', 'jianzhen', 'jianzhen_s', 'longdanPozhen',
            'longdanPozhen_s', 'longjuanfen_s', 'longjuanfeng', 'longXingEffect', 'longXingEffect_s', 'luojian', 'luojian_s', 'luoshi', 'moWang', 'moWang_s',
            'shandianqiu', 'shandianqiu_s', 'shandianqiuDanti', 'siWangMiWu', 'siWangMiWu_s', 'tianjianShouji', 'tianjianShouji_s', 'yanYueDao', 'yanYueDao_s'],

        [ModuleEnums.AKB]: ['bagua', 'EAkb', 'fireStone', 'shandian', 'tuozhuai', 'AutoBattleMap', 'b_playerTitle'],
        // [ModuleEnums.AKB]: ['AutoBattleMap'],

        [ModuleEnums.GUIDE_INDRO]: ['b_guideIntrodution'],

        [ModuleEnums.MAIN_CITY]: ['new_map_main', 'b_mainBuilding'],

        [ModuleEnums.WORLD_XIANGYANG_CITY]: ['b_xiangyang', 'b_xiangyangDetails'],

        [ModuleEnums.WORLD_CITY]: ['map_world', 'world_mini', 'b_world', 'worldPreLoad', 'b_worldBuildding'],

        [ModuleEnums.SELECT_COUNTRY]: ['b_selectCountry'],
        [ModuleEnums.ACTIVITY_NOTICE]: ['b_notice'],

        [ModuleEnums.OFFLINE_UI]: ['b_offlineUI'],

        [ModuleEnums.BOSS_UI]: ['b_boss'],

        [ModuleEnums.ARENA_UI]: ['b_arena'],

        [ModuleEnums.ARMS_UI]: ['b_arms'],

        [ModuleEnums.CORNUCOPIA_UI]: ['b_Cornucopia'],

        [ModuleEnums.COUNTRY_UI]: ['b_country', 'b_role'],

        [ModuleEnums.QUARTERS_UI]: ['b_head_quarters'],

        [ModuleEnums.PAY_SHOP_VIEW_UI]: ['b_pay'],

        [ModuleEnums.RANK]: ['b_rank'],

        [ModuleEnums.FREE_SHOP_UI]: ['b_rank', 'b_shop'],

        [ModuleEnums.TECHNOLOGY]: ['b_technology'],

        [ModuleEnums.LEGION_UI]: ['b_legion'],

        [ModuleEnums.BATTLE_MAP_INIT]: ['battleFont', 'commonFont', 'b_guide', 'b_battle', 'Bullet', 'map'],

        [ModuleEnums.KING_BATTLE]: ['b_kingBattle'],

        [ModuleEnums.ACTIVITY_UI]: ['b_activity'],

        [ModuleEnums.SEV_DAY_UI]: ['7day'],

        [ModuleEnums.ONE_YUAN_UI]: ['1yuan'],

        [ModuleEnums.FRIST_PAY_UI]: ['acti_first'],

        [ModuleEnums.ONLINE_UI]: ['acti_line'],

        [ModuleEnums.BUILDING_TIPS]: ['b_building'],

        [ModuleEnums.ROLE]: ['b_role'],

        [ModuleEnums.TREA_VIEW]: ['b_treasure'],

        [ModuleEnums.WELFARE_VIEW]: ['b_welfare'],

        [ModuleEnums.CAMP_VIEW]: ['camp', 'map_battle_3'],

        [ModuleEnums.EQUIP_VIEW]: ['equip'],

        [ModuleEnums.CORONA_VIEW]: ['coronation'],

        [ModuleEnums.LEVELUP_VIEW]: ['b_levelUp'],

        [ModuleEnums.RESULT_VIEW]: ['b_result', 'b_resultSiege'],

        [ModuleEnums.FATE_UI]: ['b_fate'],

        [ModuleEnums.WORSHIP_UI]: ['worship'],

        [ModuleEnums.TURNTABLE_UI]: ['turntable'],

        [ModuleEnums.HISTORY_BATTLE]: ['b_hirotry'],

        [ModuleEnums.NEW_GEN_UI]: ['newGenTitle', 'newGeneral'],

        [ModuleEnums.YU_SHOP_VIEW_UI]: ['b_payYu'],

        [ModuleEnums.SEVENII_UI]: ['sevenII'],

        [ModuleEnums.XIANGYANG_ADVANCE_VIEW]: ['b_xiangyangAdvance'],

        [ModuleEnums.XIANGYANG_DETAILS_VIEW]: ['b_xiangyangDetails'],

        [ModuleEnums.CITY_BUILD_BUFF]: ['b_cityBuff'],

        [ModuleEnums.SAND_TABLE_VIEW]: ['b_sandTable'],

        [ModuleEnums.CROSS_SERVER_UI]: ['b_cross'],

        [ModuleEnums.SERVICE_UI]: ['b_service'],

    }

    /**过滤不存在资源组 */
    private static initResGroup() {
        if (this.bInit) return;
        for (let key in this.resGroup) {
            let list = this.resGroup[key];
            for (let i = list.length - 1; i >= 0; i--) {
                let name = list[i];
                if (!RES['config'].config.groups[name]) list.splice(i, 1);
            }
        }

        if (RoleData.countryId) {
            this.bInit = true;

            let group = RES.createGroup('MAIN_MAP_PRELOAD', ["map_main_013_jpg", "map_main_012_jpg", "map_main_011_jpg", "map_main_010_jpg", "map_main_006_jpg", "map_main_005_jpg", "map_main_004_jpg", "map_main_003_jpg"], true);
            if (RoleData.countryId == CountryType.SHU) {
                let group = RES.createGroup('WORLD_MAP_PRELOAD', ["map_world_075_jpg", "map_world_074_jpg", "map_world_073_jpg", "map_world_072_jpg", "map_world_063_jpg", "map_world_062_jpg", "map_world_061_jpg", "map_world_060_jpg", "map_world_051_jpg", "map_world_050_jpg", "map_world_049_jpg", "map_world_048_jpg", "map_world_039_jpg", "map_world_038_jpg", "map_world_037_jpg", "map_world_036_jpg"], true);
            } else if (RoleData.countryId == CountryType.WEI) {
                let group = RES.createGroup('WORLD_MAP_PRELOAD', ["map_world_070_jpg", "map_world_069_jpg", "map_world_068_jpg", "map_world_067_jpg", "map_world_058_jpg", "map_world_057_jpg", "map_world_056_jpg", "map_world_055_jpg", "map_world_046_jpg", "map_world_045_jpg", "map_world_044_jpg", "map_world_043_jpg", "map_world_034_jpg", "map_world_033_jpg", "map_world_032_jpg", "map_world_031_jpg"], true);
            } else if (RoleData.countryId == CountryType.WU) {
                let group = RES.createGroup('WORLD_MAP_PRELOAD', ["map_world_152_jpg", "map_world_151_jpg", "map_world_150_jpg", "map_world_149_jpg", "map_world_140_jpg", "map_world_139_jpg", "map_world_138_jpg", "map_world_137_jpg", "map_world_128_jpg", "map_world_127_jpg", "map_world_126_jpg", "map_world_125_jpg"], true);
            }
            this.resGroup[SceneEnums.WORLD_CITY].push('WORLD_MAP_PRELOAD');
            this.resGroup[SceneEnums.MAIN_CITY].push('MAIN_MAP_PRELOAD');
        }
    }

    /**根据场景或模块类型 获取资源组 */
    public static getResGroup(type: SceneEnums | ModuleEnums): string[] {
        this.initResGroup();
        if (this.resGroup[type]) {
            return this.resGroup[type];
        }
        return [];
    }

    /**动态设置资源组 */
    public static setResGroup(type: SceneEnums | ModuleEnums, group: string[]) {
        this.resGroup[type] = group;
    }

    /**
     * 清理模块资源
     * 最后调用 避免龙骨动画没有执行destroy
     */
    public static setLaterClearRes(types: ModuleEnums[]) {
        if (!this.laterClears) this.laterClears = [];
        this.laterClears = this.laterClears.concat(types);
    }

    /**
     * 清理模块资源(延迟调用 场景切换使用)
     */
    public static async LaterClearModelRes() {
        if (!this.laterClears) return;
        await this.clearModelRes(this.laterClears);
        this.laterClears = null;
    }

    /**
     * 清理模块资源
     * 最后调用 避免龙骨动画没有执行destroy
     */
    public static async clearModelRes(types: ModuleEnums[]) {
        Loading.show();
        for (let i = 0; i < types.length; i++) {
            let type = types[i];
            let resList = this.getResGroup(type);
            for (let i of resList) {
                let group = RES.getGroupByName(i);
                for (let i = 0; i < group.length; i++) {
                    if (RES.getRes(group[i].name)) {
                        let isDestroy = RES.destroyRes(group[i].name);
                        if (isDestroy) {
                            debug("destroyRes " + group[i].name + " success!!")
                        } else {
                            debug("destroyRes " + group[i].name + " fail");
                        }
                    }
                }
                // DragonBonesManager.cleanDragonBones(res);
            }
        }
        Loading.hide();
    }

    /**
     * 清理组资源 排除eliminateList
     * gStr 组名
     * eliminateList 排除列表
     */
    public static clearGroup(gStr: string, eliminateList: string[]) {
        let group = RES.getGroupByName(gStr);
        for (let i = 0; i < group.length; i++) {
            if (RES.getRes(group[i].name)) {
                if (eliminateList.indexOf(group[i].name) == -1) {
                    let isDestroy = RES.destroyRes(group[i].name);
                    if (isDestroy) {
                        debug("destroyRes " + group[i].name + " success!!")
                    } else {
                        debug("destroyRes " + group[i].name + " fail");
                    }
                }

            }
        }
    }

    /**获取第一次进入游戏加载的资源 */
    public static getFirstRes() {
        let group = RES.createGroup('FIRST_ENTER_GAME_RES', ['icon_wj_b_10_png', 'icon_wj_b_16_png', 'icon_wj_b_28_png']);
        return this.getResGroup(ModuleEnums.FIRST_ENTER_GAME_RES).concat(['FIRST_ENTER_GAME_RES']);
    }

}
