/**
 * Created by egret on 15-8-7.
 */
class ArrayUtils extends BaseClass {
    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    public forEach(arr: Array<any>, func: Function, funcObj: any): void {
        for (let i: number = 0, len: number = arr.length; i < len; i++) {
            func.apply(funcObj, [arr[i]]);
        }
    }

    public dicToArray(dic: any[]) {
        let datas: any[] = [];
        for (let i: number = 0; i < dic.length; i++) {
            if (dic[i]) {
                datas.push(dic[i]);
            }
        }
        return datas;
    }

    public charsToNums(maps: string[]) {
        let nums: number[] = [];
        maps.forEach((value: string, index: number, array: string[]) => {
            nums[index] = Number(value);
        });
        return nums;
    }

    /**
     * 把array转换成map
     * key : 键值
     */
    public arrayToMap(arr: any, key: string) {
        if (!arr || arr.length == 0) {
            return arr;
        }
        let news = [];
        for (let i in arr) {
            let item = arr[i];
            news[item[key]] = item;
        }
        return news;
    }

    public equals(datas: any[], searchElement: any) {
        return datas.indexOf(searchElement, 0) != -1;
    }
}