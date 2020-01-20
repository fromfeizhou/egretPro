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
    /** 道具 */
    var TreaStoneProp = /** @class */ (function (_super_1) {
        __extends(TreaStoneProp, _super_1);
        function TreaStoneProp() {
            return _super_1.call(this) || this;
        }
        TreaStoneProp.prototype.setInfo = function (vo, data) {
            this.m_labTile.text = GCodeFromat(CLEnum.TREA_STONE_BSK2, data.pos + 1);
            if (data.gemstoneId > 0) {
                this.currentState = 'inlay';
                this.commitProperties();
                Utils.isGray(false, this.m_pTitleRoot);
                var itemCfg = C.ItemConfig[data.gemstoneId];
                var stoneCfg = C.GemstoneConfig[data.gemstoneId];
                Utils.setPropLabName(data.gemstoneId, this.m_labName);
                var datas = StringUtils.keyValsToNumberArray(stoneCfg.attri);
                this.m_labAttri.textFlow = Utils.htmlParser(Utils.getAttriFormat(datas[0], true, '%s<font color=#00ff00>%s</font>'));
            }
            else {
                this.currentState = 'unInlay';
                this.commitProperties();
                Utils.isGray(true, this.m_pTitleRoot);
                var openNum = vo.getStarCfg().unlockHole;
                if (data.pos >= openNum) {
                    this.m_labName.text = GCodeFromat(CLEnum.TREA_STONE_JS, vo.getStoneOpenStar(data.pos));
                }
                else {
                    this.m_labName.text = GCode(CLEnum.TREA_STONE_WXQ);
                }
            }
        };
        return TreaStoneProp;
    }(com_main.CComponent));
    com_main.TreaStoneProp = TreaStoneProp;
    var TreaStoneExProp = /** @class */ (function (_super_1) {
        __extends(TreaStoneExProp, _super_1);
        function TreaStoneExProp() {
            var _this = _super_1.call(this) || this;
            _this.m_bActivited = true;
            return _this;
        }
        TreaStoneExProp.prototype.setInfo = function (data) {
            this.m_labTile.text = TreasureModel.getPropStoneTypeName(data.type);
            this.m_labAttri.textFlow = Utils.htmlParser(Utils.getAttriFormat(data.exAttr, true, '%s<font color = 0x00ff00>%s</font>'));
        };
        Object.defineProperty(TreaStoneExProp.prototype, "activited", {
            set: function (val) {
                if (this.m_bActivited == val)
                    return;
                this.m_bActivited = val;
                Utils.isGray(!val, this);
            },
            enumerable: true,
            configurable: true
        });
        return TreaStoneExProp;
    }(com_main.CComponent));
    com_main.TreaStoneExProp = TreaStoneExProp;
})(com_main || (com_main = {}));
