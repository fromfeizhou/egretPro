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
    var BattleGeneralDieHead = /** @class */ (function (_super_1) {
        __extends(BattleGeneralDieHead, _super_1);
        function BattleGeneralDieHead() {
            return _super_1.call(this) || this;
        }
        BattleGeneralDieHead.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        BattleGeneralDieHead.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.leftAction.addEventListener("complete", this.onPlayComplete, this);
            this.rightAction.addEventListener("complete", this.onPlayComplete, this);
        };
        BattleGeneralDieHead.prototype.setInfo = function (faction, generalId) {
            var _this = this;
            // this.roleId = roleId;
            this.faction = faction;
            var gCfg = GeneralModel.getGeneralConfig(generalId);
            if (gCfg) {
                this.img_head.source = GeneralModel.getCircleLogo(gCfg.role);
            }
            var belongType = BattleModel.getBelongTypeByFaction(this.faction);
            if (belongType == BelongType.OWN) {
                this.img_faction.source = "battle_lb_wf_png";
            }
            else {
                this.img_faction.source = "battle_lb_df_png";
            }
            Utils.isGray(true, this.img_head);
            if (faction == FactionType.ATK) {
                Utils.TimerManager.doTimer(1, 1, function () { _this.playLeft(); }, this);
            }
            else {
                Utils.TimerManager.doTimer(1, 1, function () { _this.playRight(); }, this);
            }
        };
        BattleGeneralDieHead.prototype.playLeft = function () {
            if (!this.leftAction) {
                return;
            }
            this.leftAction.play(0);
            this.visible = true;
        };
        BattleGeneralDieHead.prototype.playRight = function () {
            if (!this.rightAction) {
                return;
            }
            this.rightAction.play(0);
            this.visible = true;
        };
        BattleGeneralDieHead.prototype.onPlayComplete = function () {
            BattleModel.playGeneralDieComplete(this.faction);
            this.visible = false;
        };
        return BattleGeneralDieHead;
    }(com_main.CComponent));
    com_main.BattleGeneralDieHead = BattleGeneralDieHead;
})(com_main || (com_main = {}));
