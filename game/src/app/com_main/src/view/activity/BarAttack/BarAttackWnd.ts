module com_main {
	/**
	 * 黄巾入侵
	 */
    export class BarAttackWnd extends CView {
        public static NAME = 'BarAttackWnd';

        public m_apopUp: com_main.APopUp;
        public m_labTitle: eui.Label;
        public m_pScrollRoot: eui.Group;
        public m_pRoot0: eui.Group;
        public m_pRoot1: eui.Group;
        public m_pRoot2: eui.Group;

        // private m_tCollect0: eui.ArrayCollection;
        // private m_tCollect1: eui.ArrayCollection;
        // private m_tCollect2: eui.ArrayCollection;

        public constructor() {
            super();
            this.name = BarAttackWnd.NAME;
            this.initApp("activity/barAttack/BarAttackWndSkin.exml");

        }

        public onDestroy(): void {
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_apopUp.setTitleLabel(GCode(CLEnum.BAR_TITLE));
            switch (RoleData.countryId) {
                case CountryType.WEI: {
                    this.m_pScrollRoot.setChildIndex(this.m_pRoot0, 0);
                    break;
                }
                case CountryType.SHU: {
                    this.m_pScrollRoot.setChildIndex(this.m_pRoot1, 0);
                    break;
                }
                case CountryType.WU: {
                    this.m_pScrollRoot.setChildIndex(this.m_pRoot2, 0);
                    break;
                }
            }

            let vo = ActivityModel.getActivityVo<AcBarAttackVo>(AcViewType.BARBARIANATTACK);
            if (vo) {
                this.m_labTitle.text = vo.isInAttReady() ? '黄巾军准备攻打城池' : '黄巾军正在攻打城池';
            }
            CountryProxy.C2S_COUNTRY_CITY();
        }

        /**刷新城池显示 */
        private refreshCityItem(list: gameProto.IDefCity[]) {
            let citys = {};
            for (let i = 0; i < list.length; i++) {
                citys[list[i].cityId] = list[i].countryId;
            }
            let vo = ActivityModel.getActivityVo<AcBarAttackVo>(AcViewType.BARBARIANATTACK);
            if (!vo || !vo.isOpenIcon()) return;
            vo.evtDatas.sort((a, b) => {
                if (a.isOver != b.isOver) return a.isOver ? 1 : -1;
                return a.cityId - b.cityId;
            });
            for (let i = 0; i < vo.evtDatas.length; i++) {
                let evt = vo.evtDatas[i];
                let countryId = citys[evt.cityId];
                this.addItem(countryId, evt.cityId, evt.isOver)
            }
        }

        /**添加对象 */
        private addItem(countryId: number, cityId: number, isOver: boolean) {
            let item = new BarCityItem();
            item.setItemInfo({ countryId: countryId, cityId: cityId, isOver: isOver });
            switch (countryId) {
                case CountryType.WEI: {
                    this.m_pRoot0.addChild(item);
                    break;
                }
                case CountryType.SHU: {
                    this.m_pRoot1.addChild(item);
                    break;
                }
                case CountryType.WU: {
                    this.m_pRoot2.addChild(item);
                    break;
                }
            }
        }

        //点击建业
        // public onClickJianye() {
        //     let param: com_main.IWorldMapData = { type: 106, param: 42, tips: "1" };
        //     FunctionModel.turnWorldMap(param);
        // }


        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_COUNTRY_CITY
            ];
        }

        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_COUNTRY_CITY: {
                    let data = body as gameProto.IS2C_COUNTRY_CITY;
                    if (data) this.refreshCityItem(data.defCity);
                    break;
                }
            }
        }
    }

    interface IBarCityRD {
        countryId: number;
        cityId: number;
        isOver: boolean;
    }

    class BarCityItem extends CComponent {
        public m_pRoot: eui.Group;
        public m_imgBg: eui.Image;
        public m_imgIcon: eui.Image;
        public m_labName: eui.Label;
        public m_comSate: com_main.ComState;

        private m_tData: IBarCityRD

        public constructor() {
            super();
            this.name = ArenaView.NAME;
            this.skinName = Utils.getAppSkin("activity/barAttack/BarCityItemSkin.exml");
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.m_pRoot, this, this.onItemHandler);
        }

        $onRemoveFromStage(): void {
            EventManager.removeEventListeners(this);
            super.$onRemoveFromStage();
        }

        public setItemInfo(data: IBarCityRD) {
            this.m_tData = data;
            if (!this.m_tData) return;
            this.m_comSate.stateId = this.m_tData.countryId;
            let cfg = C.WorldMapConfig[this.m_tData.cityId];
            this.m_labName.text = GLan(cfg.name);

            this.m_imgBg.source = this.getBgSource(this.m_tData.countryId);
            this.m_imgIcon.source = `${cfg.icon}_png`;

            Utils.isGray(this.m_tData.isOver, this);
        }

        private getBgSource(countryId: number) {
            switch (countryId) {
                case CountryType.SHU:
                    return 'zyt_gj_sg_png';
                case CountryType.WU:
                    return 'zyt_gj_wug_png';
            }
            return 'zyt_gj_wg_png';
        }

        public onItemHandler() {
            if (!this.m_tData) return;
            let param: com_main.IWorldMapData = { type: 106, param: this.m_tData.cityId, tips: "1" };
            FunctionModel.turnWorldMap(param);
        }
    }
}