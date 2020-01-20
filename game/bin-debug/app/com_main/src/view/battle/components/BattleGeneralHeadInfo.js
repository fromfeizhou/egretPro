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
    var BattleGeneralHeadInfo = /** @class */ (function (_super_1) {
        __extends(BattleGeneralHeadInfo, _super_1);
        function BattleGeneralHeadInfo(unitInfo) {
            var _this = _super_1.call(this) || this;
            _this.m_pUnitInfo = unitInfo;
            _this.width = 136;
            _this.height = 52;
            _this.hpBg_image = new eui.Image("proBg_016_png");
            _this.hpBg_image.width = 72;
            _this.hpBg_image.height = 7;
            _this.hpBg_image.x = 36;
            _this.hpBg_image.y = 29;
            _this.hpBg_image.scale9Grid = new egret.Rectangle(4, 3, 2, 3);
            _this.addChild(_this.hpBg_image);
            _this.HP_image = new eui.Image("pro_017_png");
            _this.HP_image.x = 37;
            _this.HP_image.y = 30;
            _this.HP_image.width = 70;
            _this.HP_image.height = 5;
            _this.addChild(_this.HP_image);
            _this.m_lbName = new eui.Label();
            _this.m_lbName.textColor = 0x00C6FF;
            _this.m_lbName.size = 18;
            _this.m_lbName.fontFamily = "Microsoft YaHei";
            _this.m_lbName.text = "";
            _this.m_lbName.x = 53;
            _this.m_lbName.y = 7;
            _this.m_lbName.stroke = 2;
            _this.m_lbName.strokeColor = 0x000000;
            _this.m_lbName.horizontalCenter = 3;
            _this.addChild(_this.m_lbName);
            var group = new eui.Group();
            group.x = 20;
            group.y = 25 - 3;
            group.width = 23;
            group.height = 23;
            _this.addChild(group);
            var image = new eui.Image("border_016_png");
            image.x = 2.15;
            image.y = 2.8;
            image.scaleX = image.scaleY = 0.33;
            group.addChild(image);
            _this.generalType = new eui.Image("general_type_bubing2_png");
            _this.generalType.x = 0.4;
            _this.generalType.y = -1.7;
            _this.generalType.scaleX = _this.generalType.scaleY = 0.5;
            group.addChild(_this.generalType);
            if (!_this.m_pUnitInfo) {
                return _this;
            }
            _this.setPlayerName();
            _this.initHP();
            _this.initTypeIcon();
            return _this;
        }
        // public onDestroy() {
        // 	super.onDestroy();
        // 	this.removeFromParent();
        // 	this.m_pUnitInfo = null;
        //     // Utils.TimerManager.remove(this.removeOneSoldier,this)
        // }
        // protected childrenCreated(): void {
        // 	super.childrenCreated();
        // 	if(!this.m_pUnitInfo){
        // 		// this.showPlayerName();
        // 		return ;
        // 	}
        // 	this.setPlayerName();
        // 	this.initHP();
        //     this.staticUpdateSoldierHpBar();
        //     this.initTypeIcon();
        //     this.soliderNum.visible = false;
        // }
        // public setData(unitInfo: UnitInfoVo) {
        // 	this.m_pUnitInfo = unitInfo;
        // }
        BattleGeneralHeadInfo.prototype.setPlayerName = function () {
            this.m_lbName.text = this.m_pUnitInfo.generalName;
            if (this.m_pUnitInfo.faction == FactionType.ATK) {
                this.m_lbName.textColor = 0x00C6FF;
            }
            else if (this.m_pUnitInfo.faction == FactionType.DEF) {
                this.m_lbName.textColor = 0xFF0000;
            }
        };
        BattleGeneralHeadInfo.prototype.initTypeIcon = function () {
            //初始化头像信息				
            this.generalType.source = GeneralModel.getSoldierTypeIcon(this.m_pUnitInfo.soldierType, 2);
        };
        BattleGeneralHeadInfo.prototype.initHP = function () {
            if (this.m_pUnitInfo.faction == FactionType.ATK) {
                this.HP_image.source = "pro_023_png";
            }
            else if (this.m_pUnitInfo.faction == FactionType.DEF) {
                this.HP_image.source = "pro_022_png";
            }
            this.setHP(this.m_pUnitInfo.getHp());
        };
        BattleGeneralHeadInfo.prototype.setHP = function (hp) {
            if (this.HP_image) {
                var width = Math.min(1, hp / this.m_pUnitInfo.getMaxHp()) * 70;
                this.HP_image.width = width;
            }
        };
        BattleGeneralHeadInfo.prototype.updateSoldierHpBar = function () {
            // if(this.m_pUnitInfo.getHp() <= 0) return ;
            // let targerNum = this.getSoldierHp();
            // if(!this.m_isBlooding && this.m_curSoldierNum - targerNum > 0){
            //     this.m_isBlooding = true;
            //     this.m_targerNum = targerNum;
            //     Utils.TimerManager.remove(this.removeOneSoldier,this)
            //     let time = ConstUtil.getValue(IConstEnum.BATTLE_GENERAL_SOLDIER_SUB_TIEM);
            //     Utils.TimerManager.doTimer(time,0,this.removeOneSoldier,this);
            // }else{
            //     this.m_targerNum = targerNum;
            // }
        };
        BattleGeneralHeadInfo.prototype.removeOneSoldier = function () {
            // if(this.m_curSoldierNum <= 0){
            //     Utils.TimerManager.remove(this.removeOneSoldier,this)
            //     return;
            // }
            // this.soliderNum.removeChildAt(0);
            // this.m_curSoldierNum -= 1;
            // if(this.m_targerNum == this.m_curSoldierNum){
            //     Utils.TimerManager.remove(this.removeOneSoldier,this)
            //     this.m_isBlooding = false;
            // }
        };
        // 静态刷新小兵血条
        BattleGeneralHeadInfo.prototype.staticUpdateSoldierHpBar = function () {
            // let num = this.getSoldierHp();
            // this.soliderNum.removeChildren();
            // for(let i = 0; i < num; i++){
            //     let img = new eui.Image();
            //     img.source = "pro_021_png";
            //     this.soliderNum.addChild(img);
            // }
            // this.m_curSoldierNum = num;
        };
        BattleGeneralHeadInfo.prototype.getSoldierHp = function () {
            // let units = BattleModel.getUnits();
            // let num = 0;
            // for(let i in units){
            //     let unit = units[i];
            //     if(unit.getBelongUid() == this.m_pUnitInfo.elementId && unit.getHp() > 0){
            //         num += 1;
            //     }
            // }
            // return num;
        };
        /**
         * 清空小兵血条
         */
        BattleGeneralHeadInfo.prototype.clearSoldierHp = function () {
            // Utils.TimerManager.remove(this.removeOneSoldier,this);
            // this.soliderNum.removeChildren();
        };
        return BattleGeneralHeadInfo;
    }(eui.Component));
    com_main.BattleGeneralHeadInfo = BattleGeneralHeadInfo;
})(com_main || (com_main = {}));
