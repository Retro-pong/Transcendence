class Fetch {
  static #BASE_URL = 'http://localhost:8080';

  static #headers = {
    'Content-Type': 'application/json',
  };

  static #credentials = 'omit';

  static setHeader(key, value) {
    this.#headers[key] = value;
  }

  static removeHeader(key) {
    delete this.#headers[key];
  }

  static setCredentials(credentials) {
    this.#credentials = credentials;
  }

  static async get(url) {
    const response = await fetch(url, {
      method: 'GET',
      headers: this.#headers,
      credentials: this.#credentials,
    });
    if (!response.ok) {
      throw response.status;
    }
    return response.json();
  }

  static async post(url, body) {
    const response = await fetch(`${this.#BASE_URL}${url}`, {
      method: 'POST',
      headers: this.#headers,
      credentials: this.#credentials,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw response.status;
    }
    return response.json();
  }
}

export default Fetch;
