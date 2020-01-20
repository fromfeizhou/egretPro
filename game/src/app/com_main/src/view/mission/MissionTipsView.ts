// TypeScript file


module com_main {
	/**
	 * 累计充值相关
	 */
    export class MissionTipsView extends CComponent {
        public static NAME = 'MissionTipsView';
        //任务提示根节点
        private m_pViewRoot: eui.Group;
        //任务提示文本
        private m_pLbMissionInfo: CLabel;
        private m_pCanReceiveAni: egret.tween.TweenGroup;
        private m_pShowNewInfoAni: egret.tween.TweenGroup;
        private m_ClickItem: eui.Group;
        private state_2: eui.Group;
        private state_1: eui.Group;
        private m_pEffectRoot: eui.Group;
        private m_pMC: MCDragonBones;
        private m_pBg: CImage;

        public constructor(data?) {
            super();
            this.name = MissionTipsView.NAME;
            this.skinName = Utils.getAppSkin('mission/MissionTipsViewSkin.exml')
        }
        // protected listenerProtoNotifications(): any[] {
        //     return [
        //         ProtoDef.S2C_TASK_REWARD,
        //         ProtoDef.S2C_TASK_RECEIVE,
        //     ];
        // }
        // /**处理协议号事件 */
        // protected executes(notification: AGame.INotification) {
        //     let body = notification.getBody();
        //     let protocol: number = Number(notification.getName());
        //     switch (protocol) {
        //         case ProtoDef.S2C_TASK_REWARD: {
        //             if (body.state == 0) {
        //                 this.onReceiveHandler();
        //                 this.updateMissionInfoTips();
        //             }
        //             break;
        //         }
        //         case ProtoDef.S2C_TASK_RECEIVE: {
        //             this.updateMissionInfoTips();
        //             break;
        //         }
        //     }
        // }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            if (this.m_pMC) {
                this.m_pMC.destroy();
                this.m_pMC = null;
            }
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this, this, this.onClickItem);
            this.initView();
            this.addEvent();
        }


        private initView() {
            this.updateMissionInfoTips();
            this.createEffect();
        }

        //点击btn
        private onClickItem(e: egret.Event) {
            let data = MissionModel.getMainMissionData();
            MissionModel.onClickMissionCell(data.taskId, data.conditionId);
        }

        private updateMissionInfoTips(): boolean {
            this.visible = true;
            let data = MissionModel.getMainMissionData();
            if (data) {
                let cData = MissionModel.getConditoinInfoById(data.taskId, data.conditionId);
                if (cData) {
                    let cfg = C.TaskConditionConfig[cData.conditionBaseId];
                    this.state_1.visible = true;
                    if (cfg) {
                        if (cData.state == TaskStatus.FINISH) {
                            this.m_pLbMissionInfo.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TASK_TIPS, cfg.title));
                            this.state_2.alpha = 1;
                        } else {
                            this.m_pLbMissionInfo.text = cfg.title + "  " + cData.count + "/" + cData.maxCount;
                            this.state_2.alpha = 0;
                        }
                    }
                    this.m_pViewRoot.visible = true;
                    return cData.state == TaskStatus.FINISH;
                }
            }
            this.visible = false;
            return false;
        }

        private createEffect() {
            let mc = new MCDragonBones();
            mc.initAsync(IETypes.EUI_MissionTips);
            mc.play(IETypes.EUI_MissionTips, 0);
            this.m_pEffectRoot.addChild(mc);
            mc.x = 152;
            mc.y = this.m_pEffectRoot.height * 0.5;
            this.m_pMC = mc;
        }

        private onEffectFinish(event: egret.Event) {
            const item = event.data as egret.tween.TweenItem;
            if (this.m_pBg == item.target) {
                this.m_pMC.visible = true;
            }
        }



        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */

        protected addEvent() {
            EventMgr.addEvent(MissionEvent.MISSION_UPDATE_INFO, this.onUpdateMissionInfo, this);
            EventMgr.addEvent(MissionEvent.MISSION_ADD_INFO, this.onAddMissionInfo, this);
            EventMgr.addEvent(MissionEvent.MISSION_DELETE_INFO, this.onDeleteMissionInfo, this);
            this.m_pCanReceiveAni.addEventListener("itemComplete", this.onEffectFinish, this);
            if (RoleData.level < 30) {
                Utils.TimerManager.doTimer(5000, 0, this.onTimeLater, this);
            }
        }

        protected removeEvent() {
            EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_INFO, this);
            EventMgr.removeEventByObject(MissionEvent.MISSION_ADD_INFO, this);
            EventMgr.removeEventByObject(MissionEvent.MISSION_DELETE_INFO, this);
            this.m_pCanReceiveAni.removeEventListener("itemComplete", this.onEffectFinish, this);
            Utils.TimerManager.remove(this.onTimeLater, this);
        }



        /**定时检查 */
        private onTimeLater() {
            if (SceneManager.isWorldScene()) return;
            if (SceneManager.isXiangYangScene()) return;
            if (SceneManager.hasChildGuideView() || UpManager.CurrentPanel) return;
            if (SceneManager.getClass(LayerEnums.TOP, GuideTouchTips.NAME)) return;
            Utils.open_view(TASK_UI.GUIDE_TOUCH_TIPS, { target: this });
        }


        private onAddMissionInfo(data: IMissionEvt) {
            if (TaskType.MainLine != data.type) return;
            this.updateMissionInfoTips()
        }

        private onDeleteMissionInfo(data: IMissionEvt) {
           if (TaskType.MainLine != data.type) return;
            this.m_pShowNewInfoAni.play(0);
            this.m_pMC.visible = true;
            this.updateMissionInfoTips();
        }

        protected onUpdateMissionInfo(data: IMissionEvt) {
            if (TaskType.MainLine != data.type) return;
            if (this.updateMissionInfoTips()) {
                this.m_pMC.visible = false;
                this.m_pCanReceiveAni.play(0);
            }
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */
    }
}

