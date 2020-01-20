var AGame;
(function (AGame) {
    var ResLoader = /** @class */ (function () {
        function ResLoader() {
            this.m_pGroups = {};
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        }
        ResLoader.prototype.destroy = function () {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            // var group;
            // for (var i: number = 0; i < this.m_pGroups.length; i++) {
            // 	group = this.m_pGroups[i];
            // 	group[0] = null;
            // 	group[1] = null;
            // 	group[2] = null;
            // }
            // this.m_pGroups.length = 0;
            // this.length = 0;
        };
        /**
         * 加载资源组
         * @param $groupName 资源组名称
         * @param $onResourceLoadComplete 资源加载完成执行函数
         * @param $onResourceLoadProgress 资源加载进度监听函数
         * @param $onResourceLoadTarget 资源加载监听函数所属对象
         */
        ResLoader.prototype.loadGroup = function (groupName, onResourceLoadComplete, onResourceLoadProgress, target, priority) {
            if (!this.m_pGroups[groupName]) {
                this.m_pGroups[groupName] = [];
                RES.loadGroup(groupName, priority);
            }
            this.m_pGroups[groupName].push({ call: onResourceLoadComplete, process: onResourceLoadProgress, target: target });
        };
        /**
         * 同时加载多个组
         * @param $groups 自定义的组名称
         * @param $onResourceLoadComplete 资源加载完成执行函数
         * @param $onResourceLoadProgress 资源加载进度监听函数
         * @param $onResourceLoadTarget 资源加载监听函数所属对象
         */
        ResLoader.prototype.loadGroups = function (groups, onResourceLoadComplete, onResourceLoadProgress, target) {
            for (var i = 0; i < groups.length; i++) {
                var item = groups[i];
                this.loadGroup(item, onResourceLoadComplete, onResourceLoadProgress, target, i);
            }
        };
        ResLoader.prototype.onResourceLoadComplete = function (event) {
            var group = this.m_pGroups[event.groupName];
            if (group) {
                for (var _i = 0, group_1 = group; _i < group_1.length; _i++) {
                    var loaderFunc = group_1[_i];
                    var loadComplete = loaderFunc.call;
                    var loadCompleteTarget = loaderFunc.target;
                    if (loadComplete != null)
                        loadComplete.call(loadCompleteTarget, event.groupName);
                }
                delete this.m_pGroups[event.groupName];
            }
            // var keys = Object.keys(this.m_pGroups);
            // if (keys.length <= 0) {
            // 	this.destroy();
            // }
        };
        ResLoader.prototype.getLoaderLength = function () {
            return Object.keys(this.m_pGroups);
        };
        ResLoader.prototype.onResourceLoadError = function (event) {
            this.onResourceLoadComplete(event);
        };
        ResLoader.prototype.onResourceProgress = function (event) {
            var group = this.m_pGroups[event.groupName];
            if (group) {
                for (var _i = 0, group_2 = group; _i < group_2.length; _i++) {
                    var loaderFunc = group_2[_i];
                    var loadProgress = loaderFunc.process;
                    var loadProgressTarget = loaderFunc.target;
                    if (loadProgress != null)
                        loadProgress.call(loadProgressTarget, event.groupName, event.itemsLoaded, event.itemsTotal);
                }
            }
        };
        ResLoader.prototype.onItemLoadError = function (event) {
            console.log("Url:" + event.resItem.url + " has failed to load");
        };
        return ResLoader;
    }());
    var ResUtils = /** @class */ (function () {
        function ResUtils() {
        }
        ResUtils.loadConfig = function (url, resourceRoot, type) {
            // RES.loadConfig(url, resourceRoot, type);
            RES.loadConfig(url, resourceRoot);
        };
        ResUtils.loadGroups = function (groups, onResourceLoadComplete, onResourceLoadProgress, target) {
            if (!this.loader) {
                this.loader = new ResLoader();
            }
            this.loader.loadGroups(groups, onResourceLoadComplete, onResourceLoadProgress, target);
            return groups.length;
        };
        return ResUtils;
    }());
    AGame.ResUtils = ResUtils;
})(AGame || (AGame = {}));
