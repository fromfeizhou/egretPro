class ConfigBuilder {

	private static _instance: ConfigBuilder;
	public static KEY = 'id';
	public isInit = false;

	public static getInstance() {
		ConfigBuilder._instance = ConfigBuilder._instance || new ConfigBuilder();
		return ConfigBuilder._instance;
	}

	public loadConfig(callback: Function, target: any) {
		if (this.isInit) {
			callback.call(target);
			return;
		}
		// console.log("ConfigBuilder:loadConfig------>>", GameConfig.getConfigUrl());
		RES.getResByUrl(GameConfig.getConfigUrl(), function (param) {
			if (param) {
				let zip = new JSZip(param);
				for (let i in zip.files) {
					let name: string = zip.files[i].name;
					if (name.indexOf('/') > 0) continue;
					let text = zip.files[i].asText();
					try {
						let jdata = JSON.parse(text);
						this.parseConfig(jdata.clazzName, jdata.data);
					} catch (e) {
						error("ConfigBuilder:loadConfig------>>配置有问题！！！！")
						error("ConfigBuilder:loadConfig------>>", text);
					}
				}
				this.parseConfigSpec();
				this.isInit = true;

				callback.call(target);
				//读取配置后销毁
				RES.destroyRes(GameConfig.getConfigUrl());
			}
		}, this, RES.ResourceItem.TYPE_BIN);
	}

	/**自定义解析配置 */
	private parseConfigSpec() {
		//技能等级效果表
		this.setConfigDic('SkillLvConfig', 'skillId', 'skillLv');

		//建筑等级表
		this.setConfigDic('BuildingLevelConfig', 'buildingType', 'level');

		//建筑产出表
		this.setConfigDic('BuildingResourcesLvConfig', 'type', 'lv');

		//掉落表
		this.setConfigDic('DropConfig', 'dropNo', 'id');

		//每日签到
		this.setConfigDic('SignUpConfig', 'month', 'day');

		//兵种配置表
		this.setConfigDic('GeneralSoldierLvConfig', 'mainType', 'LV');
		this.setConfigDic('ArmyProgressConfig', 'armyType', 'progressLevel');

		//装备配置表 碎片指向配置表
		this.setSubConfig('EquipmentConfig', 'EquipmentS2EConfig', 'fragmentId');
		//装备强化表 
		this.setConfigDic('EquipmentSlotStrengthenConfig', 'slot', 'level');
		//装备进阶表 
		this.setConfigDic('EquipmentSlotUpgradeConfig', 'slot', 'level');
		//装备精炼表 
		this.setConfigDic('EquipmentSlotWroughtConfig', 'slot', 'level');
		//装备加成
		this.setConfigDic('EquipmentSlotSumConfig', 'type', 'sumLevel');

		//科技等级表
		this.setConfigDic('TechnologyLevelConfig', 'techId', 'level');
		//套装表
		this.setConfigDic('GemstoneConstituteConfig', 'suitId', 'level');

		//宝物星级表
		this.setConfigDic('TreasureStarConfig', 'starLevel', 'quality');

		//章节表
		this.setConfigDic('ChapterConfig', 'chapterId', 'level');
		// 章节星星奖励配置表
		this.setConfigDic('StarRewardConfig', 'chapterId', 'star');

		//世界战役表
		this.setConfigDic('HistoryWarConfig', 'chapterId', 'level');

		// 世界战役章节星星奖励配置表
		this.setConfigDic('HistoryWarStarRewardConfig', 'chapterId', 'star');

		// 城池建造
		this.setConfigDic('CityMadeConfig', 'cityId', 'level');
		//宝物次属性表
		this.setConfigDic('SecondAttributeConfig', 'team', 'quality');

		// 跨服战奖励配置表
		this.setConfigDic('CrossServerRewardConfig', 'type', 'value');
		
	}

	/**配置表副表格式（主key不一样） */
	private setSubConfig(cfgName: string, subName: string, mainKey: string) {
		C[subName] = {};
		for (let key in C[cfgName]) {
			let info = C[cfgName][key];
			if (unNull(info)) {
				C[subName][info[mainKey]] = info;
			}
		}
	}

	/**设置通用自定义配置表 */
	private setConfigDic(cfgName: string, key1: string, key2: string) {
		let dictionary = {};
		for (let key in C[cfgName]) {
			let info = C[cfgName][key];
			if (unNull(info)) {
				let key1Val = info[key1];
				if (!key1Val) {
					let a = 0;
				}
				let key2Val = info[key2];
				if (isNull(dictionary[key1Val])) {
					dictionary[key1Val] = {};
				}
				dictionary[key1Val][key2Val] = info;
			}

		}
		C[`${cfgName}Dic`] = dictionary;
	}

	private parseConfig(name: any, config: any) {
		// let key = this.configMapKey(name);
		let tables = this.parseTable(name, config);
		// let configs = Utils.ArrayUtils.arrayToMap(tables, ConfigBuilder.KEY);
		// let configs = key ? Utils.ArrayUtils.arrayToMap(tables, key) : tables;
		C[name] = tables;
	}

	private parseTable(name: any, datas: any) {
		let tables = {};
		for (let i = 0; i < datas.length; i++) {
			try {
				let clazz = egret.getDefinitionByName(name);
				let ca = new clazz();
				let data = datas[i];
				let attrs = ca.attrs();
				let types = ca.types();
				for (let j = 0; j < data.length; j++) {
					let key = attrs[j];
					let type = types[j];
					ca[key] = this.parseKey(type, data[j]);
				}
				tables[ca[ConfigBuilder.KEY]] = ca;
			} catch (e) {
				error("ConfigBuilder:parseTable------>>", name, e);
			}
		}
		return tables;
	}

	/**解析对应类型的key */
	private parseKey(type: string, data: any) {
		switch (type) {
			case "IItemInfo[]":
				return this.getItemInfo(data);
			case "IItemInfo":
				return this.getItemInfo(data, true);
		}

		return data;
	}
	/**获得物品配置 */
	private getItemInfo(data: string, isSingle: boolean = false) {
		let list = Utils.parseCommonItemJson(data);
		if (isSingle) {
			return list.length > 0 ? list[0] : null;
		}
		return list;
	}

}