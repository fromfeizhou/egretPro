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
    var ResLayer = /** @class */ (function (_super_1) {
        __extends(ResLayer, _super_1);
        function ResLayer(w, h) {
            var _this = _super_1.call(this) || this;
            _this.m_nResSelect = '';
            _this.name = ResLayer.NAME;
            _this.width = w;
            _this.height = h;
            return _this;
        }
        ResLayer.prototype.onDestroy = function () {
            // Utils.removeAllChild(this);
        };
        ResLayer.prototype.getRes = function (ty, iid) {
            if (SceneManager.getCurrScene() == SceneEnums.WORLD_XIANGYANG_CITY) {
                var conf = C.WorldMapConfig[iid];
                if (conf && conf.mapId != SceneEnums.WORLD_XIANGYANG_CITY) {
                    iid = conf.mapCity;
                }
            }
            var obj = this.getChildByName(ty + "_" + iid);
            if (!obj)
                return;
            return obj;
        };
        /**
         * 初始化建筑
         * @param  {()=>void} cb
         * @param  {any} target
         * @returns void
         */
        ResLayer.prototype.initBuilds = function () {
            var data = WorldMapModel.getCityBuildInfos();
            for (var id in C.WorldMapConfig) {
                var info = data[id];
                var conf = C.WorldMapConfig[id];
                if (conf.mapId == SceneManager.getCurrScene()) {
                    var build = com_main.CitySprite.create(conf);
                    Utils.addChild(this, build);
                    build.isGlow(false);
                    com_main.WorldView.addTileObject(build);
                }
                // build.updateHeroNum(TeamModel.getTeamVoListByCityId(conf.id).length);
            }
        };
        ResLayer.prototype.initRes = function (lis) {
            if (SceneManager.getCurrScene() != SceneEnums.WORLD_CITY)
                return;
            lis = lis || WorldModel.eventList;
            for (var k in lis) {
                var vo = lis[k];
                debug("vo.cityId = ", vo.cityId, " vo.eventCoordinatesId ", vo.eventCoordinatesId, "  ", vo.pos);
                var res = this.getRes(com_main.ResType.RES, vo.eventCoordinatesId);
                if (res)
                    Utils.removeFromParent(res);
                var spr = com_main.WorldResSprite.create(vo);
                Utils.addChildAt(this, spr, 0);
                com_main.WorldView.addTileObject(spr);
            }
            WorldModel.isFromUnLockFight = false;
        };
        ResLayer.prototype.updateRefreshRes = function (data) {
            if (!SceneManager.isWorldScene())
                return;
            for (var i = 0; i < data.mapEventData.length; i++) {
                var info = data.mapEventData[i];
                info.eventCoordinatesId;
                var res = this.getRes(com_main.ResType.RES, info.eventCoordinatesId);
                if (res)
                    Utils.removeFromParent(res);
                var vo = WorldModel.eventList[info.eventCoordinatesId];
                if (vo) {
                    var spr = com_main.WorldResSprite.create(vo);
                    Utils.addChildAt(this, spr, 0);
                    com_main.WorldView.addTileObject(spr);
                }
            }
        };
        /**移除事件资源 */
        ResLayer.prototype.removeEvtRes = function (evtPosIs, isVistory) {
            if (isVistory === void 0) { isVistory = true; }
            var res = this.getRes(com_main.ResType.RES, evtPosIs);
            // if (res) Utils.removeFromParent(res);
            if (res)
                res.onEventFinish(evtPosIs, isVistory);
        };
        /**刷新资源 */
        ResLayer.prototype.updateEvtRes = function (evtPosIs) {
            var res = this.getRes(com_main.ResType.RES, evtPosIs);
            if (res)
                res.onEvent();
        };
        /**清理选中 */
        ResLayer.prototype.clearSelected = function () {
            // 清除选择
            if (this.m_nResSelect) {
                var _a = this.m_nResSelect.split('_'), n = _a[0], i = _a[1];
                var obj = this.getRes(n, Number(i));
                if (obj) {
                    obj.isGlow(false);
                }
                this.m_nResSelect = '';
            }
        };
        // public createResSprite(ty: number, x: number, y: number) {
        // 	let spr = WorldResSprite.create({id:40071, pid: 101});
        // 	Utils.addChildAt(this, spr, 0);
        // 	spr.x = x;
        // 	spr.y = y;
        // }
        /**
         * 点击事件
         * @param  {egret.TouchEvent}
         * @returns boolean
         */
        ResLayer.prototype.onTouch = function (e) {
            var _this = this;
            var ret = this.$children.some(function (o, i, _) {
                var obj = o;
                // if (obj instanceof CitySprite) {
                if (obj.checkTouchEvent && obj.checkTouchEvent(e.stageX, e.stageY)) {
                    _this.m_nResSelect = obj.name;
                    return true;
                    // }
                }
                return false;
            }, this);
            // if (ret) return true;
            // ret = this.$children.some((o, i, _) => {
            // 	let obj = <ResSprite>o, b = obj instanceof CitySprite;
            // 	if (!b) {
            // 		if (obj.checkTouchEvent(e.stageX, e.stageY)) {
            // 			this.m_nResSelect = obj.name;
            // 			return true;
            // 		}
            // 	}
            // 	return false;
            // }, this);
            return ret;
        };
        ResLayer.prototype.initAttackEvent = function (city_events, res_events) {
            for (var _i = 0, city_events_1 = city_events; _i < city_events_1.length; _i++) {
                var id = city_events_1[_i];
                var city = this.getRes(com_main.ResType.CITY, id);
                if (!city)
                    continue;
                city.setAttackEvent();
            }
            // for (let id of res_events) {
            // 	let res = this.getRes<WorldResSprite>(ResType.RES, id);
            // 	if (!res) continue;
            // 	res.setAttackEvent();
            // }
        };
        ResLayer.prototype.initAttack = function (atk) {
            for (var _i = 0, atk_1 = atk; _i < atk_1.length; _i++) {
                var id = atk_1[_i];
                var city = this.getRes(com_main.ResType.CITY, id);
                if (!city)
                    continue;
                city.setBattleEffect();
            }
        };
        ResLayer.NAME = "ResLayer";
        return ResLayer;
    }(egret.DisplayObjectContainer));
    com_main.ResLayer = ResLayer;
    // export class WorldEffectLayer extends egret.DisplayObjectContainer {
    // 	public static readonly NAME: string = "WorldEffectLayer";
    // 	public constructor(w: number, h: number) {
    // 		super();
    // 		this.name = WorldEffectLayer.NAME;
    // 		this.width = w;
    // 		this.height = h;
    // 	}
    // 	public onDestroy(): void {
    // 		Utils.removeAllChild(this);
    // 	}
    // 	public createResBattle(res: ItfResType, dir: CSquare_Direction) {
    // 		let conf = C.EventCoordinatesConfig[res.pid];
    // 		let effect = new WorldResFire(dir);
    // 		this.addChild(effect);
    // 		effect.x = conf.posX;
    // 		effect.y = conf.posY;
    // 	}
    // }
})(com_main || (com_main = {}));
