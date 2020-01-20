var com_main;
(function (com_main) {
    var TempNotice = /** @class */ (function () {
        function TempNotice() {
        }
        TempNotice.addNotice = function (msg) {
            this.array.push(msg);
            if (this.array.length == 1 && !this.isInit) {
                this.isInit = true;
                Utils.TimerManager.doFrame(2, 0, this.onEnterFrame, this);
            }
        };
        TempNotice.onEnterFrame = function () {
            if (TempNotice.array.length != 0) {
                if (!com_main.TempNoticeUi.GetInstance.getState()) {
                    com_main.TempNoticeUi.GetInstance.setData(TempNotice.array[0]);
                    TempNotice.array.shift();
                }
            }
            else {
                this.isInit = false;
                Utils.TimerManager.remove(this.onEnterFrame, this);
            }
        };
        TempNotice.array = [];
        TempNotice.isInit = false;
        return TempNotice;
    }());
    com_main.TempNotice = TempNotice;
})(com_main || (com_main = {}));
