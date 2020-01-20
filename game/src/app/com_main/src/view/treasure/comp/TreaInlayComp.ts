module com_main {
    /** 道具 */
    export class TreaInlayComp extends TreaBaseComp {
        public m_stone0: com_main.TreaStoneProp;
        public m_stoneEx0: com_main.TreaStoneExProp;
        public m_stone1: com_main.TreaStoneProp;
        public m_stoneEx1: com_main.TreaStoneExProp;
        public m_stone2: com_main.TreaStoneProp;
        public m_stoneEx2: com_main.TreaStoneExProp;
        public m_stone3: com_main.TreaStoneProp;
        public m_stoneEx3: com_main.TreaStoneExProp;
        public m_groupSuit0: eui.Group;
        public m_labSuitAttri0: eui.Label;
        public m_groupSuit1: eui.Group;
        public m_labSuitAttri1: eui.Label;
        public m_groupSuit2: eui.Group;
        public m_labSuitAttri2: eui.Label;

        public constructor() {
            super();
            // this.skinName = Utils.getAppSkin("treasure/comp/TreaInlayCompSkin.exml");
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated() {
            super.childrenCreated();


            this.addEvent();
        }


        /**初始化界面 */
        protected initView() {
            if (!this.m_curVo) return;
            this.initExStone();
            this.refreshStone();
            this.refreshSuit();
        }

        /**刷新界面 */
        public refreshView() {
            this.refresExStone();
            this.refreshStone();
            this.refreshSuit();
        }

        /**刷新宝石显示 */
        private refreshStone() {
            if (!this.m_curVo) return;
            for (let i = 0; i < this.m_curVo.holes.length; i++) {
                let data = this.m_curVo.holes[i];
                let item = this[`m_stone${i}`] as TreaStoneProp;
                item.setInfo(this.m_curVo, data);
            }
        }

        /**刷新套装显示 */
        private refreshSuit() {
            if (!this.m_curVo) return;
            let infos = this.m_curVo.getSuitInfos();
            let matchNum = this.m_curVo.getSuitLevel();
            //套装列表
            let suitCfg = this.m_curVo.treaCfg;
            let props = ["oneEffect", "twoEffect", "threeEffect"];
            for (let i = 0; i < 3; i++) {
                let group = this[`m_groupSuit${i}`] as eui.Group;
                let labAttri = this[`m_labSuitAttri${i}`] as eui.Label;
                let attriList = StringUtils.keyValsToNumberArray(suitCfg[props[i]]);
                let data = attriList[0];
                //第一个属性命中两条
                let isActivated = matchNum >= (i + 2);
                Utils.isGray(!isActivated, group);
                if (isActivated) {
                    labAttri.textColor = GameConfig.TextColors.fontWhite;
                    labAttri.textFlow = (new egret.HtmlTextParser()).parser(Utils.getAttriFormat(data));
                } else {
                    labAttri.textColor = GameConfig.TextColors.grayWhite;
                    labAttri.textFlow = [];
                    labAttri.text = Utils.getAttriFormat(data, true, '%s%s');
                }
            }
        }

        /**额外属性初始化 */
        private initExStone() {
            if (!this.m_curVo) return;
            for (let i = 0; i < this.m_curVo.suitInfos.length; i++) {
                let data = this.m_curVo.suitInfos[i];
                let item = this[`m_stoneEx${i}`] as TreaStoneExProp;
                item.setInfo(data);
            }
            this.refresExStone();
        }

        /**刷新额外属性 */
        private refresExStone() {
            if (!this.m_curVo) return;
            let holes = this.m_curVo.holes;
            for (let i = 0; i < this.m_curVo.suitInfos.length; i++) {
                let data = this.m_curVo.suitInfos[i];
                let item = this[`m_stoneEx${i}`] as TreaStoneExProp;
                let itemId = holes[i].gemstoneId;
                if (itemId > 0) {
                    let cfg = C.GemstoneConfig[itemId];
                    item.activited = cfg.type == data.type;
                } else {
                    item.activited = false;
                }
            }
        }

        /**=====================================================================================
		 * 事件监听 begin
		 * =====================================================================================
		 */
        private addEvent() {
            EventMgr.addEvent(TreaEvent.TREA_STONE_UPDATE, this.onStoneUpdate, this);
            EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onStarUpdate, this);
        }

        private removeEvent() {
            EventManager.removeEventListeners(this);

            EventMgr.removeEventByObject(TreaEvent.TREA_STONE_UPDATE, this);
            EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);
        }

        /**升星 */
        private onStarUpdate(itemId: number) {
            if (itemId != this.m_nItemId) return;
            this.refreshStone();
        }

        /**宝石镶嵌 */
        private onStoneUpdate(itemId: number) {
            if (itemId != this.m_nItemId) return;
            this.refreshView();
        }

        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

    }

}