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
//结算界面基类
var com_main;
(function (com_main) {
    var ResultView = /** @class */ (function (_super_1) {
        __extends(ResultView, _super_1);
        function ResultView() {
            var _this = _super_1.call(this) || this;
            _this.countdownSceond = 9;
            _this.shakeNum = 0;
            return _this;
            // this.renderTexture = new egret.RenderTexture();
            // this.renderTexture.drawToTexture(GameConfig.curStage(), new egret.Rectangle(0, 0, GameConfig.curWidth(), GameConfig.curHeight()));
        }
        ResultView.prototype.addEvent = function () {
            this.button_continue.setTitleLabel(GCodeFromat(CLEnum.RESULT_SURE, 9));
            Utils.TimerManager.doTimer(1000, 0, this.countdown, this);
            this.button_continue["sound_queren"] = SoundData.getSureSound();
            com_main.EventManager.addTouchScaleListener(this.button_continue, this, this.onclickButtonContinue);
            this.actionGroup.addEventListener("itemComplete", this.onTweenItemComplete, this);
            // this.shakeImage.texture = this.renderTexture;
            if (this.button_next) {
                this.button_next.setTitleLabel('下一关');
                this.button_next["sound_queren"] = SoundData.getSureSound();
                com_main.EventManager.addTouchScaleListener(this.button_next, this, this.onclickNext);
            }
        };
        ResultView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
            this.actionGroup.removeEventListener("itemComplete", this.onTweenItemComplete, this);
            if (this.sueecssEffect) {
                this.sueecssEffect.destroy();
            }
            Utils.TimerManager.remove(this.countdown, this);
        };
        ResultView.prototype.onclickButtonContinue = function () {
            Utils.TimerManager.remove(this.countdown, this);
            com_main.UpManager.history();
            BattleModel.exitBattle(this.m_battleType);
        };
        ResultView.prototype.onclickNext = function () {
        };
        ResultView.prototype.showSingleBtn = function () {
            this.button_continue.currentState = 'style2';
            this.button_continue.horizontalCenter = 0;
            if (this.button_next) {
                this.button_next.visible = false;
            }
        };
        ResultView.prototype.frame_event = function (evt) {
            // console.log( " 播放到了一个关键帧！ 帧标签为：",evt.frameLabel);
            if (evt.frameLabel == "startEnd") {
                this.sueecssEffect.play("xunhuan", 0);
            }
            // else if (evt.frameLabel == "shake") {
            // 	this.shakeNum += 1;
            // 	EffectUtils.shakeScreen(this.shakeImage, 3, () => { 
            // 		console.log("this.shakeNum",this.shakeNum); 
            // 		if (this.shakeNum == 2) Utils.removeFromParent(this.shakeImage); },this);
            // }
        };
        /**
         * 动画组中的一项播放完成
         */
        ResultView.prototype.onTweenItemComplete = function (event) {
            var item = event.data;
            if (this.rect == item.target) {
                this.createEffect();
                com_main.EventManager.addTouchTapListener(this.group_all, this, this.onclickButtonContinue);
            }
        };
        ResultView.prototype.createEffect = function () {
            var effectMC = new MCDragonBones();
            effectMC.initAsync("EResult_Success");
            effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.frame_event, this);
            effectMC.play("start", 0);
            this.sueecssEffect_group.addChild(effectMC);
            this.sueecssEffect = effectMC;
        };
        ResultView.prototype.countdown = function () {
            this.countdownSceond = this.countdownSceond - 1;
            if (this.countdownSceond < 0) {
                this.onclickButtonContinue();
                return;
            }
            this.button_continue.setTitleLabel(GCodeFromat(CLEnum.RESULT_SURE, this.countdownSceond));
        };
        return ResultView;
    }(com_main.CView));
    com_main.ResultView = ResultView;
})(com_main || (com_main = {}));
