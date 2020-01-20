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
    var BuildQueueCell = /** @class */ (function (_super_1) {
        __extends(BuildQueueCell, _super_1);
        function BuildQueueCell() {
            var _this = _super_1.call(this) || this;
            _this.buildId = -1;
            _this.m_isActive = false;
            _this.maxBarWidth = 0;
            _this.skinName = Utils.getSkinName("app/map/cell/build_queue_cell_skin.exml");
            return _this;
        }
        BuildQueueCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.maxBarWidth = this.m_pBar.width;
            this.m_pBar.width = 0;
            com_main.EventManager.addTouchScaleListener(this, this, this.onClickCel);
            com_main.EventMgr.addEvent(BuildEvent.BUILD_QUEUE_CHANGE, this.onBuildQueueChange, this);
        };
        BuildQueueCell.prototype.onDestroy = function () {
            com_main.EventMgr.removeEventByObject(BuildEvent.BUILD_QUEUE_CHANGE, this);
            this.clearTimeCallback();
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        //点击
        BuildQueueCell.prototype.onClickCel = function () {
            if (this.buildId != -1) {
                com_main.MainMap.moveToBuild(this.buildId, true);
                com_main.MainMap.showMoveSelectEffect(this.buildId);
            }
            else {
                MainMapModel.MoveToCanGradeUpBuild();
            }
        };
        //设置时间
        BuildQueueCell.prototype.setTimeStr = function () {
            if (this.m_pLbTime) {
                var buildVo = MainMapModel.getBuildInfo(this.buildId);
                if (buildVo) {
                    var dateInfo = Utils.DateUtils.getCountdownInfo(buildVo.buildStartTime * 1000, buildVo.buildEndTime * 1000, buildVo.speedTime * 1000, false);
                    this.m_pLbTime.text = dateInfo[1] + "";
                    this.m_pBar.width = this.maxBarWidth * Number(dateInfo[0]);
                }
                // let curtime = TimerUtils.getServerTimeMill();
                // let time = this.m_endTime - curtime;
                // time = time<0? 0:time;
                // this.m_pLbTime.text = Utils.DateUtils.getFormatBySecond1(Math.floor(time * 0.001));
                // //let rate = 
                // let allTime = this.m_endTime - this.m_startTime;
                // if(allTime==0){
                // 	this.m_pBar.width = 0;
                // }else{
                // 	let edTime = curtime - this.m_startTime;
                // 	let barWidth = this.m_pBarBg.width*(edTime)/allTime;
                // 	this.m_pBar.width = barWidth;
                // }
            }
            else {
                error("BuildQueueCelle is Error!!!!");
            }
        };
        BuildQueueCell.prototype.timeCallback = function () {
            if (!MainMapModel.isInBuilding(this.buildId)) {
                this.onInActive();
            }
            else {
                this.setTimeStr();
            }
        };
        Object.defineProperty(BuildQueueCell.prototype, "index", {
            //设置索引
            set: function (val) {
                this.m_nIndex = val;
                this.updateView();
            },
            enumerable: true,
            configurable: true
        });
        //当队列改变
        BuildQueueCell.prototype.onBuildQueueChange = function (index) {
            if (this.m_nIndex == index) {
                this.updateView();
            }
        };
        //刷新界面
        BuildQueueCell.prototype.updateView = function () {
            var buildId = MainMapModel.getBuildIdByIndex(this.m_nIndex);
            if (buildId == -1) {
                this.onInActive();
            }
            else {
                this.setBuildId(buildId);
            }
        };
        //空闲state
        BuildQueueCell.prototype.onInActive = function () {
            this.clearTimeCallback();
            this.m_pBar.width = 0;
            this.currentState = "free";
            this.m_pLbTime.text = GCode(CLEnum.CITY_BD_IDEL);
            this.m_isActive = false;
            this.buildId = -1;
        };
        //激活state
        BuildQueueCell.prototype.setBuildId = function (id) {
            this.buildId = id;
            if (MainMapModel.isInBuilding(this.buildId)) {
                if (!this.m_isActive) {
                    MainMapModel.addCall(this.timeCallback, this, this.buildId);
                    this.m_isActive = true;
                }
                var info = MainMapModel.getBuildInfo(id);
                if (info) {
                    this.m_endTime = info.buildEndTime;
                    this.m_startTime = info.buildStartTime;
                    this.setTimeStr();
                }
                this.currentState = "work";
            }
        };
        BuildQueueCell.prototype.getBuildId = function () {
            return this.buildId;
        };
        BuildQueueCell.prototype.getBuildLevel = function () {
            var buildVo = MainMapModel.getBuildInfo(this.buildId);
            if (buildVo) {
                return buildVo.level;
            }
            return 0;
        };
        BuildQueueCell.prototype.autoLevelUp = function () {
            var id = MainMapModel.getRecommedBuildId();
            if (id == -1) {
                return 0;
            }
            com_main.MainMap.moveToBuildAndOpen(id, true);
            return id;
        };
        //清除回调
        BuildQueueCell.prototype.clearTimeCallback = function () {
            MainMapModel.removeCall(this, this.buildId);
        };
        return BuildQueueCell;
    }(com_main.CComponent));
    com_main.BuildQueueCell = BuildQueueCell;
})(com_main || (com_main = {}));
