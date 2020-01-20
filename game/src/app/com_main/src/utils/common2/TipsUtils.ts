class TipsUtils {

    private static m_pMD5: md5 = new md5();
    private static m_pDownToUpDatas: Array<com_main.PromptTextWnd> = [];
    private static m_bInTipsFunc: boolean;

    public static showTipsDownToUp(str: string = "", isWarning: boolean = false): void {
        let lblEffect = com_main.PromptTextWnd.create(str, isWarning);
        lblEffect.x = (AGame.R.app.stageWidth) / 2;
        lblEffect.y = (AGame.R.app.stageHeight) / 2;
        lblEffect.alpha = 0;
        lblEffect.anchorOffsetX = lblEffect.width / 2;
        lblEffect.anchorOffsetY = lblEffect.height / 2;
        if (!AGame.R.app.topLevel.contains(lblEffect)) {
            AGame.R.app.topLevel.addChild(lblEffect);
        }
        let self = this
        let onComplete2: Function = function () {
            self.removeNormalTipsList(lblEffect.hashCode);
            egret.Tween.removeTweens(lblEffect);
            // Utils.removeFromParent(lblEffect);
            lblEffect.onDestroy();
        };

        let onComplete1: Function = function () {
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
    }
    /**通用tips列表移除对象 */
    public static removeNormalTipsList(code: number) {
        //先进后出 末位查找效率更高
        for (let i = this.m_pDownToUpDatas.length - 1; i >= 0; i--) {
            let itemCode = this.m_pDownToUpDatas[i].hashCode;
            if (itemCode == code) {
                this.m_pDownToUpDatas.splice(i, 1);
                break;
            }
        }
        if (this.m_pDownToUpDatas.length < 2) {
            this.m_bInTipsFunc = false;
            Utils.TimerManager.remove(this.onNormalTipsTick, this);
        }
    }

    /**调整动态tips位置定时器 */
    public static onNormalTipsTick() {
        this.updateTipsPosByList(this.m_pDownToUpDatas);
    }

    /**动态调整tips位置 */
    public static updateTipsPosByList(list: Array<com_main.PromptTextWnd>, isSort: boolean = false) {
        //降序
        if (isSort) {
            list.sort((a, b) => {
                return (b.y - b.anchorOffsetY) - (a.y - a.anchorOffsetY);
            });
        }

        for (let i = 0; i < list.length - 1; i++) {
            let a = list[i];
            let b = list[i + 1];
            let gap = a.height + 5 + a.anchorOffsetY;
            if (a.y - gap < b.y - b.anchorOffsetY) {
                b.anchorOffsetY = b.y - a.y + gap;
            }
        }
    }

    public static showTipsDownToUp2(str: string = "", star: egret.Point, isWarning: boolean = false): void {
        this.showTipsDownToUp(str, isWarning);
    }

    public static showTipsLeftOrRight(str: string = "", isWarning: boolean = false, isFromeLeft: boolean = true): void {
        let lblEffect = com_main.PromptTextWnd.create(str, isWarning);
        lblEffect.x = isFromeLeft ? - lblEffect.width : GameConfig.curWidth();
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
        } else {
            egret.Tween.get(lblEffect)
                .to({ x: GameConfig.curWidth() / 2 - lblEffect.width / 2 + 50, alpha: 1 }, 300, egret.Ease.sineInOut);
        }

        egret.setTimeout(function () {
            if (isFromeLeft) {
                egret.Tween.get(lblEffect).to({ x: lblEffect.x + 100 }, 500);
            } else {
                egret.Tween.get(lblEffect).to({ x: lblEffect.x - 100 }, 500);
            }
        }, this, 300);

        egret.setTimeout(function () {
            if (isFromeLeft) {
                egret.Tween.get(lblEffect)
                    .to({ x: GameConfig.curWidth() }, 300, egret.Ease.sineIn);
            } else {
                egret.Tween.get(lblEffect)
                    .to({ x: -lblEffect.width }, 300, egret.Ease.sineIn);
            }
        }, this, 800);

        egret.setTimeout(function () {
            lblEffect.onDestroy();
            lblEffect = null;
        }, this, 1100);

    }

    public static showTipsFromCenter(str: string = "", isWarning: boolean = false): void {
        let lblEffect = com_main.PromptTextWnd.create(str, isWarning);
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

        let onComplete2: Function = function () {
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
    }
    /**警报通知 */
    public static showTipsWarnNotice(str: string = "", isWarning: boolean = false) {
        let lblEffect = com_main.PromptTextWnd.create(str, isWarning);
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

        let onComplete2: Function = function () {
            lblEffect.onDestroy();
            lblEffect = null;
            WorldModel.isNoticeComplete = true;
        };
        WorldModel.isNoticeComplete = false;
        egret.Tween.get(lblEffect)
            .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200).wait(5000)
            .to({ alpha: 0 }, 1000).call(onComplete2, this);
    }
    public static showTipsBigToSmall(str: string = "", isWarning: boolean = false): void {
        let lblEffect = com_main.PromptTextWnd.create(str, isWarning);
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

        let onComplete2: Function = function () {
            lblEffect.onDestroy();
            lblEffect = null;
        };

        egret.Tween.get(lblEffect)
            .to({ scaleX: 1, scaleY: 1, alpha: 1 }, 200);

        egret.setTimeout(function () {
            egret.Tween.get(lblEffect)
                .to({ alpha: 0 }, 500).call(onComplete2, this);
        }, this, 1000);
    }

    /**通用普通特效 */
    public static showTipsNormalUp(str: string = "", start: egret.Point, contains: egret.DisplayObjectContainer): void {
        let lblEffect = new eui.Label();
        lblEffect.size = 26;
        lblEffect.x = start.x;
        lblEffect.y = start.y;
        lblEffect.textFlow = Utils.htmlParser(str);
        lblEffect.anchorOffsetX = lblEffect.width / 2;
        lblEffect.anchorOffsetY = lblEffect.height / 2;

        if (contains) {
            contains.addChild(lblEffect);
        } else {
            AGame.R.app.topLevel.addChild(lblEffect);
        }

        lblEffect.alpha = 0;
        let tw = egret.Tween.get(lblEffect)
        tw.to({ y: lblEffect.y - 50, alpha: 1 }, 800, egret.Ease.cubicOut);
        tw.to({ alpha: 0 }, 500);
        tw.call(() => {
            Utils.removeFromParent(lblEffect);
            lblEffect = null;
        }, TipsUtils);
    }


    /**战力飙升特效 */
    public static showTipsFightUp(str: string = "", start: egret.Point, contains: egret.DisplayObjectContainer): void {
        let lblEffect = com_main.PromptTextWnd.create(str, false, 300);
        lblEffect.x = start.x;
        lblEffect.y = start.y;
        lblEffect.alpha = 0;
        lblEffect.anchorOffsetX = lblEffect.width / 2;
        lblEffect.anchorOffsetY = lblEffect.height / 2;

        if (contains) {
            contains.addChild(lblEffect);
            //移除函数 挂钩新内容
            let removeFunc = contains.$onRemoveFromStage.bind(contains);
            contains.$onRemoveFromStage = function () {
                if (!contains) return;
                TipsUtils.m_tFightNums = [];
                Utils.TimerManager.remove(TipsUtils.onFightTipsTick, TipsUtils);
                removeFunc();
            }
        } else {
            AGame.R.app.topLevel.addChild(lblEffect);
        }

        lblEffect.scaleX = 0.3;
        lblEffect.scaleY = 0.3;

        let step1: Function = function () {
            egret.Tween.get(lblEffect).to({ y: lblEffect.y - 60, alpha: 0.5, scaleX: 0.5, scaleY: 0.5 }, 300, egret.Ease.sineIn).call(step2, this);
        }
        let step2: Function = function () {
            lblEffect.onDestroy();
            TipsUtils.removeFightTipsList(lblEffect.hashCode);
            lblEffect = null;
        }

        let ty = start.y - 120;
        egret.Tween.get(lblEffect)
            .to({ y: ty, scaleX: 1, scaleY: 1, alpha: 1 }, 700, egret.Ease.cubicOut).call(step1, this);

        this.m_tFightNums.unshift(lblEffect);
        if (this.m_tFightNums.length >= 2 && !this.m_bFightTipsFunc) {
            this.m_bFightTipsFunc = true;
            Utils.TimerManager.doFrame(1, 0, this.onFightTipsTick, this);
        }
    }

    private static m_tFightNums: Array<com_main.PromptTextWnd> = [];
    private static m_bFightTipsFunc: boolean = false;
    /**调整动态tips位置定时器 */
    public static onFightTipsTick() {
        this.updateTipsPosByList(this.m_tFightNums);
    }
    /**通用tips列表移除对象 */
    public static removeFightTipsList(code: number) {
        //先进后出 末位查找效率更高
        for (let i = this.m_tFightNums.length - 1; i >= 0; i--) {
            let itemCode = this.m_tFightNums[i].hashCode;
            if (itemCode == code) {
                this.m_tFightNums.splice(i, 1);
                break;
            }
        }
        if (this.m_tFightNums.length < 2) {
            this.m_bFightTipsFunc = false;
            Utils.TimerManager.remove(this.onFightTipsTick, this);
        }
    }


    /**战力飙升特效数组 */
    private static fightEffList: string[];
    private static fightEffRoot: egret.DisplayObjectContainer;
    private static fightEffStar: egret.Point;
    public static showTipsFightUpList(str: string[], start: egret.Point, contains: egret.DisplayObjectContainer): void {
        this.clearFightEffTick();
        this.fightEffList = str;
        this.fightEffRoot = contains;
        this.fightEffStar = start;
        Utils.TimerManager.doTimer(300, 0, this.onFighEffTick, this);

        if (contains) {
            let removeFunc = contains.$onRemoveFromStage.bind(contains);
            contains.$onRemoveFromStage = function () {
                TipsUtils.clearFightEffTick();
                removeFunc();
            }
        }

    }
    /**调整动态tips位置定时器 */
    public static onFighEffTick() {
        if (this.fightEffList && this.fightEffList.length > 0) {
            let str = this.fightEffList.shift();
            TipsUtils.showTipsFightUp(str, this.fightEffStar, this.fightEffRoot);
        } else {
            this.clearFightEffTick();
        }
    }
    /**清理动画tick */
    public static clearFightEffTick() {
        Utils.TimerManager.remove(this.onFighEffTick, this);
        this.fightEffList = null;
        this.fightEffRoot = null;
        this.fightEffStar = null;
    }
  
}