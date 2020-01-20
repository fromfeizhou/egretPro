var com_main;
(function (com_main) {
    var PropEffect = /** @class */ (function () {
        function PropEffect() {
        }
        PropEffect.addProp = function (type, num) {
            if (this.m_pFlyList.length > 0) {
                var dic = this.m_pPropList[type];
                if (dic) {
                    dic.push(num);
                }
                else {
                    this.m_pPropList[type] = [num];
                }
                return true;
            }
            return false;
        };
        /**
         * 飞资源或者道具
         * type 道具类型
         * num  道具数量
         * target1 起点对象
         * target2 终点对象
         */
        PropEffect.showPropEffect = function (type, num, target1, target2, speed) {
            if (speed === void 0) { speed = 2; }
            var textrue = PropModel.getPropIcon(type);
            var pos1 = egret.Point.create(0, 0);
            var pos2 = egret.Point.create(0, 0);
            target1.parent.localToGlobal(target1.x - target1.anchorOffsetX, target1.y - target1.anchorOffsetY, pos1);
            target2.parent.localToGlobal(target2.x - target2.anchorOffsetX, target2.y - target2.anchorOffsetY, pos2);
            var needCount = 10;
            this.m_pFlyList.push(num);
            var name = type;
            var _loop_1 = function (i) {
                var prop = new eui.Image(textrue);
                prop.scaleX = 0.5;
                prop.scaleY = 0.5;
                prop.name = name + '';
                SceneManager.addChild(LayerEnums.TOP, prop);
                var r1 = Utils.random(-200, 200);
                var r2 = Utils.random(-100, 50);
                var acrossPoint1 = egret.Point.create(pos1.x + Utils.random(-200, 200), pos1.y - 200);
                var acrossPoint = egret.Point.create(r1 + pos1.x, r2 + pos1.y);
                pos1.y += 30;
                pos2.y += 20;
                var acrossList = BerZerUtils.getBerZerPoints(needCount, pos1, pos2, [acrossPoint1, acrossPoint], true);
                fly = egret.Tween.get(prop);
                for (var j = 0; j < acrossList.length - 1; j++) {
                    ap = acrossList[j];
                    nextPoint = acrossList[j + 1];
                    if (j == 0) {
                        prop.x = ap.x;
                        prop.y = ap.y;
                        prop.rotation = ap.rotation;
                        flyAction = fly.to({ x: nextPoint.x, y: nextPoint.y, rotation: nextPoint.rotation }, speed * com_main.Point.distance(ap, nextPoint));
                    }
                    else {
                        flyAction = flyAction.to({ x: nextPoint.x, y: nextPoint.y, rotation: nextPoint.rotation }, speed * com_main.Point.distance(ap, nextPoint) * Utils.random(7, 0) / 10);
                    }
                }
                // flyAction = flyAction.to({ x: pos2.x, y: pos2.y }, speed * Point.distance(pos2, nextPoint));
                flyAction.call(function () {
                    var type = parseInt(prop.name);
                    Utils.removeFromParent(prop);
                    PropEffect.m_pCount += 1;
                    var tempCount = PropEffect.m_pCount;
                    if (PropEffect.m_pFlyList.length > 0 && PropEffect.m_pFlyList[0] <= PropEffect.m_pCount) {
                        PropEffect.m_pFlyList.shift();
                        PropEffect.m_pCount = 0;
                        // let arr = PropEffect.m_pPropList[type];
                        // if (arr && arr.length > 0) {
                        //     let num = arr.shift();
                        //     let all = 0;
                        //     switch (type) {
                        //         case PropEnum.FOOD: {
                        //             RoleData.food += num;
                        //             all = RoleData.food;
                        //             break;
                        //         }
                        //         case PropEnum.SILVER: {
                        //             RoleData.silver += num;
                        //             all = RoleData.silver;
                        //             break;
                        //         }
                        //     }
                        //     console.log('num1:',num);
                        //     console.log('all:',all);
                        com_main.MainTopBar.showIconAction(type);
                        // }
                    }
                }, this_1);
            };
            var this_1 = this, fly, nextPoint, ap, flyAction;
            for (var i = 0; i < num; i++) {
                _loop_1(i);
            }
        };
        PropEffect.m_pFlyList = []; //飞行特效数组和数量
        PropEffect.m_pCount = 0; //计数器
        PropEffect.m_pCanShowCount = 0; //可以播放增加特效的数量
        PropEffect.m_pPropList = {};
        return PropEffect;
    }());
    com_main.PropEffect = PropEffect;
})(com_main || (com_main = {}));
