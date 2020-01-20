module com_main {

    /**
     * 战斗面板
     * @export
     * @class WorldBattlePanel
     * @extends CView
     */
    export class WorldBattlePanel extends CView {

        public static readonly NAME = "WorldBattlePanel";

        private m_pMain: eui.Group;
        private m_pLbNum: eui.Label;
        private m_pBtnClose: eui.Group;
        private m_pBtnLeft: com_main.CImage;
        private m_pBtnRight: com_main.CImage;
        private m_pLbTit: eui.Label;
        private m_pLbTitle: eui.Label;
        private m_pLbTime: eui.Label;
        private m_pImgTime: com_main.CImage;
        private m_pBtnGo: eui.Group;
        private m_aData: ItfAttackEvent[] = [];
        
        private m_nIndex: number = 1;
        private m_nDt: number = 0;
        private m_nType: number = 0;
        private m_nIid: number = 0;
        private m_aMark: egret.Bitmap[] = [];

        public constructor(data:any) {
            super();
            this.name = WorldBattlePanel.NAME;
            this.m_nIid = data.id;
            this.m_nType = data.ty;
    
            this.initApp("world/world_battle_panel.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                // ProtoDef.WORLD_ATTACK_EVENT_LIST,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
			let protocol: number = Number(notification.getName());
			switch (protocol) {
                // case ProtoDef.WORLD_ATTACK_EVENT_LIST: {
                //     let events = WorldModel.getAttackEvent(body.city_event, body.res_event);
                //     this.updateEvent(events);
                //     break;
                // }
			}
        }

        public onDestroy(): void {
            this.m_aMark = [];
            this.m_aData = [];
            Utils.TimerManager.remove(this.update, this);
            super.onDestroy(); 
        }

        protected childrenCreated(): void {
            super.childrenCreated();


            if (this.m_nIid <= 0)
                this.m_aData = WorldModel.getAllAttackEvent();
            else
                this.m_aData = WorldModel.checkAttackEvent(this.m_nIid, this.m_nType);

            this.m_pLbNum.text = `(${this.m_nIndex}/${this.m_aData.length})`
            this._set_mark();

            
            EventManager.addTouchScaleListener(this.m_pBtnClose, this, ()=>{
                UpManager.history();
            })
            EventManager.addTouchScaleListener(this.m_pBtnGo, this, ()=>{
                let event = this.m_aData[this.m_nIndex - 1];
                if (!event) return;
                WorldProxy.send_WORLD_GET_BATTLE_ID(event.id);
            })

            EventManager.addTouchTapListener(this.m_pBtnLeft, this, () => {
                if (this.m_nIndex == 1) return;
                let event = this.m_aData[this.m_nIndex - 2];
                this._set_info(event);
                this.m_nIndex -= 1;
                this.m_pBtnRight.visible = true;
                if (this.m_nIndex == 1)
                    this.m_pBtnLeft.visible = false;
                this.m_pLbNum.text = `(${this.m_nIndex}/${this.m_aData.length})`
                this._set_mark();
            })

            EventManager.addTouchTapListener(this.m_pBtnRight, this, () => {
                if (this.m_nIndex >= this.m_aData.length) return;
                let event = this.m_aData[this.m_nIndex];
                this._set_info(event);
                this.m_nIndex += 1;
                this.m_pBtnLeft.visible = true;
                if (this.m_nIndex == this.m_aData.length)
                    this.m_pBtnRight.visible = false;
                this.m_pLbNum.text = `(${this.m_nIndex}/${this.m_aData.length})`
                this._set_mark();
            })

            this._set_info(this.m_aData[0]);
        }

        public updateEvent(events:ItfAttackEvent[]) {
            for (let event of events.sort(WorldModel.compareAttackEvent)) {
                if (this.m_nIid <= 0)
                    this.m_aData.push(event);
                else if (event.pos == this.m_nIid)
                    this.m_aData.push(event);
            }
            this.m_pLbNum.text = `(${this.m_nIndex}/${this.m_aData.length})`
            this._set_mark()
        }

        /**
         * 设置标志
         * @protected
         * @return void
         * @memberof WorldBattlePanel
         */
        protected _set_mark() {
            let l1 = this.m_aData.length, l2 = this.m_aMark.length;
            if (l1 > l2) {
                for (let i = 0; i < (l1 - l2); i ++) {
                    let spr = new egret.Bitmap();
                    spr.texture = RES.getRes("border_1017_png");
                    Utils.addChild(this.m_pMain, spr);
                    this.m_aMark.push(spr)
                }
            } else if (l1 < l2) {
                let lis = this.m_aMark.splice(0, l2 - l1);
                for (let item of lis) {
                    Utils.removeFromParent(item)
                }
            }
            this.__set_mark_position();
        }

        /**
         * 设置标志位置
         * @protected
         * @return void
         * @memberof WorldBattlePanel
         */
        protected __set_mark_position() {
            let w = 283, h = 335;
            let i = 0, l = this.m_aMark.length;
            for (let item of this.m_aMark) {
                let x = w - (l / 2 - i) * (item.width + 10)
                    , scale = 0.7
                    , alpha = 0.55
                    , h = 333;
                if (i == this.m_nIndex - 1) {
                    scale = 1;
                    alpha = 1;
                    h = 330;
                } else if (i == this.m_nIndex - 2 || i == this.m_nIndex) {
                    scale = 0.85;
                    alpha = 0.65;
                    h = 331.5;
                }

                NodeUtils.setPosAndScale(item, x, h, scale)
                item.alpha = alpha;
                i ++;
            }
        }

        /**
         * 更新事件信息
         * @protected
         * @param  {ItfAttackEvent} event 
         * @return 
         * @memberof WorldBattlePanel
         */
        protected _set_info(event: ItfAttackEvent) {
            if (!event) return;
            // let now = TimerUtils.getServerTime();
            // let gid = event.gid[0], name = GeneralModel.getGeneralName(gid), resName='';

            // if (event.type == 1) {
            //     let conf = C.WorldMapConfig[event.pos];
            //     resName = GLan(conf.name);
            // } else {
            //     let conf = WorldModel.getResEvent(event.pos);
            //     if (conf) {
            //         let resConf = C.AffairsConfig[conf.id];
            //         resName = resConf ? GLan(resConf.name).replace(/[\d]/g, '') : '';
            //     }
            // }

            // Utils.TimerManager.remove(this.update, this);

            // if (now < event.dt) {
            //     this.m_pBtnGo.visible = true;
            //     this.m_pLbTitle.text = `你的武将【${name}】对【${resName}】发起了进攻！`;
            //     this.m_pLbTit.visible = true;
            //     this.m_pLbTime.visible = true;
            //     this.m_pImgTime.visible = true;
            //     this.m_nDt = event.dt - now;
            //     this.m_pLbTime.text = `${this.m_nDt}s`;
            //     Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.update, this, () => {
            //         Utils.TimerManager.remove(this.update, this);
            //         this.m_pLbTime.visible = false;
            //         this.m_pImgTime.visible = false;
            //         this._set_info(this.m_aData[this.m_nIndex - 1]);
            //     });

            // } else {
            //     this.m_nDt = 0;
            //     this.m_pBtnGo.visible = false;
            //     this.m_pLbTitle.text = `你的武将【${name}】正在进攻【${resName}】！`;
            //     this.m_pLbTit.visible = false;
            //     this.m_pLbTime.visible = false;
            //     this.m_pImgTime.visible = false;
            // }
        }


        private update() {
            --this.m_nDt;
            if (this.m_nDt < 0) {
                Utils.TimerManager.remove(this.update, this);
                this.m_pLbTime.visible = false;
                this.m_pImgTime.visible = false;
                this._set_info(this.m_aData[this.m_nIndex - 1]);
                return;
            }

            this.m_pLbTime.text = `${this.m_nDt}s`;
        }


    }

}