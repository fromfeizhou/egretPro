/**
 * Created by leowang on 2016/12/20
 */
class Layer {
	/**
	 * 地图高（格子）
	 */
	private height: number;
	/**
	 * 地图宽（格子）
	 */
	private width: number;
	/**
	 * 名称
	 */
	private name: string;
	/**
	 * 类型
	 */
	private type: string;

	private image: string;

	/**
	 * 地图格子信息
	 */
	private data: number[];

	/**
	 * 地图格子信息（二维数组）
	 */
	private cells: number[][];

	/**
	 * 对象信息
	 */
	private objects: MapObject[] = [];

	/**
	 * 按对象类型划分对象列表 ConcurrentHashMap<String, List<MapObject>>
	 */
	private typeObject = Dictionary.create();

	public static create(json: any) {
		let obj = new Layer(json);
		return obj;
	}

	public constructor(json: any) {
		for (let key in json) {
			if (json.hasOwnProperty(key)) {
				let element = json[key];
				if (key == "objects") {
					this.setObjects(element);
				} else {
					this[key] = element;
				}
			}
		}
	}

	public getData() {
		return this.data;
	}

	public setData(data: number[]) {
		this.data = data;
	}

	public getHeight() {
		return this.height;
	}

	public setHeight(height: number) {
		this.height = height;
	}

	public getWidth() {
		return this.width;
	}

	public setWidth(width: number) {
		this.width = width;
	}

	public getName() {
		return this.name;
	}

	public setName(name: string) {
		this.name = name;
	}

	public getType() {
		return this.type;
	}

	public setType(type: string) {
		this.type = type;
	}
	public getImage() {
		return this.image;
	}

	public setImage(image: string) {
		this.image = image;
	}

	public getCells() {
		return this.cells;
	}

	public setCells(cells: number[][]) {
		this.cells = cells;
	}

	public getObjects() {
		return this.objects;
	}

	public setObjects(jsons: any[]) {
		jsons.forEach((value: any, index: number, array: any[]) => {
			this.objects.push(MapObject.create(value));
		});
		this.changeObject(this.objects);
	}

	public getTypeObject() {
		return this.typeObject;
	}

	public setTypeObject(typeObject: Dictionary) {
		this.typeObject = typeObject;
	}

	public getTypeObjects(objectType: string) {
		return this.typeObject.get(objectType);
	}

	/**
	 * 将列表另存为键值对
	 * @param listObject
	 */
	private changeObject(listObject: MapObject[]) {
		if (listObject == null || listObject.length <= 0) {
			return;
		}
		listObject.forEach((value: MapObject, index: number, array: MapObject[]) => {
			let type = value.getType();
			if (!this.typeObject.has(type)) {
				let list: MapObject[] = [];
				this.typeObject.add(type, list);
			}
			let list: MapObject[] = this.typeObject.get(type)
			list.push(value);
		})

		// function compare(arg0: MapObject, arg1: MapObject) {
		// 	let order0: number = arg0.getProperties().getOrder();
		// 	let order1: number = arg1.getProperties().getOrder();
		// 	if (order0 > order1) {
		// 		return 1;
		// 	} else if (order0 == order1) {
		// 		return 0;
		// 	} else {
		// 		return -1;
		// 	}
		// }

		// this.typeObject.forEach((key: any, data: any) => {
		// 	data.sort(compare);
		// });
	}
}
