module com_main {
    /** 道具 */
    export class TreaLvComp extends TreaBaseComp {

        public m_listCur: eui.List;
        public m_labCurLv: eui.Label;
        public m_pNextRoot: eui.Group;
        public m_labNextLv: eui.Label;
        public m_listNext: eui.List;
        public m_comResCost0: com_main.ComResCost;
        public m_comResCost1: com_main.ComResCost;
        public m_btnStreng: com_main.ComButton;
        public m_labSucce: eui.Label;

        private m_tCurCollect: eui.ArrayCollection;
        private m_tNextCollect: eui.ArrayCollection;

        public constructor() {
            super();
            // this.skinName = Utils.getAppSkin("treasure/comp/TreaLvCompSkin.exml");
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();

            this.m_btnStreng.setTitleLabel(GCode(CLEnum.STRENG));
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
            this.refreshSucc();

            RedPointModel.AddInfoListener(this.m_btnStreng, { x: 210, y: -3, scale: 0.78 }, [RedEvtType.TREA_STRENG], 2, { treaId: this.itemId });
        }

        /**刷新界面 */
        public refreshView() {
            this.refreshCost();
            this.refresLevel();
            this.refreshSucc();
        }

        /**刷新等级属性 */
        private refresLevel() {
            if (!this.m_curVo) return;
            let level = this.m_curVo.level;
            this.m_labCurLv.text = level.toString();



            let res: ComAttriRD[] = [];
            let curAttri = this.m_curVo.getMainAttris();
            for (let i = 0; i < curAttri.length; i++) {
                let data = curAttri[i];
                res.push({ state: 'style22', name: Utils.getAttriNameByType(data.key) + ' ', value: Utils.getAttriFormatVal(data) })
            }
            this.m_tCurCollect.replaceAll(res);

            if (this.m_curVo.isMaxLevel()) return;
            this.m_labNextLv.text = (level + 1).toString();


            let nextRes: ComAttriRD[] = [];
            let attList = this.m_curVo.getLevelGrowValues();

            let curCfg = C.TreasureLevelConfig[level];
            let nextCfg = C.TreasureLevelConfig[level + 1];
            let curRateList = StringUtils.keyValsToNumber(curCfg.growUp);
            let nextRateList = StringUtils.keyValsToNumber(nextCfg.growUp);
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
            if (this.m_curVo.isMaxLevel()) {
                this.m_pNextRoot.visible = false;
                this.m_comResCost0.visible = false;
                this.m_comResCost1.visible = false;
            } else {
                this.m_pNextRoot.visible = true;
                this.m_comResCost0.visible = true;
                this.m_comResCost1.visible = true;
                let costList = this.getUpLvCost();
                for (let i = 0; i < costList.length; i++) {
                    let data = costList[i];
                    let item = this["m_comResCost" + i] as ComResCost;
                    item.setInfo(data.itemId, data.count);
                }
            }
        }
        /**获得升级消耗 */
        private getUpLvCost() {
            let level = this.m_curVo.level
            let lvCfg = C.TreasureLevelConfig[level]
            if (lvCfg) {
                return Utils.parseCommonItemJson(lvCfg.consume);
            }
        }
        /**刷新升级率 */
        private refreshSucc() {
            this.m_labSucce.text='';
            let level = this.m_curVo.level
            let lvCfg = C.TreasureLevelConfig[level];
            if (lvCfg) {
                this.m_labSucce.text = '成功率：'+(lvCfg.success * 100) / 1000 + "%"
            }
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnStreng, this, this.onBtnStreng);
            EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onLevelUpdate, this);
            EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onStarUpdate, this);
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);
            EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
            EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
        }

        /**升星 */
        private onStarUpdate(itemId: number) {
            if (itemId != this.m_nItemId) return;
            this.refresLevel();
        }

        /**强化按钮回调 */
        private onBtnStreng() {
            if (!this.m_curVo) return;
            if (this.m_curVo.isMaxLevel()) {
                EffectUtils.showTips(GCode(CLEnum.TREA_LEVEL_MAX));
                return;
            }
            let cfg = this.m_curVo.getStarCfg();
            if (!cfg) return;
            if (this.m_curVo.level >= cfg.levelLimit) {
                EffectUtils.showTips(GCodeFromat(CLEnum.TREA_STAR_FAL, cfg.levelLimit));
                return;
            }
            let costList = this.getUpLvCost();
            if (PropModel.isItemListEnough(costList, 3)) {
                TreasureProxy.send_TREASURE_UP_GRADE(this.m_curVo.itemId);
            }

        }

        /**强化成功回调 */
        private onLevelUpdate(data: { itemId: number, level: number }) {
            if (data.itemId != this.m_nItemId) return;
            this.refreshView();
        }

        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

    }

}