module com_main {
	export class TestAnimUI extends CView {

		public test_group:eui.Group;
		public test_label:eui.Label;
		public m_fliter_r:Hslider;
		public m_fliter_g:Hslider;
		public m_fliter_b:Hslider;
		public m_lab_r:eui.Label;
		public m_lab_g:eui.Label;
		public m_lab_b:eui.Label;
		public m_test_image:eui.Image;
		public btnStand:eui.Group;
		public btnWalk:eui.Group;
		public btnAttack:eui.Group;
		public btnDead:eui.Group;
		public btnFly:eui.Group;
		public lbScale:eui.Label;
		public dropListView:com_main.DropList;
		public dropListView2:com_main.DropList;
		public dropListView3:com_main.DropList;
		public dropListView4:com_main.DropList;
		public dropListView5:com_main.DropList;
		public dropListView6:com_main.DropList;
		public btnClean:eui.Group;
		public btnCreate:eui.Group;


		private typeTag: number = 1;
		private effectMC:MCDragonBones ;
		private test_shape: egret.Shape;

		public constructor() {
			super();
			this.initApp("test/TestAnimUI.exml");
			this.once(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);

			EventMgr.addEvent(TestNav.TEST_ANIM_SCALE, (scale) => {
				this.lbScale.text = "缩放： " + Math.floor(scale * 100) + "%";
			}, this);
		}

		private onAddStage() {

		}

		public onTouchBegan(e: egret.TouchEvent): void {
			let x = e.stageX;
            let y = e.stageY;

			let x2 = this.test_shape.x;
			let y2 = this.test_shape.y;

			let angle: number = Utils.MathUtils.getRadian2(x, y, x2, y2) * 180 / Math.PI;

			this.test_label.text = "角度 ： " + angle;
		}

		protected childrenCreated(): void {
			super.childrenCreated();
			

			// var shp:egret.Shape = new egret.Shape();
			// shp.graphics.lineStyle( 2, 0x00ff00 );
			// shp.graphics.beginFill( 0xff0000, 1);
			// shp.graphics.drawCircle( 0, 0, 2 );
			// shp.graphics.endFill();
			// shp.x = this.test_group.height / 2;
			// shp.y = this.test_group.width / 2;
			
			// this.test_shape = shp;
			// this.test_group.addChild(shp);

			// this.test_group.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);

			// var square = new ManualSquare(1001);
			// square.x = 300;
			// square.y = 300;
			// this.addChild(square);

			this.initHslider();

			// com_main.EventManager.addTouchScaleListener(this.btnLancer, this, () => {
			// 	EventMgr.dispatchEvent(TestNav.TEST_CREATE_LANCER, "");
			// });

			// com_main.EventManager.addTouchScaleListener(this.btnCatapult, this, () => {
			// 	EventMgr.dispatchEvent(TestNav.TEST_CREATE_CATAPULT, "");
			// });

			// com_main.EventManager.addTouchScaleListener(this.btnArcher, this, () => {
			// 	EventMgr.dispatchEvent(TestNav.TEST_CREATE_ARCHER, "");
			// });



			com_main.EventManager.addTouchScaleListener(this.btnStand, this, () => {
				EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, 1);
			});

			com_main.EventManager.addTouchScaleListener(this.btnWalk, this, () => {
				EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, 2);
			});

