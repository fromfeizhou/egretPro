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
    var HeroLayer = /** @class */ (function (_super_1) {
        __extends(HeroLayer, _super_1);
        function HeroLayer(w, h) {
            var _this = _super_1.call(this) || this;
            _this.name = HeroLayer.NAME;
            _this.width = w;
            _this.height = h;
            _this.addEventListener(egret.Event.ENTER_FRAME, _this.tickEvent, _this);
            return _this;
        }
        HeroLayer.prototype.onDestroy = function () {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.tickEvent, this);
            Utils.removeAllChild(this);
        };
        /**
         * 创建英雄线移动
         * @param  {number} start
         * @param  {number[]} points
         * @param  {number=0} dt
         * @returns ArmySprite
         */
        HeroLayer.prototype.createHero = function (data) {
            var hero = new com_main.ArmySprite(0, 0);
            var key = WorldModel.getTeamMoveKey(data);
            hero.teamKey = key;
            this.addChild(hero);
            // if (data.playerId == RoleData.playerId)
            hero.initMoveInfo(data.cityPath, data.startTime, data.endTime, data.moveType);
            // let l:number[] = []
            // for (let [x, y] of hero.getChildrenPoint()) {
            // 	let spr = new SoldierSprite(hero.x, hero.y, x, y);
            // 	this.addChildAt(spr, 0);
            // 	l.push(spr.iid);
            // }
            // hero.setChildrenId(l);
            return hero;
        };
        /**
         * 创建英雄点移动
         * @param  {number} start
         * @param  {number} end
         */
        // public createHeroMove(start: number, end: number) {
        // 	let hero = new ArmySprite();
        // 	this.addChild(hero);
        // 	hero.initMoveInfo(3, [start, end]);
        // 	return hero;
        // }
        HeroLayer.prototype.createHeroMoveEvt = function (data) {
            var evtVo = WorldModel.getEventVoByPosId(data.evtPosId);
            if (!evtVo)
                return;
            var hero = new com_main.ArmySprite();
            this.addChild(hero);
            hero.teamKey = 'client_' + data.teamId;
            hero.initLineMoveInfo(data);
            return hero;
        };
        HeroLayer.prototype.getAmryChildren = function (children, cb, target) {
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var id = children_1[_i];
                var soldier = this.getSoldier(id);
                if (!soldier)
                    continue;
                cb.call(target, soldier);
            }
        };
        /**
         * 获取英雄
         * @param  {number} iid
         * @returns ArmySprite
         */
        HeroLayer.prototype.getHero = function (iid) {
            var obj = this.getChildByName("hero_" + iid);
            if (!obj)
                return;
            return obj;
        };
        HeroLayer.prototype.getSoldier = function (iid) {
            var obj = this.getChildByName("soldier_" + iid);
            if (!obj)
                return;
            return obj;
        };
        HeroLayer.prototype.tickEvent = function () {
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var o = _a[_i];
                // if (o instanceof SoldierSprite) continue;
                var obj = o;
                if (obj) {
                    obj.tickEvent();
                }
            }
            return false;
        };
        /**
         * 删除英雄
         * @param  {number} iid
         * @returns void
         */
        HeroLayer.prototype.removeHero = function (iid) {
            var hero = this.getHero(iid);
            if (!hero)
                return;
            this.getAmryChildren(hero.soldierChildren, function (o) {
                Utils.removeFromParent(o);
            }, hero);
            hero.removeFromParent();
        };
        /**
         * 点击事件
         * @param  {egret.TouchEvent} e
         * @returns boolean
         */
        HeroLayer.prototype.onTouch = function (e) {
            var isHasShow = false; //如果只能同时存在一个菜单
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var o = _a[_i];
                if (o instanceof com_main.SoldierSprite)
                    continue;
                var obj = o;
                if (obj.checkTouchEvent(e.stageX, e.stageY)) {
                    isHasShow = true;
                    break;
                    ;
                }
            }
            return isHasShow;
        };
        HeroLayer.NAME = "HeroLayer";
        return HeroLayer;
    }(egret.DisplayObjectContainer));
    com_main.HeroLayer = HeroLayer;
})(com_main || (com_main = {}));
