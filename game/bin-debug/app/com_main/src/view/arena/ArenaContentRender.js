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
    var ArenaContentRender = /** @class */ (function (_super_1) {
        __extends(ArenaContentRender, _super_1);
        function ArenaContentRender(param) {
            var _this = _super_1.call(this) || this;
            _this.m_state = 0; //当前状态
            _this.skinName = Utils.getAppSkin("arena/arena_content_render.exml");
            return _this;
        }
        ArenaContentRender.prototype.$onRemoveFromStage = function () {
            com_main.EventManager.removeEventListeners(this.m_groupBox);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        ArenaContentRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            // this.cacheAsBitmap = true;
        };
        ArenaContentRender.prototype.dataChanged = function () {
            this.Refresh();
        };
        /**
         *
         * Pass,CurStage,UnPass
         */
        ArenaContentRender.prototype.Refresh = function () {
            if (this.data.cfg.id < ArenaModel.arenaId || !ArenaModel.arenaId) {
                this.currentState = "Pass";
                this.m_state = ArenaEnum.Pass;
            }
            else if (this.data.cfg.id > ArenaModel.arenaId && !ArenaModel.getAwardById(this.data.cfg.id)) {
                this.currentState = "UnPass";
                this.m_state = ArenaEnum.CurStage;
            }
            else {
                this.currentState = "CurStage";
                this.m_state = ArenaEnum.CurStage;
            }
            this.m_BackGround.source = "arena_item_stage_" + this.data.cfg.background + "_jpg";
            var id = this.data.cfg.id;
            this.m_labStage.text = GCodeFromat(CLEnum.CHALL_NUM, id);
            this.m_RecomPower.text = this.data.cfg.power;
            if (this.data.cfg.isBox) {
                this.m_groupBox.visible = true;
                this.m_groupItem.visible = false;
                com_main.EventManager.addTouchScaleListener(this.m_groupBox, this, this.onBoxClick);
            }
            else {
                this.m_groupBox.visible = false;
                this.m_groupItem.visible = true;
                var rewardInfo = void 0;
                if (this.m_state == ArenaEnum.Pass || ArenaModel.getAwardById(this.data.cfg.id)) {
                    rewardInfo = Utils.parseCommonItemJson(this.data.cfg.reward);
                }
                else {
                    rewardInfo = Utils.parseCommonItemJsonInDrop(this.data.cfg.firstReward);
                }
                this.m_groupItem.removeChildren();
                for (var i = 0; i < rewardInfo.length; i++) {
                    var item = com_main.ComItemNew.create('count');
                    item.setItemInfo(rewardInfo[i].itemId, rewardInfo[i].count);
                    this.m_groupItem.addChild(item);
                }
                this.validateNow();
            }
            if (ArenaModel.getAwardById(this.data.cfg.id)) {
                this.m_imgIcon.source = '';
            }
            else {
                this.m_imgIcon.source = 'lb_ssjl_png';
            }
            this.m_currFight.visible = this.data.cfg.id == ArenaModel.arenaId ? true : false; //当前挑战标识
        };
        ArenaContentRender.prototype.onBoxClick = function () {
            if (this.data.cfg) {
                var arrInfo = void 0;
                if (this.m_state == ArenaEnum.Pass || ArenaModel.getAwardById(this.data.cfg.id)) {
                    arrInfo = this.data.cfg.reward;
                }
                else {
                    // let tmpList: any[] = JSON.parse(this.data.cfg.firstReward);
                    arrInfo = Utils.parseCommonItemJsonInDrop(this.data.cfg.firstReward);
                }
                Utils.open_view(TASK_UI.NOR_BOX_INFO_PANEL, { awards: arrInfo });
            }
        };
        return ArenaContentRender;
    }(eui.ItemRenderer));
    com_main.ArenaContentRender = ArenaContentRender;
})(com_main || (com_main = {}));
