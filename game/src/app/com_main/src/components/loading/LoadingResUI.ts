class LoadingResUI extends eui.Component {

    public static NAME: string = "LoadingResUI";
    public m_imgLoginBg: eui.Image;
    public m_pProgressGroup: eui.Group;
    public m_pLblProgress: com_main.CLabel;
    public m_pProgressImg: com_main.CImage;
    public m_imgLogo: eui.Image;

    private m_pDelay: number;


    // private m_pHorseAnim: com_main.SpriteAnimation;

    public static getClass(): LoadingResUI {
        let obj = SceneManager.getClass(LayerEnums.NET, LoadingResUI.NAME);
        return obj;
    }

    public static show(delay: number = 60000) {
        let view = LoadingResUI.getClass();
        if (!view) {
            view = new LoadingResUI(delay);
            view.height = AGame.R.app.stageHeight;
            SceneManager.addChild(LayerEnums.NET, view, 0);
        }
    }

    public static hide() {
        let view = LoadingResUI.getClass();
        if (view) view.onDestroy();
    }

    public constructor(delay?: number) {
        super();
        this.m_pDelay = delay;
        this.name = LoadingResUI.NAME;
        this.skinName = "resource/skins/loading/loading_res_ui.exml";
    }

    public onDestroy(): void {
        com_main.EventManager.removeEventListeners(this);
        Utils.removeFromParent(this);
    }

    protected childrenCreated(): void {
        super.childrenCreated();
        //适配 
        this.width = AGame.R.app.stageWidth;
        Utils.toStageMaxScale(this.m_imgLoginBg);
        this.setProgress(0, 0);

        this.m_imgLogo.source = LoginConst.getResUrl('login_lb_qysg.png')
    }

    public setProgress(progress: number, total: number, resName?: string, anim: boolean = false): void {
        // debug("LoadingSceneUI:setProgress--->>加载进度", progress, total);
        if (resName) {
            if (total == 0) {
                this.m_pLblProgress.text = resName;
            } else {
                this.m_pLblProgress.text = format("正在疯狂加载中。。。{1} ({2}/{3})", resName, progress, total);
            }
        } else {
            this.m_pLblProgress.text = format("正在疯狂加载中。。。({1}/{2})", progress, total);
        }
        if (total == 0)
            return;
        let percent = (progress + 1) / total; //加载完里面切界面 看不见最后一个进度
        percent = percent > 1 ? 1 : percent;
        this.m_pProgressImg.width = this.m_pProgressGroup.width * percent;

    }
}