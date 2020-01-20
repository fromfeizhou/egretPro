var PvpArenaModel = /** @class */ (function () {
    function PvpArenaModel() {
    }
    PvpArenaModel.init = function () {
        debug("PvpArenaModel:init-------->>");
        this.m_pChallengedCount = 0;
        this.m_pBuyCount = 0;
        this.m_pIsChallenge = false;
        this.m_pRank = Number.MAX_VALUE;
    };
    PvpArenaModel.clear = function () {
        this.init();
    };
    Object.defineProperty(PvpArenaModel, "ChallengedCount", {
        /**已挑战次数 */
        get: function () {
            return this.m_pChallengedCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PvpArenaModel, "DefaultCount", {
        /**默认可挑战次数 */
        get: function () {
            return ConstUtil.getValue(IConstEnum.CONST_CHALLENGE_NUM);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PvpArenaModel, "AllChallengeCount", {
        /**总次数 */
        get: function () {
            return this.DefaultCount + this.BuyCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PvpArenaModel, "CanChallengeCount", {
        /**可挑战次数 */
        get: function () {
            return this.AllChallengeCount - this.ChallengedCount;
        },
        enumerable: true,
        configurable: true
    });
    /**可挑战次数 */
    PvpArenaModel.getFightLeftTimes = function () {
        if (!FunctionModel.isFunctionOpen(FunctionType.APK))
            return 0;
        return this.CanChallengeCount;
    };
    Object.defineProperty(PvpArenaModel, "IsChallenge", {
        get: function () {
            return this.m_pIsChallenge;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PvpArenaModel, "BuyCount", {
        get: function () {
            return this.m_pBuyCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PvpArenaModel, "Rank", {
        get: function () {
            return this.m_pRank;
        },
        enumerable: true,
        configurable: true
    });
    PvpArenaModel.setRank = function (rank) {
        this.m_pRank = rank <= 0 ? Number.MAX_VALUE : rank;
    };
    PvpArenaModel.initPvpArenaInfo = function (data) {
        this.m_pChallengedCount = data.challengeCount || 0;
        this.m_pBuyCount = data.buyCount || 0;
        this.m_pIsChallenge = data.challenged || false;
        this.m_pRank = data.rank <= 0 ? Number.MAX_VALUE : data.rank;
        com_main.EventMgr.dispatchEvent(ArenaEvent.ARENA_UPDATE_NUM, null);
    };
    PvpArenaModel.setBuyNum = function (data) {
        this.m_pBuyCount = data.buyCount;
        this.m_pChallengedCount = data.challengeCount;
        com_main.EventMgr.dispatchEvent(ArenaEvent.ARENA_UPDATE_NUM, null);
    };
    PvpArenaModel.OnFastChallenge = function (data) {
        if (data.message) {
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, data.message);
        }
        this.m_pChallengedCount++;
        com_main.EventMgr.dispatchEvent(ArenaEvent.ARENA_UPDATE_NUM, null);
    };
    return PvpArenaModel;
}());
