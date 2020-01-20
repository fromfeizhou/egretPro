module com_main {
    /** 道具 */
    export class TreaStarComp extends TreaBaseComp {

        public m_listCur: eui.List;
        public m_labCurLv: eui.Label;
        public m_pNextRoot: eui.Group;
        public m_labNextLv: eui.Label;
        public m_listNext: eui.List;
        public m_comResCost0: com_main.ComResCost;
        public m_comResCost1: com_main.ComResCost;
        public m_btnStreng: com_main.ComButton;

        private m_tCurCollect: eui.ArrayCollection;
        private m_tNextCollect: eui.ArrayCollection;

        public constructor() {
            super();
            // this.skinName = Utils.getAppSkin("treasure/comp/TreaStarCompSkin.exml");
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();

            this.m_btnStreng.setTitleLabel(GCode(CLEnum.STAR_UP));
            this.m_tCurCollect = new eui.ArrayCollection();
            this.m_listCur.dataProvider = this.m_tCurCollect;
            this.m_listCur.itemRenderer = ComAttriRender;

            this.m_tNextCollect = new eui.ArrayCollection();
            this.m_listNext.dataProvider = this.m_tNextCollect;
            this.m_listNext.itemRenderer = ComAttriRender;

            this.addEvent();
        }


        /**初始化界面 */
        protected initView() {
            if (!this.m_curVo) return;
            this.refreshCost();
            this.refresLevel();

            RedPointModel.AddInfoListener(this.m_btnStreng, { x: 210, y: -3, scale: 0.78 }, [RedEvtType.TREA_STAR], 2, { treaId: this.itemId });
        }

        /**刷新界面 */
        public refreshView() {
            this.refreshCost();
            this.refresLevel();
        }

        /**刷新等级属性 */
        private refresLevel() {
            if (!this.m_curVo) return;
            this.m_labCurLv.text = this.m_curVo.star.toString();
            let res: ComAttriRD[] = [];
            let curCfg = TreasureModel.getStarCfg(this.m_curVo.star, this.m_curVo.quality);
            let curRateList = StringUtils.keyValsToNumber(curCfg.attriAddRate);
            let curAttri = this.m_curVo.getMainAttris();
            res.push({ state: 'style22', name: GCode(CLEnum.TREA_LV_MAX), value: curCfg.levelLimit.toString() });
            res.push({ state: 'style22', name: GCode(CLEnum.TREA_STONE_BSK), value: curCfg.unlockHole.toString() });

            for (let i = 0; i < curAttri.length; i++) {
                let data = curAttri[i];
                res.push({ state: 'style22', name: Utils.getAttriNameByType(data.key) + ' ', value: Utils.getAttriFormatVal(data) })
            }
            this.m_tCurCollect.replaceAll(res);

            if (this.m_curVo.isMaxStar()) return;
            this.m_labNextLv.text = (this.m_curVo.star + 1).toString();
            let nextRes: ComAttriRD[] = [];
            let nextCfg = TreasureModel.getStarCfg(this.m_curVo.star + 1, this.m_curVo.quality);
            let nextRateList = StringUtils.keyValsToNumber(nextCfg.attriAddRate);

            nextRes.push({ state: 'style22b', name: GCode(CLEnum.TREA_LV_MAX), value: nextCfg.levelLimit.toString() });
            nextRes.push({ state: 'style22b', name: GCode(CLEnum.TREA_STONE_BSK), value: nextCfg.unlockHole.toString() });

            let attList = this.m_curVo.getStarGrowValues();
            for (let i = 0; i < attList.length; i++) {
                let data = attList[i];
                let name = Utils.getAttriNameByType(data.key) + ' ';

                let curRate = Utils.getAttriValByType(curRateList, data.key);
                let nextRate = Utils.getAttriValByType(nextRateList, data.key);
                let rate = nextRate > 0 ? Math.floor((nextRate - curRate) / 100) : 0;

                let val = rate > 0 ? `${data.value}(+${rate}%)` : `${data.value}`;
                nextRes.push({ state: 'style22b', name: name, value: val })
            }
            this.m_tNextCollect.replaceAll(nextRes);
        }

        /**刷新消耗 */
        private refreshCost() {
            if (!this.m_curVo) return;
            if (this.m_curVo.isMaxStar()) {
                this.m_pNextRoot.visible = false;
                this.m_comResCost0.visible = false;
                this.m_comResCost1.visible = false;
            } else {
                this.m_pNextRoot.visible = true;
                this.m_comResCost0.visible = true;
                this.m_comResCost1.visible = true;
                let costList = this.getUpStarCost();
                let len = Math.min(costList.length, 2);
                for (let i = 0; i < len; i++) {
                    let data = costList[i];
                    let item = this["m_comResCost" + i] as ComResCost;
                    item.setInfo(data.itemId, data.count);
                }
            }
        }
        /**获得升级消耗 */
        private getUpStarCost() {
            let starCfg = TreasureModel.getStarCfg(this.m_curVo.star, this.m_curVo.quality)
            if (starCfg) {

                let res: IItemInfo[] = [];
                res.push({itemId: this.m_curVo.treaCfg.fragment, count: starCfg.fragmenNum })
                return res.concat(Utils.parseCommonItemJson(starCfg.consume));
            }
            return [];
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnStreng, this, this.onBtnStreng);

            EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onStarUpdate, this);
            EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onLevelUpdate, this);
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);

            EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
            EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
        }

        /**强化成功回调 */
        private onLevelUpdate(data: { itemId: number, level: number }) {
            if (data.itemId != this.m_nItemId) return;
            this.refresLevel();
        }

        /**升星 */
        private onStarUpdate(itemId: number) {
            if (itemId != this.m_nItemId) return;
            this.refreshView();
        }

        /**强化按钮回调 */
        private onBtnStreng() {
            if (!this.m_curVo) return;
            if (this.m_curVo.isMaxStar()) {
                EffectUtils.showTips(GCode(CLEnum.TREA_STAR_MAX));
                return;
            }
            let costList = this.getUpStarCost();
            if (PropModel.isItemListEnough(costList, 3)) {
                TreasureProxy.send_TREASURE_UPGRADE_STAR(this.m_nItemId);
            }

        }

        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

    }

}