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
    var MainTopNew = /** @class */ (function (_super_1) {
        __extends(MainTopNew, _super_1);
        function MainTopNew() {
            var _this = _super_1.call(this) || this;
            _this.name = MainTopNew.NAME;
            _this.skinName = Utils.getSkinName("app/top_new/new_top_main.exml");
            return _this;
        }
        MainTopNew.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_BtnBack["sound_cancel"] = SoundData.getCancelSound();
            com_main.EventManager.addTouchScaleListener(this.m_BtnBack, this, this.onClickBack);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_RESOURCE, this.onRoleResource, this);
            com_main.EventMgr.addEvent(EventEnum.PROP_ITEM_CHANGE, this.onRoleResource, this);
            Utils.toStageBestScale(this.m_groupSource);
            this.m_autoRefresh = true;
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        };
        MainTopNew.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_RESOURCE, this);
            com_main.EventMgr.removeEventByObject(EventEnum.PROP_ITEM_CHANGE, this);
            _super_1.prototype.onDestroy.call(this);
        };
        MainTopNew.prototype.setExitCallBack = function (callback, obj) {
            this.onClickBackHandler = callback;
            this.onClickBackHandlerObj = obj;
        };
        MainTopNew.prototype.onClickBack = function () {
            if (this.onClickBackHandler) {
                this.onClickBackHandler.call(this.onClickBackHandlerObj);
                return;
            }
            com_main.UpManager.history();
        };
        /**设置标题 */
        MainTopNew.prototype.setTitleName = function (name) {
            this.m_TileName.text = name;
        };
        /**设置资源栏 */
        MainTopNew.prototype.setResources = function (sources) {
            if (PlatConst.isRmbPay()) {
                var index = sources.indexOf(PropEnum.YU);
                if (index >= 0)
                    sources.splice(index, 1);
            }
            Utils.removeAllChild(this.m_groupSource);
            for (var i = 0; i < sources.length; i++) {
                var id = sources[i];
                var item = new com_main.TopSourceItem(id);
                this.m_groupSource.addChild(item);
            }
        };
        Object.defineProperty(MainTopNew.prototype, "autoRefresh", {
            get: function () {
                return this.m_autoRefresh;
            },
            /**资源刷新标记 */
            set: function (val) {
                this.m_autoRefresh = val;
            },
            enumerable: true,
            configurable: true
        });
        /**获得资源组件 */
        MainTopNew.prototype.getSourceItem = function (id) {
            for (var i = 0; i < this.m_groupSource.numChildren; i++) {
                var item = this.m_groupSource.getChildAt(i);
                if (item && item.itemId == id) {
                    return item;
                }
            }
            return null;
        };
        /**资源刷新 */
        MainTopNew.prototype.onRoleResource = function (sourceId) {
            if (!this.m_autoRefresh)
                return;
            var item = this.getSourceItem(sourceId);
            if (item) {
                item.refreshNum();
            }
        };
        MainTopNew.getMainTopNew = function (panel) {
            if (panel) {
                return (panel.getChildByName(MainTopNew.NAME));
            }
            return null;
        };
        MainTopNew.prototype.getBackBtn = function () {
            return this.m_BtnBack;
        };
        MainTopNew.NAME = "MainTopNew";
        return MainTopNew;
    }(com_main.CComponent));
    com_main.MainTopNew = MainTopNew;
})(com_main || (com_main = {}));
