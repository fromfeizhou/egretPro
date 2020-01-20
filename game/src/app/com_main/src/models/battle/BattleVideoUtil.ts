// TypeScript file

class BattleVideoUtil {
    public static BattleProxyList = [];
    public static isLoadComplete = false;
    
    public static AddProtocolData(protocol: number, data: string) {
        BattleVideoUtil.BattleProxyList.push({protocol:protocol,data:data});
    }

    /**保存到本地 */
    public static saveAsFile(){
        var blob = new Blob(  [JSON.stringify(BattleVideoUtil.BattleProxyList)], {type: "text/plain;charset=utf-8"});
        window["saveAs"].saveAs(blob, "battleVideo.txt");
    }

    public static load() {
        RES.getResByUrl(GameConfig.getBattleVideoUrl(), function (param) {
			if (param) {
				let zip = new JSZip(param);
				for (let i in zip.files) {
					let name: string = zip.files[i].name;
					if (name.indexOf('/') > 0) continue;
					let text = zip.files[i].asText();
					BattleVideoUtil.onLoadComplete(text);
				}
			}

            //读取配置后销毁
			RES.destroyRes(GameConfig.getBattleVideoUrl());
		}, this, RES.ResourceItem.TYPE_BIN);
    }

    private static onLoadComplete(text): void {
        if(this.isLoadComplete){
            return ;
        }
        this.isLoadComplete = true;

        let data = JSON.parse(text);

        for(let info of data){
            let data = AGame.ServiceBuilder.decode(info.protocol, Utils.stringToUint8Array(info.data));
            AGame.ServiceBuilder.notifyProtoHandler(info.protocol, data);
        }

        let step_1_time = ConstUtil.getValue(IConstEnum.FIRST_GUIDE_STEP_1);
        let step_2_time = ConstUtil.getValue(IConstEnum.FIRST_GUIDE_STEP_2);
        let step_3_time = ConstUtil.getValue(IConstEnum.FIRST_GUIDE_STEP_3);
        let step_4_time = ConstUtil.getValue(IConstEnum.FIRST_GUIDE_STEP_4);
        // FightResponseUtil.AddData(EnumFightVideoCmd.G_RUN, 0, null);
        FightResponseUtil.AddData(EnumFightVideoCmd.DIALOG, step_1_time, null);
        FightResponseUtil.AddData(EnumFightVideoCmd.DIALOG, step_2_time, null);
        FightResponseUtil.AddData(EnumFightVideoCmd.DIALOG, step_3_time, null);
        FightResponseUtil.AddData(EnumFightVideoCmd.END, step_4_time, null);
        FightResponseUtil.pause();
        GuideModel.init();

        BattleModel.m_isGuideBattle = true;
    }

}
