var com_main;
(function (com_main) {
    var CEffectFunc = /** @class */ (function () {
        function CEffectFunc() {
        }
        /**
         *
         */
        CEffectFunc.addEffect = function (id, parent) {
            var effect = com_main.CEffectMgr.getIns().getEffect(id);
            if (parent) {
                parent.addChild(effect);
            }
            else {
                if (effect.spMark == 1)
                    com_main.BattleSceneMgr.getInstance().addChildToEffect(effect);
                else if (effect.spMark == 4)
                    com_main.BattleSceneMgr.getInstance().addChildToSuspension(effect);
                else
                    com_main.BattleSceneMgr.getInstance().addChildToWorld(effect);
            }
            return effect;
        };
        CEffectFunc.getTweenEffect = function (tweenId, obj, callback, thisArg) {
            switch (tweenId) {
                case 1:
                    CEffectFunc.inrushAction(obj, callback, thisArg);
                    break;
                case 2:
                    CEffectFunc.floatAction(obj, callback, thisArg, 1);
                    break;
                case 3:
                    CEffectFunc.floatSkillAction(obj, callback, thisArg);
                default:
                    break;
            }
        };
        /**
         * 突入动画
         */
        CEffectFunc.inrushAction = function (obj, callback, thisArg) {
            obj.scaleX = 0.8;
            obj.scaleY = 0.8;
            obj.alpha = 0;
            egret.Tween.get(obj)
                .to({ scaleX: 2.2, scaleY: 2.2, alpha: 1 }, 100) //, egret.Ease.backOut)
                .to({ scaleX: 1.5, scaleY: 1.5 }, 100) //, egret.Ease.backOut)
                .wait(200)
                .to({ alpha: 0 }, 450)
                .call(callback, thisArg);
        };
        /**
         * 飘血效果
         */
        CEffectFunc.buffWorldAction = function (obj, callback, thisArg) {
            var offY = -20;
            var oy = obj.y;
            obj.y = oy - 80 + offY;
            obj.alpha = 0;
            egret.Tween.get(obj)
                .to({ y: oy - 35 + offY, alpha: 1 }, 100)
                .to({ y: oy - 50 + offY }, 100)
                .wait(800)
                .to({ alpha: 0 }, 450)
                .call(callback, thisArg);
        };
        /**
         * 飘血效果
         */
        CEffectFunc.floatAction = function (obj, callback, thisArg, scale) {
            var oy = obj.y;
            egret.Tween.get(obj)
                .to({ scaleX: 1.9 * scale, scaleY: 1.9 * scale }, 40)
                .to({ scaleX: 1 * scale, scaleY: 1 * scale }, 120)
                .to({ y: oy - 44 }, 260 + 100)
                .to({ y: oy - 60, alpha: 0.14 }, 230 + 85)
                .call(callback, thisArg);
        };
        /**
         * 暴击效果
         */
        CEffectFunc.floatCritAction = function (obj, callback, thisArg) {
            obj.y -= 80;
            var oy = obj.y;
            obj.scaleX = obj.scaleY = 0;
            egret.Tween.get(obj)
                .to({ scaleX: 2, scaleY: 2 }, 120)
                .to({ scaleX: 1, scaleY: 1 }, 50)
                .wait(400)
                .to({ scaleX: 2, scaleY: 2, y: obj.y - 40, lightNum: 200 }, 100)
                .call(callback, thisArg);
        };
        /**
         * 飘经验效果 1250 ms
         */
        CEffectFunc.floatExpAction = function (obj, callback, thisArg) {
            var oy = obj.y;
            obj.y = oy - 80;
            obj.alpha = 0;
            egret.Tween.get(obj)
                .to({ y: oy - 35, alpha: 1 }, 100)
                .to({ y: oy - 50 }, 100)
                .wait(600) //.wait(400)
                .to({ y: oy - 130, alpha: 0 }, 450)
                .call(callback, thisArg);
        };
        /**
         * 飘强化效果
         */
        CEffectFunc.floatStrengthenAction = function (obj, callback, thisArg) {
            var oy = obj.y;
            obj.alpha = 0;
            egret.Tween.get(obj)
                .to({ y: oy - 35, alpha: 1 }, 100)
                .to({ y: oy - 50 }, 100)
                .wait(400)
                .to({ y: oy - 130, alpha: 0 }, 450)
                .call(callback, thisArg);
        };
        /**
         * 经验/军工
         */
        CEffectFunc.showSquareInfo = function (font, img, txt, x, y) {
            var node = new egret.DisplayObjectContainer();
            var imgInfo = ObjectPool.pop(egret.Bitmap, "egret.Bitmap");
            imgInfo.texture = img; //RES.getRes("battle_exp");
            Utils.addChild(node, imgInfo);
            var txtInfo = ObjectPool.pop(egret.BitmapText, "egret.BitmapText");
            txtInfo.letterSpacing = -6;
            txtInfo.font = font; //CResMgr.getIns().fontList[2];
            txtInfo.text = txt; //"+10086";
            txtInfo.x = imgInfo.x + imgInfo.width;
            Utils.addChild(node, txtInfo);
            com_main.BattleSceneMgr.getInstance().addChildToSuspension(node);
            node.anchorOffsetX = node.width * 0.5;
            node.anchorOffsetY = node.height;
            node.scaleX = 1.4;
            node.scaleY = 1.4;
            // node.x = this.width * 0.5;
            CEffectFunc.floatExpAction(node, function () {
                Utils.DisplayUtils.removeFromParent(node);
                node.removeChildren();
                // ObjectPool.push(txt);
                ObjectPool.push(imgInfo);
                ObjectPool.push(txtInfo);
            }, this);
        };
        /**
         * 攻击城墙飘血效果
         */
        CEffectFunc.floatHitCityWallAction = function (obj, callback, thisArg) {
            var oy = obj.y;
            egret.Tween.get(obj)
                .to({ y: oy - 70, alpha: 0 }, 400)
                .call(callback, thisArg);
        };
        /**
         * 往上飘不跳动效果
         */
        CEffectFunc.floatExpMilitaryAction = function (obj, callback, thisArg) {
            var oy = obj.y;
            egret.Tween.get(obj)
                // .wait(400)
                // .to({ y: oy - 100, alpha: 1 }, 450)
                // .call(callback, thisArg);
                .to({ y: oy - 50, alpha: 0.7 }, 500)
                .call(callback, thisArg);
        };
        /**
         * 军工经验加成往上飘不跳动效果
         */
        CEffectFunc.expMilitaryAction = function (font, img, txt, x, y, object) {
            var node = new egret.DisplayObjectContainer();
            var imgInfo = ObjectPool.pop(egret.Bitmap, "egret.Bitmap");
            imgInfo.texture = img;
            Utils.addChild(node, imgInfo);
            var txtInfo = ObjectPool.pop(egret.BitmapText, "egret.BitmapText");
            txtInfo.letterSpacing = -6;
            txtInfo.font = font; //CResMgr.getIns().fontList[2];
            txtInfo.text = txt; //"+10086";
            txtInfo.x = imgInfo.x + imgInfo.width;
            Utils.addChild(node, txtInfo);
            Utils.addChild(object, node);
            node.anchorOffsetX = node.width * 0.5;
            node.anchorOffsetY = node.height;
            // node.scaleX = 1.4;
            // node.scaleY = 1.4;
            node.x = x;
            node.y = y;
            CEffectFunc.floatExpMilitaryAction(node, function () {
                if (node) {
                    node.removeChildren();
                    ObjectPool.push(imgInfo);
                    ObjectPool.push(txtInfo);
                    Utils.DisplayUtils.removeFromParent(node);
                    node = null;
                }
            }, this);
        };
        /**
         * 技能动画
         */
        CEffectFunc.floatSkillAction = function (objs, callback, thisArg) {
            var len = objs.length;
            var appear = 180;
            var fadeIn = 80;
            var stay = 150;
            var stay2 = 100;
            var fadeOut = 80;
            for (var i = 0; i < len; i++) {
                // let obj: egret.DisplayObject = objs[i];
                // let ox = obj.x;
                // let nx = ox + (55 * i);
                // obj.scaleX = 0.5;
                // obj.scaleY = 0.5;
                // obj.alpha = 0;
                // let tw = egret.Tween.get(obj);
                // tw.wait(i * appear);
                // tw.to({ scaleX: 3.5, scaleY: 3.5, alpha: 1, x: nx }, fadeIn);
                // tw.wait((len - i) * appear + stay); //tw.wait((len - i) * appear + stay);
                // // tw.to({ scaleX: 4, scaleY: 4, alpha: 1, x: nx }, (len - i) * appear + stay);
                // tw.to({ scaleX: 1.5, scaleY: 1.5, x: ox }, appear);
                // tw.wait(200);
                // tw.to({ scaleY: 0 }, fadeOut);
                // if (i == (len - 1)) {
                // 	if (callback && thisArg)
                // 		tw.call(callback, thisArg);
                // } else {
                // }
                var obj = objs[i];
                obj.scaleX = 2;
                obj.scaleY = 2;
                obj.alpha = 0;
                var tw = egret.Tween.get(obj);
                tw.wait(i * appear);
                tw.to({ scaleX: 4, scaleY: 4, alpha: 1 }, fadeIn);
                tw.wait(stay2);
                tw.to({ scaleX: 1.5, scaleY: 1.5 }, /*appear*/ 80);
                tw.wait((len - i) * appear + stay);
                tw.to({ scaleY: 0 }, fadeOut);
                if (i == (len - 1)) {
                    if (callback && thisArg)
                        tw.call(callback, thisArg);
                }
                else {
                }
            }
        };
        /**
         * 升级动画
         */
        CEffectFunc.levelUpAction = function (objs, callback, thisArg) {
            var len = objs.length;
            var appear = 100;
            var startScale = 1;
            var maxScale = 3;
            var finalScale = 1.3;
            for (var i = 0; i < len; i++) {
                var obj = objs[i];
                obj.scaleX = startScale;
                obj.scaleY = startScale;
                obj.alpha = 0;
                var tw = egret.Tween.get(obj);
                tw.wait(i * appear);
                tw.to({ scaleX: maxScale, scaleY: maxScale, alpha: 1 }, appear);
                tw.to({ scaleX: finalScale, scaleY: finalScale }, appear);
                if (i == (len - 1)) {
                    if (callback && thisArg)
                        tw.call(callback, thisArg);
                }
                else {
                }
            }
        };
        /**
         * 旗帜出场
         */
        CEffectFunc.flagOnStageAction = function (obj) {
            var fallH = 300;
            var fallTime = 150;
            var oy = obj.y;
            obj.y = obj.y - fallH;
            obj.alpha = 0;
            var tw = egret.Tween.get(obj);
            tw.to({ y: oy, alpha: 1 }, fallTime);
            tw.call(function () {
                var disp = com_main.CEffectMgr.getIns().getEffect(9);
                if (obj && obj.parent) {
                    Utils.addChild(obj.parent, disp);
                    obj.parent.swapChildren(obj, disp);
                    disp.x = obj.x + 20;
                    disp.y = obj.y + 60;
                    disp.play();
                }
            });
        };
        /**
         * 战法区域提示
         */
        CEffectFunc.speelAreaTipsAction = function (point) {
            var bm = new egret.Bitmap(RES.getRes("battle_skill_select_png"));
            bm.anchorOffsetX = bm.width * 0.5;
            bm.anchorOffsetY = bm.height * 0.5;
            bm.x = point.x;
            bm.y = point.y;
            com_main.BattleSceneMgr.getInstance().addChildToSuspension(bm);
            var tw = egret.Tween.get(bm);
            tw.to({ alpha: 0 }, 1000);
            tw.call(function () { Utils.removeFromParent(bm); }, this);
        };
        /**
         * 续个盖印动画
         */
        CEffectFunc.stampAction = function (objs, callback, thisArg) {
            var len = objs.length;
            var appear = 200;
            var stay = 500;
            var fadeOut = 100;
            for (var i = 0; i < len; i++) {
                var obj = objs[i];
                obj.scaleX = 1.2;
                obj.scaleY = 1.2;
                obj.alpha = 0;
                var tw = egret.Tween.get(obj);
                tw.wait(i * appear);
                tw.to({ scaleX: 1.6, scaleY: 1.6, alpha: 1 }, appear);
                // tw.wait((len - i) * appear + stay);
                tw.to({ scaleX: 1, scaleY: 1 }, fadeOut);
                if (i == (len - 1)) {
                    if (callback && thisArg)
                        tw.call(callback, thisArg);
                }
                else {
                }
            }
        };
        /**
         * 逐个浮现
         */
        CEffectFunc.emergeAction = function (objs, callback, thisArg) {
            var len = objs.length;
            var appear = 200;
            var stay = 500;
            var fadeOut = 100;
            for (var i = 0; i < len; i++) {
                var obj = objs[i];
                obj.scaleX = 0.7;
                obj.scaleY = 0.7;
                obj.alpha = 0;
                var tw = egret.Tween.get(obj);
                tw.wait(i * appear);
                tw.to({ scaleX: 1, scaleY: 1, alpha: 1 }, appear);
                if (i == (len - 1)) {
                    if (callback && thisArg)
                        tw.call(callback, thisArg);
                }
                else {
                }
            }
        };
        /**
         * 单个盖印
         */
        CEffectFunc.stampSingleAction = function (obj) {
            obj.alpha = 0;
            var osX = obj.scaleX;
            var osY = obj.scaleY;
            var tw = egret.Tween.get(obj);
            tw.wait(500);
            tw.to({ alpha: 1, scaleX: osX + 0.8, scaleY: osY + 0.8 }, 100);
            tw.to({ scaleX: osX + 1, scaleY: osY + 1 }, 500);
            tw.to({ scaleX: osX, scaleY: osY }, 100);
        };
        /**
         * 续个往上飘
         */
        CEffectFunc.floatOneByOneAction = function (objs, itemOffset, callback, thisArg) {
            var temp = [];
            var len = objs.length;
            var appear = 200;
            var _loop_1 = function (i) {
                var obj = objs[i];
                obj.alpha = 0;
                var newHeight = obj.y - itemOffset;
                var tw = egret.Tween.get(obj);
                tw.wait(i * appear);
                tw.call(function () {
                    for (var j = 0; j < temp.length; j++) {
                        var to = temp[j];
                        var newHeight_1 = to.y - itemOffset;
                        tw.to({ y: newHeight_1, alpha: 1 }, appear);
                    }
                });
                temp.push(obj);
            };
            for (var i = 0; i < len; i++) {
                _loop_1(i);
            }
        };
        /**
         *
         */
        CEffectFunc.textBounceAction = function (obj, callback, thisArg) {
            var oc = GameConfig.TextColors.fontWhite; //obj.textColor;
            var tw = egret.Tween.get(obj);
            tw.set({ textColor: GameConfig.TextColors.golden });
            tw.to({ scaleX: 1.5, scaleY: 1.5 }, 100);
            tw.wait(100);
            tw.to({ scaleX: 1, scaleY: 1 }, 50);
            tw.set({ textColor: oc });
            if (callback && thisArg)
                tw.call(callback, thisArg);
        };
        /**
         * 数字跳动变化
            let value = {
                obj: this.m_pLblScore,
                scaleX: 1.5,
                scaleY: 1.5,
                formatStr: "{1}"
                oldVar: 0,
                newVar: 200,
            };
        */
        CEffectFunc.numberBounceAction = function (value, callback, thisArg) {
            // debug("CEffectFunc:numberBounceAction--->>", oldVar, newVar);
            var obj = value.obj;
            var oldVar = value.oldVar;
            var newVar = value.newVar;
            var formatStr = value.formatStr || "{1}";
            if (isNull(value.obj))
                return;
            var _scalex = value.scaleX || 1;
            var _scaley = value.scaleY || 1;
            if (!isNull(_scalex))
                obj.scaleX = _scalex;
            if (!isNull(_scaley))
                obj.scaleY = _scaley;
            var bounceNum = 4;
            var numArray = [];
            var len = bounceNum;
            var temp = newVar - oldVar;
            var diff = Math.abs(temp);
            if ((diff / bounceNum) < 1)
                len = 1;
            for (var i = 0; i < len; i++) {
                numArray[i] = Math.floor(diff / bounceNum);
                if (i == (len - 1)) {
                    numArray[i] += diff % bounceNum;
                }
            }
            var oc = GameConfig.TextColors.fontWhite;
            egret.Tween.removeTweens(obj);
            var tw = egret.Tween.get(obj);
            tw.set({ textColor: GameConfig.TextColors.golden });
            tw.to({ scaleX: _scalex * 1.5, scaleY: _scaley * 1.5 }, 100);
            for (var i = 0; i < len; i++) {
                if (temp > 0) {
                    oldVar += numArray[i];
                }
                else {
                    oldVar -= numArray[i];
                }
                tw.to({ text: format(formatStr, oldVar), scaleX: _scalex * 1.7, scaleY: _scaley * 1.7 }, 50);
                tw.to({ scaleX: _scalex * 1.5, scaleY: _scaley * 1.5 }, 50);
                tw.call(function () { Sound.playID(117); });
            }
            tw.wait(100);
            tw.to({ scaleX: _scalex, scaleY: _scaley }, 50);
            tw.set({ textColor: oc });
            if (callback && thisArg)
                tw.call(callback, thisArg);
            else
                tw.call(function () {
                    obj.textColor = oc;
                    // debug("CEffectFunc:numberBounceAction--->>", oldVar, newVar, obj.text);
                });
        };
        CEffectFunc.rollingNotificationAction = function (obj, callback, thisArg) {
            var intervalY = 15;
            var len = CEffectFunc.rollingContentList.length;
            var _loop_2 = function (i) {
                var oldObj = CEffectFunc.rollingContentList[i];
                var lay = (len - i) * 20;
                egret.Tween.removeTweens(oldObj);
                // oldObj.y -= oldObj.height;
                oldObj.oy = oldObj.y - oldObj.height - intervalY;
                var tw_1 = egret.Tween.get(oldObj);
                tw_1.to({ y: oldObj.oy, alpha: 1 }, 100);
                tw_1.wait(500 - lay);
                tw_1.to({ alpha: 0 }, 500 - lay * 10);
                tw_1.call(function () {
                    Utils.removeFromParent(oldObj);
                    if (CEffectFunc.rollingContentList.length > 0)
                        CEffectFunc.rollingContentList.splice(0, 1);
                });
            };
            for (var i = 0; i < len; i++) {
                _loop_2(i);
            }
            obj.oy = obj.y;
            obj.y += obj.height + intervalY;
            obj.alpha = 0;
            CEffectFunc.rollingContentList.push(obj);
            var tw = egret.Tween.get(obj);
            tw.to({ y: obj.oy, alpha: 1 }, 100);
            tw.wait(500);
            tw.to({ alpha: 0 }, 1000);
            tw.call(function () {
                Utils.removeFromParent(obj);
                if (CEffectFunc.rollingContentList.length > 0)
                    CEffectFunc.rollingContentList.splice(0, 1);
            });
        };
        /**
         * 文本滚动
         */
        CEffectFunc.textRollingAction = function (contentArr, thisArg, complateMethod, complateMethodObj) {
            var len = contentArr.length;
            var index = 0;
            if (len > 0) {
                Utils.TimerManager.doTimer(200, len, function () {
                    var lbContent = new egret.TextField();
                    lbContent.size = GameConfig.LabelFontSize.normalSize;
                    lbContent.textColor = GameConfig.TextColors.green;
                    lbContent.strokeColor = 0x000000;
                    lbContent.stroke = 2;
                    lbContent.text = contentArr[index];
                    lbContent.anchorOffsetX = lbContent.width * 0.5;
                    lbContent.anchorOffsetY = lbContent.height * 0.5;
                    lbContent.x = AGame.R.app.stageWidth * 0.5;
                    lbContent.y = AGame.R.app.stageHeight * 0.5;
                    AGame.R.app.topLevel.addChild(lbContent);
                    CEffectFunc.rollingNotificationAction(lbContent);
                    index++;
                }, (thisArg || this), complateMethod, complateMethodObj);
            }
        };
        /**
         * 呼吸效果
         */
        CEffectFunc.breatheAction = function (obj, duration) {
            if (duration === void 0) { duration = 1000; }
            egret.Tween.removeTweens(obj);
            obj.scaleX = 1;
            obj.scaleY = 1;
            var breatheFunc = function () {
                var tw = egret.Tween.get(obj);
                tw.to({ scaleX: 1.5, scaleY: 1.5 }, duration);
                tw.to({ scaleX: 1, scaleY: 1 }, duration);
                tw.call(breatheFunc);
            };
            breatheFunc();
        };
        /**
         * 震屏效果
         * shakeTime 震动次数 单次 120ms
         */
        CEffectFunc.shakeAction = function (obj, originX, originY, shakeTime) {
            if (shakeTime === void 0) { shakeTime = 3; }
            var ox = originX;
            var oy = originY;
            var tw = egret.Tween.get(obj, null, null, true);
            var shakeInterval = 20;
            var shakeRange = 10;
            for (var i = 0; i < shakeTime; i++) {
                tw.to({ x: ox + shakeRange }, shakeInterval);
                tw.to({ x: ox }, shakeInterval);
                tw.to({ x: ox - shakeRange }, shakeInterval);
                tw.to({ y: oy + shakeRange }, shakeInterval);
                tw.to({ y: oy }, shakeInterval);
                tw.to({ y: oy - shakeRange }, shakeInterval);
            }
            tw.to({ x: ox, y: oy }, shakeInterval);
        };
        CEffectFunc.clean = function (thisArg) {
            Utils.TimerManager.removeAll((thisArg || this));
            var len = CEffectFunc.rollingContentList.length;
            for (var i = 0; i < len; i++) {
                var obj = CEffectFunc.rollingContentList[i];
                Utils.removeFromParent(obj);
            }
            CEffectFunc.rollingContentList = [];
        };
        //在屏幕中间停留两秒
        CEffectFunc.flyCenter = function (obj) {
            obj.anchorOffsetX = obj.width * 0.5;
            obj.anchorOffsetY = obj.height * 0.5;
            obj.x = AGame.R.app.stageWidth * 0.5;
            obj.y = AGame.R.app.stageHeight * 0.5;
            AGame.R.app.topLevel.addChild(obj);
            var flyFunc = function () {
                var tw = egret.Tween.get(obj);
                tw.to({ y: obj.y - 100, alpha: 0.3 }, 1000, egret.Ease.sineIn);
                tw.call(function () { Utils.removeFromParent(obj); });
            };
            flyFunc();
        };
        /**
         * 滚动
         */
        CEffectFunc.rollingContentList = [];
        return CEffectFunc;
    }());
    com_main.CEffectFunc = CEffectFunc;
})(com_main || (com_main = {}));
