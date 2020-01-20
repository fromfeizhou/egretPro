module com_main {
	/**
	 * 更换形象
	 */
    export class RoleReplaceImgView extends CView {
        public static NAME = 'RoleReplaceImgView';

        public m_PopUp: com_main.APopUp;
        public m_btnSure: com_main.ComButton;
        public m_List: eui.List;
        private m_pCollection: eui.ArrayCollection;   //数据
        private m_nCurIndex: number;     //当前选中对象下标
        private m_genHaveid: number;   //选中已拥有的武将id 
        private m_genHaveType: number;   //选中已拥用头像类型
        public constructor() {
            super();
            this.name = RoleReplaceImgView.NAME;
            this.skinName = Utils.getAppSkin("role/role_replace_img.exml");


        }
        public onDestroy(): void {
            super.onDestroy();
            this.removeEvent();
        }
        /**监听事件 */
        private addEvent() {
            EventManager.addTouchTapListener(this.m_btnSure, this, this.onChangeImg);
            EventMgr.addEvent(RoleEvent.ROLE_HEADIMG, this.onRefreshImg, this);

        }

        /**移除事件 */
        private removeEvent() {
            EventMgr.removeEventByObject(RoleEvent.ROLE_HEADIMG, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_btnSure.setTitleLabel(GCode(CLEnum.SURE));
            this.m_PopUp.setTitleLabel(GCode(CLEnum.LOGIN_CH_IMG));

            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_List.dataProvider = this.m_pCollection;
            this.m_List.itemRenderer = RoleImgRender;
            this.m_List.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickGenHead, this);
            this.m_List.useVirtualLayout = true;

            this.addEvent();
            this.initPanel();

        }
        /**初始化列表 */
        private initPanel() {
            let heroList = [];
            let curIndex = 0;
            let heroCfg: GeneralConfig[] = GeneralModel.getGeneralConfig();
            let len = GeneralModel.ownGenerals.datum.length;

            for (let i: number = 0; i < len; i++) {
                let data = GeneralModel.ownGenerals.datum[i] as GeneralVo;
                let vo = heroCfg[data.generalId];
                let isHave = GeneralModel.getOwnGeneral(vo.itemId) == null ? true : false;
                let roleVo: IRoleItemRD = { id: vo.id, headType: 1, isHave: data.own, sel: false };
                heroList.push(roleVo);
            }

            heroList.sort(this.checkSort);
            for (let j = 0; j < heroList.length; j++) {
                if (RoleData.headId == heroList[j].id) {
                    curIndex = j;
                }
            }
            this.m_pCollection.replaceAll(heroList);
            this.setCurSelected(curIndex);
        }
        /**排序 */
        private checkSort(a: IRoleItemRD, b: IRoleItemRD) {
            let ca = a.isHave == true ? 0 : 1;
            let cb = b.isHave == true ? 0 : 1;
            if (ca < cb) {  //按是否拥有武将顺序
                return -1;
            } else if (ca > cb) {
                return 1;
            }
            if (a.id < b.id) {//按id顺序
                return -1;
            } else if (a.id > b.id) {
                return 1;
            } else {
                return 0;
            }
        }
        /**更换形象 */
        private onChangeImg() {
            LoginProxy.C2S_PLAYER_SETTING(this.m_genHaveid,this.m_genHaveType);
        }
        /**刷新形象 */
        private onRefreshImg() {
            // for (let i = 0; i < this.m_pCollection.source.length; i++) {
            //     let info: IRoleItemRD = this.m_pCollection.getItemAt(i);
            //     this.m_pCollection.replaceItemAt(info, i);
            // }
            // this.refrestSelItem(this.m_nCurIndex, true);
            UpManager.history();
        }
        /**点击头像回调 */
        private onClickGenHead(e: any) {
            this.setCurSelected(e.itemIndex);
            let data = this.m_pCollection.getItemAt(e.itemIndex) as IRoleItemRD;
            let cfg = C.GeneralConfig[data.id];
            if (!data.isHave) {
                Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, cfg.itemId);
            }
        }
        /**设置当前选中武将下标 */
        private setCurSelected(index: number) {
            if (this.m_nCurIndex == index) return;
            let data = this.m_pCollection.getItemAt(index) as IRoleItemRD;
            if (!data.isHave) {
                return;
            }
            this.m_genHaveid = data.id;
            this.m_genHaveType=data.headType;
            this.refrestSelItem(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.refrestSelItem(this.m_nCurIndex, true);
        }
        /**刷新选中武将 */
        private refrestSelItem(index: number, val: boolean) {

            let data = this.m_pCollection.getItemAt(index) as IRoleItemRD;
            if (data) {
                data.sel = val;
                this.m_pCollection.replaceItemAt(data, index);
            }
        }

    }
    export interface IRoleItemRD {
        id: number,
        headType: number,  //头像类型
        isHave: boolean,  //是否拥有
        sel: boolean,     //是否打开来源
    }
    /**
* @class 
* @extends eui.ItemRenderer
*/
    export class RoleImgRender extends eui.ItemRenderer {
        protected m_imgItem: RoleReplaceItem;
        protected m_imgSelected: eui.Image;

        protected m_tData: IRoleItemRD;
        private m_nType: number;     //面板类型
        public constructor() {
            super();
        }
        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
        }
        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_imgItem = new RoleReplaceItem();
            this.addChild(this.m_imgItem);

            this.m_imgSelected = new eui.Image('small_general_head_light_png');
            this.m_imgSelected.x = -10;
            this.m_imgSelected.y = -10;
            NodeUtils.setScale(this.m_imgSelected, 0.76);
            this.m_imgSelected.visible = false;
            this.m_imgItem.m_pSelected.addChild(this.m_imgSelected);
        }
        protected dataChanged() {
            this.m_tData = this.data;
            this.m_imgSelected.visible = this.m_tData.sel == true;
            this.m_imgItem.setItemInfo(this.m_tData.id, this.m_tData.isHave);

        }
    }
}