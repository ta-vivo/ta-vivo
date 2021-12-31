import DashboardService from '../services/DashboardService';
import Response from '../utils/response';

class DashboardController {

  static async get(req, res) {
    const user = req.user;
    try {
      const stats = await DashboardService.get(user);
      return res.json(Response.get('success', stats));
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'Something goes wrong',
        data: error
      });
    }
  }
}

export default DashboardController;