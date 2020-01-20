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
    var TreaStarComp = /** @class */ (function (_super_1) {
        __extends(TreaStarComp, _super_1);
        function TreaStarComp() {
            return _super_1.call(this) || this;
            // this.skinName = Utils.getAppSkin("treasure/comp/TreaStarCompSkin.exml");
        }
        TreaStarComp.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        TreaStarComp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnStreng.setTitleLabel(GCode(CLEnum.STAR_UP));
            this.m_tCurCollect = new eui.ArrayCollection();
            this.m_listCur.dataProvider = this.m_tCurCollect;
            this.m_listCur.itemRenderer = com_main.ComAttriRender;
            this.m_tNextCollect = new eui.ArrayCollection();
            this.m_listNext.dataProvider = this.m_tNextCollect;
            this.m_listNext.itemRenderer = com_main.ComAttriRender;
            this.addEvent();
        };
        /**初始化界面 */
        TreaStarComp.prototype.initView = function () {
            if (!this.m_curVo)
                return;
            this.refreshCost();
            this.refresLevel();
            RedPointModel.AddInfoListener(this.m_btnStreng, { x: 210, y: -3, scale: 0.78 }, [RedEvtType.TREA_STAR], 2, { treaId: this.itemId });
        };
        /**刷新界面 */
        TreaStarComp.prototype.refreshView = function () {
            this.refreshCost();
            this.refresLevel();
        };
        /**刷新等级属性 */
        TreaStarComp.prototype.refresLevel = function () {
            if (!this.m_curVo)
                return;
            this.m_labCurLv.text = this.m_curVo.star.toString();
            var res = [];
            var curCfg = TreasureModel.getStarCfg(this.m_curVo.star, this.m_curVo.quality);
            var curRateList = StringUtils.keyValsToNumber(curCfg.attriAddRate);
            var curAttri = this.m_curVo.getMainAttris();
            res.push({ state: 'style22', name: GCode(CLEnum.TREA_LV_MAX), value: curCfg.levelLimit.toString() });
            res.push({ state: 'style22', name: GCode(CLEnum.TREA_STONE_BSK), value: curCfg.unlockHole.toString() });
            for (var i = 0; i < curAttri.length; i++) {
                var data = curAttri[i];
                res.push({ state: 'style22', name: Utils.getAttriNameByType(data.key) + ' ', value: Utils.getAttriFormatVal(data) });
            }
            this.m_tCurCollect.replaceAll(res);
            if (this.m_curVo.isMaxStar())
                return;
            this.m_labNextLv.text = (this.m_curVo.star + 1).toString();
            var nextRes = [];
            var nextCfg = TreasureModel.getStarCfg(this.m_curVo.star + 1, this.m_curVo.quality);
            var nextRateList = StringUtils.keyValsToNumber(nextCfg.attriAddRate);
            nextRes.push({ state: 'style22b', name: GCode(CLEnum.TREA_LV_MAX), value: nextCfg.levelLimit.toString() });
            nextRes.push({ state: 'style22b', name: GCode(CLEnum.TREA_STONE_BSK), value: nextCfg.unlockHole.toString() });
            var attList = this.m_curVo.getStarGrowValues();
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
        TreaStarComp.prototype.refreshCost = function () {
            if (!this.m_curVo)
                return;
            if (this.m_curVo.isMaxStar()) {
                this.m_pNextRoot.visible = false;
                this.m_comResCost0.visible = false;
                this.m_comResCost1.visible = false;
            }
            else {
                this.m_pNextRoot.visible = true;
                this.m_comResCost0.visible = true;
                this.m_comResCost1.visible = true;
                var costList = this.getUpStarCost();
                var len = Math.min(costList.length, 2);
                for (var i = 0; i < len; i++) {
                    var data = costList[i];
                    var item = this["m_comResCost" + i];
                    item.setInfo(data.itemId, data.count);
                }
            }
        };
        /**获得升级消耗 */
        TreaStarComp.prototype.getUpStarCost = function () {
            var starCfg = TreasureModel.getStarCfg(this.m_curVo.star, this.m_curVo.quality);
            if (starCfg) {
                var res = [];
                res.push({ itemId: this.m_curVo.treaCfg.fragment, count: starCfg.fragmenNum });
                return res.concat(Utils.parseCommonItemJson(starCfg.consume));
            }
            return [];
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        TreaStarComp.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnStreng, this, this.onBtnStreng);
            com_main.EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onStarUpdate, this);
            com_main.EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onLevelUpdate, this);
        };
        TreaStarComp.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
        };
        /**强化成功回调 */
        TreaStarComp.prototype.onLevelUpdate = function (data) {
            if (data.itemId != this.m_nItemId)
                return;
            this.refresLevel();
        };
        /**升星 */
        TreaStarComp.prototype.onStarUpdate = function (itemId) {
            if (itemId != this.m_nItemId)
                return;
            this.refreshView();
        };
        /**强化按钮回调 */
        TreaStarComp.prototype.onBtnStreng = function () {
            if (!this.m_curVo)
                return;
            if (this.m_curVo.isMaxStar()) {
                EffectUtils.showTips(GCode(CLEnum.TREA_STAR_MAX));
                return;
            }
            var costList = this.getUpStarCost();
            if (PropModel.isItemListEnough(costList, 3)) {
                TreasureProxy.send_TREASURE_UPGRADE_STAR(this.m_nItemId);
            }
        };
        return TreaStarComp;
    }(com_main.TreaBaseComp));
    com_main.TreaStarComp = TreaStarComp;
})(com_main || (com_main = {}));
