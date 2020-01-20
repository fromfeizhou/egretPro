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
    var TestWarview = /** @class */ (function (_super_1) {
        __extends(TestWarview, _super_1);
        function TestWarview() {
            var _this = _super_1.call(this) || this;
            _this.selectGeneral = "";
            _this.attr_define = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1003];
            _this.initApp("test/testWarSkin.exml");
            _this.initData();
            return _this;
        }
        TestWarview.prototype.initData = function () {
            if (TestWarview.warData) {
                this.dataObj = TestWarview.warData;
            }
            else {
                this.dataObj = new gameProto.C2S_GM_WAR();
                this.dataObj.terrainId = 1;
                this.dataObj.isNotSoldier = false; //是否不生成小兵 true不生成小兵
                this.dataObj.isSingleSoldier = false; //是否只生成一个小兵
                this.dataObj.isDefendAuto = false; //敌方是否自动技能
                this.dataObj.isSkillStop = false; //强制技能暂停
                this.dataObj.att = new gameProto.TeamUnit();
                this.dataObj.att.id = 1;
                this.dataObj.def = new gameProto.TeamUnit();
                this.dataObj.def.id = 2;
                // this.dataObj.def.heroUnit = [];
            }
            console.log(this.dataObj.def.heroUnit);
            this.curGeneralConfig = null;
        };
        TestWarview.prototype.getGeneralTypeWord = function (id) {
            var gConfig = C.GeneralConfig[id];
            var word = "";
            if (gConfig.armyType == 1) {
                word = "(刀兵";
            }
            if (gConfig.armyType == 2) {
                word = "(骑兵";
            }
            if (gConfig.armyType == 3) {
                word = "(弓兵";
            }
            if (gConfig.armyType == 4) {
                word = "(枪兵";
            }
            if (gConfig.armyType == 20) {
                word = "(投石车";
            }
            if (gConfig.armyType == 21) {
                word = "(弩车";
            }
            if (gConfig.armyType == 22) {
                word = "(帐篷";
            }
            return L.getInstance().getLanguage(gConfig.name) + word;
        };
        TestWarview.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            this.g_sourceArr = [];
            this.g_sourceArr.push({ type: "空", code: 0 });
            for (var i in C.GeneralConfig) {
                var obj = {
                    type: i + this.getGeneralTypeWord(Number(i)),
                    code: i
                };
                this.g_sourceArr.push(obj);
            }
            this.wujiang_dropListView.setArrayCollection(this.g_sourceArr);
            this.wujiang_dropListView.setItemTapCallback(function (index) {
                debug("select : " + index);
                var code = _this.g_sourceArr[index].code;
                _this.refreshGeneralInfo(code);
            }, this);
            this.dx_sourceArr = [];
            for (var i in C.TerrainConfig) {
                var mapConfig = C.TerrainConfig[i];
                var obj = {
                    type: i + " " + mapConfig.name,
                    code: i
                };
                this.dx_sourceArr.push(obj);
            }
            this.dixing_dropListView.setArrayCollection(this.dx_sourceArr);
            this.dixing_dropListView.setItemTapCallback(function (index) {
                var terrainId = index + 1;
                _this.dataObj.terrainId = terrainId;
            }, this);
            this.refreshAllInfo();
            this.addEvent();
            var str = LocalData.getData("GM_WAR_CONFIG", "");
            if (str != "") {
                this.parseConfig(str);
            }
        };
        //刷新界面信息.
        TestWarview.prototype.refreshAllInfo = function () {
            //地图
            this.dixing_dropListView.showItem(this.dataObj.terrainId - 1);
            /**是否不生成小兵 true不生成小兵 */
            this.m_onlyGeneralCherkBox.selected = this.dataObj.isNotSoldier;
            /**是否只生成一个小兵 */
            this.m_oneSoldierCherkBox.selected = this.dataObj.isSingleSoldier;
            /**敌方是否自动技能 */
            this.m_enemySkillCherkBox.selected = this.dataObj.isDefendAuto;
            /**强制技能暂停 */
            this.m_skillStopCherkBox.selected = this.dataObj.isSkillStop;
            for (var _i = 0, _a = this.dataObj.att.heroUnit; _i < _a.length; _i++) {
                var info = _a[_i];
                var gid = info.baseId;
                this["atkPos" + info.heroPosition].getChildAt(1).text = this.getGeneralTypeWord(gid);
            }
            for (var _b = 0, _c = this.dataObj.def.heroUnit; _b < _c.length; _b++) {
                var info = _c[_b];
                var gid = info.baseId;
                this["defPos" + info.heroPosition].getChildAt(1).text = this.getGeneralTypeWord(gid);
            }
        };
        TestWarview.prototype.parseConfig = function (str) {
            var obj = JSON.parse(str);
            this.dataObj = new gameProto.C2S_GM_WAR(obj);
            this.dataObj.att = new gameProto.TeamUnit(obj.att);
            this.dataObj.att.id = 1;
            this.dataObj.def = new gameProto.TeamUnit(obj.def);
            this.dataObj.def.id = 2;
            for (var _i = 0, _a = this.dataObj.att.heroUnit; _i < _a.length; _i++) {
                var general = _a[_i];
                general.id = Number(general.id);
                for (var _b = 0, _c = general.attribute; _b < _c.length; _b++) {
                    var info = _c[_b];
                    info.value = Number(info.value);
                }
                if (!general.passiveSkill) {
                    general.passiveSkill = [];
                }
                for (var _d = 0, _e = general.passiveSkill; _d < _e.length; _d++) {
                    var info = _e[_d];
                    info.value = Number(info.value);
                }
            }
            for (var _f = 0, _g = this.dataObj.def.heroUnit; _f < _g.length; _f++) {
                var general = _g[_f];
                general.id = Number(general.id);
                for (var _h = 0, _j = general.attribute; _h < _j.length; _h++) {
                    var info = _j[_h];
                    info.value = Number(info.value);
                }
                if (!general.passiveSkill) {
                    general.passiveSkill = [];
                }
                for (var _k = 0, _l = general.passiveSkill; _k < _l.length; _k++) {
                    var info = _l[_k];
                    info.value = Number(info.value);
                }
            }
            console.log(this.dataObj);
            // this.dataObj = obj;
            this.refreshAllInfo();
        };
        TestWarview.prototype.addEvent = function () {
            var _this = this;
            /**是否不生成小兵 true不生成小兵 */
            this.m_onlyGeneralCherkBox.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                _this.dataObj.isNotSoldier = evt.target.selected;
            }, this);
            /**是否只生成一个小兵 */
            this.m_oneSoldierCherkBox.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                _this.dataObj.isSingleSoldier = evt.target.selected;
            }, this);
            /**敌方是否自动技能 */
            this.m_enemySkillCherkBox.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                _this.dataObj.isDefendAuto = evt.target.selected;
            }, this);
            /**强制技能暂停 */
            this.m_skillStopCherkBox.addEventListener(eui.UIEvent.CHANGE, function (evt) {
                _this.dataObj.isSkillStop = evt.target.selected;
            }, this);
            for (var i = 1; i <= 6; i++) {
                com_main.EventManager.addTouchTapListener(this["atkPos" + i], this, this.onclickTeamBtn);
                com_main.EventManager.addTouchTapListener(this["defPos" + i], this, this.onclickTeamBtn);
            }
            com_main.EventManager.addTouchScaleListener(this.saveGeneral, this, this.onclickSaveGeneral);
            com_main.EventManager.addTouchScaleListener(this.startBattle, this, function () {
                BattleProxy.send_C2S_GM_WAR(_this.dataObj);
            });
            com_main.EventManager.addTouchScaleListener(this.closeBtn, this, function () {
                com_main.UpManager.close();
            });
            //导出数据
            com_main.EventManager.addTouchScaleListener(this.outputBtn, this, function () {
                console.log("导出数据~~~~~~~~~~~~~~~~~~~~~~");
                var str = JSON.stringify(_this.dataObj);
                console.log(str);
                console.log("导出数据~~~~~~~~~~~~~~~~~~~~~~end");
            });
            //导入数据
            com_main.EventManager.addTouchScaleListener(this.inputBtn, this, function () {
                var str = _this.inputText.text;
                _this.parseConfig(str);
            });
            /**保存录像 */
            com_main.EventManager.addTouchScaleListener(this.saveVideoBtn, this, function () {
                BattleVideoUtil.saveAsFile();
            });
            /**读取录像 */
            com_main.EventManager.addTouchScaleListener(this.runVideoBtn, this, function () {
                BattleVideoUtil.load();
            });
            /**清理录像缓存 */
            com_main.EventManager.addTouchScaleListener(this.clearnVideo, this, function () {
                BattleVideoUtil.BattleProxyList = [];
            });
        };
        TestWarview.prototype.onDestroy = function () {
            com_main.EventManager.removeEventListeners(this);
            TestWarview.warData = this.dataObj;
        };
        TestWarview.prototype.onclickTeamBtn = function (e) {
            var name = e.target.parent.name;
            console.log(name);
            this.selectGeneral = name;
            this.lightBtn();
            var _a = this.getGeneralData(), i = _a[0], info = _a[1];
            if (info) {
                this.refreshGeneralInfo(info.baseId);
            }
            // else{
            //     this.refreshGeneralInfo(0);
            // }
        };
        TestWarview.prototype.lightBtn = function () {
            for (var i = 1; i <= 6; i++) {
                this["atkPos" + i].getChildAt(0).source = "btn_001_up_png";
                this["defPos" + i].getChildAt(0).source = "btn_001_up_png";
            }
            var heroPosition = Number(this.selectGeneral.slice(-1));
            var team = this.selectGeneral.slice(0, 3);
            if (team == "atk") {
                this["atkPos" + heroPosition].getChildAt(0).source = "btn_006_up_png";
            }
            else if (team == "def") {
                this["defPos" + heroPosition].getChildAt(0).source = "btn_006_up_png";
            }
        };
        TestWarview.prototype.onclickSaveGeneral = function () {
            if (this.selectGeneral == "") {
                return;
            }
            var config = this.curGeneralConfig;
            var team = this.selectGeneral.slice(0, 3);
            var pos = Number(this.selectGeneral.slice(-1));
            if (!config) {
                //数据清空
                /**保存武将数据 */
                var _a = this.getGeneralData(), index = _a[0], info = _a[1];
                if (team == "atk") {
                    this["atkPos" + pos].getChildAt(1).text = "";
                    if (index != null || index != undefined) {
                        this.dataObj.att.heroUnit.splice(index, 1);
                    }
                }
                else if (team == "def") {
                    this["defPos" + pos].getChildAt(1).text = "";
                    if (index != null || index != undefined) {
                        this.dataObj.def.heroUnit.splice(index, 1);
                    }
                }
                console.log(this.dataObj);
                var str_1 = JSON.stringify(this.dataObj);
                LocalData.setData("GM_WAR_CONFIG", str_1);
                return;
            }
            var gDate = new gameProto.HeroUnit();
            gDate.heroPosition = pos;
            gDate.heroMaxTroops = Number(this.attr_edit_10.text);
            gDate.heroTroops = Number(this.attr_edit_10.text);
            gDate.baseId = config.id;
            // gDate.anager = 50;
            gDate.soldierType = config.armyType; //带兵类型
            gDate.anager = Number(this.attr_edit_9.text);
            var attriList = StringUtils.keyValsToNumber(config.attribute);
            for (var i in attriList) {
                var keyValue = new gameProto.SysKeyValue();
                keyValue.key = Number(i);
                keyValue.value = attriList[i];
                gDate.attribute.push(keyValue);
            }
            for (var _i = 0, _b = this.attr_define; _i < _b.length; _i++) {
                var i = _b[_i];
                var value = Number(this["attr_edit_" + i].text);
                this.resetValue(gDate.attribute, i, value);
            }
            //被动技能
            for (var i = 1; i <= 3; i++) {
                var obj = this["m_passiveCheckBox" + i];
                if (obj.selected) {
                    var keyValue = new gameProto.SysKeyValue();
                    keyValue.key = Number(obj.name);
                    keyValue.value = 1;
                    gDate.passiveSkill.push(keyValue);
                }
            }
            if (team == "atk") {
                gDate.id = gDate.heroPosition;
                this["atkPos" + gDate.heroPosition].getChildAt(1).text = L.getInstance().getLanguage(config.name);
                /**保存武将数据 */
                var _c = this.getGeneralData(), index = _c[0], info = _c[1];
                if (index != null || index != undefined) {
                    this.dataObj.att.heroUnit[index] = gDate;
                }
                else {
                    this.dataObj.att.heroUnit.push(gDate);
                }
            }
            else if (team == "def") {
                gDate.id = gDate.heroPosition + 5;
                this["defPos" + gDate.heroPosition].getChildAt(1).text = L.getInstance().getLanguage(config.name);
                /**保存武将数据 */
                var _d = this.getGeneralData(), index = _d[0], info = _d[1];
                if (index != null || index != undefined) {
                    this.dataObj.def.heroUnit[index] = gDate;
                }
                else {
                    this.dataObj.def.heroUnit.push(gDate);
                }
            }
            // console.log(this.dataObj);
            var str = JSON.stringify(this.dataObj);
            LocalData.setData("GM_WAR_CONFIG", str);
            // console.log('LocalData',str);
        };
        TestWarview.prototype.getGeneralData = function () {
            if (this.selectGeneral == "") {
                return [null, null];
            }
            var team = this.selectGeneral.slice(0, 3);
            var pos = Number(this.selectGeneral.slice(-1));
            var generalData = this.getTeamGeneralInfo(team, pos);
            return generalData;
        };
        TestWarview.prototype.getTeamGeneralInfo = function (teamType, pos) {
            var list;
            if (teamType == "atk") {
                list = this.dataObj.att.heroUnit;
            }
            else if (teamType == "def") {
                list = this.dataObj.def.heroUnit;
            }
            for (var i in list) {
                var info = list[i];
                if (info.heroPosition == pos) {
                    return [Number(i), info];
                }
            }
            return [null, null];
        };
        TestWarview.prototype.refreshGeneralInfo = function (gId) {
            for (var i in this.g_sourceArr) {
                var source = this.g_sourceArr[i];
                if (source.code == gId) {
                    this.wujiang_dropListView.showItem(Number(i));
                }
            }
            if (gId == 0) {
                /**武将名字 */
                this.generalLb.text = "";
                /**主动技能名字 */
                this.activeSkillLabel.text = "";
                /**被动技能1名字 */
                this.passiveSkillLabal1.text = "";
                /**被动技能2名字 */
                this.passiveSkillLabal2.text = "";
                /**被动技能3名字 */
                this.passiveSkillLabal3.text = "";
                for (var _i = 0, _a = this.attr_define; _i < _a.length; _i++) {
                    var i = _a[_i];
                    this["attr_edit_" + i].text = "";
                }
                //被动技能1
                this.m_passiveCheckBox1.selected = false;
                this.m_passiveCheckBox2.selected = false;
                this.m_passiveCheckBox3.selected = false;
                this.curGeneralConfig = null;
                return;
            }
            var gConfig = C.GeneralConfig[gId];
            this.curGeneralConfig = gConfig;
            /**武将名字 */
            this.generalLb.text = L.getInstance().getLanguage(gConfig.name);
            var skillIdList = this.getSkillIdList(gConfig);
            /**主动技能名字 */
            this.activeSkillLabel.text = C.SkillConfig[skillIdList[0]].name;
            /**被动技能1名字 */
            this.passiveSkillLabal1.text = C.SkillConfig[skillIdList[1]].name;
            this.m_passiveCheckBox1.name = skillIdList[1] + "";
            /**被动技能2名字 */
            this.passiveSkillLabal2.text = C.SkillConfig[skillIdList[2]].name;
            this.m_passiveCheckBox2.name = skillIdList[2] + "";
            /**被动技能3名字 */
            this.passiveSkillLabal3.text = C.SkillConfig[skillIdList[3]].name;
            this.m_passiveCheckBox3.name = skillIdList[3] + "";
            var attriList = StringUtils.keyValsToNumber(gConfig.attribute);
            var _b = this.getGeneralData(), index = _b[0], info = _b[1];
            if (index != null || index != undefined) {
                for (var _c = 0, _d = this.attr_define; _c < _d.length; _c++) {
                    var i = _d[_c];
                    this["attr_edit_" + i].text = this.getValueBykey(info.attribute, i) + "";
                }
                //被动技能1
                // this.m_passiveCheckBox1.selected = false;
                // this.m_passiveCheckBox2.selected = false;
                // this.m_passiveCheckBox3.selected = false;
                for (var i = 1; i <= 3; i++) {
                    var obj = this["m_passiveCheckBox" + i];
                    var key = Number(obj.name);
                    var value = this.getValueBykey(info.passiveSkill, key);
                    if (value) {
                        obj.selected = true;
                    }
                    else {
                        obj.selected = false;
                    }
                }
            }
            else {
                for (var _e = 0, _f = this.attr_define; _e < _f.length; _e++) {
                    var i = _f[_e];
                    this["attr_edit_" + i].text = attriList[i] + "";
                }
                //被动技能1
                this.m_passiveCheckBox1.selected = false;
                this.m_passiveCheckBox2.selected = false;
                this.m_passiveCheckBox3.selected = false;
            }
        };
        TestWarview.prototype.getValueBykey = function (list, key) {
            for (var i in list) {
                var keyValue = list[i];
                if (keyValue.key == key) {
                    return keyValue.value;
                }
            }
        };
        TestWarview.prototype.resetValue = function (list, key, value) {
            for (var i in list) {
                var keyValue = list[i];
                if (keyValue.key == key) {
                    keyValue.value = value;
                }
            }
        };
        /**获得技能列表id */
        TestWarview.prototype.getSkillIdList = function (config) {
            var skills = [];
            //怒气技能
            var cfg = config;
            skills.push(this.parseSkillJson(cfg.angerSkill));
            var skillparam = cfg.passiveSkill;
            var arr = skillparam.split(',');
            for (var i = 0; i < arr.length; i++) {
                skills.push(this.parseSkillJson(arr[i]));
            }
            return skills;
        };
        TestWarview.prototype.parseSkillJson = function (str) {
            var skills = str.split('_');
            return Number(skills[0]);
        };
        return TestWarview;
    }(com_main.CView));
    com_main.TestWarview = TestWarview;
})(com_main || (com_main = {}));
