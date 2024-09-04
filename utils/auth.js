import { ObjectId } from 'mongodb';
import redisClient from './redis';
import dbClient from './db';

export default async function getUserFromXToken(req) {
  try {
    const token = req.headers['x-token'];
    const id = await redisClient.get(`auth_${token}`);
    if (id === null || id === undefined) {
      return null;
    }
    const user = await (await dbClient.client.db().collection('users').findOne({ _id: new ObjectId(id) }));//  isRegistered(id);
    return user;
  } catch (err) {
    console.log(err.message);
    return null;
  }
}
