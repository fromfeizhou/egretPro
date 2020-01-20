var AGame;
(function (AGame) {
    var Packet = /** @class */ (function () {
        function Packet() {
            this.buffer = new egret.ByteArray();
        }
        Packet.prototype.onReacive = function (dataByte) {
            dataByte.position = 3;
            this.protocol = dataByte.readShort();
            dataByte.readBytes(this.buffer, 0, dataByte.length - 5);
        };
        Packet.prototype.onWrite = function (protocol, sendData) {
            // var byteArray: egret.ByteArray = new egret.ByteArray(sendData.toArrayBuffer());
            var byteArray = new egret.ByteArray(sendData);
            this.buffer.writeByte(Packet.HEAD);
            this.buffer.writeShort(byteArray.length + 2);
            this.buffer.writeShort(protocol);
            this.buffer.writeBytes(byteArray);
        };
        Packet.prototype.onClear = function () {
            this.buffer.clear();
        };
        Packet.HEAD = 0x7c;
        return Packet;
    }());
    AGame.Packet = Packet;
})(AGame || (AGame = {}));
