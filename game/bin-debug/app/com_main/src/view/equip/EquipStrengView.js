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
    var EquipStrengView = /** @class */ (function (_super_1) {
        __extends(EquipStrengView, _super_1);
        function EquipStrengView(width, height, generalId) {
            var _this = _super_1.call(this) || this;
            _this.m_currTipType = 0; //当前选择tip类型;
            _this.isChange = false; //是否可装备
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
            _this.m_nScrollH = 0;
            _this.name = EquipStrengView.NAME;
            _this.initApp("equip/EquipStrengViewSkin.exml");
            _this.width = width;
            _this.height = height;
            _this.m_nGeneralId = generalId;
            return _this;
        }
        EquipStrengView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_GENERAL_EQUIP,
                ProtoDef.S2C_GENERAL_EQUIP_ALL,
                ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE,
                ProtoDef.S2C_EQUIPMENT_ADD,
                ProtoDef.S2C_EQUIPMENT_DEL
            ];
        };
        /**处理协议号事件 */
        EquipStrengView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_GENERAL_EQUIP:
                case ProtoDef.S2C_GENERAL_EQUIP_ALL: {
                    if (body.errorCode > 0)
                        return;
                    this.refreshFightNum();
                    // this.refreshGeneralHeads();
                    this.refreshEquipItems();
                    this.refreshCompView(0); //主面板信息刷新
                    this.refreshCompView(2); //升阶面板 隐藏显示刷新
                    this.refreshGenItemsTips();
                    this.getWearState();
                    break;
                }
                case ProtoDef.S2C_EQUIPMENT_SLOT_UPGRADE: { //强化
                    // 升级类型 0-2 : 0-强化, 1-升阶, 2-精炼
                    var data = body;
                    var type = data.upgradeType;
                    this.refreshFightNum();
                    // this.refreshGeneralHeads();
                    this.refreshEquipItems(true);
                    this.refreshCompView(0); //主卡刷新
                    this.refreshGenItemsTips();
                    // 卡槽对应关系 1强化 2升阶 3精炼
                    this.refreshCompView(type + 1);
                    this.getBonus(); //刷新（强化，升阶，精炼）大师
                }
                case ProtoDef.S2C_EQUIPMENT_ADD:
                case ProtoDef.S2C_EQUIPMENT_DEL: {
                    this.refreshEquipTips();
                    this.refreshGenItemsTips();
                    break;
                }
            }
        };
        EquipStrengView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        EquipStrengView.prototype.onDestroy = function () {
            Utils.TimerManager.remove(this.fixGeneralHeadsPos, this);
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        EquipStrengView.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnEquip.setTitleLabel(GCode(CLEnum.EQUIP_ZB_YJZB));
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listGenHead.dataProvider = this.m_pCollection;
            this.m_listGenHead.itemRenderer = EquipGenRender;
            this.m_listGenHead.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickGenHead, this);
            this.m_listGenHead.useVirtualLayout = true;
            this.initGeneralHeadItems();
            egret.callLater(function () {
                if (_this.m_listGenHead) {
                    _this.m_listGenHead.width = _this.m_itemScroll.width - 30;
                    _this.m_listGenHead.validateNow();
                    if (_this.m_listGenHead.contentWidth > _this.m_itemScroll.width) {
                        _this.m_bScrollBtn = true;
                        _this.m_btnLeft.visible = false;
                        _this.m_btnRight.visible = true;
                        _this.m_itemScroll.addEventListener(egret.Event.CHANGE, _this.onScrollChange, _this);
                    }
                    else {
                        _this.m_btnLeft.visible = false;
                        _this.m_btnRight.visible = false;
                    }
                }
            }, this);
            //初始化格子位置
            for (var i = 0; i < 4; i++) {
                this["m_equip" + i].pos = i;
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
        };
        /**点击头像回调 */
        EquipStrengView.prototype.onClickGenHead = function (e) {
            this.setCurSelected(e.itemIndex);
            this.m_nGeneralId = e.item.id;
        };
        /**初始化头像列表 */
        EquipStrengView.prototype.initGeneralHeadItems = function () {
            var list = GeneralModel.getOwnGeneralWithSortFight();
            var curIndex = 0;
            var heroArr = [];
            for (var i = 0; i < list.length; i++) {
                var vo = list[i];
                var data = { id: vo.generalId, sel: false, redState: false, upState: false };
                heroArr.push(data);
                if (vo.generalId == this.m_nGeneralId)
                    curIndex = i;
            }
            this.m_pCollection.replaceAll(heroArr);
            this.setCurSelected(curIndex);
        };
        EquipStrengView.prototype.fixGeneralHeadsPos = function () {
            // let itemMax = this.m_pCollection.source.length;
            // let scrollMax = this.m_listGenHead.contentWidth - this.m_itemScroll.width;
            // let targetW = Math.floor(scrollMax * this.m_nCurIndex / (itemMax - 1));
            // targetW = Math.max(0, targetW);
            // targetW = Math.min(scrollMax, targetW);
            this.m_listGenHead.scrollH = this.m_nScrollH;
        };
        /**设置当前选中武将下标 */
        EquipStrengView.prototype.setCurSelected = function (index) {
            if (this.m_nCurIndex == index) {
                this.refrestSelItem(this.m_nCurIndex, true);
                return;
            }
            this.refrestSelItem(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.refrestSelItem(this.m_nCurIndex, true);
            var data = this.m_pCollection.getItemAt(this.m_nCurIndex);
            if (data) {
                this.refreshGeneralInfo(data.id);
            }
        };
        /**刷新选中武将 */
        EquipStrengView.prototype.refrestSelItem = function (index, val) {
            var data = this.m_pCollection.getItemAt(index);
            if (data) {
                data.sel = val;
                this.m_pCollection.replaceItemAt(data, index);
            }
        };
        /**刷新ui显示 */
        EquipStrengView.prototype.refreshGeneralInfo = function (generalId) {
            var vo = GeneralModel.getOwnGeneral(generalId);
            if (!vo)
                return;
            this.m_nCurGenVo = vo;
            /**刷新武将选择 */
            for (var i = 0; i < 4; i++) {
                this["m_equipViewComp" + i].generalId = generalId;
            }
            if (!generalId || generalId <= 0) {
                this.m_imgRoleBg.visible = true;
            }
            else {
                this.m_imgRoleBg.visible = false;
                var cfg = GeneralModel.getGeneralConfig(generalId);
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
        };
        /**刷新战力 */
        EquipStrengView.prototype.refreshFightNum = function (isAction) {
            if (isAction === void 0) { isAction = true; }
            if (!this.m_nCurGenVo)
                return;
            if (isAction) {
                var oldFight = this.m_comFightItem.getFight();
                ;
                var change = this.m_nCurGenVo.fight - oldFight;
                if (change == 0)
                    return;
                var res = change > 0 ? GCodeFromat(CLEnum.FIGHT_ADD, change) : GCodeFromat(CLEnum.FIGHT_CUT, change);
                if (change > 0)
                    TipsUtils.showTipsFightUp(res, new egret.Point(0, 0), this.m_pFightEffRoot);
                this.m_comFightItem.setFight(this.m_nCurGenVo.fight, true);
            }
            else {
                this.m_comFightItem.setFight(this.m_nCurGenVo.fight);
            }
        };
        /**刷新子卡 */
        EquipStrengView.prototype.refreshCompView = function (tabId) {
            if (tabId === void 0) { tabId = -1; }
            if (tabId >= 0) {
                this["m_equipViewComp" + tabId].refreshView();
            }
            else {
                for (var i = 0; i < 4; i++) {
                    this["m_equipViewComp" + i].refreshView();
                }
            }
        };
        /**设置选中装备 */
        EquipStrengView.prototype.setCurEquipPos = function (pos) {
            if (this.m_nCurEquipPos == pos)
                return;
            this.m_nCurEquipPos = pos;
            /**刷新武将选择 */
            for (var i = 0; i < 4; i++) {
                this["m_equipViewComp" + i].equipPos = pos;
                var item = this["m_equip" + i];
                if (item.pos == pos) {
                    item.addChild(this.m_imgSelect);
                }
            }
        };
        /**刷新装备显示 */
        EquipStrengView.prototype.refreshEquipItems = function (isAction) {
            if (isAction === void 0) { isAction = false; }
            if (!this.m_nCurGenVo)
                return;
            var change = 0;
            var title = '';
            var eqItemId = 0;
            for (var i = 0; i < 4; i++) {
                var item = this["m_equip" + i];
                var data = this.m_nCurGenVo.getEquipByPos(i);
                if (data) {
                    var itemId = -1;
                    if (data.equipmentUuid > 0) {
                        var eqVo = EquipModel.getEquipVoByUId(data.equipmentUuid);
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
                            var eqVo = EquipModel.getEquipVoByUId(data.equipmentUuid);
                            if (isNull(eqVo)) {
                                item.setInfoGroupVis(false);
                                item.setItemInfo(0);
                                break;
                            }
                            var level = eqVo.itemCfg.level;
                            item.currentState = 'info';
                            title = GCode(CLEnum.LEVEL2);
                            var color = GameConfig.TextColors.white;
                            item.setInfoGroupVis(true);
                            change = Number(item.m_labLv.text);
                            item.setItemInfo(itemId, level, title, this.m_nCurTagIndex, color);
                            change = data.strengthen - change;
                            break;
                        }
                        case 1: {
                            item.currentState = 'info';
                            title = GCode(CLEnum.EQUIP_TAB_QH);
                            var color = GameConfig.TextColors.white;
                            item.setInfoGroupVis(true);
                            change = Number(item.m_labLv.text);
                            item.setItemInfo(itemId, data.strengthen, title, this.m_nCurTagIndex, color);
                            change = data.strengthen - change;
                            break;
                        }
                        case 2: {
                            item.currentState = 'info';
                            title = GCode(CLEnum.EQUIP_TITLE_SJJS);
                            var color = GameConfig.TextColors.green;
                            item.setInfoGroupVis(true);
                            change = Number(item.m_labLv.text);
                            item.setItemInfo(itemId, data.grade, title, this.m_nCurTagIndex, color);
                            change = data.grade - change;
                            break;
                        }
                        case 3: {
                            item.currentState = 'info';
                            title = GCode(CLEnum.EQUIP_TAB_JL);
                            var color = GameConfig.TextColors.green;
                            item.setInfoGroupVis(true);
                            change = Number(item.m_labLv.text);
                            item.setItemInfo(itemId, data.wrought, title, this.m_nCurTagIndex, color);
                            change = data.wrought - change;
                            break;
                        }
                    }
                }
                if (isAction && change > 0) {
                    var pos = item.localToGlobal(-item.width, item.height * 0.5);
                    TipsUtils.showTipsNormalUp("<font color = #00ff00>" + title + "+" + change + "</font>", pos, this);
                    item.createUpGradeEffect();
                }
            }
            this.refreshEquipTips();
            this.refreshBtnLab();
        };
        /**刷新装备tips */
        EquipStrengView.prototype.refreshEquipTips = function () {
            for (var i = 0; i < 4; i++) {
                var item = this["m_equip" + i];
                item.setFightState(this.getFightState(i));
            }
        };
        /**刷新按钮描述 */
        EquipStrengView.prototype.refreshBtnLab = function () {
            var str;
            var minLevel = EquipModel.getMinEquipLevel(this.m_nCurGenVo.generalId, this.m_nCurTagIndex);
            if (this.m_nCurTagIndex == 1) {
                str = minLevel >= 60 ? GCode(CLEnum.EQUIP_TAB_QH) : GCode(CLEnum.EQUIP_ZB_YJQH);
            }
            else if (this.m_nCurTagIndex == 2) {
                str = minLevel >= 60 ? GCode(CLEnum.EQUIP_TAB_SJ) : GCode(CLEnum.EQUIP_ZB_YJSJ);
            }
            else {
                str = minLevel >= 60 ? GCode(CLEnum.EQUIP_TAB_JL) : GCode(CLEnum.EQUIP_ZB_YJJL);
            }
            this.m_btnAllUpLv.setTitleLabel(str);
            this.m_btnAllUpGrade.setTitleLabel(str);
            this.m_btnAllWrought.setTitleLabel(str);
        };
        /**刷新头像tips */
        EquipStrengView.prototype.refreshGenItemsTips = function (isUpdate) {
            if (isUpdate === void 0) { isUpdate = false; }
            for (var i = 0; i < this.m_pCollection.source.length; i++) {
                var data = this.m_pCollection.getItemAt(i);
                var vo = GeneralModel.getOwnGeneral(data.id);
                switch (this.m_nCurTagIndex) {
                    case 0: { //可装备
                        data.redState = false;
                        data.upState = vo.canEquip();
                        break;
                    }
                    case 1: { //可升级
                        data.upState = vo.canEquipLv();
                        data.redState = false;
                        break;
                    }
                    case 2: { //可升阶
                        data.upState = vo.canEquipGrade();
                        data.redState = false;
                        break;
                    }
                    case 3: { //可精炼
                        data.upState = vo.canEquipWrought();
                        data.redState = false;
                        break;
                    }
                }
                if (isUpdate)
                    this.m_pCollection.replaceItemAt(data, i);
            }
            if (isUpdate)
                return;
            this.m_pCollection.source.sort(function (a, b) {
                return GeneralModel.getOwnGeneral(b.id).fight - GeneralModel.getOwnGeneral(a.id).fight;
            });
            for (var i = 0; i < this.m_pCollection.source.length; i++) {
                var data = this.m_pCollection.getItemAt(i);
                if (data.sel) {
                    this.m_nCurIndex = i;
                }
            }
            this.m_pCollection.refresh();
            this.m_nScrollH = this.m_listGenHead.scrollH;
            Utils.TimerManager.doFrame(3, 1, this.fixGeneralHeadsPos, this);
        };
        /**改变tips */
        EquipStrengView.prototype.changeTipsData = function () {
            if (this.m_nCurTagIndex == 0)
                return;
            this.m_currTipType = this.m_nCurTagIndex - 1;
            this.m_currTipData = { type: this.m_currTipType, generalId: this.m_nCurGenVo.generalId };
            this.getBonus();
            // CTipsManager.addTips(this.m_pTipsCon, { type: TipsEnum.EquipAdd, param: m_currTipData, posType: 1 })
        };
        /**加成大师显示 */
        EquipStrengView.prototype.getBonus = function () {
            var dec = [GCode(CLEnum.EQUIP_QHJC), GCode(CLEnum.EQUIP_SJJC), GCode(CLEnum.EQUIP_JLJC)];
            var levels = EquipModel.getEqSumLevelsByType(this.m_currTipType);
            var vo = GeneralModel.getOwnGeneral(this.m_nCurGenVo.generalId);
            if (!levels || !vo)
                return;
            var curLv = levels[levels.length - 1];
            var decStr;
            for (var i = 0; i < 4; i++) {
                var equip = vo.getEquipByPos(i);
                if (this.m_currTipType == 1) {
                    if (curLv > equip.grade)
                        curLv = equip.grade;
                }
                else if (this.m_currTipType == 2) {
                    if (curLv > equip.wrought)
                        curLv = equip.wrought;
                }
                else {
                    if (curLv > equip.strengthen)
                        curLv = equip.strengthen;
                }
            }
            var index = -1;
            for (var i = 0; i < levels.length; i++) {
                if (curLv >= levels[i]) {
                    index = i;
                }
            }
            var attris;
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
            }
            else if (this.m_currTipType == 2) {
                this.m_btnAllWrought.visible = curLv >= levels[levels.length - 1] ? false : true;
            }
            else {
                this.m_btnAllUpLv.visible = curLv >= levels[levels.length - 1] ? false : true;
            }
        };
        /**切换选项卡 */
        EquipStrengView.prototype.changeTag = function (index) {
            if (this.m_nCurTagIndex == index)
                return;
            this.m_nCurTagIndex = index;
            for (var i = 0; i < 4; i++) {
                var isShow = i == index;
                this["m_pTabView" + i].visible = isShow;
                this["m_equipViewComp" + i].visible = isShow;
            }
            //第一卡不显示选中框
            if (index == 0) {
                this.m_imgSelect.visible = false;
                this.m_pTipsCon.visible = false;
            }
            else {
                this.m_imgSelect.visible = true;
                this.m_pTipsCon.visible = true;
            }
            this.onGuideCondition();
            /**更新装备显示状态 */
            this.refreshEquipItems();
            this.changeTipsData();
            this.refreshGenItemsTips(true);
            /**检查新手引导面板条件 */
            var cds = [IGUIDECD.EQUIP_TAB_EQ, IGUIDECD.EQUIP_TAB_UP, IGUIDECD.EQUIP_TAB_GR, IGUIDECD.EQUIP_TAB_WR];
            this.onGuideTabCondition(cds[index]);
        };
        /**
         * 获得装备格子 tips
         * @param generalId 武将id
         * @param pos 装备格子位置
         **/
        EquipStrengView.prototype.getFightState = function (pos) {
            var tab = this.m_nCurTagIndex;
            var genVo = this.m_nCurGenVo;
            if (!genVo)
                return 0;
            switch (tab) {
                case 0: {
                    return genVo.canEquip(pos) ? 1 : 0;
                }
                case 1: {
                    return genVo.canEquipLv(pos) ? 1 : 0;
                }
                case 2: { //第三卡(进阶)
                    return genVo.canEquipGrade(pos) ? 1 : 0;
                }
                case 3: { //第四卡(精炼)
                    return genVo.canEquipWrought(pos) ? 1 : 0;
                }
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        /**监听事件 */
        EquipStrengView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnEquip, this, this.onBtnEquip);
            // EventManager.addTouchScaleListener(this.m_btnUnEquip, this, this.onBtnUnEquip);
            com_main.EventManager.addTouchScaleListener(this.m_pTipsCon, this, this.onBtnTipsCon);
            com_main.EventManager.addTouchScaleListener(this.m_btnAllUpLv, this, this.onBtnAllUpLv);
            com_main.EventManager.addTouchScaleListener(this.m_btnAllUpGrade, this, this.onBtnAllGrade);
            com_main.EventManager.addTouchScaleListener(this.m_btnAllWrought, this, this.onBtnAllWrought);
            for (var i = 0; i < 4; i++) {
                com_main.EventManager.addTouchTapListener(this["m_equip" + i], this, this.onEquipItem);
            }
            com_main.EventManager.addTouchScaleListener(this.m_btnLeft, this, this.onBtnLeft);
            com_main.EventManager.addTouchScaleListener(this.m_btnRight, this, this.onBtnRight);
            com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onPropItemChange, this);
            com_main.EventMgr.addEvent(GeneralEvent.GENERAL_EQ_COMPOSE, this.getWearState, this);
        };
        /**移除事件 */
        EquipStrengView.prototype.removeEvent = function () {
            this.m_listGenHead.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickGenHead, this);
            this.m_itemScroll.removeEventListener(egret.Event.CHANGE, this.onScrollChange, this);
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            com_main.EventMgr.removeEventByObject(GeneralEvent.GENERAL_EQ_COMPOSE, this);
        };
        /**道具数量变化刷新事件 */
        EquipStrengView.prototype.onPropItemChange = function () {
            this.refreshEquipItems();
        };
        /**滚动 */
        EquipStrengView.prototype.onScrollChange = function () {
            this.m_btnLeft.visible = true;
            this.m_btnRight.visible = true;
            if ((this.m_listGenHead.scrollH + this.m_itemScroll.width) >= this.m_listGenHead.contentWidth) {
                this.m_btnRight.visible = false;
            }
            if (this.m_listGenHead.scrollH <= 0)
                this.m_btnLeft.visible = false;
        };
        /**左 */
        EquipStrengView.prototype.onBtnLeft = function () {
            var next = this.m_listGenHead.scrollH - this.m_itemScroll.width;
            next = Math.max(0, next);
            this.m_listGenHead.scrollH = next;
            this.onScrollChange();
        };
        /**右 */
        EquipStrengView.prototype.onBtnRight = function () {
            var next = this.m_listGenHead.scrollH + this.m_itemScroll.width;
            next = Math.min(this.m_listGenHead.contentWidth - this.m_itemScroll.width, next);
            this.m_listGenHead.scrollH = next;
            this.onScrollChange();
        };
        /**装备格子选中 */
        EquipStrengView.prototype.onEquipItem = function (e) {
            var item = e.currentTarget;
            //首页为装备穿戴
            if (this.m_nCurTagIndex == 0) {
                var equip = this.m_nCurGenVo.getEquipByPos(item.pos);
                if (equip.equipmentUuid > 0) {
                    //卸装装备
                    // EquipProxy.C2S_GENERAL_EQUIP(this.m_nCurGenVo.generalId, equip.id, number.fromValue(0));
                    Utils.open_view(TASK_UI.POP_EQUIP_WEAR_INFO_WND, { generalId: this.m_nCurGenVo.generalId, pos: equip.id });
                }
                else {
                    if (EquipModel.getGenCanEquips(equip.equipmentUuid, equip.id).length == 0) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_ZB_FAL), 1, true);
                        return;
                    }
                    Utils.open_view(TASK_UI.POP_EQUIP_SEL_WND, { generalId: this.m_nCurGenVo.generalId, pos: equip.id });
                }
                return;
            }
            if (item) {
                this.setCurEquipPos(item.pos);
            }
        };
        /**一键装备 */
        EquipStrengView.prototype.onBtnEquip = function () {
            if (this.wearState == IEquipWearEnum.Wear) {
                if (this.isChange) {
                    EquipProxy.C2S_GENERAL_EQUIP_ALL(this.m_nCurGenVo.generalId, this.res);
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.EQUIP_ZB_FAL), 1, true);
                }
            }
            else {
                this.onBtnUnEquip();
            }
        };
        /**获取当前武将穿戴状态 */
        EquipStrengView.prototype.getWearState = function () {
            // let res: number[] = []
            this.res = [];
            this.isChange = false;
            for (var i = 0; i < 4; i++) {
                var equip = this.m_nCurGenVo.getEquipByPos(i);
                var fight = 0;
                if (equip.equipmentUuid > 0) {
                    var eqVo = EquipModel.getEquipVoByUId(equip.equipmentUuid);
                    fight = eqVo.fight;
                }
                var list = EquipModel.getGenCanEquips(equip.equipmentUuid, i);
                var newId = equip.equipmentUuid;
                for (var k = 0; k < list.length; k++) {
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
                }
                else {
                    this.m_btnEquip.setTitleLabel(GCode(CLEnum.EQUIP_ZB_YJXZ));
                    this.m_btnEquip.currentState = 'style3';
                    this.wearState = IEquipWearEnum.noWear;
                }
            }
            else {
                this.m_btnEquip.setTitleLabel(GCode(CLEnum.EQUIP_ZB_YJZB));
                this.wearState = IEquipWearEnum.Wear;
            }
        };
        /**是否有穿戴装备 */
        EquipStrengView.prototype.isWearBoo = function () {
            var isWear = false;
            for (var i in this.res) {
                if (this.res[i] > 0) {
                    isWear = true;
                }
            }
            return isWear;
        };
        /**一键卸下 */
        EquipStrengView.prototype.onBtnUnEquip = function () {
            var isUnEquip = false;
            for (var i = 0; i < 4; i++) {
                var equip = this.m_nCurGenVo.getEquipByPos(i);
                if (equip.equipmentUuid > 0) {
                    isUnEquip = true;
                    break;
                }
            }
            if (isUnEquip) {
                var res = [];
                for (var i = 0; i < 4; i++) {
                    res.push(0);
                }
                EquipProxy.C2S_GENERAL_EQUIP_ALL(this.m_nCurGenVo.generalId, res);
            }
        };
        /**一键升级 */
        EquipStrengView.prototype.onBtnAllUpLv = function () {
            var genVo = this.m_nCurGenVo;
            if (!genVo)
                return;
            for (var i = 0; i < EquipModel.POS_LIST.length; i++) {
                var pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipLv(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Level);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    var equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Level)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_QH_TIPS), 1, true);
                        return;
                    }
                    var cfg = EquipModel.getLevelCfg(pos, equip.strengthen);
                    var costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        };
        /**一键升阶 */
        EquipStrengView.prototype.onBtnAllGrade = function () {
            var genVo = this.m_nCurGenVo;
            if (!genVo)
                return;
            for (var i = 0; i < EquipModel.POS_LIST.length; i++) {
                var pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipGrade(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Grade);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    var equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Grade)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_SJ_TIPS), 1, true);
                        return;
                    }
                    var cfg = EquipModel.getGradeCfg(pos, equip.grade);
                    var costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        };
        /**一键精炼 */
        EquipStrengView.prototype.onBtnAllWrought = function () {
            var genVo = this.m_nCurGenVo;
            if (!genVo)
                return;
            for (var i = 0; i < EquipModel.POS_LIST.length; i++) {
                var pos = EquipModel.POS_LIST[i];
                if (genVo.canEquipWrought(pos)) {
                    EquipProxy.C2S_EQUIPMENT_SLOT_UPGRADE(this.m_nCurGenVo.generalId, -1, IEqStrengEnum.Wrought);
                    return;
                }
                //最后一个也不达成 判断最后一个所缺材料 或上限
                if (i == EquipModel.POS_LIST.length - 1) {
                    var equip = genVo.getEquipByPos(pos);
                    if (genVo.isMaxByStrengByType(equip, IEqStrengEnum.Wrought)) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_JL_TIPS), 1, true);
                        return;
                    }
                    var cfg = EquipModel.getWroughtCfg(pos, equip.wrought);
                    var costs = Utils.parseCommonItemJson(cfg.consume);
                    PropModel.isItemListEnough(costs, 3);
                }
            }
        };
        /**打开加成界面 */
        EquipStrengView.prototype.onBtnTipsCon = function () {
            Utils.open_view(TASK_UI.POP_EQUIP_ADD_WND, this.m_currTipData);
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /**检查新手引导面板条件 */
        EquipStrengView.prototype.onGuideTabCondition = function (id) {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, id);
        };
        EquipStrengView.NAME = 'EquipStrengView';
        return EquipStrengView;
    }(com_main.CView));
    com_main.EquipStrengView = EquipStrengView;
    /**
    * 英雄头像Item
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    var EquipGenRender = /** @class */ (function (_super_1) {
        __extends(EquipGenRender, _super_1);
        function EquipGenRender() {
            var _this = _super_1.call(this) || this;
            _this.width = 100;
            _this.height = 100;
            return _this;
        }
        EquipGenRender.prototype.$onRemoveFromStage = function () {
            this.removeEffect();
            this.m_headRender.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        EquipGenRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_headRender = com_main.GeneralHeadRender.create("base_info");
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
        };
        EquipGenRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_headRender.setGenId(this.m_tData.id);
            this.m_imgSelected.visible = this.m_tData.sel == true;
            this.m_imgRed.visible = this.m_tData.redState;
            this.m_imgUp.y = 5;
            this.removeEffect();
            if (!this.m_tData.redState) {
                this.m_imgUp.visible = this.m_tData.upState;
                this.addUpEffect();
            }
            else {
                this.m_imgUp.visible = false;
            }
        };
        EquipGenRender.prototype.addUpEffect = function () {
            var targetY = 5;
            var tw = egret.Tween.get(this.m_imgUp, { loop: true }).to({ y: targetY - 7 }, 500).to({ y: targetY }, 500);
        };
        EquipGenRender.prototype.removeEffect = function () {
            egret.Tween.removeTweens(this.m_imgUp);
        };
        return EquipGenRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
