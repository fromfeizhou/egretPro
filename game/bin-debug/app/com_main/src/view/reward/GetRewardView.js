// / 单个物品变更结果
// message ValuesMessage {
// 	required int32 operate = 1; 	//物品操作 0修改，1删除 ，2新建
// 	required int32 baseType = 2; 	//物品类型:1数值类型例如，银两，金币，经验 2道具
// 	required int32 itemId = 3; 		//编码，例如:道具id,装备id,资源id link ItemConfig.id
// 	required int64 count = 4; 		//数量
// 	optional int32 position = 5; 	// 位置，例如：背包格子id,装备位置,根据物品类型决定
// 	optional int64 uuid = 6; // 物品的唯一id，不一定有值
// }
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
    /**奖励飞行动画化全局管理器 */
    var GetAwardFlyUtil = /** @class */ (function () {
        function GetAwardFlyUtil() {
        }
        GetAwardFlyUtil.addItem = function (item) {
            this.state = !this.state;
            item.unAutoRemove = true;
            var pos = item.parent.localToGlobal(item.x, item.y);
            var layer = SceneManager.getLayer(LayerEnums.TOP);
            layer.globalToLocal(pos.x, pos.y, pos);
            layer.addChild(item);
            item.x = pos.x;
            item.y = pos.y;
            item.unAutoRemove = null;
            var tmpScrPos = egret.Point.create(item.x, item.y);
            var tmpCtrlPos = egret.Point.create(item.x - 100, item.y + (250 * (this.state ? -1 : 1)));
            var tmpDstPos = egret.Point.create(GameConfig.curWidth(), GameConfig.curHeight());
            var itemObj = { item: item, lerp: 0 };
            var funcChange = function () {
                var curPos = Utils.BezierCurve(tmpScrPos, tmpDstPos, tmpCtrlPos, itemObj.lerp);
                itemObj.item.x = curPos.x;
                itemObj.item.y = curPos.y;
                egret.Point.release(curPos);
            };
            var tw = egret.Tween.get(itemObj, { onChange: funcChange });
            tw.to({ lerp: 1 }, 500);
            //对象回收
            tw.call(function () {
                egret.Point.release(tmpScrPos);
                egret.Point.release(tmpCtrlPos);
                egret.Point.release(tmpDstPos);
                Utils.removeFromParent(item);
            }, this);
        };
        return GetAwardFlyUtil;
    }());
    /**
     * 奖励获取面板相关
     */
    var GetRewardView = /** @class */ (function (_super_1) {
        __extends(GetRewardView, _super_1);
        function GetRewardView() {
            var _this = _super_1.call(this) || this;
            _this.LINE_COUNT = 5;
            _this.ITEM_INTERVAL = 50;
            _this.ITEM_WIDTH = 100;
            _this.ITEM_HEIGHT = 100;
            _this.ITEM_OFFSET = 50;
            _this.name = GetRewardView.NAME;
            _this.initApp("reward/GetRewardViewSkin.exml");
            return _this;
        }
        GetRewardView.getInstance = function () {
            if (!this.instance) {
                this.instance = new GetRewardView();
            }
            return this.instance;
        };
        /**数据初始化 */
        GetRewardView.prototype.show = function (data) {
            if (!data)
                return;
            if (typeof (data) == "string" && data == '')
                return;
            if (data.length == 0)
                return;
            if (this.m_tRewardList)
                return;
            this.m_bg.alpha = 1;
            this.m_tItemList = [];
            this.m_tWaitList = [];
            this.m_tRewardList = [];
            this.m_bShowAction = true;
            this.m_pShowAni.addEventListener("complete", this.onBgAniFinish, this);
            this.m_pShowAni.play(0);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnShowNext, this, this.onClickMask);
            if (data) {
                if (typeof (data) == "string") {
                    data = Utils.parseCommonItemJson(data);
                }
                var resId = [];
                for (var key in data) {
                    var info = data[key];
                    var index = resId.indexOf(info.itemId);
                    if (index >= 0) {
                        this.m_tRewardList[index].count += info.count;
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
            com_main.UpManager.popView(this, com_main.UpManager.STYLE_FULL);
        };
        GetRewardView.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this, false);
        };
        GetRewardView.prototype.onDestroy = function () {
            this.m_pShowAni.removeEventListener("complete", this.onBgAniFinish, this);
            com_main.EventManager.removeEventListeners(this);
            this.clearItemAct(this.m_tItemList);
            if (this.m_tWaitList) {
                for (var i = 0; i < this.m_tWaitList.length; i++)
                    Utils.removeFromParent(this.m_tWaitList[i]);
                this.m_tWaitList = null;
            }
            this.m_tRewardList = null;
            egret.Tween.removeTweens(this.m_bg);
            _super_1.prototype.onDestroy.call(this);
        };
        /**清理动画 */
        GetRewardView.prototype.clearItemAct = function (list) {
            if (!list)
                return;
            for (var i = 0; i < list.length; i++) {
                egret.Tween.removeTweens(list[i]);
                Utils.removeFromParent(list[i]);
            }
            list = null;
        };
        GetRewardView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            if (this.m_tRewardList.length == 0) {
                com_main.UpManager.history();
                return;
            }
            this.m_pBg.mask = this.m_pBgMask;
            this.m_itemRoot.mask = this.m_pItemRootMask;
        };
        //显示
        GetRewardView.prototype.onClickMask = function (e) {
            if (this.m_bShowAction)
                return;
            if (this.m_tWaitList.length > 0) {
                this.doFlyAction();
            }
        };
        //入场动画后开始缓动
        GetRewardView.prototype.onBgAniFinish = function (event) {
            var item = event.data;
            this.doEnterActoin();
        };
        /**进场动画 */
        GetRewardView.prototype.doEnterActoin = function () {
            var itemCount = this.m_tRewardList.length;
            itemCount = itemCount > this.LINE_COUNT ? this.LINE_COUNT : itemCount;
            var list = this.m_tRewardList.splice(0, itemCount);
            var posList = this.getPosList(itemCount);
            for (var i = 0; i < itemCount; i++) {
                var pos = posList[i];
                var item = com_main.ComItemNew.create("name_num");
                item.anchorOffsetX = this.ITEM_WIDTH * 0.5;
                item.anchorOffsetY = this.ITEM_HEIGHT * 0.5;
                item.setItemInfo(list[i].itemId, list[i].count);
                item.x = pos.x;
                item.y = pos.y - this.ITEM_HEIGHT;
                item.alpha = 0;
                this.m_itemRoot.addChildAt(item, 0);
                var tw = egret.Tween.get(item);
                tw.wait(80 * i);
                tw.to({ y: pos.y, alpha: 1 }, 100, egret.Ease.cubicIn);
                tw.call(this.onActionEnd, this, [item]);
                this.m_tItemList.push(item);
            }
        };
        /**进场动画2 */
        GetRewardView.prototype.doNextEngerAction = function () {
            var itemCount = this.m_tRewardList.length;
            itemCount = itemCount > this.LINE_COUNT ? this.LINE_COUNT : itemCount;
            var list = this.m_tRewardList.splice(0, itemCount);
            var posList = this.getPosList(itemCount);
            for (var i = 0; i < itemCount; i++) {
                var pos = posList[i];
                var item = com_main.ComItemNew.create("name_num");
                item.anchorOffsetX = this.ITEM_WIDTH * 0.5;
                item.anchorOffsetY = this.ITEM_HEIGHT * 0.5;
                item.setItemInfo(list[i].itemId, list[i].count);
                item.x = pos.x + this.ITEM_WIDTH;
                item.y = pos.y;
                item.alpha = 0;
                this.m_itemRoot.addChildAt(item, 0);
                var tw = egret.Tween.get(item);
                tw.to({ x: pos.x, alpha: 1 }, 200, egret.Ease.cubicIn);
                tw.call(this.onActionEnd, this, [item]);
                this.m_tItemList.push(item);
            }
            if (this.m_tItemList.length == 0) {
                egret.Tween.get(this.m_bg).to({ alpha: 0 }, 500);
            }
        };
        /**道具动画结束 */
        GetRewardView.prototype.onActionEnd = function (item) {
            for (var i = 0; i < this.m_tItemList.length; i++) {
                if (this.m_tItemList[i].itemId == item.itemId) {
                    this.m_tItemList.splice(i, 1);
                    this.m_tWaitList.push(item);
                    break;
                }
            }
            if (this.m_bShowAction && this.m_tItemList.length == 0) {
                this.m_bShowAction = false;
                this.m_pItemRootMask.visible = false;
                this.m_itemRoot.mask = null;
            }
        };
        /**获得位置列表 */
        GetRewardView.prototype.getPosList = function (itemCount) {
            var posList = [];
            var centreX = this.m_itemRoot.width * 0.5;
            var centreY = this.m_itemRoot.height * 0.5;
            var startX = centreX - (itemCount * (this.ITEM_WIDTH + this.ITEM_INTERVAL) - this.ITEM_INTERVAL) * 0.5 + this.ITEM_WIDTH * 0.5;
            for (var i = 0; i < itemCount; i++) {
                posList.push({ x: startX + i * (this.ITEM_WIDTH + this.ITEM_INTERVAL), y: centreY });
            }
            return posList;
        };
        /**飞行动画 */
        GetRewardView.prototype.doFlyAction = function () {
            for (var i = 0; i < this.m_tWaitList.length; i++) {
                var item = this.m_tWaitList[i];
                GetAwardFlyUtil.addItem(item);
            }
            this.m_tWaitList = [];
            if (this.m_tRewardList.length == 0 && this.m_tItemList.length == 0) {
                //关闭界面
                com_main.UpManager.history();
                com_main.EventMgr.dispatchEvent(TASK_EVT.ON_GET_REWARD_VIEW_HIDE, null);
                return;
            }
            this.doNextEngerAction();
        };
        GetRewardView.NAME = 'GetRewardView';
        return GetRewardView;
    }(com_main.CView));
    com_main.GetRewardView = GetRewardView;
})(com_main || (com_main = {}));
