module com_main {
    export class EquipStrengView extends CView {
        public static NAME = 'EquipStrengView';

        public m_equip0: com_main.EquipItem;
        public m_equip1: com_main.EquipItem;
        public m_equip2: com_main.EquipItem;
        public m_equip3: com_main.EquipItem;
        public m_pTipsCon: eui.Group;
        public m_labUpLv: eui.Label;
        public m_pViewRoot: eui.Group;
        public m_equipViewComp0: com_main.EquipMainComp;
        public m_equipViewComp1: com_main.EquipLevelComp;
        public m_equipViewComp2: com_main.EquipGradeComp;
        public m_equipViewComp3: com_main.EquipWroughtComp;
        public m_comFightItem: com_main.ComFightItem;
        public m_pFightEffRoot: eui.Group;
        public m_itemScroll: eui.Scroller;
        public m_listGenHead: eui.List;
        public m_btnLeft: eui.Image;
        public m_btnRight: eui.Image;
        public m_pTabView0: eui.Group;
        public m_btnEquip: com_main.ComButton;
        public m_pTabView1: eui.Group;
        public m_btnAllUpLv: com_main.ComButton;
        public m_pTabView2: eui.Group;
        public m_btnAllUpGrade: com_main.ComButton;
        public m_pTabView3: eui.Group;
        public m_btnAllWrought: com_main.ComButton;
        public m_imgRole: eui.Image;
        public m_imgRoleBg: eui.Image;


        private m_pCollection: eui.ArrayCollection;   //英雄头像列表
        private m_nCurIndex: number;     //当前选中对象下标
        private m_nCurGenVo: GeneralVo;  //武将信息
        private m_nCurTagIndex: number;  //当前切卡id
        private m_nCurEquipPos: number;  //当前装备格子
        private m_imgSelect: eui.Image;
        private m_bScrollBtn: boolean;   //滚动按钮
        private m_nLastStrengInfo: { level0: number, level1: number, level2: number, level3: number };
        private m_nGeneralId: number;     //指定武将id

        private m_currTipType = 0; //当前选择tip类型;
        private m_currTipData: ITipsEquipAdd; //当前选择Data;
        private isChange: boolean = false;  //是否可装备
        private res: number[];
        private wearState: IEquipWearEnum;           //一键装备或一键卸装状态


