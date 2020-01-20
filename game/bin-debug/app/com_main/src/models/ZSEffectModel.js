/** 道具管理 */
var com_main;
(function (com_main) {
    var ZSEffectModel = /** @class */ (function () {
        function ZSEffectModel() {
        }
        /**
         * 初始化道具列表
         */
        ZSEffectModel.init = function (list) {
            this.m_pEffectInfo = {};
        };
        ZSEffectModel.getEffectInfo = function (type) {
            if (!this.m_pEffectInfo[type]) {
                var tempInfo = {
                    num: 0,
                    playCount: 0,
                };
                this.m_pEffectInfo[type] = tempInfo;
            }
            return this.m_pEffectInfo[type];
        };
        /**
             * 飞资源或者道具
             * type 道具类型
             * num  道具数量
             * target1 起点对象
             * target2 终点对象
             */
        ZSEffectModel.onShowZSEffect = function (type, num, target1, target2, speed) {
            var _this = this;
            if (speed === void 0) { speed = 2; }
            var tempEffectInfo = this.getEffectInfo(type);
            tempEffectInfo.playCount += num;
            var textrue = PropModel.getPropIcon(type);
            var pos1 = egret.Point.create(0, 0);
            var pos2 = egret.Point.create(0, 0);
            target1.parent.localToGlobal(target1.x - target1.anchorOffsetX, target1.y - target1.anchorOffsetY, pos1);
            target2.parent.localToGlobal(target2.x - target2.anchorOffsetX, target2.y - target2.anchorOffsetY, pos2);
            var needCount = 10;
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
                flyAction.call(function () {
                    var type = parseInt(prop.name);
                    Utils.removeFromParent(prop);
                    var effectInfo = _this.getEffectInfo(type);
                    effectInfo.playCount--;
                    if (effectInfo.playCount <= 0) {
                        effectInfo.playCount = 0;
                        effectInfo.needPlay = true;
                        com_main.MainTopBar.showIconAction(type);
                    }
                }, this_1);
            };
            var this_1 = this, fly, nextPoint, ap, flyAction;
            for (var i = 0; i < num; i++) {
                _loop_1(i);
            }
        };
        ZSEffectModel.m_pEffectInfo = {};
        return ZSEffectModel;
    }());
    com_main.ZSEffectModel = ZSEffectModel;
})(com_main || (com_main = {}));
