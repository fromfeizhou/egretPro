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
    var BoxPro = /** @class */ (function (_super_1) {
        __extends(BoxPro, _super_1);
        function BoxPro() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("activity/newGeneral/componet/BoxProSkin.exml");
            return _this;
        }
        BoxPro.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initEvent();
            this.m_vo = ActivityModel.getActivityVo(AcViewType.NEW_GEN_VIS);
        };
        BoxPro.prototype.$onRemoveFromStage = function () {
            this.removeEvent();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        BoxPro.prototype.initEvent = function () {
            for (var i = 0; i < 4; i++) {
                com_main.EventManager.addTouchScaleListener(this["box" + i], this, this.onClickBox);
            }
        };
        BoxPro.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
        BoxPro.prototype.onClickBox = function (e) {
            var target = e.target;
            var i = 0;
            while (isNull(target.GetBoxState) && i < 10) {
                target = target.parent;
                i++;
            }
            var state = target.GetBoxState();
            var boxIndex = target.getId();
            if (state == 1) {
                //发送领取宝箱奖励协议
                console.log('发送领取宝箱奖励协议');
                ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_BOX_REWARD(this.m_vo.id, boxIndex);
            }
            else {
                var items = this.m_vo.getKeepsakeRewardCfg()[boxIndex - 1].reward;
                Utils.open_view(TASK_UI.NOR_REWARD__PANEL, { awards: items, titleStr: '宝箱奖励' });
            }
        };
        BoxPro.prototype.setBoxList = function (arr) {
            var count = this.m_vo.getCostKeepsake();
            var list = this.m_vo.getBoxReardRecord();
            for (var i = 0; i < 4; i++) {
                this['box' + i].x = 20 + arr[i] / this.m_allPro * (604 - 85);
                this['box' + i].initLb(arr[i], Number(i + 1));
                if (list.indexOf(Number(i + 1)) == -1) {
                    if (arr[i] <= count) {
                        this['box' + i].SetBoxState(1);
                    }
                    else {
                        this['box' + i].SetBoxState(2);
                    }
                }
                else {
                    this['box' + i].SetBoxState(0);
                }
            }
        };
        BoxPro.prototype.setPro = function (allPro, curPro) {
            this.m_allPro = allPro;
            this.m_curPro = curPro;
            this.m_pro.width = Math.min(curPro / allPro * 604, 604);
            var list = [];
            var cfg = this.m_vo.getKeepsakeRewardCfg();
            for (var i = 0; i <= 3; i++) {
                list.push(cfg[i].keepsakeCount);
            }
            this.setBoxList(list);
        };
        return BoxPro;
    }(com_main.CComponent));
    com_main.BoxPro = BoxPro;
})(com_main || (com_main = {}));
