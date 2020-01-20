module com_main {
	/**
	 * 藏宝阁宝石合成
	 */
    export class TreaTabList extends CView implements ITreaTabView {
        public static NAME = 'TreaTabList';

        public m_pScroll: eui.Scroller;
        public m_listItem: eui.List;

        private m_tCollection: eui.ArrayCollection;
        private m_tCfgList: TreasureConfig[];    //宝物配置表
        private m_tTagTypes: TreaType[];

        public m_bInit: boolean;

        public constructor(width: number, height: number) {
            super();
            this.name = TreaTabList.NAME;
            this.initApp("treasure/TreaTabListSkin.exml");
            this.width = width;
            this.height = height;
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

        }

        public initView() {
            if (this.m_bInit) return;
            this.m_bInit = true;

            this.m_tTagTypes = [TreaType.ALL, TreaType.WEAPON, TreaType.RIDE,
            TreaType.GEM];
            this.m_tCfgList = TreasureModel.getAllCfgs();

            this.m_tCollection = new eui.ArrayCollection();
            this.m_listItem.itemRenderer = TreaItemRender;
            this.m_listItem.dataProvider = this.m_tCollection;

            //调整item列表			
            egret.callLater(() => {
                if (this.m_listItem) {
                    if(this.m_listItem)Utils.tileGroupToCenter(this.m_listItem, 324);
                }
            }, this);

            this.addEvent();
        }

        /**切卡 */
        public changeTag(index: number) {
            let list = this.getCfgsByType(this.m_tTagTypes[index]);
            this.m_tCollection.replaceAll(list);
            this.m_pScroll.stopAnimation();
            this.m_pScroll.viewport.scrollV = 0;
        }

        /**获得对应类型列表 */
        private getCfgsByType(type: TreaType) {
            let res: TreasureConfig[] = [];
            for (let i = 0; i < this.m_tCfgList.length; i++) {
                let cfg = this.m_tCfgList[i];
                if (type == TreaType.ALL || type == cfg.type) {
                    res.push(cfg);
                }
            }
            res.sort((a, b) => {
                let ownerA = TreasureModel.isOwner(a.id);
                let ownerB = TreasureModel.isOwner(b.id);
                if (ownerA == ownerB) {
                    return a.id - b.id;
                }
                if (ownerA) return -1;
                return 1;
            });
            return res;
        }



        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */

        private addEvent() {
            this.m_listItem.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
            EventMgr.addEvent(TreaEvent.TREA_LEVEL_UPDATE, this.onTreaLevel, this);
            EventMgr.addEvent(TreaEvent.TREA_STAR_UPDATE, this.onTreaStar, this);
        }

        private removeEvent() {
            this.m_listItem.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);
            EventMgr.removeEventByObject(TreaEvent.TREA_LEVEL_UPDATE, this);
            EventMgr.removeEventByObject(TreaEvent.TREA_STAR_UPDATE, this);

        }

        private onItemSelected(e: eui.ItemTapEvent): void {
            let data = e.item as TreasureConfig;
            let itemId = data.id;
            // if (TreasureModel.isOwner(itemId)) {
            Utils.open_view(TASK_UI.TREASURE_INFO, itemId);
            // } else {
            //     EffectUtils.showTips(GCode(CLEnum.TREA_BWWJH));
            // }
        }

        /**宝物等级刷新 */
        private onTreaLevel(data: { itemId: number, level: number }) {
            this.onTreaStar(data.itemId);
        }

        /**宝物星级刷新 */
        private onTreaStar(itemId: number) {
            for (let i = 0; i < this.m_tCollection.source.length; i++) {
                let data = this.m_tCollection.getItemAt(i) as TreasureConfig;
                if (data.id == itemId) {
                    this.m_tCollection.replaceItemAt(data, i);
                    return;
                }
            }
        }

    }

    /**宝物 */
    class TreaItemRender extends eui.ItemRenderer {
        public m_pRoot: eui.Group;
        public m_treaIcon: com_main.TreaIconView;
        public m_pOwnerName: eui.Group;
        public m_labOwner: eui.Label;
        public m_pStartRoot: eui.Group;
        public m_labName: eui.Label;
        public m_labLevel: eui.Label;

        private m_tData: TreasureConfig;
        public constructor() {
            super();
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

        }

        protected dataChanged() {
            this.m_tData = this.data;
            if (!this.m_tData) return;

            this.m_treaIcon.setItemId(this.m_tData.id);
            this.m_labName.text = this.m_tData.name;

            if (TreasureModel.isOwner(this.m_tData.id)) {
                Utils.isGray(false, this.m_treaIcon);
                let vo = TreasureModel.getData(this.m_tData.id);
                this.refreshOwner(vo.generalId);
                //等级
                this.m_labLevel.text = `+${vo.level}`;
                Utils.setLabColorByQuality(this.m_labName, this.m_tData.quality);
                //星级
                this.refreshStar(vo.star);

                RedPointModel.AddInfoListener(this.m_pRoot, { x: 250, y: 220 },
                    [RedEvtType.TREA_STRENG, RedEvtType.TREA_STAR, RedEvtType.TREA_INLAY],
                    2, { treaId: this.m_tData.id });
            } else {
                Utils.isGray(true, this.m_treaIcon);
                this.m_pOwnerName.visible = false;
                this.m_labLevel.text = '';
                this.m_labName.textColor = GameConfig.TextColors.gray;
                this.m_pStartRoot.removeChildren();

                RedPointModel.RemoveInfoListenerByCode(this.m_pRoot.hashCode);
            }
        }

        /**刷新武将 */
        private refreshOwner(generalId: number) {
            if (generalId > 0) {
                this.m_pOwnerName.visible = true;
                this.m_labOwner.text = GeneralModel.getGeneralName(generalId);
            } else {
                this.m_pOwnerName.visible = false;
            }
        }

        /**刷新星级 */
        private refreshStar(starNum: number) {
            while (this.m_pStartRoot.numChildren > starNum) {
                this.m_pStartRoot.removeChildAt(0);
            }

            for (let i = this.m_pStartRoot.numChildren; i < starNum; i++) {
                let star = new eui.Image();
                star.source = "common_star_png";
                star.width = 30;
                star.height = 30;
                this.m_pStartRoot.addChild(star);
            }
        }
    }
}