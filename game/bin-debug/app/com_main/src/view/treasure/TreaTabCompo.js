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
     * 藏宝阁宝石合成
     */
    var TreaTabCompo = /** @class */ (function (_super_1) {
        __extends(TreaTabCompo, _super_1);
        function TreaTabCompo(width, height) {
            var _this = _super_1.call(this) || this;
            _this.name = TreaTabCompo.NAME;
            _this.initApp("treasure/TreaTabCompoSkin.exml");
            _this.width = width;
            _this.height = height;
            return _this;
        }
        TreaTabCompo.prototype.onDestroy = function () {
            this.removeEvent();
            Utils.TimerManager.remove(this.fixItemsPos, this);
            _super_1.prototype.onDestroy.call(this);
        };
        TreaTabCompo.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        /**初始化 */
        TreaTabCompo.prototype.initView = function () {
            var _this = this;
            if (this.m_bInit)
                return;
            this.m_bInit = true;
            this.m_btnAll.setTitleLabel(GCode(CLEnum.TREA_STONE_PL));
            this.m_btnOne.setTitleLabel(GCode(CLEnum.TREA_STOEN_HC));
            this.m_tCollects = new eui.ArrayCollection();
            this.m_listItem.dataProvider = this.m_tCollects;
            this.m_listItem.itemRenderer = TreaStoneRender;
            this.m_bInAction = false;
            egret.callLater(function () {
                if (_this.m_listItem) {
                    if (_this.m_listItem)
                        Utils.tileGroupToCenter(_this.m_listItem, 134);
                }
            }, this);
            this.refreshItemsView();
            this.changeItemSelected(0);
            this.addEvent();
        };
        TreaTabCompo.prototype.changeTag = function (index) {
        };
        /**刷新显示 */
        TreaTabCompo.prototype.refreshItemsView = function () {
            var res = [];
            var propList = PropModel.getGemList();
            for (var i = 0; i < propList.length; i++) {
                var data = propList[i];
                res.push({ uuid: data.uuid, itemId: data.itemId, count: data.count, selected: false, type: data.type });
            }
            this.m_tCollects.replaceAll(res);
        };
        /**排序 */
        TreaTabCompo.prototype.sortItems = function () {
            this.m_tCollects.source.sort(function (a, b) {
                if (a.type == b.type) {
                    return a.itemId - b.itemId;
                }
                return a.type - b.type;
            });
            this.m_nOldScrollV = this.m_listItem.scrollV;
            this.m_tCollects.refresh();
            Utils.TimerManager.remove(this.fixItemsPos, this);
            Utils.TimerManager.doFrame(3, 1, this.fixItemsPos, this);
        };
        TreaTabCompo.prototype.fixItemsPos = function () {
            this.m_listItem.scrollV = this.m_nOldScrollV;
        };
        //刷新合成格子
        TreaTabCompo.prototype.refreshCompoView = function () {
            this.m_pCompoRoot.visible = true;
            var data = this.m_tCollects.getItemAt(this.m_nCurIndex);
            var stoneCfg = C.GemstoneConfig[data.itemId];
            var nextId = stoneCfg.nextId;
            if (stoneCfg == null || nextId == 0) {
                this.hideGemlatticeView();
                return;
            }
            var cost = stoneCfg.cost;
            this.m_comResOne.setInfo(PropEnum.SILVER, cost);
            var count = Math.floor(data.count / 2);
            count = Math.max(1, count);
            this.m_comResAll.setInfo(PropEnum.SILVER, cost * count);
            for (var i = 0; i < 2; i++) {
                var cell = this["m_comItem" + i];
                cell.setItemInfo(data.itemId);
            }
            this.m_comItem.setItemInfo(nextId);
        };
        /**刷新空合成格子 */
        TreaTabCompo.prototype.hideGemlatticeView = function () {
            this.m_pCompoRoot.visible = false;
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        TreaTabCompo.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnAll, this, this.onBtnAll);
            com_main.EventManager.addTouchScaleListener(this.m_btnOne, this, this.onBtnOne);
            this.m_listItem.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
            com_main.EventMgr.addEvent(BagEvent.BAG_ITEM_ADD, this.onBagAdd, this);
            com_main.EventMgr.addEvent(BagEvent.BAG_ITEM_DEL, this.onBagDel, this);
            com_main.EventMgr.addEvent(BagEvent.BAG_ITEM_UPDATE, this.onBagChange, this);
        };
        TreaTabCompo.prototype.removeEvent = function () {
            this.m_listItem.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
            com_main.EventMgr.removeEventByObject(BagEvent.BAG_ITEM_ADD, this);
            com_main.EventMgr.removeEventByObject(BagEvent.BAG_ITEM_DEL, this);
            com_main.EventMgr.removeEventByObject(BagEvent.BAG_ITEM_UPDATE, this);
        };
        /**物品数量变动 */
        TreaTabCompo.prototype.onBagDel = function (uuid) {
            for (var i = 0; i < this.m_tCollects.source.length; i++) {
                var data = this.m_tCollects.getItemAt(i);
                if (data.uuid == uuid) {
                    this.m_tCollects.removeItemAt(i);
                    if (this.m_nCurIndex == i) {
                        this.m_nCurIndex = -1;
                        this.changeItemSelected(0);
                    }
                    break;
                }
            }
            this.sortItems();
        };
        /**物品变动 */
        TreaTabCompo.prototype.onBagAdd = function (uuid) {
            var vo = PropModel.getPropByUId(uuid);
            if (vo.type != PropMainType.STONE)
                return;
            var data = { uuid: vo.uuid, itemId: vo.itemId, count: vo.count, selected: false, type: vo.type };
            this.m_tCollects.addItem(data);
            if (this.m_tCollects.source.length == 1) {
                this.m_nCurIndex = -1;
                this.changeItemSelected(0);
            }
            this.sortItems();
        };
        /**物品变动 */
        TreaTabCompo.prototype.onBagChange = function (uuid) {
            for (var i = 0; i < this.m_tCollects.source.length; i++) {
                var data = this.m_tCollects.getItemAt(i);
                if (data && data.uuid == uuid) {
                    var vo = PropModel.getPropByUId(uuid);
                    data.count = vo.count;
                    this.m_tCollects.replaceItemAt(data, i);
                    if (i == this.m_nCurIndex)
                        this.refreshCompoView();
                }
            }
        };
        /**宝石选中 */
        TreaTabCompo.prototype.onItemSelected = function (e) {
            if (this.m_bInAction)
                return;
            this.changeItemSelected(e.itemIndex);
        };
        /**当前宝石选中 */
        TreaTabCompo.prototype.changeItemSelected = function (index) {
            if (index >= this.m_tCollects.length) {
                this.hideGemlatticeView();
                return;
            }
            if (this.m_nCurIndex == index)
                return;
            this.setItemState(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.setItemState(this.m_nCurIndex, true);
            this.refreshCompoView();
        };
        /**宝石状态切换 */
        TreaTabCompo.prototype.setItemState = function (index, val) {
            var data = this.m_tCollects.getItemAt(this.m_nCurIndex);
            if (!data)
                return;
            data.selected = val;
            this.m_tCollects.replaceItemAt(data, this.m_nCurIndex);
        };
        /**通用条件检查 */
        TreaTabCompo.prototype.checkCondition = function (compoNum) {
            if (compoNum === void 0) { compoNum = 1; }
            var data = this.m_tCollects.getItemAt(this.m_nCurIndex);
            if (!data) {
                EffectUtils.showTips(GCode(CLEnum.TREA_BSHC_FAL), 1, true);
                return false;
                ;
            }
            var stoneCfg = C.GemstoneConfig[data.itemId];
            if (stoneCfg.nextId == 0) {
                EffectUtils.showTips(GCode(CLEnum.TREA_BSHC_TIPS), 1, true);
                return false;
                ;
            }
            if (MainMapModel.getLevelByType(BuildingType.CORNUCOPIA) < stoneCfg.openLevel) {
                EffectUtils.showTips(GCodeFromat(CLEnum.TREA_BSHC_TIPS1, stoneCfg.openLevel), 1, true);
                return false;
            }
            var ownNum = PropModel.getPropNum(data.itemId);
            if (ownNum < 2 * compoNum) {
                EffectUtils.showTips(GCode(CLEnum.TREA_BSHC_FAL1), 1, true);
                return false;
            }
            if (!PropModel.isItemEnough(PropEnum.SILVER, stoneCfg.cost * compoNum, 3))
                return false;
            return true;
        };
        /**单个合成 */
        TreaTabCompo.prototype.onBtnOne = function () {
            if (this.m_bInAction)
                return;
            if (this.checkCondition()) {
                var data = this.m_tCollects.getItemAt(this.m_nCurIndex);
                this.m_nCompId = data.itemId;
                this.m_nCompNum = 2;
                this.playUpLevelEffect();
            }
        };
        /**单个合成 */
        TreaTabCompo.prototype.onBtnAll = function () {
            var data = this.m_tCollects.getItemAt(this.m_nCurIndex);
            if (data) {
                var count = Math.floor(data.count / 2);
                count = Math.max(1, count);
                if (this.checkCondition(count)) {
                    this.m_nCompId = data.itemId;
                    this.m_nCompNum = 2 * count;
                    this.playUpLevelEffect();
                }
            }
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /**升级成功特效 */
        TreaTabCompo.prototype.playUpLevelEffect = function () {
            this.m_bInAction = true;
            var leftEff = new MCDragonBones();
            leftEff.initAsync(IETypes.EUI_UpStoneEff01);
            leftEff.play(IETypes.EUI_UpStoneEff01, 1, true);
            this.m_pEffLeft.addChild(leftEff);
            var rightEff = new MCDragonBones();
            rightEff.initAsync(IETypes.EUI_UpStoneEff01);
            rightEff.playOnceDone(IETypes.EUI_UpStoneEff01, this.playUpLevelEffectII, this);
            this.m_pEffRight.addChild(rightEff);
        };
        /**升级成功特效 */
        TreaTabCompo.prototype.playUpLevelEffectII = function () {
            var _this = this;
            if (this.m_pEffRes) {
                var resEff = new MCDragonBones();
                resEff.initAsync(IETypes.EUI_UpStoneEff02);
                resEff.playOnceDone(IETypes.EUI_UpStoneEff02, function () {
                    _this.m_bInAction = false;
                    TreasureProxy.send_GEMSTONE_UP(_this.m_nCompId, _this.m_nCompNum);
                }, this);
                this.m_pEffRes.addChild(resEff);
            }
        };
        TreaTabCompo.NAME = 'TreaTabCompo';
        return TreaTabCompo;
    }(com_main.CView));
    com_main.TreaTabCompo = TreaTabCompo;
    var TreaStoneRender = /** @class */ (function (_super_1) {
        __extends(TreaStoneRender, _super_1);
        function TreaStoneRender() {
            var _this = _super_1.call(this) || this;
            _this.width = 134;
            _this.height = 134;
            return _this;
        }
        TreaStoneRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        TreaStoneRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_item = com_main.ComItemNew.create('name_num', false);
            this.addChild(this.m_item);
            this.m_imgSelect = new com_main.CImage("SelectKuang_png");
            this.m_imgSelect.x = -4;
            this.m_imgSelect.y = -12;
            this.addChild(this.m_imgSelect);
        };
        TreaStoneRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
            this.m_imgSelect.visible = this.m_tData.selected;
        };
        return TreaStoneRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
