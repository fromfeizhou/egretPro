module com_main {
    export interface ITurnTableWnd {
        activityType: AcViewType;
        bInit: boolean;
        setViewSize(width: number, height: number): void;
        initView(): void;
        refreshView(): void;
    }
	/**
	 * 转盘
	 */
    export class TurnTableWnd extends CView {
        public static NAME = 'TurnTableWnd';

        public m_comTabGroup: com_main.ComTabGroup;
        public m_MainTopNew: com_main.MainTopNew;

        private m_tabViewStack: eui.ViewStack;   //主切卡
        private m_nWidth: number;    //切卡宽度
        private m_nHeight: number;   //切卡高度
        private m_pViews: Array<ITurnTableWnd> = [];
        public m_nCurType: AcViewType;

        public constructor(pageType: AcViewType) {
            super();
            this.name = TurnTableWnd.NAME;
            this.m_nCurType = pageType || AcViewType.PRIZE;
            this.initApp("activity/turntable/TurnTableWndSkin.exml");
        }

        public onDestroy(): void {
            this.m_pViews = null;
            super.onDestroy();
            SceneResGroupCfg.clearModelRes([ModuleEnums.TURNTABLE_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.TURNTABLE]);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.TURNTABLE));
            this.validateNow();

            this.addturnTableView();

            //强制渲染一次 获取宽高
            // this.validateNow();
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;
            for (let i = 0; i < this.m_pViews.length; i++) {
                this.m_pViews[i].setViewSize(width, height);
            }
            let index = 0;
            for (let i = 0; i < this.m_pViews.length; i++) {
                let view = this.m_pViews[i];
                if (view.activityType == this.m_nCurType) {
                    index = i;
                    break;
                }
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.m_comTabGroup.validateNow();
            this.m_comTabGroup.selectedIndex = -1;
            this.changeTag(index);
        }
        /**切换当前卡 */
        private changeTag(index: number) {
            this.m_nCurType = this.m_pViews[index].activityType;
            this.m_tabViewStack.selectedIndex = index;
            this.m_comTabGroup.selectedIndex = index;
            this.m_pViews[index].initView();
        }
        /**添加幸运转盘*/
        private addturnTableView() {
            let type = AcViewType.PRIZE;
            if (!ActivityModel.isOpen(type)) return;
            this.m_comTabGroup.addTabBtnData({ name: GCode(CLEnum.TURNTABLE) });
            let signUp = new TurnTableView(type);
            this.m_tabViewStack.addChild(signUp);
            this.m_pViews.push(signUp);

            // RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.TURNTABLE)),
            // { x: 132, y: -5 }, [RedEvtType.SIGN_MONTH_DAY], 2);
        }
    }
}