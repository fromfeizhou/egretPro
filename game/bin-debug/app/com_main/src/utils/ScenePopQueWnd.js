/**场景队列弹窗 */
var ScenePopQueWnd = /** @class */ (function () {
    function ScenePopQueWnd() {
    }
    /**是否存在未处理弹窗 */
    ScenePopQueWnd.hasQueWnd = function () {
        if (this.isQueScene()) {
            if (this.m_kingchangeList.length > 0)
                return true;
            if (this.m_tActNotice.length > 0)
                return true;
            if (this.m_bOffLine)
                return true;
            if (this.m_tPopAwardView)
                return true;
            if (this.m_bLevel)
                return true;
            if (this.m_giftbag)
                return true;
            if (this.m_tFuncOpens.length > 0)
                return true;
            // if (this.m_bFight) return true;
            if (this.m_emperorList.length > 0)
                return true;
        }
        return false;
    };
    /**是否弹窗场景 */
    ScenePopQueWnd.isQueScene = function () {
        var sceneEnum = SceneManager.getCurrScene();
        if (sceneEnum == SceneEnums.MAIN_CITY || sceneEnum == SceneEnums.WORLD_CITY || sceneEnum == SceneEnums.AUTO_BATTLE_MAP) {
            return true;
        }
        return false;
    };
    /**升级界面 */
    ScenePopQueWnd.addLevelWnd = function () {
        this.m_bLevel = true;
    };
    /**gm推送礼包界面 */
    ScenePopQueWnd.addGiftbagWnd = function () {
        this.m_giftbag = true;
    };
    /**离线收益界面 */
    ScenePopQueWnd.addOffLineWnd = function () {
        if (RoleData.offlineStamp > 0) {
            var time = TimerUtils.getServerTime() - RoleData.offlineStamp;
            if (time > 300)
                this.m_bOffLine = true;
        }
    };
    /**收益变动界面 */
    ScenePopQueWnd.addRewardWnd = function (param) {
        this.m_tPopAwardView = param;
    };
    /**升级界面 */
    ScenePopQueWnd.addFightWnd = function () {
        // this.m_bFight = true;
        if (GeneralModel.FIGHT_RECORD == 0)
            return;
        var nowFight = GeneralModel.getGeneralTotalFight();
        if (GeneralModel.FIGHT_RECORD == nowFight) {
            return;
        }
        else if (nowFight > GeneralModel.FIGHT_RECORD) {
            //弹出战力变动界面
            Utils.open_view(TASK_UI.NOR_FIGHT_VIEW, nowFight);
        }
        else {
            GeneralModel.FIGHT_RECORD = nowFight;
        }
    };
    /**添加新功能预告队列 */
    ScenePopQueWnd.addNewFuctionAnim = function (ftList) {
        if (ftList && ftList.length > 0) {
            var len = ftList.length;
            for (var i = 0; i < len; i++) {
                var ft = ftList[i];
                var cfg = FunctionModel.getFunctionCfgById(ft);
                if (cfg.isRemind == 1) {
                    this.m_tFuncOpens.push(ft);
                }
                else {
                    //直接添加
                    com_main.EventMgr.dispatchEvent(FunctionEvent.NEW_FUNC_OPEN, { funcId: ft, show: true });
                    FunctionModel.addNewFunc(ft);
                }
            }
        }
    };
    /**添加新的活动通告 */
    ScenePopQueWnd.addNewActNotice = function () {
        var actList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            actList[_i] = arguments[_i];
        }
        if (isNull(actList))
            return;
        var len = actList.length;
        if (len == 0)
            return;
        for (var i = 0; i < len; i++) {
            this.m_tActNotice.push(actList[i]);
        }
    };
    /**添加称王变化 */
    ScenePopQueWnd.addKingNotice = function () {
        var noticeList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            noticeList[_i] = arguments[_i];
        }
        if (isNull(noticeList))
            return;
        var len = noticeList.length;
        if (len == 0)
            return;
        for (var i = 0; i < len; i++) {
            this.m_kingchangeList.push(noticeList[i]);
        }
    };
    /**添加称帝公告 */
    ScenePopQueWnd.addEmperorNotice = function () {
        var noticeList = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            noticeList[_i] = arguments[_i];
        }
        if (isNull(noticeList))
            return;
        var len = noticeList.length;
        if (len == 0)
            return;
        for (var i = 0; i < len; i++) {
            this.m_emperorList.push(noticeList[i]);
        }
    };
    /**
     *检查弹窗队列
     * @return 是否激活动画（新手检测需要判断）
     */
    ScenePopQueWnd.checkQueQue = function () {
        if (!this.isQueScene())
            return;
        if (this.m_kingchangeList.length > 0) {
            var notice = this.m_kingchangeList.shift();
            Utils.open_view(TASK_UI.COUNTRY_CORONATION_PANEL, notice);
            return;
        }
        if (this.m_emperorList.length > 0) {
            var notice = this.m_emperorList.shift();
            Utils.open_view(TASK_UI.POP_ACTIVITY_EMPEROR_CORONATION, notice);
            return;
        }
        if (this.m_tActNotice.length > 0) {
            var act = this.m_tActNotice.shift();
            Utils.open_view(TASK_UI.COM_ACT_NOTICE, act);
            return;
        }
        //离线奖励弹窗
        if (this.m_bOffLine) {
            Utils.open_view(TASK_UI.POS_PATROL_OFFLINE_REWARD_VIEW);
            this.m_bOffLine = false;
            return;
        }
        if (this.m_tPopAwardView) {
            Utils.open_view(TASK_UI.POS_PATROL_REWARD_CHANGE_VIEW, this.m_tPopAwardView);
            this.m_tPopAwardView = null;
            return;
        }
        if (this.m_bLevel) {
            // Utils.open_view(TASK_UI.PLAYER_LEVEL_UP_VIEW, { id: RoleData.level, type: LevelUpConditionType.ROLE_LEVEL });
            Utils.open_view(TASK_UI.POP_ROLE_LEVEL_PANEL);
            this.m_bLevel = false;
            return;
        }
        if (this.m_tFuncOpens.length > 0) {
            var ft = this.m_tFuncOpens.shift();
            FunctionModel.addNewFunc(ft);
            Utils.open_view(TASK_UI.POP_FUNCITON_NEW_VIEW, ft);
            return;
        }
        if (this.m_giftbag) {
            Utils.open_view(TASK_UI.POP_ACTIVITY_GIFTBAG_TIP_POP, { type: 1, giftId: GiftBagModel.jumpId });
            this.m_giftbag = false;
        }
        // if(this.m_bFight){
        // 	this.m_bFight = false;
        // 	let nowFight = GeneralModel.getGeneralTotalFight();
        // 	if(GeneralModel.FIGHT_RECORD == nowFight){
        // 		SceneManager.onSceneWndEnter();
        // 	}else{
        // 		//弹出战力变动界面
        // 		Utils.open_view(TASK_UI.NOR_FIGHT_VIEW, nowFight);
        // 	}
        // }
    };
    ScenePopQueWnd.m_tFuncOpens = []; /**功能开放队列 */
    ScenePopQueWnd.m_kingchangeList = []; //称王
    ScenePopQueWnd.m_tActNotice = [];
    /**升级界面 */
    ScenePopQueWnd.m_bLevel = false;
    /**离线收益 */
    ScenePopQueWnd.m_bOffLine = false;
    /**战力变动 */
    // private static m_bFight = false;
    /**gm推送礼包 */
    ScenePopQueWnd.m_giftbag = false;
    ScenePopQueWnd.m_emperorList = []; //称帝
    return ScenePopQueWnd;
}());
