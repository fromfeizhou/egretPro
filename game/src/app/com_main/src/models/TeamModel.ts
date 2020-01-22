/**队伍类型 */
const enum TeamType {
    ALL = 0,    //全部
    WORLD = 1,  //世界地图
    PVE = 2,//PVE布阵
    DEF_APK = 3,//竞技场防守
    HISTORY_WAR = 4,//历史战役部队
    CROSS_SERVER = 5,//跨服战部队
}

/**队伍状态 
 *  0空闲 1队列 2国战中 4行走 5战斗中 
*/
const enum TeamState {
    IDLE = 0,   //空闲
    QUEQUIE = 1,    //国战队里（轮候战斗）
    WORLD_BATTLE = 2,    //国战中
    MOVE = 4,       //行走
    WAR = 5,//5战斗中
}

class TeamModel {
    private static TEAM_MAX_NUN: number = 2;        //大地图最大队伍数
    private static TEAM_MAX_CROSS_NUN: number = 2;        //跨服战最大队伍数

    private static teamDic: { [k: number]: { [k: number]: TeamVo } };    //队伍总列表
    private static teamTypeList: { [k: number]: TeamVo[] };       //同类型队伍列表

    public static armyNumsDic: { [k: number]: gameProto.IArmyMessage };  //募兵存量
    public static defTeamOrder: number;      //默认队伍
    public static isUpdateTeam: boolean = false;
    public static isNeedTroopTips: boolean = false;

    public static seatOpenLimit: number[];  //上阵位置解锁配置
    public static onBattleList: number[];    //上阵武将
    public static oTherPlayerId: number = 0;//查看目标玩家信息的id；
    public static otherTeamid: number = 0;//其他玩家的队伍team
    public static otherTeamData: com_main.IGeneralData[];
    public static init() {
        this.teamDic = {};
        this.teamTypeList = {};
        this.armyNumsDic = {};
        this.defTeamOrder = 0;
        this.otherTeamData = [];
        this.seatOpenLimit = ConstUtil.getNumArray(IConstEnum.UNLOCK_POSITION);
        this.addEvent();
    }

    public static clear() {
        this.teamDic = null;
        this.teamTypeList = null;
        this.removeEvent();
    }

    /**设置大地图最大队伍数量 */
    public static setMaxTeamNum(maxNum: number) {
        this.TEAM_MAX_NUN = maxNum;
    }

    /**获得最大队伍数量 */
    public static getTeamMax(type: TeamType) {
        if (type == TeamType.CROSS_SERVER) return this.TEAM_MAX_CROSS_NUN;
        return this.TEAM_MAX_NUN;
    }

    /**解析队伍列表 */
    public static parseTeamList(body: gameProto.S2C_TEAM_LIST) {
        for (let i = 0; i < body.teamList.length; i++) {
            let data = body.teamList[i];
            if (!this.teamDic[data.teamType]) {
                this.teamDic[data.teamType] = {};
            }
            if (!this.teamDic[data.teamType][data.order]) {
                let teamVo = TeamVo.create();
                this.teamDic[data.teamType][data.order] = teamVo;
                teamVo.init(data);
                //列表存储y
                if (!this.teamTypeList[data.teamType]) {
                    this.teamTypeList[data.teamType] = [];
                }
                this.teamTypeList[data.teamType].push(teamVo);
            } else {
                this.teamDic[data.teamType][data.order].update(data);
            }
        }
        this.defTeamOrder = body.defaultTeamOrder;

        this.setOnBattleList();
    }
    public static parseOtherPlayerItem(body: gameProto.S2C_TEAM_LIST) {
        //取第一只
        let team: gameProto.ITeamData;
        for (let index = 0; index < body.teamList.length; index++) {
            if (TeamModel.otherTeamid == body.teamList[index].id) {
                team = body.teamList[index];
                TeamModel.otherTeamid = 0;
                break;
            }
        }
        if (isNull(team)) return;
        this.otherTeamData = [];
        let teamGeneralData: gameProto.ITeamGeneralData[] = team.teamGeneralData.slice(0)//复制
        for (let index = 0; index < teamGeneralData.length; index++) {
            let data = teamGeneralData[index]
            let otherGenData: com_main.IGeneralData = { generalId: data.generalId, level: data.generalLevel, star: data.generalStar }
            this.otherTeamData.push(otherGenData);
        }
    }
    public static getOtherTeamData(): com_main.IGeneralData[] {
        return this.otherTeamData;
    }
    public static resetOtherTeamData() {
        this.otherTeamData = [];
    }
    /**重新设置上阵武将 */
    public static setOnBattleList() {
        let oldList = this.onBattleList;
        this.onBattleList = [];
        for (let key in this.teamTypeList) {
            let list = this.teamTypeList[key];
            for (let i = 0; i < list.length; i++) {
                this.addTeamGens(list[i], oldList);
            }
        }
        //移除旧武将红点
        if (oldList) {
            for (let i = 0; i < oldList.length; i++) {
                if (!this.isOnBattle(oldList[i])) RedPointModel.removeGeneralInfo(oldList[i]);
            }
        }
    }
    /**添加上阵武将 */
    private static addTeamGens(teamVo: TeamVo, oldList: number[]) {
        //忽略历史武将 和 竞技场防守
        if ( teamVo.teamType == TeamType.HISTORY_WAR ||teamVo.teamType == TeamType.CROSS_SERVER) return;

        for (let i = 0; i < teamVo.teamGeneralData.length; i++) {
            let generalId = teamVo.teamGeneralData[i].generalId;
            if (generalId > 0 && this.onBattleList.indexOf(generalId) == -1) {
                this.onBattleList.push(generalId);
                if (!oldList || oldList.indexOf(generalId) == -1) RedPointModel.addGeneralInfo(generalId);
            }
        }
    }

