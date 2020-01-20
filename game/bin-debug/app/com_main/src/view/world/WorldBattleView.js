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
     * 情报面板
     * @export
     * @class WorldBattleView
     * @extends CView
     */
    var WorldBattleView = /** @class */ (function (_super_1) {
        __extends(WorldBattleView, _super_1);
        function WorldBattleView(data) {
            var _this = _super_1.call(this) || this;
            _this.name = WorldBattleView.NAME;
            _this.initApp("world/world_battle_view.exml");
            return _this;
        }
        WorldBattleView.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_WORLDMAP_INFORMATION,
            ];
        };
        /**处理协议号事件 */
        WorldBattleView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_WORLDMAP_INFORMATION: {
                    this.__init_list();
                    break;
                }
            }
        };
        WorldBattleView.prototype.$initEvent = function () {
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
        };
        WorldBattleView.prototype.$removeEvent = function () {
            // EventMgr.removeEventByObject(TaskWorldEvent.WARN_UPDATE, this);
        };
        WorldBattleView.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this.m_pBtnClose);
            this.$removeEvent();
            _super_1.prototype.onDestroy.call(this);
        };
        WorldBattleView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.$initEvent();
            SoundData.setSound(this.m_pBtnClose, SoundData.SOUND_CANCEL);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnClose, this, function () {
                com_main.UpManager.history();
            });
            // this.__init_list();
        };
        /**
         * 初始化列表
         * @private
         * @return void
         * @memberof WorldBattlePanel
         */
        WorldBattleView.prototype.__init_list = function () {
            var events = WorldModel.getWarns();
            var arr = [];
            for (var id in events) {
                arr.push(events[id]);
            }
            arr.sort(function (a, b) {
                if (a.startdt < b.startdt)
                    return 1;
                else if (a.startdt > b.startdt)
                    return -1;
                return 0;
            });
            var data = [];
            for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
                var o = arr_1[_i];
                data.push({ id: o.cityId });
            }
            this.m_pCollection = new eui.ArrayCollection(data);
            this.m_pList.dataProvider = this.m_pCollection;
            this.m_pList.itemRenderer = com_main.WorldBattleItem;
        };
        WorldBattleView.prototype.__get_item_index = function (cid) {
            var index = -1;
            for (var i = 0; i < this.m_pCollection.length; i++) {
                var data = this.m_pCollection.getItemAt(i);
                if (data.id == cid) {
                    index = i;
                    break;
                }
            }
            return index;
        };
        WorldBattleView.NAME = "WorldBattleView";
        return WorldBattleView;
    }(com_main.CView));
    com_main.WorldBattleView = WorldBattleView;
})(com_main || (com_main = {}));
