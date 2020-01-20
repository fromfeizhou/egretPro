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
var NoviceMapProxy = /** @class */ (function (_super_1) {
    __extends(NoviceMapProxy, _super_1);
    function NoviceMapProxy() {
        return _super_1 !== null && _super_1.apply(this, arguments) || this;
    }
    NoviceMapProxy.prototype.listenerProtoNotifications = function () {
        return [
        // [ProtoDef.CITY_BATTLE_NOVICE_AFFAIR, this, 'CityBattleNoviceAffairsReq', 'CityBattleNoviceAffairsResp'],//请求世界地图数据
        // [ProtoDef.CITY_BATTLE_TRIGGER_NOVICE_AFFAIR, this, 'CityBattleTriggerNoviceAffairReq', 'CityBattleTriggerNoviceAffairResp'],//触发新手城池外事件请求
        // [ProtoDef.CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD, this, 'CityBattleGainNoviceAffairRewardReq', 'CityBattleGainNoviceAffairRewardResp'],//获取新手城池外事件奖励结果
        ];
    };
    NoviceMapProxy.prototype.execute = function (notification) {
        var protocol = Number(notification.getName());
        var body = notification.getBody();
        // switch (protocol) {
        //     //请求新手 世界事件的信息
        // 	case ProtoDef.CITY_BATTLE_NOVICE_AFFAIR: {
        //         var remove_ids = {};
        // 		// if (body.type == WorldEventType.GOVERNMENT_AFFAIRS) {
        // 		// 	remove_ids = WorldMapModel.clearWorldEvents(WorldEventType.GOVERNMENT_AFFAIRS);
        // 		// }
        // 		remove_ids = NoviceMapModel.clearWorldEvents();
        // 		let result = NoviceMapModel.analysisWorldEvent(body);
        // 		let data = {
        // 			'type': body.type,
        // 			'list': result,
        // 			'remove_ids': remove_ids
        // 		}
        // 		notification.setBody(data);
        // 		break;
        // 	}
        //     //触发新手城池外事件请求
        //     case ProtoDef.CITY_BATTLE_TRIGGER_NOVICE_AFFAIR: {
        //         let result = NoviceMapModel.onTouchWorldEvent(body);
        // 		notification.setBody(result);
        // 		break;
        // 	}
        //     //获取新手城池外事件奖励结果
        //     case ProtoDef.CITY_BATTLE_GAIN_NOVICE_AFFAIR_REWARD: {
        //         NoviceMapModel.removeWorldEvent(body.id, body.index);
        // 		break;
        // 	}
        // 	default:
        // 		break;
        // }
        AGame.ServiceBuilder.notifyView(notification);
    };
    return NoviceMapProxy;
}(BaseProxy));
