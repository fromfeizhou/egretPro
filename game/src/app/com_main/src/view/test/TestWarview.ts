
module com_main {
	export class TestWarview extends CView {

		public generalLb:eui.EditableText;
public generalLb0:eui.EditableText;
public activeSkill:eui.Label;
public activeSkillLabel:eui.Label;
public passiveSkill:eui.Label;
public passiveSkillLabal1:eui.Label;
public passiveSkillLabal2:eui.Label;
public passiveSkillLabal3:eui.Label;
public m_passiveCheckBox1:eui.CheckBox;
public m_passiveCheckBox2:eui.CheckBox;
public m_passiveCheckBox3:eui.CheckBox;
public attr_Lb_1:eui.Label;
public attr_Lb_2:eui.Label;
public attr_Lb_3:eui.Label;
public attr_Lb_4:eui.Label;
public attr_Lb_5:eui.Label;
public attr_Lb_6:eui.Label;
public attr_Lb_7:eui.Label;
public attr_Lb_8:eui.Label;
public attr_Lb_9:eui.Label;
public attr_Lb_10:eui.Label;
public attr_Lb_11:eui.Label;
public attr_Lb_12:eui.Label;
public attr_Lb_13:eui.Label;
public attr_Lb_1003:eui.Label;
public attr_edit_1003:eui.EditableText;
public attr_edit_1:eui.EditableText;
public attr_edit_2:eui.EditableText;
public attr_edit_3:eui.EditableText;
public attr_edit_4:eui.EditableText;
public attr_edit_5:eui.EditableText;
public attr_edit_6:eui.EditableText;
public attr_edit_7:eui.EditableText;
public attr_edit_8:eui.EditableText;
public attr_edit_9:eui.EditableText;
public attr_edit_10:eui.EditableText;
public attr_edit_11:eui.EditableText;
public attr_edit_12:eui.EditableText;
public attr_edit_13:eui.EditableText;
public atk_team:eui.Group;
public atkPos1:eui.Group;
public atkPos2:eui.Group;
public atkPos3:eui.Group;
public atkPos4:eui.Group;
public atkPos5:eui.Group;
public atkPos6:eui.Group;
public def_team:eui.Group;
public defPos1:eui.Group;
public defPos2:eui.Group;
public defPos3:eui.Group;
public defPos4:eui.Group;
public defPos5:eui.Group;
public defPos6:eui.Group;
public outputBtn:eui.Button;
public inputBtn:eui.Button;
public saveVideoBtn:eui.Button;
public runVideoBtn:eui.Button;
public clearnVideo:eui.Button;
public inputText:eui.EditableText;
public m_onlyGeneralCherkBox:eui.CheckBox;
public m_oneSoldierCherkBox:eui.CheckBox;
public m_enemySkillCherkBox:eui.CheckBox;
public m_skillStopCherkBox:eui.CheckBox;
public saveGeneral:eui.Button;
public startBattle:eui.Button;
public dixing_dropListView:com_main.DropList;
public wujiang_dropListView:com_main.DropList;
public closeBtn:eui.Button;


        public dataObj: gameProto.C2S_GM_WAR ;
        public selectGeneral = "";
        public curGeneralConfig ;
        public g_sourceArr ;
        public dx_sourceArr ;

        public attr_define = [1,2,3,4,5,6,7,8,9,10,11,12,13,1003];

        public static warData: gameProto.C2S_GM_WAR;
		public constructor() {
			super();
			this.initApp("test/testWarSkin.exml");
            this.initData();
		}

        private initData(){

            if(TestWarview.warData){
                this.dataObj = TestWarview.warData;
            }else{
                this.dataObj = new gameProto.C2S_GM_WAR();
                this.dataObj.terrainId = 1;
                this.dataObj.isNotSoldier = false;    //是否不生成小兵 true不生成小兵
                this.dataObj.isSingleSoldier = false; //是否只生成一个小兵
                this.dataObj.isDefendAuto = false;    //敌方是否自动技能
                this.dataObj.isSkillStop = false;     //强制技能暂停

                this.dataObj.att = new gameProto.TeamUnit();
                this.dataObj.att.id = 1;
                this.dataObj.def = new gameProto.TeamUnit();
                this.dataObj.def.id = 2;
                // this.dataObj.def.heroUnit = [];
            }
            
            console.log(this.dataObj.def.heroUnit);
            this.curGeneralConfig = null;
            
        }

