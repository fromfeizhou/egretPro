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
     * 阵营选择
     */
    var GuideSelectCountry = /** @class */ (function (_super_1) {
        __extends(GuideSelectCountry, _super_1);
        function GuideSelectCountry(ty) {
            var _this = _super_1.call(this) || this;
            _this.m_pSelectCountry = 0;
            _this.m_pDefault = 0;
            _this.m_pIsSend = false;
            _this.m_gender = 0; //当前性别
            LoginProxy.C2S_PLAYER_RANDOM_NAME(_this.m_gender);
            LoginProxy.C2S_PLAYER_RECOMMEND_COUNTRY();
            _this.name = GuideSelectCountry.NAME;
            _this.touchEnabled = true;
            _this.initApp("world/world_camp_view.exml");
            return _this;
        }
        GuideSelectCountry.prototype.listenerProtoNotifications = function () {
            return [
                ProtoDef.S2C_PLAYER_RECOMMEND_COUNTRY,
                ProtoDef.S2C_PLAYER_RANDOM_NAME,
            ];
        };
        GuideSelectCountry.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
                case ProtoDef.S2C_PLAYER_RECOMMEND_COUNTRY: {
                    this.m_pDefault = RoleData.defaultCountryId == 4 ? 3 : RoleData.defaultCountryId;
                    if (this.m_pSelectCountry != this.m_pDefault) {
                        this.m_pSelectCountry = this.m_pDefault;
                        this.changeCountryType(this.m_pDefault, false);
                    }
                    break;
                }
                case ProtoDef.S2C_PLAYER_RANDOM_NAME: {
                    this.creatName(RoleData.nickName);
                    break;
                }
            }
        };
        GuideSelectCountry.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListener(this.m_pBtnJoin);
            com_main.EventManager.removeEventListener(this.m_btnRandom);
            this.m_labInput.removeEventListener(egret.Event.CHANGE, this.onAccountChange, this);
            SceneResGroupCfg.clearModelRes([ModuleEnums.SELECT_COUNTRY, ModuleEnums.COUNTRY_UI]);
        };
        GuideSelectCountry.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            this.m_pRoot.visible = false;
            Utils.toStageBestScale(this.m_pRoot);
            Utils.open_view(TASK_UI.GUIDE_DIALOG_VIEW, 300001);
            com_main.EventMgr.addEvent(GuideEvent.GUIDE_DIALOGUE_END, this.dialogueEnd, this);
            this.m_tCollection = new eui.ArrayCollection();
            this.m_tabBtn.dataProvider = this.m_tCollection;
            this.m_tabBtn.itemRenderer = TabBtnRoleRender;
            this.m_tabBtn.addEventListener(egret.Event.CHANGE, this.onTabBtnClick, this);
            this.m_pBtnJoin.setTitleLabel(GCode(CLEnum.ENTER_GAME));
            com_main.EventManager.addTouchScaleListener(this.m_pBtnJoin, this, this.onClick);
            com_main.EventManager.addTouchScaleListener(this.m_btnRandom, this, this.onClickRandom);
            this.m_labInput.addEventListener(egret.Event.CHANGE, this.onAccountChange, this);
            this.m_tItemList = [];
            for (var i = 0; i < GuideSelectCountry.Types.length; i++) {
                var item = this["m_item" + i];
                item.type = GuideSelectCountry.Types[i];
                this.m_tItemList.push(item);
                com_main.EventManager.addTouchTapListener(item, this, this.onItemClick);
            }
            //第二位 居中为当前选中对象
            this.m_nCountryType = GuideSelectCountry.Types[1];
            this.setCollection();
            this.setRoleimg(this.m_gender); //默认性别男
        };
        /**结束剧情对话事件 */
        GuideSelectCountry.prototype.dialogueEnd = function () {
            this.m_pRoot.visible = true;
            com_main.EventMgr.removeEventByObject(GuideEvent.GUIDE_DIALOGUE_END, this);
            window["ta"].track('novice_guide', { step: 10006 + "", 'trigger_time': new Date() });
        };
        /**初始化按钮 */
        GuideSelectCountry.prototype.setCollection = function () {
            var heroArr = [];
            for (var i = 0; i < 2; i++) {
                var sel = void 0;
                var gender = void 0;
                if (i == 0) {
                    gender = 'icon_xj_boy_png';
                    sel = true;
                }
                else if (i == 1) {
                    gender = "icon_xj_girl_png";
                    sel = false;
                }
                var data = { sel: sel, type: i, gender: gender };
                heroArr.push(data);
            }
            this.m_tCollection.replaceAll(heroArr);
        };
        //国家点击回调
        GuideSelectCountry.prototype.onItemClick = function (e) {
            var item = e.currentTarget;
            if (item.type == this.m_nCountryType)
                return;
            this.changeCountryType(item.type);
            window["ta"].track('novice_guide', { step: 10007 + "", 'trigger_time': new Date() });
        };
        /**切换国家 */
        GuideSelectCountry.prototype.changeCountryType = function (type, isAction) {
            if (isAction === void 0) { isAction = true; }
            var currIndex;
            var itemInfo = ConstUtil.getItems(IConstEnum.RECOMMEND_COUNTRY)[0];
            var curId = 0;
            var targetId = 0;
            for (var i = 0; i < this.m_tItemList.length; i++) {
                var item = this.m_tItemList[i];
                if (item.type == this.m_nCountryType)
                    curId = i;
                if (item.type == type)
                    targetId = i;
                var boo = false;
                if (item.type == this.m_pDefault) {
                    currIndex = i;
                }
                item.setSelect(boo, itemInfo.count);
            }
            this.m_nCountryType = type;
            this.m_pSelectCountry = type;
            var boo1 = this.m_nCountryType == this.m_pDefault ? true : false;
            this.m_tItemList[currIndex].setSelect(boo1, itemInfo.count);
            if (curId != targetId) {
                while (curId != targetId) {
                    this.doAction(targetId - curId, isAction);
                    curId = curId > targetId ? curId - 1 : curId + 1;
                }
            }
            else {
                //旋转动画
                this.doAction(0, isAction);
            }
        };
        /** 旋转动画 */
        GuideSelectCountry.prototype.doAction = function (state, isAction) {
            if (isAction === void 0) { isAction = true; }
            if (state < 0) {
                //上旋转
                var tmp = this.m_tItemList.pop();
                this.m_tItemList.unshift(tmp);
                this.m_pItemRoot.setChildIndex(tmp, 0);
            }
            else if (state > 0) {
                //下
                var tmp = this.m_tItemList.shift();
                this.m_tItemList.push(tmp);
                this.m_pItemRoot.setChildIndex(tmp, 0);
            }
            this.m_pItemRoot.setChildIndex(this.m_tItemList[1], this.m_pItemRoot.numChildren - 1);
            var posY = [70, 250, 430];
            var scales = [0.8, 1, 0.8];
            var alphas = [0.5, 1, 0.5];
            for (var i = 0; i < this.m_tItemList.length; i++) {
                this.m_tItemList[i].doAction(posY[i], scales[i], alphas[i], isAction);
                var effBoo = i == 1 ? true : false;
                this.m_tItemList[i].setSelectEff(effBoo);
            }
        };
        /**设置性别切卡回调 */
        GuideSelectCountry.prototype.onTabBtnClick = function (e) {
            Sound.playTap();
            var selectedIndex = e.currentTarget.selectedIndex;
            for (var i = 0; i < this.m_tCollection.source.length; i++) {
                var info = this.m_tCollection.getItemAt(i);
                info.sel = i == selectedIndex;
                this.m_tCollection.replaceItemAt(info, i);
            }
            this.m_gender = selectedIndex;
            this.setRoleimg(selectedIndex);
            window["ta"].track('novice_guide', { step: 10008 + "", 'trigger_time': new Date() });
        };
        GuideSelectCountry.prototype.setRoleimg = function (index) {
            var imgPic = index == 1 ? RoleImgId.GIRL : RoleImgId.BOY;
            this.refreshGeneral(imgPic);
            this.getRandomName(index);
        };
        /**boss形象 */
        GuideSelectCountry.prototype.refreshGeneral = function (imgPic) {
            this.m_genCard.setInfo(imgPic, true);
            if (imgPic == RoleImgId.BOY) {
                NodeUtils.setScale(this.m_genCard.heroIcon, 1.1);
            }
            else {
                NodeUtils.setScale(this.m_genCard.heroIcon, 1);
            }
        };
        /**创角名字 */
        GuideSelectCountry.prototype.creatName = function (name) {
            this.m_labInput.maxChars = 6; //限制输入6个字位/字母
            this.m_labInput.text = name;
        };
        /**输入名字 */
        GuideSelectCountry.prototype.onAccountChange = function (evt) {
            Sound.playTap();
            var input = evt.target;
            input.text = Utils.trim(input.text); //过滤空格
            input.text = Utils.filterStr(input.text); //过滤特殊字符
            // /**过滤敏感字 */
            // GameConfig.setLoginData(null, null, input.text);
            window["ta"].track('novice_guide', { step: 10010 + "", 'trigger_time': new Date() });
        };
        /**点击随机命名按钮 */
        GuideSelectCountry.prototype.onClickRandom = function (e) {
            this.getRandomName(this.m_gender);
            window["ta"].track('novice_guide', { step: 10009 + "", 'trigger_time': new Date() });
        };
        /**随机创角名字 */
        GuideSelectCountry.prototype.getRandomName = function (gender) {
            LoginProxy.C2S_PLAYER_RANDOM_NAME(gender);
        };
        GuideSelectCountry.prototype.onClick = function (e) {
            if (this.m_labInput.text == "") {
                EffectUtils.showTips(GCode(CLEnum.LOGIN_CHOSE_NAME));
                return;
            }
            if (this.m_pSelectCountry == 0) {
                EffectUtils.showTips(GCode(CLEnum.LOGIN_CHOSE_STATE));
                return;
            }
            LoginProxy.C2S_PLAYER_CREATE(this.m_labInput.text, 1, this.m_pSelectCountry, this.m_gender);
            window["ta"].track('novice_guide', { step: 10011 + "", 'trigger_time': new Date() });
            // LoginProxy.send_JOIN_COUNTRY(this.m_pSelectCountry);
            // UpManager.history();
        };
        GuideSelectCountry.Types = [SoldierNationType.SU, SoldierNationType.WEI, SoldierNationType.WU];
        GuideSelectCountry.NAME = "GuideSelectCountry";
        return GuideSelectCountry;
    }(com_main.CView));
    com_main.GuideSelectCountry = GuideSelectCountry;
    var TabBtnRoleRender = /** @class */ (function (_super_1) {
        __extends(TabBtnRoleRender, _super_1);
        function TabBtnRoleRender() {
            return _super_1.call(this) || this;
        }
        TabBtnRoleRender.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        TabBtnRoleRender.prototype.dataChanged = function () {
            this.m_tData = this.data;
            this.m_imgSelect.source = this.m_tData.sel ? 'btn_137_png' : 'btn_136_png';
            this.m_imgGender.source = this.m_tData.gender;
        };
        return TabBtnRoleRender;
    }(eui.ItemRenderer));
})(com_main || (com_main = {}));
