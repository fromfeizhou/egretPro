class WorldData {

    private static m_mCityHeroPos = {
        2: [[75, 12, 50], [219, 12, 200]], 
        3: [[99, 12, 50], [195, 12, 200], [147, -96, 200]], 
        4: [[147, 12, 200], [50, 12, 50], [99, -96, 200], [195, -96, 250]],
        5: [[147, 12, 200], [50, 12, 50], [244, 12, 250], [99, -96, 200], [195, -96, 250]]
    }

    public static getCityHeroPos(ty: number) {
        return this.m_mCityHeroPos[ty]
    }
}

class WorldCoverData {


    private static m_mSRangePoint: {[k: number]: string []} = null;
    private static m_mRangePoint: {[k: number]: number[][]} = null;

    public static async init() {
        if (this.m_mRangePoint) return;
        this.m_mRangePoint = {}
        this.m_mSRangePoint = {}
        for (let i in C.WorldMapConfig) {
            let conf = C.WorldMapConfig[i];
            try {
                let points: number[][] = JSON.parse(conf.VisibleXY);
                this.m_mRangePoint[conf.id] = points;
                this.m_mSRangePoint[conf.id] = points.map((e)=>{return e.toString();})
            } catch (e) {
                error("=====WorldCoverData:init===", e, i, conf.VisibleXY);
            }
        }
        return true;
    }

    private static ArrayRemove(arr, n) {
        let indx = arr.indexOf(n);
        if (indx === -1) return arr;
        arr.splice(indx, 1);
    }


    public static getRange(city: number[]) {
        if (!this.m_mSRangePoint)
            this.init();

        let ncity = [...city];

        let fn = (points, spoints) => {
            let rm_c = [], c, sc;
            if (!points) {
                c = ncity[0]
                sc = this.m_mSRangePoint[c]
                this.ArrayRemove(ncity, c);
            }


            for (let i = 0; i < ncity.length; i++) {
                let c1 = ncity[i], sc1 = this.m_mSRangePoint[c1]
                if (spoints && this.checkRepeatArray([].concat(spoints, sc1), 2)) {
                    points = this.concatRange(points, c1)[0];
                    spoints = points.map((e) => { return e.toString(); })
                    rm_c.push(c1)
                } else if (c && this.checkRepeatArray([].concat(sc, sc1), 2)) {
                    points = this.concatRange(c, c1)[0];
                    spoints = points.map((e) => { return e.toString(); })
                    rm_c.push(c1)
                }
            }
            if (rm_c.length > 0) {
                for (let i of rm_c) {
                    this.ArrayRemove(ncity, i);
                }
                return [points, spoints, ncity.length > 0];
            } else if (points) {
                return [points, spoints, false];
            }
            return [this.m_mRangePoint[c], sc, false]
        }

        let points, spoints, ret, allpoints=[];
        do{
            [points, spoints,  ret] = fn(points, spoints);
            if (!ret) {
                allpoints.push(points);
                points = null;
                spoints = null;
            }
                
            while(ret) {
                [points, spoints, ret] = fn(points, spoints)
                if (!ret) {
                    allpoints.push(points);
                    points = null;
                    spoints = null;
                }
            }

        } while (ncity.length > 0)
        
        return allpoints;

       
    }

    private static checkRepeatArray(arr: any[], n: number=1) {
        let tmp = [], ret=false;
        arr.forEach(item => {
            if (arr.indexOf(item) !== arr.lastIndexOf(item) && tmp.indexOf(item) === -1) {
                tmp.push(item)
                if (tmp.length == n) {
                    ret = true;
                    return true;
                }
            }
                
        })
        
        return ret;
    }

    private static getRepeatArray(arr) {
        let tmp = [];
        arr.forEach(function (item) {
            (arr.indexOf(item) !== arr.lastIndexOf(item) && tmp.indexOf(item) === -1) && tmp.push(item)
        })
        return tmp;
    }


    private static compare(x, y) {
        if (x < y) {
            return -1;
        } else if (x > y) {
            return 1;
        } else {
            return 0;
        }
    }

    private static checkSamePoint(arr: number[]) {
        let i = 0, indx = -1;
        while (i++ < arr.length) {
            if (arr[i - 1] + 1 != arr[i]) {
                indx = i;
                break;
            }
        }
        let na = arr;
        if (indx >= 0) {
            na = arr.splice(indx, arr.length - indx);
            na = na.concat(...arr);
        }
        let n = na.splice(1, na.length - 2)
        return [n, na.sort(this.compare)];
    }

