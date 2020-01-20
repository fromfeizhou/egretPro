module com_main {
    export class EquipDeComposeView extends CView {
        public static NAME = 'EquipDeComposeView';

        public m_pNorRoot: eui.Group;
        public m_equipInfo: com_main.EquipInfoItem;
        public m_btnAll: com_main.ComButton;
        public m_btnDeCompose: com_main.ComButton;
        public m_pMultiRoot: eui.Group;
        public m_listAward: eui.List;
        public m_btnAllSure: com_main.ComButton;
        public m_btnCancle: com_main.ComButton;
        public m_listEquip: eui.List;

        private m_pCollection: eui.ArrayCollection;   //列表数据
        private m_pAwardColl: eui.ArrayCollection;   //获得奖励
        private m_nCurIndex: number;     //当前选中
        private m_nState: number;        //0 单选 1多选

        public constructor(width: number, height: number) {
            super();
            this.name = EquipDeComposeView.NAME;
            this.initApp("equip/EquipDeComposeViewSkin.exml");
            this.width = width;
            this.height = height;
        }

        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_EQUIPMENT_ADD,
                ProtoDef.S2C_EQUIPMENT_DEL
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_EQUIPMENT_ADD: {
                    let data = body as gameProto.IS2C_EQUIPMENT_ADD;
                    for (let i = 0; i < data.equipments.length; i++) {
                        let vo = EquipModel.getEquipVoByUId(data.equipments[i].uuid);
                        let rdData: IEIEqDeCompRD = { uid: vo.uuid, sel: false, multi: vo.itemCfg.level <= 50, mulstate: this.m_nState == 1 };
                        this.m_pCollection.addItem(rdData);
                        if (this.m_pCollection.source.length == 1) {
                            this.setSelectedIndex(0, true);
                        }
                        this.refreshMultiList();
                    }
                    break;
                }
                case ProtoDef.S2C_EQUIPMENT_DEL: {
                    let data = body as gameProto.IS2C_EQUIPMENT_DEL;
                    this.delItemByUids(data.equipmentUuid);
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
            this.m_btnDeCompose.setTitleLabel(GCode(CLEnum.RECOVER));
            this.m_btnAll.setTitleLabel(GCode(CLEnum.RECOVER_MUL));

            this.m_btnAllSure.setTitleLabel(GCode(CLEnum.GEN_DECOMOSE_SUR));
            this.m_btnCancle.setTitleLabel(GCode(CLEnum.CANCEL));

            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_listEquip.dataProvider = this.m_pCollection;
            this.m_listEquip.itemRenderer = EquipDeCompRender;
            this.m_listEquip.useVirtualLayout = true;
            this.m_listEquip.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickEquip, this);
            //自动适配 动态宽度
            egret.callLater(() => {
                if (this.m_listEquip) {
                    Utils.tileGroupToCenter(this.m_listEquip, 100);
                }
            }, this);

            this.setCurState(0, true);
            // this.initState();
            this.m_pAwardColl = new eui.ArrayCollection([]);
            this.m_listAward.dataProvider = this.m_pAwardColl;
            this.m_listAward.itemRenderer = DeCompRender;
            this.m_listEquip.useVirtualLayout = true;

            this.setSelectedIndex(0, true);
            this.validateNow();

            this.addEvent();
        }

        /**删除组件 */
        private delItemByUids(uuids: number[]) {
            let isDel = false;
            for (let i = this.m_pCollection.source.length - 1; i >= 0; i--) {
                let data = this.m_pCollection.getItemAt(i) as IEIEqDeCompRD;
                for (let k = 0; k < uuids.length; k++) {
                    if (data.uid == (uuids[k])) {
                        isDel = true;
                        this.m_pCollection.removeItemAt(i);
                    }
                }

            }
            if (!isDel) return;
            this.setSelectedIndex(0, true);
            this.refreshMultiList();
        }

        /**点击回调 */
        private onClickEquip(e: any) {
            if (this.m_nState == 0) {
                this.setSelectedIndex(e.itemIndex);
            } else {
                this.setMultiIndex(e.itemIndex);
            }
        }

        /**监听事件 */
        private addEvent() {
            EventManager.addTouchScaleListener(this.m_btnDeCompose, this, this.onBtnDeCompose);
            EventManager.addTouchScaleListener(this.m_btnAll, this, this.onBtnAll);

            EventManager.addTouchScaleListener(this.m_btnAllSure, this, this.onBtnAllSure);
            EventManager.addTouchScaleListener(this.m_btnCancle, this, this.onBtnCancel);

            EventMgr.addEvent(EquipEvent.EQUIP_DECOMPOSE_ADD, this.onEquipDecomposeAdd, this);
            EventMgr.addEvent(EquipEvent.EQUIP_DECOMPOSE_DEL, this.onEquipDecomposeDel, this);
            EventMgr.addEvent(EquipEvent.EQUIP_DECOMPOSE_ALL_TICK, this.onSetRecycle, this);
            EventMgr.addEvent(EquipEvent.EQUIP_DECOMPOSE_ONE_TICK, this.onEquipOneRecycle, this);
        }

        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(EquipEvent.EQUIP_DECOMPOSE_ADD, this);
            EventMgr.removeEventByObject(EquipEvent.EQUIP_DECOMPOSE_DEL, this);
            EventMgr.removeEventByObject(EquipEvent.EQUIP_DECOMPOSE_ALL_TICK, this);
            EventMgr.removeEventByObject(EquipEvent.EQUIP_DECOMPOSE_ONE_TICK, this);
        }

        /**添加装备 */
        private onEquipDecomposeAdd(vo: EquipVo) {
            let rdData: IEIEqDeCompRD = { uid: vo.uuid, sel: false, multi: vo.itemCfg.level <= 50, mulstate: this.m_nState == 1 };
            this.m_pCollection.addItem(rdData);
            if (this.m_pCollection.source.length == 1) {
                this.setSelectedIndex(0, true);
            }
            this.refreshMultiList();
        }

        /**移除装备 */
        private onEquipDecomposeDel(uuid: number) {
            this.delItemByUids([uuid]);
        }

        /**分解 */
        private onBtnDeCompose() {
            if (this.m_pCollection.source.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_ZB_SH_FAL), 1, true);
                return;
            }
            let data = this.m_pCollection.getItemAt(this.m_nCurIndex) as IEIEqDeCompRD;
            if (!data) return;
            let vo = EquipModel.getEquipVoByUId(data.uid);
            if (vo) {
                EquipModel.m_tItems = vo.getDecomposeItems();  //保存回收可获得物品
                if (vo.quality >= 3) {
                    let view = new EqDeCompSureWnd(GCode(CLEnum.EQUIP_ZB_SH_TIPS),
                        vo.getDecomposeItems(), () => {
                            //发送回收协议
                            EquipProxy.C2S_EQUIPMENT_DECOMPOSE([vo.uuid]);
                        }, this);
                    com_main.UpManager.popSmallView(view, null, false, 0.8);
                } else {
                    EquipProxy.C2S_EQUIPMENT_DECOMPOSE([vo.uuid]);
                }
            }
        }
        /**批量回收 */
        private onBtnAll() {
            this.setCurState(1);
            Utils.open_view(TASK_UI.POP_EQUIP_RECYCLE);
        }

        /**批量回收 确认 */
        private onBtnAllSure() {
            let res: number[] = [];
            let arr: any[] = [];
            let isTips = false;
            for (let i = 0; i < this.m_pCollection.source.length; i++) {
                let data = this.m_pCollection.getItemAt(i) as IEIEqDeCompRD;
                if (data.multi) {
                    let vo = EquipModel.getEquipVoByUId(data.uid);
                    if (!vo) continue;
                    if (vo.quality >= 3) isTips = true;
                    res.push(data.uid);
                    arr.push(vo.getDecomposeItems());
                }
            }
            if (res.length == 0) {
                EffectUtils.showTips(GCode(CLEnum.EQUIP_ZB_SH_FAL), 1, true);
                return;
            }
            EquipModel.m_tItems = this.ongetCount(arr);
            if (isTips) {
                Utils.showConfirmPop(GCode(CLEnum.EQUIP_ZB_SH_TIPS1), () => {

                    EquipProxy.C2S_EQUIPMENT_DECOMPOSE(res);
                }, this);
            } else {
                EquipProxy.C2S_EQUIPMENT_DECOMPOSE(res);
            }
        }

        /**批量回收处理 */
        private ongetCount(arr: IItemInfo[]) {
            let tempArray = arr.slice(0);//复制数组到临时数组
            let itemArr: any[] = [];
            let num: number = 0;
            for (let i = 0; i < tempArray.length; i++) {
                itemArr.push(tempArray[i][0]);
            }
            return itemArr;
        }

        /**批量回收 取消*/
        private onBtnCancel() {
            this.setCurState(0);
            EquipModel.lvList = [];
        }
        //初始选中档次设置
        private initState() {
            let res = [];
            let list = EquipModel.getCanRemoveEquips();
            for (let i = 0; i < list.length; i++) {
                let vo = list[i];

                let index = EquipModel.lvList.indexOf(vo.itemCfg.level);
                let data: IEIEqDeCompRD = { uid: vo.uuid, sel: this.m_nState == 1, multi: vo.itemCfg.level <= 50, mulstate: this.m_nState == 1 };
                res.push(data);
            }
            this.m_pCollection.replaceAll(res);

        }
        /**
         * 档次设置
         * issur是否确定
         * allState是否全选
         * */
        private onSetRecycle(param: { isSur: Boolean, allState: Boolean }) {
            if (!param.isSur) {//没确定默认选中
                this.initState();
                this.refreshMultiList();
                EquipModel.lvList = [];
                return;
            }
            if (param.allState) {
                this.onEquipAllRecycle();
            } else {
                this.onEquipOneRecycle();
            }
            this.refreshMultiList();
        }
        //全选
        private onEquipAllRecycle() {
            let res = [];
            let list = EquipModel.getCanRemoveEquips();
            for (let i = 0; i < list.length; i++) {
                let vo = list[i];
                let data: IEIEqDeCompRD = { uid: vo.uuid, sel: false, multi: vo.itemCfg.level <= 100, mulstate: this.m_nState == 1 };
                res.push(data);
            }
            this.m_pCollection.replaceAll(res);
        }
        //点击选中
        private onEquipOneRecycle() {
            let res = [];
            let state: boolean;
            let list = EquipModel.getCanRemoveEquips();
            for (let i = 0; i < list.length; i++) {
                let vo = list[i];
                if (EquipModel.lvList.indexOf(vo.itemCfg.level) != -1) {
                    state = true;
                } else {
                    state = false;
                }
                let data: IEIEqDeCompRD = { uid: vo.uuid, sel: false, multi: state, mulstate: this.m_nState == 1 };
                res.push(data);
            }
            this.m_pCollection.replaceAll(res);
            this.refreshMultiList();

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

            let data = this.m_pCollection.getItemAt(this.m_nCurIndex) as IEIEqDeCompRD;
            //没有装备 不显示信息
            if (!data) {
                this.m_equipInfo.itemId = 0;
                return;
            }
            let vo = EquipModel.getEquipVoByUId(data.uid);
            this.m_equipInfo.itemId = vo.equipmentId;
        }

        /**
         * 设置当前选中
         * @param isConst 强制刷新
         *  */
        private setMultiIndex(index: number) {
            let data = this.m_pCollection.getItemAt(index) as IEIEqDeCompRD;
            data.multi = !data.multi;
            this.m_pCollection.replaceItemAt(data, index);
            this.refreshMultiList();
        }


        /**刷新选中装备 */
        private refrestSelItem(index: number, val: boolean) {
            let data = this.m_pCollection.getItemAt(index) as IEIEqDeCompRD;
            if (data) {
                data.sel = val;
                this.m_pCollection.replaceItemAt(data, index);
            }
        }

        /**
        * 设置当前选中
        * @param isConst 强制刷新
        *  */
        private setCurState(state: number, isConst: boolean = false) {
            if (!isConst && this.m_nState == state) return;
            this.m_nState = state;
            let norVis = state == 0;
            this.m_pNorRoot.visible = norVis;
            this.m_pMultiRoot.visible = !norVis;

            // for (let i = 0; i < this.m_pCollection.source.length; i++) {
            //     let data = this.m_pCollection.getItemAt(i) as IEIEqDeCompRD;
            //     data.mulstate = this.m_nState == 1;
            //     this.m_pCollection.replaceItemAt(data, i);
            // }
            this.initState();
            this.setSelectedIndex(0, true);
            if (!norVis) this.refreshMultiList();
        }

        /**刷新批量回收 */
        private refreshMultiList() {
            let res: IDeCompRdData[] = [];
            for (let i = 0; i < this.m_pCollection.source.length; i++) {
                let data = this.m_pCollection.getItemAt(i) as IEIEqDeCompRD;
                if (data.multi) {
                    let vo = EquipModel.getEquipVoByUId(data.uid);
                    if (!vo) continue;
                    let list = vo.getDecomposeItems();
                    for (let k = 0; k < list.length; k++) {
                        res.push({ id: list[k].itemId, count: list[k].count });
                    }
                }
            }
            this.m_pAwardColl.replaceAll(res);
        }

    }

    interface IEIEqDeCompRD {
        uid: number,
        sel: boolean,
        multi: boolean,
        mulstate: boolean,
    }
    /**
    * 碎片Item
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    class EquipDeCompRender extends eui.ItemRenderer {
        protected m_equipItem: EquipItem;
        protected m_imgSelected: eui.Image;
        protected m_imgMulti: eui.Image;
        protected m_norRoot: egret.DisplayObjectContainer;
        protected m_multiRoot: egret.DisplayObjectContainer;

        protected m_tData: IEIEqDeCompRD;
        public constructor() {
            super();
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }


        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_equipItem = new EquipItem('equip');
            this.addChild(this.m_equipItem);

            this.m_norRoot = new egret.DisplayObjectContainer();
            this.m_multiRoot = new egret.DisplayObjectContainer();
            this.addChild(this.m_norRoot);
            this.addChild(this.m_multiRoot);

            this.m_imgSelected = new eui.Image('SelectKuang_png')
            this.m_imgSelected.x = -13;
            this.m_imgSelected.y = -13;
            this.m_norRoot.addChild(this.m_imgSelected);
            this.m_imgSelected.visible = false;

            this.m_imgMulti = new eui.Image();
            this.m_imgMulti.x = 69.5;
            this.m_imgMulti.y = -16.5;
            this.m_multiRoot.addChild(this.m_imgMulti);
        }

        protected dataChanged() {
            this.m_tData = this.data;
            this.m_imgSelected.visible = this.m_tData.sel;
            let vo = EquipModel.getEquipVoByUId(this.m_tData.uid);
            if (vo) {
                this.m_equipItem.setItemInfo(vo.equipmentId);
            }
            this.m_imgMulti.source = this.m_tData.multi ? 'common_y_png' : 'btn_031_up_png';
            this.m_norRoot.visible = !this.m_tData.mulstate;
            this.m_multiRoot.visible = this.m_tData.mulstate;
        }
    }

    export interface IDeCompRdData {
        id: number,
        count: number,
    }
    /**
    * 碎片Item
    * @class TeamHeroItem
    * @extends eui.ItemRenderer
    */
    export class DeCompRender extends eui.ItemRenderer {
        protected m_item: ComItemNew;
        protected m_tData: IDeCompRdData;
        public constructor() {
            super();
            this.width = 100;
            this.height = 100;
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_item = ComItemNew.create('count');
            this.addChild(this.m_item);
        }

        protected dataChanged() {
            this.m_tData = this.data;
            this.m_item.setItemInfo(this.m_tData.id, this.m_tData.count);
        }
    }
}