    /**是否上阵武将 */
    public static isOnBattle(generalId: number) {
        if (this.onBattleList && this.onBattleList.indexOf(generalId) >= 0) return true;
        return false;
    }


    /**根据部队类型获取是否上阵武将 */
    public static getTeamBattleByType(generalId: number, type: TeamType) {
        let list = this.teamDic[type];
        if (!list) return false;
        for (let key in list) {
            let info = list[key];
            if (info && info.hasGeneralById(generalId)) {
                return true;
            }
        }
        return false;
    }
    public static cleanTeamByType(teamType: TeamType) {
        let teamList = this.teamDic[teamType];
        for (let key in teamList) {
            let order = Number(key);
            let teamVo = teamList[order];
            if (unNull(teamVo)) {
                teamVo.teamGeneralData = [];
            }
        }
    }
    /**获得武将在指定类型的部队下标 */
    public static getGeneralTeamId(teamType: TeamType, generalId: number, offOrder: number = -1) {
        let teamList = this.teamDic[teamType];
        for (let key in teamList) {
            let order = Number(key);
            //忽略指定 下标队伍
            if (order == offOrder) continue;

            let teamVo = teamList[order];
            if (unNull(teamVo) && teamVo.hasGeneralById(generalId)) {
                return order;
            }
        }
        return -1;
    }

    /**获得队伍信息 */
    public static getTeamVoByType(teamType: TeamType, order: number = 0) {
        if (this.teamDic[teamType])
            return this.teamDic[teamType][order]
        return null;
    }

    /**获得队伍信息 */
    public static getTeamVoByTypeId(teamType: TeamType, teamId: number = 0) {
        let list = this.teamDic[teamType];
        for (let key in list) {
            let vo = list[key];
            if (vo && vo.id == teamId) {
                return vo;
            }
        }
        return null;
    }
    /**
     * 根据城池获得队伍列表
     */
    public static getTeamVoListByCityId(cityId: number): TeamVo[] {
        cityId = WorldModel.getXiangBirthMapCityId(cityId);
        let list = this.teamTypeList[TeamType.WORLD];
        let res = [];
        for (let i = 0; i < list.length; i++) {
            let vo = list[i];
            if (vo.cityId == cityId && !vo.isEmptyTeam()) {
                res.push(vo);
            }
        }
        return res;
    }

