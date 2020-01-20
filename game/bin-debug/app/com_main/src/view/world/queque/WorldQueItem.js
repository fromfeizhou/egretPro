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
    var WorldQueItem = /** @class */ (function (_super_1) {
        __extends(WorldQueItem, _super_1);
        function WorldQueItem(iid) {
            var _this = _super_1.call(this) || this;
            _this.name = WorldQueItem.NAME;
            _this.skinName = Utils.getAppSkin("world/queque/WorldQueItemSkin.exml");
            return _this;
        }
        WorldQueItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = false; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        WorldQueItem.prototype.onDestroy = function () {
            this.m_callObj = null;
            this.m_callback = null;
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        WorldQueItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_bSelected = false;
            this.m_bOpen = false;
            this.m_imgHead.mask = this.m_imgHeadMask;
            this.addEvent();
        };
        Object.defineProperty(WorldQueItem.prototype, "selected", {
            get: function () {
                return this.m_bSelected;
            },
            /**设置选中状态 */
            set: function (val) {
                if (this.m_bSelected == val)
                    return;
                this.m_bSelected = val;
                this.m_imgSel.visible = val;
                this.refreshSelected();
            },
            enumerable: true,
            configurable: true
        });
        /**设置队伍下标 */
        WorldQueItem.prototype.setInfo = function (teamType, order) {
            this.m_nTeamType = teamType;
            this.m_nOrder = order;
        };
        /**设置选中回调函数 */
        WorldQueItem.prototype.setSelectFunc = function (func, obj) {
            this.m_callback = func;
            this.m_callObj = obj;
        };
        Object.defineProperty(WorldQueItem.prototype, "open", {
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
                    this.refreshState();
                }
                else {
                    this.m_pHeadRoot.visible = false;
                    this.m_pStateRoot.visible = false;
                    this.m_imgLock.visible = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**刷新选中显示 */
        WorldQueItem.prototype.refreshSelected = function () {
            var _this = this;
            //跨服战 不显示
            if (this.m_nTeamType == 5 /* CROSS_SERVER */)
                return;
            egret.Tween.removeTweens(this.m_pOperaRoot);
            var tw = egret.Tween.get(this.m_pOperaRoot);
            if (this.m_bSelected) {
                this.m_pOperaRoot.visible = true;
                this.m_pOperaRoot.alpha = 0.3;
                this.m_pOperaRoot.scaleX = 0;
                this.m_pOperaRoot.scaleY = 0;
                tw.to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, Ease.quadOut);
            }
            else {
                tw.to({ scaleX: 0, scaleY: 0, alpha: 0.3 }, 150, Ease.quadOut);
                tw.call(function () {
                    _this.m_pOperaRoot.visible = false;
                }, this);
            }
        };
        /**刷新头像显示 */
        WorldQueItem.prototype.refreshHead = function () {
            if (!this.m_tTeamVo)
                return;
            if (this.m_tTeamVo.isEmptyTeam()) {
                this.m_pHeadRoot.visible = false;
                return;
            }
            this.m_pHeadRoot.visible = true;
            var info = this.m_tTeamVo.getTeamUiInfo();
            var config = C.GeneralConfig[info.headId];
            this.m_imgHead.source = GeneralModel.getSoldierLogo(config.role);
        };
        /**刷新状态显示 */
        WorldQueItem.prototype.refreshState = function () {
            if (!this.m_tTeamVo)
                return;
            if (this.m_tTeamVo.isEmptyTeam()) {
                this.m_labState.textFlow = Global.getTextFlow("<font color = 0xe9e9e6>" + GCode(CLEnum.CAMP_NONE) + "</font>");
                ;
                return;
            }
            var isMove = false;
            switch (this.m_tTeamVo.state) {
                case 0 /* IDLE */: {
                    this.m_labState.textFlow = Global.getTextFlow("<font color = 0x00ff00>" + GCode(CLEnum.WOR_TEAM_KX) + "</font>");
                    break;
                }
                case 4 /* MOVE */: {
                    this.m_labState.textFlow = Global.getTextFlow("<font color = 0xe9e9e6>" + GCode(CLEnum.WOR_TEAM_YD) + "</font>");
                    break;
                }
                case 1 /* QUEQUIE */: {
                    this.m_labState.textFlow = Global.getTextFlow("<font color = 0xe9e9e6>" + GCode(CLEnum.WOR_TEAM_GZPD) + "</font>");
                    break;
                }
                case 2 /* WORLD_BATTLE */:
                case 5 /* WAR */: {
                    this.m_labState.textFlow = Global.getTextFlow("<font color = 0xff0000>" + GCode(CLEnum.WOR_TEAM_GZZD) + "</font>");
                    break;
                }
            }
            this.updateState();
        };
        //=============================================================================================================================================
        //事件监听 begin
        //============================================================================================================================================= 
        WorldQueItem.prototype.addEvent = function () {
            var _this = this;
            com_main.EventManager.addTouchTapListener(this.m_imgTouch, this, this.onItemClick);
            com_main.EventManager.addTouchScaleListener(this.m_pEmBtn, this, function () {
                Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: _this.m_nOrder });
            });
            com_main.EventManager.addTouchScaleListener(this.m_pAccBtn, this, function () {
                var m_teamKey = WorldModel.getOwnerTeamMoveKey(_this.m_nOrder);
                Utils.open_view(TASK_UI.POP_WORLD_ACCELERATE_PANEL, { teamKey: m_teamKey });
            });
            com_main.EventManager.addTouchScaleListener(this.m_pPosBtn, this, function () {
                if (_this.m_tTeamVo.isEmptyTeam()) {
                    EffectUtils.showTips(GCode(CLEnum.WOR_TEAM_EMPTY), 1, true);
                    return;
                }
                if (_this.m_tTeamVo.state == 4 /* MOVE */) {
                    com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.HERO, WorldModel.getOwnerTeamMoveKey(_this.m_nOrder));
                }
                else {
                    com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, _this.m_tTeamVo.cityId);
                }
            });
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_UPDATE_LIST, this.onTeamUpdateGirdInfo, this);
            com_main.EventMgr.addEvent(TaskWorldEvent.WORLD_CITY_MOVE_LIST_UPDATE, this.onTeamMoveList, this);
        };
        WorldQueItem.prototype.updateState = function () {
            if (isNull(this.m_tTeamVo))
                return;
            var config = C.WorldMapConfig[this.m_tTeamVo.cityId];
            if (config) {
                this.m_imgXYState.visible = config.mapId == SceneEnums.WORLD_XIANGYANG_CITY;
            }
            var moveData = WorldModel.getOwnerTeamMoveData(this.m_tTeamVo.order);
            if (this.m_tTeamVo.state == 4 /* MOVE */ && moveData) {
                this.currentState = "move";
            }
            else {
                this.currentState = 'base';
            }
            this.commitProperties();
        };
        WorldQueItem.prototype.onTeamMoveList = function (teamKey) {
            if (WorldModel.getOwnerTeamMoveKey(this.m_nOrder) == teamKey) {
                this.updateState();
            }
        };
        WorldQueItem.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_UPDATE_LIST, this);
            com_main.EventMgr.removeEventByObject(TaskWorldEvent.WORLD_CITY_MOVE_LIST_UPDATE, this);
            com_main.EventMgr.removeEventByObject(SceneEvent.CHANGE_COMPLETE, this);
        };
        WorldQueItem.prototype.onItemClick = function () {
            if (!this.m_bOpen) {
                if (this.m_nTeamType == 5 /* CROSS_SERVER */) {
                    EffectUtils.showTips(GCode(CLEnum.CROSS_TEAM_LOCK), 1, true);
                }
                if (this.m_nTeamType == 1 /* WORLD */) {
                    EffectUtils.showTips(TeamModel.getTeamOpenTips(), 1, true);
                }
                return;
            }
            if (this.m_tTeamVo.isEmptyTeam()) {
                if (this.m_nTeamType == 5 /* CROSS_SERVER */) {
                    Utils.open_view(TASK_UI.CROSS_SERVER_TEAM_PANEL, { id: this.m_nOrder });
                }
                else {
                    Utils.open_view(TASK_UI.POP_WORLD_RANK_VIEW, { id: this.m_nOrder });
                }
                ;
                return;
            }
            if (this.m_callObj && this.m_callback) {
                this.m_callback.call(this.m_callObj, this.m_nOrder);
            }
        };
        /* 上阵信息刷新
         * @param changeIds 客户端拟刷新
         *  */
        WorldQueItem.prototype.onTeamUpdateGirdInfo = function (vo) {
            if (!this.m_bOpen)
                return;
            if (vo.teamType != this.m_nTeamType && this.m_nOrder != vo.order)
                return;
            this.refreshHead();
            this.refreshState();
        };
        WorldQueItem.NAME = "WorldQueItem";
        return WorldQueItem;
    }(com_main.CComponent));
    com_main.WorldQueItem = WorldQueItem;
})(com_main || (com_main = {}));
