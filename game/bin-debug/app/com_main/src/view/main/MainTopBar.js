var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    var MainTopBar = /** @class */ (function (_super_1) {
        __extends(MainTopBar, _super_1);
        function MainTopBar() {
            var _this = _super_1.call(this) || this;
            _this.m_SceneId = 1; //当前场景id
            _this.m_expProWidth = 65; //进度条总宽度   
            _this.name = MainTopBar.NAME;
            _this.m_SceneId = SceneManager.getCurrScene();
            _this.initApp("top_new/main_top_bar.exml");
            return _this;
        }
        MainTopBar.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
            if (this.m_pWorldTips) {
                Utils.removeFromParent(this.m_pWorldTips);
            }
            if (this.m_pMilitoryTips) {
                Utils.removeFromParent(this.m_pMilitoryTips);
            }
            if (this.m_powerTip) {
                Utils.removeFromParent(this.m_powerTip);
            }
        };
        MainTopBar.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
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
            var source = [PropEnum.YU, PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON];
            if (PlatConst.isRmbPay())
                source = [PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON];
            for (var i = 0; i < source.length; i++) {
                var id = source[i];
                var item = new com_main.TopSourceItem(id);
                this.m_groupSource.addChild(item);
            }
            this.initInfo();
            this.initEvent();
            this.refreshSceneView();
            /**添加vip红点 */
            RedPointModel.AddInfoListener(this.m_pVipRoot, { x: 166, y: -3, scale: 0.78 }, [RedEvtType.VIP], 2);
            this.m_pVipRoot.visible = !platform.isHidePayFunc();
        };
        MainTopBar.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.MENU, MainTopBar.NAME);
            return obj;
        };
        MainTopBar.prototype.initInfo = function () {
            this.onRoleFight(); //战斗力
            this.onRoleVipLevel(); //vip等级
            this.onRoleCountry(); //国家旗帜
            this.initRoleUpLevel(); //玩家等级初始
            this.onRoleUpExp(); //玩家经验
            // this.onbuildUpLevel(MBuildId.HALL_BUILD_ID);  //主城等级
            this.m_comHead.info = { type: RoleData.headType, url: RoleData.headId.toString() };
            this.onChangeScene();
        };
        MainTopBar.prototype.initEvent = function () {
            /*玩家事件*/
            com_main.EventMgr.addEvent(RoleEvent.ROLE_VIP_LEVLE, this.onRoleVipLevel, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_COUNTRY, this.onRoleCountry, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_FIGHT, this.onRoleFight, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
            // EventMgr.addEvent(BuildEvent.BUILD_UP_LEVEL, this.onbuildUpLevel, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_LEVLE, this.onRoleUpLevel, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_EXP, this.onRoleUpExp, this);
            if (this.m_comHead)
                this.m_comHead.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onHeadClick, this);
            if (this.m_pVipRoot)
                this.m_pVipRoot.addEventListener(egret.TouchEvent.TOUCH_TAP, this.clickVip, this);
            if (this.stage)
                this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.clickOther, this);
            if (this.m_pPowerRoot)
                this.m_pPowerRoot.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.clickPowerRoot, this);
            if (this.m_imgWorldIcon)
                this.m_imgWorldIcon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onWorldLvHandler, this);
            if (this.m_imgMilitoryIcon)
                this.m_imgMilitoryIcon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onWorldMilitoryHandler, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_HEADIMG, this.onRefreshImg, this);
            com_main.EventMgr.addEvent(SceneEvent.CHANGE_COMPLETE, this.onChangeScene, this);
        };
        MainTopBar.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            /*玩家事件*/
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_LEVLE, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_COUNTRY, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_FIGHT, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            // EventMgr.removeEventByObject(BuildEvent.BUILD_UP_LEVEL, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_LEVLE, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_EXP, this);
            this.m_comHead.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onHeadClick, this);
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.clickOther, this);
            this.m_pVipRoot.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.clickVip, this);
            com_main.EventMgr.removeEventByObject(SceneEvent.CHANGE_COMPLETE, this);
            this.m_pPowerRoot.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.clickPowerRoot, this);
            this.m_imgWorldIcon.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onWorldLvHandler, this);
            this.m_imgMilitoryIcon.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onWorldMilitoryHandler, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_HEADIMG, this);
        };
        // /**主城建筑升级 */
        // private onbuildUpLevel(buildId: number) {
        //     if (buildId == MBuildId.HALL_BUILD_ID) {
        //         this.m_labLevel.text = RoleData.level+'';
        //     }
        // }
        /**玩家等级升级刷新 */
        MainTopBar.prototype.onRoleUpLevel = function () {
            this.m_labLevel.text = RoleData.level + '';
        };
        /**玩家等级初始化 */
        MainTopBar.prototype.initRoleUpLevel = function () {
            this.m_labLevel.text = RoleData.level + '';
        };
        /**玩家经验升级 */
        MainTopBar.prototype.onRoleUpExp = function () {
            var numwidth = 0;
            var maxExp = RoleData.getPlayerLevelUpExp(RoleData.level);
            if (maxExp > 0) {
                numwidth = this.m_expProWidth * (RoleData.exp / maxExp);
            }
            else {
                numwidth = this.m_expProWidth;
            }
            this.m_expPro.width = numwidth;
        };
        /**头像刷新 */
        MainTopBar.prototype.onRefreshImg = function () {
            this.m_comHead.info = { type: RoleData.headType, url: RoleData.headId.toString() };
        };
        /**战斗力刷新 */
        MainTopBar.prototype.onRoleFight = function () {
            var fight = GeneralModel.getGeneralTotalFight();
            this.m_labelFight.text = fight.toString();
            //第一次初始化记录
            if (GeneralModel.FIGHT_RECORD == 0)
                GeneralModel.FIGHT_RECORD = fight;
        };
        /**vip等级刷新 */
        MainTopBar.prototype.onRoleVipLevel = function () {
            this.m_labelVipNum.text = RoleData.vipLevel + "";
            WelfareProxy.send_GET_SIGN_UP(); //请求签到-VIP补领
        };
        /**战力提示 */
        MainTopBar.prototype.clickPowerRoot = function (e) {
            this.hideTips();
            if (this.m_powerTip) {
                this.m_powerTip.visible = true;
                this.m_powerTip.doAction(true);
            }
            else {
                this.m_powerTip = new com_main.RolePowerTipView();
                this.m_powerTip.y = 90;
                if (GameConfig.getIsNotchScreen()) {
                    this.m_powerTip.x += GameConfig.notchPixel;
                }
                this.m_powerTip.doAction(true);
                this.addChild(this.m_powerTip);
            }
            e.stopPropagation();
        };
        /**世界等级tips */
        MainTopBar.prototype.onWorldLvHandler = function (e) {
            this.hideTips();
            if (this.m_pWorldTips) {
                this.m_pWorldTips.visible = true;
                this.m_pWorldTips.doAction(true);
            }
            else {
                this.m_pWorldTips = new com_main.WorldTipsView();
                this.m_pWorldTips.y = 110;
                if (GameConfig.getIsNotchScreen()) {
                    this.m_pWorldTips.x += GameConfig.notchPixel + this.m_imgWorldIcon.x;
                }
                else {
                    this.m_pWorldTips.x = this.m_imgWorldIcon.x;
                }
                this.m_pWorldTips.doAction(true);
                this.addChild(this.m_pWorldTips);
            }
            e.stopPropagation();
        };
        /**军功tips */
        MainTopBar.prototype.onWorldMilitoryHandler = function (e) {
            this.hideTips();
            if (this.m_pMilitoryTips) {
                this.m_pMilitoryTips.visible = true;
                this.m_pMilitoryTips.doAction(true);
            }
            else {
                this.m_pMilitoryTips = new com_main.MilitoryTipsView();
                this.m_pMilitoryTips.y = 110;
                if (GameConfig.getIsNotchScreen()) {
                    this.m_pMilitoryTips.x += GameConfig.notchPixel + this.m_imgMilitoryIcon.x;
                }
                else {
                    this.m_pMilitoryTips.x = this.m_imgMilitoryIcon.x;
                }
                this.m_pMilitoryTips.doAction(true);
                this.addChild(this.m_pMilitoryTips);
            }
            this.m_pMilitoryTips.updateData();
            e.stopPropagation();
        };
        /**国家更变 */
        MainTopBar.prototype.onRoleCountry = function () {
            this.m_comState.stateId = RoleData.countryId;
        };
        /**资源刷新 */
        MainTopBar.prototype.onRoleResource = function (sourceId) {
            var item = this.getSourceItem(sourceId);
            if (item) {
                item.refreshNum();
            }
        };
        /**头像点击 */
        MainTopBar.prototype.onHeadClick = function (e) {
            Utils.open_view(TASK_UI.POP_ROLE_INFO_VIEW);
            e.stopPropagation();
        };
        MainTopBar.prototype.clickOther = function (e) {
            this.hideTips();
        };
        /**隐藏提示 */
        MainTopBar.prototype.hideTips = function () {
            if (this.m_powerTip && this.m_powerTip.visible) {
                this.m_powerTip.visible = false;
            }
            if (this.m_pWorldTips && this.m_pWorldTips.visible) {
                this.m_pWorldTips.visible = false;
            }
            if (this.m_pMilitoryTips && this.m_pMilitoryTips.visible) {
                this.m_pMilitoryTips.visible = false;
            }
        };
        MainTopBar.prototype.clickVip = function (e) {
            Utils.open_view(TASK_UI.VIP_MAIN_PANEL);
        };
        MainTopBar.prototype.getSourceItem = function (id) {
            for (var i = 0; i < this.m_groupSource.numChildren; i++) {
                var item = this.m_groupSource.getChildAt(i);
                if (item && item.itemId == id) {
                    return item;
                }
            }
            return null;
        };
        /**场景改变后触发 */
        MainTopBar.prototype.onChangeScene = function () {
            /**tips置空 */
            // this.m_pRoleInfoView = null;
            this.m_imgWorldIcon.visible = SceneManager.isWorldScene();
            this.m_imgMilitoryIcon.visible = SceneManager.isWorldScene();
            if (this.m_pMilitoryTips)
                this.m_pMilitoryTips.visible = false;
            if (this.m_pWorldTips)
                this.m_pWorldTips.visible = false;
            //避免碎片图片回收 引起头像空白
            this.m_comHead.refreshIconView();
            this.refreshSceneView();
        };
        /**场景状态改变 */
        MainTopBar.prototype.refreshSceneView = function () {
            this.visible = SceneManager.getCurrScene() !== SceneEnums.WORLD_XIANGYANG_CITY;
        };
        /**=====================================================================================
         * 静态对象 begin
         * =====================================================================================
         */
        /**
         * 获取头像全局位置
         */
        MainTopBar.getRoleImgGlobalPos = function () {
            var obj = this.getClass();
            if (obj) {
                var imgPos = new egret.Point();
                obj.localToGlobal(obj.m_comHead.x, obj.m_comHead.y, imgPos);
                return imgPos;
            }
        };
        /**获得资源图标 */
        MainTopBar.getIconProObj = function (id) {
            var obj = this.getClass();
            if (obj) {
                var item = obj.getSourceItem(id);
                if (item) {
                    return item.sourceIcon;
                }
            }
        };
        //图标动画
        MainTopBar.showIconAction = function (id) {
            var obj = this.getClass();
            if (obj) {
                var item = obj.getSourceItem(id);
                if (item) {
                    return item.showIconAction();
                }
            }
        };
        MainTopBar.NAME = 'MainTopBar';
        return MainTopBar;
    }(com_main.CView));
    com_main.MainTopBar = MainTopBar;
})(com_main || (com_main = {}));
