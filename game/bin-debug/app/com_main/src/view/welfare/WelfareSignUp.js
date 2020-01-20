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
    /**签到 */
    var WelfareSignUp = /** @class */ (function (_super_1) {
        __extends(WelfareSignUp, _super_1);
        function WelfareSignUp(activiType) {
            var _this = _super_1.call(this) || this;
            _this.m_nProcessLen = 740; //签到进度总长度
            _this.activityType = activiType;
            _this.initApp("welfare/WelfareSignUpSkin.exml");
            return _this;
        }
        WelfareSignUp.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.GET_SIGN_UP,
                ProtoDef.SIGN_UP,
                ProtoDef.SUPPLEMENT_SIGN_UP,
                ProtoDef.RECEIVE_SIGN_UP_EXTRA_REWARD,
                ProtoDef.PATCH_COLLAR_REWARD,
            ];
        };
        /**处理协议号事件 */
        WelfareSignUp.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_SIGN_UP: {
                    // data = body;
                    this.refreshView();
                    break;
                }
                case ProtoDef.SIGN_UP: { //签到
                    WelfareProxy.send_GET_SIGN_UP();
                    break;
                }
                case ProtoDef.SUPPLEMENT_SIGN_UP: { // buqian
                    if (body) {
                        WelfareProxy.send_GET_SIGN_UP();
                    }
                    break;
                }
                case ProtoDef.RECEIVE_SIGN_UP_EXTRA_REWARD: { // 
                    if (body) {
                        WelfareProxy.send_GET_SIGN_UP();
                    }
                    break;
                }
                case ProtoDef.PATCH_COLLAR_REWARD: {
                    if (body) {
                        WelfareProxy.send_GET_SIGN_UP();
                    }
                    break;
                }
            }
        };
        WelfareSignUp.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        WelfareSignUp.prototype.onDestroy = function () {
            this.m_pCellList = null;
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_UI]);
        };
        WelfareSignUp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**初始化界面 */
        WelfareSignUp.prototype.initView = function () {
            if (this.bInit)
                return;
            this.bInit = true;
            this.activiSignUpVo = ActivityModel.getActivityVo(this.activityType);
            this.m_imgIcon.source = Utils.GetResName('hd_' + this.activiSignUpVo.viewType + '_jpg');
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            this.m_nDayNums = Number(new Date(year, month, 0).getDate());
            var signUpCfgs = C.SignUpConfigDic[month];
            this.m_pCellList = [];
            var extraReward = []; //额外奖励
            if (signUpCfgs != null && signUpCfgs != undefined) {
                for (var i = 0; i <= this.m_nDayNums; i++) {
                    var signUpCfg = signUpCfgs[i];
                    if (signUpCfg != null && signUpCfgs != undefined) {
                        var cell = new com_main.WelfareCell(signUpCfg);
                        this.m_pGSroller.addChild(cell);
                        this.m_pCellList.push(cell);
                        if (signUpCfg.extraReward != '') {
                            extraReward.push(signUpCfg);
                        }
                    }
                }
            }
            for (var i = 0; i < extraReward.length; i++) {
                var tx = 40 + extraReward[i].day / this.m_nDayNums * this.m_nProcessLen;
                this["m_signday" + i].x = 245 + tx;
                this["m_point" + i].x = tx - 20;
                this["m_itemcell" + i].x = 245 + tx;
                this["m_signday" + i].text = i == extraReward.length - 1 ? GCode(CLEnum.AC_SIGN_FULL) : GCodeFromat(CLEnum.AC_SIGN_DAY, extraReward[i].day);
                this["m_itemcell" + i].init(extraReward[i]);
            }
            this.refreshView();
        };
        /**设置宽高 */
        WelfareSignUp.prototype.setViewSize = function (width, height) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_pGSroller);
            Utils.toStageBestScaleHeigt(this.m_signGroup);
        };
        /**刷新显示 */
        WelfareSignUp.prototype.refreshView = function () {
            if (!this.activiSignUpVo)
                return;
            var data = this.activiSignUpVo.getSignUpData();
            if (data) {
                for (var i = 0; i < data.times; i++) {
                    this.m_pCellList[i].updateState(0);
                }
                if (this.m_pCellList[data.times]) {
                    this.m_pCellList[data.times].updateBuQian(data.supplementTimes);
                }
                //刷新签到当前次数显示
                var canSign = data.lastTime == 0 || TimerUtils.isOverDay(data.lastTime * 1000);
                if (canSign) {
                    //今天没有签到
                    this.m_pCellList[data.times].updateState(2);
                }
                else if (data.supplement) {
                    //今天已签到 当前格子可以补签
                    this.m_pCellList[data.times].updateState(1);
                }
                else if (data.rewardStatus == 1) {
                    //今天已签到已补签 当前格子可以补领
                    this.m_pCellList[data.times - 1].updateState(3);
                }
                //进度条显示
                this.m_imgProgress.width = this.m_nProcessLen * data.times / this.m_nDayNums;
                this.m_signNum.text = data.times + '/' + this.m_nDayNums;
                //奖励显示
                for (var i = 0; i < 6; i++) {
                    var item = this["m_itemcell" + i];
                    var imgPoint = this["m_point" + i];
                    var canGetAward = false;
                    if (data.notReceiveExtras.indexOf(item.signCfg.id) >= 0) {
                        item.updateState(1);
                        canGetAward = true;
                    }
                    if (data.receiveExtras.indexOf(item.signCfg.id) >= 0) {
                        item.updateState(0);
                        canGetAward = true;
                    }
                    if (canGetAward) {
                        imgPoint.source = "welfare_point1_png";
                    }
                    else {
                        imgPoint.source = "welfare_point_png";
                    }
                }
            }
        };
        return WelfareSignUp;
    }(com_main.CView));
    com_main.WelfareSignUp = WelfareSignUp;
})(com_main || (com_main = {}));
