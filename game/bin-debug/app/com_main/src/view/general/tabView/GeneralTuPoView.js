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
    var GeneralTuPoView = /** @class */ (function (_super_1) {
        __extends(GeneralTuPoView, _super_1);
        function GeneralTuPoView(generalId) {
            var _this = _super_1.call(this) || this;
            _this.name = GeneralTuPoView.NAME;
            _this.m_generalId = generalId;
            if (_this.m_generalId) {
                _this.m_generalVo = GeneralModel.getOwnGeneral(_this.m_generalId);
            }
            /**初始化 */
            _this.initApp("general/tabView/GeneralToPuViewSkin.exml");
            return _this;
        }
        ; //进场动画
        GeneralTuPoView.prototype.onDestroy = function () {
            egret.Tween.removeTweens(this.group);
            egret.Tween.removeTweens(this.group0);
            egret.Tween.removeTweens(this.group1);
            com_main.EventManager.removeEventListeners(this);
            this.actionGroup.removeEventListener("complete", this.onTweenComplete, this);
            if (this.unlockMc) {
                this.unlockMc.destroy();
            }
            this.unlockMc = null;
            _super_1.prototype.onDestroy.call(this);
        };
        GeneralTuPoView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labTips.visible = false;
            this.m_tCollection = new eui.ArrayCollection();
            this.m_listAttri.itemRenderer = GeneralTuPoAttriRender;
            this.m_listAttri.dataProvider = this.m_tCollection;
            /**基础属性 */
            var basisProp = [];
            var cfg = this.m_generalVo.GetGeneralTuPoCfg();
            var attriList1 = StringUtils.keyValsToNumber(cfg.attribute);
            for (var j in attriList1) {
                if (Number(j) == AttriType.ATK || Number(j) == AttriType.DEF || Number(j) == AttriType.HP || Number(j) == AttriType.SOLDIER) {
                    basisProp.push({ key: Number(j), value: Number(attriList1[j]) });
                }
            }
            this.refreshItem(this.getGeneralAttriRD(GeneralModel.currProp, basisProp));
            this.commitProperties();
            com_main.EventManager.addTouchTapListener(this, this, this.onTouchBackGround);
            this.actionGroup.addEventListener("complete", this.onTweenComplete, this);
            this.playStarAni();
            this.actionGroup.play(0);
        };
        /**
         * 动画组播放完成
         */
        GeneralTuPoView.prototype.onTweenComplete = function () {
            for (var i = 0; i < this.m_listAttri.numChildren; i++) {
                var item = this.m_listAttri.getChildAt(i);
                item.doAction();
            }
            this.m_labTips.visible = true;
        };
        /**获得渲染结构 */
        GeneralTuPoView.prototype.getGeneralAttriRD = function (currList, nxetList) {
            var res = [];
            for (var i = 0; i < nxetList.length; i++) {
                var data = nxetList[i];
                var currdata = currList[i];
                var name_1 = Utils.getAttriNameByType(data.key) + '：';
                var nextValue = Utils.getAttriFormatVal(data);
                var currValue = Utils.getAttriFormatVal(currdata);
                var nextAll = Number(nextValue) + Number(currValue);
                res.push({ name: name_1, currAttri: currValue, nextAttri: nextAll.toString() });
            }
            return res;
        };
        /**特效闪烁 */
        GeneralTuPoView.prototype.playStarAni = function () {
            this.unlockMc = new MCDragonBones();
            this.unlockMc.initAsync(IETypes.EUI_UNLOCK);
            this.unlockMc.play(IETypes.EUI_UNLOCK, 1, true);
            this.unlockMc.scaleX = 3;
            this.unlockMc.scaleY = 3;
            this.unlockMc.x = this.width / 2;
            this.unlockMc.y = 200;
            this.addChild(this.unlockMc);
        };
        GeneralTuPoView.prototype.onTouchBackGround = function () {
            if (!this.m_labTips.visible)
                return;
            com_main.UpManager.history();
        };
        GeneralTuPoView.prototype.refreshItem = function (datas) {
            this.m_tCollection.replaceAll(datas);
        };
        GeneralTuPoView.NAME = "GeneralTuPoView";
        return GeneralTuPoView;
    }(com_main.CView));
    com_main.GeneralTuPoView = GeneralTuPoView;
    /**属性 */
    var GeneralTuPoAttriRender = /** @class */ (function (_super_1) {
        __extends(GeneralTuPoAttriRender, _super_1);
        function GeneralTuPoAttriRender() {
            return _super_1.call(this) || this;
        }
        GeneralTuPoAttriRender.prototype.$onRemoveFromStage = function () {
            egret.Tween.removeTweens(this.m_imgMask);
            egret.Tween.removeTweens(this.image);
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        GeneralTuPoAttriRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_labNext.mask = this.m_imgMask;
        };
        GeneralTuPoAttriRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.refresh();
            this.commitProperties();
        };
        GeneralTuPoAttriRender.prototype.refresh = function () {
            this.m_labAttriName.text = this.m_tData.name;
            this.m_labCur.text = this.m_tData.currAttri;
            this.m_labNext.text = this.m_tData.nextAttri;
        };
        /**播放动画 */
        GeneralTuPoAttriRender.prototype.doAction = function () {
            this.action.play(0);
        };
        return GeneralTuPoAttriRender;
    }(eui.ItemRenderer));
    com_main.GeneralTuPoAttriRender = GeneralTuPoAttriRender;
})(com_main || (com_main = {}));
