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
    /**
     * 军备招募面板
     */
    var ArmsTrain = /** @class */ (function (_super_1) {
        __extends(ArmsTrain, _super_1);
        function ArmsTrain() {
            var _this = _super_1.call(this) || this;
            _this.m_nArmyType = SoldierMainType.FOOTSOLDIER; //兵种id
            _this.m_nTrainLimit = 0; //练兵上限 
            _this.m_nCurTrainNum = 0; //当前练兵数量
            _this.m_elapsedTime = 0; //一万个士兵 耗时s
            _this.m_pRemainMaxTime = 0;
            _this.m_pRemainTime = 0;
            _this.name = com_main.ArmsWnd.NAME;
            _this.skinName = Utils.getAppSkin('arms/ArmsTrainSkin.exml');
            return _this;
        }
        ArmsTrain.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ArmsTrain.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            Utils.TimerManager.remove(this.updateRemainTime, this);
        };
        ArmsTrain.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_Scroller.disableArrow();
            this.m_pArrayCollection = new eui.ArrayCollection();
            this.m_materialList.itemRenderer = com_main.com_levelup_conditions_cell;
            this.m_materialList.dataProvider = this.m_pArrayCollection;
            this.m_btnOnce.setTitleLabel(GCode(CLEnum.SPEED_AD));
            this.m_btnGold.setTitleLabel(GCode(CLEnum.FINISH_SOON));
            this.m_btnTrain.setTitleLabel(GCode(CLEnum.ARMY_TAB_ZM));
            this.m_btnTrain.setCostImg('icon_time_png');
            this.m_slider.minimum = 0;
            this.conditionList = [];
            this.addEvent();
        };
        /**切换兵种 */
        ArmsTrain.prototype.changeType = function (type) {
            this.m_nArmyType = type;
            this.refreshView();
        };
        /**刷新界面 */
        ArmsTrain.prototype.refreshView = function () {
            this.m_nBuildId = MainMapModel.getBuildInfoBySolider(this.m_nArmyType).id;
            var cfg = MainMapModel.getBuildingTrainCfgbyBuildId(this.m_nBuildId);
            this.m_buildTrainCfg = cfg;
            this.m_elapsedTime = this.m_buildTrainCfg.elapsedTime;
            this.m_unitCosts = Utils.parseCommonItemJson(cfg.consumes);
            var armyCfg = MainMapModel.getSoldierLvCfg(this.m_nArmyType);
            this.m_pLbTitle.text = GLan(armyCfg.name);
            this.m_curSoldier.text = CommonUtils.numOutLenght(TeamModel.getTroopsInfo(this.m_nArmyType).num) + "/" + CommonUtils.numOutLenght(this.m_buildTrainCfg.storagelimit);
            this.initSliderNum();
            this.setTrainState();
        };
        /**初始化滑动条 */
        ArmsTrain.prototype.initSliderNum = function () {
            //练兵上限
            this.m_nTrainLimit = this.m_buildTrainCfg.storagelimit - TeamModel.getTroopsInfo(this.m_nArmyType).num;
            //最小单次练兵 10000
            this.m_nTrainLimit = Math.max(ArmsTrain.LIMIT_NUM, this.m_nTrainLimit);
            if (this.m_nTrainLimit > this.m_buildTrainCfg.trainlimit) {
                this.m_nTrainLimit = this.m_buildTrainCfg.trainlimit;
            }
            var value = this.calcuInitSliderNum();
            value = Math.min(this.m_nTrainLimit, value);
            //滑动条 单位10000
            this.m_slider.maximum = Math.floor(this.m_nTrainLimit / ArmsTrain.LIMIT_NUM);
            this.m_slider.minimum = 1;
            this.m_slider.value = value / ArmsTrain.LIMIT_NUM;
            this.m_nCurTrainNum = value;
            this.updateValue();
        };
        /**计算恰好可以的最大暮兵数 */
        ArmsTrain.prototype.calcuInitSliderNum = function () {
            var minimum = 100000; //单次训练量10w
            var max = Infinity;
            for (var i = 0; i < this.m_unitCosts.length; i++) {
                var info = this.m_unitCosts[i];
                var num = Math.floor(RoleData.GetMaterialNumById(info.itemId) / info.count) * 10000;
                max = Math.min(max, num);
                // if (minimum > num) minimum = num;
            }
            //最小募兵10000
            minimum = Math.max(ArmsTrain.LIMIT_NUM, max);
            return minimum;
        };
        /**刷新练兵量 材料显示 */
        ArmsTrain.prototype.updateValue = function () {
            this.m_trainNum.text = CommonUtils.numOutLenght(this.m_nCurTrainNum) + "";
            //时间按钮数据设置 (this.m_elapsedTime 10000个耗时 )
            var time = Math.ceil(this.m_nCurTrainNum / 10000) * this.m_elapsedTime;
            this.m_btnTrain.setCostLabel(TimerUtils.diffTimeFormat("hh:mm:ss", time));
            //金币按钮数据设置
            var needglod = Utils.TimeGold(time);
            this.m_btnGold.setCostLabel(needglod + '');
            //所需材料设置
            var i = 0;
            this.conditionList.length = 0;
            for (i = 0; i < this.m_unitCosts.length; i++) {
                var itemInfo = this.m_unitCosts[i];
                var info = new com_main.LvUpConditionsBaseInfo(itemInfo.itemId, itemInfo.count * this.m_nCurTrainNum / 10000);
                info.setWidth(470);
                this.conditionList.push(info);
            }
            this.m_pArrayCollection.replaceAll(this.conditionList);
        };
        ArmsTrain.prototype.setTrainState = function () {
            var army = MainMapModel.getTrainArmyVoById(this.m_nBuildId);
            if (army == null || army.startTime == 0) {
                this.isTraining(false);
            }
            else {
                this.m_pRemainMaxTime = (army.endTime - army.startTime);
                this.m_pRemainTime = army.endTime - TimerUtils.getServerTime() - army.speedTime;
                // this.m_pRemainTime = this.m_elapsedTime;
                TimerUtils.getServerTime() - army.startTime;
                if (this.m_pRemainTime <= 0) {
                    this.m_pRemainTime = 0;
                    this.isTraining(false);
                }
                else {
                    this.isTraining(true);
                }
                this.m_trainLastTime.text = TimerUtils.diffTimeFormat("hh:mm:ss", this.m_pRemainTime);
                this.m_trainNum.text = CommonUtils.numOutLenght(army.num) + "";
                if (this.m_pRemainTime > 0) {
                    if (this.m_pRemainMaxTime > 0)
                        this.m_curgreesImg.width = 420 / this.m_pRemainMaxTime * (this.m_pRemainMaxTime - this.m_pRemainTime);
                    Utils.TimerManager.remove(this.updateRemainTime, this);
                    Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
                }
            }
            this.m_curSoldier.text = CommonUtils.numOutLenght(TeamModel.getTroopsInfo(this.m_nArmyType).num) + "/" + CommonUtils.numOutLenght(this.m_buildTrainCfg.storagelimit);
        };
        ArmsTrain.prototype.updateRemainTime = function () {
            if (--this.m_pRemainTime > -1) {
                if (this.m_pRemainTime < 0)
                    this.m_pRemainTime = 0;
                this.m_trainLastTime.text = TimerUtils.diffTimeFormat("hh:mm:ss", Math.ceil(this.m_pRemainTime));
                if (this.m_pRemainMaxTime > 0)
                    this.m_curgreesImg.width = 420 / this.m_pRemainMaxTime * (this.m_pRemainMaxTime - this.m_pRemainTime);
            }
            else {
                this.m_trainLastTime.text = "00:00:00";
                Utils.TimerManager.remove(this.updateRemainTime, this);
                this.m_curgreesImg.width = 0;
                this.isTraining(false);
                //主动征收
                SoldierProxy.send_C2S_TRAINING_GET(this.m_nBuildId);
            }
        };
        ArmsTrain.prototype.isTraining = function (btrain) {
            this.m_trainGroup.visible = !btrain;
            this.m_btnGold.visible = !btrain;
            this.m_btnTrain.visible = !btrain;
            this.m_TrainingGroup.visible = btrain;
            this.m_btnOnce.visible = btrain;
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        ArmsTrain.prototype.addEvent = function () {
            this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            com_main.EventManager.addTouchScaleListener(this.m_btnGold, this, this.onTouchBtnGod);
            com_main.EventManager.addTouchScaleListener(this.m_btnTrain, this, this.onTouchBtnTrain);
            com_main.EventManager.addTouchScaleListener(this.m_btnSub, this, this.onTouchSub);
            com_main.EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onTouchAdd);
            com_main.EventManager.addTouchScaleListener(this.m_btnOnce, this, this.onOnce);
            com_main.EventMgr.addEvent(BuildEvent.SOLDIER_TRAIN, this.onFinishTrain, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onResource, this);
        };
        ArmsTrain.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(BuildEvent.SOLDIER_TRAIN, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
        };
        /**资源变动 */
        ArmsTrain.prototype.onResource = function () {
            this.updateValue();
        };
        /**训练完成 */
        ArmsTrain.prototype.onFinishTrain = function (type) {
            if (type != this.m_nArmyType)
                return;
            this.initSliderNum();
            this.setTrainState();
        };
        //加速完成
        ArmsTrain.prototype.onOnce = function (e) {
            var army = MainMapModel.getTrainArmyVoById(this.m_nBuildId);
            Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                propSpeedType: PropSpeedType.Soldier, targetId: this.m_nBuildId,
                startTime: army.startTime,
                endTime: army.endTime,
                speedUpTime: army.speedTime,
            });
        };
        //金币训练
        ArmsTrain.prototype.onTouchBtnGod = function (e) {
            var _this = this;
            if (this.m_nTrainLimit <= 0) {
                EffectUtils.showTips('练兵营存量已满，请提升兵营等级！');
                return;
            }
            var vo = MainMapModel.getBuildInfo(this.m_nBuildId);
            if (!vo)
                return;
            if (!vo.isActivation()) {
                EffectUtils.showTips(GCodeFromat(CLEnum.ARMY_OPEN, GLan(vo.buildCfg.name)), 1, true);
                return;
            }
            if (TeamModel.getTroopsInfo(this.m_nArmyType).num >= this.m_buildTrainCfg.storagelimit) {
                EffectUtils.showTips(GCode(CLEnum.ARMY_ZM_FAL), 1, true);
                return;
            }
            if (this.m_nCurTrainNum <= 0) {
                EffectUtils.showTips(GCode(CLEnum.ARMY_ZM_FAL1), 1, true);
                return;
            }
            for (var index = 0; index < this.conditionList.length; index++) {
                if (!this.conditionList[index].IsMatch)
                    return;
            }
            var time = Math.ceil(this.m_nCurTrainNum / 10000) * this.m_elapsedTime;
            var needglod = Utils.TimeGold(time);
            if (!MainMapModel.isInTrain(this.m_nBuildId) && PropModel.isItemEnough(PropEnum.GOLD, needglod, 1)) {
                var content = GCodeFromat(CLEnum.ARMY_ZM_TIPS, needglod);
                Utils.showConfirmPop(content, function () {
                    _this.onGoldSpeedUp();
                }, this, "style2", LocalModel.DAY_NOTICE_TRAIN);
            }
        };
        //花费时间训练
        ArmsTrain.prototype.onTouchBtnTrain = function (e) {
            if (this.m_nTrainLimit <= 0) {
                EffectUtils.showTips('练兵营存量已满，请提升兵营等级！');
                return;
            }
            var vo = MainMapModel.getBuildInfo(this.m_nBuildId);
            if (!vo)
                return;
            if (!vo.isActivation()) {
                EffectUtils.showTips(GCodeFromat(CLEnum.ARMY_OPEN, GLan(vo.buildCfg.name)), 1, true);
                return;
            }
            if (TeamModel.getTroopsInfo(this.m_nArmyType).num >= this.m_buildTrainCfg.storagelimit) {
                EffectUtils.showTips(GCode(CLEnum.ARMY_ZM_FAL), 1, true);
                return;
            }
            if (this.m_nCurTrainNum <= 0) {
                EffectUtils.showTips(GCode(CLEnum.ARMY_ZM_FAL1), 1, true);
                return;
            }
            for (var index = 0; index < this.conditionList.length; index++) {
                if (!this.conditionList[index].IsMatch)
                    return;
            }
            SoldierProxy.send_TRAINING_ARMY(this.m_nBuildId, this.m_nCurTrainNum);
        };
        /**确认元宝加速 */
        ArmsTrain.prototype.onGoldSpeedUp = function () {
            SoldierProxy.send_TRAINING_ARMY(this.m_nBuildId, this.m_nCurTrainNum);
            SoldierProxy.send_C2S_TRAINING_SPEED(this.m_nBuildId, 0, 0);
        };
        ArmsTrain.prototype.onchangSlider = function (event) {
            var values = event.currentTarget.value;
            this.m_nCurTrainNum = Math.floor(values) * ArmsTrain.LIMIT_NUM;
            this.updateValue();
        };
        ArmsTrain.prototype.onTouchSub = function (e) {
            var val = this.m_nCurTrainNum - ArmsTrain.LIMIT_NUM;
            if (val < ArmsTrain.LIMIT_NUM) {
                return;
            }
            this.m_nCurTrainNum = val;
            this.updateValue();
            this.m_slider.value = this.m_nCurTrainNum / ArmsTrain.LIMIT_NUM;
        };
        ArmsTrain.prototype.onTouchAdd = function (e) {
            if (TeamModel.getTroopsInfo(this.m_nArmyType).num >= this.m_buildTrainCfg.storagelimit) {
                EffectUtils.showTips(GCode(CLEnum.ARMY_ZM_FAL), 1, true);
                return;
            }
            var val = this.m_nCurTrainNum + 10000;
            if (val > this.m_nTrainLimit) {
                val = this.m_nTrainLimit;
                return;
            }
            this.m_nCurTrainNum = val;
            this.updateValue();
            this.m_slider.value = this.m_nCurTrainNum / ArmsTrain.LIMIT_NUM;
        };
        ArmsTrain.NAME = 'ArmsTrain';
        ArmsTrain.LIMIT_NUM = 10000;
        return ArmsTrain;
    }(com_main.CComponent));
    com_main.ArmsTrain = ArmsTrain;
})(com_main || (com_main = {}));
