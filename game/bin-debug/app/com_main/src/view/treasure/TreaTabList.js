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
    var TreaTabList = /** @class */ (function (_super_1) {
        __extends(TreaTabList, _super_1);
        function TreaTabList(width, height) {
            var _this = _super_1.call(this) || this;
            _this.name = TreaTabList.NAME;
            _this.initApp("treasure/TreaTabListSkin.exml");
            _this.width = width;
            _this.height = height;
            return _this;
        }
        TreaTabList.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        TreaTabList.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        TreaTabList.prototype.initView = function () {
            var _this = this;
            if (this.m_bInit)
                return;
            this.m_bInit = true;
            this.m_tTagTypes = [TreaType.ALL, TreaType.WEAPON, TreaType.RIDE,
                TreaType.GEM];
            this.m_tCfgList = TreasureModel.getAllCfgs();
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listItem.itemRenderer = TreaItemRender;
            this.m_listItem.dataProvider = this.m_tCollection;
            //调整item列表			
            egret.callLater(function () {
                if (_this.m_listItem) {
                    if (_this.m_listItem)
                        Utils.tileGroupToCenter(_this.m_listItem, 324);
                }
            }, this);
            this.addEvent();
        };
        /**切卡 */
        TreaTabList.prototype.changeTag = function (index) {
            var list = this.getCfgsByType(this.m_tTagTypes[index]);
            this.m_tCollection.replaceAll(list);
            this.m_pScroll.stopAnimation();
            this.m_pScroll.viewport.scrollV = 0;
        };
        /**获得对应类型列表 */
        TreaTabList.prototype.getCfgsByType = function (type) {
            var res = [];
            for (var i = 0; i < this.m_tCfgList.length; i++) {
                var cfg = this.m_tCfgList[i];
                if (type == TreaType.ALL || type == cfg.type) {
                    res.push(cfg);
                }
            }
            res.sort(function (a, b) {
                var ownerA = TreasureModel.isOwner(a.id);
                var ownerB = TreasureModel.isOwner(b.id);
                if (ownerA == ownerB) {
                    return a.id - b.id;
                }
                if (ownerA)
                    return -1;
                return 1;
            });
            return res;
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        TreaTabList.prototype.addEvent = function () {
            this.m_listItem.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
            com_main.EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onTreaLevel, this);
            com_main.EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onTreaStar, this);
        };
        TreaTabList.prototype.removeEvent = function () {
            this.m_listItem.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
            com_main.EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
        };
        TreaTabList.prototype.onItemSelected = function (e) {
            var data = e.item;
            var itemId = data.id;
            // if (TreasureModel.isOwner(itemId)) {
            Utils.open_view(TASK_UI.TREASURE_INFO, itemId);
            // } else {
            //     EffectUtils.showTips(GCode(CLEnum.TREA_BWWJH));
            // }
        };
        /**宝物等级刷新 */
        TreaTabList.prototype.onTreaLevel = function (data) {
            this.onTreaStar(data.itemId);
        };
        /**宝物星级刷新 */
        TreaTabList.prototype.onTreaStar = function (itemId) {
            for (var i = 0; i < this.m_tCollection.source.length; i++) {
                var data = this.m_tCollection.getItemAt(i);
                if (data.id == itemId) {
                    this.m_tCollection.replaceItemAt(data, i);
                    return;
                }
            }
        };
        TreaTabList.NAME = 'TreaTabList';
        return TreaTabList;
    }(com_main.CView));
    com_main.TreaTabList = TreaTabList;
    /**宝物 */
    var TreaItemRender = /** @class */ (function (_super_1) {
        __extends(TreaItemRender, _super_1);
        function TreaItemRender() {
            return _super_1.call(this) || this;
        }
        TreaItemRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        TreaItemRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        TreaItemRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            if (!this.m_tData)
                return;
            this.m_treaIcon.setItemId(this.m_tData.id);
            this.m_labName.text = this.m_tData.name;
            if (TreasureModel.isOwner(this.m_tData.id)) {
                Utils.isGray(false, this.m_treaIcon);
                var vo = TreasureModel.getData(this.m_tData.id);
                this.refreshOwner(vo.generalId);
                //等级
                this.m_labLevel.text = "+" + vo.level;
                Utils.setLabColorByQuality(this.m_labName, this.m_tData.quality);
                //星级
                this.refreshStar(vo.star);
                RedPointModel.AddInfoListener(this.m_pRoot, { x: 250, y: 220 }, [RedEvtType.TREA_STRENG, RedEvtType.TREA_STAR, RedEvtType.TREA_INLAY], 2, { treaId: this.m_tData.id });
            }
            else {
                Utils.isGray(true, this.m_treaIcon);
                this.m_pOwnerName.visible = false;
                this.m_labLevel.text = '';
                this.m_labName.textColor = GameConfig.TextColors.gray;
                this.m_pStartRoot.removeChildren();
                RedPointModel.RemoveInfoListenerByCode(this.m_pRoot.hashCode);
            }
        };
        /**刷新武将 */
        TreaItemRender.prototype.refreshOwner = function (generalId) {
            if (generalId > 0) {
                this.m_pOwnerName.visible = true;
                this.m_labOwner.text = GeneralModel.getGeneralName(generalId);
            }
            else {
                this.m_pOwnerName.visible = false;
            }
        };
        /**刷新星级 */
        TreaItemRender.prototype.refreshStar = function (starNum) {
            while (this.m_pStartRoot.numChildren > starNum) {
                this.m_pStartRoot.removeChildAt(0);
            }
            for (var i = this.m_pStartRoot.numChildren; i < starNum; i++) {
                var star = new eui.Image();
                star.source = "common_star_png";
                star.width = 30;
                star.height = 30;
                this.m_pStartRoot.addChild(star);
            }
        };
        return TreaItemRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
