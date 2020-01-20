class MapData {
    /**世界地图 图块 配置 */
    private static m_pMapWorldConfig = {//assets/map/map_world/
        'map_name': 'map_world_',//图块名称前缀
        'suffix': '_jpg',//图块名称后缀
        'row': 13,//横切
        'col': 12,//竖切
        'w': 500,//图块宽度
        'h': 308,//图块高度
        'num': 3,//填充多少个0
    };
    /**襄阳战地图 */
    private static m_pMapXiangConfig = {
        'map_name': 'map_xiangyang_',//图块名称前缀
        'suffix': '_jpg',//图块名称后缀
        'row': 1,//横切
        'col': 1,//竖切
        'w': 2115,//图块宽度
        'h': 1438,//图块高
    };
    /**新手地图 图块 配置 */
    private static m_pMapNoviceConfig = {
        'map_name': 'map_world_',//图块名称前缀
        'suffix': '_jpg',//图块名称后缀
        'row': 4,//横切
        'col': 4,//竖切
        'w': 300,//图块宽度
        'h': 500,//图块高度
        'num': 3,//填充多少个0
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
    private static m_pMapMainConfig = {
        'map_name': 'map_main_',//图块名称前缀
        'suffix': '_jpg',//图块名称后缀
        'row': 5,//横切
        'col': 7,//竖切
        'w': 490,//图块宽度
        'h': 458,//图块高度
        'num': 3,//填充多少个0
    };

    private static m_pMapBattleConfig = {//assets/map/map_battle/
        0: {//默认战斗地图
            'map_name': 'map_battle_5_',
            'suffix': '_jpg',
            'row': 6,
            'col': 12,
            'w': 331,
            'h': 342,
            'num': 3,//填充多少个0
        },

        1: {//默认战斗地图
            'map_name': 'map_battle_1_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,//填充多少个0
        },
        2: {//
            'map_name': 'map_battle_2_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,//填充多少个0
        },
        3: {
            'map_name': 'map_battle_3_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,//填充多少个0
        },
        4: {//默认战斗地图
            'map_name': 'map_battle_4_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,//填充多少个0
        },
        5: {//PVP战场地图
            'map_name': 'map_battle_5_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,//填充多少个0
        },
        6: {
            'map_name': 'map_battle_6_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2375,
            'h': 1274,
            'num': 3,//填充多少个0
        },
        7: {
            'map_name': 'map_battle_7_',
            'suffix': '_jpg',
            'row': 6,
            'col': 12,
            'w': 331,
            'h': 342,
            'num': 3,//填充多少个0
        },
        8: {
            'map_name': 'map_battle_8_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,//填充多少个0
        },
        9: {
            'map_name': 'map_battle_9_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,//填充多少个0
        },
        10: {//雪地战场地图
            'map_name': 'map_battle_10_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2409,
            'h': 1109,
            'num': 3,//填充多少个0
        },
        11: {//攻城战地图2
            'map_name': 'map_battle_11_',
            'suffix': '_jpg',
            'row': 1,
            'col': 1,
            'w': 2375,
            'h': 1274,
            'num': 3,//填充多少个0
        },
    };

    /**获取世界地图配置 */
    public static getMapWorldConfig() {
        return this.m_pMapWorldConfig;
    }
    /**获取襄阳战地图配置 */
    public static getMapXiangyangConfig() {
        return this.m_pMapXiangConfig;
    }
    /**获取新手地图配置 */
    public static getMapNoviceConfig() {
        return this.m_pMapNoviceConfig;
    }

    /**获取主城地图配置 */
    public static getMapMainConfig() {
        return this.m_pMapMainConfig;
    }

    /**获取战场地图网格配置 */
    public static getTileMapConfig(mapid: number) {
        let terrain = 0;
        let mconfig = MapData.getBattleMapConfig(mapid);
        if (mconfig) terrain = mconfig.terrain;
        let tconfig = this.m_pMapBattleConfig[terrain];
        if (!tconfig) {
            error("MapData:getMapBattleConfig--->> 战场地图网格配置空的 mapid:", mapid);
        }
        return tconfig;
    }

    /**获取战斗地图配置 */
    public static getBattleMapConfig(mapid: number) {
        let data = C.TerrainConfig[mapid];
        if (!data) {
            error("MapData:getMapConfig--->> 战斗地图配置表数据空的 mapid:", mapid);
        }
        debug("MapData:getMapConfig--->> mapid:", mapid, data);
        return data;
    }
}
