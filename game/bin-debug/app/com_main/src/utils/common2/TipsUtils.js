var TipsUtils = /** @class */ (function () {
    function TipsUtils() {
    }
    TipsUtils.showTipsDownToUp = function (str, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        var lblEffect = com_main.PromptTextWnd.create(str, isWarning);
        lblEffect.x = (AGame.R.app.stageWidth) / 2;
        lblEffect.y = (AGame.R.app.stageHeight) / 2;
        lblEffect.alpha = 0;
        lblEffect.anchorOffsetX = lblEffect.width / 2;
        lblEffect.anchorOffsetY = lblEffect.height / 2;
        if (!AGame.R.app.topLevel.contains(lblEffect)) {
            AGame.R.app.topLevel.addChild(lblEffect);
        }
        var self = this;
        var onComplete2 = function () {
            self.removeNormalTipsList(lblEffect.hashCode);
            egret.Tween.removeTweens(lblEffect);
            // Utils.removeFromParent(lblEffect);
            lblEffect.onDestroy();
        };
        var onComplete1 = function () {
            egret.Tween.get(lblEffect)
                .to({ alpha: 0 }, 500)
                .call(onComplete2, self);
        };
        this.m_pDownToUpDatas.unshift(lblEffect);
        if (this.m_pDownToUpDatas.length >= 2 && !this.m_bInTipsFunc) {
            this.m_bInTipsFunc = true;
            Utils.TimerManager.doFrame(1, 0, this.onNormalTipsTick, this);
        }
        egret.Tween.get(lblEffect).to({ y: lblEffect.y - 120, alpha: 1 }, 800, egret.Ease.cubicOut)
            .call(onComplete1, this, [lblEffect.hashCode]);
    };
    /**通用tips列表移除对象 */
    TipsUtils.removeNormalTipsList = function (code) {
        //先进后出 末位查找效率更高
        for (var i = this.m_pDownToUpDatas.length - 1; i >= 0; i--) {
            var itemCode = this.m_pDownToUpDatas[i].hashCode;
            if (itemCode == code) {
                this.m_pDownToUpDatas.splice(i, 1);
                break;
            }
        }
        if (this.m_pDownToUpDatas.length < 2) {
            this.m_bInTipsFunc = false;
            Utils.TimerManager.remove(this.onNormalTipsTick, this);
        }
    };
    /**调整动态tips位置定时器 */
    TipsUtils.onNormalTipsTick = function () {
        this.updateTipsPosByList(this.m_pDownToUpDatas);
    };
    /**动态调整tips位置 */
    TipsUtils.updateTipsPosByList = function (list, isSort) {
        if (isSort === void 0) { isSort = false; }
        //降序
        if (isSort) {
            list.sort(function (a, b) {
                return (b.y - b.anchorOffsetY) - (a.y - a.anchorOffsetY);
            });
        }
        for (var i = 0; i < list.length - 1; i++) {
            var a = list[i];
            var b = list[i + 1];
            var gap = a.height + 5 + a.anchorOffsetY;
            if (a.y - gap < b.y - b.anchorOffsetY) {
                b.anchorOffsetY = b.y - a.y + gap;
            }
        }
    };
    TipsUtils.showTipsDownToUp2 = function (str, star, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        this.showTipsDownToUp(str, isWarning);
    };
    TipsUtils.showTipsLeftOrRight = function (str, isWarning, isFromeLeft) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        if (isFromeLeft === void 0) { isFromeLeft = true; }
        var lblEffect = com_main.PromptTextWnd.create(str, isWarning);
        lblEffect.x = isFromeLeft ? -lblEffect.width : GameConfig.curWidth();
        lblEffect.y = GameConfig.curHeight() / 2;
        lblEffect.alpha = 0;
        lblEffect.anchorOffsetX = lblEffect.width / 2;
        lblEffect.anchorOffsetY = lblEffect.height / 2;
        if (!AGame.R.app.topLevel.contains(lblEffect)) {
            AGame.R.app.topLevel.addChild(lblEffect);
        }
        if (isFromeLeft) {
            egret.Tween.get(lblEffect)
                .to({ x: GameConfig.curWidth() / 2 - lblEffect.width / 2 - 50, alpha: 1 }, 300, egret.Ease.sineInOut);
        }
        else {
            egret.Tween.get(lblEffect)
                .to({ x: GameConfig.curWidth() / 2 - lblEffect.width / 2 + 50, alpha: 1 }, 300, egret.Ease.sineInOut);
        }
        egret.setTimeout(function () {
            if (isFromeLeft) {
                egret.Tween.get(lblEffect).to({ x: lblEffect.x + 100 }, 500);
            }
            else {
                egret.Tween.get(lblEffect).to({ x: lblEffect.x - 100 }, 500);
            }
        }, this, 300);
        egret.setTimeout(function () {
            if (isFromeLeft) {
                egret.Tween.get(lblEffect)
                    .to({ x: GameConfig.curWidth() }, 300, egret.Ease.sineIn);
            }
            else {
                egret.Tween.get(lblEffect)
                    .to({ x: -lblEffect.width }, 300, egret.Ease.sineIn);
            }
        }, this, 800);
        egret.setTimeout(function () {
            lblEffect.onDestroy();
            lblEffect = null;
        }, this, 1100);
    };
    TipsUtils.showTipsFromCenter = function (str, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        var lblEffect = com_main.PromptTextWnd.create(str, isWarning);
        lblEffect.x = GameConfig.curWidth() / 2;
        lblEffect.y = GameConfig.curHeight() / 2;
        lblEffect.alpha = 0;
        lblEffect.anchorOffsetX = lblEffect.width / 2;
        lblEffect.anchorOffsetY = lblEffect.height / 2;
        if (!AGame.R.app.topLevel.contains(lblEffect)) {
            AGame.R.app.topLevel.addChild(lblEffect);
        }
        lblEffect.scaleX = 0;
        lblEffect.scaleY = 0;
        var onComplete2 = function () {
            lblEffect.onDestroy();
            lblEffect = null;
        };
        egret.Tween.get(lblEffect)
            .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200);
        egret.setTimeout(function () {
            egret.Tween.get(lblEffect)
                .to({ alpha: 0 }, 500)
                .call(onComplete2, this);
        }, this, 1000);
    };
    /**警报通知 */
    TipsUtils.showTipsWarnNotice = function (str, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        var lblEffect = com_main.PromptTextWnd.create(str, isWarning);
        lblEffect.x = GameConfig.curWidth() / 2;
        lblEffect.y = GameConfig.curHeight() / 2 - 50;
        lblEffect.alpha = 0;
        lblEffect.anchorOffsetX = lblEffect.width / 2;
        lblEffect.anchorOffsetY = lblEffect.height / 2;
        if (!AGame.R.app.topLevel.contains(lblEffect)) {
            AGame.R.app.topLevel.addChild(lblEffect);
        }
        lblEffect.scaleX = 0;
        lblEffect.scaleY = 0;
        var onComplete2 = function () {
            lblEffect.onDestroy();
            lblEffect = null;
            WorldModel.isNoticeComplete = true;
        };
        WorldModel.isNoticeComplete = false;
        egret.Tween.get(lblEffect)
            .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200).wait(5000)
            .to({ alpha: 0 }, 1000).call(onComplete2, this);
    };
    TipsUtils.showTipsBigToSmall = function (str, isWarning) {
        if (str === void 0) { str = ""; }
        if (isWarning === void 0) { isWarning = false; }
        var lblEffect = com_main.PromptTextWnd.create(str, isWarning);
        lblEffect.x = GameConfig.curWidth() / 2;
        lblEffect.y = GameConfig.curHeight() / 2;
        lblEffect.alpha = 0;
        lblEffect.anchorOffsetX = lblEffect.width / 2;
        lblEffect.anchorOffsetY = lblEffect.height / 2;
        if (!AGame.R.app.topLevel.contains(lblEffect)) {
            AGame.R.app.topLevel.addChild(lblEffect);
        }
        lblEffect.anchorOffsetX = lblEffect.width / 2;
        lblEffect.anchorOffsetY = lblEffect.height / 2;
        lblEffect.scaleX = 4;
        lblEffect.scaleY = 4;
        var onComplete2 = function () {
            lblEffect.onDestroy();
            lblEffect = null;
        };
        egret.Tween.get(lblEffect)
            .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200);
        egret.setTimeout(function () {
            egret.Tween.get(lblEffect)
                .to({ alpha: 0 }, 500).call(onComplete2, this);
        }, this, 1000);
    };
    /**通用普通特效 */
    TipsUtils.showTipsNormalUp = function (str, start, contains) {
        if (str === void 0) { str = ""; }
        var lblEffect = new eui.Label();
        lblEffect.size = 26;
        lblEffect.x = start.x;
        lblEffect.y = start.y;
        lblEffect.textFlow = Utils.htmlParser(str);
        lblEffect.anchorOffsetX = lblEffect.width / 2;
        lblEffect.anchorOffsetY = lblEffect.height / 2;
        if (contains) {
            contains.addChild(lblEffect);
        }
        else {
            AGame.R.app.topLevel.addChild(lblEffect);
        }
        lblEffect.alpha = 0;
        var tw = egret.Tween.get(lblEffect);
        tw.to({ y: lblEffect.y - 50, alpha: 1 }, 800, egret.Ease.cubicOut);
        tw.to({ alpha: 0 }, 500);
        tw.call(function () {
            Utils.removeFromParent(lblEffect);
            lblEffect = null;
        }, TipsUtils);
    };
    /**战力飙升特效 */
    TipsUtils.showTipsFightUp = function (str, start, contains) {
        if (str === void 0) { str = ""; }
        var lblEffect = com_main.PromptTextWnd.create(str, false, 300);
        lblEffect.x = start.x;
        lblEffect.y = start.y;
        lblEffect.alpha = 0;
        lblEffect.anchorOffsetX = lblEffect.width / 2;
        lblEffect.anchorOffsetY = lblEffect.height / 2;
        if (contains) {
            contains.addChild(lblEffect);
            //移除函数 挂钩新内容
            var removeFunc_1 = contains.$onRemoveFromStage.bind(contains);
            contains.$onRemoveFromStage = function () {
                if (!contains)
                    return;
                TipsUtils.m_tFightNums = [];
                Utils.TimerManager.remove(TipsUtils.onFightTipsTick, TipsUtils);
                removeFunc_1();
            };
        }
        else {
            AGame.R.app.topLevel.addChild(lblEffect);
        }
        lblEffect.scaleX = 0.3;
        lblEffect.scaleY = 0.3;
        var step1 = function () {
            egret.Tween.get(lblEffect).to({ y: lblEffect.y - 60, alpha: 0.5, scaleX: 0.5, scaleY: 0.5 }, 300, egret.Ease.sineIn).call(step2, this);
        };
        var step2 = function () {
            lblEffect.onDestroy();
            TipsUtils.removeFightTipsList(lblEffect.hashCode);
            lblEffect = null;
        };
        var ty = start.y - 120;
        egret.Tween.get(lblEffect)
            .to({ y: ty, scaleX: 1, scaleY: 1, alpha: 1 }, 700, egret.Ease.cubicOut).call(step1, this);
        this.m_tFightNums.unshift(lblEffect);
        if (this.m_tFightNums.length >= 2 && !this.m_bFightTipsFunc) {
            this.m_bFightTipsFunc = true;
            Utils.TimerManager.doFrame(1, 0, this.onFightTipsTick, this);
        }
    };
    /**调整动态tips位置定时器 */
    TipsUtils.onFightTipsTick = function () {
        this.updateTipsPosByList(this.m_tFightNums);
    };
    /**通用tips列表移除对象 */
    TipsUtils.removeFightTipsList = function (code) {
        //先进后出 末位查找效率更高
        for (var i = this.m_tFightNums.length - 1; i >= 0; i--) {
            var itemCode = this.m_tFightNums[i].hashCode;
            if (itemCode == code) {
                this.m_tFightNums.splice(i, 1);
                break;
            }
        }
        if (this.m_tFightNums.length < 2) {
            this.m_bFightTipsFunc = false;
            Utils.TimerManager.remove(this.onFightTipsTick, this);
        }
    };
    TipsUtils.showTipsFightUpList = function (str, start, contains) {
        this.clearFightEffTick();
        this.fightEffList = str;
        this.fightEffRoot = contains;
        this.fightEffStar = start;
        Utils.TimerManager.doTimer(300, 0, this.onFighEffTick, this);
        if (contains) {
            var removeFunc_2 = contains.$onRemoveFromStage.bind(contains);
            contains.$onRemoveFromStage = function () {
                TipsUtils.clearFightEffTick();
                removeFunc_2();
            };
        }
    };
    /**调整动态tips位置定时器 */
    TipsUtils.onFighEffTick = function () {
        if (this.fightEffList && this.fightEffList.length > 0) {
            var str = this.fightEffList.shift();
            TipsUtils.showTipsFightUp(str, this.fightEffStar, this.fightEffRoot);
        }
        else {
            this.clearFightEffTick();
        }
    };
    /**清理动画tick */
    TipsUtils.clearFightEffTick = function () {
        Utils.TimerManager.remove(this.onFighEffTick, this);
        this.fightEffList = null;
        this.fightEffRoot = null;
        this.fightEffStar = null;
    };
    TipsUtils.m_pMD5 = new md5();
    TipsUtils.m_pDownToUpDatas = [];
    TipsUtils.m_tFightNums = [];
    TipsUtils.m_bFightTipsFunc = false;
    return TipsUtils;
}());
