interface IFActor {
	/**设置路径 */
	setPaht(path: egret.Point[]);
	/**设置方向角度 */
	setDirectionOnAngle(angle: number);
	/**改变状态 */
	changeStatus(status: CSquare_Status, index?: number): void;
}