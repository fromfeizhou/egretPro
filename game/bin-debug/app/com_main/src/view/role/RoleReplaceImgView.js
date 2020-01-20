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
     * 更换形象
     */
    var RoleReplaceImgView = /** @class */ (function (_super_1) {
        __extends(RoleReplaceImgView, _super_1);
        function RoleReplaceImgView() {
            var _this = _super_1.call(this) || this;
            _this.name = RoleReplaceImgView.NAME;
            _this.skinName = Utils.getAppSkin("role/role_replace_img.exml");
            return _this;
        }
        RoleReplaceImgView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
            this.removeEvent();
        };
        /**监听事件 */
        RoleReplaceImgView.prototype.addEvent = function () {
            com_main.EventManager.addTouchTapListener(this.m_btnSure, this, this.onChangeImg);
            com_main.EventMgr.addEvent(RoleEvent.ROLE_HEADIMG, this.onRefreshImg, this);
        };
        /**移除事件 */
        RoleReplaceImgView.prototype.removeEvent = function () {
            com_main.EventMgr.removeEventByObject(RoleEvent.ROLE_HEADIMG, this);
        };
        RoleReplaceImgView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_btnSure.setTitleLabel(GCode(CLEnum.SURE));
            this.m_PopUp.setTitleLabel(GCode(CLEnum.LOGIN_CH_IMG));
            this.m_pCollection = new eui.ArrayCollection([]);
            this.m_List.dataProvider = this.m_pCollection;
            this.m_List.itemRenderer = RoleImgRender;
            this.m_List.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.onClickGenHead, this);
            this.m_List.useVirtualLayout = true;
            this.addEvent();
            this.initPanel();
        };
        /**初始化列表 */
        RoleReplaceImgView.prototype.initPanel = function () {
            var heroList = [];
            var curIndex = 0;
            var heroCfg = GeneralModel.getGeneralConfig();
            var len = GeneralModel.ownGenerals.datum.length;
            for (var i = 0; i < len; i++) {
                var data = GeneralModel.ownGenerals.datum[i];
                var vo = heroCfg[data.generalId];
                var isHave = GeneralModel.getOwnGeneral(vo.itemId) == null ? true : false;
                var roleVo = { id: vo.id, headType: 1, isHave: data.own, sel: false };
                heroList.push(roleVo);
            }
            heroList.sort(this.checkSort);
            for (var j = 0; j < heroList.length; j++) {
                if (RoleData.headId == heroList[j].id) {
                    curIndex = j;
                }
            }
            this.m_pCollection.replaceAll(heroList);
            this.setCurSelected(curIndex);
        };
        /**排序 */
        RoleReplaceImgView.prototype.checkSort = function (a, b) {
            var ca = a.isHave == true ? 0 : 1;
            var cb = b.isHave == true ? 0 : 1;
            if (ca < cb) { //按是否拥有武将顺序
                return -1;
            }
            else if (ca > cb) {
                return 1;
            }
            if (a.id < b.id) { //按id顺序
                return -1;
            }
            else if (a.id > b.id) {
                return 1;
            }
            else {
                return 0;
            }
        };
        /**更换形象 */
        RoleReplaceImgView.prototype.onChangeImg = function () {
            LoginProxy.C2S_PLAYER_SETTING(this.m_genHaveid, this.m_genHaveType);
        };
        /**刷新形象 */
        RoleReplaceImgView.prototype.onRefreshImg = function () {
            // for (let i = 0; i < this.m_pCollection.source.length; i++) {
            //     let info: IRoleItemRD = this.m_pCollection.getItemAt(i);
            //     this.m_pCollection.replaceItemAt(info, i);
            // }
            // this.refrestSelItem(this.m_nCurIndex, true);
            com_main.UpManager.history();
        };
        /**点击头像回调 */
        RoleReplaceImgView.prototype.onClickGenHead = function (e) {
            this.setCurSelected(e.itemIndex);
            var data = this.m_pCollection.getItemAt(e.itemIndex);
            var cfg = C.GeneralConfig[data.id];
            if (!data.isHave) {
                Utils.open_view(TASK_UI.NOR_SOURCE_VIEW_PANEL, cfg.itemId);
            }
        };
        /**设置当前选中武将下标 */
        RoleReplaceImgView.prototype.setCurSelected = function (index) {
            if (this.m_nCurIndex == index)
                return;
            var data = this.m_pCollection.getItemAt(index);
            if (!data.isHave) {
                return;
            }
            this.m_genHaveid = data.id;
            this.m_genHaveType = data.headType;
            this.refrestSelItem(this.m_nCurIndex, false);
            this.m_nCurIndex = index;
            this.refrestSelItem(this.m_nCurIndex, true);
        };
        /**刷新选中武将 */
        RoleReplaceImgView.prototype.refrestSelItem = function (index, val) {
            var data = this.m_pCollection.getItemAt(index);
            if (data) {
                data.sel = val;
                this.m_pCollection.replaceItemAt(data, index);
            }
        };
        RoleReplaceImgView.NAME = 'RoleReplaceImgView';
        return RoleReplaceImgView;
    }(com_main.CView));
    com_main.RoleReplaceImgView = RoleReplaceImgView;
    /**
* @class
* @extends eui.ItemRenderer
*/
    var RoleImgRender = /** @class */ (function (_super_1) {
        __extends(RoleImgRender, _super_1);
        function RoleImgRender() {
            return _super_1.call(this) || this;
        }
        RoleImgRender.prototype.$onRemoveFromStage = function () {
            _super_1.prototype.$onRemoveFromStage.call(this);
        };
        RoleImgRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_imgItem = new com_main.RoleReplaceItem();
            this.addChild(this.m_imgItem);
            this.m_imgSelected = new eui.Image('small_general_head_light_png');
            this.m_imgSelected.x = -10;
            this.m_imgSelected.y = -10;
            NodeUtils.setScale(this.m_imgSelected, 0.76);
            this.m_imgSelected.visible = false;
            this.m_imgItem.m_pSelected.addChild(this.m_imgSelected);
        };
        RoleImgRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_imgSelected.visible = this.m_tData.sel == true;
            this.m_imgItem.setItemInfo(this.m_tData.id, this.m_tData.isHave);
        };
        return RoleImgRender;
    }(eui.ItemRenderer));
    com_main.RoleImgRender = RoleImgRender;
})(com_main || (com_main = {}));
