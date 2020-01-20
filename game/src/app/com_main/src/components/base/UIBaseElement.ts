/**
 * Created by Tint_ on 2017/3/28.
 */
class UIBaseElement extends eui.Component{

    private _loadingRes = null;

    public constructor(skinName:string = "",_loadingRes:string[]=null){
        super();
        this.touchEnabled = this.touchChildren = false;
        this.visible = true;
        this._loadingRes = _loadingRes;
        if(skinName && skinName.length > 0 ){
            // TimerUtils.tempTimeStart(); 
            this.visible = false;
            // ResManager.loadEXML(skinName, this.loadedSkin, this);
            let self = this;

            self.skinName = skinName;
            // mLog.log("EXML加载用时..." + self, TimerUtils.tempTimeEnd());
            Utils.TimerManager.doTimer(20, 1, self.loaded, self);
            // this.loaded();
        }
    }
    private __onLoadComplete(event: RES.ResourceEvent): void {
        Utils.TimerManager.doTimer(1, 1, this.loaded, this);
        console.log(event.groupName + ":资源加载完成.....");
    }
    private __loadError(event: RES.ResourceEvent): void {
        console.log(event.groupName + ":loadError.....");
    }
    private loadedSkin(clazz:any,url:string):void{

        let self = this;

        self.skinName = clazz;
        // mLog.log("EXML加载用时..." + self, TimerUtils.tempTimeEnd());
        Utils.TimerManager.doTimer(1, 1, self.loaded, self);
    }
    /**
     * 设置皮肤
     * @param name 对应在wnd目录下面的文件名
     */
    public setSkinName(name:string){
        // this.skinName = ResManager.x2UIName(name);
    }
    public setXY(x:number,y:number){
        this.x = x;
        this.y = y;
    }
    protected loaded(){
        this.visible = true;
        Utils.TimerManager.remove(this.loaded, this);
    }
}