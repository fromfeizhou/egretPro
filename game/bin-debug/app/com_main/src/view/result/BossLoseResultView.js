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
    var BossLoseResultView = /** @class */ (function (_super_1) {
        __extends(BossLoseResultView, _super_1);
        function BossLoseResultView(args) {
            var _this = _super_1.call(this) || this;
            _this.name = BossLoseResultView.NAME;
            _this.initApp("battle_new/result/boss_result_lose_view.exml");
            _this.m_rewards = args.rewards;
            _this.m_battleType = args.battleType;
            _this.m_lastHit = args.lastHit;
            _this.m_rank = args.rank;
            _this.m_damage = args.damage;
            return _this;
        }
        BossLoseResultView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.group_all.scaleX = GameConfig.getBestScale();
            this.group_all.scaleY = GameConfig.getBestScale();
            // this.refreshReward(this.m_rewards);
            this.refreshSettlement(this.m_lastHit, this.m_rank, this.m_damage);
            this.actionGroup.addEventListener("complete", this.onTweenComplete, this);
            this.actionGroup.play();
            this.addEvent();
        };
        BossLoseResultView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
        };
        /**显示结算信息 */
        BossLoseResultView.prototype.refreshSettlement = function (lastHit, rank, damage) {
            this.m_notRank.visible = rank <= 0 ? true : false;
            this.m_labRank.visible = rank <= 0 ? false : true;
            this.m_labRank.text = GCodeFromat(CLEnum.RANK_NUM, rank);
            this.m_labDamage.text = damage + '';
        };
        /**
         * 动画组播放完成
         */
        BossLoseResultView.prototype.onTweenComplete = function () {
            this.actionItem1.play();
        };
        BossLoseResultView.NAME = "BossLoseResultView";
        return BossLoseResultView;
    }(com_main.ResultView));
    com_main.BossLoseResultView = BossLoseResultView;
})(com_main || (com_main = {}));
