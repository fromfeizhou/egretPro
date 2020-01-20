/**
 * Created by yangsong on 2014/12/3.
 * Stage相关工具类
 */
class StageUtils extends BaseClass {

    private m_pUIStage: eui.UILayer;
    private m_pStageRect: egret.Rectangle;

    /**
     * 构造函数
     */
    public constructor() {
        super();
    }

    /**
     * 获取游戏的高度
     * @returns {number}
     */
    public getHeight(): number {
        return this.getStage().stageHeight;
    }

    /**
     * 获取游戏宽度
     * @returns {number}
     */
    public getWidth(): number {
        return this.getStage().stageWidth;
    }

    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    public setTouchChildren(value: boolean): void {
        this.getStage().touchChildren = value;
    }

    /**
     * 设置同时可触发几个点击事件，默认为2
     * @param value
     */
    public setMaxTouches(value: number): void {
        this.getStage().maxTouches = value;
    }

    /**
     * 设置帧频
     * @param value
     */
    public setFrameRate(value: number): void {
        this.getStage().frameRate = value;
    }

    /**
     * 设置适配方式
     * @param value
     */
    public setScaleMode(value: string): void {
        this.getStage().scaleMode = value;
    }

    /**
     * 获取游戏Stage对象
     * @returns {egret.MainContext}
     */
    public getStage(): egret.Stage {
        return egret.MainContext.instance.stage;
    }

    public getStageRect() {
        if (!this.m_pStageRect) {
            this.m_pStageRect = egret.Rectangle.create();
        }
        this.m_pStageRect.width = this.getWidth();
        this.m_pStageRect.height = this.getHeight();
        this.m_pStageRect.x = 0;
        this.m_pStageRect.y = 0;
        return this.m_pStageRect;
    }
    /**
     * 获取唯一UIStage
     * @returns {eui.UILayer}
     */
    public getUIStage(): eui.UILayer {
        if (this.m_pUIStage == null) {
            this.m_pUIStage = new eui.UILayer();
            this.m_pUIStage.percentHeight = 100;
            this.m_pUIStage.percentWidth = 100;
            this.m_pUIStage.touchEnabled = false;
            this.getStage().addChild(this.m_pUIStage);
        }
        return this.m_pUIStage;
    }
}
