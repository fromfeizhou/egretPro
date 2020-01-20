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
    var MBuildRK = /** @class */ (function (_super_1) {
        __extends(MBuildRK, _super_1);
        function MBuildRK(type, pos) {
            var _this = _super_1.call(this) || this;
            _this.m_pPos = 0;
            _this.m_pType = 0;
            _this.name = MBuildRK.NAME;
            _this.m_pType = type;
            _this.m_pPos = pos;
            _this.skinName = Utils.getAppSkin("map/map_build_rk.exml");
            _this.touchEnabled = false;
            _this.touchChildren = false;
            return _this;
        }
        /**
         * 销毁方法
         */
        MBuildRK.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        MBuildRK.create = function (type, pos) {
            var obj = new MBuildRK(type, pos);
            return obj;
        };
        Object.defineProperty(MBuildRK.prototype, "pos", {
            get: function () {
                return this.m_pPos;
            },
            set: function (pos) {
                this.m_pPos = pos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MBuildRK.prototype, "type", {
            get: function () {
                return this.m_pType;
            },
            set: function (type) {
                this.m_pType = type;
            },
            enumerable: true,
            configurable: true
        });
        MBuildRK.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.init();
        };
        /**初始化 */
        MBuildRK.prototype.init = function () {
            this.setIcon();
            this.setName();
        };
        MBuildRK.prototype.setIcon = function () {
            this.m_pIcon.texture = Utils.getPopTitleIcon(this.m_pType);
        };
        MBuildRK.prototype.setName = function () {
            var name = '';
            switch (this.m_pType) {
                case PopTitleIconType.UPGRADE: {
                    break;
                }
                case PopTitleIconType.GENERAL_INFO: {
                    break;
                }
                case PopTitleIconType.TAVERN: {
                    break;
                }
                case PopTitleIconType.BF: {
                    break;
                }
                case PopTitleIconType.SM: {
                    break;
                }
                case PopTitleIconType.LTG: {
                    break;
                }
                case PopTitleIconType.GEM: {
                    break;
                }
                case PopTitleIconType.KJ: {
                    break;
                }
                case PopTitleIconType.ZC: {
                    break;
                }
                case PopTitleIconType.RANK: {
                    break;
                }
                case PopTitleIconType.TREASRE_COM: {
                    break;
                }
                case PopTitleIconType.TREASRE_UP: {
                    break;
                }
                case PopTitleIconType.MILITARY_TASK: {
                    break;
                }
                case PopTitleIconType.BUBINGYING: {
                    break;
                }
                case PopTitleIconType.QIBINGYING: {
                    break;
                }
                case PopTitleIconType.GONGBINGYING: {
                    break;
                }
            }
            this.m_pName.text = name;
        };
        MBuildRK.NAME = 'MBuildRK';
        return MBuildRK;
    }(com_main.CComponent));
    com_main.MBuildRK = MBuildRK;
})(com_main || (com_main = {}));
