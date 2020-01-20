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
     * 幸运转盘
     */
    var PayFortuneView = /** @class */ (function (_super_1) {
        __extends(PayFortuneView, _super_1);
        function PayFortuneView(ty) {
            var _this = _super_1.call(this) || this;
            _this.METERIALMAXCOUNT = 4;
            _this.m_nIdex = 1;
            _this.m_nNum = 1;
            _this.m_pStart = false;
            _this.m_nItem = 0;
            _this.m_nTime = -1;
            _this.name = PayFortuneView.NAME;
            _this.initApp("pay/pay_fortune_view.exml");
            return _this;
        }
        PayFortuneView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.TURN_TABLE_VIEW,
                ProtoDef.SPIN_TURN_TABLE,
            ];
        };
        PayFortuneView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.TURN_TABLE_VIEW: {
                    this.updateView();
                    break;
                }
                case ProtoDef.SPIN_TURN_TABLE: {
                    debug("ProtoDef.SPIN_TURN_TABLE====>", body);
                    this.m_nItem = body.id <= 8 ? body.id : body.id - 8;
                    this.onTurnSucceed(body.message);
                    break;
                }
            }
        };
        PayFortuneView.prototype.onDestroy = function () {
            Utils.TimerManager.remove(this.updateTime, this);
            egret.Tween.removeTweens(this.m_pTurnplareCellRoot);
            com_main.EventManager.removeEventListener(this.m_pBtnBuy);
            _super_1.prototype.onDestroy.call(this);
        };
        PayFortuneView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.AC_TUR));
            this.m_MainTopNew.setResources([PropEnum.GOLD]);
            this.m_pBtnBuy.setTitleLabel(GCode(CLEnum.AC_START));
            this.selectDic = Dictionary.create();
            // TurnplateProxy.send_TURN_TABLE_VIEW();
            this.initTurnplateCells();
            this.setCostNum();
            Utils.TimerManager.doTimer(1000, 0, this.updateTime, this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnBuy, this, this.buyClick);
        };
        PayFortuneView.prototype.initTurnplateCells = function () {
            var _this = this;
            this.turnplateCells = [];
            this.turnplateMaterialCells = [];
            for (var i = 0; i < 8; i++) {
                this.turnplateCells.push(this["m_pItem_" + i]);
                this.turnplateCells[i].setSelectState(false);
                this.turnplateMaterialCells.push(this["m_pMaterial" + i]);
                this.turnplateMaterialCells[i].onClickHandler = function (cell) {
                    _this.onClickCell(cell);
                };
            }
        };
        PayFortuneView.prototype.updateTurnplateCells = function () {
            var ids = TurnplateModel.getCurTurnPlateItemList();
            for (var i = 0; i < ids.length; i++) {
                this.turnplateCells[i].setCellId(ids[i]);
                this.turnplateMaterialCells[i].setCellId(ids[i]);
                this.isFreeState = (C.TurnTableConfig[ids[i]] && C.TurnTableConfig[ids[i]].type == 1);
            }
        };
        /**刷新界面 */
        PayFortuneView.prototype.updateView = function () {
            //test
            TurnplateModel.setCurTurnplateItemList(3);
            this.updateTurnplateCells();
        };
        //点击材料
        PayFortuneView.prototype.onClickCell = function (cell) {
            if (this.selectDic.count >= this.METERIALMAXCOUNT && !this.selectDic.has(cell.getItemId())) {
                EffectUtils.showTips(GCode(CLEnum.AC_CHOICE_FOUR), 1, true);
                return;
            }
            if (cell) {
                cell.onClickSuccess();
                var id = cell.getItemId();
                var num = cell.getClickNum();
                if (num <= 0) {
                    if (this.selectDic.has(id))
                        this.selectDic.del(id);
                }
                else
                    this.selectDic.add(id, cell);
            }
            // this.m_pLbCost.font ="font_vip_buy_fnt";
            this.setCostNum();
        };
        PayFortuneView.prototype.setCostNum = function () {
            if (this.isFreeState) {
                this.m_pLbCost.text = "";
                this.m_pLbFreeStr.text = GCode(CLEnum.AC_FREE);
            }
            else {
                var tempNum_1 = 0;
                this.selectDic.forEach(function (key, _data) {
                    tempNum_1 += _data.getCurCostNum();
                }, this);
                this.m_pLbCost.text = tempNum_1 + "";
                this.m_pLbFreeStr.text = "";
            }
            this.m_pCostRoot.visible = !this.isFreeState;
            this.m_pLbSelectNum.text = this.selectDic.count + "/" + this.METERIALMAXCOUNT;
        };
        PayFortuneView.prototype.updateTime = function () {
            this.m_pLbTime.text = Utils.DateUtils.getCountdownStrByTimestamp(TurnplateModel.getEndTime());
            // if( TimerUtils.getServerTimeMill()>TurnplateModel.getEndTime())//主动请求后端刷新
            // TurnplateProxy.send_TURN_TABLE_VIEW();
        };
        //开始转动
        PayFortuneView.prototype.buyClick = function (e) {
            if (this.m_pStart)
                return;
            if (this.selectDic.count <= 0) {
                EffectUtils.showTips(GCode(CLEnum.AC_CHOICE_ITEM), 1, true);
                return;
            }
            this.m_pStart = true;
            debug("=====buyClick============");
            // TurnplateProxy.send_SPIN_TURN_TABLE();
        };
        //转盘结束
        PayFortuneView.prototype.onTurnSucceed = function (reward) {
            this.reset();
            this.reward = reward;
            this.m_nItem = 5; // reward.itemId;
            egret.Tween.get(this.m_pTurnplareCellRoot).wait(500).call(this.action, this);
        };
        //重置
        PayFortuneView.prototype.reset = function () {
            for (var i = 0; i < this.turnplateCells.length; i++) {
                this.turnplateCells[i].setSelectState(i == 0);
            }
            this.m_nNum = 1;
            this.m_nIdex = 0;
            this.m_nItem = 0;
        };
        PayFortuneView.prototype.action = function () {
            this.m_nNum++;
            if (this.m_nNum == 40) {
                this.m_pStart = false;
                return;
            }
            this.onAction();
        };
        PayFortuneView.prototype.onAction = function () {
            this.turnplateCells[this.m_nIdex].setSelectState(false);
            this.m_nIdex++;
            if (this.m_nIdex >= 8)
                this.m_nIdex = 0;
            this.turnplateCells[this.m_nIdex].setSelectState(true);
            var dt = 0;
            if (this.m_nNum <= 20) {
                dt = 500 - this.m_nNum * (80 + this.m_nNum / 10);
                if (dt < 100)
                    dt = 100;
            }
            else {
                dt = 100 + (this.m_nNum - 20) * (50 - (this.m_nNum - 20) / 10);
                if (this.m_nNum > 25 && this.m_nIdex == this.m_nItem) {
                    if (this.reward) {
                        //Utils.open_view(TASK_UI.GET_REWARD_VIEW,this.reward); 
                        this.reward = null;
                    }
                    EffectUtils.showTips(GCodeFromat(CLEnum.AC_GET_ITEM, this.m_nItem), 1, true);
                    this.m_pStart = false;
                    return;
                }
            }
            egret.Tween.get(this.m_pTurnplareCellRoot).wait(dt).call(this.action, this);
        };
        PayFortuneView.NAME = "PayFortuneView";
        return PayFortuneView;
    }(com_main.CView));
    com_main.PayFortuneView = PayFortuneView;
})(com_main || (com_main = {}));
