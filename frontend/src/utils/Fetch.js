import TokenManager from '@/utils/TokenManager';

class Fetch {
  static #BASE_URL = 'http://localhost/api/v1';
  // static #BASE_URL = 'http://localhost:8080';

  static #headers = new Headers({ 'Content-Type': 'application/json' });

  static #credentials = 'same-origin';

  static #retry = 1;

  static init() {
    const accessToken = TokenManager.getAccessToken();
    if (accessToken) {
      this.#headers.set('Authorization', `Bearer ${accessToken}`);
    } else {
      this.#headers.delete('Authorization');
    }
  }

  static get headers() {
    return this.#headers;
  }

  static isAuth(url) {
    return !url.startsWith('/login') || url === '/login/logout/';
  }

  static async get(url, retry = 1) {
    document.getElementById('loading').classList.remove('d-none');
    const response = await fetch(`${this.#BASE_URL}${url}`, {
      method: 'GET',
      headers: this.#headers,
      credentials: this.#credentials,
    });
    document.getElementById('loading').classList.add('d-none');
    if (!response.ok) {
      if (this.isAuth(url) && response.status === 401 && retry <= this.#retry) {
        await TokenManager.reissueAccessToken();
        return this.get(url, retry + 1);
      }
      return response.json().then((err) => {
        console.error(`GET(${url}) ERROR:`, err);
        throw err;
      });
    }
    return response.json();
  }

  static async post(url, body = {}, retry = 1) {
    document.getElementById('loading').classList.remove('d-none');
    const response = await fetch(`${this.#BASE_URL}${url}`, {
      method: 'POST',
      headers: this.#headers,
      credentials: this.#credentials,
      body: JSON.stringify(body),
    });
    document.getElementById('loading').classList.add('d-none');
    if (!response.ok) {
      if (this.isAuth(url) && response.status === 401 && retry <= this.#retry) {
        await TokenManager.reissueAccessToken();
        return this.post(url, body, retry + 1);
      }
      return response.json().then((err) => {
        console.error(`POST(${url}) ERROR:`, err);
        throw err;
      });
    }
    return response.json();
  }
}

export default Fetch;
