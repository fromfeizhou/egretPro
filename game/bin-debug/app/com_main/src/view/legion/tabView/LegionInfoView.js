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
     * 联盟信息
     */
    var LegionInfoView = /** @class */ (function (_super_1) {
        __extends(LegionInfoView, _super_1);
        function LegionInfoView(size) {
            var _a;
            var _this = _super_1.call(this) || this;
            /**操作栏预定义 */
            _this.m_operaDatas = (_a = {},
                _a[OperaType.LEAVE] = { name: GCode(CLEnum.GUILD_OPERA_TC), type: OperaType.LEAVE },
                _a[OperaType.RM] = { name: GCode(CLEnum.GUILD_OPERA_RM), type: OperaType.RM },
                _a[OperaType.ZR] = { name: GCode(CLEnum.GUILD_OPERA_ZR), type: OperaType.ZR },
                _a[OperaType.CKWJ] = { name: GCode(CLEnum.GUILD_OPERA_CKWJ), type: OperaType.CKWJ },
                _a[OperaType.SL] = { name: GCode(CLEnum.CHAT_MSG_PRI), type: OperaType.SL },
                _a[OperaType.TC] = { name: GCode(CLEnum.GUILD_OPERA_TCWJ), type: OperaType.TC },
                _a[OperaType.TK] = { name: GCode(CLEnum.STATE_DH), type: OperaType.TK },
                _a);
            NodeUtils.setSize(_this, size);
            _this.name = LegionInfoView.NAME;
            _this.initApp("legion/tabView/LegionInfoViewSkin.exml");
            return _this;
        }
        LegionInfoView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        LegionInfoView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        LegionInfoView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_comTabTopGroup.initNorTabBtns([GCode(CLEnum.GUILD_POS), GCode(CLEnum.GUILD_MEMBER_NAME), GCode(CLEnum.FIGHT),
                GCode(CLEnum.GUILD_CONTRIBUTE), GCode(CLEnum.GUILD_LINE_STATE)]);
            this.m_pImgIcon.source = LegionModel.getLegionCountryImage(RoleData.countryId);
            this.m_BtnApply.setTitleLabel(GCode(CLEnum.GUILD_APPLY_LIST));
            this.m_BtnMessage.setTitleLabel(GCode(CLEnum.GUILD_MSG));
            this.m_settingBtn.setTitleLabel(GCode(CLEnum.GUILD_SHEZHI));
            this.m_tBtnColles = new eui.ArrayCollection();
            this.m_pOperaList.dataProvider = this.m_tBtnColles;
            this.m_tMemberColles = new eui.ArrayCollection();
            this.m_pMemberList.dataProvider = this.m_tMemberColles;
            this.m_pMemberList.itemRenderer = LegionInfoCell;
            this.initMemberList();
            this.addEvent();
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        /**初始化成员列表 */
        LegionInfoView.prototype.initMemberList = function () {
            var guildInfo = LegionModel.getGuildInfo();
            // console.log("logInfo=",info);
            if (guildInfo && guildInfo.guildMemberInfo.length) {
                var res = [];
                for (var i = 0; i < guildInfo.guildMemberInfo.length; i++) {
                    var info = guildInfo.guildMemberInfo[i];
                    var data = {
                        playerId: info.playerId, name: info.name, position: info.position, level: info.level,
                        joinTime: info.joinTime, onlineTime: info.onlineTime, power: info.power,
                        offline: info.offline, offlineTime: info.offlineTime, contribute: info.donate, head: info.head,
                        selected: false, online: info.offline ? 0 : 1
                    };
                    res.push(data);
                    //记录玩家对象
                    if (info.playerId == RoleData.playerId) {
                        //玩家职位变动  操作队列修改
                        if (this.m_tOwner && this.m_tOwner.position != data.position) {
                            this.m_nOperaPos = -1;
                        }
                        this.m_tOwner = data;
                    }
                }
                this.m_tMemberColles.replaceAll(res);
                this.sortMember();
            }
            this.showGuild(guildInfo.name, guildInfo.memberCount, guildInfo.guildPower, guildInfo.guildLeader);
            this.showGuildNotice(guildInfo.declaration);
        };
        /**显示联盟基本信息 */
        LegionInfoView.prototype.showGuild = function (name, num, power, mzName) {
            this.m_labMzName.text = GCode(CLEnum.GUILD_POS_MZ1) + mzName;
            this.m_labPeopleNum.text = GCode(CLEnum.GUILD_POS_CY1) + num;
            this.m_labLegionName.text = name;
            this.m_labGuildFight.text = power + '';
        };
        /**显示联盟宣言 */
        LegionInfoView.prototype.showGuildNotice = function (Notice) {
            this.m_declarationtext.text = Notice;
        };
        //排序
        LegionInfoView.prototype.sortMember = function () {
            var list = this.m_tMemberColles.source;
            switch (this.m_comTabTopGroup.selectedIndex) {
                case 0: {
                    list.sort(this.sortPosition);
                    break;
                }
                case 1: {
                    list.sort(this.sortName);
                    break;
                }
                case 2: {
                    list.sort(this.sortFight);
                    break;
                }
                case 3: {
                    list.sort(this.sortContribution);
                    break;
                }
                case 4: {
                    list.sort(this.sortOnline);
                    break;
                }
            }
            this.m_tMemberColles.refresh();
        };
        //小到大
        LegionInfoView.prototype.sortPosition = function (a, b) {
            return Utils.SortByProps(a, b, { "position": "up", "online": "down", "joinTime": "up" });
        };
        LegionInfoView.prototype.sortName = function (a, b) {
            return Utils.SortByProps(a, b, { "own": "down", "online": "down" });
        };
        LegionInfoView.prototype.sortContribution = function (a, b) {
            return Utils.SortByProps(a, b, { "contribute": "down" });
        };
        LegionInfoView.prototype.sortFight = function (a, b) {
            return Utils.SortByProps(a, b, { "power": "down" });
        };
        LegionInfoView.prototype.sortOnline = function (a, b) {
            return Utils.SortByProps(a, b, { "own": "down", "online": "down" });
        };
        /**刷新操作栏 */
        LegionInfoView.prototype.refreshOperaView = function () {
            if (!this.m_tOwner || this.m_nOperaPos == this.m_tTarget.position) {
                return;
            }
            this.m_nOperaPos = this.m_tTarget.position;
            this.m_tBtnColles.removeAll();
            //个人操作
            var list = this.m_operaDatas;
            if (this.m_tOwner.playerId == this.m_tTarget.playerId) {
                this.m_tBtnColles.replaceAll([list[OperaType.LEAVE]]);
                return;
            }
            var res = this.getOperasByPos(this.m_tOwner.position, this.m_tTarget.position);
            this.m_tBtnColles.replaceAll(res);
        };
        /**获得职位操作 */
        LegionInfoView.prototype.getOperasByPos = function (ownerPos, targetPos) {
            var list = this.m_operaDatas;
            if (ownerPos == LegionPositon.TUANZHANG) { //我是盟主
                return [list[OperaType.RM], list[OperaType.ZR], list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TC]];
            }
            else if (ownerPos == LegionPositon.FUTUANZHANG) { //我是副盟主
                switch (targetPos) {
                    case LegionPositon.TUANZHANG:
                        return [list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TK]];
                    case LegionPositon.FUTUANZHANG:
                        return [list[OperaType.CKWJ], list[OperaType.SL]];
                    case LegionPositon.CHENGGUANG:
                    case LegionPositon.LINSHIGONG:
                    case LegionPositon.CHENGYUAN:
                        return [list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TC]];
                }
            }
            else if (ownerPos == LegionPositon.CHENGGUANG) { //我是核心
                switch (targetPos) {
                    case LegionPositon.TUANZHANG:
                        return [list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TK]];
                    case LegionPositon.FUTUANZHANG:
                    case LegionPositon.CHENGGUANG:
                        return [list[OperaType.CKWJ], list[OperaType.SL]];
                    case LegionPositon.LINSHIGONG:
                    case LegionPositon.CHENGYUAN:
                        return [list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TC]];
                }
            }
            switch (targetPos) {
                case LegionPositon.TUANZHANG:
                    return [list[OperaType.CKWJ], list[OperaType.SL], list[OperaType.TK]];
            }
            return [list[OperaType.CKWJ], list[OperaType.SL]];
        };
        /**=====================================================================================
        * 协议处理 being
        * =====================================================================================
        */
        LegionInfoView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.CHANGE_GUILD_LEADER,
                ProtoDef.GET_GUILD_INFO,
                ProtoDef.KICK_OUT_GUILD,
                ProtoDef.LEAVE_GUILD,
                ProtoDef.CHANGE_DECLARATION,
                ProtoDef.S2C_ACCUSE_GUILD,
            ];
        };
        /**处理协议号事件 */
        LegionInfoView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_GUILD_INFO: {
                    if (body) {
                        this.initMemberList();
                    }
                    break;
                }
                case ProtoDef.CHANGE_GUILD_LEADER: { // 装让盟主
                    if (body) {
                        EffectUtils.showTips(GCode(CLEnum.GUILD_TIPS_RWCG));
                    }
                    break;
                }
                case ProtoDef.KICK_OUT_GUILD: {
                    EffectUtils.showTips(GCode(CLEnum.GUILD_TIPS_TCCG));
                    break;
                }
                case ProtoDef.LEAVE_GUILD: { // 退出联盟成功，不成功直接返回错误码
                    com_main.UpManager.close();
                    EffectUtils.showTips(GCode(CLEnum.GUILD_TIPS_TCLM), 1, true);
                    break;
                }
                case ProtoDef.CHANGE_DECLARATION: {
                    this.showGuildNotice(body.newDeclaration);
                    break;
                }
                case ProtoDef.S2C_ACCUSE_GUILD: {
                    if (body) {
                    }
                    break;
                }
            }
        };
        /**=====================================================================================
        * 协议处理 end
        * =====================================================================================
        */
        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */
        LegionInfoView.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_settingBtn, this, this.onClickSetting);
            com_main.EventManager.addTouchScaleListener(this.m_BtnApply, this, this.onClickApply);
            com_main.EventManager.addTouchScaleListener(this.m_BtnMessage, this, this.onClickMessage);
            com_main.EventManager.addTouchScaleListener(this.m_changeDes, this, this.onClickChangeDes);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPanelClick, this);
            this.m_pOperaList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onOperaSelected, this);
            this.m_pMemberList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onMemberSelected, this);
            this.m_comTabTopGroup.setChangeCallback(this.changeTab, this);
        };
        LegionInfoView.prototype.removeEvent = function () {
            this.m_pOperaList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onOperaSelected, this);
            this.m_pMemberList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onMemberSelected, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onPanelClick, this);
        };
        /**设置 */
        LegionInfoView.prototype.onClickSetting = function () {
            Utils.open_view(TASK_UI.LEGION_SET_WND);
        };
        /**
         * 申请列表
         */
        LegionInfoView.prototype.onClickApply = function () {
            Utils.open_view(TASK_UI.LEGION_APPLY_WND);
        };
        /**
         * 联盟记录
         */
        LegionInfoView.prototype.onClickMessage = function () {
            Utils.open_view(TASK_UI.LEGION_RECORD_WND);
        };
        /**
         * 更改联盟信息
         */
        LegionInfoView.prototype.onClickChangeDes = function () {
            Utils.open_view(TASK_UI.LEGION_SET_NOTICE_WND, LegionModel.getGuildDescription());
        };
        //成员排序
        LegionInfoView.prototype.changeTab = function (index) {
            this.sortMember();
        };
        /**成员选中 */
        LegionInfoView.prototype.onMemberSelected = function (e) {
            Sound.playTap();
            var index = this.m_pMemberList.selectedIndex;
            this.refreshMemberSelected(e.itemIndex);
            var item = e.itemRenderer;
            var itemData = e.item;
            if (item) {
                //如果目标 和记录选中的对象其中一个是玩家自己  强制重置操作
                if ((this.m_tTarget && this.m_tTarget.playerId == (this.m_tOwner.playerId)) ||
                    itemData.playerId == (this.m_tOwner.playerId)) {
                    this.m_nOperaPos = -1;
                }
                this.m_tTarget = itemData;
                this.m_pOperaRoot.visible = true;
                this.refreshOperaView();
                var pos = item.localToGlobal(0, 0);
                this.m_pViewRoot.globalToLocal(pos.x, pos.y, pos);
                this.m_pOperaRoot.y = pos.y + 38;
                var screnH = AGame.R.app.stageHeight - 50;
                if ((this.m_pOperaRoot.y + this.calcuOperaHeigth()) > screnH)
                    this.m_pOperaRoot.y = screnH - this.calcuOperaHeigth();
            }
        };
        /**计算操作界面高度 */
        LegionInfoView.prototype.calcuOperaHeigth = function () {
            var cout = this.m_tBtnColles.length;
            var len = cout > 1 ? cout * 63 + (cout - 1) * 6 : cout * 63;
            return len + 35;
        };
        /**刷新成员列表选中 */
        LegionInfoView.prototype.refreshMemberSelected = function (index) {
            for (var i = 0; i < this.m_tMemberColles.source.length; i++) {
                var data = this.m_tMemberColles.getItemAt(i);
                var selected = i == index;
                if (data.selected != selected) {
                    data.selected = selected;
                    this.m_tMemberColles.replaceItemAt(data, i);
                }
            }
        };
        /**刷新列表数据 */
        LegionInfoView.prototype.reFlashitem = function () {
            for (var i = 0; i < this.m_tMemberColles.source.length; i++) {
                var data = this.m_tMemberColles.source[i];
                if (data.name == RoleData.nickName) {
                    data.contribute = RoleData.GetMaterialNumById(PropEnum.GUILD_POINT);
                }
                this.m_tMemberColles.replaceItemAt(data, i);
            }
        };
        /**资源刷新 */
        LegionInfoView.prototype.onRoleResource = function (sourceId) {
            if (sourceId === void 0) { sourceId = PropEnum.GUILD_POINT; }
            if (sourceId != PropEnum.GUILD_POINT)
                return;
            this.reFlashitem();
        };
        /**面板点击 */
        LegionInfoView.prototype.onPanelClick = function (e) {
            if (!this.m_pOperaRoot.visible)
                return;
            var point = this.m_pOperaRoot.parent.globalToLocal(e.stageX, e.stageY);
            var rect;
            rect = new egret.Rectangle(this.m_pOperaRoot.x, this.m_pOperaRoot.y, this.m_pOperaRoot.width, this.m_pOperaRoot.height);
            if (!rect.containsPoint(point)) {
                this.m_pOperaRoot.visible = false;
                this.refreshMemberSelected(-1);
                this.m_pMemberList.selectedIndex = -1;
            }
            egret.Rectangle.release(rect);
            e.stopImmediatePropagation();
        };
        /**是否已经达到盟主的离线弹劾时间 */
        LegionInfoView.prototype.isOffLine = function () {
            var leaderInfo = LegionModel.getLeaderInfo();
            if (isNull(leaderInfo))
                return false;
            if (!leaderInfo.offline)
                return false;
            var offlineCfg = Math.floor(ConstUtil.getValue(IConstEnum.GUILD_ACCUSE_LOGINOUT_TIME));
            var subTime = Math.floor((TimerUtils.getServerTime() - leaderInfo.offlineTime) / 3600);
            return subTime >= offlineCfg;
        };
        /**操作选中 */
        LegionInfoView.prototype.onOperaSelected = function () {
            var _this = this;
            var index = this.m_pOperaList.selectedIndex;
            var data = this.m_tBtnColles.getItemAt(index);
            if (!data)
                return;
            switch (data.type) {
                case OperaType.RM: {
                    Utils.open_view(TASK_UI.LEGION_APPOINT_WND, this.m_tTarget);
                    break;
                }
                case OperaType.ZR: {
                    Utils.showConfirmPop(GCode(CLEnum.GUILD_TIPS_ZRMZ), function () {
                        LegionProxy.send_CHANGE_GUILD_LEADER(_this.m_tTarget.playerId);
                    }, this);
                    break;
                }
                case OperaType.SL: {
                    var param = { type: ChatType.PRIVATE, id: this.m_tTarget.playerId, name: this.m_tTarget.name };
                    Utils.open_view(TASK_UI.POP_CHAT_MAIN, param);
                    break;
                }
                case OperaType.CKWJ: {
                    NormalProxy.C2S_PLAYER_INTEGRATED_INFORMATION(this.m_tTarget.playerId);
                    break;
                }
                case OperaType.TC: {
                    Utils.showConfirmPop(GCode(CLEnum.GUILD_TIPS_TCWJ), function () {
                        LegionProxy.send_KICK_OUT_GUILD(_this.m_tTarget.playerId);
                    }, this);
                    break;
                }
                case OperaType.TK: {
                    if (!this.isOffLine()) {
                        var day = Math.floor(ConstUtil.getValue(IConstEnum.GUILD_ACCUSE_LOGINOUT_TIME) / 24);
                        EffectUtils.showTips(GCodeFromat(CLEnum.GUILD_TIPS_TK_TIME, day));
                        break;
                    }
                    var itemInfo = ConstUtil.getItems(IConstEnum.GUILD_ACCUSE_COSTS)[0];
                    Utils.showConfirmPop(GCodeFromat(CLEnum.GUILD_TIPS_TK, itemInfo.count), function () {
                        if (PropModel.isItemEnough(PropEnum.GOLD, itemInfo.count, 1)) {
                            LegionProxy.C2S_ACCUSE_GUILD();
                        }
                    }, this);
                    break;
                }
                case OperaType.LEAVE: {
                    if (this.m_tMemberColles.length == 1) {
                        Utils.showConfirmPop(GCode(CLEnum.GUILD_TIPS_JSLM), function () {
                            LegionProxy.send_DISSOLVE_GUILD(LegionModel.getGuildId());
                        }, this);
                        return;
                    }
                    var position = this.m_tOwner.position;
                    if (position == LegionPositon.TUANZHANG) {
                        EffectUtils.showTips(GCode(CLEnum.GUILD_TIPS_TCLM_FAL), 1, true);
                        return;
                    }
                    Utils.showConfirmPop(GCode(CLEnum.GUILD_TIPS_TCLM1), function () {
                        LegionProxy.send_LEAVE_GUILD();
                    }, this);
                    break;
                }
            }
            this.m_pMemberList.selectedIndex = -1;
            this.m_pOperaList.selectedIndex = -1;
            this.m_pOperaRoot.visible = false;
        };
        LegionInfoView.NAME = 'LegionInfoView';
        return LegionInfoView;
    }(com_main.CView));
    com_main.LegionInfoView = LegionInfoView;
    //操作按钮枚举
    var OperaType;
    (function (OperaType) {
        /**任命 */
        OperaType[OperaType["RM"] = 0] = "RM";
        /**转让 */
        OperaType[OperaType["ZR"] = 1] = "ZR";
        /**查看玩家 */
        OperaType[OperaType["CKWJ"] = 2] = "CKWJ";
        /**私聊 */
        OperaType[OperaType["SL"] = 3] = "SL";
        /**退出 */
        OperaType[OperaType["LEAVE"] = 4] = "LEAVE";
        /**踢出 */
        OperaType[OperaType["TC"] = 5] = "TC";
        /**弹劾 */
        OperaType[OperaType["TK"] = 6] = "TK";
    })(OperaType || (OperaType = {}));
    var LegionInfoCell = /** @class */ (function (_super_1) {
        __extends(LegionInfoCell, _super_1);
        function LegionInfoCell() {
            var _this = _super_1.call(this) || this;
            _this.touchChildren = false;
            return _this;
        }
        LegionInfoCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.cacheAsBitmap = true;
        };
        LegionInfoCell.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        LegionInfoCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            this.m_pSelectedRoot.visible = this.m_tData.selected;
            if (this.m_tData.offline) {
                this.currentState = 'offline';
            }
            else {
                this.currentState = 'base';
            }
            this.commitProperties();
            this.m_labPos.text = "\u3010" + LegionModel.getPosTitle(this.m_tData.position) + "\u3011";
            this.m_labName.text = this.m_tData.name;
            this.m_labFight.text = this.m_tData.power + '';
            this.m_labContriNum.text = this.m_tData.contribute + '';
            this.m_labState.text = this.m_tData.offline ? GCode(CLEnum.GUILD_LINE_OFF) : GCode(CLEnum.GUILD_LINE_ON);
        };
        return LegionInfoCell;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
