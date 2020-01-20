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
var com_main;
(function (com_main) {
    var MyHeadRender = /** @class */ (function (_super_1) {
        __extends(MyHeadRender, _super_1);
        function MyHeadRender(data) {
            var _this = _super_1.call(this) || this;
            _this.m_pBattle = null;
            _this.m_pBattle = data;
            if (data.battleId > 0) {
                _this.currentState = "battle";
            }
            else {
                _this.currentState = "base";
            }
            _this.skinName = Utils.getAppSkin("battle_new/gongchengzhan/MyHead.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        MyHeadRender.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            // this.m_pLbNum.text = `${this.m_pBattle.pos}`;
            this.m_pHead.setGenId(this.m_pBattle.mainGid);
            com_main.EventManager.addTouchTapListener(this, this, function (e) {
                // SceneManager.enterScene(SceneEnums.BATTLE_MAP, this.m_pBattle,false);
                // if (this.m_pBattle.battleId > 0) {
                // 	SceneManager.enterScene(SceneEnums.BATTLE_MAP, nextSiege,false);
                // }
                if (BattleModel.getJoinedBattleId() != _this.m_pBattle.battleId) {
                    BattleProxy.send_C2S_WAR_REENTRY_BATTLE(_this.m_pBattle.battleId);
                    WorldModel.setCurWatchTeamId(RoleData.playerId, _this.m_pBattle.teamId);
                }
            });
        };
        MyHeadRender.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
            this.m_pBattle = null;
        };
        return MyHeadRender;
    }(com_main.CComponent));
    com_main.MyHeadRender = MyHeadRender;
})(com_main || (com_main = {}));
