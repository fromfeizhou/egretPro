module com_main {

	export class HeroLayer extends egret.DisplayObjectContainer {

		public static readonly NAME: string = "HeroLayer";

		public constructor(w: number, h: number) {
			super();
			this.name = HeroLayer.NAME;
			this.width = w;
			this.height = h;
			this.addEventListener(egret.Event.ENTER_FRAME, this.tickEvent, this);
		}

		public onDestroy(): void {
			this.removeEventListener(egret.Event.ENTER_FRAME, this.tickEvent, this);
			Utils.removeAllChild(this);
		}

		/**
		 * 创建英雄线移动
		 * @param  {number} start
		 * @param  {number[]} points
		 * @param  {number=0} dt
		 * @returns ArmySprite
		 */
		public createHero(data: gameProto.ITeamMoveDataResp): ArmySprite {
			let hero = new ArmySprite(0, 0);
			let key = WorldModel.getTeamMoveKey(data);
			hero.teamKey = key;
			this.addChild(hero);
			// if (data.playerId == RoleData.playerId)
			hero.initMoveInfo(data.cityPath, data.startTime, data.endTime, data.moveType);

			// let l:number[] = []
			// for (let [x, y] of hero.getChildrenPoint()) {
			// 	let spr = new SoldierSprite(hero.x, hero.y, x, y);
			// 	this.addChildAt(spr, 0);
			// 	l.push(spr.iid);
			// }
			// hero.setChildrenId(l);

			return hero;
		}

		/**
		 * 创建英雄点移动
		 * @param  {number} start
		 * @param  {number} end
		 */
		// public createHeroMove(start: number, end: number) {
		// 	let hero = new ArmySprite();
		// 	this.addChild(hero);
		// 	hero.initMoveInfo(3, [start, end]);
		// 	return hero;
		// }

		public createHeroMoveEvt(data: IClientMoveEt) {
			let evtVo = WorldModel.getEventVoByPosId(data.evtPosId);
			if (!evtVo) return;
			let hero = new ArmySprite();
			this.addChild(hero);
			hero.teamKey = 'client_' + data.teamId;
			hero.initLineMoveInfo(data);
			return hero;
		}

		public getAmryChildren(children: number[], cb: (o: SoldierSprite) => void, target: any) {
			for (let id of children) {
				let soldier = this.getSoldier(id);
				if (!soldier) continue;
				cb.call(target, soldier);
			}
		}

		/**
		 * 获取英雄
		 * @param  {number} iid
		 * @returns ArmySprite
		 */
		public getHero(iid: string): ArmySprite {
			let obj = this.getChildByName(`hero_${iid}`);
			if (!obj) return;
			return <ArmySprite>obj;
		}

		public getSoldier(iid: number): SoldierSprite {
			let obj = this.getChildByName(`soldier_${iid}`);
			if (!obj) return;
			return <SoldierSprite>obj;
		}

		private tickEvent(): boolean {
			for (let o of this.$children) {
				// if (o instanceof SoldierSprite) continue;
				let obj = <ArmySprite>o;
				if (obj) {
					obj.tickEvent();
				}
			}
			return false;
		}
		/**
		 * 删除英雄
		 * @param  {number} iid
		 * @returns void
		 */
		public removeHero(iid: string): void {
			let hero = this.getHero(iid);
			if (!hero) return;

			this.getAmryChildren(hero.soldierChildren, (o) => {
				Utils.removeFromParent(o);
			}, hero);

			hero.removeFromParent();


		}

		/**
		 * 点击事件
		 * @param  {egret.TouchEvent} e
		 * @returns boolean
		 */
		public onTouch(e: egret.TouchEvent): boolean {
			let isHasShow: boolean = false;//如果只能同时存在一个菜单
			for (let o of this.$children) {
				if (o instanceof SoldierSprite) continue;
				let obj = <ArmySprite>o;
				if (obj.checkTouchEvent(e.stageX, e.stageY)) {
					isHasShow = true;
					break;;
				}
			}
			return isHasShow;
		}


	}
}