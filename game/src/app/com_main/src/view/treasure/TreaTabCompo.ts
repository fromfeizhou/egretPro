module com_main {
	/**
	 * 藏宝阁宝石合成
	 */
    export class TreaTabCompo extends CView implements ITreaTabView {
        public static NAME = 'TreaTabCompo';

        public m_pCompoRoot: eui.Group;
        public m_comItem0: com_main.ComItemNew;
        public m_comItem1: com_main.ComItemNew;
        public m_comItem: com_main.ComItemNew;
        public m_comResAll: com_main.ComResCost;
        public m_comResOne: com_main.ComResCost;
        public m_btnAll: com_main.ComButton;
        public m_btnOne: com_main.ComButton;
        public m_pEffRes: eui.Group;
        public m_pEffLeft: eui.Group;
        public m_pEffRight: eui.Group;
        public m_listItem: eui.List;

        private m_tCollects: eui.ArrayCollection;
        private m_nCurIndex: number; //当前选中下标

        private m_bInAction: boolean;    //合成动画
        private m_nCompId: number;       //合成id
        private m_nCompNum: number;      //合成数量
        private m_nOldScrollV: number;   //旧的滚动距离

        public m_bInit: boolean;

        public constructor(width: number, height: number) {
            super();
            this.name = TreaTabCompo.NAME;
            this.initApp("treasure/TreaTabCompoSkin.exml");
            this.width = width;
            this.height = height;
        }

        public onDestroy(): void {
            this.removeEvent();
            Utils.TimerManager.remove(this.fixItemsPos, this);
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

        }

        /**初始化 */
        public initView() {
            if (this.m_bInit) return;
            this.m_bInit = true;
            this.m_btnAll.setTitleLabel(GCode(CLEnum.TREA_STONE_PL));
            this.m_btnOne.setTitleLabel(GCode(CLEnum.TREA_STOEN_HC));

            this.m_tCollects = new eui.ArrayCollection();
            this.m_listItem.dataProvider = this.m_tCollects;
            this.m_listItem.itemRenderer = TreaStoneRender;

            this.m_bInAction = false;

            egret.callLater(() => {
                if (this.m_listItem) {
                    if(this.m_listItem)Utils.tileGroupToCenter(this.m_listItem, 134);
                }
            }, this);

            this.refreshItemsView();
            this.changeItemSelected(0);
            this.addEvent();
        }

        public changeTag(index: number) {

        }

        /**刷新显示 */
        private refreshItemsView() {
            let res: ITreaStoneRD[] = [];
            let propList = PropModel.getGemList();
            for (let i = 0; i < propList.length; i++) {
                let data = propList[i];
                res.push({ uuid: data.uuid, itemId: data.itemId, count: data.count, selected: false, type: data.type });
            }
            this.m_tCollects.replaceAll(res);
        }


        /**排序 */
        private sortItems() {
            this.m_tCollects.source.sort((a: ITreaStoneRD, b: ITreaStoneRD) => {
                if (a.type == b.type) {
                    return a.itemId - b.itemId;
                }
                return a.type - b.type;
            })

            this.m_nOldScrollV = this.m_listItem.scrollV;
            this.m_tCollects.refresh();

            Utils.TimerManager.remove(this.fixItemsPos, this);
            Utils.TimerManager.doFrame(3, 1, this.fixItemsPos, this);
        }

        private fixItemsPos() {
            this.m_listItem.scrollV = this.m_nOldScrollV;
        }

        //刷新合成格子
        private refreshCompoView() {
            this.m_pCompoRoot.visible = true;
            let data = this.m_tCollects.getItemAt(this.m_nCurIndex) as ITreaStoneRD;
            let stoneCfg = C.GemstoneConfig[data.itemId];
            let nextId = stoneCfg.nextId;
            if (stoneCfg == null || nextId == 0) {
                this.hideGemlatticeView();
                return;
            }

            let cost = stoneCfg.cost;
            this.m_comResOne.setInfo(PropEnum.SILVER, cost);
            let count = Math.floor(data.count / 2);
            count = Math.max(1, count);
            this.m_comResAll.setInfo(PropEnum.SILVER, cost * count);

            for (let i = 0; i < 2; i++) {
                let cell = this["m_comItem" + i] as ComItemNew;
                cell.setItemInfo(data.itemId);
            }

            this.m_comItem.setItemInfo(nextId);
        }
        /**刷新空合成格子 */
        private hideGemlatticeView() {
            this.m_pCompoRoot.visible = false;
        }

        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */

        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnAll, this, this.onBtnAll);
            EventManager.addTouchScaleListener(this.m_btnOne, this, this.onBtnOne);

            this.m_listItem.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);

            EventMgr.addEvent(BagEvent.BAG_ITEM_ADD, this.onBagAdd, this);
            EventMgr.addEvent(BagEvent.BAG_ITEM_DEL, this.onBagDel, this);
            EventMgr.addEvent(BagEvent.BAG_ITEM_UPDATE, this.onBagChange, this);
        }

        private removeEvent() {
            this.m_listItem.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemSelected, this);

            EventMgr.removeEventByObject(BagEvent.BAG_ITEM_ADD, this);
            EventMgr.removeEventByObject(BagEvent.BAG_ITEM_DEL, this);
            EventMgr.removeEventByObject(BagEvent.BAG_ITEM_UPDATE, this);
        }

        /**物品数量变动 */
        private onBagDel(uuid: number) {
            for (let i = 0; i < this.m_tCollects.source.length; i++) {
                let data = this.m_tCollects.getItemAt(i) as ITreaStoneRD;
                if (data.uuid == uuid) {
                    this.m_tCollects.removeItemAt(i);
                    if (this.m_nCurIndex == i) {
                        this.m_nCurIndex = -1;
                        this.changeItemSelected(0);
                    }
                    break;
                }
            }
            this.sortItems();
        }
        /**物品变动 */
        private onBagAdd(uuid: number) {
            let vo = PropModel.getPropByUId(uuid);
            if (vo.type != PropMainType.STONE) return;
            let data: ITreaStoneRD = { uuid: vo.uuid, itemId: vo.itemId, count: vo.count, selected: false, type: vo.type };
            this.m_tCollects.addItem(data);
            if (this.m_tCollects.source.length == 1) {
                this.m_nCurIndex = -1;
                this.changeItemSelected(0);
            }
            this.sortItems();
        }

        /**物品变动 */
        private onBagChange(uuid: number) {
            for (let i = 0; i < this.m_tCollects.source.length; i++) {
                let data: ITreaStoneRD = this.m_tCollects.getItemAt(i);
                if (data && data.uuid == uuid) {
                    let vo = PropModel.getPropByUId(uuid);
                    data.count = vo.count;
                    this.m_tCollects.replaceItemAt(data, i);
                    if (i == this.m_nCurIndex) this.refreshCompoView();
                }
            }
        }


        /**宝石选中 */
        private onItemSelected(e: eui.ItemTapEvent) {
            if (this.m_bInAction) return;
            this.changeItemSelected(e.itemIndex);
        }

        /**当前宝石选中 */
        private changeItemSelected(index: number) {
            if (index >= this.m_tCollects.length) {
                this.hideGemlatticeView();
                return;
            }
            if (this.m_nCurIndex == index) return;
            this.setItemState(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.setItemState(this.m_nCurIndex, true);
            this.refreshCompoView();
        }

        /**宝石状态切换 */
        private setItemState(index: number, val: boolean) {
            let data = this.m_tCollects.getItemAt(this.m_nCurIndex) as ITreaStoneRD;
            if (!data) return;
            data.selected = val;
            this.m_tCollects.replaceItemAt(data, this.m_nCurIndex);
        }

        /**通用条件检查 */
        private checkCondition(compoNum: number = 1) {
            let data = this.m_tCollects.getItemAt(this.m_nCurIndex) as ITreaStoneRD;
            if (!data) {
                EffectUtils.showTips(GCode(CLEnum.TREA_BSHC_FAL), 1, true);
                return false;;
            }
            let stoneCfg = C.GemstoneConfig[data.itemId];
            if (stoneCfg.nextId == 0) {
                EffectUtils.showTips(GCode(CLEnum.TREA_BSHC_TIPS), 1, true);
                return false;;
            }
            if (MainMapModel.getLevelByType(BuildingType.CORNUCOPIA) < stoneCfg.openLevel) {
                EffectUtils.showTips(GCodeFromat(CLEnum.TREA_BSHC_TIPS1, stoneCfg.openLevel), 1, true);
                return false;
            }
            let ownNum = PropModel.getPropNum(data.itemId);
            if (ownNum < 2 * compoNum) {
                EffectUtils.showTips(GCode(CLEnum.TREA_BSHC_FAL1), 1, true);
                return false;
            }
            if (!PropModel.isItemEnough(PropEnum.SILVER, stoneCfg.cost * compoNum, 3)) return false

            return true;
        }
        /**单个合成 */
        private onBtnOne() {
            if (this.m_bInAction) return;
            if (this.checkCondition()) {
                let data = this.m_tCollects.getItemAt(this.m_nCurIndex) as ITreaStoneRD;
                this.m_nCompId = data.itemId;
                this.m_nCompNum = 2;
                this.playUpLevelEffect()
            }

        }

        /**单个合成 */
        private onBtnAll() {
            let data = this.m_tCollects.getItemAt(this.m_nCurIndex) as ITreaStoneRD;
            if (data) {
                let count = Math.floor(data.count / 2);
                count = Math.max(1, count);
                if (this.checkCondition(count)) {
                    this.m_nCompId = data.itemId;
                    this.m_nCompNum = 2 * count;
                    this.playUpLevelEffect()
                }
            }
        }

        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */

        /**升级成功特效 */
        private playUpLevelEffect() {
            this.m_bInAction = true;
            let leftEff = new MCDragonBones();
            leftEff.initAsync(IETypes.EUI_UpStoneEff01);
            leftEff.play(IETypes.EUI_UpStoneEff01, 1, true);
            this.m_pEffLeft.addChild(leftEff);

            let rightEff = new MCDragonBones();
            rightEff.initAsync(IETypes.EUI_UpStoneEff01);
            rightEff.playOnceDone(IETypes.EUI_UpStoneEff01, this.playUpLevelEffectII, this);
            this.m_pEffRight.addChild(rightEff);

        }

        /**升级成功特效 */
        private playUpLevelEffectII() {
            if (this.m_pEffRes) {
                let resEff = new MCDragonBones();
                resEff.initAsync(IETypes.EUI_UpStoneEff02);
                resEff.playOnceDone(IETypes.EUI_UpStoneEff02, () => {
                    this.m_bInAction = false;
                    TreasureProxy.send_GEMSTONE_UP(this.m_nCompId, this.m_nCompNum);
                }, this);
                this.m_pEffRes.addChild(resEff);
            }
        }

    }






    interface ITreaStoneRD {
        uuid: number,
        itemId: number,
        type: number,
        count: number,
        selected: boolean,
    }

    class TreaStoneRender extends eui.ItemRenderer {
        private m_item: ComItemNew;
        private m_imgSelect: eui.Image;

        protected m_tData: ITreaStoneRD;
        public constructor() {
            super();
            this.width = 134;
            this.height = 134;
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_item = ComItemNew.create('name_num', false);
            this.addChild(this.m_item);

            this.m_imgSelect = new com_main.CImage("SelectKuang_png");
            this.m_imgSelect.x = -4;
            this.m_imgSelect.y = -12;
            this.addChild(this.m_imgSelect);
        }

        protected dataChanged() {
            this.m_tData = this.data;
            this.m_item.setItemInfo(this.m_tData.itemId, this.m_tData.count);
            this.m_imgSelect.visible = this.m_tData.selected;
        }
    }

}