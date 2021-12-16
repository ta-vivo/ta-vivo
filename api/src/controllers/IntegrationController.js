import IntegrationService from '../services/IntegrationService';
import Response from '../utils/response';
import querystringConverterHelper from '../utils/querystringConverterHelper';


class IntegrationsController {

  static async create(req, res) {
    const newIntegration = req.body;
    try {
      const entityCreated = await IntegrationService.create({ newIntegration, user: req.user });
      return res.json(Response.get('Integration created', entityCreated));
    } catch (error) {
      console.log('🚀 ~ file: IntegrationsController.js ~ line 12 ~ IntegrationsController ~ create ~ error', error);
      res.status(500).json({
        message: 'Something goes wrong',
        data: error
      });
    }
  }

  static async getAll(req, res) {
    try {
      const { query } = req;

      let { where, limit, offset, order } = querystringConverterHelper.parseQuery(query);
      if (where) {
        where = { ...where, userId: req.user.userId };
      } else {
        where = { userId: req.user.userId };
      }

      const { rows, count, total } = await IntegrationService.getAll({
        user: req.user,
        criterions: {
          where,
          limit,
          offset,
          order,
        }
      });

      return res.json(Response.get('Integrations list', rows, 200, { count, total, offset }));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }

  static async delete(req, res) {
    try {
      await IntegrationService.delete({ id: req.params.id, user: req.user });
      return res.json(Response.get('Integration deleted', {}));
    } catch (error) {
      return res.json(Response.get('Something goes wrong', error, 500));
    }
  }
}

export default IntegrationsController;