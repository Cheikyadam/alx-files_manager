import { MongoClient } from 'mongodb';
import sha1 from 'sha1';
import envLoader from './env_loader';

class DBClient {
  constructor() {
    envLoader();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const db = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${db}`;
    this.client = new MongoClient(url, { useUnifiedTopology: true });

    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  async isRegistered(email) {
    return this.client.db().collection('users').findOne({ email });
  }

  async addUser(email, password) {
    try {
      const result = await this.client.db().collection('users').insertOne(
        {
          email,
          password: sha1(password),
        },
      );
      return result;
    } catch (err) {
      throw new Error('Failed to add user');
    }
  }

  async filesCollection() {
    return this.client.db().collection('files');
  }

  async usersCollection() {
    return this.client.db().collection('users');
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
