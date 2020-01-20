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
var FiefProxy = /** @class */ (function (_super_1) {
    __extends(FiefProxy, _super_1);
    function FiefProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    FiefProxy.prototype.listenerProtoNotifications = function () {
        return [
            // [ProtoDef.CITY_BATTLE_GET_FIEFS, this, 'CityBattleGetFiefsReq', 'CityBattleGetFiefsResp'],  //查询封地信息	
            // [ProtoDef.CITY_BATTLE_APPLY_FIEF, this, 'CityBattleApplyFiefReq', 'CityBattleApplyFiefResp'], //抢封地
            // [ProtoDef.CITY_BATTLE_APPLY_CONSTRUCTION, this, 'CityBattleApplyConstructionReq', 'CityBattleApplyConstructionResp'], //玩家建设请求
            // [ProtoDef.CITY_BATTLE_RANDOM_CONSTRUCTION, this, 'CityBattleRandomConstructionReq', 'CityBattleRandomConstructionResp'],//随机一个有空位的封地建设给没有建设的玩家
            // [ProtoDef.CITY_BATTLE_FIEF_CHANGE, this, '', 'CityBattleFiefChangeResp'],   //封地改变或失去封地
            // [ProtoDef.CITY_BATTLE_GAIN_CONSTRUCTION_REWARD, this, 'CityBattleGainConstructionRewardReq', 'CityBattleGainConstructionRewardResp'],//获取玩家建设的奖励
            [ProtoDef.COUNTRY_OFFICIAL_CHANGE, this, '', 'CountryOfficialChangeResp'],
        ];
    };
    FiefProxy.prototype.execute = function (notification) {
        var body = notification.getBody();
        var protocol = Number(notification.getName());
        // switch (protocol) {
        // 	case ProtoDef.CITY_BATTLE_GET_FIEFS:
        // 		if (body.fiefInfo)
        // 			FiefModel.addCityBattleFiefInfo(body.fiefInfo);
        // 		if (body.ifHasFief) {
        // 			let id = body.id; //自己拥有的封地id
        // 			if (id) {
        // 				//zb
        // 				// RoleData.fiefLevel = C.WorldMapConfig[id].level;
        // 				// FiefModel.setCityRandomConstruId(id);
        // 			}
        // 			else
        // 				error("玩家拥有封地,但id为null");
        // 		}
        // 		FiefModel.ifHasFief = body.ifHasFief;
        // 		RoleData.ironCount = body.ironCount;
        // 		RoleData.ironPerHour = body.ironPerHour;
        // 		FiefModel.eventHandler(EventEnum.FIEF_NOTICE, body);
        // 		FiefModel.eventHandler(EventEnum.FIEF_OPENVIEW, body);
        // 		FiefModel.eventHandler(EventEnum.FIEF_WORLD_NOTICE, body);
        // 		FiefModel.eventHandler(EventEnum.FIEF_BUILD_OPENVIEW, body);
        // 		break;
        // 	case ProtoDef.CITY_BATTLE_APPLY_FIEF:
        // 		let key = body.id;
        // 		if (body.ifSuccess) {
        // 			if (key != void 0)
        // 				FiefModel.setCityRandomConstruId(key);
        // 		} else {
        // 		}
        // 		if (body.fiefInfo)
        // 			FiefModel.addCityBattleFiefInfo(body.fiefInfo);
        // 		break;
        // 	case ProtoDef.CITY_BATTLE_APPLY_CONSTRUCTION:
        // 		//玩家自己请求建设返回
        // 		let key1 = body.id;
        // 		body.fiefConstructionInfo.name = RoleData.nickName;
        // 		if (body.fiefConstructionInfo) {
        // 			if (body.fiefConstructionInfo.id != 0 && !FiefModel.ifHasFief)
        // 				FiefModel.setCityRandomConstruId(key1);
        // 			FiefModel.changeFiefConstructionList(key1, body.fiefConstructionInfo, body.fiefConstructionInfo.id);
        // 		}
        // 		break;
        // 	case ProtoDef.CITY_BATTLE_RANDOM_CONSTRUCTION:
        // 		FiefModel.setCityRandomConstruId(body.id);
        // 		if (body.constructionId != void 0)
        // 			FiefModel.setCityconstructionId(body.constructionId);
        // 		// if (FunctionModel.isFunctionOpen(FunctionType.FT_FIEF_CONSTRUCTION)) {
        // 			FiefModel.HandleFiefWorldNotice(null);
        // 		// }
        // 		break;
        // 	case ProtoDef.CITY_BATTLE_FIEF_CHANGE:
        // 		FiefModel.HandleCityBattleFiefChangeResp(body);
        // 		break;
        // 	case ProtoDef.CITY_BATTLE_GAIN_CONSTRUCTION_REWARD:
        // 		break;
        // 	case ProtoDef.COUNTRY_OFFICIAL_CHANGE:
        // 		if (body.officialId != void 0) {
        // 			RoleData.governmentPost = body.officialId;
        // 		}
        // 		break;
        // }
        AGame.ServiceBuilder.notifyView(notification);
    };
    return FiefProxy;
}(BaseProxy));
