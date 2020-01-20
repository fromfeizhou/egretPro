module com_main {

    /**采集菜单 */
    export class WorldMenuCollectWidget extends WorldMenuComponent {
        public m_pGInfo: eui.Group;
        public m_lblpCity: eui.Label;
        public m_pLbTitle: eui.Label;
        public m_pLbAdd: eui.Label;
        public m_pLbAwardNum: eui.Label;
        public m_refTime: eui.Label;
        public m_pItem: com_main.ComItemNew;
        public m_gaCout: eui.Label;
        public m_pLbTime: eui.Label;
        public m_pMenu: eui.Group;
        public m_pBg: com_main.CImage;
        public m_pBtnGather: eui.Group;
        public m_pImgGather: com_main.CImage;
        public m_pImgGatherLab: com_main.CImage;


        private m_nId: number;   //事件id
        private m_nTimeCount: number;    //剩余时间
        private isAcc: boolean = false;
        public constructor(id: number) {
            super();
            this.name = "WorldMenu";
            this.initApp("world/WorldMenuCollectSkin.exml");
            this.cacheAsBitmap = true;
            this.m_nId = id;
        }

        public $onRemoveFromStage(): void {
            this.onDestroy();
            EventManager.removeEventListener(this.m_pBtnGather);
            Utils.TimerManager.remove(this.onTickHandler, this);
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            let arrPoint = []
                , arr = [this.m_pBtnGather]

            for (let o of arr) {
                arrPoint.push([o.x, o.y])
            }
            this.showBtnTween(arr, arrPoint);

            let eventVo = WorldModel.getEventVoByPosId(this.m_nId);
            let conf = C.EventDataConfig[eventVo.eventDataId];

            if (!conf) {
                error(`WorldMenuGatherWidget:childrenCreated=====id:${this.m_nId} is Empty=====`);
                return;
            }
            this.m_pLbTitle.text = GLan(conf.name);
            this.m_lblpCity.text = GLan(eventVo.coordCfg.name);
            let award = Utils.parseCommonItemJson(conf.reward);
            let item = award[0];
            this.m_pLbAwardNum.text = `${item.count}`
            this.m_refTime.text = GCodeFromat(CLEnum.WOR_GA_REF, Math.ceil(eventVo.coordCfg.frequency / 60));
            this.m_pItem.setItemInfo(item.itemId, item.count);
            let vipPri = VipModel.getPlayerPrivillByType(VipPrivillType.MAP_COLLECTION_PROFIT) * 100;
            let cityBuff = CityBuildModel.getCityPrivilegeValues(eventVo.cityId, CityRewardType.GATHER) / 100;
            this.m_pLbAdd.text= (vipPri + cityBuff) + "%";
            // if (conf.time <= 0) {
            //     RES.getResAsync("btn_018_up_png", (k, v)=>{
            //         this.m_pImgGather.texture = k;
            //     }, this);
            // } 
            if (eventVo.getTeamId() > 0) {
                this.m_nTimeCount = eventVo.userMapEventData.endTime - TimerUtils.getServerTime() - eventVo.userMapEventData.speedTime;
                this.m_nTimeCount = Math.max(0, this.m_nTimeCount);
                this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nTimeCount, 1);
                if (this.m_nTimeCount > 0) {
                    Utils.TimerManager.doTimer(1000, 0, this.onTickHandler, this);
                }
                this.isAcc = true
                this.m_pImgGather.source = 'btn_034_up_png';
                this.m_pImgGatherLab.source = 'lb_js_png';
            } else {
                this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(eventVo.dataCfg.collectionTime / 1000, 1);
                this.m_pImgGather.source = 'btn_027_up_png';
                this.m_pImgGatherLab.source = 'lb_cj_png';
            }

            let data = NormalModel.getFunCountById(IFunCountEnum.COLLECT_COUNT);
            this.m_gaCout.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_CO_COU, data.useCount, data.maxCount));

            // EventManager.addTouchScaleListener(this.m_pBtnGather, this, this.onGatherClick);
        }

        private onGatherClick() {
            let data = NormalModel.getFunCountById(IFunCountEnum.COLLECT_COUNT);
            let vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_MONSTER];
            let buyMax = Number(vipCfg['vip' + RoleData.vipLevel]);//最大购买数量

            let eventVo = WorldModel.getEventVoByPosId(this.m_nId);
            if (eventVo.getTeamId() > 0) {
                //收集中
                Utils.open_view(TASK_UI.POP_COM_SPEED_UP_VIEW, {
                    propSpeedType: PropSpeedType.WorldGather, targetId: this.m_nId, cityId: eventVo.cityId,
                    startTime: eventVo.userMapEventData.startTime,
                    endTime: eventVo.userMapEventData.endTime,
                    speedUpTime: eventVo.userMapEventData.speedTime
                });
            } else {
                //非收集中
                if (data.reCount == 0 && !this.isAcc) {
                    if (data.buyAmountCount >= buyMax) {
                        Utils.showVipUpConfim();
                         WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
                        return;
                    }

                    if(platform.isHidePayFunc()) return;
                    
                    let needGold: number = NormalModel.getFunCostByData(data)
                    if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
                        let content = GCodeFromat(CLEnum.WOR_BUY_GOLD, needGold) + '\n' +GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
                        Utils.showConfirmPop(content, this.onConfirmBuy, this);
                        // view.setVipCanBuyNum(GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount)))
                    }
                    WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
                    return;
                }
                Utils.open_view(TASK_UI.POP_WORLD_HERO_EVT_PANEL, { evtPosId: this.m_nId, cityId: -1 });

            }
            WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
        }

        //确认购买
        private onConfirmBuy() {
            WorldProxy.C2S_MAP_EVENT_BUY(WorldEventType.RES_COLLECT);
        }
         /**前往充值界面 */
        public onConFirmCharge() {
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        }
        public hitPoint(x: number, y: number): boolean {
            if (this.m_pBtnGather.hitTestPoint(x, y)) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onGatherClick();
            }
            return this.m_pBtnGather.hitTestPoint(x, y) || this.m_pMenu.hitTestPoint(x, y)
        }

        private onTickHandler() {
            if (this.m_nTimeCount <= 0) {
                Utils.TimerManager.remove(this.onTickHandler, this);
            }
            this.m_nTimeCount--;
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nTimeCount, 1);
        }

        public removeFromParent() {
            super.removeFromParent([this.m_pBtnGather]);
        }

    }


}