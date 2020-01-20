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
    var MBuildPP = /** @class */ (function (_super_1) {
        __extends(MBuildPP, _super_1);
        function MBuildPP(id, type) {
            var _this = _super_1.call(this) || this;
            _this.m_pID = 0;
            _this.m_pIconType = 0;
            _this.m_pType = 0;
            _this.name = MBuildPP.NAME;
            _this.m_pID = id;
            if (type != MBuildIconStatus.BuildItem)
                _this.m_pIconType = MainMapModel.getValueIconType(id);
            else
                _this.m_pIconType = id;
            _this.m_pType = type;
            _this.skinName = Utils.getAppSkin("map/map_build_pp.exml");
            _this.touchEnabled = false;
            _this.touchChildren = false;
            return _this;
        }
        /**
         * 销毁方法
         */
        MBuildPP.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        Object.defineProperty(MBuildPP.prototype, "iconWidth", {
            get: function () {
                return 74;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MBuildPP.prototype, "iconHeight", {
            get: function () {
                return 90;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MBuildPP.prototype, "type", {
            get: function () {
                return this.m_pType;
            },
            set: function (type) {
                if (this.m_pType == type)
                    return;
                this.m_pType = type;
                this.setIcon();
            },
            enumerable: true,
            configurable: true
        });
        MBuildPP.create = function (id, type) {
            var obj = new MBuildPP(id, type);
            return obj;
        };
        /**征收点击 */
        MBuildPP.resRecevice = function (buildId) {
            var build = MainMapModel.getBuildInfo(buildId);
            if (build) {
                switch (build.type) {
                    case BuildingType.FARMLAND:
                    case BuildingType.DWELLINGS:
                    case BuildingType.LOGGING_CAMP:
                    case BuildingType.IRON_WORKS:
                    case BuildingType.FUDING:
                    case BuildingType.TAVERN: {
                        MainMapProxy.send_BUILDING_LEVY(build.type);
                        break;
                    }
                }
            }
        };
        MBuildPP.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.init();
        };
        MBuildPP.prototype.setNum = function (num, isMax) {
            if (isMax === void 0) { isMax = false; }
            this.m_pNum.text = num + '';
            var color = isMax ? 0xFEAD00 : 0xFFFDDD;
            this.m_pNum.textColor = color;
        };
        Object.defineProperty(MBuildPP.prototype, "num", {
            get: function () {
                return parseInt(this.m_pNum.text);
            },
            enumerable: true,
            configurable: true
        });
        /**初始化 */
        MBuildPP.prototype.init = function () {
            this.setIcon();
        };
        Object.defineProperty(MBuildPP.prototype, "iconType", {
            get: function () {
                return this.m_pIconType;
            },
            enumerable: true,
            configurable: true
        });
        MBuildPP.prototype.setIcon = function () {
            var texture = null;
            switch (this.m_pType) {
                case MBuildIconStatus.ZS: {
                    texture = PropModel.getPropIcon(this.m_pIconType);
                    break;
                }
                case MBuildIconStatus.UpAndZS: {
                    switch (this.m_pIconType) {
                        case PropEnum.FOOD: {
                            texture = 'common_up_2_png';
                            break;
                        }
                        case PropEnum.SILVER: {
                            texture = 'common_up_3_png';
                            break;
                        }
                        case PropEnum.IRON: {
                            texture = 'common_up_3_png';
                            break;
                        }
                        case PropEnum.BFS: {
                            texture = 'common_up_4_png';
                            break;
                        }
                        default: {
                            texture = 'common_up_1_png';
                            break;
                        }
                    }
                    break;
                }
                case MBuildIconStatus.UpLevel: {
                    texture = 'common_up_1_png';
                    break;
                }
                case MBuildIconStatus.BuildItem: {
                    texture = PropModel.getPropIcon(this.m_pIconType);
                    break;
                }
            }
            if (texture)
                this.m_pIcon.source = texture;
        };
        /**检测是否点中图标 */
        MBuildPP.prototype.check_is_touch = function (x, y) {
            var res = this.m_pIcon.hitTestPoint(x, y);
            if (res)
                MBuildPP.resRecevice(this.m_pID);
            return res;
        };
        /**产出特效 */
        MBuildPP.prototype.showOutEffect = function (count) {
            if (count && count > 0) {
                if (MainMapModel.isNormalSourceBuilding(this.m_pID)) {
                    com_main.ZSEffectModel.onShowZSEffect(this.m_pIconType, 6, this, com_main.MainTopBar.getIconProObj(this.m_pIconType), 3);
                }
                var layer = com_main.MainMap.getLabelLayer();
                if (!layer)
                    return;
                var txt_1 = new egret.BitmapText();
                txt_1.font = RES.getRes("font_source_fnt");
                txt_1.text = PropModel.getItemDesc(MainMapModel.getValueIconType(this.m_pID)) + "+" + count;
                txt_1.lineSpacing = -10;
                txt_1.x = this.x + this.width * 0.5;
                txt_1.y = this.y + this.height;
                AnchorUtil.setAnchor(txt_1, 0.5);
                txt_1.scaleX = 0;
                txt_1.scaleY = 0;
                var ty = txt_1.y - 40;
                Utils.addChild(layer, txt_1);
                egret.Tween.get(txt_1)
                    .to({ scaleX: 1, scaleY: 1, y: ty }, 500, Ease.backInOut)
                    .wait(1000)
                    .to({ alpha: 0 }, 500)
                    .call(function () { Utils.removeFromParent(txt_1); }, this);
            }
        };
        MBuildPP.NAME = 'MBuildPP';
        return MBuildPP;
    }(com_main.CComponent));
    com_main.MBuildPP = MBuildPP;
})(com_main || (com_main = {}));
