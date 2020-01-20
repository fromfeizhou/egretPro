module com_main {
	export class BattleTopBlood extends CComponent {

		public proBg_1: eui.Image;
		public boold_1: eui.Image;
		public proBg_2: eui.Image;
		public boold_2: eui.Image;
		public image_time_bg: eui.Image;
		public gong_bg: eui.Image;
		public shou_bg: eui.Image;
		public image_word_gong: eui.Image;
		public image_word_shou: eui.Image;
		public lb_act_blood: com_main.CLabel;
		public lb_def_blood: com_main.CLabel;
		public lb_act_name: com_main.CLabel;
		public lb_def_name: com_main.CLabel;
		public lb_time: com_main.CLabel;
		public lb_att_team: eui.BitmapLabel;
		public lb_def_team: eui.BitmapLabel;
		public atkGroup: eui.Group;
		public atk_lbArrogance: eui.Label;
		public defGroup: eui.Group;
		public def_lbArrogance: eui.Label;
		public m_debuffInfo: com_main.BattleDebuffInfo;

		private surplusTime: number = 0;

		public constructor() {
			super();
			this.skinName = Utils.getAppSkin("battle_new/top_new/battle_top_all_blood.exml");
		}

		$onRemoveFromStage(): void {
			super.$onRemoveFromStage(false);
			this.removeEvent();
		}

		public init() {
			this.refreshPlayerName();
			this.refreshDebuff();
			this.refreshBloodPro();

			this.surplusTime = 120 * 1000;
			this.lb_time.text = '02:00';

			this.lb_act_blood.visible = true;
			this.lb_def_blood.visible = true;

			if (BattleModel.isCityWar()) {
				this.lb_att_team.visible = true;
				this.lb_def_team.visible = true;
			} else {
				this.lb_att_team.visible = false;
				this.lb_def_team.visible = false;
			}

			this.refreshCityItemCount();

			this.addEvent();
		}

		protected childrenCreated(): void {
			super.childrenCreated();

		}

		protected addEvent() {
			EventManager.addTouchTapListener(this.defGroup, this, this.showDebuffDef);
			EventManager.addTouchTapListener(this.atkGroup, this, this.showDebuffAtk);

			EventMgr.addEvent(BattleEvent.BATTLE_OVER, this.refreshBloodPro, this);

			this.defGroup.touchThrough = false;
			this.atkGroup.touchThrough = false;
		}

		protected removeEvent() {
			EventManager.removeEventListeners(this);
			EventMgr.removeEventByObject(BattleEvent.BATTLE_OVER, this);
		}

		public refreshPlayerName() {
			this.lb_act_name.text = BattleModel.getPlayerName(FactionType.ATK);
			this.lb_def_name.text = BattleModel.getPlayerName(FactionType.DEF);
		}

		public refreshBloodPro() {

			if (!BattleModel.getJoinedBattleId()) {
				this.lb_act_blood.visible = false;
				this.boold_1.width = 313;
				this.lb_def_blood.visible = false;
				this.boold_2.width = 0;
				return;
			}
			let atkAllMaxBlood = BattleModel.getAtkAllMaxBlood();
			let atkAllBlood = BattleModel.getAtkAllBlood();

			let defAllMaxBlood = BattleModel.getDefAllMaxBlood();
			let defAllBlood = BattleModel.getDefAllBloodd();

			// console.log('获取到的血量 攻防',atkAllBlood,defAllBlood);

			this.lb_act_blood.text = CommonUtils.numOutLenght2(atkAllBlood) + "/" + CommonUtils.numOutLenght2(atkAllMaxBlood); //左边血量
			this.lb_def_blood.text = CommonUtils.numOutLenght2(defAllBlood) + "/" + CommonUtils.numOutLenght2(defAllMaxBlood); //右边血量

			this.boold_1.width = 313 * (Math.min(1, atkAllBlood / atkAllMaxBlood));
			this.boold_2.width = 313 * (Math.min(1, defAllBlood / defAllMaxBlood));
		}


		public refreshBattleTime(delta) {
			this.refreshBloodPro();
			let battleInfo: BattleInfoVo = BattleModel.getJoinedBattleInfo();

			if (!battleInfo || !battleInfo.warContinueTime &&  !BattleModel.isCityWar()) {
				return;
			}

			let endTime = battleInfo.endTime;
			let mill = endTime - TimerUtils.getServerTimeMill();
			if (mill < 0) {
				mill = 0;
			}

			let time = Utils.changeSecondToDay(Math.floor(mill / 1000));
			this.lb_time.text = time;
		}

		public refreshCityItemCount() {
			let data = WorldModel.getCityWarInfo()
			if (data) {
				this.lb_att_team.text = data.atkTeamCount + '队';
				this.lb_def_team.text = data.defTeamCount + '队';
			}
		}

		public refreshDebuff() {
			this.m_debuffInfo.visible = false;

			let battleInfo: BattleInfoVo = BattleModel.getJoinedBattleInfo();
			if (battleInfo.atkArrogance && battleInfo.atkArrogance.arrogance) {
				this.atkGroup.visible = true;
				this.atk_lbArrogance.text = battleInfo.atkArrogance.arrogance.toString();
			} else {
				this.atkGroup.visible = false;
			}

			if (battleInfo.defArrogance && battleInfo.defArrogance.arrogance) {
				this.defGroup.visible = true;
				this.def_lbArrogance.text = battleInfo.defArrogance.arrogance.toString();
			} else {
				this.defGroup.visible = false;
			}
		}

		public showDebuffDef() {
			this.m_debuffInfo.visible = true;
			this.m_debuffInfo.x = 373;
			this.m_debuffInfo.y = 99;
			let battleInfo: BattleInfoVo = BattleModel.getJoinedBattleInfo();
			if (battleInfo.defArrogance && battleInfo.defArrogance.arrogance) {
				this.m_debuffInfo.refreshView(battleInfo.defArrogance.arrogance);
			}
		}

		public showDebuffAtk() {
			this.m_debuffInfo.visible = true;
			this.m_debuffInfo.x = 165;
			this.m_debuffInfo.y = 99;
			let battleInfo: BattleInfoVo = BattleModel.getJoinedBattleInfo();
			if (battleInfo.atkArrogance && battleInfo.atkArrogance.arrogance) {
				this.m_debuffInfo.refreshView(battleInfo.atkArrogance.arrogance);
			}
		}

		public hideDebuffInfo(){
			this.m_debuffInfo.visible = false;
		}


	}
}