module com_main {
	export class TestAnimMap extends BaseMap {

		/**场景管理 */
		public m_pSceneMgr: BattleSceneMgr;

		private m_pSquareList: Array<CSquare> = [];
		private m_pEffectList: Array<CEffect> = [];

		private squareType = 1000;
		private squareStatus = 1;
		private squareDir = 1;

		private effectID = 1;

		private createType = 1;


		private isCreateSoldier = true;

		/**当前地图数据 */
		private m_pMapSetting: MapSetting;

		public constructor() {
			super();

			this.m_pTileConfig = MapData.getTileMapConfig(3);

			BattleModel.init();
		}

		// public onEnter() {
		// 	this.addBgMap();

		// 	this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);
		//     this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoved, this);
		//     this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		//     this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);


		// }

		public onEnter() {
			super.onEnter();
			debug("BattleMap:onEnter--->>")

			this.m_pSceneMgr.initView();
			// this.m_pSceneMgr.makeGrid();
			// this.m_pSceneMgr.createUnits();
			// this.m_pSceneMgr.createElement();
			// this.m_pSceneMgr.createNPCObj();
			// this.m_pSceneMgr.createPlayerObjs();
			// let isopen = LocalData.getData('open_map_grid', "0");
			// if (parseInt(isopen)) this.m_pSceneMgr.drawGrid();
			// this.m_pSceneMgr.drawGrid();

			// this.m_pSceneMgr.onEnter();

			// let bm = new egret.Bitmap(RES.getRes('map_bottom_mask_png'));
            // this.addChild(bm);

            // bm.y = this.stage.$stageHeight - bm.height;

			// SceneManager.sceneCreateComplete();
			// this.wallEffect();

			
			// Tween.get(this).wait(1000).call(()=>{
			// 	console.log("daskldhsakjdhaskjhdasjhdaskj");
			// 	this.guideSetp1();})
			// FirstBattleGuide.getInstance().start();

			// this.m_pSceneMgr.makeGrid();
			// this.m_pSceneMgr.createUnits();
			// this.m_pSceneMgr.createElement();
			// this.m_pSceneMgr.wallEffect();
			// this.m_pSceneMgr.createNPCObj();
			// this.m_pSceneMgr.createPlayerObjs();  //旗帜 出生点
			// let isopen = LocalData.getData('open_map_grid', "0");
			// if (parseInt(isopen)) this.m_pSceneMgr.drawGrid();

			// // 调试网格
			// this.m_pSceneMgr.drawGrid();


			
			SceneManager.sceneCreateComplete();

			BattleModel.setMapId(6);
			// let config = MAP_ELE_CONFIG[BattleModel.getMapId()];
			// let unitvo = new UnitInfoVo();
			// console.log("城墙 id =========",unitvo.elementId);
			// let build = BBuild.create(unitvo);
			// build.setXY(config.wall_x, config.wall_y);
			// this.m_pSceneMgr.addChildToBuild(build, build.y);
			// this.m_pSceneMgr.addDynamicObj(100, build);

			// let tower1 = BBuildTower.create(unitvo);
			// tower1.setXY(config.tower1_x, config.tower1_y);
			// this.m_pSceneMgr.addChildToBuild(tower1, tower1.y);
			// this.m_pSceneMgr.addDynamicObj( 500, tower1);

			// let tower2 = BBuildTower.create(unitvo);
			// tower2.setXY(config.tower2_x, config.tower2_y);
			
			// this.m_pSceneMgr.addChildToBuild(tower2, tower2.y);
			// this.m_pSceneMgr.addDynamicObj( 501, tower2);

			// this.wallEffect();

		}

		public init() {

		}

		public setMapSetting(setting: MapSetting) {
			this.m_pMapSetting = setting;

			this.m_pTileConfig = MapData.getTileMapConfig(this.m_pMapSetting.getMapId());
		}