        public getGeneralTypeWord(id:number){
            let gConfig = C.GeneralConfig[id];
            let word = "";
            if(gConfig.armyType == 1){
                word = "(刀兵";
            }
            if(gConfig.armyType == 2){
                word = "(骑兵";
            }
            if(gConfig.armyType == 3){
                word = "(弓兵";
            }
            if(gConfig.armyType == 4){
                word = "(枪兵";
            }
            if(gConfig.armyType == 20){
                word = "(投石车";
            }
            if(gConfig.armyType == 21){
                word = "(弩车";
            }
            if(gConfig.armyType == 22){
                word = "(帐篷";
            }
            return L.getInstance().getLanguage(gConfig.name) + word;
        }

		protected childrenCreated(): void {
			super.childrenCreated();
            this.g_sourceArr = [];
            this.g_sourceArr.push({type:"空",code: 0});
            for(let i in C.GeneralConfig){
                let obj = {
                    type: i + this.getGeneralTypeWord(Number(i)),
                    code: i
                }
                this.g_sourceArr.push(obj);
            }

			this.wujiang_dropListView.setArrayCollection(this.g_sourceArr);
			this.wujiang_dropListView.setItemTapCallback((index) => {
				debug("select : " + index);
                let code = this.g_sourceArr[index].code;
                this.refreshGeneralInfo(code);
			}, this);

			this.dx_sourceArr = [];
            for(let i in C.TerrainConfig){
                let mapConfig = C.TerrainConfig[i];
                let obj = {
                    type: i + " " + mapConfig.name,
                    code: i
                }
                this.dx_sourceArr.push(obj);
            }

			this.dixing_dropListView.setArrayCollection(this.dx_sourceArr);
			this.dixing_dropListView.setItemTapCallback((index) => {
				let terrainId = index + 1;
				this.dataObj.terrainId = terrainId;
			}, this);
            this.refreshAllInfo();
            this.addEvent();

            let str = LocalData.getData("GM_WAR_CONFIG","");
            if(str != ""){
                this.parseConfig(str);
            }
		}

        //刷新界面信息.
        public refreshAllInfo(){
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

            for(let info of this.dataObj.att.heroUnit){
                let gid = info.baseId;
                this["atkPos" + info.heroPosition].getChildAt(1).text = this.getGeneralTypeWord(gid);
            }

            for(let info of this.dataObj.def.heroUnit){
                let gid = info.baseId;
                this["defPos" + info.heroPosition].getChildAt(1).text = this.getGeneralTypeWord(gid);
            }
        }

        public parseConfig(str){
            let obj = JSON.parse(str);
            this.dataObj = new gameProto.C2S_GM_WAR(obj);
            this.dataObj.att = new gameProto.TeamUnit(obj.att);
            this.dataObj.att.id = 1;
            this.dataObj.def = new gameProto.TeamUnit(obj.def);
            this.dataObj.def.id = 2;

            for(let general of this.dataObj.att.heroUnit){
                general.id = Number(general.id);

                for(let info of general.attribute){
                    info.value =Number(info.value);
                }
                if(!general.passiveSkill){
                    general.passiveSkill = [];
                }
                for(let info of general.passiveSkill){
                    info.value = Number(info.value);
                }
            }
            for(let general of this.dataObj.def.heroUnit){
                general.id = Number(general.id);

                for(let info of general.attribute){
                    info.value =Number(info.value);
                }
                if(!general.passiveSkill){
                    general.passiveSkill = [];
                }
                for(let info of general.passiveSkill){
                    info.value = Number(info.value);
                }
            }
            console.log(this.dataObj);
            // this.dataObj = obj;
            this.refreshAllInfo();
        }

        public addEvent(){

            /**是否不生成小兵 true不生成小兵 */
            this.m_onlyGeneralCherkBox.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                this.dataObj.isNotSoldier = evt.target.selected;
            }, this);

