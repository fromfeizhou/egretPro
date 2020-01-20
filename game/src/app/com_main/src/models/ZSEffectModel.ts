

/** 道具管理 */
module com_main {
    export class ZSEffectModel {

        private static m_pEffectInfo = {};

        /**
         * 初始化道具列表
         */
        public static init(list: any) {
            this.m_pEffectInfo = {}
        }

        private static getEffectInfo(type) {
            if (!this.m_pEffectInfo[type]) {
                let tempInfo = {
                    num: 0,
                    playCount: 0,
                }
                this.m_pEffectInfo[type] = tempInfo;
            }
            return this.m_pEffectInfo[type];
        }


        /**
             * 飞资源或者道具
             * type 道具类型
             * num  道具数量
             * target1 起点对象
             * target2 终点对象
             */
        public static onShowZSEffect(type: PropEnum, num: number, target1: egret.DisplayObject, target2: egret.DisplayObject, speed: number = 2) {

            let tempEffectInfo = this.getEffectInfo(type);
            tempEffectInfo.playCount += num;

            let textrue = PropModel.getPropIcon(type);
            let pos1 = egret.Point.create(0, 0);
            let pos2 = egret.Point.create(0, 0);

            target1.parent.localToGlobal(target1.x - target1.anchorOffsetX, target1.y - target1.anchorOffsetY, pos1);
            target2.parent.localToGlobal(target2.x - target2.anchorOffsetX, target2.y - target2.anchorOffsetY, pos2);

            let needCount = 10;
            let name = type;

            for (let i = 0; i < num; i++) {
                let prop = new eui.Image(textrue);
                prop.scaleX = 0.5;
                prop.scaleY = 0.5;

                prop.name = name + '';
                SceneManager.addChild(LayerEnums.TOP, prop);

                let r1 = Utils.random(-200, 200);
                let r2 = Utils.random(-100, 50);

                let acrossPoint1 = egret.Point.create(pos1.x + Utils.random(-200, 200), pos1.y - 200);
                let acrossPoint = egret.Point.create(r1 + pos1.x, r2 + pos1.y);

                pos1.y += 30;
                pos2.y += 20;

                let acrossList = BerZerUtils.getBerZerPoints(needCount, pos1, pos2, [acrossPoint1, acrossPoint], true);

                var fly = egret.Tween.get(prop);

                var nextPoint;

                for (let j = 0; j < acrossList.length - 1; j++) {

                    var ap = acrossList[j];
                    nextPoint = acrossList[j + 1];
                    if (j == 0) {
                        prop.x = ap.x;
                        prop.y = ap.y;
                        prop.rotation = ap.rotation;
                        var flyAction = fly.to({ x: nextPoint.x, y: nextPoint.y, rotation: nextPoint.rotation }, speed * Point.distance(ap, nextPoint));
                    } else {
                        flyAction = flyAction.to({ x: nextPoint.x, y: nextPoint.y, rotation: nextPoint.rotation }, speed * Point.distance(ap, nextPoint) * Utils.random(7, 0) / 10);
                    }
                }
                flyAction.call(() => {
                    let type = parseInt(prop.name);
                    Utils.removeFromParent(prop);
                    let effectInfo = this.getEffectInfo(type);
                    effectInfo.playCount--;

                    if (effectInfo.playCount <= 0) {
                        effectInfo.playCount = 0
                        effectInfo.needPlay = true;
                        MainTopBar.showIconAction(type);
                    }
                }, this);
            }
        }
    }

}