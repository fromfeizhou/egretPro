var AGame;
(function (AGame) {
    /**
     * @author
     */
    var CSocket = /** @class */ (function () {
        function CSocket() {
            this.m_pIp = "192.168.0.100";
            this.m_pPort = 21211;
            this.m_bIsConnected = false;
            this.m_bIsInConnected = false; //连接中
            this.m_pSocket = new egret.WebSocket();
            this.m_pSocket.type = egret.WebSocket.TYPE_BINARY;
            this.m_pSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceive, this);
            this.m_pSocket.addEventListener(egret.Event.CONNECT, this.onConnected, this);
            this.m_pSocket.addEventListener(egret.Event.CLOSE, this.onClose, this);
            this.m_pSocket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
        }
        // private static trafficStatistic: number = 0;
        CSocket.getInstance = function () {
            if (!CSocket._instance) {
                CSocket._instance = new CSocket();
            }
            return CSocket._instance;
        };
        CSocket.prototype.onReceive = function () {
            var byteArray = new egret.ByteArray();
            this.m_pSocket.readBytes(byteArray);
            // CSocket.trafficStatistic += byteArray.length;
            // console.log('流量 ',CSocket.trafficStatistic/1024/1024,'m');
            var packet = new AGame.Packet();
            packet.onReacive(byteArray);
            // /**协议过滤(配置表没初始化 可以执行的系统协议) */
            if (!ConfigBuilder.getInstance().isInit) {
                switch (packet.protocol) {
                    case ProtoDef.S2C_SYS_HEARTBEAT:
                    case ProtoDef.ERROR_CODE:
                    case ProtoDef.S2C_PLAYER_CREATE_NOTICE:
                    case ProtoDef.S2C_PLAYER_LOGIN_ACT:
                    case ProtoDef.S2C_PLAYER_LOGIN_DATA: {
                        break;
                    }
                    default: {
                        return;
                    }
                }
            }
            //战斗录像 正式版本注释
            // if (packet.protocol == ProtoDef.S2C_WAR_BATTLE_INIT ||
            //     packet.protocol == ProtoDef.S2C_WAR_COMBAT_UNIT ||
            //     packet.protocol == ProtoDef.S2C_WAR_DEATH ||
            //     packet.protocol == ProtoDef.S2C_WAR_FOLLOW_UP ||
            //     packet.protocol == ProtoDef.S2C_WAR_MOVE_SYNC ||
            //     packet.protocol == ProtoDef.S2C_WAR_SYNC_MOVE_SPEED ||
            //     packet.protocol == ProtoDef.S2C_WAR_BUFF_ADD ||
            //     packet.protocol == ProtoDef.S2C_WAR_BUFF_UN ||
            //     packet.protocol == ProtoDef.S2C_WAR_BUFF_OFFSET ||
            //     packet.protocol == ProtoDef.S2C_WAR_BUFF_BLOOD ||
            //     packet.protocol == ProtoDef.S2C_WAR_ELEMENT_BLOOD ||
            //     packet.protocol == ProtoDef.S2C_WAR_BUFF_BLOOD_THUNDER_HALBERD ||
            //     packet.protocol == ProtoDef.S2C_WAR_GUIDE) {
            //     //    console.log(byteArray);
            //     let str = Utils.Uint8ArrayToString(packet.buffer.bytes);
            //     if (packet.protocol == ProtoDef.S2C_WAR_BATTLE_INIT) {
            //         // console.log(str);
            //     }
            //     BattleVideoUtil.AddProtocolData(packet.protocol, str);
            // }
            var data = AGame.ServiceBuilder.decode(packet.protocol, packet.buffer.bytes);
            AGame.ServiceBuilder.notifyProtoHandler(packet.protocol, data);
            packet.onClear();
            //console.log("收到协议号：",protoDefMap[packet.protocol],Number(packet.protocol));
        };
        CSocket.prototype.onConnected = function () {
            this.clearTimer();
            egret.log("CSocket:onConnected------>>sock 连接成功！！");
            this.m_bIsConnected = true;
            this.m_bIsInConnected = false;
            CSocket.LOST_NET_TIME = null;
            CSocket.CONNECTED_TIME = 0;
            AGame.ServiceBuilder.notifyProtoHandler(CSocket.CONNECTED_LOGIN);
            AGame.R.notifyView("LOADING_HIDE");
        };
        CSocket.prototype.close = function () {
            error("主动关闭socket");
            if (!this.m_bIsConnected && !this.m_bIsInConnected)
                return;
            this.onClose();
        };
        CSocket.prototype.onClose = function () {
            error("socket 断开连接");
            this.m_bIsInConnected = false;
            this.m_bIsConnected = false;
            this.m_pSocket.close();
            this.clearTimer();
            this.onClear();
            AGame.R.notifyView("LOADING_HIDE");
            if (!CSocket.LOST_NET_TIME)
                CSocket.LOST_NET_TIME = new Date().getTime();
            LoginProxy.stopHearBeat();
            AGame.ServiceBuilder.notifyProtoHandler(CSocket.CONNECTED_CLOSE);
        };
        /**清理连接计时器 */
        CSocket.prototype.clearTimer = function () {
            if (this.m_nTimeId) {
                egret.clearTimeout(this.m_nTimeId);
                this.m_nTimeId = null;
            }
        };
        CSocket.prototype.onClear = function () {
            if (!this.m_pSocket)
                return;
            this.m_pSocket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceive, this);
            this.m_pSocket.removeEventListener(egret.Event.CONNECT, this.onConnected, this);
            this.m_pSocket.removeEventListener(egret.Event.CLOSE, this.onClose, this);
            this.m_pSocket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
            this.m_pSocket = null;
            CSocket._instance = null;
        };
        CSocket.prototype.onError = function () {
            // alert("网络请求失败请叫" + GameConfig.getServerData().name + "开服!!! IP:" + this.m_pIp + " PORT:" + this.m_pPort);
            this.onClose();
            AGame.R.notifyView("LOADING_HIDE");
        };
        CSocket.prototype.setConnectInfo = function (ip, port) {
            this.m_pIp = ip;
            this.m_pPort = port;
        };
        CSocket.prototype.connect = function (isConst) {
            var _this = this;
            if (GameConfig.isBackRun)
                return;
            if (this.m_bIsInConnected || this.m_bIsConnected)
                return;
            var isReLoad = isConst;
            if (!isReLoad)
                CSocket.CONNECTED_TIME >= 5;
            if (!isReLoad)
                isReLoad = CSocket.LOST_NET_TIME && (new Date().getTime() - CSocket.LOST_NET_TIME) > 5 * 60 * 1000;
            //断开时间过长 5分钟
            if (!isConst && CSocket.LOST_NET_TIME && (new Date().getTime() - CSocket.LOST_NET_TIME) > 5 * 60 * 1000) {
                if (window.location && window.location.reload) {
                    window.location.reload(true);
                }
                SceneManager.enterScene(SceneEnums.NONE_MAP);
                return;
            }
            console.log("CSocket:connect------>>sock 正在连接！！", this.m_pIp, this.m_pPort, this.m_bIsInConnected, this.m_bIsConnected);
            AGame.R.notifyView("LOADING_SHOW");
            //链接次数增加
            AGame.CSocket.CONNECTED_TIME++;
            if (RegUtils.isIP(this.m_pIp)) {
                this.m_pSocket.connect(this.m_pIp, this.m_pPort);
            }
            else {
                this.m_pSocket.connectByUrl(this.m_pIp);
            }
            this.m_bIsInConnected = true;
            this.clearTimer();
            this.m_nTimeId = egret.setTimeout(function () {
                error('connect time out');
                _this.onError();
            }, this, 5000);
        };
        CSocket.prototype.sendProtocol = function (protocol, sendData, showLoad) {
            if (showLoad === void 0) { showLoad = false; }
            //console.log("发送协议：",protoDefMap[protocol],Number(protocol));
            if (!this.m_bIsConnected) {
                LoseProxy.addBuff(protocol, sendData);
                if (!this.m_bIsInConnected)
                    AGame.ServiceBuilder.notifyProtoHandler(CSocket.CONNECTED_CLOSE);
                return;
            }
            if (showLoad) {
                AGame.R.notifyView("LOADING_SHOW");
            }
            var packet = new AGame.Packet();
            packet.onWrite(protocol, sendData);
            this.sendBytes(packet.buffer);
            packet.onClear();
        };
        CSocket.prototype.sendBytes = function (bytes) {
            // CSocket.trafficStatistic += bytes.length;
            // console.log('流量 ',CSocket.trafficStatistic/1024/1024,'m')
            this.m_pSocket.writeBytes(bytes);
            this.m_pSocket.flush();
        };
        //是否已经连接成功
        CSocket.prototype.isConnected = function () {
            return this.m_bIsConnected;
        };
        CSocket.prototype.isOffConnected = function () {
            if (this.m_bIsConnected || this.m_bIsInConnected)
                return false;
            return true;
        };
        //开始发送心跳包
        CSocket.prototype.startHeartbeat = function () {
            // this.onTimer();
            // this.m_pHeartbeatTimer.start();
        };
        CSocket.prototype.stopHeartbeat = function () {
            // this.m_pHeartbeatTimer.stop();
        };
        CSocket.CONNECTED_LOGIN = 500001; //连接成功
        CSocket.CONNECTED_CLOSE = 500002; //连接关闭
        CSocket.TIMER = 30;
        return CSocket;
    }());
    AGame.CSocket = CSocket;
})(AGame || (AGame = {}));
