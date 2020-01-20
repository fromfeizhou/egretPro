var GeneralData = /** @class */ (function () {
    function GeneralData() {
    }
    GeneralData.getGeneralConfig = function (id) {
        if (id == null || id == undefined)
            return C.GeneralConfig;
        return C.GeneralConfig[id];
    };
    return GeneralData;
}());
// class TavernGeneralData {
// 	public static getTavernGeneralConfig(id?: number): any {
// 		if (id == null || id == undefined)
// 			return C.TavernGeneralConfig;
// 		return C.TavernGeneralConfig[id];
// 	}
// }
