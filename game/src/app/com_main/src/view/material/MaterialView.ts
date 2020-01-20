module com_main {
    export class MaterialView extends CView {
        public static NAME = 'MaterialView';
        public m_listCard: eui.List;
        public m_labPro: eui.Label;
        public m_btnAdd: eui.Image;
        public m_labReset: eui.Label;

        private m_pCollection: eui.ArrayCollection;   //材料副本列表数据
        private m_nType: MaterialEnum;
        private m_maxCount: number;   //最大挑战扫荡次数

        private m_bInit: boolean;

        public constructor(type: MaterialEnum, width: number, height: number) {
            super();
            this.name = MaterialView.NAME;
            this.m_nType = type;
            this.width = width;
            this.height = height;
            this.initApp("material/MaterialViewSkin.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_MATERIAL_BUY,
                ProtoDef.S2C_MATERIAL_INFO,
                ProtoDef.S2C_MATERIAL_CHALLENGE
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            debug("Tavern:execute -------->protocol, body:", protocol, body)
            switch (protocol) {
                case ProtoDef.S2C_MATERIAL_BUY:
                case ProtoDef.S2C_MATERIAL_CHALLENGE:
                case ProtoDef.S2C_MATERIAL_INFO: {
                    this.refreshCount();
                    break;
                }
            }
        }
        $onRemoveFromStage(isclear = true): void {
            this.onDestroy();
            super.$onRemoveFromStage(isclear);
        }
        public onDestroy(): void {
            this.removeEvent();
            super.onDestroy();
        }
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnAdd, this, this.onbtnadd);
            EventMgr.addEvent(MaterialEvent.MATERIAL_INFO_UPDATE, this.updateInfo, this);
        }
        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(MaterialEvent.MATERIAL_INFO_UPDATE, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        /**初始化 */
        public initView() {
            if (this.m_bInit) return;
            this.m_bInit = true;

            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listCard.dataProvider = this.m_pCollection;
            this.m_listCard.itemRenderer = MaterialItemRender;
            this.m_listCard.useVirtualLayout = true;
            let dateStr = GCode(CLEnum.MAT_TIPS_RESET);
            this.m_labReset.textFlow = Utils.htmlParser(dateStr);
            egret.callLater(() => {
                if (this.m_listCard) {
                    Utils.tileGroupToCenter(this.m_listCard, 370);
                }
            }, this);
            this.initpanel();

            this.addEvent();
            this.m_btnAdd.visible = !platform.isHidePayFunc();
        }

        public updateInfo() {
            this.refreshCount();
        }
        /**初始化boss列表 */
        private initpanel() {
            let bossArr: MaterialItemRD[] = [];
            let list = MaterialModel.getMaterialCfgByType(this.m_nType);
            for (let i = 0; i < list.length; i++) {
                let vo = list[i];
                let data: MaterialItemRD = { id: vo.id, type: vo.type, level: vo.playerLevel };
                bossArr.push(data);
            }
            bossArr.sort((a, b) => {
                let aFight = (RoleData.level >= a.level) && MaterialModel.ifMaterialpass(a.id);
                let bFight = RoleData.level >= b.level && MaterialModel.ifMaterialpass(b.id);

                if (aFight != bFight) {
                    return aFight ? -1 : 1;
                } else {
                    //都是可以挑战的副本 未通过放前面
                    let aPass = MaterialModel.ifMateialPass(a.id);
                    let bPass = MaterialModel.ifMateialPass(b.id);
                    if (aPass != bPass) return aPass ? 1 : -1;
                    //都通关
                    if(aPass){
                        return b.id - a.id;
                    }
                }
                return a.id - b.id;
            });
            this.m_pCollection.replaceAll(bossArr);
            this.refreshCount();
        }

        /**刷新列表数据 */
        private reflashitem(info: gameProto.IS2C_MATERIAL_CHALLENGE) {
            for (let i = 0; i < this.m_pCollection.source.length; i++) {
                let data: MaterialItemRD = this.m_pCollection.source[i];
                if (data.type == info.type) {
                    this.m_pCollection.replaceItemAt(data, i);
                }
            }
        }
        /**刷新挑战次数 */
        private refreshCount() {
            let cfg = C.MaterialTypeConfig[this.m_nType];

            this.m_maxCount = cfg.freeCount;
            let data = MaterialModel.getMaterialItemInfo(this.m_nType);
            if (data) {
                this.m_maxCount += data.bought;
            }

            let m_currNum = MaterialModel.getCurrCount(this.m_nType);
            this.m_labPro.text = m_currNum + "/" + this.m_maxCount;
        }
        /**增加挑战次数 */
        private onbtnadd() {
            MaterialModel.showMaterialBuyWnd(this.m_nType);
        }
    }
    export interface MaterialItemRD {
        id: number,
        type: number,
        level: number,
    }
    /**
   * MaterialItem
   * @class 
   * @extends eui.ItemRenderer
   */
    export class MaterialItemRender extends eui.ItemRenderer {
        protected m_materialItem: MaterialItem;
        protected m_imgSelected: eui.Image;

        protected m_tData: MaterialItemRD;
        private m_nType: number;     //面板类型
        public constructor() {
            super();
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }
        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_materialItem = new MaterialItem();
            this.addChild(this.m_materialItem);
        }
        protected dataChanged() {
            this.m_tData = this.data;
            if (this.m_nType != this.m_tData.type) {
                this.m_nType = this.m_tData.type;
            }
            this.m_materialItem.setItemInfo(this.m_nType, this.m_tData.id);
        }
    }
}