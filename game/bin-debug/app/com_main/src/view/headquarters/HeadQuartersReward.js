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
    var HeadQuartersReward = /** @class */ (function (_super_1) {
        __extends(HeadQuartersReward, _super_1);
        function HeadQuartersReward(param) {
            var _this = _super_1.call(this) || this;
            _this.name = HeadQuartersReward.NAME;
            return _this;
        }
        Object.defineProperty(HeadQuartersReward.prototype, "_totalStarCnt", {
            /** 访问器 - 最多星星数 */
            get: function () {
                var chapterCfgs = HeadQuartersModel.getChapterCfgs(this._chapterId);
                var starCnt = 0;
                if (chapterCfgs) {
                    chapterCfgs.forEach(function (element) {
                        if (element.stageType != 0)
                            starCnt += 3;
                    });
                }
                return starCnt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeadQuartersReward.prototype, "_curStarCnt", {
            /** 访问器 - 当前已获取的星星数 */
            get: function () {
                var chapterInfo = HeadQuartersModel.getChapterInfo(this._chapterId);
                var starCnt = 0;
                if (chapterInfo && chapterInfo.checkPointInfos) {
                    chapterInfo.checkPointInfos.forEach(function (element) { return starCnt += element.condition.length; });
                }
                return starCnt;
            },
            enumerable: true,
            configurable: true
        });
        HeadQuartersReward.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            for (var index = 0; index < this.m_BoxItems.length; index++) {
                this.m_BoxItems[index].onDestroy();
            }
            this.m_BoxItems = null;
            Utils.TimerManager.remove(this.updateRemainTime, this);
            com_main.EventMgr.removeEventByObject(QuarterEvent.QUARTER_INFO_UPDATE, this);
            _super_1.prototype.onDestroy.call(this);
        };
        HeadQuartersReward.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_BtnBuyTimes, this, this.OnBtnBuyMoppingUpReset);
            com_main.EventManager.addTouchScaleListener(this.m_imgEquip, this, this.OnBtnEquip);
            com_main.EventManager.addTouchScaleListener(this.m_imgGen, this, this.OnBtnGen);
            com_main.EventMgr.addEvent(QuarterEvent.QUARTER_INFO_UPDATE, this.onFunCount, this);
            this.m_BtnBuyTimes.visible = !platform.isHidePayFunc();
        };
        /** 初始化宝箱组件 */
        HeadQuartersReward.prototype.initBoxItem = function () {
            var _this = this;
            this.m_BoxItems = [];
            var _loop_1 = function (i) {
                var boxItem = this_1["m_Box" + i];
                boxItem.InitBox(i);
                this_1.m_BoxItems.push(boxItem);
                com_main.EventManager.addTouchScaleListener(boxItem, this_1, function () { return _this.onBtnBox(boxItem); });
            };
            var this_1 = this;
            for (var i = 0; i < 3; i++) {
                _loop_1(i);
            }
        };
        /** 设置章节ID */
        HeadQuartersReward.prototype.SetChapterId = function (chapterId, level) {
            this._chapterId = chapterId;
            this.m_level = level;
            this.Refresh();
        };
        /** 刷新界面 */
        HeadQuartersReward.prototype.Refresh = function () {
            this.Refresh_StarInfo();
            this.initBoxItem();
            this.Refresh_Config();
            this.Refresh_BoxState();
            this.Refresh_ChallengeCount();
        };
        /** 刷新 - 星星信息 */
        HeadQuartersReward.prototype.Refresh_StarInfo = function () {
            this.m_labCur.text = this._curStarCnt.toString();
            this.m_labAllS.text = '/' + this._totalStarCnt;
            this.m_labAllS.x = this.m_labCur.width + this.m_labCur.x;
            this.m_imgPro.width = (this._curStarCnt / this._totalStarCnt) * this.m_imgProBg.width;
        };
        /** 刷新 - 配置信息 */
        HeadQuartersReward.prototype.Refresh_Config = function () {
            var starRewardCfgGroup = HeadQuartersModel.getChapterStarCfg(this._chapterId);
            if (starRewardCfgGroup && starRewardCfgGroup.length > 0) {
                for (var i = 0; i < this.m_BoxItems.length; i++) {
                    this.m_BoxItems[i].x = (starRewardCfgGroup[i].star / this._totalStarCnt) * this.m_imgProBg.width - this.m_BoxItems[i].width / 2;
                    this.m_BoxItems[i].SetBoxConfig(starRewardCfgGroup[i]);
                }
            }
        };
        /** 刷新 -  挑战次数 */
        HeadQuartersReward.prototype.Refresh_ChallengeCount = function () {
            // this.m_ResetTime.text = HeadQuartersModel.MoppingUpResetCnt.toString();
            // IFunCountEnum.COPY_FREE_COUNT
            this.m_ResetTime.text = NormalModel.getFunCountById(this.m_level).reCount.toString();
            HeadQuartersProxy.send_HQ_GET_LAST_INFO();
        };
        /** 刷新 - 时间*/
        HeadQuartersReward.prototype.onFunCount = function () {
            this.m_ResetTime.text = NormalModel.getFunCountById(this.m_level).reCount.toString();
            var time = HeadQuartersModel.getLastTime(this.m_level);
            if (time > 0) {
                this.reFreshCardTime(time);
            }
            else {
                this.m_labTime.text = '';
                Utils.TimerManager.remove(this.updateRemainTime, this);
            }
        };
        /**刷新倒计时显示 */
        HeadQuartersReward.prototype.reFreshCardTime = function (time) {
            this.num = 0;
            Utils.TimerManager.remove(this.updateRemainTime, this);
            if (time > 0) {
                var curtime = TimerUtils.getServerTimeMill();
                this.alltime = (curtime - time * 1000) * 0.001;
                if (this.alltime >= 30 * 60) {
                    this.alltime = 30 * 60 - (this.alltime - 30 * 60);
                    this.num += 1;
                }
                else {
                    this.alltime = 30 * 60 - this.alltime;
                }
                Utils.TimerManager.doTimer(1000, 0, this.updateRemainTime, this);
                this.m_labTime.text = GCodeFromat(CLEnum.QUA_RESUME_TIPS, Utils.DateUtils.getFormatBySecond(this.alltime, 4));
            }
            else {
                this.m_labTime.text = '';
            }
        };
        /**刷新倒计时 */
        HeadQuartersReward.prototype.updateRemainTime = function () {
            if (this.alltime > 0) {
                if (--this.alltime > 0) {
                    this.m_labTime.text = GCodeFromat(CLEnum.QUA_RESUME_TIPS, Utils.DateUtils.getFormatBySecond(this.alltime, 4));
                }
            }
            else {
                HeadQuartersProxy.send_HQ_GET_LAST_INFO();
            }
        };
        /** 刷新 - 宝箱状态 */
        HeadQuartersReward.prototype.Refresh_BoxState = function () {
            var chapterInfo = HeadQuartersModel.getChapterInfo(this._chapterId);
            if (isNull(chapterInfo))
                return;
            for (var i = 0; i < this.m_BoxItems.length; i++) {
                var item = this.m_BoxItems[i];
                var isReceived = false;
                for (var j = 0; j < chapterInfo.receivedBoxs.length; j++) {
                    var receivedId = chapterInfo.receivedBoxs[j];
                    if (item.BoxId == receivedId) {
                        isReceived = true;
                        break;
                    }
                }
                /**
                 * 如果宝箱ID，存在于后端返回的信息中，说明：宝箱已领取
                 * gameProto.ChapterInfo.receivedBoxs
                 *
                 * 没有领取，则需要判断是否达到领取条件：
                 * 如果：领取宝箱的星星数 >= 当前获取的星星数 ----> 可领取状态
                 * 否则：不可领取状态
                 */
                if (isReceived)
                    item.SetBoxState(0);
                else {
                    item.SetBoxState(this._curStarCnt >= item.NeedStarOpen ? 1 : 2);
                }
            }
            ;
        };
        /** 按钮事件 - 宝箱状态 */
        HeadQuartersReward.prototype.onBtnBox = function (item) {
            var state = item.GetBoxState();
            switch (state) {
                case 0: {
                    EffectUtils.showTips(GCode(CLEnum.QUA_BOX_TIPS));
                    break;
                }
                case 1: {
                    HeadQuartersProxy.send_HQ_RECEIVE_BOX(item.BoxId);
                    break;
                }
                case 2: {
                    EffectUtils.showTips(GCodeFromat(CLEnum.QUA_BOX_LIMIT, item.NeedStarOpen), 1, true);
                    Utils.open_view(TASK_UI.NOR_REWARD__PANEL, { awards: item.GetAwards() });
                    break;
                }
            }
        };
        /** 按钮事件 - 购买挑战次数 */
        HeadQuartersReward.prototype.OnBtnBuyMoppingUpReset = function () {
            HeadQuartersModel.BuyChallengedTimes(this.m_level);
        };
        /** 按钮事件 -跳转到锻造 */
        HeadQuartersReward.prototype.OnBtnEquip = function () {
            Utils.open_view(TASK_UI.POP_EQUIP_MAIN_WND);
        };
        /** 按钮事件 - 跳转到武将 */
        HeadQuartersReward.prototype.OnBtnGen = function () {
            Utils.open_view(TASK_UI.POP_GENERAL_OPEN_INFO_VIEW);
        };
        HeadQuartersReward.NAME = 'HeadQuartersReward';
        return HeadQuartersReward;
    }(com_main.CComponent));
    com_main.HeadQuartersReward = HeadQuartersReward;
})(com_main || (com_main = {}));
