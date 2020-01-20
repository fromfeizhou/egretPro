module com_main {
	/**
	 * 加速面板相关
	 */
    export class SpeedUpView extends CView {
        public static NAME = 'SpeedUpView';
        private timeImageWidth: number = 100;
        private warningTime: number = 10;

        public m_pRoot: eui.Group;
        public m_pAPopUp: com_main.APopUp;
        public m_pLbCurTime: com_main.CLabel;
        public m_pBtnGoto: com_main.ComButton;
        public m_pImageProgress2: com_main.CImage;
        public m_pImageProgress: com_main.CImage;
        public m_pScrollRoot: eui.Group;
        public m_pScrller: eui.Scroller;
        public m_pCellRoot: eui.Group;
        public m_pNotPropTips: com_main.CLabel;
        public m_pSliderRoot: eui.Group;
        public m_btnSub: eui.Image;
        public m_btnAdd: eui.Image;
        public m_slider: Hslider;
        public m_pNum: com_main.CLabel;
        public m_pLbSpeedUpTime: com_main.CLabel;
        public m_pBtnUse: com_main.ComButton;
        public m_pBtnFast: com_main.ComCostTextButton;


        private curType: PropSpeedType;
        private curId: number;//加速id(某个建筑 某种兵营 某个科技)
        private freeTime: number = 0;
        private curPropList: number[];
        private curEndTime: number = 0;
        private curStartTime: number = 0;
        private curSpeedUpTime: number = 0;
        private speedUpTime: number = 0;
        private curSelectItem: SpeedUpCell;
        private speedUpPropNum: number = 0;
        private curSelectPropId: number;
        private curSelectPropCfg: QuickenConfig;
        private isShowEffect: boolean = false;
        private m_curSliderValue: number = 1;
        private cityId: number = -1;

        public constructor(data: any) {
            super();
            this.curType = data.propSpeedType;
            this.curStartTime = data.startTime;
            this.curEndTime = data.endTime;
            this.curId = data.targetId;
            this.name = SpeedUpView.NAME;
            this.curSpeedUpTime = data.speedUpTime;
            this.cityId = data.cityId;
            let id = MainMapModel.popViewId();
            this.initApp("speed_up/SpeedUpViewSkin.exml");

        }

        protected listenerProtoNotifications(): any[] {
            switch (this.curType) {
                case PropSpeedType.Build:
                    return [ProtoDef.S2C_BUILDING_SPEED];
                case PropSpeedType.Soldier:
                    return [ProtoDef.S2C_TRAINING_SPEED];
                case PropSpeedType.Technology:
                    return [ProtoDef.S2C_TECHNOLOGY_SPEEDUP];
                case PropSpeedType.WorldGather:
                    return [ProtoDef.S2C_WORLDMAP_EVENT_COLLECTION_QUICKEN, ProtoDef.S2C_WORLDMAP_EVENT_OVER];
                case PropSpeedType.WorldVisit:
                    return [ProtoDef.S2C_VISIT_CD_SPEED];
                case PropSpeedType.CityBuild:
                    return [ProtoDef.S2C_CITY_MADE_SPEED];
            }
            return [];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            let isClose = true;
            switch (protocol) {
                case ProtoDef.S2C_BUILDING_SPEED: {
                    let bId = body.bId;
                    if (MainMapModel.isInBuilding(bId)) {
                        let info: MainMapBuildVo = MainMapModel.getBuildInfo(bId);
                        this.curEndTime = info.buildEndTime;
                        this.curStartTime = info.buildStartTime;
                        this.curSpeedUpTime = info.speedTime;
                        this.setSpeedUpCellList();
                        this.showEffect();
                        isClose = false;
                    }
                    break;
                }
                case ProtoDef.S2C_TRAINING_SPEED: {
                    let bId = body.bId;
                    if (MainMapModel.isInTrain(bId)) {
                        let info: TrainArmyVo = MainMapModel.getTrainArmyVoById(bId);
                        this.curEndTime = info.endTime;
                        this.curStartTime = info.startTime;
                        this.curSpeedUpTime = info.speedTime;
                        this.setSpeedUpCellList();
                        this.showEffect();
                        isClose = false;
                    }
                    break;
                }
                case ProtoDef.S2C_TECHNOLOGY_SPEEDUP: {
                    if (TechnoModel.isInLevelCd()) {
                        let info = TechnoModel.getTimeData();
                        this.curEndTime = info.end;
                        this.curStartTime = info.start;
                        this.curSpeedUpTime = info.speed;
                        this.setSpeedUpCellList();
                        this.showEffect();
                        isClose = false;
                    }
                    break;
                }
                case ProtoDef.S2C_WORLDMAP_EVENT_OVER: {
                    isClose = true;
                }      //事件完成
                case ProtoDef.S2C_WORLDMAP_EVENT_COLLECTION_QUICKEN: { //采集加速
                    let evtVo = WorldModel.getEventVoByPosId(this.curId);
                    if (evtVo) {
                        //事件时间采用单位为秒 需转换
                        this.curEndTime = evtVo.userMapEventData.endTime;
                        this.curStartTime = evtVo.userMapEventData.startTime;
                        this.curSpeedUpTime = evtVo.userMapEventData.speedTime;
                        this.setSpeedUpCellList();
                        this.showEffect();
                    }
                    break;
                }
                case ProtoDef.S2C_VISIT_CD_SPEED: { //拜访加速
                    let visitVo = WorldModel.getVisitEventById(this.curId);
                    let visCfg = C.VisitConfig[visitVo.visitId];
                    let curEndTime = visitVo.refreshStamp + visCfg.cooling;
                    if (visitVo) {
                        //事件时间采用单位为秒 需转换
                        this.curEndTime = curEndTime;
                        this.curStartTime = visitVo.refreshStamp;
                        this.curSpeedUpTime = visitVo.speed;
                        let lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
                        if (lefttime > 0) {
                            this.setSpeedUpCellList();
                            this.showEffect();
                            isClose = false;
                        } else {
                            isClose = true;
                        }

                    }
                    break;
                }
                case ProtoDef.S2C_CITY_MADE_SPEED: { //城市建筑加速
                    let mi: gameProto.IPlayerMadeInfo[] = body.playerMadeInfo;
                    CityBuildModel.initPlayerMadeInfo(mi);
                    let info = CityBuildModel.getCityInfo(this.curId);
                    if (info.isBuilding()) {
                        this.curEndTime = info.endDate;
                        this.curStartTime = info.startDate;
                        this.curSpeedUpTime = info.speedTime;
                        let lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
                        if (lefttime > 0) {
                            this.setSpeedUpCellList();
                            this.showEffect();
                            isClose = false;
                        } else {
                            isClose = true;
                        }
                    }
                }
                    break;
                
            }

            if (isClose) UpManager.history();
        }

        public onDestroy(): void {
            Utils.TimerManager.remove(this.timeCallback, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            EventManager.removeEventListeners(this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_pBtnGoto.setTitleLabel(GCode(CLEnum.SOURCE_PATH));
            this.m_pBtnUse.setTitleLabel(GCode(CLEnum.BAG_USE));
            this.m_pBtnFast.setTitleLabel(GCode(CLEnum.FINISH_SOON));
            this.timeImageWidth = this.m_pImageProgress.width;
            this.m_pImageProgress.width = 0;
            this.m_pImageProgress2.width = 0;
            this.m_pNum.text = "0";
            this.setTitle();
            this.initEvent();
            this.initView();
            this.validateNow();
            this.onGuideCondition();
        }

        private setTitle() {
            switch (this.curType) {
                case PropSpeedType.Build: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.CITY_BD_UP))
                    break;
                } case PropSpeedType.Soldier: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.ARMY_TRAIN))
                    break;
                } case PropSpeedType.Technology: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.TEC_UP))
                    break;
                }
                case PropSpeedType.WorldGather: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.WOR_CO_ACC))
                    break;
                }
                case PropSpeedType.WorldVisit: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.WOR_VIS_RE))
                    break;
                }
                case PropSpeedType.CityBuild: {
                    this.m_pAPopUp.setTitleLabel(GCode(CLEnum.CITY_BUILD_TITLE));
                    break;
                }
            }
        }
        private initEvent() {

            this.m_slider.addEventListener(eui.UIEvent.CHANGE, this.onchangSlider, this);
            EventManager.addTouchScaleListener(this.m_btnSub, this, this.onClickSub);
            EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onClickAdd);
            EventManager.addTouchScaleListener(this.m_pBtnFast, this, this.onClickFast);
            EventManager.addTouchScaleListener(this.m_pBtnUse, this, this.onClickUse);
            EventManager.addTouchScaleListener(this.m_pBtnGoto, this, this.onClickGoto);


            /**资源更新 */
            EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
        }

        private onClickGoto() {
            ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.TREASURE);
            // EffectUtils.showTips("功能未开放", 1, true);
        }

        private initView() {
            this.setSpeedUpCellList();
            this.initTime();
            // this.speedUpPropNum = this.getPropUseMaxNum();
            // this.updateSlider();
        }
        /**资源更新 */
        public onRoleResource() {
            this.setSpeedUpCellList();
        }
        private initTime() {
            Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
        }
        //时间回调
        private timeCallback() {
            let lefttime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
            if (lefttime <= 0) {
                UpManager.history();
                EventMgr.dispatchEvent(BuildEvent.BUILD_REFRESH, null);
                return;
            }
            this.m_pBtnFast.setCostLabel(Utils.TimeGold(lefttime)!=0?Utils.TimeGold(lefttime).toString():GCode(CLEnum.AC_FREE));
            this.setImageProgerss(this.m_pImageProgress, this.timeImageWidth, this.curStartTime, this.curEndTime, this.curSpeedUpTime, this.m_pLbCurTime);
            this.setImageProgerss(this.m_pImageProgress2, this.timeImageWidth, this.curStartTime, this.curEndTime, this.curSpeedUpTime, null, this.speedUpTime);
        }

        private setImageProgerss(progressImage: CImage, imageWidth: number, startTime: number, endTime: number, speedUpTime: number, timeText?: CLabel, addtionTime: number = 0) {
            let stime = startTime;
            let etime = endTime;
            let spTime = speedUpTime + addtionTime;
            let dataInfo = Utils.DateUtils.getCountdownInfo(stime * 1000, etime * 1000, spTime * 1000, false);
            let tempWidth = Number(dataInfo[0]) * imageWidth;
            if (timeText) {
                timeText.text = dataInfo[1] + "";
                if (this.isShowEffect)//播放特效的时候蓝色进度条不随时间移动
                    return;
            }
            progressImage.width = tempWidth > imageWidth ? imageWidth : tempWidth;
        }
        //设置道具列表
        private setSpeedUpCellList() {
            this.curPropList = [];
            this.speedUpTime = 0;
            this.curSelectItem = null;
            let tempList = PropModel.getPropItemListByAllType(PropMainType.SPEED, PropSpeedType.All, false);
            tempList = tempList.concat(PropModel.getPropItemListByAllType(PropMainType.SPEED, this.curType, false));
            for (let index = 0; index < tempList.length; index++) {
                this.curPropList.push(tempList[index].itemId);
            }
            Utils.removeAllChild(this.m_pCellRoot);
            if (this.curPropList.length == 0) {
                this.setNotPropState(true);
                return;
            } else
                this.setNotPropState(false);
            this.sortPropList();
            this.curSelectPropId = this.curPropList[0];
            for (let index = 0; index < this.curPropList.length; index++) {
                let infoId = this.curPropList[index];
                let setSelect = (this.curSelectPropId == infoId);
                let cell = new SpeedUpCell(infoId, setSelect);
                cell.onClick = (item) => {
                    this.onClickCell(item);
                }
                this.m_pCellRoot.addChild(cell);
                if (setSelect) {
                    this.onClickCell(cell);
                }
            }

            this.m_pScrller.viewport.scrollH = 0;
        }
        //排序道具
        private sortPropList() {
            if (this.curPropList == null || this.curPropList.length == 0) return;
            let hasNotComType = false;
            this.curPropList.sort((a, b) => {
                let cfgA = C.QuickenConfig[a];
                let cfgB = C.QuickenConfig[b];
                if (cfgA.type != PropSpeedType.All || cfgB.type != PropSpeedType.All)
                    hasNotComType = true;
                if (cfgA.type != cfgB.type) {
                    return cfgB.type - cfgA.type;
                } else if (cfgA.reduceTime != cfgB.reduceTime) {
                    return cfgB.reduceTime - cfgA.reduceTime;
                }
                return 0;
            });

            let curtime = TimerUtils.getServerTime();
            let needTime = this.curEndTime - curtime - this.curSpeedUpTime;

            //选择一个最优的放最前面，其他不变
            let minTime = Number.MAX_VALUE;
            let tempIndex = -1;
            for (let index = 0; index < this.curPropList.length; index++) {
                let id = this.curPropList[index];
                let cfg = C.QuickenConfig[id];
                if (hasNotComType)//有非通用类型只排通用类型
                {
                    if (cfg.type == PropSpeedType.All)
                        continue;
                }
                let difference = needTime - cfg.reduceTime / 1000;
                if (difference >= 0) {
                    if (minTime >= difference) {
                        minTime = difference;
                        tempIndex = index;
                    }
                }
            }
            if (tempIndex == -1) {//拿最后一个 消耗最小
                for (let index = this.curPropList.length - 1; index >= 0; index--) {
                    let cfg = C.QuickenConfig[this.curPropList[index]];
                    if (hasNotComType) {
                        if (cfg.type != PropSpeedType.All) {
                            tempIndex = index;
                            break;
                        }
                    } else {
                        tempIndex = index;
                        break;
                    }
                }
            }
            if (tempIndex != -1) {
                let tempId: number = this.curPropList[tempIndex];
                this.curPropList.splice(tempIndex, 1);
                this.curPropList.unshift(tempId);
            }
        }

        //点击道具
        private onClickCell(item: SpeedUpCell) {
            if (this.curSelectItem == item)
                return;
            if (this.curSelectItem)
                this.curSelectItem.SelectState = false;
            item.SelectState = true;
            this.curSelectItem = item;
            this.curSelectPropId = item.PropId;
            this.curSelectPropCfg = C.QuickenConfig[item.PropId];
            this.speedUpPropNum = this.getPropUseMaxNum();
            this.m_slider.maximum = this.speedUpPropNum;
            this.updateSlider();
        }
        //获取可以使用的最大数量
        private getPropUseMaxNum(): number {

            if (this.curPropList.length == 0) {
                return 0;
            }
            let needTime: number = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
            let curTime = 0;
            let tempNum: number = 0;
            while (needTime > curTime && tempNum < PropModel.getPropNum(this.curSelectPropId)) {
                tempNum++;
                curTime = this.curSelectPropCfg.reduceTime / 1000 * tempNum;
            }
            if (this.curSelectPropCfg.reduceTime / 1000 * tempNum > needTime)
                tempNum--;
            tempNum = tempNum < 1 ? 1 : tempNum;
            return tempNum;
        }
        //减道具
        private onClickSub() {
            this.speedUpPropNum--;
            if (this.speedUpPropNum < 1) {
                this.speedUpPropNum = 1;
                return;
            }
            this.updateSlider();
        }
		/**
		 * 加道具
		 */
        private onClickAdd() {
            this.speedUpPropNum++;
            if (this.speedUpPropNum > this.getPropUseMaxNum()) {//PropModel.getPropNum(this.curSelectPropId)) {
                this.speedUpPropNum = this.getPropUseMaxNum();
                return;
            }
            this.updateSlider();
        }
        //滑动滑块
        private onchangSlider(event: eui.UIEvent): void {
            let values = event.currentTarget.value;
            if (values < 1) {
                values = 1;
            }
            this.speedUpPropNum = Math.floor(values);
            this.updateSlider();
        }
        //刷新时间显示
        private updateSlider() {
            this.m_slider.value = this.speedUpPropNum;
            this.m_pNum.text = this.speedUpPropNum + "";
            this.speedUpTime = this.curSelectPropCfg.reduceTime / 1000 * this.speedUpPropNum;
            this.m_pLbSpeedUpTime.text = Utils.DateUtils.getCountdownStrByCfg(this.speedUpTime * 1000) + "";
            this.timeCallback();
        }
        //立刻完成
        private onClickFast() {

            let leftTime = this.curEndTime - (TimerUtils.getServerTime() + this.curSpeedUpTime);
            let totalPrice = Utils.TimeGold(leftTime);
            if (!PropModel.isItemEnough(PropEnum.GOLD, totalPrice, 1)) {
                return;
            }

            let content = GCodeFromat(CLEnum.CITY_BD_SPEED, totalPrice)
            Utils.showConfirmPop(content, this.onConfirmFast, this, "style2", LocalModel.DAY_NOTICE_BUILD);
        }


        private onClickUse() {
            if (this.speedUpPropNum == 0 || this.curSelectPropId == 0) {
                EffectUtils.showTips(GCode(CLEnum.CITY_NOT_ITEM), 1, true);
                return;
            }
            let time = TimerUtils.getServerTime();
            time = this.curEndTime - time - this.curSpeedUpTime;
            let moreTime = Math.floor(((this.curSelectPropCfg.reduceTime / 1000 * this.speedUpPropNum) - time) / 60);//使用加速道具剩余的时间
            // if ((this.curSelectPropCfg.reduceTime / 1000 * this.speedUpPropNum) - time > this.warningTime * 60 ) {
            if ((this.curSelectPropCfg.reduceTime / 1000 * this.speedUpPropNum) > time) {
                // let content = "你选择加速的时间大于计时器中的剩余时间" + moreTime + "分钟以上，确认使用？";
                let content = GCodeFromat(CLEnum.CITY_SP_TIME, moreTime)
                Utils.showConfirmPop(content, this.onConfirmClickUse, this);

            } else {
                this.onConfirmClickUse();
            }
        }

        private onConfirmClickUse() {
            switch (this.curType) {
                case PropSpeedType.Build: {
                    MainMapProxy.send_BUILDING_SPEED(this.curId, this.curSelectPropId, this.speedUpPropNum);
                    break;
                }
                case PropSpeedType.Soldier: {
                    SoldierProxy.send_C2S_TRAINING_SPEED(this.curId, this.curSelectPropId, this.speedUpPropNum);
                    break;
                }
                case PropSpeedType.Technology: {
                    TechnologyProxy.C2S_TECHNOLOGY_SPEEDUP(this.curId, this.curSelectPropId, this.speedUpPropNum)
                    break;
                }
                case PropSpeedType.WorldGather: {
                    WorldProxy.C2S_WORLDMAP_EVENT_COLLECTION_QUICKEN(this.curId, this.curSelectPropId, this.speedUpPropNum);
                    break;
                }
                case PropSpeedType.WorldVisit: {
                    WorldProxy.C2S_VISIT_CD_SPEED(this.curId, false, this.curSelectPropId, this.speedUpPropNum);
                    break;
                }
                case PropSpeedType.CityBuild: {
                    if (CityBuildModel.unOwnerCity(this.curId)) {
                        UpManager.history();
                        break;
                    }
                    CityBuildProxy.C2S_CITY_MADE_SPEED(this.curId, this.curSelectPropId, this.speedUpPropNum);
                    break;
                }
                default: {

                }
            }
        }

        //立刻完成
        private onConfirmFast() {
            switch (this.curType) {
                case PropSpeedType.Build: {
                    MainMapProxy.send_BUILDING_SPEED(this.curId, 0, 0);
                    break;
                }
                case PropSpeedType.Soldier: {
                    SoldierProxy.send_C2S_TRAINING_SPEED(this.curId, 0, 0);
                    break;
                }
                case PropSpeedType.Technology: {
                    TechnologyProxy.C2S_TECHNOLOGY_SPEEDUP(this.curId, 0, 0);
                    break;
                }
                case PropSpeedType.WorldGather: {
                    WorldProxy.C2S_WORLDMAP_EVENT_COLLECTION_QUICKEN(this.curId, 0, 0);
                    break;
                }
                case PropSpeedType.WorldVisit: {
                    WorldProxy.C2S_VISIT_CD_SPEED(this.curId, true, 0, 0);
                    break;
                }
                case PropSpeedType.CityBuild: {
                    if (CityBuildModel.unOwnerCity(this.curId)) {
                        UpManager.history();
                        break;
                    }
                    CityBuildProxy.C2S_CITY_MADE_SPEED(this.curId, 0, 0);
                    break;
                }
                default: {
                }
            }
        }

        private setNotPropState(isHide: boolean) {
            this.m_slider.maximum = 0;
            this.m_pLbSpeedUpTime.text = "00:00:00";
            this.speedUpPropNum = 0;
            this.curSelectPropId = 0;
            this.m_pNotPropTips.visible = isHide;
            this.timeCallback();

        }
        private showEffect() {
            this.isShowEffect = true;
            this.touchChildren = false;
            let target = this.m_pImageProgress2.width;
            Tween.get(this.m_pImageProgress).to({ width: target }, 400, egret.Ease.sineIn).call(() => {
                this.isShowEffect = false;
                this.touchChildren = true;

            });
        }


        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.SPEED_WND);
        }
    }
}