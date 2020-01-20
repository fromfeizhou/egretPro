module com_main {


	/**
	 * 酒馆预览面板
	 */
    export class TavernCheckView extends CView {
        public static NAME = 'TavernCheckView';
        public m_PopUp: com_main.APopUp;
        public m_tavernScroller: eui.Scroller;
        public m_List: eui.List;

        private m_pCollection: eui.ArrayCollection;   //数据
        public totalPer: number = 0     //权重总数
        public constructor(data: any) {
            super();


            this.initApp("tavern/TavernCheckViewSkin.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.TAVERN_ATTRACT,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());


        }
        public onDestroy(): void {
            super.onDestroy();
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_PopUp.setTitleLabel(GCode(CLEnum.TAVEN_HREO));
            this.m_PopUp.setBottomBorder(false);
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_List.dataProvider = this.m_pCollection;
            this.m_List.itemRenderer = TavernRender;
            this.m_List.useVirtualLayout = true;
            this.validateNow();
            this.initPanel();
        }
        /**初始化列表 */
        private initPanel() {
            let heroList = [];
            let heroCfg = C.LotteryConfig;
            this.totalPer = this.getTotalNum(heroCfg);
            for (let i in heroCfg) {
                let vo = heroCfg[i];
                let item: number;
                if (vo.rewardType == 8) {
                    item = vo.showItem;
                } else {
                    item = vo.item;
                }
                let data: ITavernItemRD = { item: item, currPer: this.getPerNum(vo), totalPer: this.totalPer, rewardType: vo.rewardType, showItem: vo.showItem };
                heroList.push(data);
            }
            heroList.sort(this.checkSort);
            this.m_pCollection.replaceAll(heroList);
        }
        /**品质排序 */
        private checkSort(a: ITavernItemRD, b: ITavernItemRD) {
            let acfg: ItemConfig = PropModel.getCfg(a.item);
            let bcfg: ItemConfig = PropModel.getCfg(b.item);

            if (a.rewardType < b.rewardType) {
                return -1;
            } else if (a.rewardType > b.rewardType) {
                return 1;
            }
            if (acfg.quality < bcfg.quality) {
                return 1;
            } else if (acfg.quality > bcfg.quality) {
                return -1;
            } else {
                return 0;
            }
        }
        /**物品总的权重值 */
        private getTotalNum(heroCfg: { [key: number]: LotteryConfig }) {
            let totalNum: number = 0;
            for (let i in heroCfg) {
                let vo = heroCfg[i];
                totalNum += this.getPerNum(vo);
            }
            return totalNum;
        }
        /**当前物品权重值 */
        private getPerNum(vo: any) {
            vo.rate = vo.rate.replace('[', '');
            vo.rate = vo.rate.replace(']', '');
            let allper = vo.rate.split(',');
            let num = Number(allper[0]);
            return num;
        }
    }

    export interface ITavernItemRD {
        item: number,
        currPer: number,
        totalPer: number,
        rewardType: number,
        showItem: number,
    }
    /**
    * @class 
    * @extends eui.ItemRenderer
    */
    export class TavernRender extends eui.ItemRenderer {
        protected m_tavernItem: TavernCheckitem;
        protected m_imgSelected: eui.Image;

        protected m_tData: ITavernItemRD;
        private m_nType: number;     //面板类型
        public constructor() {
            super();
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }
        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_tavernItem = new TavernCheckitem();
            this.addChild(this.m_tavernItem);
        }
        protected dataChanged() {
            this.m_tData = this.data;
            this.m_tavernItem.setItemInfo(this.m_tData.item, this.m_tData.currPer, this.m_tData.totalPer);
        }
    }
}