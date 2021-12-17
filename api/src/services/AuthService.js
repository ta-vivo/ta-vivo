import { User, UserCredential } from '../models/';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class AuthService {

  static async login(credentials) {
    try {
      const user = await User.findOne({
        where: {
          username: credentials.username,
        },
      });

      if (!user) {
        throw ({status: 400, message: 'Invalid username or password'});
      }

      const userCredentials = await UserCredential.findOne({
        where: {
          userId: user.id,
        },
      });

      if (user && (await bcrypt.compare(credentials.password, userCredentials.password))) {

        const token = jwt.sign(
          { userId: user.id, username: credentials.username },
          process.env.TOKEN_KEY,
          {
            expiresIn: '2h',
          }
        );

        return { token: token };
      }
      throw ({ status: 400, messages: 'Invalid credentials' });
    } catch (error) {
      throw error;
    }
  }
}

export default AuthService;