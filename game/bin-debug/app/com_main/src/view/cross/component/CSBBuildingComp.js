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
/**
 * 跨服战内城墙建筑
 */
var com_main;
(function (com_main) {
    var CSBBuildingComp = /** @class */ (function (_super_1) {
        __extends(CSBBuildingComp, _super_1);
        function CSBBuildingComp() {
            var _this = _super_1.call(this) || this;
            _this.m_buildId = 0;
            _this.m_isSelect = false;
            _this.skinName = Utils.getAppSkin("cross/component/CSBBuildingSkin.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        CSBBuildingComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_buildImg.pixelHitTest = true;
            this.touchEnabled = false;
            com_main.EventManager.addTouchTapListener(this.m_topBtn, this, this.onClickTopBtn);
            com_main.EventManager.addTouchScaleListener(this.m_warBtn, this, this.onClickWatchBattle);
        };
        Object.defineProperty(CSBBuildingComp.prototype, "select", {
            get: function () {
                return this.m_isSelect;
            },
            set: function (boo) {
                if (boo == this.m_isSelect)
                    return;
                this.m_isSelect = boo;
                Utils.isGlow(boo, this.m_buildImg);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CSBBuildingComp.prototype, "bId", {
            get: function () {
                return this.m_buildId;
            },
            set: function (id) {
                this.m_buildId = id;
                this.m_pos = new com_main.Point(this.x + this.width / 2, this.y + this.height / 2 + CSBBuildingComp.buildInfo[this.m_buildId].posOffY);
                // this.refreshCityName();
                // this.refreshCityState();
            },
            enumerable: true,
            configurable: true
        });
        CSBBuildingComp.prototype.onDestroy = function () {
            this.removeFire();
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        CSBBuildingComp.prototype.getPoint = function () {
            if (this.m_pos)
                return this.m_pos;
            return com_main.Point.create({ x: 0, y: 0 });
        };
        CSBBuildingComp.prototype.refreshCityName = function () {
            var data = CrossModel.getCityInfoById(this.m_buildId);
            if (data) {
                this.m_cityName.text = data.getCityName();
            }
        };
        CSBBuildingComp.prototype.refreshCityState = function () {
            this.refreshCityName();
            var data = CrossModel.getCityInfoById(this.m_buildId);
            if (data) {
                var faction = data.getFaction();
                if (faction == CSBFaction.OUR) {
                    this.m_flagImg.source = 'zyt_vs_blue_png';
                    this.m_faction.strokeColor = 0x173e96;
                    this.m_faction.text = '我';
                    this.m_flagImg.visible = true;
                    this.m_faction.visible = true;
                }
                else if (faction == CSBFaction.NONE) {
                    this.m_flagImg.visible = false;
                    this.m_faction.visible = false;
                }
                else if (faction == CSBFaction.EMENY) {
                    this.m_flagImg.source = 'zyt_vs_red_png';
                    this.m_faction.strokeColor = 0x961717;
                    this.m_faction.text = '敌';
                    this.m_flagImg.visible = true;
                    this.m_faction.visible = true;
                }
                if (data.status == 0) {
                    this.m_warBtn.visible = false;
                    this.removeFire();
                }
                else if (data.status == 1) {
                    this.m_warBtn.visible = true;
                    this.showFire();
                }
                if (data.isMyCamp()) {
                    this.m_topBtn.visible = true;
                    this.refreshCampHp();
                }
            }
        };
        CSBBuildingComp.prototype.refreshCampHp = function () {
            var crossServerConst = C.CrossServerConstConfig[CrossServerConstType.MAX_TROOPS];
            var maxTroop = unNull(crossServerConst) ? Number(crossServerConst.value) : 0;
            this.m_bili.text = Math.floor(CrossModel.curTroop / maxTroop * 100) + '%';
        };
        CSBBuildingComp.prototype.showFire = function () {
            if (this.m_buildId > 5)
                return;
            if (this.m_pBattleEffect)
                return;
            var effectMC = new MCDragonBones();
            this.m_pBattleEffect = effectMC;
            effectMC.initAsync(IETypes.EWORLD_City_Fire);
            effectMC.x = this.width / 2;
            effectMC.y = this.height / 2;
            this.m_effNode.addChild(this.m_pBattleEffect);
            this.m_pBattleEffect.play(CSBBuildingComp.buildInfo[this.m_buildId].fireName);
            NodeUtils.setPosition(this.m_pBattleEffect, this.width / 2 + CSBBuildingComp.buildInfo[this.m_buildId].fireOffX, this.height / 2 + CSBBuildingComp.buildInfo[this.m_buildId].fireOffY);
        };
        CSBBuildingComp.prototype.removeFire = function () {
            if (this.m_pBattleEffect) {
                this.m_pBattleEffect.destroy();
                this.m_pBattleEffect = null;
            }
        };
        CSBBuildingComp.prototype.onClickTopBtn = function () {
            console.log('点击兵库');
            Utils.open_view(TASK_UI.CROSS_BARRACKS, this.m_buildId);
            // Utils.open_view(TASK_UI.CROSS_BUY_TOWER_PANEL, this.m_buildId);
        };
        CSBBuildingComp.prototype.onClickWatchBattle = function () {
            console.log('观看战斗');
            var cityInfo = CrossModel.getCityInfoById(this.m_buildId);
            WorldProxy.send_C2S_CITY_WAR_GO(cityInfo.warAreaId);
        };
        CSBBuildingComp.buildInfo = {
            "1": { posOffX: 0, posOffY: 50, fireOffX: 20, fireOffY: 0, fireName: 'zhanhuo4' },
            "2": { posOffX: 0, posOffY: 0, fireOffX: 60, fireOffY: 20, fireName: 'zhanhuo7' },
            "3": { posOffX: 0, posOffY: 0, fireOffX: 0, fireOffY: 0, fireName: 'zhanhuo6' },
            "4": { posOffX: 0, posOffY: 0, fireOffX: 0, fireOffY: 0, fireName: 'zhanhuo5' },
            "5": { posOffX: 0, posOffY: 0, fireOffX: 0, fireOffY: 0, fireName: 'zhanhuo6' },
            "6": { posOffX: 0, posOffY: 40, fireOffX: 0, fireOffY: 0, fireName: '' },
            "7": { posOffX: 0, posOffY: 30, fireOffX: 0, fireOffY: 0, fireName: '' },
        };
        return CSBBuildingComp;
    }(com_main.CComponent));
    com_main.CSBBuildingComp = CSBBuildingComp;
})(com_main || (com_main = {}));
