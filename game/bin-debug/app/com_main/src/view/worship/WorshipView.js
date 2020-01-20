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
    var WorshipView = /** @class */ (function (_super_1) {
        __extends(WorshipView, _super_1);
        function WorshipView() {
            var _this = _super_1.call(this) || this;
            _this.name = com_main.Cornucopia.NAME;
            _this.initApp("worship/WorshipSkin.exml");
            return _this;
        }
        WorshipView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
            this.removeBtnEffect();
            SceneResGroupCfg.clearModelRes([ModuleEnums.WORSHIP_UI]);
        };
        WorshipView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.refreshEmperor();
            this.refreshWorshipInfo();
            com_main.EventManager.addTouchScaleListener(this.m_closeBtn, this, this.onClickBack);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnWorship, this, this.onClickWorshipBtn);
            this.onGuideCondition();
        };
        /**按钮特效 */
        WorshipView.prototype.addBtnEffect = function () {
            this.m_effect = new MCDragonBones();
            this.m_effect.initAsync(IETypes.EUI_BtnEffect02);
            this.m_effect.play(IETypes.EUI_BtnEffect02);
            this.m_effect.x = 154;
            this.m_effect.y = 57;
            this.m_pBtnWorship.addChild(this.m_effect);
        };
        /**按钮特效 */
        WorshipView.prototype.removeBtnEffect = function () {
            if (this.m_effect) {
                this.m_effect.destroy();
                this.m_effect = null;
            }
        };
        WorshipView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_COUNTRY_EMPEROR_INFO,
                ProtoDef.S2C_WORSHIP,
                ProtoDef.S2C_WORSHIP_INFO,
            ];
        };
        /**处理协议号事件 */
        WorshipView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_COUNTRY_EMPEROR_INFO: {
                    this.refreshEmperor();
                    break;
                }
                case ProtoDef.S2C_WORSHIP: {
                    var data = body;
                    if (data.ret == 0) {
                        this.m_pBtnWorship.visible = false;
                        this.m_lb_num.visible = true;
                        this.refreshWorshipInfo(true);
                    }
                    break;
                }
                case ProtoDef.S2C_WORSHIP_INFO: {
                    this.refreshWorshipInfo();
                    break;
                }
            }
        };
        WorshipView.prototype.refreshEmperor = function () {
            var info = CountryModel.getCountryEmperorInfo();
            if (!info)
                return;
            this.m_pImg.setInfo(info.head, true, true);
            this.m_pName.text = info.nickName;
            this.m_cImg.source = 'common_country1_' + info.country + '_png';
            this.m_comFightItem.setFight(info.fight);
            this.m_legionLb.text = info.guild;
        };
        WorshipView.prototype.refreshWorshipInfo = function (isAddOne) {
            var info = WorshipModel.getWorshipData(1);
            if (!info)
                return;
            var num = 0;
            if (isAddOne) {
                num = info.beWorshipCount + 1;
            }
            else {
                num = info.beWorshipCount;
            }
            this.m_lb_num.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WORSHIP_NUM, num));
            this.m_desLb.textFlow = Utils.htmlParser(GCode(CLEnum.WORSHIP_DES));
            var isWorship = WorshipModel.getStateByType(WorshipType.KING);
            if (isWorship && info.playerId != RoleData.playerId) {
                this.m_pBtnWorship.visible = true;
                this.m_lb_num.visible = false;
                this.addBtnEffect();
            }
            else {
                this.m_pBtnWorship.visible = false;
                this.m_lb_num.visible = true;
            }
        };
        WorshipView.prototype.onClickWorshipBtn = function () {
            WorshipProxy.send_C2S_WORSHIP(WorshipType.KING, 0);
        };
        //关闭页面
        WorshipView.prototype.onClickBack = function () {
            com_main.UpManager.history();
        };
        WorshipView.NAME = 'WorshipView';
        return WorshipView;
    }(com_main.CView));
    com_main.WorshipView = WorshipView;
})(com_main || (com_main = {}));
