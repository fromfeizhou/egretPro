var SoundData = /** @class */ (function () {
    function SoundData() {
    }
    SoundData.getSoundConfig = function (id) {
        return C.SoundConfig[id];
    };
    /**有后缀的名字 */
    SoundData.getSoundName = function (id) {
        var sound = this.getSoundConfig(id);
        var filename = sound ? sound.name : "";
        filename = StringUtils.replaceSuffix(filename);
        return filename;
    };
    /**没后缀的名字 */
    SoundData.getSoundName2 = function (id) {
        var sound = this.getSoundConfig(id);
        var filename = sound ? sound.name : "";
        var datas = filename.split(".");
        return datas[0];
    };
    /**登录背景音乐 */
    SoundData.getLoginSound = function () {
        var sound = this.getSoundName(1);
        return sound != "" ? sound : "denglujiemian_mp3";
    };
    /**挂机音乐 */
    SoundData.getAutoBattleSound = function () {
        return this.getSoundName(7);
    };
    /**主城音乐 */
    SoundData.getMainSound = function () {
        return this.getSoundName(2);
    };
    /**世界地图音乐 */
    SoundData.getWorldSound = function () {
        return this.getSoundName(3);
    };
    /**战场音乐 */
    SoundData.getBattleSound = function () {
        var data = MapData.getBattleMapConfig(BattleModel.getMapId());
        if (data)
            return this.getSoundName(data.sound);
        return "";
    };
    /**点击音乐 */
    SoundData.getTapSound = function () {
        var sound = this.getSoundName(100);
        return sound != "" ? sound : "dianji_mp3";
    };
    /**确认音乐 */
    SoundData.getSureSound = function () {
        var sound = this.getSoundName(235);
        return sound != "" ? sound : "queren_mp3";
    };
    /**取消音乐 */
    SoundData.getCancelSound = function () {
        var sound = this.getSoundName(101);
        return sound != "" ? sound : "quxiao_mp3";
    };
    /**战斗开始 */
    SoundData.getFightStart = function () {
        var sound = this.getSoundName(234);
        return sound != "" ? sound : "zhandoukaisi_mp3";
    };
    // this.button_exit["sound_cancel"] = SoundData.getCancelSound();
    // this.button_exit["sound_queren"] = SoundData.getSureSound();
    /**特殊点击音效 */
    SoundData.getSpecilVoices = function () {
        return ["sound_cancel", "sound_queren", "sound_dianchou", "sound_shengxin",
            "sound_shichou", "sound_zhandoukaisi",];
    };
    /**判断是否设置特殊音效 */
    SoundData.bSpecilVoice = function (object) {
        var voices = SoundData.getSpecilVoices();
        for (var i in voices) {
            if (unNull(object[voices[i]])) {
                return object[voices[i]];
            }
        }
        return null;
    };
    /**设置按键声音 */
    SoundData.setSound = function (obj, type) {
        if (!obj)
            return;
        switch (type) {
            case SoundData.SOUND_CANCEL:
                obj[SoundData.SOUND_CANCEL] = SoundData.getCancelSound();
                break;
        }
    };
    SoundData.SOUND_CANCEL = "sound_cancel";
    return SoundData;
}());
