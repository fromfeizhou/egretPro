var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    /**
     * 黄巾入侵
     */
    var BarAttackWnd = /** @class */ (function (_super_1) {
        __extends(BarAttackWnd, _super_1);
        // private m_tCollect0: eui.ArrayCollection;
        // private m_tCollect1: eui.ArrayCollection;
        // private m_tCollect2: eui.ArrayCollection;
        function BarAttackWnd() {
            var _this = _super_1.call(this) || this;
            _this.name = BarAttackWnd.NAME;
            _this.initApp("activity/barAttack/BarAttackWndSkin.exml");
            return _this;
        }
        BarAttackWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        BarAttackWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
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
            var vo = ActivityModel.getActivityVo(AcViewType.BARBARIANATTACK);
            if (vo) {
                this.m_labTitle.text = vo.isInAttReady() ? '黄巾军准备攻打城池' : '黄巾军正在攻打城池';
            }
            CountryProxy.C2S_COUNTRY_CITY();
        };
        /**刷新城池显示 */
        BarAttackWnd.prototype.refreshCityItem = function (list) {
            var citys = {};
            for (var i = 0; i < list.length; i++) {
                citys[list[i].cityId] = list[i].countryId;
            }
            var vo = ActivityModel.getActivityVo(AcViewType.BARBARIANATTACK);
            if (!vo || !vo.isOpenIcon())
                return;
            vo.evtDatas.sort(function (a, b) {
                if (a.isOver != b.isOver)
                    return a.isOver ? 1 : -1;
                return a.cityId - b.cityId;
            });
            for (var i = 0; i < vo.evtDatas.length; i++) {
                var evt = vo.evtDatas[i];
                var countryId = citys[evt.cityId];
                this.addItem(countryId, evt.cityId, evt.isOver);
            }
        };
        /**添加对象 */
        BarAttackWnd.prototype.addItem = function (countryId, cityId, isOver) {
            var item = new BarCityItem();
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
        };
        //点击建业
        // public onClickJianye() {
        //     let param: com_main.IWorldMapData = { type: 106, param: 42, tips: "1" };
        //     FunctionModel.turnWorldMap(param);
        // }
        BarAttackWnd.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_COUNTRY_CITY
            ];
        };
        /**处理协议号事件 */
        BarAttackWnd.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_COUNTRY_CITY: {
                    var data = body;
                    if (data)
                        this.refreshCityItem(data.defCity);
                    break;
                }
            }
        };
        BarAttackWnd.NAME = 'BarAttackWnd';
        return BarAttackWnd;
    }(com_main.CView));
    com_main.BarAttackWnd = BarAttackWnd;
    var BarCityItem = /** @class */ (function (_super_1) {
        __extends(BarCityItem, _super_1);
        function BarCityItem() {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.ArenaView.NAME;
            _this.skinName = Utils.getAppSkin("activity/barAttack/BarCityItemSkin.exml");
            return _this;
        }
        BarCityItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pRoot, this, this.onItemHandler);
        };
        BarCityItem.prototype.$onRemoveFromStage = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        BarCityItem.prototype.setItemInfo = function (data) {
            this.m_tData = data;
            if (!this.m_tData)
                return;
            this.m_comSate.stateId = this.m_tData.countryId;
            var cfg = C.WorldMapConfig[this.m_tData.cityId];
            this.m_labName.text = GLan(cfg.name);
            this.m_imgBg.source = this.getBgSource(this.m_tData.countryId);
            this.m_imgIcon.source = cfg.icon + "_png";
            Utils.isGray(this.m_tData.isOver, this);
        };
        BarCityItem.prototype.getBgSource = function (countryId) {
            switch (countryId) {
                case CountryType.SHU:
                    return 'zyt_gj_sg_png';
                case CountryType.WU:
                    return 'zyt_gj_wug_png';
            }
            return 'zyt_gj_wg_png';
        };
        BarCityItem.prototype.onItemHandler = function () {
            if (!this.m_tData)
                return;
            var param = { type: 106, param: this.m_tData.cityId, tips: "1" };
            FunctionModel.turnWorldMap(param);
        };
        return BarCityItem;
    }(com_main.CComponent));
})(com_main || (com_main = {}));
