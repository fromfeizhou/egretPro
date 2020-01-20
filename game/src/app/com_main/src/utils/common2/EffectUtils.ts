/**
  * 游戏特效汇总
  * by zhaoxin
  * (c) copyright 2014 - 2035
  * All Rights Reserved. 
  * 使用方法如：EffectUtils.rotationEffect()
  */

namespace EffectUtils {
    //动画对象移除函数重写
    export function resetTweenDestroy(obj: egret.DisplayObject) {
        if (obj && !obj['$actionClear']) {
            //移除函数 挂钩新内容
            let removeFunc = obj.$onRemoveFromStage.bind(obj);
            obj['$actionClear'] = true;
            obj.$onRemoveFromStage = function () {
                if (!obj) return;
                egret.Tween.removeTweens(obj);
                removeFunc();
            }
        }
    }

    /** 开始闪烁
    * @param obj
    */
    export function startFlicker(obj: egret.DisplayObject, alphaTime: number): void {
        if(!obj) return;
        resetTweenDestroy(obj);
        obj.alpha = 1;
        egret.Tween.get(obj).to({ "alpha": 0 }, alphaTime).to({ "alpha": 1 }, alphaTime).call(this.startFlicker, this, [obj]);
    }

    /**
     * 停止闪烁
     * @param obj
     */
    export function stopFlicker(obj: egret.DisplayObject): void {
        egret.Tween.removeTweens(obj);
    }

    /**图标抖动 */
    export function macIconShake(obj: egret.DisplayObject, tx: number, ty: number) {
        if(!obj) return;
        resetTweenDestroy(obj);
        NodeUtils.setPosition(obj, tx, ty);
        egret.Tween.removeTweens(obj);
        let tw = egret.Tween.get(obj, { loop: true });
        let gap = 3;
        for (let i = 0; i < 3; i++) {
            tw.to({ x: tx + gap }, 30, Ease.backOut);
            tw.to({ x: tx }, 30, Ease.backOut);
            tw.to({ x: tx - gap }, 30, Ease.backOut);
            tw.to({ x: tx }, 30, Ease.backOut);
            tw.to({ y: ty + gap }, 30, Ease.backOut);
            tw.to({ y: ty }, 30, Ease.backOut);
            tw.to({ y: ty - gap }, 30, Ease.backOut);
            tw.to({ y: ty }, 30, Ease.backOut);
        }
        tw.wait(2000);
    }

    // 存储旋转对象
    let rotationArr: any[] = [];
    //对象旋转特效
    //obj   旋转对象
    //time  旋转一周用时，毫秒
    export function rotationEffect(obj, time: number = 1000): void {
        if(!obj) return;
        resetTweenDestroy(obj);
        if (this.rotationArr == null) {
            this.rotationArr = [];
        }
        if (this.rotationArr[obj.hashCode]) {
            return;
        }
        if ((this.rotationArr[obj.hashCode] == null) || !this.rotationArr[obj.hashCode]) {
            this.rotationArr[obj.hashCode] = true;
        }
        let onComplete1: Function = function () {
            if (this.rotationArr[obj.hashCode] && (obj != null)) {
                obj.rotation = 0;
                egret.Tween.get(obj).to({ rotation: 360 }, time).call(onComplete1, this);
            }
        };
        obj.rotation = 0;
        egret.Tween.get(obj).to({ rotation: 360 }, time).call(onComplete1, this);
    }

    //取消对象旋转
    //obj    旋转对象
    export function removeRotationEffect(obj): void {
        if(!obj) return;
        if (this.rotationArr == null) {
            this.rotationArr = [];
        }
        this.rotationArr[obj.hashCode] = false;
    }

    //对象闪烁特效
    //obj         闪烁对象
    //interval    闪烁总工时间
    export function blinkEffect(obj, interval: number = 1000): void {
        if(!obj) return;
        new BitmapBlink(obj, interval);
    }

    //抖动对象特效
    //类似ios密码输入错误的特效
    export function shakeObj(obj): void {
        if(!obj) return;
        resetTweenDestroy(obj);
        let shakeNum = 80;
        let oldX: number = obj.x;
        egret.Tween.get(obj).to({ x: obj.x - 10 }, shakeNum);

        egret.setTimeout(function () {
            egret.Tween.get(obj).to({ x: obj.x + 20 }, shakeNum);
        }, this, shakeNum * 2);
        egret.setTimeout(function () {
            egret.Tween.get(obj).to({ x: obj.x - 20 }, shakeNum);
        }, this, shakeNum * 3);
        egret.setTimeout(function () {
            egret.Tween.get(obj).to({ x: obj.x + 20 }, shakeNum);
        }, this, shakeNum * 4);
        egret.setTimeout(function () {
            egret.Tween.get(obj).to({ x: oldX }, shakeNum);
        }, this, shakeNum * 5);
    }


