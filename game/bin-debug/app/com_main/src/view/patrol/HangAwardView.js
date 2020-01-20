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
    var HangAwardView = /** @class */ (function (_super_1) {
        __extends(HangAwardView, _super_1);
        function HangAwardView(data) {
            var _this = _super_1.call(this) || this;
            _this.ITEM_COUNT = 10;
            _this.ITEM_INTERVAL = 50;
            _this.ITEM_WIDTH = 100;
            _this.ITEM_HEIGHT = 100;
            // private m_tWaitList: ComItemNew[];      //等待点击
            _this.m_flyCout = 0;
            _this.timeKey = 0;
            _this.dt = 0;
            _this.name = HangAwardView.NAME;
            _this.initApp("patrol/HangAwardViewSkin.exml");
            _this.initData(data);
            return _this;
        }
        HangAwardView.prototype.onDestroy = function () {
            Utils.TimerManager.remove(this.timeCallback, this);
            this.clearItemAct(this.m_tItemList);
            this.clearItemAct(this.m_tFlyList);
            egret.clearTimeout(this.timeKey);
            if (this.m_pRoot)
                egret.Tween.removeTweens(this.m_pRoot);
            if (this.m_bg)
                egret.Tween.removeTweens(this.m_bg);
            _super_1.prototype.onDestroy.call(this);
        };
        /**清理动画 */
        HangAwardView.prototype.clearItemAct = function (list) {
            if (!list)
                return;
            for (var i = 0; i < list.length; i++) {
                egret.Tween.removeTweens(list[i]);
            }
            list = null;
        };
        HangAwardView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_tFlyList = [];
            this.refresh();
            this.initEvent();
            this.dt = 0;
            this.m_pTtime.text = Utils.DateUtils.getFormatBySecond(this.dt, 1);
            Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
        };
        HangAwardView.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnShowNext, this, this.onClickMask);
        };
        //显示
        HangAwardView.prototype.onClickMask = function (e) {
            // UpManager.history();
            // if (this.m_bShowAction) return;
            this.doFlyAction();
        };
        /**飞行动画 */
        HangAwardView.prototype.doFlyAction = function () {
            var _this = this;
            var _loop_1 = function (i) {
                var item = this_1.m_tItemList[i];
                var tmpScrPos = egret.Point.create(item.x, item.y);
                var tmpCtrlPos = egret.Point.create(item.x - 100, item.y + (250 * (i % 2 == 1 ? -1 : 1)));
                var tmpDstPos = egret.Point.create(1334, 520);
                var itemObj = { item: item, lerp: 0 };
                funcChange = function () {
                    var curPos = Utils.BezierCurve(tmpScrPos, tmpDstPos, tmpCtrlPos, itemObj.lerp);
                    itemObj.item.x = curPos.x;
                    itemObj.item.y = curPos.y;
                    egret.Point.release(curPos);
                };
                var tw = egret.Tween.get(itemObj, { onChange: funcChange });
                tw.wait(i * 100);
                tw.to({ lerp: 1 }, 500);
                //对象回收
                tw.call(function () {
                    egret.Point.release(tmpScrPos);
                    egret.Point.release(tmpCtrlPos);
                    egret.Point.release(tmpDstPos);
                }, this_1);
                tw.call(this_1.onflyEnd, this_1, [itemObj.item]);
                this_1.m_tFlyList.push(itemObj);
            };
            var this_1 = this, funcChange;
            // if (this.m_bFlyAction) return;
            // this.m_bFlyAction = true;
            for (var i = 0; i < this.m_tItemList.length; i++) {
                _loop_1(i);
            }
            this.m_tItemList = [];
            if (this.m_tRewardList.length <= 0) {
                egret.Tween.get(this.m_pRoot).to({ alpha: 0 }, 800).call(function () {
                    egret.Tween.removeTweens(_this.m_pRoot);
                });
                egret.Tween.get(this.m_bg).to({ alpha: 0 }, 800).call(function () {
                    egret.Tween.removeTweens(_this.m_bg);
                });
            }
        };
        /**飞行结束 */
        HangAwardView.prototype.onflyEnd = function (item) {
            var _this = this;
            this.m_flyCout++;
            for (var i = 0; i < this.m_tFlyList.length; i++) {
                if (this.m_tFlyList[i].item.itemId == item.itemId) {
                    this.m_tFlyList.splice(i, 1);
                    break;
                }
            }
            if (this.m_tFlyList.length > 0)
                return;
            if (this.m_flyCout == this.ITEM_COUNT && this.m_tRewardList.length > 0) {
                this.createItemList();
                this.timeKey = egret.setTimeout(function () {
                    _this.doFlyAction();
                }, this, 500);
                return;
            }
            // this.m_bFlyAction = false;
            /**动画结束 */
            if (this.m_tRewardList.length == 0 && this.m_tItemList.length == 0) {
                //关闭界面
                com_main.UpManager.history();
            }
        };
        HangAwardView.prototype.timeCallback = function () {
            this.dt++;
            this.m_pTtime.text = Utils.DateUtils.getFormatBySecond(this.dt, 1);
        };
        /**数据初始化 */
        HangAwardView.prototype.initData = function (data) {
            this.m_tRewardList = [];
            if (data) {
                if (typeof (data) == "string") {
                    data = Utils.parseCommonItemJson(data);
                }
                var resId = [];
                for (var key in data) {
                    var info = data[key];
                    var index = resId.indexOf(info.itemId);
                    if (index >= 0) {
                        if (this.m_tRewardList[index].count) {
                            this.m_tRewardList[index].count = info.count;
                        }
                        else {
                            this.m_tRewardList[index].count += info.count;
                        }
                    }
                    else {
                        resId.push(data[key].itemId);
                        if (info) {
                            this.m_tRewardList.push(info);
                        }
                        else {
                            var tmpData = info;
                            var tmpInfo = { itemId: tmpData.itemId, count: tmpData.count };
                            this.m_tRewardList.push(tmpInfo);
                        }
                    }
                }
            }
            this.createItemList();
        };
        HangAwardView.prototype.createItemList = function () {
            var itemCount = this.m_tRewardList.length;
            itemCount = itemCount > this.ITEM_COUNT ? this.ITEM_COUNT : itemCount;
            var list = this.m_tRewardList.splice(0, itemCount);
            var posList = this.getPosList(itemCount);
            this.m_tItemList = [];
            for (var i = 0; i < itemCount; i++) {
                var pos = posList[i];
                var item = com_main.ComItemNew.create("name_num");
                item.anchorOffsetX = this.ITEM_WIDTH * 0.5;
                item.anchorOffsetY = this.ITEM_HEIGHT * 0.5;
                item.setItemInfo(list[i].itemId, list[i].count);
                item.x = pos.x + this.ITEM_WIDTH;
                item.y = pos.y;
                item.alpha = 0;
                var tw = egret.Tween.get(item);
                tw.wait(100 * i);
                tw.to({ x: pos.x, alpha: 1 }, 200, egret.Ease.cubicIn);
                tw.call(this.onActionEnd, this, [item]);
                this.m_itemRoot.addChildAt(item, 0);
                this.m_tItemList.push(item);
            }
        };
        /**道具动画结束 */
        HangAwardView.prototype.onActionEnd = function (item) {
            egret.Tween.removeTweens(item);
        };
        /**获得位置列表 */
        HangAwardView.prototype.getPosList = function (itemCount) {
            // itemCount > this.LINE_COUNT ? this.LINE_COUNT : itemCount;
            var posList = [];
            var centreX = this.m_itemRoot.width * 0.5;
            var centreY = this.ITEM_HEIGHT / 2;
            var startX = 0;
            var count = 0;
            for (var i = 0; i < itemCount; i++) {
                if (itemCount < 5) {
                    startX = centreX - (itemCount * (this.ITEM_WIDTH + this.ITEM_INTERVAL) - this.ITEM_INTERVAL) * 0.5 + this.ITEM_WIDTH * 0.5;
                    posList.push({ x: startX + i * (this.ITEM_WIDTH + this.ITEM_INTERVAL), y: centreY });
                    continue;
                }
                centreY = i >= 5 ? this.ITEM_HEIGHT * 1.5 + 50 : 50;
                count = i >= 5 ? (itemCount - 5) : 5;
                startX = centreX - (count * (this.ITEM_WIDTH + this.ITEM_INTERVAL) - this.ITEM_INTERVAL) * 0.5 + this.ITEM_WIDTH * 0.5;
                posList.push({ x: startX + i % 5 * (this.ITEM_WIDTH + this.ITEM_INTERVAL), y: centreY });
            }
            return posList;
        };
        /**刷新面板 */
        HangAwardView.prototype.refresh = function () {
            this.m_apopUp.titleShow = false;
            this.m_apopUp.getCloseBtn().visible = false;
            this.m_apopUp.setTitleLabelVisible(false);
        };
        HangAwardView.NAME = "HangAwardView";
        return HangAwardView;
    }(com_main.CView));
    com_main.HangAwardView = HangAwardView;
})(com_main || (com_main = {}));
