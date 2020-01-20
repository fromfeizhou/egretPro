class EffectBase {

	protected m_pAnimations: com_main.SpriteAnimation[];

	public constructor() {
		this.m_pAnimations = [];
		this.init();
	}

	public init() {
	}

    public clear() {
		let animations = this.m_pAnimations;
		for (var key in animations) {
			if (animations.hasOwnProperty(key)) {
				let sa: com_main.SpriteAnimation = animations[key];
				sa.removeAction();
			}
		}
		this.m_pAnimations = [];
    }

	public addEffect(type: string, bitmap: egret.Bitmap) {
		let animations: com_main.SpriteAnimation = this.getEffect(type);
		if (animations) {
			animations.addBitmap(bitmap);
		}
	}

	public removeEffect(type: string, bitmap: egret.Bitmap) {
		let animations: com_main.SpriteAnimation = this.getEffect(type);
		if (animations) {
			animations.removeBitmap(bitmap);
		}
	}

	public getEffect(type: string) {
		let animations: com_main.SpriteAnimation = this.m_pAnimations[type];
		return animations;
	}

	public loadEffect(type: string, func: Function, target: any) {
		let animations = this.m_pAnimations;
		let animation = ImageEffect.load_2(type, func, target);
		animations[type] = animation;
		return animation;
	}
}

// /**战场 */
// class EffectBattle extends EffectBase {

// 	public static create() {
// 		return new EffectBattle();
// 	}

// 	public init() {
// 		let animations = this.m_pAnimations;

// 		// let EBattle_Fire1 = ImageEffect.load_2(IETypes.EBattle_Fire1);
// 		// let EBattle_Fire2 = ImageEffect.load_2(IETypes.EBattle_Fire2);
// 		// let EBattle_Fire3 = ImageEffect.load_2(IETypes.EBattle_Fire3);
// 		// let EBattle_Smoke = ImageEffect.load_2(IETypes.EBattle_Smoke);

// 		// animations[IETypes.EBattle_Fire1] = EBattle_Fire1;
// 		// animations[IETypes.EBattle_Fire2] = EBattle_Fire2;
// 		// animations[IETypes.EBattle_Fire3] = EBattle_Fire3;
// 		// animations[IETypes.EBattle_Smoke] = EBattle_Smoke;
// 	}
// }

/**主场景 */
class EffectMainMap extends EffectBase {

	public static create() {
		return new EffectMainMap();
	}

	public init() {
		let animations = this.m_pAnimations;

		// let EMap_Water = ImageEffect.load_2(IETypes.EMap_Water);
		// let EMap_Waterfall = ImageEffect.load_2(IETypes.EMap_Waterfall);

		// let EMap_Waterfall_xiao1 = ImageEffect.load_2(IETypes.EMap_Waterfall_xiao1);
		// let EMap_Waterfall_xiao = ImageEffect.load_2(IETypes.EMap_Waterfall_xiao);
		// let EMap_Waterfall_shuiche = ImageEffect.load_2(IETypes.EMap_Waterfall_shuiche);
		let EMap_Solider_Left = ImageEffect.load_2(IETypes.EMap_Solider_Left);
		let EMap_Solider_Right = ImageEffect.load_2(IETypes.EMap_Solider_Right);
		let EMap_Farmer_Right_down = ImageEffect.load_2(IETypes.EMap_Farmer_Right_down);
		let EMap_Farmer_Left_Up = ImageEffect.load_2(IETypes.EMap_Farmer_Left_Up);

		let EBuild_Repair = ImageEffect.load_2(IETypes.EBuild_Repair);
		// let EBuild_Boss_1 = ImageEffect.load_2(IETypes.EBuild_Boss_1);
		// let EBuild_Boss_2 = ImageEffect.load_2(IETypes.EBuild_Boss_2);
		// let EBuild_Boss_3 = ImageEffect.load_2(IETypes.EBuild_Boss_3);
		// let EBuild_BossRage = ImageEffect.load_2(IETypes.EBuild_BossRage);

		//let EBuild_UpGrade_Big = ImageEffect.load_2(IETypes.EBuild_UpGrade_Big);
		//let EBuild_UpGrade_Small = ImageEffect.load_2(IETypes.EBuild_UpGrade_Small);
		//let EBuild_UpGrade_MId = ImageEffect.load_2(IETypes.EBuild_UpGrade_MId);
		
		
		
		
		

		// animations[IETypes.EMap_Water] = EMap_Water;
		// animations[IETypes.EMap_Waterfall] = EMap_Waterfall;

		// animations[IETypes.EMap_Waterfall_xiao1] = EMap_Waterfall_xiao1;
		// animations[IETypes.EMap_Waterfall_xiao] = EMap_Waterfall_xiao;
		// animations[IETypes.EMap_Waterfall_shuiche] = EMap_Waterfall_shuiche;
		animations[IETypes.EMap_Solider_Left] = EMap_Solider_Left;
		animations[IETypes.EMap_Solider_Right] = EMap_Solider_Right;
		animations[IETypes.EMap_Farmer_Right_down] = EMap_Farmer_Right_down;
		animations[IETypes.EMap_Farmer_Left_Up] = EMap_Farmer_Left_Up;

		animations[IETypes.EBuild_Repair] = EBuild_Repair;
		// animations[IETypes.EBuild_Boss_1] = EBuild_Boss_1;
		// animations[IETypes.EBuild_Boss_2] = EBuild_Boss_2;
		// animations[IETypes.EBuild_Boss_3] = EBuild_Boss_3;
		// animations[IETypes.EBuild_BossRage] = EBuild_BossRage;

	}
}