		public addMapBitmap(): void {
			super.addMapBitmap();

			this.m_pSceneMgr = BattleSceneMgr.getInstance();
			this.m_pSceneMgr.init();
			this.m_pSceneMgr.setMapSetting(this.m_pMapSetting);
			this.m_pSceneMgr.setMapView(this);

			this.mapMovePosition(new egret.Point(500, 800));

			// this.cleanSquare();
			// this.addSquare();

			EventMgr.addEvent(TestNav.TEST_CLEAN, () => {
				this.cleanSquare();
				// this.cleanEffect();
				// for(let i in this.m_pSquareList){
				// 	let square = this.m_pSquareList[i];
				// 	square.addEffect(212);
				// }
			}, this);

			EventMgr.addEvent(TestNav.TEST_CREATE_LANCER, () => {
				// this.cleanSquare();
				// this.addSquare(1);
				this.squareType = 1000;
			}, this);

			EventMgr.addEvent(TestNav.TEST_CREATE_CATAPULT, () => {
				// this.cleanSquare();
				// this.addSquare(24);
				this.squareType = 4000;
			}, this);

			EventMgr.addEvent(TestNav.TEST_CREATE_ARCHER, () => {
				// this.cleanSquare();
				// this.addSquare(16);
				// this.squareType = 3000;
				this.squareType = 2011;
			}, this);

			EventMgr.addEvent(TestNav.TEST_CREATE_KNIGHT, () => {
				// this.cleanSquare();
				// this.addSquare(16);
				this.squareType = 2000;
			}, this);

			EventMgr.addEvent(TestNav.TEST_CREATE_HOPLITE, () => {
				// this.cleanSquare();
				// this.addSquare(16);
				this.squareType = 1001;
			}, this);

			EventMgr.addEvent(TestNav.TEST_CREATE_SQUARE, (data) => {
				this.squareType = data.code;
				// this.cleanSquare();
				// this.addSquare(16);
			}, this);

			EventMgr.addEvent(TestNav.TEST_CHANGE_STATUS, (data) => {
				// this.changeStatus(data);
				this.squareStatus = data;
				this.changeAllStatus();
			}, this);

			EventMgr.addEvent(TestNav.TEST_CHANGE_DIR, (data) => {
				this.squareDir = data;
				this.changeAllDirection();
			}, this);

			EventMgr.addEvent(TestNav.TEST_CREATE_EFFECT, (data) => {
				this.effectID = data.code;
			}, this);

			EventMgr.addEvent(TestNav.TEST_CREATE_TYPE, (data) => {
				this.createType = data;
			}, this);

			EventMgr.addEvent(TestNav.TEST_IS_CREATER_SOLDIER, (data) => {
				// this.isCreateSoldier = !this.isCreateSoldier;
				this.addbuff();
			}, this);

			EventMgr.addEvent(TestNav.TEST_START_SKILL, (data) => {
				// this.startSkill();
				// this.showSkillNameEffect();
				// this.autoStopAction();

				// EffectUtils.shakeScreen(this,3);
				// this.killOne();
				this.addbuff();

				// this.flySoldier();
			}, this);


			EventMgr.addEvent(TestNav.TEST_RGB, (data) => {
				this.setRGB(data);
			}, this);


		}

		public cleanSquare(): void {
			for (var i: number = 0; i < this.m_pSquareList.length; i++) {
				Utils.removeFromParent(this.m_pSquareList[i]);
			}
			this.m_pSquareList = [];
		}

		public changeStatus(status): void {
			for (var i: number = 0; i < this.m_pSquareList.length; i++) {
				this.m_pSquareList[i].changeStatus(status);
			}
		}

