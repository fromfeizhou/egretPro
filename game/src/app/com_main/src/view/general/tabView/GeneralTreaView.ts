module com_main {
    export class GeneralTreaView extends GeneralBaseView {
        public static NAME: string = 'GeneralTreaView';

        public m_labName: eui.Label;
        public m_groupStar: eui.Group;
        public m_genTreaOwner: com_main.GeneralTreaOwner;
        public m_treaIcon: com_main.TreaIconView;
        public m_listAttri: eui.List;
        public m_btnStreng: com_main.ComButton;
        public m_btnUnEquip: com_main.ComButton;
        public m_btnEquip: eui.Group;
        public m_pCSroller:com_main.CScroller;

        private m_curVo: TreasureVo;	//宝物数据
        private m_tAttriColl: eui.ArrayCollection;   //属性
        private m_nItemId: number;

        public constructor(width: number, height: number) {
            super(width, height);
            this.skinName = Utils.getAppSkin("general/tabView/GeneralTreaViewSkin.exml");
            this.name = GeneralTreaView.NAME;
        }

        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated() {
            super.childrenCreated();

            this.m_btnUnEquip.setTitleLabel(GCode(CLEnum.TREA_UNEQUIP));
            this.m_btnStreng.setTitleLabel(GCode(CLEnum.TREA_STRENG));

            this.m_tAttriColl = new eui.ArrayCollection();
            this.m_listAttri.dataProvider = this.m_tAttriColl;
            this.m_listAttri.itemRenderer = ComAttriRender;
        }

        public refreshView() {
            super.refreshView();
            if (!this.generalVo) return;
            /**初始化宝物数据 */
            if (this.generalVo) {
                this.m_nItemId = this.generalVo.treasureId
                this.m_curVo = TreasureModel.getData(this.m_nItemId);
            } else {
                this.m_nItemId = 0;
                this.m_curVo = null;
            }

            if (this.m_nItemId > 0) {
                this.currentState = "equip";
                this.commitProperties();
                this.refreshIcon();
                this.refresAttri();
                this.refreshStar();
            } else {
                this.currentState = "unequip";
                this.commitProperties();
            }
        }

        //刷新宝物界面
        private refreshIcon() {
            if (!this.m_curVo) return;
            this.m_labName.text = this.m_curVo.treaCfg.name
            Utils.setLabColorByQuality(this.m_labName, this.m_curVo.quality);

            this.m_treaIcon.setItemId(this.m_nItemId,true);
            this.m_treaIcon.createEffect();

            this.m_genTreaOwner.setInfo(this.m_nItemId);
        }

        /**刷新属性 */
        private refresAttri() {
            let res: ComAttriRD[] = [];
            let list = this.m_curVo.getAllAttris();
            for (let i = 0; i < list.length; i++) {
                let data = list[i];
                res.push({ state: 'style20', name: Utils.getAttriNameByType(data.key) + '：', value: Utils.getAttriFormatVal(data) });
            }
            this.m_tAttriColl.replaceAll(res);
            this.m_pCSroller.updateBtn();
        }


        /**刷新星星显示 */
        private refreshStar() {
            let starNum = this.m_curVo.star;
            while (this.m_groupStar.numChildren > starNum) {
                this.m_groupStar.removeChildAt(0);
            }
            for (let i = this.m_groupStar.numChildren; i < starNum; i++) {
                let star = new eui.Image();
                star.source = "common_star_png";
                star.width = 36;
                star.height = 36;
                this.m_groupStar.addChild(star);
            }
        }




        /**=====================================================================================
        * 事件监听 begin
        * =====================================================================================
        */

        protected addEvent() {
            EventManager.addTouchScaleListener(this.m_btnEquip, this, this.onBtnEquipHandler);
            EventManager.addTouchScaleListener(this.m_btnUnEquip, this, this.onBtnUnEquipHandler);
            EventManager.addTouchScaleListener(this.m_btnStreng, this, this.onBtnStreng);

            EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onTreaLevel, this);
            EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onTreaStar, this);
            EventMgr.addEvent(TreaEvent.TREA_STONE_UPDATE, this.onTreaStone, this);
        }

        protected removeEvent() {

            EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
            EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
            EventMgr.removeEventByObject(TreaEvent.TREA_STONE_UPDATE, this);
        }

        /**宝物等级刷新 */
        private onTreaLevel(data: { itemId: number, level: number }) {
            if (this.m_nItemId != data.itemId) return;
            this.refresAttri();
        }

        /**宝物星级刷新 */
        private onTreaStar(itemId: number) {
            if (this.m_nItemId != itemId) return;
            this.refreshStar();
            this.refresAttri();
        }

        /**宝物宝石刷新 */
        private onTreaStone(itemId: number) {
            if (this.m_nItemId != itemId) return;
            this.refresAttri();
        }

        /**强化 */
        private onBtnStreng() {
            if (FunctionModel.isFunctionOpenWithWarn(FunctionType.TREASURE)) {
                if (this.m_nItemId > 0){
                    UpManager.close();
                    Utils.open_view(TASK_UI.TREASURE_INFO, this.m_nItemId);
                } 
            }
        }

        /**宝物装备卸载 */
        private onBtnUnEquipHandler() {
            if (this.generalVo && this.generalVo.isOwn && this.m_nItemId > 0) {
                GeneralProxy.send_GENERAL_TREASURE_WEAR(this.generalId, 0);
            }
        }

        /**宝物装备按钮回调 */
        private onBtnEquipHandler() {
            if (this.generalVo && this.generalVo.isOwn) {
                let generalType = this.generalVo.getGeneralOccupation();
                let list = TreasureModel.getTreasByGeneralType(generalType);

                if (list.length == 0) {
                    EffectUtils.showTips(GCode(CLEnum.GEN_TREA_NO2), 1, true);
                    let turnPanel = C.FunctionConfig[FunctionType.TREASURE].turnPanel;
                    if (isNull(turnPanel)) return;
                    FunctionModel.funcToPanel(turnPanel);
                    // Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, ConstUtil.getValue(IConstEnum.TREA_SOURCE_ID));
                    return;
                }
                let param: any = {};
                param.generalId = this.generalVo.generalId;
                param.generalType = generalType;
                Utils.open_view(TASK_UI.POP_GENERAL_TREA_LIST, param);
            }
        }

        /**=====================================================================================
		 * 事件监听 end
		 * =====================================================================================
		 */


    }
}