    //抖动对象特效
    // 1：抖动  2：震动  3：缩放
    export function shakeScreen(obj?: any, effectType: number = 1, callFunc?: Function, callObj?): void {
        if(!obj) return;
        resetTweenDestroy(obj);
        let panel = obj || GameConfig.curPanel;
        let shakeNum = 40;
        let oldX: number = panel.x;
        let oldY: number = panel.y;

        if (effectType == 1) {
            // egret.Tween.get(panel).to({ x: panel.x - 10 }, shakeNum);

            panel.x = panel.x - 10;
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 20 }, shakeNum);
            }, this, shakeNum * 1);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x - 20 }, shakeNum);
            }, this, shakeNum * 2);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 20 }, shakeNum);
            }, this, shakeNum * 3);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: oldX }, shakeNum);
            }, this, shakeNum * 4);
        } else if (effectType == 2) {
            // egret.Tween.get(panel).to({ x: panel.x - 10, y: panel.y }, shakeNum);
            panel.x = panel.x - 10;
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 20, y: panel.y }, shakeNum);
            }, this, shakeNum * 1);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y + 15 }, shakeNum);
            }, this, shakeNum * 2);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y - 20 }, shakeNum);
            }, this, shakeNum * 3);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y + 10 }, shakeNum);
            }, this, shakeNum * 4);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: oldX, y: oldY }, shakeNum);
            }, this, shakeNum * 5);
        } else if (effectType == 3) {
            //缩放效果
            shakeNum = 40;
            panel.scaleX = panel.scaleY = 0.97;

            egret.setTimeout(function () {
                panel.scaleX = panel.scaleY = 1;
                if (callFunc) {
                    callFunc.call(callObj);
                }
            }, this, shakeNum * 1);
        } else if (effectType == 4) {
            /**震动两次 */
            let range = 40;
            let startY = panel.y;
            panel.y = startY + range;
            egret.Tween.get(panel)
                .to({ y: startY - range * 0.5 }, shakeNum * 1.5)
                .to({ y: startY + range * 0.6 }, shakeNum * 1.1)
                .to({ y: startY }, shakeNum * 0.6);
        } else if (effectType == 5) {
            /**上下震动一次 */
            let range = 40;
            let startY = panel.y;
            panel.y = startY + range;
            egret.Tween.get(panel).to({ y: startY }, shakeNum);

        } else if (effectType == 6) {
            /**上下小幅震动一次 */
            let range = 25;
            let startY = panel.y;
            panel.y = startY + range;
            egret.Tween.get(panel).to({ y: startY }, shakeNum);

        }
    }

    /**
    * str             提示内容
    * effectType      动画类型 
                        1：从下到上弹出 
                        2：从左至右弹出 
                        3：从右至左弹出 
                        4：从中间弹出渐渐消失 
                        5：从大变小 
                        6: 指定位置 
                        等等
    * isWarning       是否是警告，警告是红色
    */
    export function showTips(str: string = "", effectType: number = 1, isWarning: boolean = false): void {
        if (str == "") return;
        switch (effectType) {
            case 1: {
                TipsUtils.showTipsDownToUp(str, isWarning);
                break;
            }
            case 2: {
                TipsUtils.showTipsLeftOrRight(str, isWarning, true);
                break;
            }
            case 3: {
                TipsUtils.showTipsLeftOrRight(str, isWarning, false);
                break;
            }
            case 4: {
                TipsUtils.showTipsFromCenter(str, isWarning);
                break;
            }
            case 5: {
                TipsUtils.showTipsBigToSmall(str, isWarning);
                break;
            }
            case 6: {
                TipsUtils.showTipsWarnNotice(str, isWarning);
                break;
            }
            default: {
                // TODO: Implemente default case
            }
        }

    }

    //========================== a lot of effect will coming! ============================

    let isPlayEffectPlay: Boolean = false;
    /**
    * 给显示对象增加特效
    * obj           对象
    * cartoonType   动画类型 1:【可爱】按下变小，放开弹大 2:按下变小，放开轻微弹大 3：按下变小，放开变大
    */
    export function playEffect(obj, cartoonType: number = 1): void {
        if(!obj) return;
        resetTweenDestroy(obj);
        if (this.isPlayEffectPlay) {
            return;
        }
        this.isPlayEffectPlay = true;
        let onComplete2: Function = function () {
            this.isPlayEffectPlay = false;
        };
        let onComplete1: Function = function () {
            if (cartoonType == 1) {
                egret.Tween.get(obj).to({ scaleX: 1, scaleY: 1, x: obj.x - obj.width / 4, y: obj.y - obj.height / 4 }, 500, egret.Ease.elasticOut).call(onComplete2, this);
            } else if (cartoonType == 2) {
                egret.Tween.get(obj).to({ scaleX: 1, scaleY: 1, x: obj.x - obj.width / 4, y: obj.y - obj.height / 4 }, 500, egret.Ease.backOut).call(onComplete2, this);
            } else if (cartoonType == 3) {
                egret.Tween.get(obj).to({ scaleX: 1, scaleY: 1, x: obj.x - obj.width / 4, y: obj.y - obj.height / 4 }, 100).call(onComplete2, this);
            }
        };
        egret.Tween.removeTweens(obj);
        egret.Tween.get(obj).to({ scaleX: 0.5, scaleY: 0.5, x: obj.x + obj.width / 4, y: obj.y + obj.height / 4 }, 100, egret.Ease.sineIn).call(onComplete1, this);
    }


    /**
    * 给显示对象增加持续放大特效
    * obj           对象
    */
    export function playScaleEffect(obj): void {
        if(!obj) return;
        resetTweenDestroy(obj);
        let onComplete1: Function = function () {
            if (obj != null) {
                let onComplete2: Function = function () {
                    obj.scaleX = 1;
                    obj.scaleY = 1;
                    egret.Tween.get(obj).to({ alpha: 1 }, 1000).call(onComplete1, self)
                };
                obj.alpha = 1;
                egret.Tween.get(obj).to({ scaleX: 1.5, scaleY: 1.5, alpha: 0 }, 1000).call(onComplete2, self)
            }
        };
        egret.Tween.removeTweens(obj);
        onComplete1();
    }

    /**
    * 显示对象上线浮动特效
    * obj           对象
    * time          浮动时间 毫秒
    * space         浮动高度
    * todo          多个对象跳动
    */
    export function flyObj(obj, time, space: number = 50): void {
        if(!obj) return;
        resetTweenDestroy(obj);
        let onComplete1: Function = function () {
            if (obj != null) {
                let onComplete2: Function = function () {
                    egret.Tween.get(obj).to({ y: obj.y - space }, time).call(onComplete1, this);
                };
                egret.Tween.get(obj).to({ y: obj.y + space }, time).call(onComplete2, this);
            }
        };
        onComplete1();
    }

    /**
    * 显示对象摇头特效
    * obj           对象
    * time          浮动时间 毫秒
    * space         摇头幅度
    * todo          多个对象摇头
    * 注意：需要将对象的注册点位置：0.5,1
    */
    export function rockObj(obj, time, space: number = 20): void {
        if(!obj) return;
        resetTweenDestroy(obj);
        let onComplete1: Function = function () {
            if (obj != null) {
                let onComplete2: Function = function () {
                    egret.Tween.get(obj).to({ rotation: -space }, time).call(onComplete1, this);
                };
                egret.Tween.get(obj).to({ rotation: space }, time).call(onComplete2, this);
            }
        };
        onComplete1();
    }

    /**
    * 文字打字机效果
    * obj           文本对象
    * content       文字
    * interval      打字间隔 毫秒
    */
    export function typerEffect(obj: egret.TextField, content: string = "", interval: number = 200, backFun: Function = null, funTarget: any = null): void {
        if(!obj) return;
        var strArr: Array<any> = content.split("");
        var len: number = strArr.length;
        for (var i = 0; i < len; i++) {
            egret.setTimeout(function () {
                if(!obj) return;
                obj.appendText(strArr[Number(this)]);
                if ((Number(this) >= len - 1) && (backFun != null)) {
                    backFun.call(funTarget);
                }
            }, i, interval * i);
        }
    }

    // export function typerEffect(obj, content: string = "", interval: number = 200): void {
    //     let strArr: Array<any> = content.split("");
    //     let len: number = strArr.length;
    //     for (let i = 0; i < len; i++) {
    //         egret.setTimeout(function () {
    //             obj.appendText(strArr[Number(this)]);
    //         }, i, interval * i);
    //     }
    // }

}