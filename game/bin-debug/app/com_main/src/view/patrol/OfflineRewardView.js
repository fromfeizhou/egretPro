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
     * 离线收益
     */
    var OfflineRewardView = /** @class */ (function (_super_1) {
        __extends(OfflineRewardView, _super_1);
        function OfflineRewardView(data) {
            var _this = _super_1.call(this) || this;
            _this.name = OfflineRewardView.NAME;
            _this.initApp("patrol/offLineRewardSkin.exml");
            return _this;
        }
        OfflineRewardView.prototype.listenerProtoNotifications = function () {
            return [
            //    ProtoDef.GET_PATROL,
            ];
        };
        /**处理协议号事件 */
        OfflineRewardView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        OfflineRewardView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.vip_btn, this, this.onClickVipBtn);
            com_main.EventManager.addTouchScaleListener(this.tech_btn, this, this.onclickTechBtn);
            com_main.EventManager.addTouchScaleListener(this.get_btn, this, this.onclickGetReward);
            this.initView();
        };
        OfflineRewardView.prototype.initView = function () {
            this.ApopUp.setTitleLabel(GCode(CLEnum.HAN_AWARD_OFF));
            this.get_btn.setTitleLabel(GCode(CLEnum.SURE));
            var lastReceviceTTime = RoleData.offlineStamp * 1000;
            var curtime = TimerUtils.getServerTimeMill();
            var sec = Math.floor((curtime - lastReceviceTTime) / 1000);
            var vipLineCfg = C.VipPrivillegesConfig[VipPrivillType.MAX_OFFLINE_INCOME];
            var offLine = Number(vipLineCfg['vip' + RoleData.vipLevel]);
            var maxSec = offLine * 3600 < sec ? offLine * 3600 : sec;
            var _a = PatrolModel.calculateRewardSpeed(maxSec), silver = _a[0], exp = _a[1];
            var vipCfg = C.VipPrivillegesConfig[VipPrivillType.PATROL_REWARD_ADD_RATE];
            var pervent = VipModel.getPlayerPrivillByType(VipPrivillType.PATROL_REWARD_ADD_RATE) * 100;
            this.silver_tec.text = 0 + "%";
            this.exp_tec.text = 0 + "%";
            this.silver_vip.text = pervent + "%";
            this.exp_vip.text = pervent + "%";
            this.silver_res.text = "+" + silver;
            this.exp_res.text = "+" + exp;
            var hour = Math.floor(sec / 3600);
            var minSce = sec % 3600;
            var min = Math.floor(minSce / 60);
            this.rewardTime_lb.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HAN_TIPS, hour, min));
            this.maxRewardTime_lb.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.HAN_TIPS1, offLine));
            this.tips_lb.textFlow = Utils.htmlParser(GCode(CLEnum.HAN_TIPS2));
        };
        //点击vip
        OfflineRewardView.prototype.onClickVipBtn = function (e) {
        };
        //点击科技加成
        OfflineRewardView.prototype.onclickTechBtn = function () {
        };
        //点击收取
        OfflineRewardView.prototype.onclickGetReward = function () {
            // PatrolProxy.send_C2S_PATROL_RECEIVE_REWARD(false);
            com_main.UpManager.close(false);
        };
        OfflineRewardView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.OFFLINE_UI]);
        };
        OfflineRewardView.NAME = 'OfflineRewardView';
        return OfflineRewardView;
    }(com_main.CView));
    com_main.OfflineRewardView = OfflineRewardView;
})(com_main || (com_main = {}));
