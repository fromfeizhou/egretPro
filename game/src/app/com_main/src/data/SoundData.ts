class SoundData {

	public static SOUND_CANCEL = "sound_cancel";

	public static getSoundConfig(id: number) {
		return C.SoundConfig[id];
	}

	/**有后缀的名字 */
	public static getSoundName(id: number) {
		let sound = this.getSoundConfig(id);
		let filename = sound ? sound.name : "";
		filename = StringUtils.replaceSuffix(filename);
		return filename;
	}

	/**没后缀的名字 */
	public static getSoundName2(id: number) {
		let sound = this.getSoundConfig(id);
		let filename = sound ? sound.name : "";
		let datas = filename.split(".");
		return datas[0];
	}

	/**登录背景音乐 */
	public static getLoginSound() {
		let sound = this.getSoundName(1);
		return sound != "" ? sound : "denglujiemian_mp3";
	}

	/**挂机音乐 */
	public static getAutoBattleSound() {
		return this.getSoundName(7);
	}

	/**主城音乐 */
	public static getMainSound() {
		return this.getSoundName(2);
	}

	/**世界地图音乐 */
	public static getWorldSound() {
		return this.getSoundName(3);
	}

	/**战场音乐 */
	public static getBattleSound() {
		let data = MapData.getBattleMapConfig(BattleModel.getMapId());
		if (data) return this.getSoundName(data.sound);
		return "";
	}

	/**点击音乐 */
	public static getTapSound() {
		let sound = this.getSoundName(100);
		return sound != "" ? sound : "dianji_mp3";
	}
	/**确认音乐 */
	public static getSureSound() {
		let sound = this.getSoundName(235);
		return sound != "" ? sound : "queren_mp3";
	}
	/**取消音乐 */
	public static getCancelSound() {
		let sound = this.getSoundName(101);
		return sound != "" ? sound : "quxiao_mp3";
	}
	/**战斗开始 */
	public static getFightStart() {
		let sound = this.getSoundName(234);
		return sound != "" ? sound : "zhandoukaisi_mp3";
	}
	// this.button_exit["sound_cancel"] = SoundData.getCancelSound();
	// this.button_exit["sound_queren"] = SoundData.getSureSound();
	/**特殊点击音效 */
	public static getSpecilVoices(){
		return ["sound_cancel","sound_queren","sound_dianchou","sound_shengxin",
		"sound_shichou","sound_zhandoukaisi",];
	}
	/**判断是否设置特殊音效 */
	public static bSpecilVoice( object: egret.DisplayObject){
		let voices = SoundData.getSpecilVoices();
		for(let i in voices){
			if(unNull(object[voices[i]])){
				return object[voices[i]];
			}
		}
		return null;
		
	}

	/**设置按键声音 */
	public static setSound(obj: egret.DisplayObject, type: string) {
		if (!obj) return;
		switch (type) {
			case SoundData.SOUND_CANCEL:
				obj[SoundData.SOUND_CANCEL] = SoundData.getCancelSound();
				break;
		}
	}

}