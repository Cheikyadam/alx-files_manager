import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AuthController {
  static async getConnect(req, res) {
    try {
      const authHeaders = req.headers.authorization;
      const credEncoded = authHeaders.slice(6, authHeaders.length);
      const cred = Buffer.from(credEncoded, 'base64').toString('utf-8');
      const credArray = cred.split(':');
      const email = credArray[0];
      let password = '';
      for (let i = 1; i < credArray.length; i += 1) {
        password += credArray[i];
      }
      const findResult = await dbClient.isRegistered(email);
      if (findResult === null || findResult === undefined) {
        res.status(401).json({ error: 'Unauthorized' });
      } else if (findResult.password !== sha1(password)) {
        res.status(401).json({ error: 'Unauthorized' });
      } else {
        const token = uuidv4();
        await redisClient.set(`auth_${token}`, findResult._id, 24 * 60 * 60);
        res.json({ token });
      }
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  static async getDisconnect(req, res) {
    try {
      const token = req.headers['x-token'];
      const id = await redisClient.get(`auth_${token}`);
      if (id === null || id === undefined) {
        res.status(401).json({ error: 'Unauthorized' });
      } else {
        await redisClient.del(`auth_${token}`);
        res.status(204).send();
      }
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}
