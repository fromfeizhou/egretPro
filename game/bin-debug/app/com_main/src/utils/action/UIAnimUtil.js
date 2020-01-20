var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var com_main;
(function (com_main) {
    /**
     *
     * @author
     *
     */
    var UIAnimUtil = /** @class */ (function (_super_1) {
        __extends(UIAnimUtil, _super_1);
        function UIAnimUtil() {
            return _super_1.call(this) || this;
        }
        UIAnimUtil.DoMoneyValue = function (handle_text, start_value, to_value, duration, handle_func) {
            var attr = {
                target: handle_text,
                start_value: start_value,
                to_value: to_value,
                handle_func: handle_func
            };
            var isNew = this.create(handle_text, com_main.NumberRollAction, attr);
            var hashCode = handle_text.hashCode;
            var action = UIAnimUtil.m_qActions[hashCode];
            if (!isNew) {
                UIAnimUtil.m_qActions[hashCode].isLife = false;
                UIAnimUtil.moneyRoll(0, handle_text);
            }
            action.roll(to_value - start_value, duration, UIAnimUtil.moneyRoll, handle_text);
        };
        UIAnimUtil.moneyRoll = function (money, target) {
            var hashCode = target.hashCode;
            var action = UIAnimUtil.m_qActions[hashCode];
            var attr = UIAnimUtil.m_qAttrs[hashCode];
            if (action.isLife) {
                target['text'] = attr.handle_func ? attr.handle_func(attr.start_value + money) : attr.start_value + money;
            }
            else {
                target['text'] = attr.handle_func ? attr.handle_func(attr.to_value) : attr.to_value;
            }
        };
        UIAnimUtil.removeAction = function (handle) {
            var hashCode = handle.hashCode;
            this.moneyRoll(0, UIAnimUtil.m_qAttrs[hashCode].target);
            com_main.ActionManager.removeAction(handle);
        };
        return UIAnimUtil;
    }(com_main.ActionManager));
    com_main.UIAnimUtil = UIAnimUtil;
})(com_main || (com_main = {}));
