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
    * 缘分栏组件
    */
    var TeamFateItem = /** @class */ (function (_super_1) {
        __extends(TeamFateItem, _super_1);
        function TeamFateItem() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getSkinName("app/team/TeamFateItemSkin.exml");
            return _this;
        }
        TeamFateItem.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        TeamFateItem.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        TeamFateItem.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            this.m_bIsShow = false;
            this.setPropHight(0);
            com_main.EventManager.addTouchTapListener(this.m_imgBtnMask, this, function () {
                _this.m_bIsShow = !_this.m_bIsShow;
                if (_this.m_bIsShow) {
                    _this.setPropHight(20);
                    _this.currentState = 'show';
                }
                else {
                    _this.setPropHight(0);
                    _this.currentState = 'hide';
                }
            });
        };
        Object.defineProperty(TeamFateItem.prototype, "fateId", {
            get: function () {
                return this.m_nFateId;
            },
            set: function (val) {
                if (this.m_nFateId == val)
                    return;
                this.m_nFateId = val;
                this.m_labFateName.text = GCode(CLEnum.CAMP_NAME_QY);
                this.refrehPropView();
            },
            enumerable: true,
            configurable: true
        });
        /**刷新属性显示 */
        TeamFateItem.prototype.refrehPropView = function () {
            Utils.removeAllChild(this.m_pPropRoot);
            for (var i = 0; i < 2; i++) {
                var prop = new TeamFateProp({ key: AttriType.ATK, value: 100 });
                this.m_pPropRoot.addChild(prop);
            }
        };
        /**设置高度 */
        TeamFateItem.prototype.setPropHight = function (size) {
            for (var i = 0; i < this.m_pPropRoot.numChildren; i++) {
                this.m_pPropRoot.getChildAt(i).height = size;
            }
        };
        return TeamFateItem;
    }(com_main.CComponent));
    com_main.TeamFateItem = TeamFateItem;
    /**
     * 缘分属性
     */
    var TeamFateProp = /** @class */ (function (_super_1) {
        __extends(TeamFateProp, _super_1);
        function TeamFateProp(prop) {
            var _this = _super_1.call(this) || this;
            _this.m_prop = prop;
            _this.skinName = Utils.getSkinName("app/team/TeamFatePropSkin.exml");
            return _this;
        }
        TeamFateProp.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        TeamFateProp.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        TeamFateProp.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_imgIcon.source = Utils.getAttriIcon(this.m_prop.key);
            this.m_labProp.textFlow = Utils.htmlParser(Utils.getAttriFormat(this.m_prop, false, '<font color=#878785>%s：</font>%s'));
        };
        return TeamFateProp;
    }(com_main.CComponent));
    com_main.TeamFateProp = TeamFateProp;
})(com_main || (com_main = {}));
