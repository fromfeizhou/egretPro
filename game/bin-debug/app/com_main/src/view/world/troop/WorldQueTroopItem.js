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
     * 行军列队
     */
    var WorldQueTroopItem = /** @class */ (function (_super_1) {
        __extends(WorldQueTroopItem, _super_1);
        function WorldQueTroopItem() {
            var _this = _super_1.call(this) || this;
            _this.name = WorldQueTroopItem.NAME;
            _this.skinName = Utils.getAppSkin("world/troop/WorldQueTroopItemSkin.exml");
            return _this;
        }
        WorldQueTroopItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        WorldQueTroopItem.prototype.onDestroy = function () {
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        WorldQueTroopItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_bSelected = false;
            this.m_bOpen = false;
            this.m_imgHead.mask = this.m_imgHeadMask;
            this.addEvent();
        };
        Object.defineProperty(WorldQueTroopItem.prototype, "selected", {
            get: function () {
                return this.m_bSelected;
            },
            /**设置选中状态 */
            set: function (val) {
                if (this.m_bSelected == val)
                    return;
                this.m_bSelected = val;
                this.m_imgSel.visible = val;
            },
            enumerable: true,
            configurable: true
        });
        /**设置队伍下标 */
        WorldQueTroopItem.prototype.setInfo = function (teamType, order) {
            this.m_nTeamType = teamType;
            this.m_nOrder = order;
            this.m_lbTroop.text = "" + (order + 1);
        };
        Object.defineProperty(WorldQueTroopItem.prototype, "order", {
            get: function () {
                return this.m_nOrder;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorldQueTroopItem.prototype, "open", {
            get: function () {
                return this.m_bOpen;
            },
            /**设置解锁 */
            set: function (val) {
                if (this.m_bOpen == val)
                    return;
                this.m_bOpen = val;
                if (val) {
                    this.m_pStateRoot.visible = true;
                    this.m_imgLock.visible = false;
                    this.m_tTeamVo = TeamModel.getTeamVoByType(this.m_nTeamType, this.m_nOrder);
                    this.refreshHead();
                }
                else {
                    this.m_pHeadRoot.visible = false;
                    this.m_pStateRoot.visible = false;
                    this.m_imgLock.visible = true;
                    this.m_imgEmpty.visible = false;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**刷新头像显示 */
        WorldQueTroopItem.prototype.refreshHead = function () {
            if (!this.m_tTeamVo)
                return;
            if (this.m_tTeamVo.isEmptyTeam()) {
                this.m_pHeadRoot.visible = false;
                this.m_imgEmpty.visible = true;
                return;
            }
            this.m_imgEmpty.visible = false;
            this.m_pHeadRoot.visible = true;
            var info = this.m_tTeamVo.getTeamUiInfo();
            var config = C.GeneralConfig[info.headId];
            this.m_imgHead.source = GeneralModel.getSoldierLogo(config.role);
        };
        //=============================================================================================================================================
        //事件监听 begin
        //============================================================================================================================================= 
        WorldQueTroopItem.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.onTeamUpdateGirdInfo, this);
        };
        WorldQueTroopItem.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
        };
        // private onItemClick() {
        //     if (!this.m_bOpen) {
        //         EffectUtils.showTips(TeamModel.getTeamOpenTips(), 1, true);
        //         return;
        //     }
        //     // if (this.m_tTeamVo.isEmptyTeam()) {
        //     //     Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: this.m_nOrder });
        //     //     return;
        //     // }
        //     if (this.m_callObj && this.m_callback) {
        //         this.m_callback.call(this.m_callObj, this.m_nOrder);
        //     }
        // }
        /* 上阵信息刷新
         * @param changeIds 客户端拟刷新
         *  */
        WorldQueTroopItem.prototype.onTeamUpdateGirdInfo = function (vo) {
            if (!this.m_bOpen)
                return;
            if (this.m_tTeamVo.teamType == vo.teamType && this.m_tTeamVo.id == vo.id) {
                this.refreshHead();
            }
        };
        WorldQueTroopItem.NAME = "WorldQueTroopItem";
        return WorldQueTroopItem;
    }(com_main.CComponent));
    com_main.WorldQueTroopItem = WorldQueTroopItem;
})(com_main || (com_main = {}));
