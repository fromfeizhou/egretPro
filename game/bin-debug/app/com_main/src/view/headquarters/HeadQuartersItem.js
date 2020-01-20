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
    var HeadQuartersItem = /** @class */ (function (_super_1) {
        __extends(HeadQuartersItem, _super_1);
        function HeadQuartersItem() {
            var _this = _super_1.call(this) || this;
            _this.name = HeadQuartersItem.NAME;
            return _this;
        }
        Object.defineProperty(HeadQuartersItem.prototype, "CheckPointId", {
            /** 访问器 - 当前关卡ID */
            get: function () {
                if (this._config)
                    return this._config.id;
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeadQuartersItem.prototype, "IsBoss", {
            get: function () {
                if (this._config)
                    return this._config.stageType != 0;
                return false;
            },
            enumerable: true,
            configurable: true
        });
        HeadQuartersItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.cacheAsBitmap = true;
        };
        /** 设置章节 */
        HeadQuartersItem.prototype.SetCheckPoint = function (config) {
            this._config = config;
            this.Refresh();
        };
        /** 刷新界面 */
        HeadQuartersItem.prototype.Refresh = function () {
            if (this._config) {
                this.Refresh_SkinState();
                this.Refresh_ItemPos();
                this.Refresh_RoleHead();
                this.Refresh_Star();
            }
        };
        /** 刷新 - 组件皮肤 */
        HeadQuartersItem.prototype.Refresh_SkinState = function () {
            var curState = "";
            //关卡类型(0:普通关卡，1:普通Boss，2:大Boss)
            switch (this._config.stageType) {
                case 0: {
                    curState = "Normal";
                    break;
                }
                case 1: {
                    curState = "Boss";
                    break;
                }
                case 2: {
                    curState = "BossEx";
                    break;
                }
            }
            if (HeadQuartersModel.isPassWar(this._config.id)) {
                curState += "Pass";
            }
            this.currentState = curState;
            this.validateNow();
            this.anchorOffsetX = this.width * 0.5;
            this.anchorOffsetY = this.height;
        };
        /** 刷新 - 组件坐标 */
        HeadQuartersItem.prototype.Refresh_ItemPos = function () {
            var pos = this._config.checkPointPos.split("#");
            this.x = parseInt(pos[0]);
            this.y = parseInt(pos[1]) - 12;
        };
        /** 刷新 - Boss关卡，头像 */
        HeadQuartersItem.prototype.Refresh_RoleHead = function () {
            if (this._config.stageType != 0) {
                this.m_RoleHead.mask = this.m_mask;
                var firstItem = HeadQuartersModel.getFirstItem(this._config.id);
                var source = PropModel.getPropIcon(firstItem.itemId);
                var item = C.ItemConfig[firstItem.itemId];
                this.m_RoleHead.source = source;
                if (this._config.stageType == 1) {
                    if (item.quality && item.quality > 0) {
                        this.m_imgQuality.source = 'headQuarter' + item.quality + '_png';
                    }
                    else {
                        this.m_imgQuality.source = 'tx-pt_png';
                    }
                }
                else if (this._config.stageType == 2) {
                    if (item.quality && item.quality > 0) {
                        this.m_imgQuality.source = 'BossEs' + item.quality + '_png';
                    }
                    else {
                        this.m_imgQuality.source = 'tx-sj_png';
                    }
                }
                Utils.isGray(this._config.id > HeadQuartersModel.getDefCopyId(this._config.chapterId), this.m_RoleHead);
            }
        };
        /** 刷新 - 星星信息 */
        HeadQuartersItem.prototype.Refresh_Star = function () {
            var starNum = 0;
            if (this._config.stageType != 0) {
                var chapterInfo = HeadQuartersModel.getChapterInfo(this._config.chapterId);
                if (chapterInfo && chapterInfo.checkPointInfos) {
                    for (var i = 0; i < chapterInfo.checkPointInfos.length; i++) {
                        var checkPoint = chapterInfo.checkPointInfos[i];
                        if (checkPoint && checkPoint.id == this._config.id) {
                            starNum = checkPoint.condition.length;
                            break;
                        }
                    }
                }
            }
            if (this.m_conStar) {
                for (var i = 0; i < this.m_conStar.numChildren; i++) {
                    this.m_conStar.removeChildAt(i);
                }
                Utils.removeAllChild(this.m_conStar);
                if (this._config.stageType == 0)
                    return;
                for (var i = 1; i <= 3; i++) {
                    var star = new eui.Image();
                    var sourceStr = void 0;
                    if (starNum >= i) {
                        sourceStr = "common_star_png";
                    }
                    else {
                        sourceStr = "common_star_empty_png";
                    }
                    star.source = sourceStr;
                    this.m_conStar.addChild(star);
                }
            }
        };
        HeadQuartersItem.NAME = 'HeadQuartersItem';
        return HeadQuartersItem;
    }(com_main.CComponent));
    com_main.HeadQuartersItem = HeadQuartersItem;
})(com_main || (com_main = {}));
