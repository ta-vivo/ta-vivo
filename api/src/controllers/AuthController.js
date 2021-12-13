import AuthService from '../services/AuthService';
import Response from '../utils/response';

class AuthController {

  static async login(req, res) {
    const credentials = req.body;
    try {
      const entityCreated = await AuthService.login(credentials);
      return res.json(Response.get('success', entityCreated));
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Something goes wrong',
        data: error
      });
    }
  }
}

export default AuthController;