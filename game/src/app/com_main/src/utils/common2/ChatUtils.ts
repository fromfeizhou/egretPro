module com_main {
	export class ChatUtils {
		public static fontSpaceSize = FontSpaceSize.MOBILE;

		public constructor() {
		}

		/**按照一定规则格式化表情字符 */
		public static ConvertFaceStr(handle_str: string): string {
			if (!handle_str) return '';
			var sub_str: string;
			var firstIdx: number = 0; //文本段开始位置
			var length: number = handle_str.length;
			var result_table: any[] = [];

			while (firstIdx < length) {
				var starIdx: number = handle_str.indexOf("#", firstIdx);
				if (starIdx < 0) {
					result_table.push(handle_str.substring(firstIdx));
					firstIdx = length;
				} else {
					sub_str = handle_str.substring(firstIdx, starIdx);
					if (sub_str.length) result_table.push(sub_str);

					sub_str = handle_str.substring(starIdx + 1, starIdx + 3);
					var face_id: number = Number(sub_str);


					//todo
					if (sub_str.length && face_id && face_id > 0 && face_id < 13) {
						result_table.push(StringUtils.stringFormat("[img]FChat_%s_png[/img]", sub_str));
					} else {
						result_table.push("#" + sub_str);
					}
					firstIdx = starIdx + 3;
				}
			}

			return result_table.join("");
		}

		public static HandleItemClick(handle_str: string): void {

			var param_list = NetArgDecoder.DecodeString(handle_str, NetArgSplitFlag.ArgConcatFlag);
			var type = Number(param_list[0]);

			switch (type) {
				case MsgRule.EVT_INVITE: {
					let legionId = Number(param_list[1]);
					if (legionId && legionId > 0) {
						if (FunctionModel.isFunctionOpenWithWarn(FunctionType.GUILD)) {
							if (LegionModel.getGuildId() > 0) {
								EffectUtils.showTips(GCode(CLEnum.GUILD_ENTER_ALR));
							} else {
								Utils.showConfirmPop(GCodeFromat(CLEnum.GUILD_JION_YN,param_list[2]),()=>{
									LegionProxy.send_APPLY_JOIN_GUILD(legionId);
								},this);
							}
						}
					}
					break;
				}

			}
		}
	}
}