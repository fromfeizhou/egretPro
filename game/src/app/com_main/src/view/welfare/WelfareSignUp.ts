module com_main {
    /**签到 */
    export class WelfareSignUp extends CView implements IRepeatActivityWnd {
        /**面板类型 */
        public activityType: AcViewType;
        public m_signGroup: eui.Group;
        public m_imgIcon: eui.Image;
        private m_pGSroller: eui.Group;
        private m_pCellList: Array<WelfareCell>;    //每日奖励cell
        private m_imgProgress: eui.Image;    //签到进度条
        private m_nProcessLen = 740;     //签到进度总长度
        private m_signNum: eui.Label;    //签到进度文本
        private m_nDayNums: number;      //本月总天数
        public bInit: boolean;

        private activiSignUpVo: AcSignUpVo;
        public constructor(activiType: number) {
            super();
            this.activityType = activiType;
            this.initApp("welfare/WelfareSignUpSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.GET_SIGN_UP,
                ProtoDef.SIGN_UP,
                ProtoDef.SUPPLEMENT_SIGN_UP,
                ProtoDef.RECEIVE_SIGN_UP_EXTRA_REWARD,
                ProtoDef.PATCH_COLLAR_REWARD,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.GET_SIGN_UP: {
                    // data = body;
                    this.refreshView();
                    break;
                }
                case ProtoDef.SIGN_UP: { //签到
                    WelfareProxy.send_GET_SIGN_UP();
                    break;
                }
                case ProtoDef.SUPPLEMENT_SIGN_UP: {// buqian
                    if (body) {
                        WelfareProxy.send_GET_SIGN_UP();
                    }
                    break;
                }
                case ProtoDef.RECEIVE_SIGN_UP_EXTRA_REWARD: {// 
                    if (body) {
                        WelfareProxy.send_GET_SIGN_UP();
                    }

                    break;
                }
                case ProtoDef.PATCH_COLLAR_REWARD: {
                    if (body) {
                        WelfareProxy.send_GET_SIGN_UP();
                    }
                    break;
                }
            }
        }

        $onRemoveFromStage(): void {
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        public onDestroy(): void {
            this.m_pCellList = null;
            super.onDestroy();

            SceneResGroupCfg.clearModelRes([ModuleEnums.ACTIVITY_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }
        /**初始化界面 */
        public initView() {
            if (this.bInit) return;
            this.bInit = true;
            this.activiSignUpVo = ActivityModel.getActivityVo<AcSignUpVo>(this.activityType);
            this.m_imgIcon.source = Utils.GetResName('hd_' + this.activiSignUpVo.viewType + '_jpg');

            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            this.m_nDayNums = Number(new Date(year, month, 0).getDate());
            let signUpCfgs = C.SignUpConfigDic[month];
            this.m_pCellList = [];
            let extraReward: Array<SignUpConfig> = [];   //额外奖励
            if (signUpCfgs != null && signUpCfgs != undefined) {
                for (let i = 0; i <= this.m_nDayNums; i++) {
                    let signUpCfg = signUpCfgs[i] as SignUpConfig;
                    if (signUpCfg != null && signUpCfgs != undefined) {
                        let cell = new WelfareCell(signUpCfg);
                        this.m_pGSroller.addChild(cell);
                        this.m_pCellList.push(cell);

                        if (signUpCfg.extraReward != '') {
                            extraReward.push(signUpCfg);
                        }
                    }
                }
            }

            for (let i = 0; i < extraReward.length; i++) {
                let tx = 40 + extraReward[i].day / this.m_nDayNums * this.m_nProcessLen;
                this[`m_signday${i}`].x = 245 + tx;
                this[`m_point${i}`].x = tx - 20;
                this[`m_itemcell${i}`].x = 245 + tx;

                this[`m_signday${i}`].text = i == extraReward.length - 1 ? GCode(CLEnum.AC_SIGN_FULL) : GCodeFromat(CLEnum.AC_SIGN_DAY, extraReward[i].day);
                this[`m_itemcell${i}`].init(extraReward[i]);
            }

            this.refreshView();
        }
        /**设置宽高 */
        public setViewSize(width: number, height: number) {
            this.width = width;
            this.height = height;
            this.validateNow();
            Utils.toStageBestScaleHeigt(this.m_pGSroller);
            Utils.toStageBestScaleHeigt(this.m_signGroup);
        }

        /**刷新显示 */
        public refreshView() {
            if(!this.activiSignUpVo)return;
            let data = this.activiSignUpVo.getSignUpData();
            if (data) {
                for (let i = 0; i < data.times; i++) {
                    this.m_pCellList[i].updateState(0);
                }
                if (this.m_pCellList[data.times]){
                    this.m_pCellList[data.times].updateBuQian(data.supplementTimes);
                }
                //刷新签到当前次数显示
                let canSign = data.lastTime == 0 || TimerUtils.isOverDay(data.lastTime * 1000);
                if (canSign) {
                    //今天没有签到
                    this.m_pCellList[data.times].updateState(2);
                } else if (data.supplement) {
                    //今天已签到 当前格子可以补签
                    this.m_pCellList[data.times].updateState(1);
                } else if (data.rewardStatus == 1) {
                    //今天已签到已补签 当前格子可以补领
                    this.m_pCellList[data.times - 1].updateState(3);
                }

                //进度条显示
                this.m_imgProgress.width = this.m_nProcessLen * data.times / this.m_nDayNums;
                this.m_signNum.text = data.times + '/' + this.m_nDayNums;

                //奖励显示
                for (let i = 0; i < 6; i++) {
                    let item: WelfareItemCell = this[`m_itemcell${i}`];
                    let imgPoint: eui.Image = this["m_point" + i];
                    let canGetAward: boolean = false;
                    if (data.notReceiveExtras.indexOf(item.signCfg.id) >= 0) {
                        item.updateState(1);
                        canGetAward = true;
                    }
                    if (data.receiveExtras.indexOf(item.signCfg.id) >= 0) {
                        item.updateState(0);
                        canGetAward = true;
                    }
                    if (canGetAward) {
                        imgPoint.source = "welfare_point1_png";
                    } else {
                        imgPoint.source = "welfare_point_png";
                    }
                }
            }
        }

    }
}