// /**庆典 */
// class EffectCelebartion extends EffectBase {

// 	public static create() {
// 		return new EffectCelebartion();
// 	}

// 	public init() {
// 		let animations = this.m_pAnimations;

// 		// let EBattle_Fire1 = ImageEffect.load_2(IETypes.EBattle_Fire1);
// 		// let EQD_Colour = ImageEffect.load_2(IETypes.EQD_Colour);
// 		// let EQD_Time = ImageEffect.load_2(IETypes.EQD_Time);
// 		// let EQD_GQ = ImageEffect.load_2(IETypes.EQD_GQ);
// 		// let EQD_XS = ImageEffect.load_2(IETypes.EQD_XS);
// 		// let EQD_Start = ImageEffect.load_2(IETypes.EQD_Start);
// 		// let EQD_ZIRAN = ImageEffect.load_2(IETypes.EQD_ZIRAN);
// 		// let EQD_BOMB = ImageEffect.load_2(IETypes.EQD_BOMB);
// 		// EQD_Start.successIsReset = false;
// 		// EQD_BOMB.successIsReset = false;

// 		// animations[IETypes.EBattle_Fire1] = EBattle_Fire1;
// 		// animations[IETypes.EQD_Colour] = EQD_Colour;
// 		// animations[IETypes.EQD_Time] = EQD_Time;
// 		// animations[IETypes.EQD_GQ] = EQD_GQ;
// 		// animations[IETypes.EQD_XS] = EQD_XS;
// 		// animations[IETypes.EQD_Start] = EQD_Start;
// 		// animations[IETypes.EQD_ZIRAN] = EQD_ZIRAN;
// 		// animations[IETypes.EQD_BOMB] = EQD_BOMB;
// 	}

// 	public getEffectByType(type: LanternType) {
// 		switch (type) {
// 			case LanternType.COMMON_LANTERN:
// 				return IETypes.EQD_GQ;
// 			case LanternType.BURN_LANTERN:
// 				return IETypes.EQD_ZIRAN;
// 			case LanternType.TIME_LANTERN:
// 				return IETypes.EQD_Time;
// 			case LanternType.COLOURS_LANTERN:
// 				return IETypes.EQD_Colour;
// 			case LanternType.BOMB:
// 				return IETypes.EQD_BOMB;
// 		}
// 		return "";
// 	}
// }

// /**新手地图 */
// class EffectNoviceMap extends EffectBase {

// 	public static create() {
// 		return new EffectNoviceMap();
// 	}

// 	public init() {
// 		let animations = this.m_pAnimations;

// 		let EBuild_Raid = ImageEffect.load_2(IETypes.EBuild_Raid);
// 		let EBuild_Attack = ImageEffect.load_2(IETypes.EBuild_Attack);
// 		let EBuild_Defend = ImageEffect.load_2(IETypes.EBuild_Defend);
// 		let EBuild_BeAttack = ImageEffect.load_2(IETypes.EBuild_BeAttack);

		
// 		animations[IETypes.EBuild_Raid] = EBuild_Raid;
// 		animations[IETypes.EBuild_Attack] = EBuild_Attack;
// 		animations[IETypes.EBuild_Defend] = EBuild_Defend;
// 		animations[IETypes.EBuild_BeAttack] = EBuild_BeAttack;
// 	}
// }

