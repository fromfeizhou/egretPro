module com_main {
    /**黄巾入侵菜单 */
    export class WorldMenuBarAtk extends WorldMenuComponent {

        public m_pGInfo: eui.Group;
        public m_labCount: eui.Label;
        public m_pGHead: eui.Group;
        public m_pAward: eui.Group;
        public m_labfightNum: eui.BitmapLabel;

        private m_nId: number;   //黄巾事件id
        public constructor(id: number) {
            super();
            this.name = "WorldMenu";
            this.initApp("world/menu/WorldMenuBarAtkSkin.exml");
            this.cacheAsBitmap = true;
            this.m_nOrginY = 0;
            this.m_nId = id;
        }

        public removeFromParent() {
            Utils.removeFromParent(this);
        }

        public $onRemoveFromStage(): void {
            this.clearHeadItem();
            this.onDestroy();
            super.$onRemoveFromStage();
        }

        /////////////////////////////////////////////////////////////////协议号事件
        /**注册协议号事件 */
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_SYS_GENERAL_WIN_INFO,
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_SYS_GENERAL_WIN_INFO: {
                    this.refreshGeneralView(body);
                    break;
                }
                default:
                    break;
            }
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            let vo = ActivityModel.getActivityVo<AcBarAttackVo>(AcViewType.BARBARIANATTACK);
            if(!vo) return;
            let cityInfo = vo.cityDatas[this.m_nId];
            if(!cityInfo) return;
            this.m_labCount.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_ARMY_COU,cityInfo.armyCount));
            this.m_labfightNum.text = cityInfo.armyForce.toString();
            let items = Utils.parseCommonItemJsonInDrop([cityInfo.drop])
            let length = Math.min(items.length,5);
            for (let i = 0; i < length; i++) {
                let item = ComItemNew.create("count");
                item.setItemInfo(items[i].itemId, items[i].count);
                this.m_pAward.addChild(item);
            }
        }

        /**获得怪物内容 */
        protected onCreate(): void {
            let vo = ActivityModel.getActivityVo<AcBarAttackVo>(AcViewType.BARBARIANATTACK);
            if(!vo) return;
            let cityInfo = vo.cityDatas[this.m_nId];
            if(!cityInfo) return;
            //发送协议获得
            NormalProxy.C2S_SYS_GENERAL_WIN_INFO(cityInfo.npcId[0]);
        }


        /**刷新武将显示 */
        public refreshGeneralView(data: gameProto.S2C_SYS_GENERAL_WIN_INFO) {
            if (data) {
                for (let i = 0; i < data.generalWinInfo.length; i++) {
                    let tempData = data.generalWinInfo[i];
                    let item = GeneralHeadRender.create("arena_name");
                    item.setGenViewInfo(tempData.generalId, tempData.level, tempData.star, tempData.quality);
                    Utils.addChild(this.m_pGHead, item);
                }
            }
        }

        /**回收头像 */
        private clearHeadItem() {
            if (!this.m_pGHead) return;
            while (this.m_pGHead.numChildren > 0) {
                let item = this.m_pGHead.getChildAt(0) as GeneralHeadRender;
                item.onDestroy();
            }
        }

    }
}