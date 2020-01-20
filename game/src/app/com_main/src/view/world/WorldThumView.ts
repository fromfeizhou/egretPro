module com_main {

    /**
     * 小地图
     * @export
     * @class WorldThumView
     * @extends CView
     */
    export class WorldThumView extends CView {

        public static readonly NAME = "WorldThumView";

        private m_pMainBg: eui.Group;
        private m_pViewRoot: eui.Group;
        private m_pMain: WorldThumMap;
        private m_BtnBack: com_main.CImage;
        private m_pSelect1: com_main.CImage;
        private m_pSelect2: com_main.CImage;
        private m_pSelect3: com_main.CImage;
        private m_pBtnGo: eui.Group;
        private m_pPoint: eui.Label;
        private m_aList: number[] = [1, 1, 1];
        private m_aPoint: number[] = [0, 0];
        private m_nIid: number = 0;

        public constructor(data: any) {
            super();
            this.name = WorldThumView.NAME;
            if (data) {
                this.m_aPoint[0] = data.x ? data.x : 0;
                this.m_aPoint[1] = data.y ? data.y : 0;
            }

            this.initApp("world/world_thum_view.exml");
        }

        protected listenerProtoNotifications(): any[] {
            return [
                // ProtoDef.WORLD_UPDATE_HEOR_STATUS,
            ];
        }

        protected executes(notification: AGame.INotification) {
            let body = notification.getBody();
            let protocol: number = Number(notification.getName());
            // switch (protocol) {
            //     case ProtoDef.WORLD_UPDATE_HEOR_STATUS: {
            //         if (!body.cids) break;
            //         this.m_pMain.updateHeroNum(body.cids);
            //     }
            // }
        }

        public onDestroy(): void {

            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.m_nIid = WorldModel.capitalId;

            this.m_pMain = new WorldThumMap((x, y, n, id) => {
                this.m_pPoint.text = `${n}(${x}, ${y})`
                this.m_aPoint[0] = x;
                this.m_aPoint[1] = y;
                this.m_nIid = id;
            }, (e) => {
                return this.onTouched(e);
            });
            Utils.addChild(this.m_pMainBg, this.m_pMain);

            this.__update_city();


            SoundData.setSound(this.m_BtnBack, SoundData.SOUND_CANCEL);
            EventManager.addTouchScaleListener(this.m_BtnBack, this, () => {
                UpManager.history();
            })
            EventManager.addTouchScaleListener(this.m_pBtnGo, this, this._on_click);

            Utils.toStageBestScale(this.m_pViewRoot);
        }

        protected _on_click() {
            WorldView.callFunc(WORLD_FUNC.MOVE_TO, ResType.CITY, this.m_nIid);
            UpManager.history();
        }

        /**
         * 点击事件
         * @protected
         * @param  {egret.TouchEvent} e 
         * @return boolean 
         * @memberof WorldThumView
         */
        protected onTouched(e: egret.TouchEvent): boolean {
            let x = e.stageX, y = e.stageY;
            let indx = -1, obj;
            if (this.m_pSelect1.hitTestPoint(x, y)) {
                indx = 0;
                obj = this.m_pSelect1;
            }
            else if (this.m_pSelect2.hitTestPoint(x, y)) {
                obj = this.m_pSelect2;
                indx = 1;
            }
            else if (this.m_pSelect3.hitTestPoint(x, y)) {
                obj = this.m_pSelect3;
                indx = 2;
            }

            if (indx >= 0)
                this.__init_city(indx, obj);

            return indx >= 0;
        }

        /**
         * 根据城池类型显示
         * @private
         * @param  {number} ty 
         * @param  {com_main.CImage} obj 
         * @return void
         * @memberof WorldThumView
         */
        private __init_city(ty: number, obj: com_main.CImage) {
            let texture;
            if (this.m_aList[ty] == 1) {
                texture = RES.getRes("btn_031_up_png");
                this.m_aList[ty] = 0;
            } else {
                texture = RES.getRes("common_y_png");
                this.m_aList[ty] = 1;
            }
            obj.texture = texture;

            this.m_pMain.setCityStatus(ty);
        }

        /**
         * 更新城池数量
         * @private
         * @return void
         * @memberof WorldThumView
         */
        private __update_city() {
            let citys = WorldModel.getCityBuildInfos();
            let a = [0, 0, 0];
            for (let k in citys) {
                let conf = citys[k];
                if (conf.country > 3 || conf.country < 1) continue
                let i = conf.country - 1;
                a[i] += 1;
            }
            let i = 1;
            for (let n of a) {
                this[`m_pNum${i}`].text = `${n}`;
                i++;
            }
        }
    }

    /**
     * 主小地图层
     * @class WorldThumMap
     * @extends egret.DisplayObjectContainer
     */
    class WorldThumMap extends CComponent {

        private m_pMain: eui.Image;
        private m_pAreaWei: egret.Sprite;  //魏国
        private m_pAreaWu: egret.Sprite; //吴国
        private m_pAreaShu: egret.Sprite;    //蜀国
        private m_pPoint: egret.Bitmap;
        private m_pLine: eui.Image;

        private m_pTouchPoints: Object = { touchIds: [] };//储存touchid

        private m_aCapitalList: number[] = [] //都城列表
        private m_aPrefectureList: number[] = [] //郡城列表
        private m_aTown: number[] = [] //县城列表
        private m_aList: number[] = [1, 1, 1];


        private m_pCallBack: (x: number, y: number, n: string, id: number) => void;
        private m_pTouchCallBack: (e) => boolean;

        public constructor(cb: (x: number, y: number, n: string, id: number) => void, tcb: (e) => boolean) {
            super();
            this.m_pCallBack = cb;
            this.m_pTouchCallBack = tcb;
        }

        $onRemoveFromStage(isclear = true): void {
            super.$onRemoveFromStage(isclear);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);
        }

        protected createChildren(): void {
            super.createChildren();

            this.m_pMain = new eui.Image('bg_map_slt_jpg');
            Utils.addChild(this, this.m_pMain);
            this.m_pMain.touchEnabled = false;

            this.m_pAreaWei = new egret.Sprite();
            Utils.addChild(this, this.m_pAreaWei);
            this.m_pAreaWei.touchEnabled = false;
            this.m_pAreaWei.touchChildren = false;

            this.m_pAreaShu = new egret.Sprite();
            Utils.addChild(this, this.m_pAreaShu);
            this.m_pAreaShu.touchEnabled = false;
            this.m_pAreaShu.touchChildren = false;

            this.m_pAreaWu = new egret.Sprite();
            Utils.addChild(this, this.m_pAreaWu);
            this.m_pAreaWu.touchEnabled = false;
            this.m_pAreaWu.touchChildren = false;

            this.m_pLine = new eui.Image('world_line_png');
            this.m_pLine.x = 265;
            this.m_pLine.y = 92;
            Utils.addChild(this, this.m_pLine);
            this.m_pLine.touchEnabled = false;


            this.m_pPoint = new egret.Bitmap();

            RES.getResAsync('icon_map_location_png', (texture, v) => {
                if (!this.m_pPoint) return;
                this.m_pPoint.texture = texture;
                this.m_pPoint.touchEnabled = true;
            }, this)

            // this.m_pPoint.texture = RES.getRes("icon_map_location_png");
            // this.m_pPoint.touchEnabled = true;




            let m_aType: string[] = ['dc', 'dc', 'dc', 'jc', 'xc'];

            // let cids = WorldModel.getCAttackToCids()
            //     , allHeroNum = FormunitModel.getFormunitCity();

            let areaOwn: { [k: number]: number[] } = {
                [CountryType.SHU]: [],
                [CountryType.WEI]: [],
                [CountryType.WU]: [],
            }
            for (let k in C.WorldMapConfig) {
                let conf = C.WorldMapConfig[k];
                if (conf.mapId != SceneEnums.WORLD_CITY) continue;
                let vconf = WorldModel.getCityBuildInfo(conf.id);
                let name = `${m_aType[conf.level]}1`
                let ico = new WorldThumIco(conf.id, name);
                AnchorUtil.setAnchorCenter(ico)
                Utils.addChild(this, ico);
                ico.x = Number(conf.ThumbnailX + 14);
                ico.y = Number(conf.ThumbnailY + 14);
                if (conf.level == 3)
                    this.m_aPrefectureList.push(conf.id);
                else if (conf.level == 4)
                    this.m_aTown.push(conf.id);
                else
                    this.m_aCapitalList.push(conf.id);

                if (conf.id == WorldModel.capitalId) {
                    this._set_point(ico.x, ico.y, ico.cityname, conf.id);
                }

                // if (cids.indexOf(conf.id) != -1) {
                //     ico.isAttack();
                // }

                // ico.updateHeroNum(allHeroNum[conf.id]);
                switch (vconf.country) {
                    case CountryType.SHU:
                    case CountryType.WEI:
                    case CountryType.WU: {
                        areaOwn[vconf.country].push(vconf.id)
                        break;
                    }
                }
            }

            this.__rush_area_city(areaOwn);
            Utils.addChild(this, this.m_pPoint);

            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);
        }

        /**添加区块 */
        private __rush_area_city(areaOwn: { [k: number]: number[] }) {
            this.__draw_area(this.m_pAreaWu, areaOwn[CountryType.WU], CountryType.WU);
            this.__draw_area(this.m_pAreaWei, areaOwn[CountryType.WEI], CountryType.WEI);
            this.__draw_area(this.m_pAreaShu, areaOwn[CountryType.SHU], CountryType.SHU);
        }
        /**画区域 */
        private __draw_area(parent: egret.Sprite, cityArr: number[], type: CountryType) {
            let container = new egret.Sprite();
            for (let i = 0; i < cityArr.length; i++) {
                let id = cityArr[i];
                let cfg = C.WorldMapConfig[id];
                let texture = RES.getRes(`min_area${id}_png`);
                let areaNode: egret.Bitmap = new egret.Bitmap(texture);
                areaNode.x = cfg.influenceX;
                areaNode.y = cfg.influenceY;
                container.addChild(areaNode);

            }

            let renderTexture: egret.RenderTexture = new egret.RenderTexture();
            renderTexture.drawToTexture(container);
            container = null;

            let colorMatrix;
            switch (type) {
                case CountryType.WEI: {
                    colorMatrix = [
                        0, 0, 0, 0, 117,
                        0, 0, 0, 0, 148,
                        0, 0, 0, 0, 255,
                        1, 1, 1, 1, 0
                    ];
                    break;
                }
                case CountryType.SHU: {
                    colorMatrix = [
                        0, 0, 0, 0, 85,
                        0, 0, 0, 0, 238,
                        0, 0, 0, 0, 93,
                        1, 1, 1, 1, 0
                    ];
                    break;
                }
                case CountryType.WU: {
                    colorMatrix = [
                        0, 0, 0, 0, 255,
                        0, 0, 0, 0, 69,
                        0, 0, 0, 0, 69,
                        1, 1, 1, 1, 0
                    ];
                    break;
                }
            }


            let img = new eui.Image(renderTexture);
            img.filters = [new egret.ColorMatrixFilter(colorMatrix), new egret.GlowFilter(0x1d1815, 1, 3, 3, 10, egret.BitmapFilterQuality.LOW, false, false)];
            parent.addChild(img);
            parent.alpha = 0.5;
            parent.cacheAsBitmap = true;
        }



        /**
         * 设置坐标
         * @protected
         * @param  {number} x x坐标
         * @param  {number} y y坐标
         * @param  {string} n 城池名称
         * @param  {number} id 城池id
         * @return void
         * @memberof WorldThumMap
         */
        protected _set_point(x: number, y: number, n: string, id: number) {
            this.m_pPoint.x = x - 17.5;
            this.m_pPoint.y = y - 52;
            if (this.m_pCallBack)
                this.m_pCallBack(x, y, n, id)
        }


        protected onTouchBegan(e: egret.TouchEvent) {
            let id = 0, x = 0, y = 0, n = '';
            for (let o of this.$children) {
                if (o instanceof WorldThumIco) {
                    if (o.isHitPoint(e.stageX, e.stageY)) {
                        id = o.iid;
                        x = o.x;
                        y = o.y;
                        n = o.cityname;
                        break;
                    }
                }
            }

            if (id > 0) {
                this._set_point(x, y, n, id);
            }

            let isTouch = this.onTouched(e);
            if (isTouch) return;
        }

        protected onTouched(e: egret.TouchEvent) {
            let ret = false;
            if (this.m_pTouchCallBack && this.m_pTouchCallBack(e))
                ret = true;
            return ret;
        }

        /**
         * 检查是否越界
         */
        private __check_move_out(e: egret.TouchEvent) {
            let x = e.stageX;
            let y = e.stageY;

            let stage = this.stage;

            if (x < 0 || x > stage.stageWidth || y < 0 || y > stage.stageHeight)
                return true;
            return false;
        }

        /**
         * 获取当前2个手指距离
         */
        private __get_touch_distance(): number {
            var tps = this.m_pTouchPoints;
            var _distance: number = 0;
            var names = tps["touchIds"];
            _distance = egret.Point.distance(tps[names[names.length - 1]], tps[names[names.length - 2]]);
            return _distance;
        }

        /**
         * 设置城池显示
         * @param  {number} ty 
         * @return void
         * @memberof WorldThumMap
         */
        public setCityStatus(ty: number) {
            let status = this.m_aList[ty], lis;
            if (ty == 2)
                lis = this.m_aTown;
            else if (ty == 1)
                lis = this.m_aPrefectureList;
            else
                lis = this.m_aCapitalList;

            this.m_aList[ty] = status == 1 ? 0 : 1;
            let b = this.m_aList[ty] == 1;
            for (let id of lis) {
                let obj = this.getChildByName(`city_${id}`)
                if (!obj) continue
                obj.visible = b;
            }
        }

        public updateHeroNum(cids: number[]): void {
            // const allHeroNum = FormunitModel.getFormunitCity();
            // for (let id of cids) {
            //     let res: WorldThumIco = <WorldThumIco>this.getChildByName(`city_${id}`);
            //     if (res)
            //         res.updateHeroNum(allHeroNum[id]);
            // }
        }
    }

    /**
     * 城池图标
     * @class WorldThumIco
     * @extends CComponent
     */
    class WorldThumIco extends CComponent {

        private m_pMain: eui.Image;
        private m_pName: eui.Label;
        private m_nIid: number;
        private m_sName: string;
        private m_pAttack: MCDragonBones;
        private m_pHeroNum: WorldNumWidget;

        public get iid() {
            return this.m_nIid;
        }

        public get cityname() {
            return this.m_pName.text;
        }

        public constructor(id: number, name: string) {
            super();
            this.m_nIid = id;
            this.m_sName = name;
            this.name = `city_${id}`

            this.skinName = Utils.getSkinName("app/world/world_thum_ico.exml");
            this.once(egret.Event.REMOVED_FROM_STAGE, this.onDestroy, this);
        }

        public onDestroy() {
            if (this.m_pAttack) {
                this.m_pAttack.destroy();
                this.m_pAttack = null;
            }
            super.onDestroy();
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            let conf = C.WorldMapConfig[this.m_nIid];
            this.m_pName.text = GLan(conf.name);

            this.m_pMain.texture = RES.getRes(`icon_map_${this.m_sName}_png`);
        }

        public isHitPoint(x: number, y: number) {
            return this.visible && this.hitTestPoint(x, y);
        }

        /**
         * 攻击特效
         * @param  {boolean} [attack=true] 
         * @return void
         * @memberof WorldThumIco
         */
        public isAttack(attack: boolean = true) {
            if (attack) {
                if (!this.m_pAttack) {
                    this.m_pAttack = new MCDragonBones();
                    let name = IETypes.EWORLD_Point;
                    this.m_pAttack.initAsync(name);
                    this.addChild(this.m_pAttack)
                    this.m_pAttack.x = 30;
                    this.m_pAttack.y = 30;
                    this.m_pAttack.play(name, 0);
                }
            } else {
                if (this.m_pAttack) {
                    this.m_pAttack.destroy();
                    this.m_pAttack = null;
                }
            }
        }

        private __add_hero_num(num: number) {
            this.m_pHeroNum = new WorldNumWidget(num);
            NodeUtils.addPosAndScale(this, this.m_pHeroNum, -5, this.height / 2 - 10, 0.4);
        }

        public updateHeroNum(num: number) {
            if (num == undefined || num == 0) {
                if (this.m_pHeroNum)
                    Utils.removeFromParent(this.m_pHeroNum);
                return;
            }

            // if (num <= -1) {
            //     num = WorldModel.getHeroNum(this.m_nIid);
            // }

            if (!this.m_pHeroNum)
                this.__add_hero_num(num);
            else
                this.m_pHeroNum.update(num);
        }
    }

}