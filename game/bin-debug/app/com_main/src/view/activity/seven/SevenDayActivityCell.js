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
    var SevenDayActivityCell = /** @class */ (function (_super_1) {
        __extends(SevenDayActivityCell, _super_1);
        function SevenDayActivityCell() {
            var _this = _super_1.call(this) || this;
            _this.m_state = -1; //0已领取 ，1可补签 2可领奖，-1其他不可点击
            _this.skinName = Utils.getSkinName("app/activity/seven/SevenDayActivityCellSkin.exml");
            return _this;
        }
        SevenDayActivityCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtn, this, this.onClickAward);
        };
        SevenDayActivityCell.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        SevenDayActivityCell.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this.m_pBtn);
        };
        SevenDayActivityCell.prototype.onClickAward = function (e) {
            var data = this.data;
            if (data) {
                if (data.condintion.state == TaskStatus.FINISH)
                    MissionProxy.send_MISSION_REWARD(data.taskId, data.cId);
            }
            else {
                error("MissionView: data is null!");
            }
        };
        SevenDayActivityCell.prototype.dataChanged = function () {
            _super_1.prototype.dataChanged.call(this);
            var info = this.data;
            var curDay = info.subDay;
            var subDay = curDay - info.rewardDay;
            var condintion = info.condintion;
            this.m_labName.textFlow = Utils.htmlParser(info.title);
            var mProgressValue = condintion.count > condintion.maxCount ? condintion.maxCount : condintion.count;
            this.m_labCount.text = mProgressValue + "/" + condintion.maxCount;
            var arwardList = info.rewardItem;
            this.m_pIsGet.visible = condintion.state == TaskStatus.REWARD && subDay >= 0;
            this.m_pBtn.visible = condintion.state != TaskStatus.REWARD && subDay >= 0;
            this.m_pBtn.enabled = condintion.state == TaskStatus.FINISH;
            this.m_openDay.visible = subDay < 0;
            this.m_openDay.text = GCodeFromat(CLEnum.AC_GET_DAY_AFTER, Math.abs(subDay));
            Utils.isGray(condintion.state == TaskStatus.PROCESSING, this.m_pBtn);
            this.m_pBtn.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            var i = 0;
            this.m_RewardRoot.removeChildren();
            for (i = 0; i < arwardList.length; i++) {
                var itemView = com_main.ComItemNew.create("count");
                itemView.scaleX = 0.8;
                itemView.scaleY = 0.8;
                itemView.setItemInfo(arwardList[i].itemId, arwardList[i].count);
                this.m_RewardRoot.addChild(itemView);
            }
        };
        return SevenDayActivityCell;
    }(eui.ItemRenderer));
    com_main.SevenDayActivityCell = SevenDayActivityCell;
})(com_main || (com_main = {}));
