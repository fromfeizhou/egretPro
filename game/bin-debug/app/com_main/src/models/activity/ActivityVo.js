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
var ActivityVo = /** @class */ (function (_super_1) {
    __extends(ActivityVo, _super_1);
    function ActivityVo() {
        return _super_1.call(this) || this;
    }
    ActivityVo.prototype.onDestroy = function () {
    };
    ActivityVo.prototype.init = function (body) {
        this.parseKeys(body);
        this.bActivited = false;
        this.bClose = false;
        this.checkIsOpen();
        this.checkPreIcon();
        //发送活动开放事件
        com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this.viewType);
    };
    /**检查是否开启 */
    ActivityVo.prototype.checkIsOpen = function () {
        if (this.bActivited)
            return;
        var time = TimerUtils.getServerTimeMill();
        if (time >= this.openDate && time < this.closeDate) {
            this.activited = true;
        }
    };
    /**预告检测 */
    ActivityVo.prototype.checkPreIcon = function () {
        if (this.bActivited)
            return;
        if (this.preNotice)
            return;
        if (this.preViewDate > 0) {
            if (TimerUtils.getServerTimeMill() > this.preViewDate) {
                this.preNotice = true;
            }
        }
    };
    Object.defineProperty(ActivityVo.prototype, "preNotice", {
        get: function () {
            return this.bPreNotice;
        },
        /**发送预告通知 */
        set: function (val) {
            if (this.bPreNotice == val)
                return;
            this.bPreNotice = val;
            ActivityModel.addActivityVo(this);
            com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this.viewType);
            //预告激活 添加请求数据
            if (this.isNoticeRequest()) {
                this.requestActivityData();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**图标是否可见 */
    ActivityVo.prototype.isOpenIcon = function () {
        if (this.bClose)
            return false;
        var time = TimerUtils.getServerTimeMill();
        if (this.preViewDate > 0) {
            return time > this.preViewDate && time < this.closeIconDate;
        }
        else {
            return time > this.openDate && time < this.closeIconDate;
        }
    };
    /**预告倒计时(ms) */
    ActivityVo.prototype.getPreTime = function () {
        return this.openDate - TimerUtils.getServerTimeMill();
    };
    /**更新数据 */
    ActivityVo.prototype.update = function (body) {
        var isNewAc = false;
        if (this.openDate != body.openDate || this.closeDate != body.closeDate) {
            isNewAc = true;
        }
        this.parseKeys(body);
        //重置的新活动
        if (isNewAc) {
            //过期活动不会执行更新 预告活动等待下一次tick判断
            if (this.activited)
                this.requestActivityInfo();
        }
    };
    /**解析服务器协议 */
    ActivityVo.prototype.parseKeys = function (body) {
        Utils.voParsePbData(this, body, ActivityVo.AttriKey);
    };
    Object.defineProperty(ActivityVo.prototype, "activited", {
        /**是否激活 */
        get: function () {
            return this.bActivited;
        },
        /**活动激活 */
        set: function (val) {
            if (this.bActivited == val)
                return;
            this.bActivited = val;
            if (val) {
                ActivityModel.addActivityVo(this);
                this.requestActivityData();
            }
            com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this.viewType);
        },
        enumerable: true,
        configurable: true
    });
    /**活動關閉 只能由model remove方法调用*/
    ActivityVo.prototype.close = function () {
        this.activited = false;
        this.bClose = true;
        com_main.EventMgr.dispatchEvent(TASK_EVT.POP_ACTIVITY_SINGLE_STATE_CHANGE, this.viewType);
    };
    /**
     * 获得活动进度
     * 0-预告
     * 1-进行
     * 2-结束
     * 3-关闭
     *  */
    ActivityVo.prototype.getProcess = function () {
        var time = TimerUtils.getServerTimeMill();
        if (this.preViewDate > 0 && time > this.preViewDate && time < this.openDate) {
            return IAcProEnum.NOTICE;
        }
        if (time > this.closeIconDate)
            return IAcProEnum.CLOSE;
        if (this.activited)
            return IAcProEnum.PROCESS;
        return IAcProEnum.FINISH;
    };
    /**=====================================================================================
     * 数据配置相关 begin
     * =====================================================================================
     */
    /**请求活动充值配置 */
    ActivityVo.prototype.requestRechargeCfg = function () {
        if (this.bIsInitReCfg)
            return;
        PayProxy.C2S_RECHARGE_CONFIGS(this.id, this.rechargeIds);
    };
    /**解析充值配置表 */
    ActivityVo.prototype.parseRechargeCfg = function (cfgs) {
        this.rechargeCfgs = cfgs;
        this.bIsInitReCfg = true;
    };
    /**请求活动配置与内容 */
    ActivityVo.prototype.requestActivityData = function () {
        if (this.isNeedServerCfg())
            this.requestActivityCfg();
        if (this.rechargeIds.length > 0)
            this.requestRechargeCfg();
        this.requestActivityInfo();
    };
    /**请求活动配置 */
    ActivityVo.prototype.requestActivityCfg = function () {
        if (this.bIsInitCfg)
            return;
        ActivityProxy.C2S_ACTIVITY_COMM_CONFIG(this.id);
    };
    /**解析活动配置 */
    ActivityVo.prototype.parseAcitvityCfg = function (data) {
        this.configs = ActivityModel.parseTable(data[0]);
        if (data.length > 1)
            this.configsII = ActivityModel.parseTable(data[1]);
        this.bIsInitCfg = true;
    };
    /**是否需要读取服务器配置(子类重写) */
    ActivityVo.prototype.isNeedServerCfg = function () {
        /**此处加一行空函数 js文件 否则外网下载不完整此处中断 原因未明 */
        debug('');
        return false;
    };
    /**请求活动内容(子类重写)  */
    ActivityVo.prototype.requestActivityInfo = function () {
    };
    /**是否预告请求 */
    ActivityVo.prototype.isNoticeRequest = function () {
        return false;
    };
    /**跨天请求 */
    ActivityVo.prototype.crossDayRequest = function () {
    };
    /**属性值 */
    ActivityVo.AttriKey = ["id", "rechargeIds", "viewType", "btnId", "preViewDate", "openDate", "closeDate", "closeIconDate"];
    return ActivityVo;
}(BaseClass));
