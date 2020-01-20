/**
  * tips弹出管理类
  * by dily
  * (c) copyright 2014 - 2035
  * All Rights Reserved.
  * tips弹出的管理类
  */
var com_main;
(function (com_main) {
    var TipsEnum;
    (function (TipsEnum) {
        /**通用tips */
        TipsEnum[TipsEnum["Normal"] = 0] = "Normal";
        /**物品tips */
        TipsEnum[TipsEnum["Item"] = 1] = "Item";
        /**技能tips */
        TipsEnum[TipsEnum["Skill"] = 2] = "Skill";
        /**装备套装tips */
        // EquipAdd = 3,
        /**搜索栏宝箱tips */
        TipsEnum[TipsEnum["WorldSearchTips"] = 10001] = "WorldSearchTips";
    })(TipsEnum = com_main.TipsEnum || (com_main.TipsEnum = {}));
    var CTipsManager = /** @class */ (function () {
        function CTipsManager() {
        }
        /**
         * target       		绑定对象
         * type        			tips类型
         * param				额外参数
        */
        CTipsManager.addTips = function (target, data) {
            if (!target)
                return;
            //过滤已经监听的对象
            if (!this.m_tListeners[target.hashCode]) {
                //移除函数 挂钩新内容
                var removeFunc_1 = target.$onRemoveFromStage.bind(target);
                target.$onRemoveFromStage = function () {
                    if (!target)
                        return;
                    CTipsManager.clearTips(target);
                    removeFunc_1();
                };
                target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
                target.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchMove, this);
                target.addEventListener(egret.TouchEvent.TOUCH_END, this.removeTips, this);
                target.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.removeTips, this);
            }
            this.m_tListeners[target.hashCode] = data;
        };
        /**
         * 手动移除tips监听
         *
         */
        CTipsManager.clearTips = function (target) {
            if (!this.m_tListeners[target.hashCode])
                return;
            target.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            target.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.ontouchMove, this);
            target.removeEventListener(egret.TouchEvent.TOUCH_END, this.removeTips, this);
            target.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.removeTips, this);
            delete this.m_tListeners[target.hashCode];
        };
        CTipsManager.onTouchBegin = function (e) {
            this.m_pTouchBeginPos.x = e.stageX;
            this.m_pTouchBeginPos.y = e.stageY;
            this.showTips(e);
        };
        CTipsManager.ontouchMove = function (e) {
            var dis = Utils.MathUtils.getPosDis({ x: this.m_pPreTouchPos.x, y: this.m_pPreTouchPos.y }, { x: e.stageX, y: e.stageY });
            if (dis < 30)
                return;
            this.removeTips(e);
        };
        CTipsManager.showTips = function (e) {
            var _this = this;
            var target = e.currentTarget;
            var data = this.m_tListeners[target.hashCode];
            if (!data)
                return;
            e.stopPropagation();
            if (this.m_tipsPanel) {
                Utils.removeFromParent(this.m_tipsPanel);
                this.m_tipsPanel = null;
            }
            this.m_tipsPanel = this.createTips(data);
            if (!this.m_tipsPanel)
                return;
            AGame.R.app.topLevel.addChild(this.m_tipsPanel);
            this.m_tipsPanel.alpha = 0;
            egret.Tween.get(this.m_tipsPanel).to({ alpha: 1 }, 300);
            egret.callLater(function () {
                if (_this.m_tipsPanel) {
                    _this.setPanelPos(target, data);
                }
            }, CTipsManager);
        };
        /**设置tips位置 */
        CTipsManager.setPanelPos = function (target, data) {
            var point = target.parent.localToGlobal(target.x, target.y);
            var gap = 30;
            if (data.posType && data.posType != gap) {
                //tips 左右偏移
                if (point.x - this.m_tipsPanel.width > 0) {
                    point.x = point.x - this.m_tipsPanel.width - gap;
                }
                else {
                    point.x = point.x + target.width + gap;
                }
            }
            else {
                //tips 往下偏移
                if (point.y - this.m_tipsPanel.height < 0) {
                    point.y = point.y + target.height + gap;
                }
                else {
                    point.y = point.y - this.m_tipsPanel.height - gap;
                }
                //tips 居中
                point.x = point.x - this.m_tipsPanel.width * 0.5 + target.width * 0.5;
            }
            //offset 
            if (data.offset) {
                point.x += data.offset.x;
                point.y += data.offset.y;
            }
            this.m_tipsPanel.x = point.x;
            this.m_tipsPanel.y = point.y;
            this.amendPos();
        };
        /**修正最终位置 防止越界 */
        CTipsManager.amendPos = function () {
            //tips定位
            if (this.m_tipsPanel.x + this.m_tipsPanel.width > GameConfig.curWidth()) {
                this.m_tipsPanel.x = GameConfig.curWidth() - this.m_tipsPanel.width;
            }
            else if (this.m_tipsPanel.x < 0) {
                this.m_tipsPanel.x = 0;
            }
            if (this.m_tipsPanel.y + this.m_tipsPanel.height > GameConfig.curHeight()) {
                this.m_tipsPanel.y = GameConfig.curHeight() - this.m_tipsPanel.height;
            }
            else if (this.m_tipsPanel.y < 0) {
                this.m_tipsPanel.y = 0;
            }
        };
        /**创建tips */
        CTipsManager.createTips = function (data) {
            switch (data.type) {
                case TipsEnum.Item: {
                    var itemId = data.param;
                    var itemCfg = C.ItemConfig[itemId];
                    if (itemCfg) {
                        return new com_main.TipsNorWnd({ title: GLan(itemCfg.name), des: itemCfg.description });
                    }
                    break;
                }
                case TipsEnum.Skill: {
                    var info = data.param;
                    var skillCfg = C.SkillConfig[info.skillId];
                    if (skillCfg) {
                        var title = C.SkillConfig[info.skillId].name;
                        var des = GeneralModel.getSkillDesByLv(info.skillId, Math.max(1, info.level));
                        return new com_main.TipsNorWnd({ title: title, des: des });
                    }
                    break;
                }
                // case TipsEnum.EquipAdd: {
                // 	return new TipsEquipAddWnd(data.param);
                // }
                case TipsEnum.Normal: {
                    return new com_main.TipsNorWnd(data.param);
                }
                case TipsEnum.WorldSearchTips: {
                    return new com_main.WorldSearchAwardWnd(data.param);
                }
            }
        };
        CTipsManager.removeTips = function (e) {
            if (!this.m_tipsPanel)
                return;
            var panel = this.m_tipsPanel;
            this.m_tipsPanel = null;
            egret.Tween.removeTweens(panel);
            var tw = egret.Tween.get(panel);
            tw.to({ alpha: 0 }, 300);
            tw.call(function () {
                Utils.removeFromParent(panel);
            }, CTipsManager);
            //阻塞事件
            if (e.type == egret.TouchEvent.TOUCH_END) {
                e.stopImmediatePropagation();
            }
        };
        CTipsManager.m_tListeners = {}; //监听对象计数
        CTipsManager.m_pTouchBeginPos = new egret.Point();
        CTipsManager.m_pPreTouchPos = new egret.Point();
        return CTipsManager;
    }());
    com_main.CTipsManager = CTipsManager;
})(com_main || (com_main = {}));
