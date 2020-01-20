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
    var CrossHeroItem = /** @class */ (function (_super_1) {
        __extends(CrossHeroItem, _super_1);
        function CrossHeroItem() {
            var _this = _super_1.call(this) || this;
            _this.m_nOrder = 0; //队伍下标
            _this.skinName = Utils.getSkinName("app/world/world_hero_item.exml");
            return _this;
        }
        CrossHeroItem.prototype.$onRemoveFromStage = function () {
            this.onDestroy();
        };
        CrossHeroItem.prototype.onDestroy = function () {
            this.removeEvent();
        };
        CrossHeroItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
        };
        //=============================================================================================================================================
        //事件监听 begin
        //============================================================================================================================================= 
        CrossHeroItem.prototype.addEvent = function () {
        };
        CrossHeroItem.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
        };
        /**
         * 按钮操作
         */
        CrossHeroItem.prototype.onHandler = function (e) {
            e.stopImmediatePropagation();
            var teamVo = TeamModel.getTeamVoByType(5 /* CROSS_SERVER */, this.m_nOrder);
            switch (teamVo.state) {
                case 0 /* IDLE */: {
                    Utils.open_view(TASK_UI.POP_WORLD_TROOP_PANEL, { order: this.m_nOrder });
                    break;
                }
                case 4 /* MOVE */: {
                    var m_teamKey = WorldModel.getOwnerTeamMoveKey(this.m_nOrder);
                    Utils.open_view(TASK_UI.POP_WORLD_ACCELERATE_PANEL, { teamKey: m_teamKey });
                    break;
                }
            }
        };
        //=============================================================================================================================================
        //事件监听 end
        //============================================================================================================================================= 
        CrossHeroItem.prototype.dataChanged = function () {
            var data = this.data;
            this.m_nOrder = data.order;
            //队伍未解锁
            if (this.m_nOrder > TeamModel.getTeamMax(5 /* CROSS_SERVER */)) {
                this.currentState = "lock";
                return;
            }
            var teamVo = TeamModel.getTeamVoByType(5 /* CROSS_SERVER */, this.m_nOrder);
            //空队伍
            if (teamVo.isEmptyTeam()) {
                this.currentState = "empty";
                return;
            }
            this.currentState = "cross";
            this.commitProperties();
            var info = teamVo.getTeamUiInfo();
            this.m_pLbAmry.text = GCode(CLEnum.CAMP_ARMY) + Global.getNumber(Number(this.m_nOrder + 1));
            this.m_pLbName.text = GeneralModel.getGeneralName(info.headId);
            this.m_pHeroHead.setGenId(info.headId);
            //血量
            var per = info.hp / info.maxHp;
            this.m_pPow.scaleX = per > 1 ? 1 : per;
            // //战斗力
            this.m_comFightItem.setFight(info.fight);
            this.m_pLbCity.text = TeamModel.getStateDes(teamVo.state);
            Utils.isGray(false, this.m_pGay);
            var cityname = "";
            switch (teamVo.state) {
                case 0 /* IDLE */: {
                    cityname = WorldModel.getCityName(teamVo.cityId);
                    var desc = cityname + "-<font color=0x44d0f3>" + TeamModel.getStateDes(teamVo.state) + "</font>";
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    break;
                }
                case 4 /* MOVE */: {
                    this.m_pIco.source = "icon_yd_png";
                    Utils.isGray(true, this.m_pGay);
                    // let moveData: gameProto.ITeamMoveDataResp = WorldModel.getOwnerTeamMoveData(this.m_nOrder);
                    // if (moveData) {
                    //     let cityId = moveData.cityPath[moveData.cityPath.length - 1]
                    //     cityname = WorldModel.getCityName(cityId);
                    //     this.m_pLbCity.text = GCodeFromat(CLEnum.WOR_HE_GO, cityname);
                    // }
                    this.m_pLbCity.text = '移动中';
                    break;
                }
                // case TeamState.BATTLE:
                case 2 /* WORLD_BATTLE */:
                case 1 /* QUEQUIE */:
                case 5 /* WAR */: {
                    Utils.isGray(true, this.m_pGay);
                    var desc = cityname + "-" + TeamModel.getStateDes(teamVo.state);
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    this.m_pIco.source = "common_att_png";
                    break;
                }
            }
        };
        return CrossHeroItem;
    }(eui.ItemRenderer));
    com_main.CrossHeroItem = CrossHeroItem;
})(com_main || (com_main = {}));
