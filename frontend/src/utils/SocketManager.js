import TokenManager from '@/utils/TokenManager';

class SocketManager {
  static #BASE_URL = 'ws://localhost/ws';

  static onlineSocket = null;

  static roomSocket = null;

  static gameSocket = null;

  static getAccessMessage() {
    const message = {
      type: 'access',
      token: TokenManager.getAccessToken(),
    };
    return JSON.stringify(message);
  }

  static createSocket(url) {
    return new WebSocket(`${this.#BASE_URL}${url}`);
  }

  static closeRoomSocket() {
    if (this.roomSocket) {
      this.roomSocket.close();
      this.roomSocket = null;
    }
  }

  static closeGameSocket() {
    if (this.gameSocket) {
      this.gameSocket.close();
      this.gameSocket = null;
    }
  }

  static closeSockets() {
    this.closeRoomSocket();
    this.closeGameSocket();
  }

  static setOffline() {
    this.closeSockets();
    if (!this.onlineSocket) {
      return;
    }
    this.onlineSocket.close();
    this.onlineSocket = null;
  }

  static setOnline() {
    if (
      !this.onlineSocket ||
      this.onlineSocket.readyState === WebSocket.CLOSED
    ) {
      this.onlineSocket = this.createSocket('/login/');
    }
    this.onlineSocket.onopen = () => {
      this.onlineSocket.send(this.getAccessMessage());
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
