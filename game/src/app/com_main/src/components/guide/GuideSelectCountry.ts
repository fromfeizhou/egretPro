
module com_main {

    /**
     * 阵营选择
     */
    export class GuideSelectCountry extends CView {

        public static Types = [SoldierNationType.SU, SoldierNationType.WEI, SoldierNationType.WU];
        public static readonly NAME = "GuideSelectCountry";

        public m_genCard: com_main.ComGenCard;
        public m_pBtnJoin: com_main.ComButton;
        public m_btnRoot: eui.Group;
        public m_labInput: eui.EditableText;
        public m_btnRandom: eui.Image;
        public m_tabBtn: eui.List;
        public m_pItemRoot: eui.Group;
        public m_item0: com_main.GuideSelectItem;
        public m_item1: com_main.GuideSelectItem;
        public m_item2: com_main.GuideSelectItem;
        public m_pRoot: eui.Group;

        private m_pSelectCountry: number = 0;
        private m_pDefault: number = 0;
        private m_pIsSend: boolean = false;
        private m_tCollection: eui.ArrayCollection;

        private m_tItemList: GuideSelectItem[]; //类型数组
        private m_nCountryType: SoldierNationType;//当前国家
        private m_gender: number = 0;                 //当前性别
        private m_nTagId: number;   //切卡
        public constructor(ty?: number) {
            super();
            LoginProxy.C2S_PLAYER_RANDOM_NAME(this.m_gender);
            LoginProxy.C2S_PLAYER_RECOMMEND_COUNTRY();
            this.name = GuideSelectCountry.NAME;
            this.touchEnabled = true;
            this.initApp("world/world_camp_view.exml");
        }

        protected listenerProtoNotifications(): any[] {

            return [
                ProtoDef.S2C_PLAYER_RECOMMEND_COUNTRY,
                ProtoDef.S2C_PLAYER_RANDOM_NAME,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_PLAYER_RECOMMEND_COUNTRY: {
                    this.m_pDefault = RoleData.defaultCountryId == 4 ? 3 : RoleData.defaultCountryId;
                    if (this.m_pSelectCountry != this.m_pDefault) {
                        this.m_pSelectCountry = this.m_pDefault;
                        this.changeCountryType(this.m_pDefault, false);
                    }
                    break;
                }
                case ProtoDef.S2C_PLAYER_RANDOM_NAME: {
                    this.creatName(RoleData.nickName);
                    break;
                }
            }
        }

        public onDestroy(): void {
            EventManager.removeEventListener(this.m_pBtnJoin);
            EventManager.removeEventListener(this.m_btnRandom);
            this.m_labInput.removeEventListener(egret.Event.CHANGE, this.onAccountChange, this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.SELECT_COUNTRY,ModuleEnums.COUNTRY_UI]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.m_pRoot.visible = false;
            Utils.toStageBestScale(this.m_pRoot);

            Utils.open_view(TASK_UI.GUIDE_DIALOG_VIEW, 300001);
            EventMgr.addEvent(GuideEvent.GUIDE_DIALOGUE_END, this.dialogueEnd, this);
            this.m_tCollection = new eui.ArrayCollection();
            this.m_tabBtn.dataProvider = this.m_tCollection;
            this.m_tabBtn.itemRenderer = TabBtnRoleRender;
            this.m_tabBtn.addEventListener(egret.Event.CHANGE, this.onTabBtnClick, this);

            this.m_pBtnJoin.setTitleLabel(GCode(CLEnum.ENTER_GAME));
            EventManager.addTouchScaleListener(this.m_pBtnJoin, this, this.onClick);
            EventManager.addTouchScaleListener(this.m_btnRandom, this, this.onClickRandom);
            this.m_labInput.addEventListener(egret.Event.CHANGE, this.onAccountChange, this);

            this.m_tItemList = [];
            for (let i = 0; i < GuideSelectCountry.Types.length; i++) {
                let item = this[`m_item${i}`] as GuideSelectItem;
                item.type = GuideSelectCountry.Types[i];
                this.m_tItemList.push(item);
                EventManager.addTouchTapListener(item, this, this.onItemClick);
            }
            //第二位 居中为当前选中对象
            this.m_nCountryType = GuideSelectCountry.Types[1];
            this.setCollection();
            this.setRoleimg(this.m_gender);//默认性别男
        }
        /**结束剧情对话事件 */
        private dialogueEnd() {
            this.m_pRoot.visible = true;
            EventMgr.removeEventByObject(GuideEvent.GUIDE_DIALOGUE_END, this);

            window["ta"].track('novice_guide',  {step: 10006+"",'trigger_time': new Date()});
        }
        /**初始化按钮 */
        public setCollection() {
            let heroArr = [];

            for (let i = 0; i < 2; i++) {
                let sel: boolean;
                let gender: string;
                if (i == 0) {
                    gender = 'icon_xj_boy_png';
                    sel = true;
                } else if (i == 1) {
                    gender = "icon_xj_girl_png";
                    sel = false;
                }

                let data: ITabBtnRoleRD = { sel: sel, type: i, gender: gender };
                heroArr.push(data);
            }
            this.m_tCollection.replaceAll(heroArr);
        }
        //国家点击回调
        private onItemClick(e: egret.Event): void {
            let item: GuideSelectItem = e.currentTarget as GuideSelectItem;
            if (item.type == this.m_nCountryType) return;
            this.changeCountryType(item.type);

            window["ta"].track('novice_guide',  {step: 10007+"",'trigger_time': new Date()});
        }
        /**切换国家 */
        private changeCountryType(type: SoldierNationType, isAction: boolean = true) {
            let currIndex: number;
            let itemInfo = ConstUtil.getItems(IConstEnum.RECOMMEND_COUNTRY)[0];
            let curId = 0;
            let targetId = 0;
            for (let i = 0; i < this.m_tItemList.length; i++) {
                let item = this.m_tItemList[i];
                if (item.type == this.m_nCountryType) curId = i;
                if (item.type == type) targetId = i;
                let boo = false;
                if (item.type == this.m_pDefault) {
                    currIndex = i;
                }
                item.setSelect(boo, itemInfo.count);
            }
            this.m_nCountryType = type;
            this.m_pSelectCountry = type;
            let boo1 = this.m_nCountryType == this.m_pDefault ? true : false;
            this.m_tItemList[currIndex].setSelect(boo1, itemInfo.count);

            if (curId != targetId) {
                while (curId != targetId) {
                    this.doAction(targetId - curId, isAction);
                    curId = curId > targetId ? curId - 1 : curId + 1;
                }
            } else {
                //旋转动画
                this.doAction(0, isAction);
            }

        }

