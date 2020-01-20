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
     * 联盟捐献
     */
    var LegionDonationView = /** @class */ (function (_super_1) {
        __extends(LegionDonationView, _super_1);
        function LegionDonationView(size) {
            var _this = _super_1.call(this) || this;
            NodeUtils.setSize(_this, size);
            _this.name = LegionDonationView.NAME;
            _this.initApp('legion/tabView/LegionDonationViewSkin.exml');
            return _this;
        }
        LegionDonationView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        LegionDonationView.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        LegionDonationView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tCollects = new eui.ArrayCollection();
            this.m_pTeachList.dataProvider = this.m_tCollects;
            this.m_pTeachList.itemRenderer = LegionDonationCell;
            this.initTechList();
            this.onRoleResource();
            this.addEvent();
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        /**科技节点 */
        LegionDonationView.prototype.initTechList = function () {
            var list = LegionModel.getTechInfo(); //军团科技信息
            var res = [];
            for (var key in list) {
                var vo = list[key];
                if (unNull(vo)) {
                    res.push({ type: vo.type, name: vo.name, level: vo.level, des: vo.des, source: vo.cfg.icon });
                }
            }
            this.m_tCollects.replaceAll(res);
        };
        /**=====================================================================================
          * 事件监听 begin
          * =====================================================================================
          */
        LegionDonationView.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
            com_main.EventMgr.addEvent(LegionEvent.LEGION_TECH_UPDATE, this.onTechUpdate, this);
            this.m_pTeachList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTechHandler, this);
        };
        LegionDonationView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            com_main.EventMgr.removeEventByObject(LegionEvent.LEGION_TECH_UPDATE, this);
            this.m_pTeachList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTechHandler, this);
        };
        /**科技点击 */
        LegionDonationView.prototype.onTechHandler = function (e) {
            var data = e.item;
            if (data.level < LegionModel.TECH_LEVEL_MAX) {
                Utils.open_view(TASK_UI.LEGION_TECH_WND, { type: data.type });
            }
            else {
                EffectUtils.showTips(GCode(CLEnum.GUILD_TECH_MAX), 1, true);
            }
        };
        /**资源刷新 */
        LegionDonationView.prototype.onRoleResource = function (sourceId) {
            if (sourceId === void 0) { sourceId = PropEnum.GUILD_POINT; }
            if (sourceId != PropEnum.GUILD_POINT)
                return;
            this.m_labScore.text = RoleData.GetMaterialNumById(sourceId).toString();
        };
        /**科技更新 */
        LegionDonationView.prototype.onTechUpdate = function (type) {
            for (var i = 0; i < this.m_tCollects.source.length; i++) {
                var data = this.m_tCollects.getItemAt(i);
                if (type == data.type) {
                    var vo = LegionModel.getTeachVoByType(type);
                    if (!vo)
                        return;
                    data.level = vo.level;
                    data.des = vo.des;
                    this.m_tCollects.replaceItemAt(data, i);
                    break;
                }
            }
        };
        LegionDonationView.NAME = 'LegionDonationView';
        return LegionDonationView;
    }(com_main.CView));
    com_main.LegionDonationView = LegionDonationView;
    var LegionDonationCell = /** @class */ (function (_super_1) {
        __extends(LegionDonationCell, _super_1);
        function LegionDonationCell() {
            var _this = _super_1.call(this) || this;
            _this.touchChildren = false;
            return _this;
        }
        LegionDonationCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.cell = new com_main.LegionDonationItem();
            this.addChild(this.cell);
            this.cacheAsBitmap = true;
        };
        LegionDonationCell.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        LegionDonationCell.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.cell.shoWInfo(this.m_tData.name, this.m_tData.level, this.m_tData.des, this.m_tData.source);
        };
        return LegionDonationCell;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
