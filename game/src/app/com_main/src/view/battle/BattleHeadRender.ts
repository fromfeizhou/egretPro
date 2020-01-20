module com_main {
	export class BattleHeadRender extends CComponent {

		public bg:eui.Image;
		public generalHead:eui.Image;
		public rage:eui.Image;
		public blood_bg:eui.Image;
		public bloodPro:eui.Image;
		public angerMaxEffect:eui.Image;
		public generalType:eui.Image;

		private raAni: com_main.SpriteAnimation; //怒气满了特效
		private rageNum:number; //怒气值
		private maxRageNum:number; //最大怒气值

		private hpLen = 109;
		private m_uVo:UnitInfoVo;
		private hp: number; //血量百分比

		private m_flowTime: number = 0;
		
		public constructor(arg) {
			super();
            this.skinName = Utils.getAppSkin("battle_new/top_new/battle_head_render.exml");
			this.m_flowTime = 0;
			this.m_uVo = arg;
			this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
		}

		$onRemoveFromStage(): void {
			super.$onRemoveFromStage(false);
		}

		public init(arg){
			this.m_flowTime = 0;
			this.m_uVo = arg;
			this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
			this.refreshView()
		}

		public getUnitId()
		{
			return this.m_uVo.elementId;
		}

		public set flowTime(num: number){
			this.m_flowTime = num;
		}

		public get flowTime(): number{
			return this.m_flowTime;
		}

		protected childrenCreated(): void {
            super.childrenCreated();
			this.refreshView();
        }

		public refreshView(){
			let config = C.GeneralConfig[this.m_uVo.sysId];
			if(config)
			{
				//初始化头像信息				
				this.generalType.source = `gt_${this.m_uVo.soldierType}_png`; 
				this.generalHead.source = GeneralModel.getCircleLogo(config.role);
			}

			this.setBloodProgress(0);
			EventManager.addTouchScaleListener(this.generalHead, this, this.onClick); 
			this.rageNum = this.m_uVo.anager; //怒气值
			this.maxRageNum = 10000;//parseInt(C.ConstantConfig[502].value); //最大怒气值

			this.hp = 1; //血量百分比
			Utils.isGray(false,this.generalHead);
			this.rage.visible = true;
			this.angerMaxEffect.visible = false;
			
			this.refreshRage();
			this.refreshBlood();
		}

		private onClick()
		{
			if(this.hp == 0)
			{
				EffectUtils.showTips(GCode(CLEnum.WAR_HERO_DEAD));
				return;
			}

			if(this.rageNum < this.maxRageNum){
				EffectUtils.showTips(GCode(CLEnum.WAR_ANGRT_FAL));
				return;
			}

			let generalConfig = C.GeneralConfig[this.m_uVo.sysId];
			let skillid = Number(generalConfig.angerSkill.split("_")[0]);
			BattleProxy.send_BATTLE_USE_SKILL(this.m_uVo.elementId,skillid);
		}

		/**
         * 设置血条百分比 0~1;
         */
		public setBloodProgress(num:number)
		{
			this.bloodPro.width = this.hpLen * num;
		}

		/**
         * 设置怒气百分比 0~1;
         */
		public setRageProgress(num:number)
		{
			num = Math.max(0,num);
			num = Math.min(1,num);
			let index = Math.floor(num * 100 / 10); 
			this.rage.source = `ra${index}_png`;
			if(num >= 1)
			{
				this.angerMaxEffect.visible = true;
				if(!this.raAni){
					this.raAni = ImageEffect.load_2(IETypes.EBattle_Anger_Max);
					this.raAni.addBitmap(this.angerMaxEffect);
				}
			}else{
				if(this.raAni){
					this.angerMaxEffect.visible = false;
					this.raAni.removeAction();
					this.raAni = null;
				}
			}
		}

		public closeRageProgress()
		{
			this.angerMaxEffect.visible = false;
			this.rage.visible = false;
			if(this.raAni){
				this.raAni.removeAction();
				this.raAni = null;
			}

		}

		//增加怒气值
		public addRage(rage:number)
		{
			if(this.hp == 0){
				return;
			}
			this.rageNum = Math.min(this.rageNum + rage,this.maxRageNum) ;
			this.refreshRage();
		}

		//设置怒气值
		public setRage(rage:number){
			if(this.hp == 0){
				return;
			}
			this.rageNum = rage;
			this.refreshRage();
		}

		//刷新怒气
		public refreshRage()
		{
			if(this.hp == 0){
				return ;
			}
			this.setRageProgress(this.rageNum/this.maxRageNum);
			
		}

		//初始化血条信息
		public refreshBlood()
		{
			this.setBloodProgress(this.m_uVo.getPercentHP()); 
			
		}

		//刷新血条信息
		public setHP(hp:number)
		{	
			/**已经死亡的返回 */
			if(this.hp == 0) return ;

			this.hp = hp;
			if(hp == 0){
				Utils.isGray(true,this.generalHead);
				this.closeRageProgress();
			}
			this.setBloodProgress(hp/this.m_uVo.getMaxHp()); 
		}

		public onDestroy(){
			if(this.raAni){
				this.raAni.removeAction();
				this.raAni = null;
			}
			EventManager.removeEventListeners(this);
			this.m_uVo = null;
			this.m_flowTime = 0;
		}
	}

    
}