/**红点UI */
var RedPointView = /** @class */ (function () {
    function RedPointView(container, offset, evtTypes, viewType, param) {
        if (viewType === void 0) { viewType = 1; }
        if (param === void 0) { param = null; }
        this.m_isShow = false; //是否显示
        this.m_container = container;
        this.code = container.hashCode;
        this.evtType = evtTypes;
        this.m_offset = offset;
        this.m_nViewType = viewType;
        this.resetData(evtTypes, param);
    }
    /**销毁 */
    RedPointView.prototype.destroy = function () {
        this.clearEffect();
        Utils.removeFromParent(this.m_redContainer);
        this.m_redContainer = null;
    };
    /**重置红点 */
    RedPointView.prototype.resetData = function (evtTypes, param) {
        if (param === void 0) { param = null; }
        this.m_isShow = false;
        Utils.removeFromParent(this.m_redContainer);
        this.m_states = {};
        this.evtType = evtTypes;
        for (var i = 0; i < evtTypes.length; i++) {
            this.m_states[evtTypes[i]] = 0;
        }
        this.param = param;
    };
    /**父节点 */
    RedPointView.prototype.getParentNode = function () {
        return this.m_container;
    };
    /**修改红点状态 */
    RedPointView.prototype.setRedState = function (evtType, val) {
        if (isNull(this.m_states[evtType]) || isNull(val))
            return;
        var state = val;
        this.m_states[evtType] = val;
        var count = 0;
        for (var key in this.m_states) {
            if (unNull(this.m_states[key]))
                count += this.m_states[key];
        }
        var res = count > 0;
        if (this.m_isShow != res) {
            this.m_isShow = res;
            if (this.m_isShow) {
                this.createRedView();
                this.refreshLabNum(count);
                this.m_container.addChild(this.m_redContainer);
            }
            else {
                Utils.removeFromParent(this.m_redContainer);
            }
        }
        else {
            if (this.m_isShow) {
                this.refreshLabNum(count);
            }
        }
    };
    /**刷新文本 */
    RedPointView.prototype.refreshLabNum = function (count) {
        if (this.m_labNum && count > 0) {
            this.m_labNum.text = count + "";
        }
    };
    /**创建红点显示 */
    RedPointView.prototype.createRedView = function () {
        if (this.m_redContainer)
            return;
        this.m_redContainer = new egret.DisplayObjectContainer();
        this.m_redContainer.touchEnabled = false;
        this.m_redContainer.touchChildren = false;
        this.m_redContainer.width = 42;
        this.m_redContainer.height = 46;
        this.m_redContainer.x = this.m_offset.x;
        this.m_redContainer.y = this.m_offset.y;
        if (unNull(this.m_offset.scale))
            NodeUtils.setScale(this.m_redContainer, this.m_offset.scale);
        this.m_container.addChild(this.m_redContainer);
        if (this.m_nViewType == 1) {
            var imgBg = new com_main.CImage("common_red_flag_png");
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
        }
        else if (this.m_nViewType == 2) {
            var imgBg = new com_main.CImage("common_red_flag2_png");
            this.m_redContainer.addChild(imgBg);
        }
        else if (this.m_nViewType == 3) {
            var imgBg = new com_main.CImage("common_red_flag3_png");
            this.m_redContainer.addChild(imgBg);
        }
        else if (this.m_nViewType == 4) {
            this.createEffect();
        }
        else if (this.m_nViewType == 5) {
            //主城建筑队列空闲
            var imgBg = new com_main.CImage("icon_xian_png");
            this.m_redContainer.addChild(imgBg);
        }
        else if (this.m_nViewType == 6) {
            //世界警报
            var imgBg = new com_main.CImage("btn_145_png");
            this.m_redContainer.addChild(imgBg);
        }
        else if (this.m_nViewType == 7) {
            //城市建筑
            var imgBg = new com_main.CImage("common_red_flag2_png");
            this.m_redContainer.addChild(imgBg);
        }
    };
    /**设置图标特效 */
    RedPointView.prototype.createEffect = function () {
        if (this.m_iconEff)
            return;
        this.m_iconEff = NormalMcMgr.createMc(IETypes.EUI_ActivityEffect);
        this.m_iconEff.x = 38;
        this.m_iconEff.y = 38;
        this.m_redContainer.addChild(this.m_iconEff);
    };
    RedPointView.prototype.clearEffect = function () {
        if (this.m_iconEff) {
            NormalMcMgr.removeMc(this.m_iconEff);
            this.m_iconEff = null;
        }
    };
    return RedPointView;
}());
