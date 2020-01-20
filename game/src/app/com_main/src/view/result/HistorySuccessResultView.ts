module com_main {
    export class HistorySuccessResultView extends ResultView {
        private m_rewards: any;
        private star: number;
        private gkId: number;
        private condition: number[];
        public sueecssEffect: MCDragonBones;
        ///////////////////////////////////////////////////////////////
        public actionGroup: egret.tween.TweenGroup;
        public star1Action: egret.tween.TweenGroup;
        public star2Action: egret.tween.TweenGroup;
        public star3Action: egret.tween.TweenGroup;
        public itemAndbtnAction: egret.tween.TweenGroup;
        public itemAndbtnAction1: egret.tween.TweenGroup;

        public rect: eui.Rect;
        public group_all: eui.Group;
        public shake_group: eui.Group;
        public border_1037: eui.Image;
        public border_1001: eui.Image;
        public line_005_1: eui.Image;
        public line_005_2: eui.Image;
        public reward_group: eui.Group;
        public lb_title: eui.Label;
        public line_003_1: eui.Image;
        public line_003_0: eui.Image;
        public group_itemList: eui.Group;
        public star1: eui.Group;
        public image1: eui.Image;
        public labelGray1: eui.Label;
        public star2: eui.Group;
        public image2: eui.Image;
        public label0: eui.Label;
        public imageGray2: eui.Image;
        public labelGray2: eui.Label;
        public star3: eui.Group;
        public image3: eui.Image;
        public label1: eui.Label;
        public imageGray3: eui.Image;
        public labelGray3: eui.Label;
        public button_group: eui.Group;
        public button_continue: com_main.ComButton;
        public sueecssEffect_group: eui.Group;


        public static NAME = "HistorySuccessResultView";
        public constructor(args) {
            super();

            this.name = HistorySuccessResultView.NAME;
            this.initApp("battle_new/result/guanka_result_view.exml");

            this.m_rewards = args.rewards;
            this.star = args.star;
            this.condition = args.condition;
            this.gkId = args.gkId;
            this.m_battleType = CheckPointType.HISTORY_WAR;
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.group_all.scaleX = GameConfig.getBestScale();
            this.group_all.scaleY = GameConfig.getBestScale();

            this.labelGray1.text = GLan(C.HistoryWarStarConfig[this.gkId].oneStarConfig);
            this.labelGray2.text =this.label0.text= GLan(C.HistoryWarStarConfig[this.gkId].twoStarConfig);
            this.labelGray3.text =this.label1.text= GLan(C.HistoryWarStarConfig[this.gkId].threeStarConfig);
            this.refreshReward(this.m_rewards);

            this.actionGroup.addEventListener("complete", this.wordFlyActionComplete, this);
            // this.actionGroup.addEventListener("itemComplete", this.onTweenItemComplete, this);
            this.star1Action.addEventListener("complete", this.starActionComplete, this);
            this.star2Action.addEventListener("complete", this.starActionComplete, this);
            this.star3Action.addEventListener("complete", this.starActionComplete, this);

            this.actionGroup.play();

            super.addEvent();

            this.showSingleBtn();

        }
        public onDestroy(): void {
            super.onDestroy();

            this.actionGroup.removeEventListener("complete", this.wordFlyActionComplete, this);
            // this.actionGroup.removeEventListener("itemComplete", this.onTweenItemComplete, this);
            this.star1Action.removeEventListener("complete", this.starActionComplete, this);
            this.star2Action.removeEventListener("complete", this.starActionComplete, this);
            this.star3Action.removeEventListener("complete", this.starActionComplete, this);
        }

        private refreshReward(rewards) {

            // let reward = rewards;
            let reward = PropModel.filterItemList(rewards);
            for (var key in reward) {
                if (reward.hasOwnProperty(key)) {
                    var element = reward[key];
                    let itemId = element.itemId;
                    let baseType = element.baseType;
                    let count = element.count;
                    let item = ComItemNew.create("name_num");
                    item.setItemInfo(itemId, count);
                    this.group_itemList.addChild(item);
                }
            }
        }

        public wordFlyActionComplete() {
            if (this.star == 1) {
                this.star1Action.play();
            } else if (this.star == 2) {
                this.star2Action.play();
            } else if (this.star == 3) {
                this.star3Action.play();
            } else {
                this.itemAndbtnAction1.play();
            }

        }

        private starActionComplete() {
            this.itemAndbtnAction.play();
        }

    }
}