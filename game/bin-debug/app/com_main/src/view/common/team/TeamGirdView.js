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
    /**
    * 上阵格子
    * @export
    * @class BaseCampPosition
    * @extends CComponent
    */
    var TeamGirdView = /** @class */ (function (_super_1) {
        __extends(TeamGirdView, _super_1);
        function TeamGirdView() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/team/TeamGirdViewSkin.exml");
            return _this;
        }
        TeamGirdView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        TeamGirdView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.clearGeneral();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        TeamGirdView.prototype.checkTouched = function (point) {
            var pos = this.localToGlobal(), dis = egret.Point.distance(pos, point);
            return dis;
        };
        Object.defineProperty(TeamGirdView.prototype, "generalId", {
            get: function () {
                if (this.m_pHero) {
                    return this.m_pHero.generalId;
                }
                return 0;
            },
            set: function (id) {
                if (this.m_pHero && this.m_pHero.generalId == id) {
                    return;
                }
                this.clearGeneral();
                if (id > 0) {
                    this.m_pHero = new TeamManualSquare(id);
                    this.m_pHero.x = 100;
                    this.m_pHero.y = 80;
                    this.addChild(this.m_pHero);
                }
            },
            enumerable: true,
            configurable: true
        });
        TeamGirdView.prototype.updateHp = function (hp, isClient) {
            if (isClient === void 0) { isClient = false; }
            if (this.m_pHero) {
                this.m_pHero.updateHP(hp, isClient);
            }
        };
        TeamGirdView.prototype.clearGeneral = function () {
            if (this.m_pHero) {
                Utils.removeFromParent(this.m_pHero);
                this.m_pHero = null;
            }
        };
        return TeamGirdView;
    }(com_main.CComponent));
    com_main.TeamGirdView = TeamGirdView;
    /**
     * 上阵英雄方阵
     * @export
     * @class BaseManualSquare
     * @extends ManualSquare
     */
    var TeamManualSquare = /** @class */ (function (_super_1) {
        __extends(TeamManualSquare, _super_1);
        function TeamManualSquare(id) {
            var _this = _super_1.call(this, id) || this;
            _this.m_pHeadInfo = null;
            // private m_pTips: egret.DisplayObjectContainer;
            _this.hp = 0;
            _this.name = "TeamManualSquare";
            _this.width = 150;
            _this.height = 150;
            _this.touchChildren = true;
            _this.touchEnabled = true;
            _this.m_pHero.x += 60;
            _this.m_pHero.y -= 10;
            _this.m_pSoldier.x += 60;
            _this.m_pSoldier.y -= 10;
            _this.m_pHeadInfo = new com_main.WorldGeneralHeadInfo();
            var group = new eui.Group();
            group.x = 135;
            group.y = -35;
            _this.addChild(group);
            group.addChild(_this.m_pHeadInfo);
            _this.m_pHeadInfo.setData(_this.generalId);
            return _this;
            // }, this);
        }
        TeamManualSquare.prototype.isShowHead = function (visible) {
            this.m_pHeadInfo.visible = visible;
        };
        TeamManualSquare.prototype.updateHP = function (hp, isClient) {
            if (isClient === void 0) { isClient = false; }
            this.m_pHeadInfo.updateHP(hp);
            this.hp = hp;
            if (this.m_pLbName) {
                this.m_pLbName.visible = hp <= 0;
            }
            this.isShowSorlider(hp > 0);
            this.isShowTip(hp <= 0 && !isClient);
        };
        TeamManualSquare.prototype.onDestroy = function () {
            if (this.m_pHeadInfo) {
                this.m_pHeadInfo.onDestroy();
                this.m_pHeadInfo = null;
            }
            _super_1.prototype.onDestroy.call(this);
        };
        TeamManualSquare.NAME = "TeamManualSquare";
        return TeamManualSquare;
    }(com_main.ManualSquare));
    com_main.TeamManualSquare = TeamManualSquare;
})(com_main || (com_main = {}));
