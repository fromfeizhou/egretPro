module com_main {

    /**
     * 情报Item
     * @export
     * @class WorldBattleItem
     * @extends eui.ItemRenderer
     */
    export class WorldBattleItem extends eui.ItemRenderer {

        private m_pIco: com_main.CImage;
        private m_pLbTitle: eui.Label;
        private m_pLbContent: eui.Label;
        private m_pLbTime: CLabel;
        private m_pBtnGo: eui.Group;
        private m_pRichText: CCRichText;

        private m_nCityId: number = 0;
        private m_nDt: number = 0;

        public constructor() {
            super();
            this.skinName = Utils.getSkinName("app/world/world_battle_item.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
            this.cacheAsBitmap = true;
        }

        public onDestroy(): void {
            EventManager.removeEventListeners(this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            EventManager.addTouchScaleListener(this.m_pBtnGo, this, this.__on_click);

            this.m_pRichText = new CCRichText(this.m_pLbContent);
            Utils.addChild(this, this.m_pRichText);
        }

        private __on_click(e: egret.Event) {
            WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, this.m_nCityId);
            UpManager.history();
        }

        protected dataChanged() {
            if (this.m_nCityId == this.data.id && !this.data.update) return;

            Utils.TimerManager.remove(this.$update, this)
            
            this.m_nCityId = this.data.id;
            const event = WorldModel.getWarn(this.m_nCityId)
                , config = C.WarningConfig[event.pid];
            if (event.pid == 5) {

            } else {
                let txt = this.__check_args(event.pid, GLan(config.content), ...event.content);
                this.m_pRichText.subText = txt;
                this.m_pLbTitle.text = GLan(config.Types);
            }
            
            if (event.dt > 0) {
                let dt = event.dt - TimerUtils.getServerTime();
                this.m_nDt = dt < 0 ? 0 : dt;
                this.m_pLbTime.visible = true;
                if (this.m_nDt > 0) {
                    this.m_pLbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_TMOVE_TIPS,Utils.DateUtils.getFormatBySecond(this.m_nDt)))

                    Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.$update, this, () => {
                        this.m_pLbTime.visible = false; 
                    });
                }
            } else {
                this.m_pLbTime.visible = false;
            }
            this.m_pIco.source = `${config.iconID}_png`;
            
        }

        protected $update() {
            -- this.m_nDt;
            if (this.m_nDt <= 0)  {
                return;
            }
            this.m_pLbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_TMOVE_TIPS,Utils.DateUtils.getFormatBySecond(this.m_nDt)))
        }

        private __check_args(pid, content, ...args): string {
            const checkNum = (str: string) => {
                let count = 0,
                    pos = str.indexOf("%s");
                while(pos !== -1) {
                    count ++;
                    pos = str.indexOf("%s", pos+1);
                }
                return count;
            }
            , checkBatt = (num: number) => {
                if (num < 10000) return "" + num;
                return `${Math.floor(num/10000)} ${GCode(CLEnum.NUM_WAN)}`;
            }
            , checkCity = (cid: number) => {
                let conf = C.WorldMapConfig[cid];
                return GLan(conf.name);
            }
            , checkCountry = (country: number) => {
                let text = ""
                switch (country) {
                    case 1:
                        text = GCode(CLEnum.STATE_WEI);
                        break;
                    case 2:
                        text = GCode(CLEnum.STATE_SHU);
                        break;
                    case 3:
                        text = GCode(CLEnum.STATE_WU);
                        break;
                    case 6:
                        text=GCode(CLEnum.STATE_HUANG_TROOP)
                }
                return text;
            }

            if (checkNum(content) != args.length) {
                error("====__check_args args is err====================", pid, args);
                return "";
            }
            let c = "";
            if (pid == 1 || pid == 2) {
                let [batt, cid] = args;
                c = StringUtils.stringFormat(content, GCodeFromat(CLEnum.WOR_TEAM_NUM,checkBatt(batt)), checkCity(cid));
            } else if (pid == 3) {
                let [cid] = args;
                c = StringUtils.stringFormat(content, checkCity(cid));
            } else if (pid == 4 || pid == 6) {
                let [cid, country] = args;
                c = StringUtils.stringFormat(content, checkCity(cid), checkCountry(country));
            }
            return c;
        }

    }


}