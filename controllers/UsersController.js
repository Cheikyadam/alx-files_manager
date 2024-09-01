import dbClient from '../utils/db';

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
      response.json({ error: 'Missing password' });
    }
    try {
      const findResult = await dbClient.isRegistered(email);

      if (findResult === null) {
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
}
