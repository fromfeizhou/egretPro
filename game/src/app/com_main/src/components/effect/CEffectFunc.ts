module com_main {
	export class CEffectFunc {

		/**
		 * 
		 */
		public static addEffect(id: number, parent?: egret.DisplayObjectContainer): CEffect {
			var effect: CEffect = CEffectMgr.getIns().getEffect(id);
			if (parent) {
				parent.addChild(effect);
			} else {
				if (effect.spMark == 1)
					BattleSceneMgr.getInstance().addChildToEffect(effect);
				else if (effect.spMark == 4)
					BattleSceneMgr.getInstance().addChildToSuspension(effect);
				else
					BattleSceneMgr.getInstance().addChildToWorld(effect);
			}
			return effect;
		}


		public static getTweenEffect(tweenId: number, obj: any, callback: Function, thisArg: any) {
			switch (tweenId) {
				case 1:
					CEffectFunc.inrushAction(obj, callback, thisArg);
					break;
				case 2:
					CEffectFunc.floatAction(obj, callback, thisArg,1);
					break;
				case 3:
					CEffectFunc.floatSkillAction(obj, callback, thisArg);
				default:
					break;
			}
		}


		/**
		 * 突入动画
		 */
		public static inrushAction(obj: egret.DisplayObject, callback: Function, thisArg: any) {
			obj.scaleX = 0.8;
			obj.scaleY = 0.8;
			obj.alpha = 0;
			egret.Tween.get(obj)
				.to({ scaleX: 2.2, scaleY: 2.2, alpha: 1 }, 100)//, egret.Ease.backOut)
				.to({ scaleX: 1.5, scaleY: 1.5 }, 100)//, egret.Ease.backOut)
				.wait(200)
				.to({ alpha: 0 }, 450)
				.call(callback, thisArg);
		}

		/**
		 * 飘血效果
		 */
		public static buffWorldAction(obj: egret.DisplayObject, callback: Function, thisArg: any) {
			let offY = -20;
			let oy = obj.y;
			obj.y = oy - 80 + offY;
			obj.alpha = 0;
			egret.Tween.get(obj)
				.to({ y: oy - 35 + offY, alpha: 1 }, 100)
				.to({ y: oy - 50 + offY}, 100)
				.wait(800)
				.to({alpha: 0 }, 450)
				.call(callback, thisArg);
		}

		/**
		 * 飘血效果
		 */
		public static floatAction(obj: egret.DisplayObject, callback: Function, thisArg: any, scale:number) {
			let oy = obj.y;
			egret.Tween.get(obj)
			.to({scaleX:1.9 * scale,scaleY:1.9 * scale},40)
			.to({scaleX:1 * scale,scaleY:1 * scale},120)
			.to({y: oy - 44},260+100)
			.to({y: oy - 60,alpha: 0.14},230+85)
			.call(callback, thisArg);
		}

		/**
		 * 暴击效果
		 */
		public static floatCritAction(obj: egret.DisplayObject, callback: Function, thisArg: any){
			obj.y -= 80;
			let oy = obj.y;
			obj.scaleX = obj.scaleY = 0;
			egret.Tween.get(obj)
			.to({scaleX:2,scaleY:2},120)
			.to({scaleX:1,scaleY:1},50)
			.wait(400)
			.to({scaleX:2,scaleY:2,y:obj.y - 40 ,lightNum: 200},100)

			.call(callback, thisArg);
		}


		/**
		 * 飘经验效果 1250 ms
		 */
		public static floatExpAction(obj: egret.DisplayObject, callback: Function, thisArg: any) {
			let oy = obj.y;
			obj.y = oy - 80;
			obj.alpha = 0;
			egret.Tween.get(obj)
				.to({ y: oy - 35, alpha: 1 }, 100)
				.to({ y: oy - 50 }, 100)
				.wait(600)//.wait(400)
				.to({ y: oy - 130, alpha: 0 }, 450)
				.call(callback, thisArg);
		}


		/**
		 * 飘强化效果
		 */
		public static floatStrengthenAction(obj: egret.DisplayObject, callback: Function, thisArg: any) {
			let oy = obj.y;
			obj.alpha = 0;
			egret.Tween.get(obj)
				.to({ y: oy - 35, alpha: 1 }, 100)
				.to({ y: oy - 50 }, 100)
				.wait(400)
				.to({ y: oy - 130, alpha: 0 }, 450)
				.call(callback, thisArg);
		}


		/**
		 * 经验/军工
		 */
		public static showSquareInfo(font, img, txt, x, y) {
			let node: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
			let imgInfo: egret.Bitmap = ObjectPool.pop(egret.Bitmap,"egret.Bitmap");
			imgInfo.texture = img; //RES.getRes("battle_exp");
			Utils.addChild(node, imgInfo);
			let txtInfo: egret.BitmapText = ObjectPool.pop(egret.BitmapText,"egret.BitmapText");
			txtInfo.letterSpacing = -6;
			txtInfo.font = font; //CResMgr.getIns().fontList[2];
			txtInfo.text = txt; //"+10086";
			txtInfo.x = imgInfo.x + imgInfo.width;
			Utils.addChild(node, txtInfo);
			BattleSceneMgr.getInstance().addChildToSuspension(node);
			node.anchorOffsetX = node.width * 0.5;
			node.anchorOffsetY = node.height;
			node.scaleX = 1.4;
			node.scaleY = 1.4;

			// node.x = this.width * 0.5;

			CEffectFunc.floatExpAction(node, () => {
				Utils.DisplayUtils.removeFromParent(node);
				node.removeChildren();
				// ObjectPool.push(txt);
				ObjectPool.push(imgInfo);
				ObjectPool.push(txtInfo);
			}, this);
		}

		/**
		 * 攻击城墙飘血效果
		 */
		public static floatHitCityWallAction(obj: egret.DisplayObject, callback: Function, thisArg: any) {
			let oy = obj.y;
			egret.Tween.get(obj)
				.to({ y: oy - 70, alpha: 0 }, 400)
				.call(callback, thisArg);
		}

		/**
		 * 往上飘不跳动效果
		 */
		public static floatExpMilitaryAction(obj: egret.DisplayObject, callback: Function, thisArg: any) {
			let oy = obj.y;
			egret.Tween.get(obj)
				// .wait(400)
				// .to({ y: oy - 100, alpha: 1 }, 450)
				// .call(callback, thisArg);
				.to({ y: oy - 50, alpha: 0.7 }, 500)
				.call(callback, thisArg);
		}
		/**
		 * 军工经验加成往上飘不跳动效果
		 */
		public static expMilitaryAction(font, img, txt, x, y, object) {
			let node: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
			let imgInfo: egret.Bitmap = ObjectPool.pop(egret.Bitmap,"egret.Bitmap");
			imgInfo.texture = img;
			Utils.addChild(node, imgInfo);
			let txtInfo: egret.BitmapText = ObjectPool.pop(egret.BitmapText,"egret.BitmapText");
			txtInfo.letterSpacing = -6;
			txtInfo.font = font; //CResMgr.getIns().fontList[2];
			txtInfo.text = txt; //"+10086";
			txtInfo.x = imgInfo.x + imgInfo.width;
			Utils.addChild(node, txtInfo);
			Utils.addChild(object, node);
			node.anchorOffsetX = node.width * 0.5;
			node.anchorOffsetY = node.height;
			// node.scaleX = 1.4;
			// node.scaleY = 1.4;
			node.x = x;
			node.y = y;
			CEffectFunc.floatExpMilitaryAction(node, () => {
				if (node) {
					node.removeChildren();
					ObjectPool.push(imgInfo);
					ObjectPool.push(txtInfo);
					Utils.DisplayUtils.removeFromParent(node);
					node = null;
				}
			}, this);
		}

		/**
		 * 技能动画
		 */
		public static floatSkillAction(objs: egret.DisplayObject[], callback?: Function, thisArg?: any) {
			let len = objs.length;
			let appear = 180;
			let fadeIn = 80;
			let stay = 150;
			let stay2 = 100;
			let fadeOut = 80;
			for (let i: number = 0; i < len; i++) {
				// let obj: egret.DisplayObject = objs[i];
				// let ox = obj.x;
				// let nx = ox + (55 * i);
				// obj.scaleX = 0.5;
				// obj.scaleY = 0.5;
				// obj.alpha = 0;
				// let tw = egret.Tween.get(obj);
				// tw.wait(i * appear);
				// tw.to({ scaleX: 3.5, scaleY: 3.5, alpha: 1, x: nx }, fadeIn);
				// tw.wait((len - i) * appear + stay); //tw.wait((len - i) * appear + stay);
				// // tw.to({ scaleX: 4, scaleY: 4, alpha: 1, x: nx }, (len - i) * appear + stay);
				// tw.to({ scaleX: 1.5, scaleY: 1.5, x: ox }, appear);
				// tw.wait(200);
				// tw.to({ scaleY: 0 }, fadeOut);
				// if (i == (len - 1)) {
				// 	if (callback && thisArg)
				// 		tw.call(callback, thisArg);
				// } else {

				// }

				let obj: egret.DisplayObject = objs[i];
				obj.scaleX = 2;
				obj.scaleY = 2;
				obj.alpha = 0;
				let tw = egret.Tween.get(obj);
				tw.wait(i * appear);
				tw.to({ scaleX: 4, scaleY: 4, alpha: 1 }, fadeIn);
				tw.wait(stay2);
				tw.to({ scaleX: 1.5, scaleY: 1.5 }, /*appear*/80);
				tw.wait((len - i) * appear + stay);
				tw.to({ scaleY: 0 }, fadeOut);
				if (i == (len - 1)) {
					if (callback && thisArg)
						tw.call(callback, thisArg);
				} else {

				}

			}
		}


		/**
		 * 升级动画
		 */
		public static levelUpAction(objs: egret.DisplayObject[], callback?: Function, thisArg?: any) {
			let len = objs.length;
			let appear = 100;
			let startScale = 1;
			let maxScale = 3;
			let finalScale = 1.3;
			for (let i: number = 0; i < len; i++) {
				let obj: egret.DisplayObject = objs[i];
				obj.scaleX = startScale;
				obj.scaleY = startScale;
				obj.alpha = 0;
				let tw = egret.Tween.get(obj);
				tw.wait(i * appear);
				tw.to({ scaleX: maxScale, scaleY: maxScale, alpha: 1 }, appear);
				tw.to({ scaleX: finalScale, scaleY: finalScale }, appear);
				if (i == (len - 1)) {
					if (callback && thisArg)
						tw.call(callback, thisArg);
				} else {

				}

			}
		}

		/**
		 * 旗帜出场
		 */
		public static flagOnStageAction(obj: egret.DisplayObject) {
			let fallH = 300;
			let fallTime = 150;
			let oy = obj.y;
			obj.y = obj.y - fallH;
			obj.alpha = 0;
			let tw = egret.Tween.get(obj);
			tw.to({ y: oy, alpha: 1 }, fallTime);
			tw.call(() => {
				let disp = CEffectMgr.getIns().getEffect(9);
				if (obj && obj.parent) {
					Utils.addChild(obj.parent, disp);
					obj.parent.swapChildren(obj, disp);
					disp.x = obj.x + 20;
					disp.y = obj.y + 60;
					disp.play();
				}
			});
		}

		/**
		 * 战法区域提示
		 */
		public static speelAreaTipsAction(point: any) {
			let bm = new egret.Bitmap(RES.getRes("battle_skill_select_png"));
			bm.anchorOffsetX = bm.width * 0.5;
			bm.anchorOffsetY = bm.height * 0.5;
			bm.x = point.x;
			bm.y = point.y;
			BattleSceneMgr.getInstance().addChildToSuspension(bm);
			let tw = egret.Tween.get(bm);
			tw.to({ alpha: 0 }, 1000);
			tw.call(() => { Utils.removeFromParent(bm) }, this);
		}


		/**
		 * 续个盖印动画
		 */
		public static stampAction(objs: egret.DisplayObject[], callback?: Function, thisArg?: any) {
			let len = objs.length;
			let appear = 200;
			let stay = 500;
			let fadeOut = 100;
			for (let i: number = 0; i < len; i++) {
				let obj: egret.DisplayObject = objs[i];
				obj.scaleX = 1.2;
				obj.scaleY = 1.2;
				obj.alpha = 0;
				let tw = egret.Tween.get(obj);
				tw.wait(i * appear);
				tw.to({ scaleX: 1.6, scaleY: 1.6, alpha: 1 }, appear);
				// tw.wait((len - i) * appear + stay);
				tw.to({ scaleX: 1, scaleY: 1 }, fadeOut);
				if (i == (len - 1)) {
					if (callback && thisArg)
						tw.call(callback, thisArg);
				} else {

				}

			}
		}


		/**
		 * 逐个浮现
		 */
		public static emergeAction(objs: egret.DisplayObject[], callback?: Function, thisArg?: any) {
			let len = objs.length;
			let appear = 200;
			let stay = 500;
			let fadeOut = 100;
			for (let i: number = 0; i < len; i++) {
				let obj: egret.DisplayObject = objs[i];
				obj.scaleX = 0.7;
				obj.scaleY = 0.7;
				obj.alpha = 0;
				let tw = egret.Tween.get(obj);
				tw.wait(i * appear);
				tw.to({ scaleX: 1, scaleY: 1, alpha: 1 }, appear);
				if (i == (len - 1)) {
					if (callback && thisArg)
						tw.call(callback, thisArg);
				} else {

				}

			}
		}


		/**
		 * 单个盖印
		 */
		public static stampSingleAction(obj: egret.DisplayObject) {
			obj.alpha = 0;
			let osX = obj.scaleX;
			let osY = obj.scaleY;
			let tw = egret.Tween.get(obj);
			tw.wait(500);
			tw.to({ alpha: 1, scaleX: osX + 0.8, scaleY: osY + 0.8 }, 100);
			tw.to({ scaleX: osX + 1, scaleY: osY + 1 }, 500)
			tw.to({ scaleX: osX, scaleY: osY }, 100);
		}


		/**
		 * 续个往上飘
		 */
		public static floatOneByOneAction(objs: egret.DisplayObject[], itemOffset: number, callback?: Function, thisArg?: any) {
			let temp = [];
			let len = objs.length;
			let appear = 200;
			for (let i: number = 0; i < len; i++) {
				let obj: egret.DisplayObject = objs[i];
				obj.alpha = 0;
				let newHeight = obj.y - itemOffset;
				let tw = egret.Tween.get(obj);
				tw.wait(i * appear);
				tw.call(() => {
					for (let j: number = 0; j < temp.length; j++) {
						let to = temp[j];
						let newHeight = to.y - itemOffset;
						tw.to({ y: newHeight, alpha: 1 }, appear);
					}
				});
				temp.push(obj);
				// tw.to({ y: newHeight, alpha: 1 }, appear);

				// for (let j: number = (len - i - 1); j > 0; j--) {
				// 	let newHeight = obj.y - itemOffset;
				// 	tw.to({ y: newHeight, alpha: 1 }, appear);
				// 	tw.wait(j * appear);
				// }
			}
		}


		/**
		 * 
		 */
		public static textBounceAction(obj: any, callback?: Function, thisArg?: any) {
			let oc = GameConfig.TextColors.fontWhite;//obj.textColor;
			let tw = egret.Tween.get(obj);
			tw.set({ textColor: GameConfig.TextColors.golden });
			tw.to({ scaleX: 1.5, scaleY: 1.5 }, 100);
			tw.wait(100);
			tw.to({ scaleX: 1, scaleY: 1 }, 50);
			tw.set({ textColor: oc });
			if (callback && thisArg)
				tw.call(callback, thisArg);
		}

		/**
		 * 数字跳动变化
			let value = {
				obj: this.m_pLblScore,
				scaleX: 1.5,
				scaleY: 1.5,
				formatStr: "{1}"
				oldVar: 0,
				newVar: 200,
			};
		*/
		public static numberBounceAction(value: any, callback?: Function, thisArg?: any) {
			// debug("CEffectFunc:numberBounceAction--->>", oldVar, newVar);
			let obj = value.obj;
			let oldVar = value.oldVar;
			let newVar = value.newVar;
			let formatStr = value.formatStr || "{1}";

			if (isNull(value.obj)) return;
			let _scalex = value.scaleX || 1;
			let _scaley = value.scaleY || 1;
			if (!isNull(_scalex)) obj.scaleX = _scalex;
			if (!isNull(_scaley)) obj.scaleY = _scaley;

			let bounceNum = 4;
			let numArray = [];
			let len = bounceNum;
			let temp = newVar - oldVar;
			let diff = Math.abs(temp);

			if ((diff / bounceNum) < 1) len = 1;

			for (let i: number = 0; i < len; i++) {
				numArray[i] = Math.floor(diff / bounceNum);
				if (i == (len - 1)) {
					numArray[i] += diff % bounceNum;
				}
			}

			let oc = GameConfig.TextColors.fontWhite;
			egret.Tween.removeTweens(obj);
			let tw = egret.Tween.get(obj);
			tw.set({ textColor: GameConfig.TextColors.golden });
			tw.to({ scaleX: _scalex * 1.5, scaleY: _scaley * 1.5 }, 100);
			for (let i: number = 0; i < len; i++) {
				if (temp > 0) {
					oldVar += numArray[i];
				} else {
					oldVar -= numArray[i];
				}
				tw.to({ text: format(formatStr, oldVar), scaleX: _scalex * 1.7, scaleY: _scaley * 1.7 }, 50);
				tw.to({ scaleX: _scalex * 1.5, scaleY: _scaley * 1.5 }, 50);
				tw.call(() => { Sound.playID(117); });
			}
			tw.wait(100);
			tw.to({ scaleX: _scalex, scaleY: _scaley }, 50);
			tw.set({ textColor: oc });
			if (callback && thisArg)
				tw.call(callback, thisArg);
			else
				tw.call(() => {
					obj.textColor = oc;
					// debug("CEffectFunc:numberBounceAction--->>", oldVar, newVar, obj.text);
				});
		}

		/**
		 * 滚动
		 */
		public static rollingContentList: Array<any> = [];
		public static rollingNotificationAction(obj: any, callback?: Function, thisArg?: any) {
			let intervalY = 15;
			let len = CEffectFunc.rollingContentList.length;
			for (let i: number = 0; i < len; i++) {
				let oldObj = CEffectFunc.rollingContentList[i];
				let lay = (len - i) * 20;
				egret.Tween.removeTweens(oldObj);
				// oldObj.y -= oldObj.height;
				oldObj.oy = oldObj.y - oldObj.height - intervalY;
				let tw = egret.Tween.get(oldObj);
				tw.to({ y: oldObj.oy, alpha: 1 }, 100);
				tw.wait(500 - lay);
				tw.to({ alpha: 0 }, 500 - lay * 10);
				tw.call(() => {
					Utils.removeFromParent(oldObj);
					if (CEffectFunc.rollingContentList.length > 0)
						CEffectFunc.rollingContentList.splice(0, 1);
				});
			}

			obj.oy = obj.y;
			obj.y += obj.height + intervalY;
			obj.alpha = 0;
			CEffectFunc.rollingContentList.push(obj);
			let tw = egret.Tween.get(obj);
			tw.to({ y: obj.oy, alpha: 1 }, 100);
			tw.wait(500);
			tw.to({ alpha: 0 }, 1000);
			tw.call(() => {
				Utils.removeFromParent(obj);
				if (CEffectFunc.rollingContentList.length > 0)
					CEffectFunc.rollingContentList.splice(0, 1);
			});
		}


		/**
		 * 文本滚动
		 */
		public static textRollingAction(contentArr: Array<any>, thisArg?: any, complateMethod?: Function, complateMethodObj?: any) {
			let len = contentArr.length;
			let index = 0;
			if (len > 0) {
				Utils.TimerManager.doTimer(200, len, () => {
					let lbContent = new egret.TextField();
					lbContent.size = GameConfig.LabelFontSize.normalSize;
					lbContent.textColor = GameConfig.TextColors.green;
					lbContent.strokeColor = 0x000000;
					lbContent.stroke = 2;
					lbContent.text = contentArr[index];
					lbContent.anchorOffsetX = lbContent.width * 0.5;
					lbContent.anchorOffsetY = lbContent.height * 0.5;
					lbContent.x = AGame.R.app.stageWidth * 0.5;
					lbContent.y = AGame.R.app.stageHeight * 0.5;
					AGame.R.app.topLevel.addChild(lbContent);
					CEffectFunc.rollingNotificationAction(lbContent);
					index++;
				}, (thisArg || this), complateMethod, complateMethodObj);
			}
		}


		/**
		 * 呼吸效果
		 */
		public static breatheAction(obj: egret.DisplayObject, duration: number = 1000) {
			egret.Tween.removeTweens(obj);
			obj.scaleX = 1;
			obj.scaleY = 1;
			let breatheFunc = () => {
				let tw = egret.Tween.get(obj);
				tw.to({ scaleX: 1.5, scaleY: 1.5 }, duration);
				tw.to({ scaleX: 1, scaleY: 1 }, duration);
				tw.call(breatheFunc);
			};
			breatheFunc();
		}



		/**
		 * 震屏效果
		 * shakeTime 震动次数 单次 120ms
		 */
		public static shakeAction(obj: egret.DisplayObject, originX: number, originY: number,shakeTime:number = 3) {
			let ox = originX;
			let oy = originY;

			let tw = egret.Tween.get(obj, null, null, true);

			let shakeInterval = 20;
			let shakeRange = 10;

			for (let i: number = 0; i < shakeTime; i++) {
				tw.to({ x: ox + shakeRange }, shakeInterval);
				tw.to({ x: ox }, shakeInterval);
				tw.to({ x: ox - shakeRange }, shakeInterval);
				tw.to({ y: oy + shakeRange }, shakeInterval);
				tw.to({ y: oy }, shakeInterval);
				tw.to({ y: oy - shakeRange }, shakeInterval);
			}
			tw.to({ x: ox, y: oy }, shakeInterval);
		}



		public static clean(thisArg?: any) {
			Utils.TimerManager.removeAll((thisArg || this));
			let len = CEffectFunc.rollingContentList.length;
			for (let i: number = 0; i < len; i++) {
				let obj = CEffectFunc.rollingContentList[i];
				Utils.removeFromParent(obj);
			}
			CEffectFunc.rollingContentList = [];
		}

		//在屏幕中间停留两秒
		public static flyCenter(obj){

			obj.anchorOffsetX = obj.width * 0.5;
			obj.anchorOffsetY = obj.height * 0.5;
			obj.x = AGame.R.app.stageWidth * 0.5;
			obj.y = AGame.R.app.stageHeight * 0.5;
			AGame.R.app.topLevel.addChild(obj);
			
			let flyFunc = () => {
				let tw = egret.Tween.get(obj);
				tw.to({ y: obj.y - 100, alpha : 0.3}, 1000,egret.Ease.sineIn);
				tw.call(()=>{Utils.removeFromParent(obj);});
			};
			flyFunc();
		}


	}
}