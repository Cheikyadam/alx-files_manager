import { MongoClient } from 'mongodb';
import sha1 from 'sha1';

class DBClient {
  constructor() {
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
    return this.client.db().collection('users').insertOne(
      {
        email,
        password: sha1(password),
      },
    );
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
