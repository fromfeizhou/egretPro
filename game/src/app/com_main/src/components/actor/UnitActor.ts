module com_main {
	/**战斗单位对象 */
	export class UnitActor extends Actor {

		/**战斗单位信息(一般保存服务器信息) */
        protected m_pUnitInfo: UnitInfoVo;

        /**战斗单位信息(战斗单位信息) */
        protected m_pSkillAtk: SkillAtkVo;

		public constructor() {
			super();
		}

        public onDestroy(): void {
            super.onDestroy();
			if (this.m_pUnitInfo) this.m_pUnitInfo.onDestroy();
			this.m_pUnitInfo = null;
			// if (this.m_pSkillAtk) this.m_pSkillAtk.onDestroy();
			this.m_pSkillAtk = null;
		}

		public getUnitInfo() {
			return this.m_pUnitInfo;
		}

		public setUnitInfo(vo: UnitInfoVo) {
			this.m_pUnitInfo = vo;
			if (vo) {
				this.id = vo.elementId;
			}
		}


		public setSkillAtk(vo: SkillAtkVo) {
			this.m_pSkillAtk = vo;
		}

		public getSkillAtk() {
			return this.m_pSkillAtk;
		}

		public getHp() {
			let data = this.getUnitInfo();
			return data ? data.getHp() : 0;
		}
	}
}