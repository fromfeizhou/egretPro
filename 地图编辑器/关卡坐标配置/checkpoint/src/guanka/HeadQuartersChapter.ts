
class HeadQuartersChapter extends eui.Component {

    public m_pItemRoot:eui.Group;
    public m_BackGround:eui.Image;
    public Item0:HeadQuartersItem;
    public Item1:HeadQuartersItem;
    public Item2:HeadQuartersItem;
    public Item3:HeadQuartersItem;
    public Item4:HeadQuartersItem;
    public Item5:HeadQuartersItem;
    public Item6:HeadQuartersItem;
    public Item7:HeadQuartersItem;
    public Item8:HeadQuartersItem;
    public Item9:HeadQuartersItem;
    public Item10:HeadQuartersItem;
    public Item11:HeadQuartersItem;
    public m_ArrowRoot:eui.Group;
    public m_Arrow:eui.Image;

    public index = 0;
    public static alreadyLoadNum = 0;
    public constructor(path:string,index) {
        super();
        this.skinName = path;
        this.index = index;
    }
    
    protected childrenCreated(): void {
        super.childrenCreated();
        
        for(let i = 0; i < 12; i++){
            Main.pointList[this.index].push( Math.round( this["Item" + i].x )+ "#" + Math.round( this["Item" + i].y) );
        }

        
        HeadQuartersChapter.alreadyLoadNum += 1;

        if(HeadQuartersChapter.alreadyLoadNum < Main.chapterNum){
            return ;
        }

        let str = "";
        for(let i = 1; i<= Main.chapterNum; i++){
            for(let k of Main.pointList[i]){
                str = str + k + "\n";
            }
        }

        console.log(str);
    }

    
}