    public static getTeamMainHero(teamVo: TeamVo) {
        let teamGeneralData: gameProto.TeamGeneralData[] = teamVo.teamGeneralData;
        if (!teamGeneralData)
            return 0;
        let heroid = 0, fight = 0;
        for (let gid of teamGeneralData) {
            let hero = GeneralModel.getOwnGeneral(Number(gid.generalId));
            if (!hero) continue
            if (heroid == 0) {
                heroid = hero.generalId;
                fight = hero.fight;
            } else if (hero.fight > fight) {
                heroid = hero.generalId;
            }
        }
        return heroid;
    }
    /**获取可上阵武将列表 */
    public static getCanUpGeneralList(teamType: TeamType, order: number = 0, nationLimit: number[] = [], typeLimit: number[] = []) {
        let list: GeneralVo[] = [];
        let voList = this.teamTypeList[teamType];
        let generalList = GeneralModel.getOwnGeneralWithSortFight();
        for (let i = 0; i < generalList.length; i++) {
            let inPut = true;
            let genVo = generalList[i];
            //如果是历史战役要过滤一下
            if (teamType == TeamType.HISTORY_WAR && (nationLimit.indexOf(genVo.config.nationType) != -1 || typeLimit.indexOf(genVo.config.armyType) != -1))
                continue;
            //过滤 非本队伍的上阵武将
            for (let k = 0; k < voList.length; k++) {
                let vo = voList[k];
                if (vo.order != order && vo.hasGeneralById(genVo.generalId)) {
                    inPut = false;
                    break;
                }
            }
            if (inPut) {
                list.push(genVo);
            }
        }

        let curVo = voList[order];
        list.sort((a: GeneralVo, b: GeneralVo) => {
            let aId = curVo.hasGeneralById(a.generalId) ? 0 : 1;
            let bId = curVo.hasGeneralById(b.generalId) ? 0 : 1;
            return aId - bId;
        })
        return list;
    }
    /**
     * 获取前排可上阵队伍
     */
    public static getCanUpGeneralFrontList(teamType: TeamType, order: number = 0, nationLimit: number[] = [], typeLimit: number[] = []) {
        let list: GeneralVo[] = [];
        let voList = this.teamTypeList[teamType];
        let generalList = GeneralModel.getOwnGeneralWithSortFight();
        for (let i = 0; i < generalList.length; i++) {
            let inPut = true;
            let genVo = generalList[i];
            if (genVo.config.armyType == SoldierMainType.ARROWSOLDIER)
                continue;
            //如果是历史战役要过滤一下
            if (teamType == TeamType.HISTORY_WAR && (nationLimit.indexOf(genVo.config.nationType) != -1 || typeLimit.indexOf(genVo.config.armyType) != -1))
                continue;
            //过滤 非本队伍的上阵武将
            for (let k = 0; k < voList.length; k++) {
                let vo = voList[k];
                if (vo.order != order && vo.hasGeneralById(genVo.generalId)) {
                    inPut = false;
                    break;
                }
            }
            if (inPut) {
                list.push(genVo);
            }
        }

        let curVo = voList[order];
        list.sort((a: GeneralVo, b: GeneralVo) => {
            let aId = curVo.hasGeneralById(a.generalId) ? 0 : 1;
            let bId = curVo.hasGeneralById(b.generalId) ? 0 : 1;
            if (a.fight != b.fight) {
                return b.fight - a.fight;
            } else {
                return aId - bId;
            }
        })
        return list;
    }


    /**
     * 获取后排武将
     */
    public static getCanUpGeneralBackList(teamType: TeamType, order: number = 0, nationLimit: number[] = [], typeLimit: number[] = []) {
        let list: GeneralVo[] = [];
        let voList = this.teamTypeList[teamType];
        let generalList = GeneralModel.getOwnGeneralWithSortFight();
        for (let i = 0; i < generalList.length; i++) {
            let inPut = true;
            let genVo = generalList[i];
            if (genVo.config.armyType != SoldierMainType.ARROWSOLDIER)
                continue;
            //如果是历史战役要过滤一下
            if (teamType == TeamType.HISTORY_WAR && (nationLimit.indexOf(genVo.config.nationType) != -1 || typeLimit.indexOf(genVo.config.armyType) != -1))
                continue;
            //过滤 非本队伍的上阵武将
            for (let k = 0; k < voList.length; k++) {
                let vo = voList[k];
                if (vo.order != order && vo.hasGeneralById(genVo.generalId)) {
                    inPut = false;
                    break;
                }
            }
            if (inPut) {
                list.push(genVo);
            }
        }

        let curVo = voList[order];
        list.sort((a: GeneralVo, b: GeneralVo) => {
            let aId = curVo.hasGeneralById(a.generalId) ? 0 : 1;
            let bId = curVo.hasGeneralById(b.generalId) ? 0 : 1;
            if (a.fight != b.fight) {
                return b.fight - a.fight;
            } else {
                return aId - bId;
            }

        })
        return list;
    }

