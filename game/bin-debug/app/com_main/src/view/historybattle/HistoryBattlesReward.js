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
    var HistoryBattlesReward = /** @class */ (function (_super_1) {
        __extends(HistoryBattlesReward, _super_1);
        function HistoryBattlesReward(param) {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.HeadQuartersReward.NAME;
            return _this;
        }
        Object.defineProperty(HistoryBattlesReward.prototype, "_totalStarCnt", {
            /** 访问器 - 最多星星数 */
            get: function () {
                var chapterCfgs = HistoryBattleModel.getHistoryWarCfgs(this._chapterId);
                var starCnt = 0;
                if (chapterCfgs) {
                    chapterCfgs.forEach(function (element) {
                        starCnt += 3;
                    });
                }
                return starCnt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HistoryBattlesReward.prototype, "_curStarCnt", {
            /** 访问器 - 当前已获取的星星数 */
            get: function () {
                var chapterInfo = HistoryBattleModel.getHisoryWarInfo(this._chapterId);
                var starCnt = 0;
                if (chapterInfo && chapterInfo.LevelInfos) {
                    chapterInfo.LevelInfos.forEach(function (element) { return starCnt += element.star; });
                }
                return starCnt;
            },
            enumerable: true,
            configurable: true
        });
        HistoryBattlesReward.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            for (var index = 0; index < this.m_BoxItems.length; index++) {
                this.m_BoxItems[index].onDestroy();
            }
            this.m_BoxItems = null;
            // EventMgr.removeEventByObject(QuarterEvent.QUARTER_INFO_UPDATE, this);
            _super_1.prototype.onDestroy.call(this);
        };
        HistoryBattlesReward.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_BtnBuyTimes, this, this.OnBtnBuyMoppingUpReset);
            // EventMgr.addEvent(QuarterEvent.QUARTER_INFO_UPDATE, this.onFunCount, this);
            this.m_BtnBuyTimes.visible = !platform.isHidePayFunc();
        };
        /** 初始化宝箱组件 */
        HistoryBattlesReward.prototype.initBoxItem = function () {
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
        HistoryBattlesReward.prototype.SetChapterId = function (chapterId) {
            this._chapterId = chapterId;
            this.Refresh();
        };
        /** 刷新界面 */
        HistoryBattlesReward.prototype.Refresh = function () {
            this.Refresh_StarInfo();
            this.initBoxItem();
            this.Refresh_Config();
            this.Refresh_BoxState();
            this.Refresh_ChallengeCount();
        };
        /** 刷新 - 星星信息 */
        HistoryBattlesReward.prototype.Refresh_StarInfo = function () {
            this.m_labCur.text = this._curStarCnt.toString();
            this.m_labAllS.text = '/' + this._totalStarCnt;
            this.m_labAllS.x = this.m_labCur.width + this.m_labCur.x;
            this.m_imgPro.width = (this._curStarCnt / this._totalStarCnt) * this.m_imgProBg.width;
        };
        /** 刷新 - 配置信息 */
        HistoryBattlesReward.prototype.Refresh_Config = function () {
            var starRewardCfgGroup = HistoryBattleModel.getHistoryWarStarCfg(this._chapterId);
            if (starRewardCfgGroup && starRewardCfgGroup.length > 0) {
                for (var i = 0; i < this.m_BoxItems.length; i++) {
                    this.m_BoxItems[i].x = (starRewardCfgGroup[i].star / this._totalStarCnt) * this.m_imgProBg.width - this.m_BoxItems[i].width / 2;
                    this.m_BoxItems[i].SetBoxConfig(starRewardCfgGroup[i]);
                }
            }
        };
        /** 刷新 -  挑战次数 */
        HistoryBattlesReward.prototype.Refresh_ChallengeCount = function () {
            this.m_ResetTime.text = NormalModel.getFunCountById(IFunCountEnum.HISTORY_WAR_COUNT).reCount.toString();
        };
        /** 刷新 - 宝箱状态 */
        HistoryBattlesReward.prototype.Refresh_BoxState = function () {
            var chapterInfo = HistoryBattleModel.getHisoryWarInfo(this._chapterId);
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
        HistoryBattlesReward.prototype.onBtnBox = function (item) {
            var state = item.GetBoxState();
            switch (state) {
                case 0: {
                    EffectUtils.showTips(GCode(CLEnum.QUA_BOX_TIPS));
                    break;
                }
                case 1: {
                    // HeadQuartersProxy.send_HQ_RECEIVE_BOX(item.BoxId);
                    HistoryBattleProxy.C2S_HISTORY_WAR_GET_BOX(this._chapterId, item.BoxId);
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
        HistoryBattlesReward.prototype.OnBtnBuyMoppingUpReset = function () {
            HistoryBattleModel.BuyChallengedTimes();
        };
        HistoryBattlesReward.NAME = 'HistoryBattlesReward';
        return HistoryBattlesReward;
    }(com_main.CComponent));
    com_main.HistoryBattlesReward = HistoryBattlesReward;
})(com_main || (com_main = {}));
