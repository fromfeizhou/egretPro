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
     * 酒馆预览面板
     */
    var TavernCheckView = /** @class */ (function (_super_1) {
        __extends(TavernCheckView, _super_1);
        function TavernCheckView(data) {
            var _this = _super_1.call(this) || this;
            _this.totalPer = 0; //权重总数
            _this.initApp("tavern/TavernCheckViewSkin.exml");
            return _this;
        }
        TavernCheckView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.TAVERN_ATTRACT,
            ];
        };
        /**处理协议号事件 */
        TavernCheckView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
        };
        TavernCheckView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        TavernCheckView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_PopUp.setTitleLabel(GCode(CLEnum.TAVEN_HREO));
            this.m_PopUp.setBottomBorder(false);
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_List.dataProvider = this.m_pCollection;
            this.m_List.itemRenderer = TavernRender;
            this.m_List.useVirtualLayout = true;
            this.validateNow();
            this.initPanel();
        };
        /**初始化列表 */
        TavernCheckView.prototype.initPanel = function () {
            var heroList = [];
            var heroCfg = C.LotteryConfig;
            this.totalPer = this.getTotalNum(heroCfg);
            for (var i in heroCfg) {
                var vo = heroCfg[i];
                var item = void 0;
                if (vo.rewardType == 8) {
                    item = vo.showItem;
                }
                else {
                    item = vo.item;
                }
                var data = { item: item, currPer: this.getPerNum(vo), totalPer: this.totalPer, rewardType: vo.rewardType, showItem: vo.showItem };
                heroList.push(data);
            }
            heroList.sort(this.checkSort);
            this.m_pCollection.replaceAll(heroList);
        };
        /**品质排序 */
        TavernCheckView.prototype.checkSort = function (a, b) {
            var acfg = PropModel.getCfg(a.item);
            var bcfg = PropModel.getCfg(b.item);
            if (a.rewardType < b.rewardType) {
                return -1;
            }
            else if (a.rewardType > b.rewardType) {
                return 1;
            }
            if (acfg.quality < bcfg.quality) {
                return 1;
            }
            else if (acfg.quality > bcfg.quality) {
                return -1;
            }
            else {
                return 0;
            }
        };
        /**物品总的权重值 */
        TavernCheckView.prototype.getTotalNum = function (heroCfg) {
            var totalNum = 0;
            for (var i in heroCfg) {
                var vo = heroCfg[i];
                totalNum += this.getPerNum(vo);
            }
            return totalNum;
        };
        /**当前物品权重值 */
        TavernCheckView.prototype.getPerNum = function (vo) {
            vo.rate = vo.rate.replace('[', '');
            vo.rate = vo.rate.replace(']', '');
            var allper = vo.rate.split(',');
            var num = Number(allper[0]);
            return num;
        };
        TavernCheckView.NAME = 'TavernCheckView';
        return TavernCheckView;
    }(com_main.CView));
    com_main.TavernCheckView = TavernCheckView;
    /**
    * @class
    * @extends eui.ItemRenderer
    */
    var TavernRender = /** @class */ (function (_super_1) {
        __extends(TavernRender, _super_1);
        function TavernRender() {
            return _super_1.call(this) || this;
        }
        TavernRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        TavernRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tavernItem = new com_main.TavernCheckitem();
            this.addChild(this.m_tavernItem);
        };
        TavernRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_tavernItem.setItemInfo(this.m_tData.item, this.m_tData.currPer, this.m_tData.totalPer);
        };
        return TavernRender;
    }(eui.ItemRenderer));
    com_main.TavernRender = TavernRender;
})(com_main || (com_main = {}));
