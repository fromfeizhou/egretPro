var MapData = /** @class */ (function () {
    function MapData() {
    }
    /**获取世界地图配置 */
    MapData.getMapWorldConfig = function () {
        return this.m_pMapWorldConfig;
    };
    /**获取襄阳战地图配置 */
    MapData.getMapXiangyangConfig = function () {
        return this.m_pMapXiangConfig;
    };
    /**获取新手地图配置 */
    MapData.getMapNoviceConfig = function () {
        return this.m_pMapNoviceConfig;
    };
    /**获取主城地图配置 */
    MapData.getMapMainConfig = function () {
        return this.m_pMapMainConfig;
    };
    /**获取战场地图网格配置 */
    MapData.getTileMapConfig = function (mapid) {
        var terrain = 0;
        var mconfig = MapData.getBattleMapConfig(mapid);
        if (mconfig)
            terrain = mconfig.terrain;
        var tconfig = this.m_pMapBattleConfig[terrain];
        if (!tconfig) {
            error("MapData:getMapBattleConfig--->> 战场地图网格配置空的 mapid:", mapid);
        }
        return tconfig;
    };
    /**获取战斗地图配置 */
    MapData.getBattleMapConfig = function (mapid) {
        var data = C.TerrainConfig[mapid];
        if (!data) {
            error("MapData:getMapConfig--->> 战斗地图配置表数据空的 mapid:", mapid);
        }
        debug("MapData:getMapConfig--->> mapid:", mapid, data);
        return data;
    };
    /**世界地图 图块 配置 */
    MapData.m_pMapWorldConfig = {
        'map_name': 'map_world_',
        'suffix': '_jpg',
        'row': 13,
        'col': 12,
        'w': 500,
        'h': 308,
        'num': 3,
    };
    /**襄阳战地图 */
    MapData.m_pMapXiangConfig = {
        'map_name': 'map_xiangyang_',
        'suffix': '_jpg',
        'row': 1,
        'col': 1,
        'w': 2115,
        'h': 1438,
    };
    /**新手地图 图块 配置 */
    MapData.m_pMapNoviceConfig = {
        'map_name': 'map_world_',
        'suffix': '_jpg',
        'row': 4,
        'col': 4,
        'w': 300,
        'h': 500,
        'num': 3,
    };
    // /**主城地图 图块 配置 */
    // private static m_pMapMainConfig = {
    //     'map_name': 'map_main_',//图块名称前缀
    //     'suffix': '_png',//图块名称后缀
    //     'row': 5,//横切
    //     'col': 10,//竖切
    //     'w': 292,//图块宽度
    //     'h': 452,//图块高度
    //     'num': 3,//填充多少个0
    // };
    /**主城地图 图块 配置 */
    MapData.m_pMapMainConfig = {
        'map_name': 'map_main_',
        'suffix': '_jpg',
        'row': 5,
        'col': 7,
        'w': 490,
        'h': 458,
        'num': 3,
    };
    MapData.m_pMapBattleConfig = {
        0: {
            'map_name': 'map_battle_5_',
            'suffix': '_jpg',
            'row': 6,
            'col': 12,
            'w': 331,
            'h': 342,
            'num': 3,
        },
        1: {
            'map_name': 'map_battle_1_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,
        },
        2: {
            'map_name': 'map_battle_2_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,
        },
        3: {
            'map_name': 'map_battle_3_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,
        },
        4: {
            'map_name': 'map_battle_4_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,
        },
        5: {
            'map_name': 'map_battle_5_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,
        },
        6: {
            'map_name': 'map_battle_6_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2375,
            'h': 1274,
            'num': 3,
        },
        7: {
            'map_name': 'map_battle_7_',
            'suffix': '_jpg',
            'row': 6,
            'col': 12,
            'w': 331,
            'h': 342,
            'num': 3,
        },
        8: {
            'map_name': 'map_battle_8_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,
        },
        9: {
            'map_name': 'map_battle_9_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,
        },
        10: {
            'map_name': 'map_battle_10_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,
        },
        11: {
            'map_name': 'map_battle_11_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2375,
            'h': 1274,
            'num': 3,
        },
    };
    return MapData;
}());
