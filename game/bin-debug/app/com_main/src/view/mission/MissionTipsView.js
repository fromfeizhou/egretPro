// TypeScript file
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
     * 累计充值相关
     */
    var MissionTipsView = /** @class */ (function (_super_1) {
        __extends(MissionTipsView, _super_1);
        function MissionTipsView(data) {
            var _this = _super_1.call(this) || this;
            _this.name = MissionTipsView.NAME;
            _this.skinName = Utils.getAppSkin('mission/MissionTipsViewSkin.exml');
            return _this;
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
        MissionTipsView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        MissionTipsView.prototype.onDestroy = function () {
            if (this.m_pMC) {
                this.m_pMC.destroy();
                this.m_pMC = null;
            }
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        MissionTipsView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this, this, this.onClickItem);
            this.initView();
            this.addEvent();
        };
        MissionTipsView.prototype.initView = function () {
            this.updateMissionInfoTips();
            this.createEffect();
        };
        //点击btn
        MissionTipsView.prototype.onClickItem = function (e) {
            var data = MissionModel.getMainMissionData();
            MissionModel.onClickMissionCell(data.taskId, data.conditionId);
        };
        MissionTipsView.prototype.updateMissionInfoTips = function () {
            this.visible = true;
            var data = MissionModel.getMainMissionData();
            if (data) {
                var cData = MissionModel.getConditoinInfoById(data.taskId, data.conditionId);
                if (cData) {
                    var cfg = C.TaskConditionConfig[cData.conditionBaseId];
                    this.state_1.visible = true;
                    if (cfg) {
                        if (cData.state == TaskStatus.FINISH) {
                            this.m_pLbMissionInfo.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.TASK_TIPS, cfg.title));
                            this.state_2.alpha = 1;
                        }
                        else {
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
        };
        MissionTipsView.prototype.createEffect = function () {
            var mc = new MCDragonBones();
            mc.initAsync(IETypes.EUI_MissionTips);
            mc.play(IETypes.EUI_MissionTips, 0);
            this.m_pEffectRoot.addChild(mc);
            mc.x = 152;
            mc.y = this.m_pEffectRoot.height * 0.5;
            this.m_pMC = mc;
        };
        MissionTipsView.prototype.onEffectFinish = function (event) {
            var item = event.data;
            if (this.m_pBg == item.target) {
                this.m_pMC.visible = true;
            }
        };
        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */
        MissionTipsView.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(MissionEvent.MISSION_UPDATE_INFO, this.onUpdateMissionInfo, this);
            com_main.EventMgr.addEvent(MissionEvent.MISSION_ADD_INFO, this.onAddMissionInfo, this);
            com_main.EventMgr.addEvent(MissionEvent.MISSION_DELETE_INFO, this.onDeleteMissionInfo, this);
            this.m_pCanReceiveAni.addEventListener("itemComplete", this.onEffectFinish, this);
            if (RoleData.level < 30) {
                Utils.TimerManager.doTimer(5000, 0, this.onTimeLater, this);
            }
        };
        MissionTipsView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_UPDATE_INFO, this);
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_ADD_INFO, this);
            com_main.EventMgr.removeEventByObject(MissionEvent.MISSION_DELETE_INFO, this);
            this.m_pCanReceiveAni.removeEventListener("itemComplete", this.onEffectFinish, this);
            Utils.TimerManager.remove(this.onTimeLater, this);
        };
        /**定时检查 */
        MissionTipsView.prototype.onTimeLater = function () {
            if (SceneManager.isWorldScene())
                return;
            if (SceneManager.isXiangYangScene())
                return;
            if (SceneManager.hasChildGuideView() || com_main.UpManager.CurrentPanel)
                return;
            if (SceneManager.getClass(LayerEnums.TOP, com_main.GuideTouchTips.NAME))
                return;
            Utils.open_view(TASK_UI.GUIDE_TOUCH_TIPS, { target: this });
        };
        MissionTipsView.prototype.onAddMissionInfo = function (data) {
            if (TaskType.MainLine != data.type)
                return;
            this.updateMissionInfoTips();
        };
        MissionTipsView.prototype.onDeleteMissionInfo = function (data) {
            if (TaskType.MainLine != data.type)
                return;
            this.m_pShowNewInfoAni.play(0);
            this.m_pMC.visible = true;
            this.updateMissionInfoTips();
        };
        MissionTipsView.prototype.onUpdateMissionInfo = function (data) {
            if (TaskType.MainLine != data.type)
                return;
            if (this.updateMissionInfoTips()) {
                this.m_pMC.visible = false;
                this.m_pCanReceiveAni.play(0);
            }
        };
        MissionTipsView.NAME = 'MissionTipsView';
        return MissionTipsView;
    }(com_main.CComponent));
    com_main.MissionTipsView = MissionTipsView;
})(com_main || (com_main = {}));
