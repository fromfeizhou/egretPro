var LegionPositon;
(function (LegionPositon) {
    /**盟主 */
    LegionPositon[LegionPositon["TUANZHANG"] = 1] = "TUANZHANG";
    /**副盟主 */
    LegionPositon[LegionPositon["FUTUANZHANG"] = 2] = "FUTUANZHANG";
    /**长老 */
    LegionPositon[LegionPositon["CHENGGUANG"] = 3] = "CHENGGUANG";
    /**精英 */
    LegionPositon[LegionPositon["LINSHIGONG"] = 4] = "LINSHIGONG";
    /**成员 */
    LegionPositon[LegionPositon["CHENGYUAN"] = 5] = "CHENGYUAN";
})(LegionPositon || (LegionPositon = {}));
//联盟消息类型
var GuildInformationType;
(function (GuildInformationType) {
    GuildInformationType[GuildInformationType["CREATE_GUILD"] = 1] = "CREATE_GUILD";
    GuildInformationType[GuildInformationType["JOIN_GUILD"] = 2] = "JOIN_GUILD";
    GuildInformationType[GuildInformationType["LEAVE_GUILD"] = 3] = "LEAVE_GUILD";
    GuildInformationType[GuildInformationType["KICK_OUT_FROM_GUILD"] = 4] = "KICK_OUT_FROM_GUILD";
    GuildInformationType[GuildInformationType["APPOINT_POSITION"] = 5] = "APPOINT_POSITION";
    GuildInformationType[GuildInformationType["CHANGE_GUILD_LEADER"] = 6] = "CHANGE_GUILD_LEADER";
    GuildInformationType[GuildInformationType["CHANGE_NAME"] = 7] = "CHANGE_NAME";
    GuildInformationType[GuildInformationType["APPLY_GUILD_LEADER"] = 8] = "APPLY_GUILD_LEADER";
})(GuildInformationType || (GuildInformationType = {}));
/** 联盟联盟 */
var LegionModel = /** @class */ (function () {
    function LegionModel() {
    }
    /***/
    /***/
    LegionModel.init = function () {
        this.parseTechCfg();
        this.memberInfos = Dictionary.create();
    };
    /** */
    LegionModel.clear = function () {
    };
    // public static getLegionList(){
    //     return this.m_pList;
    // }
    LegionModel.setGuildInfo = function (info) {
        this.guildInfo = info;
        this.donateResourceCount = this.guildInfo.donateResourceCount;
        this.parsePlayerInfo();
        /**联盟信息修改 抛事件 */
        com_main.EventMgr.dispatchEvent(LegionEvent.LEGION_INFO_CHANGE, null);
    };
    /**设置工会列表 */
    LegionModel.setGuildList = function (info) {
        this.guildList = info;
    };
    LegionModel.getGuildList = function () {
        return this.guildList.guildData;
    };
    /**解散公会 */
    LegionModel.dissolve = function () {
        this.guildInfo = null;
        this.donateResourceCount = 0;
        this.teachInfos = null;
        this.playerInfo = null;
        this.currGuideInfo = null;
        /**联盟信息修改 抛事件 */
        com_main.EventMgr.dispatchEvent(LegionEvent.LEGION_INFO_CHANGE, null);
    };
    /**解析个人联盟信息 */
    LegionModel.parsePlayerInfo = function () {
        this.memberInfos.clear();
        for (var i = 0; i < this.guildInfo.guildMemberInfo.length; i++) {
            var info = this.guildInfo.guildMemberInfo[i];
            if (info.playerId == RoleData.playerId) {
                this.playerInfo = info;
            }
            this.memberInfos.add(info.playerId, info);
        }
    };
    /**
     * 解析科技数据
     * 按类型存储 技能升级 服务器推送新的技能id 替换旧的
     * */
    LegionModel.parseTeach = function (list) {
        this.teachInfos = {};
        for (var i = 0; i < list.length; i++) {
            var data = list[i];
            var teachVo = LegionTeachVo.create(data);
            this.teachInfos[data.type] = teachVo;
        }
    };
    /**根据类型获得科技信息 */
    LegionModel.getTeachVoByType = function (type) {
        return this.teachInfos[type];
    };
    /**更新科技信息 */
    LegionModel.updateTeach = function (data) {
        if (this.teachInfos[data.type]) {
            this.teachInfos[data.type].update(data);
        }
    };
    /**更新捐献次数 */
    LegionModel.updateResourceNum = function (num) {
        this.donateResourceCount = num;
    };
    /**更新联盟 */
    LegionModel.updateMenber = function (data) {
    };
    LegionModel.getGuildInfo = function () {
        return this.guildInfo;
    };
    /** 记录点击的联盟信息*/
    LegionModel.getClickGuildInfo = function (param) {
        this.currGuideInfo = param;
    };
    /**
     * 获取工会唯一ID
     */
    LegionModel.getGuildId = function () {
        if (this.guildInfo)
            return this.guildInfo.id;
        else {
            return 0;
        }
    };
    /**
     * 获取工会唯一name
     */
    LegionModel.getGuildName = function (isReturnEmypt) {
        if (isReturnEmypt === void 0) { isReturnEmypt = false; }
        if (this.guildInfo)
            return this.guildInfo.name;
        else {
            if (isReturnEmypt) {
                return '';
            }
            else {
                return GCode(CLEnum.NONE);
            }
        }
    };
    /**玩家职位 */
    LegionModel.getPlayerPos = function () {
        if (this.playerInfo)
            return this.playerInfo.position;
        return 0;
    };
    /**玩家职位描述 */
    LegionModel.getPlayerPosDes = function () {
        var pos = this.getPlayerPos();
        return this.getPosTitle(pos);
    };
    /**获得职位名字 */
    LegionModel.getPosTitle = function (pos) {
        switch (pos) {
            case LegionPositon.TUANZHANG:
                return GCode(CLEnum.GUILD_POS_MZ);
            case LegionPositon.FUTUANZHANG:
                return GCode(CLEnum.GUILD_POS_FMZ);
            case LegionPositon.CHENGGUANG:
                return GCode(CLEnum.GUILD_POS_HX);
            case LegionPositon.LINSHIGONG:
                return GCode(CLEnum.GUILD_POS_JY);
            case LegionPositon.CHENGYUAN:
                return GCode(CLEnum.GUILD_POS_CY);
        }
        return GCode(CLEnum.GUILD_POS_CY);
    };
    /**
     * 获取联盟描述
     */
    LegionModel.getGuildDescription = function () {
        if (this.guildInfo)
            return this.guildInfo.declaration;
        else
            return '';
    };
    /**国家联盟图片 */
    LegionModel.getLegionCountryImage = function (countryId) {
        if (countryId < 1 || countryId > 3)
            countryId = 1;
        return 'tb_jt_' + countryId + '_png';
    };
    //获取商店配置
    LegionModel.setLegionShopInfo = function (info) {
        this.shopInfo = info;
    };
    //获取商店配置
    LegionModel.getLegionShopInfo = function () {
        return this.shopInfo;
    };
    //捐献次数
    LegionModel.getdonateResourceCount = function () {
        return this.donateResourceCount;
    };
    //商店补货
    LegionModel.getLegionReplenInfo = function () {
        return this.shopReplenInfo;
    };
    //keji
    LegionModel.getTechInfo = function () {
        return this.teachInfos;
    };
    //大殿限制等级
    LegionModel.setbuildLevelAndFree = function (lv, joinStatus) {
        this.guildInfo.buildingLevel = lv;
        this.guildInfo.joinStatus = joinStatus;
    };
    LegionModel.getbuildLevelAndFree = function () {
        return [this.guildInfo.buildingLevel, this.guildInfo.joinStatus];
    };
    /**
     * 获取道具数量
     * itemId 道具id
     *  */
    // public static getPropNum(itemId: number): number {
    //     let info = this.m_pList[itemId];
    //     if (info) {
    //         return info.count;
    //     }
    //     return 0;
    // }
    /**
     * 添加道具
     * itemId 道具id
     * content 道具内容
     *  itemId
     *  count
     *  */
    // public static addLegionItem(content: any) {
    //     let id = content.id;
    //     if (this.m_pList[id]) {
    //         error('背包位置重复了！！！请联系服务端 id:', id);
    //     }
    //     content.count = content.count;
    //     this.m_pList[id] = content;
    // }
    LegionModel.addShopInventoryItem = function (content) {
        var id = content.itemId;
        if (this.shopInfo[id]) {
            error('背包位置重复了！！！请联系服务端 id:', id);
        }
        content.count = content.count;
        this.shopInfo[id] = content;
    };
    LegionModel.changeShopInventoryItem = function (content) {
        var itemId = content.itemId;
        var _content = this.shopInfo[itemId];
        if (_content) {
            //zb
            // let count = (<Long>content.count).toNumber();
            var count = content.count;
            _content.count += count; //content.count;
            if (_content.count < 0) {
                error('改变道具数量错误！剩余：', _content.count);
            }
        }
    };
    /**
     * 改变道具
     * position 背包位置id
     * content 道具内容
     *  itemId
     *  count（增加或者减少的数量）
     *  */
    // public static changeProp(content: any) {
    //     let itemId = content.itemId;
    //     let _content = this.m_pList[itemId];
    //     if (_content) {
    //         //zb
    //         // let count = (<Long>content.count).toNumber();
    //         let count = content.count;
    //         _content.count += count; //content.count;
    //         if (_content.count < 0) {
    //             error('改变道具数量错误！剩余：', _content.count);
    //         }
    //     }
    // }
    /**
     * 移除道具
     */
    // public static removeProp(itemId: number) {
    //     delete this.m_pList[itemId];
    // }
    /**
     * 清理道具列表
     */
    // public static clear() {
    //     delete this.m_pList;
    //     this.m_pList = null;
    //     this.m_pList = {};
    // }
    /**
     * 清理道具列表
     */
    // public static destroy() {
    //     delete this.m_pList;
    //     this.m_pList = null;
    //     this.m_pList = {};
    //     delete this.guildInfo;
    //     this.guildInfo = null;
    // }
    /**
     * 是否达到配置表上限
     */
    // public static isCfgMaxCount(itemId: number) {
    //     let cfg = C.ItemConfig[itemId];
    //     if (cfg && cfg.upperLimit) {
    //         let upperLimit = cfg.upperLimit;
    //         // 0表示uint32能表示的上限，这里不做限制
    //         if (upperLimit == 0) {
    //             return true;
    //         }
    //         let _content = this.m_pList[itemId];
    //         if (_content) {
    //             return _content.count >= upperLimit;
    //         } else {
    //             return false;
    //         }
    //     }
    //     return true;
    // }
    LegionModel.getCfg = function (itemId) {
        var data = C.ItemConfig[itemId];
        return data;
    };
    LegionModel.getItemDesc = function (itemId) {
        var data = this.getCfg(itemId);
        var desc = GLan(data.name);
        return desc;
    };
    //商店补货维护
    LegionModel.initReplenShopList = function () {
        var itemCfg = C.ItemConfig;
        var GuildShopConfig = C.GuildShopConfig;
        this.shopReplenInfo = {};
        for (var key in GuildShopConfig) {
            var cfg = GuildShopConfig[key];
            if (cfg) {
                var name_1 = GLan(itemCfg[cfg.itemId].name);
                var icon = PropModel.getPropIcon(cfg.itemId);
                //let fund = JSON.parse(cfg.fund);
                this.shopReplenInfo[cfg.itemId] = { itemId: cfg.itemId, id: cfg.id, name: name_1, icon: icon, coin: cfg.fund, inventory0: 0, inventory: "" };
            }
        }
    };
    LegionModel.updateReplenShop = function (itemId, count) {
        this.shopReplenInfo[itemId].inventory0 = count;
    };
    LegionModel.addReplenShop = function (itemId, count) {
        this.shopReplenInfo[itemId].inventory0 += count;
    };
    //获取个人积分
    LegionModel.getMyScore = function () {
        for (var i = 0; i < this.guildInfo.guildMemberInfo.length; i++) {
            var info = this.guildInfo.guildMemberInfo[i];
            if (info.name == RoleData.nickName) {
                return info.donate;
            }
        }
    };
    LegionModel.updateMyscore = function (score) {
        for (var i = 0; i < this.guildInfo.guildMemberInfo.length; i++) {
            var info = this.guildInfo.guildMemberInfo[i];
            if (info.name == RoleData.nickName) {
                info.donate = score;
                break;
            }
        }
    };
    LegionModel.getFund = function () {
        return this.guildInfo.fund;
    };
    /**获得捐献次数 */
    LegionModel.getDonaMaxNum = function () {
        return 20;
    };
    //=============================================================================================================================================
    //配置表
    //============================================================================================================================================= 
    /**联盟职位名称 */
    LegionModel.getPosName = function (type) {
        switch (type) {
            case LegionPositon.TUANZHANG:
                return GCode(CLEnum.GUILD_POS_MZ);
            case LegionPositon.FUTUANZHANG:
                return GCode(CLEnum.GUILD_POS_FMZ);
            case LegionPositon.CHENGGUANG:
                return GCode(CLEnum.GUILD_POS_HX);
            case LegionPositon.LINSHIGONG:
                return GCode(CLEnum.GUILD_POS_JY);
            case LegionPositon.CHENGYUAN:
                return GCode(CLEnum.GUILD_POS_CY);
        }
        return GCode(CLEnum.GUILD_POS_CY);
    };
    /**联盟职位名称 */
    LegionModel.getPosNameById = function (playerId) {
        var legionPos = 0;
        var info = this.memberInfos.get(playerId);
        if (info)
            legionPos = info.position;
        return this.getPosName(legionPos);
    };
    /**得到盟主的信息 */
    LegionModel.getLeaderInfo = function () {
        if (this.guildInfo == null)
            return;
        for (var i = 0; i < this.guildInfo.guildMemberInfo.length; i++) {
            var info = this.guildInfo.guildMemberInfo[i];
            if (info.position == LegionPositon.TUANZHANG) {
                return info;
            }
        }
    };
    /**技能配置表 */
    LegionModel.parseTechCfg = function () {
        this.techCfgDic = {};
        for (var key in C.GuildTechnologyConfig) {
            var data = C.GuildTechnologyConfig[key];
            if (unNull(data)) {
                this.techCfgDic[data.techID] = data;
            }
        }
    };
    /**获得技能配置 */
    LegionModel.getTechCfgById = function (id) {
        return this.techCfgDic[id] || this.techCfgDic[1000];
    };
    /**联盟科技最高等级 */
    LegionModel.TECH_LEVEL_MAX = 20;
    LegionModel.guildInfo = null; //联盟信息
    LegionModel.shopReplenInfo = null; //商店补货info
    LegionModel.teachInfos = null; //科技
    LegionModel.m_messInfoTotalPage = 0; //联盟信息页数
    LegionModel.guildList = null; //联盟列表
    return LegionModel;
}());
