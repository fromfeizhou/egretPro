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
    var DropList = /** @class */ (function (_super_1) {
        __extends(DropList, _super_1);
        function DropList() {
            var _this = _super_1.call(this) || this;
            _this.itemWidth = 50;
            _this.itemNum = 1;
            _this.isExpand = false;
            // this.initCom("DropList.exml");
            // this.once(egret.Event.ADDED_TO_STAGE, this.onAddStage, this);
            _this.skinName = Utils.getComSkin("DropList.exml");
            _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddStage, _this);
            return _this;
        }
        DropList.prototype.onAddStage = function () {
        };
        DropList.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.spMask = new egret.Shape();
            this.spMask.graphics.beginFill(0x000000);
            this.spMask.graphics.drawRect(this.scView.x, this.scView.y, 200, 50);
            this.spMask.graphics.endFill();
            this.addChild(this.spMask);
            this.mask = this.spMask;
            this.refreshExpand();
            this.listView.itemRenderer = com_main.DropItem;
            this.listView.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onItemTap, this);
        };
        DropList.prototype.refreshExpand = function () {
            // this.scView.viewport.scrollV = 0;
            var vh = this.itemWidth;
            if (this.isExpand) {
                // this.scView.viewport.scrollV = 0;
                // this.spMask.height = this.itemWidth * this.itemNum;
                // this.scView.viewport.height = this.itemWidth * this.itemNum;
                vh = this.itemWidth * this.itemNum;
            }
            else {
                // this.spMask.height = this.itemWidth;
                // this.scView.viewport.height = this.itemWidth;
                vh = this.itemWidth;
            }
            debug("this.itemNum : " + this.itemNum + " vh : " + vh + " this.scView : " + this.scView.height);
            this.spMask.graphics.clear();
            this.spMask.graphics.beginFill(0x000000);
            this.spMask.graphics.drawRect(this.scView.x, this.scView.y, 200, vh);
            this.spMask.graphics.endFill();
        };
        DropList.prototype.onItemTap = function (e) {
            // debug(this.listView.selectedItem, this.listView.selectedIndex)
            this.isExpand = !this.isExpand;
            this.refreshExpand();
            if (!this.isExpand) {
                this.scView.viewport.scrollV = this.listView.selectedIndex * this.itemWidth;
                if (this.m_pItemTapCallback) {
                    this.m_pItemTapCallback.call(this.m_pObject, this.listView.selectedIndex);
                }
            }
            else {
                this.scView.viewport.scrollV = 0;
            }
            debug("sch : " + this.scView.height);
            debug("scvpv : " + this.scView.viewport.scrollV);
        };
        DropList.prototype.setItemTapCallback = function (callback, object) {
            this.m_pItemTapCallback = callback;
            this.m_pObject = object;
        };
        DropList.prototype.setArrayCollection = function (sourceArr) {
            var ac = new eui.ArrayCollection(sourceArr);
            this.listView.dataProvider = ac;
            this.itemNum = ac.length;
        };
        DropList.prototype.showItem = function (index) {
            this.scView.viewport.scrollV = index * this.itemWidth;
        };
        return DropList;
    }(com_main.CComponent));
    com_main.DropList = DropList;
})(com_main || (com_main = {}));
