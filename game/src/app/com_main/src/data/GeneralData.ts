class GeneralData {
	public static getGeneralConfig(id?: number): any {
		if (id == null || id == undefined)
			return C.GeneralConfig;
		return C.GeneralConfig[id];
	}
}

// class TavernGeneralData {
// 	public static getTavernGeneralConfig(id?: number): any {
// 		if (id == null || id == undefined)
// 			return C.TavernGeneralConfig;
// 		return C.TavernGeneralConfig[id];
// 	}
// }
