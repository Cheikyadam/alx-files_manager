import dbClient from '../utils/db';
import getUserFromXToken from '../utils/auth';

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
    const user = await getUserFromXToken(req);
    if (user === null) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      res.json({ id: user._id, email: user.email }).status(204);
    }
  }
}
