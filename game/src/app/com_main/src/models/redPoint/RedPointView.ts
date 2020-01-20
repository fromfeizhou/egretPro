/**红点UI */
class RedPointView {
    public evtType: RedEvtType[];  //数据刷新类型
    public param: IRedViewParam;     //额外参数
    public code: number;

    private m_container: egret.DisplayObjectContainer; //红点父节点
    private m_redContainer: egret.DisplayObjectContainer;  //红点容器
    private m_iconEff: MCDragonBones;  // 图标特效
    private m_labNum: eui.Label; //数字
    private m_nViewType: number; //显示模式
    private m_offset: IRedOffset;
    private m_isShow: boolean = false;     //是否显示
    private m_states: { [key: number]: number }; //状态值



    public constructor(container: egret.DisplayObjectContainer, offset: IRedOffset, evtTypes: RedEvtType[], viewType: number = 1, param: IRedViewParam = null) {
        this.m_container = container;
        this.code = container.hashCode;
        this.evtType = evtTypes;
        this.m_offset = offset;
        this.m_nViewType = viewType;
        this.resetData(evtTypes, param)
    }


    /**销毁 */
    public destroy() {
        this.clearEffect();
        Utils.removeFromParent(this.m_redContainer);
        this.m_redContainer = null;
    }

    /**重置红点 */
    public resetData(evtTypes: RedEvtType[], param: IRedViewParam = null) {
        this.m_isShow = false;
        Utils.removeFromParent(this.m_redContainer);
        this.m_states = {};
        this.evtType = evtTypes;
        for (let i = 0; i < evtTypes.length; i++) {
            this.m_states[evtTypes[i]] = 0;
        }
        this.param = param;
    }

    /**父节点 */
    public getParentNode() {
        return this.m_container;
    }

    /**修改红点状态 */
    public setRedState(evtType: RedEvtType, val: number) {
        if (isNull(this.m_states[evtType]) || isNull(val)) return;
        let state = val;
        this.m_states[evtType] = val;
        let count = 0;
        for (let key in this.m_states) {
            if (unNull(this.m_states[key])) count += this.m_states[key];
        }

        let res = count > 0;
        if (this.m_isShow != res) {
            this.m_isShow = res;

            if (this.m_isShow) {
                this.createRedView();
                this.refreshLabNum(count);
                this.m_container.addChild(this.m_redContainer);
            } else {
                Utils.removeFromParent(this.m_redContainer);
            }
        } else {
            if (this.m_isShow) {
                this.refreshLabNum(count);
            }
        }
    }

    /**刷新文本 */
    private refreshLabNum(count: number) {
        if (this.m_labNum && count > 0) {
            this.m_labNum.text = count + "";
        }
    }

    /**创建红点显示 */
    private createRedView() {
        if (this.m_redContainer) return;
        this.m_redContainer = new egret.DisplayObjectContainer();
        this.m_redContainer.touchEnabled = false;
        this.m_redContainer.touchChildren = false;
        this.m_redContainer.width = 42;
        this.m_redContainer.height = 46;
        this.m_redContainer.x = this.m_offset.x;
        this.m_redContainer.y = this.m_offset.y;
        if (unNull(this.m_offset.scale)) NodeUtils.setScale(this.m_redContainer, this.m_offset.scale);
        this.m_container.addChild(this.m_redContainer);


        if (this.m_nViewType == 1) {
            let imgBg = new com_main.CImage("common_red_flag_png");
            this.m_redContainer.addChild(imgBg);

            this.m_labNum = new eui.Label();
            this.m_labNum.textAlign = egret.HorizontalAlign.CENTER;
            this.m_labNum.verticalAlign = egret.VerticalAlign.MIDDLE;
            // this.m_labNum.stroke = 1;
            // this.m_labNum.textColor = GameConfig.TextColors.fontWhite;
            this.m_labNum.size = 22;
            this.m_labNum.text = "0";
            this.m_labNum.width = 42;
            this.m_labNum.height = 46;
            this.m_redContainer.addChild(this.m_labNum);
        } else if (this.m_nViewType == 2) {
            let imgBg = new com_main.CImage("common_red_flag2_png");
            this.m_redContainer.addChild(imgBg);
        } else if (this.m_nViewType == 3) {
            let imgBg = new com_main.CImage("common_red_flag3_png");
            this.m_redContainer.addChild(imgBg);
        } else if (this.m_nViewType == 4) {
            this.createEffect();
        } else if (this.m_nViewType == 5) {
            //主城建筑队列空闲
            let imgBg = new com_main.CImage("icon_xian_png");
            this.m_redContainer.addChild(imgBg);
        }else if (this.m_nViewType == 6) {
            //世界警报
            let imgBg = new com_main.CImage("btn_145_png");
            this.m_redContainer.addChild(imgBg);
        } else if (this.m_nViewType == 7) {
            //城市建筑
            let imgBg = new com_main.CImage("common_red_flag2_png");
            this.m_redContainer.addChild(imgBg);
        }
    }

    /**设置图标特效 */
    private createEffect() {
        if (this.m_iconEff) return;
        this.m_iconEff = NormalMcMgr.createMc(IETypes.EUI_ActivityEffect);
        this.m_iconEff.x = 38;
        this.m_iconEff.y = 38;
        this.m_redContainer.addChild(this.m_iconEff);
    }
    private clearEffect() {
        if (this.m_iconEff) {
            NormalMcMgr.removeMc(this.m_iconEff);
            this.m_iconEff = null;
        }
    }

}
