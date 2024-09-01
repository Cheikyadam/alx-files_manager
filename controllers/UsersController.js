import dbClient from '../utils/db';

export default class UsersController {
  static async postNew(request, response) {
    const { email } = request.body;
    const { password } = request.body;

    if (email === undefined) {
      response.json({ error: 'Missing email' }).statusCode(400);
    }
    if (password === undefined) {
      response.json({ error: 'Missing password' }).statusCode(400);
    }

    const findResult = await dbClient.isRegistered(email);
    if (findResult === undefined) {
      const infos = await dbClient.addUser(email, password);
      response.json({ id: infos.insertedId, email });
    } else {
      response.json({ error: 'Already exist' }).statusCode(400);
    }
  }
}