        public constructor(width: number, height: number, generalId: number) {
            super();
            this.name = EquipStrengView.NAME;
            this.initApp("equip/EquipStrengViewSkin.exml");
            this.width = width;
            this.height = height;
            this.m_nGeneralId = generalId;
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_GENERAL_EQUIP,
                ProtoDef.S2C_GENERAL_EQUIP_ALL,
                ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE,
                ProtoDef.S2C_EQUIPMENT_ADD,
                ProtoDef.S2C_EQUIPMENT_DEL
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_GENERAL_EQUIP:
                case ProtoDef.S2C_GENERAL_EQUIP_ALL: {
                    if (body.errorCode > 0) return;
                    this.refreshFightNum();
                    // this.refreshGeneralHeads();
                    this.refreshEquipItems();
                    this.refreshCompView(0);    //主面板信息刷新
                    this.refreshCompView(2);    //升阶面板 隐藏显示刷新
                    this.refreshGenItemsTips();
                    this.getWearState();
                    break;
                }
                case ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE: {  //强化
                    // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
                    let data = body as gameProto.IS2C_EQUIPMENT_SLOT_UPGRADE;
                    let type = data.upgradeType;
                    this.refreshFightNum();
                    // this.refreshGeneralHeads();
                    this.refreshEquipItems(true);
                    this.refreshCompView(0);        //主卡刷新
                    this.refreshGenItemsTips();
                    // 卡槽对应关系 1强化 2升阶 3精炼
                    this.refreshCompView(type + 1);
                    this.getBonus();//刷新（强化，升阶，精炼）大师
                }
                case ProtoDef.S2C_EQUIPMENT_ADD:
                case ProtoDef.S2C_EQUIPMENT_DEL: {
                    this.refreshEquipTips();
                    this.refreshGenItemsTips();
                    break;
                }
            }
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            Utils.TimerManager.remove(this.fixGeneralHeadsPos, this);
            this.removeEvent();
            super.onDestroy();
        }


        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_btnEquip.setTitleLabel(GCode(CLEnum.EQUIP_ZB_YJZB));
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listGenHead.dataProvider = this.m_pCollection;
            this.m_listGenHead.itemRenderer = EquipGenRender;
            this.m_listGenHead.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickGenHead, this);
            this.m_listGenHead.useVirtualLayout = true;
            this.initGeneralHeadItems();

            egret.callLater(() => {
                if (this.m_listGenHead) {
                    this.m_listGenHead.width = this.m_itemScroll.width - 30;
                    this.m_listGenHead.validateNow();
                    if (this.m_listGenHead.contentWidth > this.m_itemScroll.width) {
                        this.m_bScrollBtn = true;
                        this.m_btnLeft.visible = false;
                        this.m_btnRight.visible = true;
                        this.m_itemScroll.addEventListener(egret.Event.CHANGE, this.onScrollChange, this)
                    } else {
                        this.m_btnLeft.visible = false;
                        this.m_btnRight.visible = false;
                    }
                }
            }, this);

            //初始化格子位置
            for (let i = 0; i < 4; i++) {
                this[`m_equip${i}`].pos = i;
            }
            //选中框
            this.m_imgSelect = new com_main.CImage("SelectKuang_png");
            this.m_imgSelect.x = -13;
            this.m_imgSelect.y = -13;

            this.changeTag(0);
            this.setCurEquipPos(0);

            this.addEvent();
            this.validateNow();
            Utils.toStageBestScale(this.m_pViewRoot);
        }

        /**点击头像回调 */
        private onClickGenHead(e: any) {
            this.setCurSelected(e.itemIndex);
            this.m_nGeneralId = e.item.id;
        }

        /**初始化头像列表 */
        private initGeneralHeadItems() {
            let list = GeneralModel.getOwnGeneralWithSortFight();
            let curIndex = 0;
            let heroArr = [];
            for (let i = 0; i < list.length; i++) {
                let vo = list[i];
                let data: IEqGenRD = { id: vo.generalId, sel: false, redState: false, upState: false };
                heroArr.push(data);
                if (vo.generalId == this.m_nGeneralId) curIndex = i;
            }
            this.m_pCollection.replaceAll(heroArr);
            this.setCurSelected(curIndex);
        }

        /**刷新头像列表 */
        // private refreshGeneralHeads() {
        //     this.m_pCollection.source.sort((a: IEqGenRD, b: IEqGenRD) => {
        //         let aFight = GeneralModel.getOwnGeneral(a.id).fight;
        //         let bFight = GeneralModel.getOwnGeneral(b.id).fight;
        //         return bFight - aFight;
        //     });

        //     this.m_pCollection.refresh();
        //     let itemMax = this.m_pCollection.source.length;
        //     for (let i = 0; i < itemMax; i++) {
        //         let data = this.m_pCollection.getItemAt(i) as IEqGenRD;
        //         if (data.sel) {
        //             this.m_nCurIndex = i;
        //             this.m_nScrollH = this.m_listGenHead.scrollH;
        //             Utils.TimerManager.doFrame(3, 1, this.fixGeneralHeadsPos, this);
        //             break;
        //         }
        //     }
        // }

        private m_nScrollH = 0;
        private fixGeneralHeadsPos() {
            // let itemMax = this.m_pCollection.source.length;
            // let scrollMax = this.m_listGenHead.contentWidth - this.m_itemScroll.width;
            // let targetW = Math.floor(scrollMax * this.m_nCurIndex / (itemMax - 1));
            // targetW = Math.max(0, targetW);
            // targetW = Math.min(scrollMax, targetW);
            this.m_listGenHead.scrollH = this.m_nScrollH;

        }

        /**设置当前选中武将下标 */
        private setCurSelected(index: number) {
            if (this.m_nCurIndex == index) {
                this.refrestSelItem(this.m_nCurIndex, true);
                return;
            }
            this.refrestSelItem(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.refrestSelItem(this.m_nCurIndex, true);
            let data = this.m_pCollection.getItemAt(this.m_nCurIndex) as IEqGenRD;
            if (data) {
                this.refreshGeneralInfo(data.id);
            }
        }

        /**刷新选中武将 */
        private refrestSelItem(index: number, val: boolean) {
            let data = this.m_pCollection.getItemAt(index) as IEqGenRD;
            if (data) {
                data.sel = val;
                this.m_pCollection.replaceItemAt(data, index);
            }
        }

        /**刷新ui显示 */
        private refreshGeneralInfo(generalId: number) {
            let vo = GeneralModel.getOwnGeneral(generalId);
            if (!vo) return;
            this.m_nCurGenVo = vo;

            /**刷新武将选择 */
            for (let i = 0; i < 4; i++) {
                (this[`m_equipViewComp${i}`] as EquipBaseComp).generalId = generalId;
            }
            if (!generalId || generalId <= 0) {
                this.m_imgRoleBg.visible = true;
            } else {
                this.m_imgRoleBg.visible = false;
                let cfg = GeneralModel.getGeneralConfig(generalId);
                this.m_imgRole.source = GeneralModel.getSoldierBigLogo(cfg.role);
            }



            /**刷新装备 */
            this.refreshEquipItems();
            this.changeTipsData();
            this.refreshFightNum(false);
            this.getWearState();

            RedPointModel.AddInfoListener(this.m_btnEquip, { x: 210, y: -3, scale: 0.78 }, [RedEvtType.GEN_EQUIP], 2, { generalId: generalId });
            RedPointModel.AddInfoListener(this.m_btnAllUpLv, { x: 210, y: -3, scale: 0.78 }, [RedEvtType.GEN_EQ_LV], 2, { generalId: generalId });
            RedPointModel.AddInfoListener(this.m_btnAllUpGrade, { x: 210, y: -3, scale: 0.78 }, [RedEvtType.GEN_EQ_GRADE], 2, { generalId: generalId });
            RedPointModel.AddInfoListener(this.m_btnAllWrought, { x: 210, y: -3, scale: 0.78 }, [RedEvtType.GEN_EQ_WROUGHT], 2, { generalId: generalId });
        }

        /**刷新战力 */
        private refreshFightNum(isAction: boolean = true) {
            if (!this.m_nCurGenVo) return;
            if (isAction) {
                let oldFight = this.m_comFightItem.getFight();;
                let change = this.m_nCurGenVo.fight - oldFight;
                if (change == 0) return;
                let res = change > 0 ? GCodeFromat(CLEnum.FIGHT_ADD, change) : GCodeFromat(CLEnum.FIGHT_CUT, change);
                if (change > 0) TipsUtils.showTipsFightUp(res, new egret.Point(0, 0), this.m_pFightEffRoot);
                this.m_comFightItem.setFight(this.m_nCurGenVo.fight, true);
            } else {
                this.m_comFightItem.setFight(this.m_nCurGenVo.fight);
            }
        }

        /**刷新子卡 */
        private refreshCompView(tabId: number = -1) {
            if (tabId >= 0) {
                (this[`m_equipViewComp${tabId}`] as EquipBaseComp).refreshView();
            } else {
                for (let i = 0; i < 4; i++) {
                    (this[`m_equipViewComp${i}`] as EquipBaseComp).refreshView();
                }
            }
        }

        /**设置选中装备 */
        private setCurEquipPos(pos: number) {
            if (this.m_nCurEquipPos == pos) return;
            this.m_nCurEquipPos = pos;

            /**刷新武将选择 */
            for (let i = 0; i < 4; i++) {
                (this[`m_equipViewComp${i}`] as EquipBaseComp).equipPos = pos;
                let item = this[`m_equip${i}`] as EquipItem;
                if (item.pos == pos) {
                    item.addChild(this.m_imgSelect);
                }
            }
        }

        /**刷新装备显示 */
        private refreshEquipItems(isAction: boolean = false) {
            if (!this.m_nCurGenVo) return;
            let change = 0;
            let title = '';
            let eqItemId = 0;
            for (let i = 0; i < 4; i++) {
                let item = this[`m_equip${i}`] as EquipItem;
                let data = this.m_nCurGenVo.getEquipByPos(i);
                if (data) {
                    let itemId = -1;
                    if (data.equipmentUuid > 0) {
                        let eqVo = EquipModel.getEquipVoByUId(data.equipmentUuid);
                        itemId = eqVo.equipmentId;
                        eqItemId = eqVo.equipmentId;
                    }
                    switch (this.m_nCurTagIndex) {
                        case 0: {
                            // item.currentState = 'equip_info';
                            // item.setItemInfo(itemId);
                            // item.setInfoGroupVis(false);
                            // let boo = itemId > 0 ? true : false;
                            // item.setInfoGroup(boo);
                            // item.reStreng(data.strengthen);
                            // item.reLevel(data.grade);
                            // item.reWrought(data.wrought);
                            let eqVo = EquipModel.getEquipVoByUId(data.equipmentUuid);
                            if (isNull(eqVo)) {
                                item.setInfoGroupVis(false);
                                item.setItemInfo(0);
                                break;
                            }
                            let level = eqVo.itemCfg.level;
                            item.currentState = 'info';
                            title = GCode(CLEnum.LEVEL2);
                            let color = GameConfig.TextColors.white;
                            item.setInfoGroupVis(true);
                            change = Number(item.m_labLv.text);
                            item.setItemInfo(itemId, level, title, this.m_nCurTagIndex, color);
                            change = data.strengthen - change;
                            break;
                        }
                        case 1: {
                            item.currentState = 'info';
                            title = GCode(CLEnum.EQUIP_TAB_QH);
                            let color = GameConfig.TextColors.white;
                            item.setInfoGroupVis(true);
                            change = Number(item.m_labLv.text);
                            item.setItemInfo(itemId, data.strengthen, title, this.m_nCurTagIndex, color);
                            change = data.strengthen - change;
                            break;
                        }
                        case 2: {
                            item.currentState = 'info';
                            title = GCode(CLEnum.EQUIP_TITLE_SJJS);
                            let color = GameConfig.TextColors.green;
                            item.setInfoGroupVis(true);
                            change = Number(item.m_labLv.text);
                            item.setItemInfo(itemId, data.grade, title, this.m_nCurTagIndex, color);
                            change = data.grade - change;
                            break;
                        }
                        case 3: {
                            item.currentState = 'info';
                            title = GCode(CLEnum.EQUIP_TAB_JL);
                            let color = GameConfig.TextColors.green;
                            item.setInfoGroupVis(true);
                            change = Number(item.m_labLv.text);
                            item.setItemInfo(itemId, data.wrought, title, this.m_nCurTagIndex, color);
                            change = data.wrought - change;
                            break;
                        }
                    }
                }

                if (isAction && change > 0) {
                    let pos = item.localToGlobal(-item.width, item.height * 0.5);
                    TipsUtils.showTipsNormalUp(`<font color = #00ff00>${title}+${change}</font>`, pos, this);
                    item.createUpGradeEffect();
                }
            }
            this.refreshEquipTips();
            this.refreshBtnLab();
        }
        /**刷新装备tips */
        private refreshEquipTips() {
            for (let i = 0; i < 4; i++) {
                let item = this[`m_equip${i}`] as EquipItem;
                item.setFightState(this.getFightState(i));
            }
        }
        /**刷新按钮描述 */
        private refreshBtnLab() {
            let str: string;
            let minLevel = EquipModel.getMinEquipLevel(this.m_nCurGenVo.generalId, this.m_nCurTagIndex);
            if (this.m_nCurTagIndex == 1) {
                str = minLevel >= 60 ? GCode(CLEnum.EQUIP_TAB_QH) : GCode(CLEnum.EQUIP_ZB_YJQH);
            } else if (this.m_nCurTagIndex == 2) {
                str = minLevel >= 60 ? GCode(CLEnum.EQUIP_TAB_SJ) : GCode(CLEnum.EQUIP_ZB_YJSJ);
            } else {
                str = minLevel >= 60 ? GCode(CLEnum.EQUIP_TAB_JL) : GCode(CLEnum.EQUIP_ZB_YJJL);
            }
            this.m_btnAllUpLv.setTitleLabel(str);
            this.m_btnAllUpGrade.setTitleLabel(str);
            this.m_btnAllWrought.setTitleLabel(str);

        }

        /**刷新头像tips */
        private refreshGenItemsTips(isUpdate: boolean = false) {
            for (let i = 0; i < this.m_pCollection.source.length; i++) {
                let data: IEqGenRD = this.m_pCollection.getItemAt(i);
                let vo = GeneralModel.getOwnGeneral(data.id);

                switch (this.m_nCurTagIndex) {
                    case 0: {    //可装备
                        data.redState = false
                        data.upState = vo.canEquip();
                        break;
                    }
                    case 1: {    //可升级
                        data.upState = vo.canEquipLv();
                        data.redState = false;
                        break;
                    }
                    case 2: {    //可升阶
                        data.upState = vo.canEquipGrade();
                        data.redState = false;
                        break;
                    }
                    case 3: {    //可精炼
                        data.upState = vo.canEquipWrought();
                        data.redState = false;
                        break;
                    }
                }
                if (isUpdate) this.m_pCollection.replaceItemAt(data, i);
            }
            if (isUpdate) return;
            this.m_pCollection.source.sort((a: IEqGenRD, b: IEqGenRD) => {
                return GeneralModel.getOwnGeneral(b.id).fight - GeneralModel.getOwnGeneral(a.id).fight
            });
            for (let i = 0; i < this.m_pCollection.source.length; i++) {
                let data = this.m_pCollection.getItemAt(i) as IEqGenRD;
                if (data.sel) {
                    this.m_nCurIndex = i;
                }
            }
            this.m_pCollection.refresh()
            this.m_nScrollH = this.m_listGenHead.scrollH;
            Utils.TimerManager.doFrame(3, 1, this.fixGeneralHeadsPos, this);
        }

        /**改变tips */
        private changeTipsData() {
            if (this.m_nCurTagIndex == 0) return;
            this.m_currTipType = this.m_nCurTagIndex - 1;
            this.m_currTipData = { type: this.m_currTipType, generalId: this.m_nCurGenVo.generalId };
            this.getBonus();
            // CTipsManager.addTips(this.m_pTipsCon, { type: TipsEnum.EquipAdd, param: m_currTipData, posType: 1 })

        }
        /**加成大师显示 */
        private getBonus() {
            let dec = [GCode(CLEnum.EQUIP_QHJC), GCode(CLEnum.EQUIP_SJJC), GCode(CLEnum.EQUIP_JLJC)]
            let levels = EquipModel.getEqSumLevelsByType(this.m_currTipType);
            let vo = GeneralModel.getOwnGeneral(this.m_nCurGenVo.generalId);
            if (!levels || !vo) return;
            let curLv = levels[levels.length - 1];
            let decStr: string;
            for (let i = 0; i < 4; i++) {
                let equip = vo.getEquipByPos(i);
                if (this.m_currTipType == 1) {
                    if (curLv > equip.grade) curLv = equip.grade;
                } else if (this.m_currTipType == 2) {
                    if (curLv > equip.wrought) curLv = equip.wrought;
                } else {
                    if (curLv > equip.strengthen) curLv = equip.strengthen;
                }
            }
            let index = -1;
            for (let i = 0; i < levels.length; i++) {
                if (curLv >= levels[i]) {
                    index = i;
                }
            }
            let attris: string;
            if (index == -1) {
                attris = dec[this.m_currTipType];
                this.m_labUpLv.text = attris;
                this.m_btnAllUpLv.visible = true;
                this.m_btnAllWrought.visible = true;
                this.m_btnAllUpGrade.visible = true;
                return;
            }
            attris = dec[this.m_currTipType] + GCodeFromat(CLEnum.EQUIP_DS_COLOR, levels[index]);
            this.m_labUpLv.textFlow = Utils.htmlParser(attris);

            if (this.m_currTipType == 1) {
                this.m_btnAllUpGrade.visible = curLv >= levels[levels.length - 1] ? false : true;
            } else if (this.m_currTipType == 2) {
                this.m_btnAllWrought.visible = curLv >= levels[levels.length - 1] ? false : true;
            } else {
                this.m_btnAllUpLv.visible = curLv >= levels[levels.length - 1] ? false : true;
            }
        }
        /**切换选项卡 */
        public changeTag(index: number) {
            if (this.m_nCurTagIndex == index) return;
            this.m_nCurTagIndex = index;
            for (let i = 0; i < 4; i++) {
                let isShow = i == index;
                this[`m_pTabView${i}`].visible = isShow;
                this[`m_equipViewComp${i}`].visible = isShow;
            }
            //第一卡不显示选中框
            if (index == 0) {
                this.m_imgSelect.visible = false;
                this.m_pTipsCon.visible = false;
            } else {
                this.m_imgSelect.visible = true;
                this.m_pTipsCon.visible = true;
            }

            this.onGuideCondition();

            /**更新装备显示状态 */
            this.refreshEquipItems();
            this.changeTipsData();
            this.refreshGenItemsTips(true);

            /**检查新手引导面板条件 */
            let cds = [IGUIDECD.EQUIP_TAB_EQ, IGUIDECD.EQUIP_TAB_UP, IGUIDECD.EQUIP_TAB_GR, IGUIDECD.EQUIP_TAB_WR]
            this.onGuideTabCondition(cds[index]);
        }

        /**
         * 获得装备格子 tips 
         * @param generalId 武将id  
         * @param pos 装备格子位置
         **/
        public getFightState(pos: IEquipPos) {
            let tab = this.m_nCurTagIndex;
            let genVo = this.m_nCurGenVo;
            if (!genVo) return 0;

            switch (tab) {
                case 0: {
                    return genVo.canEquip(pos) ? 1 : 0;
                }
                case 1: {
                    return genVo.canEquipLv(pos) ? 1 : 0;
                }
                case 2: {  //第三卡(进阶)
                    return genVo.canEquipGrade(pos) ? 1 : 0;
                }
                case 3: {//第四卡(精炼)
                    return genVo.canEquipWrought(pos) ? 1 : 0;
                }
            }
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */

        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnEquip, this, this.onBtnEquip);
            // EventManager.addTouchScaleListener(this.m_btnUnEquip, this, this.onBtnUnEquip);
            EventManager.addTouchScaleListener(this.m_pTipsCon, this, this.onBtnTipsCon);

            EventManager.addTouchScaleListener(this.m_btnAllUpLv, this, this.onBtnAllUpLv);
            EventManager.addTouchScaleListener(this.m_btnAllUpGrade, this, this.onBtnAllGrade);
            EventManager.addTouchScaleListener(this.m_btnAllWrought, this, this.onBtnAllWrought);


            for (let i = 0; i < 4; i++) {
                EventManager.addTouchTapListener(this[`m_equip${i}`], this, this.onEquipItem);
            }

            EventManager.addTouchScaleListener(this.m_btnLeft, this, this.onBtnLeft);
            EventManager.addTouchScaleListener(this.m_btnRight, this, this.onBtnRight);

            EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
            EventMgr.addEvent(GeneralEvent.GENERAL_EQ_COMPOSE, this.getWearState, this);



        }

        /**移除事件 */
        private removeEvent() {
            this.m_listGenHead.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickGenHead, this);
            this.m_itemScroll.removeEventListener(egret.Event.CHANGE, this.onScrollChange, this)
            EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            EventMgr.removeEventByObject(GeneralEvent.GENERAL_EQ_COMPOSE, this);
        }
        /**道具数量变化刷新事件 */
        private onPropItemChange() {
            this.refreshEquipItems();
        }
        /**滚动 */
        private onScrollChange() {
            this.m_btnLeft.visible = true;
            this.m_btnRight.visible = true;
            if ((this.m_listGenHead.scrollH + this.m_itemScroll.width) >= this.m_listGenHead.contentWidth) {
                this.m_btnRight.visible = false;
            }
            if (this.m_listGenHead.scrollH <= 0) this.m_btnLeft.visible = false;
        }
        /**左 */
        private onBtnLeft() {
            let next = this.m_listGenHead.scrollH - this.m_itemScroll.width;
            next = Math.max(0, next);
            this.m_listGenHead.scrollH = next;
            this.onScrollChange();
        }
        /**右 */
        private onBtnRight() {
            let next = this.m_listGenHead.scrollH + this.m_itemScroll.width;
            next = Math.min(this.m_listGenHead.contentWidth - this.m_itemScroll.width, next);
            this.m_listGenHead.scrollH = next;
            this.onScrollChange();
        }

        /**装备格子选中 */
        private onEquipItem(e: egret.Event) {
            let item = e.currentTarget as EquipItem;
            //首页为装备穿戴
            if (this.m_nCurTagIndex == 0) {
                let equip = this.m_nCurGenVo.getEquipByPos(item.pos);
                if (equip.equipmentUuid > 0) {
                    //卸装装备
                    // EquipProxy.C2S_GENERAL_EQUIP(this.m_nCurGenVo.generalId, equip.id, number.fromValue(0));
                    Utils.open_view(TASK_UI.POP_EQUIP_WEAR_INFO_WND, { generalId: this.m_nCurGenVo.generalId, pos: equip.id })

                } else {
                    if (EquipModel.getGenCanEquips(equip.equipmentUuid, equip.id).length == 0) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_ZB_FAL), 1, true);
                        return;
                    }
                    Utils.open_view(TASK_UI.POP_EQUIP_SEL_WND, { generalId: this.m_nCurGenVo.generalId, pos: equip.id })
                }
                return;
            }

            if (item) {
                this.setCurEquipPos(item.pos);
            }
        }

        /**一键装备 */
        private onBtnEquip() {
            if (this.wearState == IEquipWearEnum.Wear) {
                if (this.isChange) {
                    EquipProxy.C2S_GENERAL_EQUIP_ALL(this.m_nCurGenVo.generalId, this.res);
                } else {
                    EffectUtils.showTips(GCode(CLEnum.EQUIP_ZB_FAL), 1, true);
                }
            } else {

                this.onBtnUnEquip();
            }
        }
        /**获取当前武将穿戴状态 */
        private getWearState() {
            // let res: number[] = []
            this.res = [];
            this.isChange = false;
            for (let i = 0; i < 4; i++) {
                let equip = this.m_nCurGenVo.getEquipByPos(i);
                let fight = 0;
                if (equip.equipmentUuid > 0) {
                    let eqVo = EquipModel.getEquipVoByUId(equip.equipmentUuid);
                    fight = eqVo.fight;
                }
                let list = EquipModel.getGenCanEquips(equip.equipmentUuid, i);
                let newId: number = equip.equipmentUuid;

                for (let k = 0; k < list.length; k++) {
                    //没有武将
                    if (list[k].generalId == 0 && list[k].fight > fight) {
                        fight = list[k].fight;
                        newId = list[k].uuid;
                        this.isChange = true;
                    }
                }
                this.res.push(newId);
            }
            if (this.isWearBoo()) {
                if (this.isChange) {
                    this.m_btnEquip.setTitleLabel(GCode(CLEnum.EQUIP_ZB_YJZB));
                    this.m_btnEquip.currentState = 'style2';
                    this.wearState = IEquipWearEnum.Wear;
                } else {
                    this.m_btnEquip.setTitleLabel(GCode(CLEnum.EQUIP_ZB_YJXZ));
                    this.m_btnEquip.currentState = 'style3';
                    this.wearState = IEquipWearEnum.noWear;
                }
            } else {
                this.m_btnEquip.setTitleLabel(GCode(CLEnum.EQUIP_ZB_YJZB));
                this.wearState = IEquipWearEnum.Wear;
            }
        }
        /**是否有穿戴装备 */
        private isWearBoo() {
            let isWear: boolean = false;
            for (let i in this.res) {
                if (this.res[i] > 0) {
                    isWear = true;
                }
            }
            return isWear;
        }

        /**一键卸下 */
        private onBtnUnEquip() {
            let isUnEquip: boolean = false;
            for (let i = 0; i < 4; i++) {
                let equip = this.m_nCurGenVo.getEquipByPos(i);
                if (equip.equipmentUuid > 0) {
                    isUnEquip = true;
                    break;
                }
            }
            if (isUnEquip) {
                let res: number[] = [];
                for (let i = 0; i < 4; i++) {
                    res.push(0);
                }
                EquipProxy.C2S_GENERAL_EQUIP_ALL(this.m_nCurGenVo.generalId, res);
            }
        }

        /**一键升级 */
        private onBtnAllUpLv() {
            let genVo = this.m_nCurGenVo;
            if (!genVo) return;
            for (let i = 0; i < EquipModel.POS_LIST.length; i++) {
                let pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipLv(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Level);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    let equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Level)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_QH_TIPS), 1, true);
                        return;
                    }
                    let cfg = EquipModel.getLevelCfg(pos, equip.strengthen);
                    let costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        }

        /**一键升阶 */
        private onBtnAllGrade() {
            let genVo = this.m_nCurGenVo;
            if (!genVo) return;

            for (let i = 0; i < EquipModel.POS_LIST.length; i++) {
                let pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipGrade(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Grade);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    let equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Grade)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_SJ_TIPS), 1, true);
                        return;
                    }

                    let cfg = EquipModel.getGradeCfg(pos, equip.grade);
                    let costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        }

        /**一键精炼 */
        private onBtnAllWrought() {
            let genVo = this.m_nCurGenVo;
            if (!genVo) return;

            for (let i = 0; i < EquipModel.POS_LIST.length; i++) {
                let pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipWrought(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Wrought);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    let equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Wrought)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_JL_TIPS), 1, true);
                        return;
                    }

                    let cfg = EquipModel.getWroughtCfg(pos, equip.wrought);
                    let costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        }

        /**打开加成界面 */
        private onBtnTipsCon() {
            Utils.open_view(TASK_UI.POP_EQUIP_ADD_WND, this.m_currTipData);
        }
        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */

        /**检查新手引导面板条件 */
        public onGuideTabCondition(id: IGUIDECD) {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, id);
        }

    }

    interface IEqGenRD {
        id: number,
        sel: boolean,
        redState: boolean,
        upState: boolean,
    }
    /**
    * 英雄头像Item
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    class EquipGenRender extends eui.ItemRenderer {
        protected m_headRender: GeneralHeadRender;
        protected m_imgSelected: eui.Image;
        protected m_imgRed: eui.Image;
        protected m_imgUp: eui.Image;

        protected m_tData: IEqGenRD;
        public constructor() {
            super();
            this.width = 100;
            this.height = 100;
        }

        $onRemoveFromStage(): void {
            this.removeEffect();
            this.m_headRender.onDestroy();
            super.$onRemoveFromStage();

        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_headRender = GeneralHeadRender.create("base_info");
            this.addChild(this.m_headRender);
            NodeUtils.setScale(this.m_headRender, 0.76);

            this.m_imgSelected = new eui.Image('small_general_head_light_png');
            this.m_imgSelected.x = -10;
            this.m_imgSelected.y = -10;
            NodeUtils.setScale(this.m_imgSelected, 0.76);
            this.m_imgSelected.visible = false;
            this.addChild(this.m_imgSelected);

            this.m_imgRed = new eui.Image('common_red_flag2_png');
            this.m_imgRed.x = 82;
            this.m_imgRed.y = -3;
            NodeUtils.setScale(this.m_imgRed, 0.8);
            this.m_imgRed.visible = false;
            this.addChild(this.m_imgRed);

            this.m_imgUp = new eui.Image('com_state_up_png');
            this.m_imgUp.x = 74;
            this.m_imgUp.y = 5;
            this.m_imgUp.visible = false;
            this.addChild(this.m_imgUp);
        }


        protected dataChanged() {
            this.m_tData = this.data;
            this.m_headRender.setGenId(this.m_tData.id);
            this.m_imgSelected.visible = this.m_tData.sel == true;
            this.m_imgRed.visible = this.m_tData.redState;
            this.m_imgUp.y = 5;
            this.removeEffect();
            if (!this.m_tData.redState) {
                this.m_imgUp.visible = this.m_tData.upState;
                this.addUpEffect();
            } else {
                this.m_imgUp.visible = false;
            }
        }
        public addUpEffect() {
            let targetY: number = 5;
            let tw = egret.Tween.get(this.m_imgUp, { loop: true }).to({ y: targetY - 7 }, 500).to({ y: targetY }, 500);

        }
        public removeEffect() {
            egret.Tween.removeTweens(this.m_imgUp);
        }
    }
}