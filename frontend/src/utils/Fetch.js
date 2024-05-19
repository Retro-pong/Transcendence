import TokenManager from '@/utils/TokenManager';

class Fetch {
  static #BASE_URL = 'http://localhost:80/api/v1';
  // static #BASE_URL = 'http://localhost:8080';

  static #headers = new Headers({ 'Content-Type': 'application/json' });

  static #credentials = 'same-origin';

  static init() {
    const accessToken = TokenManager.getAccessToken();
    if (accessToken) {
      this.#headers.set('Authorization', `Bearer ${accessToken}`);
      this.#credentials = 'include';
    } else {
      this.#headers.delete('Authorization');
      this.#credentials = 'same-origin';
    }
  }

  static getHeaders() {
    return this.#headers;
  }

  static async get(url) {
    const response = await fetch(`${this.#BASE_URL}${url}/`, {
      method: 'GET',
      headers: this.#headers,
      credentials: this.#credentials,
    });
    if (!response.ok) {
      return response.json().then((err) => {
        throw err;
      });
    }
    return response.json();
  }

  static async post(url, body) {
    const response = await fetch(`${this.#BASE_URL}${url}/`, {
      method: 'POST',
      headers: this.#headers,
      credentials: this.#credentials,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      return response.json().then((err) => {
        throw err;
      });
    }
    return response.json();
  }
}

export default Fetch;
