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
     * 邮件主面板
     */
    var MailMainWnd = /** @class */ (function (_super_1) {
        __extends(MailMainWnd, _super_1);
        function MailMainWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.onReadMail = function (data) {
                var mailTitle = MailModel.getMailTitleById(data.id);
                _this.m_tabViewStack.visible = true;
                _this.m_tViews[data.textType].refresh(data);
                if (mailTitle.attachmentType == 1 && !mailTitle.isAttachmentState) {
                    _this.m_btnDel.setTitleLabel(GCode(CLEnum.MAIL_ATT_GET));
                }
                else {
                    _this.m_btnDel.setTitleLabel(GCode(CLEnum.MAIL_DEL));
                }
            };
            _this.name = MailMainWnd.NAME;
            _this.initApp("mail/MailMainWndSkin.exml");
            return _this;
        }
        MailMainWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        MailMainWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            MailModel.resetMailRecord();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.MAIL));
            this.m_btnAllDel.setTitleLabel(GCode(CLEnum.MAIL_DEL_ALL));
            this.m_btnAllRead.setTitleLabel(GCode(CLEnum.MAIL_READ_ALL));
            this.m_btnDel.setTitleLabel(GCode(CLEnum.MAIL_DEL));
            //邮件类型 1系统 2战报 3野怪  4采集 5城市战
            this.m_nMailTypes = [MailType.System, MailType.Personal, MailType.CatchBandits, MailType.Collection, MailType.Country];
            this.m_sMailTitle = [GCode(CLEnum.MAIL_TAB_ST), GCode(CLEnum.MAIL_TAB_GR), GCode(CLEnum.MAIL_TAB_ZF),
                GCode(CLEnum.MAIL_TAB_CJ), GCode(CLEnum.MAIL_TAB_GZ)];
            this.m_comTabGroup.initNorTabBtns(this.m_sMailTitle);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            //界面初始化
            this.m_tViews = {};
            var views = [new com_main.SystemReport(MailType.System), new com_main.PersonalReport(MailType.Personal), new com_main.CatchBanditsReport(MailType.CatchBandits),
                new com_main.CollectionReport(MailType.Collection), new com_main.CountryReport(MailType.Country)];
            for (var i = 0; i < views.length; i++) {
                this.m_tabViewStack.addChild(views[i]);
                this.m_tViews[views[i].m_nType] = views[i];
            }
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listMail.itemRenderer = MailItem;
            this.m_listMail.dataProvider = this.m_tCollection;
            this.validateNow();
            //红点处理
            for (var i = 0; i < this.m_nMailTypes.length; i++) {
                var container = this.m_comTabGroup.getTabBtnByName(this.m_sMailTitle[i]);
                var mailType = this.m_nMailTypes[i];
                RedPointModel.AddInfoListener(container, { x: 132, y: -5 }, [RedEvtType.MAIL], 2, { mailType: mailType });
            }
            this.changeTag(0);
            //添加事件
            this.addEvent();
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        /**切卡 */
        MailMainWnd.prototype.changeTag = function (index) {
            if (this.m_nTagId == index)
                return;
            this.m_nTagId = index;
            this.m_nIndex = -1;
            this.m_listMail.selectedIndex = -1;
            this.m_comTabGroup.selectedIndex = index;
            this.m_tabViewStack.selectedIndex = index;
            this.refreshMailList();
            this.changeItemSelected(0);
        };
        MailMainWnd.prototype.refreshMailList = function (curId) {
            if (curId === void 0) { curId = null; }
            this.m_Scroller.stopAnimation();
            var type = this.m_nMailTypes[this.m_nTagId];
            var list = MailModel.getMailTitlesByType(type);
            if (!list || list.length == 0) {
                this.setEmptyView(true);
                this.m_tCollection.removeAll();
                return;
            }
            this.setEmptyView(false);
            var res = [];
            for (var i = 0; i < list.length; i++) {
                var data = list[i];
                var selected = (curId && curId == data.id) ? true : false;
                var title = data.titleInfo.replace(/(\\)/g, '');
                var titleInfo = title == '' ? {} : JSON.parse(title);
                res.push({ mailInfo: data, selected: selected, titleInfo: titleInfo });
            }
            this.m_tCollection.replaceAll(res);
            this.sortMailTitle();
            //有默认选中邮件id
            if (!curId)
                return;
            for (var i = 0; i < this.m_tCollection.source.length; i++) {
                var data = this.m_tCollection.getItemAt(i);
                if (data.mailInfo.id == curId) {
                    this.changeItemSelected(i);
                    break;
                }
            }
        };
        /**邮件列表排序 */
        MailMainWnd.prototype.sortMailTitle = function () {
            this.m_tCollection.source.sort(function (a, b) {
                // if (a.mailInfo.isRead != b.mailInfo.isRead) {
                // 	if (a.mailInfo.isRead) return 1;
                // 	return -1;
                // }
                // //未读邮件按时间排序
                // if (!a.mailInfo.isRead) {
                // 	return b.mailInfo.sendTime - a.mailInfo.sendTime;
                // }
                // //已读邮件 有附件优先未领取
                // if (a.mailInfo.attachmentType == 1 && !a.mailInfo.isAttachmentState) return -1;
                // if (b.mailInfo.attachmentType == 1 && !b.mailInfo.isAttachmentState) return 1;
                return b.mailInfo.sendTime - a.mailInfo.sendTime;
            });
            this.m_tCollection.refresh();
        };
        /**设置空邮件显示 */
        MailMainWnd.prototype.setEmptyView = function (val) {
            if (val) {
                this.m_emptyRoot.visible = true;
                this.m_tabViewStack.visible = false;
                this.m_imgLine.visible = false;
            }
            else {
                this.m_emptyRoot.visible = false;
                this.m_tabViewStack.visible = true;
                this.m_imgLine.visible = true;
            }
        };
        //更换列表选中状态
        MailMainWnd.prototype.changeItemSelected = function (index) {
            if (this.m_nIndex == index)
                return;
            this.setItemState(this.m_nIndex, false);
            this.m_nIndex = index;
            this.setItemState(this.m_nIndex, true);
            var itemRD = this.m_tCollection.getItemAt(this.m_nIndex);
            if (itemRD) {
                MailProxy.C2S_MAILBOX_INFO(itemRD.mailInfo.id);
            }
        };
        /**邮件状态切换 */
        MailMainWnd.prototype.setItemState = function (index, val) {
            var data = this.m_tCollection.getItemAt(index);
            if (!data)
                return;
            data.selected = val;
            this.m_tCollection.replaceItemAt(data, index);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        MailMainWnd.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnDel, this, this.onBtnDel);
            com_main.EventManager.addTouchScaleListener(this.m_btnAllDel, this, this.onBtnAllDel);
            com_main.EventManager.addTouchScaleListener(this.m_btnAllRead, this, this.onBtnAllRead);
            com_main.EventMgr.addEvent(MailEvent.READ_MAIL, this.onReadMail, this);
            com_main.EventMgr.addEvent(MailEvent.REFRESH_MAIL, this.onRreshMail, this);
            com_main.EventMgr.addEvent(MailEvent.GET_ATTACHMENT, this.onGetAttachment, this);
            this.m_listMail.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
        };
        MailMainWnd.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(MailEvent.READ_MAIL, this);
            com_main.EventMgr.removeEventByObject(MailEvent.REFRESH_MAIL, this);
            com_main.EventMgr.removeEventByObject(MailEvent.GET_ATTACHMENT, this);
            this.m_listMail.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
        };
        MailMainWnd.prototype.onBtnDel = function (e) {
            var itemRD = this.m_tCollection.getItemAt(this.m_nIndex);
            if (isNull(itemRD)) {
                EffectUtils.showTips(GCode(CLEnum.MAIL_SEL_NONE), 1, true);
                return;
            }
            var info = itemRD.mailInfo;
            if (info.attachmentType == 1 && !info.isAttachmentState) {
                MailProxy.C2S_MAILBOX_ATTACHMENT(itemRD.mailInfo.id);
            }
            else {
                MailProxy.C2S_MAILBOX_DEL(itemRD.mailInfo.id);
            }
        };
        MailMainWnd.prototype.onBtnAllDel = function (e) {
            var mailType = this.m_nMailTypes[this.m_nTagId];
            var list = MailModel.getMailTitlesByType(mailType);
            if (!list || list.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.MAIL_NONE), 1, true);
                return;
            }
            var tagName = this.m_comTabGroup.selName;
            var content = GCodeFromat(CLEnum.MAIL_TIPS_DEL, tagName);
            Utils.showConfirmPop(content, function () {
                MailProxy.C2S_MAILBOX_ALLDEL(mailType);
            }, this);
        };
        MailMainWnd.prototype.onBtnAllRead = function (e) {
            var mailType = this.m_nMailTypes[this.m_nTagId];
            var list = MailModel.getMailTitlesByType(mailType);
            if (!list) {
                EffectUtils.showTips(GCode(CLEnum.MAIL_READ_NONE), 1, true);
                return;
            }
            var sendRead = false;
            for (var i = 0; i < list.length; i++) {
                if (!list[i].isRead || (list[i].attachmentType == 1 && !list[i].isAttachmentState)) {
                    sendRead = true;
                    break;
                }
            }
            if (sendRead) {
                MailProxy.C2S_MAILBOX_ALLREAD(mailType);
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.MAIL_READ_NONE), 1, true);
            }
        };
        MailMainWnd.prototype.onItemSelected = function (e) {
            this.changeItemSelected(e.itemIndex);
        };
        MailMainWnd.prototype.onRreshMail = function (isDel) {
            var itemRD = this.m_tCollection.getItemAt(this.m_nIndex);
            var curId = itemRD ? itemRD.mailInfo.id : null;
            this.m_nIndex = -1;
            this.m_listMail.selectedIndex = -1;
            this.refreshMailList(curId);
            //删除当前 邮件 或新增第一封邮件 自动选中第一封
            if (isDel || this.m_tCollection.source.length == 1) {
                this.changeItemSelected(0);
            }
        };
        MailMainWnd.prototype.onGetAttachment = function (data) {
            this.m_btnDel.setTitleLabel(GCode(CLEnum.MAIL_DEL));
        };
        MailMainWnd.NAME = 'MailMainWnd';
        return MailMainWnd;
    }(com_main.CView));
    com_main.MailMainWnd = MailMainWnd;
    /**邮件列表item */
    var MailItem = /** @class */ (function (_super_1) {
        __extends(MailItem, _super_1);
        function MailItem() {
            var _this = _super_1.call(this) || this;
            _this.m_states = ['', 'base', 'fight', 'fight', 'fight', 'source'];
            _this.touchChildren = true;
            return _this;
        }
        MailItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        MailItem.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this);
            com_main.EventManager.removeEventListeners(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.MAIL, ModuleEnums.COUNTRY_UI]);
        };
        MailItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        };
        MailItem.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            this.m_tData = this.data;
            if (this.m_tData) {
                var info = this.m_tData.mailInfo;
                var state = this.m_states[info.type];
                if (state != this.m_curState) {
                    this.m_curState = state;
                    this.currentState = state;
                    this.commitProperties();
                }
                var gay = info.isRead;
                if (info.attachmentType == 1 && !info.isAttachmentState)
                    gay = false;
                Utils.isGray(gay, this.m_pRoot);
                this.m_lbName.text = this.m_tData.mailInfo.title;
                var timeStr = TimerUtils.dateFormat("yyyy-MM-dd   hh:mm", this.m_tData.mailInfo.sendTime);
                this.m_lbTime.text = timeStr;
                switch (state) {
                    case 'base': {
                        this.m_imgMail.source = gay ? "yj_zbxq_icon_02_png" : "yj_zbxq_icon_01_png";
                        break;
                    }
                    case 'fight': {
                        var isWin = this.m_tData.titleInfo.victory == 1;
                        if (this.m_tData.titleInfo.countryId) {
                            if (this.m_tData.titleInfo.countryId != RoleData.countryId)
                                isWin = !isWin;
                        }
                        this.m_imgResult.source = isWin ? "lb_ty1_s_png" : "lb_ty4_b_png";
                        break;
                    }
                    case 'source': {
                        var evtId = this.m_tData.titleInfo.eventDataId;
                        var cfg = C.EventDataConfig[evtId];
                        if (cfg) {
                            this.m_imgBuild.source = "map_build_icon" + cfg.image + "_png";
                            this.m_lbLv.text = cfg.lv.toString();
                        }
                    }
                }
                this.m_pNewRoot.visible = !this.m_tData.mailInfo.isRead;
                this.m_pSelected.visible = this.m_tData.selected;
            }
        };
        return MailItem;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
