module com_main {
    export class BossChallView extends CView {
        public static NAME = 'BossChallView';
        public m_listCard: eui.List;
        public m_pViewRoot: eui.Group;
        public m_imgProBg: com_main.CImage;
        public m_imgPro: com_main.CImage;
        public m_pHurtLab: eui.Group;
        public m_hurtCount: eui.Label;
        public m_btnBox: eui.Image;
        public m_AllOutRoot: eui.Group;
        public m_boxRoot: eui.Group;
        public m_pRankTime: eui.Group;
        public m_downCount: eui.Label;
        public m_labPro: eui.Label;
        public m_btnAdd: eui.Image;
        public m_pBtnShop: com_main.CImage;


        private m_pCollection: eui.ArrayCollection;   //boss列表数据
        private m_nCurTagIndex: number;  //当前切卡id
        private m_nType: BossEnum;
        private m_currState: string;
        private m_challageMax: number;   //挑战次数上限
        private m_endTime: number;         //倒计时
        private m_boxProWidth = 242;         //宝箱进度条宽度
        private m_pEffect: BoxEffect;

        public constructor(type: BossEnum, width: number, height: number) {
            super();
            this.name = BossChallView.NAME;
            this.m_nType = type;
            this.width = width;
            this.height = height;
            switch (type) {
                case BossEnum.Single:
                    this.m_currState = 'Single';
                    break;
                case BossEnum.Rank:
                    this.m_currState = 'rank';
                    break;
                case BossEnum.World:
                    this.m_currState = 'world';
                    break;
            }
            this.currentState = this.m_currState;
            this.initApp("boss/BossChallViewSkin.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_GET_BOSS,
                ProtoDef.S2C_CLEAR_BOSS,
                ProtoDef.S2C_BUY_BOSS_CHALLENGE_COUNT,
                ProtoDef.S2C_RECEIVE_BOSS_BOX,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_GET_BOSS: {
                    this.initPanel();
                    break;
                }
                case ProtoDef.S2C_CLEAR_BOSS: {//扫荡返回
                    this.reFlashitem(body);
                    let VO = body as gameProto.IS2C_CLEAR_BOSS;
                    Utils.open_view(TASK_UI.GET_REWARD_VIEW, VO.valuesMessage);
                    break;
                }
                case ProtoDef.S2C_BUY_BOSS_CHALLENGE_COUNT: {//返回购买boss挑战次数
                    this.setCount();
                    break;
                }
                case ProtoDef.S2C_RECEIVE_BOSS_BOX: {//领取宝箱返回
                    this.setBoxReward();
                    break;
                }
            }
        }
        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listCard.dataProvider = this.m_pCollection;
            this.m_listCard.itemRenderer = BossItemRender;
            this.m_listCard.useVirtualLayout = true;
            egret.callLater(() => {
                if (this.m_listCard) {
                    Utils.tileGroupToCenter(this.m_listCard, 370);
                }
            }, this);
            this.validateNow();
            this.initPanel();
            this.addEvent();

            Utils.toStageBestScale(this.m_pViewRoot);
        }
        /**初始化boss列表 */
        private initPanel() {
            let bossArr = [];
            let list = BossModel.getBossCfgByType(this.m_nType);
            for (let i = 0; i < list.length; i++) {
                let vo = list[i];
                let data: IBossItemRD = { id: vo.id, type: vo.bossType };
                bossArr.push(data);
            }
            if (this.m_nType == BossEnum.World) {
                bossArr.sort(this.sortWorldBoss);
            } else if (this.m_nType == BossEnum.Single) {
                bossArr.sort(this.sortSingleBoss);
            } else {
                bossArr.sort(this.sortRankBoss);
            }
            this.m_pCollection.replaceAll(bossArr);
            this.setCount();
        }
        /**个人boss排序 */
        private sortSingleBoss(a: any, b: any): number {
            let fight1 = RoleData.level >= C.PersonalBossConfig[a.id].openLevel;
            let fight2 = RoleData.level >= C.PersonalBossConfig[b.id].openLevel;
            if (fight1 != fight2) {
                return fight1 ? -1 : 1;
            }
            let pass1 = BossModel.getSingleItemInfo(a.id) ? true : false;
            let pass2 = BossModel.getSingleItemInfo(b.id) ? true : false;
            if (pass1 != pass2) {
                return pass1 ? 1 : -1;
            }
            if (pass1) {
                return b.id - a.id;
            }
            return a.id - b.id;
        }
        /**排名boss排序 */
        private sortRankBoss(a: any, b: any): number {
            function setRankSort(RankCfg: gameProto.IRankBossInfo) {
                let reviveTime = RankCfg.bossReviveTime;
                if (RankCfg) {
                    if (reviveTime <= 0) {
                        return 1;
                    } else if (reviveTime > 0) {
                        return 0;
                    }
                } else {
                    return -1;
                }
            }
            let m_rankCfga = C.PersonalBossConfig[a.id];
            let m_rankCfgb = C.PersonalBossConfig[b.id];
            let rankInfo1 = BossModel.getRandItemInfo(a.id);
            let rankInfo2 = BossModel.getRandItemInfo(b.id);
            let rankNum1 = setRankSort(rankInfo1);
            let rankNum2 = setRankSort(rankInfo2);
            let rankOpen1 = RoleData.level >= m_rankCfga.openLevel ? 1 : 0;
            let rankOpen2 = RoleData.level >= m_rankCfgb.openLevel ? 1 : 0;

            if (rankOpen1 != rankOpen2) {
                return rankOpen2 - rankOpen1;
            }
            if (rankNum1 != rankNum2) {
                return rankNum2 - rankNum1;
            }
            if (m_rankCfga.openLevel != m_rankCfgb.openLevel) {
                return m_rankCfga.openLevel - m_rankCfgb.openLevel;
            }



        }
        /**世界boss排序 */
        private sortWorldBoss(a: any, b: any): number {
            function setBossState(bossCfg: PersonalBossConfig) {
                let openTime = bossCfg.time;
                openTime = openTime.replace('[', '');
                openTime = openTime.replace(']', '');
                let times = openTime.split(',');
                let startTime = TimerUtils.getTimeByFormatA(times[0]);
                let endTime = TimerUtils.getTimeByFormatA(times[1]);
                let curTime = TimerUtils.getServerTime();
                let curweek = TimerUtils.getTimeWeek();
                let isOpen = (curTime >= startTime && curTime <= endTime);
                let weekOpeen = (curweek == bossCfg.week)
                if (isOpen && weekOpeen) {
                    return 1;
                }
                return 0;
            }
            let m_bossCfga = C.PersonalBossConfig[a.id];
            let m_bossCfgb = C.PersonalBossConfig[b.id];
            let num1 = setBossState(m_bossCfga);
            let num2 = setBossState(m_bossCfgb);
            if (num1 != num2) {
                return num2 - num1;
            }
            if (m_bossCfga.openLevel != m_bossCfgb.openLevel) {
                return m_bossCfga.openLevel - m_bossCfgb.openLevel;
            }
        }

