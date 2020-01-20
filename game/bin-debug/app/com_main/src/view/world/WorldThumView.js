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
     * 小地图
     * @export
     * @class WorldThumView
     * @extends CView
     */
    var WorldThumView = /** @class */ (function (_super_1) {
        __extends(WorldThumView, _super_1);
        function WorldThumView(data) {
            var _this = _super_1.call(this) || this;
            _this.m_aList = [1, 1, 1];
            _this.m_aPoint = [0, 0];
            _this.m_nIid = 0;
            _this.name = WorldThumView.NAME;
            if (data) {
                _this.m_aPoint[0] = data.x ? data.x : 0;
                _this.m_aPoint[1] = data.y ? data.y : 0;
            }
            _this.initApp("world/world_thum_view.exml");
            return _this;
        }
        WorldThumView.prototype.listenerProtoNotifications = function () {
            return [
            // ProtoDef.WORLD_UPDATE_HEOR_STATUS,
            ];
        };
        WorldThumView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            // switch (protocol) {
            //     case ProtoDef.WORLD_UPDATE_HEOR_STATUS: {
            //         if (!body.cids) break;
            //         this.m_pMain.updateHeroNum(body.cids);
            //     }
            // }
        };
        WorldThumView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        WorldThumView.prototype.childrenCreated = function () {
            var _this = this;
            _super_1.prototype.childrenCreated.call(this);
            this.m_nIid = WorldModel.capitalId;
            this.m_pMain = new WorldThumMap(function (x, y, n, id) {
                _this.m_pPoint.text = n + "(" + x + ", " + y + ")";
                _this.m_aPoint[0] = x;
                _this.m_aPoint[1] = y;
                _this.m_nIid = id;
            }, function (e) {
                return _this.onTouched(e);
            });
            Utils.addChild(this.m_pMainBg, this.m_pMain);
            this.__update_city();
            SoundData.setSound(this.m_BtnBack, SoundData.SOUND_CANCEL);
            com_main.EventManager.addTouchScaleListener(this.m_BtnBack, this, function () {
                com_main.UpManager.history();
            });
            com_main.EventManager.addTouchScaleListener(this.m_pBtnGo, this, this._on_click);
            Utils.toStageBestScale(this.m_pViewRoot);
        };
        WorldThumView.prototype._on_click = function () {
            com_main.WorldView.callFunc(7 /* MOVE_TO */, com_main.ResType.CITY, this.m_nIid);
            com_main.UpManager.history();
        };
        /**
         * 点击事件
         * @protected
         * @param  {egret.TouchEvent} e
         * @return boolean
         * @memberof WorldThumView
         */
        WorldThumView.prototype.onTouched = function (e) {
            var x = e.stageX, y = e.stageY;
            var indx = -1, obj;
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
        };
        /**
         * 根据城池类型显示
         * @private
         * @param  {number} ty
         * @param  {com_main.CImage} obj
         * @return void
         * @memberof WorldThumView
         */
        WorldThumView.prototype.__init_city = function (ty, obj) {
            var texture;
            if (this.m_aList[ty] == 1) {
                texture = RES.getRes("btn_031_up_png");
                this.m_aList[ty] = 0;
            }
            else {
                texture = RES.getRes("common_y_png");
                this.m_aList[ty] = 1;
            }
            obj.texture = texture;
            this.m_pMain.setCityStatus(ty);
        };
        /**
         * 更新城池数量
         * @private
         * @return void
         * @memberof WorldThumView
         */
        WorldThumView.prototype.__update_city = function () {
            var citys = WorldModel.getCityBuildInfos();
            var a = [0, 0, 0];
            for (var k in citys) {
                var conf = citys[k];
                if (conf.country > 3 || conf.country < 1)
                    continue;
                var i_1 = conf.country - 1;
                a[i_1] += 1;
            }
            var i = 1;
            for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
                var n = a_1[_i];
                this["m_pNum" + i].text = "" + n;
                i++;
            }
        };
        WorldThumView.NAME = "WorldThumView";
        return WorldThumView;
    }(com_main.CView));
    com_main.WorldThumView = WorldThumView;
    /**
     * 主小地图层
     * @class WorldThumMap
     * @extends egret.DisplayObjectContainer
     */
    var WorldThumMap = /** @class */ (function (_super_1) {
        __extends(WorldThumMap, _super_1);
        function WorldThumMap(cb, tcb) {
            var _this = _super_1.call(this) || this;
            _this.m_pTouchPoints = { touchIds: [] }; //储存touchid
            _this.m_aCapitalList = []; //都城列表
            _this.m_aPrefectureList = []; //郡城列表
            _this.m_aTown = []; //县城列表
            _this.m_aList = [1, 1, 1];
            _this.m_pCallBack = cb;
            _this.m_pTouchCallBack = tcb;
            return _this;
        }
        WorldThumMap.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);
        };
        WorldThumMap.prototype.createChildren = function () {
            var _a;
            var _this = this;
            _super_1.prototype.createChildren.call(this);
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
            RES.getResAsync('icon_map_location_png', function (texture, v) {
                if (!_this.m_pPoint)
                    return;
                _this.m_pPoint.texture = texture;
                _this.m_pPoint.touchEnabled = true;
            }, this);
            // this.m_pPoint.texture = RES.getRes("icon_map_location_png");
            // this.m_pPoint.touchEnabled = true;
            var m_aType = ['dc', 'dc', 'dc', 'jc', 'xc'];
            // let cids = WorldModel.getCAttackToCids()
            //     , allHeroNum = FormunitModel.getFormunitCity();
            var areaOwn = (_a = {},
                _a[CountryType.SHU] = [],
                _a[CountryType.WEI] = [],
                _a[CountryType.WU] = [],
                _a);
            for (var k in C.WorldMapConfig) {
                var conf = C.WorldMapConfig[k];
                if (conf.mapId != SceneEnums.WORLD_CITY)
                    continue;
                var vconf = WorldModel.getCityBuildInfo(conf.id);
                var name_1 = m_aType[conf.level] + "1";
                var ico = new WorldThumIco(conf.id, name_1);
                AnchorUtil.setAnchorCenter(ico);
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
                        areaOwn[vconf.country].push(vconf.id);
                        break;
                    }
                }
            }
            this.__rush_area_city(areaOwn);
            Utils.addChild(this, this.m_pPoint);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegan, this);
        };
        /**添加区块 */
        WorldThumMap.prototype.__rush_area_city = function (areaOwn) {
            this.__draw_area(this.m_pAreaWu, areaOwn[CountryType.WU], CountryType.WU);
            this.__draw_area(this.m_pAreaWei, areaOwn[CountryType.WEI], CountryType.WEI);
            this.__draw_area(this.m_pAreaShu, areaOwn[CountryType.SHU], CountryType.SHU);
        };
        /**画区域 */
        WorldThumMap.prototype.__draw_area = function (parent, cityArr, type) {
            var container = new egret.Sprite();
            for (var i = 0; i < cityArr.length; i++) {
                var id = cityArr[i];
                var cfg = C.WorldMapConfig[id];
                var texture = RES.getRes("min_area" + id + "_png");
                var areaNode = new egret.Bitmap(texture);
                areaNode.x = cfg.influenceX;
                areaNode.y = cfg.influenceY;
                container.addChild(areaNode);
            }
            var renderTexture = new egret.RenderTexture();
            renderTexture.drawToTexture(container);
            container = null;
            var colorMatrix;
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
            var img = new eui.Image(renderTexture);
            img.filters = [new egret.ColorMatrixFilter(colorMatrix), new egret.GlowFilter(0x1d1815, 1, 3, 3, 10, 1 /* LOW */, false, false)];
            parent.addChild(img);
            parent.alpha = 0.5;
            parent.cacheAsBitmap = true;
        };
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
        WorldThumMap.prototype._set_point = function (x, y, n, id) {
            this.m_pPoint.x = x - 17.5;
            this.m_pPoint.y = y - 52;
            if (this.m_pCallBack)
                this.m_pCallBack(x, y, n, id);
        };
        WorldThumMap.prototype.onTouchBegan = function (e) {
            var id = 0, x = 0, y = 0, n = '';
            for (var _i = 0, _a = this.$children; _i < _a.length; _i++) {
                var o = _a[_i];
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
            var isTouch = this.onTouched(e);
            if (isTouch)
                return;
        };
        WorldThumMap.prototype.onTouched = function (e) {
            var ret = false;
            if (this.m_pTouchCallBack && this.m_pTouchCallBack(e))
                ret = true;
            return ret;
        };
        /**
         * 检查是否越界
         */
        WorldThumMap.prototype.__check_move_out = function (e) {
            var x = e.stageX;
            var y = e.stageY;
            var stage = this.stage;
            if (x < 0 || x > stage.stageWidth || y < 0 || y > stage.stageHeight)
                return true;
            return false;
        };
        /**
         * 获取当前2个手指距离
         */
        WorldThumMap.prototype.__get_touch_distance = function () {
            var tps = this.m_pTouchPoints;
            var _distance = 0;
            var names = tps["touchIds"];
            _distance = egret.Point.distance(tps[names[names.length - 1]], tps[names[names.length - 2]]);
            return _distance;
        };
        /**
         * 设置城池显示
         * @param  {number} ty
         * @return void
         * @memberof WorldThumMap
         */
        WorldThumMap.prototype.setCityStatus = function (ty) {
            var status = this.m_aList[ty], lis;
            if (ty == 2)
                lis = this.m_aTown;
            else if (ty == 1)
                lis = this.m_aPrefectureList;
            else
                lis = this.m_aCapitalList;
            this.m_aList[ty] = status == 1 ? 0 : 1;
            var b = this.m_aList[ty] == 1;
            for (var _i = 0, lis_1 = lis; _i < lis_1.length; _i++) {
                var id = lis_1[_i];
                var obj = this.getChildByName("city_" + id);
                if (!obj)
                    continue;
                obj.visible = b;
            }
        };
        WorldThumMap.prototype.updateHeroNum = function (cids) {
            // const allHeroNum = FormunitModel.getFormunitCity();
            // for (let id of cids) {
            //     let res: WorldThumIco = <WorldThumIco>this.getChildByName(`city_${id}`);
            //     if (res)
            //         res.updateHeroNum(allHeroNum[id]);
            // }
        };
        return WorldThumMap;
    }(com_main.CComponent));
    /**
     * 城池图标
     * @class WorldThumIco
     * @extends CComponent
     */
    var WorldThumIco = /** @class */ (function (_super_1) {
        __extends(WorldThumIco, _super_1);
        function WorldThumIco(id, name) {
            var _this = _super_1.call(this) || this;
            _this.m_nIid = id;
            _this.m_sName = name;
            _this.name = "city_" + id;
            _this.skinName = Utils.getSkinName("app/world/world_thum_ico.exml");
            _this.once(egret.Event.REMOVED_FROM_STAGE, _this.onDestroy, _this);
            return _this;
        }
        Object.defineProperty(WorldThumIco.prototype, "iid", {
            get: function () {
                return this.m_nIid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorldThumIco.prototype, "cityname", {
            get: function () {
                return this.m_pName.text;
            },
            enumerable: true,
            configurable: true
        });
        WorldThumIco.prototype.onDestroy = function () {
            if (this.m_pAttack) {
                this.m_pAttack.destroy();
                this.m_pAttack = null;
            }
            _super_1.prototype.onDestroy.call(this);
        };
        WorldThumIco.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var conf = C.WorldMapConfig[this.m_nIid];
            this.m_pName.text = GLan(conf.name);
            this.m_pMain.texture = RES.getRes("icon_map_" + this.m_sName + "_png");
        };
        WorldThumIco.prototype.isHitPoint = function (x, y) {
            return this.visible && this.hitTestPoint(x, y);
        };
        /**
         * 攻击特效
         * @param  {boolean} [attack=true]
         * @return void
         * @memberof WorldThumIco
         */
        WorldThumIco.prototype.isAttack = function (attack) {
            if (attack === void 0) { attack = true; }
            if (attack) {
                if (!this.m_pAttack) {
                    this.m_pAttack = new MCDragonBones();
                    var name_2 = IETypes.EWORLD_Point;
                    this.m_pAttack.initAsync(name_2);
                    this.addChild(this.m_pAttack);
                    this.m_pAttack.x = 30;
                    this.m_pAttack.y = 30;
                    this.m_pAttack.play(name_2, 0);
                }
            }
            else {
                if (this.m_pAttack) {
                    this.m_pAttack.destroy();
                    this.m_pAttack = null;
                }
            }
        };
        WorldThumIco.prototype.__add_hero_num = function (num) {
            this.m_pHeroNum = new com_main.WorldNumWidget(num);
            NodeUtils.addPosAndScale(this, this.m_pHeroNum, -5, this.height / 2 - 10, 0.4);
        };
        WorldThumIco.prototype.updateHeroNum = function (num) {
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
        };
        return WorldThumIco;
    }(com_main.CComponent));
})(com_main || (com_main = {}));
