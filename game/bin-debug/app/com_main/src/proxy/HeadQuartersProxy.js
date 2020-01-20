var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var HeadQuartersProxy = /** @class */ (function (_super_1) {
    __extends(HeadQuartersProxy, _super_1);
    function HeadQuartersProxy() {
        return _super_1.call(this) || this;
    }
    HeadQuartersProxy.prototype.listenerProtoNotifications = function () {
        return [
            [ProtoDef.HQ_GET_INFO, this, 'GetHeadQuartersInfoReq', 'GetHeadQuartersInfoResp'],
            [ProtoDef.HQ_CLEAN_UP, this, 'CleanUpHQReq', 'CleanUpHQResp'],
            [ProtoDef.HQ_CHALLENGES, this, 'ChallengesHQReq', 'ChallengesHQResp'],
            [ProtoDef.HQ_RECEIVE_BOX, this, 'HQReceiveBoxReq', 'HQReceiveBoxResp'],
            [ProtoDef.HQ_BUY_RESET_COUNT, this, 'HQBuyResetCountReq', 'HQBuyResetCountResp'],
            [ProtoDef.HQ_UPDATE_CHAPTER, this, '', 'HQUpdateChapter'],
            [ProtoDef.HQ_CHAPTER_INFO, this, 'GetHeadQuarterChapterInfoReq', 'GetHeadQuarterChapterInfoResp'],
        ];
    };
    HeadQuartersProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var proto = notification.getName();
        switch (proto) {
            case ProtoDef.HQ_GET_INFO: {
                HeadQuartersModel.parseInfo(body.info);
                if (HeadQuartersProxy.OPEN_HEAD_QUARTER) {
                    HeadQuartersProxy.OPEN_HEAD_QUARTER = false;
                    Utils.open_view(TASK_UI.HEADQUARTER_MAIN_PANEL);
                }
                // Utils.open_view(TASK_UI.HEADQUARTER_MAIN_PANEL);
                break;
            }
            case ProtoDef.HQ_CLEAN_UP: {
                var vo = body;
                Utils.open_view(TASK_UI.GET_REWARD_VIEW, vo.valuesMessage);
                com_main.EventMgr.dispatchEvent(QuarterEvent.QUARTER_INFO_NUM, vo.bossCount);
                break;
            }
            case ProtoDef.HQ_CHALLENGES: {
                var VO = body;
                // SceneManager.enterScene(SceneEnums.BATTLE_MAP, VO.battleId);
                break;
            }
            case ProtoDef.HQ_RECEIVE_BOX: {
                var data = body;
                HeadQuartersModel.updateRaward(data.info);
                break;
            }
            case ProtoDef.HQ_BUY_RESET_COUNT: {
                EffectUtils.showTips(GCode(CLEnum.MAT_BUY_SUC), 1, true);
                break;
            }
            case ProtoDef.HQ_UPDATE_CHAPTER: {
                HeadQuartersModel.parseInfo(body.info);
                break;
            }
            case ProtoDef.HQ_CHAPTER_INFO: { //関卡翻頁返回
                HeadQuartersModel.updateChapterInfo([body.chapterInfo]);
                break;
            }
        }
        AGame.ServiceBuilder.notifyView(notification);
    };
    /////////////////////////////////////////////////////////////////////
    /** 请求获得行营信息,viewChapterId:界面默认显示的章节*/
    HeadQuartersProxy.send_HQ_GET_INFO = function (fightId, chapterId) {
        if (fightId === void 0) { fightId = 0; }
        if (chapterId === void 0) { chapterId = 0; }
        if (fightId > 0) {
            HeadQuartersModel.setFightRecord(fightId);
        }
        console.log("======Get");
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_GET_INFO);
        data.chapterId = chapterId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    HeadQuartersProxy.send_HQ_GET_INFO_OPEN_VIEW = function (fightId, chapterId) {
        if (fightId === void 0) { fightId = 0; }
        if (chapterId === void 0) { chapterId = 0; }
        HeadQuartersProxy.OPEN_HEAD_QUARTER = true;
        this.send_HQ_GET_INFO(fightId, chapterId);
    };
    /** 请求获得行营信息,前一章界面默认显示的章节*/
    HeadQuartersProxy.send_HQ_GET_LAST_INFO = function (fightId, chapterId) {
        if (fightId === void 0) { fightId = 0; }
        if (chapterId === void 0) { chapterId = 0; }
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_GET_INFO);
        data.chapterId = chapterId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 關卡翻頁请求*/
    HeadQuartersProxy.HQ_CHAPTER_INFO = function (chapterId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_CHAPTER_INFO);
        data.chapterId = chapterId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 请求行营扫荡信息 */
    HeadQuartersProxy.send_HQ_CLEAN_UP = function (stageId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_CLEAN_UP);
        data.id = stageId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 请求行营挑战信息 */
    HeadQuartersProxy.send_HQ_CHALLENGES = function (stageId, armyId) {
        // HeadQuartersModel.BattleCheckPointId = stageId;
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_CHALLENGES);
        data.id = stageId;
        data.armyId = armyId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 请求获得宝箱(boxRewardId:包宝箱ID) */
    HeadQuartersProxy.send_HQ_RECEIVE_BOX = function (boxRewardId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_RECEIVE_BOX);
        data.starRewardId = boxRewardId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    /** 行营购买挑战次数 */
    HeadQuartersProxy.send_HQ_BUY_RESET_COUNT = function (moduleId) {
        var data = AGame.ServiceBuilder.newClazz(ProtoDef.HQ_BUY_RESET_COUNT);
        data.moduleId = moduleId;
        AGame.ServiceBuilder.sendMessage(data);
    };
    return HeadQuartersProxy;
}(BaseProxy));
