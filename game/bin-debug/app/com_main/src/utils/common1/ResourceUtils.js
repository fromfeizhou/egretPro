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
 * Created by yangsong on 15-2-11.
 * 资源加载工具类，
 * 支持多个resource.json文件加载
 * 封装Group的加载
 * 增加静默加载机制
 */
var ResourceUtils = /** @class */ (function (_super_1) {
    __extends(ResourceUtils, _super_1);
    /**
     * 构造函数
     */
    function ResourceUtils() {
        var _this = _super_1.call(this) || this;
        _this._groupIndex = 0;
        _this._configs = [];
        _this._groups = {};
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, _this.onResourceLoadComplete, _this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, _this.onResourceLoadProgress, _this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, _this.onResourceLoadError, _this);
        return _this;
    }
    /**
     * 添加一个配置文件
     * @param jsonPath resource.json路径
     * @param filePath 访问资源路径
     */
    ResourceUtils.prototype.addConfig = function (jsonPath, filePath) {
        this._configs.push([jsonPath, filePath]);
    };
    /**
     * 开始加载配置文件
     * @param $onConfigComplete 加载完成执行函数
     * @param $onConfigCompleteTarget 加载完成执行函数所属对象
     */
    ResourceUtils.prototype.loadConfig = function ($onConfigComplete, $onConfigCompleteTarget) {
        this._onConfigComplete = $onConfigComplete;
        this._onConfigCompleteTarget = $onConfigCompleteTarget;
        this.loadNextConfig();
    };
    /**
     * 加载
     */
    ResourceUtils.prototype.loadNextConfig = function () {
        //加载完成
        if (this._configs.length == 0) {
            this._onConfigComplete.call(this._onConfigCompleteTarget);
            this._onConfigComplete = null;
            this._onConfigCompleteTarget = null;
            return;
        }
        var arr = this._configs.shift();
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        RES.loadConfig(arr[0], arr[1]);
    };
    /**
     * 加载完成
     * @param event
     */
    ResourceUtils.prototype.onConfigCompleteHandle = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        this.loadNextConfig();
    };
    /**
     * 加载资源组
     * @param $groupName 资源组名称
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    ResourceUtils.prototype.loadGroup = function ($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        this._groups[$groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup($groupName);
    };
    /**
     * 同时加载多个组
     * @param $groupName 自定义的组名称
     * @param $subGroups 所包含的组名称或者key名称数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    ResourceUtils.prototype.loadGroups = function ($groupName, $subGroups, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        RES.createGroup($groupName, $subGroups, true);
        this.loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget);
    };
    /**
     * 静默加载
     * @param $groupName 资源组名称
     * @param $groupName 所包含的组名称或者key名称数组
     */
    ResourceUtils.prototype.preloadGroup = function ($groupName, $subGroups) {
        if ($subGroups === void 0) { $subGroups = null; }
        //添加前缀，防止与正常加载组名重复
        var useGroupName = "pilferer_" + $groupName;
        if (!$subGroups) {
            $subGroups = [$groupName];
        }
        RES.createGroup(useGroupName, $subGroups, true);
        RES.loadGroup(useGroupName, -1);
    };
    ResourceUtils.prototype.preloadGroups = function (groups) {
        for (var key in groups) {
            if (groups.hasOwnProperty(key)) {
                var element = groups[key];
                this.preloadGroup(element, this.getResNames(element));
            }
        }
    };
    /**
     * 资源组加载完成
     */
    ResourceUtils.prototype.onResourceLoadComplete = function (event) {
        var groupName = event.groupName;
        if (this._groups[groupName]) {
            debug("ResourceUtils:onResourceLoadComplete--->>", groupName);
            var loadComplete = this._groups[groupName][0];
            var loadCompleteTarget = this._groups[groupName][2];
            if (loadComplete != null) {
                loadComplete.call(loadCompleteTarget);
            }
            this._groups[groupName] = null;
            delete this._groups[groupName];
        }
        else {
            //预加载
            var ind = groupName.indexOf("pilferer_");
            if (ind != -1) {
                debug("ResourceUtils:onResourceLoadComplete--->>预加载完成", groupName, event.itemsLoaded, event.itemsTotal);
            }
        }
    };
    /**
     * 资源组加载进度
     */
    ResourceUtils.prototype.onResourceLoadProgress = function (event) {
        var groupName = event.groupName;
        if (this._groups[groupName]) {
            debug("ResourceUtils:onResourceLoadProgress--->>", groupName, event.itemsLoaded, event.itemsTotal);
            var loadProgress = this._groups[groupName][1];
            var loadProgressTarget = this._groups[groupName][2];
            if (loadProgress != null) {
                loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
            }
        }
        else {
            //预加载
            // let ind = groupName.indexOf("pilferer_");
            // if (ind != -1) {
            //     debug("ResourceUtils:onResourceLoadProgress--->>预加载进度", groupName, event.itemsLoaded, event.itemsTotal);
            // }
        }
    };
    /**
     * 资源组加载失败
     * @param event
     */
    ResourceUtils.prototype.onResourceLoadError = function (event) {
        debug(event.groupName + "资源组有资源加载失败");
        this.onResourceLoadComplete(event);
    };
    /**
     * 混合加载资源组
     * @param $resources 资源数组
     * @param $groups 资源组数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    ResourceUtils.prototype.loadResource = function ($resources, $groups, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget) {
        if ($resources === void 0) { $resources = []; }
        if ($groups === void 0) { $groups = []; }
        if ($onResourceLoadComplete === void 0) { $onResourceLoadComplete = null; }
        if ($onResourceLoadProgress === void 0) { $onResourceLoadProgress = null; }
        if ($onResourceLoadTarget === void 0) { $onResourceLoadTarget = null; }
        var needLoadArr = $resources.concat($groups);
        var groupName = "loadGroup" + this._groupIndex++;
        RES.createGroup(groupName, needLoadArr, true);
        this._groups[groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup(groupName);
    };
    ResourceUtils.prototype.getResNames = function (groupName) {
        var resItem = RES.getGroupByName(groupName);
        var datas = [];
        for (var key in resItem) {
            if (resItem.hasOwnProperty(key)) {
                var element = resItem[key];
                datas.push(element.name);
            }
        }
        return datas;
    };
    return ResourceUtils;
}(BaseClass));
