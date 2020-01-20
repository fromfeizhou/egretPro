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
    var BattleGeneralList = /** @class */ (function (_super_1) {
        __extends(BattleGeneralList, _super_1);
        function BattleGeneralList() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("battle_new/top_new/battle_general_list.exml");
            return _this;
        }
        BattleGeneralList.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        BattleGeneralList.prototype.childrenCreated = function () {
        };
        BattleGeneralList.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            //回收对象池
            for (var _i = 0, _a = this.generalList.$children; _i < _a.length; _i++) {
                var gHead = _a[_i];
                ObjectPool.push(gHead);
            }
            this.generalList.removeChildren();
        };
        BattleGeneralList.prototype.refreshGeneralList = function () {
            //回收对象池
            for (var _i = 0, _a = this.generalList.$children; _i < _a.length; _i++) {
                var gHead = _a[_i];
                ObjectPool.push(gHead);
            }
            this.generalList.removeChildren();
            // if(this.generalList.$children.length > 0){
            // 	this.generalList.removeChildren();
            // 	ObjectPool.pop(egret.BitmapText,"egret.BitmapText");
            // 	ObjectPool.push(txt);
            // }
            // this.generalList.removeChildren()
            var generalList = BattleModel.getUnitListType(UnitType.GENERAL, FactionType.ATK);
            function sortFun(a, b) {
                if (a.order > b.order) {
                    return 1;
                }
                else if (a.order < b.order) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
            generalList.sort(sortFun);
            // console.log(generalList);
            for (var _b = 0, generalList_1 = generalList; _b < generalList_1.length; _b++) {
                var unit = generalList_1[_b];
                var battleHead = ObjectPool.pop(com_main.BattleHeadRender, "BattleHeadRender", unit);
                // let battleHead = new BattleHeadRender(unit);
                this.generalList.addChild(battleHead);
            }
        };
        //更新头像血条
        BattleGeneralList.prototype.attrChange = function (data) {
            for (var _i = 0, _a = this.generalList.$children; _i < _a.length; _i++) {
                var obj = _a[_i];
                var battleHead = obj;
                var unitId = battleHead.getUnitId();
                var flowTime = data.flowTime ? data.flowTime : 0;
                if (unitId == data.id && flowTime >= battleHead.flowTime) {
                    battleHead.flowTime = flowTime;
                    if (!isNull(data.hp)) {
                        battleHead.setHP(data.hp);
                    }
                    if (!isNull(data.rage)) {
                        battleHead.setRage(data.rage);
                    }
                }
            }
        };
        return BattleGeneralList;
    }(com_main.CComponent));
    com_main.BattleGeneralList = BattleGeneralList;
})(com_main || (com_main = {}));