    /**部队数量开启等级 */
    public static getLastOpenTeamLev(): number {
        let openLevList: number[] = ConstUtil.getNumArray(IConstEnum.PLAYER_LEVEL_WORLD_MAP_TEAM);
        if (isNull(openLevList))
            return 0;
        let len: number = openLevList.length;
        for (let index = 0; index < len; index++) {
            if (openLevList[index] > RoleData.level)
                return openLevList[index];
        }
        return 0;
    }

    /**
   * @param gid 武将id
   * @param pos 所在位置  -1 为下阵 其他位置(0-4) 为上阵 或更变位置
   */
    public static setTmpTeamGeneralData(tmpData: gameProto.ITeamGeneralData[], gid: number, pos: number) {
        //过滤
        if (pos >= 0) {
            let data = tmpData[pos];
            if (data.generalId == gid) {
                //阵型没有任何变动 发送事件 恢复给隐藏的上阵英雄
                com_main.EventMgr.dispatchEvent(TeamUIEvent.TEAM_UPDATE_GIRD_INFO, [gid]);
                return;
            }
        }

        //更改队列
        let changeIds = [];
        changeIds.push(gid);
        //下阵
        let oldPos = -1;
        for (let i = 0; i < tmpData.length; i++) {
            let data = tmpData[i];
            if (data.generalId == gid) {
                data.generalId = 0;
                oldPos = i;
            }
        }
        if (pos >= 0) {
            let data = tmpData[pos];
            //新位置有武将
            if (data.generalId > 0) {
                changeIds.push(data.generalId);
                //存在旧位置 交换位置
                if (oldPos >= 0) {
                    let oldData = tmpData[oldPos];
                    oldData.generalId = data.generalId;
                }
            }

            data.generalId = gid;
        }

        com_main.EventMgr.dispatchEvent(TeamUIEvent.TEAM_UPDATE_GIRD_INFO, changeIds);
    }

    /**获得部队状态描述 */
    public static getStateDes(state: TeamState) {
        switch (state) {
            case TeamState.IDLE:
                return GCode(CLEnum.WOR_TEAM_KX);
            case TeamState.MOVE:
                return GCode(CLEnum.WOR_TEAM_XJ);
            // case TeamState.COLLECT:
            //     return '采集中';
            case TeamState.QUEQUIE:
                return GCode(CLEnum.WOR_TEAM_GZPD);
            case TeamState.WAR:
            case TeamState.WORLD_BATTLE:
                return GCode(CLEnum.WOR_TEAM_GZZD);
            // case TeamState.BATTLE:
            //     return '战斗中';
        }
        return '';
    }

    /**是否是空队伍 */
    public static isEmptyTeamPVE() {
        let teamVo = this.getTeamVoByType(TeamType.PVE, this.defTeamOrder);
        return teamVo.isEmptyTeam();
    }
    /**是否是空队伍 */
    public static isEmptyTeamHistoryWar() {
        let teamVo = this.getTeamVoByType(TeamType.HISTORY_WAR, this.defTeamOrder);
        return teamVo.isEmptyTeam();
    }
    /**是否有空位置 */
    public static hasGenEmptyPos() {
        let teamVo = this.getTeamVoByType(TeamType.PVE, this.defTeamOrder);
        let genNum = GeneralModel.getOwnGeneralNum();
        let count = 0;
        let seatNum = 0;
        for (let i = 0; i < this.seatOpenLimit.length; i++) {
            if (RoleData.level >= this.seatOpenLimit[i]) {
                seatNum++;
            }
        }
        for (let i = 0; i < teamVo.teamGeneralData.length; i++) {
            if (teamVo.teamGeneralData[i].generalId > 0) {
                count++;
            }
        }
        //剩余武将 与剩余位置大于0
        if ((genNum - count) > 0 && (seatNum - count) > 0) {
            return true;
        }
        return false;
    }
    /**判断pve阵型红点 */
    public static hasPVEEmptyPos() {
        let teamVo: TeamVo = this.getTeamVoByType(TeamType.PVE, this.defTeamOrder);
        let pTmpTeamList: gameProto.ITeamGeneralData[] = teamVo.cloneTeamGeneralData();
        //先判断前排
        let genVoFrontList: GeneralVo[] = this.getCanUpGeneralFrontList(TeamType.PVE);
        if (this.checkPosGen(pTmpTeamList.slice(0, 3), true, genVoFrontList)) return true;
        let genVoBackList: GeneralVo[] = this.getCanUpGeneralBackList(TeamType.PVE);
        if (this.checkPosGen(pTmpTeamList.slice(3), false, genVoBackList)) return true;
        return false;
    }

