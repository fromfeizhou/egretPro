module com_main {
	/**
	 * 联盟捐献
	 */
    export class LegionDonationView extends CView {
        public static NAME = 'LegionDonationView';

        public m_pViewRoot: eui.Group;
        public m_labScore: eui.Label;
        public m_pTeachList: eui.List;

        private m_tCollects: eui.ArrayCollection;

        public constructor(size: ISize) {
            super();
            NodeUtils.setSize(this, size);
            this.name = LegionDonationView.NAME;
            this.initApp('legion/tabView/LegionDonationViewSkin.exml');
        }

        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }

        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_tCollects = new eui.ArrayCollection();
            this.m_pTeachList.dataProvider = this.m_tCollects;
            this.m_pTeachList.itemRenderer = LegionDonationCell;
            this.initTechList();

            this.onRoleResource();
            this.addEvent();
            Utils.toStageBestScale(this.m_pViewRoot);
        }

        /**科技节点 */
        private initTechList() {
            let list = LegionModel.getTechInfo();//军团科技信息
            let res: ILegionDonaData[] = [];
            for (let key in list) {
                let vo = list[key];
                if (unNull(vo)) {
                    res.push({ type: vo.type, name: vo.name, level: vo.level, des: vo.des, source: vo.cfg.icon })
                }
            }
            this.m_tCollects.replaceAll(res);
        }


        /**=====================================================================================
          * 事件监听 begin
          * =====================================================================================
          */
        private addEvent() {
            EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
            EventMgr.addEvent(LegionEvent.LEGION_TECH_UPDATE, this.onTechUpdate, this);

            this.m_pTeachList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTechHandler, this);
        }

        private removeEvent() {
            EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            EventMgr.removeEventByObject(LegionEvent.LEGION_TECH_UPDATE, this);
            this.m_pTeachList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.onTechHandler, this);
        }

        /**科技点击 */
        private onTechHandler(e: eui.ItemTapEvent) {
            let data = e.item as ILegionDonaData;
            if (data.level < LegionModel.TECH_LEVEL_MAX) {
                Utils.open_view(TASK_UI.LEGION_TECH_WND, { type: data.type });
            } else {
                EffectUtils.showTips(GCode(CLEnum.GUILD_TECH_MAX), 1, true);
            }
        }

        /**资源刷新 */
        private onRoleResource(sourceId: PropEnum = PropEnum.GUILD_POINT) {
            if (sourceId != PropEnum.GUILD_POINT) return;
            this.m_labScore.text = RoleData.GetMaterialNumById(sourceId).toString();
        }

        /**科技更新 */
        private onTechUpdate(type: number) {
            for (let i = 0; i < this.m_tCollects.source.length; i++) {
                let data = this.m_tCollects.getItemAt(i) as ILegionDonaData;
                if (type == data.type) {
                    let vo = LegionModel.getTeachVoByType(type);
                    if (!vo) return;
                    data.level = vo.level;
                    data.des = vo.des;
                    this.m_tCollects.replaceItemAt(data, i);
                    break;
                }
            }
        }

        /**=====================================================================================
          * 事件监听 end
          * =====================================================================================
          */
    }

    interface ILegionDonaData {
        type: number,
        level: number,
        name: string,
        des: string,
        source: string,
    }

    class LegionDonationCell extends eui.ItemRenderer {
        public m_pIconRoot: eui.Group;
        public m_imgIcon: com_main.CImage;
        public m_labName: eui.Label;
        public m_labLevel: eui.Label;
        public m_labDes: eui.Label;

        private cell: LegionDonationItem;
        private m_tData: ILegionDonaData;

        public constructor() {
            super();
            this.touchChildren = false;
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.cell = new LegionDonationItem();
            this.addChild(this.cell);
            this.cacheAsBitmap = true;
        }


        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected dataChanged(): void {
            this.m_tData = this.data;
            this.cell.shoWInfo(this.m_tData.name, this.m_tData.level, this.m_tData.des, this.m_tData.source);
        }

    }

}