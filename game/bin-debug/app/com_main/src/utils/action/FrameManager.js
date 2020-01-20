/**
 * Created by yaowan on 2016/12/6.
 */
var FrameManager = /** @class */ (function () {
    function FrameManager() {
    }
    FrameManager.getFrame = function (type, key) {
        if (this.m_pFramesMap[type] && this.m_pFramesMap[type].frames[key]) {
            return this.m_pFramesMap[type].frames[key];
        }
        return null;
    };
    FrameManager.addType = function (type) {
        if (this.m_pFramesCount[type]) {
            this.m_pFramesCount[type] = this.m_pFramesCount[type] + 1;
        }
        else {
            this.m_pFramesCount[type] = 1;
        }
    };
    FrameManager.numFrames = function (type) {
        var nums = 0;
        if (this.m_pFramesMap[type]) {
            nums = Utils.objectLenght(this.m_pFramesMap[type].frames);
        }
        return nums;
    };
    FrameManager.setFrames = function (type, textures, isOver) {
        if (!this.m_pFramesMap[type]) {
            var info = {};
            info.frames = {};
            info.isOver = false;
            this.m_pFramesMap[type] = info;
        }
        for (var name in textures) {
            this.m_pFramesMap[type].frames[name] = textures[name];
        }
        this.m_pFramesMap[type].isOver = isOver;
    };
    FrameManager.isCheck = function (type) {
        if (!this.m_pFramesMap[type])
            return false;
        return this.m_pFramesMap[type].isOver;
    };
    FrameManager.removeFrames = function (type) {
        var count = this.m_pFramesCount[type] - 1;
        this.m_pFramesCount[type] = count;
        if (count == 0) {
            delete this.m_pFramesCount[type];
            delete this.m_pFramesMap[type];
        }
    };
    FrameManager.m_pFramesMap = {};
    FrameManager.m_pFramesCount = {}; //引用计数器
    return FrameManager;
}());