        /**刷新列表数据 */
        private reFlashitem(info: gameProto.IS2C_CLEAR_BOSS) {
            for (let i = 0; i < this.m_pCollection.source.length; i++) {
                let data: IBossItemRD = this.m_pCollection.source[i];
                if (data.id == info.personalBossInfo.bossId) {
                    this.m_pCollection.replaceItemAt(data, i);
                }
            }
            this.setCount();//更新次數
        }
        /**初始化挑战次数 */
        private setCount() {
            let info = this.getFuncInfo();
            this.m_labPro.text = `${info.reCount}/${NormalModel.getFuncCfgCount(info)}`;
            switch (this.m_nType) {
                case BossEnum.Single:
                case BossEnum.World: {
                    this.setBoxReward();
                    break;
                }
                case BossEnum.Rank: {
                    let curTime = TimerUtils.getServerTimeMill();
                    this.m_endTime = Math.ceil((BossModel.rankBossPlayerEndReviveTime - curTime));
                    this.m_endTime = this.m_endTime % (ConstUtil.getValue(IConstEnum.RANKING_BOSS_PLAYER_REVIVE_TIME));
                    this.m_endTime = Math.floor(this.m_endTime/1000);
                    if (this.m_endTime <= 0) {
                        this.m_endTime = 0;
                        this.m_pRankTime.visible = false;
                    } else {
                        Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
                    }
                    this.m_downCount.text = Utils.DateUtils.getFormatBySecond(this.m_endTime, 3);
                    break;
                }
              
            }
        }
        /**初始宝箱进度条 */
        private setBoxReward() {
            let hurtcfg = BossModel.getHurtOneCfg();
            if (hurtcfg) {
                this.m_pHurtLab.visible = true;
                this.m_btnBox.touchEnabled = true;
                this.m_AllOutRoot.visible = false;
                this.m_hurtCount.text = `${CommonUtils.numOutLenght(hurtcfg.bossHurt)}`

                let percentum: number;
                if (BossModel.worldSumHurt <= 0) {
                    BossModel.worldSumHurt = 0;
                }
                if (BossModel.worldSumHurt / hurtcfg.bossHurt >= 1) {
                    percentum = 1;
                    this.m_boxRoot.visible = true;
                    this.m_btnBox.visible = false;
                    if (!this.m_pEffect) {
                        this.m_pEffect = new BoxEffect(2, true);
                        this.m_pEffect.anchorOffsetX = this.m_pEffect.width * 0.5;
                        this.m_pEffect.anchorOffsetY = this.m_pEffect.height * 0.5;
                        this.m_pEffect.x = 48;
                        this.m_pEffect.y = 50;
                        this.m_boxRoot.addChild(this.m_pEffect);
                    }

                } else {
                    percentum = BossModel.worldSumHurt / hurtcfg.bossHurt;
                    this.m_btnBox.source = "bx-lanl_png";
                    this.m_btnBox.visible = true;
                    this.m_boxRoot.visible = false;
                    if (this.m_pEffect) {
                        this.m_pEffect.onDestroy();
                        Utils.removeFromParent(this.m_pEffect);
                        this.m_pEffect = null;
                    }
                }
                this.m_imgPro.width = this.m_boxProWidth * percentum;
            } else {
                this.m_pHurtLab.visible = false;
                this.m_btnBox.visible = true;
                this.m_btnBox.source = "bx-open_png";
                this.m_AllOutRoot.visible = true;
                this.m_btnBox.touchEnabled = false;
                this.m_imgPro.width = this.m_boxProWidth * 1;
                if (this.m_pEffect) {
                    this.m_pEffect.onDestroy();
                    Utils.removeFromParent(this.m_pEffect);
                    this.m_pEffect = null;
                }
            }
        }
        /**刷新倒计时 */
        private updateRemainTime() {
            if (--this.m_endTime > -1) {
                this.m_downCount.text = Utils.DateUtils.getFormatBySecond(this.m_endTime, 3);
                this.m_pRankTime.visible = true;
            } else {
                this.m_downCount.text = Utils.DateUtils.getFormatBySecond(this.m_endTime, 3);
                this.m_pRankTime.visible = false;
                Utils.TimerManager.remove(this.updateRemainTime, this);
                BossProxy.C2S_GET_BOSS();
            }
        }
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnBox, this, this.onCheckReward);
            EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onBtnAdd/*onBtnAdd*/);
            EventManager.addTouchScaleListener(this.m_boxRoot, this, this.onClickBox);
            EventManager.addTouchScaleListener(this.m_pBtnShop, this, this.showShopPanel);
        }
        /**移除事件 */
        private removeEvent() {
            Utils.TimerManager.remove(this.updateRemainTime, this);
        }
        /**领取伤害宝箱奖励 */
        private onClickBox() {
            let hurtcfg = BossModel.getHurtOneCfg();
            if (hurtcfg) {
                if (BossModel.worldSumHurt >= hurtcfg.bossHurt) {
                    BossProxy.C2S_RECEIVE_BOSS_BOX(hurtcfg.id);
                }
            }
        }
        //商城
        private showShopPanel() {
            //Utils.open_view(TASK_UI.POP_PVPARENA_SHOP_PANEL);     
            ShopProxy.send_GET_MERCHANT_OPEN_VIEW(ShopStoreIdEnum.GENERAL);
        }
        /**查看伤害宝箱奖励 */
        private onCheckReward() {
            let hurtcfg = BossModel.getHurtOneCfg();
            Utils.open_view(TASK_UI.NOR_REWARD__PANEL, { awards: hurtcfg.bossHurtReward });
        }

        /**增加挑战次数1.0.2 */
        private onBtnAdd() {
            let info = this.getFuncInfo();
            let totalPrice = NormalModel.getFunCostByData(info);
            if (info.reBuyAmountCount == 0 && this.m_nType == BossEnum.Rank) {
                Utils.showVipUpConfim();
                return;
            }
            if(info.reCount == NormalModel.getFuncCfgCount(info)){
                EffectUtils.showTips(GCode(CLEnum.BOSS_FIGHT_FULL));
                return;
            }
            if(PropModel.isItemEnough(PropEnum.GOLD,totalPrice,1)){
                let content = GCodeFromat(CLEnum.ARENA_NUM_TIPS, totalPrice) + '\n' + GCodeFromat(CLEnum.VIP_MAX_BUY, info.reBuyAmountCount);
                Utils.showConfirmPop(content,this.onConfirmBuy,this)
            }
        }
        //确认购买
        private onConfirmBuy() {
            BossProxy.C2S_BUY_BOSS_CHALLENGE_COUNT(this.m_nType);
        }

        /**获得功能次数 */
        private getFuncInfo() {
            switch (this.m_nType) {
                case BossEnum.Single:
                    return NormalModel.getFunCountById(IFunCountEnum.PERSONAL_BOSS);
                case BossEnum.Rank:
                    return NormalModel.getFunCountById(IFunCountEnum.RANK_BOSS);
            }
            return NormalModel.getFunCountById(IFunCountEnum.WORLD_BOSS);
        }
    }



    export interface IBossItemRD {
        id: number,
        type: number,
    }
    /**
   * bossItem
   * @class 
   * @extends eui.ItemRenderer
   */
    export class BossItemRender extends eui.ItemRenderer {
        protected m_bossItem: BossChallItem;
        protected m_imgSelected: eui.Image;

        protected m_tData: IBossItemRD;
        private m_nType: number;     //面板类型
        public constructor() {
            super();
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }
        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_bossItem = new BossChallItem();
            this.addChild(this.m_bossItem);
        }
        protected dataChanged() {
            this.m_tData = this.data;
            if (this.m_nType != this.m_tData.type) {
                this.m_nType = this.m_tData.type;
                let state: string;
                if (this.m_nType == BossEnum.Single) {
                    state = 'info';
                } else if (this.m_nType == BossEnum.Rank) {
                    state = 'rank';
                } else {
                    state = 'world';
                }
                this.m_bossItem.currentState = state;
            }
            this.m_bossItem.setItemInfo(this.m_nType, this.m_tData.id);
        }
    }
}