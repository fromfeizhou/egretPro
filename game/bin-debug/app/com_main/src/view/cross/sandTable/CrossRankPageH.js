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
    /**
     * 荣誉累计奖励
     */
    var CrossRankPageH = /** @class */ (function (_super_1) {
        __extends(CrossRankPageH, _super_1);
        function CrossRankPageH() {
            var _this = _super_1.call(this) || this;
            _this.m_bIsRotateAction = true;
            /**当前的奖励阶段 */
            _this.m_nCurAwardPro = 0;
            _this.m_nBoxId = 0;
            _this.isLeft = false;
            _this.m_maxNum = 0;
            _this.name = CrossRankPageH.NAME;
            _this.initApp("cross/sandTable/CrossRankPageHSkin.exml");
            _this.validateNow();
            return _this;
        }
        CrossRankPageH.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_CROSS_SERVER_GET_HONOR_BOX,
            ];
        };
        /**处理协议号事件 */
        CrossRankPageH.prototype.executes = function (notification) {
            var _this = this;
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_CROSS_SERVER_GET_HONOR_BOX: {
                    var data_1 = body;
                    this.updateBoxState();
                    this.updateBoxBtnState();
                    this.showUpGradeEffect();
                    // /**领完奖之后跳到下一个 */
                    this.onRightHandler();
                    this.timeKey = egret.setTimeout(function () {
                        CrossModel.receiveHonorBox(data_1.boxId);
                        egret.clearTimeout(_this.timeKey);
                    }, this, 200);
                    break;
                }
            }
        };
        CrossRankPageH.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        CrossRankPageH.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
            this.stopAction();
            this.clearEffect();
        };
        CrossRankPageH.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            Utils.toStageBestScaleHeigt(this);
            this.m_pOpenBox.setTitleLabel(GCode(CLEnum.EXPLOIT_KQBX));
            this.m_tCollections = new eui.ArrayCollection([]);
            this.m_itemList.dataProvider = this.m_tCollections;
            this.m_itemList.itemRenderer = com_main.ExploitAwardRender;
            var militoryList = CrossModel.getDoneHonorBoxList();
            /**已经到了哪个阶段 */
            this.m_bIsAction = false;
            this.m_nLocalY = this.m_iconRoot.bottom;
            this.m_maxNum = CrossModel.getCrossServerRewardConfigByType(3 /* HONOR */).length;
            this.m_nCurAwardPro = militoryList && militoryList.length > 0 ? militoryList.length + 1 : 1;
            this.m_nCurAwardPro = this.m_nCurAwardPro > this.m_maxNum ? this.m_maxNum : this.m_nCurAwardPro;
            var cfgs = CrossModel.getCrossServerRewardConfigByType(3 /* HONOR */);
            this.m_nBoxId = cfgs[this.m_nCurAwardPro - 1].id;
            this.refreshView();
            this.changeIndex(this.m_nCurAwardPro);
            this.addEvent();
            this.createEffect();
            this.updateBtn();
            // this.createBoxRotate();
        };
        CrossRankPageH.prototype.createBoxRotate = function (isLeft) {
            var _this = this;
            if (isLeft === void 0) { isLeft = 1; }
            this.m_iconRoot.horizontalCenter = 400 * isLeft;
            this.m_iconRoot.alpha = 0;
            var tw = egret.Tween.get(this.m_iconRoot, { loop: true });
            tw.to({ alpha: 1, horizontalCenter: 0 }, 250).call(function () {
                Tween.removeTweens(_this.m_iconRoot);
                _this.m_bIsRotateAction = true;
                _this.refreshView();
            });
            this.m_iconLeftRoot.visible = true;
            this.m_iconLeftRoot.alpha = 1;
            this.m_iconLeftRoot.horizontalCenter = 0;
            var tw1 = egret.Tween.get(this.m_iconLeftRoot, { loop: true });
            tw1.to({ alpha: 0, horizontalCenter: -400 * isLeft }, 250).call(function () {
                Tween.removeTweens(_this.m_iconLeftRoot);
                _this.m_iconLeftRoot.visible = false;
                _this.m_iconLeftRoot.horizontalCenter = 0;
            });
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        CrossRankPageH.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnLeft, this, this.onLeftHandler);
            com_main.EventManager.addTouchScaleListener(this.m_btnRight, this, this.onRightHandler);
            com_main.EventManager.addTouchScaleListener(this.m_pOpenBox, this, this.onAward);
        };
        CrossRankPageH.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /**建造升级完成 */
        CrossRankPageH.prototype.showUpGradeEffect = function () {
            var EBuild_UpGrade = new MCDragonBones();
            EBuild_UpGrade.initAsync(IETypes.EBuild_UpGrade);
            EBuild_UpGrade.play(IETypes.EBuild_UpGrade, 1, true);
            // EBuild_UpGrade.play(IETypes.EBuild_UpGrade)
            EBuild_UpGrade.scaleX = 1.1;
            EBuild_UpGrade.scaleY = 1.1;
            EBuild_UpGrade.x = 0;
            EBuild_UpGrade.y = 0;
            this.m_starRoot.addChild(EBuild_UpGrade);
        };
        /**向左点击 */
        CrossRankPageH.prototype.onLeftHandler = function () {
            var index = this.m_nCurAwardPro - 1;
            this.isLeft = true;
            if (index >= 1)
                this.changeIndex(index);
        };
        CrossRankPageH.prototype.onRightHandler = function () {
            var index = this.m_nCurAwardPro + 1;
            this.isLeft = false;
            if (index <= this.m_maxNum)
                this.changeIndex(index);
        };
        /**选中改变 */
        CrossRankPageH.prototype.changeIndex = function (index) {
            if (this.m_nCurAwardPro == index)
                return;
            this.m_nCurAwardPro = index;
            var cfgs = CrossModel.getCrossServerRewardConfigByType(3 /* HONOR */);
            this.m_nBoxId = cfgs[this.m_nCurAwardPro - 1].id;
            this.createBoxRotate(this.isLeft ? -1 : 1);
            this.updateBtn();
            // this.refreshView();
        };
        /**切换的时候刷新页面 */
        CrossRankPageH.prototype.refreshView = function () {
            this.m_pTitle.text = GCodeFromat(CLEnum.EXPLOIT_AWARD_LV, this.m_nCurAwardPro);
            this.refreshBoxAward();
            this.refreshProgress();
            this.updateBoxBtnState();
            this.updateBoxState();
        };
        /**刷新进度条 */
        CrossRankPageH.prototype.refreshProgress = function () {
            var cfg = C.CrossServerRewardConfig[this.m_nBoxId];
            if (cfg) {
                var progressValue = CrossModel.rankHonor;
                progressValue = Math.min(progressValue, cfg.value);
                this.m_lbExp.text = progressValue + "/" + cfg.value;
                var pro = Math.min(progressValue / cfg.value, 1);
                this.m_imgVipPro.width = CrossRankPageH.PRO_MAX * pro;
            }
            else {
                this.m_imgVipPro.width = 0;
            }
        };
        /**刷新阶段奖励 */
        CrossRankPageH.prototype.refreshBoxAward = function () {
            var cfg = C.CrossServerRewardConfig[this.m_nBoxId];
            if (cfg) {
                var items = cfg.reward;
                this.m_tCollections.replaceAll(items);
            }
        };
        /**更新按钮状态 */
        CrossRankPageH.prototype.updateBoxBtnState = function () {
            this.stopAction();
            if (CrossModel.checkHonorBox(this.m_nBoxId)) {
                this.m_pOpenBox.enabled = true;
                Utils.isGray(false, this.m_pOpenBox);
                this.m_pEffRoot.visible = true;
                this.doAction();
            }
            else {
                this.m_pOpenBox.enabled = false;
                Utils.isGray(true, this.m_pOpenBox);
                this.m_pEffRoot.visible = false;
            }
            if (CrossModel.checkHonorBoxState(this.m_nBoxId)) {
                this.m_pOpenBox.setTitleLabel(GCode(CLEnum.EXPLOIT_YJLQ));
                this.m_pBoxState.visible = true;
                this.m_pOpenBox.visible = false;
            }
            else {
                this.m_pOpenBox.setTitleLabel(GCode(CLEnum.EXPLOIT_KQBX));
                this.m_pBoxState.visible = false;
                this.m_pOpenBox.visible = true;
            }
        };
        /**宝物动画 */
        CrossRankPageH.prototype.doAction = function () {
            if (!this.m_bIsAction && this.m_bIsRotateAction) {
                this.m_bIsAction = true;
                this.m_bIsRotateAction = false;
                var ty = this.m_nLocalY;
                var gap = 20;
                var tw = egret.Tween.get(this.m_iconRoot, { loop: true });
                tw.to({ bottom: ty + gap }, 1500, Ease.sineInOut);
                tw.to({ bottom: ty }, 1500, Ease.sineInOut);
            }
        };
        /**宝物动画 */
        CrossRankPageH.prototype.stopAction = function () {
            if (this.m_bIsAction) {
                egret.Tween.removeTweens(this.m_iconRoot);
                this.m_iconRoot.bottom = this.m_nLocalY;
                this.m_bIsAction = false;
            }
        };
        /**添加背景特效 */
        CrossRankPageH.prototype.createEffect = function () {
            if (!this.m_effBg) {
                this.m_effBg = new MCDragonBones();
                this.m_effBg.initAsync(IETypes.EUI_TreaBg);
                this.m_effBg.play(IETypes.EUI_TreaBg);
                this.m_pEffRoot.addChild(this.m_effBg);
            }
        };
        /**移除背景特效 */
        CrossRankPageH.prototype.clearEffect = function () {
            if (this.m_effBg) {
                this.m_effBg.destroy();
                this.m_effBg = null;
                this.m_pBox.visible = true;
            }
        };
        /**
         * 更新宝箱显示
         */
        CrossRankPageH.prototype.updateBoxState = function () {
            this.m_pBox.source = CrossModel.checkHonorBoxState(this.m_nBoxId) ? "world_icon_bx02_png" : "world_icon_bx01_png";
        };
        CrossRankPageH.prototype.updateBtn = function () {
            this.m_btnLeft.visible = this.m_nCurAwardPro > 1;
            this.m_btnRight.visible = this.m_nCurAwardPro < this.m_maxNum;
        };
        /**
         * 点击领奖
         */
        CrossRankPageH.prototype.onAward = function (pvt) {
            if (this.m_nCurAwardPro > this.m_maxNum)
                return;
            CrossProxy.C2S_CROSS_SERVER_GET_HONOR_BOX(this.m_nBoxId);
        };
        CrossRankPageH.NAME = 'CrossRankPageH';
        CrossRankPageH.PRO_MAX = 480;
        return CrossRankPageH;
    }(com_main.CView));
    com_main.CrossRankPageH = CrossRankPageH;
})(com_main || (com_main = {}));
