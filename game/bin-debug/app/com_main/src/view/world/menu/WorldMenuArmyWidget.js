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
    /**行军菜单 */
    var WorldMenuArmyWidget = /** @class */ (function (_super_1) {
        __extends(WorldMenuArmyWidget, _super_1);
        function WorldMenuArmyWidget(iid) {
            var _this = _super_1.call(this) || this;
            /**剩余时间 */
            _this.m_nDt = 0;
            _this.m_teamKey = iid;
            _this.name = "WorldMenuArmy";
            _this.skinName = Utils.getSkinName("app/world/world_menu_army_widget.exml");
            var data = WorldModel.getTeamMoveData(_this.m_teamKey);
            var vo = TeamModel.getTeamVoByTypeId(1 /* WORLD */, data.teamId);
            if (vo) {
                if (data.playerId != RoleData.playerId) {
                    _this.currentState = "other";
                }
                else {
                    switch (vo.state) {
                        case 4 /* MOVE */: {
                            if (data.moveType == 2 /* BACK */) {
                                _this.currentState = 'acc';
                            }
                            else {
                                _this.currentState = 'base';
                            }
                            break;
                        }
                        // case TeamState.COLLECT: {
                        //     this.currentState = 'acc'
                        //     break;
                        // }
                        default:
                            _this.currentState = 'none';
                            break;
                    }
                }
            }
            return _this;
        }
        WorldMenuArmyWidget.prototype.$onRemoveFromStage = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        WorldMenuArmyWidget.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            // EventManager.addTouchScaleListener(this.m_pBtnAcc, this, this.__on_acc_click);
            // EventManager.addTouchScaleListener(this.m_pBtnBack, this, this.__on_back_click);
            var data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (!data)
                return;
            this.m_nDt = data.endTime - TimerUtils.getServerTime();
            this.m_pLbName.text = data.playerId != RoleData.playerId ? data.playerName : "" + GLan(data.teamName);
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, function () {
                Utils.removeFromParent(_this);
            });
        };
        WorldMenuArmyWidget.prototype.__on_acc_click = function () {
            Utils.open_view(TASK_UI.POP_WORLD_ACCELERATE_PANEL, { teamKey: this.m_teamKey });
            this.removeFromParent();
        };
        WorldMenuArmyWidget.prototype.__on_back_click = function () {
            var data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (data) {
                if (PropModel.isItemEnough(PropEnum.WORLE_MOVE_BACK, 1, 1)) {
                    WorldProxy.C2S_TEAMMOVE_RETURN(data.teamId);
                }
            }
            this.removeFromParent();
        };
        WorldMenuArmyWidget.prototype._on_other_click = function () {
            var data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (data && data.playerId != RoleData.playerId) {
                //查看其他玩家信息
                TeamProxy.C2S_TEAM_LIST(1 /* WORLD */, data.playerId);
                TeamModel.otherTeamid = data.teamId;
            }
            this.removeFromParent();
        };
        WorldMenuArmyWidget.prototype.hitPoint = function (x, y) {
            if (this.m_pBtnAcc && this.m_pBtnAcc.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.__on_acc_click();
                return true;
            }
            if (this.m_pBtnBack && this.m_pBtnBack.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.__on_back_click();
                return true;
            }
            if (this.m_pBtnInfo && this.m_pBtnInfo.hitTestPoint(x, y)) {
                /**新手引导点击 */
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this._on_other_click();
                return true;
            }
            if (this.m_pMenu && this.m_pMenu.hitTestPoint(x, y))
                return true;
            // return (this.m_pBtnAcc && this.m_pBtnAcc.hitTestPoint(x, y)) || (this.m_pMenu && this.m_pMenu.hitTestPoint(x, y))
            //     || (this.m_pBtnBack && this.m_pBtnBack.hitTestPoint(x, y))
            return false;
        };
        WorldMenuArmyWidget.prototype.update = function () {
            this.m_nDt--;
            if (this.m_nDt < 0 || !this.m_pLbTime)
                return;
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
        };
        WorldMenuArmyWidget.prototype.removeFromParent = function () {
            Utils.TimerManager.remove(this.update, this);
            com_main.WorldView.callFunc(13 /* SET_ARMY_TIME_STATUS */, this.m_teamKey, true);
            _super_1.prototype.removeFromParent.call(this);
        };
        return WorldMenuArmyWidget;
    }(com_main.CComponent));
    com_main.WorldMenuArmyWidget = WorldMenuArmyWidget;
})(com_main || (com_main = {}));
