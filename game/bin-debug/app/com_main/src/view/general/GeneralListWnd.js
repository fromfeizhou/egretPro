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
    var GeneralListWnd = /** @class */ (function (_super_1) {
        __extends(GeneralListWnd, _super_1);
        function GeneralListWnd() {
            var _this = _super_1.call(this) || this;
            _this.m_ownIdList = [];
            _this.m_noneIdList = [];
            _this.m_selectGeneralId = null;
            _this.m_tabGenType = [null, SoldierMainType.RIDESOLDIER, SoldierMainType.FOOTSOLDIER, SoldierMainType.ARROWSOLDIER, SoldierMainType.PIKEMAN];
            _this.name = GeneralListWnd.NAME;
            _this.initApp("general/GeneralListWndSkin.exml");
            _this.m_cacheCards = new Dictionary();
            _this.m_tickIdList = [];
            return _this;
        }
        GeneralListWnd.prototype.listenerProtoNotifications = function () {
            return [ProtoDef.RECRUITED_GENERAL, ProtoDef.GENERAL_USE_EXP_BOOK, ProtoDef.GENERAL_UP_STAR, ProtoDef.OPEN_SKILL, ProtoDef.GENERAL_TREASURE_WEAR];
        };
        GeneralListWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.RECRUITED_GENERAL: {
                    this.refreshList(this.m_tabGenType[this.m_comTabGroup.selectedIndex]);
                    //武将碎片合成
                    if (body.generalInfo) {
                        var generalId = body.generalInfo.generalId;
                        var param = { generalId: generalId };
                        Utils.open_view(TASK_UI.POP_GENERAL_GET_VIEW, param);
                        if (generalId) {
                            var card = this.m_cacheCards.get(generalId);
                            if (card) {
                                card.refresh();
                            }
                        }
                    }
                    break;
                }
                //经验更新
                case ProtoDef.GENERAL_USE_EXP_BOOK: {
                    var generalId = body.generalInfo.generalId;
                    if (generalId) {
                        var card = this.m_cacheCards.get(generalId);
                        if (card) {
                            card.refreshLevelNum();
                        }
                    }
                    this.refreshList(this.m_tabGenType[this.m_comTabGroup.selectedIndex]);
                    break;
                }
                //升星
                case ProtoDef.GENERAL_UP_STAR: {
                    var generalId = body.generalInfo.generalId;
                    var card = this.m_cacheCards.get(generalId);
                    if (card) {
                        card.refreshStar();
                    }
                    this.refreshList(this.m_tabGenType[this.m_comTabGroup.selectedIndex]);
                    break;
                }
                //技能升级,宝物穿戴刷新武将顺序
                case ProtoDef.GENERAL_TREASURE_WEAR:
                case ProtoDef.GENERAL_UP_STAR: {
                    this.refreshList(this.m_tabGenType[this.m_comTabGroup.selectedIndex]);
                    break;
                }
            }
        };
        GeneralListWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            if (this.m_cacheCards) {
                this.m_cacheCards.forEach(function (key, data) { data.onDestroy(); });
                this.m_cacheCards.clear();
                this.m_cacheCards = null;
            }
            Utils.TimerManager.remove(this.createItemTick, this);
            com_main.EventManager.removeEventListeners(this);
            //清理模块资源 最后调用 避免龙骨动画没有执行destroy
            DragonBonesManager.cleanDragonBones([IETypes.EUI_GeneralGetCard]);
            SceneResGroupCfg.clearModelRes([ModuleEnums.GENERAL]);
        };
        GeneralListWnd.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            this.m_mainTop.setTitleName(GCode(CLEnum.GEN_TITLE_WJLB));
            this.m_mainTop.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.GEN_TAB_ALL) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.GEN_TAB_QB) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.GEN_TAB_BB) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.GEN_TAB_GB) });
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.GEN_TAB_QB1) });
            this.m_comTabGroup.setChangeCallback(this.onTabBtnClick, this);
            this.validateNow();
            var width = this.m_itemScroll.width;
            this.group_hava_general.width = width;
            this.group_no_general.width = width;
            egret.callLater(function () {
                if (_this.group_no_general && _this.group_no_general) {
                    Utils.tileGroupToCenter(_this.group_no_general, 142);
                    Utils.tileGroupToCenter(_this.group_hava_general, 142);
                }
            }, this);
            this.refreshList(this.m_tabGenType[0]);
            /**检查新手引导面板条件 */
            this.onGuideCondition();
        };
        GeneralListWnd.prototype.onclickButtonReturn = function () {
            com_main.UpManager.history();
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        GeneralListWnd.prototype.refreshList = function (armyType) {
            this.m_itemScroll.stopAnimation();
            this.m_itemScroll.viewport.scrollV = 0;
            var list = GeneralModel.getOwnGeneralWithSort(armyType); //GeneralModel.getAllGeneralConfig(RoleData.level);
            this.clearGeneralItemNode();
            this.createNoGeneral(armyType, true);
            this.createOwnGeneral(list);
            this.createNoGeneral(armyType);
            if (this.m_tickIdList.length > 0) {
                Utils.TimerManager.doTimer(30, 0, this.createItemTick, this);
            }
        };
        /**创建元素 */
        GeneralListWnd.prototype.createItemTick = function () {
            if (!this.m_tickIdList || this.m_tickIdList.length == 0) {
                Utils.TimerManager.remove(this.createItemTick, this);
                /**已拥有武将创建完毕 开始添加未拥有武将时*/
                this.onGuideConditionCreate();
                return;
            }
            var generalId = this.m_tickIdList.shift();
            var generalVo = GeneralModel.getOwnGeneral(generalId);
            var generalCard;
            if (this.m_cacheCards.has(generalId)) {
                generalCard = this.m_cacheCards.get(generalId);
            }
            else {
                generalCard = new com_main.GeneralHeadItem(generalId);
                generalCard.touchChildren = false;
                generalCard.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGeneralCardBegin, this);
                generalCard.cacheAsBitmap = true;
                this.m_cacheCards.add(generalId, generalCard);
            }
            if (generalVo.own) {
                this.group_hava_general.addChild(generalCard);
                this.group_hava_general.validateNow();
            }
            else {
                if (generalCard.suipianNum >= generalCard.needSuipian) {
                    this.group_hava_general.addChild(generalCard);
                    this.group_hava_general.validateNow();
                }
                else {
                    this.group_no_general.addChild(generalCard);
                    this.group_no_general.validateNow();
                    /**已拥有武将创建完毕 开始添加未拥有武将时*/
                    this.onGuideConditionCreate();
                }
            }
            //重绘
            // this.validateNow();
        };
        /**清理显示节点 */
        GeneralListWnd.prototype.clearGeneralItemNode = function () {
            //停止自动创建队列
            this.m_tickIdList = [];
            Utils.TimerManager.remove(this.createItemTick, this);
            this.m_ownIdList = [];
            this.group_hava_general.removeChildren();
            this.m_noneIdList = [];
            this.group_no_general.removeChildren();
        };
        GeneralListWnd.prototype.createOwnGeneral = function (list) {
            list.sort(GeneralModel.compareOfOnBattle);
            for (var key in list) {
                var vo = list[key];
                var generalCard = void 0;
                if (this.m_cacheCards.has(vo.generalId)) {
                    generalCard = this.m_cacheCards.get(vo.generalId);
                    this.group_hava_general.addChild(generalCard);
                }
                else {
                    this.m_tickIdList.push(vo.generalId);
                }
                this.m_ownIdList.push(vo.generalId);
            }
        };
        //尚未招募
        GeneralListWnd.prototype.createNoGeneral = function (armyType, isEnough) {
            if (isEnough === void 0) { isEnough = false; }
            var list = GeneralModel.getAllGeneralConfig(null, armyType);
            list.none.sort(GeneralModel.compareNoGeneral);
            for (var key in list.none) {
                var vo = list.none[key];
                var suipianNum = PropModel.getPropNum(vo.itemId);
                if (!isEnough && suipianNum >= vo.soul)
                    continue;
                if (isEnough && suipianNum < vo.soul)
                    continue;
                var generalCard = void 0;
                if (this.m_cacheCards.has(vo.id)) {
                    generalCard = this.m_cacheCards.get(vo.id);
                    if (generalCard.suipianNum >= generalCard.needSuipian) {
                        this.group_hava_general.addChild(generalCard);
                    }
                    else {
                        this.group_no_general.addChild(generalCard);
                    }
                }
                else {
                    this.m_tickIdList.push(vo.id);
                }
                this.m_noneIdList.push(vo.id);
            }
        };
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        GeneralListWnd.prototype.onGeneralCardBegin = function (e) {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
            var card = e.target;
            this.m_selectGeneralId = card.generalId;
            var vo = GeneralModel.getOwnGeneral(this.m_selectGeneralId);
            if (vo) {
                // let param = { generalId: this.m_selectGeneralId };
                // SceneManager.openView("com_main.GeneralGetInfoView", param, null, UpManager.STYLE_FULL,true, false);
                if (!vo.own && card.suipianNum >= card.needSuipian) {
                    GeneralProxy.send_RECRUITED_GENERAL(card.generalId);
                    return;
                }
                var param = { generalId: this.m_selectGeneralId, ownList: this.m_ownIdList, noList: this.m_noneIdList };
                Utils.open_view(TASK_UI.POP_GENERAL_OPEN_DETAIL_VIEW, param);
            }
            //SceneManager.openView("com_main.GeneralDetailedInfoView", param, null, UpManager.STYLE_MAIN_FULL, false, true);
        };
        /**切卡按钮点击 */
        GeneralListWnd.prototype.onTabBtnClick = function (selectedIndex) {
            this.refreshList(this.m_tabGenType[selectedIndex]);
        };
        //获取招募武将
        GeneralListWnd.prototype.getEquipGeneralByIndex = function (index) {
            return this.group_hava_general.getChildAt(index);
        };
        /**获得卡牌 */
        GeneralListWnd.prototype.getOwnerCardById = function (id) {
            for (var i = 0; i < this.group_hava_general.numChildren; i++) {
                var item = this.group_hava_general.getChildAt(i);
                if (item.generalId == id) {
                    this.group_hava_general.setChildIndex(item, 0);
                    this.group_hava_general.validateNow();
                    return item;
                }
            }
        };
        /**检查新手引导面板条件 */
        GeneralListWnd.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GEN_LIST_WND);
        };
        GeneralListWnd.prototype.onGuideConditionCreate = function () {
            if (this.m_bGuideCreate)
                return;
            this.m_bGuideCreate = true;
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.GEN_LIST_CR);
        };
        /**=====================================================================================
         * 静态对象 begin
         * =====================================================================================
         */
        /**全局获取静态对象 */
        GeneralListWnd.getClass = function () {
            var obj = SceneManager.getClass(LayerEnums.POPUP, GeneralListWnd.NAME);
            return obj;
        };
        /**获得第一排卡牌 */
        GeneralListWnd.getOwnerCardById = function (id) {
            var obj = this.getClass();
            if (obj) {
                return obj.getOwnerCardById(id);
            }
        };
        GeneralListWnd.NAME = "GeneralListWnd";
        return GeneralListWnd;
    }(com_main.CView));
    com_main.GeneralListWnd = GeneralListWnd;
})(com_main || (com_main = {}));