		// public test_index = 0;
		public createSquare(type, status, dir, x, y) {
			var square = CSquare.createId(type,false,true);
			// if (this.test_index % 2 == 0)
			// 	square.test_fps = 12;
			// else
			// 	square.test_fps = 15;

			if(!this.isCreateSoldier)
			{
				return;
			}

			square.test = true;
			square.changeStatus(status);
			square.changeDirection(dir);
			square.x = x;
			square.y = y;
			// square.drawDiamond();
			// Utils.addChild(this.m_pSceneMgr.world, square);
			BattleSceneMgr.getInstance().addChildToWorld(square);
			square.onAddToStage();
			this.m_pSquareList.push(square);


			var shp:egret.Shape = new egret.Shape();
			shp.x = x;
			shp.y = y;
			shp.graphics.lineStyle( 2, 0x00ff00 );
			shp.graphics.beginFill( 0xff0000, 1);
			shp.graphics.drawCircle( 0, 0, 2 );
			shp.graphics.endFill();
			// this.addChild( shp );

			BattleSceneMgr.getInstance().addChildToWorld(shp);

			// square.addSoldierToMap();

			
			// square.addEffect(101);


			// this.test_index++;
			// Utils.TimerManager.doFrame(0, 0, ()=>{
			// 	square.y++;
			// }, this);

			// var index = 1;
			// Utils.TimerManager.doTimer(3000, 2, () => {
			// 	if (index == 1)
			// 		square.changeImage(4000);
			// 	else
			// 		square.recoverImage();
			// 	index++;
			// }, this);

			// var count = 0;
			// this.addEventListener(egret.Event.ENTER_FRAME, ()=>{
			// 	count++;
			// 	if (count > 30) {
			// 		count = 0;
			// 		square.changeDirection(dir);
			// 		dir++;
			// 		if (dir > 8) dir = 1;
			// 	}

			// }, this);
		}

		private tn = -100;
		public changeSquareHp() {
			for (var i: number = 0; i < this.m_pSquareList.length; i++) {
				var square = this.m_pSquareList[i];
				// square.showHpChange(this.tn);
				// square.showBattleInfo();
				// square.addEffect(6);
				// square.showExp();
			}
			this.tn -= 10;
		}

		public addSquare(type: number = 1): void {
			var change: Function = (index) => {
				let result = 1;
				switch (index) {
					case 0:
						result = 5;
						break;
					case 1:
						result = 6;
						break;
					case 2:
						result = 7;
						break;
					case 3:
						result = 4;
						break;
					case 5:
						result = 8;
						break;
					case 6:
						result = 3;
						break;
					case 7:
						result = 2;
						break;
					case 8:
						result = 1;
						break;
				}
				return result;
			};
			for (var i: number = 0; i < 9; i++) {
				if (i == 4) continue;
				var square = CSquare.createId(type);
				square.test = true;
				square.changeStatus(2);
				square.changeDirection(change(i));
				square.x = 500 + square.width * (i % 3) + (i % 3) * 30;
				square.y = 700 + square.height * Math.floor(i / 3) + Math.floor(i / 3) * 30;
				this.m_pSceneMgr.addChildToWorld(square);
				this.m_pSquareList.push(square);
			}

		}

		private fire(x, y) {
			// for (var i: number = 0; i < this.m_pSquareList.length; i++) {
			// 	var square = this.m_pSquareList[i];
			// 	square.changeStatus(CSquare_Status.STATUS_ATTACK);
			// 	if (square) {
			// 		// let spos = new egret.Point(square.x,square.y);
			// 		// let tpos = new egret.Point(x,y);
					
			// 		// let launchPos = square.getLaunchPos();
			// 		// spos.x += launchPos.launchX;
			// 		// spos.y += launchPos.launchY;
					
			// 		// Utils.TimerManager.doTimer(launchPos.launchDeleyTime, 1 , () => {
			// 		// 	let bullet = com_main.CBulletMgr.getIns().getBullet(1, 2, null, 0.8); 
			// 		// 	bullet.addPath(spos, tpos);
			// 		// 	bullet.start();
			// 		// 	BattleSceneMgr.getInstance().addChildToSuspension(bullet);
			// 		// },this)
			// 		// square.startSkillEffect();

			// 		square.showHpChange(-100);

			// 	}

			// }

			// let square = this.m_pSquareList[0] as CSquare;
			// let targetObj = this.m_pSquareList[1] as CSquare;
			// let tx = targetObj.x;
			// let ty = targetObj.y - 40;

			// let ax = square.x;
			// let ay = square.y - 50;
			// let radian: number = Utils.MathUtils.getRadian2(ax, ay, tx, ty);
			// let angle: number = Utils.MathUtils.getAngle(radian);

			// let eff = CEffectFunc.addEffect(122);
			// eff.x = ax;
			// eff.y = ay;
			// eff.rotation = angle;
			// eff.play();

			// let speed = 1000; //飞行速度
			// let dis = MathUtils.getInstance().getDistance(ax, ay, tx, ty)
			// let time = dis / speed * 1200;
			// egret.Tween.get(eff).to({x:tx,y:ty},time).call(()=>{
			// 			if(targetObj ){
			// 				targetObj.addEffect(121);
			// 			}
			// 			Utils.removeFromParent(eff);
			// 		});

			this.playSkillBagua(x, y);
		}

