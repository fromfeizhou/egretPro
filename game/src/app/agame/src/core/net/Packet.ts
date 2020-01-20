module AGame {
	export class Packet {
		private static HEAD = 0x7c;
		public protocol:number;
		public buffer: egret.ByteArray = new egret.ByteArray();
		
		public constructor() {
		}

		public onReacive(dataByte: egret.ByteArray):void
		{
			dataByte.position = 3;
            this.protocol = dataByte.readShort();
			dataByte.readBytes(this.buffer, 0, dataByte.length - 5);
		}

		public onWrite(protocol: number, sendData: any):void
		{
			// var byteArray: egret.ByteArray = new egret.ByteArray(sendData.toArrayBuffer());
			var byteArray: egret.ByteArray = new egret.ByteArray(sendData);
            
			this.buffer.writeByte(Packet.HEAD);
            this.buffer.writeShort(byteArray.length + 2);
            this.buffer.writeShort(protocol);
            this.buffer.writeBytes(byteArray);
		}

		public onClear():void
		{
			this.buffer.clear();
		}
	}
}