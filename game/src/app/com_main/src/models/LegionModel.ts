enum LegionPositon {
    /**盟主 */
    TUANZHANG = 1, //盟主
    /**副盟主 */
    FUTUANZHANG = 2,//副盟主
    /**长老 */
    CHENGGUANG = 3,//核心
    /**精英 */
    LINSHIGONG = 4,//精英
    /**成员 */
    CHENGYUAN = 5,//成员
}

//联盟消息类型
enum GuildInformationType {
    CREATE_GUILD = 1,//联盟创建
    JOIN_GUILD = 2,//玩家加入联盟
    LEAVE_GUILD = 3,//玩家退出联盟
    KICK_OUT_FROM_GUILD = 4,//踢出联盟
    APPOINT_POSITION = 5,//任命职位
    CHANGE_GUILD_LEADER = 6,//联盟转让
    CHANGE_NAME = 7,//改变联盟名（团长操作）
    APPLY_GUILD_LEADER = 8,//申请联盟长（取代）
}

/** 联盟联盟 */
class LegionModel {
    /**联盟科技最高等级 */
    public static TECH_LEVEL_MAX: number = 20;

    private static guildInfo: gameProto.IGuildInfo = null;//联盟信息
    private static shopInfo: gameProto.IGuildShopGoods[];//联盟商店
    private static donateResourceCount: number;//今日捐献材料次数
    private static shopReplenInfo = null;//商店补货info
    private static teachInfos: { [key: number]: LegionTeachVo } = null;//科技
    public static m_messInfoTotalPage = 0; //联盟信息页数

    private static techCfgDic: { [key: number]: GuildTechnologyConfig };
    private static playerInfo: gameProto.IGuildMemberInfo;   //玩家个人信息
    private static memberInfos: Dictionary;
    private static guildList: gameProto.IGuildListResp = null;//联盟列表
    public static currGuideInfo: gameProto.IRankLegionMessage;//点击的联盟信息
    /***/
    /***/
    public static init() {
        this.parseTechCfg();

        this.memberInfos = Dictionary.create();
    }

    /** */
    public static clear() {

    }
    // public static getLegionList(){
    //     return this.m_pList;
    // }
    public static setGuildInfo(info: gameProto.IGuildInfo) {
        this.guildInfo = info;
        this.donateResourceCount = this.guildInfo.donateResourceCount;
        this.parsePlayerInfo();
        /**联盟信息修改 抛事件 */
        com_main.EventMgr.dispatchEvent(LegionEvent.LEGION_INFO_CHANGE, null);
    }
    /**设置工会列表 */
    public static setGuildList(info: gameProto.IGuildListResp) {
        this.guildList = info;
    }
    public static getGuildList() {
        return this.guildList.guildData;
    }


    /**解散公会 */
    public static dissolve() {
        this.guildInfo = null;
        this.donateResourceCount = 0;
        this.teachInfos = null;
        this.playerInfo = null;
        this.currGuideInfo = null;

        /**联盟信息修改 抛事件 */
        com_main.EventMgr.dispatchEvent(LegionEvent.LEGION_INFO_CHANGE, null);
    }

    /**解析个人联盟信息 */
    private static parsePlayerInfo() {
        this.memberInfos.clear();

        for (let i = 0; i < this.guildInfo.guildMemberInfo.length; i++) {
            let info = this.guildInfo.guildMemberInfo[i];
            if (info.playerId == RoleData.playerId) {
                this.playerInfo = info;
            }
            this.memberInfos.add(info.playerId, info);
        }
    }

    /**
     * 解析科技数据 
     * 按类型存储 技能升级 服务器推送新的技能id 替换旧的
     * */
    public static parseTeach(list: gameProto.IGuildTechInfo[]) {
        this.teachInfos = {};
        for (let i = 0; i < list.length; i++) {
            let data = list[i];
            let teachVo = LegionTeachVo.create(data);
            this.teachInfos[data.type] = teachVo;
        }
    }

    /**根据类型获得科技信息 */
    public static getTeachVoByType(type: number): LegionTeachVo {
        return this.teachInfos[type];
    }

    /**更新科技信息 */
    public static updateTeach(data: gameProto.IGuildTechInfo) {
        if (this.teachInfos[data.type]) {
            this.teachInfos[data.type].update(data);
        }
    }
    /**更新捐献次数 */
    public static updateResourceNum(num: number) {
        this.donateResourceCount = num;
    }
    /**更新联盟 */
    public static updateMenber(data: gameProto.S2C_ACCUSE_GUILD) {

    }
    public static getGuildInfo() {
        return this.guildInfo;
    }
    /** 记录点击的联盟信息*/
    public static getClickGuildInfo(param: any): any {
        this.currGuideInfo = param;
    }

    /**
     * 获取工会唯一ID
     */
    public static getGuildId(): number {
        if (this.guildInfo)
            return this.guildInfo.id;
        else {
            return 0;
        }
    }
    /**
     * 获取工会唯一name
     */
    public static getGuildName(isReturnEmypt = false) {
        if (this.guildInfo)
            return this.guildInfo.name;
        else {
            if (isReturnEmypt) {
                return '';
            } else {
                return GCode(CLEnum.NONE);
            }
        }

    }

    /**玩家职位 */
    public static getPlayerPos() {
        if (this.playerInfo) return this.playerInfo.position;
        return 0;
    }
    /**玩家职位描述 */
    public static getPlayerPosDes() {
        let pos = this.getPlayerPos();
        return this.getPosTitle(pos);
    }

