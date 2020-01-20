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
    var WorldHeroItem = /** @class */ (function (_super_1) {
        __extends(WorldHeroItem, _super_1);
        function WorldHeroItem() {
            var _this = _super_1.call(this) || this;
            _this.m_nOrder = 0; //队伍下标
            _this.m_nCityId = 0;
            _this.skinName = Utils.getSkinName("app/world/world_hero_item.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        // public $onRemoveFromStage() {
        //     this.onDestroy();
        // }
        WorldHeroItem.prototype.onDestroy = function () {
            this.removeEvent();
        };
        WorldHeroItem.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.addEvent();
        };
        //=============================================================================================================================================
        //事件监听 begin
        //============================================================================================================================================= 
        WorldHeroItem.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_posBtn, this, this.goTargetCity);
            com_main.EventManager.addTouchScaleListener(this.m_pHand, this, this.onHandler);
        };
        WorldHeroItem.prototype.removeEvent = function () {
            com_main.EventManager.removeEventListeners(this);
            com_main.EventManager.removeEventListener(this.m_pPanel);
        };
        /**
         * 按钮操作
         */
        WorldHeroItem.prototype.onHandler = function (e) {
            e.stopImmediatePropagation();
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nOrder);
            switch (teamVo.state) {
                case 0 /* IDLE */: {
                    Utils.open_view(TASK_UI.POP_WORLD_TROOP_PANEL, { order: this.m_nOrder, cityId: this.m_nCityId });
                    break;
                }
                case 4 /* MOVE */: {
                    var m_teamKey = WorldModel.getOwnerTeamMoveKey(this.m_nOrder);
                    Utils.open_view(TASK_UI.POP_WORLD_ACCELERATE_PANEL, { teamKey: m_teamKey });
                    break;
                }
            }
        };
        WorldHeroItem.prototype.goTargetCity = function (e) {
            e.stopImmediatePropagation();
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nOrder);
            var cityId = teamVo.cityId;
            ;
            if (cityId > 0) {
                com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, cityId);
                com_main.UpManager.history();
            }
        };
        //=============================================================================================================================================
        //事件监听 end
        //============================================================================================================================================= 
        WorldHeroItem.prototype.dataChanged = function () {
            var data = this.data;
            this.m_nOrder = data.order;
            //队伍未解锁
            if (this.m_nOrder > TeamModel.getTeamMax(1 /* WORLD */)) {
                this.currentState = "lock";
                return;
            }
            var teamVo = TeamModel.getTeamVoByType(1 /* WORLD */, this.m_nOrder);
            //空队伍
            if (teamVo.isEmptyTeam()) {
                this.currentState = "empty";
                return;
            }
            this.currentState = "base";
            this.commitProperties();
            this.m_pImgLight.visible = this.data.selected;
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
            this.m_pHand.visible = true;
            switch (teamVo.state) {
                case 0 /* IDLE */: {
                    cityname = WorldModel.getCityName(teamVo.cityId);
                    var desc = cityname + "-<font color=0x44d0f3>" + TeamModel.getStateDes(teamVo.state) + "</font>";
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    this.m_handBtn.source = "btn_120_png";
                    this.m_handpLb.source = "lb_bb_png";
                    this.m_pHand.visible = per < 1;
                    break;
                }
                case 4 /* MOVE */: {
                    this.m_pIco.source = "icon_yd_png";
                    Utils.isGray(true, this.m_pGay);
                    var moveData = WorldModel.getOwnerTeamMoveData(this.m_nOrder);
                    if (moveData) {
                        var cityId = moveData.cityPath[moveData.cityPath.length - 1];
                        cityname = WorldModel.getCityName(cityId);
                        this.m_pLbCity.text = GCodeFromat(CLEnum.WOR_HE_GO, cityname);
                        this.m_handBtn.source = "btn_034_up_png";
                        this.m_handpLb.source = "lb_js_png";
                    }
                    break;
                }
                case 5 /* WAR */:
                case 2 /* WORLD_BATTLE */:
                case 1 /* QUEQUIE */: {
                    Utils.isGray(true, this.m_pGay);
                    var desc = cityname + "-" + TeamModel.getStateDes(teamVo.state);
                    this.m_pLbCity.textFlow = Utils.htmlParser(desc);
                    this.m_pIco.source = "common_att_png";
                    this.m_pHand.visible = false;
                    break;
                }
            }
        };
        return WorldHeroItem;
    }(eui.ItemRenderer));
    com_main.WorldHeroItem = WorldHeroItem;
})(com_main || (com_main = {}));
