
module com_main {
	/**
	 * 剧情对话面板相关
	 */
    export class GuideIntroductionView extends CView {
        public static NAME = 'GuideIntroductionView';

        public m_pRoot:eui.Group;
        public m_pTextRoot:eui.Group;
        public m_pText0:eui.Group;
        public m_pText_s:com_main.CImage;
        public m_pEffect_0:com_main.CImage;
        public m_pTextMask0:com_main.CImage;
        public m_pText1:com_main.CImage;
        public m_pTextMask1:com_main.CImage;
        public m_pText2:com_main.CImage;
        public m_pTextMask2:com_main.CImage;
        public m_pText3:com_main.CImage;
        public m_pTextMask3:com_main.CImage;
        public m_pText4:com_main.CImage;
        public m_pTextMask4:com_main.CImage;
        public m_pText5:eui.Group;
        public m_pText_e:com_main.CImage;
        public m_pEffect_1:com_main.CImage;
        public m_pTextMask5:com_main.CImage;
        public m_pEffect_2:com_main.CImage;
        public m_pClick:eui.Group;
        public m_pSkipRoot:eui.Group;
        public m_bgImg: eui.Image;

        private intervalTime: number = 100;
        private isShowFinish: boolean = false;
        private finishCount: number = 0;

        private maskList:CImage[];
        private textIconList:any[];

        private m_pMc: MCDragonBones;
        private m_maskItem;

        private m_contentImgList: string[];
        private m_callback: Function = null;

        public constructor(contentImgList) {//{titleStrs}
            super();
            if(contentImgList){
                this.m_contentImgList = contentImgList.imgList;
                this.m_callback = contentImgList.callback;
            }
            
            this.name = GuideIntroductionView.NAME;
            this.skinName = Utils.getComSkin("guide/guide_introduction_view_skin.exml");
            // let tempData = data.stepData.param;
            // if (tempData && tempData != '') {
            //     this.viewData = JSON.parse(tempData);
            // }
            // this.callbackObj = data.obj;
            // this.callback = data.callback;
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
            super.onDestroy();
            if(this.m_contentImgList){
                window["ta"].track('novice_guide',  {step: 10005+"",'trigger_time': new Date()});
                SceneResGroupCfg.clearModelRes([ModuleEnums.GUIDE_INDRO]);
            }else{
                window["ta"].track('novice_guide',  {step: 10001+"",'trigger_time': new Date()});
            }
            Sound.stopAllEffect()
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            //切换图片
            if(this.m_contentImgList){
                // this.m_pText_s.source = this.m_contentImgList[0];
                // this.m_pText1.source = this.m_contentImgList[1];
                this.m_pText2.source = this.m_contentImgList[0];
                this.m_pText3.source = this.m_contentImgList[1];
                // this.m_pText4.source = this.m_contentImgList[4];
                // this.m_pText_e.source = this.m_contentImgList[5];       

                this.m_pText_s.visible = false;         
                this.m_pText1.visible = false;         
                this.m_pText4.visible = false;         
                this.m_pText_e.visible = false;

                this.curTextEffectIndex =  1;        
                this.m_bgImg.source = 'GuideIntroBg1_jpg';
            }

            this.isShowFinish = false;

             Tween.get(this.m_pEffect_0,{loop:true})
            .to({alpha:0},1000)            
            .to({alpha:1},1000);

             Tween.get(this.m_pEffect_1,{loop:true})
            .to({alpha:0},1000)            
            .to({alpha:1},1000);

            let tempMc = new MCDragonBones();
            tempMc.initAsync(IETypes.EUI_HX);
            this.m_pRoot.addChild(tempMc);
            tempMc.play(IETypes.EUI_HX);
            tempMc.x = this.m_pRoot.width*0.5;
            tempMc.y = this.m_pRoot.height*0.5;
            tempMc.touchChildren = false;
            tempMc.touchEnabled = false;
            this.m_pMc = tempMc;
            this.maskList = [];
            this.textIconList = [];
            for(let index= 0;index<6;index++){
                let key = "m_pText"+index;
                let maskKey = "m_pTextMask"+index;
                if(this[key]){
                    this[key].mask= this[maskKey];
                    this.textIconList.push(this[key]);
                    this.maskList.push(this[maskKey]);
                }
            }

            Utils.TimerManager.doTimer(1000,1,this.playTextEffect,this);
            EventManager.addTouchTapListener(this.m_pClick, this, this.onClickView);
            EventManager.addTouchTapListener(this.m_pSkipRoot, this, this.onclickSkip);

            Sound.stop(SoundData.getLoginSound());

            if(this.m_contentImgList){

            }else{
                Sound.playID(6000);
            }
        }
        private curTextEffectIndex = -1;
        private playTextEffect(){
            this.curTextEffectIndex++;
            this.showTextEffect();
        }

        private showTextEffect(){
            if( (!this.m_contentImgList && this.curTextEffectIndex < this.maskList.length) || (this.m_contentImgList && this.curTextEffectIndex < 4) ){
                let item = this.textIconList[this.curTextEffectIndex];
                let maskItem = this.maskList[this.curTextEffectIndex];
                Tween.removeTweens(maskItem);
                this.m_pEffect_2.x = item.x;
                this.m_pEffect_2.y = item.y;
                this.m_pEffect_2.visible = true;

                this.m_maskItem = maskItem;

                Tween.get(maskItem).to({height:item.height},1500).call(()=>{
                    this.playTextEffect();
                });

                let target = item.y+item.height;
                Tween.get(this.m_pEffect_2).to({y:target},1500).call(()=>{
                    this.m_pEffect_2.visible = false;
                })


            }else{
                this.isShowFinish= true;
            }
        }

        private doNextAction(){
            if(this.m_contentImgList){
                UpManager.close();
            }else{
                egret.Tween.removeTweens(this.m_pRoot);
                Tween.get(this.m_pRoot)
                .to({ alpha: 0 }, 200, egret.Ease.sineOut).call(() => {
                    BattleVideoUtil.load();
                }, this);
                this.m_pClick.visible = false;
            }

            if(this.m_callback){
                this.m_callback.call(this);
            }
            
        }

        private onClickView() {
            if(this.isShowFinish){
                this.doNextAction();
            }
        }

        private onclickSkip(){
            Utils.TimerManager.remove(this.playTextEffect,this);
            if(this.m_maskItem) Tween.removeTweens(this.m_maskItem);
            if(this.m_pEffect_2) Tween.removeTweens(this.m_pEffect_2);

            this.doNextAction();
        }

        private onStrItemShowFinish() {
            this.finishCount++;
        }

        private createTitleLabel(): egret.TextField {
            let group: eui.Group = new eui.Group();
            group.width = 80;
            let label: egret.TextField = new egret.TextField();
            label.fontFamily = "Microsoft YaHei";
            label.textColor = GameConfig.TextColors.white;
            label.verticalAlign = egret.VerticalAlign.MIDDLE;
            label.width = 50;
            label.size = 40;
            group.addChild(label);
            this.m_pTextRoot.addChildAt(group, 0);
            return label;
        }
    }
}