		private addEffect(x, y) {
			var effect: CEffect = CEffectMgr.getIns().getEffect(this.effectID);
			effect.x = x;
			effect.y = y;
			debug("effect---> width : " + effect.width + " height : " + effect.height);
			BattleSceneMgr.getInstance().addChildToSuspension(effect);
			// this.addChild(effect);
			effect.play();
			// CEffectFunc.flagOnStageAction(effect);
			if (effect.repeat == true) {
				this.m_pEffectList.push(effect);
			}
		}

		private cleanEffect() {
			for (var i: number = 0; i < this.m_pEffectList.length; i++) {
				Utils.removeFromParent(this.m_pEffectList[i]);
			}
			this.m_pEffectList = [];
		}


		public onTouchMoved(e: egret.TouchEvent): void {
			if (!this.m_pTouchPoints[e.touchPointID]) {
				return;
			}

			if (this.check_move_out(e)) {
				this.onTouchEnd(e);
				return;
			}
			// debug("onTouchMoved:",e.stageX,",",e.stageY);
			this.m_pTouchPoints[e.touchPointID].x = e.stageX;
			this.m_pTouchPoints[e.touchPointID].y = e.stageY;

			if (this.m_pTouchCon == 2) {
				this.m_pIsMove = false;

				let scaleX = this.m_pBg.scaleX;

				var newdistance = this.getTouchDistance();
				var scale = newdistance / this.m_p2pDistance * scaleX;

				scale = scale > 2 ? 2 : scale;
				scale = scale < 0.1 ? 0.1 : scale;

				for (var i: number = 0; i < this.m_pSquareList.length; i++) {
					// this.m_pSquareList[i].scaleX = scale;
					// this.m_pSquareList[i].scaleY = scale;
					// this.m_pSquareList[i].setSoldierScale(scale);
				}
				EventMgr.dispatchEvent(TestNav.TEST_ANIM_SCALE, scale);
			} else if (this.m_pTouchPoints[e.touchPointID] != null) {
				this.m_pIsMove = true;

				var pos = new egret.Point(this.m_pBg.x, this.m_pBg.y);
				pos.x += e.stageX - this.m_pPreTouchPos.x;
				pos.y += e.stageY - this.m_pPreTouchPos.y;

				this.mapMovePosition(pos);

				this.m_pPreTouchPos.x = e.stageX;
				this.m_pPreTouchPos.y = e.stageY;
				this.m_pPreMovePos.x = this.m_pLastMovePos.x;
				this.m_pPreMovePos.y = this.m_pLastMovePos.y;
				this.m_pLastMovePos.x = this.m_pBg.x;
				this.m_pLastMovePos.y = this.m_pBg.y;
				this.m_pLastMoveTime = egret.getTimer();
			}
		}
		private battlePlayer ;
		private clicktimes = 0;
		// private t = 1;
		public onTouchEnd(e: egret.TouchEvent): void {
			let is_click = !this.m_pIsMove;
			if (is_click && this.m_pTouchCon < 2) {
				debug("onTouchEnd");
				var pos = new egret.Point();
				this.m_pSceneMgr.getWorld().globalToLocal(e.stageX, e.stageY, pos);

				debug("pos = "+pos.x + "   " + pos.y);

				if (this.createType == 1) {
					// this.changeSquareHp();
					this.createSquare(this.squareType, this.squareStatus, this.squareDir, pos.x, pos.y);
					// if(this.battlePlayer){
						
					// }
					// if(this.clicktimes == 0){
					// 	var square = new BattlePlayer(1001);
					// 	this.battlePlayer = square;
					// 	square.x = pos.x;
					// 	square.y = pos.y;
					// 	// this.addChild(square);
					// 	BattleSceneMgr.getInstance().addChildToWorld(square);
					// }else if(this.clicktimes == 1){
					// 	this.battlePlayer.moveCenter();
					// }else if(this.clicktimes == 2){
					// 	this.battlePlayer.returnInit();
					// }
					// this.clicktimes = this.clicktimes + 1;
					// if(this.clicktimes > 2){
					// 	this.clicktimes = 1;
					// }
					
				} else if (this.createType == 2) {
					// this.addEffect(pos.x, pos.y);

					// var pos = new egret.Point();
					// this.m_pSceneMgr.getWorld().globalToLocal(e.stageX, e.stageY, pos);
					// this.hitAction(pos);

					// this.startSkill(pos.x, pos.y);

					// this.addbuff();
					this.fire(pos.x, pos.y);
				}

				// this.fire(pos.x, pos.y);

				// this.playSkillBagua(pos.x, pos.y);
				
				// this.playSkill(pos.x, pos.y);

				// this.changeStatus(this.t);
				// this.t++;
				// if (this.t>4) this.t = 1;
			}

			super.onTouchEnd(e);
		}

