
class Loading extends com_main.CComponent {

    public static NAME = 'Loading';
    public m_pBg: com_main.CImage;
    public m_pGroup: eui.Group;

    private m_pAlphas = [
        0.05,
        0.05,
        0.05,
        0.1,
        0.1,
        0.1,
        0.1,
        0.2,
        0.4,
        0.6,
        0.8,
        1
    ];

    private m_pNowIndex = 1;

    private m_delay = 0;

    public static show(delay:number = 300) {
        let view = Loading.getClass();
        if (!view) {
            view = new Loading(delay);
            SceneManager.addChild(LayerEnums.NET, view,1);
            Utils.TimerManager.doTimer(10000,1,this.removeTime,this);
        }
    }

    public static hide() {
        let view = Loading.getClass();
        if (view) view.onDestroy();
        Utils.TimerManager.remove(this.removeTime,this);
    }

    public static removeTime() {
        let view = Loading.getClass();
        if (view) view.onDestroy();
        Utils.TimerManager.remove(this.removeTime,this);
    }

    public static getClass(): Loading {
        let obj = SceneManager.getClass(LayerEnums.NET, Loading.NAME);
        return obj;
    }

    public constructor(delay?) {
        super();
        this.m_delay = delay;
        this.name = Loading.NAME;
        this.touchChildren = false;
        this.skinName = Utils.getSkinName("loading/loading.exml");
    }

    public onDestroy() {
        Utils.TimerManager.remove(this.call, this);
        Utils.removeFromParent(this);
    }

    protected childrenCreated() {
        super.childrenCreated();
        this.height = this.stage.stageHeight;
        this.width = this.stage.stageWidth;

        this.delaySetting();

        Utils.TimerManager.doFrame(5, 0, this.call, this);
    }

    /**强制指引拦截事件 */
    $hitTest(stageX, stageY) {
        return this;
    };

    private delaySetting() {
        if (this.m_delay > 0) {
            this.alpha = 0
            let tw = egret.Tween.get(this);
            tw.wait(this.m_delay);
            tw.set({ alpha: 1 });
        }
    }

    public call() {
        this.m_pNowIndex = this.m_pNowIndex + 1 > 12 ? 1 : this.m_pNowIndex + 1;

        let alphas = this.m_pAlphas;
        let group = this.m_pGroup;
        for (var key in alphas) {
            if (alphas.hasOwnProperty(key)) {
                var alpha = +alphas[key];
                let obj = group.getChildByName('icon' + this.m_pNowIndex);
                if (obj) {
                    obj.alpha = alpha;
                    this.m_pNowIndex = this.m_pNowIndex + 1 > 12 ? 1 : this.m_pNowIndex + 1;
                } else {
                    error('读取不到图片：Loading：icon', this.m_pNowIndex);
                }
            }
        }
    }
}