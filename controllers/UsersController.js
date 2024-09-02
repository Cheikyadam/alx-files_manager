import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class UsersController {
  static async postNew(request, response) {
    const { email } = request.body;
    const { password } = request.body;

    if (email === undefined || email === null) {
      response.status(400);
      response.json({ error: 'Missing email' });
    }
    if (password === undefined || password === null) {
      response.status(400);
      response.json({ error: 'Missing password' }).status(201);
    }
    try {
      const findResult = await dbClient.isRegistered(email);

      if (findResult === null || findResult === undefined) {
        const infos = await dbClient.addUser(email, password);
        response.json({ id: infos.insertedId, email });
      } else {
        response.status(400);
        response.json({ error: 'Already exist' });
      }
    } catch (err) {
      response.status(400);
      response.json({ error: 'Something went wrong' });
    }
  }

  static async getMe(req, res) {
    try {
      const token = req.headers['x-token'];
      const id = await redisClient.get(`auth_${token}`);
      if (id === null || id === undefined) {
        res.status(401).json({ error: 'Unauthorized' });
      } else {
        const user = await (await dbClient.client.db().collection('users').findOne({ _id: new ObjectId(id) }));//  isRegistered(id);
        res.json({ id, email: user.email }).status(204);
      }
    } catch (err) {
      console.log(`error: ${err.message}`);
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}
