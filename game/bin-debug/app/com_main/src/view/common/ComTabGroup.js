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
    /**侧导航栏 */
    var ComTabGroup = /** @class */ (function (_super_1) {
        __extends(ComTabGroup, _super_1);
        function ComTabGroup() {
            return _super_1.call(this) || this;
            // this.skinName = Utils.getAppSkin("common/com_tab_group.exml");
        }
        ComTabGroup.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            if (this.m_tabBtn) {
                this.m_tabBtn.removeEventListener(egret.Event.CHANGE, this.onTabBtnClick, this);
            }
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        ComTabGroup.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        ComTabGroup.prototype.partAdded = function (partName, instance) {
            _super_1.prototype.partAdded.call(this, partName, instance);
            if (instance == this.m_tabBtn) {
                this.m_tCollection = new eui.ArrayCollection();
                this.m_tabBtn.dataProvider = this.m_tCollection;
                this.m_tabBtn.addEventListener(egret.Event.CHANGE, this.onTabBtnClick, this);
                //复用 显示对象关闭 使数据位置与ui位置一致 外部访问ui使用
                this.m_tabBtn.useVirtualLayout = false;
            }
        };
        /**设置排版格式 和 按钮皮肤
        * @param skinName (tab_btntop_render tab_btntop_renderII)
        */
        ComTabGroup.prototype.setTabBtnSkin = function (skinName) {
            if (skinName === void 0) { skinName = "tab_btntop_render"; }
            this.m_tabBtn.itemRendererSkinName = skinName;
        };
        /**
         * 设置切卡回调
         */
        ComTabGroup.prototype.setChangeCallback = function (callback, thisArg) {
            this.m_changeCallback = callback;
            this.m_changeThisArg = thisArg;
        };
        /**
        *  添加按钮
        * @param data 通用 {name:xxx}
        */
        ComTabGroup.prototype.addTabBtnData = function (data) {
            this.m_tCollection.addItem(data);
            this.commitProperties();
        };
        /**
       *  移除按钮
       * @param data 通用 {name:xxx}
       */
        ComTabGroup.prototype.delTabBtnData = function (index) {
            this.m_tCollection.removeItemAt(index);
            this.commitProperties();
        };
        /**
       *  初始化按钮
       * @param data 通用 {name:xxx}
       */
        ComTabGroup.prototype.initNorTabBtns = function (tags) {
            this.clearTabBtn();
            for (var i = 0; i < tags.length; i++) {
                this.addTabBtnData({ name: tags[i] });
            }
            this.validateNow();
        };
        /**清理 */
        ComTabGroup.prototype.clearTabBtn = function () {
            this.m_tabBtn.selectedIndex = -1;
            this.m_tCollection.removeAll();
        };
        /**替换数据 */
        ComTabGroup.prototype.resetTabBtnData = function (data, index) {
            var tempData = this.m_tCollection.replaceItemAt(data, index);
            this.m_tCollection.itemUpdated(tempData);
        };
        /**设置切卡回调 */
        ComTabGroup.prototype.onTabBtnClick = function (e) {
            var selectedIndex = e.currentTarget.selectedIndex;
            if (this.m_changeCallback && this.m_changeThisArg) {
                com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_TOUCH_FINISH, null);
                this.m_changeCallback.call(this.m_changeThisArg, selectedIndex);
            }
            Sound.playTap();
        };
        Object.defineProperty(ComTabGroup.prototype, "selectedIndex", {
            get: function () {
                if (this.m_tabBtn) {
                    return this.m_tabBtn.selectedIndex;
                }
                return 0;
            },
            // /**下标 */
            set: function (id) {
                this.m_tabBtn.selectedIndex = id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ComTabGroup.prototype, "dataNum", {
            /**获得数据长度 */
            get: function () {
                return (this.m_tCollection && this.m_tCollection.source.length) || 0;
            },
            enumerable: true,
            configurable: true
        });
        /**滑动距离 */
        ComTabGroup.prototype.setScorllorV = function (index) {
            if (this.m_pScroll) {
                return this.m_pScroll.scrollTo(this.m_tabBtn, index);
            }
        };
        Object.defineProperty(ComTabGroup.prototype, "selName", {
            /**获得当前选中 节点名字 */
            get: function () {
                if (!this.m_tCollection)
                    return '';
                var data = this.m_tCollection.getItemAt(this.m_tabBtn.selectedIndex);
                return data ? data.name : '';
            },
            enumerable: true,
            configurable: true
        });
        /**获取对应节点下标 */
        ComTabGroup.prototype.getIndexByName = function (name) {
            for (var i = 0; i < this.m_tCollection.source.length; i++) {
                var data = this.m_tCollection.source[i];
                if (data.name == name) {
                    return i;
                }
            }
            return 0;
        };
        /**获得对应的tab组件 */
        ComTabGroup.prototype.getTabBtnByName = function (name) {
            for (var i = 0; i < this.m_tCollection.source.length; i++) {
                var data = this.m_tCollection.source[i];
                if (data.name == name) {
                    return this.m_tabBtn.getElementAt(i);
                }
            }
            this.m_tabBtn.getElementAt(0);
        };
        return ComTabGroup;
    }(com_main.CComponent));
    com_main.ComTabGroup = ComTabGroup;
})(com_main || (com_main = {}));
