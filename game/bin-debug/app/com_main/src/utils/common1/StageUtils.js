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
 * Created by yangsong on 2014/12/3.
 * Stage相关工具类
 */
var StageUtils = /** @class */ (function (_super_1) {
    __extends(StageUtils, _super_1);
    /**
     * 构造函数
     */
    function StageUtils() {
        return _super_1.call(this) || this;
    }
    /**
     * 获取游戏的高度
     * @returns {number}
     */
    StageUtils.prototype.getHeight = function () {
        return this.getStage().stageHeight;
    };
    /**
     * 获取游戏宽度
     * @returns {number}
     */
    StageUtils.prototype.getWidth = function () {
        return this.getStage().stageWidth;
    };
    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    StageUtils.prototype.setTouchChildren = function (value) {
        this.getStage().touchChildren = value;
    };
    /**
     * 设置同时可触发几个点击事件，默认为2
     * @param value
     */
    StageUtils.prototype.setMaxTouches = function (value) {
        this.getStage().maxTouches = value;
    };
    /**
     * 设置帧频
     * @param value
     */
    StageUtils.prototype.setFrameRate = function (value) {
        this.getStage().frameRate = value;
    };
    /**
     * 设置适配方式
     * @param value
     */
    StageUtils.prototype.setScaleMode = function (value) {
        this.getStage().scaleMode = value;
    };
    /**
     * 获取游戏Stage对象
     * @returns {egret.MainContext}
     */
    StageUtils.prototype.getStage = function () {
        return egret.MainContext.instance.stage;
    };
    StageUtils.prototype.getStageRect = function () {
        if (!this.m_pStageRect) {
            this.m_pStageRect = egret.Rectangle.create();
        }
        this.m_pStageRect.width = this.getWidth();
        this.m_pStageRect.height = this.getHeight();
        this.m_pStageRect.x = 0;
        this.m_pStageRect.y = 0;
        return this.m_pStageRect;
    };
    /**
     * 获取唯一UIStage
     * @returns {eui.UILayer}
     */
    StageUtils.prototype.getUIStage = function () {
        if (this.m_pUIStage == null) {
            this.m_pUIStage = new eui.UILayer();
            this.m_pUIStage.percentHeight = 100;
            this.m_pUIStage.percentWidth = 100;
            this.m_pUIStage.touchEnabled = false;
            this.getStage().addChild(this.m_pUIStage);
        }
        return this.m_pUIStage;
    };
    return StageUtils;
}(BaseClass));
