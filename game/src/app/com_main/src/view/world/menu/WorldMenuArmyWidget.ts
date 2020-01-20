module com_main {

    /**行军菜单 */
    export class WorldMenuArmyWidget extends CComponent {

        public m_pMenu: eui.Group;
        public m_pBtnAcc: eui.Group;
        public m_pBtnInfo: eui.Group;
        public m_pBtnBack: eui.Group;
        public m_pLbName: eui.Label;
        public m_pLbTime: eui.Label;


        /**剩余时间 */
        private m_nDt: number = 0;
        /**队伍Id */
        private m_teamKey: string;

        public constructor(iid: string) {
            super();
            this.m_teamKey = iid;
            this.name = "WorldMenuArmy";
            this.skinName = Utils.getSkinName("app/world/world_menu_army_widget.exml");
            let data = WorldModel.getTeamMoveData(this.m_teamKey);
            let vo = TeamModel.getTeamVoByTypeId(TeamType.WORLD, data.teamId);

            if (vo) {
                if (data.playerId != RoleData.playerId) {
                    this.currentState = "other";
                } else {
                    switch (vo.state) {
                        case TeamState.MOVE: {
                            if (data.moveType == EumWorldEventMoveType.BACK) {
                                this.currentState = 'acc'
                            } else {
                                this.currentState = 'base'
                            }
                            break;
                        }
                        // case TeamState.COLLECT: {
                        //     this.currentState = 'acc'
                        //     break;
                        // }
                        default:
                            this.currentState = 'none'
                            break;
                    }
                }
            }


        }

        public $onRemoveFromStage(): void {
            EventManager.removeEventListeners(this);
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            // EventManager.addTouchScaleListener(this.m_pBtnAcc, this, this.__on_acc_click);
            // EventManager.addTouchScaleListener(this.m_pBtnBack, this, this.__on_back_click);


            const data = WorldModel.getTeamMoveData(this.m_teamKey);
            if (!data) return;
            this.m_nDt = data.endTime - TimerUtils.getServerTime();
            this.m_pLbName.text = data.playerId != RoleData.playerId ? data.playerName: "" + GLan(data.teamName);
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
            Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, () => {
                Utils.removeFromParent(this);
            });


        }

        private __on_acc_click() {
            Utils.open_view(TASK_UI.POP_WORLD_ACCELERATE_PANEL, { teamKey: this.m_teamKey });
            this.removeFromParent();
        }

        private __on_back_click() {
            const data = WorldModel.getTeamMoveData(this.m_teamKey)
            if (data) {
                if (PropModel.isItemEnough(PropEnum.WORLE_MOVE_BACK, 1, 1)) {
                    WorldProxy.C2S_TEAMMOVE_RETURN(data.teamId);
                }
            }
            this.removeFromParent();
        }
        private _on_other_click() {
            const data = WorldModel.getTeamMoveData(this.m_teamKey)
            if (data && data.playerId != RoleData.playerId) {
                //查看其他玩家信息
                TeamProxy.C2S_TEAM_LIST(TeamType.WORLD, data.playerId)
                TeamModel.otherTeamid = data.teamId;
            }
            this.removeFromParent();
        }

        public hitPoint(x: number, y: number) {
            if (this.m_pBtnAcc && this.m_pBtnAcc.hitTestPoint(x, y)) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.__on_acc_click();
                return true;
            }

            if (this.m_pBtnBack && this.m_pBtnBack.hitTestPoint(x, y)) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.__on_back_click();
                return true;
            }

            if (this.m_pBtnInfo && this.m_pBtnInfo.hitTestPoint(x, y)) {
                /**新手引导点击 */
                EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this._on_other_click();
                return true;
            }
            if (this.m_pMenu && this.m_pMenu.hitTestPoint(x, y)) return true;
            // return (this.m_pBtnAcc && this.m_pBtnAcc.hitTestPoint(x, y)) || (this.m_pMenu && this.m_pMenu.hitTestPoint(x, y))
            //     || (this.m_pBtnBack && this.m_pBtnBack.hitTestPoint(x, y))
            return false;
        }

        private update() {
            this.m_nDt--;
            if (this.m_nDt < 0 || !this.m_pLbTime) return;
            this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond(this.m_nDt, 1);
        }

        public removeFromParent() {
            Utils.TimerManager.remove(this.update, this);
            WorldView.callFunc(WORLD_FUNC.SET_ARMY_TIME_STATUS, this.m_teamKey, true);
            super.removeFromParent();
        }

    }


}