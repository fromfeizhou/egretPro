// TypeScript file

module com_main {
    /**
     * 角色面板信息
     */
    export class RoleInfoView extends CView {
        private WIDTH = 340;
        public static NAME = "RoleInfoView";
        /**玩家名字 */
        private m_labRoleName: eui.Label;
        /**大殿等级 */
        private m_labLevel: eui.Label;
        /**联盟名字 */
        private m_labLegion: eui.Label;
        /**玩家等级 */
        public m_labRoleLv: eui.Label;
        /**玩家经验 */
        public m_labRoleExp: eui.Label;
        public m_PopUp: com_main.APopUp;
        public m_labChangeName: eui.Group;
        public m_imgPro: eui.Image;
        public m_imgVipShop: eui.Image;
        public m_labPlayerVip: eui.BitmapLabel;
        public m_comFightItem: com_main.ComFightItem;
        public m_imgMusic: eui.Image;
        public m_imgSound: eui.Image;
        public m_imgRole: eui.Image;
        public m_btnHeadICon: com_main.ComButton;
        public m_addExp: eui.Image;
        public m_btnExchange: com_main.ComButton;


        public constructor() {
            super();
            this.skinName = Utils.getAppSkin("role/role_info_view_new.exml");
        }
        public onDestroy(): void {
            egret.Tween.removeTweens(this);
            this.removeEvent();
            super.onDestroy();

            SceneResGroupCfg.clearModelRes([ModuleEnums.ROLE]);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.initRoleData();
            this.m_PopUp.setTitleLabel(GCode(CLEnum.ROLE_INFO));
            this.m_PopUp.setBottomBorder(false);
            this.m_btnExchange.setTitleLabel(GCode(CLEnum.ROLE_GIFT_DH));
            this.initEvent();

            this.m_labPlayerVip.visible = !platform.isHidePayFunc();
            this.m_btnExchange.visible = !platform.isHidePayFunc();

        }
        private initEvent() {
            this.m_btnHeadICon.setTitleLabel(GCode(CLEnum.ROLE_LOOK_CHANGE));
            EventMgr.addEvent(RoleEvent.ROLE_EXP, this.onRoleUpExp, this);
            EventManager.addTouchScaleListener(this.m_imgVipShop, this, this.onBtnVipShopHandler);
            EventManager.addTouchTapListener(this.m_labChangeName, this, this.changeNameHandler);
            EventManager.addTouchTapListener(this.m_imgMusic, this, this.onMusicClose);
            EventManager.addTouchTapListener(this.m_imgSound, this, this.onSoundClose);
            EventManager.addTouchTapListener(this.m_btnHeadICon, this, this.onReplaceImg);
            EventManager.addTouchTapListener(this.m_addExp, this, this.onAddExp);
            EventManager.addTouchScaleListener(this.m_btnExchange, this, this.onBtnExchange);
            EventMgr.addEvent(RoleEvent.ROLE_NAME, this.onRefreshName, this);
            EventMgr.addEvent(RoleEvent.ROLE_HEADIMG, this.onRefreshImg, this);




        }

        private removeEvent() {
            EventMgr.removeEventByObject(RoleEvent.ROLE_EXP, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_NAME, this);
            EventMgr.removeEventByObject(RoleEvent.ROLE_HEADIMG, this);
        }
        /**礼包兑换 */
        private onBtnExchange() {
            Utils.open_view(TASK_UI.POP_ROLE_GIFT_DH);
        }
        /**玩家经验升级 */
        private onRoleUpExp() {
            this.refalshExp();
        }
        /**获取经验 */
        private onAddExp() {
            Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, 5);
        }
        private refalshExp() {
            this.m_labRoleLv.text = RoleData.level + "";
            let currExp = RoleData.exp > 0 ? CommonUtils.numOutLenght(RoleData.exp) : '0';
            this.m_labRoleExp.text = currExp + "/" + CommonUtils.numOutLenght(RoleData.getPlayerLevelUpExp(RoleData.level));
        }
        /**vip*/
        public onBtnVipShopHandler(pvt: egret.TouchEvent) {
            Utils.open_view(TASK_UI.VIP_MAIN_PANEL);
        }
        /**改名*/
        public changeNameHandler(pvt: egret.TouchEvent) {
            Utils.open_view(TASK_UI.POP_ROLE_CHANGE_NAME);
        }
        /**关闭音乐*/
        public onMusicClose(pvt: egret.TouchEvent) {
            GameConfig.MusicIsPlay = !GameConfig.MusicIsPlay;
            this.m_imgMusic.source = GameConfig.MusicIsPlay ? 'btn_126_png' : 'btn_130_png';
            let tempState = GameConfig.MusicIsPlay ? "1" : "0";
            LocalData.setData('soundBg', tempState);
            GameConfig.MusicIsPlay = GameConfig.MusicIsPlay;
            if (GameConfig.MusicIsPlay) {
                Sound.resumeBgMusic();
            } else {
                Sound.pauseBgMusic();
            }
        }

        /**关闭音效*/
        public onSoundClose(pvt: egret.TouchEvent) {
            GameConfig.EffectIsPlay = !GameConfig.EffectIsPlay;
            this.m_imgSound.source = GameConfig.EffectIsPlay ? 'btn_127_png' : 'btn_128_png';
            let tempState = GameConfig.EffectIsPlay ? "1" : "0";
            LocalData.setData('soundEff', tempState);
            GameConfig.EffectIsPlay = GameConfig.EffectIsPlay;
        }
        /**更换形象*/
        public onReplaceImg(pvt: egret.TouchEvent) {
            Utils.open_view(TASK_UI.POP_ROLE_REPLACE_IMG);
        }
        /**刷新名字 */
        private onRefreshName() {
            this.m_labRoleName.text = RoleData.nickName;
        }
        /**刷新形象 */
        private onRefreshImg() {
            this.m_imgRole.source = Utils.getPlayerBigHeadSource(RoleData.headType, RoleData.headId.toString());
        }
        private initRoleData() {
            this.m_labRoleName.text = RoleData.nickName;
            this.m_comFightItem.setFight(GeneralModel.getGeneralTotalFight());
            this.m_labLevel.text = GCodeFromat(CLEnum.LEVEL1, MainMapModel.getHallLevel());
            this.m_labLegion.text = LegionModel.getGuildName();
            this.m_labRoleLv.text = RoleData.level + "";
            this.m_labPlayerVip.text = GCodeFromat(CLEnum.VIP_LEVEL, RoleData.vipLevel);
            let allExp =RoleData.getPlayerLevelUpExp(RoleData.level)>0? CommonUtils.numOutLenght(RoleData.getPlayerLevelUpExp(RoleData.level)):"已满级";
            let currExp = RoleData.exp > 0 ? CommonUtils.numOutLenght(RoleData.exp) : '0';
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

        }
    }


}