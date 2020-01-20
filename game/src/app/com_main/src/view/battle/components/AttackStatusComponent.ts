/**
 * 攻击状态
 */

module com_main {
	export class AttackStatusComponent extends eui.Component{
        public num:egret.BitmapText;
        public m_image: eui.Image;

        public light = 0;
		public constructor(attackStatus:AttackResult, hp?: number,belong?: BelongType) {
			super();
            this.width = 237;
            this.height = 92;
            if(attackStatus == AttackResult.CRIT){
                if(belong == BelongType.OWN){
                    this.createFont("baojiNum_fnt","暴击" + hp);
                }else{
                    this.createFont("baojiNumWhite_fnt","暴击" + hp);
                }
            }else if(attackStatus == AttackResult.RESTRAIN){
                if(belong == BelongType.OWN){
                    this.createFont("kezhiNum_fnt","克制" + hp);
                }else{
                    this.createFont("kezhiNum_grey_fnt","克制" + hp);
                }
            }
            else{
                this.createImage(AttackResultImage[attackStatus]);
            }
		}

        public createImage(src: string){
            this.m_image =  new eui.Image();
            this.m_image.source = RES.getRes(src);
            this.m_image.x = 118;
            this.m_image.y = 46;
            AnchorUtil.setAnchor(this.m_image, 0.5);
            this.addChild(this.m_image);
        }

        public createFont(fontSrc: string, word: string){
            // this.num = new egret.BitmapText();
            this.num = ObjectPool.pop(egret.BitmapText,"egret.BitmapText");
            this.num.font = RES.getRes(fontSrc);
            this.num.text = word;
            this.num.x = 118;
            this.num.y = 46;
            this.num.letterSpacing = 0;
            AnchorUtil.setAnchor(this.num, 0.5);
            this.addChild(this.num);
        }

        public set lightNum(num: number){
            this.light = num;
            var colorMatrix = [
                1,0,0,0,num,
                0,1,0,0,num,
                0,0,1,0,num,
                0,0,0,1,0
            ];

            var fliter = new egret.ColorMatrixFilter(colorMatrix);
            this.filters = [fliter];
        }

        public get lightNum(){
            return this.light;
        }

        public onDestroy(){
            this.visible = false;
            this.filters = [];
            this.light = 0;
            
            if(this.num){
                Utils.removeFromParent(this.num);
                this.num.text = '';
                AnchorUtil.setAnchor(this.num, 0);
                ObjectPool.push(this.num);
                this.num = null;
            }

            if(this.m_image){
                Utils.removeFromParent(this.m_image);
                this.m_image = null;
            }
        }

	}
}