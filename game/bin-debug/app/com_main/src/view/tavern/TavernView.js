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
    var TavernView = /** @class */ (function (_super_1) {
        __extends(TavernView, _super_1);
        function TavernView() {
            var _this = _super_1.call(this) || this;
            _this.m_freeNum = 0; //免费招募次数
            _this.name = TavernView.NAME;
            _this.initApp("tavern/tavern_view.exml");
            return _this;
        }
        TavernView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.TAVERN_INFO,
                ProtoDef.TAVERN_ATTRACT,
            ];
        };
        /**处理协议号事件 */
        TavernView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.TAVERN_INFO: {
                    var data = body;
                    this.refresh_CurTicketNum();
                    this.refreshAwardNum(data.attractNum);
                    this.refresh_CurFreeNum(data.freeAttract);
                    this.refreshSafetyNum(data.score);
                    this.m_currSorce = data.score;
                    break;
                }
                case ProtoDef.TAVERN_ATTRACT: {
                    var data = body;
                    Utils.open_view(TASK_UI.TAVERN_INFO_PANEL, data);
                    break;
                }
            }
        };
        TavernView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labFree.visible = false;
            this.m_MainTopNew.setTitleName(GCode(CLEnum.TAVEN));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.ZML]);
            this.m_pBtnCall.setTitleLabel(GCode(CLEnum.TAVEN_SAFETY_BTN));
            this.m_MaxSorce = ConstUtil.getValue(IConstEnum.TAVERN_EXCHANGE_SCORE);
            com_main.EventManager.addTouchScaleListener(this.m_BuyOneTimes, this, this.onclickTavernOne);
            com_main.EventManager.addTouchScaleListener(this.m_BuyTenTimes, this, this.onclickTavernTen);
            com_main.EventManager.addTouchScaleListener(this.m_pcheckRoot, this, this.onclickCheck);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnInfo, this, this.onclickInfo);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnSafety, this, this.openSafety);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnCall, this, this.onclickCall);
            this.createGeneralEffect();
            this.refreshAwardNum(10);
            this.refreshRare();
            if (TavernView.m_Anim_OutFrame == null)
                TavernView.m_Anim_OutFrame = ImageEffect.load_2(IETypes.EUI_Tavern_OutFrame);
            if (TavernView.m_Anim_Top == null)
                TavernView.m_Anim_Top = ImageEffect.load_2(IETypes.EUI_Tavern_Top);
            this.refresh_CurTicketNum();
            //弄一下分辨率
            TavernProxy.send_TAVERN_INFO();
            /**红点监听 */
            RedPointModel.AddInfoListener(this.m_BuyOneTimes, { x: 232, y: -2 }, [RedEvtType.TANVERN], 2, { tavenType: 0 });
            RedPointModel.AddInfoListener(this.m_BuyTenTimes, { x: 232, y: -2 }, [RedEvtType.TANVERN], 2, { tavenType: 1 });
            Utils.toStageBestScale(this.m_pViewRoot);
            /**检查新手引导面板条件 */
            this.onGuideCondition();
        };
        TavernView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListener(this.m_BuyOneTimes);
            com_main.EventManager.removeEventListener(this.m_BuyTenTimes);
            com_main.EventManager.removeEventListener(this.m_pcheckRoot);
            com_main.EventManager.removeEventListener(this.m_pBtnInfo);
            com_main.EventManager.removeEventListener(this.m_pBtnSafety);
            com_main.EventManager.removeEventListener(this.m_pBtnCall);
            if (TavernView.m_Anim_OutFrame != null) {
                TavernView.m_Anim_OutFrame.removeAction();
                TavernView.m_Anim_OutFrame = null;
            }
            if (TavernView.m_Anim_Top != null) {
                TavernView.m_Anim_Top.removeAction();
                TavernView.m_Anim_Top = null;
            }
            this.clearGeneralEffect();
            //清理模块资源 最后调用 避免龙骨动画没有执行destroy
            DragonBonesManager.cleanDragonBones([IETypes.EUI_GeneralGetCard]);
            SceneResGroupCfg.clearModelRes([ModuleEnums.TAVERN]);
        };
        /**预览 */
        TavernView.prototype.onclickCheck = function () {
            Utils.open_view(TASK_UI.TAVERN_CHECK_PANEL);
        };
        /**规则 */
        TavernView.prototype.onclickInfo = function () {
            Utils.open_view(TASK_UI.COM_HELP_DOC, { content: GCode(CLEnum.TAVEN_TIPS), title: GCode(CLEnum.TAVEN) });
        };
        /**召唤按钮 */
        TavernView.prototype.onclickCall = function () {
            if (this.m_currSorce < this.m_MaxSorce)
                return;
            TavernProxy.C2S_SCORE_EXCHANGE();
        };
        /**保底召唤*/
        TavernView.prototype.openSafety = function () {
            Utils.open_view(TASK_UI.TAVERN_SAFETY_PANEL, this.m_currSorce);
        };
        /**招募一次 */
        TavernView.prototype.onclickTavernOne = function () {
            if (this.m_freeNum > 0) {
                TavernProxy.send_TAVERN_ATTRACT(0);
                return;
            }
            if (RoleData.recruit >= 1) {
                TavernProxy.send_TAVERN_ATTRACT(0);
            }
            else {
                Utils.open_view(TASK_UI.COM_BUY_ITEM_WND, { itemId: PropEnum.ZML, buyType: 0 });
            }
        };
        /**招募十次 */
        TavernView.prototype.onclickTavernTen = function () {
            if (RoleData.recruit >= 9) {
                TavernProxy.send_TAVERN_ATTRACT(1);
            }
            else {
                //let buyTicketNum = 10 - this._ticketNum;
                // if (RoleData.gold >= coinNum * buyTicketNum) {
                // let tip: string = format(this._noticeStrFormat, coinNum * buyTicketNum, buyTicketNum);
                // let view = new com_main.ConfirmPop(tip, null, null, () => TavernProxy.send_TAVERN_ATTRACT(1), null, this);
                // UpManager.popSmallView(view, null, false);
                Utils.open_view(TASK_UI.COM_BUY_ITEM_WND, { itemId: PropEnum.ZML, buyType: 1 });
            }
        };
        TavernView.prototype.refresh_CurTicketNum = function () {
            // this.m_TicketNum.text = this._ticketNum.toString();
        };
        TavernView.prototype.refresh_CurFreeNum = function (free) {
            this.m_freeNum = free;
            this.m_labFree.visible = free <= 0 ? false : true;
            this.m_pCostOne.visible = free <= 0 ? true : false;
        };
        /**刷新次数 */
        TavernView.prototype.refreshAwardNum = function (num) {
            num = 10 - num;
            this.m_extral.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TAVEN_TIPS_EW, num));
        };
        /**刷新保底积分 */
        TavernView.prototype.refreshSafetyNum = function (num) {
            this.m_pScore.text = num + '/' + this.m_MaxSorce;
            this.m_proHB.progress = num / this.m_MaxSorce;
            this.m_proRoot.visible = num < this.m_MaxSorce ? true : false;
            this.m_pBtnCall.visible = !this.m_proRoot.visible;
        };
        /**刷新稀有武将 */
        TavernView.prototype.refreshRare = function () {
            this.m_labRare.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TAVEN_TIPS_EW2, "VIP4"));
        };
        /**检查新手引导面板条件 */
        TavernView.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.TAV_WND);
        };
        //=============================================================================================================================================
        //特效 begin
        //============================================================================================================================================= 
        /**设置红品质特效 */
        TavernView.prototype.createGeneralEffect = function () {
            if (this.m_effect)
                return;
            this.m_effect = NormalMcMgr.createMc(IETypes.EUI_EqLevelEff);
            this.m_pEffRoot.addChild(this.m_effect);
        };
        TavernView.prototype.clearGeneralEffect = function () {
            if (this.m_effect) {
                NormalMcMgr.removeMc(this.m_effect);
                this.m_effect = null;
            }
        };
        TavernView.NAME = 'TavernView';
        return TavernView;
    }(com_main.CView));
    com_main.TavernView = TavernView;
})(com_main || (com_main = {}));
