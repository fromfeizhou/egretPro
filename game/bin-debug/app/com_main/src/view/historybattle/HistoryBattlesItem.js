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
    var HistoryBattlesItem = /** @class */ (function (_super_1) {
        __extends(HistoryBattlesItem, _super_1);
        function HistoryBattlesItem() {
            var _this = _super_1.call(this) || this;
            _this.name = HistoryBattlesItem.NAME;
            return _this;
        }
        Object.defineProperty(HistoryBattlesItem.prototype, "CheckPointId", {
            /** 访问器 - 当前关卡ID */
            get: function () {
                if (this._config)
                    return this._config.id;
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        HistoryBattlesItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.cacheAsBitmap = true;
        };
        /** 设置章节 */
        HistoryBattlesItem.prototype.SetCheckPoint = function (config) {
            this._config = config;
            this.Refresh();
        };
        /** 刷新界面 */
        HistoryBattlesItem.prototype.Refresh = function () {
            if (this._config) {
                Utils.isGray(this._config.id > HistoryBattleModel.getDefCopyId(), this);
                this.Refresh_ItemPos();
                this.Refresh_RoleHead();
                this.Refresh_Star();
            }
        };
        /** 刷新 - 组件坐标 */
        HistoryBattlesItem.prototype.Refresh_ItemPos = function () {
            var pos = this._config.checkPointPos.split("#");
            this.x = parseInt(pos[0]) - 78.5;
            this.y = parseInt(pos[1]) - 20;
        };
        /** 刷新 - Boss关卡，头像 */
        HistoryBattlesItem.prototype.Refresh_RoleHead = function () {
            this.Image_head.mask = this.Image_mask;
            this.Image_head.source = GeneralModel.getSoldierLogo(this._config.resRoleName);
            this.Image_mask.visible = false;
            this.m_lbMis.text = this._config.level + "";
        };
        /** 刷新 - 星星信息 */
        HistoryBattlesItem.prototype.Refresh_Star = function () {
            var starNum = 0;
            var isHasStar = false;
            var chapterInfo = HistoryBattleModel.getHisoryWarInfo(this._config.chapterId);
            if (chapterInfo && chapterInfo.LevelInfos) {
                for (var i = 0; i < chapterInfo.LevelInfos.length; i++) {
                    var checkPoint = chapterInfo.LevelInfos[i];
                    if (checkPoint && checkPoint.id == this._config.id) {
                        starNum = checkPoint.star;
                        isHasStar = true;
                        break;
                    }
                }
            }
            if (this.m_conStar) {
                for (var i = 0; i < this.m_conStar.numChildren; i++) {
                    this.m_conStar.removeChildAt(i);
                }
                Utils.removeAllChild(this.m_conStar);
                if (!isHasStar)
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
        HistoryBattlesItem.NAME = 'HistoryBattlesItem';
        return HistoryBattlesItem;
    }(com_main.CComponent));
    com_main.HistoryBattlesItem = HistoryBattlesItem;
})(com_main || (com_main = {}));
