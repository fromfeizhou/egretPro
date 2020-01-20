// class CelebrationData {
// 	public static getAdditionConfig(type: AdditionType) {
// 		let datas = C.AdditionConfig;
// 		for (var key in datas) {
// 			if (datas.hasOwnProperty(key)) {
// 				var element = datas[key];
// 				if (element.type == type) return element;
// 			}
// 		}
// 	}

// 	public static getLanternConfig(id: number) {
// 		let config = C.LanternConfig[id];
// 		if (!config) {
// 			error("CelebrationData:getLanternConfig--->>灯笼配置找不到:" + config.id);
// 		}
// 		return config
// 	}

// 	public static getCelebrationControlConfig(count: number) {
// 		return C.CelebrationControlConfig[count];
// 	}
// }