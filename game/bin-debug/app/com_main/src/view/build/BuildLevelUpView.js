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
     * 建筑升级
     */
    var BuildLevelUpView = /** @class */ (function (_super_1) {
        __extends(BuildLevelUpView, _super_1);
        function BuildLevelUpView(data) {
            var _this = _super_1.call(this) || this;
            _this.m_curEndTime = 5; //5秒关闭
            _this.m_lvUpType = 0; //等级提升类型（1为君主，2为建筑）
            _this.arr = [];
            _this.name = BuildLevelUpView.NAME;
            _this.initApp("map/build/build_level_up_view_skin.exml");
            _this.m_pId = data.id;
            _this.m_lvUpType = data.type;
            return _this;
        }
        BuildLevelUpView.prototype.listenerProtoNotifications = function () {
            return [];
        };
        BuildLevelUpView.prototype.onDestroy = function () {
            Tween.removeTweens(this.m_pEffectIcon);
            // egret.clearTimeout(this.m_pTimeOutId);
            Utils.TimerManager.remove(this.timeCallback, this);
            this.m_pShowAni.removeEventListener("itemComplete", this.onBgAniFinish, this);
            com_main.EventManager.removeEventListeners(this);
            _super_1.prototype.onDestroy.call(this);
        };
        BuildLevelUpView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pRoot.mask = this.m_pRootMask;
            this.m_pShowAni.addEventListener("itemComplete", this.onBgAniFinish, this);
            Tween.removeTweens(this.m_pEffectIcon);
            Tween.get(this.m_pEffectIcon, { loop: true })
                .to({ alpha: 0 }, 600)
                .to({ alpha: 1 }, 600);
            this.initView();
            this.initTime();
        };
        BuildLevelUpView.prototype.initTime = function () {
            Utils.TimerManager.doTimer(1000, 0, this.timeCallback, this);
        };
        //时间回调
        BuildLevelUpView.prototype.timeCallback = function () {
            this.m_curEndTime--;
            if (this.m_curEndTime <= 0) {
                this.onHide();
                return;
            }
            this.m_labTime.text = this.m_curEndTime.toString();
        };
        //入场动画后开始缓动
        BuildLevelUpView.prototype.onBgAniFinish = function (event) {
            var item = event.data;
            if (this.m_pTipsRoot == item.target) {
                this.m_pLbLv.text = this.m_lvUpType == LevelUpConditionType.BUILDING_LEVEL ? MainMapModel.getLevel(this.m_pId) + "" : this.m_pId + "";
            }
        };
        BuildLevelUpView.prototype.initView = function () {
            this.m_pBuildGroup.visible = false;
            this.m_pLvUpRoot.visible = this.m_labBuildTitle.visible = false;
            var curLv = 0;
            var imgstr = "";
            if (this.m_lvUpType == LevelUpConditionType.ROLE_LEVEL) { //君主升级
                curLv = this.m_pId;
                this.m_pLbLv.text = curLv + "";
                if (this.m_pId <= 12) {
                    this.m_pDescValue.text = 12 + "";
                }
                else {
                    this.m_pDescValue.text = this.m_pId + "";
                }
                this.m_pDesc.text = GCode(CLEnum.CITY_BD_LIMIT);
                imgstr = "lb_jzdjts_png";
                this.m_pLvUpRoot.visible = true;
            }
            else {
                this.arr = MainMapModel.canActivationBuildInfo();
                curLv = MainMapModel.getLevel(this.m_pId);
                imgstr = "lb_dddjts_png";
                if (this.arr && this.arr.length > 0) {
                    this.m_labBuildTitle.textFlow = Utils.htmlParser(GCodeFromat(CLEnum.CITY_BD_LIMIT1, curLv));
                    this.m_pBuildGroup.visible = this.m_labBuildTitle.visible = true;
                    this.creatBuildItem();
                }
                else {
                    this.m_pLbLv.text = (curLv - 1) + "";
                    this.m_pDescValue.text = curLv + "";
                    this.m_pDesc.text = GCode(CLEnum.CITY_BD_LIMIT2);
                    this.m_pLvUpRoot.visible = true;
                }
            }
            this.m_imgTitle.source = imgstr;
            com_main.EventManager.addTouchScaleListener(this.m_pMaskBtn, this, this.onHide);
            // this.m_pTimeOutId = egret.setTimeout(()=>{
            //      this.m_pLbLv.text = MainMapModel.getLevel(this.m_pId) +"";
            // },this,500)
            this.m_pShowAni.play(0);
        };
        BuildLevelUpView.prototype.creatBuildItem = function () {
            var len = this.arr.length >= 3 ? 3 : this.arr.length;
            for (var i = 0; i < len; i++) {
                var info = this.arr[i];
                var builditem = new com_main.buildCanAtionItem();
                builditem.setInfo(info.type, info.name);
                this.m_pBuildGroup.addChild(builditem);
            }
        };
        BuildLevelUpView.prototype.onHide = function () {
            com_main.UpManager.history();
        };
        BuildLevelUpView.NAME = 'BuildLevelUpView';
        return BuildLevelUpView;
    }(com_main.CView));
    com_main.BuildLevelUpView = BuildLevelUpView;
})(com_main || (com_main = {}));
