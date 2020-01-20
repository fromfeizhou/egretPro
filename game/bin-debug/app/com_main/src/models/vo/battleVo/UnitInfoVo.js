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
/** 战斗单位信息 */
var UnitInfoVo = /** @class */ (function (_super_1) {
    __extends(UnitInfoVo, _super_1);
    function UnitInfoVo(body) {
        var _this = _super_1.call(this) || this;
        _this.init(body);
        return _this;
    }
    UnitInfoVo.create = function (body) {
        var obj = new UnitInfoVo(body);
        return obj;
    };
    UnitInfoVo.prototype.init = function (body) {
        this.m_position = null;
        if (body) {
            var keys = [
                "elementId", "sysId", "type", "troops", "maxTroops", "anager",
                "initBuffList", "moveSpeed", "terrainHurtAffix", "terrainHurtRemit",
                "generalName", "xy", "faction", "soldierType", "generalId", "belongUId", "soldierLv", "heroPosition"
            ];
            for (var ind in keys) {
                var key = keys[ind];
                this[key] = body[key];
            }
            this.belongType = BattleModel.getBelongTypeByFaction(this.faction);
            //小兵
            if (this.type == UnitType.SOLDIER) {
                var armyConfig = C.GeneralSoldierLvConfigDic[this.soldierType][this.soldierLv];
                if (this.belongType == BelongType.OWN) {
                    this.generalModelId = armyConfig.ourModelCode;
                }
                else {
                    this.generalModelId = armyConfig.enemyModelCode;
                }
            }
            // if(this.type == UnitType.BUILDING_WALL || this.type == UnitType.BUILDING_BARTIZAN || this.type == UnitType.ZHAO_HUAN_WU){
            // 	this.generalModelId = 1001;
            // }
            if (this.type == UnitType.GENERAL) {
                var generalConfig = C.GeneralConfig[this.generalId];
                if (generalConfig) {
                    this.generalModelId = generalConfig.ourModelCode;
                    this.sysId = this.generalId;
                }
                else {
                    error("this.generalId ", this.generalId);
                }
            }
            this.setSpeed(this.moveSpeed);
            /**临时城墙 */
            if (this.type == UnitType.BUILDING_WALL) {
                this.generalName = GCode(CLEnum.WAR_WALL);
                this.m_position = new egret.Point(1000, 675);
            }
            /**临时箭塔 */
            if (this.type == UnitType.BUILDING_BARTIZAN) {
                this.generalName = GCode(CLEnum.WAR_BARTIZAN);
            }
        }
    };
    UnitInfoVo.prototype.onDestroy = function () {
    };
    Object.defineProperty(UnitInfoVo.prototype, "position", {
        get: function () {
            if (!this.m_position) {
                var posx1 = (this.xy >> 16) & 0xff;
                var posy1 = (this.xy >> 0) & 0x7f;
                var position = ISOMap.getInstance().leftDownCellToPixel(posx1, posy1);
                /**临时城墙 箭塔 */
                if (this.type == UnitType.BUILDING_BARTIZAN) {
                    this.m_position = egret.Point.create(position[0], position[1] - 80); //new egret.Point(position[0],position[1] - 80);
                }
                else {
                    this.m_position = egret.Point.create(position[0], position[1]); //new egret.Point(position[0],position[1]);
                }
            }
            return this.m_position;
        },
        set: function (pos) {
            if (this.m_position) {
                this.m_position.x = pos.x;
                this.m_position.y = pos.y;
            }
            else {
                this.m_position = pos.clone();
            }
        },
        enumerable: true,
        configurable: true
    });
    UnitInfoVo.prototype.setCellXY = function (xy) {
        this.xy = xy;
    };
    Object.defineProperty(UnitInfoVo.prototype, "cellXY", {
        get: function () {
            var posx1 = (this.xy >> 16) & 0xff;
            var posy1 = (this.xy >> 0) & 0x7f;
            return [posx1, posy1];
        },
        enumerable: true,
        configurable: true
    });
    UnitInfoVo.prototype.getCellXY = function () {
        var posx1 = (this.xy >> 16) & 0xff;
        var posy1 = (this.xy >> 0) & 0x7f;
        return [posx1, posy1];
    };
    UnitInfoVo.prototype.setHp = function (val) {
        this.troops = val;
    };
    UnitInfoVo.prototype.getHp = function () {
        return this.troops;
    };
    UnitInfoVo.prototype.getMaxHp = function () {
        return this.maxTroops;
    };
    UnitInfoVo.prototype.getLoseHp = function () {
        // return this.m_pLoseHp;
        return 0;
    };
    UnitInfoVo.prototype.getPercentHP = function () {
        var perhp = this.getHp() / this.maxTroops;
        return perhp;
    };
    /** 设置当前点 */
    UnitInfoVo.prototype.setPosition = function (pos) {
        this.m_position = pos;
    };
    /** 设置目标点 */
    UnitInfoVo.prototype.setTargetPosition = function (pos) {
        // this.targetPosition = pos;
    };
    // /**设置逃跑速度 */
    // public setEscape(){
    // 	this.moveSpeed = this.moveSpeed*2;
    // }
    UnitInfoVo.prototype.getBattlePlayer = function () {
        // let playerInfo = BattleModel.getBattlePlayer(this.playerId2);
        // // if (isNull(playerInfo)) {
        // // 	let vplayer = BattleModel.getVirtualPlayer(this.playerId2);
        // // 	if (vplayer) playerInfo = vplayer.toBattlePlayerInfoVo();
        // // }
        // return playerInfo;
        return null;
    };
    // public getUnitConfig() {
    // 	if (!this.m_pConfig) this.m_pConfig = UnitData.getConfig(this.type, this.tmplId);
    // 	return this.m_pConfig;
    // }
    UnitInfoVo.prototype.setSpeed = function (speed) {
        this.moveSpeed = speed;
    };
    UnitInfoVo.prototype.getMainType = function () {
        return this.soldierType;
    };
    UnitInfoVo.prototype.getName = function () {
        var name = "";
        if (this.faction == FactionType.ATK) {
            name = name + GCode(CLEnum.WAR_ATTACK);
        }
        else {
            name = name + GCode(CLEnum.WAR_DEFENSE);
        }
        if (this.type == 1) {
            name = name + GCode(CLEnum.WAR_GEN);
            ;
        }
        else if (this.type == 2) {
            name = name + GCode(CLEnum.WAR_SOLDIER);
            ;
        }
        return name + this.generalName;
    };
    UnitInfoVo.prototype.getBelongUid = function () {
        if (this.belongUId) {
            return this.belongUId;
        }
        return 0;
    };
    return UnitInfoVo;
}(egret.HashObject));
