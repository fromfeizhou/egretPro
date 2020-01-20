module com_main {


	/**
	 * 装备主界面
	 */
    export class EquipMainWnd extends CView {
        public static NAME = 'EquipMainWnd';

        private m_MainTopNew: MainTopNew;    //标题
        private m_comTabGroup: ComTabGroup;
        private m_tabViewStack: eui.ViewStack;   //主切卡
        private m_tViews: any[] = [];

        private m_curIndex = 0;
        private m_nGeneralId: number;   //指定武将id
        private m_tabData: { [name: string]: { tag: number, id: number } };

        public constructor(param?) {
            super();
            this.name = EquipMainWnd.NAME;
            this.m_curIndex = (param && param.tag) ? param.tag : 0;
            this.m_nGeneralId = (param && param.generalId) ? param.generalId : 0;
            this.initApp("equip/EquipMainWndSkin.exml");
        }

        public onDestroy(): void {
            super.onDestroy();
            this.m_tViews = null;
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_MainTopNew.setTitleName(GCode(CLEnum.EQUIP));

            this.m_tabData = {};
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_ZB)] = { tag: 0, id: 0 };
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_QH)] = { tag: 0, id: 1 }
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_SJ)] = { tag: 0, id: 2 }
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_JL)] = { tag: 0, id: 3 }
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_HC)] = { tag: 1, id: 0 }
            this.m_tabData[GCode(CLEnum.EQUIP_TAB_HS)] = { tag: 2, id: 0 }


            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.refreshTabBtns();
            this.validateNow();
            let width = this.m_tabViewStack.width;
            let height = this.m_tabViewStack.height;

            let strengView = new EquipStrengView(width, height, this.m_nGeneralId);
            this.m_tabViewStack.addChild(strengView);

            let compareView = new EquipComposeView(width, height);
            this.m_tabViewStack.addChild(compareView);

            let deCompareView = new EquipDeComposeView(width, height);
            this.m_tabViewStack.addChild(deCompareView);

            this.m_tViews.push(strengView);
            this.m_tViews.push(compareView);
            this.m_tViews.push(deCompareView);

            this.validateNow();

            this.initView(this.m_curIndex);

            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.EQUIP_TAB_ZB)), { x: 132, y: -5 }, [RedEvtType.GEN_EQUIP], 2);
            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.EQUIP_TAB_QH)), { x: 132, y: -5 }, [RedEvtType.GEN_EQ_LV], 2);
            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.EQUIP_TAB_SJ)), { x: 132, y: -5 }, [RedEvtType.GEN_EQ_GRADE], 2);
            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.EQUIP_TAB_JL)), { x: 132, y: -5 }, [RedEvtType.GEN_EQ_WROUGHT], 2);
            RedPointModel.AddInfoListener(<egret.DisplayObjectContainer>this.m_comTabGroup.getTabBtnByName(GCode(CLEnum.EQUIP_TAB_HC)), { x: 132, y: -5 }, [RedEvtType.EQUIP_COMPOSE], 2);

            this.onGuideCondition();


        }

        private changeTag(selIndex: number) {
            this.m_curIndex = selIndex;
            this.initView(selIndex);
        }

        /**刷新切卡 */
        private refreshTabBtns() {
            this.m_comTabGroup.clearTabBtn();
            let tags = [GCode(CLEnum.EQUIP_TAB_ZB)];
            if (FunctionModel.isFunctionOpen(FunctionType.EQUIPMENT_STENG)) tags.push(GCode(CLEnum.EQUIP_TAB_QH));
            if (FunctionModel.isFunctionOpen(FunctionType.EQUIPMENT_GRADE)) tags.push(GCode(CLEnum.EQUIP_TAB_SJ));
            if (FunctionModel.isFunctionOpen(FunctionType.EQUIPMENT_WROUGH)) tags.push(GCode(CLEnum.EQUIP_TAB_JL));
            tags = tags.concat([GCode(CLEnum.EQUIP_TAB_HC), GCode(CLEnum.EQUIP_TAB_HS)]);
            this.m_comTabGroup.initNorTabBtns(tags);
        }


        private initView(tag) {
            this.m_comTabGroup.selectedIndex = tag;
            let name = this.m_comTabGroup.selName;
            let data = this.m_tabData[name];
            if (data) {
                this.m_tabViewStack.selectedIndex = data.tag;
                if (data.tag == 0) {
                    this.m_tViews[0].changeTag(data.id);
                    this.changeSourceTile(data.id);
                } else {
                    this.changeSourceTile(0);
                }
            }
        }

        /**改变资源标题 */
        private changeSourceTile(id: number) {
            switch (id) {
                case 1:
                    this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.EQUIP_QH, PropEnum.SILVER]);
                    break;
                case 2:
                    this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.EQUIP_SJ, PropEnum.SILVER]);
                    break;
                case 3:
                    this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.EQUIP_JL]);
                    break;
                default:
                    this.m_MainTopNew.setResources([]);
                    break;
            }
        }

        /**检查新手引导面板条件 */
        public onGuideCondition() {
            EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.EQUIP_WND);
        }




    }

}