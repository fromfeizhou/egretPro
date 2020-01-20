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
    /** 道具 */
    var TreaLvComp = /** @class */ (function (_super_1) {
        __extends(TreaLvComp, _super_1);
        function TreaLvComp() {
            return _super_1.call(this) || this;
            // this.skinName = Utils.getAppSkin("treasure/comp/TreaLvCompSkin.exml");
        }
        TreaLvComp.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        TreaLvComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnStreng.setTitleLabel(GCode(CLEnum.STRENG));
            this.m_tCurCollect = new eui.ArrayCollection();
            this.m_listCur.dataProvider = this.m_tCurCollect;
            this.m_listCur.itemRenderer = com_main.ComAttriRender;
            this.m_tNextCollect = new eui.ArrayCollection();
            this.m_listNext.dataProvider = this.m_tNextCollect;
            this.m_listNext.itemRenderer = com_main.ComAttriRender;
            this.addEvent();
        };
        /**初始化界面 */
        TreaLvComp.prototype.initView = function () {
            if (!this.m_curVo)
                return;
            this.refreshCost();
            this.refresLevel();
            this.refreshSucc();
            RedPointModel.AddInfoListener(this.m_btnStreng, { x: 210, y: -3, scale: 0.78 }, [RedEvtType.TREA_STRENG], 2, { treaId: this.itemId });
        };
        /**刷新界面 */
        TreaLvComp.prototype.refreshView = function () {
            this.refreshCost();
            this.refresLevel();
            this.refreshSucc();
        };
        /**刷新等级属性 */
        TreaLvComp.prototype.refresLevel = function () {
            if (!this.m_curVo)
                return;
            var level = this.m_curVo.level;
            this.m_labCurLv.text = level.toString();
            var res = [];
            var curAttri = this.m_curVo.getMainAttris();
            for (var i = 0; i < curAttri.length; i++) {
                var data = curAttri[i];
                res.push({ state: 'style22', name: Utils.getAttriNameByType(data.key) + ' ', value: Utils.getAttriFormatVal(data) });
            }
            this.m_tCurCollect.replaceAll(res);
            if (this.m_curVo.isMaxLevel())
                return;
            this.m_labNextLv.text = (level + 1).toString();
            var nextRes = [];
            var attList = this.m_curVo.getLevelGrowValues();
            var curCfg = C.TreasureLevelConfig[level];
            var nextCfg = C.TreasureLevelConfig[level + 1];
            var curRateList = StringUtils.keyValsToNumber(curCfg.growUp);
            var nextRateList = StringUtils.keyValsToNumber(nextCfg.growUp);
            for (var i = 0; i < attList.length; i++) {
                var data = attList[i];
                var name_1 = Utils.getAttriNameByType(data.key) + ' ';
                var curRate = Utils.getAttriValByType(curRateList, data.key);
                var nextRate = Utils.getAttriValByType(nextRateList, data.key);
                var rate = nextRate > 0 ? Math.floor((nextRate - curRate) / 100) : 0;
                var val = rate > 0 ? data.value + "(+" + rate + "%)" : "" + data.value;
                nextRes.push({ state: 'style22b', name: name_1, value: val });
            }
            this.m_tNextCollect.replaceAll(nextRes);
        };
        /**刷新消耗 */
        TreaLvComp.prototype.refreshCost = function () {
            if (!this.m_curVo)
                return;
            if (this.m_curVo.isMaxLevel()) {
                this.m_pNextRoot.visible = false;
                this.m_comResCost0.visible = false;
                this.m_comResCost1.visible = false;
            }
            else {
                this.m_pNextRoot.visible = true;
                this.m_comResCost0.visible = true;
                this.m_comResCost1.visible = true;
                var costList = this.getUpLvCost();
                for (var i = 0; i < costList.length; i++) {
                    var data = costList[i];
                    var item = this["m_comResCost" + i];
                    item.setInfo(data.itemId, data.count);
                }
            }
        };
        /**获得升级消耗 */
        TreaLvComp.prototype.getUpLvCost = function () {
            var level = this.m_curVo.level;
            var lvCfg = C.TreasureLevelConfig[level];
            if (lvCfg) {
                return Utils.parseCommonItemJson(lvCfg.consume);
            }
        };
        /**刷新升级率 */
        TreaLvComp.prototype.refreshSucc = function () {
            this.m_labSucce.text = '';
            var level = this.m_curVo.level;
            var lvCfg = C.TreasureLevelConfig[level];
            if (lvCfg) {
                this.m_labSucce.text = '成功率：' + (lvCfg.success * 100) / 1000 + "%";
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        TreaLvComp.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnStreng, this, this.onBtnStreng);
            com_main.EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onLevelUpdate, this);
            com_main.EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onStarUpdate, this);
        };
        TreaLvComp.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
        };
        /**升星 */
        TreaLvComp.prototype.onStarUpdate = function (itemId) {
            if (itemId != this.m_nItemId)
                return;
            this.refresLevel();
        };
        /**强化按钮回调 */
        TreaLvComp.prototype.onBtnStreng = function () {
            if (!this.m_curVo)
                return;
            if (this.m_curVo.isMaxLevel()) {
                EffectUtils.showTips(GCode(CLEnum.TREA_LEVEL_MAX));
                return;
            }
            var cfg = this.m_curVo.getStarCfg();
            if (!cfg)
                return;
            if (this.m_curVo.level >= cfg.levelLimit) {
                EffectUtils.showTips(GCodeFromat(CLEnum.TREA_STAR_FAL, cfg.levelLimit));
                return;
            }
            var costList = this.getUpLvCost();
            if (PropModel.isItemListEnough(costList, 3)) {
                TreasureProxy.send_TREASURE_UP_GRADE(this.m_curVo.itemId);
            }
        };
        /**强化成功回调 */
        TreaLvComp.prototype.onLevelUpdate = function (data) {
            if (data.itemId != this.m_nItemId)
                return;
            this.refreshView();
        };
        return TreaLvComp;
    }(com_main.TreaBaseComp));
    com_main.TreaLvComp = TreaLvComp;
})(com_main || (com_main = {}));
