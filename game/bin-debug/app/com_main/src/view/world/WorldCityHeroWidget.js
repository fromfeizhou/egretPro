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
    var WorldHeroBoxWidget = /** @class */ (function (_super_1) {
        __extends(WorldHeroBoxWidget, _super_1);
        function WorldHeroBoxWidget() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("world/world_box_widget.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        WorldHeroBoxWidget.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        return WorldHeroBoxWidget;
    }(com_main.CComponent));
    /**
     * 城池部队头像列表
     * @export
     * @class WorldCityHeroWidget
     * @extends egret.DisplayObjectContainer
     */
    var WorldCityHeroWidget = /** @class */ (function (_super_1) {
        __extends(WorldCityHeroWidget, _super_1);
        function WorldCityHeroWidget(cid) {
            var _this = _super_1.call(this) || this;
            _this.m_bShow = false;
            _this.m_aPos = [];
            _this.m_nCityId = 0;
            _this.m_nCityId = cid;
            _this.once(egret.Event.ADDED_TO_STAGE, _this.onEnter, _this);
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        WorldCityHeroWidget.prototype.onEnter = function () {
            this.update();
        };
        WorldCityHeroWidget.prototype.$createItem = function (gid, i, num) {
            this.m_genItem = com_main.GeneralHeadRender.create("none");
            Utils.addChild(this, this.m_genItem);
            this.m_genItem.setGenId(gid);
            this.m_genItem.scaleX = 0.7;
            this.m_genItem.scaleY = 0.7;
            var x = (this.width - this.m_genItem.width * 0.7) / 2 + 3.5 * i, y = (this.height - this.m_genItem.height * 0.7 - 3.5 * (num - 1)) / 2 - 2 + 3.5 * i + 12;
            this.m_genItem.x = x;
            this.m_genItem.y = y;
            this.m_aPos.push([x, y]);
            return this.m_genItem;
        };
        WorldCityHeroWidget.prototype.onDestroy = function () {
            if (this.m_genItem) {
                this.m_genItem.onDestroy();
                this.m_genItem = null;
            }
        };
        WorldCityHeroWidget.prototype.checkTouchEvent = function (x, y) {
            if (this.m_pMain.hitTestPoint(x, y)) {
                this.show();
                return true;
            }
            this.hide();
            return false;
        };
        WorldCityHeroWidget.prototype.show = function () {
            var len = this.m_aPos.length;
            if (this.m_bShow || len == 1)
                return;
            this.m_bShow = true;
            egret.Tween.get(this.m_pMain).to({ width: 388 }, 50, egret.Ease.elasticOut);
            if (len > 2) {
                this.m_pPanel.visible = true;
                egret.Tween.get(this.m_pPanel).to({ x: 0 }, 50, egret.Ease.elasticOut);
            }
            var pos = WorldData.getCityHeroPos(len);
            if (pos == undefined)
                return;
            var i = this.numChildren - 1;
            for (var _i = 0, pos_1 = pos; _i < pos_1.length; _i++) {
                var p = pos_1[_i];
                var spr = this.getChildAt(i), x = p[0], y = p[1], dt = p[2];
                egret.Tween.get(spr).to({ x: x, y: y }, dt, egret.Ease.elasticOut);
                i--;
            }
        };
        WorldCityHeroWidget.prototype.hide = function () {
            if (!this.m_bShow)
                return;
            this.m_bShow = false;
            egret.Tween.get(this.m_pMain).to({ width: 132 }, 50, egret.Ease.elasticOut);
            if (this.m_aPos.length > 2) {
                this.m_pPanel.visible = false;
                this.m_pPanel.x = 500;
            }
            var i = 2;
            for (var _i = 0, _a = this.m_aPos; _i < _a.length; _i++) {
                var p = _a[_i];
                var spr = this.getChildAt(i), x = p[0], y = p[1];
                egret.Tween.get(spr).to({ x: x, y: y }, i * 50, egret.Ease.bounceOut);
                i++;
            }
        };
        WorldCityHeroWidget.prototype.update = function () {
            this.removeChildren();
            this.m_pMain = new WorldHeroBoxWidget();
            Utils.addChild(this, this.m_pMain);
            this.width = 132;
            this.height = 114;
            this.m_pPanel = new WorldHeroBoxWidget();
            Utils.addChild(this, this.m_pPanel);
            this.m_pPanel.width = 388;
            this.m_pPanel.x = 500;
            this.m_pPanel.y = -105;
            this.m_pPanel.visible = false;
            this.m_aPos = [];
            var heroList = [];
            // for (let i = 1; i <= FormunitModel.armyNum; i ++) {
            //     let gid = FormunitModel.getFormunitMainHero(i);
            //     if (gid == 0) continue;
            //     const hero = WorldModel.getHeroConfig(gid);
            //     if (hero.pos != this.m_nCityId || hero.status != EumWorldHeroStatus.NORMAL) continue;
            //     arr.push(gid);
            // }
            var teamVoList = TeamModel.getTeamVoListByCityId(this.m_nCityId);
            var len = teamVoList.length;
            for (var index = 0; index < len; index++) {
                if (teamVoList[index].teamGeneralData.length == 0)
                    continue;
                // let gid: number = teamVoList[index].teamGeneralData[0].generalId;
                var gid = TeamModel.getTeamMainHero(teamVoList[index]);
                if (gid == 0)
                    continue;
                heroList.push(gid);
            }
            var num = heroList.length;
            if (num == 0) {
                Utils.removeFromParent(this);
                return false;
            }
            var i = 0;
            for (var _i = 0, heroList_1 = heroList; _i < heroList_1.length; _i++) {
                var gid = heroList_1[_i];
                this.$createItem(gid, i, num);
                i++;
            }
            return true;
        };
        return WorldCityHeroWidget;
    }(egret.DisplayObjectContainer));
    com_main.WorldCityHeroWidget = WorldCityHeroWidget;
})(com_main || (com_main = {}));
