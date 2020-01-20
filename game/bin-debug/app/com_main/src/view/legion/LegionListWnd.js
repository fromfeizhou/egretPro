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
     * 联盟面板相关
     */
    var LegionListWnd = /** @class */ (function (_super_1) {
        __extends(LegionListWnd, _super_1);
        function LegionListWnd(param) {
            var _this = _super_1.call(this) || this;
            // private m_btnSure:eui.Group;
            // private m_btnRecommend:eui.Group;
            _this.m_data = [];
            _this.m_curTitleTag = 0;
            _this.m_DataArray = new eui.ArrayCollection();
            _this.m_lastCellData = null;
            _this.m_lastIndex = 0;
            _this.curtarget = null;
            _this.m_guildDatas = param || [];
            _this.name = LegionListWnd.NAME;
            _this.initApp("legion/LegionListWndSkin.exml");
            return _this;
        }
        LegionListWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.GET_GUILD_LIST_BY_NAME,
            ];
        };
        /**处理协议号事件 */
        LegionListWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_GUILD_LIST_BY_NAME: {
                    var data = body;
                    if (body && body.guildData.length > 0) {
                        this.refreshItemsView(data.guildData);
                    }
                    else {
                        EffectUtils.showTips(GCode(CLEnum.GUI_SEARCH_FAL));
                    }
                    break;
                }
            }
        };
        LegionListWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.height = this.stage.stageHeight;
            com_main.EventManager.addTouchScaleListener(this.m_btnFind, this, this.onClickFind);
            com_main.EventManager.addTouchScaleListener(this.m_btnCreate, this, this.onClickCreate);
            // EventManager.addTouchScaleListener(this.m_btnRecommend, this, this.onClickRecommend);
            // EventManager.addTouchScaleListener(this.m_btnSure, this, this.onClickJoin);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.GUILD));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            this.m_btnCreate.setTitleLabel(GCode(CLEnum.GUILD_CREATE));
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.GUILD_NAME) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.GUILD_POS_MZ) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.GUILD_FIGHT) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.GUILD_NUM) });
            this.m_comTabTopGroup.addTabBtnData({ name: GCode(CLEnum.GUILD_OPERA) }, false);
            this.m_comTabTopGroup.setChangeCallback(this.changeTab, this);
            // 现在固定为普通酒馆状态
            this.initList();
        };
        LegionListWnd.prototype.changeTab = function (selIndex) {
            this.m_curTitleTag = selIndex;
            this.initList();
        };
        /**刷新列表显示 */
        LegionListWnd.prototype.refreshItemsView = function (param) {
            this.m_guildDatas = param || [];
        };
        LegionListWnd.prototype.initList = function () {
            this.m_data = [];
            var list = this.m_guildDatas;
            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    var info = list[i];
                    // let select = i==0?1:0;
                    this.m_data.push({ id: info.id, select: 0, guildName: info.name, playerName: info.guildMemberInfo.name, fight: info.guildPower, memberCount: info.memberCount, capacity: info.capacity });
                }
                this.sortby();
                if (this.m_DataArray.length == 0) {
                    this.m_DataArray = new eui.ArrayCollection(this.m_data);
                }
                else {
                    this.m_DataArray.replaceAll(this.m_data);
                }
                this.m_legionList.dataProvider = this.m_DataArray;
                this.m_legionList.itemRenderer = LegionListWndCell;
                // this.m_legionList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTouchTab, this);
            }
        };
        LegionListWnd.prototype.sortby = function () {
            if (this.m_curTitleTag == 0) {
                this.m_data.sort(this.sortFight);
            }
            else if (this.m_curTitleTag == 1) {
            }
            else if (this.m_curTitleTag == 2) {
                this.m_data.sort(this.sortFight);
            }
            else if (this.m_curTitleTag == 3) {
                this.m_data.sort(this.sortPeople);
            }
            else if (this.m_curTitleTag == 4) {
            }
        };
        LegionListWnd.prototype.sortFight = function (a, b) {
            return Utils.SortByProps(a, b, { "fight": "down" });
        };
        LegionListWnd.prototype.sortPeople = function (a, b) {
            return Utils.SortByProps(a, b, { "memberCount": "down" });
        };
        LegionListWnd.prototype.onTouchTab = function (e) {
            // var item = e.item;
            // LegionProxy.send_APPLY_JOIN_GUILD(item.id);
            var item = e.item;
            this.m_lastCellData = e.item;
            var isShowSetGroup = false;
            var index = e.itemIndex;
            this.setSelect(this.curtarget, false);
            this.m_data[this.m_lastIndex].select = 0;
            if (this.curtarget) {
                this.setSelect(this.curtarget, false);
                this.m_data[index].select = 0;
                if (this.curtarget == e.itemRenderer) {
                    this.setSelect(e.itemRenderer, true);
                    this.m_data[index].select = 1;
                }
                else {
                    this.setSelect(e.itemRenderer, true);
                    this.curtarget = e.itemRenderer;
                    this.m_data[index].select = 1;
                }
            }
            else {
                this.curtarget = e.itemRenderer;
                this.setSelect(e.itemRenderer, true);
                this.m_data[index].select = 1;
            }
            this.m_lastIndex = index;
        };
        LegionListWnd.prototype.setSelect = function (currentTarget, bshowSelect) {
            if (currentTarget == null) {
                return;
            }
            var targetChildrens = currentTarget.$children;
            for (var i = 0; i < targetChildrens.length; i++) {
                if (targetChildrens[i].name == "kuang") {
                    targetChildrens[i].visible = bshowSelect;
                    break;
                }
            }
        };
        //查找
        LegionListWnd.prototype.onClickJoin = function () {
            if (this.m_lastCellData) {
                if (LegionModel.getGuildInfo()) {
                    LegionProxy.send_GET_GUILD_INFO(true, 0);
                }
                else
                    LegionProxy.send_APPLY_JOIN_GUILD(this.m_lastCellData.id);
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.GUILD_APPLY_FAL1), 1, true);
                // for(let i=0;i<this.m_DataArray.length;i++){
                //     let data = this.m_DataArray.source[i];
                //     if(i==0){
                //         this.m_lastCellData = data;
                //     }
                // }
            }
        };
        //查找
        LegionListWnd.prototype.onClickFind = function () {
            if (this.InputLabel.text.length <= 0) {
                EffectUtils.showTips(GCode(CLEnum.GUI_SEARCH_FAL1), 1, true);
            }
            LegionProxy.send_GET_GUILD_LIST_BY_NAME(this.InputLabel.text);
        };
        //创建
        LegionListWnd.prototype.onClickCreate = function () {
            // LegionProxy.send_CREATE_GUILD();
            Utils.open_view(TASK_UI.LEGION_CREATE_WND);
        };
        //推荐
        LegionListWnd.prototype.onClickRecommend = function () {
        };
        LegionListWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        LegionListWnd.prototype.addEvent = function () {
            // EventManager.addTouchScaleListener(this.m_pBtnOk, this, this.onBtnOk);
            // EventManager.addTouchScaleListener(this.m_pBtnCancel, this, this.onBtnCancel);
            // EventManager.addTouchScaleListener(this.m_pBtnRecruit, this, this.onBtnRecruit);
        };
        LegionListWnd.NAME = 'LegionListWnd';
        return LegionListWnd;
    }(com_main.CView));
    com_main.LegionListWnd = LegionListWnd;
    var LegionListWndCell = /** @class */ (function (_super_1) {
        __extends(LegionListWndCell, _super_1);
        function LegionListWndCell() {
            var _this = _super_1.call(this) || this;
            _this.touchChildren = true;
            return _this;
        }
        LegionListWndCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_BtnReject["sound_queren"] = SoundData.getSureSound();
            com_main.EventManager.addTouchScaleListener(this.m_BtnReject, this, this.onBtnApply);
        };
        LegionListWndCell.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        LegionListWndCell.prototype.onBtnApply = function () {
            if (LegionModel.getGuildInfo()) {
                LegionProxy.send_GET_GUILD_INFO(true, 0);
            }
            else
                LegionProxy.send_APPLY_JOIN_GUILD(this.data.id);
        };
        LegionListWndCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            if (this.data) {
                // this.m_pImgIcon.source = Utils.getLegionCountryImage(RoleData.countryId); 
                this.legionName.text = this.data.guildName;
                this.fightText.text = '' + this.data.fight;
                this.LegionPeopleText.text = "" + this.data.memberCount + "/" + this.data.capacity;
                // this.m_pImgIcon1.visible = this.data.select!=0;
                this.playerName.text = this.data.playerName;
                this.m_BtnReject.setTitleLabel(GCode(CLEnum.GUILD_APPLY));
            }
        };
        return LegionListWndCell;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
