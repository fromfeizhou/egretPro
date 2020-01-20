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
    var ArenaSuccessResultView = /** @class */ (function (_super_1) {
        __extends(ArenaSuccessResultView, _super_1);
        function ArenaSuccessResultView(args) {
            var _this = _super_1.call(this) || this;
            _this.name = ArenaSuccessResultView.NAME;
            _this.initApp("battle_new/result/arena_result_view.exml");
            _this.m_rewards = args.rewards;
            _this.m_battleType = args.battleType;
            _this.shakeNum = 0;
            _this.m_arenaId = args.arenaId;
            return _this;
        }
        ArenaSuccessResultView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.group_all.scaleX = GameConfig.getBestScale();
            this.group_all.scaleY = GameConfig.getBestScale();
            this.refreshReward(this.m_rewards);
            this.actionGroup.play();
            this.actionGroup.addEventListener("complete", this.onTweenComplete, this);
            _super_1.prototype.addEvent.call(this);
            if (this.m_battleType != CheckPointType.ARENA || this.m_arenaId == 500) {
                this.showSingleBtn();
            }
        };
        ArenaSuccessResultView.prototype.onclickNext = function () {
            BattleModel.challengeNext(this.m_battleType);
        };
        ArenaSuccessResultView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
        };
        ArenaSuccessResultView.prototype.refreshReward = function (rewards) {
            // let reward = rewards;
            var reward = PropModel.filterItemList(rewards);
            for (var i = 0; i < 4 && i < reward.length; i++) {
                var element = reward[i];
                var itemId = element.itemId;
                var count = element.count;
                var item = com_main.ComItemNew.create("name_num");
                item.setItemInfo(itemId, count);
                this.group_itemList.addChild(item);
            }
            for (var i = 4; i < 8 && i < reward.length; i++) {
                var element = reward[i];
                var itemId = element.itemId;
                var count = element.count;
                var item = com_main.ComItemNew.create("name_num");
                item.setItemInfo(itemId, count);
                this.group_itemList1.addChild(item);
            }
        };
        /**
         * 动画组播放完成
         */
        ArenaSuccessResultView.prototype.onTweenComplete = function () {
            if (this.m_rewards.length <= 4) {
                this.actionItem1.play();
            }
            else {
                this.actionItem2.play();
            }
        };
        ArenaSuccessResultView.NAME = "ArenaSuccessResultView";
        return ArenaSuccessResultView;
    }(com_main.ResultView));
    com_main.ArenaSuccessResultView = ArenaSuccessResultView;
})(com_main || (com_main = {}));
