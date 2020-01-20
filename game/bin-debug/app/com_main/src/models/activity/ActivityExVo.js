/**
 * 活动拓展
 */
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
/**战力冲榜 */
var FightRankVo = /** @class */ (function (_super_1) {
    __extends(FightRankVo, _super_1);
    function FightRankVo() {
        return _super_1.call(this) || this;
    }
    //获取战力榜单奖励对应配置表
    FightRankVo.prototype.getPowerRankCfg = function (rank) {
        return this.configs[rank];
    };
    /**是否需要读取服务器配置(子类重写) */
    FightRankVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    return FightRankVo;
}(ActivityVo));
/**等级冲榜 */
var LevelRankVo = /** @class */ (function (_super_1) {
    __extends(LevelRankVo, _super_1);
    function LevelRankVo() {
        return _super_1.call(this) || this;
    }
    //获取战力榜单奖励对应配置表
    LevelRankVo.prototype.getLevelRankCfg = function (rank) {
        return this.configs[rank];
    };
    /**是否需要读取服务器配置(子类重写) */
    LevelRankVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    return LevelRankVo;
}(ActivityVo));
/**国家城池冲榜 */
var CountryRankVo = /** @class */ (function (_super_1) {
    __extends(CountryRankVo, _super_1);
    function CountryRankVo() {
        return _super_1.call(this) || this;
    }
    //获取国家城池榜单奖励对应配置表
    CountryRankVo.prototype.getCountryRankCfg = function (rank) {
        return this.configs[rank];
    };
    /**是否需要读取服务器配置(子类重写) */
    CountryRankVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**请求活动内容(子类重写)  */
    CountryRankVo.prototype.requestActivityInfo = function () {
        // ScenePopQueWnd.addNewActNotice(AcViewType.COUNTRY_CITYS_RANKING);
    };
    return CountryRankVo;
}(ActivityVo));
/**联盟战力冲榜 */
var LegionRankVo = /** @class */ (function (_super_1) {
    __extends(LegionRankVo, _super_1);
    function LegionRankVo() {
        return _super_1.call(this) || this;
    }
    //获取联盟战力榜单奖励对应配置表
    LegionRankVo.prototype.getLegionRankCfg = function (rank) {
        return this.configs[rank];
    };
    /**是否需要读取服务器配置(子类重写) */
    LegionRankVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**请求活动内容(子类重写)  */
    LegionRankVo.prototype.requestActivityInfo = function () {
        // ScenePopQueWnd.addNewActNotice(AcViewType.GUILD_FORCE_RANKING);
    };
    return LegionRankVo;
}(ActivityVo));
/**竞技场战力冲榜 */
var ArenaRankVo = /** @class */ (function (_super_1) {
    __extends(ArenaRankVo, _super_1);
    function ArenaRankVo() {
        return _super_1.call(this) || this;
    }
    //获取联盟战力榜单奖励对应配置表
    ArenaRankVo.prototype.getArenaRankCfg = function (rank) {
        return this.configs[rank];
    };
    /**是否需要读取服务器配置(子类重写) */
    ArenaRankVo.prototype.isNeedServerCfg = function () {
        return true;
    };
    /**请求活动内容(子类重写)  */
    ArenaRankVo.prototype.requestActivityInfo = function () {
        // ScenePopQueWnd.addNewActNotice(AcViewType.APK_RANKING);
    };
    return ArenaRankVo;
}(ActivityVo));
