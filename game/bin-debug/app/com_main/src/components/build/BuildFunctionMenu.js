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
     * 建筑功能入口
     */
    var BuildFunctionMenu = /** @class */ (function (_super_1) {
        __extends(BuildFunctionMenu, _super_1);
        function BuildFunctionMenu(buildId) {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("build/BuildFunctionMenuSkin.exml");
            _this.m_buildId = buildId;
            return _this;
        }
        BuildFunctionMenu.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this.m_bg);
            Utils.removeFromParent(this);
            _super_1.prototype.onDestroy.call(this);
        };
        BuildFunctionMenu.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_cellList = [];
        };
        BuildFunctionMenu.prototype.check_Click = function (x, y) {
            for (var index = 0; index < this.m_cellList.length; index++) {
                var cell = this.m_cellList[index];
                if (cell.visible) {
                    if (cell.m_pIcon.hitTestPoint(x, y, true)) {
                        this.onClickCell(cell.getCellType());
                        return true;
                    }
                }
            }
            return false;
        };
        //点击
        BuildFunctionMenu.prototype.onClickCell = function (type) {
            if (!this.m_build)
                return;
            //待整理
            // switch(type){
            // 	case FunctionType.FT_BBY:
            // 	case FunctionType.FT_QBY:	
            // 	case FunctionType.FT_GBY:{
            // 		if(this.m_build.getBuildSoldierPPState()){
            // 			//SoldierProxy.send_GET_TRAIN_ARMY(this.m_buildId);
            // 		}
            // 		break;
            // 	}
            // }
            // FunctionModel.openFunctionByType(type,this.m_buildId);
            //FunctionManager.openFunctionViewByType(type,C.BuildingConfig[this.m_buildId].type);
            this.hideView();
            com_main.MainMap.m_pLastSelectBuild = this.m_buildId;
            com_main.MainMap.moveToBuildUI(this.m_buildId);
        };
        //设置面板数据
        BuildFunctionMenu.prototype.setBuild = function (build) {
            if (build) {
                this.m_build = build;
                this.m_buildId = build.getBuildId();
                this.updateView();
            }
            else {
                this.hideView();
                this.m_build = null;
            }
        };
        //刷新界面
        BuildFunctionMenu.prototype.updateView = function () {
            this.x = this.m_build.x;
            this.y = this.m_build.y + this.m_build.height / 2;
            var namePos = this.m_build.getPosInfo();
            this.x += namePos.nameOffset[0];
            if (this.m_buildId == MBuildId.HALL_BUILD_ID)
                this.y -= 100;
            var arr = MainMapModel.getOpenRK(this.m_build.getBuildId());
            var posList = this.getRKPos(arr.length);
            var time = 0;
            var add_time = 80;
            var move_time = 200;
            var index = 0;
            this.setBgTween(true);
            for (; index < arr.length; index++) {
                var cell = this.m_cellList[index];
                if (!cell) {
                    cell = new BuildFunctionMenuCell(this.m_buildId);
                    this.m_cellList[index] = cell;
                    Utils.addChild(this, cell);
                }
                cell.updateView(arr[index], index);
                // if(cell.getCellType() == -1){ //出现-1的情况下，说明必须要去领取才能显示其他的操作
                // 	this.m_cellList.splice(index,1);
                // 	Utils.removeFromParent(cell);
                // 	posList = this.getRKPos(arr.length-1);
                // 	arr.splice(index,1);
                // 	index = index -2;
                // 	continue;
                // }
                cell.visible = true;
                cell.anchorOffsetX = cell.width / 2;
                cell.anchorOffsetY = cell.height / 2;
                cell.scaleX = 0;
                cell.scaleY = 0;
                cell.alpha = 0;
                cell.x = this.width * 0.5;
                cell.y = 0;
                var pos = posList[index];
                egret.Tween.removeTweens(cell);
                egret.Tween.get(cell).wait(time).to({ x: pos.x, y: pos.y, scaleX: 1, scaleY: 1, alpha: 1 }, move_time).call(function () {
                    // this.m_pPKNum -= 1;
                    // if (this.m_pPKNum == 0) {
                    // 	GuideUI.onMove();
                    // }
                }, this);
                time += add_time;
                this.m_build.isGlow(true);
                // if (this.m_build.getPPIcon())
                // 	this.m_build.getPPIcon().visible = false;
                this.m_build.showName(false);
            }
            for (; index < this.m_cellList.length; index++) {
                this.m_cellList[index].visible = false;
            }
        };
        //设置bg动画
        BuildFunctionMenu.prototype.setBgTween = function (isShow) {
            egret.Tween.removeTweens(this.m_bg);
            if (isShow) {
                egret.Tween.get(this.m_bg).to({ alpha: 1 }, 500);
            }
            else {
                egret.Tween.get(this.m_bg).to({ alpha: 0 }, 500).call(this.onDestroy, this);
            }
        };
        //隐藏界面
        BuildFunctionMenu.prototype.hideView = function () {
            if (this.m_build) {
                this.setBgTween(false);
                var time = 0;
                var add_time = 80;
                var move_time = 200;
                var index = 0;
                var cells = this.m_cellList;
                var tempx = this.width * 0.5;
                var tempy = 0;
                for (index = 0; index < cells.length; index++) {
                    var cell = cells[index];
                    if (cell.visible) {
                        egret.Tween.removeTweens(cell);
                        egret.Tween.get(cell).wait(time).to({ x: tempx, y: tempy, scaleX: 0, scaleY: 0, alpha: 0 }, move_time).call(function () {
                            //Utils.removeFromParent(cell);
                        }, this);
                        time += add_time;
                    }
                }
                this.m_build.isGlow(false);
                // this.m_build.checkOutput();
                this.m_build.showName(true);
            }
        };
        BuildFunctionMenu.prototype.getRKPos = function (iconlen) {
            var posArray = [];
            switch (iconlen) {
                case 1: {
                    posArray.push({ x: 242, y: 119 });
                    break;
                }
                case 2: {
                    posArray.push({ x: 175, y: 110 });
                    posArray.push({ x: 309, y: 110 });
                    break;
                }
                case 3: {
                    posArray.push({ x: 242, y: 119 });
                    posArray.push({ x: 146, y: 105 });
                    posArray.push({ x: 338, y: 105 });
                    break;
                }
                default: {
                    posArray.push({ x: 98, y: 76 });
                    posArray.push({ x: 187, y: 115 });
                    posArray.push({ x: 297, y: 115 });
                    posArray.push({ x: 386, y: 76 });
                    break;
                }
            }
            return posArray;
        };
        BuildFunctionMenu.prototype.getBuild = function () {
            return this.m_build;
        };
        //获取入口按钮
        BuildFunctionMenu.prototype.getCellByIndex = function (index) {
            if (index < this.m_cellList.length) {
                return this.m_cellList[index].m_pIcon;
            }
            return null;
            ;
        };
        return BuildFunctionMenu;
    }(com_main.CComponent));
    com_main.BuildFunctionMenu = BuildFunctionMenu;
    var BuildFunctionMenuCell = /** @class */ (function (_super_1) {
        __extends(BuildFunctionMenuCell, _super_1);
        function BuildFunctionMenuCell(buildId) {
            var _this = _super_1.call(this) || this;
            // public m_pName: eui.Label;//名字
            _this.functionId = 0;
            _this.skinName = Utils.getAppSkin("build/BuildFunctionMenuCellSkin.exml");
            _this.buildId = buildId;
            return _this;
        }
        BuildFunctionMenuCell.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        BuildFunctionMenuCell.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        BuildFunctionMenuCell.prototype.getCellType = function () {
            return this.functionId;
        };
        BuildFunctionMenuCell.prototype.updateView = function (id, pos) {
            var switchId = id;
            switch (id) {
                case FunctionType.BUILDING_GRADE: {
                    switchId = MainMapModel.isInBuilding(this.buildId) ? FunctionType.BUILDING_GRADE_SPEED : id;
                    break;
                }
                // case FunctionType.FT_BBY:{
                // 	switchId = MainMapModel.isInTrain(this.buildId)?FunctionType.FT_BBY_SPEED_UP:id;//this.swicthSliderTarnType(,id,);
                // 	break;
                // }
                // case FunctionType.FT_QBY:{
                // 	switchId = MainMapModel.isInTrain(this.buildId)?FunctionType.FT_QBY_SPEED_UP:id;				
                // 	break;
                // }
                // case FunctionType.FT_GBY:{
                // 	switchId =MainMapModel.isInTrain(this.buildId)?FunctionType.FT_GBY_SPEED_UP:id;
                // 	break;
                // }
                // case FunctionType.FT_GBY:{
                // 	switchId =MainMapModel.isInTrain(this.buildId)?FunctionType.FT_GBY_SPEED_UP:id;
                // 	break;
                // }
                // case FunctionType.FT_KILL_BANDITS:{
                // 	switchId =MainMapModel.isOutput(this.buildId)?FunctionType.FT_FATROL_GET_REWORD:id;
                // 	break;
                // }
            }
            this.functionId = switchId;
            var cfgData = C.FunctionConfig[this.functionId];
            if (cfgData) {
                var btnCfg = C.FunctionBtnConfig[cfgData.btnType];
                if (btnCfg)
                    this.m_pIcon.source = btnCfg.iconName + "_png"; //.texture = Utils.getPopTitleIcon(this.functionId);
                // this.m_pName.text = cfgData.name;               //不显示建筑文本
            }
        };
        return BuildFunctionMenuCell;
    }(com_main.CComponent));
    com_main.BuildFunctionMenuCell = BuildFunctionMenuCell;
})(com_main || (com_main = {}));
