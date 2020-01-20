module com_main {

    /**
     * 攻城结果
     * @export
     * @class WorldSiegeResult
     * @extends CView
     */
    export class WorldSiegeResult extends CView {

        public static readonly NAME = "WorldSiegeResult";

        public m_pMain: eui.Group;
        public m_pLbAttkLess: eui.Label;
        public m_pLbAttkDead: eui.Label;
        public m_pLbDefeLess: eui.Label;
        public m_pLbDefeDead: eui.Label;
        public m_pAttkCountry: eui.Image;
        public m_pWinCountry: eui.Image;
        public m_pDefeCountry: eui.Image;
        public m_lbWf: eui.Image;
        public m_lbDf: eui.Image;
        public m_pStatus: eui.Image;
        public m_pBtnBattle: eui.Group;
        public m_pLbAtk: eui.Label;
        public m_pLbHurt: eui.Label;
        public m_pLbSort: eui.Label;
        public m_pExit: eui.Group;


        protected m_pResult: ItfSiegeResult;

        public constructor(body: ItfSiegeResult) {
            super();
            this.name = WorldSiegeResult.NAME;
            this.m_pResult = body;
            this.initApp("world/world_siege_result.exml");
        }

        public onDestroy(): void {

            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            if (!this.m_pResult) return;
            this.__init_result();
            this.m_pLbAttkLess.text = `${this.m_pResult.atkRemainQueue}`;
            this.m_pLbAttkDead.text = `${this.m_pResult.atkDead}`;
            this.m_pLbDefeLess.text = `${this.m_pResult.defRemainQueue}`;
            this.m_pLbDefeDead.text = `${this.m_pResult.defDead}`;

            let roleKillNum = CommonUtils.numOutLenght(this.m_pResult.roleKillNum);
            let roleLostNum = CommonUtils.numOutLenght(this.m_pResult.roleLostNum);

            this.m_pLbAtk.text = GCodeFromat(CLEnum.WOR_GZ_NUM, roleKillNum);
            this.m_pLbHurt.text = GCodeFromat(CLEnum.WOR_GZ_NUM, roleLostNum);
            this.m_pLbSort.text = `+${this.m_pResult.roleFight}`;

            this.__init_country();

            EventManager.addTouchScaleListener(this.m_pExit, this, e => {
                BattleModel.exitWatchBattle(this.m_pResult.cityId);
                UpManager.history();
            })
        }

        private async __init_result() {
            if (!this.m_pResult.isCross) {
                const ret = this.m_pResult.result
                    , country = RoleData.countryId
                    , atkCountry = this.m_pResult.atkCountry
                    , defCountry = this.m_pResult.defCountry
                    , win = ret == 0 ? atkCountry : defCountry
                if (ret == 0 && atkCountry == country) {
                    this.currentState = "a_succeed"
                } else if (ret == 0 && defCountry == country) {
                    this.currentState = "d_fail"
                    this.m_pAttkCountry.alpha = 0.5;
                    this.m_pDefeCountry.alpha = 0.5;
                    // Utils.setLight(0.65, this.m_pAttkCountry);
                    // Utils.setLight(0.65, this.m_pDefeCountry);
                } else if (ret == 1 && defCountry == country) {
                    this.currentState = "d_succeed"
                } else if (ret == 1 && atkCountry == country) {
                    this.currentState = "a_fail"
                    this.m_pAttkCountry.alpha = 0.5;
                    this.m_pDefeCountry.alpha = 0.5;
                } else {
                    this.currentState = "a_succeed"
                }
                this.m_pWinCountry.source = Utils.getCountyBigiFlagById(win);
            } else {
                const ret = this.m_pResult.result,isAttack = this.m_pResult.isAttack;
                if (ret == 0 && isAttack) {
                    this.currentState = "a_succeed";
                }else if(ret == 0 && !isAttack){
                    this.currentState = "d_fail";
                }else if(ret == 1 && !isAttack){
                    this.currentState = "d_succeed";
                }else if(ret == 1 && isAttack){
                    this.currentState = "a_fail";
                }
                this.commitProperties();

                this.m_pWinCountry.visible = false;
                this.m_pAttkCountry.source = 'common_country4_1_png';
                this.m_pDefeCountry.source = 'common_country4_3_png';
                this.m_lbWf.visible = true;
                this.m_lbDf.visible = true;

                this.m_pLbSort.visible = false;
            }
            // this.m_pLbWinCountryName.visible = win == 4;
        }

        private async __init_country() {
            //跨服战不用跑
            if(this.m_pResult.isCross){
                return ;
            }

            let v = false;
            let atkCountry = this.m_pResult.atkCountry
                , defCountry = this.m_pResult.defCountry

            if (defCountry > 0 && defCountry <= 4) {
                this.m_pDefeCountry.source = Utils.getCountyBigiFlagById(defCountry);
                if (defCountry == 4) {
                    let conf = WorldModel.getCityConfig(this.m_pResult.cityId);
                    // this.m_pLbDefeCountryName.text = GLan(conf.banner);
                    // this.m_pLbWinCountryName.text = GLan(conf.banner);
                    v = true;
                }
            }
            if (atkCountry > 0) {
                this.m_pAttkCountry.source = Utils.getCountyBigiFlagById(atkCountry);
            }
            // this.m_pLbDefeCountryName.visible = v;

        }

    }

}