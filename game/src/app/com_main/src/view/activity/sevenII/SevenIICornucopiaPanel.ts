
// 新7天活动聚宝盆
module com_main {
    export class SevenIICornucopiaPanel extends DynamicComponent {

        public m_lb_hight: eui.Label;
        public m_awardNum: eui.BitmapLabel;
        public lb_down: eui.BitmapLabel;
        public lb_up: eui.BitmapLabel;
        public m_awardBtn: com_main.ComButton;
        public m_lbButtonDis: eui.Label;
        public m_imgTips: eui.Image;


        private m_effect: MCDragonBones;	//按钮特效
        private m_vo: AcCornucopiaVo;           //活动数据

        private isRunEffect: boolean;   // 是否在播放特效
        private m_rewardMsg: gameProto.IValuesMessage[];
        private m_actType: AcViewType//活动类型
        public constructor(actType: AcViewType) {
            super();
            this.m_actType = actType;
            this.dynamicSkinName = Utils.getAppSkin("activity/sevenII/SevenIICornucopiaSkin.exml");
        }

        protected onShow() {
            this.m_imgTips.source = this.m_actType == AcViewType.TREASEURE_BOWL ? 'lb_7t_zcjbcygj_png' : 'lb_7t_cyggynyd_png';
            this.m_vo = ActivityModel.getActivityVo<AcCornucopiaVo>(this.m_actType);
            this.initEvent();
            this.setEff();
            this.refreshView();
        }

        // protected childrenCreated(): void {
        //     super.childrenCreated();
        // 	this.m_vo = ActivityModel.getActivityVo<AcCornucopiaVo>(AcViewType.TREASEURE_BOWL);

        // 	this.initEvent();
        // 	this.setEff();
        //     this.refreshView();
        // }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
            this.clearBtnEff();
        }

        public refreshView() {
            let info = this.m_vo.getInfo();
            // let str = '聚宝重置<font color=#e7c772>%d</font>次后重置进度，当前聚宝第<font color=#e7c772>%d</font>次';
            let str = '每充值<font color=#e7c772>%d</font>元宝可聚宝一次，聚宝<font color=#e7c772>%d</font>次后重置进度，您还可聚宝<font color=#e7c772>%d</font>次'
            this.m_lbButtonDis.textFlow = Utils.htmlParser(GLanFormat(str, this.m_vo.getConfigs().perPay, 10 - info.curCount + 1, info.totalCount));
            let [min1, hight] = this.m_vo.getMinMax(10);
            this.m_lb_hight.textFlow = Utils.htmlParser(GLanFormat('最高获得<font color=#e7c772>%d</font>元宝', hight));
            let [min, max] = this.m_vo.getMinMax(info.curCount);
            this.lb_down.text = min.toString();
            this.lb_up.text = max.toString();

            if (info.totalCost == 0) {
                this.m_awardBtn.setTitleLabel('免费聚宝');
            } else if (info.totalCount > 0) {
                this.m_awardBtn.setTitleLabel('聚宝');
            } else {
                this.m_awardBtn.setTitleLabel('充值');
            }
        }

        //抽奖返回
        public rewardReturn(arg: gameProto.IValuesMessage[]) {
            this.m_rewardMsg = arg;
            this.m_curNum = 0;
            this.refreshView();
            let num = 0;
            for (let i of arg) {
                if (i.itemId == 1) {
                    num = i.count;
                }
            }
            this.endAwardNum = num;
            Utils.TimerManager.doTimer(0, 10000, this.changeNum, this);
            this.isRunEffect = true;
        }

        /**按钮特效 */
        private setEff() {
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
            this.m_effect.play(IETypes.EUI_BtnEffect02);
            this.m_effect.x = 135;
            this.m_effect.y = 47.5;
            this.m_awardBtn.addChild(this.m_effect);
        }

        private clearBtnEff() {
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
        }

        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

        private initEvent() {
            EventManager.addTouchScaleListener(this.m_awardBtn, this, this.onClickAward);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_7DAY_COR, this.refreshView, this);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_7DAY_COR_REWARD, this.rewardReturn, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_7DAY_COR, this);
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_7DAY_COR_REWARD, this);

            EventManager.removeEventListeners(this);
            Utils.TimerManager.remove(this.changeNum, this);
            Utils.TimerManager.remove(this.showReward, this);

        }
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */
        private endAwardNum = 88888;
        public m_curNum: number;
        //领奖
        private onClickAward(e: egret.TouchEvent) {
            //转动中不能点
            if (this.isRunEffect) {
                return;
            }

            let info = this.m_vo.getInfo();
            if (info.totalCost == 0 || info.totalCount > 0) {
                ActivityProxy.send_C2S_ACTIVITY_TREASEURE_BOWL_REWARD(this.m_vo.id);
            } else {
                Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
            }
        }

        private getStep(start: number, end: number) {
            let dis = end - start;
            if (dis > 10000) {
                return 1111;
            } else if (dis > 1000) {
                return 111;
            } else if (dis > 100) {
                return 11;
            } else if (dis > 15) {
                return 3;
            } else {
                return 1;
            }
        }

        private changeNum() {
            this.m_curNum = this.m_curNum + this.getStep(this.m_curNum, this.endAwardNum);
            if (this.m_curNum > this.endAwardNum) {
                this.m_curNum = this.endAwardNum;
                Utils.TimerManager.remove(this.changeNum, this);
                Utils.TimerManager.doTimer(350, 1, this.showReward, this);
            }
            this.m_awardNum.text = StringUtils.pad(this.m_curNum, 5);
        }

        private showReward() {
            this.isRunEffect = false;
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, this.m_rewardMsg);
        }

    }
}