    //检查武将在合适的位置上
    public static checkPosGen(teamGeListData: gameProto.ITeamGeneralData[], isFront: boolean = true, genVoList: GeneralVo[]): boolean {
        if (isNull(genVoList) || genVoList.length == 0) return false;
        let i = isFront ? 0 : 3;
        let len = isFront ? 3 : 2;
        let end: number = isFront ? 3 : 5;
        let genIdList: number[] = [];
        let minLen: number = Math.min(genVoList.length, len)
        let tempVoList: GeneralVo[] = genVoList.splice(0, minLen);
        tempVoList.forEach((v, i, a) => {
            genIdList.push(v.generalId)
        })

        for (; i < end; i++) {
            if (RoleData.level >= this.seatOpenLimit[i]) {
                //如果这个位置没有武将//这个位置已经有武将了但是不是前三
                let teamGenData: gameProto.ITeamGeneralData = teamGeListData[i];
                if (isNull(teamGenData) || genIdList.indexOf(teamGenData.generalId) == -1) {
                    //有没有符合条件的空位武将给他
                    if (this.checkEmptyGen(teamGeListData, i, genIdList)) return true;
                    continue
                }
            }
        }
        return false
    }
    //检查符合条件的空位武将
    public static checkEmptyGen(teamGeListData: gameProto.ITeamGeneralData[], curPos: number = 0, genIdList: number[]): boolean {
        let pos: number = 0;
        for (let index = 0, len = teamGeListData.length; index < len; index++) {
            if (index == curPos) continue;
            if (RoleData.level < this.seatOpenLimit[index]) continue
            let teamGenData: gameProto.ITeamGeneralData = teamGeListData[index];
            if (unNull(teamGenData) && genIdList.indexOf(teamGenData.generalId) != -1) pos++;
        }
        //判断占的坑小于武将数
        return pos < genIdList.length;
    }
    /* */
    /**=====================================================================================
     * 练兵营 begin
     * =====================================================================================
     */

    /**已招募士兵 */
    public static parseTroopsInfo(body?: gameProto.GetArmyResp) {
        if (body) {
            for (let i = 0; i < body.armys.length; i++) {
                let data = body.armys[i];
                this.armyNumsDic[data.armyType] = data;
                com_main.EventMgr.dispatchEvent(BuildEvent.SOLDIER_TRAIN, data.armyType);
            }
        }
    }

    /**获得练兵结构 */
    public static getTroopsInfo(type: SoldierMainType) {
        return this.armyNumsDic[type];
    }



    /**获得兵种进阶加成 */
    public static getSoldierGradeAdd(type: SoldierMainType, level: number) {
        let cfg = this.getArmyProgressConfig(type, level - 1);
        let curCfg = this.getArmyProgressConfig(type, level);
        if (!cfg || !curCfg) return null;

        let atts = StringUtils.keyValsToNumber(cfg.attribute);
        let curAtts = StringUtils.keyValsToNumber(curCfg.attribute);
        let res = [];
        res.push(GCodeFromat(CLEnum.LEVEL_ADD, 1));
        for (let key in curAtts) {
            let val = atts[key] || 0;
            val = curAtts[key] - val;
            res.push(Utils.getAttriFormat({ key: Number(key), value: val }));
        }
        res.push(GCodeFromat(CLEnum.FIGHT_ADD, curCfg.score));
        return res;
    }


    /**判断某兵种可否招募 */
    public static isCanTrain(armsType: SoldierMainType): boolean {
        let data: gameProto.IArmyMessage = this.armyNumsDic[armsType];
        let buildId = MainMapModel.getBuildInfoBySolider(armsType).id;
        let cfg = MainMapModel.getBuildingTrainCfgbyBuildId(buildId);

        /**达不到招募条件 */
        if (!cfg) {
            return false;
        }

        let army = MainMapModel.getTrainArmyVoById(buildId);
        let isTraning = false;
        if (army) {
            let remainTime = army.endTime - TimerUtils.getServerTime() - army.speedTime;
            if (remainTime > 0) isTraning = true;
        }
        if (isTraning) return false;        //招募中
        if (data.num >= cfg.storagelimit) return false;     //达到最大数
        let traninData = Utils.parseCommonItemJson(cfg.consumes);
        for (let i = 0; i < traninData.length; i++) {
            let info = new com_main.LvUpConditionsBaseInfo(traninData[i].itemId, traninData[i].count * 1);
            if (!info.getIsCan()) return false;     //材料不足
        }
        return true;
    }

