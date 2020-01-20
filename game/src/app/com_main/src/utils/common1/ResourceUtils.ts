/**
 * Created by yangsong on 15-2-11.
 * 资源加载工具类，
 * 支持多个resource.json文件加载
 * 封装Group的加载
 * 增加静默加载机制
 */
class ResourceUtils extends BaseClass {
    private _configs: Array<any>;
    private _onConfigComplete: Function;
    private _onConfigCompleteTarget: any;

    private _groups: any;
    private _groupIndex: number = 0;

    /**
     * 构造函数
     */
    public constructor() {
        super();

        this._configs = [];
        this._groups = {};

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceLoadProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
    }

    /**
     * 添加一个配置文件
     * @param jsonPath resource.json路径
     * @param filePath 访问资源路径
     */
    public addConfig(jsonPath: string, filePath: string): void {
        this._configs.push([jsonPath, filePath]);
    }

    /**
     * 开始加载配置文件
     * @param $onConfigComplete 加载完成执行函数
     * @param $onConfigCompleteTarget 加载完成执行函数所属对象
     */
    public loadConfig($onConfigComplete: Function, $onConfigCompleteTarget: any): void {
        this._onConfigComplete = $onConfigComplete;
        this._onConfigCompleteTarget = $onConfigCompleteTarget;
        this.loadNextConfig();
    }

    /**
     * 加载
     */
    private loadNextConfig(): void {
        //加载完成
        if (this._configs.length == 0) {
            this._onConfigComplete.call(this._onConfigCompleteTarget);
            this._onConfigComplete = null;
            this._onConfigCompleteTarget = null;
            return;
        }

        let arr: any = this._configs.shift();
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        RES.loadConfig(arr[0], arr[1]);
    }

    /**
     * 加载完成
     * @param event
     */
    private onConfigCompleteHandle(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        this.loadNextConfig();
    }

    /**
     * 加载资源组
     * @param $groupName 资源组名称
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadGroup($groupName: string, $onResourceLoadComplete: Function, $onResourceLoadProgress: Function, $onResourceLoadTarget: any): void {
        this._groups[$groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup($groupName);
    }

    /**
     * 同时加载多个组
     * @param $groupName 自定义的组名称
     * @param $subGroups 所包含的组名称或者key名称数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadGroups($groupName: string, $subGroups: string[], $onResourceLoadComplete: Function, $onResourceLoadProgress: Function, $onResourceLoadTarget: any): void {
        RES.createGroup($groupName, $subGroups, true);
        this.loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget)
    }

    /**
     * 静默加载
     * @param $groupName 资源组名称
     * @param $groupName 所包含的组名称或者key名称数组
     */
    public preloadGroup($groupName: string, $subGroups: string[] = null): void {
        //添加前缀，防止与正常加载组名重复
        let useGroupName = "pilferer_" + $groupName;
        if (!$subGroups) {
            $subGroups = [$groupName];
        }
        RES.createGroup(useGroupName, $subGroups, true);
        RES.loadGroup(useGroupName, -1);
    }

    public preloadGroups(groups: string[]) {
        for (let key in groups) {
            if (groups.hasOwnProperty(key)) {
                let element = groups[key];
                this.preloadGroup(element, this.getResNames(element));
            }
        }
    }

    /**
     * 资源组加载完成
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        let groupName: string = event.groupName;
        if (this._groups[groupName]) {
            debug("ResourceUtils:onResourceLoadComplete--->>", groupName);
            let loadComplete: Function = this._groups[groupName][0];
            let loadCompleteTarget: any = this._groups[groupName][2];
            if (loadComplete != null) {
                loadComplete.call(loadCompleteTarget);
            }

            this._groups[groupName] = null;
            delete this._groups[groupName];
        } else {
            //预加载
            let ind = groupName.indexOf("pilferer_");
            if (ind != -1) {
                debug("ResourceUtils:onResourceLoadComplete--->>预加载完成", groupName, event.itemsLoaded, event.itemsTotal);
            }
        }
    }

    /**
     * 资源组加载进度
     */
    private onResourceLoadProgress(event: RES.ResourceEvent): void {
        let groupName: string = event.groupName;
        if (this._groups[groupName]) {
            debug("ResourceUtils:onResourceLoadProgress--->>", groupName, event.itemsLoaded, event.itemsTotal);
            let loadProgress: Function = this._groups[groupName][1];
            let loadProgressTarget: any = this._groups[groupName][2];
            if (loadProgress != null) {
                loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
            }
        } else {
            //预加载
            // let ind = groupName.indexOf("pilferer_");
            // if (ind != -1) {
            //     debug("ResourceUtils:onResourceLoadProgress--->>预加载进度", groupName, event.itemsLoaded, event.itemsTotal);
            // }
        }
    }

    /**
     * 资源组加载失败
     * @param event
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        debug(event.groupName + "资源组有资源加载失败");
        this.onResourceLoadComplete(event);
    }

    /**
     * 混合加载资源组
     * @param $resources 资源数组
     * @param $groups 资源组数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadResource($resources = [], $groups = [], $onResourceLoadComplete: Function = null, $onResourceLoadProgress: Function = null, $onResourceLoadTarget: any = null): void {
        let needLoadArr = $resources.concat($groups);
        let groupName = "loadGroup" + this._groupIndex++;
        RES.createGroup(groupName, needLoadArr, true);
        this._groups[groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup(groupName);
    }

    public getResNames(groupName: string) {
        let resItem = RES.getGroupByName(groupName);
        let datas: string[] = [];
        for (let key in resItem) {
            if (resItem.hasOwnProperty(key)) {
                let element = resItem[key];
                datas.push(element.name);
            }
        }
        return datas;
    }
}