		public changeAllStatus()
		{
			for(let obj of this.m_pSquareList)
			{
				let square = obj as CSquare;
				square.changeStatus(this.squareStatus,null,1);
				// square.killingLastOne();
				// let tw = egret.Tween.get(square);
				// tw.wait(100).to({x:square.x + 300,y: square.y + 100},500);
			}
		}

		public changeAllDirection()
		{
			for(let obj of this.m_pSquareList)
			{
				let square = obj as CSquare;
				square.changeDirection(this.squareDir);
			}
		}

		public startSkill(x,y)
		{
			// csquare.addEffect(23);

			// for(let obj of this.m_pSquareList)
			// {
			// 	let square = obj as CSquare;
			// 	// square.changeDirection(this.squareDir);

				
				
			// 	// square.addEffect(102,0,0,this.playSkill,this);
			// 	// square.addEffect(56);

			// 	square.changeStatus(CSquare_Status.STATUS_ATTACK);
			// 	square.isStartSkill = true;
			// 	// square.addEffect(null,0,0,() =>{ this.playSkill(square.x,square.y) },this);
			// 	// this.playSkill(square.x,square.y);
			// 	square.addEffect(109,0,0,() =>{ this.playSkill(x,y) },this);
			// }

			let square = this.m_pSquareList[0] as CSquare;
			square.changeStatus(CSquare_Status.STATUS_ATTACK);
			square.isStartSkill = true;
			square.addEffect(109,0,0,() =>{ this.playSkill(x,y) },this);

		}

		public showSkillNameEffect()
		{	
			let temp = new gameProto.RealTimeWar()
			temp.attacker = new gameProto.RealTimeWarAttacker();
			let avo = new SkillAtkVo(temp);
			avo.skillId = 101301;
			let skillNameEffect = new BattleSkillName1(this.m_pSquareList[0],avo);
			this.addChild(skillNameEffect);

			new PoChengSkillAnimation(avo,this.m_pSceneMgr,this,new egret.Point);


			for(let obj of this.m_pSquareList)
			{
				let square = obj as CSquare;
				square.showHpChange(150);
			}

			let bullet = CBulletMgr.getIns().getBullet(1, 1,null);
			bullet.addPath(new egret.Point(0,0), new egret.Point(100,100));
			bullet.returnPos = new egret.Point(100,100);
			this.m_pSceneMgr.addChildToSuspension(bullet);
			bullet.start();
		}

