/**
 * Created by leowang on 2016/12/20
 */
class MapObject {
    /**
     * 
     */
	private gid: number;
    /**
     * 高
     */
    private height: number;
    /**
     * 
     */
    private id: number;
    /**
     * 名称
     */
    private name: string;
    /**
     * 
     */
    private Defender: string;
    /**
     * 宽
     */
    private width: number;
    /**
     * x轴坐标
     */
    private x: number;
    /**
     * y轴坐标
     */
    private y: number;
    /**
     * 对象类型 ObjectType
     */
    private type: string;
    /**
     * 自定义属性
     */
    private properties: Properties;

	public static create(json: any) {
		let obj = new MapObject(json);
		return obj;
	}

	public constructor(json: any) {
		for (let key in json) {
			if (json.hasOwnProperty(key)) {
				let element = json[key];
				if (key == "properties") {
					this.setProperties(element);
				} else {
					this[key] = element;
				}
			}
		}
	}

	public getGid() {
		return this.gid;
	}
	public setGid(gid: number) {
		this.gid = gid;
	}
	public getHeight() {
		return this.height;
	}
	public setHeight(height: number) {
		this.height = height;
	}
	public getId() {
		return this.id;
	}
	public setId(id: number) {
		this.id = id;
	}
	public getName() {
		return this.name;
	}
	public setName(name: string) {
		this.name = name;
	}
	public getDefender() {
		return this.Defender;
	}
	public setDefender(defender: string) {
		this.Defender = defender;
	}
	public getWidth() {
		return this.width;
	}
	public setWidth(width: number) {
		this.width = width;
	}
	public getX() {
		return this.x;
	}
	public setX(x: number) {
		this.x = x;
	}
	public getY() {
		return this.y;
	}
	public setY(y: number) {
		this.y = y;
	}
	public getType() {
		return this.type;
	}
	public setType(type: string) {
		this.type = type;
	}
	public getProperties() {
		return this.properties;
	}
	public setProperties(json: Properties) {
		this.properties = Properties.create(json);
	}

	public tilePixelToPixel() {
		let point = ISOMap.getInstance().tilePixelToPixel(this.x, this.y);
		return egret.Point.create(point[0], point[1]);
	}
	public tilePixelToTile() {
		let cell = ISOMap.getInstance().tilePixelToTile(this.x, this.y);
		return egret.Point.create(cell[0], cell[1]);
	}

	public static getBuildHPPercents(mapobj: MapObject) {
		let properties: Properties = mapobj.getProperties();
		let hp_percent = properties.getHpPercent();
		let pers: number[] = [];
		if (hp_percent) {
			pers = Utils.ArrayUtils.charsToNums(hp_percent.split(","));
		}
		return pers;
	}

	public static getBuildHPPercent(mapobj: MapObject, perhp: number) {
		let pers = MapObject.getBuildHPPercents(mapobj);
		let val = 0;
		let ind = 0;
		for (let i: number = pers.length - 1; i >= 0; i--) {
			if (pers[i] < perhp) break;
			val = pers[i];
			ind = i;
		}
		return { index: ind, percentHp: val };
	}

	public static getBuildHPPercentStatus(mapobj: MapObject, ind: number) {
		let properties: Properties = mapobj.getProperties();
		let img_status = properties.getImgStatus();
		let imgs = img_status.split(",");
		return imgs[ind];
	}
}
