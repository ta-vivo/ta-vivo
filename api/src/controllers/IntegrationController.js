import IntegrationService from '../services/IntegrationService';
import Response from '../utils/response';

class IntegrationsController {

  static async create(req, res) {
    const newIntegration = req.body;
    try {
      const entityCreated = await IntegrationService.create({newIntegration, user: req.user});
      return res.json(Response.get('Integration created', entityCreated));
    } catch (error) {
      console.log('🚀 ~ file: IntegrationsController.js ~ line 12 ~ IntegrationsController ~ create ~ error', error);
      res.status(500).json({
        message: 'Something goes wrong',
        data: error
      });
    }
  }
}

export default IntegrationsController;