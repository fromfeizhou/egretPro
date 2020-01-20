// TypeScript file
var BattleVideoUtil = /** @class */ (function () {
    function BattleVideoUtil() {
    }
    BattleVideoUtil.AddProtocolData = function (protocol, data) {
        BattleVideoUtil.BattleProxyList.push({ protocol: protocol, data: data });
    };
    /**保存到本地 */
    BattleVideoUtil.saveAsFile = function () {
        var blob = new Blob([JSON.stringify(BattleVideoUtil.BattleProxyList)], { type: "text/plain;charset=utf-8" });
        window["saveAs"].saveAs(blob, "battleVideo.txt");
    };
    BattleVideoUtil.load = function () {
        RES.getResByUrl(GameConfig.getBattleVideoUrl(), function (param) {
            if (param) {
                var zip = new JSZip(param);
                for (var i in zip.files) {
                    var name_1 = zip.files[i].name;
                    if (name_1.indexOf('/') > 0)
                        continue;
                    var text = zip.files[i].asText();
                    BattleVideoUtil.onLoadComplete(text);
                }
            }
            //读取配置后销毁
            RES.destroyRes(GameConfig.getBattleVideoUrl());
        }, this, RES.ResourceItem.TYPE_BIN);
    };
    BattleVideoUtil.onLoadComplete = function (text) {
        if (this.isLoadComplete) {
            return;
        }
        this.isLoadComplete = true;
        var data = JSON.parse(text);
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var info = data_1[_i];
            var data_2 = AGame.ServiceBuilder.decode(info.protocol, Utils.stringToUint8Array(info.data));
            AGame.ServiceBuilder.notifyProtoHandler(info.protocol, data_2);
        }
        var step_1_time = ConstUtil.getValue(IConstEnum.FIRST_GUIDE_STEP_1);
        var step_2_time = ConstUtil.getValue(IConstEnum.FIRST_GUIDE_STEP_2);
        var step_3_time = ConstUtil.getValue(IConstEnum.FIRST_GUIDE_STEP_3);
        var step_4_time = ConstUtil.getValue(IConstEnum.FIRST_GUIDE_STEP_4);
        // FightResponseUtil.AddData(EnumFightVideoCmd.G_RUN, 0, null);
        FightResponseUtil.AddData(EnumFightVideoCmd.DIALOG, step_1_time, null);
        FightResponseUtil.AddData(EnumFightVideoCmd.DIALOG, step_2_time, null);
        FightResponseUtil.AddData(EnumFightVideoCmd.DIALOG, step_3_time, null);
        FightResponseUtil.AddData(EnumFightVideoCmd.END, step_4_time, null);
        FightResponseUtil.pause();
        GuideModel.init();
        BattleModel.m_isGuideBattle = true;
    };
    BattleVideoUtil.BattleProxyList = [];
    BattleVideoUtil.isLoadComplete = false;
    return BattleVideoUtil;
}());
