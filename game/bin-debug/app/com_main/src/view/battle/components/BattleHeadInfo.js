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
    var BattleHeadInfo = /** @class */ (function (_super_1) {
        __extends(BattleHeadInfo, _super_1);
        // private m_guajiInfo:{name: string,factionName: string,isSelf: boolean}
        function BattleHeadInfo() {
            var _this = _super_1.call(this) || this;
            // this.initApp("role/roel_battle_head_info.exml");
            _this.skinName = Utils.getAppSkin("battle_new/components/roel_battle_head_info.exml");
            return _this;
        }
        BattleHeadInfo.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeFromParent();
            this.m_pUnitInfo = null;
        };
        BattleHeadInfo.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            if (!this.m_pUnitInfo) {
                // this.showPlayerName();
                return;
            }
            this.setPlayerName();
            this.initHP();
            this.setCountryText();
        };
        BattleHeadInfo.prototype.setData = function (unitInfo) {
            this.m_pUnitInfo = unitInfo;
        };
        // public setPlayerLevel(level) {
        // 	this.m_lbLevel.text = level + "";
        // }
        BattleHeadInfo.prototype.setCountryText = function () {
            var info = GeneralModel.getNationText(this.m_pUnitInfo.sysId);
            this.country.text = info.text;
            this.country.textColor = info.color;
        };
        BattleHeadInfo.prototype.setCountryByCountryId = function (countryId) {
            var info = GeneralModel.getNationTextByCountryId(countryId);
            this.country.text = info.text;
            this.country.textColor = info.color;
        };
        BattleHeadInfo.prototype.setPlayerName = function () {
            this.m_lbName.text = this.m_pUnitInfo.generalName;
            if (this.m_pUnitInfo.faction == FactionType.ATK) {
                this.m_lbName.textColor = 0x00C6FF;
            }
            else if (this.m_pUnitInfo.faction == FactionType.DEF) {
                this.m_lbName.textColor = 0xFF0000;
            }
        };
        BattleHeadInfo.prototype.initHP = function () {
            if (this.m_pUnitInfo.faction == FactionType.ATK) {
                this.HP_image.source = "pro_017_png";
            }
            else if (this.m_pUnitInfo.faction == FactionType.DEF) {
                this.HP_image.source = "pro_016_png";
            }
        };
        BattleHeadInfo.prototype.setHP = function (hp) {
            if (this.HP_image) {
                var width = Math.min(1, hp / this.m_pUnitInfo.getMaxHp()) * 62;
                this.HP_image.width = width;
            }
        };
        /**
         * 显示玩家名字，国家
         */
        BattleHeadInfo.prototype.showPlayerName = function (guajiInfo) {
            this.hpBg_image.visible = false;
            this.HP_image.visible = false;
            if (guajiInfo.isSelf) {
                this.m_lbName.text = RoleData.nickName;
                this.m_lbName.textColor = 0x4BFE47;
            }
            else {
                this.m_lbName.text = guajiInfo.name;
                this.m_lbName.textColor = 0xFF37EA;
            }
            this.setCountryByCountryId(guajiInfo.countryId);
        };
        /**
         * 显示玩家阵营，
         */
        BattleHeadInfo.prototype.showFactionName = function (guajiInfo) {
            this.hpBg_image.visible = false;
            this.HP_image.visible = false;
            this.m_lbName.text = guajiInfo.name;
            if (guajiInfo.faction == CrossModel.getSelfGroup()) {
                this.m_lbName.textColor = 0x4BFE47;
                this.country.text = '我';
                this.country.textColor = 0x44d0f3;
            }
            else {
                this.m_lbName.textColor = 0xFF37EA;
                this.country.text = '敌';
                this.country.textColor = 0xff2727;
            }
        };
        return BattleHeadInfo;
    }(com_main.CComponent));
    com_main.BattleHeadInfo = BattleHeadInfo;
})(com_main || (com_main = {}));
