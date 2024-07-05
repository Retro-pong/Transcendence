import TokenManager from '@/utils/TokenManager';
import Router from '@/utils/Router';
import ToastHandler from '@/utils/ToastHandler';

class SocketManager {
  static #BASE_URL = import.meta.env.VITE_WS_BASE_URL;

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

  static popstateEvent(mode) {
    return async () => {
      const socket = mode === 'room' ? this.roomSocket : this.gameSocket;
      if (!socket || socket.readyState === WebSocket.CLOSING) {
        return;
      }
      ToastHandler.setToast('You left the game');
      socket.close();
    };
  }

  static handlePopstate(mode) {
    window.addEventListener('popstate', this.popstateEvent(mode), {
      once: true,
    });
  }

  static setRoomSocket() {
    const params = new URLSearchParams(document.location.search);
    const roomId = params.get('id');
    const roomMode = params.get('mode');
    if (
      isNaN(parseInt(roomId, 10)) ||
      (roomMode !== 'normal' && roomMode !== 'tournament')
    ) {
      ToastHandler.setToast('Invalid Access to the Room');
      Router.replaceState('/');
      return;
    }

    this.roomSocket = this.createSocket(`/${roomMode}_room/${roomId}/`);
    this.handlePopstate('room');

    this.roomSocket.onopen = () => {
      if (!this.roomSocket) return;
      this.roomSocket.send(this.getAccessMessage());
    };

    this.roomSocket.onclose = async (e) => {
      if (e.code !== 1000) {
        await Router.navigateTo('/game');
      }
      this.roomSocket = null;
    };

    this.roomSocket.onerror = () => {
      ToastHandler.setToast('Cannot join the room');
    };
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
    };
    this.onlineSocket.onclose = () => {
      this.onlineSocket = null;
    };
  }
}

export default SocketManager;
