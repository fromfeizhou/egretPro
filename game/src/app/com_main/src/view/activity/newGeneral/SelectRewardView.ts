// TypeScript file

module com_main {
    export class SelectRewardView extends CView {
        public static NAME = "SelectRewardView";

        public m_apopUp: com_main.APopUp;
        public m_showList: eui.Group;
        public m_staticItem: com_main.ComItemNew;
        public m_itemBack: eui.Group;
        public m_selectItemList: eui.Group;
        public m_lbSelectNum: eui.Label;
        public m_btnSure: com_main.ComButton;

        public m_selectList: number[];

        // private m_itemList: SelectRewardItem;
        private m_vo: AcNewGenVisVo;           //活动数据
        public constructor() {
            super();
            this.name = SelectRewardView.NAME;
            this.initApp("activity/newGeneral/SelectRewardSkin.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_vo = ActivityModel.getActivityVo<AcNewGenVisVo>(AcViewType.NEW_GEN_VIS);
            this.m_selectList = [];

            this.refreshView();
            this.initEvent();
        }

        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
        }

		/**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */

        private initEvent() {
            EventManager.addTouchScaleListener(this.m_btnSure, this, this.onClickSure);
            EventMgr.addEvent(ActivityEvent.ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this.closeView, this);

            for (let item of this.m_showList.$children) {
                EventManager.addTouchTapListener(item, this, this.oncliclItem);
            }
        }

        private removeEvent() {
            EventMgr.removeEventByObject(ActivityEvent.ACTIVITY_NEW_GENERAL_CHOOSE_REWARD, this);
            EventManager.removeEventListeners(this);
        }
        /**=====================================================================================
        * 事件监听 end
        * =====================================================================================
        */

        private isSelect(id: number) {
            let list = this.m_vo.getChooseList();
            for (let info of list) {
                if (info.itemId == id) {
                    return true;
                }
            }
            return false;
        }

        private refreshView() {

            this.m_apopUp.setTitleLabel('选择奖励');
            this.m_btnSure.setTitleLabel('确定');
            this.m_showList.removeChildren();

            let cfg = this.m_vo.getNewGenRewordCfg();
            for (let item of cfg.optionalReward) {
                let itemView = new SelectRewardItem(item, this.isSelect(item.itemId));
                this.m_showList.addChild(itemView);
            }

            //固定物品
            for (let itemInfo of cfg.requiredRward) {
                this.m_staticItem.setItemInfo(itemInfo.itemId, itemInfo.count);
            }

            this.m_selectItemList.removeChildren();

            //之前选择
            let list = this.m_vo.getChooseList();
            for (let itemInfo of list) {
                this.addItem(itemInfo);
            }
        }

        public oncliclItem(e: egret.TouchEvent) {
            let target = e.target;
            let i = 0;
            while (isNull(target.getRewardItemInfo) && i < 10) {
                target = target.parent;
                i++;
            }

            let itemInfo: IItemInfo = target.getRewardItemInfo()
            let itemId = itemInfo.itemId;
            if (this.m_selectList.indexOf(itemId) != -1) {
                target.setSel(false);
                this.removeItemById(itemId);
            } else {
                if (this.m_selectList.length >= 4) return;
                target.setSel(true);
                this.addItem(itemInfo)
            }

        }

        public removeShowItem(itemId: number) {
            for (let i of this.m_selectItemList.$children) {
                let item = i as ComItemNew;
                if (itemId ==  item.itemId) {
                    Utils.removeFromParent(item);
                }
            }
        }

        public addItem(item: IItemInfo) {
            let itemId = item.itemId;
            this.m_selectList.push(itemId);
            let cell = ComItemNew.create('count', true);
            cell.setItemInfo(item.itemId, item.count);
            this.m_selectItemList.addChild(cell);
            this.refreshNumLb();
        }

        public removeItemById(itemId: number) {
            let i = this.m_selectList.indexOf(itemId);
            this.m_selectList.splice(i, 1);
            this.removeShowItem(itemId);
            this.refreshNumLb()
        }

        public refreshNumLb() {
            this.m_lbSelectNum.text = '已选择奖励' + this.m_selectList.length + '/4';
        }

        private onClickSure() {
            if (this.m_selectList.length != 4) {
                EffectUtils.showTips('请选择4个物品', 1, true);
            } else {
                ActivityProxy.send_C2S_ACTIVITY_NEW_GENERAL_CHOOSE_REWARD(this.m_vo.id, this.m_selectList);
            }
        }

        private closeView() {
            UpManager.history();
        }

    }
}