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
    var BossSuccessResultView = /** @class */ (function (_super_1) {
        __extends(BossSuccessResultView, _super_1);
        function BossSuccessResultView(args) {
            var _this = _super_1.call(this) || this;
            _this.m_isPlayEff = true; //是否播放动画
            _this.name = BossSuccessResultView.NAME;
            _this.initApp("battle_new/result/boss_result_win_view.exml");
            _this.m_rewards = args.rewards;
            _this.m_battleType = args.battleType;
            _this.m_lastHit = args.lastHit;
            _this.m_rank = args.rank;
            _this.m_damage = args.damage;
            return _this;
        }
        BossSuccessResultView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.group_all.scaleX = GameConfig.getBestScale();
            this.group_all.scaleY = GameConfig.getBestScale();
            this.refreshSettlement(this.m_lastHit, this.m_rank, this.m_damage);
            this.refreshReward(this.m_rewards);
            this.actionGroup.addEventListener("complete", this.onTweenComplete, this);
            this.actionGroup.play();
            this.addEvent();
        };
        BossSuccessResultView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
        };
        BossSuccessResultView.prototype.onclickButtonContinue = function () {
            if (this.m_isPlayEff) {
                this.actionItem2.play();
                this.m_isPlayEff = false;
                return;
            }
            _super_1.prototype.onclickButtonContinue.call(this);
        };
        /**显示结算信息 */
        BossSuccessResultView.prototype.refreshSettlement = function (lastHit, rank, damage) {
            this.reward_group.visible = lastHit;
            this.m_notRank.visible = rank <= 0 ? true : false;
            this.m_labRank.visible = rank <= 0 ? false : true;
            this.m_labRank.text = GCodeFromat(CLEnum.RANK_NUM, rank);
            this.m_labDamage.text = damage + '';
        };
        BossSuccessResultView.prototype.refreshReward = function (rewards) {
            // let reward = rewards;
            var reward = PropModel.filterItemList(rewards);
            for (var i = 0; i < 4 && i < reward.length; i++) {
                var element = reward[i];
                var itemId = element.itemId;
                var count = element.count;
                var item = com_main.ComItemNew.create("count");
                item.setItemInfo(itemId, count);
                this.group_itemList.addChild(item);
            }
            for (var i = 4; i < 8 && i < reward.length; i++) {
                var element = reward[i];
                var itemId = element.itemId;
                var count = element.count;
                var item = com_main.ComItemNew.create("count");
                item.setItemInfo(itemId, count);
                this.group_itemList1.addChild(item);
            }
        };
        /**
         * 动画组播放完成
         */
        BossSuccessResultView.prototype.onTweenComplete = function () {
            this.actionItem1.play();
        };
        // private shakeImage: eui.Image;
        // private renderTexture: egret.RenderTexture;
        BossSuccessResultView.NAME = "BossSuccessResultView";
        return BossSuccessResultView;
    }(com_main.ResultView));
    com_main.BossSuccessResultView = BossSuccessResultView;
})(com_main || (com_main = {}));
