// TypeScript file
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
     * 角色面板信息
     */
    var RoleInfoView = /** @class */ (function (_super_1) {
        __extends(RoleInfoView, _super_1);
        function RoleInfoView() {
            var _this = _super_1.call(this) || this;
            _this.WIDTH = 340;
            _this.skinName = Utils.getAppSkin("role/role_info_view_new.exml");
            return _this;
        }
        RoleInfoView.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this);
            this.removeEvent();
            _super_1.prototype.onDestroy.call(this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.ROLE]);
        };
        RoleInfoView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initRoleData();
            this.m_PopUp.setTitleLabel(GCode(CLEnum.ROLE_INFO));
            this.m_PopUp.setBottomBorder(false);
            this.m_btnExchange.setTitleLabel(GCode(CLEnum.ROLE_GIFT_DH));
            this.initEvent();
            this.m_labPlayerVip.visible = !platform.isHidePayFunc();
            this.m_btnExchange.visible = !platform.isHidePayFunc();
        };
        RoleInfoView.prototype.initEvent = function () {
            this.m_btnHeadICon.setTitleLabel(GCode(CLEnum.ROLE_LOOK_CHANGE));
            com_main.EventMgr.addEvent(RoleEvent.ROLE_EXP, this.onRoleUpExp, this);
            com_main.EventManager.addTouchScaleListener(this.m_imgVipShop, this, this.onBtnVipShopHandler);
            com_main.EventManager.addTouchTapListener(this.m_labChangeName, this, this.changeNameHandler);
            com_main.EventManager.addTouchTapListener(this.m_imgMusic, this, this.onMusicClose);
            com_main.EventManager.addTouchTapListener(this.m_imgSound, this, this.onSoundClose);
            com_main.EventManager.addTouchTapListener(this.m_btnHeadICon, this, this.onReplaceImg);
            com_main.EventManager.addTouchTapListener(this.m_addExp, this, this.onAddExp);
            com_main.EventManager.addTouchScaleListener(this.m_btnExchange, this, this.onBtnExchange);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_NAME, this.onRefreshName, this);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_HEADIMG, this.onRefreshImg, this);
        };
        RoleInfoView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_EXP, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_NAME, this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_HEADIMG, this);
        };
        /**礼包兑换 */
        RoleInfoView.prototype.onBtnExchange = function () {
            Utils.open_view(TASK_UI.POP_ROLE_GIFT_DH);
        };
        /**玩家经验升级 */
        RoleInfoView.prototype.onRoleUpExp = function () {
            this.refalshExp();
        };
        /**获取经验 */
        RoleInfoView.prototype.onAddExp = function () {
            Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, 5);
        };
        RoleInfoView.prototype.refalshExp = function () {
            this.m_labRoleLv.text = RoleData.level + "";
            var currExp = RoleData.exp > 0 ? CommonUtils.numOutLenght(RoleData.exp) : '0';
            this.m_labRoleExp.text = currExp + "/" + CommonUtils.numOutLenght(RoleData.getPlayerLevelUpExp(RoleData.level));
        };
        /**vip*/
        RoleInfoView.prototype.onBtnVipShopHandler = function (pvt) {
            Utils.open_view(TASK_UI.VIP_MAIN_PANEL);
        };
        /**改名*/
        RoleInfoView.prototype.changeNameHandler = function (pvt) {
            Utils.open_view(TASK_UI.POP_ROLE_CHANGE_NAME);
        };
        /**关闭音乐*/
        RoleInfoView.prototype.onMusicClose = function (pvt) {
            GameConfig.MusicIsPlay = !GameConfig.MusicIsPlay;
            this.m_imgMusic.source = GameConfig.MusicIsPlay ? 'btn_126_png' : 'btn_130_png';
            var tempState = GameConfig.MusicIsPlay ? "1" : "0";
            LocalData.setData('soundBg', tempState);
            GameConfig.MusicIsPlay = GameConfig.MusicIsPlay;
            if (GameConfig.MusicIsPlay) {
                Sound.resumeBgMusic();
            }
            else {
                Sound.pauseBgMusic();
            }
        };
        /**关闭音效*/
        RoleInfoView.prototype.onSoundClose = function (pvt) {
            GameConfig.EffectIsPlay = !GameConfig.EffectIsPlay;
            this.m_imgSound.source = GameConfig.EffectIsPlay ? 'btn_127_png' : 'btn_128_png';
            var tempState = GameConfig.EffectIsPlay ? "1" : "0";
            LocalData.setData('soundEff', tempState);
            GameConfig.EffectIsPlay = GameConfig.EffectIsPlay;
        };
        /**更换形象*/
        RoleInfoView.prototype.onReplaceImg = function (pvt) {
            Utils.open_view(TASK_UI.POP_ROLE_REPLACE_IMG);
        };
        /**刷新名字 */
        RoleInfoView.prototype.onRefreshName = function () {
            this.m_labRoleName.text = RoleData.nickName;
        };
        /**刷新形象 */
        RoleInfoView.prototype.onRefreshImg = function () {
            this.m_imgRole.source = Utils.getPlayerBigHeadSource(RoleData.headType, RoleData.headId.toString());
        };
        RoleInfoView.prototype.initRoleData = function () {
            this.m_labRoleName.text = RoleData.nickName;
            this.m_comFightItem.setFight(GeneralModel.getGeneralTotalFight());
            this.m_labLevel.text = GCodeFromat(CLEnum.LEVEL1, MainMapModel.getHallLevel());
            this.m_labLegion.text = LegionModel.getGuildName();
            this.m_labRoleLv.text = RoleData.level + "";
            this.m_labPlayerVip.text = GCodeFromat(CLEnum.VIP_LEVEL, RoleData.vipLevel);
            var allExp = RoleData.getPlayerLevelUpExp(RoleData.level) > 0 ? CommonUtils.numOutLenght(RoleData.getPlayerLevelUpExp(RoleData.level)) : "已满级";
            var currExp = RoleData.exp > 0 ? CommonUtils.numOutLenght(RoleData.exp) : '0';
            this.m_labRoleExp.text = currExp + "/" + allExp;
            this.m_imgPro.width = (RoleData.exp / RoleData.getPlayerLevelUpExp(RoleData.level)) * this.WIDTH;
            this.m_imgMusic.source = GameConfig.MusicIsPlay ? 'btn_126_png' : 'btn_130_png';
            this.m_imgSound.source = GameConfig.EffectIsPlay ? 'btn_127_png' : 'btn_128_png';
            this.onRefreshImg();
            // // 玩家的半身像
            // Utils.setPlayerBodyImg(this.m_pImgRole, RoleData.headId);
            // // 官职
            // let posName: string = Utils.getGovernmentPosName(RoleData.governmentPost);
            // if (posName == "") {
            //     posName = "暂无官职";
            // }
            // this.m_pLbPosition.text = posName;
            // // 国家旗帜
            // Utils.setImageFromSource(this.m_pImgCountry, Utils.getCountyFlagById(RoleData.countryId));
        };
        RoleInfoView.NAME = "RoleInfoView";
        return RoleInfoView;
    }(com_main.CView));
    com_main.RoleInfoView = RoleInfoView;
})(com_main || (com_main = {}));
