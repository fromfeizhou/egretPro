/**
 * 对象的自定义属性
 * @author leowang
 *
 */
class Properties {

	/**
	 * true 表示这是一个NPC出生点，false表示它是玩家出生点。
	 */
	private _isNpcPoint: boolean;

	/**
	 * 排序序号
	 */
	private order: number;

	/**
	 * 所属出生点
	 */
	private attachPoint: number;
	/**城墙血量百分比 */
	private hp_percent: string;
	/**城墙血量状态 */
	private img_status: string;

	private Source: string;
	private SourceType: string;

	public static create(json: any) {
		let obj = new Properties(json);
		return obj;
	}

	public constructor(json: any) {
		for (let key in json) {
			if (json.hasOwnProperty(key)) {
				let element = json[key];
				this[key] = element;
			}
		}
	}

	public isNpcPoint() {
		return this.isNpcPoint;
	}

	public setNpcPoint(isNpcPoint: boolean) {
		this._isNpcPoint = isNpcPoint;
	}

	public getOrder() {
		return this.order;
	}

	public setOrder(order: number) {
		this.order = order;
	}

	public getAttachPoint() {
		return this.attachPoint;
	}


	public setAttachPoint(attachPoint: number) {
		this.attachPoint = attachPoint;
	}

	public getHpPercent() {
		return this.hp_percent;
	}

	public setHpPercent(v: string) {
		this.hp_percent = v;
	}

	public getImgStatus() {
		return this.img_status;
	}

	public setImgStatus(v: string) {
		this.img_status = v;
	}

	public getSource() {
		return this.Source;
	}

	public setSource(v: string) {
		this.Source = v;
	}

	public getSourceType() {
		return this.SourceType;
	}

	public setSourceType(v: string) {
		this.SourceType = v;
	}
}
