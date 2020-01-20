//**章节难度枚举 */
var IQuarLevel;
(function (IQuarLevel) {
    /**普通 */
    IQuarLevel[IQuarLevel["NORMAL"] = 10001] = "NORMAL";
    /**困难 */
    IQuarLevel[IQuarLevel["HARD"] = 10003] = "HARD";
})(IQuarLevel || (IQuarLevel = {}));
/** 章节模块 */
var HeadQuartersModel = /** @class */ (function () {
    function HeadQuartersModel() {
    }
    HeadQuartersModel.init = function () {
        this.levelRecord = IQuarLevel.NORMAL;
        this.chapterInfos = {};
        this.parseCfg();
    };
    /**解析服务器数据 */
    HeadQuartersModel.parseInfo = function (data) {
        this.norCopyId = data.norCopyId;
        this.hdCopyId = data.hdCopyId;
        this.norLastTime = data.norLastTime;
        this.hdLastTime = data.hdLastTime;
        this.updateChapterInfo(data.chapterInfos);
    };
    /**更新章節信息 */
    HeadQuartersModel.updateChapterInfo = function (list) {
        for (var i = 0; i < list.length; i++) {
            var data = list[i];
            this.chapterInfos[data.chapterId] = data;
            com_main.EventMgr.dispatchEvent(QuarterEvent.QUARTER_INFO_UPDATE, data.chapterId);
            if (data.moduleId == IQuarLevel.NORMAL) {
                var value = ConstUtil.getValue(IConstEnum.COPY_NOR_END);
                this.isNorMax = this.setCurCheckPointId(data, value);
            }
            else {
                var value = ConstUtil.getValue(IConstEnum.COPY_HD_END);
                this.isHdMax = this.setCurCheckPointId(data, value);
            }
        }
    };
    /**根據難度類型取總進度關卡ID */
    HeadQuartersModel.getCheckpointId = function (level) {
        if (level === void 0) { level = IQuarLevel.NORMAL; }
        if (this.fightRecordId > 0)
            return this.fightRecordId;
        return level == IQuarLevel.NORMAL ? this.norCopyId : this.hdCopyId;
    };
    /**根據難度類型取總進度關卡ID */
    HeadQuartersModel.getLastTime = function (level) {
        if (level === void 0) { level = IQuarLevel.NORMAL; }
        return level == IQuarLevel.NORMAL ? this.norLastTime : this.hdLastTime;
    };
    /**獲得章節信息 */
    HeadQuartersModel.getChapterInfo = function (chapterId) {
        return this.chapterInfos[chapterId];
    };
    /**重置挑战记录id 打开界面 初始化结束后 */
    HeadQuartersModel.resetFightRecord = function () {
        this.fightRecordId = 0;
    };
    /**设置副本记录 */
    HeadQuartersModel.setFightRecord = function (id) {
        this.fightRecordId = id;
    };
    //**获得默认挑战副本id */
    HeadQuartersModel.getDefCopyId = function (chapterId) {
        if (this.isNorChapter(chapterId)) {
            return this.norCopyId;
        }
        else {
            return this.hdCopyId;
        }
    };
    /**判斷副本id是否通關 */
    HeadQuartersModel.isPassWar = function (copyId) {
        var cfg = C.ChapterConfig[copyId];
        if (cfg && this.isNorChapter(cfg.chapterId)) {
            if (this.isNorMax) {
                return true;
            }
            else {
                return this.norCopyId > copyId;
            }
        }
        if (this.isHdMax) {
            return true;
        }
        else {
            return this.hdCopyId > copyId;
        }
    };
    /**是否是普通章節 */
    HeadQuartersModel.isNorChapter = function (chapterId) {
        return this.norChapterCfgs[chapterId] != null;
    };
    HeadQuartersModel.BuyChallengedTimes = function (level) {
        var nextBuyId = NormalModel.getFunCountById(level).buyAmountCount;
        var vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_HAEDQUARTER_CLEAN];
        var buyMax = Number(vipCfg['vip' + RoleData.vipLevel]); //最大购买数量
        if (nextBuyId >= buyMax) {
            Utils.showVipUpConfim();
            return;
        }
        if (C.CheckPointCostConfig[nextBuyId + 1]) {
            var itemInfo_1 = Utils.parseCommonItemJson(C.CheckPointCostConfig[nextBuyId + 1].cost);
            var tip = GCodeFromat(CLEnum.HAN_BOS_BUY_TIME, itemInfo_1[0].count) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - nextBuyId));
            ;
            Utils.showConfirmPop(tip, function () {
                if (PropModel.isItemEnough(PropEnum.GOLD, itemInfo_1[0].count, 2))
                    HeadQuartersProxy.send_HQ_BUY_RESET_COUNT(level);
            }, this);
            // view.setVipCanBuyNum('（当前vip可购买次数：' + (buyMax - nextBuyId)+'）');
            // view.setVipCanBuyNum(GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - nextBuyId)))
            // com_main.UpManager.popSmallView(view, null, false, 0.8);
        }
    };
    /**前往充值界面 */
    HeadQuartersModel.onConFirmCharge = function () {
        Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
    };
    //取对应数据领取宝箱
    HeadQuartersModel.updateRaward = function (info) {
        var data = this.getChapterInfo(info.chapterId);
        if (data)
            data.receivedBoxs = info.receivedBoxs;
    };
    //取显示的第一件物品
    HeadQuartersModel.getFirstItem = function (chapterId) {
        var reward;
        var chapterCfg = C.ChapterConfig[chapterId];
        if (this.isPassWar(chapterId)) {
            reward = Utils.parseCommonItemJsonInDrop(chapterCfg.winReward);
        }
        else {
            reward = Utils.parseCommonItemJsonInDrop(chapterCfg.firstReward);
        }
        return reward[0];
    };
    //获取星星信息
    HeadQuartersModel.getStarInfo = function (chapterId, checkPointId) {
        var data = this.getChapterInfo(chapterId);
        if (!data)
            return null;
        for (var i = 0; i < data.checkPointInfos.length; i++) {
            var checkPoint = data.checkPointInfos[i];
            if (checkPoint && checkPoint.id == checkPointId) {
                return checkPoint;
            }
        }
        return null;
    };
    /**获得章节红点 */
    HeadQuartersModel.getRedState = function () {
        if (!FunctionModel.isFunctionOpen(FunctionType.HEAD_QUARTERS))
            return 0;
        if (NormalModel.getFunCountById(IFunCountEnum.COPY_FREE_COUNT).reCount > 0)
            return NormalModel.getFunCountById(IFunCountEnum.COPY_FREE_COUNT).reCount;
        if (NormalModel.getFunCountById(IFunCountEnum.HQ_HARD_FREE_COUNT).reCount > 0)
            return NormalModel.getFunCountById(IFunCountEnum.HQ_HARD_FREE_COUNT).reCount;
        return 0;
    };
    // /**当前挑战的关卡id */
    // public static get CurCheckPointId() {
    //     return this.m_nCurCheckPointId;
    // }
    // public static setCurCheckPointId(value: number, level: IQuarLevel = IQuarLevel.NORMAL) {
    //     /**最后一章 */
    //     if (value == 0) {
    //         if (level == IQuarLevel.NORMAL) {
    //             value = ConstUtil.getValue(IConstEnum.COPY_NOR_END);
    //         } else {
    //             value = ConstUtil.getValue(IConstEnum.COPY_HD_END);
    //         }
    //     }
    //     this.m_nCurCheckPointId = value;
    // }
    /**判断最后一关已通关 */
    HeadQuartersModel.setCurCheckPointId = function (info, maxVale) {
        var boo = false;
        for (var i = 0; i < info.checkPointInfos.length; i++) {
            var norInfo = info.checkPointInfos[i];
            if (norInfo.id == maxVale) {
                boo = true;
            }
        }
        return boo;
    };
    /**是否可以挑战关卡 */
    HeadQuartersModel.canChallenges = function (id) {
        var cfg = C.ChapterConfig[id];
        if (!cfg) {
            EffectUtils.showTips('关卡不存在', 1, true);
            return;
        }
        if (MainMapModel.getHallLevel() < cfg.lockLv) {
            EffectUtils.showTips(GCodeFromat(CLEnum.CITY_BD_OPEN_DES1, cfg.lockLv), 1, true);
            return;
        }
        if (TeamModel.isEmptyTeamPVE()) {
            Utils.open_view(TASK_UI.POS_CAMP_VIEW, { type: CheckPointType.CHECKPOINT, battleId: id });
            return;
        }
        var prevPointId = JSON.parse(cfg.prevPointId);
        if (prevPointId) {
            var norId = prevPointId[0];
            var difId = prevPointId[1];
            if ((!norId || this.norCopyId - 1 >= norId) && (!difId || this.hdCopyId - 1 >= difId)) {
                return true;
            }
            else if (this.isHdMax) {
                return true;
            }
            else {
                return;
            }
        }
        return true;
    };
    /**获取下个关卡id */
    HeadQuartersModel.getNextId = function (curId) {
        var cfg = C.ChapterConfig[curId];
        if (!cfg) {
            EffectUtils.showTips('关卡不存在', 1, true);
            return;
        }
        var str = cfg.nextPointId;
        var nextId = JSON.parse(str)[0];
        return nextId;
    };
    /**是否重复挑战的关卡 */
    HeadQuartersModel.isRepeatChallenges = function (curId) {
        curId = this.getNextId(curId);
        if (curId < 90000) {
            if (curId < this.norCopyId)
                return true;
        }
        if (curId > 90000) {
            if (curId < this.hdCopyId)
                return true;
        }
        return false;
    };
    /**=====================================================================================
     * 配置表获取 begin
     * =====================================================================================
     */
    /**获得章节配置表 */
    HeadQuartersModel.getChapterCfg = function (chapterId, level) {
        if (level === void 0) { level = 1; }
        return C.ChapterConfigDic[chapterId][level];
    };
    /**解析配置表 */
    HeadQuartersModel.parseCfg = function () {
        this.norChapterCfgs = {};
        this.hdChapterCfgs = {};
        for (var key in C.ChapterConfigDic) {
            var list = C.ChapterConfigDic[key];
            var res = [];
            var chapterId = 0;
            var state = false;
            for (var id in list) {
                var data = list[id];
                chapterId = data.chapterId;
                state = data.difficultyType == IQuarLevel.HARD;
                if (unNull(list[id])) {
                    res.push(list[id]);
                }
            }
            res.sort(function (a, b) {
                return a.level - b.level;
            });
            if (state) {
                this.hdChapterCfgs[chapterId] = res;
            }
            else {
                this.norChapterCfgs[chapterId] = res;
            }
        }
    };
    /**获得章节配置表数组 */
    HeadQuartersModel.getChapterCfgs = function (chapterId) {
        if (this.norChapterCfgs[chapterId])
            return this.norChapterCfgs[chapterId];
        return this.hdChapterCfgs[chapterId];
    };
    /**获得章节星级奖励配置表 */
    HeadQuartersModel.getChapterStarCfg = function (chapterId) {
        var res = [];
        var list = C.StarRewardConfigDic[chapterId];
        for (var key in list) {
            if (unNull(list[key])) {
                res.push(list[key]);
            }
        }
        res.sort(function (a, b) {
            return a.star - b.star;
        });
        return res;
    };
    return HeadQuartersModel;
}());
