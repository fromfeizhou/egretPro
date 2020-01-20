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
     * 剧情对话面板相关
     */
    var GuideIntroductionView = /** @class */ (function (_super_1) {
        __extends(GuideIntroductionView, _super_1);
        function GuideIntroductionView(contentImgList) {
            var _this = _super_1.call(this) || this;
            _this.intervalTime = 100;
            _this.isShowFinish = false;
            _this.finishCount = 0;
            _this.m_callback = null;
            _this.curTextEffectIndex = -1;
            if (contentImgList) {
                _this.m_contentImgList = contentImgList.imgList;
                _this.m_callback = contentImgList.callback;
            }
            _this.name = GuideIntroductionView.NAME;
            _this.skinName = Utils.getComSkin("guide/guide_introduction_view_skin.exml");
            return _this;
            // let tempData = data.stepData.param;
            // if (tempData && tempData != '') {
            //     this.viewData = JSON.parse(tempData);
            // }
            // this.callbackObj = data.obj;
            // this.callback = data.callback;
        }
        /**处理协议号事件 */
        GuideIntroductionView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
        };
        GuideIntroductionView.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
            if (this.m_contentImgList) {
                window["ta"].track('novice_guide', { step: 10005 + "", 'trigger_time': new Date() });
                SceneResGroupCfg.clearModelRes([ModuleEnums.GUIDE_INDRO]);
            }
            else {
                window["ta"].track('novice_guide', { step: 10001 + "", 'trigger_time': new Date() });
            }
            Sound.stopAllEffect();
        };
        GuideIntroductionView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            //切换图片
            if (this.m_contentImgList) {
                // this.m_pText_s.source = this.m_contentImgList[0];
                // this.m_pText1.source = this.m_contentImgList[1];
                this.m_pText2.source = this.m_contentImgList[0];
                this.m_pText3.source = this.m_contentImgList[1];
                // this.m_pText4.source = this.m_contentImgList[4];
                // this.m_pText_e.source = this.m_contentImgList[5];       
                this.m_pText_s.visible = false;
                this.m_pText1.visible = false;
                this.m_pText4.visible = false;
                this.m_pText_e.visible = false;
                this.curTextEffectIndex = 1;
                this.m_bgImg.source = 'GuideIntroBg1_jpg';
            }
            this.isShowFinish = false;
            Tween.get(this.m_pEffect_0, { loop: true })
                .to({ alpha: 0 }, 1000)
                .to({ alpha: 1 }, 1000);
            Tween.get(this.m_pEffect_1, { loop: true })
                .to({ alpha: 0 }, 1000)
                .to({ alpha: 1 }, 1000);
            var tempMc = new MCDragonBones();
            tempMc.initAsync(IETypes.EUI_HX);
            this.m_pRoot.addChild(tempMc);
            tempMc.play(IETypes.EUI_HX);
            tempMc.x = this.m_pRoot.width * 0.5;
            tempMc.y = this.m_pRoot.height * 0.5;
            tempMc.touchChildren = false;
            tempMc.touchEnabled = false;
            this.m_pMc = tempMc;
            this.maskList = [];
            this.textIconList = [];
            for (var index = 0; index < 6; index++) {
                var key = "m_pText" + index;
                var maskKey = "m_pTextMask" + index;
                if (this[key]) {
                    this[key].mask = this[maskKey];
                    this.textIconList.push(this[key]);
                    this.maskList.push(this[maskKey]);
                }
            }
            Utils.TimerManager.doTimer(1000, 1, this.playTextEffect, this);
            com_main.EventManager.addTouchTapListener(this.m_pClick, this, this.onClickView);
            com_main.EventManager.addTouchTapListener(this.m_pSkipRoot, this, this.onclickSkip);
            Sound.stop(SoundData.getLoginSound());
            if (this.m_contentImgList) {
            }
            else {
                Sound.playID(6000);
            }
        };
        GuideIntroductionView.prototype.playTextEffect = function () {
            this.curTextEffectIndex++;
            this.showTextEffect();
        };
        GuideIntroductionView.prototype.showTextEffect = function () {
            var _this = this;
            if ((!this.m_contentImgList && this.curTextEffectIndex < this.maskList.length) || (this.m_contentImgList && this.curTextEffectIndex < 4)) {
                var item = this.textIconList[this.curTextEffectIndex];
                var maskItem = this.maskList[this.curTextEffectIndex];
                Tween.removeTweens(maskItem);
                this.m_pEffect_2.x = item.x;
                this.m_pEffect_2.y = item.y;
                this.m_pEffect_2.visible = true;
                this.m_maskItem = maskItem;
                Tween.get(maskItem).to({ height: item.height }, 1500).call(function () {
                    _this.playTextEffect();
                });
                var target = item.y + item.height;
                Tween.get(this.m_pEffect_2).to({ y: target }, 1500).call(function () {
                    _this.m_pEffect_2.visible = false;
                });
            }
            else {
                this.isShowFinish = true;
            }
        };
        GuideIntroductionView.prototype.doNextAction = function () {
            if (this.m_contentImgList) {
                com_main.UpManager.close();
            }
            else {
                egret.Tween.removeTweens(this.m_pRoot);
                Tween.get(this.m_pRoot)
                    .to({ alpha: 0 }, 200, egret.Ease.sineOut).call(function () {
                    BattleVideoUtil.load();
                }, this);
                this.m_pClick.visible = false;
            }
            if (this.m_callback) {
                this.m_callback.call(this);
            }
        };
        GuideIntroductionView.prototype.onClickView = function () {
            if (this.isShowFinish) {
                this.doNextAction();
            }
        };
        GuideIntroductionView.prototype.onclickSkip = function () {
            Utils.TimerManager.remove(this.playTextEffect, this);
            if (this.m_maskItem)
                Tween.removeTweens(this.m_maskItem);
            if (this.m_pEffect_2)
                Tween.removeTweens(this.m_pEffect_2);
            this.doNextAction();
        };
        GuideIntroductionView.prototype.onStrItemShowFinish = function () {
            this.finishCount++;
        };
        GuideIntroductionView.prototype.createTitleLabel = function () {
            var group = new eui.Group();
            group.width = 80;
            var label = new egret.TextField();
            label.fontFamily = "Microsoft YaHei";
            label.textColor = GameConfig.TextColors.white;
            label.verticalAlign = egret.VerticalAlign.MIDDLE;
            label.width = 50;
            label.size = 40;
            group.addChild(label);
            this.m_pTextRoot.addChildAt(group, 0);
            return label;
        };
        GuideIntroductionView.NAME = 'GuideIntroductionView';
        return GuideIntroductionView;
    }(com_main.CView));
    com_main.GuideIntroductionView = GuideIntroductionView;
})(com_main || (com_main = {}));
