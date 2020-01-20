module com_main {
    export class ComBoxInfoView extends CView {
        public static NAME = "ComBoxInfoView";
        public m_APopUp: APopUp;
        public m_groupAward: eui.Group;
        public m_btnUse: ComButton;

        private m_callback: any; //回调函数
        private m_thisObj: any;  //回调对象
        private m_sAwards: any;   //奖励串


        public constructor(param: any) {
            super();

            this.name = ComBoxInfoView.NAME;
            this.m_sAwards = param.awards;

            this.m_thisObj = param.thisObj;
            this.m_callback = param.callback;

            this.initApp("common/ComBoxInfoViewSkin.exml");
        }

        public onDestroy(): void {

            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();
            this.m_APopUp.setTitleLabel(GCode(CLEnum.BOX_AWARD));
            this.m_btnUse.setTitleLabel(GCode(CLEnum.TAKE_OUT));
            this.m_btnUse.visible = this.m_callback != null ? true : false;

            EventManager.addTouchScaleListener(this.m_btnUse, this, this.onBtnUseHandler);

            this.refresh();
        }

        /**刷新面板 */
        private refresh() {
            if (typeof (this.m_sAwards) == "string") {
                let rewardCfg = Utils.parseCommonItemJson(this.m_sAwards);
                if (rewardCfg) {
                    for (let it in rewardCfg) {
                        if (rewardCfg[it]) {
                            let consumeInfo = rewardCfg[it];
                            let itemId = consumeInfo.itemId;
                            let count = consumeInfo.count;
                            let item: ComItemNew = ComItemNew.create("name_num");
                            item.setItemInfo(itemId, count);
                            this.m_groupAward.addChild(item);
                        }
                    }
                }
            } else {
                if (this.m_sAwards) {
                    for (let i in this.m_sAwards) {
                        if (this.m_sAwards[i]) {
                            let keyValueInfo = this.m_sAwards[i] as IItemInfo;
                            let itemId = keyValueInfo.itemId;
                            let count = keyValueInfo.count;
                            let item: ComItemNew = ComItemNew.create("name_num");
                            item.setItemInfo(itemId, count);
                            this.m_groupAward.addChild(item);
                        }
                    }
                }
            }

            // let container = this.getItemContainer(true);
            // this.m_groupAward.addChild(container);

        }

        // private getItemContainer(isCenter) {
        //     let container = new eui.Group();
        //     container.width = 600;
        //     container.height = 134;
        //     var layout = new eui.HorizontalLayout();
        //     if (isCenter) {
        //         layout.horizontalAlign = "center";
        //     }
        //     container.layout = layout;
        //     return container;
        // }

        /**按钮回调 */
        private onBtnUseHandler() {
            if (this.m_callback && this.m_thisObj) {
                this.m_callback.call(this.m_thisObj);
            }
        }



    }
}