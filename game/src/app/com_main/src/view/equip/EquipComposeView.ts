module com_main {
    export class EquipComposeView extends CView {
        public static NAME = 'EquipComposeView';

        public m_equipInfo: com_main.EquipInfoItem;
        public m_btnAll: com_main.ComButton;
        public m_btnCompose: com_main.ComButton;
        public m_listEquip: eui.List;
        public m_pEffRoot: eui.Group;

        private m_pCollection: eui.ArrayCollection;   //列表数据
        private m_nCurIndex: number;     //当前选中
        private m_reward: any;	//奖励串

        public constructor(width: number, height: number) {
            super();
            this.name = EquipComposeView.NAME;
            this.initApp("equip/EquipComposeViewSkin.exml");
            this.width = width;
            this.height = height;
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_EQUIPMENT_COMPOSE,
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_EQUIPMENT_COMPOSE: {
                    if (body.errorCode > 0) {
                        EffectUtils.showTips(GCode(CLEnum.EQUIP_HC_SUC), 1);
                        this.setEff();
                        this.m_reward = body.valuesMessageSet.rewardMessage;
                        //延迟打开
                        Utils.TimerManager.doTimer(400, 1, this.showView, this);
                    }
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

        protected childrenCreated(): void {
            this.m_btnCompose.setTitleLabel(GCode(CLEnum.EQUIP_HC));
            this.m_btnAll.setTitleLabel(GCode(CLEnum.EQUIP_HC_ALL));

            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listEquip.dataProvider = this.m_pCollection;
            this.m_listEquip.itemRenderer = EquipCompRender;
            this.m_listEquip.useVirtualLayout = true;
            this.m_listEquip.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickEquip, this);
            //自动适配 动态宽度
            egret.callLater(() => {
                if (this.m_listEquip) {
                    Utils.tileGroupToCenter(this.m_listEquip, 100);
                }
            }, this);
            let res = [];
            let list = PropModel.getPropItemListByType(PropMainType.EQUIP_SOUL);
            for (let i = 0; i < list.length; i++) {
                let info = list[i];
                let count = PropModel.getPropNum(info.itemId);
                let equipCfg = C.EquipmentS2EConfig[info.itemId];
                let data: IEqCompRD = { id: info.itemId, sel: false, count: count, max: equipCfg.fragmentCount };
                res.push(data);
            }
            res.sort((a: IEqCompRD, b: IEqCompRD) => {
                let stateA = a.count >= a.max;
                let stateB = b.count >= b.max;
                if (stateA != stateB) {
                    return stateA ? -1 : 1;
                }
                let qualityA = C.ItemConfig[a.id].quality;
                let qualityB = C.ItemConfig[b.id].quality;
                return qualityB - qualityA;
            });
            this.m_pCollection.replaceAll(res);

            this.setSelectedIndex(0, true);

            this.addEvent();
        }

        /**点击回调 */
        private onClickEquip(e: any) {
            this.setSelectedIndex(e.itemIndex);
        }

        /**监听事件 */
        private addEvent() {
            EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onItemChange, this);

            EventManager.addTouchScaleListener(this.m_btnCompose, this, this.onBtnCompose);
            EventManager.addTouchScaleListener(this.m_btnAll, this, this.onBtnAll);
        }
        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
        }

        /**合成 */
        private onBtnCompose() {
            if (this.m_pCollection.source.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_HC_FAL), 1, true);
                return;
            }
            let data = this.m_pCollection.getItemAt(this.m_nCurIndex) as IEqCompRD;
            if (data) {
                let equipCfg = C.EquipmentS2EConfig[data.id];
                if (equipCfg) {
                    if (PropModel.isItemEnough(data.id, equipCfg.fragmentCount, 3)) {
                        EquipProxy.C2S_EQUIPMENT_COMPOSE(data.id);
                    }
                }
            }
        }

        /**一键合成 */
        private onBtnAll() {
            if (this.m_pCollection.source.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_HC_FAL), 1, true);
                return;
            }
            let comparse = [];
            for (let i = 0; i < this.m_pCollection.source.length; i++) {
                let data = this.m_pCollection.getItemAt(i) as IEqCompRD;
                let equipCfg = C.EquipmentS2EConfig[data.id];
                if (PropModel.getPropNum(data.id) >= equipCfg.fragmentCount) {
                    comparse.push(data.id);
                }
            }
            if (comparse.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_HC_FAL), 1, true);
                return;
            }
            EquipProxy.C2S_EQUIPMENT_COMPOSE(0);
        }

        /**装备碎片更新 */
        private onItemChange(itemId: number) {
            let cfg = C.ItemConfig[itemId];
            if (cfg.mainType != PropMainType.EQUIP_SOUL) return;
            let num = PropModel.getPropNum(itemId);
            let isdel = num == 0;
            for (let i = 0; i < this.m_pCollection.source.length; i++) {
                let data = this.m_pCollection.getItemAt(i) as IEqCompRD;
                if (data.id == itemId) {
                    if (isdel) {
                        this.m_pCollection.removeItemAt(i);
                        this.setSelectedIndex(0, true);
                    } else {
                        data.count = PropModel.getPropNum(data.id);
                        this.m_pCollection.replaceItemAt(data, i)
                    }
                    return;
                }
            }

            //增加（合成装备 不可能增加 不写）
        }

        /**
         * 设置当前选中
         * @param isConst 强制刷新
         *  */
        private setSelectedIndex(index: number, isConst: boolean = false) {
            if (!isConst && this.m_nCurIndex == index) return;
            this.refrestSelItem(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.refrestSelItem(this.m_nCurIndex, true);

            let data = this.m_pCollection.getItemAt(this.m_nCurIndex) as IEqCompRD;
            //没有装备 不显示信息
            if (!data) {
                this.refreshEquipInfo(0);
            } else {
                let equipCfg = C.EquipmentS2EConfig[data.id];
                this.refreshEquipInfo(equipCfg.id);
            }
        }

        /**刷新选中装备 */
        private refrestSelItem(index: number, val: boolean) {
            let data = this.m_pCollection.getItemAt(index) as IEqCompRD;
            if (data) {
                data.sel = val;
                this.m_pCollection.replaceItemAt(data, index);
            }
        }
        /**刷新装备信息 */
        private refreshEquipInfo(equipId: number) {
            this.m_equipInfo.itemId = equipId;
        }

        /**延迟打开合成成功弹通用奖励界面 */
        private showView() {
            let rewardMessage = [];
            for (let i in this.m_reward) {
                if (this.m_reward[i].count > 0) {
                    rewardMessage.push(this.m_reward[i]);
                }
            }
            Utils.open_view(TASK_UI.GET_REWARD_VIEW, rewardMessage);
            Utils.TimerManager.remove(this.showView, this);
        }
        /**装备合成特效 */
        private setEff() {
            let effect = NormalMcMgr.createMc(IETypes.EUI_EqUpGradeEff, false);
            effect.playOnceDone(IETypes.EUI_EqUpGradeEff, () => {
                NormalMcMgr.removeMc(effect);
            }, this);

            effect.x = 50;
            effect.y = 50;
            this.m_pEffRoot.addChild(effect);
        }
    }

    interface IEqCompRD {
        id: number,
        sel: boolean,
        count: number;
        max: number;
    }
    /**
    * 碎片Item
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    class EquipCompRender extends eui.ItemRenderer {
        protected m_equipItem: EquipSoulItem;
        protected m_imgSelected: eui.Image;
        protected m_imgState: eui.Image;


        protected m_tData: IEqCompRD;
        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_equipItem = new EquipSoulItem();
            this.addChild(this.m_equipItem);

            this.m_imgState = new eui.Image('common_red_flag2_png')
            this.m_imgState.x = 62;
            this.m_imgState.y = -2;
            this.addChild(this.m_imgState);
            this.m_imgState.visible = false;

            this.m_imgSelected = new eui.Image('SelectKuang_png')
            this.m_imgSelected.x = -13;
            this.m_imgSelected.y = -13;
            this.addChild(this.m_imgSelected);
            this.m_imgSelected.visible = false;

        }

        protected dataChanged() {
            this.m_tData = this.data;
            this.m_imgSelected.visible = this.m_tData.sel;
            let count = PropModel.getPropNum(this.m_tData.id);
            this.m_equipItem.setItemInfo(this.m_tData.id, this.m_tData.count, this.m_tData.max);
            this.m_imgState.visible = this.m_tData.count >= this.m_tData.max;

        }
    }
}