    public static concatRange(na: number | number[][], nb: number|number[][]): number[][][] {

        let sa: string[], a: number[][] ;       
        let sb: string[], b: number[][] ;       
        if (typeof na == "number") {
            let a1 = <number>na;
            a = [].concat(this.m_mRangePoint[a1]);
            sa = [].concat(this.m_mSRangePoint[a1])
        } else {
            a = (<number[][]>na);
            sa = a.map((e) => { return e.toString(); })
        }
        if (typeof nb == "number") {
            let b1 = <number>nb;
            b = [].concat(this.m_mRangePoint[b1]);
            sb = [].concat(this.m_mSRangePoint[b1])
        } else {
            b = (<number[][]>nb);
            sb = b.map((e) => { return e.toString(); })
        }

        let t2 = this.getRepeatArray([].concat(sa, sb))
        
        if (t2.length >= 2) {
            let arr_indx = [], temp = {}
            for (let t of t2) {
                let indx = sa.indexOf(t);
                arr_indx.push(indx)
                temp[indx] = t;
            }
            arr_indx.sort(this.compare);
            let [del_arr, n_arr] = this.checkSamePoint(arr_indx);
            for (let de of del_arr) {
                let o = temp[de];
                let indx1 = sa.indexOf(o), indx2 = sb.indexOf(o)
                sa.splice(indx1, 1)
                a.splice(indx1, 1)
                sb.splice(indx2, 1)
                b.splice(indx2, 1)
            }

            let o1 = temp[n_arr[0]], o2 = temp[n_arr[1]]
                , i1 = sa.indexOf(o1), i2 = sa.indexOf(o2)
                , i3 = sb.indexOf(o1), i4 = sb.indexOf(o2)
                , l1 = [], l2 = [], l3 = [], l4 = [], l5 = [], l6 = []

            if ((i1 == 0 && i2 == sa.length - 1) || (i1 == sa.length - 1 && i2 == 0)  )
                l1 = [].concat(a)
            else {
                if (i2 > i1)
                    l1 = [].concat(a.slice(i2, a.length), a.slice(0, i1 + 1))
                else
                    l1 = [].concat(a.slice(i1, a.length), a.slice(0, i2 + 1))
            }
                

            if ((i3 == 0 && i4 == sb.length - 1) || (i3 == sb.length - 1 && i4 == 0))
                l2 = [].concat(b)
            else {
                if (i4 > i3)
                    l2 = [].concat(b.slice(i4, b.length), b.slice(0, i3 + 1))
                else
                    l2 = [].concat(b.slice(i3, b.length), b.slice(0, i4 + 1))
            }
                
            l1.pop()
            l2.pop()
            let all = [].concat(l1,l2)
            return [all];
        }
        return [a, b];
    }

    private static ArrayToString(arr): string {
        return arr.map((e) => { return e.toString(); })
    }




}

class WorldTmxData {

    private static m_mRange: {[k: number]: number[]} = null;

    public static getPointByGid(gid) {
        let x = Math.floor(gid / 188)
        let y = gid % 188
        return [x*32, y*32];
    }

    // public static getPosByPoint(point) {
    //     const [x, y] = point;
    //     return [x*32, y*32];
    // }

    public static getGidByPoint(px: number, py: number) {
        const x = Math.floor(px / 32) 
            , y = Math.floor(py / 32)
    
        return x * 188 + y;
    }

    public static async init() {
        if (this.m_mRange) return;
        let data = RES.getRes("world_json")
        if (!data) return;
        this.m_mRange = {}
        for (let o of data) {
            this.m_mRange[o['name']] = o['gid']
        }

        // const layers = data["layers"]
        // for (let i in layers) {
        //     let o  = layers[i]
        //     if (o['type'] != "objectgroup") 
        //         continue
        //     let point = []
        //         , id = o['name']
        //     if (o['objects']) {
        //         for (let p of o['objects']) {
        //             if (!p) continue;
        //             // let pos = [];
        //             // pos.push(p.x);
        //             // pos.push(p.y);
        //             let gid = this.getGidByPoint(p.x, p.y);
        //             // const[x, y] = this.getPointByGid(gid);
        //             // debug([x, y, p.x, p.y, gid]);
        //             point.push(gid);
        //         }
        //     }
        //     this.m_mRange[id] = point;
        // }
    }

    public static getRange(id): number[] {
        let l = this.m_mRange[id]
        return l || [];
    }


}