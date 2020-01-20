/**
 * Created by leowang on 2016/12/20
 */
var MapObject = /** @class */ (function () {
    function MapObject(json) {
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                var element = json[key];
                if (key == "properties") {
                    this.setProperties(element);
                }
                else {
                    this[key] = element;
                }
            }
        }
    }
    MapObject.create = function (json) {
        var obj = new MapObject(json);
        return obj;
    };
    MapObject.prototype.getGid = function () {
        return this.gid;
    };
    MapObject.prototype.setGid = function (gid) {
        this.gid = gid;
    };
    MapObject.prototype.getHeight = function () {
        return this.height;
    };
    MapObject.prototype.setHeight = function (height) {
        this.height = height;
    };
    MapObject.prototype.getId = function () {
        return this.id;
    };
    MapObject.prototype.setId = function (id) {
        this.id = id;
    };
    MapObject.prototype.getName = function () {
        return this.name;
    };
    MapObject.prototype.setName = function (name) {
        this.name = name;
    };
    MapObject.prototype.getDefender = function () {
        return this.Defender;
    };
    MapObject.prototype.setDefender = function (defender) {
        this.Defender = defender;
    };
    MapObject.prototype.getWidth = function () {
        return this.width;
    };
    MapObject.prototype.setWidth = function (width) {
        this.width = width;
    };
    MapObject.prototype.getX = function () {
        return this.x;
    };
    MapObject.prototype.setX = function (x) {
        this.x = x;
    };
    MapObject.prototype.getY = function () {
        return this.y;
    };
    MapObject.prototype.setY = function (y) {
        this.y = y;
    };
    MapObject.prototype.getType = function () {
        return this.type;
    };
    MapObject.prototype.setType = function (type) {
        this.type = type;
    };
    MapObject.prototype.getProperties = function () {
        return this.properties;
    };
    MapObject.prototype.setProperties = function (json) {
        this.properties = Properties.create(json);
    };
    MapObject.prototype.tilePixelToPixel = function () {
        var point = ISOMap.getInstance().tilePixelToPixel(this.x, this.y);
        return egret.Point.create(point[0], point[1]);
    };
    MapObject.prototype.tilePixelToTile = function () {
        var cell = ISOMap.getInstance().tilePixelToTile(this.x, this.y);
        return egret.Point.create(cell[0], cell[1]);
    };
    MapObject.getBuildHPPercents = function (mapobj) {
        var properties = mapobj.getProperties();
        var hp_percent = properties.getHpPercent();
        var pers = [];
        if (hp_percent) {
            pers = Utils.ArrayUtils.charsToNums(hp_percent.split(","));
        }
        return pers;
    };
    MapObject.getBuildHPPercent = function (mapobj, perhp) {
        var pers = MapObject.getBuildHPPercents(mapobj);
        var val = 0;
        var ind = 0;
        for (var i = pers.length - 1; i >= 0; i--) {
            if (pers[i] < perhp)
                break;
            val = pers[i];
            ind = i;
        }
        return { index: ind, percentHp: val };
    };
    MapObject.getBuildHPPercentStatus = function (mapobj, ind) {
        var properties = mapobj.getProperties();
        var img_status = properties.getImgStatus();
        var imgs = img_status.split(",");
        return imgs[ind];
    };
    return MapObject;
}());
