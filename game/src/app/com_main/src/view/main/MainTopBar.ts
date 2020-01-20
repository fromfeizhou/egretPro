module com_main {
    export class MainTopBar extends CView {
        public static NAME = 'MainTopBar';

        public m_bgImg: com_main.CImage;
        public m_leftGroup: eui.Group;
        public m_pVipRoot: eui.Group;
        public m_labelVipNum: eui.BitmapLabel;
        public m_pPowerRoot: eui.Group;
        public m_labelFight: eui.BitmapLabel;
        public m_comHead: com_main.ComHeadItem;
        public m_comState: com_main.ComState;
        public m_expPro: com_main.CImage;
        public m_labLevel: eui.Label;
        public m_imgWorldIcon: eui.Image;
        public m_imgMilitoryIcon: eui.Image;
        public m_groupSource: eui.Group;


        private m_SceneId: SceneEnums = 1;                    //当前场景id
        private m_pWorldTips: WorldTipsView;
        private m_pMilitoryTips: MilitoryTipsView;
        private m_powerTip: RolePowerTipView;
        private m_expProWidth: number = 65;//进度条总宽度   

        public constructor() {
            super();
            this.name = MainTopBar.NAME;
            this.m_SceneId = SceneManager.getCurrScene();
            this.initApp("top_new/main_top_bar.exml");
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
            if (this.m_pWorldTips) {
                Utils.removeFromParent(this.m_pWorldTips);
            }
            if (this.m_pMilitoryTips) {
                Utils.removeFromParent(this.m_pMilitoryTips);
            }
            if (this.m_powerTip) {
                Utils.removeFromParent(this.m_powerTip);
            }
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            // this.cacheAsBitmap = true;
            // 适配
            // if (GameConfig.getWHRatio() < 1.6) {
            //     this.m_groupSource.left = 250;
            // }
            Utils.toStageBestScaleHeigt(this);

            if (GameConfig.getIsNotchScreen()) {
                this.m_leftGroup.x += GameConfig.notchPixel;
                this.m_bgImg.left += GameConfig.notchPixel;
                this.m_groupSource.x += GameConfig.notchPixel;
            }

            // this.width = AGame.R.app.stageWidth;
            this.x = 0;
            this.y = 0;

            let source = [PropEnum.YU, PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON];
            if (PlatConst.isRmbPay()) source = [PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON];
            for (let i = 0; i < source.length; i++) {
                let id = source[i];
                let item = new TopSourceItem(id);
                this.m_groupSource.addChild(item);
            }
            this.initInfo();
            this.initEvent();
            this.refreshSceneView();
            /**添加vip红点 */

            RedPointModel.AddInfoListener(this.m_pVipRoot, { x: 166, y: -3, scale: 0.78 }, [RedEvtType.VIP], 2);
            this.m_pVipRoot.visible = !platform.isHidePayFunc();
        }

        public static getClass(): MainTopBar {
            let obj = SceneManager.getClass(LayerEnums.MENU, MainTopBar.NAME);
            return obj;
        }

        private initInfo() {
            this.onRoleFight();//战斗力
            this.onRoleVipLevel();//vip等级
            this.onRoleCountry();//国家旗帜
            this.initRoleUpLevel();//玩家等级初始
            this.onRoleUpExp();//玩家经验
            // this.onbuildUpLevel(MBuildId.HALL_BUILD_ID);  //主城等级


            this.m_comHead.info = { type: RoleData.headType, url: RoleData.headId.toString() };
            this.onChangeScene();
        }

        private initEvent() {
            /*玩家事件*/
            EventMgr.addEvent(RoleEvent.ROLE_VIP_LEVLE, this.onRoleVipLevel, this);
            EventMgr.addEvent(RoleEvent.ROLE_COUNTRY, this.onRoleCountry, this);
            EventMgr.addEvent(RoleEvent.ROLE_FIGHT, this.onRoleFight, this);
            EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
            // EventMgr.addEvent(BuildEvent.BUILD_UP_LEVEL, this.onbuildUpLevel, this);
            EventMgr.addEvent(RoleEvent.ROLE_LEVLE, this.onRoleUpLevel, this);
            EventMgr.addEvent(RoleEvent.ROLE_EXP, this.onRoleUpExp, this);
            if (this.m_comHead) this.m_comHead.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onHeadClick, this);
            if (this.m_pVipRoot) this.m_pVipRoot.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickVip, this);
            if (this.stage) this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.clickOther, this);
            if (this.m_pPowerRoot) this.m_pPowerRoot.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.clickPowerRoot, this);
            if (this.m_imgWorldIcon) this.m_imgWorldIcon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onWorldLvHandler, this);
            if (this.m_imgMilitoryIcon) this.m_imgMilitoryIcon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onWorldMilitoryHandler, this);
            EventMgr.addEvent(RoleEvent.ROLE_HEADIMG, this.onRefreshImg, this);

            EventMgr.addEvent(SceneEvent.CHANGE_COMPLETE, this.onChangeScene, this);
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
            /*玩家事件*/
            EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_LEVLE, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_COUNTRY, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_FIGHT, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            // EventMgr.removeEventByObject(BuildEvent.BUILD_UP_LEVEL, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_LEVLE, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_EXP, this);
            this.m_comHead.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onHeadClick, this);
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.clickOther, this);
            this.m_pVipRoot.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickVip, this);
            EventMgr.removeEventByObject(SceneEvent.CHANGE_COMPLETE, this);
            this.m_pPowerRoot.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.clickPowerRoot, this);
            this.m_imgWorldIcon.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onWorldLvHandler, this);
            this.m_imgMilitoryIcon.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onWorldMilitoryHandler, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_HEADIMG, this);
        }

        // /**主城建筑升级 */
        // private onbuildUpLevel(buildId: number) {
        //     if (buildId == MBuildId.HALL_BUILD_ID) {
        //         this.m_labLevel.text = RoleData.level+'';
        //     }
        // }
        /**玩家等级升级刷新 */
        private onRoleUpLevel() {
            this.m_labLevel.text = RoleData.level + '';
        }
        /**玩家等级初始化 */
        private initRoleUpLevel() {
            this.m_labLevel.text = RoleData.level + '';
        }
        /**玩家经验升级 */
        private onRoleUpExp() {
            let numwidth: number = 0;
            let maxExp = RoleData.getPlayerLevelUpExp(RoleData.level);
            if (maxExp > 0) {
                numwidth = this.m_expProWidth * (RoleData.exp / maxExp);
            } else {
                numwidth = this.m_expProWidth;
            }
            this.m_expPro.width = numwidth;
        }

        /**头像刷新 */
        private onRefreshImg() {
            this.m_comHead.info = { type: RoleData.headType, url: RoleData.headId.toString() };
        }

        /**战斗力刷新 */
        private onRoleFight() {
            let fight = GeneralModel.getGeneralTotalFight();
            this.m_labelFight.text = fight.toString();
            //第一次初始化记录
            if (GeneralModel.FIGHT_RECORD == 0) GeneralModel.FIGHT_RECORD = fight;
        }

        /**vip等级刷新 */
        private onRoleVipLevel() {
            this.m_labelVipNum.text = RoleData.vipLevel + "";
            WelfareProxy.send_GET_SIGN_UP();//请求签到-VIP补领
        }
        /**战力提示 */
        private clickPowerRoot(e: egret.TouchEvent) {
            this.hideTips();
            if (this.m_powerTip) {
                this.m_powerTip.visible = true;
                this.m_powerTip.doAction(true);
            } else {
                this.m_powerTip = new RolePowerTipView();
                this.m_powerTip.y = 90;
                if (GameConfig.getIsNotchScreen()) {
                    this.m_powerTip.x += GameConfig.notchPixel;
                }
                this.m_powerTip.doAction(true);
                this.addChild(this.m_powerTip);
            }
            e.stopPropagation();
        }

        /**世界等级tips */
        private onWorldLvHandler(e: egret.TouchEvent) {
            this.hideTips();
            if (this.m_pWorldTips) {
                this.m_pWorldTips.visible = true;
                this.m_pWorldTips.doAction(true);
            } else {
                this.m_pWorldTips = new WorldTipsView();
                this.m_pWorldTips.y = 110;
                if (GameConfig.getIsNotchScreen()) {
                    this.m_pWorldTips.x += GameConfig.notchPixel + this.m_imgWorldIcon.x
                } else {
                    this.m_pWorldTips.x = this.m_imgWorldIcon.x
                }
                this.m_pWorldTips.doAction(true);
                this.addChild(this.m_pWorldTips);
            }
            e.stopPropagation();
        }


        /**军功tips */
        private onWorldMilitoryHandler(e: egret.TouchEvent) {
            this.hideTips();
            if (this.m_pMilitoryTips) {
                this.m_pMilitoryTips.visible = true;
                this.m_pMilitoryTips.doAction(true);
            } else {
                this.m_pMilitoryTips = new MilitoryTipsView();
                this.m_pMilitoryTips.y = 110;
                if (GameConfig.getIsNotchScreen()) {
                    this.m_pMilitoryTips.x += GameConfig.notchPixel + this.m_imgMilitoryIcon.x
                } else {
                    this.m_pMilitoryTips.x = this.m_imgMilitoryIcon.x
                }
                this.m_pMilitoryTips.doAction(true);
                this.addChild(this.m_pMilitoryTips);
            }
            this.m_pMilitoryTips.updateData();
            e.stopPropagation();
        }
        /**国家更变 */
        private onRoleCountry() {
            this.m_comState.stateId = RoleData.countryId;
        }

        /**资源刷新 */
        private onRoleResource(sourceId: PropEnum) {
            let item = this.getSourceItem(sourceId);
            if (item) {
                item.refreshNum();
            }
        }


        /**头像点击 */
        private onHeadClick(e: egret.TouchEvent) {
            Utils.open_view(TASK_UI.POP_ROLE_INFO_VIEW);
            e.stopPropagation();
        }

        private clickOther(e: egret.TouchEvent) {
            this.hideTips();
        }
        /**隐藏提示 */
        private hideTips() {
            if (this.m_powerTip && this.m_powerTip.visible) {
                this.m_powerTip.visible = false;
            }

            if (this.m_pWorldTips && this.m_pWorldTips.visible) {
                this.m_pWorldTips.visible = false;
            }

            if (this.m_pMilitoryTips && this.m_pMilitoryTips.visible) {
                this.m_pMilitoryTips.visible = false;
            }
        }

        private clickVip(e: egret.TouchEvent) {
            Utils.open_view(TASK_UI.VIP_MAIN_PANEL);
        }
        private getSourceItem(id: PropEnum) {
            for (let i = 0; i < this.m_groupSource.numChildren; i++) {
                let item = this.m_groupSource.getChildAt(i) as TopSourceItem;
                if (item && item.itemId == id) {
                    return item;
                }
            }
            return null;
        }


        /**场景改变后触发 */
        public onChangeScene() {
            /**tips置空 */
            // this.m_pRoleInfoView = null;
            this.m_imgWorldIcon.visible = SceneManager.isWorldScene();
            this.m_imgMilitoryIcon.visible = SceneManager.isWorldScene();
            if (this.m_pMilitoryTips) this.m_pMilitoryTips.visible =false;
            if (this.m_pWorldTips) this.m_pWorldTips.visible =false;
            //避免碎片图片回收 引起头像空白
            this.m_comHead.refreshIconView();
            this.refreshSceneView();
        }

        /**场景状态改变 */
        private refreshSceneView() {
            this.visible = SceneManager.getCurrScene() !== SceneEnums.WORLD_XIANGYANG_CITY;
        }



        /**=====================================================================================
		 * 静态对象 begin
		 * =====================================================================================
		 */

        /**
         * 获取头像全局位置
         */
        public static getRoleImgGlobalPos() {
            let obj = this.getClass();
            if (obj) {
                let imgPos = new egret.Point();
                obj.localToGlobal(obj.m_comHead.x, obj.m_comHead.y, imgPos);
                return imgPos;
            }
        }

        /**获得资源图标 */
        public static getIconProObj(id: PropEnum) {
            let obj = this.getClass();
            if (obj) {
                let item = obj.getSourceItem(id);
                if (item) {
                    return item.sourceIcon;
                }
            }
        }

        //图标动画
        public static showIconAction(id: PropEnum) {
            let obj = this.getClass();
            if (obj) {
                let item = obj.getSourceItem(id);
                if (item) {
                    return item.showIconAction();
                }
            }

        }
        /**=====================================================================================
		 * 静态对象 end
		 * =====================================================================================
		 */

    }
}