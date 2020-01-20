/**
* 双向map
*/
class BothWayMap extends egret.HashObject implements IFObject {
    private m_map: Object;    //key-value
    private m_keyMap: Object; //value-key

    public static create(body?: any) {
		let obj = new BothWayMap(body);
		return obj;
	}

	public constructor(body?: any) {
		super()
		this.init(body);
	}

    public init(body?) {
        this.m_map = {};
        this.m_keyMap = {};
        if (body) {
			for (var key in body) {
				this.add(key, body[key])
			}
		}
    }

    public clear() {
        this.m_keyMap = null;
		this.m_keyMap = null;
	
    }

    public onDestroy(): void {
        this.clear()
    }

    /**
	 * 添加指定类型的数据
	 * @param key 可以是字符、数字
	 * @param value 可以是字符、数字
	 */
    public add(key: number | string, value: number | string): void {
        this.m_map[key] = value;
        this.m_keyMap[value] = key;
    }

    /**根据key 获得值 */
    public getVal(key: number) {
         return this.m_map[key];
    }
    /**根据值 获得value */
    public getKey(value: number) {
        return this.m_keyMap[value];
    }

}