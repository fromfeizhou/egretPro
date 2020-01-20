/**
 * Created by leowang on 2016/12/20
 */
var Layer = /** @class */ (function () {
    function Layer(json) {
        /**
         * 对象信息
         */
        this.objects = [];
        /**
         * 按对象类型划分对象列表 ConcurrentHashMap<String, List<MapObject>>
         */
        this.typeObject = Dictionary.create();
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                var element = json[key];
                if (key == "objects") {
                    this.setObjects(element);
                }
                else {
                    this[key] = element;
                }
            }
        }
    }
    Layer.create = function (json) {
        var obj = new Layer(json);
        return obj;
    };
    Layer.prototype.getData = function () {
        return this.data;
    };
    Layer.prototype.setData = function (data) {
        this.data = data;
    };
    Layer.prototype.getHeight = function () {
        return this.height;
    };
    Layer.prototype.setHeight = function (height) {
        this.height = height;
    };
    Layer.prototype.getWidth = function () {
        return this.width;
    };
    Layer.prototype.setWidth = function (width) {
        this.width = width;
    };
    Layer.prototype.getName = function () {
        return this.name;
    };
    Layer.prototype.setName = function (name) {
        this.name = name;
    };
    Layer.prototype.getType = function () {
        return this.type;
    };
    Layer.prototype.setType = function (type) {
        this.type = type;
    };
    Layer.prototype.getImage = function () {
        return this.image;
    };
    Layer.prototype.setImage = function (image) {
        this.image = image;
    };
    Layer.prototype.getCells = function () {
        return this.cells;
    };
    Layer.prototype.setCells = function (cells) {
        this.cells = cells;
    };
    Layer.prototype.getObjects = function () {
        return this.objects;
    };
    Layer.prototype.setObjects = function (jsons) {
        var _this = this;
        jsons.forEach(function (value, index, array) {
            _this.objects.push(MapObject.create(value));
        });
        this.changeObject(this.objects);
    };
    Layer.prototype.getTypeObject = function () {
        return this.typeObject;
    };
    Layer.prototype.setTypeObject = function (typeObject) {
        this.typeObject = typeObject;
    };
    Layer.prototype.getTypeObjects = function (objectType) {
        return this.typeObject.get(objectType);
    };
    /**
     * 将列表另存为键值对
     * @param listObject
     */
    Layer.prototype.changeObject = function (listObject) {
        var _this = this;
        if (listObject == null || listObject.length <= 0) {
            return;
        }
        listObject.forEach(function (value, index, array) {
            var type = value.getType();
            if (!_this.typeObject.has(type)) {
                var list_1 = [];
                _this.typeObject.add(type, list_1);
            }
            var list = _this.typeObject.get(type);
            list.push(value);
        });
        // function compare(arg0: MapObject, arg1: MapObject) {
        // 	let order0: number = arg0.getProperties().getOrder();
        // 	let order1: number = arg1.getProperties().getOrder();
        // 	if (order0 > order1) {
        // 		return 1;
        // 	} else if (order0 == order1) {
        // 		return 0;
        // 	} else {
        // 		return -1;
        // 	}
        // }
        // this.typeObject.forEach((key: any, data: any) => {
        // 	data.sort(compare);
        // });
    };
    return Layer;
}());
