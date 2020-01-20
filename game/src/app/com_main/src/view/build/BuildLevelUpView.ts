module com_main {
	/**
	 * 建筑升级
	 */
    export class BuildLevelUpView extends CView {
        public static NAME = 'BuildLevelUpView';

        public m_pRoot: eui.Group;
        public m_pBg: com_main.CImage;
        public m_pLvUpRoot: eui.Group;
        public m_pEffectIcon: com_main.CImage;
        public m_pLbLv: com_main.CLabel;
        public m_pDesc: com_main.CLabel;
        public m_pDescValue: com_main.CLabel;
        public m_labBuildTitle: com_main.CLabel;
        public m_pBuildGroup: eui.Group;
        public m_imgTitle: com_main.CImage;
        public m_pRootMask: com_main.CImage;
        public m_pTipsRoot: eui.Group;
        public m_labTime: com_main.CLabel;
        public m_pMaskBtn: eui.Group;


        private m_pShowAni: egret.tween.TweenGroup;
        private m_pId: number;
        private m_curEndTime = 5;  //5秒关闭
        private m_lvUpType: number = 0;   //等级提升类型（1为君主，2为建筑）
        private arr = [];
        public constructor(data: any) {
            super();
            this.name = BuildLevelUpView.NAME;
            this.initApp("map/build/build_level_up_view_skin.exml");
            this.m_pId = data.id;
            this.m_lvUpType = data.type;
        }
        protected listenerProtoNotifications(): any[] {
            return [

            ];
        }
        public onDestroy(): void {
            Tween.removeTweens(this.m_pEffectIcon);
            // egret.clearTimeout(this.m_pTimeOutId);
            Utils.TimerManager.remove(this.timeCallback, this);
            this.m_pShowAni.removeEventListener("itemComplete", this.onBgAniFinish, this);
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_pRoot.mask = this.m_pRootMask;
            this.m_pShowAni.addEventListener("itemComplete", this.onBgAniFinish, this);
            Tween.removeTweens(this.m_pEffectIcon);
            Tween.get(this.m_pEffectIcon, { loop: true })
                .to({ alpha: 0 }, 600)
                .to({ alpha: 1 }, 600);
            this.initView();
            this.initTime();
        }


        private initTime() {
            Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
        }
        //时间回调
        private timeCallback() {

            this.m_curEndTime--;
            if (this.m_curEndTime <= 0) {
                this.onHide();
                return;
            }
            this.m_labTime.text = this.m_curEndTime.toString();
        }
        //入场动画后开始缓动
        private onBgAniFinish(event: egret.Event): void {
            const item = event.data as egret.tween.TweenItem;
            if (this.m_pTipsRoot == item.target) {
                this.m_pLbLv.text = this.m_lvUpType == LevelUpConditionType.BUILDING_LEVEL ? MainMapModel.getLevel(this.m_pId) + "" : this.m_pId + "";
            }
        }
        private initView() {
            this.m_pBuildGroup.visible = false;
            this.m_pLvUpRoot.visible = this.m_labBuildTitle.visible = false;
            let curLv: number = 0;
            let imgstr: string = "";
            if (this.m_lvUpType == LevelUpConditionType.ROLE_LEVEL) {  //君主升级
                curLv = this.m_pId;
                this.m_pLbLv.text = curLv + "";
                if (this.m_pId <= 12) {
                    this.m_pDescValue.text = 12 + "";
                } else {
                    this.m_pDescValue.text = this.m_pId + "";
                }
                this.m_pDesc.text = GCode(CLEnum.CITY_BD_LIMIT);
                imgstr = "lb_jzdjts_png";

                this.m_pLvUpRoot.visible = true;
            } else {
                this.arr = MainMapModel.canActivationBuildInfo();
                curLv = MainMapModel.getLevel(this.m_pId);
                imgstr = "lb_dddjts_png";
                if (this.arr && this.arr.length > 0) {
                    this.m_labBuildTitle.textFlow =Utils.htmlParser(GCodeFromat(CLEnum.CITY_BD_LIMIT1,curLv));
                    this.m_pBuildGroup.visible = this.m_labBuildTitle.visible = true;
                    this.creatBuildItem();
                } else {
                    this.m_pLbLv.text = (curLv - 1) + "";
                    this.m_pDescValue.text = curLv + "";
                    this.m_pDesc.text = GCode(CLEnum.CITY_BD_LIMIT2);
                    this.m_pLvUpRoot.visible = true;
                }
            }
            this.m_imgTitle.source = imgstr;
            EventManager.addTouchScaleListener(this.m_pMaskBtn, this, this.onHide);
            // this.m_pTimeOutId = egret.setTimeout(()=>{
            //      this.m_pLbLv.text = MainMapModel.getLevel(this.m_pId) +"";
            // },this,500)
            this.m_pShowAni.play(0);
        }
        private creatBuildItem() {
            let len = this.arr.length >= 3 ? 3 : this.arr.length;
            for (let i = 0; i < len; i++) {
                let info = this.arr[i];
                let builditem = new buildCanAtionItem();
                builditem.setInfo(info.type, info.name);
                this.m_pBuildGroup.addChild(builditem);
            }
        }
        private onHide() {
            UpManager.history();
        }
    }
}