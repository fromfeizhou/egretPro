var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
/**预加载资源组 */
var SceneResGroupCfg = /** @class */ (function () {
    function SceneResGroupCfg() {
    }
    /**过滤不存在资源组 */
    SceneResGroupCfg.initResGroup = function () {
        if (this.bInit)
            return;
        for (var key in this.resGroup) {
            var list = this.resGroup[key];
            for (var i = list.length - 1; i >= 0; i--) {
                var name_1 = list[i];
                if (!RES['config'].config.groups[name_1])
                    list.splice(i, 1);
            }
        }
        if (RoleData.countryId) {
            this.bInit = true;
            var group = RES.createGroup('MAIN_MAP_PRELOAD', ["map_main_013_jpg", "map_main_012_jpg", "map_main_011_jpg", "map_main_010_jpg", "map_main_006_jpg", "map_main_005_jpg", "map_main_004_jpg", "map_main_003_jpg"], true);
            if (RoleData.countryId == CountryType.SHU) {
                var group_1 = RES.createGroup('WORLD_MAP_PRELOAD', ["map_world_075_jpg", "map_world_074_jpg", "map_world_073_jpg", "map_world_072_jpg", "map_world_063_jpg", "map_world_062_jpg", "map_world_061_jpg", "map_world_060_jpg", "map_world_051_jpg", "map_world_050_jpg", "map_world_049_jpg", "map_world_048_jpg", "map_world_039_jpg", "map_world_038_jpg", "map_world_037_jpg", "map_world_036_jpg"], true);
            }
            else if (RoleData.countryId == CountryType.WEI) {
                var group_2 = RES.createGroup('WORLD_MAP_PRELOAD', ["map_world_070_jpg", "map_world_069_jpg", "map_world_068_jpg", "map_world_067_jpg", "map_world_058_jpg", "map_world_057_jpg", "map_world_056_jpg", "map_world_055_jpg", "map_world_046_jpg", "map_world_045_jpg", "map_world_044_jpg", "map_world_043_jpg", "map_world_034_jpg", "map_world_033_jpg", "map_world_032_jpg", "map_world_031_jpg"], true);
            }
            else if (RoleData.countryId == CountryType.WU) {
                var group_3 = RES.createGroup('WORLD_MAP_PRELOAD', ["map_world_152_jpg", "map_world_151_jpg", "map_world_150_jpg", "map_world_149_jpg", "map_world_140_jpg", "map_world_139_jpg", "map_world_138_jpg", "map_world_137_jpg", "map_world_128_jpg", "map_world_127_jpg", "map_world_126_jpg", "map_world_125_jpg"], true);
            }
            this.resGroup[SceneEnums.WORLD_CITY].push('WORLD_MAP_PRELOAD');
            this.resGroup[SceneEnums.MAIN_CITY].push('MAIN_MAP_PRELOAD');
        }
    };
    /**根据场景或模块类型 获取资源组 */
    SceneResGroupCfg.getResGroup = function (type) {
        this.initResGroup();
        if (this.resGroup[type]) {
            return this.resGroup[type];
        }
        return [];
    };
    /**动态设置资源组 */
    SceneResGroupCfg.setResGroup = function (type, group) {
        this.resGroup[type] = group;
    };
    /**
     * 清理模块资源
     * 最后调用 避免龙骨动画没有执行destroy
     */
    SceneResGroupCfg.setLaterClearRes = function (types) {
        if (!this.laterClears)
            this.laterClears = [];
        this.laterClears = this.laterClears.concat(types);
    };
    /**
     * 清理模块资源(延迟调用 场景切换使用)
     */
    SceneResGroupCfg.LaterClearModelRes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.laterClears)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.clearModelRes(this.laterClears)];
                    case 1:
                        _a.sent();
                        this.laterClears = null;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 清理模块资源
     * 最后调用 避免龙骨动画没有执行destroy
     */
    SceneResGroupCfg.clearModelRes = function (types) {
        return __awaiter(this, void 0, void 0, function () {
            var i, type, resList, _i, resList_1, i_1, group, i_2, isDestroy;
            return __generator(this, function (_a) {
                Loading.show();
                for (i = 0; i < types.length; i++) {
                    type = types[i];
                    resList = this.getResGroup(type);
                    for (_i = 0, resList_1 = resList; _i < resList_1.length; _i++) {
                        i_1 = resList_1[_i];
                        group = RES.getGroupByName(i_1);
                        for (i_2 = 0; i_2 < group.length; i_2++) {
                            if (RES.getRes(group[i_2].name)) {
                                isDestroy = RES.destroyRes(group[i_2].name);
                                if (isDestroy) {
                                    debug("destroyRes " + group[i_2].name + " success!!");
                                }
                                else {
                                    debug("destroyRes " + group[i_2].name + " fail");
                                }
                            }
                        }
                        // DragonBonesManager.cleanDragonBones(res);
                    }
                }
                Loading.hide();
                return [2 /*return*/];
            });
        });
    };
    /**
     * 清理组资源 排除eliminateList
     * gStr 组名
     * eliminateList 排除列表
     */
    SceneResGroupCfg.clearGroup = function (gStr, eliminateList) {
        var group = RES.getGroupByName(gStr);
        for (var i = 0; i < group.length; i++) {
            if (RES.getRes(group[i].name)) {
                if (eliminateList.indexOf(group[i].name) == -1) {
                    var isDestroy = RES.destroyRes(group[i].name);
                    if (isDestroy) {
                        debug("destroyRes " + group[i].name + " success!!");
                    }
                    else {
                        debug("destroyRes " + group[i].name + " fail");
                    }
                }
            }
        }
    };
    /**获取第一次进入游戏加载的资源 */
    SceneResGroupCfg.getFirstRes = function () {
        var group = RES.createGroup('FIRST_ENTER_GAME_RES', ['icon_wj_b_10_png', 'icon_wj_b_16_png', 'icon_wj_b_28_png']);
        return this.getResGroup(ModuleEnums.FIRST_ENTER_GAME_RES).concat(['FIRST_ENTER_GAME_RES']);
    };
    /**预定义 */
    SceneResGroupCfg.resGroup = (_a = {},
        _a[SceneEnums.NONE_MAP] = [],
        _a[SceneEnums.MAIN_CITY] = ['font', 'b_guide', 'a_common', 'b_cityicon', 'b_mainBuilding', 'map', 'b_emoji'],
        _a[SceneEnums.WORLD_CITY] = ['font', 'b_guide', 'a_common', 'b_cityicon', 'config', 'b_worldBuildding', 'map', 'worldPreLoad', 'b_emoji'],
        _a[SceneEnums.WORLD_XIANGYANG_CITY] = ['font', 'b_guide', 'a_common', 'b_cityicon', 'config', 'b_xiangyang', 'map', 'worldPreLoad', 'b_emoji'],
        _a[SceneEnums.BATTLE_MAP] = ['battleFont', 'commonFont', 'b_guide', 'b_battle', 'Bullet', 'map'],
        _a[SceneEnums.NOVICE_MAP] = ['build', 'map', 'a_background', 'otherbuild'],
        _a[SceneEnums.AUTO_BATTLE_MAP] = ['font', 'commonFont', 'b_guide', 'mapThum', 'a_common', 'b_cityicon', 'a_background', 'hang', 'EUI_MissionTips', 'b_emoji'],
        _a[SceneEnums.TEST_MAP] = ['a_background', 'a_button', 'a_label', 'a_process', 'font', 'b_battle', 'Bullet', 'map', 'battleFont'],
        _a[SceneEnums.WAIT_BATTLE_MAP] = ['b_guide', 'b_battle', 'map'],
        _a[ModuleEnums.FIRST_ENTER_GAME_RES] = ['b_guide', 'b_notice', 'b_selectCountry', 'img', 'map_battle_6'],
        /**模块 */
        _a[ModuleEnums.FLAGMENT_RES] = ['prop', 'b_role', 'b_icon_skill', 'b_icon_trea', 'b_icon_trea_b', 'b_icon_wj', 'b_icon_wj_b'],
        _a[ModuleEnums.LOGIN] = ['b_login', 'loading'],
        _a[ModuleEnums.LOGIN_NOTICE] = [],
        _a[ModuleEnums.GENERAL] = ['b_general', 'generalHeadFrame', 'generalPos'],
        _a[ModuleEnums.GENERAL_GET] = ['EUI_GeneralGetCard'],
        _a[ModuleEnums.TEMPLE] = [],
        _a[ModuleEnums.FIEF] = [],
        _a[ModuleEnums.CHAT] = ['b_chat'],
        _a[ModuleEnums.DECISIVE] = [],
        _a[ModuleEnums.VIP] = ['b_vip'],
        _a[ModuleEnums.GEM] = [],
        _a[ModuleEnums.TAVERN] = ['b_tavern'],
        _a[ModuleEnums.MAIL] = ['b_mail'],
        _a[ModuleEnums.MILITARY_TASK] = [],
        _a[ModuleEnums.WORLD_MINI_MAP] = ['world_mini'],
        _a[ModuleEnums.BATTLE] = ['soldier', 'test', 'b_destroyWall', 'b_battle', "b_battle1", 'b_smallSkiillName', 'buff', 'img', 'battleFont', 'map_battle',
            'aoQiChongTian', 'aoQiChongTian_s', 'baoguEffect', 'baoguEffect_s', 'bingyuSkill', 'bingyuSkill_s', 'bingzhuchuanci_s', 'bingzhuSkill',
            'chuangmaoSkill', 'chuangmaoSkill_s', 'EBattle', 'EBattle_kaizhan', 'EUI_meihuo', 'EUI_shandian', 'EUI_shandian_s', 'EUI_tuxishi',
            'EUI_tuxishi_s', 'houJiaoZhenDong', 'houJiaoZhenDong_s', 'huifu', 'huifu_s', 'huoyunSkill', 'jianzhen', 'jianzhen_s', 'longdanPozhen',
            'longdanPozhen_s', 'longjuanfen_s', 'longjuanfeng', 'longXingEffect', 'longXingEffect_s', 'luojian', 'luojian_s', 'luoshi', 'moWang', 'moWang_s',
            'shandianqiu', 'shandianqiu_s', 'shandianqiuDanti', 'siWangMiWu', 'siWangMiWu_s', 'tianjianShouji', 'tianjianShouji_s', 'yanYueDao', 'yanYueDao_s'],
        _a[ModuleEnums.AKB] = ['bagua', 'EAkb', 'fireStone', 'shandian', 'tuozhuai', 'AutoBattleMap', 'b_playerTitle'],
        // [ModuleEnums.AKB]: ['AutoBattleMap'],
        _a[ModuleEnums.GUIDE_INDRO] = ['b_guideIntrodution'],
        _a[ModuleEnums.MAIN_CITY] = ['new_map_main', 'b_mainBuilding'],
        _a[ModuleEnums.WORLD_XIANGYANG_CITY] = ['b_xiangyang', 'b_xiangyangDetails'],
        _a[ModuleEnums.WORLD_CITY] = ['map_world', 'world_mini', 'b_world', 'worldPreLoad', 'b_worldBuildding'],
        _a[ModuleEnums.SELECT_COUNTRY] = ['b_selectCountry'],
        _a[ModuleEnums.ACTIVITY_NOTICE] = ['b_notice'],
        _a[ModuleEnums.OFFLINE_UI] = ['b_offlineUI'],
        _a[ModuleEnums.BOSS_UI] = ['b_boss'],
        _a[ModuleEnums.ARENA_UI] = ['b_arena'],
        _a[ModuleEnums.ARMS_UI] = ['b_arms'],
        _a[ModuleEnums.CORNUCOPIA_UI] = ['b_Cornucopia'],
        _a[ModuleEnums.COUNTRY_UI] = ['b_country', 'b_role'],
        _a[ModuleEnums.QUARTERS_UI] = ['b_head_quarters'],
        _a[ModuleEnums.PAY_SHOP_VIEW_UI] = ['b_pay'],
        _a[ModuleEnums.RANK] = ['b_rank'],
        _a[ModuleEnums.FREE_SHOP_UI] = ['b_rank', 'b_shop'],
        _a[ModuleEnums.TECHNOLOGY] = ['b_technology'],
        _a[ModuleEnums.LEGION_UI] = ['b_legion'],
        _a[ModuleEnums.BATTLE_MAP_INIT] = ['battleFont', 'commonFont', 'b_guide', 'b_battle', 'Bullet', 'map'],
        _a[ModuleEnums.KING_BATTLE] = ['b_kingBattle'],
        _a[ModuleEnums.ACTIVITY_UI] = ['b_activity'],
        _a[ModuleEnums.SEV_DAY_UI] = ['7day'],
        _a[ModuleEnums.ONE_YUAN_UI] = ['1yuan'],
        _a[ModuleEnums.FRIST_PAY_UI] = ['acti_first'],
        _a[ModuleEnums.ONLINE_UI] = ['acti_line'],
        _a[ModuleEnums.BUILDING_TIPS] = ['b_building'],
        _a[ModuleEnums.ROLE] = ['b_role'],
        _a[ModuleEnums.TREA_VIEW] = ['b_treasure'],
        _a[ModuleEnums.WELFARE_VIEW] = ['b_welfare'],
        _a[ModuleEnums.CAMP_VIEW] = ['camp', 'map_battle_3'],
        _a[ModuleEnums.EQUIP_VIEW] = ['equip'],
        _a[ModuleEnums.CORONA_VIEW] = ['coronation'],
        _a[ModuleEnums.LEVELUP_VIEW] = ['b_levelUp'],
        _a[ModuleEnums.RESULT_VIEW] = ['b_result', 'b_resultSiege'],
        _a[ModuleEnums.FATE_UI] = ['b_fate'],
        _a[ModuleEnums.WORSHIP_UI] = ['worship'],
        _a[ModuleEnums.TURNTABLE_UI] = ['turntable'],
        _a[ModuleEnums.HISTORY_BATTLE] = ['b_hirotry'],
        _a[ModuleEnums.NEW_GEN_UI] = ['newGenTitle', 'newGeneral'],
        _a[ModuleEnums.YU_SHOP_VIEW_UI] = ['b_payYu'],
        _a[ModuleEnums.SEVENII_UI] = ['sevenII'],
        _a[ModuleEnums.XIANGYANG_ADVANCE_VIEW] = ['b_xiangyangAdvance'],
        _a[ModuleEnums.XIANGYANG_DETAILS_VIEW] = ['b_xiangyangDetails'],
        _a[ModuleEnums.CITY_BUILD_BUFF] = ['b_cityBuff'],
        _a[ModuleEnums.SAND_TABLE_VIEW] = ['b_sandTable'],
        _a[ModuleEnums.CROSS_SERVER_UI] = ['b_cross'],
        _a[ModuleEnums.SERVICE_UI] = ['b_service'],
        _a);
    return SceneResGroupCfg;
}());
