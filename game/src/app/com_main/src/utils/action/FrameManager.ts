/**
 * Created by yaowan on 2016/12/6.
 */
class FrameManager {
    private static m_pFramesMap = {};
    private static m_pFramesCount = {};//引用计数器

    public static getFrame(type,key){
        if (this.m_pFramesMap[type] && this.m_pFramesMap[type].frames[key]){
            return this.m_pFramesMap[type].frames[key];
        }
        return null;
    }

    public static addType(type){
        if(this.m_pFramesCount[type]){
            this.m_pFramesCount[type] = this.m_pFramesCount[type] + 1;
        }else{
            this.m_pFramesCount[type] = 1;
        }
    }

    public static numFrames(type){
        var nums = 0;
        if(this.m_pFramesMap[type]){
            nums = Utils.objectLenght(this.m_pFramesMap[type].frames);
        }
        return nums;
    }

    public static setFrames(type,textures,isOver){
        if (!this.m_pFramesMap[type]){
            var info:any = {}
            info.frames = {};
            info.isOver = false;
            this.m_pFramesMap[type] = info;
        }
        for(var name in textures) {
            this.m_pFramesMap[type].frames[name] = textures[name];
        }
        this.m_pFramesMap[type].isOver = isOver;
    }

    public static isCheck(type){
        if (!this.m_pFramesMap[type]) return false;
        return this.m_pFramesMap[type].isOver;
    }

    public static removeFrames(type){
        
        let count = this.m_pFramesCount[type] - 1;
        this.m_pFramesCount[type] = count;

        if(count == 0){
            delete this.m_pFramesCount[type];
            delete this.m_pFramesMap[type];
        }
    }

}