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
    var BattleResultFaliView = /** @class */ (function (_super_1) {
        __extends(BattleResultFaliView, _super_1);
        function BattleResultFaliView(checkPointType) {
            var _this = _super_1.call(this) || this;
            _this.countdownSceond = 9;
            _this.name = BattleResultFaliView.NAME;
            _this.m_checkPointType = checkPointType;
            // this.renderTexture = new egret.RenderTexture();
            // this.renderTexture.drawToTexture(GameConfig.curStage(), new egret.Rectangle(0, 0, GameConfig.curWidth(), GameConfig.curHeight()));
            _this.initApp("battle_new/result/result_fail_view.exml");
            return _this;
        }
        BattleResultFaliView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.button_exit.setTitleLabel(GCode(CLEnum.RESULT_EXIT));
            Utils.TimerManager.doTimer(1000, 0, this.countdown, this);
            com_main.EventManager.addTouchScaleListener(this.button_exit, this, this.onclickButtonExit);
            com_main.EventManager.addTouchScaleListener(this.g_btn_1, this, this.onclickFun1);
            com_main.EventManager.addTouchScaleListener(this.g_btn_2, this, this.onclickFun2);
            com_main.EventManager.addTouchScaleListener(this.g_btn_3, this, this.onclickFun3);
            com_main.EventManager.addTouchTapListener(this.group_all, this, this.onclickButtonExit);
            this.actionGroup.play();
            this.actionGroup.addEventListener("itemComplete", this.onTweenItemComplete, this);
            this.actionGroup.addEventListener("complete", this.onAllComplete, this);
            // this.shakeImage.texture = this.renderTexture;
        };
        BattleResultFaliView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.countdown, this);
        };
        BattleResultFaliView.prototype.onclickButtonExit = function () {
            Utils.TimerManager.remove(this.countdown, this);
            com_main.UpManager.close();
            BattleModel.exitBattle(this.m_checkPointType);
        };
        BattleResultFaliView.prototype.onclickFun1 = function () {
            SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
            Utils.open_view(TASK_UI.POP_GENERAL_OPEN_INFO_VIEW);
        };
        BattleResultFaliView.prototype.onclickFun2 = function () {
            SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
            Utils.open_view(TASK_UI.POP_EQUIP_MAIN_WND);
        };
        BattleResultFaliView.prototype.onclickFun3 = function () {
            SceneManager.enterScene(SceneEnums.AUTO_BATTLE_MAP);
            Utils.open_view(TASK_UI.TAVERN_MAIN_PANEL);
        };
        /**
         * 动画组中的一项播放完成
         */
        BattleResultFaliView.prototype.onTweenItemComplete = function (event) {
            var _this = this;
            var item = event.data;
            if (this.image_result_1 == item.target) {
                EffectUtils.shakeScreen(this.shakeImage, 3);
            }
            else if (this.image_result_2 == item.target) {
                EffectUtils.shakeScreen(this.shakeImage, 3, function () { Utils.removeFromParent(_this.shakeImage); });
            }
        };
        BattleResultFaliView.prototype.onAllComplete = function () {
            // EventMgr.dispatchEvent(GuideEvent.GUIDE_BATTLE_WIN_COMPOUND_ANI, null);
        };
        BattleResultFaliView.prototype.countdown = function () {
            this.countdownSceond = this.countdownSceond - 1;
            if (this.countdownSceond < 0) {
                this.onclickButtonExit();
                return;
            }
            this.button_exit.setTitleLabel(GCodeFromat(CLEnum.RESULT_SURE, this.countdownSceond));
        };
        // private renderTexture: egret.RenderTexture;
        BattleResultFaliView.NAME = "BattleResultFaliView";
        return BattleResultFaliView;
    }(com_main.CView));
    com_main.BattleResultFaliView = BattleResultFaliView;
})(com_main || (com_main = {}));
