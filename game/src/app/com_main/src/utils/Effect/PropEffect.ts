module com_main {
    export class PropEffect {

        public static m_pFlyList: any[] = [];//飞行特效数组和数量
        public static m_pCount: number = 0;//计数器
        public static m_pCanShowCount: number = 0;//可以播放增加特效的数量

        public static m_pPropList: any = {};

        public static addProp(type: any, num: number): boolean {
            if (this.m_pFlyList.length > 0) {
                let dic = this.m_pPropList[type];

                if (dic) {
                    dic.push(num);
                } else {
                    this.m_pPropList[type] = [num];
                }

                return true;
            }
            return false;
        }

        /**
         * 飞资源或者道具
         * type 道具类型
         * num  道具数量
         * target1 起点对象
         * target2 终点对象
         */
        public static showPropEffect(type: PropEnum, num: number, target1: egret.DisplayObject, target2: egret.DisplayObject, speed: number = 2) {
            let textrue = PropModel.getPropIcon(type);

            let pos1 = egret.Point.create(0, 0);
            let pos2 = egret.Point.create(0, 0);

            target1.parent.localToGlobal(target1.x - target1.anchorOffsetX, target1.y - target1.anchorOffsetY, pos1);
            target2.parent.localToGlobal(target2.x - target2.anchorOffsetX, target2.y - target2.anchorOffsetY, pos2);
            
            let needCount = 10;
            this.m_pFlyList.push(num);

            let name = type;

            for (let i = 0; i < num; i++) {
                let prop = new eui.Image(textrue);
                prop.scaleX =0.5;
                prop.scaleY =0.5;
                
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

                // flyAction = flyAction.to({ x: pos2.x, y: pos2.y }, speed * Point.distance(pos2, nextPoint));

                flyAction.call(() => {
                    let type = parseInt(prop.name);
                    Utils.removeFromParent(prop);

                    PropEffect.m_pCount += 1;
                    let tempCount:number = PropEffect.m_pCount;

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
                            MainTopBar.showIconAction(type);
                        // }
                    }
                }, this);

            }
        }

    }

}