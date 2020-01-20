/**
 * 对象的自定义属性
 * @author leowang
 *
 */
var Properties = /** @class */ (function () {
    function Properties(json) {
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                var element = json[key];
                this[key] = element;
            }
        }
    }
    Properties.create = function (json) {
        var obj = new Properties(json);
        return obj;
    };
    Properties.prototype.isNpcPoint = function () {
        return this.isNpcPoint;
    };
    Properties.prototype.setNpcPoint = function (isNpcPoint) {
        this._isNpcPoint = isNpcPoint;
    };
    Properties.prototype.getOrder = function () {
        return this.order;
    };
    Properties.prototype.setOrder = function (order) {
        this.order = order;
    };
    Properties.prototype.getAttachPoint = function () {
        return this.attachPoint;
    };
    Properties.prototype.setAttachPoint = function (attachPoint) {
        this.attachPoint = attachPoint;
    };
    Properties.prototype.getHpPercent = function () {
        return this.hp_percent;
    };
    Properties.prototype.setHpPercent = function (v) {
        this.hp_percent = v;
    };
    Properties.prototype.getImgStatus = function () {
        return this.img_status;
    };
    Properties.prototype.setImgStatus = function (v) {
        this.img_status = v;
    };
    Properties.prototype.getSource = function () {
        return this.Source;
    };
    Properties.prototype.setSource = function (v) {
        this.Source = v;
    };
    Properties.prototype.getSourceType = function () {
        return this.SourceType;
    };
    Properties.prototype.setSourceType = function (v) {
        this.SourceType = v;
    };
    return Properties;
}());
