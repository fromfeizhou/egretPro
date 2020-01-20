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
    var TechnoTabView = /** @class */ (function (_super_1) {
        __extends(TechnoTabView, _super_1);
        function TechnoTabView(type, width, height) {
            var _this = _super_1.call(this) || this;
            _this.name = TechnoTabView.NAME;
            _this.m_nType = type;
            _this.width = width;
            _this.height = height;
            _this.initApp("technology/TechnoTabViewSkin.exml");
            return _this;
        }
        TechnoTabView.prototype.listenerProtoNotifications = function () {
            return [];
        };
        /**处理协议号事件 */
        TechnoTabView.prototype.executes = function (notification) {
            var body = notification.getBody();
            var protocol = Number(notification.getName());
            switch (protocol) {
            }
        };
        TechnoTabView.prototype.$onRemoveFromStage = function (isclear) {
            if (isclear === void 0) { isclear = true; }
            this.onDestroy();
            _super_1.prototype.$onRemoveFromStage.call(this, isclear);
        };
        TechnoTabView.prototype.onDestroy = function () {
            _super_1.prototype.onDestroy.call(this);
        };
        TechnoTabView.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
        };
        TechnoTabView.prototype.onShow = function () {
            if (this.m_bInit)
                return;
            this.m_bInit = true;
            var posList = {};
            var list = TechnoModel.getTechVosByType(this.m_nType);
            var bgRoot = new eui.Group();
            this.m_pCellRoot.addChild(bgRoot);
            for (var i = 0; i < list.length; i++) {
                var vo = list[i];
                var cell = new com_main.TechnoCell(list[i].id);
                cell.openEvent();
                var gidPos = vo.gidPos;
                // 188 200
                cell.x = 144 + (gidPos.col - 1) * 188;
                cell.y = 90 + (gidPos.row - 1) * 125;
                posList[vo.id] = { x: cell.x, y: cell.y };
                this.m_pCellRoot.addChild(cell);
            }
            for (var i = 0; i < list.length; i++) {
                var vo = list[i];
                var lvCfg = TechnoModel.getTechnoLvCfg(vo.id, vo.level);
                if (!lvCfg)
                    return;
                var limit = StringUtils.keyValsToNumberArray(lvCfg.limitTechs);
                for (var k = 0; k < limit.length; k++) {
                    var data = limit[k];
                    if (data.value > 0) {
                        var start = posList[data.key];
                        var end = posList[vo.id];
                        this.createLine(bgRoot, start, end);
                    }
                }
            }
            bgRoot.cacheAsBitmap = true;
        };
        /**创建连线 */
        TechnoTabView.prototype.createLine = function (bgRoot, start, end) {
            var img = new eui.Image('icon_suolian_png');
            img.fillMode = egret.BitmapFillMode.REPEAT;
            var width = Utils.MathUtils.getPosDis(start, end);
            img.width = width;
            img.height = 10;
            img.rotation = Utils.MathUtils.getPosAngle(start, end);
            var pos = Utils.MathUtils.getMid2Pos(start, end);
            img.x = pos.x;
            img.y = pos.y;
            AnchorUtil.setAnchorCenter(img);
            bgRoot.addChild(img);
        };
        TechnoTabView.NAME = 'TechnoTabView';
        return TechnoTabView;
    }(com_main.CView));
    com_main.TechnoTabView = TechnoTabView;
})(com_main || (com_main = {}));
