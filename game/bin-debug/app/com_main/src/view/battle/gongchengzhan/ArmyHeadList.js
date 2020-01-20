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
    var ArmyHeadList = /** @class */ (function (_super_1) {
        __extends(ArmyHeadList, _super_1);
        function ArmyHeadList() {
            var _this = _super_1.call(this) || this;
            _this.state = 1; //状态1 收缩  状态2 涨开的 
            _this.isMoving = false; //是否在移动，移动中不给点击
            _this.skinName = Utils.getAppSkin("battle_new/gongchengzhan/army_list.exml");
            return _this;
        }
        Object.defineProperty(ArmyHeadList.prototype, "num", {
            get: function () {
                return this.headList_group.numChildren;
            },
            enumerable: true,
            configurable: true
        });
        ArmyHeadList.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initData();
        };
        ArmyHeadList.prototype.initData = function () {
            this.$addEvent();
            com_main.EventManager.addTouchTapListener(this.jiantou_group, this, this.onClickJiantou); //箭头
            this.$getArmy();
        };
        ArmyHeadList.prototype.$addEvent = function () {
            com_main.EventMgr.addEvent(BattleEvent.BATTLE_SIEGE_SELF, this.$getArmy, this);
        };
        ArmyHeadList.prototype.$removeEvent = function () {
            com_main.EventMgr.removeEventByObject(BattleEvent.BATTLE_SIEGE_SELF, this);
        };
        ArmyHeadList.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        ArmyHeadList.prototype.onDestory = function () {
            this.$removeEvent();
            com_main.EventManager.removeEventListeners(this);
        };
        ArmyHeadList.prototype.onClickJiantou = function () {
            var _this = this;
            if (this.isMoving) {
                return;
            }
            if (this.state == 1) {
                this.isMoving = true;
                var tw = egret.Tween.get(this);
                tw.to({ x: 0 }, 500, egret.Ease.sineOut);
                tw.call(function () {
                    _this.state = 2;
                    _this.isMoving = false;
                    _this.jiantou_image.scaleX = 1;
                });
            }
            else if (this.state == 2) {
                this.isMoving = true;
                var tw = egret.Tween.get(this);
                tw.to({ x: 158 - this.width }, 500, egret.Ease.sineOut);
                tw.call(function () {
                    _this.state = 1;
                    _this.isMoving = false;
                    _this.jiantou_image.scaleX = -1;
                });
            }
        };
        ArmyHeadList.prototype.$getArmy = function (data) {
            if ((BattleModel.isCityWar() || BattleModel.isQuene) && WorldModel.getCityWarInfo()) {
                var cityWarInfo = WorldModel.getCityWarInfo();
                var cid = WorldModel.getCityWarInfo().cityId;
                var curBattleId = BattleModel.getJoinedBattleId();
                var heros = WorldModel.getSiegeSelf();
                if (!heros || heros.length == 0) {
                    this.visible = false;
                    this.headList_group.removeChildren();
                }
                else {
                    if (heros.length == 1) {
                        this.bg_image.visible = false;
                        this.jiantou_group.visible = false;
                        this.x = 158 - this.width;
                        this.state = 1;
                    }
                    else {
                        this.bg_image.visible = true;
                        this.jiantou_group.visible = true;
                        this.x = 0;
                        this.state = 2;
                    }
                    this.visible = true;
                    this.refreshArmyList(heros.reverse());
                }
                // const cid = WorldModel.
            }
            else {
                this.visible = false;
                this.headList_group.removeChildren();
            }
        };
        ArmyHeadList.prototype.refreshArmyList = function (list) {
            this.headList_group.removeChildren();
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var o = list_1[_i];
                if (o.mainGid == 0)
                    continue;
                var army = new com_main.MyHeadRender(o);
                this.headList_group.addChild(army);
            }
            this.x = 158 - this.width;
        };
        return ArmyHeadList;
    }(com_main.CComponent));
    com_main.ArmyHeadList = ArmyHeadList;
})(com_main || (com_main = {}));
