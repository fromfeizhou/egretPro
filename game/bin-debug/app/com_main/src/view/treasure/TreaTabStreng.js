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
    var TreaTabStreng = /** @class */ (function (_super_1) {
        __extends(TreaTabStreng, _super_1);
        function TreaTabStreng(width, height, itemId) {
            var _this = _super_1.call(this) || this;
            _this.name = TreaTabStreng.NAME;
            _this.initApp("treasure/TreaTabStrengSkin.exml");
            _this.width = width;
            _this.height = height;
            _this.m_nItemId = itemId;
            return _this;
        }
        TreaTabStreng.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        TreaTabStreng.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            Utils.toStageBestScale(this.m_pViewRoot);
            this.m_tViews = [];
            this.m_tViews.push(this.m_treaInfo);
            this.m_tViews.push(this.m_treaLvComp);
            this.m_tViews.push(this.m_treaStar);
            this.m_tViews.push(this.m_treaInlay);
            this.initView();
            this.changeTag(0);
            this.addEvent();
        };
        TreaTabStreng.prototype.initView = function () {
            this.m_tTreaVo = TreasureModel.getData(this.m_nItemId);
            var isShow = this.m_tTreaVo ? false : true;
            this.m_tOwnerList = TreasureModel.getAllList(TreasureModel.isOwner(this.m_nItemId));
            if (this.m_tOwnerList.length == 1) {
                this.m_btnLeft.visible = false;
                this.m_btnRight.visible = false;
            }
            else {
                this.m_btnLeft.visible = true;
                this.m_btnRight.visible = true;
            }
            if (!this.m_tTreaVo) {
                this.m_tTreaVo = TreasureModel.getPreViewVo(this.m_nItemId);
            }
            this.m_treaInfo.baoWuFrom(isShow);
            if (this.m_tTreaVo) {
                this.refreshIcon();
                this.refreshStar();
                this.initStone();
                this.refreshLevel();
                this.refreshFight();
            }
        };
        Object.defineProperty(TreaTabStreng.prototype, "itemId", {
            get: function () {
                return this.m_nItemId;
            },
            /**设置itemId */
            set: function (val) {
                if (this.m_nItemId == val)
                    return;
                this.m_nItemId = val;
                this.initView();
            },
            enumerable: true,
            configurable: true
        });
        /**设置当前切卡 */
        TreaTabStreng.prototype.changeTag = function (index) {
            if (this.m_nCurIndex == index)
                return;
            this.m_nCurIndex = index;
            for (var i = 0; i < this.m_tViews.length; i++) {
                var isCur = i == index;
                this.m_tViews[i].visible = isCur;
                if (isCur)
                    this.m_tViews[i].itemId = this.m_nItemId;
            }
            this.m_pInlayRoot.visible = index == 3;
        };
        /**刷新图标 */
        TreaTabStreng.prototype.refreshIcon = function () {
            this.m_treaIcon.setItemId(this.m_nItemId, true);
            this.m_treaIcon.createEffect();
            this.m_labName.text = this.m_tTreaVo.treaCfg.name;
            Utils.setLabColorByQuality(this.m_labName, this.m_tTreaVo.quality);
        };
        /**刷新等级 */
        TreaTabStreng.prototype.refreshLevel = function () {
        };
        /**刷新战斗力 */
        TreaTabStreng.prototype.refreshFight = function (isAct) {
            if (isAct === void 0) { isAct = false; }
            if (this.m_tTreaVo) {
                this.m_comFightItem.setFight(this.m_tTreaVo.fight, isAct);
            }
        };
        /**刷新星级 */
        TreaTabStreng.prototype.refreshStar = function () {
            var starNum = this.m_tTreaVo.star;
            while (this.m_pStarRoot.numChildren > starNum) {
                this.m_pStarRoot.removeChildAt(0);
            }
            for (var i = this.m_pStarRoot.numChildren; i < starNum; i++) {
                var star = new eui.Image();
                star.source = "common_star_png";
                this.m_pStarRoot.addChild(star);
            }
        };
        /**初始化宝石 */
        TreaTabStreng.prototype.initStone = function () {
            if (!this.m_tTreaVo)
                return;
            var holes = this.m_tTreaVo.holes;
            for (var i = 0; i < holes.length; i++) {
                var cell = this["m_stone" + i];
                cell.setStoneInfo(holes[i].gemstoneId, i);
            }
            this.refresStoneLocked();
        };
        /**刷新解锁状态 */
        TreaTabStreng.prototype.refresStoneLocked = function () {
            if (!this.m_tTreaVo)
                return;
            var openNum = this.m_tTreaVo.holeOpenNum;
            for (var i = 0; i < 4; i++) {
                var cell = this["m_stone" + i];
                cell.setLockedState(openNum <= cell.holeId);
            }
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        TreaTabStreng.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnLeft, this, this.onBtnLeft);
            com_main.EventManager.addTouchScaleListener(this.m_btnRight, this, this.onBtnRight);
            com_main.EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onTreaLevel, this);
            com_main.EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onTreaStar, this);
            com_main.EventMgr.addEvent(TreaEvent.TREA_STONE_UPDATE, this.onTreaStone, this);
            for (var i = 0; i < 4; i++) {
                var cell = this["m_stone" + i];
                com_main.EventManager.addTouchTapListener(cell, this, this.onStoneCellHandler);
            }
        };
        TreaTabStreng.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_STONE_UPDATE, this);
        };
        /**镶嵌点击 */
        TreaTabStreng.prototype.onStoneCellHandler = function (e) {
            if (!this.m_tTreaVo) {
                return;
            }
            var cell = e.$currentTarget;
            if (!cell)
                return;
            if (cell.isInLocked()) {
                var openLv = this.m_tTreaVo.getStoneOpenStar(cell.holeId);
                EffectUtils.showTips(GCodeFromat(CLEnum.TREA_BS_OPEN, openLv), 1, true);
                return;
            }
            var list = PropModel.getGemList(PropStoneType.ALL);
            if (list.length == 0 && cell.itemId == 0) {
                EffectUtils.showTips(GCode(CLEnum.TREA_BS_TIPS1), 1, true);
                return;
            }
            var param = { itemId: this.m_nItemId, pos: cell.holeId, oldStoneId: cell.itemId };
            Utils.open_view(TASK_UI.TREASURE_INLAY, param);
        };
        /**宝物等级刷新 */
        TreaTabStreng.prototype.onTreaLevel = function (data) {
            var list = [];
            if (data.level == 0) {
                EffectUtils.showTips(GCode(CLEnum.TREA_UP_TIPS1), 1, true);
                return;
            }
            if (data.level > 0) {
                list.push(GCodeFromat(CLEnum.LEVEL_ADD, data.level));
            }
            else {
                list.push(GCode(CLEnum.LEVEL2) + "<font color=#ff0000>" + data.level + "</font>");
            }
            this.doFightAct(list);
        };
        /**宝物星级刷新 */
        TreaTabStreng.prototype.onTreaStar = function () {
            this.refreshStar();
            this.refresStoneLocked();
            this.doFightAct([GCodeFromat(CLEnum.STAR_ADD, 1)]);
        };
        /**宝物宝石刷新 */
        TreaTabStreng.prototype.onTreaStone = function () {
            /**刷新宝石显示 */
            if (!this.m_tTreaVo)
                return;
            var holes = this.m_tTreaVo.holes;
            for (var i = 0; i < holes.length; i++) {
                var cell = this["m_stone" + i];
                cell.itemId = holes[i].gemstoneId;
            }
            this.doFightAct();
        };
        /**战力动画 */
        TreaTabStreng.prototype.doFightAct = function (list) {
            if (list === void 0) { list = []; }
            var oldFight = this.m_comFightItem.getFight();
            ;
            var change = this.m_tTreaVo.fight - oldFight;
            if (change == 0)
                return;
            var res = change > 0 ? GCodeFromat(CLEnum.FIGHT_ADD, change) : GCodeFromat(CLEnum.FIGHT_CUT, change);
            list.push(res);
            TipsUtils.showTipsFightUpList(list, new egret.Point(0, 0), this.m_pLabEffRoot);
            this.refreshFight(true);
        };
        /**左切换 */
        TreaTabStreng.prototype.onBtnLeft = function () {
            this.changeTrea(true);
        };
        /**右切换 */
        TreaTabStreng.prototype.onBtnRight = function () {
            this.changeTrea();
        };
        /**切卡宝物 */
        TreaTabStreng.prototype.changeTrea = function (isLeft) {
            if (isLeft === void 0) { isLeft = false; }
            var index = this.m_tOwnerList.indexOf(this.m_nItemId);
            if (isLeft)
                index--;
            else
                index++;
            var length = this.m_tOwnerList.length;
            if (index < 0) {
                index = length - 1;
            }
            if (index >= length) {
                index = 0;
            }
            this.itemId = this.m_tOwnerList[index];
            //当前切卡刷新
            this.m_tViews[this.m_nCurIndex].itemId = this.m_nItemId;
        };
        TreaTabStreng.NAME = 'TreaTabStreng';
        return TreaTabStreng;
    }(com_main.CView));
    com_main.TreaTabStreng = TreaTabStreng;
})(com_main || (com_main = {}));
