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
     * 装备主界面
     */
    var MissionWnd = /** @class */ (function (_super_1) {
        __extends(MissionWnd, _super_1);
        function MissionWnd(param) {
            var _this = _super_1.call(this) || this;
            _this.m_tags = [TaskType.Daily, TaskType.MainLine, TaskType.Cultivate, TaskType.MainCity]; //下标栏
            _this.name = MissionWnd.NAME;
            _this.m_nTaskType = param || TaskType.Daily;
            _this.initApp("mission/MissionWndSkin.exml");
            return _this;
        }
        MissionWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            com_main.EventManager.removeEventListeners(this);
        };
        MissionWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_MainTopNew.setTitleName(GCode(CLEnum.TASK));
            var tags = [GCode(CLEnum.TASK_TAB_RC), GCode(CLEnum.TASK_TAB_ZX), GCode(CLEnum.TASK_TAB_PY),
                GCode(CLEnum.TASK_TAB_ZC)];
            this.m_comTabGroup.initNorTabBtns(tags);
            this.m_comTabGroup.setChangeCallback(this.changeTag, this);
            this.validateNow();
            var width = this.m_tabViewStack.width;
            var height = this.m_tabViewStack.height;
            var views = [
                new com_main.MissionDailyView(TaskType.Daily, width, height),
                new com_main.MissionNorView(TaskType.MainLine, width, height),
                new com_main.MissionNorView(TaskType.Cultivate, width, height),
                new com_main.MissionNorView(TaskType.MainCity, width, height)
            ];
            for (var i = 0; i < views.length; i++) {
                this.m_tabViewStack.addChild(views[i]);
                if (views[i].taskType == this.m_nTaskType) {
                    this.changeTag(i);
                }
            }
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(tags[0]), { x: 132, y: -5 }, [RedEvtType.TASK, RedEvtType.TASK_ACTIVITY], 1, { taskType: TaskType.Daily });
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(tags[1]), { x: 132, y: -5 }, [RedEvtType.TASK], 1, { taskType: TaskType.MainLine });
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(tags[2]), { x: 132, y: -5 }, [RedEvtType.TASK], 1, { taskType: TaskType.Cultivate });
            RedPointModel.AddInfoListener(this.m_comTabGroup.getTabBtnByName(tags[3]), { x: 132, y: -5 }, [RedEvtType.TASK], 1, { taskType: TaskType.MainCity });
            this.validateNow();
        };
        MissionWnd.prototype.changeTag = function (selIndex) {
            this.initView(selIndex);
        };
        MissionWnd.prototype.initView = function (index) {
            this.m_comTabGroup.selectedIndex = index;
            this.m_tabViewStack.selectedIndex = index;
        };
        MissionWnd.NAME = 'MissionWnd';
        return MissionWnd;
    }(com_main.CView));
    com_main.MissionWnd = MissionWnd;
})(com_main || (com_main = {}));
