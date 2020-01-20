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
    var HeadQuartersChapter = /** @class */ (function (_super_1) {
        __extends(HeadQuartersChapter, _super_1);
        function HeadQuartersChapter() {
            var _this = _super_1.call(this) || this;
            _this.name = HeadQuartersChapter.NAME;
            return _this;
            //this.skinName = Utils.getSkinName("app/headquarters/HeadQuartersChapterSkin.exml");	
            // this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }
        HeadQuartersChapter.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        HeadQuartersChapter.prototype.onDestroy = function () {
            this.removeEvent();
            egret.Tween.removeTweens(this.m_Arrow);
            _super_1.prototype.onDestroy.call(this);
        };
        HeadQuartersChapter.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.InitItem();
            this.InitArrowTween();
            this.mask = this.m_bgMask;
            this.initEvent();
        };
        /** 初始化关卡组件 */
        HeadQuartersChapter.prototype.InitItem = function () {
            this._Items = [];
            for (var i = 0; i < 12; i++) {
                var Item = this["Item" + i];
                this._Items.push(Item);
            }
        };
        HeadQuartersChapter.prototype.InitArrowTween = function () {
            egret.Tween.removeTweens(this.m_Arrow);
            Tween.get(this.m_Arrow, { loop: true })
                .to({ y: -30 }, 800, egret.Ease.sineIn)
                .to({ y: 0 }, 800, egret.Ease.sineOut);
        };
        /**設置章節id */
        HeadQuartersChapter.prototype.setChapterInfo = function (val, copyId) {
            if (this.m_nChapterId == val)
                return;
            this.m_nChapterId = val;
            this.m_nCopyId = copyId;
            this.setChapterCfg();
        };
        // public get chapterId(): number {
        // 	return this.m_nChapterId;
        // }
        /** 设置章节信息 */
        HeadQuartersChapter.prototype.setChapterCfg = function () {
            if (!this.m_nChapterId)
                return;
            this._chpaterCfgs = HeadQuartersModel.getChapterCfgs(this.m_nChapterId);
            this.Refresh();
        };
        /** 刷新界面 */
        HeadQuartersChapter.prototype.Refresh = function () {
            if (this._chpaterCfgs) {
                this.Refresh_BackGround();
                this.Refresh_CheckPoints();
                this.Refresh_Arrow();
            }
        };
        /** 刷新 - 箭头 */
        HeadQuartersChapter.prototype.Refresh_Arrow = function () {
            this.m_ArrowRoot.visible = false;
            var index = this.m_nCopyId;
            for (var i = 0; i < this._Items.length; i++) {
                var element = this._Items[i];
                if (index == element.CheckPointId) {
                    this.m_ArrowRoot.visible = true;
                    this.m_ArrowRoot.x = element.x;
                    if (element.IsBoss) {
                        this.m_ArrowRoot.y = element.y - element.height - 10;
                    }
                    else {
                        this.m_ArrowRoot.y = element.y - element.height / 2;
                    }
                    break;
                }
            }
        };
        /** 刷新 - 背景图 */
        HeadQuartersChapter.prototype.Refresh_BackGround = function () {
            this.m_BackGround.source = this._chpaterCfgs[0].resMapName;
        };
        /** 刷新 - 关卡 */
        HeadQuartersChapter.prototype.Refresh_CheckPoints = function () {
            var cfgCnt = this._chpaterCfgs.length;
            for (var i = 0; i < cfgCnt; i++) {
                this._Items[i].SetCheckPoint(this._chpaterCfgs[i]);
            }
        };
        HeadQuartersChapter.prototype.ShowChapterInfoView = function (item) {
            // let tempCfg = C.ChapterConfig[item.CheckPointId];
            // if(!tempCfg.sweepAway && item.CheckPointId<HeadQuartersModel.CurCheckPointId) {
            // 	EffectUtils.showTips("敌军已被击溃！",1,true);
            // 	return ;
            // }
            Utils.open_view(TASK_UI.HEADQUARTER_INFO_PANEL, item.CheckPointId);
        };
        // //指引的时候把当前关卡提到最高层
        // public setCurItemTopLayer() {
        // 	let curCheckPointId: number = HeadQuartersModel.fightRecordId;
        // 	for (let i = 0; i < this._Items.length; i++) {
        // 		let element: HeadQuartersItem = this._Items[i];
        // 		if (curCheckPointId == element.CheckPointId) {
        // 			this.m_pItemRoot.swapChildrenAt(this.m_pItemRoot.getChildIndex(element), this.m_pItemRoot.numChildren - 1);
        // 			break;
        // 		}
        // 	}
        // }
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        HeadQuartersChapter.prototype.initEvent = function () {
            var _this = this;
            var _loop_1 = function (i) {
                var Item = this_1._Items[i];
                com_main.EventManager.addTouchTapListener(Item, this_1, function () { return _this.OnClickItem(Item); });
            };
            var this_1 = this;
            for (var i = 0; i < this._Items.length; i++) {
                _loop_1(i);
            }
            com_main.EventMgr.addEvent(QuarterEvent.QUARTER_INFO_UPDATE, this.onInfoUpdate, this);
        };
        HeadQuartersChapter.prototype.removeEvent = function () {
            for (var i = 0; i < 12; i++) {
                // EventManager.addTouchTapListener(this._Items[i], this, this.OnClickItem);
                com_main.EventManager.removeEventListener(this._Items[i]);
            }
            com_main.EventManager.removeEventListeners(this);
            com_main.EventMgr.removeEventByObject(QuarterEvent.QUARTER_INFO_UPDATE, this);
        };
        /**章節信息刷新 */
        HeadQuartersChapter.prototype.onInfoUpdate = function (chapterId) {
            if (this.m_nChapterId == chapterId) {
                this.Refresh();
            }
        };
        /** 按钮事件 - 点击关卡 */
        HeadQuartersChapter.prototype.OnClickItem = function (item) {
            // if (HeadQuartersModel.isPassWar(item.CheckPointId) && !item.IsBoss) return;
            if (this.m_nCopyId != item.CheckPointId && !item.IsBoss)
                return;
            // if (item.CheckPointId != HeadQuartersModel.fightRecordId && NormalModel.getFunCountById(IFunCountEnum.COPY_FREE_COUNT).reCount == 0) {
            // 	HeadQuartersModel.BuyChallengedTimes();
            // }
            // else {
            this.ShowChapterInfoView(item);
            // }
        };
        HeadQuartersChapter.NAME = 'HeadQuartersChapter';
        return HeadQuartersChapter;
    }(com_main.CComponent));
    com_main.HeadQuartersChapter = HeadQuartersChapter;
})(com_main || (com_main = {}));
