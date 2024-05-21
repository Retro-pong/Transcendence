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

  static showLoading() {
    document.getElementById('loading').classList.remove('d-none');
  }

  static hideLoading() {
    document.getElementById('loading').classList.add('d-none');
  }

  static isAuth(url) {
    return !url.startsWith('/login') || url === '/login/logout/';
  }

  static async handleResponseWithRetry(request, response, url, body, retry) {
    if (!response.ok) {
      if (this.isAuth(url) && response.status === 401 && retry <= this.#retry) {
        await TokenManager.reissueAccessToken();
        return this[request](url, body, retry + 1);
      }
      return response.json().then((err) => {
        const requestType = request.toUpperCase();
        console.error(`${requestType}(${url}) ERROR:`, err);
        throw err;
      });
    }
    return response.json();
  }

  static async get(url, retry = 1) {
    this.showLoading();
    const response = await fetch(`${this.#BASE_URL}${url}`, {
      method: 'GET',
      headers: this.#headers,
      credentials: this.#credentials,
    });
    this.hideLoading();
    return this.handleResponseWithRetry('get', response, url, {}, retry);
  }

  static async post(url, body = {}, retry = 1) {
    this.showLoading();
    const response = await fetch(`${this.#BASE_URL}${url}`, {
      method: 'POST',
      headers: this.#headers,
      credentials: this.#credentials,
      body: JSON.stringify(body),
    });
    this.hideLoading();
    return this.handleResponseWithRetry('post', response, url, body, retry);
  }

  static async patch(url, body, formData, retry = 1) {
    this.showLoading();
    let response;
    if (formData) {
      response = await fetch(`${this.#BASE_URL}${url}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'multipart/form-data' },
        credentials: this.#credentials,
        body,
      });
    } else {
      response = await fetch(`${this.#BASE_URL}${url}`, {
        method: 'PATCH',
        headers: this.#headers,
        credentials: this.#credentials,
        body: JSON.stringify(body),
      });
    }
    return this.handleResponseWithRetry('patch', response, url, body, retry);
  }
}

export default Fetch;
