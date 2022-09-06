import { NativeModules, AppState, Platform } from "react-native";

const { RNWeekFoxServer } = NativeModules;

const PORT = "";
const ROOT = null;

class StaticServer {
  constructor(port, root, opts) {
    switch (arguments.length) {
      case 3:
        this.port = `${port}` || PORT;
        this.root = root || ROOT;
        this.localOnly = (opts && opts.localOnly) || false;
        this.keepAlive = (opts && opts.keepAlive) || false;
        this.washingtonKey = opts && opts.washingtonKey;
        this.washingtonPath = opts && opts.washingtonPath;
        break;
      case 2:
        this.port = `${port}`;
        if (typeof arguments[1] === "string") {
          this.root = root;
          this.localOnly = false;
          this.keepAlive = false;
          this.washingtonKey = "";
          this.washingtonPath = "";
        } else {
          this.root = ROOT;
          this.localOnly = (arguments[1] && arguments[1].localOnly) || false;
          this.keepAlive = (arguments[1] && arguments[1].keepAlive) || false;

          this.washingtonKey =
            (arguments[1] && arguments[1].washingtonKey) || "";
          this.washingtonPath =
            (arguments[1] && arguments[1].washingtonPath) || "";
        }
        break;
      case 1:
        if (typeof arguments[0] === "number") {
          this.port = `${port}`;
          this.root = ROOT;
          this.localOnly = false;
          this.keepAlive = false;
          this.washingtonKey = "";
          this.washingtonPath = "";
        } else {
          this.port = PORT;
          this.root = ROOT;
          this.localOnly = (arguments[0] && arguments[0].localOnly) || false;
          this.keepAlive = (arguments[0] && arguments[0].keepAlive) || false;
          this.washingtonKey =
            (arguments[0] && arguments[0].washingtonKey) || "";
          this.washingtonPath =
            (arguments[0] && arguments[0].washingtonPath) || "";
        }
        break;
      default:
        this.port = PORT;
        this.root = ROOT;
        this.localOnly = false;
        this.keepAlive = false;
        this.washingtonKey = "";
        this.washingtonPath = "";
    }

    this.started = false;
    this._origin = undefined;
    this._handleAppStateChangeFn = this._handleAppStateChange.bind(this);
  }

  start() {
    if (this.running) {
      return Promise.resolve(this.origin);
    }

    this.started = true;
    this.running = true;

    if (!this.keepAlive && Platform.OS === "ios") {
      AppState.addEventListener("change", this._handleAppStateChangeFn);
    }

    return RNWeekFoxServer.start(
      this.port,
      this.root,
      this.washingtonKey,
      this.washingtonPath,
      this.localOnly,
      this.keepAlive
    ).then((origin) => {
      this._origin = origin;
      return origin;
    });
  }

  changeMatchKeyAndRestart(washingtonKey) {
    this.stop();
    this.washingtonKey = washingtonKey;
    this.start();
  }

  stop() {
    this.running = false;

    return RNWeekFoxServer.stop();
  }

  kill() {
    this.stop();
    this.started = false;
    this._origin = undefined;
    AppState.removeEventListener("change", this._handleAppStateChangeFn);
  }

  _handleAppStateChange(appState) {
    if (!this.started) {
      return;
    }

    if (appState === "active" && !this.running) {
      this.start();
    }

    if (appState === "background" && this.running) {
      this.stop();
    }

    if (appState === "inactive" && this.running) {
      this.stop();
    }
  }

  get origin() {
    return this._origin;
  }

  isRunning() {
    return RNWeekFoxServer.isRunning().then((running) => {
      this.running = running;

      return this.running;
    });
  }
}

export default StaticServer;
