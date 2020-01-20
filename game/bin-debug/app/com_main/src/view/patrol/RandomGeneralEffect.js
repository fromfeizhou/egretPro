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
//挂机界面动画
var com_main;
(function (com_main) {
    var RandomGeneralEffect = /** @class */ (function (_super_1) {
        __extends(RandomGeneralEffect, _super_1);
        function RandomGeneralEffect(data) {
            var _this = _super_1.call(this) || this;
            _this.m_data = data;
            return _this;
        }
        RandomGeneralEffect.prototype.childrenCreated = function () {
            _super_1.prototype.childrenCreated.call(this);
            var square = com_main.CSquare.createId(this.m_data.gId, false, true);
            square.test = true;
            this.square = square;
            this.addChild(this.square);
            this.initByGid(this.m_data);
            // this.m_data.playerInfo.countryId
            var headInfo = new com_main.GeneralHeadTitle();
            headInfo.setData({ countryId: this.m_data.playerInfo.countryId, name: this.m_data.playerInfo.nickName, factName: this.m_data.playerInfo.guildName, isSelf: false });
            headInfo.anchorOffsetX = headInfo.width / 2;
            headInfo.anchorOffsetY = headInfo.height / 2 + 40;
            headInfo.x = 64;
            headInfo.y = -18 - 35;
            square.addChild(headInfo);
        };
        RandomGeneralEffect.prototype.onDestroy = function () {
            this.visible = false;
            Tween.removeTweens(this);
            Tween.removeTweens(this.square);
            this.m_status = 2 /* FREE */;
        };
        RandomGeneralEffect.prototype.initData = function (data) {
            this.m_data = data;
            this.m_step = 1;
            this.routeConfig = C.GuajiRouteConfig[data.routeId];
            this.m_speed = this.routeConfig.speed;
        };
        RandomGeneralEffect.prototype.initByGid = function (data) {
            this.initData(data);
            this.visible = true;
            this.square.initId(data.gId);
            this.square.changeStatus(2);
            this.square.changeDirection(1);
            this.playNextStep();
            // this.alpha = 0;
            // this.square.alpha = 0;
            this.m_status = 1 /* BUSY */;
        };
        RandomGeneralEffect.prototype.isFree = function () {
            return this.m_status == 2 /* FREE */;
        };
        RandomGeneralEffect.prototype.playNextStep = function () {
            var code = this.routeConfig["step" + this.m_step];
            var arr = code.split(':');
            if (arr[0] == "start") {
                this.playStart(arr);
            }
            else if (arr[0] == "walk") {
                this.playWalk(arr);
            }
            else if (arr[0] == "stand") {
                this.playStand(arr);
            }
            else if (arr[0] == "end") {
                this.playEnd(arr);
            }
            this.m_step = this.m_step + 1;
            if (this.m_step == 4) {
                this.showTalk();
            }
        };
        RandomGeneralEffect.prototype.playStart = function (codeArr) {
            var point = JSON.parse(codeArr[1]);
            var x = point[0];
            var y = point[1];
            var time = Number(codeArr[2]);
            this.square.x = x;
            this.square.y = y;
            // Tween.get(this.square).to({alpha:1},3000);
            Tween.get(this.square).wait(time).call(this.playNextStep, this);
        };
        RandomGeneralEffect.prototype.playWalk = function (codeArr) {
            var point = JSON.parse(codeArr[1]);
            var x = point[0];
            var y = point[1];
            var time = Number(codeArr[2]);
            var cpos = new egret.Point(this.square.x, this.square.y);
            var tpos = new egret.Point(x, y);
            this.square.setDirectionOnPos(cpos, tpos);
            this.square.changeStatus(CSquare_Status.STATUS_WALK);
            time = MathUtils.getInstance().getPosDis(cpos, tpos) / this.m_speed * 1000;
            Tween.get(this.square).to({ x: x, y: y }, time).call(this.playNextStep, this);
        };
        RandomGeneralEffect.prototype.playStand = function (codeArr) {
            var time = Number(codeArr[2]);
            this.square.changeStatus(CSquare_Status.STATUS_STAND);
            Tween.get(this.square).wait(time).call(this.playNextStep, this);
        };
        RandomGeneralEffect.prototype.playEnd = function (codeArr) {
            // console.log("路线跑完。。。。。。。。结束");
            // EventMgr.dispatchEvent(EventEnum.RANDOM_GENERAL_END,this.m_data.id);
            this.onDestroy();
        };
        RandomGeneralEffect.prototype.showTalk = function () {
            var content = PatrolModel.getGeneralTalk();
            if (content) {
                var talkFrame_1 = new com_main.TalkFrame(content, 3000);
                // Utils.addChild(this.m_pOtherInfoNode, talkFrame);
                egret.callLater(function () {
                    if (talkFrame_1) {
                        var x = talkFrame_1.width / 2 + 15;
                        var y = -50 - talkFrame_1.height;
                        talkFrame_1.x = x;
                        talkFrame_1.y = y;
                    }
                }, this);
                // talkFrame.y = -150;
                Utils.addChild(this.square, talkFrame_1);
            }
        };
        return RandomGeneralEffect;
    }(eui.Component));
    com_main.RandomGeneralEffect = RandomGeneralEffect;
})(com_main || (com_main = {}));
