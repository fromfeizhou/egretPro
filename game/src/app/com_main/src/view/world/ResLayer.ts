module com_main {

	export class ResLayer extends egret.DisplayObjectContainer {

		public static readonly NAME: string = "ResLayer";
		private m_nResSelect: string = '';

		public constructor(w: number, h: number) {
			super();
			this.name = ResLayer.NAME;
			this.width = w;
			this.height = h;
		}

		public onDestroy(): void {
			// Utils.removeAllChild(this);
		}

		public getRes<T>(ty: string, iid: number): T {
			if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
				let conf = C.WorldMapConfig[iid];
				if (conf&&conf.mapId != SceneEnums.WORLD_XIANGYANG_CITY) {
					iid = conf.mapCity;
				}
			}
			let obj: any = this.getChildByName(`${ty}_${iid}`);
			if (!obj) return;
			return <T>obj;
		}

		/**
		 * 初始化建筑
		 * @param  {()=>void} cb
		 * @param  {any} target
		 * @returns void
		 */
		public initBuilds(): void {
			let data = WorldMapModel.getCityBuildInfos();

			for (let id in C.WorldMapConfig) {
				let info = data[id]
				let conf: WorldMapConfig = C.WorldMapConfig[id];
				if (conf.mapId == SceneManager.getCurrScene()) {
					let build = CitySprite.create(conf);
					Utils.addChild(this, build);
					build.isGlow(false);
					WorldView.addTileObject(build);
				}

				// build.updateHeroNum(TeamModel.getTeamVoListByCityId(conf.id).length);
			}

		}

		public initRes(lis?: { [k: number]: WorldEventVo }): void {
			if (SceneManager.getCurrScene() != SceneEnums.WORLD_CITY) return;
			lis = lis || WorldModel.eventList
			for (let k in lis) {
				let vo = lis[k];
				debug("vo.cityId = ", vo.cityId, " vo.eventCoordinatesId ", vo.eventCoordinatesId, "  ", vo.pos);
				let res = this.getRes<WorldResSprite>(ResType.RES, vo.eventCoordinatesId);
				if (res)
					Utils.removeFromParent(res);

				let spr = WorldResSprite.create(vo);
				Utils.addChildAt(this, spr, 0);
				WorldView.addTileObject(spr);
				

			}
			WorldModel.isFromUnLockFight = false;
		}
		public updateRefreshRes(data:gameProto.IS2C_GET_MAP_EVENT_DATA) {
			if(!SceneManager.isWorldScene()) return;
			
			for(let i = 0; i <data.mapEventData.length;i++){
				let info = data.mapEventData[i]
				info.eventCoordinatesId
				let res = this.getRes<WorldResSprite>(ResType.RES, info.eventCoordinatesId);
				if (res)
					Utils.removeFromParent(res);

				let vo = WorldModel.eventList[info.eventCoordinatesId];
				if(vo){
					let spr = WorldResSprite.create(vo);
					Utils.addChildAt(this, spr, 0);
					WorldView.addTileObject(spr);
				}
			}
		}

		/**移除事件资源 */
		public removeEvtRes(evtPosIs: number, isVistory = true) {
			let res = this.getRes<WorldResSprite>(ResType.RES, evtPosIs);
			// if (res) Utils.removeFromParent(res);
			if (res) res.onEventFinish(evtPosIs, isVistory);
		}
		/**刷新资源 */
		public updateEvtRes(evtPosIs: number) {
			let res = this.getRes<WorldResSprite>(ResType.RES, evtPosIs);
			if (res) res.onEvent();
		}

		/**清理选中 */
		public clearSelected() {
			// 清除选择
			if (this.m_nResSelect) {
				let [n, i] = this.m_nResSelect.split('_');
				let obj = this.getRes<ResSprite>(n, Number(i));
				if (obj) {
					obj.isGlow(false);
				}
				this.m_nResSelect = '';
			}
		}

		// public createResSprite(ty: number, x: number, y: number) {
		// 	let spr = WorldResSprite.create({id:40071, pid: 101});
		// 	Utils.addChildAt(this, spr, 0);
		// 	spr.x = x;
		// 	spr.y = y;
		// }

		/**
		 * 点击事件
		 * @param  {egret.TouchEvent} 
		 * @returns boolean
		 */
		public onTouch(e: egret.TouchEvent): boolean {
			let ret = this.$children.some((o, i, _) => {
				let obj = <ResSprite>o;
				// if (obj instanceof CitySprite) {
				if (obj.checkTouchEvent && obj.checkTouchEvent(e.stageX, e.stageY)) {
					this.m_nResSelect = obj.name;
					return true;
					// }
				}

				return false;
			}, this);
			// if (ret) return true;
			// ret = this.$children.some((o, i, _) => {
			// 	let obj = <ResSprite>o, b = obj instanceof CitySprite;
			// 	if (!b) {
			// 		if (obj.checkTouchEvent(e.stageX, e.stageY)) {
			// 			this.m_nResSelect = obj.name;
			// 			return true;
			// 		}
			// 	}
			// 	return false;
			// }, this);

			return ret;
		}

		public initAttackEvent(city_events: number[], res_events: number[]) {
			for (let id of city_events) {
				let city = this.getRes<CitySprite>(ResType.CITY, id);
				if (!city) continue;
				city.setAttackEvent();
			}

			// for (let id of res_events) {
			// 	let res = this.getRes<WorldResSprite>(ResType.RES, id);
			// 	if (!res) continue;
			// 	res.setAttackEvent();
			// }
		}

		public initAttack(atk: number[]) {
			for (let id of atk) {
				let city = this.getRes<CitySprite>(ResType.CITY, id);
				if (!city) continue;
				city.setBattleEffect();
			}
		}
	}


	// export class WorldEffectLayer extends egret.DisplayObjectContainer {

	// 	public static readonly NAME: string = "WorldEffectLayer";

	// 	public constructor(w: number, h: number) {
	// 		super();
	// 		this.name = WorldEffectLayer.NAME;
	// 		this.width = w;
	// 		this.height = h;
	// 	}

	// 	public onDestroy(): void {
	// 		Utils.removeAllChild(this);
	// 	}


	// 	public createResBattle(res: ItfResType, dir: CSquare_Direction) {
	// 		let conf = C.EventCoordinatesConfig[res.pid];
	// 		let effect = new WorldResFire(dir);
	// 		this.addChild(effect);
	// 		effect.x = conf.posX;
	// 		effect.y = conf.posY;
	// 	}
	// }
}