    /**获得职位名字 */
    public static getPosTitle(pos: LegionPositon) {
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
    }

    /**
     * 获取联盟描述
     */
    public static getGuildDescription() {
        if (this.guildInfo)
            return this.guildInfo.declaration;
        else
            return '';
    }

    /**国家联盟图片 */
    public static getLegionCountryImage(countryId) {
        if (countryId < 1 || countryId > 3) countryId = 1;
        return 'tb_jt_' + countryId + '_png';
    }




    //获取商店配置
    public static setLegionShopInfo(info: gameProto.IGuildShopGoods[]) {
        this.shopInfo = info;
    }
    //获取商店配置
    public static getLegionShopInfo() {
        return this.shopInfo;
    }
    //捐献次数
    public static getdonateResourceCount() {
        return this.donateResourceCount;
    }

    //商店补货
    public static getLegionReplenInfo() {
        return this.shopReplenInfo;
    }

    //keji
    public static getTechInfo() {
        return this.teachInfos;
    }
    //大殿限制等级
    public static setbuildLevelAndFree(lv, joinStatus) {
        this.guildInfo.buildingLevel = lv;
        this.guildInfo.joinStatus = joinStatus;
    }
    public static getbuildLevelAndFree() {
        return [this.guildInfo.buildingLevel, this.guildInfo.joinStatus];
    }
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
    public static addShopInventoryItem(content: any) {
        let id = content.itemId;
        if (this.shopInfo[id]) {
            error('背包位置重复了！！！请联系服务端 id:', id);
        }
        content.count = content.count;
        this.shopInfo[id] = content;
    }
    public static changeShopInventoryItem(content: any) {
        let itemId = content.itemId;

        let _content = this.shopInfo[itemId];

        if (_content) {
            //zb
            // let count = (<Long>content.count).toNumber();
            let count = content.count;

            _content.count += count; //content.count;

            if (_content.count < 0) {
                error('改变道具数量错误！剩余：', _content.count);
            }
        }
    }
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

    public static getCfg(itemId: number): ItemConfig {
        let data = C.ItemConfig[itemId];
        return data;
    }

    public static getItemDesc(itemId: number) {
        let data = this.getCfg(itemId);
        let desc = GLan(data.name);
        return desc;
    }
    //商店补货维护
    public static initReplenShopList() {

        let itemCfg = C.ItemConfig;
        let GuildShopConfig = C.GuildShopConfig;
        this.shopReplenInfo = {};
        for (let key in GuildShopConfig) {
            let cfg = GuildShopConfig[key];
            if (cfg) {
                let name = GLan(itemCfg[cfg.itemId].name);
                let icon = PropModel.getPropIcon(cfg.itemId);
                //let fund = JSON.parse(cfg.fund);

                this.shopReplenInfo[cfg.itemId] = { itemId: cfg.itemId, id: cfg.id, name: name, icon: icon, coin: cfg.fund, inventory0: 0, inventory: "" };
            }
        }

    }
    public static updateReplenShop(itemId: number, count: number) {
        this.shopReplenInfo[itemId].inventory0 = count;
    }
    public static addReplenShop(itemId: number, count: number) {
        this.shopReplenInfo[itemId].inventory0 += count;
    }
    //获取个人积分
    public static getMyScore() {
        for (let i = 0; i < this.guildInfo.guildMemberInfo.length; i++) {
            let info = this.guildInfo.guildMemberInfo[i];
            if (info.name == RoleData.nickName) {
                return info.donate;
            }
        }
    }
    public static updateMyscore(score) {
        for (let i = 0; i < this.guildInfo.guildMemberInfo.length; i++) {
            let info = this.guildInfo.guildMemberInfo[i];
            if (info.name == RoleData.nickName) {
                info.donate = score;
                break;
            }
        }
    }
    public static getFund() {
        return this.guildInfo.fund;
    }

    /**获得捐献次数 */
    public static getDonaMaxNum() {
        return 20;
    }
    //=============================================================================================================================================
    //配置表
    //============================================================================================================================================= 
    /**联盟职位名称 */
    public static getPosName(type: LegionPositon) {
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
    }

    /**联盟职位名称 */
    public static getPosNameById(playerId: number) {
        let legionPos: LegionPositon = 0;
        let info: gameProto.IGuildMemberInfo = this.memberInfos.get(playerId);
        if (info) legionPos = info.position;
        return this.getPosName(legionPos);
    }
    /**得到盟主的信息 */
    public static getLeaderInfo(): gameProto.IGuildMemberInfo {
        if (this.guildInfo == null) return;
        for (let i = 0; i < this.guildInfo.guildMemberInfo.length; i++) {
            let info = this.guildInfo.guildMemberInfo[i];
            if (info.position == LegionPositon.TUANZHANG) {
                return info;
            }
        }
    }
    /**技能配置表 */
    private static parseTechCfg() {
        this.techCfgDic = {};
        for (let key in C.GuildTechnologyConfig) {
            let data = C.GuildTechnologyConfig[key];
            if (unNull(data)) {
                this.techCfgDic[data.techID] = data;
            }
        }
    }
    /**获得技能配置 */
    public static getTechCfgById(id: number) {
        return this.techCfgDic[id] || this.techCfgDic[1000];
    }
    //=============================================================================================================================================
    //配置表
    //============================================================================================================================================= 


}