module com_main {
    /**剿匪菜单 */
    export class WorldMenuAttackWidget extends WorldMenuComponent {
        public m_pGInfo: eui.Group;
        public m_pLbTitle: eui.Label;
        public m_lblpCity: eui.Label;
        public m_pGHead: eui.Group;
        public m_pAward: eui.Group;
        public m_pLbPower: eui.Label;
        public m_attCout: eui.Label;
        public m_pMenu: eui.Group;
        public m_pBg: com_main.CImage;
        public m_pBtnAttack: eui.Group;


        private m_nId: number;   //事件位置id

        public constructor(id: number) {
            super();
            this.name = "WorldMenu";
            this.initApp("world/world_menu_attack_widget.exml");
            this.cacheAsBitmap = true;
            this.m_nOrginY = 0;
            this.m_nId = id;
        }

        public $onRemoveFromStage(): void {
            this.clearHeadItem();
            this.onDestroy();
            EventManager.removeEventListener(this.m_pBtnAttack);
            super.$onRemoveFromStage();

        }

        /////////////////////////////////////////////////////////////////协议号事件
        /**注册协议号事件 */
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_SYS_GENERAL_WIN_INFO,
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_SYS_GENERAL_WIN_INFO: {
                    this.refreshGeneralView(body);
                    break;
                }
                default:
                    break;
            }
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let eventVo = WorldModel.getEventVoByPosId(this.m_nId);
            let conf = C.EventDataConfig[eventVo.eventDataId];
            if (!conf) {
                error(`WorldMenuAttackWidget:childrenCreated=====id:${this.m_nId} is Empty=====`);
                return;
            }

            let arrPoint = []
                , arr = [this.m_pBtnAttack]

            for (let o of arr) {
                arrPoint.push([o.x, o.y])
            }
            this.showBtnTween(arr, arrPoint);

            let award = Utils.parseCommonItemJson(conf.reward);
            this.m_lblpCity.text = GLan(eventVo.coordCfg.name);
            for (let i = 0; i < award.length; i++) {
                let item = ComItemNew.create("count");
                item.setItemInfo(award[i].itemId, award[i].count);
                this.m_pAward.addChild(item);
            }
            this.m_pLbPower.text = `${conf.recommendForce}`;

            let data = NormalModel.getFunCountById(IFunCountEnum.WILD_MONSTER_COUNT);
            this.m_attCout.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_ATT_COU, data.useCount, data.maxCount));

            // EventManager.addTouchScaleListener(this.m_pBtnAttack, this, this.onAttackClick);
        }

        /**获得怪物内容 */
        protected onCreate(): void {
            //发送协议获得
            let eventVo = WorldModel.getEventVoByPosId(this.m_nId);
            let conf = C.EventDataConfig[eventVo.eventDataId];
            if (!conf) {
                return;
            }
            this.m_pLbTitle.text = GLan(conf.name);
            NormalProxy.C2S_SYS_GENERAL_WIN_INFO(eventVo.dataCfg.npcId);
        }

        private onAttackClick() {
            let data = NormalModel.getFunCountById(IFunCountEnum.WILD_MONSTER_COUNT);
            let vipCfg = C.VipPrivillegesConfig[VipPrivillType.BUY_MONSTER];
            let buyMax = Number(vipCfg['vip' + RoleData.vipLevel]);//最大购买数量
            if (data.reCount == 0) {
                if (data.buyAmountCount >= buyMax) {
                   Utils.showVipUpConfim();
                    WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
                    return;
                }

                if(platform.isHidePayFunc()) return;
                
                let needGold: number = NormalModel.getFunCostByData(data)
                if (PropModel.isItemEnough(PropEnum.GOLD, needGold, 3)) {
                    let content = GCodeFromat(CLEnum.WOR_BUY_GOLD, needGold) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount));
                    Utils.showConfirmPop(content, this.onConfirmBuy, this);
                    // view.setVipCanBuyNum(GCodeFromat(CLEnum.VIP_MAX_BUY, (buyMax - data.buyAmountCount)))
                }
                WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
                return;
            }
            Utils.open_view(TASK_UI.POP_WORLD_HERO_EVT_PANEL, { evtPosId: this.m_nId, cityId: -1 });
            WorldView.callFunc(WORLD_FUNC.HIDE_MENU);
        }
        //确认购买
        private onConfirmBuy() {
            WorldProxy.C2S_MAP_EVENT_BUY(WorldEventType.FIGHT);
        }
        /**前往充值界面 */
        public onConFirmCharge() {
            Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
        }
        public hitPoint(x: number, y: number) {
            if (this.m_pBtnAttack.hitTestPoint(x, y)) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.onAttackClick();
            }
            return this.m_pBtnAttack.hitTestPoint(x, y)
        }

        public removeFromParent() {
            super.removeFromParent([this.m_pBtnAttack]);
        }

        /**刷新武将显示 */
        public refreshGeneralView(data: gameProto.S2C_SYS_GENERAL_WIN_INFO) {
            if (data) {
                for (let i = 0; i < data.generalWinInfo.length; i++) {
                    let tempData = data.generalWinInfo[i];
                    let item = GeneralHeadRender.create("arena_name");
                    item.setGenViewInfo(tempData.generalId, tempData.level, tempData.star, tempData.quality);
                    Utils.addChild(this.m_pGHead, item);
                }
            }
        }

        /**回收头像 */
        private clearHeadItem() {
            if (!this.m_pGHead) return;
            while (this.m_pGHead.numChildren > 0) {
                let item = this.m_pGHead.getChildAt(0) as GeneralHeadRender;
                item.onDestroy();
            }
        }

    }
}