		public playSkill(x,y)
		{
			// let effectMC = new MCDragonBones();
			// effectMC.initAsync("liefeng") ;
			// effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
			// effectMC.play("liefeng",1,true);

			// effectMC.x = x ;
			// effectMC.y = y ;
			// // this.addChild(effectMC);

			// BattleSceneMgr.getInstance().addChildToEffect(effectMC);


			// for(let obj of this.m_pSquareList)
			// {
			// 	let square = obj as CSquare;

			// 	let soldier = square.flyLastOne();
			// 	if(!soldier){
			// 		continue;
			// 	}
			// 	let ranx = x + Utils.random(-40,40);
			// 	let rany = y + Utils.random(-40,40);
			// 	let tmpScrPos:Point = new Point(soldier.x,soldier.y);
			// 	let tmpCtrlPos:Point ; //new Point(x + 80,soldier.y+100 );
			// 	if(soldier.x > ranx){
			// 		tmpCtrlPos = new Point(x + 80,soldier.y-100 );
			// 	}else{
			// 		tmpCtrlPos = new Point(x - 80,soldier.y-100 );
			// 	}
			// 	let tmpDstPos:Point = new Point(ranx,rany);
				
			// 	let itemObj = {item:soldier, lerp : 0}
			// 	var funcChange = function():void{
			// 		let curPos:Point = Utils.BezierCurve(tmpScrPos,tmpDstPos,tmpCtrlPos,itemObj.lerp);
			// 		itemObj.item.x = curPos.getX();
			// 		itemObj.item.y = curPos.getY();
			// 	}

			// 	let moveTime:number = 700;
			// 	egret.Tween.get(itemObj,{onChange:funcChange})               
			// 	.to({lerp:1}, moveTime)

			// 	soldier.scaleX = 1.5; 
			// 	soldier.scaleY = 1.5; 
			// 	egret.Tween.get(soldier)
			// 	.to({scaleX:0.5,scaleY:0.5}, moveTime,egret.Ease.quintIn)
			// 	.call(()=>{soldier.visible = false});

				           
				

			// }

			
		}

		public effect:MCDragonBones;

		public playSkillBagua(x,y)
		{
			// let effectMC1 = new MCDragonBones();
			// this.effect = effectMC1;
			// effectMC1.initAsync("flxfshouji") ;
			// effectMC1.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
			// effectMC1.play("flxf_fx_1",0,true);

			// effectMC1.x = x ;
			// effectMC1.y = y ;
			// BattleSceneMgr.getInstance().addChildToEffect(effectMC1);

			// let effectMC = new MCDragonBones();
			// this.effect = effectMC;
			// effectMC.initAsync("jiangdongbwSkill") ;
			// effectMC.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
			// effectMC.play("bottomLevel",0,true);

			// effectMC.x = x ;
			// effectMC.y = y ;
			// BattleSceneMgr.getInstance().addChildToEffect(effectMC);

			// let sq = this.m_pSquareList[0];
			// if(sq){
			// 	console.log('offx ,offy =',x-sq.x,y-sq.y);

				

			// 	// Tween.get(effectMC1).to({x:x,y:y},160).call(()=>{effectMC1.play("flxf_shouji",1,true);})

			// }

			let effectMC1 = new MCDragonBones();
			this.effect = effectMC1;
			effectMC1.initAsync("flxfshouji") ;
			effectMC1.addDBEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT,this.frame_event,this);
			// effectMC1.play("flxf_shouji",0,true);
			effectMC1.play("flxf_fx_2",1,true);

			effectMC1.x = x ;
			effectMC1.y = y ;
			BattleSceneMgr.getInstance().addChildToEffect(effectMC1);
		}

		private frame_event(evt:dragonBones.FrameEvent)
        {
			if(evt.frameLabel == "flyBlood"){
				for(let obj of this.m_pSquareList)
				{
					let square = obj as CSquare;
					// square.showCrit(150);
				}

			}

			if(evt.frameLabel == "shake_once_times"){
				EffectUtils.shakeScreen(this,5);
			}

			if(evt.frameLabel == "shake_little_once_times"){
				EffectUtils.shakeScreen(this,6);
			}

			if(evt.frameLabel == "shake"){
				EffectUtils.shakeScreen(this,4);
			}

			if(evt.frameLabel == "start"){
				this.effect.play("repeat",-1,false);
				// let skilldata = this.avo.getSkillConfig();
				// Utils.TimerManager.doTimer(skilldata.playTime, 1, this.timerCallback, this);
			}else if(evt.frameLabel == "repeat"){
				this.effect.play("end",1,true);
			}else if(evt.frameLabel == "end"){
			}

			else if(evt.frameLabel == "hit_fly"){ //击飞
				// this.flySoldier();
			}
        }

