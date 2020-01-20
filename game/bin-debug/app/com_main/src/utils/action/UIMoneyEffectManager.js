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
    var UIMoneyEffectAnim = /** @class */ (function (_super_1) {
        __extends(UIMoneyEffectAnim, _super_1);
        function UIMoneyEffectAnim() {
            var _this = _super_1.call(this) || this;
            _this.callback = null;
            _this.m_frameTime = 0;
            _this.ROTATION_SPEED = 360;
            return _this;
        }
        UIMoneyEffectAnim.prototype.Update = function () {
            this.GetParam();
            this.isLife = true;
            this.m_total_time = this.m_time * 1.5;
        };
        UIMoneyEffectAnim.prototype.Range = function (min, max) {
            return min + Math.random() * (max - min);
        };
        UIMoneyEffectAnim.prototype.GetParam = function () {
            this.m_a_x = 1600;
            if (this.end_pos.x < this.start_pos.x)
                this.m_a_x = -this.m_a_x;
            this.m_a_y = 1600;
            if (this.end_pos.y < this.start_pos.y)
                this.m_a_y = -this.m_a_y;
            this.m_v_x = 900 * this.Range(3, 7) / 10;
            if (Math.random() > 0.5)
                this.m_v_x = -this.m_v_x;
            this.m_v_y = 900 * this.Range(3, 7) / 10;
            if (Math.random() > 0.5)
                this.m_v_y = -this.m_v_y;
            var time1 = 0;
            var time2 = 0;
            if (Math.abs(this.end_pos.y - this.start_pos.y) > Math.abs(this.end_pos.x - this.start_pos.x)) {
                time1 = (-this.m_v_y + Math.sqrt(Math.pow(this.m_v_y, 2) +
                    2 * this.m_a_y * (this.end_pos.y - this.start_pos.y))) / this.m_a_y;
                time2 = (-this.m_v_y - Math.sqrt(Math.pow(this.m_v_y, 2) +
                    2 * this.m_a_y * (this.end_pos.y - this.start_pos.y))) / this.m_a_y;
                if (time1 > 0 && time2 > 0) {
                    this.m_time = time1 < time2 ? time1 : time2;
                }
                else {
                    this.m_time = time1 > time2 ? time1 : time2;
                }
                this.m_a_x = 2 * (this.end_pos.x - this.start_pos.x - this.m_v_x * this.m_time) / this.m_time / this.m_time;
            }
            else {
                time1 = (-this.m_v_x + Math.sqrt(Math.pow(this.m_v_x, 2) +
                    2 * this.m_a_x * (this.end_pos.x - this.start_pos.x))) / this.m_a_x;
                time2 = (-this.m_v_x - Math.sqrt(Math.pow(this.m_v_x, 2) +
                    2 * this.m_a_x * (this.end_pos.x - this.start_pos.x))) / this.m_a_x;
                if (time1 > 0 && time2 > 0) {
                    this.m_time = time1 < time2 ? time1 : time2;
                }
                else {
                    this.m_time = time1 > time2 ? time1 : time2;
                }
                this.m_a_y = 2 * (this.end_pos.y - this.start_pos.y - this.m_v_y * this.m_time) / this.m_time / this.m_time;
            }
        };
        UIMoneyEffectAnim.prototype.onEnterFrame = function (delta) {
            if (!this.isLife)
                return;
            this.m_frameTime += delta;
            var pass_time = this.m_frameTime;
            if (pass_time > this.m_total_time) {
                this.isLife = false;
                this.handle_trans.x = this.end_pos.x;
                this.handle_trans.y = this.end_pos.y;
                this.handle_trans.skewY = 0;
                if (this.callback != null) {
                    this.callback(this.handle_trans);
                    this.callback = null;
                }
                return;
            }
            var act_pass_Time = pass_time < this.m_time ? pass_time / 2 * pass_time / this.m_time : pass_time - this.m_time / 2;
            var pos_x = this.m_v_x * act_pass_Time + this.m_a_x * act_pass_Time * act_pass_Time / 2;
            var pos_y = this.m_v_y * act_pass_Time + this.m_a_y * act_pass_Time * act_pass_Time / 2;
            this.handle_trans.x = this.start_pos.x + pos_x;
            this.handle_trans.y = this.start_pos.y + pos_y;
            this.handle_trans.skewY = this.ROTATION_SPEED * pass_time;
            //            debug("onEnterFrame:",pass_time,pos_x,pos_y,this.handle_trans.x,this.handle_trans.y,this.start_pos.x,this.start_pos.y);
            //            this.isLife = false;
        };
        return UIMoneyEffectAnim;
    }(com_main.Animate));
    com_main.UIMoneyEffectAnim = UIMoneyEffectAnim;
    var UIMoneyEffectManager = /** @class */ (function (_super_1) {
        __extends(UIMoneyEffectManager, _super_1);
        function UIMoneyEffectManager() {
            return _super_1.call(this) || this;
        }
        UIMoneyEffectManager.DoAnim = function (handle_text, start_pos, end_pos, handle_func) {
            var attr = {
                target: handle_text,
                handle_func: handle_func
            };
            this.create(handle_text, UIMoneyEffectAnim, attr);
            var action = com_main.UIAnimUtil.m_qActions[handle_text.hashCode];
            action.handle_trans = handle_text;
            action.start_pos = start_pos;
            action.end_pos = end_pos;
            action.callback = UIMoneyEffectManager.Update;
            action.Update();
        };
        UIMoneyEffectManager.Update = function (target) {
            var hashCode = target.hashCode;
            var action = UIMoneyEffectManager.m_qActions[hashCode];
            var attr = UIMoneyEffectManager.m_qAttrs[hashCode];
            if (!action.isLife && attr.handle_func) {
                attr.handle_func(attr.target);
            }
            if (!action.isLife) {
                UIMoneyEffectManager.removeAction(target);
            }
        };
        return UIMoneyEffectManager;
    }(com_main.ActionManager));
    com_main.UIMoneyEffectManager = UIMoneyEffectManager;
})(com_main || (com_main = {}));
