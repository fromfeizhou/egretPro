module com_main {
    export class TopSourceItem extends CComponent {
        public static NAME: string = "TopSourceItem";

        public m_groupBase: eui.Group;   //父节点
        public m_imgIcon: CImage;    //图标
        public m_labNum: eui.Label;  //数量

        private m_nItemId: number;     //资源id
        private m_nLastNumber: number;
        public constructor(id?: number) {
            super();
            this.name = TopSourceItem.NAME;
            this.m_nItemId = id || PropEnum.GOLD;
            this.skinName = Utils.getSkinName("app/top_new/TopSourceItemSkin.exml");
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            super.onDestroy();
            Tween.removeTweens(this.m_labNum);
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            EventManager.addTouchTapListener(this, this, this.onSourceHandler);
            this.refreshView();
        }

        /**获取资源id */
        public get itemId(): number {
            return this.m_nItemId;
        }

        /**刷新显示 */
        public refreshView() {
            this.refreshIcon();
            this.refreshNum(false);
        }

        /**刷新数量 */
        public refreshNum(isAction: boolean = true) {
            if (isAction) {
                CommonUtils.NumberActionTo(this.m_labNum, CommonUtils.OutlenToNum(this.m_labNum.text), PropModel.getPropNum(this.m_nItemId), 1000, true);
                if (this.m_nLastNumber) {
                    this.showResChange(PropModel.getPropNum(this.m_nItemId) - this.m_nLastNumber);
                }
            } else {
                CommonUtils.labelIsOverLenght(this.m_labNum, PropModel.getPropNum(this.m_nItemId));
            }
            this.m_nLastNumber = PropModel.getPropNum(this.m_nItemId);
        }

        /**获得资源图标 (采集使用) */
        public get sourceIcon() {
            return this.m_imgIcon;
        }

        /**播放资源动画 （采集使用） */
        public showIconAction() {
            let anim = IETypes.EUI_SilverAdd;
            let x = -105;
            let y = -40;
            if (this.m_nItemId == PropEnum.FOOD) {
                anim = IETypes.EUI_FoodAdd;
                x = -105;
            }
            let effect = ImageEffect.load(anim);
            effect.x = x;
            effect.y = y;
            Utils.addChild(this, effect);
            ImageEffect.runAction(effect, () => {
                ImageEffect.stopAction(effect);
                ImageEffect.removeAction(effect);
                effect = null;
            }, this);

        }

        /**资源点击回调 */
        private onSourceHandler() {
            // this.showIconAction();
            switch (this.m_nItemId) {
                case PropEnum.GOLD:
                    Utils.open_view(TASK_UI.POP_PAY_SHOP_VIEW);
                    break;
                case PropEnum.YU://勾玉
                    Utils.open_view(TASK_UI.POP_PAY_SHOP_YU_VIEW);
                    break;
                case PropEnum.GUILD_POINT://联盟
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.PVP_MEDAL://竞技
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.CONQUER://过关斩将
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.BOSSSCORE:
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.MILITARY_EXPLOIT:
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.ZML://招募令
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.MILITARY_MERITS_CONSUMED://军功
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                case PropEnum.HONOR://荣誉
                    Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, this.m_nItemId);
                    break;
                default:
                    QuickBuyProxy.C2S_GET_QUCKLY_SHOP_BUY_GOODS_OPENVIEW(this.m_nItemId);
                    break;
            }
        }
        /**刷新图标 */
        private refreshIcon() {
            let iconName = RoleData.GetMaterialIconPathById(this.m_nItemId);
            if (iconName == '') iconName = PropModel.getPropIcon(this.m_nItemId);
            this.m_imgIcon.source = iconName;
        }

        /**资源变化，添加显示 */
        private showResChange(change: number) {
            let str = "";
            if (change < 0) {
                str = "" + change;
            } else if (change > 0) {
                return;
            } else {
                return;
            }
            let label = new eui.Label(str);
            this.addChild(label);
            label.size = 24;
            label.textColor = 0xFF0000;
            label.strokeColor = 0xFF0000;
            label.stroke = 1;
            label.x = 44.82;
            label.y = 31.52;
            egret.Tween.get(label).wait(500).to({ alpha: 0, y: label.y - 30 }, 800);
        }


    }
}