		private hitAction(startPoint:egret.Point){
			for(let obj of this.m_pSquareList)
			{
				let square = obj as CSquare;
				// square.showHitEffect(startPoint);
			}
		}

		private addbuff(){
			console.log(this.effectID);
			for(let obj of this.m_pSquareList)
			{
				let square = obj as CSquare;
				square.addEffect(this.effectID);
				// square.addEffect(113);
				// square.addEffect(114);
				// square.runAnimation();
			}

			// BattleSkillName1
			// this.showSkillNameEffect();
			

			// SkillAtkVo

			egret.Tween.get(this,{loop:true})
			.to({lightNum: 1},1000)
			.wait(3000)
			.to({lightNum: 0},1000)
		}
		public isRunAction = true;

		public autoStopAction(){
			if(this.isRunAction){
				this.stopAction();
			}else{
				this.startAction();
			}

			this.isRunAction = !this.isRunAction;
		}

		public stopAction(){
			
			for(let i in this.m_pSquareList){
				let sq = this.m_pSquareList[i];
				sq.stopAction();
			}

		}

		public startAction(){
			for(let i in this.m_pSquareList){
				let sq = this.m_pSquareList[i];
				sq.startAction();
			}

		}

		

		/**城墙特效 */
		public wallEffect(){

			let config = MAP_ELE_CONFIG[BattleModel.getMapId()];

			let effect1 = new MCDragonBones();
			effect1.initAsync(IETypes.EBattle_New_fire_1);
			effect1.play(IETypes.EBattle_New_fire_1);
			effect1.x = config.wallFire_x;
			effect1.y = config.wallFire_y;
			BattleSceneMgr.getInstance().addChildToWorld(effect1);
			// this.m_effectList.push(effect1);

			let effect2 = new MCDragonBones();
			effect2.initAsync(IETypes.EBattle_New_fire_2);
			effect2.play(IETypes.EBattle_New_fire_2);
			effect2.x = config.towerfire1_x;
			effect2.y = config.towerfire1_y;
			BattleSceneMgr.getInstance().addChildToWorld(effect2);
			// this.m_effectList.push(effect2);

			let effect3 = new MCDragonBones();
			effect3.initAsync(IETypes.EBattle_New_fire_2);
			effect3.play(IETypes.EBattle_New_fire_2);
			effect3.x = config.towerfire2_x;
			effect3.y = config.towerfire2_y;
			BattleSceneMgr.getInstance().addChildToWorld(effect3);
			// this.m_effectList.push(effect3);

			let effect4 = new MCDragonBones();
			effect4.initAsync(IETypes.EBattle_Wall_Boom);
			effect4.play(IETypes.EBattle_Wall_Boom);
			effect4.x = config.boom_x;
			effect4.y = config.boom_y;
			BattleSceneMgr.getInstance().addChildToWorld(effect4);

			let image = new eui.Image(config.posun_img);
			image.x = config.posun_x;
			image.y = config.posun_y;
			this.m_pSceneMgr.addChildToWorld(image,0);
			
		}

		public flySoldier(){
			for(let i in this.m_pSquareList){
				let square = this.m_pSquareList[i];
				square.hitFlyToPos(square.x + 300, square.y);
			}
		}
		
		public light: number = 0;
		public set lightNum(num: number){
            this.light = num;
            let r = -27 * num;
			let g = -27 * num;
			let b = 2 * num;
            var colorMatrix = [
                1,0,0,0,r,
                0,1,0,0,g,
                0,0,1,0,b,
                0,0,0,1,0
            ];

            var fliter = new egret.ColorMatrixFilter(colorMatrix);
            this.filters = [fliter];
        }

        public get lightNum(){
            return this.light;
        }

		// public 

		public setRGB(data:{r:number,g:number,b:number}){
            var colorMatrix = [
                1,0,0,0,data.r ,
                0,1,0,0,data.g,
                0,0,1,0,data.b,
                0,0,0,1,0
            ];

            var fliter = new egret.ColorMatrixFilter(colorMatrix);
            this.filters = [fliter];
        }

	}
}