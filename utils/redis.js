import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isConnected = true;
    this.client.on('error',
      (err) => {
        console.log(`Error: ${err.message}`);
        this.isConnected = false;
      });
    this.client.on('connect', () => { this.isConnected = true; });
  }

  isAlive() {
    return this.isConnected;
  }

  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (err) => {
        if (err) {
          reject(new Error(`Error: ${err}`));
        } else {
          resolve(true);
        }
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

const redisClient = new RedisClient();
export default redisClient;
