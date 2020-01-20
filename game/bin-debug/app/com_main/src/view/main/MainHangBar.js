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
    var MainHangBar = /** @class */ (function (_super_1) {
        __extends(MainHangBar, _super_1);
        function MainHangBar() {
            var _this = _super_1.call(this) || this;
            _this.isOneFlyEnd = false;
            _this.flyItemArr = [];
            _this.m_curIndex = 0;
            _this.name = MainHangBar.NAME;
            _this.initApp("top_new/MainHangBarSkin.exml");
            return _this;
        }
        MainHangBar.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_FUNCTION_PREVIEW,
            ];
        };
        MainHangBar.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_FUNCTION_PREVIEW: {
                    this.updateFuncPreView();
                    break;
                }
            }
        };
        MainHangBar.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
            this.clearBtnBossEffect();
            this.clearBossAttackEffc();
            PatrolModel.stopTick();
        };
        MainHangBar.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.width = AGame.R.app.stageWidth;
            // this.height = AGame.R.app.stageHeight;
            Utils.toStageBestScaleHeigt(this);
            this.touchEnabled = false;
            this.m_tFlyItems = [];
            this.m_btnSpeed.setTitleLabel(GCode(CLEnum.SPEED_AD));
            this.m_btnSpeed.visible = !platform.isHidePayFunc();
            //boss
            // RedPointModel.AddInfoListener(this.m_pBossBtn, { x: 57, y: 0, scale: 0.78 }, [RedEvtType.BOSS_SINGLE, RedEvtType.BOSS_RANK, RedEvtType.BOSS_WORLD], 2);
            //更新功能预览显示
            this.updateFuncPreView();
            //装备已满提示
            if (EquipModel.equipDic.count >= 450) {
                EquipModel.isEquipfull(1);
            }
            else if (PropModel.getPropItemListByType(PropMainType.EQUIP_SOUL).length >= 450) {
                EquipModel.isEquipfull(2);
            }
            //挂机动画
            this.m_hangAct.play(0);
            this.refreshHangAwardTips();
            this.initEvent();
            this.onNewFunctionOpen(FunctionType.BOSS);
            /**检查新手引导面板条件 */
            this.onGuideCondition();
            if (GameConfig.getIsNotchScreen()) {
                this.m_leftGroup.left += GameConfig.notchPixel;
            }
            PatrolModel.startTick();
        };
        /**
         * 动画组播放完成
         */
        MainHangBar.prototype.onTweenComplete = function () {
            this.m_hangAct.play(0);
        };
        /**刷新挂机奖励显示 */
        MainHangBar.prototype.refreshHangAwardTips = function () {
            var _a = PatrolModel.calculateRewardSpeed(), silverSpeed = _a[0], expSpeed = _a[1];
            this.m_labCopper.text = '+' + GCodeFromat(CLEnum.HOUR1, silverSpeed);
            this.m_labExp.text = '+' + GCodeFromat(CLEnum.HOUR1, expSpeed);
        };
        /**更新功能预览显示 */
        MainHangBar.prototype.updateFuncPreView = function () {
            this.clearFuncLabEffect();
            var preFuncList = FunctionModel.getPreFuncList();
            var index = FunctionModel.getPreViewIndex();
            if (!preFuncList || preFuncList.length == 0 || index == -1) {
                //已经没有预览了
                this.m_pNewFunc.visible = false;
                this.m_pOpenLev.visible = false;
                this.m_pNewFuncImg.visible = false;
                return;
            }
            this.m_pNewFunc.visible = false;
            var cfg = preFuncList[index];
            var state = FunctionModel.isFunctionOpen(cfg.id) ? 1 : 0;
            this.m_tCfgFunc = cfg;
            this.m_State = state;
            this.m_pIco.source = FunctionModel.getBtnSource(cfg.id);
            this.m_pOpenLev.text = GCodeFromat(CLEnum.FUNC_OPEN_LIMIT, this.m_tCfgFunc.openLevel);
            this.m_pOpenLev.visible = this.m_State == 0;
            this.m_pNewFuncImg.visible = this.m_State == 1;
            if (this.m_State == 1) {
                this.createFuncLabEffect();
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        MainHangBar.prototype.initEvent = function () {
            //boss
            com_main.EventManager.addTouchScaleListener(this.m_pBossBtn, this, function () {
                FunctionModel.openFunctionByType(FunctionType.BOSS);
            });
            this.m_pTest.visible = DEBUG;
            //测试工具界面
            com_main.EventManager.addTouchScaleListener(this.m_pTest, this, function () {
                Utils.open_view(TestNav.TEST_SETTING);
                // SceneManager.enterScene(SceneEnums.CROSS_WALL_WAR_MAP);
                // Utils.open_view(TASK_UI.CROSS_RESULT_VIEW, {isWin: true,duanWei:1,bestList:['1','2','3']});
            });
            // 变强
            com_main.EventManager.addTouchScaleListener(this.m_pNewFunc, this, function () {
                // Utils.open_view(TASK_UI.GET_REWARD_VIEW, Utils.parseCommonItemJson('1_100,2_2000,3_1000,4_300,5_100,6_100,7_100,8_100,9_100'));
                Utils.open_view(TASK_UI.POP_FUNCITON_PREVIEW_VIEW);
            });
            //挂机加速
            com_main.EventManager.addTouchScaleListener(this.m_btnSpeed, this, function () {
                Utils.open_view(TASK_UI.POS_PATROL_SPEED_UP_REWARD_VIEW);
                // ScenePopQueWnd.addNewFuctionAnim([3, 4, 601, 701, 801, 1101, 1301, 1401, 1801, 1901, 2001, 2202, 2203, 2401, 2501, 2502, 2503, 2504, 2601]);
            });
            this.m_pVipService.visible = (PlatConst.isPlatJZ() && RoleData.vipIntegral >= 10000);
            // this.m_pVipService.visible = (RoleData.vipIntegral >= 10000);
            //VIP客服
            com_main.EventManager.addTouchScaleListener(this.m_pVipService, this, function () {
                Utils.open_view(TASK_UI.SERVICE_VIP);
            });
            // EventMgr.addEvent(PatrolEvent.PATROL_INFO_UPDATE, this.onPatrolInfo, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_VIP_LEVLE, this.onPatrolInfo, this);
            com_main.EventMgr.addEvent(PatrolEvent.PATRAL_BOSS_ATTACK_EFF, this.createBossAttackEffect, this);
            com_main.EventMgr.addEvent(TASK_EVT.POP_NEW_FUNCTION_OPEN, this.onNewFunctionOpen, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_VIP_EXP, this.refreshVipExp, this);
            this.m_hangAct.addEventListener("complete", this.onTweenComplete, this);
            com_main.EventMgr.addEvent(PatrolEvent.PATROL_KILL_MONSTER, this.onPatrolKillMonster, this);
        };
        MainHangBar.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_INFO_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TASK_EVT.POP_NEW_FUNCTION_OPEN, this);
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATRAL_BOSS_ATTACK_EFF, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_LEVLE, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_VIP_EXP, this);
            //皮肤动画移除
            if (this.m_pHangAct) {
                egret.Tween.removeTweens(this.m_pHangAct);
                this.m_hangAct.removeEventListener("complete", this.onTweenComplete, this);
            }
            com_main.EventMgr.removeEventByObject(PatrolEvent.PATROL_KILL_MONSTER, this);
            if (this.m_tFlyItems) {
                for (var i = 0; i < this.m_tFlyItems.length; i++) {
                    egret.Tween.removeTweens(this.m_tFlyItems[i]);
                }
                this.m_tFlyItems = null;
            }
        };
        /**vip客服图标刷新 */
        MainHangBar.prototype.refreshVipExp = function () {
            this.m_pVipService.visible = PlatConst.isPlatJZ() && RoleData.vipIntegral >= 10000;
        };
        MainHangBar.prototype.onPatrolKillMonster = function (starPos) {
            this.globalToLocal(starPos.x, starPos.y, starPos);
            var endPos = egret.Point.create(this.m_boxView.x + 60 + this.m_boxView.parent.x, this.m_boxView.y + this.m_boxView.parent.y);
            this.isOneFlyEnd = true;
            this.flyItemArr = [];
            this.m_curIndex = 0;
            var _loop_1 = function (i) {
                var item = PImage.create(MainHangBar.textrueList[i]);
                item.x = starPos.x + Utils.random(-50, 50);
                item.y = starPos.y + Utils.random(-50, 50);
                // NodeUtils.setScale(item, 0.8);
                this_1.addChild(item);
                // let ctrlPos = new Point((item.x + endPos.x) * 0.5, item.y - Utils.random(150, 250));
                var ctrlPos = egret.Point.create(item.x - 60, item.y + (60 * (i % 2 == 1 ? -1 : 1)));
                var tmpPos = egret.Point.create(item.x, item.y);
                var itemObj = { item: item, lerp: 0, index: i };
                this_1.m_tFlyItems.push(itemObj);
                this_1.flyItemArr.push(item);
                funcChange = function () {
                    var curPos = Utils.BezierCurve(tmpPos, endPos, ctrlPos, itemObj.lerp);
                    itemObj.item.x = curPos.x;
                    itemObj.item.y = curPos.y;
                    egret.Point.release(curPos);
                };
                item.visible = false;
                var tw = egret.Tween.get(itemObj, { onChange: funcChange }, Ease.cubicOut);
                tw.wait(i * 50);
                tw.call(function () { item.visible = true; }, this_1);
                tw.to({ lerp: 1 }, 700);
                //对象回收
                tw.call(function () {
                    egret.Point.release(ctrlPos);
                    egret.Point.release(tmpPos);
                }, this_1);
                tw.call(this_1.flyEnd, this_1, [itemObj]);
            };
            var this_1 = this, funcChange;
            for (var i = 0; i < MainHangBar.textrueList.length; i++) {
                _loop_1(i);
            }
        };
        /**道具飞行回调 */
        MainHangBar.prototype.flyEnd = function (itemObj) {
            this.m_curIndex++;
            if (PatrolModel.isInitFlyEnd) {
                PatrolModel.isInitFlyEnd = false;
                // com_main.EventMgr.dispatchEvent(PatrolEvent.PATROL_FLY_END, null);
            }
            if (this.m_curIndex == 3) {
                this.m_boxView.playBoxGetAwardEffect();
                this.hideFlyItem();
                Sound.playID(135);
            }
            itemObj.item.onDestroy();
            for (var i = 0; i < this.m_tFlyItems.length; i++) {
                if (this.m_tFlyItems[i].index == itemObj.index) {
                    this.m_tFlyItems.splice(i, 1);
                    return;
                }
            }
        };
        MainHangBar.prototype.hideFlyItem = function () {
            for (var index = 0; index < this.flyItemArr.length; index++) {
                if (this.flyItemArr[index]) {
                    this.flyItemArr[index].visible = false;
                }
            }
        };
        /**信息刷新 */
        MainHangBar.prototype.onPatrolInfo = function () {
            this.refreshHangAwardTips();
        };
        /**
         * 新功能开启(按钮加入列表 通过FunctionManager 调用onFunctionPanelClose加入)
         * 预告按钮清理
         * */
        MainHangBar.prototype.onNewFunctionOpen = function (ft) {
            if (ft == FunctionType.BOSS) {
                var redState = BossModel.GetSingeBtnState() || BossModel.GetRankBtnState() || BossModel.GetWorldBtnState();
                if (redState) {
                    this.createBtnBossEffect();
                }
                else {
                    this.clearBtnBossEffect();
                }
                this.m_pBossBtn.visible = FunctionModel.isFunctionOpen(FunctionType.BOSS);
            }
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        //=============================================================================================================================================
        //特效 begin
        //============================================================================================================================================= 
        /**设置boss按钮特效 */
        MainHangBar.prototype.createBtnBossEffect = function () {
            if (this.m_btnBossEff)
                return;
            this.m_btnBossEff = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_btnBossEff.x = 45;
            this.m_btnBossEff.y = 45;
            this.m_btnBossEff.scaleY = 0.9;
            this.m_pBossBtn.addChild(this.m_btnBossEff);
        };
        /**boss来袭特效 */
        MainHangBar.prototype.createBossAttackEffect = function () {
            var _this = this;
            this.m_imgMask.visible = true;
            this.m_bossAttack = new MCDragonBones();
            this.m_bossAttack.initAsync(IETypes.EUI_BOSS_Attact);
            this.m_bossAttack.playOnceDone(IETypes.EUI_BOSS_Attact, function () {
                if (_this.m_imgMask) {
                    _this.m_imgMask.visible = false;
                    _this.m_bossAttack.destroy();
                }
            }, this);
            this.m_bossAttack.x = 667;
            this.m_bossAttack.y = 400;
            this.m_bossAttack.scaleX = 1 / 0.64;
            this.m_bossAttack.scaleY = 1 / 0.64;
            this.addChild(this.m_bossAttack);
        };
        /**设置文字特效 */
        MainHangBar.prototype.createFuncLabEffect = function () {
            egret.Tween.get(this.m_pNewFuncImg, { loop: true }).to({ alpha: 0 }, 1000).to({ alpha: 1 }, 1000);
        };
        /**清除文字特效 */
        MainHangBar.prototype.clearFuncLabEffect = function () {
            egret.Tween.removeTweens(this.m_pNewFuncImg);
        };
        MainHangBar.prototype.clearBtnBossEffect = function () {
            if (this.m_btnBossEff) {
                NormalMcMgr.removeMc(this.m_btnBossEff);
                this.m_btnBossEff = null;
            }
        };
        MainHangBar.prototype.clearBossAttackEffc = function () {
            if (this.m_bossAttack) {
                this.m_bossAttack.destroy();
                this.m_bossAttack = null;
            }
        };
        //=============================================================================================================================================
        //特效 end
        //============================================================================================================================================= 
        /**检查新手引导面板条件 */
        MainHangBar.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.MENU_HANG);
        };
        MainHangBar.NAME = 'MainHangBar';
        MainHangBar.PRO_HEIGHT_MAX = 86;
        /**杀怪回调 */
        MainHangBar.textrueList = ["baoshi_png", "exp_png", "exp_png", "exp_png", "exp_png", "exp_png", "juanzhou_png", "juanzhou_png"];
        return MainHangBar;
    }(com_main.CView));
    com_main.MainHangBar = MainHangBar;
})(com_main || (com_main = {}));
