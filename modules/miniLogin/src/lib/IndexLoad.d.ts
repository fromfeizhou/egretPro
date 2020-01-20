declare function removeLoadingDiv(): void;
declare function updateLoadingTips(tips): void;
declare function onLogin(): void;
declare let mainfestCfg;
declare let externalMessage;
declare let $Platform;
declare let $PlatformSrc;
declare let $loginInfo;
declare function loadSingleScript(src, callback):void;

declare namespace AGame {
    class R {
        static startup(root?: eui.UILayer): void
    }
}

declare namespace com_main {
    class Bootstrap {
        static startup(): void;
    }
    class UpManager{
        static addPanelInPopLayer(node:any):void;
        static popView(...args):void;
    }

    class TestSettingView extends eui.Component{

    }
}

declare function debug(...args): void;
declare function error(...args): void;
declare class MapData {
    public getBattleMapConfig(): any;
}