			com_main.EventManager.addTouchScaleListener(this.btnAttack, this, () => {
				EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, 3);
			});

			com_main.EventManager.addTouchScaleListener(this.btnDead, this, () => {
				EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, 4);
			});

			com_main.EventManager.addTouchScaleListener(this.btnFly, this, () => {
				EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, 5);
			});

			


			com_main.EventManager.addTouchScaleListener(this.btnClean, this, () => {
				EventMgr.dispatchEvent(TestNav.TEST_CLEAN, 4);
			});

			com_main.EventManager.addTouchScaleListener(this.btnCreate, this, () => {
				// EventMgr.dispatchEvent(TestNav.TEST_IS_CREATER_SOLDIER, 4);
				EventMgr.dispatchEvent(TestNav.TEST_START_SKILL, 4);
			});


			var sourceArr: any[] = [];
			for(let i in C.ArmyModelConfig){
				let config = C.ArmyModelConfig[i];
				sourceArr.push({type:config.description,code:config.id});
			}

			this.dropListView.setArrayCollection(sourceArr);
			this.dropListView.setItemTapCallback((index) => {
				debug("select : " + index);
				if (this.typeTag == 1) {
					let data = sourceArr[index];
					EventMgr.dispatchEvent(TestNav.TEST_CREATE_SQUARE, data);
					// switch (index) {
					// 	case 0:
					// 		EventMgr.dispatchEvent(TestNav.TEST_CREATE_LANCER, "");
					// 		break;
					// 	case 1:
					// 		EventMgr.dispatchEvent(TestNav.TEST_CREATE_CATAPULT, "");
					// 		break;
					// 	case 2:
					// 		EventMgr.dispatchEvent(TestNav.TEST_CREATE_ARCHER, "");
					// 		break;
					// 	case 3:
					// 		EventMgr.dispatchEvent(TestNav.TEST_CREATE_KNIGHT, "");
					// 		break;
					// 	case 4:
					// 		EventMgr.dispatchEvent(TestNav.TEST_CREATE_HOPLITE, "");
					// 		break;
					// }
				} else if (this.typeTag == 2) {
					let eid = index + 1;
					EventMgr.dispatchEvent(TestNav.TEST_CREATE_EFFECT, eid);
				}

			}, this);



			var sourceArr2: any[] = [];
			sourceArr2.push({ type: "待机" });
			sourceArr2.push({ type: "行走" });
			sourceArr2.push({ type: "攻击" });
			sourceArr2.push({ type: "死亡" });
			this.dropListView2.setArrayCollection(sourceArr2);
			this.dropListView2.setItemTapCallback((index) => {
				let status = index + 1;
				EventMgr.dispatchEvent(TestNav.TEST_CHANGE_STATUS, status);
			}, this);


			var sourceArr3: any[] = [];
			sourceArr3.push({ type: "右下" });
			sourceArr3.push({ type: "下" });
			sourceArr3.push({ type: "左下" });
			sourceArr3.push({ type: "左" });
			sourceArr3.push({ type: "左上" });
			sourceArr3.push({ type: "上" });
			sourceArr3.push({ type: "右上" });
			sourceArr3.push({ type: "右" });
			this.dropListView3.setArrayCollection(sourceArr3);
			this.dropListView3.setItemTapCallback((index) => {
				let dir = index + 1;
				EventMgr.dispatchEvent(TestNav.TEST_CHANGE_DIR, dir);
			}, this);


			// 特效列表
			var sourceArr4: any[] = [];
			for(let i in C.EffectConfig){
				let config = C.EffectConfig[i];
				if(config.testUIShow == 1){
					sourceArr4.push({type:config.description,code:config.id});
				}
			}
			this.dropListView4.setArrayCollection(sourceArr4);
			this.dropListView4.setItemTapCallback((index) => {
				// let eid = index + 1;
				let data = sourceArr4[index];
				EventMgr.dispatchEvent(TestNav.TEST_CREATE_EFFECT, data);
			}, this);


			var sourceArr5: any[] = [];
			sourceArr5.push({ type: "方阵" });
			sourceArr5.push({ type: "特效" });
			this.dropListView5.setArrayCollection(sourceArr5);
			this.dropListView5.setItemTapCallback((index) => {
				let data = index + 1;
				this.typeTag = data;
				if (this.typeTag == 1) {
					this.dropListView.setArrayCollection(sourceArr);
					this.dropListView2.visible = true;
					this.dropListView3.visible = true;
				} else if (this.typeTag == 2) {
					this.dropListView.setArrayCollection(sourceArr4);
					this.dropListView2.visible = false;
					this.dropListView3.visible = false;
				}
				EventMgr.dispatchEvent(TestNav.TEST_CREATE_TYPE, data);
			}, this);

		}

		private frame_event(evt:dragonBones.FrameEvent)
        {
            // console.log( " 播放到了一个关键帧！ 帧标签为：",evt.frameLabel);
        }

		public initHslider(){
			this.m_fliter_r.minimum = 0;
			this.m_fliter_r.maximum = 255;
			this.m_fliter_r.value = 0;

			this.m_fliter_g.minimum = 0;
			this.m_fliter_g.maximum = 255;
			this.m_fliter_g.value = 0;

			this.m_fliter_b.minimum = 0;
			this.m_fliter_b.maximum = 255;
			this.m_fliter_b.value = 0;

			this.m_fliter_r.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
			this.m_fliter_g.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
			this.m_fliter_b.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);

			// // 测试亮度
			// this.m_fliter_r.minimum = 0;
			// this.m_fliter_r.maximum = 200;
			// this.m_fliter_r.value = 100;
			// this.m_fliter_r.addEventListener(eui.UIEvent.CHANGE, this.changeLight, this);
		}

		public onchangSlider(){
			this.m_lab_r.text = this.m_fliter_r.value + "";
			this.m_lab_g.text = this.m_fliter_g.value + "";
			this.m_lab_b.text = this.m_fliter_b.value + "";
			let data = {r:this.m_fliter_r.value,g:this.m_fliter_g.value,b:this.m_fliter_b.value};

			EventMgr.dispatchEvent(TestNav.TEST_RGB, data);
		}

		public changeLight(){
			this.m_lab_r.text = this.m_fliter_r.value + "";
			let light = this.m_fliter_r.value;
			light = light / 100;
            var colorMatrix = [
                1 * light,0,0,0,0,
                0,1 * light,0,0,0,
                0,0,1 * light,0,0,
                0,0,0,1,0
            ];

            var fliter = new egret.ColorMatrixFilter(colorMatrix);
            this.m_test_image.filters = [fliter];
        }


	}
}