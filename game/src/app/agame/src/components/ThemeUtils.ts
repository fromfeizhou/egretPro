module AGame {
    
    class CCSkinCache{
        private static m_pSkinBytes:egret.ByteArray = new egret.ByteArray();
        private static m_pSkinMap:Object = {};
        private static m_pPosition:number = 0;
        
        
        public static addSkin(skinName:string, skinContent:string, isPreLoad:boolean):void{
            this.m_pSkinMap[skinName] = {};
            this.m_pSkinMap[skinName]['exml'] = skinContent;
            if(isPreLoad){
                this.getSkinFunc(skinName);
            }
        }
        
        public static getTheme(skinName:string):any{
            var skin: string;
            if(typeof (skinName) == 'function'){
                return skinName;
            }else if(skinName.indexOf("<?xml version='1.0' encoding='utf-8'?>")> -1){
                return EXML.$parseURLContent("", skinName);
            }else if(skinName.indexOf('/') > -1){
                var splits: any[] = skinName.split('/');
                skin = splits[splits.length - 1].replace('.exml','');
            }else{
                skin = skinName.replace('.exml','');
            }
            
            return this.getSkinFunc(skin);
        }

        // 获取 自定义皮肤
        private static disableDependence = true;
        private static getDependenceSkins(xml: egret.XML, depth: number): void {
            if(this.disableDependence) return;

            var isContainer = function(name: string){
                return name == "Group"
                    || name == "ViewStack"
                    || name == "Panel"
                    || name == "Scroller";
            }

            var i = 0;
            var children: egret.XML[] = <egret.XML[]>xml.children;
            var needParseChildren: egret.XML[] = [];
            for( ; i < children.length; i++){
                // 容器类和dfh3
                if(children[i].prefix == "dfh3" || isContainer(children[i].localName)){
                    needParseChildren.push(children[i]);
                    continue;
                }
            }

            // 递归终止条件
            if(needParseChildren.length <= 0 || depth > 5){
                if(depth > 5){
                    console.log("getDependenceSkins 递归层数太高，请检查皮肤参数");
                }
                return;
            }

            i = 0;
            for(; i < needParseChildren.length; i++){
                var c = needParseChildren[i];
                // egret容器
                if(isContainer(c.localName)){
                    // 找children
                    for(var j=0; j < c.children.length; j++){
                        this.getDependenceSkins(<egret.XML>c.children[j], depth + 1);
                    }
                }
                // dfh3 这个是我们最终要找的
                if(c.prefix == "dfh3"){
                    // skin name
                    var skinName = c.attributes["skinName"];
                    if(skinName){
                        console.log("~!@#getDependenceSkins name=" + skinName + " depth=" + (depth+1));
                        this.getSkinFunc(skinName, depth + 1);
                    }
                }
            }
        }

        public static getSkinFunc(skinName: string, depth: number = 0):any{
            // debug('getSkinFunc:',skinName);
            var exml:string = this.m_pSkinMap[skinName]['exml'];
            if(exml){
                if(!this.disableDependence){
                    var xml = egret.XML.parse(exml);
                    this.getDependenceSkins(xml, depth);
                }

                this.m_pSkinMap[skinName]['func'] = EXML.$parseURLContent("", exml);
                delete this.m_pSkinMap[skinName]['exml'];
            }
            return this.m_pSkinMap[skinName]['func'];
        }
        
        public static destroy():void{
            this.m_pSkinBytes = null;
            this.m_pSkinMap = null;
            this.m_pPosition = 0;
        }
    }
    class CCTheme extends eui.Theme{
        private $url: string;
        private $onThemeLoadComplete:Function;
        private $target:any;
        public constructor(configURL: string,stage: egret.Stage, onThemeLoadComplete:Function, target:any, isDelayed?:boolean) {
            if(!isDelayed){
                super(configURL,stage);
            }else{
                super('',stage);

                this.$url = configURL;
                this.loadTheme(configURL,stage);
            }
            this.$onThemeLoadComplete = onThemeLoadComplete;
            this.$target = target;
            this.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        }

        private onThemeLoadComplete(): void {
            if(this.$target && this.$onThemeLoadComplete){
                this.$onThemeLoadComplete.call(this.$target);
            }
            this.removeEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        }
        
        private loadTheme(url: string,stage: egret.Stage): void {
            var adapter: eui.IThemeAdapter = stage ? stage.getImplementation("eui.IThemeAdapter") : null;
            if(!adapter) {
                adapter = new eui.DefaultThemeAdapter();
            }
            adapter.getTheme(url,this.onThemeLoaded,this.onThemeLoaded,this);
        }
        
        private onThemeLoaded(str: string): void {
            if(str) {
                if(DEBUG) {
                    try {
                        var data = JSON.parse(str);
                    }
                    catch(e) {
                        egret.$error(3000);
                    }
                } else {
                    var data = JSON.parse(str);
                }
            }else if(DEBUG) {
                egret.$error(3000,this.$url);
            }
            
            var isContent: boolean = data.exmls[0]['content'] ? true : false;
            data.exmls.forEach((exml,index, exmls) => this.parseURLContent(exml,isContent,data.skins, exmls));
            this.dispatchEventWith(egret.Event.COMPLETE);
        }
        
        private parseURLContent(exml:any,isContent:boolean,preLoadList:any, exmls: any):void{
            var path: string;
            var content: string;

            if(isContent) {
                path = exml['path'];
                content = exml['content'];
            } else {
                path = exml;
                content = exml;
            }
            var splits:any[] = path.split('/');
            var skinName: string = splits[splits.length - 1].replace('.exml','');
            
            
            CCSkinCache.addSkin(skinName, content, preLoadList[skinName] /*path.indexOf('/components/') > 0 ? SkinCacheType.Cache : SkinCacheType.Byte*/);
        }
    }

    export class ThemeUtils{
        public static load(configURL: string,stage: egret.Stage, onThemeLoadComplete:Function, target:any, isDelayed?:boolean){
            new CCTheme(configURL, stage, onThemeLoadComplete, target, isDelayed);
        }
        public static getTheme(skinName:string):any{
            return CCSkinCache.getTheme(skinName);
        }

        public static setSkinFunc(comp: eui.Component, value: any): void {
            // if (!DEBUG) value = CCSkinCache.getTheme(value);

            var values = comp.$Component;

            values[eui.sys.ComponentKeys.skinNameExplicitlySet] = true;
            if (values[eui.sys.ComponentKeys.skinName] == value)
                return;
            if (value) {
                values[eui.sys.ComponentKeys.skinName] = value;
            } else if (comp.$stage) {
                var theme = comp.$stage.getImplementation("eui.Theme");
                if (theme) {
                    var skinName = theme.getSkinName(comp);
                    if (skinName) {
                        //debug("theme.setSkinFunc " + skinName);
                        values[eui.sys.ComponentKeys.skinName] = skinName;
                    }
                }
            }
            comp.$parseSkinName();
        }
    }
}


