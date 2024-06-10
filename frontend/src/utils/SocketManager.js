class SocketManager {
  static #BASE_URL = 'ws://localhost/ws';

  static onlineSocket = null;

  static roomSocket = null;

  static gameSocket = null;

  static setOffline() {
    if (!SocketManager.onlineSocket) {
      return;
    }
    SocketManager.onlineSocket.close();
    SocketManager.onlineSocket = null;
  }

  static setOnline() {
    if (!this.onlineSocket) {
      this.onlineSocket = new WebSocket(`${this.#BASE_URL}/login/`);
    }
    this.onlineSocket.onopen = () => {
      console.log('Online Socket Connected');
    };
    this.onlineSocket.onclose = (e) => {
      console.log('Online Socket Disconnected');
      console.log(e.code);
      this.onlineSocket = null;
    };
    this.onlineSocket.onerror = (error) => {
      console.error('Online Socket Error:', error);
      this.onlineSocket = null;
    };
  }
}

export default SocketManager;