        /** 旋转动画 */
        private doAction(state: number, isAction: boolean = true): void {
            if (state < 0) {
                //上旋转
                let tmp = this.m_tItemList.pop();
                this.m_tItemList.unshift(tmp);
                this.m_pItemRoot.setChildIndex(tmp, 0);
            } else if (state > 0) {
                //下
                let tmp = this.m_tItemList.shift();
                this.m_tItemList.push(tmp);
                this.m_pItemRoot.setChildIndex(tmp, 0);
            }
            this.m_pItemRoot.setChildIndex(this.m_tItemList[1], this.m_pItemRoot.numChildren - 1);
            let posY = [70, 250, 430];
            let scales = [0.8, 1, 0.8];
            let alphas = [0.5, 1, 0.5];
            for (let i = 0; i < this.m_tItemList.length; i++) {
                this.m_tItemList[i].doAction(posY[i], scales[i], alphas[i], isAction);
                let effBoo = i == 1 ? true : false;
                this.m_tItemList[i].setSelectEff(effBoo);
            }
        }
        /**设置性别切卡回调 */
        public onTabBtnClick(e: egret.Event) {
            Sound.playTap();
            let selectedIndex = e.currentTarget.selectedIndex;
            for (let i = 0; i < this.m_tCollection.source.length; i++) {
                let info: ITabBtnRoleRD = this.m_tCollection.getItemAt(i);
                info.sel = i == selectedIndex;
                this.m_tCollection.replaceItemAt(info, i);
            }
            this.m_gender = selectedIndex;
            this.setRoleimg(selectedIndex);

            window["ta"].track('novice_guide',  {step: 10008+"",'trigger_time': new Date()});
        }
        private setRoleimg(index: number) {
            let imgPic = index == 1 ? RoleImgId.GIRL : RoleImgId.BOY;
            this.refreshGeneral(imgPic);
            this.getRandomName(index);
        }
        /**boss形象 */
        public refreshGeneral(imgPic: number) {
            this.m_genCard.setInfo(imgPic, true);
            if (imgPic == RoleImgId.BOY) {
                NodeUtils.setScale(this.m_genCard.heroIcon, 1.1);
            } else {
                NodeUtils.setScale(this.m_genCard.heroIcon, 1);
            }
        }
        /**创角名字 */
        private creatName(name: string): void {
            this.m_labInput.maxChars = 6;//限制输入6个字位/字母
            this.m_labInput.text = name;
        }

        /**输入名字 */
        public onAccountChange(evt: egret.Event) {
            Sound.playTap();
            let input = evt.target;
            input.text = Utils.trim(input.text);//过滤空格
            input.text = Utils.filterStr(input.text);//过滤特殊字符
            // /**过滤敏感字 */
            // GameConfig.setLoginData(null, null, input.text);
            window["ta"].track('novice_guide',  {step: 10010+"",'trigger_time': new Date()});
        }
        /**点击随机命名按钮 */
        public onClickRandom(e: egret.Event): void {
            this.getRandomName(this.m_gender);
            window["ta"].track('novice_guide',  {step: 10009+"",'trigger_time': new Date()});
        }
        /**随机创角名字 */
        public getRandomName(gender: number): void {
            LoginProxy.C2S_PLAYER_RANDOM_NAME(gender);

        }
        public onClick(e: egret.Event): void {
            if (this.m_labInput.text == "") {
                EffectUtils.showTips(GCode(CLEnum.LOGIN_CHOSE_NAME));
                return;
            }
            if (this.m_pSelectCountry == 0) {
                EffectUtils.showTips(GCode(CLEnum.LOGIN_CHOSE_STATE));
                return;
            }
            LoginProxy.C2S_PLAYER_CREATE(this.m_labInput.text, 1, this.m_pSelectCountry, this.m_gender);

            window["ta"].track('novice_guide',  {step: 10011+"",'trigger_time': new Date()});
            // LoginProxy.send_JOIN_COUNTRY(this.m_pSelectCountry);
            // UpManager.history();
        }

        // /**强制指引拦截事件 */
        // $hitTest(stageX, stageY) {

        //     return this;
        // };

    }
    interface ITabBtnRoleRD {
        sel: boolean,
        type: number,
        gender: string,
    }

    class TabBtnRoleRender extends eui.ItemRenderer {
        public m_imgSelect: eui.Image;
        public m_imgGender: eui.Image;

        private m_tData: ITabBtnRoleRD;
        public constructor() {
            super();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        protected dataChanged() {
            this.m_tData = this.data;

            this.m_imgSelect.source = this.m_tData.sel ? 'btn_137_png' : 'btn_136_png';
            this.m_imgGender.source = this.m_tData.gender;
        }

    }


}