/**
 * Created by yaowan on 2016/12/26.
 */
module com_main {
    export class MapBery {
        public static NAME:string = 'MapBery';
        public birdList: Array<EImageSprite> = [];
        public nowFlyNum: number = 0;

        public static _instance: MapBery;

        public MapBeryLayer: egret.DisplayObjectContainer;
        public m_pWidth:number;
        public m_pHeight:number;

        public m_pIsCreateTime:boolean = false;

        public static getInstance():MapBery {
            if( !MapBery._instance ) {
                MapBery._instance = new MapBery();
            }
            return MapBery._instance;
        }

        public static MapBeryFlyTimeController(layer?,width?,height?){
            var bery = MapBery.getInstance();
            if (layer) bery.MapBeryLayer = layer;
            if (width) bery.m_pWidth = width;
            if (height) bery.m_pHeight = height;

            var active_time = 5 * (2 + Utils.random(-1,1));

            if(!bery.m_pIsCreateTime){
                bery.m_pIsCreateTime = true;
                Utils.TimerManager.doTimer(active_time * 1000,0,bery.doBeryFlys,bery);
            }else{
                Utils.TimerManager.changeTimerDelay(active_time * 1000, bery.doBeryFlys, bery)
            }

            
        }

        public doBeryFlys(){
            MapBery.fly();
            let r = Math.random();
            if(Math.random() > 0.5){
                var timeout = egret.setTimeout(function(){
                    egret.clearTimeout(timeout);
                    MapBery.fly();
                }, MapBery, 1000 * Utils.random(2,4));
            }
            MapBery.MapBeryFlyTimeController();
        }

        public static fly(){
            var flyCount = 9 + Utils.random(-2,2);
            MapBery.getInstance().getCanFlyBird(flyCount);
        }

        public getCanFlyBird(flyCount){
            if(this.birdList.length - this.nowFlyNum - flyCount >= 0){
                for(var i = 0; i < this.birdList.length; i++){
                    var bird = this.birdList[i];
                    if(!bird["isFly"] && this.birdList.length - this.nowFlyNum - flyCount > 0){
                        ImageEffect.removeAction(this.birdList.splice(i, 1)[0]);
                        i--;
                    }
                }
                this.fly(flyCount);
            }else{
                this.createBird(flyCount - this.birdList.length + this.nowFlyNum, this.fly.bind(this,flyCount));
            }
        }

        public createBird(birdCount, callBack){
            for(let i = 0; i < birdCount; i++){
                var bird = ImageEffect.load(IETypes.EMap_BirdFly);
                bird.name = MapBery.NAME;
                bird.scaleX = 0.2;
                bird.scaleY = 0.2;
                bird["isFly"] = false;
                this.birdList.push(bird);
                if(i == birdCount - 1){
                    callBack.call(this)
                }
            }
        }

        public fly(flyCount){
            var num = 0;
            var intoPos = Utils.random(1,2);
            // var intoPos = 3;
            for(var i = 0; num < flyCount; i++){
                if(this.MapBeryLayer == null)
                    return;
                var bird = this.birdList[i];
                if(!bird || bird["isFly"]) continue;

                num++;
                bird["isFly"] = true;
                this.nowFlyNum++;
                var acrossList = this.resolveFlyPoint(bird, intoPos);
                this.createFlyAction(bird, acrossList, 5);
            }
        }

        public resolveFlyPoint(birdSprite, intoPos):any[]{
            // var width = ApplicationMediator.app().stageWidth;
            // var height = ApplicationMediator.app().stageHeight;
            var width = this.m_pWidth;
            var height = this.m_pHeight;

            if(intoPos == 1){
                var start_x = width / 5 + Utils.random(- width / 15, width / 15);
                var start_y = - birdSprite.height - Utils.random(0, height / 15);

                var across_x = 4 * width / 5 + Utils.random(- width / 15, width / 15);
                var across_y = 4 * height / 5 + Utils.random(- height / 15, height / 15);

                var end_x = 2 * width + Utils.random(- width / 16, width / 16);
                var end_y = height / 2 - Utils.random(0, height / 15);
            }else{
                var start_x = - birdSprite.width + Utils.random(- width / 15, 0);
                var start_y = height / 5 - Utils.random(0, height / 15);

                var across_x = width / 2 + Utils.random(- width / 15, width / 15);
                var across_y = height / 2 + Utils.random(- height / 15, height / 15);

                var end_x = birdSprite.width + width + Utils.random(0, width / 16);
                var end_y = height / 2 - Utils.random(0, height / 15);
            }

            var needCount = 20;
            var Point = egret.Point;
            var startPoint = Point.create(start_x, start_y);
            var endPoint = Point.create(end_x, end_y);
            var acrossPoint = Point.create(across_x, across_y);

            return BerZerUtils.getBerZerPoints(needCount, startPoint, endPoint, [acrossPoint], true);
        }

        public createFlyAction(bird:EImageSprite, acrossList:Array<any>, speed:number){
            if(this.MapBeryLayer == null)
                return;
            var Point = egret.Point;

            var outTime = egret.setTimeout(function(){
                egret.clearTimeout(outTime);
                ImageEffect.runAction(bird);
            },this,Utils.random(0,360));

            this.MapBeryLayer.addChild(bird);
            var fly = egret.Tween.get(bird);
            for(var i = 0; i < acrossList.length - 1; i++){
                var acrossPoint = acrossList[i];
                var nextPoint = acrossList[i+1];
                if(i == 0){
                    bird.x = acrossPoint.x;
                    bird.y = acrossPoint.y;
                    bird.rotation = acrossPoint.rotation;
                    var flyAction = fly.to({x: nextPoint.x, y: nextPoint.y, rotation: nextPoint.rotation}, speed * Point.distance(acrossPoint, nextPoint));
                }else{
                    flyAction = flyAction.to({x: nextPoint.x, y:nextPoint.y, rotation: nextPoint.rotation}, speed * Point.distance(acrossPoint, nextPoint));
                }
            }

            flyAction.call(function(){
                this.removeBird(bird);
            },this);
        }

        public static MapBeryStopFly(){
            MapBery.getInstance().onDestroy();
            this._instance = null;
        }

        public MapBeryStopFly(){
            if(this.nowFlyNum > 0){
                for(var i = 0; i < this.birdList.length; i++){
                    var bird = this.birdList[i];
                    if(bird["isFly"]){
                        this.removeBird(bird);
                    }
                }
            }
        }

        public onDestroy(){
            this.MapBeryStopFly();
            Utils.TimerManager.remove(this.doBeryFlys,this);
            this.MapBeryLayer = null;
            this.birdList = [];
        }

        public removeBird(bird){
            egret.Tween.removeTweens(bird);
            bird["isFly"] = false;
            this.nowFlyNum--;
            ImageEffect.stopAction(bird);
            bird.parent.removeChild(bird);
        }
    }
}