var AStar4Node = /** @class */ (function () {
    function AStar4Node(key, x, y, parentNode) {
        this.key = key;
        this.x = x;
        this.y = y;
        this.parentNode = parentNode;
    }
    AStar4Node.prototype.equals = function (obj) {
        if (obj == null) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        if (obj instanceof AStar4Node) {
            if (obj == this) {
                return true;
            }
            var cell = obj;
            return this.x == cell.x && this.y == cell.y;
        }
        else {
            return false;
        }
    };
    // @Override
    AStar4Node.prototype.hashCode = function () {
        return this.key;
    };
    AStar4Node.prototype.getX = function () {
        return this.x;
    };
    AStar4Node.prototype.getY = function () {
        return this.y;
    };
    AStar4Node.prototype.getParentNode = function () {
        return this.parentNode;
    };
    AStar4Node.prototype.setParentNode = function (parentNode) {
        this.parentNode = parentNode;
    };
    AStar4Node.prototype.getG = function () {
        return this.g;
    };
    AStar4Node.prototype.setG = function (g) {
        this.g = g;
    };
    AStar4Node.prototype.getH = function () {
        return this.h;
    };
    AStar4Node.prototype.setH = function (h) {
        this.h = h;
    };
    AStar4Node.prototype.getF = function () {
        return this.f;
    };
    AStar4Node.prototype.setF = function (f) {
        this.f = f;
    };
    AStar4Node.prototype.toString = function () {
        return "(" + this.x + "," + this.y + "," + this.f + ")";
    };
    AStar4Node.prototype.getCellPoint = function () {
        return new egret.Point(this.x, this.y);
    };
    return AStar4Node;
}());
