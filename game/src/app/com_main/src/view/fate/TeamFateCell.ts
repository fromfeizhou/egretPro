
module com_main {
	export class TeamFateCell extends eui.ItemRenderer {
		public m_lbName: eui.Label;
		public m_pContent: eui.Group;

		public constructor() {
			super();
			this.skinName = Utils.getSkinName("app/fate/TeamFateCellSkin.exml");
		}
		protected childrenCreated(): void {
			super.childrenCreated();

		}

		$onRemoveFromStage(): void {
			this.onDestroy();
			super.$onRemoveFromStage();
		}

		public onDestroy() {

		}

		public dataChanged(): void {
			super.dataChanged();
			let generalId: number = this.data;
			let genVo: GeneralVo = GeneralModel.getOwnGeneral(generalId);


			let generalConfig: GeneralConfig = C.GeneralConfig[generalId];
			this.m_lbName.text = `${GLan(generalConfig.name)}`
			if (generalConfig)
				this.m_lbName.textColor = Utils.getColorOfQuality(generalConfig.qualityLevel);

			this.m_pContent.removeChildren();
			let fateVoList: FateVo[] = FateModel.getGeneralFateViewDataByGenId(generalId);
			for (let index = 0; index < fateVoList.length; index++) {
				let fateVo: FateVo = fateVoList[index];
				let lab: eui.Label = new eui.Label();
				lab.size = 24;
				lab.textColor = 0xaac7ff;
				lab.maxWidth = 1000;
				lab.lineSpacing = 8;
				let curActiveMaxCfg: RelationConfig = FateModel.getCurFinshActiveFateCfg(fateVo.id);
				let content: string = GCodeFromat(CLEnum.FATE_TEAM_TIPS1, curActiveMaxCfg.name, curActiveMaxCfg.Desc)
				if (fateVo.level == 1 && fateVo.status !== FateStatus.FINISH_ACTIVE) content = GCodeFromat(CLEnum.FATE_TEAM_TIPS2, curActiveMaxCfg.name, curActiveMaxCfg.Desc)
				lab.textFlow = Utils.htmlParser(content)
				this.m_pContent.addChild(lab);
			}
		}


	}
}