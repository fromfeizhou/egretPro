module com_main {
	export class BattleSkillName1 extends egret.DisplayObjectContainer {

        
        private m_csquare: CSquare; // 发动技能单位
        private m_oldPosition: egret.Point;
        private m_avo: SkillAtkVo;

        private m_maskLight:LightMask = new LightMask();

        public constructor(csquare: CSquare,avo?: SkillAtkVo) {
			super();
			// this.skinName = Utils.getAppSkin("battle_new/skill/battle_skill_start_name_1.exml");
			this.m_csquare = csquare;

            this.m_oldPosition = new egret.Point(this.m_csquare.x,this.m_csquare.y);
            csquare.mapPos = this.m_oldPosition;
            this.m_avo = avo;

            // csquare.findEnd();
            BattleModel.setIsStopPlay(true);
            this.showEffect();
		}

        protected showEffect(): void {
            let width = egret.MainContext.instance.stage.stageWidth;
            let height = egret.MainContext.instance.stage.stageHeight;
			this.width = width;
			this.height = height;

            let globalPoint: egret.Point = this.m_csquare.parent.localToGlobal(this.m_csquare.x, this.m_csquare.y);
            this.addChild(this.m_csquare);

            this.m_csquare.removeTween();
            
            this.m_csquare.setXY(globalPoint.x,globalPoint.y);
            this.m_csquare.startSkillEffect(this.m_avo.getSkillConfig().skillEffectId,false);

            // let container: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            // let bg: egret.Bitmap = new egret.Bitmap(RES.getRes("border_006_png"));
            // bg.alpha = 0.6;
            // let stage = egret.MainContext.instance.stage;
            // NodeUtils.setSize(bg, { width: stage.stageWidth, height: stage.stageHeight });
            // //挖空的大小图片
            // let texture = RES.getRes("Battle_skill_light_png");
            // let sp = new egret.Bitmap(texture);
            // NodeUtils.setSize(sp, { width: 739, height: 739 });
            // NodeUtils.setPosition(sp, 0, 0);
            // sp.anchorOffsetX = sp.anchorOffsetY = 370;
            // sp.x = globalPoint.x;
            // sp.y = globalPoint.y - 50;
            // sp.scaleX = sp.scaleY = 0.8;

            // container.addChild(bg);
            // container.addChild(sp);
            // sp.blendMode = egret.BlendMode.ERASE;

            // let renderTexture: egret.RenderTexture = new egret.RenderTexture();
            // renderTexture.drawToTexture(container);

            // let bitmap: egret.Bitmap = new egret.Bitmap(renderTexture);
            // this.addChildAt(bitmap,0);

            this.m_maskLight.setMaskSize(width, height);
            this.m_maskLight.setLightValue(200);
            this.addChild(this.m_maskLight);
            this.m_maskLight.x = 0;
            this.m_maskLight.y = 0;
            this.m_maskLight.setLightPos(globalPoint.x, globalPoint.y - 50);

            let time = ConstUtil.getValue(IConstEnum.BATTLE_SKILL_BLACK_TIME);
            egret.Tween.get(this.m_maskLight).wait(time-300).to({alpha:0},300).call(()=>{
                if(this.m_csquare.mapPos){
                    BattleSceneMgr.getInstance().addChildToWorld(this.m_csquare);
                    this.m_csquare.x = this.m_csquare.mapPos.x;
                    this.m_csquare.y = this.m_csquare.mapPos.y;
                    this.m_csquare.mapPos = null;
                }
                Utils.removeFromParent(this);
                BattleModel.setIsStopPlay(false);
            })

            let skillNameFrame = new SmallActiveSkillName(this.m_avo,this.m_csquare);
            skillNameFrame.y = 20 + this.m_csquare.y - this.m_csquare.anchorOffsetY  - 35;
            skillNameFrame.x = 50 + this.m_csquare.x - this.m_csquare.anchorOffsetX;
            this.addChild(skillNameFrame);
        }
    }
}