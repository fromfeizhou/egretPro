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
/**
 * 内城战地图
 */
var com_main;
(function (com_main) {
    var CrossWallWarMap = /** @class */ (function (_super_1) {
        __extends(CrossWallWarMap, _super_1);
        function CrossWallWarMap() {
            var _this = _super_1.call(this) || this;
            _this.name = CrossWallWarMap.NAME;
            _this.initApp("cross/CrossWallWarMapSkin.exml");
            return _this;
        }
        CrossWallWarMap.prototype.onDestroy = function () {
            //退出战斗
            CrossProxy.C2S_CROSS_SERVER_WAR_ENTER(4);
            this.clearTimeHandler();
            this.removeEvent();
            if (this.m_tMcList) {
                for (var _i = 0, _a = this.m_tMcList; _i < _a.length; _i++) {
                    var mc = _a[_i];
                    if (mc)
                        mc.onDestroy();
                }
                this.m_tMcList = null;
            }
            _super_1.prototype.onDestroy.call(this);
        };
        CrossWallWarMap.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.width = egret.MainContext.instance.stage.stageWidth;
            this.height = egret.MainContext.instance.stage.stageHeight;
            Utils.toStageMaxScale(this.m_imgBg);
            Utils.toStageBestScaleHeigt(this.m_pRoot);
            this.m_btnFight.setTitleLabel('部队进攻');
            this.addEvent();
            this.initSceneMc();
            this.onWallUpdate();
            this.onWallStatus();
            this.initTimeTick();
            //场景创建完毕
            SceneManager.sceneCreateComplete();
        };
        /**创建动画 */
        CrossWallWarMap.prototype.initSceneMc = function () {
            this.m_tMcList = [];
            //皇帝
            var data = CrossModel.wallInfo;
            var mc = new com_main.GenTitleMc();
            mc.setMcInfo(1002, 1.5, false, { countryId: data.countryId, name: data.nickName, factName: data.guildName, isSelf: false, titleId: 2 });
            this.m_pGenLeader.addChild(mc);
            this.m_tMcList.push(mc);
            //猛将
            var tmpList = [1017, 1010, 1005, 1021, 1036];
            for (var i = 0; i < 5; i++) {
                var tmp = new com_main.GenTitleMc();
                tmp.setMcInfo(tmpList[i], 1.2, true);
                this["m_pGen" + i].addChild(tmp);
                this.m_tMcList.push(tmp);
            }
            this.m_labTitle.text = data.group == 1 ? '皇城南门' : '皇城北门';
        };
        /**开战倒计时 */
        CrossWallWarMap.prototype.initTimeTick = function () {
            this.m_nCountDown = CrossModel.openTime - TimerUtils.getServerTime();
            if (this.m_nCountDown > 0) {
                this.m_bTick = true;
                this.m_nCountDown++;
                this.onTimeHandler();
                Utils.TimerManager.doTimer(1000, 0, this.onTimeHandler, this);
            }
        };
        CrossWallWarMap.prototype.onTimeHandler = function () {
            this.m_nCountDown--;
            if (this.m_nCountDown > 0) {
                this.m_labAttTime.text = TimerUtils.diffTimeFormat('hh:mm:ss', this.m_nCountDown) + "\u540E\u5F00\u59CB\u8FDB\u653B";
            }
            else {
                this.clearTimeHandler();
            }
        };
        /**清理时间回调 */
        CrossWallWarMap.prototype.clearTimeHandler = function () {
            if (!this.m_bTick)
                return;
            this.m_bTick = false;
            Utils.TimerManager.remove(this.onTimeHandler, this);
        };
        //=================================================================================================================
        //事件监听 begin
        //=================================================================================================================
        CrossWallWarMap.prototype.addEvent = function () {
            com_main.EventManager.addTouchScaleListener(this.m_btnFight, this, this.onBtnFight);
            com_main.EventManager.addTouchScaleListener(this.m_btnFightView, this, this.onBtnFightView);
            com_main.EventMgr.addEvent(CrossWarEvent.CROSS_WALL_UPDATE, this.onWallUpdate, this);
            com_main.EventMgr.addEvent(CrossWarEvent.CROSS_WALL_STATUS, this.onWallStatus, this);
            com_main.EventMgr.addEvent(CrossWarEvent.CROSS_SERVER_STATUS, this.onServerStatus, this);
        };
        CrossWallWarMap.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(CrossWarEvent.CROSS_WALL_UPDATE, this);
            com_main.EventMgr.removeEventByObject(CrossWarEvent.CROSS_WALL_STATUS, this);
            com_main.EventMgr.removeEventByObject(CrossWarEvent.CROSS_SERVER_STATUS, this);
        };
        /**挑战按钮 */
        CrossWallWarMap.prototype.onBtnFight = function () {
            Utils.open_view(TASK_UI.CROSS_HERO_PANEL);
        };
        /**hp变动 */
        CrossWallWarMap.prototype.onWallUpdate = function () {
            if (!CrossModel.wallHp)
                return;
            var myHp = CrossModel.wallHp.myHpRate / 10000;
            this.m_imgPro.width = 236 * myHp;
            this.m_labPro.text = (myHp * 100).toFixed(2) + '%';
            var enemyHp = (CrossModel.wallHp.enemyHpRate / 100).toFixed(2);
            this.m_labEnemyHp.text = "\u654C\u65B9\u5269\u4F59\uFF1A" + enemyHp + "%";
        };
        //攻城状态刷新
        CrossWallWarMap.prototype.onWallStatus = function () {
            this.m_btnFightView.visible = CrossModel.wallStatus == 1;
            this.m_btnFight.visible = CrossModel.crossStatus == 4 /* WALL_WAR */;
            this.m_pAttTime.visible = !CrossModel.isWar();
        };
        /**观战 */
        CrossWallWarMap.prototype.onBtnFightView = function () {
            if (CrossModel.wallInfo && CrossModel.wallInfo.cityId) {
                WorldProxy.send_C2S_CITY_WAR_GO(CrossModel.wallInfo.cityId);
            }
        };
        /**跨服战状态切换 */
        CrossWallWarMap.prototype.onServerStatus = function () {
            this.onWallStatus();
            if (CrossModel.crossStatus == 4 /* WALL_WAR */) {
                return;
            }
            if (CrossModel.crossStatus == 5 /* CITY_WAR */) {
                SceneManager.enterScene(SceneEnums.CROSS_WAR_MAP);
                return;
            }
            SceneManager.runSceneBefore();
        };
        CrossWallWarMap.NAME = 'CrossWallWarMap';
        return CrossWallWarMap;
    }(com_main.CView));
    com_main.CrossWallWarMap = CrossWallWarMap;
})(com_main || (com_main = {}));