            /**是否只生成一个小兵 */
            this.m_oneSoldierCherkBox.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                this.dataObj.isSingleSoldier = evt.target.selected;
            }, this);

            /**敌方是否自动技能 */
            this.m_enemySkillCherkBox.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                this.dataObj.isDefendAuto = evt.target.selected;
            }, this);

            /**强制技能暂停 */
            this.m_skillStopCherkBox.addEventListener(eui.UIEvent.CHANGE, (evt: eui.UIEvent) => {
                this.dataObj.isSkillStop = evt.target.selected;
            }, this);

            for(let i = 1; i <= 6; i++){
                com_main.EventManager.addTouchTapListener(this["atkPos" + i], this, this.onclickTeamBtn);
                com_main.EventManager.addTouchTapListener(this["defPos" + i], this, this.onclickTeamBtn);
            }

            com_main.EventManager.addTouchScaleListener(this.saveGeneral, this, this.onclickSaveGeneral);

            
            com_main.EventManager.addTouchScaleListener(this.startBattle, this, () => {
				BattleProxy.send_C2S_GM_WAR(this.dataObj);
			});

            com_main.EventManager.addTouchScaleListener(this.closeBtn, this, () => {
                com_main.UpManager.close();
			});

            //导出数据
            com_main.EventManager.addTouchScaleListener(this.outputBtn, this, () => {
                console.log("导出数据~~~~~~~~~~~~~~~~~~~~~~");
                let str = JSON.stringify(this.dataObj);
                console.log(str);
                console.log("导出数据~~~~~~~~~~~~~~~~~~~~~~end");
			});
            //导入数据
            com_main.EventManager.addTouchScaleListener(this.inputBtn, this, () => {
                let str = this.inputText.text;
                this.parseConfig(str);
			});
            /**保存录像 */
            com_main.EventManager.addTouchScaleListener(this.saveVideoBtn, this, () => {
                BattleVideoUtil.saveAsFile();
            });

            /**读取录像 */
            com_main.EventManager.addTouchScaleListener(this.runVideoBtn, this, () => {
                BattleVideoUtil.load();
            });

            /**清理录像缓存 */
            com_main.EventManager.addTouchScaleListener(this.clearnVideo, this, () => {
                BattleVideoUtil.BattleProxyList = [];
            });
            
            
        }

        public onDestroy() {
			EventManager.removeEventListeners(this);
            TestWarview.warData = this.dataObj;
		}

        public onclickTeamBtn(e: egret.Event){
            let name = e.target.parent.name;
            console.log(name);
            this.selectGeneral = name;
            this.lightBtn();
            let [i,info] = this.getGeneralData();
            if(info){
                this.refreshGeneralInfo(info.baseId);
            }
            // else{
            //     this.refreshGeneralInfo(0);
            // }
            
        }

        public lightBtn(){
            for(let i = 1; i <= 6; i++){
                this["atkPos" + i].getChildAt(0).source = "btn_001_up_png";
                this["defPos" + i].getChildAt(0).source = "btn_001_up_png";
            }
            let heroPosition = Number(this.selectGeneral.slice(-1));
            let team = this.selectGeneral.slice(0,3);
            if(team == "atk"){
                this["atkPos" + heroPosition].getChildAt(0).source = "btn_006_up_png";
            }else if (team == "def") {
                this["defPos" + heroPosition].getChildAt(0).source = "btn_006_up_png";
            }
        }

        public onclickSaveGeneral(){
            if(this.selectGeneral == ""){
                return;
            }
            let config = this.curGeneralConfig;
            let team = this.selectGeneral.slice(0,3);
            let pos = Number(this.selectGeneral.slice(-1))
            if(!config){
                //数据清空
                /**保存武将数据 */
                let [index,info] = this.getGeneralData();
                if(team == "atk"){
                    this["atkPos" + pos].getChildAt(1).text = "";
                    if(index != null || index != undefined){
                        this.dataObj.att.heroUnit.splice(index, 1);
                    }
                }else if (team == "def") {
                    this["defPos" + pos].getChildAt(1).text = "";
                    if(index != null || index != undefined){
                        this.dataObj.def.heroUnit.splice(index, 1);
                    }
                }
                console.log(this.dataObj);

                let str = JSON.stringify(this.dataObj);
                LocalData.setData("GM_WAR_CONFIG",str);
                return;
            }

            let gDate = new gameProto.HeroUnit();
            gDate.heroPosition = pos;
            gDate.heroMaxTroops = Number(this.attr_edit_10.text);
            gDate.heroTroops = Number(this.attr_edit_10.text);
            gDate.baseId = config.id;
            // gDate.anager = 50;
            gDate.soldierType = config.armyType;		//带兵类型
            gDate.anager = Number(this.attr_edit_9.text);
            
            let attriList = StringUtils.keyValsToNumber(config.attribute);
            for(let i in attriList){
                let keyValue = new gameProto.SysKeyValue();
                keyValue.key = Number(i);
                keyValue.value = attriList[i];
                gDate.attribute.push(keyValue);
            }


            for(let i of this.attr_define){
                let value = Number(this["attr_edit_" + i].text);
                this.resetValue(gDate.attribute,i,value);
            }

            //被动技能
            for(let i = 1; i <= 3; i++){
                let obj = this["m_passiveCheckBox" + i];
                if(obj.selected){
                    let keyValue = new gameProto.SysKeyValue();
                    keyValue.key = Number(obj.name);
                    keyValue.value = 1;
                    gDate.passiveSkill.push(keyValue);
                }
            }

            
            if(team == "atk"){
                gDate.id = gDate.heroPosition;
                this["atkPos" + gDate.heroPosition].getChildAt(1).text = L.getInstance().getLanguage(config.name);

                /**保存武将数据 */
                let [index,info] = this.getGeneralData();
                if(index != null || index != undefined){
                    this.dataObj.att.heroUnit[index]= gDate;
                }else{
                    this.dataObj.att.heroUnit.push(gDate);
                }
            }else if (team == "def") {
                gDate.id = gDate.heroPosition + 5;
                this["defPos" + gDate.heroPosition].getChildAt(1).text = L.getInstance().getLanguage(config.name);

                /**保存武将数据 */
                let [index,info] = this.getGeneralData();
                if(index != null || index != undefined){
                    this.dataObj.def.heroUnit[index]= gDate;
                }else{
                    this.dataObj.def.heroUnit.push(gDate);
                }
            }
            
            // console.log(this.dataObj);
            let str = JSON.stringify(this.dataObj);
            LocalData.setData("GM_WAR_CONFIG",str);
            // console.log('LocalData',str);
        }

        public getGeneralData(): [number,gameProto.IHeroUnit]{
            if(this.selectGeneral == ""){
                return [null,null];
            }
            
            let team = this.selectGeneral.slice(0,3);
            let pos = Number(this.selectGeneral.slice(-1));
            let generalData = this.getTeamGeneralInfo(team,pos);
            return generalData;
        }

        public getTeamGeneralInfo(teamType,pos): [number,gameProto.IHeroUnit]{
            let list; 
            if(teamType == "atk"){
                list = this.dataObj.att.heroUnit;
            }else if (teamType == "def") {
                list = this.dataObj.def.heroUnit;
            }
            for(let i in list){
                let info = list[i];
                if(info.heroPosition == pos){
                    return [Number(i),info];
                }
            }
            return [null,null];
        }

        public refreshGeneralInfo(gId){
            for(let i in this.g_sourceArr){
                let source = this.g_sourceArr[i];
                if(source.code == gId){
                    this.wujiang_dropListView.showItem(Number(i));
                }
            }

            if(gId == 0){
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


                for(let i of this.attr_define){
                    this["attr_edit_" + i].text = "";
                }

                //被动技能1
                this.m_passiveCheckBox1.selected = false;
                this.m_passiveCheckBox2.selected = false;
                this.m_passiveCheckBox3.selected = false;

                this.curGeneralConfig = null;
                return ;
            }

            let gConfig = C.GeneralConfig[gId];
            this.curGeneralConfig = gConfig;
            /**武将名字 */
            this.generalLb.text = L.getInstance().getLanguage(gConfig.name);
            
            let skillIdList = this.getSkillIdList(gConfig);
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

            let attriList = StringUtils.keyValsToNumber(gConfig.attribute);
            let [index,info] = this.getGeneralData()
            if(index != null || index != undefined){
                for(let i of this.attr_define){
                    this["attr_edit_" + i].text = this.getValueBykey(info.attribute,i) + "";
                }

                //被动技能1
                // this.m_passiveCheckBox1.selected = false;
                // this.m_passiveCheckBox2.selected = false;
                // this.m_passiveCheckBox3.selected = false;

                for(let i = 1; i <= 3; i++){
                    let obj = this["m_passiveCheckBox" + i];
                    let key = Number(obj.name);
                    let value = this.getValueBykey(info.passiveSkill,key);
                    if(value){
                        obj.selected = true;
                    }else{
                        obj.selected = false;
                    }
                }

            }else{
                for(let i of this.attr_define){
                    this["attr_edit_" + i].text = attriList[i] + "";
                }

                //被动技能1
                this.m_passiveCheckBox1.selected = false;
                this.m_passiveCheckBox2.selected = false;
                this.m_passiveCheckBox3.selected = false;
            }

            
        }

        public getValueBykey(list:gameProto.ISysKeyValue[],key){
            for(let i in list){
                let keyValue = list[i];
                if(keyValue.key == key){
                    return keyValue.value;
                }
            }
        }

        public resetValue(list:gameProto.ISysKeyValue[],key:number, value:number){
            for(let i in list){
                let keyValue = list[i];
                if(keyValue.key == key){
                    keyValue.value = value;
                }
            }
        }
        
        /**获得技能列表id */
        public getSkillIdList(config): Array<number> {
            let skills = [];
            //怒气技能
            let cfg = config;
            skills.push(this.parseSkillJson(cfg.angerSkill));
            let skillparam = cfg.passiveSkill
            let arr = skillparam.split(',');
            for (let i = 0; i < arr.length; i++) {
                skills.push(this.parseSkillJson(arr[i]));
            }
            return skills;
        }

        private parseSkillJson(str: string) {
            let skills = str.split('_');
            return Number(skills[0])
        }


	}
}