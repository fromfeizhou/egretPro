// TypeScript file
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
var com_main;
(function (com_main) {
    /**
     * vip客服
     */
    var ServiceWnd = /** @class */ (function (_super_1) {
        __extends(ServiceWnd, _super_1);
        function ServiceWnd(data) {
            var _this = _super_1.call(this) || this;
            _this.m_strWX = 'vipkefu77';
            _this.name = ServiceWnd.NAME;
            _this.initApp("service/ServiceWndSkin.exml");
            return _this;
        }
        ServiceWnd.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.m_loader.removeEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.SERVICE_UI]);
        };
        ServiceWnd.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_apopUp.setTitleLabelVisible(false);
            this.m_imgGM.source = LoginConst.getResUrl('jzGm.jpg', 'gmInfo');
            com_main.EventManager.addTouchScaleListener(this.m_pBtnCopy, this, this.onVipServiceBtn);
            this.m_loader = new egret.URLLoader();
            this.m_loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
            this.m_loader.addEventListener(egret.Event.COMPLETE, this.onLoadComplete, this);
            var request = new egret.URLRequest(LoginConst.getResUrl('jzGm.json?v=' + GameConfig.version, 'gmInfo'));
            request.requestHeaders = [new egret.URLRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")];
            this.m_loader.load(request);
        };
        ;
        ServiceWnd.prototype.onLoadComplete = function (event) {
            var serverRequest = this.m_loader.data;
            if (!this.m_loader.data || this.m_loader.data == '')
                return;
            var data = JSON.parse(this.m_loader.data);
            /**
             * {"info":"单身","age":"22","name":"fuck me","height":"165cm","weight":"48kg","star":"射手座","city":"广州","wx":"vipkefu77",
             * "server":[["1.专属通道","VIP1v1"],["1.专属通道","VIP1v1"],["2.专属通道","VIP1v1"],["3.专属通道","VIP1v1"],["4.专属通道","VIP1v1"]]}
             */
            this.m_labMsg0.text = data['info'];
            this.m_labMsg1.text = data['age'];
            this.m_labMsg2.text = data['height'];
            this.m_labMsg3.text = data['weight'];
            this.m_labMsg4.text = data['star'];
            this.m_labMsg5.text = data['city'];
            this.m_strWX = data['wx'] || this.m_strWX;
            this.m_labWx.text = "VIP\u5BA2\u670D\u5FAE\u4FE1\uFF1A" + this.m_strWX;
            for (var i = 0; i < data['server'].length; i++) {
                var serviceCell = new ServiceCellComp();
                serviceCell.setTitle(data['server'][i][0], data['server'][i][1]);
                this.m_pRoot.addChild(serviceCell);
            }
        };
        //复制
        ServiceWnd.prototype.onVipServiceBtn = function () {
            // egret.ExternalInterface.call("sendToCopy", this.m_strWX);
            // copyBoard(this.m_strWX);
            // EffectUtils.showTips(GCode(CLEnum.SERVICE_WND), 1);
        };
        ServiceWnd.NAME = 'ServiceWnd';
        return ServiceWnd;
    }(com_main.CView));
    com_main.ServiceWnd = ServiceWnd;
    /**vip客服专属服务条例 */
    var ServiceCellComp = /** @class */ (function (_super_1) {
        __extends(ServiceCellComp, _super_1);
        function ServiceCellComp() {
            var _this = _super_1.call(this) || this;
            _this.skinName = Utils.getAppSkin("service/ServicecCellSkin.exml");
            _this.touchEnabled = false;
            _this.touchChildren = false;
            return _this;
        }
        ServiceCellComp.prototype.setTitle = function (title, doc) {
            this.m_labTitle.text = title;
            this.m_labDoc.text = doc;
        };
        return ServiceCellComp;
    }(com_main.CComponent));
    com_main.ServiceCellComp = ServiceCellComp;
})(com_main || (com_main = {}));