    /**判断某兵种可否升阶 */
    public static isCanUpgrade(armsType: SoldierMainType): boolean {
        let level = this.getTroopsInfo(armsType).level;
        let armyProgressConfig = C.ArmyProgressConfigDic[armsType][level];
        let nextArmyProgressConfig = C.ArmyProgressConfigDic[armsType][level + 1];
        if (!nextArmyProgressConfig) return false;      //已达到最高级
        let maxLv = MainMapModel.getSoliderBuildLvByType(armsType) + 10;
        if (level >= maxLv) return false;     //超过建筑10级
        let consume = Utils.parseCommonItemJson(armyProgressConfig.coumses);
        if (!PropModel.isItemListEnough(consume)) return false;
        return true;
    }

    private static list = [SoldierMainType.FOOTSOLDIER, SoldierMainType.RIDESOLDIER, SoldierMainType.ARROWSOLDIER];

    public static checkCanTrain(armsType?: SoldierMainType): boolean {
        if (!FunctionModel.isFunctionOpen(FunctionType.ARMEY)) return;
        //列表
        if (isNull(armsType)) {
            for (let i = 0; i < this.list.length; i++) {
                if (this.isCanTrain(this.list[i])) return true;
            }
        }
        //单个选项
        else {
            if (this.isCanTrain(armsType)) return true;
        }
        return false;
    }

    public static checkCanUpgrade(armsType?: SoldierMainType): boolean {
        if (!FunctionModel.isFunctionOpen(FunctionType.ARMEY)) return;
        //列表
        if (isNull(armsType)) {
            for (let i = 0; i < this.list.length; i++) {
                if (this.isCanUpgrade(this.list[i])) return true;
            }
        }
        //单个选项
        else {
            if (this.isCanUpgrade(armsType)) return true;
        }
        return false;
    }

    /**
     * 获得兵阶配置表
     * @param mainType 兵种类型
     * @param gradeLv 进阶等级
     *  */
    public static getArmyProgressConfig(mainType, gradeLv) {
        return C.ArmyProgressConfigDic[mainType][gradeLv];
    }

    /**=====================================================================================
     * 练兵营 end
     * =====================================================================================
     */

    /**大地图解锁 */
    public static getTeamOpenTips() {
        let openLv: number = TeamModel.getLastOpenTeamLev();
        let vipLv = VipModel.getVipPrivileUp(RoleData.vipLevel, VipPrivillType.MAP_EXTRA_TEAM);
        if (vipLv == 0) {
            return GCodeFromat(CLEnum.WOR_TEAM_JSTS2, openLv);
        }
        if (openLv == 0) {
            return platform.isHidePayFunc() ? '' : GCodeFromat(CLEnum.WOR_TEAM_JSTS1, vipLv);
        }
        if (vipLv > 0 && openLv > 0) {
            return platform.isHidePayFunc() ? '' : GCodeFromat(CLEnum.WOR_TEAM_JSTS, openLv, vipLv);
        }
        return '';
    }

    /**状态判断 */
    public static isWar(state: TeamState) {
        switch (state) {
            case TeamState.QUEQUIE:
            case TeamState.WAR:
            case TeamState.WORLD_BATTLE:
                return true;
        }
        return false;
    }


    /**==================================================================================================================================
    * 事件监听 start
    * ==================================================================================================================================
    */
    private static addEvent() {
        com_main.EventMgr.addEvent(GeneralEvent.GENERAL_ATTRI_CHANGE, this.onGeneralChange, this);
    }

    private static removeEvent() {
        com_main.EventMgr.removeStaticEvent(GeneralEvent.GENERAL_ATTRI_CHANGE, this.onGeneralChange);
    }
    /**武将属性变动 */
    private static onGeneralChange(generalId: number) {
        let list = this.teamDic[TeamType.WORLD];
        for (let key in list) {
            let info = list[key];
            if (info) info.updateGeneral(generalId);
        }
        if (CrossModel.isWar()) {
            list = this.teamDic[TeamType.CROSS_SERVER];
            for (let key in list) {
                let info = list[key];
                if (info) info.updateGeneral(generalId);
            }
        }
    }
    /**==================================================================================================================================
    * 事件监听 end
    * ==================================================================================================================================
    */
}