/**大地图 */
class EffectWorldMap extends EffectBase {

	public static create() {
		return new EffectWorldMap();
	}

	public init() {
		let animations = this.m_pAnimations;

		// let EBuild_Raid = ImageEffect.load_2(IETypes.EBuild_Raid);
		// let EBuild_Attack = ImageEffect.load_2(IETypes.EBuild_Attack);
		// let EBuild_Defend = ImageEffect.load_2(IETypes.EBuild_Defend);
		// let EBuild_BeAttack = ImageEffect.load_2(IETypes.EBuild_BeAttack);
		// let EBuild_Flag_Red = ImageEffect.load_2(IETypes.EBuild_Flag_Red);
		// let EBuild_Flag_Gray = ImageEffect.load_2(IETypes.EBuild_Flag_Gray);
		// let EBuild_Flag_Blue = ImageEffect.load_2(IETypes.EBuild_Flag_Blue);
		// let EBuild_Flag_Green = ImageEffect.load_2(IETypes.EBuild_Flag_Green);

		// let EBuild_Event_D = ImageEffect.load_2(IETypes.EBuild_Event_D); 
		// let EBuild_Event_H = ImageEffect.load_2(IETypes.EBuild_Event_H);
		// let EBuild_Event_Q = ImageEffect.load_2(IETypes.EBuild_Event_Q);
		// let EBuild_Event_X = ImageEffect.load_2(IETypes.EBuild_Event_X);

		// let EBuild_Repair = ImageEffect.load_2(IETypes.EBuild_Repair);

		// let EUI_Guide_Icon = ImageEffect.load_2(IETypes.EUI_Guide_Icon);

		
		// animations[IETypes.EBuild_Raid] = EBuild_Raid;
		// animations[IETypes.EBuild_Attack] = EBuild_Attack;
		// animations[IETypes.EBuild_Defend] = EBuild_Defend;
		// animations[IETypes.EBuild_BeAttack] = EBuild_BeAttack;
		// animations[IETypes.EBuild_Flag_Red] = EBuild_Flag_Red;
		// animations[IETypes.EBuild_Flag_Gray] = EBuild_Flag_Gray;
		// animations[IETypes.EBuild_Flag_Blue] = EBuild_Flag_Blue;
		// animations[IETypes.EBuild_Flag_Green] = EBuild_Flag_Green;
		// // animations[IETypes.EBuild_Event_D] = EBuild_Event_D;
		// // animations[IETypes.EBuild_Event_H] = EBuild_Event_H;
		// // animations[IETypes.EBuild_Event_Q] = EBuild_Event_Q;
		// // animations[IETypes.EBuild_Event_X] = EBuild_Event_X;

		// // animations[IETypes.EBuild_Repair] = EBuild_Repair;

		// // animations[IETypes.EUI_Guide_Icon] = EUI_Guide_Icon;
	}
}

// /**宝石 */
// class EffectGEM extends EffectBase {

// 	public static create() {
// 		return new EffectGEM();
// 	}

// 	public init() {
// 		let efStr = [IETypes.EUI_Tan,IETypes.EUI_Gem_Success,IETypes.EUI_Gem_Fail];
// 		for(let str in efStr){
// 			if(efStr[str]&&efStr[str]!=""){
// 				this.loadEffect(efStr[str],null,null);
// 			}
// 		}
// 	}

// }

// class EffectFIEF extends EffectBase{
// 	public static create() {
// 		return new EffectFIEF();
// 	}

// 	public init() {
// 		this.loadEffect(IETypes.EUI_Tan,null,null)
// 	}
// }

// class EffectWorld extends EffectBase{
// 	public static create() {
// 		return new EffectWorld();
// 	}

// 	public get Type(): string[] {
// 		return [
// 			IETypes.EWorld_Smoke,
// 		]
// 	}

// 	public init() {
// 		for (let ty of this.Type) {
// 			this.m_pAnimations[ty] = ImageEffect.load_2(ty);
// 		}
// 	}
// }