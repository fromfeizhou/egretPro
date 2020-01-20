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
    var GeneralUpStarView = /** @class */ (function (_super_1) {
        __extends(GeneralUpStarView, _super_1);
        function GeneralUpStarView(generalId) {
            var _this = _super_1.call(this) || this;
            _this.name = GeneralUpStarView.NAME;
            _this.m_generalId = generalId;
            if (_this.m_generalId) {
                _this.m_generalVo = GeneralModel.getOwnGeneral(_this.m_generalId);
            }
            /**初始化 */
            _this.initApp("general/tabView/GeneralUpStarViewSkin.exml");
            return _this;
        }
        ; //进场动画
        GeneralUpStarView.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this.group);
            egret.Tween.removeTweens(this.group0);
            egret.Tween.removeTweens(this.group1);
            com_main.EventManager.removeEventListeners(this);
            if (this.unlockMc) {
                this.unlockMc.destroy();
            }
            this.unlockMc = null;
            this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
            _super_1.prototype.onDestroy.call(this);
        };
        GeneralUpStarView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labTips.visible = false;
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = GeneralUpStarAttriRender;
            this.m_listAttri.dataProvider = this.m_tCollection;
            /**基础属性 */
            var basisProp = [];
            var attriList1 = this.m_generalVo.attriList;
            for (var j in attriList1) {
                if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.CRITICAL) {
                    basisProp.push({ key: Number(j), value: Number(attriList1[j]) });
                }
            }
            this.refreshItem(this.getGeneralAttriRD(GeneralModel.currProp, basisProp));
            com_main.EventManager.addTouchTapListener(this, this, this.onTouchBackGround);
            this.actionGroup.addEventListener("complete", this.onTweenComplete, this);
            this.playStarAni();
            this.actionGroup.play(0);
        };
        /**
         * 动画组播放完成
         */
        GeneralUpStarView.prototype.onTweenComplete = function () {
            for (var i = 0; i < this.m_listAttri.numChildren; i++) {
                var item = this.m_listAttri.getChildAt(i);
                item.doAction();
            }
            this.refreshStarView();
        };
        /**获得渲染结构 */
        GeneralUpStarView.prototype.getGeneralAttriRD = function (currList, nxetList) {
            var res = [];
            for (var i = 0; i < nxetList.length; i++) {
                var data = nxetList[i];
                var currdata = currList[i];
                var name_1 = Utils.getAttriNameByType(data.key) + '：';
                var nextValue = Utils.getAttriFormatVal(data);
                var currValue = Utils.getAttriFormatVal(currdata);
                res.push({ name: name_1, currAttri: currValue, nextAttri: nextValue });
            }
            return res;
        };
        GeneralUpStarView.prototype.onTouchBackGround = function () {
            if (!this.m_labTips.visible)
                return;
            com_main.UpManager.history();
            GeneralModel.checkCanAtion(this.m_generalId);
        };
        GeneralUpStarView.prototype.refreshItem = function (datas) {
            this.m_tCollection.replaceAll(datas);
        };
        GeneralUpStarView.prototype.playStarAni = function () {
            this.unlockMc = new MCDragonBones();
            this.unlockMc.initAsync(IETypes.EUI_UNLOCK);
            this.unlockMc.play(IETypes.EUI_UNLOCK, 1, true);
            this.unlockMc.scaleX = 3;
            this.unlockMc.scaleY = 3;
            this.unlockMc.x = this.width / 2;
            this.unlockMc.y = 200;
            this.addChild(this.unlockMc);
        };
        /**刷新星星 */
        GeneralUpStarView.prototype.refreshStarView = function () {
            if (this.m_generalVo) {
                var startCfg = GeneralModel.getStarCfg(this.m_generalVo.star);
                var starNum = startCfg.starlevel;
                var res = GeneralModel.getStarRes(startCfg.starType);
                this.refreshStarBg(startCfg.starType);
                this.group_star.removeChildren();
                for (var i = 0; i < starNum; i++) {
                    var contain = new eui.Group();
                    contain.width = 55;
                    contain.height = 55;
                    var star = new eui.Image(res);
                    star.width = 55;
                    star.height = 55;
                    contain.addChild(star);
                    this.group_star.addChild(contain);
                    if (i == (starNum - 1)) {
                        this.playStarEffect(contain);
                    }
                }
            }
        };
        /**刷新星星背景 */
        GeneralUpStarView.prototype.refreshStarBg = function (type) {
            if (this.m_nStarType == type) {
                return;
            }
            this.m_nStarType = type;
            Utils.removeAllChild(this.group_starBg);
            var res = GeneralModel.getStarBgRes(this.m_nStarType);
            for (var i = 0; i < 5; i++) {
                var star = new eui.Image(res);
                star.width = 55;
                star.height = 55;
                this.group_starBg.addChild(star);
            }
        };
        /**星星特效 */
        GeneralUpStarView.prototype.playStarEffect = function (contain) {
            var _this = this;
            var effect = new MCDragonBones();
            effect.initAsync(IETypes.EUI_GenUpStar);
            effect.playOnceDone(IETypes.EUI_GenUpStar, function () {
                if (_this.m_labTips) {
                    _this.m_labTips.visible = true;
                }
            }, this);
            effect.x = 27.5;
            effect.y = 27.5;
            contain.addChild(effect);
        };
        GeneralUpStarView.NAME = "GeneralUpStarView";
        return GeneralUpStarView;
    }(com_main.CView));
    com_main.GeneralUpStarView = GeneralUpStarView;
    /**属性 */
    var GeneralUpStarAttriRender = /** @class */ (function (_super_1) {
        __extends(GeneralUpStarAttriRender, _super_1);
        function GeneralUpStarAttriRender() {
            return _super_1.call(this) || this;
        }
        GeneralUpStarAttriRender.prototype.$onRemoveFromStage = function () {
            egret.Tween.removeTweens(this.m_imgMask);
            egret.Tween.removeTweens(this.image);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        GeneralUpStarAttriRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labNext.mask = this.m_imgMask;
        };
        GeneralUpStarAttriRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.refresh();
            this.commitProperties();
        };
        GeneralUpStarAttriRender.prototype.refresh = function () {
            this.m_labAttriName.text = this.m_tData.name;
            this.m_labCur.text = this.m_tData.currAttri;
            this.m_labNext.text = this.m_tData.nextAttri;
            this.m_labCur.x = this.m_labAttriName.x + this.m_labAttriName.width;
        };
        /**播放动画 */
        GeneralUpStarAttriRender.prototype.doAction = function () {
            this.action.play(0);
        };
        return GeneralUpStarAttriRender;
    }(eui.ItemRenderer));
    com_main.GeneralUpStarAttriRender = GeneralUpStarAttriRender;
})(com_main || (com_main = {}));
