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
     * 世界地图事件图标
     */
    var MapBoss = /** @class */ (function (_super_1) {
        __extends(MapBoss, _super_1);
        function MapBoss(type) {
            var _this = _super_1.call(this) || this;
            _this.name = MapBoss.NAME;
            _this.bossType = type;
            _this.skinName = Utils.getAppSkin("map/MapBossSkin.exml");
            return _this;
        }
        /**
        * 销毁方法
        */
        MapBoss.prototype.onDestroy = function () {
            if (this.m_bossEff) {
                this.m_bossEff.removeAction();
                this.m_bossEff = null;
            }
            if (this.m_attEff) {
                this.m_attEff.removeAction();
                this.m_attEff = null;
            }
            // Utils.TimerManager.remove(this.talkFunc, this);
            _super_1.prototype.onDestroy.call(this);
        };
        MapBoss.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            this.m_bossEff = ImageEffect.load_2('EBuild_Boss_' + this.bossType);
            this.m_bossEff.addBitmap(this.m_imgBossEff);
            // this.m_titleName.setTitleName(this.getBossName());
            this.updateBossView();
            this.m_nDialogIndex = 0;
            egret.setTimeout(function () {
                if (_this.m_bossEff) {
                    // this.talkFunc();
                    // Utils.TimerManager.doTimer(60000, 0, this.talkFunc, this);
                }
            }, this, this.bossType * 10000);
        };
        /**刷新boss显示 */
        MapBoss.prototype.updateBossView = function () {
            // if (BossModel.JudgeIsFight(this.bossType).res) {
            //     if (!this.m_attEff) {
            //         this.m_attEff = ImageEffect.load_2('EBuild_BossRage');
            //         this.m_attEff.addBitmap(this.m_imgAttEff);
            //     }
            //     this.m_imgAttEff.visible = true;
            //     this.m_imgAttFlag.visible = true;
            // } else {
            //     this.m_imgAttEff.visible = false;
            //     this.m_imgAttFlag.visible = false;
            // }
        };
        /**检测是否点中图标 */
        MapBoss.prototype.check_is_touch = function (x, y) {
            return this.m_imgBossEff.hitTestPoint(x, y, true);
        };
        MapBoss.NAME = 'MapBoss';
        return MapBoss;
    }(com_main.CComponent));
    com_main.MapBoss = MapBoss;
})(com_main || (com_main = {}));
