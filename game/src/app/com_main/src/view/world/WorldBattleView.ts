module com_main {

    /**
     * 情报面板
     * @export
     * @class WorldBattleView
     * @extends CView
     */
    export class WorldBattleView extends CView {

        public static readonly NAME = "WorldBattleView";

        private m_pScroller: eui.Scroller;
        private m_pList: eui.List;
        private m_pBtnClose: eui.Group;

        private m_pCollection: eui.ArrayCollection;



        public constructor(data: any) {
            super();
            this.name = WorldBattleView.NAME;

            this.initApp("world/world_battle_view.exml");
        }
        protected listenerProtoNotifications(): any[] {
            return [
                ProtoDef.S2C_WORLDMAP_INFORMATION,
            ];
        }
        /**处理协议号事件 */
        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_WORLDMAP_INFORMATION: {
                    this.__init_list();
                    break;
                }
            }
        }
        protected $initEvent() {
            // EventMgr.addEvent(TaskWorldEvent.WARN_UPDATE, (data) => {
            //     const cid = data.cid;
            //     let index = this.__get_item_index(cid);

            //     if (data.del) {
            //         if (index == -1) return;
            //         this.m_pCollection.removeItemAt(index);
            //     } else {
            //         if (index == -1) {
            //             this.m_pCollection.addItemAt({ id: cid }, 0);
            //         } else if (index == 0) {
            //             this.m_pCollection.replaceItemAt({ id: cid, update: true }, 0)
            //         } else {
            //             this.m_pCollection.removeItemAt(index);
            //             this.m_pCollection.addItemAt({ id: cid }, 0);
            //         }
            //     }
            // }, this)
        }

        protected $removeEvent() {
            // EventMgr.removeEventByObject(TaskWorldEvent.WARN_UPDATE, this);
        }

        public onDestroy(): void {
            EventManager.removeEventListener(this.m_pBtnClose);
            this.$removeEvent();
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.$initEvent();
            SoundData.setSound(this.m_pBtnClose, SoundData.SOUND_CANCEL);
            EventManager.addTouchScaleListener(this.m_pBtnClose, this, () => {
                UpManager.history();
            })

            // this.__init_list();
        }

        /**
         * 初始化列表
         * @private
         * @return void
         * @memberof WorldBattlePanel
         */
        private __init_list(): void {
            const events = WorldModel.getWarns();

            let arr: ItfWarnItem[] = [];
            for (let id in events) {
                arr.push(events[id])
            }

            arr.sort((a, b) => {
                if (a.startdt < b.startdt) return 1;
                else if (a.startdt > b.startdt) return -1;
                return 0;
            })

            let data: any[] = [];
            for (let o of arr) {
                data.push({ id: o.cityId })
            }

            this.m_pCollection = new eui.ArrayCollection(data);
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = WorldBattleItem;
        }

        private __get_item_index(cid: number): number {
            let index = -1;
            for (let i = 0; i < this.m_pCollection.length; i++) {
                let data = this.m_pCollection.getItemAt(i);
                if (data.id == cid) {
                    index = i;
                    break;
                }
            }
            return index;
        }


    }

}