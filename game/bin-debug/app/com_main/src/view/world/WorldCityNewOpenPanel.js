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
    var WorldCityNewOpenPanel = /** @class */ (function (_super_1) {
        __extends(WorldCityNewOpenPanel, _super_1);
        function WorldCityNewOpenPanel(data) {
            var _this = _super_1.call(this) || this;
            _this.LINE_COUNT = 5;
            _this.ITEM_INTERVAL = 20;
            _this.ITEM_WIDTH = 100;
            _this.ITEM_HEIGHT = 100;
            _this.m_cityId = data.cityId;
            _this.initApp("world/WorldCityNewOpenPanelSkin.exml");
            return _this;
        }
        WorldCityNewOpenPanel.prototype.onDestroy = function () {
            var _this = this;
            this.m_nTimeOutId = egret.setTimeout(function () {
                com_main.EventMgr.dispatchEvent(TaskWorldEvent.WORLD_CITY_RES_UPDATE, _this.m_cityId);
                egret.clearTimeout(_this.m_nTimeOutId);
                _this.clearItemAct(_this.m_tItemList);
                _this.clearItemAct(_this.m_tFlyList);
                _super_1.prototype.onDestroy.call(_this);
            }, this, 400);
            egret.Tween.removeTweens(this.m_touchGroup);
        };
        /**清理动画 */
        WorldCityNewOpenPanel.prototype.clearItemAct = function (list) {
            if (!list)
                return;
            for (var i = 0; i < list.length; i++) {
                egret.Tween.removeTweens(list[i]);
            }
            list = null;
        };
        WorldCityNewOpenPanel.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.initEvent();
            this.updateUI();
        };
        WorldCityNewOpenPanel.prototype.updateUI = function () {
            var worldMapCfg = C.WorldMapConfig[this.m_cityId];
            if (isNull(worldMapCfg))
                return;
            this.m_tFlyList = [];
            this.initData(worldMapCfg.unlockReward);
            this.m_touchGroup.alpha = 0;
            this.m_touchGroup.scaleX = 0.1;
            this.m_touchGroup.scaleY = 1;
            this.m_pName.text = GLan(worldMapCfg.name);
            egret.Tween.get(this.m_touchGroup).wait(100).to({ scaleX: 1, alpha: 1 }, 200).call(function () {
            }, this);
        };
        /**数据初始化 */
        WorldCityNewOpenPanel.prototype.initData = function (data) {
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
        /**飞行结束 */
        WorldCityNewOpenPanel.prototype.onflyEnd = function (item) {
            for (var i = 0; i < this.m_tFlyList.length; i++) {
                if (this.m_tFlyList[i].item.itemId == item.itemId) {
                    this.m_tFlyList.splice(i, 1);
                    break;
                }
            }
            if (this.m_tFlyList.length > 0)
                return;
            if (this.m_tRewardList.length == 0 && this.m_tItemList.length == 0) {
                this.onHandler();
            }
        };
        WorldCityNewOpenPanel.prototype.createItemList = function () {
            var itemCount = this.m_tRewardList.length;
            var list = this.m_tRewardList.splice(0, itemCount);
            var posList = this.getPosList(itemCount);
            this.m_tItemList = [];
            for (var i = 0; i < itemCount; i++) {
                var pos = posList[i];
                var item = com_main.ComItemNew.create("name_num");
                item.anchorOffsetX = this.ITEM_WIDTH * 0.5;
                item.anchorOffsetY = this.ITEM_HEIGHT * 0.5;
                item.setItemInfo(list[i].itemId, list[i].count);
                item.x = pos.x;
                item.y = pos.y;
                this.m_RewardRoot.addChildAt(item, 0);
                this.m_tItemList.push(item);
            }
        };
        /**获得位置列表 */
        WorldCityNewOpenPanel.prototype.getPosList = function (itemCount) {
            var posList = [];
            var centreX = this.m_RewardRoot.width * 0.5;
            var centreY = this.ITEM_HEIGHT / 2;
            var startX = centreX - (itemCount * (this.ITEM_WIDTH + this.ITEM_INTERVAL) - this.ITEM_INTERVAL) * 0.5 + this.ITEM_WIDTH * 0.5;
            for (var i = 0; i < itemCount; i++) {
                posList.push({ x: startX + i * (this.ITEM_WIDTH + this.ITEM_INTERVAL), y: centreY });
            }
            return posList;
        };
        /**=====================================================================================
       * 事件监听 begin
       * =====================================================================================
       */
        WorldCityNewOpenPanel.prototype.initEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_pBtnShowNext, this, this.onClickMask);
        };
        //显示
        WorldCityNewOpenPanel.prototype.onClickMask = function (e) {
            this.doFlyAction();
        };
        /**飞行动画 */
        WorldCityNewOpenPanel.prototype.doFlyAction = function () {
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
            for (var i = 0; i < this.m_tItemList.length; i++) {
                _loop_1(i);
            }
            this.m_tItemList = [];
        };
        /**跳转前往 */
        WorldCityNewOpenPanel.prototype.onHandler = function () {
            var _this = this;
            if (this.m_touchGroup)
                egret.Tween.get(this.m_touchGroup).to({ scaleX: 0.1, scaleY: 0.1, alpha: 0.1 }, 200).call(function () {
                }, this);
            this.m_nTimeCloseId = egret.setTimeout(function () {
                egret.clearTimeout(_this.m_nTimeCloseId);
                com_main.UpManager.history();
            }, this, 200);
        };
        WorldCityNewOpenPanel.NAME = 'WorldCityNewOpenPanel';
        return WorldCityNewOpenPanel;
    }(com_main.CView));
    com_main.WorldCityNewOpenPanel = WorldCityNewOpenPanel;
})(com_main || (com_main = {}));
