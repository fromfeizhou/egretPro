// TypeScript file
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
     * 收益加速
     */
    var SpeedUpRewardView = /** @class */ (function (_super_1) {
        __extends(SpeedUpRewardView, _super_1);
        function SpeedUpRewardView(data) {
            var _this = _super_1.call(this) || this;
            _this.m_gold = 0;
            _this.name = SpeedUpRewardView.NAME;
            _this.initApp("patrol/speedUpRewardSkin.exml");
            return _this;
        }
        SpeedUpRewardView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_PATROL_WINE,
            ];
        };
        /**处理协议号事件 */
        SpeedUpRewardView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_PATROL_WINE: {
                    this.refreshInfo();
                }
            }
        };
        SpeedUpRewardView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.confirm_btn, this, this.onclickConfirmBtn);
            this.initView();
            this.initEvent();
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        SpeedUpRewardView.prototype.initEvent = function () {
            com_main.EventMgr.addEvent(NormalEvent.NORMAL_FUN_COUNT, this.onFunCount, this);
        };
        SpeedUpRewardView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(NormalEvent.NORMAL_FUN_COUNT, this);
            com_main.EventManager.removeEventListeners(this);
        };
        SpeedUpRewardView.prototype.initView = function () {
            this.ApopUp.setTitleLabel(GCode(CLEnum.HAN_TITLE_SPEED));
            this.refreshInfo();
        };
        SpeedUpRewardView.prototype.refreshInfo = function () {
            var pervent = VipModel.getPlayerPrivillByType(VipPrivillType.PATROL_REWARD_ADD_RATE) * 100; //挂机vip百分比
            this.silver_vip.text = pervent + "%";
            this.exp_vip.text = pervent + "%";
            var _a = PatrolModel.calculateRewardSpeed(), silverSpeed = _a[0], expSpeed = _a[1];
            this.silver_res.text = "+" + silverSpeed;
            this.exp_res.text = "+" + expSpeed;
            this.todayNum_lb.text = NormalModel.getFunCountById(IFunCountEnum.PATROL_WINE).reCount + '';
            var value = ConstUtil.getValue(IConstEnum.PATROL_SPEED_HOUR);
            this.speedUpTime_lb.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HAN_SPEED_TIPS, value));
            // let alcoholCount = PropModel.getPropNum(PropEnum.Alcohol);
            // if (alcoholCount > 0) {
            //     this.consume_icon.source = PropModel.getPropIcon(PropEnum.Alcohol);
            // } else {
            var useCount = NormalModel.getFunCountById(IFunCountEnum.PATROL_WINE).useCount;
            var consumeList = ConstUtil.keyValsToNumberArray(IConstEnum.PATROL_WINE_CONSUME_GOLD);
            var data = useCount >= consumeList.length ? consumeList[consumeList.length - 1] : consumeList[useCount];
            this.m_gold = data.value;
            if (data.value <= 0) {
                this.m_pConsume.visible = false;
                this.m_labFree.visible = true;
            }
            else {
                this.m_pConsume.visible = true;
                this.m_labFree.visible = false;
                this.consume_icon.source = 'icon_source_gold_png';
                this.consumeNum_lb.text = 'x' + data.value;
            }
            // }
            var wineCount = NormalModel.getFunCountById(IFunCountEnum.PATROL_WINE).reCount;
            if (wineCount == 0) {
                Utils.isGray(true, this.confirm_btn);
            }
            else {
                Utils.isGray(false, this.confirm_btn);
            }
        };
        //点击收取
        SpeedUpRewardView.prototype.onclickConfirmBtn = function () {
            var num = NormalModel.getFunCountById(IFunCountEnum.PATROL_WINE).reCount;
            if (num == 0) {
                if (RoleData.vipLevel < 15) {
                    EffectUtils.showTips(GCode(CLEnum.HAN_SPEED_TIPS1), 1, true);
                }
                else {
                    EffectUtils.showTips(GCode(CLEnum.HAN_SPEED_TIPS2), 1, true);
                }
                return;
            }
            if (PropModel.isItemEnough(PropEnum.GOLD, this.m_gold, 1)) {
                PatrolProxy.send_C2S_PATROL_WINE();
            }
        };
        /**功能次数变动 */
        SpeedUpRewardView.prototype.onFunCount = function (id) {
            if (id != IFunCountEnum.PATROL_WINE)
                return;
            this.refreshInfo();
        };
        SpeedUpRewardView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
            com_main.EventManager.removeEventListeners(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.OFFLINE_UI]);
        };
        SpeedUpRewardView.NAME = 'SpeedUpRewardView';
        return SpeedUpRewardView;
    }(com_main.CView));
    com_main.SpeedUpRewardView = SpeedUpRewardView;
})(com_main || (com_main = {}));
