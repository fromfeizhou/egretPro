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
     * 军备主面板
     */
    var ArmsWnd = /** @class */ (function (_super_1) {
        __extends(ArmsWnd, _super_1);
        function ArmsWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.name = ArmsWnd.NAME;
            _this.m_tParam = param;
            _this.initApp("arms/ArmsWndSkin.exml");
            return _this;
        }
        ArmsWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            // this.clearMcEffect();
            if (this.m_tArmyMc) {
                GeneralMCMgr.removeMc(this.m_tArmyMc.dbName);
            }
            this.removeEvent();
        };
        ArmsWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.ARMY));
            this.m_MainTopNew.setResources([PropEnum.GOLD, PropEnum.SILVER, PropEnum.WOOD, PropEnum.FOOD, PropEnum.IRON]);
            // this.standMCs = [];
            // this.attMCs = [];
            var tagBtb = [
                { name: GCode(CLEnum.ARMY_TAB_ZM) },
                { name: GCode(CLEnum.ARMY_TAB_SJ) },
            ];
            for (var i = 0; i < tagBtb.length; i++) {
                this.m_comTabGroup.addTabBtnData(tagBtb[i]);
            }
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            //兵种按钮
            this.m_tItemList = [];
            for (var i = 0; i < ArmsWnd.Types.length; i++) {
                var item = this["m_item" + i];
                item.type = ArmsWnd.Types[i];
                this.m_tItemList.push(item);
                com_main.EventManager.addTouchTapListener(item, this, this.onItemClick);
            }
            //第二位 居中为当前选中对象
            this.m_nSoldierType = ArmsWnd.Types[1];
            //界面初始化
            var tagView1 = new com_main.ArmsTrain();
            var tagView2 = new com_main.ArmsUpgrade();
            this.m_tabViewStack.addChild(tagView1);
            this.m_tabViewStack.addChild(tagView2);
            this.m_tViews = [tagView1, tagView2];
            this.validateNow();
            var evtList = [RedEvtType.ARMS_TRAIN, RedEvtType.ARMS_GRADE];
            for (var i = 0; i < tagBtb.length; i++) {
                //红点处理
                RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(tagBtb[i].name), { x: 132, y: -5 }, [evtList[i]], 2);
            }
            // this.validateNow();
            //设置切卡
            var tagId = 0;
            if (this.m_tParam && this.m_tParam.tagId)
                tagId = this.m_tParam.tagId;
            this.changeTag(tagId);
            //设置兵种
            var soldierType = (this.m_tParam && this.m_tParam.soldierType) ? this.m_tParam.soldierType : SoldierMainType.PIKEMAN;
            this.changeSoldierType(soldierType, false);
            this.addEvent();
            Utils.toStageBestScale(this.m_pViewRoot);
            /**检查新手引导面板条件 */
            this.onGuideCondition();
        };
        /**通过标签获取兵种类型 */
        ArmsWnd.prototype.getRedEvtTypeByTagIndex = function (index) {
            switch (index) {
                case 1:
                    return RedEvtType.ARMS_GRADE;
                case 0:
                    return RedEvtType.ARMS_TRAIN;
            }
            return null;
        };
        /**兵种选项红点刷新 */
        ArmsWnd.prototype.refreshArmsItem = function (type) {
            for (var i = 0; i < this.m_tItemList.length; i++) {
                this.m_tItemList[i].addRedEvent(type);
            }
        };
        //按钮点击回调
        ArmsWnd.prototype.onItemClick = function (e) {
            var item = e.currentTarget;
            if (item.type == this.m_nSoldierType)
                return;
            this.changeSoldierType(item.type);
        };
        /**切卡 */
        ArmsWnd.prototype.changeTag = function (index) {
            if (this.m_nTagId == index)
                return;
            this.m_nTagId = index;
            this.m_comTabGroup.selectedIndex = index;
            this.m_tabViewStack.selectedIndex = index;
            if (this.m_nSoldierType)
                this.m_tViews[this.m_nTagId].changeType(this.m_nSoldierType);
            var type = this.getRedEvtTypeByTagIndex(index);
            this.refreshArmsItem(type);
            var ids = [IGUIDECD.ARMY_TAB_UP, IGUIDECD.ARMY_TAB_TRAI];
            this.onGuideConditionTab(ids[index]);
        };
        /**切换兵种 */
        ArmsWnd.prototype.changeSoldierType = function (type, isAction) {
            if (isAction === void 0) { isAction = true; }
            var curId = 0;
            var targetId = 0;
            for (var i = 0; i < this.m_tItemList.length; i++) {
                var item = this.m_tItemList[i];
                if (item.type == this.m_nSoldierType)
                    curId = i;
                if (item.type == type)
                    targetId = i;
            }
            this.m_nSoldierType = type;
            //切换动画
            this.refreshTile();
            this.refreshMc();
            this.m_tViews[this.m_nTagId].changeType(this.m_nSoldierType);
            if (curId != targetId) {
                while (curId != targetId) {
                    this.doAction(targetId - curId, isAction);
                    curId = curId > targetId ? curId - 1 : curId + 1;
                }
            }
            else {
                //旋转动画
                this.doAction(0, isAction);
            }
        };
        /** 旋转动画 */
        ArmsWnd.prototype.doAction = function (state, isAction) {
            if (isAction === void 0) { isAction = true; }
            if (state < 0) {
                //左旋转
                var tmp = this.m_tItemList.pop();
                this.m_tItemList.unshift(tmp);
                this.m_pItemRoot.setChildIndex(tmp, 0);
            }
            else if (state > 0) {
                //右
                var tmp = this.m_tItemList.shift();
                this.m_tItemList.push(tmp);
                this.m_pItemRoot.setChildIndex(tmp, 0);
            }
            this.m_pItemRoot.setChildIndex(this.m_tItemList[1], this.m_pItemRoot.numChildren - 1);
            var posX = [0, 150, 300, 150];
            var scales = [0.7, 1, 0.7, 0.5];
            var alphas = [0.8, 1, 0.8, 0.5];
            for (var i = 0; i < this.m_tItemList.length; i++) {
                this.m_tItemList[i].doAction(posX[i], scales[i], alphas[i], isAction);
            }
        };
        //刷新标题
        ArmsWnd.prototype.refreshTile = function () {
            var type = this.m_nSoldierType;
            var cfg = MainMapModel.getSoldierLvCfg(type);
            var lv = TeamModel.getTroopsInfo(type).level;
            this.m_labTile.text = GLan(cfg.name) + GCode(CLEnum.GRADE) + lv;
        };
        /**刷新动画 */
        ArmsWnd.prototype.refreshMc = function () {
            var name = IETypes.EARMY_ARROWSOLDIER;
            switch (this.m_nSoldierType) {
                case SoldierMainType.FOOTSOLDIER:
                    name = IETypes.EARMY_FOOTSOLDIER;
                    break;
                case SoldierMainType.RIDESOLDIER:
                    name = IETypes.EARMY_RIDESOLDIER;
                    break;
                case SoldierMainType.PIKEMAN:
                    name = IETypes.EARMY_PIKEMAN;
                    break;
            }
            if (this.m_tArmyMc) {
                GeneralMCMgr.removeMc(this.m_tArmyMc.dbName);
            }
            this.m_tArmyMc = GeneralMCMgr.createMc(name);
            this.m_pMCRoot.addChild(this.m_tArmyMc);
        };
        /**=====================================================================================
         * 事件监听 begin
         * =====================================================================================
         */
        ArmsWnd.prototype.addEvent = function () {
            com_main.EventMgr.addEvent(BuildEvent.SOLDIER_UPGRADE, this.onFinishUpgrade, this);
            com_main.EventMgr.addEvent(ArmyEvent.ARMY_FINISH, this.onFinishTrain, this);
        };
        ArmsWnd.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(BuildEvent.SOLDIER_UPGRADE, this);
            com_main.EventMgr.removeEventByObject(ArmyEvent.ARMY_FINISH, this);
        };
        /**训练完成 */
        ArmsWnd.prototype.onFinishTrain = function () {
            this.showUpGradeEffect();
        };
        ArmsWnd.prototype.onFinishUpgrade = function (e) {
            this.refreshTile();
            if (e) {
                var type = e.armyType;
                var level = e.level;
                var res = TeamModel.getSoldierGradeAdd(type, level);
                if (res && res.length > 0) {
                    TipsUtils.showTipsFightUpList(res, new egret.Point(0, 0), this.m_conEffLab);
                }
            }
        };
        /**=====================================================================================
         * 事件监听 end
         * =====================================================================================
         */
        /**检查新手引导面板条件 */
        ArmsWnd.prototype.onGuideCondition = function () {
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, IGUIDECD.ARMY_WND);
        };
        /**检查新手引导面板条件 */
        ArmsWnd.prototype.onGuideConditionTab = function (id) {
            if (id <= 0)
                return;
            com_main.EventMgr.dispatchEvent(GuideEvent.GUIDE_ON_CONDITION, id);
        };
        /**=====================================================================================
         * 动画 begin
         * =====================================================================================
         */
        /**建造升级完成 */
        ArmsWnd.prototype.showUpGradeEffect = function () {
            var effect = NormalMcMgr.createMc(IETypes.EBuild_UpGrade, false);
            effect.playNorOnce(IETypes.EBuild_UpGrade, function () {
                NormalMcMgr.removeMc(effect);
            }, this);
            effect.scaleX = 2.2;
            effect.scaleY = 2.2;
            effect.x = 350;
            effect.y = 340;
            this.m_pViewRoot.addChild(effect);
            this.showLabEffect();
        };
        /**显示文本特效 */
        ArmsWnd.prototype.showLabEffect = function () {
            var img = new eui.Image("lb_zc_mbcg_png");
            img.width = 362;
            img.height = 96;
            AnchorUtil.setAnchor(img, 0.5);
            img.x = 350;
            img.y = 360;
            this.m_pViewRoot.addChild(img);
            var actionY = img.y - img.height;
            var line = new eui.Image('line_1009_png');
            line.scale9Grid = new egret.Rectangle(247, 7, 71, 46);
            line.width = 700;
            AnchorUtil.setAnchor(line, 0.5);
            this.m_pViewRoot.addChild(line);
            line.x = img.x;
            line.y = actionY;
            //动画1
            var tw = egret.Tween.get(img);
            img.scaleX = 0.1;
            img.scaleY = 0.1;
            img.alpha = 0;
            tw.to({ scaleX: 1, scaleY: 1, alpha: 1, y: actionY }, 400, Ease.backOut);
            tw.wait(100);
            tw.to({ alpha: 0 }, 1000, Ease.cubicOut);
            tw.call(function () {
                if (img) {
                    Utils.removeFromParent(img);
                }
            }, this);
            //动画2
            var twLine = egret.Tween.get(line);
            line.scaleX = 0.1;
            line.scaleY = 0.1;
            line.alpha = 0;
            twLine.wait(200);
            twLine.to({ alpha: 1, scaleX: 1, scaleY: 1 }, 200, Ease.backOut);
            twLine.wait(100);
            twLine.to({ alpha: 0 }, 1000, Ease.cubicOut);
            twLine.call(function () {
                if (line) {
                    Utils.removeFromParent(line);
                }
            }, this);
        };
        ArmsWnd.NAME = 'ArmsWnd';
        ArmsWnd.Types = [SoldierMainType.ARROWSOLDIER, SoldierMainType.FOOTSOLDIER, SoldierMainType.RIDESOLDIER, SoldierMainType.PIKEMAN];
        return ArmsWnd;
    }(com_main.CView));
    com_main.ArmsWnd = ArmsWnd;
})(com_main || (com_main = {}));
