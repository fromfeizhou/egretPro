var BattleResponseData = /** @class */ (function () {
    function BattleResponseData() {
    }
    return BattleResponseData;
}());
var FightResponseUtil = /** @class */ (function () {
    function FightResponseUtil() {
    }
    FightResponseUtil.initTime = function (time) {
        if (this.serverBeginTime < 0) {
            this.serverBeginTime = time;
            this.useTime = 0;
        }
    };
    FightResponseUtil.reset = function () {
        this.serverBeginTime = -1;
        this.resultCache = null;
        this.dataList = [];
        this.isWarOver = false;
        this.victory = false;
        this.useTime = 0;
        this.isPause = false;
    };
    FightResponseUtil.AddData = function (cmd, time, bdata) {
        //不是当前战斗id 跳出
        if (bdata && bdata.getBody().battleId != BattleModel.getJoinedBattleId()) {
            // BattleProxy.send_C2S_WAR_QUIT_BATTLE(bdata.getBody().battleId);
            // error('bdata.getBody().battleId = ', bdata.getBody().battleId, 'BattleModel.getJoinedBattleId() = ', BattleModel.getJoinedBattleId())
            return;
        }
        this.initTime(time);
        var brdata = new BattleResponseData();
        brdata.cmd = cmd;
        brdata.lifeTime = time - this.serverBeginTime + 400;
        brdata.bdata = bdata;
        this.dataList.splice(0, 0, brdata);
    };
    FightResponseUtil.enterFrame = function (dt) {
        if (this.isPause || this.isWarOver) {
            return;
        }
        this.useTime += dt;
        var count = 10;
        for (var i = this.dataList.length - 1; i >= 0; i--) {
            var brdata = this.dataList[i];
            if (brdata.lifeTime <= this.useTime) {
                this.battleProxy.dealData(brdata.bdata);
                this.dealVideoCode(brdata);
                this.dataList.splice(i, 1);
            }
        }
    };
    FightResponseUtil.dealVideoCode = function (brdata) {
        var cmd = brdata.cmd;
        if (cmd == EnumFightVideoCmd.DIALOG) { //对话
            FightResponseUtil.pause();
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GUIDE_WAR_PROCESS);
            console.log("调用新手对话");
        }
        else if (cmd == EnumFightVideoCmd.G_RUN) { //武将行走
            com_main.FirstBattleGuide.getInstance().start();
            FightResponseUtil.pause();
            console.log("武将行走");
        }
        else if (cmd == EnumFightVideoCmd.END) { //战斗结束
            // SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
            var layer_1 = new eui.Image("border_006_png");
            layer_1.width = GameConfig.curWidth();
            layer_1.height = GameConfig.curHeight();
            AGame.R.app.popUpLevel.addChild(layer_1);
            layer_1.alpha = 0.1;
            Tween.get(layer_1).to({ alpha: 1 }, 1500).call(function () {
                Utils.open_view(TASK_UI.GUIDE_INTRODUCTION_VIEW, {
                    imgList: ["lb_11_png", "lb_12_png"],
                    callback: function () {
                        Utils.open_view(TASK_UI.POP_GUIDE_SELECT_COUNTRY);
                        Utils.removeFromParent(layer_1);
                    }
                });
            });
        }
    };
    FightResponseUtil.play = function (isMovetoWall) {
        if (isMovetoWall === void 0) { isMovetoWall = false; }
        this.m_step += 1;
        if (com_main.FirstBattleGuide.getInstance().checkStep()) {
            //播放动画
        }
        else {
            this.isPause = false;
        }
        if (this.m_step == 2) {
            com_main.BattleSceneMgr.getInstance().startMoveCamera();
        }
    };
    FightResponseUtil.pause = function () {
        this.isPause = true;
        if (com_main.BattleMap.getClass()) {
            com_main.BattleMap.getClass().stopAllSoldier();
        }
    };
    FightResponseUtil.quickBattle = function () {
        this.isWarOver = true;
        this.showResultView();
    };
    /**缓存结算 */
    FightResponseUtil.addResultCache = function (result) {
        var body = result.getBody();
        if (body.battleId != BattleModel.getJoinedBattleId()) {
            return;
        }
        this.resultCache = result;
        this.isWarOver = true;
        // this.showResultView();
        var delayTime = ConstUtil.getValue(IConstEnum.BATTLE_SETTLE_DELAY_TIME);
        Utils.TimerManager.doTimer(delayTime, 1, function () {
            FightResponseUtil.showResultView();
        }, this);
    };
    /**执行结算 */
    FightResponseUtil.showResultView = function () {
        if (!this.isWarOver)
            return;
        if (!this.resultCache)
            return;
        if (this.victory && GuideModel.doWarEndStep()) {
            return;
        }
        if (SceneManager.hasChildGuideView())
            return;
        var body = this.resultCache.getBody();
        var protocol = Number(this.resultCache.getName());
        this.resultCache = null;
        switch (protocol) {
            /**事件战斗完成 */
            case ProtoDef.S2C_WORLDMAP_EVENT_WAR_OVER: {
                // required int32 eventCoordinatesId=1;
                // required int32 eventDataId=2;
                // required int64 battleId=3;
                // required bool isVictory=4;//	是否胜利
                // repeated ValuesMessage valuesMessage = 5;//奖励信息
                if (body.battleId == BattleModel.getJoinedBattleId()) {
                    Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.isVictory, rewards: body.valuesMessage, battleType: CheckPointType.FIGHT_WILD });
                }
                else {
                }
                break;
            }
            /**擂台结算奖励 */
            case ProtoDef.ARENA_BATTLE_REWARD: {
                if (body.battleId == BattleModel.getJoinedBattleId()) {
                    Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.result, rewards: body.reward, battleType: CheckPointType.ARENA, arenaId: body.arenaId });
                }
                break;
            }
            /**挑战材料副本获胜信息 */
            case ProtoDef.S2C_MATERIAL_CHALLENGE: {
                var data = body;
                MaterialModel.copyTypeinfo = body.type;
                MaterialModel.isSweep = body.sweep;
                // com_main.EventMgr.dispatchEvent(MaterialEvent.MATERIAL_INFO_UPDATE, null);
                MaterialModel.reSDCountData(data);
                if (MaterialModel.copyTypeinfo) {
                    MaterialModel.copyType = MaterialModel.copyTypeinfo.type;
                }
                else {
                    MaterialModel.copyType = 0;
                }
                if (body.battleId == BattleModel.getJoinedBattleId()) {
                    Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.success, rewards: body.valuesMessage, battleType: CheckPointType.MATERIAL });
                }
                break;
            }
            /**挑战boss怪物获胜信息 */
            case ProtoDef.S2C_CHALLENGE_BOSS: {
                // BossModel.setBossInfoByType(body.info);
                var data = body;
                BossModel.challType = data.bossType;
                if (data.battleId == BattleModel.getJoinedBattleId()) {
                    Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: data.success, rewards: data.valuesMessage, battleType: CheckPointType.BOSS, bossType: data.bossType, lastHit: data.lastHit, rank: data.rank, damage: data.damage });
                }
                break;
            }
            /**行营挑战胜利结算信息 */
            case ProtoDef.HQ_CHANLLNGES_REWARD: {
                if (body.battleId == BattleModel.getJoinedBattleId()) {
                    Utils.open_view(TASK_UI.POP_RESULT_RAMPART_BATTLE_VIEW, body);
                }
                break;
            }
            /**历史战役 */
            case ProtoDef.S2C_HISTROY_WAR_BATTLE_INFO: {
                var data = body;
                if (body.battleId == BattleModel.getJoinedBattleId()) {
                    Utils.open_view(TASK_UI.POP_RESULT_HISTORY_BATTLE_VIEW, body);
                    if (data.result) {
                        TeamModel.cleanTeamByType(4 /* HISTORY_WAR */);
                        TeamProxy.C2S_TEAM_LIST(4 /* HISTORY_WAR */);
                    }
                }
                break;
            }
            /**巡查挑战完获得奖励 */
            case ProtoDef.S2C_PATROL_CHALLENGE_REWARD: {
                if (body.battleId == BattleModel.getJoinedBattleId()) {
                    Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.result, rewards: body.message, battleType: CheckPointType.PATRO });
                }
                break;
            }
            case ProtoDef.S2C_PATROL_CHALLENGE_BOSS_REWARD: {
                if (body.battleId == BattleModel.getJoinedBattleId()) {
                    Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.result, rewards: body.message, battleType: CheckPointType.PATRO });
                }
                break;
            }
            /**挑战结束 */
            case ProtoDef.APK_CHALLENGE_RESULT: {
                for (var key in body.apkRankVoList) {
                    var vo = body.apkRankVoList[key];
                    if (vo.playerId == RoleData.playerId) {
                        PvpArenaModel.setRank(vo.rank);
                    }
                }
                if (body.battleId == BattleModel.getJoinedBattleId()) {
                    Utils.open_view(TASK_UI.POP_RESULT_ARENA_BATTLE_VIEW, { result: body.result, rewards: body.message, battleType: CheckPointType.PK });
                }
                break;
            }
        }
    };
    FightResponseUtil.serverBeginTime = -1;
    FightResponseUtil.dataList = [];
    FightResponseUtil.isPause = false;
    FightResponseUtil.m_step = 0;
    return FightResponseUtil;
}());
