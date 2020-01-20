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
     * 情报Item
     * @export
     * @class WorldBattleItem
     * @extends eui.ItemRenderer
     */
    var WorldBattleItem = /** @class */ (function (_super_1) {
        __extends(WorldBattleItem, _super_1);
        function WorldBattleItem() {
            var _this = _super_1.call(this) || this;
            _this.m_nCityId = 0;
            _this.m_nDt = 0;
            _this.skinName = Utils.getSkinName("app/world/world_battle_item.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            _this.cacheAsBitmap = true;
            return _this;
        }
        WorldBattleItem.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        WorldBattleItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGo, this, this.__on_click);
            this.m_pRichText = new com_main.CCRichText(this.m_pLbContent);
            Utils.addChild(this, this.m_pRichText);
        };
        WorldBattleItem.prototype.__on_click = function (e) {
            com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, this.m_nCityId);
            com_main.UpManager.history();
        };
        WorldBattleItem.prototype.dataChanged = function () {
            var _this = this;
            if (this.m_nCityId == this.data.id && !this.data.update)
                return;
            Utils.TimerManager.remove(this.$update, this);
            this.m_nCityId = this.data.id;
            var event = WorldModel.getWarn(this.m_nCityId), config = C.WarningConfig[event.pid];
            if (event.pid == 5) {
            }
            else {
                var txt = this.__check_args.apply(this, [event.pid, GLan(config.content)].concat(event.content));
                this.m_pRichText.subText = txt;
                this.m_pLbTitle.text = GLan(config.Types);
            }
            if (event.dt > 0) {
                var dt = event.dt - TimerUtils.getServerTime();
                this.m_nDt = dt < 0 ? 0 : dt;
                this.m_pLbTime.visible = true;
                if (this.m_nDt > 0) {
                    this.m_pLbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_TMOVE_TIPS, Utils.DateUtils.getFormatBySecond(this.m_nDt)));
                    Utils.TimerManager.doTimer(1000, this.m_nDt + 1, this.$update, this, function () {
                        _this.m_pLbTime.visible = false;
                    });
                }
            }
            else {
                this.m_pLbTime.visible = false;
            }
            this.m_pIco.source = config.iconID + "_png";
        };
        WorldBattleItem.prototype.$update = function () {
            --this.m_nDt;
            if (this.m_nDt <= 0) {
                return;
            }
            this.m_pLbTime.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.WOR_TMOVE_TIPS, Utils.DateUtils.getFormatBySecond(this.m_nDt)));
        };
        WorldBattleItem.prototype.__check_args = function (pid, content) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var checkNum = function (str) {
                var count = 0, pos = str.indexOf("%s");
                while (pos !== -1) {
                    count++;
                    pos = str.indexOf("%s", pos + 1);
                }
                return count;
            }, checkBatt = function (num) {
                if (num < 10000)
                    return "" + num;
                return Math.floor(num / 10000) + " " + GCode(CLEnum.NUM_WAN);
            }, checkCity = function (cid) {
                var conf = C.WorldMapConfig[cid];
                return GLan(conf.name);
            }, checkCountry = function (country) {
                var text = "";
                switch (country) {
                    case 1:
                        text = GCode(CLEnum.STATE_WEI);
                        break;
                    case 2:
                        text = GCode(CLEnum.STATE_SHU);
                        break;
                    case 3:
                        text = GCode(CLEnum.STATE_WU);
                        break;
                    case 6:
                        text = GCode(CLEnum.STATE_HUANG_TROOP);
                }
                return text;
            };
            if (checkNum(content) != args.length) {
                error("====__check_args args is err====================", pid, args);
                return "";
            }
            var c = "";
            if (pid == 1 || pid == 2) {
                var batt = args[0], cid = args[1];
                c = StringUtils.stringFormat(content, GCodeFromat(CLEnum.WOR_TEAM_NUM, checkBatt(batt)), checkCity(cid));
            }
            else if (pid == 3) {
                var cid = args[0];
                c = StringUtils.stringFormat(content, checkCity(cid));
            }
            else if (pid == 4 || pid == 6) {
                var cid = args[0], country = args[1];
                c = StringUtils.stringFormat(content, checkCity(cid), checkCountry(country));
            }
            return c;
        };
        return WorldBattleItem;
    }(eui.ItemRenderer));
    com_main.WorldBattleItem = WorldBattleItem;
})(com_main || (com_main = {}));
