var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var HeadQuartersChapter = (function (_super) {
    __extends(HeadQuartersChapter, _super);
    function HeadQuartersChapter(path, index) {
        var _this = _super.call(this) || this;
        _this.index = 0;
        _this.skinName = path;
        _this.index = index;
        return _this;
    }
    HeadQuartersChapter.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        for (var i = 0; i < 12; i++) {
            Main.pointList[this.index].push(Math.round(this["Item" + i].x) + "#" + Math.round(this["Item" + i].y));
        }
        HeadQuartersChapter.alreadyLoadNum += 1;
        if (HeadQuartersChapter.alreadyLoadNum < Main.chapterNum) {
            return;
        }
        var str = "";
        for (var i = 1; i <= Main.chapterNum; i++) {
            for (var _i = 0, _a = Main.pointList[i]; _i < _a.length; _i++) {
                var k = _a[_i];
                str = str + k + "\n";
            }
        }
        console.log(str);
    };
    HeadQuartersChapter.alreadyLoadNum = 0;
    return HeadQuartersChapter;
}(eui.Component));
__reflect(HeadQuartersChapter.prototype, "HeadQuartersChapter");
//# sourceMappingURL=HeadQuartersChapter.js.map