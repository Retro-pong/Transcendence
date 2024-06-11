import TokenManager from '@/utils/TokenManager';

class SocketManager {
  static #BASE_URL = 'ws://localhost/ws';

  static onlineSocket = null;

  static roomSocket = null;

  static gameSocket = null;

  static createSocket(url) {
    return new WebSocket(`${this.#BASE_URL}${url}`);
  }

  static setOffline() {
    if (!SocketManager.onlineSocket) {
      return;
    }
    SocketManager.onlineSocket.close();
    SocketManager.onlineSocket = null;
  }

  static setOnline() {
    if (
      !this.onlineSocket ||
      this.onlineSocket.readyState === WebSocket.CLOSED
    ) {
      this.onlineSocket = this.createSocket('/login/');
    }
    this.onlineSocket.onopen = () => {
      const message = {
        type: 'access',
        token: TokenManager.getAccessToken(),
      };
      this.onlineSocket.send(JSON.stringify(message));
      console.log('Online Socket Connected');
    };
    this.onlineSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
    };
    this.onlineSocket.onclose = (e) => {
      console.log('Online Socket Disconnected');
      console.log(e.code);
      this.onlineSocket = null;
    };
    this.onlineSocket.onerror = (error) => {
      console.error('Online Socket Error:', error);
    };
  }
}

export default SocketManager;
